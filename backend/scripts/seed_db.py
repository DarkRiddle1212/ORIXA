"""
Database Seed Script for Orixa Enterprise Intelligence OS
Populates realistic demonstration data for hackathon and development.
"""

import asyncio
import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.db.session import AsyncSessionLocal
from backend.app.models import (
    Organization,
    User,
    Project,
    Dataset,
    Investigation,
    Specialist,
    Recommendation,
    KnowledgeEntry,
    Prediction,
    Decision,
    ReplaySession,
    AuditLog,
)


# Sample data for organizations
ORGANIZATIONS = [
    {
        "name": "Acme Aerospace",
        "domain": "acme-aero.com",
        "is_active": True,
    },
    {
        "name": "Cyberdyne Systems",
        "domain": "cyberdyne.io",
        "is_active": True,
    },
]

# Sample users (password will be hashed in production)
USERS_DATA = [
    # Acme Aerospace users
    {"email": "admin@acme-aero.com", "full_name": "Sarah Chen", "role": "Admin", "org_index": 0},
    {"email": "operator@acme-aero.com", "full_name": "Marcus Rodriguez", "role": "Operator", "org_index": 0},
    {"email": "analyst@acme-aero.com", "full_name": "Emily Watson", "role": "Analyst", "org_index": 0},
    # Cyberdyne Systems users
    {"email": "admin@cyberdyne.io", "full_name": "Dr. Miles Dyson", "role": "Admin", "org_index": 1},
    {"email": "sre@cyberdyne.io", "full_name": "John Connor", "role": "Operator", "org_index": 1},
]

# Sample projects
PROJECTS_DATA = [
    {"name": "Production Analytics Migration", "status": "active", "org_index": 0},
    {"name": "Security Compliance Audit", "status": "active", "org_index": 0},
    {"name": "ML Pipeline Optimization", "status": "active", "org_index": 1},
]

# Global specialists (not org-specific)
SPECIALISTS_DATA = [
    {
        "name": "security-guardian",
        "display_name": "Security Guardian",
        "specialist_type": "security",
        "description": "Monitors security logs, detects anomalies, and coordinates incident responses",
        "capabilities": ["log_analysis", "anomaly_detection", "threat_assessment", "incident_triage"],
        "status": "active",
        "health_status": "GREEN",
        "total_tasks_executed": 147,
        "successful_executions": 142,
        "failed_executions": 5,
        "avg_execution_time_ms": 2340,
    },
    {
        "name": "schema-sentinel",
        "display_name": "Schema Sentinel",
        "specialist_type": "schema",
        "description": "Audits database schemas, detects drift, and recommends migration strategies",
        "capabilities": ["schema_analysis", "drift_detection", "migration_planning", "data_lineage"],
        "status": "active",
        "health_status": "GREEN",
        "total_tasks_executed": 89,
        "successful_executions": 87,
        "failed_executions": 2,
        "avg_execution_time_ms": 4120,
    },
    {
        "name": "compliance-auditor",
        "display_name": "Compliance Auditor",
        "specialist_type": "compliance",
        "description": "Enforces data classification standards and validates regulatory compliance",
        "capabilities": ["pii_detection", "policy_validation", "audit_certification", "gdpr_compliance"],
        "status": "active",
        "health_status": "GREEN",
        "total_tasks_executed": 203,
        "successful_executions": 198,
        "failed_executions": 5,
        "avg_execution_time_ms": 1890,
    },
    {
        "name": "performance-optimizer",
        "display_name": "Performance Optimizer",
        "specialist_type": "performance",
        "description": "Analyzes query performance and recommends optimization strategies",
        "capabilities": ["query_analysis", "index_recommendations", "resource_monitoring"],
        "status": "standby",
        "health_status": "YELLOW",
        "total_tasks_executed": 34,
        "successful_executions": 30,
        "failed_executions": 4,
        "avg_execution_time_ms": 5600,
    },
]


