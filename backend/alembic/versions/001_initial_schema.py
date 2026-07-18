"""Initial schema with all core tables

Revision ID: 001
Revises: 
Create Date: 2026-07-18 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all initial tables with proper constraints and indexes"""
    
    # Organizations table (tenant root)
    op.create_table(
        'organizations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('domain', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
    )
    op.create_index('ix_organizations_id', 'organizations', ['id'])
    op.create_index('ix_organizations_name', 'organizations', ['name'], unique=True)
    op.create_index('ix_organizations_domain', 'organizations', ['domain'], unique=True)
    op.create_index('ix_organizations_is_active', 'organizations', ['is_active'])
    op.create_index('ix_organizations_created_at', 'organizations', ['created_at'])
    op.create_index('ix_organizations_deleted_at', 'organizations', ['deleted_at'])
    op.create_index('ix_organizations_is_deleted', 'organizations', ['is_deleted'])
    
    # Users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('role', sa.String(length=20), nullable=False, server_default='Viewer'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('reset_token', sa.String(length=255), nullable=True),
        sa.Column('verification_token', sa.String(length=255), nullable=True),
        sa.Column('last_login_at', sa.String(length=50), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_users_id', 'users', ['id'])
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_role', 'users', ['role'])
    op.create_index('ix_users_is_active', 'users', ['is_active'])
    op.create_index('ix_users_org_id', 'users', ['org_id'])
    op.create_index('ix_users_created_at', 'users', ['created_at'])
    op.create_index('ix_users_deleted_at', 'users', ['deleted_at'])
    op.create_index('ix_users_is_deleted', 'users', ['is_deleted'])
    
    # Projects table
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='active'),
        sa.Column('metadata_json', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_projects_id', 'projects', ['id'])
    op.create_index('ix_projects_name', 'projects', ['name'])
    op.create_index('ix_projects_status', 'projects', ['status'])
    op.create_index('ix_projects_org_id', 'projects', ['org_id'])
    op.create_index('ix_projects_created_at', 'projects', ['created_at'])
    op.create_index('ix_projects_deleted_at', 'projects', ['deleted_at'])
    op.create_index('ix_projects_is_deleted', 'projects', ['is_deleted'])
    
    # Investigations table
    op.create_table(
        'investigations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='open'),
        sa.Column('severity', sa.String(length=10), nullable=False, server_default='medium'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('incident_data', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_investigations_id', 'investigations', ['id'])
    op.create_index('ix_investigations_title', 'investigations', ['title'])
    op.create_index('ix_investigations_status', 'investigations', ['status'])
    op.create_index('ix_investigations_severity', 'investigations', ['severity'])
    op.create_index('ix_investigations_org_id', 'investigations', ['org_id'])
    op.create_index('ix_investigations_project_id', 'investigations', ['project_id'])
    op.create_index('ix_investigations_created_at', 'investigations', ['created_at'])
    op.create_index('ix_investigations_deleted_at', 'investigations', ['deleted_at'])
    op.create_index('ix_investigations_is_deleted', 'investigations', ['is_deleted'])
    
    # Datasets table
    op.create_table(
        'datasets',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('urn', sa.String(length=500), nullable=False),
        sa.Column('platform', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('schema_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('tags', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('owners', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('lineage_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('last_synced_at', sa.String(length=50), nullable=True),
        sa.Column('sync_status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_datasets_id', 'datasets', ['id'])
    op.create_index('ix_datasets_name', 'datasets', ['name'])
    op.create_index('ix_datasets_urn', 'datasets', ['urn'], unique=True)
    op.create_index('ix_datasets_platform', 'datasets', ['platform'])
    op.create_index('ix_datasets_sync_status', 'datasets', ['sync_status'])
    op.create_index('ix_datasets_org_id', 'datasets', ['org_id'])
    op.create_index('ix_datasets_created_at', 'datasets', ['created_at'])
    op.create_index('ix_datasets_deleted_at', 'datasets', ['deleted_at'])
    op.create_index('ix_datasets_is_deleted', 'datasets', ['is_deleted'])
    
    # Specialists table
    op.create_table(
        'specialists',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('display_name', sa.String(length=100), nullable=False),
        sa.Column('specialist_type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('capabilities', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('configuration', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='standby'),
        sa.Column('health_status', sa.String(length=10), nullable=False, server_default='GREEN'),
        sa.Column('total_tasks_executed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('successful_executions', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('failed_executions', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('avg_execution_time_ms', sa.Integer(), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_specialists_id', 'specialists', ['id'])
    op.create_index('ix_specialists_name', 'specialists', ['name'], unique=True)
    op.create_index('ix_specialists_specialist_type', 'specialists', ['specialist_type'])
    op.create_index('ix_specialists_status', 'specialists', ['status'])
    op.create_index('ix_specialists_health_status', 'specialists', ['health_status'])
    op.create_index('ix_specialists_org_id', 'specialists', ['org_id'])
    op.create_index('ix_specialists_created_at', 'specialists', ['created_at'])
    op.create_index('ix_specialists_deleted_at', 'specialists', ['deleted_at'])
    op.create_index('ix_specialists_is_deleted', 'specialists', ['is_deleted'])
    
    # Knowledge Entries table (Organizational Memory)
    op.create_table(
        'knowledge_entries',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('source_uri', sa.Text(), nullable=True),
        sa.Column('tags', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('embedding_model', sa.String(length=50), nullable=True),
        sa.Column('embedding_dim', sa.Integer(), nullable=True),
        sa.Column('version', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['parent_id'], ['knowledge_entries.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_knowledge_entries_id', 'knowledge_entries', ['id'])
    op.create_index('ix_knowledge_entries_title', 'knowledge_entries', ['title'])
    op.create_index('ix_knowledge_entries_category', 'knowledge_entries', ['category'])
    op.create_index('ix_knowledge_entries_org_id', 'knowledge_entries', ['org_id'])
    op.create_index('ix_knowledge_entries_created_at', 'knowledge_entries', ['created_at'])
    op.create_index('ix_knowledge_entries_deleted_at', 'knowledge_entries', ['deleted_at'])
    op.create_index('ix_knowledge_entries_is_deleted', 'knowledge_entries', ['is_deleted'])
    
    # Recommendations table
    op.create_table(
        'recommendations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('recommendation_type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('impact_analysis', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('risk_score', sa.Float(), nullable=False),
        sa.Column('proposed_action', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('sql_script', sa.Text(), nullable=True),
        sa.Column('code_diff', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('reviewed_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('review_notes', sa.Text(), nullable=True),
        sa.Column('generated_by_specialist', sa.String(length=100), nullable=False),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('investigation_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['investigation_id'], ['investigations.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['reviewed_by'], ['users.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_recommendations_id', 'recommendations', ['id'])
    op.create_index('ix_recommendations_title', 'recommendations', ['title'])
    op.create_index('ix_recommendations_recommendation_type', 'recommendations', ['recommendation_type'])
    op.create_index('ix_recommendations_confidence_score', 'recommendations', ['confidence_score'])
    op.create_index('ix_recommendations_risk_score', 'recommendations', ['risk_score'])
    op.create_index('ix_recommendations_status', 'recommendations', ['status'])
    op.create_index('ix_recommendations_org_id', 'recommendations', ['org_id'])
    op.create_index('ix_recommendations_investigation_id', 'recommendations', ['investigation_id'])
    op.create_index('ix_recommendations_created_at', 'recommendations', ['created_at'])
    op.create_index('ix_recommendations_deleted_at', 'recommendations', ['deleted_at'])
    op.create_index('ix_recommendations_is_deleted', 'recommendations', ['is_deleted'])
    
    # Predictions table
    op.create_table(
        'predictions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('target_type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('risk_score', sa.Float(), nullable=False),
        sa.Column('confidence_level', sa.Float(), nullable=False),
        sa.Column('severity', sa.String(length=10), nullable=False),
        sa.Column('prediction_details', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('recommended_actions', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('impact_analysis', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('predicted_occurrence_window', sa.String(length=100), nullable=True),
        sa.Column('is_mitigated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('mitigation_notes', sa.Text(), nullable=True),
        sa.Column('mitigated_at', sa.String(length=50), nullable=True),
        sa.Column('mitigated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('model_version', sa.String(length=50), nullable=False),
        sa.Column('specialist_name', sa.String(length=100), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['mitigated_by'], ['users.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_predictions_id', 'predictions', ['id'])
    op.create_index('ix_predictions_title', 'predictions', ['title'])
    op.create_index('ix_predictions_target_type', 'predictions', ['target_type'])
    op.create_index('ix_predictions_risk_score', 'predictions', ['risk_score'])
    op.create_index('ix_predictions_severity', 'predictions', ['severity'])
    op.create_index('ix_predictions_is_mitigated', 'predictions', ['is_mitigated'])
    op.create_index('ix_predictions_org_id', 'predictions', ['org_id'])
    op.create_index('ix_predictions_project_id', 'predictions', ['project_id'])
    op.create_index('ix_predictions_created_at', 'predictions', ['created_at'])
    op.create_index('ix_predictions_deleted_at', 'predictions', ['deleted_at'])
    op.create_index('ix_predictions_is_deleted', 'predictions', ['is_deleted'])
    
    # Decisions table
    op.create_table(
        'decisions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('decision_type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('proposed_changes', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('risk_assessment', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('evidence_chain', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('explainability_trace', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('risk_score', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('decision_outcome', sa.String(length=20), nullable=True),
        sa.Column('decision_notes', sa.Text(), nullable=True),
        sa.Column('decided_at', sa.String(length=50), nullable=True),
        sa.Column('implemented_at', sa.String(length=50), nullable=True),
        sa.Column('implementation_status', sa.String(length=20), nullable=True),
        sa.Column('implementation_notes', sa.Text(), nullable=True),
        sa.Column('requested_by_specialist', sa.String(length=100), nullable=False),
        sa.Column('decided_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('investigation_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('recommendation_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['investigation_id'], ['investigations.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['recommendation_id'], ['recommendations.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['decided_by'], ['users.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_decisions_id', 'decisions', ['id'])
    op.create_index('ix_decisions_title', 'decisions', ['title'])
    op.create_index('ix_decisions_decision_type', 'decisions', ['decision_type'])
    op.create_index('ix_decisions_confidence_score', 'decisions', ['confidence_score'])
    op.create_index('ix_decisions_risk_score', 'decisions', ['risk_score'])
    op.create_index('ix_decisions_status', 'decisions', ['status'])
    op.create_index('ix_decisions_org_id', 'decisions', ['org_id'])
    op.create_index('ix_decisions_investigation_id', 'decisions', ['investigation_id'])
    op.create_index('ix_decisions_recommendation_id', 'decisions', ['recommendation_id'])
    op.create_index('ix_decisions_created_at', 'decisions', ['created_at'])
    op.create_index('ix_decisions_deleted_at', 'decisions', ['deleted_at'])
    op.create_index('ix_decisions_is_deleted', 'decisions', ['is_deleted'])
    
    # Replay Sessions table
    op.create_table(
        'replay_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('replay_type', sa.String(length=50), nullable=False),
        sa.Column('playback_speed', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('start_timestamp', sa.String(length=50), nullable=False),
        sa.Column('end_timestamp', sa.String(length=50), nullable=False),
        sa.Column('total_frames', sa.Integer(), nullable=False),
        sa.Column('total_duration_ms', sa.Integer(), nullable=False),
        sa.Column('frames', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('event_markers', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('current_frame_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('playback_status', sa.String(length=20), nullable=False, server_default='stopped'),
        sa.Column('investigation_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['investigation_id'], ['investigations.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_replay_sessions_id', 'replay_sessions', ['id'])
    op.create_index('ix_replay_sessions_title', 'replay_sessions', ['title'])
    op.create_index('ix_replay_sessions_replay_type', 'replay_sessions', ['replay_type'])
    op.create_index('ix_replay_sessions_start_timestamp', 'replay_sessions', ['start_timestamp'])
    op.create_index('ix_replay_sessions_end_timestamp', 'replay_sessions', ['end_timestamp'])
    op.create_index('ix_replay_sessions_investigation_id', 'replay_sessions', ['investigation_id'])
    op.create_index('ix_replay_sessions_org_id', 'replay_sessions', ['org_id'])
    op.create_index('ix_replay_sessions_created_at', 'replay_sessions', ['created_at'])
    op.create_index('ix_replay_sessions_deleted_at', 'replay_sessions', ['deleted_at'])
    op.create_index('ix_replay_sessions_is_deleted', 'replay_sessions', ['is_deleted'])
    
    # Audit Logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column('resource_type', sa.String(length=50), nullable=False),
        sa.Column('resource_id', sa.String(length=255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('details', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('correlation_id', sa.String(length=100), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='success'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_audit_logs_id', 'audit_logs', ['id'])
    op.create_index('ix_audit_logs_action', 'audit_logs', ['action'])
    op.create_index('ix_audit_logs_resource_type', 'audit_logs', ['resource_type'])
    op.create_index('ix_audit_logs_resource_id', 'audit_logs', ['resource_id'])
    op.create_index('ix_audit_logs_correlation_id', 'audit_logs', ['correlation_id'])
    op.create_index('ix_audit_logs_status', 'audit_logs', ['status'])
    op.create_index('ix_audit_logs_user_id', 'audit_logs', ['user_id'])
    op.create_index('ix_audit_logs_org_id', 'audit_logs', ['org_id'])
    op.create_index('ix_audit_logs_created_at', 'audit_logs', ['created_at'])
    op.create_index('ix_audit_logs_deleted_at', 'audit_logs', ['deleted_at'])
    op.create_index('ix_audit_logs_is_deleted', 'audit_logs', ['is_deleted'])


def downgrade() -> None:
    """Drop all tables in reverse order"""
    op.drop_table('audit_logs')
    op.drop_table('replay_sessions')
    op.drop_table('decisions')
    op.drop_table('predictions')
    op.drop_table('recommendations')
    op.drop_table('knowledge_entries')
    op.drop_table('specialists')
    op.drop_table('datasets')
    op.drop_table('investigations')
    op.drop_table('projects')
    op.drop_table('users')
    op.drop_table('organizations')
