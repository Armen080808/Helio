import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserOut
from ..services.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    hash_password,
    verify_password,
)
from ..services.email import send_verification_email
from ..config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

REFRESH_COOKIE_NAME = "refresh_token"
COOKIE_MAX_AGE = settings.refresh_token_expire_days * 24 * 60 * 60  # seconds


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # set to True in production with HTTPS
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
        path="/",
    )


def _build_token_response(user: User) -> dict:
    payload = {"sub": str(user.id)}
    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user_out": UserOut(id=str(user.id), name=user.name, email=user.email),
    }


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    verification_token = str(uuid.uuid4())

    user = User(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
        email_verified=False,
        verification_token=verification_token,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Send verification email (non-blocking — failure doesn't break registration)
    send_verification_email(body.email, body.name, verification_token)

    tokens = _build_token_response(user)
    _set_refresh_cookie(response, tokens["refresh_token"])

    return TokenResponse(
        access_token=tokens["access_token"],
        token_type="bearer",
        user=tokens["user_out"],
    )


@router.get("/verify-email", tags=["auth"])
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )
    if user.email_verified:
        return {"message": "Email already verified"}

    user.email_verified = True
    user.verification_token = None  # invalidate token after use
    db.commit()

    return {"message": "Email verified successfully! You can now use all features."}


@router.post("/resend-verification", tags=["auth"])
def resend_verification(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified",
        )

    token = str(uuid.uuid4())
    current_user.verification_token = token
    db.commit()

    send_verification_email(current_user.email, current_user.name or "", token)
    return {"message": "Verification email sent"}


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    tokens = _build_token_response(user)
    _set_refresh_cookie(response, tokens["refresh_token"])

    return TokenResponse(
        access_token=tokens["access_token"],
        token_type="bearer",
        user=tokens["user_out"],
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    payload = decode_token(token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    tokens = _build_token_response(user)
    _set_refresh_cookie(response, tokens["refresh_token"])

    return TokenResponse(
        access_token=tokens["access_token"],
        token_type="bearer",
        user=tokens["user_out"],
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/")


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        email_verified=current_user.email_verified,
    )
