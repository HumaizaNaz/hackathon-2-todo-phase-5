<!--
Sync Impact Report:
Version change: 1.1.0 → 1.2.0
Modified principles: Spec-Driven First, Agentic Workflow, Simplicity, Reusable Intelligence, Cloud-Native First
Added sections: N/A (modifying existing sections)
Removed sections: N/A
Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md, .specify/commands/*.md
Follow-up TODOs: Suggest moving this constitution to specs/phase5-advanced-cloud/constitution.md if it is feature-specific.
-->
# Phase 5 Advanced Cloud Deployment Constitution

## Core Principles

### Spec-Driven First
Every advanced feature and cloud deployment starts with a specification document. Specifications MUST include detailed cloud-native blueprints before implementation. We strictly follow the Specify → Plan → Tasks → Implement workflow, with strong emphasis on infrastructure-as-code specifications.

### Agentic Workflow
We leverage a custom agent loop for cost-efficient LLM utilization. Reusable Intelligence is paramount, achieved through the development of robust agent skills and subagents for advanced features like reminders and recurring tasks. We utilize the official MCP SDK for standardized tool integration. Claude Code is employed for AIOps (e.g., kubectl-ai, kagent) to manage and automate cloud-native deployments across various platforms.

### Test-First (NON-NEGOTIABLE)
Test-Driven Development (TDD) is mandatory. Tests are written, user-approved, and fail before any implementation begins. A strict Red-Green-Refactor cycle is enforced for both application and infrastructure code, ensuring reliability and maintainability.

### Simplicity
We advocate for Minikube for streamlined local development and Helm for packaging and deployment. We embrace Dapr for simplifying event-driven architecture components, including pub/sub messaging, state management, resource bindings, secrets management, and service invocation, minimizing cloud-native complexity. YAGNI principles are rigorously applied to infrastructure as code.

### Reusable Intelligence
Cloud-native blueprints are central to our spec-driven deployment strategy. Components are designed for maximum reuse across diverse environments. The MCP SDK ensures standardized interfaces for our tools. We develop blueprint libraries for common deployment patterns and leverage agent skills and subagents for features like intelligent reminders and recurring event handling.

### Cloud-Native First
A containerization-first approach is mandatory for all services. We implement event-driven architectures utilizing Kafka/Redpanda and Dapr. Infrastructure is defined as code with Kubernetes manifests and packaged via Helm charts. We design for multi-cloud deployment (DOKS/GKE/AKS) and integrate robust cloud-native observability and monitoring patterns.

## Technical Constraints

All services (frontend, backend, mcp-server, ai-agent) MUST be Dockerized. Deployment relies on Kubernetes manifests and Helm charts for packaging. Minikube is the designated platform for local development. We prohibit manual infrastructure code outside of the Spec-Kit Plus workflow. Claude Code is used for AIOps automation, including kubectl-ai and kagent for cluster operations. All specs for cloud-native deployment must be refined using Claude Code. Redpanda Cloud is the mandated Kafka solution, and GitHub Actions is the standard for CI/CD. Dapr's full feature set MUST be utilized to simplify development.

## Development Workflow

Our workflow emphasizes refining specs for advanced cloud-native compatibility and event-driven patterns. We maintain a monorepo structure, including `docker-compose.yml`, `k8s/` manifests, and `helm/` charts. Cloud-native blueprint development is a core activity. We follow spec-driven deployment patterns and deeply integrate AIOps for operational tasks. Containerization of all services (frontend, backend, mcp-server, ai-agent) is a prerequisite for deployment.

## Governance

This Constitution supersedes all other practices and guidelines. Amendments require formal documentation and approval processes. All implementations MUST strictly comply with the Spec-Driven approach. Any architectural complexity MUST be thoroughly justified. We mandate the use of Claude Code for all development and operational tasks. Cloud-native blueprints MUST be meticulously maintained and designed for reusability. Infrastructure changes are subject to the same TDD principles as application code.

**Version**: 1.2.0 | **Ratified**: 2026-01-15 | **Last Amended**: 2026-02-08