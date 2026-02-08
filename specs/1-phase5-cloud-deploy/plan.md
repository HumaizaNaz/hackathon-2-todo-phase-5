# Implementation Plan: Phase 5 Advanced Cloud Deployment

**Branch**: `1-phase5-cloud-deploy` | **Date**: 2026-02-08 | **Spec**: [specs/1-phase5-cloud-deploy/spec.md](specs/1-phase5-cloud-deploy/spec.md)
**Input**: Feature specification from `/specs/1-phase5-cloud-deploy/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the technical approach for implementing advanced and intermediate task management features (recurring tasks, reminders, priorities, tags, search/filter/sort) within the existing Phase 4 application. The core technical approach involves leveraging Dapr for building event-driven microservices with Kafka/Redpanda as the message broker, deploying the entire solution locally on Minikube, and to multi-cloud Kubernetes environments (DOKS/GKE/AKS) using GitHub Actions for CI/CD, with integrated monitoring and logging. Agent skills and subagents will be developed to support reusable logic, particularly for cron-based reminders.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), Node.js (Next.js 16+) with TypeScript/JavaScript (Frontend)  
**Primary Dependencies**: Dapr, Kafka/Redpanda, Helm, Minikube, GitHub Actions, FastAPI, SQLModel, PyJWT, Next.js, Tailwind CSS  
**Storage**: Neon DB (PostgreSQL compatible), Dapr State Management  
**Testing**: `pytest` (Backend), `Jest`, `React Testing Library` (Frontend)  
**Target Platform**: Kubernetes (Minikube, DOKS, GKE, AKS)  
**Project Type**: Monorepo (frontend, backend, mcp-server, ai-agent)  
**Performance Goals**: 
- Users can successfully create, modify, and manage recurring tasks with a recurrence pattern and due dates in under 60 seconds per task.
- Reminder notifications are delivered to users within 5 minutes of the scheduled reminder time 99.9% of the time.
- Search, filter, and sort operations on a task list containing up to 1000 tasks complete within 2 seconds.
- The entire application (frontend, backend, Dapr sidecars, Kafka/Redpanda) can be deployed to Minikube in under 5 minutes.
- The application can be successfully deployed to DOKS, GKE, and AKS via GitHub Actions with an end-to-end CI/CD pipeline completing within 15 minutes for minor code changes.
- All critical services report health and operational metrics to a central monitoring system with less than 30 seconds latency.
- Agent skills for cron reminders successfully trigger and process tasks with an accuracy of 100% based on the defined schedule.
**Constraints**: 
- All services MUST be Dockerized.
- Deployment relies on Kubernetes manifests and Helm charts.
- Minikube for local development.
- No manual infrastructure code outside of Spec-Kit Plus workflow.
- Claude Code for AIOps automation (kubectl-ai, kagent).
- Redpanda Cloud is the mandated Kafka solution.
- GitHub Actions is the standard for CI/CD.
- Dapr's full feature set MUST be utilized.
**Scale/Scope**: Advanced and intermediate task management features, event-driven architecture, local and multi-cloud Kubernetes deployment, CI/CD, monitoring, reusable agent skills, up to 1000 tasks for search/filter/sort.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-Driven First**: PASSED. This plan is directly derived from a detailed feature specification.
- **Agentic Workflow**: PASSED. The plan incorporates agent skills/subagents for reusable logic and Claude Code for AIOps.
- **Test-First (NON-NEGOTIABLE)**: PASSED. All implementations, including infrastructure, will follow TDD principles.
- **Simplicity**: PASSED. Minikube for local, Helm for packaging, Dapr for event-driven simplification, YAGNI applied to infra-as-code.
- **Reusable Intelligence**: PASSED. Cloud-native blueprints, reusable components, MCP SDK, agent skills/subagents are central.
- **Cloud-Native First**: PASSED. Containerization, Dapr/Kafka/Redpanda event-driven, Kubernetes manifests, Helm charts, multi-cloud deployment, observability are all core to the plan.

## Project Structure

### Documentation (this feature)

```text
specs/1-phase5-cloud-deploy/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
```text
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

mcp-server/
└── src/
    ├── services/
    └── api/

ai-agent/
└── src/
    ├── skills/
    └── services/
```

**Structure Decision**: Monorepo structure with distinct directories for `frontend`, `backend`, `mcp-server`, and `ai-agent` services, consistent with existing project architecture and enabling independent deployment with Dapr. This aligns with Option 2 extended for all services.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
|           |            |                                     |
