# Claude Code AIOps Prompts for Todo AI Chatbot

This document contains ready-to-use Claude Code prompts for managing the Todo AI Chatbot deployment with AIOps capabilities.

## 1. Auto-scaling Prompts

### Auto-scale pods based on CPU utilization
```
kubectl-ai: Analyze the current CPU usage of all deployments in the todo-app namespace and suggest scaling recommendations. Auto-scale the backend deployment to handle increased load based on CPU utilization.
```

### Auto-scale based on memory usage
```
kubectl-ai: Check memory usage across all pods in todo-app namespace and scale deployments that are approaching memory limits. Increase backend replica count if memory usage is above 70%.
```

### Horizontal Pod Autoscaler management
```
kubectl-ai: Create or update Horizontal Pod Autoscalers for all deployments in todo-app namespace. Set CPU threshold to 70% and memory threshold to 80% for all services.
```

## 2. Pod Restart & Management Prompts

### Restart pods on failure
```
kubectl-ai: Find any pods in todo-app namespace that are in CrashLoopBackOff or Error state, and restart them. Use kagent-style commands to restart the AI agent pods if they're failing.
```

### Selective pod restart
```
kubectl-ai: Restart only the pods that have been running for more than 24 hours in todo-app namespace. Focus on backend and ai-agent deployments first.
```

### Rolling restart of deployment
```
kubectl-ai: Perform a rolling restart of the frontend deployment in todo-app namespace, ensuring zero downtime during the restart process.
```

## 3. Troubleshooting Prompts

### Database connection troubleshooting
```
kubectl-ai: Investigate why the backend pods in todo-app namespace might be having issues connecting to the Neon database. Check logs, network policies, and secret configurations. Troubleshoot DB connection issues systematically.
```

### Pod crash investigation
```
kubectl-ai: Analyze the logs and events for crashed pods in todo-app namespace. Identify the root cause of crashes in the ai-agent deployment and suggest fixes for common issues.
```

### Performance troubleshooting
```
kubectl-ai: Analyze the performance of the Todo AI Chatbot deployment. Identify any bottlenecks in the communication between frontend, backend, and ai-agent services. Suggest optimizations.
```

## 4. Resource Optimization Prompts

### Resource allocation optimization
```
kubectl-ai: Analyze the current resource usage (CPU/memory) of all deployments in todo-app namespace and suggest optimal resource requests and limits for cost efficiency.
```

### Node resource management
```
kubectl-ai: Check if there are sufficient resources on the nodes to run all pods in todo-app namespace. Suggest resource adjustments if there are scheduling issues.
```

## 5. Health Monitoring Prompts

### Overall deployment health
```
kubectl-ai: Assess the overall health of the Todo AI Chatbot deployment in todo-app namespace. Check readiness/liveness probes, service connectivity, and pod status.
```

### Service connectivity check
```
kubectl-ai: Verify that all services in todo-app namespace can communicate with each other. Test connectivity between frontend, backend, mcp-server, and ai-agent services.
```

## 6. Security & Configuration Prompts

### Secret and configuration validation
```
kubectl-ai: Verify that all secrets and configmaps in todo-app namespace are properly configured and securely mounted to the appropriate deployments.
```

### Security posture assessment
```
kubectl-ai: Review the security configuration of the Todo AI Chatbot deployment. Check for any security best practices that might be missing.
```

## Usage Tips

- Replace `todo-app` with your actual namespace if different
- Add `--dry-run` to any command to simulate the action first
- Use `kubectl-ai explain <resource>` to get detailed information about any Kubernetes resource
- Combine multiple requests in a single prompt for more comprehensive analysis