#!/usr/bin/env bash

# Exit immediately if any command fails
set -eo pipefail

echo "==> Resolving Database Connection URL..."
export DATABASE_URL="${DATABASE_URL:-postgresql+asyncpg://postgres:postgres@localhost:5432/orixa_db}"

echo "==> Running Alembic Database Migrations..."
# Run migrations using python alembic runner
cd backend
alembic upgrade head

echo "==> Database Migrations Completed Successfully."
