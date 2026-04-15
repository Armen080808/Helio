from datetime import datetime
from pydantic import BaseModel, ConfigDict, model_validator

GRADE_POINTS: dict[str, float] = {
    "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0,
}


class CourseCreate(BaseModel):
    code: str
    name: str
    semester: str
    grade: str | None = None
    credits: float = 0.5
    notes: str | None = None

    @model_validator(mode="after")
    def compute_grade_point(self) -> "CourseCreate":
        # grade_point is not part of create — computed at write time in controller
        return self


class CourseUpdate(BaseModel):
    grade: str | None = None
    notes: str | None = None
    credits: float | None = None


class CourseOut(BaseModel):
    id: str
    code: str
    name: str
    semester: str
    grade: str | None
    grade_point: float | None
    credits: float
    notes: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class GPASummary(BaseModel):
    gpa: float | None
    credits: float
    courses: int
    semester_gpas: dict[str, float]
