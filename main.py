from fastapi import FastAPI
from contextlib import asynccontextmanager
import os

from database.connection import create_db_and_tables, engine
from database.models import User, UserRole
from auth_utils import get_password_hash, generate_account_number, seed_admin
from api.auth import router as auth_router
from api.transactions import router as transactions_router


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)