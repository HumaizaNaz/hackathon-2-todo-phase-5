# Constitution for Hackathon II - Phase 4: Local Kubernetes Deployment

## Overview

This document outlines the principles and constraints for Phase 4 of Hackathon II. The goal is to deploy the Phase 3 Todo Chatbot on a local Kubernetes cluster using Minikube, Helm Charts, and a suite of AI-powered DevOps tools.

## Guiding Principles

### 1. Spec-Driven First
All development and deployment activities must begin with a clear specification. The workflow follows a strict sequence: **Specify -> Plan -> Tasks -> Implement**. This ensures that all actions are deliberate and aligned with the project goals.

### 2. Agentic Workflow
We will leverage an agentic workflow, utilizing AI DevOps tools to automate and assist in deployment. This includes:
- **kubectl-ai:** For interacting with the Kubernetes cluster using natural language.
- **kagent:** For automated Kubernetes operations.
- **Docker AI Agent (Gordon):** For containerization tasks, if available.

### 3. Simplicity
The project prioritizes simplicity to facilitate a zero-cost learning environment. Key aspects include:
- **Local-first Deployment:** All deployments will be on a local Minikube cluster.
- **Minimalism:** Avoid unnecessary complexity in both architecture and tooling.

## Constraints

- **Containerization:** The frontend and backend applications must be containerized using Docker. The Docker AI Agent (Gordon) should be used if available.
- **Helm Charts:** Helm charts for deployment must be created using `kubectl-ai` or `kagent`.
- **Deployment Target:** All deployments must be on a local Minikube instance.
- **No Manual Code:** Manual coding for deployment artifacts is disallowed. Instead, specifications should be refined and used with "Claude Code" (or a similar code generation model) to generate the necessary configurations.
- **Specification Refinement:** Continuously refine specifications for "Claude Code" to generate accurate and efficient deployment configurations.

## Constitution Check

All project artifacts, including specifications, code, and deployment configurations, must be reviewed for compliance with this constitution.

## Deliverables

- A monorepo containing:
  - Dockerfiles for all services.
  - Helm charts for deployment.
  - Specifications under `specs/phase4-kubernetes/`.
  - A `README.md` file with `kubectl` commands for deployment.
