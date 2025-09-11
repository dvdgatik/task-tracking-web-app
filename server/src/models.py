from __future__ import annotations
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import func, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from uuid import uuid4, UUID as _UUID

class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[_UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title: Mapped[str] = mapped_column(nullable=False)
    completed: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("char_length(btrim(title)) between 1 and 200", name="tasks_title_len"),
        Index("idx_tasks_completed", "completed"),
        Index("idx_tasks_created_at", "created_at"),
    )
