from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Read the full Supabase PostgreSQL connection URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in the .env file!")

# Create SQLAlchemy engine using psycopg2 (PostgreSQL driver)
engine = create_engine(DATABASE_URL, echo=True)

# Each request gets its own database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def get_db():
    """
    Dependency function injected into FastAPI routes.
    Opens a DB session, yields it, then closes it after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
