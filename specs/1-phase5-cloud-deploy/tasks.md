# Development Tasks: Phase 5 Advanced Cloud Deployment

**Branch**: `1-phase5-cloud-deploy` | **Date**: 2026-02-08 | **Plan**: [specs/1-phase5-cloud-deploy/plan.md](specs/1-phase5-cloud-deploy/plan.md)
**Feature Spec**: [specs/1-phase5-cloud-deploy/spec.md](specs/1-phase5-cloud-deploy/spec.md)

## Summary

This document outlines the detailed development tasks for Phase 5 Advanced Cloud Deployment, broken down by user story and critical infrastructure components. The implementation will focus on building advanced task management features, leveraging Dapr and Kafka/Redpanda for event-driven architecture, and deploying to Kubernetes with GitHub Actions for CI/CD.

## Implementation Strategy

We will follow an MVP-first approach, prioritizing User Story 1 (Manage Recurring Tasks) and User Story 2 (Receive Due Date Reminders) due to their P1 status. Foundational Dapr and Kafka integration will be established early to support the event-driven architecture. Deployment tasks will be integrated throughout, starting with local Minikube setup and progressing to cloud deployments.

## Task Dependencies

-   **Phase 1: Setup** must be completed before any other phases.
-   **Phase 2: Foundational** must be completed before any User Story phases.
-   **User Story 1 (Manage Recurring Tasks)** and **User Story 2 (Receive Due Date Reminders)** can be developed largely in parallel with some foundational components.
-   **User Story 3 (Organize and Filter Tasks)** depends on the core task management functionality from US1 and US2.
-   **Phase 6: Deployment & Operations** tasks can be initiated early for Minikube, but full cloud deployment depends on completed application services.

## Parallel Execution Examples

-   Backend development for US1 (recurring tasks logic) can run in parallel with frontend development for US1 (UI for creating recurring tasks).
-   Dapr component configuration for state management can be done in parallel with Dapr component configuration for pub/sub.
-   Setting up the GitHub Actions CI pipeline can start in parallel with initial backend service development once Dockerfiles are ready.

---

## Phase 1: Setup

### Goal
Initialize the project environment and set up basic Dapr and Kafka/Redpanda components required across all services.

-   [X] T001 Configure monorepo structure with backend/, frontend/, mcp-server/, ai-agent/ directories
-   [X] T002 Create initial Dapr configuration files (e.g., `dapr/components/state.yaml`, `dapr/components/pubsub.yaml`) for local development
-   [X] T003 Set up local Kafka/Redpanda instance (e.g., via Docker Compose) in `docker-compose.yml`
-   [X] T004 Define initial Kubernetes manifests for core services (e.g., backend deployment, service) in `kubernetes/backend/`
-   [X] T005 Initialize Helm chart for the overall application in `helm/todo-chatbot/`

## Phase 2: Foundational

### Goal
Establish shared services, user authentication, and the basic application structure that all user stories will build upon.

-   [X] T006 Implement OAuth2/OpenID Connect authentication in `backend/src/services/auth_service.py`
-   [X] T007 Create User data model (if not already existing) in `backend/src/models/user.py`
-   [X] T008 Implement basic user management endpoints in `backend/src/api/user.py`
-   [X] T009 [P] Update existing Dockerfiles for backend, frontend, mcp-server, ai-agent to integrate Dapr sidecars
-   [X] T010 [P] Implement Dapr service invocation patterns for inter-service communication (e.g., `backend` to `ai-agent`)
-   [X] T011 [P] Configure Dapr state store for user preferences and general settings in `dapr/components/state.yaml`

## Phase 3: User Story 1 - Manage Recurring Tasks

### Goal
Enable users to create, view, and manage tasks that repeat on a defined schedule.

**Independent Test**: A user can create a recurring task with a specific schedule. The system automatically generates new instances of the task according to that schedule. This delivers value by reducing manual task creation.

-   [X] T012 [P] [US1] Create RecurrencePattern data model in `backend/src/models/recurrence_pattern.py`
-   [X] T013 [P] [US1] Extend Task data model with `recurrencePatternId` and `parentTaskId` in `backend/src/models/task.py`
-   [X] T014 [P] [US1] Implement service logic for creating and managing `RecurrencePattern` in `backend/src/services/recurrence_service.py`
-   [X] T015 [P] [US1] Implement service logic for generating new task instances based on `RecurrencePattern` in `backend/src/services/task_generation_service.py`
-   [X] T016 [P] [US1] Create API endpoint `POST /tasks` to support recurring task creation in `backend/src/api/task.py`
-   [X] T017 [P] [US1] Develop frontend UI component for defining recurrence patterns during task creation in `frontend/src/components/RecurringTaskForm.tsx`
-   [X] T018 [P] [US1] Integrate frontend with backend API for recurring task creation in `frontend/src/services/task_api.ts`
-   [X] T019 [US1] Develop frontend UI to display generated task instances in `frontend/src/pages/tasks.tsx`

