import httpx
from ..config import settings


def send_verification_email(to_email: str, name: str, token: str) -> bool:
    """Send verification email via Resend. Returns True on success, False on failure."""
    if not settings.resend_api_key:
        # No API key — print to logs for local dev/testing
        verify_url = f"{settings.frontend_url}/verify-email?token={token}"
        print(f"\n[EMAIL SKIPPED — no RESEND_API_KEY]\nTo: {to_email}\nVerify URL: {verify_url}\n")
        return True

    verify_url = f"{settings.frontend_url}/verify-email?token={token}"

    payload = {
        "from": "Helio <onboarding@resend.dev>",
        "to": [to_email],
        "subject": "Verify your Helio account",
        "html": f"""
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
            <h2 style="color:#4f46e5">Welcome to Helio, {name}!</h2>
            <p style="color:#52525b">Click the button below to verify your email address and activate your account.</p>
            <a href="{verify_url}"
               style="display:inline-block;margin:24px 0;padding:12px 28px;background:#4f46e5;
                      color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
                Verify Email
            </a>
            <p style="color:#a1a1aa;font-size:13px">
                Or copy this link: <a href="{verify_url}" style="color:#4f46e5">{verify_url}</a>
            </p>
            <p style="color:#a1a1aa;font-size:12px;margin-top:32px">
                This link expires in 24 hours. If you didn't sign up, ignore this email.
            </p>
        </div>
        """,
    }

    try:
        r = httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json=payload,
            timeout=10,
        )
        return r.status_code == 200
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False
