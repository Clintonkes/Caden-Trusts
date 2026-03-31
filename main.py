import os
from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session, select
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Default to a local sqlite (good for local dev if not configured)
    DATABASE_URL = "sqlite:///./test.db"

# Replace postgres:// with postgresql:// for asyncpg/psycopg2 compatibility if needed
DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI(title="Caden Trusts API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to Caden Trusts API", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
