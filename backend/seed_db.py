"""
seed_db.py — Run this ONCE to populate the MySQL database with all existing mock data.

Usage:
    cd Class_Material_Manager/backend
    python seed_db.py

This script:
  1. Creates all tables (same as main.py startup)
  2. Inserts the 3 year tabs (SY, TY, BY)
  3. Inserts all subjects per year
  4. Creates the 4 default sections per subject (Unit wise PPT, CIE, Examination, Syllabus)
  5. Inserts all existing file links from the old FilesLink.jsx mock data
"""

from database import SessionLocal, engine
import models

from sqlalchemy import text

# Drop all tables with CASCADE (handles FK dependencies in PostgreSQL)
# then recreate with the latest schema
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS files CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS sections CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS subjects CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS years CASCADE"))
    conn.commit()

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ──────────────────────────────────────────────────────────────────────────────
# SEED DATA — mirrors the old hardcoded mock data exactly
# ──────────────────────────────────────────────────────────────────────────────

YEARS = [
    {"year_key": "SY", "title": "SY Materials", "subtitle": "SECOND YEAR",
     "subjects": ["DBMS", "CN", "MDM", "ED", "DTS"]},
    {"year_key": "TY", "title": "TY Materials", "subtitle": "THIRD YEAR",
     "subjects": ["OS", "Algorithms", "Microprocessors", "TOC"]},
    {"year_key": "BY", "title": "BY Materials", "subtitle": "BACHELOR YEAR",
     "subjects": ["Cloud Computing", "AI", "Mobile Dev", "Soft Computing"]},
]

