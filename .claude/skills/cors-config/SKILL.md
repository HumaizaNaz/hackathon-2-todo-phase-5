# CORS Configuration Skill

## Purpose
Configure Cross-Origin Resource Sharing (CORS) settings for FastAPI applications to allow communication between frontend and backend services in local Kubernetes deployments.

## When to Use
- Frontend cannot communicate with backend due to CORS policy violations
- "Access to fetch has been blocked by CORS policy" errors
- Need to allow specific origins for local development
- Setting up communication between services in Minikube/Kubernetes

## Configuration Steps

### 1. Update main.py in backend
Add or modify the CORS middleware configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local frontend development
        "http://127.0.0.1:3000",          # Alternative localhost
        "http://localhost:59649",         # Example Minikube frontend port
        "http://127.0.0.1:*",             # Allow any 127.0.0.1 port (for Minikube)
        "http://*.minikube.internal",     # Minikube internal domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # For development only - consider more restrictive settings for production
)
```

### 2. Environment-based Configuration
Consider using environment variables to control CORS settings:

```python
import os

# Get allowed origins from environment variable or use defaults
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Benefits
- Enables frontend-backend communication in local deployments
- Resolves CORS policy violations
- Allows flexible origin configuration for different environments
- Reusable across different deployment scenarios

## Security Considerations
- For production, use specific origins instead of wildcards
- Limit allowed methods and headers to only what's necessary
- Consider using more restrictive settings than the examples above