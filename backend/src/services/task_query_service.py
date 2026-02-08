from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select, func, or_
from backend.src.models.task import Task, TaskRead

class TaskQueryService:
    def __init__(self, session: Session):
        self.session = session

    def get_filtered_and_sorted_tasks(
        self,
        user_id: UUID,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        tag: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "createdAt",
        sort_order: str = "asc",
        offset: int = 0,
        limit: int = 100
    ) -> List[Task]:
        statement = select(Task).where(Task.userId == user_id)

        if status:
            statement = statement.where(Task.status == status)
        if priority:
            statement = statement.where(Task.priority == priority)
        if tag:
            # Check if the tag is present in the tags JSON array
            statement = statement.where(Task.tags.contains([tag]))
        if search:
            search_pattern = f"%{search.lower()}%"
            statement = statement.where(
                or_(
                    func.lower(Task.title).like(search_pattern),
                    func.lower(Task.description).like(search_pattern)
                )
            )

        # Apply sorting
        sort_column = getattr(Task, sort_by, Task.createdAt) # Default to createdAt if column not found
        if sort_order == "desc":
            statement = statement.order_by(sort_column.desc())
        else:
            statement = statement.order_by(sort_column.asc())

        statement = statement.offset(offset).limit(limit)
        return self.session.exec(statement).all()

