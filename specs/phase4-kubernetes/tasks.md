# Tasks: Local Kubernetes Deployment

**Input**: Design documents from `specs/phase4-kubernetes/`
**Prerequisites**: plan.md

## Phase 1: Setup

**Purpose**: Prepare the environment for Kubernetes deployment.

- [ ] T001 Install Minikube on the local machine.
- [ ] T002 Install `kubectl` on the local machine.
- [ ] T003 Install Helm on the local machine.
- [ ] T004 Start Minikube cluster using `minikube start`.
- [x] T005 Create the `kubernetes` directory at the root of the project.
- [x] T006 Create the `helm` directory at the root of the project.

---

## Phase 2: User Story 1 - Containerize the Application

**Goal**: Create Dockerfiles for the frontend and backend services and build the Docker images.

**Independent Test**: The Docker images for `frontend` and `backend` can be built successfully using `docker build`.

### Implementation for User Story 1

- [x] T007 [US1] Create a `Dockerfile` for the backend service in the `backend/` directory.
- [x] T008 [US1] Create a `Dockerfile` for the frontend service in the `frontend/` directory.
- [x] T009 [P] [US1] Build the Docker image for the backend service.
- [x] T010 [P] [US1] Build the Docker image for the frontend service.
- [x] T011 [US1] Push the Docker images to a container registry (or load them into Minikube's Docker daemon).

---

## Phase 3: User Story 2 - Create Kubernetes Manifests

**Goal**: Create the Kubernetes manifest files for all services, including deployments and services.

**Independent Test**: The Kubernetes manifests are syntactically correct and can be applied to the cluster using `kubectl apply -f <file> --dry-run=client`.

### Implementation for User Story 2

- [x] T012 [P] [US2] Create a Kubernetes `Deployment` manifest for the backend service in `kubernetes/backend/deployment.yaml`.
- [x] T013 [P] [US2] Create a Kubernetes `Service` manifest for the backend service in `kubernetes/backend/service.yaml`.
- [x] T014 [P] [US2] Create a Kubernetes `Deployment` manifest for the frontend service in `kubernetes/frontend/deployment.yaml`.
- [x] T015 [P] [US2] Create a Kubernetes `Service` manifest for the frontend service in `kubernetes/frontend/service.yaml`.
- [x] T016 [P] [US2] Create a Kubernetes `StatefulSet` and `Service` for the PostgreSQL database in `kubernetes/database/statefulset.yaml`.

---

## Phase 4: User Story 3 - Create Helm Chart

**Goal**: Package the Kubernetes manifests into a reusable Helm chart.

**Independent Test**: The Helm chart can be successfully packaged using `helm package`. The chart can be linted without errors using `helm lint`.

### Implementation for User Story 3

- [x] T017 [US3] Create a new Helm chart named `todo-chatbot` in the `helm/` directory using `helm create todo-chatbot`.
- [x] T018 [US3] Replace the generated template files in `helm/todo-chatbot/templates/` with the manifests from the `kubernetes/` directory.
- [x] T019 [US3] Parameterize the manifests using Go template syntax in the Helm templates.
- [x] T020 [US3] Configure the default values for the chart in `helm/todo-chatbot/values.yaml`.
- [ ] T021 [US3] Lint the Helm chart using `helm lint helm/todo-chatbot`.

---

## Phase 5: User Story 4 - Deploy and Verify

**Goal**: Deploy the application to the Minikube cluster using the Helm chart and verify that it is running correctly.

**Independent Test**: The application is accessible from the browser, and all functionalities are working as expected.

### Implementation for User Story 4

- [x] T022 [US4] Deploy the application using the Helm chart with `helm install todo-chatbot helm/todo-chatbot`.
- [x] T023 [US4] Check the status of the deployed pods, services, and deployments using `kubectl get all`.
- [x] T024 [US4] Port-forward the frontend service to access the application from the local machine.
- [x] T025 [US4] Verify that the application is accessible in the browser and that all features are working.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and cleanup.

- [x] T026 Update the main `README.md` with instructions on how to deploy the application using Minikube and Helm.
- [x] T027 Create the `quickstart.md` document in `specs/phase4-kubernetes/` with detailed deployment steps.

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: Must be completed first.
- **Containerize (Phase 2)**: Depends on Setup.
- **Kubernetes Manifests (Phase 3)**: Depends on Containerize.
- **Helm Chart (Phase 4)**: Depends on Kubernetes Manifests.
- **Deploy and Verify (Phase 5)**: Depends on Helm Chart.
- **Polish (Phase 6)**: Depends on Deploy and Verify.
