from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from collections import defaultdict

from ..database import get_db
from ..models.course import Course
from ..models.user import User
from ..schemas.course import CourseCreate, CourseUpdate, CourseOut, GPASummary, GRADE_POINTS
from ..services.auth import get_current_user

router = APIRouter(prefix="/api/gpa", tags=["gpa"])


def _compute_grade_point(grade: str | None) -> float | None:
    if grade is None:
        return None
    return GRADE_POINTS.get(grade.strip())


@router.get("/summary", response_model=GPASummary)
def get_gpa_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    courses = (
        db.query(Course)
        .filter(Course.user_id == current_user.id, Course.grade_point.isnot(None))
        .all()
    )

    total_credits = sum(c.credits for c in courses)
    gpa = None
    if total_credits > 0:
        gpa = round(sum(c.grade_point * c.credits for c in courses) / total_credits, 2)

    # Per-semester GPA
    semester_data: dict[str, list[tuple[float, float]]] = defaultdict(list)
    for c in courses:
        semester_data[c.semester].append((c.grade_point, c.credits))

    semester_gpas: dict[str, float] = {}
    for semester, entries in semester_data.items():
        sem_credits = sum(cr for _, cr in entries)
        if sem_credits > 0:
            semester_gpas[semester] = round(
                sum(gp * cr for gp, cr in entries) / sem_credits, 2
            )

    return GPASummary(
        gpa=gpa,
        credits=total_credits,
        courses=len(courses),
        semester_gpas=semester_gpas,
    )


@router.get("/", response_model=list[CourseOut])
def list_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Course)
        .filter(Course.user_id == current_user.id)
        .order_by(Course.semester.desc(), Course.code)
        .all()
    )


@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    body: CourseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    grade_point = _compute_grade_point(body.grade)
    course = Course(
        user_id=current_user.id,
        code=body.code,
        name=body.name,
        semester=body.semester,
        grade=body.grade,
        grade_point=grade_point,
        credits=body.credits,
        notes=body.notes,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: str,
    body: CourseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.user_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    updates = body.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(course, field, value)

    if "grade" in updates:
        course.grade_point = _compute_grade_point(updates["grade"])

    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.user_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    db.delete(course)
    db.commit()
