from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from datetime import datetime
from uuid import UUID

from backend.src.models.task import Task, TaskCreate, TaskRead, TaskUpdate # Import TaskUpdate
from backend.src.models.recurrence_pattern import RecurrencePattern
from backend.src.models.user import User
from backend.src.services.auth_service import AuthService
from backend.src.services.recurrence_service import RecurrenceService
from backend.src.services.task_generation_service import TaskGenerationService
from backend.src.services.task_query_service import TaskQueryService # Import TaskQueryService
from core.db import get_session

router = APIRouter()

# Placeholder for dependency to get current user
# In a real application, this would retrieve the authenticated user from the request
def get_current_user(token: dict = Depends(AuthService().decode_access_token)) -> User: # token is now dict
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Assuming token contains user info sufficient to reconstruct a User object or get user_id
    # For now, let's use a dummy user based on the decoded token
    # This needs to be consistent with AuthService().decode_access_token
    dummy_user = User(
        id=token.get("id"),
        email=token.get("email"),
        hashed_password="not_exposed", # This should not be exposed
        full_name=token.get("name"),
        is_active=True,
        is_superuser="admin" in token.get("roles", [])
    )
    return dummy_user


@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task. If recurrencePattern is provided, it also sets up a recurring task.
    """
    new_task = Task(userId=current_user.id, **task_create.model_dump(exclude={"recurrencePattern"}))
    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    if task_create.recurrencePattern:
        recurrence_pattern_service = RecurrenceService(session)
        recurrence_pattern = RecurrencePattern(
            userId=current_user.id,
            relatedTaskId=new_task.id,
            **task_create.recurrencePattern.model_dump()
        )
        created_pattern = recurrence_pattern_service.create_recurrence_pattern(recurrence_pattern)
        new_task.recurrencePatternId = created_pattern.id
        session.add(new_task)
        session.commit()
        session.refresh(new_task)
        
        task_generation_service = TaskGenerationService(session)
        task_generation_service.generate_tasks_for_pattern(created_pattern)

    return new_task

@router.put("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update an existing task.
    """
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    if task.userId != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this task")
    
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/tasks", response_model=List[TaskRead])
async def read_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    status: Optional[str] = Query(None, description="Filter by task status"),
    priority: Optional[str] = Query(None, description="Filter by task priority"),
    tag: Optional[str] = Query(None, description="Filter by task tag"),
    search: Optional[str] = Query(None, description="Search by title or description"),
    sort_by: str = Query("createdAt", description="Field to sort by (e.g., 'createdAt', 'dueDate', 'priority')"),
    sort_order: str = Query("asc", description="Sort order ('asc' or 'desc')"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, gt=0, le=1000, description="Limit for pagination")
):
    """
    Retrieve a list of tasks for the current user, with filtering, sorting, and pagination.
    """
    task_query_service = TaskQueryService(session)
    tasks = task_query_service.get_filtered_and_sorted_tasks(
        user_id=current_user.id,
        status=status,
        priority=priority,
        tag=tag,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        offset=offset,
        limit=limit
    )
    return tasks

@router.get("/tasks/{task_id}", response_model=TaskRead)
async def read_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve a single task by its ID.
    """
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    if task.userId != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this task")
    
    return task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a task.
    """
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    if task.userId != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this task")
    
    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}