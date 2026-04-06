import os
from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session():
    """Get database session context manager."""
    with Session(engine) as session:
        yield session


def get_db():
    """Dependency for FastAPI routes."""
    with Session(engine) as session:
        yield session