# Frontend-Backend Connectivity Skill

## Purpose
Establish and troubleshoot communication between frontend and backend services in Kubernetes deployments, particularly addressing CORS and networking issues in local development environments.

## When to Use
- Frontend application cannot communicate with backend API
- CORS policy violations prevent API calls
- "Failed to fetch" errors in browser console
- Authentication or API calls failing due to connectivity issues
- Transitioning from cloud deployment to local Kubernetes deployment
- Configuring service-to-service communication in Minikube

## Configuration Steps

### 1. CORS Configuration in Backend
Configure Cross-Origin Resource Sharing settings in FastAPI application:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local development
        "http://127.0.0.1:3000",          # Alternative localhost
        "http://localhost:*",              # Allow any localhost port
        "http://127.0.0.1:*",              # Allow any 127.0.0.1 port
        "https://your-frontend-domain.com", # Production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # For development only - use more restrictive settings for production
)
```

### 2. Environment Variable Configuration
Set proper environment variables for API communication:

```javascript
// In frontend application (for Next.js)
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
      ? 'https://your-backend-domain.com'
      : 'http://127.0.0.1:32755'  // NodePort from Minikube
  }
}

// For development
NEXT_PUBLIC_API_URL=http://127.0.0.1:32755
```

### 3. Kubernetes Service Configuration
Ensure services are properly configured for internal and external access:

```yaml
# Backend service (ClusterIP for internal access)
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
  type: ClusterIP

# For external access (LoadBalancer or NodePort)
apiVersion: v1
kind: Service
metadata:
  name: my-app-backend-external
spec:
  selector:
    app: my-app-backend
  ports:
    - protocol: TCP
      port: 8000
      targetPort: 8000
      nodePort: 32755  # Specify NodePort for access
  type: NodePort
```

### 4. Deployment Environment Variables
Configure deployments with correct backend URLs:

```yaml
# Frontend deployment with backend URL
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: frontend
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "http://127.0.0.1:32755"  # Backend service URL
```

## Troubleshooting Steps

### 1. Verify Service Connectivity
```bash
# Check if services are running
kubectl get svc

# Test backend endpoint directly
kubectl port-forward service/my-app-backend 8000:8000
curl http://localhost:8000/health

# Check if frontend can access backend internally
kubectl exec -it <frontend-pod> -- curl http://my-app-backend:8000/health
```

### 2. Check CORS Headers
```bash
# Verify CORS headers in API response
curl -H "Origin: http://127.0.0.1:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://127.0.0.1:32755/
```

### 3. Browser Developer Tools
- Check Network tab for failed API requests
- Look for CORS errors in Console
- Verify request headers and response headers

## Benefits
- Enables proper frontend-backend communication
- Resolves CORS policy violations
- Facilitates development in local Kubernetes environments
- Provides systematic approach to connectivity issues
- Supports both development and production configurations

## Security Considerations
- In production, use specific origins instead of wildcards
- Implement proper authentication and authorization
- Use HTTPS for production environments
- Consider using API Gateway for production deployments