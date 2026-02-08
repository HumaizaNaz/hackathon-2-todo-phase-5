# Kubernetes Deployment Configuration Skill

## Purpose
Configure and troubleshoot Kubernetes deployments for microservices applications, focusing on service connectivity, environment variables, and health checks.

## When to Use
- Deploying multi-service applications to Kubernetes/Minikube
- Troubleshooting service-to-service communication
- Configuring environment variables for inter-service communication
- Setting up health and readiness probes
- Managing service discovery between components

## Configuration Steps

### 1. Service Discovery Setup
Configure services to discover each other using Kubernetes DNS:

```yaml
# In deployment files, use Kubernetes service names for internal communication
env:
- name: BACKEND_URL
  value: "http://my-app-backend:8000"
- name: DATABASE_URL
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: database-url
```

### 2. Health Check Configuration
Set up proper health and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### 3. Service Configuration
Ensure services are properly exposed:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-backend
spec:
  selector:
    app: my-app-backend
  ports:
    - protocol: TCP
      port: 8000
      targetPort: 8000
  type: ClusterIP  # Internal service, not exposed externally
```

## Benefits
- Enables proper service-to-service communication in Kubernetes
- Ensures health checks work correctly
- Facilitates service discovery between components
- Improves deployment reliability

## Troubleshooting Tips
- Use `kubectl get svc` to verify service endpoints
- Use `kubectl logs` to check for connection issues
- Use `kubectl exec` to test service connectivity from within pods
- Check DNS resolution with `nslookup service-name`