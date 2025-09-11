from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    completed: Optional[bool] = None

class TaskRead(BaseModel):
    id: UUID
    title: str
    completed: bool
