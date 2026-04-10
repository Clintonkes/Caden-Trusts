from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse, Response
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


def resolve_frontend_path(full_path: str) -> Path | None:
    if not FRONTEND_DIR.exists():
        return None

    safe_root = FRONTEND_DIR.resolve()
    candidate = (FRONTEND_DIR / full_path).resolve()

    if safe_root not in candidate.parents and candidate != safe_root:
        return None

    if candidate.is_dir():
        index_file = candidate / "index.html"
        if index_file.exists():
            return index_file

    if candidate.is_file():
        return candidate

    html_candidate = candidate.with_suffix(".html")
    if html_candidate.exists():
        return html_candidate

    return None


if FRONTEND_DIR.exists():
    next_dir = FRONTEND_DIR / "_next"
    if next_dir.exists():
        app.mount("/_next", StaticFiles(directory=next_dir), name="next-assets")


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    full_path = full_path or "index.html"
    file_path = resolve_frontend_path(full_path)
    if file_path:
        return FileResponse(file_path)

    not_found = FRONTEND_DIR / "404.html"
    if not_found.exists():
        return FileResponse(not_found, status_code=404)

    return Response("Not Found", status_code=404)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
