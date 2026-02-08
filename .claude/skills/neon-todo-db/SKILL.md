# Neon PostgreSQL Database Skill for Todo AI Chatbot

## Purpose
Specialized skill for managing Neon PostgreSQL database operations specifically for the Todo AI Chatbot application, including schema management, connection optimization, and deployment workflows in Kubernetes environments.

## When to Use
- Setting up Neon database connections for the Todo AI Chatbot backend
- Optimizing database connections for serverless Kubernetes deployments
- Managing database schema for task, user, and session tables
- Handling Neon-specific connection pooling in containerized environments
- Implementing database migrations for the Todo application
- Troubleshooting database connectivity in Minikube/Kubernetes deployments
- Managing database branches for development and preview environments

## Configuration Options

### 1. Connection Type Selection
Choose the appropriate connection strategy:

```yaml
connection_type: pooled          # Recommended for serverless/containers (Neon's pooled connections)
connection_type: direct          # For migrations and admin tasks
```

### 2. Environment Configuration
Specify the target environment:

```yaml
environment: development        # Local development with Neon
environment: kubernetes        # Kubernetes/Minikube deployment
environment: production        # Production deployment
```

## Implementation Steps

### 1. Neon Database Connection Setup
Configure Neon connections for the Todo AI Chatbot backend:

```python
# backend/core/db.py equivalent for Neon
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

# Use pooled connection string for serverless/containerized environments
DATABASE_URL = os.getenv("DATABASE_URL")  # Should be the pooled connection string

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### 2. Neon-Specific Environment Variables
Configure environment variables for Neon database:

```bash
# For Kubernetes deployments (in secrets/configmaps)
DATABASE_URL="postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require&options=endpoint%3Dep-xxxxxx"

# For Helm chart values
# helm/todo-chatbot/values.yaml
database:
  url: "postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
  pooled: true
```

### 3. Kubernetes Neon Database Operations
Execute database operations in Kubernetes environment:

```bash
# Deploy Neon database secrets to Kubernetes
kubectl create secret generic neon-db-secret \
  --from-literal=database-url="postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require" \
  --namespace todo-app

# Execute database operations in Kubernetes pod
kubectl exec -it deployment/todo-chatbot-backend -n todo-app -- python -c "
import os
os.environ['DATABASE_URL'] = 'postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require'
from backend.core.db import engine
from sqlalchemy import text
with engine.connect() as conn:
    result = conn.execute(text('SELECT version();'))
    print('Database version:', result.fetchone()[0])
"
```

### 4. Neon Branch Management for DevOps
Use Neon branches for development workflows:

```bash
# Create a development branch for feature work
neonctl branches create --project-id <project-id> --name feature-todo-enhancements

# Create a preview branch for PR deployments
neonctl branches create --project-id <project-id> --name preview-pr-${PR_NUMBER}

# Get connection string for specific branch
neonctl connection-string <branch-id> --project-id <project-id>
```

### 5. Schema Management for Todo Application
Define and manage database schema for Todo AI Chatbot:

```sql
-- Example schema for Todo application
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_task_user_id ON task(user_id);
CREATE INDEX idx_task_completed ON task(completed);
CREATE INDEX idx_session_user_id ON session(user_id);
CREATE INDEX idx_session_token ON session(session_token);
```

## Benefits
- Optimized Neon database connections for containerized deployments
- Proper connection pooling for Kubernetes environments
- Schema management tailored to Todo AI Chatbot requirements
- Integration with Neon's branching features for development workflows
- Kubernetes-native database secret management
- Serverless-friendly connection patterns

## Safety Considerations
- Always use pooled connections for Kubernetes deployments
- Store Neon database credentials as Kubernetes secrets
- Test database operations on Neon branches before production
- Monitor connection usage in Neon console
- Implement proper error handling for connection failures