## Phase 4: User Story 2 - Receive Due Date Reminders

### Goal
Allow users to set due dates for tasks and receive timely notifications.

**Independent Test**: A user can assign a due date to a task and set a reminder time. The system sends a notification to the user at the specified reminder time. This delivers value by preventing missed deadlines.

-   [X] T020 [P] [US2] Extend Task data model with `dueDate` and `reminderSettings` (embedded) in `backend/src/models/task.py`
-   [X] T021 [P] [US2] Create Notification data model in `backend/src/models/notification.py`
-   [X] T022 [P] [US2] Implement service logic for scheduling and sending notifications in `backend/src/services/notification_service.py`
-   [X] T023 [P] [US2] Implement a Dapr output binding for chosen notification mechanism (e.g., email, push) in `dapr/components/bindings.yaml`
-   [X] T024 [P] [US2] Create Dapr input binding (cron) for triggering reminder checks in `dapr/components/bindings.yaml`
-   [X] T025 [P] [US2] Develop AgentSkill for cron-based reminder generation in `ai-agent/src/skills/reminder_skill.py`
-   [X] T026 [P] [US2] Create API endpoints for managing reminder settings (`PUT /tasks/{id}`) and notifications (`GET /notifications`, `PUT /notifications/{id}/read`) in `backend/src/api/task.py` and `backend/src/api/notification.py`
-   [X] T027 [P] [US2] Develop frontend UI components for setting due dates and reminder preferences in `frontend/src/components/TaskForm.tsx`
-   [X] T028 [P] [US2] Develop frontend UI to display notifications in `frontend/src/components/NotificationCenter.tsx`

## Phase 5: User Story 3 - Organize and Filter Tasks

### Goal
Enable users to assign priorities and tags, and then efficiently search, filter, and sort their tasks.

**Independent Test**: A user can add a priority and multiple tags to a task. They can then use search and filter functions to quickly locate tasks based on these attributes. This delivers value by enhancing task organization.

-   [X] T029 [P] [US3] Extend Task data model with `priority` and `tags` fields in `backend/src/models/task.py`
-   [X] T030 [P] [US3] Implement backend service logic for searching, filtering, and sorting tasks in `backend/src/services/task_query_service.py`
-   [X] T031 [P] [US3] Enhance `GET /tasks` API endpoint to accept search, filter, and sort parameters in `backend/src/api/task.py`
-   [X] T032 [P] [US3] Develop frontend UI components for assigning priorities and tags in `frontend/src/components/TaskForm.tsx`
-   [X] T033 [P] [US3] Implement frontend search bar and filter/sort controls in `frontend/src/components/TaskListControls.tsx`
-   [X] T034 [US3] Integrate frontend with enhanced `GET /tasks` API for dynamic task display in `frontend/src/services/task_api.ts`

## Phase 6: Deployment & Operations

### Goal
Ensure the application can be deployed locally (Minikube) and to cloud Kubernetes environments (DOKS/GKE/AKS) with robust CI/CD, monitoring, and logging.

-   [X] T035 Configure `docker-compose.yml` for full local Minikube deployment including Dapr, Kafka/Redpanda
-   [X] T036 Refine Kubernetes manifests for all services (backend, frontend, mcp-server, ai-agent) in `kubernetes/`
-   [ ] T037 Develop Helm charts for deploying the entire application to Kubernetes in `helm/todo-chatbot/`
-   [ ] T038 Create GitHub Actions workflow for CI (build, test, Docker image push) in `.github/workflows/ci.yml`
-   [ ] T039 Create GitHub Actions workflow for CD to DOKS/GKE/AKS (Helm deploy) in `.github/workflows/cd.yml`
-   [ ] T040 Integrate monitoring solution (e.g., Prometheus/Grafana) into Kubernetes deployments
-   [ ] T041 Implement centralized logging (e.g., Fluentd/Elasticsearch/Kibana) for all services

## Phase 7: Polish & Cross-Cutting Concerns

### Goal
Address remaining quality, performance, and cross-cutting concerns to ensure a robust and user-friendly application.

-   [ ] T042 Implement comprehensive error handling and user feedback mechanisms across frontend and backend
-   [ ] T043 Optimize application for performance based on success criteria (SC-001, SC-002, SC-003)
-   [ ] T044 Conduct security review and implement necessary security best practices (e.g., input validation, secure configurations)
-   [ ] T045 Create `README.md` with detailed deployment instructions for local and cloud environments
-   [ ] T046 Finalize documentation for API, data model, and agent skills