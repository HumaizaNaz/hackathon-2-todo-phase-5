from dapr.clients import DaprClient
from fastapi import APIRouter, Request, status, HTTPException
from pydantic import BaseModel
from typing import Optional

# This router will expose endpoints for the reminder skill to be triggered by Dapr bindings
router = APIRouter()

class CronEvent(BaseModel):
    id: str
    spec: str
    data: Optional[str] = None

@router.post("/reminders/cron-trigger")
async def handle_cron_trigger(event: CronEvent, request: Request):
    """
    Handles cron trigger events from Dapr binding.
    This endpoint would typically query for tasks that need reminders sent
    and then trigger notifications via the NotificationService in the backend.
    """
    print(f"Received cron event: {event.id} with spec {event.spec}")

    # In a real scenario, this skill would:
    # 1. Query the backend service (via Dapr service invocation) for tasks needing reminders.
    #    E.g., tasks with dueDate in the near future and reminderSettings enabled.
    # 2. For each task, create a notification entry in the backend (via Dapr service invocation)
    #    and potentially trigger the notification sending process.

    # Example: Invoke backend's notification service to send reminders
    # Assuming the backend has an endpoint to process reminder requests.
    try:
        with DaprClient() as d:
            # Invoking a placeholder backend endpoint
            # In a full implementation, this might call a specific service method, e.g.,
            # backend/src/services/notification_service.py's method to process scheduled reminders
            backend_response = d.invoke_method(
                app_id='backend',
                method_name='process_scheduled_reminders', # Placeholder backend method
                data={"cronEventId": event.id, "timestamp": datetime.utcnow().isoformat()},
                http_verb='POST',
                content_type="application/json"
            )
            print(f"Backend responded to reminder trigger: {backend_response.text()}")
            return {"status": "success", "message": "Reminder processing initiated"}
    except Exception as e:
        print(f"Error invoking backend for reminders: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to initiate reminder processing: {e}")

