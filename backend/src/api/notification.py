from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from uuid import UUID

from backend.src.models.notification import Notification
from backend.src.models.user import User
from backend.src.services.notification_service import NotificationService
from backend.src.api.task import get_current_user # Reusing get_current_user
from core.db import get_session

router = APIRouter()

@router.get("/notifications", response_model=List[Notification])
async def read_notifications(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve a list of notifications for the current user.
    """
    notification_service = NotificationService(session)
    notifications = notification_service.get_user_notifications(user_id=current_user.id)
    return notifications

@router.put("/notifications/{notification_id}/read", response_model=Notification)
async def mark_notification_as_read(
    notification_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Mark a specific notification as read.
    """
    notification_service = NotificationService(session)
    notification = notification_service.get_notification(notification_id)

    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    
    if notification.userId != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this notification")
    
    updated_notification = notification_service.mark_notification_read(notification_id)
    return updated_notification

