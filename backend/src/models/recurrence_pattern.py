from typing import Optional, List
from datetime import date
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel

class RecurrencePattern(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    userId: UUID = Field(index=True)  # Link to the user who owns this pattern
    frequency: str  # e.g., 'daily', 'weekly', 'monthly', 'yearly'
    interval: int = Field(default=1)  # e.g., 1 for 'every day', 2 for 'every two weeks'
    daysOfWeek: Optional[List[int]] = Field(default=None)  # For 'weekly' (0=Sun, 6=Sat)
    dayOfMonth: Optional[int] = Field(default=None) # For 'monthly'
    monthOfYear: Optional[int] = Field(default=None) # For 'yearly'
    startDate: date
    endDate: Optional[date] = Field(default=None)
    numberOfOccurrences: Optional[int] = Field(default=None)
    relatedTaskId: Optional[UUID] = Field(default=None, index=True) # Link to the initial task that defined this pattern
    createdAt: Optional[date] = Field(default_factory=date.today)
    updatedAt: Optional[date] = Field(default_factory=date.today)

