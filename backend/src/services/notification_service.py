from typing import List, Optional
from uuid import UUID
from datetime import datetime
from sqlmodel import Session, select
from dapr.clients import DaprClient

from backend.src.models.notification import Notification
from backend.src.models.task import Task, ReminderSettings

class NotificationService:
    def __init__(self, session: Session, dapr_client: Optional[DaprClient] = None):
        self.session = session
        self.dapr_client = dapr_client or DaprClient() # Initialize DaprClient if not provided

    def create_notification(self, notification: Notification) -> Notification:
        self.session.add(notification)
        self.session.commit()
        self.session.refresh(notification)
        return notification

    def get_notification(self, notification_id: UUID) -> Optional[Notification]:
        statement = select(Notification).where(Notification.id == notification_id)
        return self.session.exec(statement).first()

    def get_user_notifications(self, user_id: UUID, read: Optional[bool] = None) -> List[Notification]:
        statement = select(Notification).where(Notification.userId == user_id)
        if read is not None:
            statement = statement.where(Notification.read == read)
        return self.session.exec(statement).all()

    def mark_notification_read(self, notification_id: UUID) -> Optional[Notification]:
        notification = self.get_notification(notification_id)
        if not notification:
            return None
        notification.read = True
        self.session.add(notification)
        self.session.commit()
        self.session.refresh(notification)
        return notification

    async def schedule_notification_for_task(self, task: Task):
        """
        Schedules a notification for a task based on its reminder settings.
        This would typically publish a message to a Dapr pubsub topic
        that a separate service (or Dapr binding) would consume to send the notification.
        """
        if not task.dueDate or not task.reminderSettings or not task.reminderSettings.enabled:
            return

        # Simplified logic: just create a notification for now.
        # Real scheduling would involve a timer or external system.
        notification_message = f"Reminder: Your task '{task.title}' is due soon!"
        notification = Notification(
            userId=task.userId,
            taskId=task.id,
            type="reminder",
            message=notification_message,
            deliveryStatus="pending"
        )
        self.create_notification(notification)

        # Publish a message for actual delivery (e.g., email, push notification)
        # This assumes a 'notification-channel' pubsub topic is configured in Dapr
        try:
            await self.dapr_client.publish_event(
                pubsub_name='pubsub', # Name of the pubsub component
                topic_name='notification-channel',
                data={"userId": str(task.userId), "message": notification_message, "taskId": str(task.id)},
                data_content_type='application/json'
            )
            print(f"Published notification event for task {task.id}")
            # Potentially update notification delivery status here
        except Exception as e:
            print(f"Failed to publish notification event for task {task.id}: {e}")

