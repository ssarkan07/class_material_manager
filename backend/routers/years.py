from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api/years", tags=["Years"])


@router.get("/", response_model=list[schemas.YearResponse])
def get_all_years(db: Session = Depends(get_db)):
    """
    GET /api/years
    Returns all year tabs: SY, TY, BY with their subjects.
    The React Dashboard uses this to build the sidebar tabs.
    """
    return db.query(models.Year).all()


@router.post("/", response_model=schemas.YearResponse, status_code=201)
def create_year(year: schemas.YearCreate, db: Session = Depends(get_db)):
    """
    POST /api/years
    Adds a new year tab (rarely used, but available for admin).
    """
    # Check if year_key already exists
    existing = db.query(models.Year).filter(models.Year.year_key == year.year_key).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Year '{year.year_key}' already exists.")

    new_year = models.Year(**year.model_dump())
    db.add(new_year)
    db.commit()
    db.refresh(new_year)
    return new_year
