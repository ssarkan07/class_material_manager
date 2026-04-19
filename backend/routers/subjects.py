from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/years", tags=["Subjects"])


@router.get("/{year_key}/subjects", response_model=list[schemas.SubjectResponse])
def get_subjects_by_year(year_key: str, db: Session = Depends(get_db)):
    """
    GET /api/years/{year_key}/subjects
    Returns all subjects for a given year tab (e.g. 'SY', 'TY', 'BY').
    Used by Dashboard.jsx to display the subject folder cards.
    """
    year = db.query(models.Year).filter(models.Year.year_key == year_key.upper()).first()
    if not year:
        raise HTTPException(status_code=404, detail=f"Year '{year_key}' not found.")
    return year.subjects


@router.post("/{year_key}/subjects", response_model=schemas.SubjectResponse, status_code=201)
def add_subject(year_key: str, subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    """
    POST /api/years/{year_key}/subjects
    Adds a new subject to a year tab.
    Called when user submits the 'Add Subject' modal in Dashboard.jsx.
    Also auto-creates the 4 default sections: Unit wise PPT, CIE, Examination, Syllabus.
    """
    year = db.query(models.Year).filter(models.Year.year_key == year_key.upper()).first()
    if not year:
        raise HTTPException(status_code=404, detail=f"Year '{year_key}' not found.")

    # Create the subject
    new_subject = models.Subject(name=subject.name, year_id=year.id)
    db.add(new_subject)
    db.flush()  # flush to get new_subject.id before commit

    # Auto-create the 4 default sections for this subject
    default_sections = ["Unit wise PPT", "CIE", "Examination", "Syllabus"]
    for section_title in default_sections:
        db.add(models.Section(title=section_title, subject_id=new_subject.id))

    db.commit()
    db.refresh(new_subject)
    return new_subject


@router.patch("/subjects/{subject_id}", response_model=schemas.SubjectResponse)
def update_subject(subject_id: int, data: schemas.SubjectUpdate, db: Session = Depends(get_db)):
    """
    PATCH /api/years/subjects/{subject_id}
    Renames a subject.
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found.")
    subject.name = data.name
    db.commit()
    db.refresh(subject)
    return subject


@router.delete("/subjects/{subject_id}", status_code=204)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    """
    DELETE /api/years/subjects/{subject_id}
    Deletes a subject and all its sections/files (cascade).
    """
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found.")
    db.delete(subject)
    db.commit()
