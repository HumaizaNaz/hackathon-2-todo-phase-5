from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select
from backend.src.models.recurrence_pattern import RecurrencePattern

class RecurrenceService:
    def __init__(self, session: Session):
        self.session = session

    def create_recurrence_pattern(self, pattern: RecurrencePattern) -> RecurrencePattern:
        self.session.add(pattern)
        self.session.commit()
        self.session.refresh(pattern)
        return pattern

    def get_recurrence_pattern(self, pattern_id: UUID) -> Optional[RecurrencePattern]:
        statement = select(RecurrencePattern).where(RecurrencePattern.id == pattern_id)
        return self.session.exec(statement).first()

    def get_user_recurrence_patterns(self, user_id: UUID) -> List[RecurrencePattern]:
        statement = select(RecurrencePattern).where(RecurrencePattern.userId == user_id)
        return self.session.exec(statement).all()

    def update_recurrence_pattern(self, pattern_id: UUID, new_pattern: RecurrencePattern) -> Optional[RecurrencePattern]:
        existing_pattern = self.get_recurrence_pattern(pattern_id)
        if not existing_pattern:
            return None
        
        # Update fields
        for field, value in new_pattern.model_dump(exclude_unset=True).items():
            setattr(existing_pattern, field, value)
        
        self.session.add(existing_pattern)
        self.session.commit()
        self.session.refresh(existing_pattern)
        return existing_pattern

    def delete_recurrence_pattern(self, pattern_id: UUID) -> bool:
        pattern = self.get_recurrence_pattern(pattern_id)
        if not pattern:
            return False
        self.session.delete(pattern)
        self.session.commit()
        return True
