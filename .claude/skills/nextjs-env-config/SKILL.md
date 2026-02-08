# Next.js Environment Configuration Skill

## Purpose
Configure environment variables for Next.js applications to ensure proper communication with backend services in different deployment environments (development, staging, production).

## When to Use
- Deploying Next.js frontend to different environments
- Configuring API endpoints for local Kubernetes vs cloud deployments
- Setting up environment-specific configurations
- Resolving "NEXT_PUBLIC_*" variable issues
- Connecting frontend to backend services in Minikube

## Configuration Steps

### 1. Environment Variable Declaration
Properly declare environment variables in Next.js applications:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Static environment variables (available at build time)
    // Dynamic variables should be passed through environment
  },

  // For API routes, you can access server-side environment variables
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL + '/api/:path*', // Proxy to backend
      },
    ]
  }
}

module.exports = nextConfig
```

### 2. Client-Side Environment Variables
Use NEXT_PUBLIC_ prefix for client-side accessible variables:

```javascript
// In your React components
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Example API call
const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(credentials),
});
```

### 3. Environment-Specific Configuration
Configure different environments:

```bash
# Development (.env.development)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Production (.env.production)
NEXT_PUBLIC_BACKEND_URL=https://api.yourapp.com
NEXT_PUBLIC_API_VERSION=v1

# Minikube local deployment (.env.local)
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:32755
NEXT_PUBLIC_API_VERSION=v1
```

### 4. Docker Environment Configuration
Configure environment variables in Docker container:

```dockerfile
# Dockerfile for Next.js frontend
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# ... dependency installation steps

# Build the application
FROM base AS builder
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
# ... build steps

# Production image
FROM base AS runner
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-http://localhost:8000}
# ... runtime steps
```

### 5. Kubernetes Environment Configuration
Set environment variables in Kubernetes deployments:

```yaml
# Kubernetes deployment with environment variables
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: frontend:latest
        env:
        - name: NEXT_PUBLIC_BACKEND_URL
          value: "http://127.0.0.1:32755"  # Minikube service URL
        - name: NEXT_PUBLIC_API_VERSION
          value: "v1"
        ports:
        - containerPort: 3000
```

## Advanced Configuration

### 6. Runtime Environment Configuration
For dynamic configuration in Kubernetes:

```yaml
# Using downward API to inject pod/service information
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: frontend
        image: frontend:latest
        env:
        - name: NEXT_PUBLIC_BACKEND_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: backend-url
        - name: NEXT_PUBLIC_NODE_ENV
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
```

### 7. Environment Validation
Validate environment variables at startup:

```javascript
// utils/envValidator.js
const requiredEnvVars = [
  'NEXT_PUBLIC_BACKEND_URL',
];

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// In your application startup
if (typeof window !== 'undefined') {
  validateEnvironment();
}
```

## Benefits
- Proper environment variable handling in Next.js applications
- Dynamic configuration for different deployment environments
- Secure handling of sensitive data
- Consistent API endpoint configuration
- Support for local development and production deployments

## Best Practices
- Always prefix client-side variables with NEXT_PUBLIC_
- Use different environment files for different stages
- Validate required environment variables at startup
- Never hardcode API URLs in source code
- Use Kubernetes ConfigMaps for environment-specific configurations
- Implement fallback values for missing environment variables