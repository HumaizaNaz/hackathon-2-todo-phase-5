# Multi-stage build for FastAPI backend
FROM python:3.11-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
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

# Dapr sidecar integration details:
# For local Dapr run: dapr run --app-id backend --app-port 8000 --dapr-http-port 3500 --dapr-grpc-port 50001 -- python main.py
# For Kubernetes deployment, these are usually handled by Dapr annotations on the deployment YAML.
# See kubernetes/backend/backend-deployment.yaml for annotations example.

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]