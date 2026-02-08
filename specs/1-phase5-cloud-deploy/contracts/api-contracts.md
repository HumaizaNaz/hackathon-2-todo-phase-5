# API Contracts: Phase 5 Advanced Cloud Deployment

**Branch**: `1-phase5-cloud-deploy` | **Date**: 2026-02-08 | **Plan**: [specs/1-phase5-cloud-deploy/plan.md](specs/1-phase5-cloud-deploy/plan.md)

## Summary

This document outlines the API endpoints and their general structure to support the functional requirements of Phase 5, including task management (CRUD, recurrence, reminders), and integration with Dapr for event-driven interactions. Detailed OpenAPI/GraphQL schemas will be generated in a subsequent task.

## Endpoints

### Task Management

#### `POST /tasks`
-   **Description**: Creates a new task, with optional recurrence pattern and reminder settings.
-   **Request Body**: `Task` object (title, description, dueDate, priority, tags, recurrencePattern, reminderSettings)
-   **Response**: `Task` object, status 201 Created

#### `GET /tasks`
-   **Description**: Retrieves a list of tasks, with support for filtering, sorting, and searching.
-   **Query Parameters**: `status`, `priority`, `tag`, `search`, `sortBy`, `sortOrder`, `offset`, `limit`
-   **Response**: Array of `Task` objects, status 200 OK

#### `GET /tasks/{id}`
-   **Description**: Retrieves a single task by its ID.
-   **Path Parameters**: `id` (UUID)
-   **Response**: `Task` object, status 200 OK or 404 Not Found

#### `PUT /tasks/{id}`
-   **Description**: Updates an existing task.
-   **Path Parameters**: `id` (UUID)
-   **Request Body**: `Task` object (updatable fields)
-   **Response**: Updated `Task` object, status 200 OK or 404 Not Found

#### `DELETE /tasks/{id}`
-   **Description**: Deletes a task.
-   **Path Parameters**: `id` (UUID)
-   **Response**: Empty, status 204 No Content or 404 Not Found

#### `POST /tasks/{id}/complete`
-   **Description**: Marks a task as complete.
-   **Path Parameters**: `id` (UUID)
-   **Response**: Updated `Task` object, status 200 OK or 404 Not Found

### Recurrence Pattern Management

#### `POST /recurrence-patterns`
-   **Description**: Creates a new recurrence pattern (typically as part of task creation).
-   **Request Body**: `RecurrencePattern` object (frequency, interval, startDate, etc.)
-   **Response**: `RecurrencePattern` object, status 201 Created

#### `PUT /recurrence-patterns/{id}`
-   **Description**: Updates an existing recurrence pattern.
-   **Path Parameters**: `id` (UUID)
-   **Request Body**: `RecurrencePattern` object (updatable fields)
-   **Response**: Updated `RecurrencePattern` object, status 200 OK or 404 Not Found

### Notification Management

#### `GET /notifications`
-   **Description**: Retrieves a user's notifications.
-   **Query Parameters**: `status`, `read`, `offset`, `limit`
-   **Response**: Array of `Notification` objects, status 200 OK

#### `PUT /notifications/{id}/read`
-   **Description**: Marks a notification as read.
-   **Path Parameters**: `id` (UUID)
-   **Response**: Updated `Notification` object, status 200 OK or 404 Not Found

### Agent Skill Invocation

#### `POST /agent-skills/{skillName}/invoke`
-   **Description**: Invokes a specific agent skill. (This would likely be an internal Dapr service invocation or binding trigger, but exposed for development/testing).
-   **Path Parameters**: `skillName` (string)
-   **Request Body**: Skill-specific payload (JSON)
-   **Response**: Skill-specific result, status 200 OK

## Dapr Integrations

-   **Service Invocation**: Services will communicate using Dapr service invocation (e.g., frontend to backend, backend to agent services).
-   **State Management**: Dapr state store will be used for persistent state where appropriate (e.g., managing task states, user preferences).
-   **Pub/Sub Messaging**: Dapr pub/sub will be used for event-driven communication (e.g., task created events, reminder trigger events) with Kafka/Redpanda as the underlying message broker.
-   **Bindings**: Dapr input/output bindings will be utilized, specifically for cron-like triggers for recurring tasks and reminders.
-   **Secrets Management**: Dapr secrets building block for secure access to sensitive configuration (e.g., database credentials, Redpanda connection strings).

## OpenAPI Specification (Future)

A detailed OpenAPI (Swagger) specification will be generated from the backend code to provide a machine-readable contract for all API endpoints. This will be located in this `contracts/` directory.
