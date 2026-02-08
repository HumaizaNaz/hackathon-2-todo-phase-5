# Docker Containerization Skill

## Purpose
Create production-ready Docker images for applications with proper security, optimization, and multi-stage builds.

## When to Use
- Containerizing applications for deployment
- Optimizing image sizes and build times
- Implementing security best practices
- Setting up multi-stage builds
- Configuring proper user permissions

## Configuration Steps

### 1. Multi-Stage Build Configuration
Create optimized Dockerfile with multiple stages:

```dockerfile
# Multi-stage build for Python applications
FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy Python dependencies from base stage
COPY --from=base /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=base /usr/local/bin /usr/local/bin

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Security Configuration
Implement security best practices:

```dockerfile
# Use non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

# Set secure permissions
RUN chmod -R 755 /app

# Use specific versions instead of latest
FROM python:3.11.7-slim

# Don't run as root
USER app
```

### 3. Optimization Techniques
Reduce image size and build time:

```dockerfile
# Multi-stage builds separate build tools from runtime
FROM base AS builder
# Install build dependencies, compile code

FROM production AS final
# Copy only necessary files from builder
COPY --from=builder /app/dist /app/dist
```

### 4. Environment Configuration
Handle environment variables properly:

```dockerfile
# Use environment variables for configuration
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Don't put secrets in Dockerfile
# Use runtime environment variables or mounted files instead
```

## Benefits
- Reduced image sizes and faster deployments
- Improved security posture
- Faster build times with layer caching
- Production-ready configurations
- Proper isolation and permissions

## Best Practices
- Use multi-stage builds to reduce attack surface
- Run as non-root user
- Pin base image versions
- Use .dockerignore to exclude unnecessary files
- Regular security scanning with tools like trivy
- Optimize layer caching by ordering commands properly