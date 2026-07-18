import re
from typing import Any, Dict, List
from pydantic import BaseModel, Field


class PlanStep(BaseModel):
    step_number: int = Field(..., description="Chronological step identifier")
    specialist_name: str = Field(..., description="Code name identifier of the chosen specialist")
    task: str = Field(..., description="The matching task name to execute")
    description: str = Field(..., description="Explanation of why this step is in the plan")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Input parameters passed to the specialist task")


class ExecutionPlan(BaseModel):
    intent: str = Field(..., description="Classified intent label of the user request")
    confidence: float = Field(0.95, description="Confidence score of classification")
    selected_specialists: List[str] = Field(..., description="Clean list of chosen specialists")
    steps: List[PlanStep] = Field(..., description="Ordered list of execution steps")


class AtlasPlanner:
    """
    Analyzes intent, maps user requests to specific specialists,
    and structures the multi-agent chronological execution pipeline.
    """

    def analyze_and_plan(self, query: str, datasets: List[Any] = None) -> ExecutionPlan:
        q_lower = query.lower()

        # Extract target information if we have a matched dataset from the Context Layer
        target_name = "production_users"
        target_urn = "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)"
        target_platform = "postgres"
        target_domain = "Engineering"
        fields_count = 6

        if datasets and len(datasets) > 0:
            ds = datasets[0]
            target_name = ds.name
            target_urn = ds.urn
            target_platform = ds.platform
            target_domain = ds.domain or "Engineering"
            if ds.schema_metadata and ds.schema_metadata.fields:
                fields_count = len(ds.schema_metadata.fields)

        # 1. Intent Detection Heuristics
        if any(w in q_lower for w in ["schema", "drift", "table", "deviat", "catalog", "datahub", "reconcile", "column"]):
            intent = "SCHEMA_ALIGNMENT"
            selected_specialists = ["atlas", "forge", "oracle"]
            steps = [
                PlanStep(
                    step_number=1,
                    specialist_name="atlas",
                    task="audit_schema",
                    description=f"Audit physical table catalog schemas against DataHub's master registry to detect drift on asset '{target_name}' [{target_urn}].",
                    payload={"target": target_name, "urn": target_urn, "platform": target_platform, "expected_fields": fields_count}
                ),
                PlanStep(
                    step_number=2,
                    specialist_name="oracle",
                    task="estimate_schema_drift_risk",
                    description=f"Calculate risk scores and timelines for potential downstream schema failures for {target_name}.",
                    payload={"target": target_name, "urn": target_urn, "domain": target_domain}
                ),
                PlanStep(
                    step_number=3,
                    specialist_name="forge",
                    task="draft_alignment_sql",
                    description=f"Synthesize precise DDL migration instructions to correct column deviations in '{target_name}'.",
                    payload={"target": target_name, "urn": target_urn, "platform": target_platform}
                )
            ]

        elif any(w in q_lower for w in ["threat", "attack", "lockdown", "breach", "scan", "isolate", "intrusion", "drill", "security"]):
            intent = "THREAT_CONTAINMENT"
            selected_specialists = ["sentinel", "archivist", "ambassador"]
            steps = [
                PlanStep(
                    step_number=1,
                    specialist_name="sentinel",
                    task="scan_operational_logs",
                    description=f"Inspect API request parameters and gateway connection headers for intrusion footprints on target asset '{target_name}'.",
                    payload={"duration_hours": 2, "target": target_name, "urn": target_urn}
                ),
                PlanStep(
                    step_number=2,
                    specialist_name="archivist",
                    task="ground_agent_decision",
                    description="Cross-reference recent event patterns against official corporate security runbook chapters.",
                    payload={"topic": "unauthorized_logins", "domain": target_domain}
                ),
                PlanStep(
                    step_number=3,
                    specialist_name="sentinel",
                    task="isolate_tenant_workspace",
                    description=f"Enforce strict firewall rules and connection limits on sandbox workspace containing '{target_name}'.",
                    payload={"sandbox": "Staging Sandbox Delta", "isolate_urn": target_urn}
                ),
                PlanStep(
                    step_number=4,
                    specialist_name="ambassador",
                    task="send_slack_alert",
                    description=f"Broadcast emergency containment status and remediation steps for '{target_name}' to Slack alert webhooks.",
                    payload={"channel": "security-war-room", "alert_context": f"Asset threat mitigated on {target_name}"}
                )
            ]

        elif any(w in q_lower for w in ["compliance", "privacy", "gdpr", "ccpa", "pii", "audit", "certify", "sensit"]):
            intent = "COMPLIANCE_AUDIT"
            selected_specialists = ["guardian", "archivist", "ambassador"]
            steps = [
                PlanStep(
                    step_number=1,
                    specialist_name="guardian",
                    task="scan_sensitive_columns",
                    description=f"Conduct a deep scan on table metadata dictionaries of '{target_name}' [{target_urn}] to isolate unencrypted plain PII attributes.",
                    payload={"scan_depth": "full", "urn": target_urn, "target": target_name}
                ),
                PlanStep(
                    step_number=2,
                    specialist_name="archivist",
                    task="search_knowledge_base",
                    description=f"Lookup active regulatory boundaries and internal corporate data masking runbooks for domain '{target_domain}'.",
                    payload={"filter": "PII Encryption", "domain": target_domain}
                ),
                PlanStep(
                    step_number=3,
                    specialist_name="guardian",
                    task="verify_regulatory_alignment",
                    description=f"Validate active structures on '{target_name}' against GDPR/CCPA alignment policies to certify conformity.",
                    payload={"strict": True, "urn": target_urn}
                )
            ]

        elif any(w in q_lower for w in ["network", "route", "topology", "pipeline", "service", "depend"]):
            intent = "TOPOLOGY_ROUTING"
            selected_specialists = ["architect", "oracle"]
            steps = [
                PlanStep(
                    step_number=1,
                    specialist_name="architect",
                    task="trace_pipeline_dependencies",
                    description=f"Map microservice-to-database connections and cached Redis indices for catalog asset '{target_name}'.",
                    payload={"map_type": "deep_dependency", "urn": target_urn, "target": target_name}
                ),
                PlanStep(
                    step_number=2,
                    specialist_name="oracle",
                    task="forecast_pool_starvation",
                    description=f"Perform predictive time-series regression to estimate connection pool exhaustion thresholds for '{target_name}'.",
                    payload={"forecast_window_mins": 1440, "urn": target_urn}
                )
            ]

        else:
            # Fallback diagnostic plan for general inquiries
            intent = "GENERAL_INVESTIGATION"
            selected_specialists = ["archivist", "sentinel", "oracle"]
            steps = [
                PlanStep(
                    step_number=1,
                    specialist_name="archivist",
                    task="search_knowledge_base",
                    description=f"Scan existing organizational runbooks and historical case studies for diagnostic hints targeting asset '{target_name}'.",
                    payload={"query": query, "urn": target_urn}
                ),
                PlanStep(
                    step_number=2,
                    specialist_name="sentinel",
                    task="scan_operational_logs",
                    description=f"Verify system stability and connection latency logs on dataset platform: {target_platform.upper()}.",
                    payload={"sample_size": 100, "platform": target_platform, "urn": target_urn}
                ),
                PlanStep(
                    step_number=3,
                    specialist_name="oracle",
                    task="calculate_auc_accuracy",
                    description=f"Calculate risk vectors and anomaly prediction reliability bounds for domain: {target_domain}.",
                    payload={"model": "general_arima", "domain": target_domain}
                )
            ]

        return ExecutionPlan(
            intent=intent,
            confidence=0.95 if intent != "GENERAL_INVESTIGATION" else 0.70,
            selected_specialists=selected_specialists,
            steps=steps
        )
