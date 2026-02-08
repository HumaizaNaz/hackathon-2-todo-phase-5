from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class Notification(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    userId: UUID = Field(index=True)
    taskId: Optional[UUID] = Field(default=None, foreign_key="task.id") # Optional link to a task
    type: str # e.g., 'reminder', 'overdue', 'system'
    message: str
    deliveryStatus: str = Field(default="pending") # e.g., 'pending', 'sent', 'failed'
    read: bool = Field(default=False)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
