import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Serve static files from the 'out' directory (where Next.js exports)
# Check if the directory exists first to avoid errors during initial local dev without build
if os.path.exists("out"):
    app.mount("/", StaticFiles(directory="out", html=True), name="static")

@app.exception_handler(404)
async def not_found_exception_handler(request, exc):
    # Ensure index.html exists before trying to serve it
    if os.path.exists("out/index.html"):
        return FileResponse("out/index.html")
    return {"error": "Not Found", "message": "The requested resource was not found."}
