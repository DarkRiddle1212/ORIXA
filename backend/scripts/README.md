# Orixa Database Scripts

Utility scripts for database management, initialization, and validation.

---

## Quick Reference

```bash
# One-command setup (recommended for new developers)
python scripts/db_cli.py init

# Individual operations
python scripts/db_cli.py migrate    # Run migrations only
python scripts/db_cli.py seed       # Seed data only
python scripts/db_cli.py status     # Check migration status
python scripts/db_cli.py reset      # Reset database (WARNING: deletes all data!)
```

---

## Scripts

### 1. `db_cli.py` - Database Management CLI

**Purpose:** Convenient command-line tool for all database operations

**Commands:**
- `init` - Full initialization (migrate + seed)
- `migrate` - Run Alembic migrations
- `seed` - Populate demo data
- `status` - Show migration status
- `reset` - Reset database (requires confirmation)

**Usage:**
```bash
python scripts/db_cli.py [command]
```

---

### 2. `init_db.py` - Database Initialization

**Purpose:** Automated database setup for new installations

**What it does:**
1. Runs Alembic migrations (`alembic upgrade head`)
2. Seeds demo data
3. Validates setup
4. Prints next steps

**Usage:**
```bash
python scripts/init_db.py
```

**Called by:** `db_cli.py init`

---

### 3. `seed_db.py` - Demo Data Seeder

**Purpose:** Populate database with realistic demonstration data

**Data Created:**
- 2 Organizations
- 5 Users (across organizations)
- 3 Projects
- 4 AI Specialists
- 2 Datasets
- 3 Knowledge Entries
- 1 Investigation
- 2 Predictions
- 1 Recommendation
- 1 Decision
- 1 Replay Session
- 3 Audit Logs

**Usage:**
```bash
python scripts/seed_db.py
```

**Demo Users:**
- admin@acme-aero.com (Admin)
- operator@acme-aero.com (Operator)
- analyst@acme-aero.com (Analyst)
- admin@cyberdyne.io (Admin)
- sre@cyberdyne.io (Operator)

---

### 4. `validate_schema.py` - Schema Validator

**Purpose:** Comprehensive database schema validation

**Checks:**
- ✓ All tables exist
- ✓ Correct table structure
- ✓ Primary keys configured
- ✓ Foreign keys configured
- ✓ Indexes present
- ✓ Constraints valid
- ✓ Data integrity

**Usage:**
```bash
python scripts/validate_schema.py
```

**Output:** Detailed validation report with pass/fail status

---

## Common Workflows

### New Installation

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 2. Install dependencies
pip install -r requirements.txt

# 3. Initialize database
python scripts/db_cli.py init

# 4. Verify
python scripts/validate_schema.py
```

### Development Reset

```bash
# WARNING: This deletes all data!
python scripts/db_cli.py reset
```

### Migration Management

```bash
# Check current migration status
python scripts/db_cli.py status

# Apply pending migrations
python scripts/db_cli.py migrate

# Rollback to previous version
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision>
```

### Adding New Demo Data

Edit `seed_db.py` and add your data to the appropriate list:

```python
# Add new organization
ORGANIZATIONS.append({
    "name": "Your Company",
    "domain": "yourcompany.com",
    "is_active": True,
})

# Add new user
USERS_DATA.append({
    "email": "user@yourcompany.com",
    "full_name": "John Doe",
    "role": "Admin",
    "org_index": 2,  # Index of organization in ORGANIZATIONS list
})
```

Then run:
```bash
python scripts/seed_db.py
```

---

## Environment Variables Required

```bash
# Required for all scripts
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=orixa_db
POSTGRES_PORT=5432

# Auto-generated
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/orixa_db
```

---

## Troubleshooting

### Error: "relation does not exist"
**Solution:** Run migrations first
```bash
alembic upgrade head
```

### Error: "duplicate key value"
**Solution:** Database already seeded, reset if needed
```bash
python scripts/db_cli.py reset
```

### Error: "connection refused"
**Solution:** Check PostgreSQL is running
```bash
# Check status
docker compose ps db

# Or system service
sudo systemctl status postgresql
```

### Error: "Alembic can't find DATABASE_URL"
**Solution:** Ensure environment variables are set
```bash
# Linux/Mac
export DATABASE_URL="postgresql+asyncpg://user:pass@localhost/orixa_db"

# Windows PowerShell
$env:DATABASE_URL="postgresql+asyncpg://user:pass@localhost/orixa_db"
```

---

## Script Dependencies

All scripts require:
- Python 3.12+
- PostgreSQL 16+
- `requirements.txt` installed
- Environment variables configured

```bash
pip install -r requirements.txt
```

---

## Performance Notes

- **Migration time:** ~2-5 seconds (creating 12 tables)
- **Seed time:** ~3-8 seconds (creating ~25 records)
- **Validation time:** ~1-2 seconds (checking schema)
- **Total init time:** ~10-15 seconds

---

## Contributing

When adding new scripts:

1. **Add to this README** - Document usage and purpose
2. **Add error handling** - Catch and log exceptions
3. **Add progress logging** - Print what's happening
4. **Add to db_cli.py** - Integrate with CLI if appropriate
5. **Test thoroughly** - Ensure it works in fresh environment

---

## Related Documentation

- [DATABASE_SETUP_GUIDE.md](../../docs/DATABASE_SETUP_GUIDE.md) - Complete setup instructions
- [DATABASE_VALIDATION_REPORT.md](../../docs/reports/DATABASE_VALIDATION_REPORT.md) - Schema documentation
- [TASK1_COMPLETION_SUMMARY.md](../../docs/reports/TASK1_COMPLETION_SUMMARY.md) - Implementation summary

---

**Maintained By:** Orixa Engineering Team  
**Last Updated:** July 18, 2026
