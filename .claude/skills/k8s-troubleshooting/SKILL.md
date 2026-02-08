# Kubernetes Troubleshooting Skill

## Purpose
Diagnose and resolve common issues in Kubernetes deployments, particularly for microservices applications deployed in Minikube environments.

## When to Use
- Pods are in CrashLoopBackOff or Error states
- Services are not accessible from outside the cluster
- Pods cannot communicate with each other
- Health checks are failing
- Configuration issues with deployments
- Networking problems in local Kubernetes clusters

## Troubleshooting Steps

### 1. Pod Status Investigation
Check pod status and events for immediate issues:

```bash
# Get basic pod status
kubectl get pods

# Get detailed pod information
kubectl describe pod <pod-name>

# Check pod logs
kubectl logs <pod-name>

# Check previous container logs if restarted
kubectl logs <pod-name> --previous
```

### 2. Service Connectivity Issues
Verify service configuration and connectivity:

```bash
# Check if service is created properly
kubectl get svc

# Describe service for details
kubectl describe svc <service-name>

# Test internal connectivity from another pod
kubectl exec -it <pod-name> -- nslookup <service-name>

# For Minikube, get service URL
minikube service <service-name> --url
```

### 3. Configuration Problems
Validate deployment configurations:

```bash
# Check deployment configuration
kubectl get deployment <deployment-name> -o yaml

# Check if environment variables are set correctly
kubectl describe deployment <deployment-name>

# Verify secrets and configmaps exist
kubectl get secrets
kubectl get configmap
```

### 4. Health Check Failures
Address liveness and readiness probe issues:

```bash
# Check if health endpoints are accessible
kubectl port-forward <pod-name> 8080:8000
curl http://localhost:8080/health

# Verify probe configuration
kubectl describe pod <pod-name>
# Look for Liveness/Readiness probe settings
```

### 5. Resource Constraints
Check for resource-related issues:

```bash
# Check resource usage
kubectl top nodes
kubectl top pods

# Check for resource quota issues
kubectl describe pod <pod-name>
# Look for FailedScheduling events
```

## Common Solutions

### For CrashLoopBackOff:
- Check application startup logs for errors
- Verify environment variables and secrets are available
- Confirm the application can connect to dependencies (database, etc.)
- Check if the container has the correct permissions

### For ImagePullBackOff:
- Verify image name and tag are correct
- Check if image exists in registry
- Confirm imagePullSecrets if using private registries

### For ImageInspectError:
- Check if image is compatible with node architecture
- Verify image isn't corrupted

## Benefits
- Systematic approach to identifying deployment issues
- Efficient problem resolution
- Understanding of common Kubernetes patterns
- Faster debugging of service connectivity issues

## Troubleshooting Checklist
- [ ] Pod status and restart count
- [ ] Pod events for scheduling issues
- [ ] Container logs for application errors
- [ ] Service configuration and endpoints
- [ ] Network policies blocking traffic
- [ ] Resource limits and requests
- [ ] Environment variables and secrets
- [ ] Health check configurations
- [ ] Storage volume mounts (if applicable)