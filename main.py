from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from api.auth import router as auth_router
from api.transactions import router as transactions_router
from auth_utils import seed_admin
from database.connection import create_db_and_tables

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR / "out"


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    seed_admin()
    yield


app = FastAPI(title="Caden Trusts API", lifespan=lifespan)

app.include_router(auth_router)
app.include_router(transactions_router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
