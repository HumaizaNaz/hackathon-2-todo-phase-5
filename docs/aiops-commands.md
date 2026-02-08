# AIOps Commands for Todo AI Chatbot

This document provides examples of Claude Code AIOps commands for managing the Todo AI Chatbot deployment on Kubernetes.

## Common Operations

### Getting Information
```bash
# Get cluster status
kubectl-ai get nodes

# Get all pods in the todo-app namespace
kubectl-ai get pods -n todo-app

# Describe a problematic pod
kubectl-ai describe pod <pod-name> -n todo-app

# Get deployment status
kubectl-ai get deployments -n todo-app
```

### Troubleshooting
```bash
# Troubleshoot a failing pod
kubectl-ai troubleshoot pod/<pod-name> -n todo-app

# Get logs from a specific service
kubectl-ai logs deployment/<deployment-name> -n todo-app

# Explain resource usage
kubectl-ai top pods -n todo-app
```

### Scaling Operations
```bash
# Scale a deployment
kubectl-ai scale deployment/frontend-deployment -n todo-app --replicas=3

# Get recommendations for resource optimization
kubectl-ai suggest resources deployment/backend-deployment -n todo-app
```

### Deployment Management
```bash
# Apply configuration changes
kubectl-ai apply -f <manifest-file> --dry-run=server

# Rollback a deployment
kubectl-ai rollout undo deployment/<deployment-name> -n todo-app

# Check rollout status
kubectl-ai rollout status deployment/<deployment-name> -n todo-app
```

## Claude Code Prompts

### Common Queries
- "kubectl-ai: Show me the status of all pods in the todo-app namespace"
- "kubectl-ai: Why is the backend pod failing?"
- "kubectl-ai: How do I scale the frontend to 3 replicas?"
- "kubectl-ai: What are the resource limits for the AI agent?"
- "kubectl-ai: Rollback the last deployment of the backend service"

### Advanced Queries
- "kubectl-ai: Analyze the resource usage of the todo-chatbot and suggest optimizations"
- "kubectl-ai: What's causing high CPU usage in the ai-agent pods?"
- "kubectl-ai: How can I set up horizontal pod autoscaling for the frontend?"