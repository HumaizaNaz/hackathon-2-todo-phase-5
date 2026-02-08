from typing import List
from datetime import date, timedelta
from uuid import UUID
from sqlmodel import Session, select
from backend.src.models.recurrence_pattern import RecurrencePattern
from backend.src.models.task import Task
from backend.src.models.user import User # Assuming User model is available for userId

class TaskGenerationService:
    def __init__(self, session: Session):
        self.session = session

    def generate_tasks_for_pattern(self, pattern: RecurrencePattern) -> List[Task]:
        """
        Generates new task instances based on a given recurrence pattern.
        This is a simplified implementation. A real-world scenario would
        involve more sophisticated date calculations and handling of
        timezones, holidays, etc.
        """
        generated_tasks = []
        current_date = pattern.startDate

        # For simplicity, let's generate tasks for the next year
        # In a real app, this would be triggered by cron and generate for a shorter period (e.g., next week/month)
        end_generation_date = date.today() + timedelta(days=365) # Generate for the next year

        # Retrieve the original task if relatedTaskId is provided
        original_task: Optional[Task] = None
        if pattern.relatedTaskId:
            statement = select(Task).where(Task.id == pattern.relatedTaskId)
            original_task = self.session.exec(statement).first()

        if not original_task:
            # If there's no original task, we can't create instances.
            # This might happen if the original task was deleted or not linked correctly.
            print(f"Warning: No original task found for recurrence pattern {pattern.id}. Cannot generate instances.")
            return []

        while current_date <= end_generation_date and 
              (pattern.endDate is None or current_date <= pattern.endDate) and 
              (pattern.numberOfOccurrences is None or len(generated_tasks) < pattern.numberOfOccurrences):

            should_generate = False
            if pattern.frequency == "daily":
                should_generate = True
            elif pattern.frequency == "weekly" and pattern.daysOfWeek and current_date.weekday() in pattern.daysOfWeek:
                should_generate = True
            elif pattern.frequency == "monthly" and pattern.dayOfMonth == current_date.day:
                should_generate = True
            elif pattern.frequency == "yearly" and pattern.monthOfYear == current_date.month and pattern.dayOfMonth == current_date.day:
                should_generate = True

            if should_generate:
                # Create a new task instance
                new_task = Task(
                    userId=pattern.userId,
                    title=f"{original_task.title} (Instance: {current_date.isoformat()})",
                    description=original_task.description,
                    status="pending", # New instances are typically pending
                    priority=original_task.priority,
                    tags=original_task.tags,
                    dueDate=original_task.dueDate.replace(year=current_date.year, month=current_date.month, day=current_date.day) if original_task.dueDate else None,
                    reminderSettings=original_task.reminderSettings,
                    recurrencePatternId=pattern.id,
                    parentTaskId=original_task.id,
                    createdAt=datetime.utcnow(),
                    updatedAt=datetime.utcnow()
                )
                generated_tasks.append(new_task)

            # Advance date based on frequency and interval
            if pattern.frequency == "daily":
                current_date += timedelta(days=pattern.interval)
            elif pattern.frequency == "weekly":
                current_date += timedelta(weeks=pattern.interval)
            elif pattern.frequency == "monthly":
                # This is a simplified monthly increment, might need more robust logic for end of month issues
                current_date = current_date.replace(month=(current_date.month % 12) + 1)
            elif pattern.frequency == "yearly":
                current_date = current_date.replace(year=current_date.year + pattern.interval)
            else:
                # Stop if frequency is unknown or not handled
                break

        # Persist generated tasks to the database
        for task in generated_tasks:
            self.session.add(task)
        self.session.commit()
        return generated_tasks
