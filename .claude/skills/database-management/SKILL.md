# Database Management Skill

## Purpose
Manage database operations for the Todo AI Chatbot application including cleanup, schema fixes, migrations, and maintenance tasks in both development and Kubernetes environments.

## When to Use
- Cleaning up old database tables before fresh deployment
- Fixing missing database columns or schema issues
- Performing database migrations in Kubernetes deployments
- Troubleshooting database connection issues
- Managing database state in development and production environments
- Running database maintenance scripts in containerized environments

## Configuration Options

### 1. Operation Type Selection
Choose the appropriate database operation:

```yaml
operation_type: cleanup        # Drop tables and reset database state
operation_type: fix           # Apply schema fixes and missing columns
operation_type: migrate       # Run database migrations
operation_type: backup        # Create database backups
operation_type: restore       # Restore database from backup
```

### 2. Environment Configuration
Specify the target environment:

```yaml
environment: development      # Local development environment
environment: kubernetes     # Kubernetes/Minikube deployment
environment: production     # Production environment (with caution)
```

## Implementation Steps

### 1. Database Cleanup Operations
Execute database cleanup operations to reset state:

```python
# cleanup_db.py equivalent operations
import sys
sys.path.append('.')
from backend.core.db import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text('DROP TABLE IF EXISTS task CASCADE;'))
    conn.execute(text('DROP TABLE IF EXISTS session CASCADE;'))
    conn.execute(text('DROP TABLE IF EXISTS account CASCADE;'))
    conn.execute(text('DROP TABLE IF EXISTS verification CASCADE;'))
    conn.execute(text('DROP TABLE IF EXISTS "user" CASCADE;'))
    conn.commit()
    print('Dropped old tables successfully')
```

### 2. Database Schema Fixes
Apply schema fixes for missing columns:

```python
# fix_db.py equivalent operations
import sys
sys.path.append('.')
from backend.core.db import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Fix Account Table
    try:
        conn.execute(text('ALTER TABLE account ADD COLUMN "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now();'))
        conn.execute(text('ALTER TABLE account ADD COLUMN "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now();'))
        print("✅ Added columns to 'account' table.")
    except Exception as e:
        print(f"⚠️ Account table info: {e}")

    # Fix Session Table
    try:
        conn.execute(text('ALTER TABLE session ADD COLUMN "createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now();'))
        conn.execute(text('ALTER TABLE session ADD COLUMN "updatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now();'))
        print("✅ Added columns to 'session' table.")
    except Exception as e:
        print(f"⚠️ Session table info: {e}")

    conn.commit()
```

### 3. Kubernetes Database Operations
Execute database operations in Kubernetes environment:

```bash
# Execute cleanup in Kubernetes pod
kubectl exec -it deployment/todo-chatbot-backend -n todo-app -- python cleanupdb.py

# Execute fix operations in Kubernetes pod
kubectl exec -it deployment/todo-chatbot-backend -n todo-app -- python fixdb.py

# Check database status
kubectl logs -l app=backend -n todo-app | grep -i "database\|connection"
```

## Benefits
- Standardized database operations across environments
- Safe execution of destructive operations with proper warnings
- Integration with Kubernetes deployments
- Consistent schema management
- Reduced manual errors in database maintenance

## Safety Considerations
- Always backup production databases before cleanup operations
- Verify environment before executing destructive operations
- Use dry-run options when available to preview changes
- Test operations in development before applying to production