async def seed_database():
    """Main seeding function"""
    print("🌱 Starting database seed...")
    
    async with AsyncSessionLocal() as session:
        try:
            # 1. Create Organizations
            print("\n📊 Creating organizations...")
            orgs = []
            for org_data in ORGANIZATIONS:
                org = Organization(id=uuid.uuid4(), **org_data)
                session.add(org)
                orgs.append(org)
            await session.flush()
            print(f"   ✅ Created {len(orgs)} organizations")
            
            # 2. Create Users
            print("\n👥 Creating users...")
            users = []
            for user_data in USERS_DATA:
                org_index = user_data.pop("org_index")
                user = User(
                    id=uuid.uuid4(),
                    hashed_password="$2b$12$dummy_hash_for_development",  # Will be replaced with real bcrypt
                    org_id=orgs[org_index].id,
                    is_active=True,
                    is_verified=True,
                    **user_data
                )
                session.add(user)
                users.append(user)
            await session.flush()
            print(f"   ✅ Created {len(users)} users")
            
            # 3. Create Projects
            print("\n📁 Creating projects...")
            projects = []
            for proj_data in PROJECTS_DATA:
                org_index = proj_data.pop("org_index")
                project = Project(
                    id=uuid.uuid4(),
                    org_id=orgs[org_index].id,
                    metadata_json={"data_hub_synced": True, "security_level": "high"},
                    **proj_data
                )
                session.add(project)
                projects.append(project)
            await session.flush()
            print(f"   ✅ Created {len(projects)} projects")
            
            # 4. Create Specialists
            print("\n🤖 Creating AI specialists...")
            specialists = []
            for spec_data in SPECIALISTS_DATA:
                specialist = Specialist(
                    id=uuid.uuid4(),
                    configuration={"model": "gemini-2.0-flash", "temperature": 0.7},
                    **spec_data
                )
                session.add(specialist)
                specialists.append(specialist)
            await session.flush()
            print(f"   ✅ Created {len(specialists)} specialists")
            
            # 5. Create Datasets (DataHub metadata)
            print("\n💾 Creating datasets...")
            datasets = [
                Dataset(
                    id=uuid.uuid4(),
                    name="user_analytics_events",
                    urn="urn:li:dataset:(urn:li:dataPlatform:bigquery,acme.analytics.events,PROD)",
                    platform="bigquery",
                    description="User analytics event stream from production",
                    schema_metadata={"fields": [{"name": "event_id", "type": "string"}, {"name": "timestamp", "type": "timestamp"}]},
                    tags=["analytics", "production", "pii"],
                    owners=["analytics-team@acme-aero.com"],
                    sync_status="synced",
                    org_id=orgs[0].id,
                ),
                Dataset(
                    id=uuid.uuid4(),
                    name="customer_transactions",
                    urn="urn:li:dataset:(urn:li:dataPlatform:snowflake,acme.finance.transactions,PROD)",
                    platform="snowflake",
                    description="Customer transaction records",
                    schema_metadata={"fields": [{"name": "txn_id", "type": "string"}]},
                    tags=["finance", "sensitive", "gdpr"],
                    owners=["finance-team@acme-aero.com"],
                    sync_status="synced",
                    org_id=orgs[0].id,
                ),
            ]
            for dataset in datasets:
                session.add(dataset)
            await session.flush()
            print(f"   ✅ Created {len(datasets)} datasets")
            
            # 6. Create Knowledge Entries (Organizational Memory)
            print("\n📚 Creating knowledge entries...")
            knowledge_entries = [
                KnowledgeEntry(
                    id=uuid.uuid4(),
                    title="Corporate Data Classification Policy",
                    category="policy",
                    content="All PII must be encrypted at rest. Customer financial data requires additional access controls.",
                    source_uri="https://docs.acme-aero.com/policies/data-classification",
                    tags=["security", "compliance", "policy"],
                    org_id=orgs[0].id,
                    created_by=users[0].id,
                ),
                KnowledgeEntry(
                    id=uuid.uuid4(),
                    title="Database Migration Runbook",
                    category="runbook",
                    content="Standard procedure: 1. Backup production 2. Test migration on staging 3. Execute during maintenance window",
                    source_uri="https://wiki.acme-aero.com/runbooks/db-migration",
                    tags=["database", "operations", "runbook"],
                    org_id=orgs[0].id,
                    created_by=users[1].id,
                ),
                KnowledgeEntry(
                    id=uuid.uuid4(),
                    title="GDPR Compliance Requirements",
                    category="compliance_guide",
                    content="EU customer data must support right-to-be-forgotten. Data retention: 7 years maximum.",
                    source_uri="https://compliance.acme-aero.com/gdpr",
                    tags=["gdpr", "compliance", "legal"],
                    org_id=orgs[0].id,
                    created_by=users[0].id,
                ),
            ]
            for entry in knowledge_entries:
                session.add(entry)
            await session.flush()
            print(f"   ✅ Created {len(knowledge_entries)} knowledge entries")
            
            # 7. Create Investigations
            print("\n🔍 Creating investigations...")
            investigations = [
                Investigation(
                    id=uuid.uuid4(),
                    title="Unauthorized Access Attempt Detected",
                    status="investigating",
                    severity="high",
                    description="Multiple failed login attempts from suspicious IP range",
                    incident_data={
                        "ip_addresses": ["203.0.113.42", "203.0.113.43"],
                        "affected_users": 3,
                        "time_window": "2026-07-17T22:00:00Z to 2026-07-18T02:00:00Z"
                    },
                    org_id=orgs[0].id,
                    project_id=projects[1].id,
                    created_by=users[1].id,
                ),
            ]
            for investigation in investigations:
                session.add(investigation)
            await session.flush()
            print(f"   ✅ Created {len(investigations)} investigations")
            
            # 8. Create Predictions
            print("\n🔮 Creating predictions...")
            predictions = [
                Prediction(
                    id=uuid.uuid4(),
                    title="Schema Drift Risk in Analytics Pipeline",
                    target_type="schema_drift",
                    description="Detected column type changes in upstream dataset that may break downstream queries",
                    risk_score=84.5,
                    confidence_level=0.92,
                    severity="high",
                    prediction_details={
                        "affected_table": "user_analytics_events",
                        "column_changes": [{"column": "user_id", "from": "INT", "to": "STRING"}]
                    },
                    recommended_actions=["Update downstream queries", "Modify schema validation", "Test data pipeline"],
                    impact_analysis={"affected_dashboards": 12, "affected_models": 3},
                    predicted_occurrence_window="within 48 hours",
                    model_version="v2.1.0",
                    specialist_name="schema-sentinel",
                    org_id=orgs[0].id,
                    project_id=projects[0].id,
                ),
                Prediction(
                    id=uuid.uuid4(),
                    title="Potential Compliance Violation",
                    target_type="compliance_failure",
                    description="Unencrypted PII detected in new dataset",
                    risk_score=91.2,
                    confidence_level=0.88,
                    severity="critical",
                    prediction_details={"dataset": "customer_transactions", "pii_fields": ["email", "phone"]},
                    recommended_actions=["Enable field-level encryption", "Update access controls"],
                    impact_analysis={"compliance_frameworks": ["GDPR", "CCPA"], "potential_fine": "$50,000"},
                    model_version="v1.8.3",
                    specialist_name="compliance-auditor",
                    org_id=orgs[0].id,
                ),
            ]
            for prediction in predictions:
                session.add(prediction)
            await session.flush()
            print(f"   ✅ Created {len(predictions)} predictions")
            
            # 9. Create Recommendations
            print("\n💡 Creating recommendations...")
            recommendations = [
                Recommendation(
                    id=uuid.uuid4(),
                    title="Add Index on user_id Column",
                    recommendation_type="performance_optimization",
                    description="Query performance analysis shows 300ms improvement with index on user_analytics_events.user_id",
                    impact_analysis={"performance_gain": "65%", "storage_cost": "250MB"},
                    confidence_score=0.94,
                    risk_score=12.3,
                    proposed_action={"action": "create_index", "table": "user_analytics_events", "column": "user_id"},
                    sql_script="CREATE INDEX idx_user_id ON user_analytics_events(user_id);",
                    status="pending",
                    generated_by_specialist="performance-optimizer",
                    org_id=orgs[0].id,
                ),
            ]
            for recommendation in recommendations:
                session.add(recommendation)
            await session.flush()
            print(f"   ✅ Created {len(recommendations)} recommendations")
            
            # 10. Create Decisions
            print("\n⚖️  Creating decisions...")
            decisions = [
                Decision(
                    id=uuid.uuid4(),
                    title="Approve Schema Migration for Analytics Pipeline",
                    decision_type="schema_change",
                    description="Proposed migration to handle upstream schema changes",
                    proposed_changes={"migration_script": "ALTER TABLE queries...", "rollback_plan": "Revert to v1.2"},
                    risk_assessment={"data_loss_risk": "low", "downtime": "5 minutes"},
                    evidence_chain=[
                        {"step": 1, "specialist": "schema-sentinel", "finding": "Schema drift detected"},
                        {"step": 2, "specialist": "security-guardian", "finding": "No security concerns"},
                    ],
                    explainability_trace={"reasoning": "Safe migration with tested rollback"},
                    confidence_score=0.89,
                    risk_score=18.4,
                    status="pending",
                    requested_by_specialist="schema-sentinel",
                    org_id=orgs[0].id,
                ),
            ]
            for decision in decisions:
                session.add(decision)
            await session.flush()
            print(f"   ✅ Created {len(decisions)} decisions")
            
            # 11. Create Replay Sessions
            print("\n▶️  Creating replay sessions...")
            replay_sessions = [
                ReplaySession(
                    id=uuid.uuid4(),
                    title="Security Incident Timeline - July 17",
                    description="Frame-by-frame replay of unauthorized access investigation",
                    replay_type="investigation",
                    start_timestamp="2026-07-17T22:00:00Z",
                    end_timestamp="2026-07-18T02:30:00Z",
                    total_frames=45,
                    total_duration_ms=16200000,
                    frames=[
                        {"frame": 1, "timestamp": "2026-07-17T22:00:00Z", "event": "First failed login attempt"},
                        {"frame": 2, "timestamp": "2026-07-17T22:15:00Z", "event": "Security Guardian alert triggered"},
                    ],
                    event_markers=[{"time": "22:00", "label": "Incident Start", "severity": "high"}],
                    investigation_id=investigations[0].id,
                    org_id=orgs[0].id,
                    created_by=users[1].id,
                ),
            ]
            for replay_session in replay_sessions:
                session.add(replay_session)
            await session.flush()
            print(f"   ✅ Created {len(replay_sessions)} replay sessions")
            
            # 12. Create Audit Logs
            print("\n📝 Creating audit logs...")
            audit_logs = [
                AuditLog(
                    id=uuid.uuid4(),
                    action="user_login",
                    resource_type="authentication",
                    resource_id=str(users[0].id),
                    description="Successful admin login",
                    details={"method": "password", "mfa": True},
                    correlation_id="corr-" + str(uuid.uuid4())[:8],
                    ip_address="192.168.1.100",
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    status="success",
                    user_id=users[0].id,
                    org_id=orgs[0].id,
                ),
                AuditLog(
                    id=uuid.uuid4(),
                    action="investigation_created",
                    resource_type="investigation",
                    resource_id=str(investigations[0].id),
                    description="New security investigation initiated",
                    details={"severity": "high", "auto_created": False},
                    correlation_id="corr-" + str(uuid.uuid4())[:8],
                    ip_address="192.168.1.101",
                    status="success",
                    user_id=users[1].id,
                    org_id=orgs[0].id,
                ),
                AuditLog(
                    id=uuid.uuid4(),
                    action="specialist_execution",
                    resource_type="specialist",
                    resource_id="security-guardian",
                    description="Security Guardian analyzed login anomalies",
                    details={"task": "anomaly_detection", "duration_ms": 2340},
                    correlation_id="corr-" + str(uuid.uuid4())[:8],
                    status="success",
                    org_id=orgs[0].id,
                ),
            ]
            for audit_log in audit_logs:
                session.add(audit_log)
            await session.flush()
            print(f"   ✅ Created {len(audit_logs)} audit logs")
            
            # Commit all changes
            await session.commit()
            
            print("\n✨ Database seeding completed successfully!")
            print("\n📊 Summary:")
            print(f"   • Organizations: {len(orgs)}")
            print(f"   • Users: {len(users)}")
            print(f"   • Projects: {len(projects)}")
            print(f"   • Specialists: {len(specialists)}")
            print(f"   • Datasets: {len(datasets)}")
            print(f"   • Knowledge Entries: {len(knowledge_entries)}")
            print(f"   • Investigations: {len(investigations)}")
            print(f"   • Predictions: {len(predictions)}")
            print(f"   • Recommendations: {len(recommendations)}")
            print(f"   • Decisions: {len(decisions)}")
            print(f"   • Replay Sessions: {len(replay_sessions)}")
            print(f"   • Audit Logs: {len(audit_logs)}")
            
        except Exception as e:
            await session.rollback()
            print(f"\n❌ Error during seeding: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_database())
