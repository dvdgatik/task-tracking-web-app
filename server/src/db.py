from __future__ import annotations
import os
from typing import Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

_DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")

if not _DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Ensure `.env` exists next to docker-compose.yml "
        "and the `server` service has `env_file: .env`."
    )

try:
    engine = create_engine(_DATABASE_URL, pool_pre_ping=True)
except Exception as e:
    raise RuntimeError(
        f"Failed to create SQLAlchemy engine for URL={_DATABASE_URL!r}. "
        "Check driver (psycopg) and URL format."
    ) from e

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
