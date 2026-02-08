# MCP Server - Python Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system deps (safe for most Python libs)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Environment
ENV PYTHONUNBUFFERED=1

# Non-root user (best practice)
RUN useradd -m appuser
USER appuser

EXPOSE 8003

# Start MCP server
CMD ["python", "main.py"]
