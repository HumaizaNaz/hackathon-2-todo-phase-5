# Quickstart: Local Kubernetes Deployment for Todo Chatbot

This document provides a quick guide to deploying the Todo Chatbot application on a local Kubernetes cluster using Minikube and Helm.

## Prerequisites

Ensure you have the following tools installed on your local machine:

-   **Docker Desktop or Docker Engine**: For building and managing Docker images.
-   **Minikube**: For running a local Kubernetes cluster.
    *   Installation guide: [https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/)
-   **Helm 3.x**: For packaging and deploying applications on Kubernetes.
    *   Installation guide: [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)
-   **kubectl**: The Kubernetes command-line tool.
    *   Installation guide: [https://kubernetes.io/docs/tasks/tools/install-kubectl/](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
-   **Git**: For cloning the repository.

## Deployment Steps

Follow these steps to get the Todo Chatbot running on your local Minikube cluster:

### 1. Start Minikube Cluster

Open your terminal and start the Minikube cluster:

```bash
minikube start
```

### 2. Enable Required Addons

Enable the `ingress` and `metrics-server` addons in Minikube, which are often required for application functionality and monitoring:

```bash
minikube addons enable ingress
minikube addons enable metrics-server
```

### 3. Build Docker Images

Navigate to your project root directory and build the Docker images for the frontend and backend services. These images will be used by Kubernetes.

```bash
# Build backend
docker build -t backend:latest ./backend/

# Build frontend
docker build -t frontend:latest ./frontend/
```

### 4. Load Images into Minikube

Load the newly built Docker images directly into Minikube's Docker daemon. This avoids the need to push them to an external registry for local development.

```bash
minikube image load backend:latest
minikube image load frontend:latest
```

### 5. Deploy Using Helm Chart

Navigate to the `helm/todo-chatbot` directory within your project and install the Helm chart. This will deploy all application components (backend, frontend, database) to your Minikube cluster.

```bash
cd helm/todo-chatbot

helm install todo-chatbot .
```

### 6. Access the Application

Once deployed, you can access the frontend application. Minikube can expose the service URL directly:

```bash
minikube service todo-chatbot-frontend --url
```

Copy the URL provided by the command and paste it into your web browser. You should see the Todo Chatbot application running.

## Cleanup

To remove the deployed application and stop Minikube:

```bash
helm uninstall todo-chatbot

minikube stop
```
