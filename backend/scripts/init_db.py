"""
Database Initialization Script for Orixa
Runs migrations and seeds the database with demo data.
"""

import asyncio
import subprocess
import sys
from pathlib import Path


def run_command(cmd: list[str], description: str):
    """Run a shell command and handle errors"""
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent.parent,
        )
        if result.stdout:
            print(result.stdout)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(e.stderr if e.stderr else e.stdout)
        return False


async def initialize_database():
    """Main initialization sequence"""
    print("=" * 60)
    print("🚀 Orixa Database Initialization")
    print("=" * 60)
    
    # Step 1: Run migrations
    if not run_command(
        ["alembic", "upgrade", "head"],
        "Running Alembic migrations"
    ):
        print("\n❌ Migration failed. Please check your database connection.")
        print("   Ensure PostgreSQL is running and DATABASE_URL is correct.")
        sys.exit(1)
    
    # Step 2: Seed database
    print("\n🌱 Seeding database with demo data...")
    try:
        # Import and run seed function
        from backend.scripts.seed_db import seed_database
        await seed_database()
    except Exception as e:
        print(f"❌ Seeding failed: {e}")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✨ Database initialization complete!")
    print("=" * 60)
    print("\n📊 You can now:")
    print("   • Start the backend: uvicorn backend.app.main:app --reload")
    print("   • Access API docs: http://localhost:8000/docs")
    print("   • Login with: admin@acme-aero.com")
    print("\n")


if __name__ == "__main__":
    asyncio.run(initialize_database())
