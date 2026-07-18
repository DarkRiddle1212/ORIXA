# Orixa Database Setup Guide

**Quick Reference:** How to set up the Orixa database from scratch

---

## Prerequisites

1. **PostgreSQL 16+** installed and running
2. **Python 3.12+** with backend dependencies installed
3. **Environment variables** configured (see below)

---

## Environment Configuration

Create `.env` file in project root:

```bash
# Database Configuration
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=orixa_db
POSTGRES_PORT=5432

# Async connection will be auto-generated as:
# DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/orixa_db
```

---

## Quick Start (Recommended)

### Option 1: One Command Setup
```bash
cd backend
python scripts/db_cli.py init
```

This will:
1. Run all Alembic migrations
2. Create all 12 tables
3. Populate demo data
4. Validate schema

### Option 2: Docker Compose
```bash
docker compose up -d db
docker compose exec backend python scripts/db_cli.py init
```

---

## Manual Setup (Step by Step)

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Run Migrations
```bash
alembic upgrade head
```

**Expected Output:**
```
INFO  [alembic.runtime.migration] Running upgrade  -> 001, Initial schema with all core tables
```

### Step 3: Seed Demo Data
```bash
python scripts/seed_db.py
```

**Expected Output:**
```
🌱 Starting database seed...
📊 Creating organizations...
   ✅ Created 2 organizations
👥 Creating users...
   ✅ Created 5 users
... (continues for all tables)
✨ Database seeding completed successfully!
```

### Step 4: Validate Schema
```bash
python scripts/validate_schema.py
```

---

## Database CLI Commands

The `db_cli.py` script provides convenient database management:

```bash
# Initialize database (migrate + seed)
python scripts/db_cli.py init

# Run migrations only
python scripts/db_cli.py migrate

# Seed data only
python scripts/db_cli.py seed

# Show migration status
python scripts/db_cli.py status

# Reset database (DANGEROUS!)
python scripts/db_cli.py reset
```

---

## Verification

### Check Tables Exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected: 12 tables + alembic_version**

### Check Record Counts
```sql
SELECT 
    'organizations' as table_name, COUNT(*) FROM organizations
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'projects', COUNT(*) FROM projects
-- ... etc
```

**Expected:**
- organizations: 2
- users: 5
- projects: 3
- specialists: 4
- datasets: 2
- knowledge_entries: 3
- investigations: 1
- predictions: 2
- recommendations: 1
- decisions: 1
- replay_sessions: 1
- audit_logs: 3

---

## Demo Users

After seeding, you can use these accounts for testing:

### Acme Aerospace
- **Admin:** admin@acme-aero.com
- **Operator:** operator@acme-aero.com
- **Analyst:** analyst@acme-aero.com

### Cyberdyne Systems
- **Admin:** admin@cyberdyne.io
- **SRE:** sre@cyberdyne.io

**Note:** Demo password is `$2b$12$dummy_hash_for_development` (will be replaced with real bcrypt in Task 3)

---

## Common Issues & Solutions

### Issue: "relation does not exist"
**Solution:** Run migrations first
```bash
alembic upgrade head
```

### Issue: "connection refused"
**Solution:** Ensure PostgreSQL is running
```bash
# Linux/Mac
sudo systemctl status postgresql

# Docker
docker compose ps db
```

### Issue: "duplicate key value"
**Solution:** Database already seeded. Reset if needed:
```bash
python scripts/db_cli.py reset
```

### Issue: Alembic can't find DATABASE_URL
**Solution:** Set environment variable
```bash
export DATABASE_URL="postgresql+asyncpg://user:pass@localhost/orixa_db"
```

---

## Migration Management

### Create New Migration
```bash
alembic revision -m "description"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback One Migration
```bash
alembic downgrade -1
```

### Rollback All
```bash
alembic downgrade base
```

### Check Current Version
```bash
alembic current
```

### View History
```bash
alembic history
```

---

## Database Schema Reference

See [DATABASE_VALIDATION_REPORT.md](./reports/DATABASE_VALIDATION_REPORT.md) for complete schema documentation including:
- All table structures
- Foreign key relationships
- Index specifications
- Soft delete implementation
- Multi-tenant isolation details

---

## Performance Tuning

### Connection Pool Settings (session.py)
```python
pool_size=20,          # Base pool size
max_overflow=10,       # Additional connections under load
pool_recycle=3600,     # Recycle connections after 1 hour
pool_pre_ping=True,    # Health check before use
```

### Recommended PostgreSQL Settings
```ini
# postgresql.conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
random_page_cost = 1.1  # For SSD
```

---

## Backup & Restore

### Backup Database
```bash
pg_dump -U postgres orixa_db > orixa_backup.sql
```

### Restore Database
```bash
psql -U postgres orixa_db < orixa_backup.sql
```

### Backup with Docker
```bash
docker compose exec db pg_dump -U postgres orixa_db > orixa_backup.sql
```

---

## Next Steps

After database setup is complete:
1. ✅ Database foundation complete
2. → Proceed to Task 2: Configuration
3. → Then Task 3: Authentication

---

**Documentation Version:** 1.0  
**Last Updated:** July 18, 2026  
**Maintained By:** Orixa Engineering Team
