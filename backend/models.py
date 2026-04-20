from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Year(Base):
    """
    Represents the year tabs: SY (Second Year), TY (Third Year), BY (Bachelor Year)
    """
    __tablename__ = "years"

    id = Column(Integer, primary_key=True, index=True)
    year_key = Column(String(5), unique=True, nullable=False)   # 'SY', 'TY', 'BY'
    title = Column(String(100), nullable=False)                  # 'SY Materials'
    subtitle = Column(String(100), nullable=False)               # 'SECOND YEAR'

    # One year has many subjects
    subjects = relationship("Subject", back_populates="year", cascade="all, delete-orphan")


class Subject(Base):
    """
    Represents a subject (e.g. DBMS, CN, OS) belonging to a year.
    """
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    year_id = Column(Integer, ForeignKey("years.id"), nullable=False)
    name = Column(String(100), nullable=False)                   # 'DBMS', 'CN', etc.

    # Relationships
    year = relationship("Year", back_populates="subjects")
    files = relationship("File", back_populates="subject", cascade="all, delete-orphan")


class Section(Base):
    """
    Represents a named section (e.g. 'Unit wise PPT', 'CIE', 'Examination', 'Syllabus').
    Contains only sec_id (PK) and title. Its id is used as FK in the File model.
    """
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)           # sec_id — referenced by File.section_id
    title = Column(String(100), nullable=False)                  # 'Unit wise PPT'

    # Relationships
    files = relationship("File", back_populates="section", cascade="all, delete-orphan")


class File(Base):
    """
    Represents a single file/link inside a section.
    """
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    name = Column(String(255), nullable=False)                   # 'Unit 1 - Introduction.ppt'
    size = Column(String(20), nullable=True)                     # '2.4 MB'
    link = Column(Text, nullable=False)                          # Google Drive / Docs URL

    # Relationships
    subject = relationship("Subject", back_populates="files")
    section = relationship("Section", back_populates="files")
