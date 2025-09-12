from __future__ import annotations
from sqlalchemy.orm import Session
from src.db import SessionLocal
from src.models import Task

def run() -> None:
    with SessionLocal() as db:  # type: Session
        for title in ["Learning FastAPI", "Set up Alembic", "Connect Next.js"]:
            db.add(Task(title=title))
        db.commit()

if __name__ == "__main__":
    run()
