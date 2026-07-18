import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from backend.app.core.config import settings
from backend.app.models.base import Base
from backend.app.models.organization import Organization
from backend.app.models.user import User
from backend.app.models.project import Project


async def seed_database():
    print("==> Initializing Async SQL Database Connection...")
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        print("==> Re-creating database schemas...")
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        async with session.begin():
            print("==> Seeding Multi-Tenant Organizations...")
            acme = Organization(
                id=uuid.UUID("e3020613-2d2c-4934-be57-fb9279dfb107"),
                name="Acme Aerospace",
                domain="acme-aero.com",
            )
            cyberdyne = Organization(
                id=uuid.UUID("7b8db3ef-844c-47bc-ad74-325db000109f"),
                name="Cyberdyne Systems",
                domain="cyberdyne.io",
            )
            session.add_all([acme, cyberdyne])

            print("==> Seeding Default Identity Users...")
            # Note: passwords would be securely hashed in production using bcrypt
            admin_user = User(
                email="admin@acme-aero.com",
                hashed_password="hashed_argon2_pass_or_bcrypt_mock_key_value",
                role="SuperAdmin",
                org_id=acme.id,
            )
            analyst_user = User(
                email="operator@acme-aero.com",
                hashed_password="hashed_argon2_pass_or_bcrypt_mock_key_value",
                role="Analyst",
                org_id=acme.id,
            )
            session.add_all([admin_user, analyst_user])

            print("==> Seeding Sandboxed Projects...")
            p1 = Project(
                id=uuid.UUID("c16ba2d2-c439-4be2-9842-1698a87b8f04"),
                name="Audit Ingress Log anomalies",
                status="Active",
                org_id=acme.id,
                metadata_json={"specialists": ["Sentry-X", "Anomalist"], "data_hub_synced": True},
            )
            p2 = Project(
                id=uuid.UUID("f8a02bd2-89cd-4a21-9db3-efeeaa20499e"),
                name="Predict Operational Outage risks",
                status="Active",
                org_id=acme.id,
                metadata_json={"specialists": ["Predictor-9"], "data_hub_synced": False},
            )
            session.add_all([p1, p2])

    print("==> Database Seed Completed Successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
