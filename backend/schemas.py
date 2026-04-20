from pydantic import BaseModel
from typing import List, Optional


# ──────────────────────────────────────────────
# FILE schemas
# ──────────────────────────────────────────────

class FileBase(BaseModel):
    name: str
    size: Optional[str] = None
    link: str

class FileCreate(FileBase):
    subject_id: int

class FileUpdate(BaseModel):
    name: Optional[str] = None
    link: Optional[str] = None

class FileResponse(FileBase):
    id: int
    subject_id: int
    section_id: int

    class Config:
        from_attributes = True  # Allows reading from SQLAlchemy ORM objects


# ──────────────────────────────────────────────
# SECTION schemas
# ──────────────────────────────────────────────

class SectionBase(BaseModel):
    title: str

class SectionCreate(SectionBase):
    pass

class SectionResponse(SectionBase):
    id: int
    files: List[FileResponse] = []

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────
# SUBJECT schemas
# ──────────────────────────────────────────────

class SubjectBase(BaseModel):
    name: str

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: str

class SubjectResponse(SubjectBase):
    id: int
    year_id: int

    class Config:
        from_attributes = True


class SubjectSectionsResponse(BaseModel):
    subject_id: int
    subject_name: str
    year_key: str
    sections: List[SectionResponse]


# ──────────────────────────────────────────────
# YEAR schemas
# ──────────────────────────────────────────────

class YearBase(BaseModel):
    year_key: str
    title: str
    subtitle: str

class YearCreate(YearBase):
    pass

class YearResponse(YearBase):
    id: int
    subjects: List[SubjectResponse] = []

    class Config:
        from_attributes = True
