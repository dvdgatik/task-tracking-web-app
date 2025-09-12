from __future__ import annotations
from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..db import SessionLocal
from ..models import Task
from ..schemas import TaskCreate, TaskUpdate, TaskRead

router = APIRouter()

def get_session() -> Session:
    return SessionLocal()

@router.get("", response_model=List[TaskRead])
def list_tasks() -> List[TaskRead]:
    with get_session() as db:
        rows = db.execute(select(Task).order_by(Task.created_at.desc())).scalars().all()
        return [TaskRead(id=t.id, title=t.title, completed=t.completed) for t in rows]

@router.post("", response_model=TaskRead, status_code=201)
def create_task(payload: TaskCreate) -> TaskRead:
    with get_session() as db, db.begin():
        task = Task(title=payload.title)
        db.add(task)
        db.flush()
        db.refresh(task)
        return TaskRead(id=task.id, title=task.title, completed=task.completed)

@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: UUID, payload: TaskUpdate) -> TaskRead:
    with get_session() as db, db.begin():
        task = db.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        if payload.title is not None:
            task.title = payload.title
        if payload.completed is not None:
            task.completed = payload.completed
        db.flush()
        db.refresh(task)
        return TaskRead(id=task.id, title=task.title, completed=task.completed)

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_task(task_id: UUID) -> Response:
    with get_session() as db, db.begin():
        task = db.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        db.delete(task)
    # No body in 204:
    return Response(status_code=status.HTTP_204_NO_CONTENT)
