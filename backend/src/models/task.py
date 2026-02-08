from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, JSON, Column

class ReminderSettings(SQLModel):
    enabled: bool = Field(default=False)
    reminderTime: Optional[str] = Field(default=None) # e.g., '1h', '30m', '1d'
    notificationMethod: Optional[str] = Field(default=None) # e.g., 'in-app', 'email', 'push'

class RecurrencePatternCreate(SQLModel):
    frequency: str
    interval: int = 1
    daysOfWeek: Optional[List[int]] = None
    dayOfMonth: Optional[int] = None
    monthOfYear: Optional[int] = None
    startDate: datetime
    endDate: Optional[datetime] = None
    numberOfOccurrences: Optional[int] = None

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    dueDate: Optional[datetime] = None
    reminderSettings: Optional[ReminderSettings] = Field(default_factory=ReminderSettings)

class TaskCreate(TaskBase):
    recurrencePattern: Optional[RecurrencePatternCreate] = None

class TaskUpdate(TaskBase):
    # For updates, all fields are optional
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    dueDate: Optional[datetime] = None
    reminderSettings: Optional[ReminderSettings] = None

class TaskRead(TaskBase):
    id: UUID
    userId: UUID
    recurrencePatternId: Optional[UUID] = None
    parentTaskId: Optional[UUID] = None
    createdAt: datetime
    updatedAt: datetime

class Task(TaskBase, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    userId: UUID = Field(index=True)
    recurrencePatternId: Optional[UUID] = Field(default=None, foreign_key="recurrencepattern.id")
    parentTaskId: Optional[UUID] = Field(default=None, foreign_key="task.id")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    reminderSettings: Optional[ReminderSettings] = Field(default_factory=ReminderSettings, sa_column=Column(JSON))
