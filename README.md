# Todo Chatbot - Phase 5 Advanced Cloud Deployment

## Project Overview

This project represents Phase 5 of a Todo Chatbot application, focusing on advanced features and robust cloud-native deployment. It implements advanced task management functionalities such as recurring tasks, due date reminders, and comprehensive search/filter/sort options. The architecture leverages Dapr for building event-driven microservices, Kafka/Redpanda as the core message broker, and deploys to Kubernetes environments (Minikube locally, DOKS/GKE/AKS in the cloud) with automated CI/CD using GitHub Actions, and integrated monitoring/logging.

**Key Features:**
- **Advanced Task Management**: Recurring tasks, customizable due dates and reminders.
- **Task Organization**: Priorities, tags, search, filter, and sort capabilities.
- **Event-Driven Architecture**: Dapr for inter-service communication, state management, pub/sub, bindings, and secrets.
- **Messaging**: Kafka/Redpanda as the central message broker.
- **Cloud-Native Deployment**: Dockerized services, Kubernetes manifests, Helm charts.
- **Automated CI/CD**: GitHub Actions for building, testing, and deploying to Kubernetes.
- **Observability**: Placeholders for Prometheus/Grafana monitoring and centralized logging.
- **Agentic Workflow**: Integration of AI Agent skills for automated processes (e.g., cron-based reminders).

## Local Development Setup

### Prerequisites

- Docker Desktop (or Docker Engine)
- Docker Compose
- Node.js (v18+) & npm (or yarn)
- Python (v3.11+) & pip
- Dapr CLI: `dapr init` (ensure Dapr runtime is installed and running locally)
- Minikube: `minikube start` (ensure local Kubernetes cluster is running)
- Helm: `helm init` (if not already initialized)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd phase-5
```

### 2. Environment Variables

Create `.env` files in the `backend/`, `frontend/`, `mcp-server/`, and `ai-agent/` directories based on their respective `.env.example` (if provided) or create them as needed.
Minimum required for `backend/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
OPENAI_API_KEY="your_openai_api_key"
```

### 3. Run Services with Docker Compose (Local Development without Dapr sidecars)

For quick local development *without* Dapr sidecar injection (useful for initial service development):

```bash
docker-compose up --build
```
This will bring up `frontend`, `backend`, `mcp-server`, `ai-agent`, and `redpanda` services.

### 4. Run Services with Dapr (Local Minikube Deployment)

To run the application with Dapr sidecars locally on Minikube:

1.  **Start Minikube**:
    ```bash
    minikube start
    ```

2.  **Install Dapr on Minikube**:
    ```bash
    dapr init -k
    ```

3.  **Apply Dapr Components**:
    ```bash
    kubectl apply -f dapr/components/state.yaml
    kubectl apply -f dapr/components/pubsub.yaml
    kubectl apply -f dapr/components/bindings.yaml
    ```

4.  **Deploy Redpanda to Minikube**:
    You'll need a Kubernetes-native Kafka/Redpanda deployment. This can be done via a Helm chart.
    (Example using a simplified Redpanda deployment - a full Redpanda cluster may require a dedicated operator/chart)
    ```bash
    helm repo add redpanda https://charts.redpanda.com/
    helm install redpanda redpanda/redpanda --namespace default --create-namespace
    ```
    Verify Redpanda service: `kubectl get svc redpanda`

5.  **Build Docker Images (if not already built by CI)**:
    ```bash
    docker build -t frontend:latest ./frontend
    docker build -t backend:latest ./backend
    docker build -t mcp-server:latest ./mcp-server
    docker build -t ai-agent:latest ./ai-agent
    ```
    Ensure these images are available in your Minikube Docker daemon:
    ```bash
    eval $(minikube docker-env)
    docker build -t frontend:latest ./frontend
    docker build -t backend:latest ./backend
    docker build -t mcp-server:latest ./mcp-server
    docker build -t ai-agent:latest ./ai-agent
    eval $(minikube docker-env -u) # Exit Minikube Docker environment
    ```

6.  **Deploy Application to Minikube using Helm**:
    ```bash
    helm upgrade --install todo-chatbot ./helm/todo-chatbot --namespace default --create-namespace
    ```

7.  **Access the Application**:
    ```bash
    minikube service frontend --url
    ```
    This will provide the URL to access the frontend.

## Cloud Deployment (DOKS/GKE/AKS)

Deployment to a cloud Kubernetes cluster (DigitalOcean Kubernetes, Google Kubernetes Engine, Azure Kubernetes Service) will be automated using GitHub Actions.

### Prerequisites (Cloud)

-   A running Kubernetes cluster on DOKS/GKE/AKS.
-   `kubectl` configured to connect to your cluster.
-   GitHub repository with configured `secrets`:
    -   `DOCKER_USERNAME`, `DOCKER_PASSWORD` (for Docker Hub or other registry)
    -   `KUBE_CONFIG_DATA`: Base64 encoded `kubeconfig` file for your cluster.
    -   `KUBE_CLUSTER_NAME`, `KUBE_CONTEXT_NAME` (as per your `kubeconfig`)

### CI/CD with GitHub Actions

-   **CI Workflow (`.github/workflows/ci.yml`)**: Automatically builds and pushes Docker images to your configured registry on every push/pull request to `main`.
-   **CD Workflow (`.github/workflows/cd.yml`)**: Automatically deploys the application to your Kubernetes cluster using Helm on every push to `main` (after CI success).

## Usage

1.  Access the frontend application via the provided URL.
2.  Use the task creation form to add new tasks, including recurring tasks and reminder settings.
3.  Utilize the search, filter, and sort controls to manage your task list.
4.  Monitor notifications in the Notification Center.

## Further Development & Cleanup

-   **Database Migration**: Implement database migrations for schema changes (e.g., using Alembic for Python backend).
-   **Security**: Ensure proper secret management in Kubernetes (e.g., using `external-secrets` or native Kubernetes secrets with sealed secrets).
-   **Monitoring & Logging**: Set up actual Prometheus/Grafana and centralized logging solutions using the placeholder manifests in `kubernetes/monitoring` and `kubernetes/logging`.
-   **Advanced Dapr**: Explore more Dapr features like input bindings for notifications, distributed tracing.
-   **Agent Skills**: Expand AI Agent capabilities and integrate more complex skills.