# Data Model: Phase 5 Advanced Cloud Deployment

**Branch**: `1-phase5-cloud-deploy` | **Date**: 2026-02-08 | **Plan**: [specs/1-phase5-cloud-deploy/plan.md](specs/1-phase5-cloud-deploy/plan.md)

## Summary

This data model defines the core entities required to support advanced task management features, including recurring tasks, due dates, reminders, priorities, tags, and search/filter/sort capabilities. It also includes entities for notifications and agent skills, aligning with the event-driven and agentic workflow principles.

## Entities

### Task
Represents a single task or an instance of a recurring task.
-   **id**: Unique identifier (UUID)
-   **userId**: Identifier of the user who owns the task
-   **title**: Brief description of the task (string)
-   **description**: Detailed description (optional, string)
-   **status**: Current status (e.g., 'pending', 'completed', 'in_progress', 'cancelled')
-   **priority**: Importance level (e.g., 'High', 'Medium', 'Low')
-   **tags**: List of associated tags (array of strings)
-   **dueDate**: Specific date and time for task completion (optional, datetime)
-   **reminderSettings**: Configuration for reminders (optional, embedded object: see ReminderSettings below)
-   **recurrencePatternId**: Reference to RecurrencePattern if this is a recurring task instance (optional, UUID)
-   **parentTaskId**: Reference to the original recurring task if this is an instance (optional, UUID)
-   **createdAt**: Timestamp of creation (datetime)
-   **updatedAt**: Timestamp of last update (datetime)

### RecurrencePattern
Defines the schedule for automatically generating task instances.
-   **id**: Unique identifier (UUID)
-   **userId**: Identifier of the user who owns the pattern
-   **frequency**: How often the task recurs (e.g., 'daily', 'weekly', 'monthly', 'yearly')
-   **interval**: Numeric interval for the frequency (e.g., 1 for 'every day', 2 for 'every two weeks')
-   **daysOfWeek**: For 'weekly' frequency, specific days of the week (array of integers, 0=Sunday)
-   **dayOfMonth**: For 'monthly' frequency, specific day of the month (integer)
-   **monthOfYear**: For 'yearly' frequency, specific month of the year (integer)
-   **startDate**: The date from which the recurrence begins (date)
-   **endDate**: Optional end date for recurrence (optional, date)
-   **numberOfOccurrences**: Optional, total number of occurrences after which recurrence stops (integer)
-   **relatedTaskId**: Reference to the initial task that defined this pattern (UUID)
-   **createdAt**: Timestamp of creation (datetime)
-   **updatedAt**: Timestamp of last update (datetime)

### ReminderSettings (Embedded in Task)
Configuration for task reminders.
-   **enabled**: Boolean, whether reminders are active for this task
-   **reminderTime**: Time offset before dueDate (e.g., '1h', '30m', '1d')
-   **notificationMethod**: How the reminder is delivered (e.g., 'in-app', 'email', 'push')

### Notification
Represents a message or alert sent to the user.
-   **id**: Unique identifier (UUID)
-   **userId**: Identifier of the recipient user
-   **taskId**: Reference to the task related to the notification (optional, UUID)
-   **type**: Type of notification (e.g., 'reminder', 'overdue', 'system')
-   **message**: Content of the notification (string)
-   **deliveryStatus**: Status of the notification delivery (e.g., 'pending', 'sent', 'failed')
-   **read**: Boolean, whether the user has read the notification
-   **createdAt**: Timestamp of creation (datetime)

### AgentSkill
Represents a reusable piece of logic, potentially managed by a subagent.
-   **id**: Unique identifier (UUID)
-   **name**: Name of the skill (string)
-   **description**: Description of the skill (string)
-   **trigger**: How the skill is invoked (e.g., 'dapr-cron-binding', 'api-call', 'event-subscription')
-   **configuration**: JSON object for skill-specific settings (JSON)
-   **codeRef**: Reference to the skill's implementation (e.g., file path, module name)
-   **createdAt**: Timestamp of creation (datetime)
-   **updatedAt**: Timestamp of last update (datetime)

## Relationships

-   **User to Task**: One-to-many (A user can have multiple tasks)
-   **Task to RecurrencePattern**: One-to-one (An initial recurring task defines one recurrence pattern), One-to-many (A recurrence pattern can generate many task instances)
-   **Task to Notification**: One-to-many (A task can trigger multiple notifications)
-   **User to Notification**: One-to-many (A user can receive multiple notifications)
