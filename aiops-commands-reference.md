# Claude Code AIOps Commands for Todo AI Chatbot

This document provides the 3 ready-to-use Claude Code AIOps commands as requested:

## 1. Auto-scale pods based on CPU

```bash
kubectl-ai: Analyze the current CPU usage of all deployments in the todo-app namespace and suggest scaling recommendations. Auto-scale the backend deployment to handle increased load based on CPU utilization.
```

Command to execute:
```bash
kubectl-ai get pods -n todo-app --show-all
kubectl-ai suggest scale deployment/todo-chatbot-backend -n todo-app --cpu-threshold=70
```

## 2. kagent-style pod restart on failure

```bash
kubectl-ai: Find any pods in todo-app namespace that are in CrashLoopBackOff or Error state, and restart them. Use kagent-style commands to restart the AI agent pods if they're failing.
```

Command to execute:
```bash
kubectl-ai get pods -n todo-app --field-selector=status.phase!=Running
kubectl-ai restart pod -l app=ai-agent -n todo-app
```

## 3. Claude Code prompt for troubleshooting DB connection

```bash
kubectl-ai: Investigate why the backend pods in todo-app namespace might be having issues connecting to the Neon database. Check logs, network policies, and secret configurations. Troubleshoot DB connection issues systematically.
```

Command to execute:
```bash
kubectl-ai troubleshoot pod -l app=backend -n todo-app --context="database connection"
kubectl-ai logs -l app=backend -n todo-app --since=5m --context="neon db connection"
```

## How to Use These Commands

1. Make sure you have Claude Code installed and configured with kubectl-ai
2. Ensure your kubectl is pointing to the correct cluster
3. Run each command individually to perform the respective AIOps tasks
4. Monitor the results and adjust as needed