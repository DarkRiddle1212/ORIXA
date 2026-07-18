import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List
from backend.app.replay.event_models import ReplayEvent, ReplayTimeline


class TimelineBuilder:
    """
    Assembles high-fidelity chronologies from system configurations or scenario templates.
    Generates a high-fidelity trace for presentation playback.
    """

    @staticmethod
    def get_predefined_scenarios() -> Dict[str, Dict[str, Any]]:
        return {
            "silent-schema-disaster": {
                "title": "Silent Schema Disaster",
                "short_description": "A schema change breaks downstream dashboards silently.",
                "category": "Schema",
                "confidence_score": 0.98,
                "root_cause": "Dropped column 'phone_raw' on postgres.core.users broke downstream Spark jobs and Tableau dashboards.",
                "risk_assessment": "High risk of inaccurate executive billing and analytics reporting, degrading customer cohort metrics.",
                "events": [
                    {
                        "event_type": "ATLAS_ORCHESTRATION",
                        "responsible_specialist": None,
                        "description": "Atlas detects schema mismatch warnings propagated from Snowflake analytics warehouse.",
                        "supporting_evidence": ["Warning: demographics aggregation failed on Null column exception."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)"]
                    },
                    {
                        "event_type": "DATAHUB_RETRIEVAL",
                        "responsible_specialist": None,
                        "description": "Atlas interrogates DataHub context, revealing physical table schema has diverged from registered catalog URN.",
                        "supporting_evidence": ["Diff: Column 'phone_raw' dropped. Unregistered column 'phone_encrypted' found."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)"]
                    },
                    {
                        "event_type": "ORGANIZATIONAL_MEMORY",
                        "responsible_specialist": None,
                        "description": "Retrieved similar incident MEM-8FA4E: 'Pipeline Interruption due to Schema Drift' solved with a backward-compatible SQL view.",
                        "supporting_evidence": ["Historical Similarity Match: 94.2%"],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "atlas",
                        "description": "Specialist 'Atlas' runs deep physical table diagnostic checking Postgres server logs and connection pools.",
                        "supporting_evidence": [
                            "Atlas [INFO]: Connecting to core database pool...",
                            "Atlas [WARN]: Column 'phone_raw' has been removed."
                        ],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "oracle",
                        "description": "Specialist 'Oracle' calculates downstream dependency disruption risks and pipeline regression probabilities.",
                        "supporting_evidence": ["Oracle [WARN]: Downstream regression probability at 94.2% on demographics table."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "forge",
                        "description": "Specialist 'Forge' drafts safe SQL migration schema patch to re-expose legacy columns as backward-compatible aliased views.",
                        "supporting_evidence": ["Forge [SUCCESS]: Generated view mapping V2_users_compat."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "GEMINI_REASONING",
                        "responsible_specialist": None,
                        "description": "Gemini synthesizes findings: Dropping 'phone_raw' broke spark daily ingest. View aliasing view is recommended.",
                        "supporting_evidence": ["Synthesized core recommendation with 98% structural confidence score."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "FINAL_RECOMMENDATION",
                        "responsible_specialist": None,
                        "description": "Atlas presents executive summary of root cause, structural patch script, and DataHub registration curl command.",
                        "supporting_evidence": ["Remediation plan generated: SQL compatibility view & DataHub metadata sync."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "HUMAN_APPROVAL",
                        "responsible_specialist": None,
                        "description": "SecOps Lead approves the Forge compatibility SQL schema patch.",
                        "supporting_evidence": ["Approved by owoadeemmy@gmail.com. Status shifted to EXECUTED."],
                        "status": "COMPLETED",
                        "related_assets": []
                    }
                ]
            },
            "stale-ml-feature": {
                "title": "Stale ML Feature",
                "short_description": "Drone risk models degrade due to 72h stale wind-shear and sensor telemetry parameters.",
                "category": "Machine Learning",
                "confidence_score": 0.92,
                "root_cause": "dbt pipeline sync worker pod was OOM-Killed on Kubernetes because sensor volume exceeded the 8GB memory ceiling limit.",
                "risk_assessment": "Critical risk to flight safety: stale atmospheric indices lead to poor flight vector path corrections.",
                "events": [
                    {
                        "event_type": "ATLAS_ORCHESTRATION",
                        "responsible_specialist": None,
                        "description": "Operations flags flight risk model anomalies. Dispatches Atlas to trace data latency vectors.",
                        "supporting_evidence": ["Model accuracy (AUC) fell from standard 0.94 baseline to 0.58."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:model:acme_aerospace.flight_risk_xgb"]
                    },
                    {
                        "event_type": "DATAHUB_RETRIEVAL",
                        "responsible_specialist": None,
                        "description": "Atlas interrogates lineage, identifying 'analytics.ml_features_prod' as the stale driver database.",
                        "supporting_evidence": ["DataHub lineage: users_telemetry -> ml_features_prod -> flight_risk_xgb"],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.ml_features_prod,PROD)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "architect",
                        "description": "Specialist 'Architect' traces active API pipelines and establishes feature update intervals.",
                        "supporting_evidence": ["Architect [WARN]: Parent dependency ml_features_prod is 72.4 hours stale."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.ml_features_prod,PROD)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "sentinel",
                        "description": "Specialist 'Sentinel' scans operational Kubernetes logs, discovering container out-of-memory crashes.",
                        "supporting_evidence": ["Sentinel [WARN]: Pod ml-feature-store-sync-df8a9 terminated with Exit Code 137 (OOMKilled)."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "GEMINI_REASONING",
                        "responsible_specialist": None,
                        "description": "Gemini reasons: Sensor density from storms exceeded memory bounds. Kubernetes deployment specs must be bumped to 16Gi.",
                        "supporting_evidence": ["Proposed memory limits modification to prevent future execution failures."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "FINAL_RECOMMENDATION",
                        "responsible_specialist": None,
                        "description": "Atlas issues container resource patch and manual Airflow rerun instructions.",
                        "supporting_evidence": ["Resource request update: raise pod limit from 8Gi to 16Gi."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "HUMAN_APPROVAL",
                        "responsible_specialist": None,
                        "description": "DevOps engineer approves Kubernetes resource manifest bump to 16Gi.",
                        "supporting_evidence": ["Approved by oncall-ops@acme-aerospace.com."],
                        "status": "COMPLETED",
                        "related_assets": []
                    }
                ]
            },
            "pii-governance-violation": {
                "title": "PII Governance Violation",
                "short_description": "Plaintext SSNs and unencrypted emails leaked inside unauthorized project sandbox.",
                "category": "Security & PII",
                "confidence_score": 0.99,
                "root_cause": "A developer backup script copied raw production users records into a public-facing staging sandbox.",
                "risk_assessment": "Severe GDPR and CCPA violation. High vulnerability to external breaches and severe regulatory fines.",
                "events": [
                    {
                        "event_type": "ATLAS_ORCHESTRATION",
                        "responsible_specialist": None,
                        "description": "Threat engine identifies unmasked data formats. Dispatches Atlas to isolate the sandbox.",
                        "supporting_evidence": ["Alert: compliance rating dropped below baseline thresholds."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "guardian",
                        "description": "Specialist 'Guardian' samples staging table columns, discovering unencrypted Social Security Numbers.",
                        "supporting_evidence": ["Guardian [WARN]: Found 420 instances matching plaintext SSN pattern ^\\d{3}-\\d{2}-\\d{4}$."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "sentinel",
                        "description": "Specialist 'Sentinel' deploys IP access blocks to isolate the vulnerable staging database.",
                        "supporting_evidence": ["Sentinel [SUCCESS]: Blocked external traffic on Port 3000 to cluster staging-02."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "ambassador",
                        "description": "Specialist 'Ambassador' issues emergency notifications to security war-room on Slack.",
                        "supporting_evidence": ["Ambassador [SUCCESS]: Dispatched Slack hook to #security-war-room."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "GEMINI_REASONING",
                        "responsible_specialist": None,
                        "description": "Gemini evaluates breach: Immediate table truncation is required followed by VPC ingress firewall configuration.",
                        "supporting_evidence": ["Synthesized threat classification as CRITICAL policy infraction."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "FINAL_RECOMMENDATION",
                        "responsible_specialist": None,
                        "description": "Atlas drafts SQL cleanup statements to truncate sandbox tables and a firewall script.",
                        "supporting_evidence": ["Purge script: TRUNCATE TABLE sandbox.project_alpha."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "HUMAN_APPROVAL",
                        "responsible_specialist": None,
                        "description": "SecOps Director authorizes physical table truncation and VPC lock.",
                        "supporting_evidence": ["Approved. Truncation executed successfully on staging database."],
                        "status": "COMPLETED",
                        "related_assets": []
                    }
                ]
            },
            "broken-data-pipeline": {
                "title": "Broken Data Pipeline",
                "short_description": "analytical load server IPs dropped during a network upgrade, breaking daily reporting.",
                "category": "Infrastructure",
                "confidence_score": 0.95,
                "root_cause": "Terraform script omitted dbt-mesh loader IP ranges from the Snowflake warehouse whitelist.",
                "risk_assessment": "Stalled SOX compliance audits and incomplete corporate reports.",
                "events": [
                    {
                        "event_type": "ATLAS_ORCHESTRATION",
                        "responsible_specialist": None,
                        "description": "Daily finance pipeline fails to connect, raising connection socket timeouts.",
                        "supporting_evidence": ["Prometheus Alert: finance_reporting_load timed out after 10 retries."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "architect",
                        "description": "Specialist 'Architect' audits ingress routing, discovering firewall rule blockages.",
                        "supporting_evidence": ["Architect [WARN]: Egress blocked by firewall rule 'deny-unvetted-staging-egress'."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "sentinel",
                        "description": "Specialist 'Sentinel' analyzes TCP handshakes, identifying connection socket timeouts.",
                        "supporting_evidence": ["Sentinel [WARN]: TCP connection handshake timeout after 15000ms."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "GEMINI_REASONING",
                        "responsible_specialist": None,
                        "description": "Gemini analyzes subnet updates: A missing Terraform variable omitted DBT_LOADER_NAT. Terraform must be patched.",
                        "supporting_evidence": ["Identified specific commit 'f22ea8' which introduced the regression."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "FINAL_RECOMMENDATION",
                        "responsible_specialist": None,
                        "description": "Atlas drafts Terraform ingress rule addition and network keepalive configuration rules.",
                        "supporting_evidence": ["Drafted google_compute_firewall.allow_dbt_egress resource patch."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "HUMAN_APPROVAL",
                        "responsible_specialist": None,
                        "description": "SRE Lead approves whitelisting and applies Terraform patch.",
                        "supporting_evidence": ["Approved. Connection pool successfully re-established on Snowflake port 443."],
                        "status": "COMPLETED",
                        "related_assets": []
                    }
                ]
            },
            "missing-dataset-owner": {
                "title": "Missing Dataset Owner",
                "short_description": "An orphaned financial ledger dataset blocks resolution of validation anomalies.",
                "category": "Governance",
                "confidence_score": 0.89,
                "root_cause": "The lead database steward left the company without executing a transitional ownership delegation.",
                "risk_assessment": "Unstewarded data quality anomalies risk violating quarterly audit validation metrics.",
                "events": [
                    {
                        "event_type": "ATLAS_ORCHESTRATION",
                        "responsible_specialist": None,
                        "description": "Soda quality scans flag negative balances. Atlas attempts to assign a steward ticket.",
                        "supporting_evidence": ["Data anomaly: negative balance values detected inside ledger."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.finance.ledger_v2,PROD)"]
                    },
                    {
                        "event_type": "DATAHUB_RETRIEVAL",
                        "responsible_specialist": None,
                        "description": "Atlas checks catalog contacts: dataset URN has zero registered owners or steward profiles.",
                        "supporting_evidence": ["GET /api/v1/dataset/finance.ledger_v2/owners returned empty array."],
                        "status": "COMPLETED",
                        "related_assets": ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.finance.ledger_v2,PROD)"]
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "archivist",
                        "description": "Specialist 'Archivist' checks code commit patterns and team charts to locate the author.",
                        "supporting_evidence": ["Archivist [SUCCESS]: Identified Sarah Vance as author of 92% of lines in schema DDL."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "SPECIALIST_ACTIVITY",
                        "responsible_specialist": "ambassador",
                        "description": "Specialist 'Ambassador' drafts automated Slack ownership confirmation requests.",
                        "supporting_evidence": ["Ambassador [SUCCESS]: Opened ticket GOV-OWNER-9912 assigned to Treasury Group."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "GEMINI_REASONING",
                        "responsible_specialist": None,
                        "description": "Gemini recommends enrolling the Treasury Platform Team and setting up a pre-commit owner validation gate.",
                        "supporting_evidence": ["Formulated rule prohibiting asset deployment without registered contacts."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "FINAL_RECOMMENDATION",
                        "responsible_specialist": None,
                        "description": "Atlas outputs REST registry payload to enrollment endpoint and a Git gatekeeper shell script.",
                        "supporting_evidence": ["Registering Sarah Vance (DATA_OWNER) and Treasury Group (STEWARD)."],
                        "status": "COMPLETED",
                        "related_assets": []
                    },
                    {
                        "event_type": "HUMAN_APPROVAL",
                        "responsible_specialist": None,
                        "description": "Sarah Vance confirms ownership claim and registers the Treasury platform.",
                        "supporting_evidence": ["Ownership claimed and DataHub catalog synchronized."],
                        "status": "COMPLETED",
                        "related_assets": []
                    }
                ]
            }
        }

    @classmethod
    def build_timeline(cls, investigation_id: str, query: str) -> ReplayTimeline:
        scenarios = cls.get_predefined_scenarios()
        
        # Decide which scenario applies based on ID or substring search
        chosen_key = "silent-schema-disaster"
        if investigation_id in scenarios:
            chosen_key = investigation_id
        else:
            for k, v in scenarios.items():
                if k in query.lower() or v["title"].lower() in query.lower():
                    chosen_key = k
                    break

        sc = scenarios[chosen_key]
        
        # Build chronological timestamps separated by 2 minutes
        base_time = datetime.utcnow() - timedelta(minutes=len(sc["events"]) * 2)
        
        events_list = []
        for idx, ev_data in enumerate(sc["events"]):
            ev_time = base_time + timedelta(minutes=idx * 2)
            events_list.append(
                ReplayEvent(
                    id=f"evt-{chosen_key}-{idx}-{str(uuid.uuid4())[:8]}",
                    timestamp=ev_time.strftime("%H:%M:%S UTC"),
                    event_type=ev_data["event_type"],
                    responsible_specialist=ev_data["responsible_specialist"],
                    description=ev_data["description"],
                    supporting_evidence=ev_data["supporting_evidence"],
                    status=ev_data["status"],
                    related_assets=ev_data["related_assets"]
                )
            )

        return ReplayTimeline(
            investigation_id=investigation_id,
            title=sc["title"],
            short_description=sc["short_description"],
            category=sc["category"],
            confidence_score=sc["confidence_score"],
            root_cause=sc["root_cause"],
            risk_assessment=sc["risk_assessment"],
            events=events_list
        )