# Detailed file data (from old FilesLink.jsx subjectDataMap)
SUBJECT_FILES = {
    "DBMS": [
        {
            "title": "Unit wise PPT",
            "files": [
                {"name": "Unit 1 - Introduction.ppt", "size": "2.4 MB", "link": "https://docs.google.com/presentation/d/1-PNUGrt246D1Hg5qh6RlS0kTd74DEhEV07MrOQ9gMF8/edit"},
                {"name": "Unit 2 - Architecture.ppt", "size": "3.1 MB", "link": "https://docs.google.com/presentation/d/1uOOvXhkBxkMgasZCSQB09cRdlB_vc5aZEJmqvSwwTHQ/edit"},
                {"name": "Unit 3 - Data Flow.ppt", "size": "1.8 MB", "link": "https://docs.google.com/presentation/d/1-iZ7DoIWtJJ0OMnJJxLZpF2qsR497pMMEi2xWusv9tY/edit"},
                {"name": "Unit 4 - Normalization.ppt", "size": "1.8 MB", "link": "https://docs.google.com/presentation/d/1CpJ25KN9huqN-Cr-ASHs-7M5WVeMs8sPWTegoYoUZd4/edit"},
                {"name": "Unit 5 - Transaction & Concurrency.ppt", "size": "1.8 MB", "link": "https://docs.google.com/presentation/d/1hAblsZCWaeLWIj3stdXMGmz6kRNuH6hw/edit"},
                {"name": "Unit 6 - Query Processing.ppt", "size": "1.8 MB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "CIE",
            "files": [
                {"name": "DBMS CIE 1.pdf", "size": "450 KB", "link": "https://www.google.com"},
                {"name": "DBMS CIE 2.pdf", "size": "520 KB", "link": "https://www.google.com"},
                {"name": "DBMS CIE 3.pdf", "size": "520 KB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "Examination",
            "files": [
                {"name": "DBMS MSE Question.pdf", "size": "890 KB", "link": "https://www.google.com"},
                {"name": "DBMS ESE Question.pdf", "size": "1.1 MB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "Syllabus",
            "files": [
                {"name": "DBMS - Full Syllabus.pdf", "size": "1.5 MB", "link": "https://drive.google.com/file/d/1x_ViV5reZ_6YFEZK_Dz9gmZE_PiEix7t/view"},
            ]
        },
    ],
    "CN": [
        {
            "title": "Unit wise PPT",
            "files": [
                {"name": "Unit 1 - Introduction.ppt", "size": "2.4 MB", "link": "https://docs.google.com/presentation/d/1LUZqHzzixsXXNf7FelRp6s0BZwqrrEds/edit"},
                {"name": "Unit 2 - Architecture.ppt", "size": "3.1 MB", "link": "https://docs.google.com/presentation/d/1eUSt37s3VX7Sylm0gFxvqSBr6Esufj91/edit"},
                {"name": "Unit 3 - Data Flow.ppt", "size": "1.8 MB", "link": "https://docs.google.com/presentation/d/1bePdqprYI0vSJdQE3fRVBxnlqXJYOXcn/edit"},
                {"name": "Unit 4 - Normalization.ppt", "size": "1.8 MB", "link": "https://docs.google.com/presentation/d/1wWQVBB4lzVZx_pQa7pFeY_JyKBZn1Gg4/edit"},
                {"name": "Unit 5 - Transaction & Concurrency.ppt", "size": "1.8 MB", "link": "https://docs.google.com/presentation/d/1hAblsZCWaeLWIj3stdXMGmz6kRNuH6hw/edit"},
                {"name": "Unit 6 - Query Processing.ppt", "size": "1.8 MB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "CIE",
            "files": [
                {"name": "CN CIE 1.pdf", "size": "450 KB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "Examination",
            "files": [
                {"name": "CN MSE.pdf", "size": "890 KB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "Syllabus",
            "files": [
                {"name": "CN - Syllabus.pdf", "size": "1.5 MB", "link": "https://www.google.com"},
            ]
        },
    ],
    "OS": [
        {
            "title": "Unit wise PPT",
            "files": [
                {"name": "Unit 1 - OS Concepts.ppt", "size": "2.4 MB", "link": "https://www.google.com"},
                {"name": "Unit 2 - Process Scheduling.ppt", "size": "3.1 MB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "CIE",
            "files": [
                {"name": "OS CIE 1.pdf", "size": "450 KB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "Examination",
            "files": [
                {"name": "OS MSE.pdf", "size": "890 KB", "link": "https://www.google.com"},
            ]
        },
        {
            "title": "Syllabus",
            "files": [
                {"name": "OS - Syllabus.pdf", "size": "1.5 MB", "link": "https://www.google.com"},
            ]
        },
    ],
}

DEFAULT_SECTIONS = ["Unit wise PPT", "CIE", "Examination", "Syllabus"]


def seed():
    # Prevent duplicate seeding
    existing = db.query(models.Year).first()
    if existing:
        print("[SKIP] Database already has data. Skipping seed to prevent duplicates.")
        print("   If you want to re-seed, delete all rows first or drop the database.")
        return

    print("[START] Seeding database...")

    # 1. Create master sections once
    section_map = {}
    for section_title in DEFAULT_SECTIONS:
        section = models.Section(title=section_title)
        db.add(section)
        db.flush()
        section_map[section_title] = section.id
        print(f"  [OK] Created master section: {section_title}")

    for year_data in YEARS:
        # Create the year tab
        year = models.Year(
            year_key=year_data["year_key"],
            title=year_data["title"],
            subtitle=year_data["subtitle"],
        )
        db.add(year)
        db.flush()  # get year.id before commit

        print(f"  [OK] Created year: {year_data['year_key']}")

        for subject_name in year_data["subjects"]:
            # Create the subject
            subject = models.Subject(name=subject_name, year_id=year.id)
            db.add(subject)
            db.flush()  # get subject.id

            print(f"     [+] Created subject: {subject_name}")

            # Check if we have detailed file data for this subject
            if subject_name in SUBJECT_FILES:
                subject_data = SUBJECT_FILES[subject_name]
                for section_data in subject_data:
                    # Get the pre-created section ID or create a new one if it's missing
                    section_id = section_map.get(section_data["title"])
                    if not section_id:
                        new_sec = models.Section(title=section_data["title"])
                        db.add(new_sec)
                        db.flush()
                        section_id = new_sec.id
                        section_map[section_data["title"]] = section_id
                        print(f"       [!] Added extra section: {section_data['title']}")

                    for file_data in section_data["files"]:
                        file = models.File(
                            name=file_data["name"],
                            size=file_data.get("size"),
                            link=file_data["link"],
                            subject_id=subject.id,
                            section_id=section_id,
                        )
                        db.add(file)
            else:
                # Subjects without data will simply display empty default sections in the UI
                pass

    db.commit()
    print("\n[DONE] Database seeded successfully!")
    print("   You can now start the server: uvicorn main:app --reload")


if __name__ == "__main__":
    try:
        seed()
    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Error during seeding: {e}")
        raise
    finally:
        db.close()
