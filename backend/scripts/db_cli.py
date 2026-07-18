"""
Database CLI Tool for Orixa
Provides convenient commands for database management.

Usage:
    python scripts/db_cli.py init       # Initialize database (migrate + seed)
    python scripts/db_cli.py migrate    # Run migrations only
    python scripts/db_cli.py seed       # Seed data only
    python scripts/db_cli.py reset      # Reset database (dangerous!)
    python scripts/db_cli.py status     # Show migration status
"""

import asyncio
import subprocess
import sys
from pathlib import Path


def run_alembic(args: list[str]):
    """Run Alembic command"""
    cmd = ["alembic"] + args
    subprocess.run(cmd, cwd=Path(__file__).parent.parent)


async def init_db():
    """Initialize database with migrations and seed data"""
    from backend.scripts.init_db import initialize_database
    await initialize_database()


async def seed_only():
    """Seed database without running migrations"""
    print("🌱 Seeding database...")
    from backend.scripts.seed_db import seed_database
    await seed_database()


async def reset_db():
    """Reset database - DANGEROUS!"""
    print("⚠️  WARNING: This will delete ALL data!")
    response = input("Type 'YES' to confirm: ")
    if response != "YES":
        print("❌ Reset cancelled")
        return
    
    print("\n🗑️  Resetting database...")
    run_alembic(["downgrade", "base"])
    print("✅ Database reset complete")
    
    response = input("\nReinitialize database? (y/n): ")
    if response.lower() == "y":
        await init_db()


def show_status():
    """Show current migration status"""
    print("📊 Database Migration Status:")
    run_alembic(["current"])
    print("\n📋 Migration History:")
    run_alembic(["history"])


async def main():
    """Main CLI handler"""
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "init":
        await init_db()
    elif command == "migrate":
        run_alembic(["upgrade", "head"])
    elif command == "seed":
        await seed_only()
    elif command == "reset":
        await reset_db()
    elif command == "status":
        show_status()
    else:
        print(f"❌ Unknown command: {command}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
