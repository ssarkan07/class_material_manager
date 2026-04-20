from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api", tags=["Files"])


@router.get("/subjects/{subject_name}/sections", response_model=schemas.SubjectSectionsResponse)
def get_sections_for_subject(subject_name: str, db: Session = Depends(get_db)):
    """
    GET /api/subjects/{subject_name}/sections
    Returns all sections for a given subject name, each containing files for that subject.
    Used by FilesLink.jsx to display the file cards grouped by section.
    """
    subject = db.query(models.Subject).filter(models.Subject.name == subject_name).first()
    if not subject:
        raise HTTPException(status_code=404, detail=f"Subject '{subject_name}' not found.")
    
    # Fetch all global sections
    sections = db.query(models.Section).all()
    
    # For each section, attach only files which belong to THIS subject
    result_sections = []
    for sec in sections:
        sec_files = db.query(models.File).filter(
            models.File.subject_id == subject.id,
            models.File.section_id == sec.id
        ).all()
        
        result_sections.append({
            "id": sec.id,
            "title": sec.title,
            "files": sec_files
        })

    return {
        "subject_id": subject.id,
        "subject_name": subject.name,
        "year_key": subject.year.year_key,
        "sections": result_sections
    }


@router.post("/sections/{section_id}/files", response_model=schemas.FileResponse, status_code=201)
def add_file_to_section(section_id: int, file: schemas.FileCreate, db: Session = Depends(get_db)):
    """
    POST /api/sections/{section_id}/files
    Adds a new file link to a specific section and subject.
    Called when user submits the 'Add Material' modal in FilesLink.jsx.
    """
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")

    new_file = models.File(**file.model_dump(), section_id=section_id)
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    return new_file


@router.patch("/files/{file_id}", response_model=schemas.FileResponse)
def update_file(file_id: int, data: schemas.FileUpdate, db: Session = Depends(get_db)):
    """
    PATCH /api/files/{file_id}
    Updates a file's name and/or link URL.
    """
    file = db.query(models.File).filter(models.File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found.")
    if data.name is not None:
        file.name = data.name
    if data.link is not None:
        file.link = data.link
    db.commit()
    db.refresh(file)
    return file


@router.delete("/files/{file_id}", status_code=204)
def delete_file(file_id: int, db: Session = Depends(get_db)):
    """
    DELETE /api/files/{file_id}
    Deletes a specific file from the database.
    """
    file = db.query(models.File).filter(models.File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found.")
    db.delete(file)
    db.commit()
