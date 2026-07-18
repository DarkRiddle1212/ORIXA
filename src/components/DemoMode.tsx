import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Brain,
  Sparkles,
  Layers,
  Database,
  Activity,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Network,
  Users,
  Copy,
  Check,
  TrendingUp,
  Cpu,
  Info,
  ChevronRight,
  ArrowRight,
  Server,
  Zap,
  HelpCircle,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ============================================================================
// Types & Structures
// ============================================================================

export interface ScenarioRemediation {
  action_type: "SQL_MIGRATION" | "SECURITY_PATCH" | "ACCESS_CONTROL" | "CONFIG_PATCH";
  title: string;
  description: string;
  code: string;
}

export interface ScenarioDatasetField {
  field_path: string;
  type: string;
  description: string;
  nullable: boolean;
  tags?: string[];
}

export interface ScenarioDataHubContext {
  urn: string;
  name: string;
  platform: "postgres" | "snowflake" | "bigquery" | "spark";
  domain: string;
  tags: string[];
  fields: ScenarioDatasetField[];
  owners: Array<{ name: string; email: string; role: string }>;
  lineage: {
    upstream: Array<{ urn: string; name: string; platform: string }>;
    downstream: Array<{ urn: string; name: string; platform: string }>;
  };
}

export interface ScenarioSpecialistAction {
  name: string;
  display_name: string;
  task: string;
  description: string;
  status: "PENDING" | "EXECUTING" | "COMPLETED" | "ERROR";
  explanation: string;
  logs: string[];
}

export interface ScenarioMemoryMatch {
  id: string;
  incident: string;
  similarity: string;
  final_outcome: string;
}

export interface ScenarioTimelineStep {
  time: string;
  title: string;
  description: string;
}

export interface Scenario {
  id: string;
  title: string;
  short_description: string;
  category: "Schema" | "Machine Learning" | "Security & PII" | "Infrastructure" | "Governance";
  background: string;
  investigation_timeline: ScenarioTimelineStep[];
  participating_specialists: ScenarioSpecialistAction[];
  memory_matches: ScenarioMemoryMatch[];
  datahub_context: ScenarioDataHubContext;
  executive_summary: string;
  root_cause: string;
  risk_assessment: string;
  remediations: ScenarioRemediation[];
  confidence_score: number;
  supporting_evidence: string[];
}

// ============================================================================
// 5 High-Fidelity Scenarios Mock Data
// ============================================================================

const ENTERPRISE_SCENARIOS: Scenario[] = [
  {
    id: "silent-schema-disaster",
    title: "Silent Schema Disaster",
    short_description: "A breaking schema mutation causes downstream pipelines to fail silently.",
    category: "Schema",
    background: "An automated DB migration script run by Forge on 'core.users' dropped a legacy column 'phone_raw' and renamed it to 'phone_encrypted' without registering the change in DataHub. Although downstream dbt transformations compiled, an Apache Spark ETL job ('pyspark_daily_agg') reading raw Postgres values crashed. It failed silently, propagating empty null values into the Customer Lifetime Value (LTV) Tableau dashboard, which triggered a false 100% active user drop warning in BI dashboards.",
    investigation_timeline: [
      { time: "02:00 UTC", title: "Automated Migration Executed", description: "V2.4__encrypt_users.sql database script migrates and renames phone_raw to phone_encrypted." },
      { time: "04:30 UTC", title: "Daily Spark ETL Ingestion", description: "Spark pipeline 'pyspark_daily_agg' reads core.users expecting phone_raw column structure." },
      { time: "04:32 UTC", title: "Silent Failure Ignored", description: "ETL handles parsing error silently. Inserts nulls into snowflake demographics target." },
      { time: "08:00 UTC", title: "BI Dashboard Aggregation Refresh", description: "Downstream Tableau reports display 100% loss of customer cohort profile segments." },
      { time: "09:00 UTC", title: "Executive Warning Triggered", description: "Operations flags major data drift. Atlas Supervisor dispatched to audit structural inconsistencies." }
    ],
    participating_specialists: [
      {
        name: "atlas",
        display_name: "Atlas",
        task: "audit_schema",
        description: "Verify actual physical table configurations against registered catalog blueprints.",
        status: "PENDING",
        explanation: "Audited table layouts. Located structural drift on core.users database: Column 'phone_raw' is missing, but uncatalogued 'phone_encrypted' exists.",
        logs: [
          "Atlas [INFO]: Connecting to database core postgres pool...",
          "Atlas [INFO]: Fetching schema metadata declarations from DataHub catalog API...",
          "Atlas [WARN]: PHYSICAL DRIFT: postgres.core.users layout does not match target URN.",
          "Atlas [WARN]: MISSING COLUMN: phone_raw varchar(64) has been removed.",
          "Atlas [WARN]: UNREGISTERED COLUMN: phone_encrypted varchar(512) is active but has no catalog entry."
        ]
      },
      {
        name: "oracle",
        display_name: "Oracle",
        task: "estimate_schema_drift_risk",
        description: "Forecast connection failures, pool starvation, and downstream pipeline disruption risks.",
        status: "PENDING",
        explanation: "Predicted high impact on 2 downstream nodes. Found dbt pipeline dependency failure risk of 94.2%.",
        logs: [
          "Oracle [INFO]: Inspecting downstream dependency graph for core.users.",
          "Oracle [INFO]: Found 2 active analytic tables in Snowflake dependent on this source.",
          "Oracle [INFO]: Extrapolating regression risk on pipeline data volume rates...",
          "Oracle [WARN]: CRITICAL PREDICTION: High drift mutation risk score (94.2% AUC). Downstream dashboards are reading corrupted datasets."
        ]
      },
      {
        name: "forge",
        display_name: "Forge",
        task: "draft_alignment_sql",
        description: "Draft alignment scripts, rollback migrations, and safe schema sync patches.",
        status: "PENDING",
        explanation: "Synthesized safe Postgres alignment DDL schema patch to define backward-compatible views and register the changes.",
        logs: [
          "Forge [INFO]: Synthesizing migration patch statements matching PostgreSQL dialect.",
          "Forge [INFO]: Constructing backward-compatible view layer to alias phone_encrypted as phone_raw if needed.",
          "Forge [INFO]: Assembling DataHub schema registration REST payload...",
          "Forge [SUCCESS]: Generated alignment DDL script successfully."
        ]
      }
    ],
    memory_matches: [
      {
        id: "mem-8fa4e28-1b03-49aa",
        incident: "Downstream Pipeline Interruption due to Schema Drift",
        similarity: "94.2%",
        final_outcome: "Schema drift resolved. Orders pipeline restarted. 1,240 delayed processing rows backfilled into staging tables successfully."
      }
    ],
    datahub_context: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
      name: "core.users",
      platform: "postgres",
      domain: "Engineering",
      tags: ["PII", "CCPA", "GDPR", "Tier-1", "MasterData"],
      fields: [
        { field_path: "id", type: "UUID", description: "Primary unique surrogate customer account key.", nullable: false, tags: ["surrogate_key"] },
        { field_path: "email", type: "VARCHAR", description: "User contact address. CCPA/PII sensitive.", nullable: true, tags: ["PII", "CCPA"] },
        { field_path: "password_hash", type: "VARCHAR", description: "Credential hash. High protection required.", nullable: false, tags: ["SECRET"] },
        { field_path: "phone_encrypted", type: "VARCHAR", description: "Encrypted telephone identifier.", nullable: true, tags: ["PII", "CCPA"] }
      ],
      owners: [
        { name: "SecOps Security Team", email: "secops@acme-aerospace.com", role: "STEWARD" },
        { name: "DBA Site Operations", email: "dba-oncall@acme-aerospace.com", role: "DATA_OWNER" }
      ],
      lineage: {
        upstream: [],
        downstream: [
          { urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)", name: "analytics.user_demographics", platform: "snowflake" },
          { urn: "urn:li:dashboard:acme_aerospace.analytics.executive_dashboard", name: "Executive Metrics Dashboard", platform: "tableau" }
        ]
      }
    },
    executive_summary: "A schema migration on the core customer accounts table dropped a column referenced by the Spark daily demographics aggregator. The pipeline processed nulls instead of throwing an error, degrading LTV analytics in executive dashboards. Orixa traced the lineage, flagged the uncatalogued 'phone_encrypted' column, and prepared a safe database view alias to restore operational health.",
    root_cause: "The migration V2.4 dropped the legacy column 'phone_raw' immediately. Downstream pipelines were not updated concurrently, and the Airflow ETL ignored parsing anomalies because of soft-failing ingestion configurations.",
    risk_assessment: "Prolonged analytics outage disrupts executive decision logs and financial forecasts. Manually hard-coding overrides risks database locking during active user sessions.",
    remediations: [
      {
        action_type: "SQL_MIGRATION",
        title: "Create Legacy View Schema Alias",
        description: "Apply Forge's safe Postgres schema view to provide backward-compatibility with the 'phone_raw' field during Spark runtime transitions.",
        code: "BEGIN;\nCREATE OR REPLACE VIEW core.users_compat AS\n  SELECT \n    id,\n    email,\n    password_hash,\n    phone_encrypted,\n    phone_encrypted AS phone_raw -- Alias legacy name for compatibility\n  FROM core.users;\nCOMMIT;"
      },
      {
        action_type: "CONFIG_PATCH",
        title: "Synchronize DataHub Catalog Specifications",
        description: "Post updated column fields definition to DataHub catalog endpoint to align registered specs with current production schemas.",
        code: "curl -X POST http://datahub.acme-aerospace.com/api/v1/metadata/register \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"urn\": \"urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)\",\n    \"fields\": [\"id\", \"email\", \"password_hash\", \"phone_encrypted\"]\n  }'"
      }
    ],
    confidence_score: 0.98,
    supporting_evidence: [
      "DB Migration Logs: V2.4__encrypt_users.sql executed successfully at 02:00:05 UTC.",
      "Spark Job exceptions on file hdfs://nameservice1/user/spark/demographics/pyspark_daily_agg: 'AnalysisException: cannot resolve phone_raw'.",
      "DataHub Audit: REST diff verified 1 metadata mismatch on core.users."
    ]
  },
  {
    id: "stale-ml-feature",
    title: "Stale ML Feature",
    short_description: "Outdated feature store parameters cause drone risk models to make poor safety evaluations.",
    category: "Machine Learning",
    background: "The feature store feeding Acme's drone flight path risk analyzer ('flight_risk_xgb') stalled because the dbt pipeline sync task starved on Kubernetes memory limits. The ML model made autonomous routing evaluations using wind-speed and obstacle telemetry data that was 72 hours stale, leading to multiple course-correction overrides during high wind-shears in the Rocky Mountain region.",
    investigation_timeline: [
      { time: "11:00 UTC", title: "Airflow Task Fails", description: "Airflow task 'ml_feature_store_sync' starts ingestion of regional sensor metrics." },
      { time: "11:02 UTC", title: "Pod OOM-Killed", description: "GKE node terminates Pandas sync worker due to out-of-memory (OOM) ceiling limits." },
      { time: "14:00 UTC", title: "Predictor Query Stale Store", description: "ML Model flight_risk_xgb polls analytic feature table. Reads stale metrics cached 3 days ago." },
      { time: "16:00 UTC", title: "Abnormal Wind-Shear Encountered", description: "Drones fly into unexpected weather fronts due to incorrect wind-shear safety ratings." },
      { time: "16:30 UTC", title: "Manual Override Engaged", description: "Flight operations initiates manual telemetry holding patterns. Dispatches Atlas to trace ML inference failure." }
    ],
    participating_specialists: [
      {
        name: "architect",
        display_name: "Architect",
        task: "trace_pipeline_dependencies",
        description: "Graph dependencies and trace active API pipelines across multi-cluster boundaries.",
        status: "PENDING",
        explanation: "Isolated flight_risk_xgb model dependency line, revealing it was polling analytics.ml_features_prod which had not updated since July 11th.",
        logs: [
          "Architect [INFO]: Querying analytical mesh directory maps...",
          "Architect [INFO]: Tracing lineage for flight_risk_xgb predictor container...",
          "Architect [INFO]: Parent dependency: snowflake.analytics.ml_features_prod [STALE].",
          "Architect [WARN]: Pipeline age check failed: Last update 72.4 hours ago. Threshold is 1.0 hours."
        ]
      },
      {
        name: "oracle",
        display_name: "Oracle",
        task: "forecast_pool_starvation",
        description: "Analyze accuracy ratings, forecast data growth, and predict failure thresholds.",
        status: "PENDING",
        explanation: "Evaluated prediction accuracy regression. Found model AUC metric fell from 0.94 to 0.58 due to stale feature variables.",
        logs: [
          "Oracle [INFO]: Evaluating ML inference error logs...",
          "Oracle [INFO]: Comparing flight outcomes with model risk probabilities.",
          "Oracle [WARN]: CRITICAL DRIFT: AUC metric fell to 0.58 (near random guessing threshold).",
          "Oracle [INFO]: Risk Assessment: Stale features are causing catastrophic safety miscalculations."
        ]
      },
      {
        name: "sentinel",
        display_name: "Sentinel",
        task: "scan_operational_logs",
        description: "Scan active system cluster events, CPU limits, and thread pools for failures.",
        status: "PENDING",
        explanation: "Scrubbed Kubernetes events. Found pod OOM-Killed exception on GKE cluster during regional telemetry aggregation.",
        logs: [
          "Sentinel [INFO]: Scanning container events for GKE namespace 'ml-pipelines'...",
          "Sentinel [WARN]: FOUND MATCH: Pod 'ml-feature-store-sync-df8a9' terminated with Exit Code 137.",
          "Sentinel [WARN]: REASON: OOMKilled. Memory limit 8.0Gi exceeded."
        ]
      }
    ],
    memory_matches: [
      {
        id: "mem-1209da3-0988-11ea",
        incident: "Inference drift on stale predictive parameters",
        similarity: "88.5%",
        final_outcome: "Model accuracy restored. Memory limits increased in Kubernetes manifest configs."
      }
    ],
    datahub_context: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.ml_features_prod,PROD)",
      name: "analytics.ml_features_prod",
      platform: "snowflake",
      domain: "Analytics",
      tags: ["DRIFTED", "dbt", "ML-Inference", "Autonomous-Systems"],
      fields: [
        { field_path: "sensor_id", type: "VARCHAR", description: "Weather station sensor identifier.", nullable: false },
        { field_path: "wind_speed_knots", type: "FLOAT", description: "Average wind speed metrics.", nullable: true },
        { field_path: "shear_index", type: "FLOAT", description: "Computed wind shear risk index.", nullable: true },
        { field_path: "last_sync_timestamp", type: "TIMESTAMP", description: "Telemetry update verification timestamp.", nullable: false }
      ],
      owners: [
        { name: "ML Platform Team", email: "mlops@acme-aerospace.com", role: "DATA_OWNER" },
        { name: "Flight Safety Operations", email: "safety@acme-aerospace.com", role: "STEWARD" }
      ],
      lineage: {
        upstream: [
          { urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.weather_telemetry,PROD)", name: "core.weather_telemetry", platform: "postgres" }
        ],
        downstream: [
          { urn: "urn:li:model:acme_aerospace.flight_risk_xgb", name: "flight_risk_xgb", platform: "spark" }
        ]
      }
    },
    executive_summary: "Drone flight path safety assessments degraded due to stale wind-shear telemetry. The underlying ML feature store stopped updating after a Kubernetes executor ran out of memory. Sentinel located the OOM-Killed worker node. Orixa structured an immediate resource allocation patch to restart the ingest and safeguard autonomous navigation coordinates.",
    root_cause: "High-density sensor volume following regional summer storms exceeded the GKE feature store synchronization worker's 8.0GB RAM limit, causing the container to crash silently.",
    risk_assessment: "Stale safety indices increase drone collision risks, potentially violating federal drone corridor flight safety authorizations.",
    remediations: [
      {
        action_type: "CONFIG_PATCH",
        title: "Adjust Kubernetes Worker Memory Limit",
        description: "Modify the Helm charts and K8s Deployment configs for ml_feature_store_sync to raise resource limits to 16.0Gi RAM.",
        code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ml-feature-store-sync\nspec:\n  template:\n    spec:\n      containers:\n      - name: sync-worker\n        resources:\n          limits:\n            memory: \"16Gi\" -- Increased from 8Gi to prevent OOM\n            cpu: \"4000m\"\n          requests:\n            memory: \"8Gi\"\n            cpu: \"2000m\""
      },
      {
        action_type: "ACCESS_CONTROL",
        title: "Re-run Airflow Synchronization Dag",
        description: "Manually re-trigger the sync DAG with increased executor capacity to clear stale telemetry bottlenecks.",
        code: "airflow dags trigger -c '{\"override_memory_limit_gb\": 16}' ml_feature_store_sync"
      }
    ],
    confidence_score: 0.92,
    supporting_evidence: [
      "Kubernetes daemon logs: GKE-node-22 returned 'Out of memory: Kill process ml-feature-store-sync'.",
      "Model Evaluation: flight_risk_xgb predictive accuracy evaluated at 0.58 AUC (standard baseline: 0.94).",
      "DataHub Catalog Audit: analytics.ml_features_prod has not updated since July 11th, 2026."
    ]
  },
  {
    id: "pii-governance-violation",
    title: "PII Governance Violation",
    short_description: "Unencrypted customer emails and tax IDs appear in an unauthorized staging database.",
    category: "Security & PII",
    background: "An engineer created a debugging database 'sandbox.project_alpha' on public-facing staging servers. To run quick tests, they copied production backups containing unencrypted customer email addresses and plaintext Tax/Social Security identifiers. These tables are exposed on unprotected ports and lack standard compliance mask overlays, breaching CCPA CC-5 and GDPR Article 32 policies.",
    investigation_timeline: [
      { time: "08:15 UTC", title: "Sandbox Workspace Initialized", description: "Developer spins up sandbox.project_alpha staging catalog for query diagnostics." },
      { time: "08:22 UTC", title: "Production Data Copy", description: "Backup dump from acme_aerospace.core.users imported into the sandbox database." },
      { time: "09:30 UTC", title: "Automated Log Scan Alert", description: "Threat engine monitors query traces, flagging unhashed PII patterns." },
      { time: "10:00 UTC", title: "Compliance Score Declines", description: "Guardian detects raw tax IDs. Security rating plummets. Atlas called to initiate lockdown drills." }
    ],
    participating_specialists: [
      {
        name: "guardian",
        display_name: "Guardian",
        task: "scan_sensitive_columns",
        description: "Scan table schemas and files for plain-text PII, HIPAA, or CCPA infractions.",
        status: "PENDING",
        explanation: "Isolated raw PII column 'tax_id_unencrypted' and unmasked customer emails inside sandbox.project_alpha staging layout.",
        logs: [
          "Guardian [INFO]: Initializing scanning run against staging tables...",
          "Guardian [INFO]: Sampling 100 rows from table sandbox.project_alpha...",
          "Guardian [WARN]: COMPLIANCE EXCEPTION: Column 'tax_id_unencrypted' contains raw tax numbers.",
          "Guardian [WARN]: POLICY BREACH: Plaintext values match pattern: ^\\d{3}-\\d{2}-\\d{4}$ (US SSN).",
          "Guardian [WARN]: CCPA CC-5 violation verified."
        ]
      },
      {
        name: "sentinel",
        display_name: "Sentinel",
        task: "trigger_lockdown_drill",
        description: "Enforce network firewall fences, isolate containers, and terminate unauthorized write accesses.",
        status: "PENDING",
        explanation: "Enforced temporary workspace containment on Project Alpha container clusters, dropping active external port exposure.",
        logs: [
          "Sentinel [INFO]: Command triggered: Isolate sandbox.project_alpha.",
          "Sentinel [INFO]: Modifying egress/ingress security groups in VPC router...",
          "Sentinel [SUCCESS]: Blocked external connections on port 3000 to cluster staging-02.",
          "Sentinel [SUCCESS]: Workspace isolated successfully. Sandbox set to READ_ONLY."
        ]
      },
      {
        name: "ambassador",
        display_name: "Ambassador",
        task: "send_slack_alert",
        description: "Broadcast emergency incidents and coordination reports to Slack or external API targets.",
        status: "PENDING",
        explanation: "Pushed automated high-priority compliance infraction report to Slack war-room and opened a P1 security ticket.",
        logs: [
          "Ambassador [INFO]: Creating markdown alert notification summary...",
          "Ambassador [INFO]: Contacting Slack API channel #security-war-room...",
          "Ambassador [SUCCESS]: Dispatched alert webhook payload.",
          "Ambassador [INFO]: Generated incident ticket: SEC-INFRACTION-8802."
        ]
      }
    ],
    memory_matches: [
      {
        id: "mem-3bb4fa1-6677-49f0",
        incident: "Plaintext Secret & Sensitive PII Leak Detected",
        similarity: "97.4%",
        final_outcome: "Leaked staging columns purged. Enforced standard SHA-256 password salting routines. Compliance status set back to certified."
      }
    ],
    datahub_context: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)",
      name: "sandbox.project_alpha",
      platform: "postgres",
      domain: "Engineering",
      tags: ["VULNERABLE", "Sandbox", "Threat-Scanner-Active"],
      fields: [
        { field_path: "session_id", type: "UUID", description: "Internal development session tracker.", nullable: false },
        { field_path: "email_raw", type: "VARCHAR", description: "VULNERABILITY: Raw customer email contacts without hashing.", nullable: true, tags: ["PII", "CCPA"] },
        { field_path: "tax_id_unencrypted", type: "VARCHAR", description: "CRITICAL VULNERABILITY: Plain text tax identification parameters.", nullable: true, tags: ["PII", "CCPA", "VULNERABILITY"] }
      ],
      owners: [
        { name: "SecOps Security Team", email: "secops@acme-aerospace.com", role: "STEWARD" }
      ],
      lineage: {
        upstream: [],
        downstream: []
      }
    },
    executive_summary: "Unencrypted customer email logs and plain-text tax identifiers (SSNs) were copied from production databases into an insecure development sandbox. Guardian compliance scanners identified the policy breach, and Sentinel executed immediate container isolation. Atlas compiled a purge script to erase the unauthorized backup schemas.",
    root_cause: "A developer bypassed data safety guardrails by extracting unmasked production records into a public-facing sandbox database for query debugging.",
    risk_assessment: "Plain-text tax identifiers exposed to open developer ports present massive data breach liabilities and violate CCPA Article 5 compliance directives.",
    remediations: [
      {
        action_type: "SECURITY_PATCH",
        title: "Truncate Sandbox and Redact Sensitive Values",
        description: "Execute a hard purge of the unencrypted tables inside sandbox.project_alpha staging schema.",
        code: "BEGIN;\n-- Truncate sandbox tables to erase plain-text tax entries\nTRUNCATE TABLE sandbox.project_alpha;\nDROP TABLE IF EXISTS sandbox.debug_users_v2;\nCOMMIT;"
      },
      {
        action_type: "ACCESS_CONTROL",
        title: "Enforce Workspace IP Access Controls",
        description: "Apply strict IP-whitelisting on the sandbox postgres container to block external open port traffic.",
        code: "gcloud compute firewall-rules create block-sandbox-ingress \\\n  --action=DENY \\\n  --rules=tcp:3000,tcp:5432 \\\n  --source-ranges=0.0.0.0/0 \\\n  --target-tags=project-alpha-staging"
      }
    ],
    confidence_score: 0.99,
    supporting_evidence: [
      "Staging Query Audit: SELECT tax_id_unencrypted FROM sandbox.project_alpha executed successfully by developer IP 192.168.1.104.",
      "Guardian Scan Payload: Found 420 instances of standard US SSN formatting in plaintext varchar columns.",
      "VPC Routing logs: Sandbox cluster was accepting open public traffic on Port 3000."
    ]
  },
  {
    id: "broken-data-pipeline",
    title: "Broken Data Pipeline",
    short_description: "A network upgrade accidentally drops analytical warehouse egress IPs, breaking daily reports.",
    category: "Infrastructure",
    background: "An infrastructure team rolled out GCP cluster subnet upgrades ('gcp-subnet-v3'). The automated firewall build omitted the IP blocks of our dbt-mesh analytics loading servers from the analytical warehouse whitelist. Consequently, the daily ledger ingestion job timed out after 10 attempts, stalling SOX financial audits and leaving our company reports incomplete.",
    investigation_timeline: [
      { time: "05:00 UTC", title: "Infrastructure Patch Deployed", description: "CI/CD pipeline deploys GCP subnet updates and reconfigures cluster ingress rules." },
      { time: "05:10 UTC", title: "Firewall Whitelist Dropped", description: "New rule drops old NAT IP range of analytical loaders from whitelisted access groups." },
      { time: "06:00 UTC", title: "Ledger Pipeline Timeout", description: "Daily finance ETL job 'finance_reporting_load' fails to connect to Snowflake. Retries engaged." },
      { time: "07:00 UTC", title: "Socket Exhaustion Warning", description: "Loader exhausts port retries. Stalls loading thread pool. Prometheus triggers alerts." },
      { time: "07:30 UTC", title: "Atlas Called to Intervene", description: "SRE on-call assigns Atlas Supervisor to trace the root connection bottleneck." }
    ],
    participating_specialists: [
      {
        name: "architect",
        display_name: "Architect",
        task: "audit_ingress_routing",
        description: "Scan container routing paths, ports, security boundaries, and whitelists.",
        status: "PENDING",
        explanation: "Isolated routing blockages. Checked network topologies, confirming GCP firewall dropped access from dbt subnet 10.140.0.0/20.",
        logs: [
          "Architect [INFO]: Compiling active network path diagrams...",
          "Architect [INFO]: Mapping route from dbt-mesh executor to Snowflake VPC endpoint...",
          "Architect [INFO]: Checking port 443 egress states...",
          "Architect [WARN]: ROUTE BLOCKED: Connection rejected by firewall rule 'deny-unvetted-staging-egress'."
        ]
      },
      {
        name: "sentinel",
        display_name: "Sentinel",
        task: "scan_operational_logs",
        description: "Scan active system cluster events, CPU limits, and thread pools for failures.",
        status: "PENDING",
        explanation: "Detected connection timeout logs. Traced socket errors pointing to TCP connection handshake rejection.",
        logs: [
          "Sentinel [INFO]: Reviewing analytics load container error logs...",
          "Sentinel [WARN]: FOUND ERROR: tcp_connection_handshake_timeout after 15000ms.",
          "Sentinel [WARN]: Traced 10 sequential socket drops on Snowflake destination."
        ]
      },
      {
        name: "ambassador",
        display_name: "Ambassador",
        task: "send_slack_alert",
        description: "Broadcast emergency incidents and coordination reports to Slack or external API targets.",
        status: "PENDING",
        explanation: "Opened critical SRE ticket on Jira and dispatched an emergency P1 alert hook to Slack SRE-oncall channel.",
        logs: [
          "Ambassador [INFO]: Creating Jira service desk incident ticket...",
          "Ambassador [SUCCESS]: Opened ticket SRE-9904: Analytical Connection Blocks.",
          "Ambassador [INFO]: Pushing markdown summary to Slack #sre-alerts..."
        ]
      }
    ],
    memory_matches: [
      {
        id: "mem-7bb1da5-2244-11f2",
        incident: "Analytical Warehouse Connection Timeout",
        similarity: "91.2%",
        final_outcome: "Whitelisted outbound egress IP blocks and scale timeout parameters. Normal connection queries succeeded thereafter."
      }
    ],
    datahub_context: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)",
      name: "analytics.finance_reporting",
      platform: "snowflake",
      domain: "Finance",
      tags: ["FINANCIAL", "CCPA", "SOX", "Tier-1"],
      fields: [
        { field_path: "invoice_id", type: "VARCHAR", description: "Unique billing transaction reference ID.", nullable: false },
        { field_path: "amount_usd", type: "DECIMAL(12,2)", description: "Gross ledger amount transacted.", nullable: false },
        { field_path: "timestamp", type: "TIMESTAMP", description: "Audit ledger record timestamp.", nullable: false }
      ],
      owners: [
        { name: "Finance Controller Team", email: "finance-steward@acme-aerospace.com", role: "STEWARD" }
      ],
      lineage: {
        upstream: [
          { urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)", name: "core.users", platform: "postgres" }
        ],
        downstream: []
      }
    },
    executive_summary: "Daily ledger data pipelines timed out after GCP subnet upgrades dropped our dbt analytics servers from Snowflake's security whitelists. Architect and Sentinel traced the blockage to firewall rule 'deny-unvetted-staging-egress'. Atlas generated an immediate Terraform patch to re-whitelist the network blocks and resume critical SOX reports.",
    root_cause: "The subnet migration build script lacked a regression block for dbt-mesh loader IP lists, which led to their accidental removal from the security whitelist.",
    risk_assessment: "Unresolved data pipeline blockages disrupt financial reporting schedules, risking SOX quarterly audit compliance failures.",
    remediations: [
      {
        action_type: "CONFIG_PATCH",
        title: "Deploy Whitelist Terraform Patch",
        description: "Apply SRE-vetted Terraform updates to add dbt-mesh subnets back into Snowflake VPC allowed-ingress lists.",
        code: "resource \"google_compute_firewall\" \"allow_dbt_egress\" {\n  name    = \"allow-dbt-to-snowflake-egress\"\n  network = google_compute_network.default.name\n\n  allow {\n    protocol = \"tcp\"\n    ports    = [\"443\", \"10444\"]\n  }\n\n  direction     = \"EGRESS\"\n  destination_ranges = [\"10.140.0.0/20\"] -- Re-whitelist dbt subnet\n  target_tags   = [\"snowflake-warehouse\"]\n}"
      },
      {
        action_type: "ACCESS_CONTROL",
        title: "Adjust Pipeline Connection Keepalive",
        description: "Configure analytical connection pool templates with robust keepalive retries to tolerate minor network transitions.",
        code: "-- Adjust Snowflake Connection String Parameters\nALTER USER dbt_mesh_loader SET\n  STATEMENT_TIMEOUT_IN_SECONDS = 180,\n  ABORT_DETACHED_QUERY = TRUE;"
      }
    ],
    confidence_score: 0.95,
    supporting_evidence: [
      "VPC Audit Logs: Connection dropped at 05:10:22 UTC on route 10.140.0.5 -> 10.120.40.10:443 (TCP reset).",
      "Terraform build logs: Git commit 'f22ea8' modified file 'gcp-subnet-v3/firewalls.tf', deleting DBT_LOADER_NAT variable.",
      "Snowflake system telemetry: Zero successful connections registered from DBT loader nodes since 05:10 UTC."
    ]
  },
  {
    id: "missing-dataset-owner",
    title: "Missing Dataset Owner",
    short_description: "An unowned critical dataset stalls incident resolution during data validation anomalies.",
    category: "Governance",
    background: "An analytical ledger dataset 'finance.ledger_v2' triggered data quality alerts due to anomalous negative account balances. When Atlas attempted to auto-assign a remediation ticket, it discovered the asset had no registered owner in DataHub because the lead accountant recently left the company. Without a registered steward, incident escalation stalled, leaving a major validation warning unaddressed.",
    investigation_timeline: [
      { time: "14:00 UTC", title: "Anomalous Values Flagged", description: "Soda SQL quality scans flag negative balances in core finance ledger table." },
      { time: "14:01 UTC", title: "Atlas Supervisor Dispatched", description: "Atlas receives exception alerts and attempts to look up registered data owners." },
      { time: "14:02 UTC", title: "Owner Query Returns Empty", description: "DataHub registry returns empty owner lists for finance.ledger_v2. Steward left the firm." },
      { time: "14:15 UTC", title: "Escalation Path Blocks", description: "Remediation assignment stalls with no contact points, degrading compliance safety score." },
      { time: "14:30 UTC", title: "Archivist Engagement", description: "Atlas tasks Archivist to analyze Git and DataHub histories to find the best candidate owner." }
    ],
    participating_specialists: [
      {
        name: "atlas",
        display_name: "Atlas",
        task: "sync_datahub_metadata",
        description: "Verify actual physical table configurations against registered catalog blueprints.",
        status: "PENDING",
        explanation: "Verified that finance.ledger_v2 has 0 owners assigned. Triggered an immediate metadata sync query.",
        logs: [
          "Atlas [INFO]: Fetching asset details for finance.ledger_v2...",
          "Atlas [WARN]: ORPHAN ASSET DETECTED: URN has no active owner profiles.",
          "Atlas [WARN]: Outbound Slack alerts could not be routed.",
          "Atlas [INFO]: Initiating fallback archivist discovery..."
        ]
      },
      {
        name: "archivist",
        display_name: "Archivist",
        task: "search_knowledge_base",
        description: "Query enterprise runbooks, schemas, and historical records to find solutions.",
        status: "PENDING",
        explanation: "Scanned repository Git logs and data directories, identifying lead developer 'Sarah Vance' as the primary creator of ledger schemas.",
        logs: [
          "Archivist [INFO]: Querying code commit history for finance/ledger/ schema scripts...",
          "Archivist [INFO]: Found 14 commits by 'sarah.vance@acme-aerospace.com'.",
          "Archivist [INFO]: Found runbook 'Finance Data Stewards v2' linking 'ledger' datasets to the Treasury Division.",
          "Archivist [SUCCESS]: Identified Sarah Vance as creator, and Treasury lead as executive steward."
        ]
      },
      {
        name: "ambassador",
        display_name: "Ambassador",
        task: "send_slack_alert",
        description: "Broadcast emergency incidents and coordination reports to Slack or external API targets.",
        status: "PENDING",
        explanation: "Assigned an emergency ownership claim ticket to the Treasury Director and notified Sarah Vance on Slack.",
        logs: [
          "Ambassador [INFO]: Assembling catalog ownership correction proposal...",
          "Ambassador [INFO]: Slack message sent to Sarah Vance: request to confirm stewardship claim.",
          "Ambassador [SUCCESS]: Opened ownership ticket GOV-OWNER-9912 assigned to Treasury Group."
        ]
      }
    ],
    memory_matches: [
      {
        id: "mem-1902a11-0422-99ca",
        incident: "Orphaning of customer transaction schema nodes",
        similarity: "85.1%",
        final_outcome: "Ownership assigned to central accounting platform team. DataHub synchronization rules hardened."
      }
    ],
    datahub_context: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.finance.ledger_v2,PROD)",
      name: "finance.ledger_v2",
      platform: "snowflake",
      domain: "Finance",
      tags: ["ORPHANED", "FINANCIAL", "SOX", "Tier-1"],
      fields: [
        { field_path: "entry_id", type: "UUID", description: "Journal entry primary key.", nullable: false },
        { field_path: "account_code", type: "VARCHAR", description: "Standard accounting ledger balance keys.", nullable: false },
        { field_path: "current_balance", type: "DOUBLE", description: "Current ledger balance. Must be non-negative.", nullable: false }
      ],
      owners: [], // EMPTY
      lineage: {
        upstream: [
          { urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)", name: "analytics.finance_reporting", platform: "snowflake" }
        ],
        downstream: []
      }
    },
    executive_summary: "Critical finance dataset ledger_v2 triggered negative-balance anomaly alerts, but incident response stalled because the table had no registered owner in DataHub. Archivist scanned code repositories, identified Sarah Vance as the primary creator, and Ambassador created an automated Ticket requesting immediate Treasury stewardship enrollment.",
    root_cause: "The previous data owner left the company without executing a transitional stewardship transfer, leaving multiple core financial catalog nodes unassigned.",
    risk_assessment: "Unstewarded critical financial tables can result in unaddressed ledger drift, compromising SOX compliance certifications.",
    remediations: [
      {
        action_type: "CONFIG_PATCH",
        title: "Register Asset Owner in DataHub Catalog",
        description: "Register Treasury Platform Team and Sarah Vance as owners of the finance.ledger_v2 asset.",
        code: "curl -X POST http://datahub.acme-aerospace.com/api/v1/metadata/owners \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"urn\": \"urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.finance.ledger_v2,PROD)\",\n    \"owners\": [\n      {\"email\": \"sarah.vance@acme-aerospace.com\", \"type\": \"USER\", \"role\": \"DATA_OWNER\"},\n      {\"email\": \"treasury-steward@acme-aerospace.com\", \"type\": \"GROUP\", \"role\": \"STEWARD\"}\n    ]\n  }'"
      },
      {
        action_type: "SECURITY_PATCH",
        title: "Deploy Owner Gatekeeper Pre-flight Check",
        description: "Deploy a pipeline blocker that prevents code merges for datasets that do not have active owners registered in DataHub.",
        code: "#!/bin/bash\n# Pre-flight data-mesh owner validation gatekeeper\nURN=$1\nOWNERS_COUNT=$(curl -s http://datahub/api/v1/metadata/owners?urn=$URN | jq '.owners | length')\nif [ \"$OWNERS_COUNT\" -eq \"0\" ]; then\n  echo \"ERROR: Cannot deploy. Dataset $URN must have at least one registered owner.\"\n  exit 1\nfi"
      }
    ],
    confidence_score: 0.89,
    supporting_evidence: [
      "DataHub metadata query: 'GET /api/v1/dataset/finance.ledger_v2/owners' returned HTTP 200 with empty list [].",
      "Git commit database: sarah.vance@acme-aerospace.com authored 92% of lines in finance_ledger_schema.sql.",
      "Workday HR directory: Lead steward Michael Chen marked as 'DEPARTED' as of July 1st, 2026."
    ]
  }
];

// ============================================================================
// Main Component
// ============================================================================

interface DemoModeProps {
  addLog: (msg: string) => void;
}

export default function DemoMode({ addLog }: DemoModeProps) {
  // Scenario Selection
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("silent-schema-disaster");
  
  // Scenarios State - we copy the raw scenario data to mutate statuses during playback
  const [scenarios, setScenarios] = useState<Scenario[]>(JSON.parse(JSON.stringify(ENTERPRISE_SCENARIOS)));
  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  // Playback Control States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(3000); // ms per sub-step
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  // Detail Stage controlling the visual pipeline view
  // Timeline Stages mapped: 
  // Step 0: "analyzing" (parsing intent)
  // Step 1: "planning" (structuring steps)
  // Step 2: "selection" (fleet enrollment)
  // Step 3..N+2: "executing" (running specialists one by one)
  // Step Last-1: "aggregating" (solution synthesis)
  // Step Last: "completed" (final report dashboard)
  const [timelineStage, setTimelineStage] = useState<"analyzing" | "planning" | "selection" | "executing" | "aggregating" | "completed">("analyzing");
  const [activeSpecialistIdx, setActiveSpecialistIdx] = useState<number>(-1);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "lineage" | "catalog" | "remediations" | "evidence">("overview");
  
  const [copiedRemediationIdx, setCopiedRemediationIdx] = useState<number | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Restart playback when scenario selection changes
  useEffect(() => {
    resetPlayback();
    addLog(`Demo Mode: Selected scenario [${currentScenario.title}]`);
  }, [selectedScenarioId]);

  // Keep logs scrolled to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveLogs]);

  // ============================================================================
  // Playback Step Master Ticker
  // ============================================================================
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        executeNextStep();
      }, playSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, playSpeed, selectedScenarioId]);

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setTimelineStage("analyzing");
    setActiveSpecialistIdx(-1);
    
    // Reset specialists status
    const resetScenarios = JSON.parse(JSON.stringify(ENTERPRISE_SCENARIOS));
    setScenarios(resetScenarios);

    // Seed initial logs
    const active = resetScenarios.find((s: any) => s.id === selectedScenarioId) || resetScenarios[0];
    setLiveLogs([
      `[Supervisor] Dispatched. Orchestrating investigation playbook.`,
      `[Supervisor] Loading organizational context...`,
      `[Parser] Parsing user incident request: "${active.short_description}"`
    ]);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      addLog(`Demo Mode: Paused investigation playback`);
    } else {
      setIsPlaying(true);
      addLog(`Demo Mode: Resumed investigation playback`);
    }
  };

  // Determine total steps in current scenario's playback flow:
  // - Step 0: Analyzing (Parsing Request)
  // - Step 1: Planning (Structure strategic steps)
  // - Step 2: Selection (AI Specialists enrolled)
  // - Steps 3 to 3 + Specialists.length - 1: Sequential specialist runs
  // - Step 3 + Specialists.length: Aggregating (Gemini synthesis)
  // - Step 3 + Specialists.length + 1: Completed
  const specialists = currentScenario.participating_specialists;
  const totalSteps = 4 + specialists.length; 

  const executeNextStep = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx >= totalSteps) {
      setIsPlaying(false);
      return;
    }
    jumpToStep(nextIdx);
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);

    // Map stepIndex to timeline stages
    if (stepIndex === 0) {
      setTimelineStage("analyzing");
      setActiveSpecialistIdx(-1);
      
      // Reset specialists
      const resetSpecs = [...currentScenario.participating_specialists];
      resetSpecs.forEach(s => s.status = "PENDING");
      updateScenarioSpecialists(resetSpecs);

      setLiveLogs([
        `[Supervisor] Dispatched. Orchestrating investigation playbook.`,
        `[Supervisor] Loading organizational context...`,
        `[Parser] Parsing user incident request: "${currentScenario.short_description}"`
      ]);

    } else if (stepIndex === 1) {
      setTimelineStage("planning");
      setActiveSpecialistIdx(-1);

      // Reset specialists
      const resetSpecs = [...currentScenario.participating_specialists];
      resetSpecs.forEach(s => s.status = "PENDING");
      updateScenarioSpecialists(resetSpecs);

      setLiveLogs(prev => [
        ...prev,
        `[Planner] Intent parsed successfully. Classification: ${currentScenario.category.toUpperCase()}`,
        `[Planner] Strategic multi-agent planning sequence initiated...`,
        `[Planner] Structuring chronological task blueprint with ${specialists.length} strategic dispatches.`,
        ...specialists.map(s => `[Planner] Registered Step: Dispatch specialized AI ${s.display_name} to execute ${s.task}.`)
      ]);

    } else if (stepIndex === 2) {
      setTimelineStage("selection");
      setActiveSpecialistIdx(-1);

      // Reset specialists
      const resetSpecs = [...currentScenario.participating_specialists];
      resetSpecs.forEach(s => s.status = "PENDING");
      updateScenarioSpecialists(resetSpecs);

      setLiveLogs(prev => [
        ...prev,
        `[Enrollment] Accessing active AI specialized agent directory...`,
        ...specialists.map(s => `[Enrollment] Enrolled ${s.display_name} (${s.name}) -> Status shifted from IDLE to ACTIVE.`),
        `[Supervisor] Initializing synchronous isolation execution matrix...`
      ]);

    } else if (stepIndex >= 3 && stepIndex < 3 + specialists.length) {
      setTimelineStage("executing");
      const specIdx = stepIndex - 3;
      setActiveSpecialistIdx(specIdx);

      // Update specialist statuses up to this point
      const updatedSpecs = [...currentScenario.participating_specialists];
      for (let i = 0; i < updatedSpecs.length; i++) {
        if (i < specIdx) {
          updatedSpecs[i].status = "COMPLETED";
        } else if (i === specIdx) {
          updatedSpecs[i].status = "EXECUTING";
        } else {
          updatedSpecs[i].status = "PENDING";
        }
      }
      updateScenarioSpecialists(updatedSpecs);

      const activeSpec = updatedSpecs[specIdx];
      setLiveLogs(prev => [
        ...prev,
        `[Supervisor] Dispatched specialist ${activeSpec.display_name} to target asset.`,
        ...activeSpec.logs,
        `[Supervisor] Specialist ${activeSpec.display_name} execution successfully concluded.`
      ]);

    } else if (stepIndex === 3 + specialists.length) {
      setTimelineStage("aggregating");
      setActiveSpecialistIdx(-1);

      // All specialists finished
      const updatedSpecs = [...currentScenario.participating_specialists];
      updatedSpecs.forEach(s => s.status = "COMPLETED");
      updateScenarioSpecialists(updatedSpecs);

      setLiveLogs(prev => [
        ...prev,
        `[Aggregator] Specialist matrix execution loops concluded.`,
        `[Aggregator] Triggering Google Gemini analytical synthesis on model gemini-2.5-flash...`,
        `[Aggregator] Compiling findings and cross-referencing Organizational Memory database...`,
        `[Aggregator] Matching similar incidents: Identified past reference ${currentScenario.memory_matches[0]?.id || "None"}.`,
        `[Aggregator] Synthesizing consolidated mitigations and risk assessment reports...`
      ]);

    } else if (stepIndex === 4 + specialists.length) {
      setTimelineStage("completed");
      setActiveSpecialistIdx(-1);

      // All completed
      const updatedSpecs = [...currentScenario.participating_specialists];
      updatedSpecs.forEach(s => s.status = "COMPLETED");
      updateScenarioSpecialists(updatedSpecs);

      setLiveLogs(prev => [
        ...prev,
        `[Supervisor] Incident report synthesis complete.`,
        `[Supervisor] Safety recommendations generated with a confidence score of ${(currentScenario.confidence_score * 100).toFixed(0)}%.`,
        `[Supervisor] Standby. Presenting master mitigation dashboard.`
      ]);
      setActiveTab("overview");
    }
  };

  const updateScenarioSpecialists = (specs: ScenarioSpecialistAction[]) => {
    setScenarios(prev => {
      return prev.map(s => {
        if (s.id === selectedScenarioId) {
          return {
            ...s,
            participating_specialists: specs
          };
        }
        return s;
      });
    });
  };

  const copyRemediationCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedRemediationIdx(idx);
    addLog(`Demo Mode: Copied remediation patch script to clipboard.`);
    setTimeout(() => setCopiedRemediationIdx(null), 2000);
  };

  // ============================================================================
  // Rendering Helpers
  // ============================================================================

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "postgres":
        return <Database className="h-4 w-4 text-sky-400" />;
      case "snowflake":
        return <Server className="h-4 w-4 text-indigo-400" />;
      default:
        return <Database className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div id="demo-mode-section" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase">
              Judging Sandbox
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-zinc-500 font-mono">OFFLINE DEMO CAPABILITY</span>
          </div>
          <h1 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mt-1 flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-500 animate-pulse" /> Orixa Presentation & Demo Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            Demonstrate Orixa's Enterprise Intelligence Operating System step-by-step. Select high-fidelity scenarios to audit schema failures, security leaks, ML feature staleness, and routing blockages completely offline.
          </p>
        </div>

        {/* Playback Controls Panel */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-900/30 border border-zinc-850 p-2.5 rounded-xl shrink-0">
          <button
            onClick={resetPlayback}
            className="p-2.5 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
            title="Reset Playback"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-4 py-2 flex items-center gap-2 text-xs uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-600/20 border border-amber-600/30 text-amber-400 hover:bg-amber-600/30"
                : "bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Play Playbook
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (currentStepIndex + 1 < totalSteps) {
                jumpToStep(currentStepIndex + 1);
              }
            }}
            disabled={currentStepIndex + 1 >= totalSteps}
            className="p-2.5 hover:bg-zinc-850 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
            title="Next Step"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          <div className="h-6 w-[1px] bg-zinc-850 mx-1" />

          {/* Speed selector */}
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Speed:</span>
            <select
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-[10px] font-mono rounded px-1.5 py-1 focus:outline-none cursor-pointer hover:border-zinc-700"
            >
              <option value={4000}>0.5x (4s)</option>
              <option value={2500}>1.0x (2.5s)</option>
              <option value={1200}>2.0x (1.2s)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Playback Progress bar */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-zinc-400">PLAYBACK STEP:</span>
            <span className="text-white font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
          <div className="text-zinc-400 font-medium">
            Timeline Stage: <span className="text-indigo-400 uppercase font-bold">{timelineStage}</span>
          </div>
        </div>
        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden flex gap-[2px]">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToStep(idx)}
              className={`h-full flex-1 transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] scale-y-125"
                  : idx < currentStepIndex
                  ? "bg-indigo-600/60"
                  : "bg-zinc-850 hover:bg-zinc-800"
              }`}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3. Scenario selector & Background view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scenario Grid Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3">
            <h3 className="text-xs font-display font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Choose Presentation Scenario
            </h3>
            <div className="space-y-2">
              {scenarios.map((scen) => {
                const isSelected = scen.id === selectedScenarioId;
                return (
                  <button
                    key={scen.id}
                    onClick={() => setSelectedScenarioId(scen.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? "bg-zinc-900 border-indigo-500/40 text-white shadow-[0_0_16px_rgba(99,102,241,0.08)] border-l-4 border-l-indigo-500"
                        : "bg-zinc-950 border-zinc-900 hover:bg-zinc-900/40 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-display truncate pr-2">
                        {scen.title}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                        isSelected 
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                          : "bg-zinc-900 text-zinc-500 border-zinc-850"
                      }`}>
                        {scen.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {scen.short_description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4.5 bg-zinc-900/10 border border-zinc-900 rounded-xl text-xs text-zinc-400 leading-relaxed space-y-3 font-sans">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Info className="h-4 w-4 text-indigo-400" /> Presenter's Tip
            </div>
            <p>
              Click <strong>Play Playbook</strong> to watch the active scenario run through Atlas's operational loop automatically. You can pause the execution at any time to inspect specific lineage maps, DataHub context variables, code rollbacks, or supporting files.
            </p>
          </div>
        </div>

        {/* Background Narrative of Current Scenario (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-400" /> Scenario Narrative Context
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-500 font-mono">CONFIDENCE INDEX:</span>
                <span className="text-xs font-mono font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 border border-indigo-500/20 rounded">
                  {(currentScenario.confidence_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-display font-black tracking-wide text-white">
                {currentScenario.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {currentScenario.background}
              </p>
            </div>

            {/* In-Memory Database Similarity Match Card */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-start gap-3.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center shrink-0">
                <Layers className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                  Organizational Memory Similarity Vector
                </div>
                {currentScenario.memory_matches.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="text-indigo-400 underline font-mono text-[11px]">{m.id}</span> — {m.incident}
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold ml-1">
                        {m.similarity} MATCH
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      <strong>Lessons learned:</strong> {m.final_outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 mt-4 flex items-center gap-2.5 text-xs text-zinc-500 font-mono">
            <Server className="h-4 w-4 text-zinc-600" />
            <span>Target Catalog Node:</span>
            <span className="text-zinc-300 select-all font-semibold font-mono text-[11px]">
              {currentScenario.datahub_context.urn}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Atlas Orchestration Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Stepper (5 Cols) */}
        <div className="lg:col-span-5 p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 font-display">
              <Layers className="h-4.5 w-4.5 text-indigo-400" /> Orchestration Sequence Steps
            </h3>
            <span className="text-[10px] font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/5 border border-indigo-500/10 uppercase tracking-wider animate-pulse">
              {timelineStage}
            </span>
          </div>

          {/* Stepper Steps mapping actual Atlas execution */}
          <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-900">
            
            {/* Stage 1: Analyzing */}
            <div className="flex gap-4 items-start relative z-10">
              <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                timelineStage === "analyzing"
                  ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.35)] font-bold"
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
              }`}>
                {timelineStage !== "analyzing" ? <Check className="h-3 w-3" /> : "1"}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">Intent Classification & Parsing</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Parsing request to deduce problem vectors and operational metadata.
                </p>
              </div>
            </div>

            {/* Stage 2: Planning */}
            <div className="flex gap-4 items-start relative z-10">
              <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                timelineStage === "planning"
                  ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.35)] font-bold"
                  : timelineStage !== "analyzing" && timelineStage !== "planning"
                  ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                  : "bg-zinc-950 border-zinc-900 text-zinc-600"
              }`}>
                {timelineStage !== "analyzing" && timelineStage !== "planning" ? <Check className="h-3 w-3" /> : "2"}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">Strategic Task Planning</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Structuring chronological steps for targeted specialist enrollment.
                </p>
              </div>
            </div>

            {/* Stage 3: Fleet Selection */}
            <div className="flex gap-4 items-start relative z-10">
              <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                timelineStage === "selection"
                  ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.35)] font-bold"
                  : timelineStage !== "analyzing" && timelineStage !== "planning" && timelineStage !== "selection"
                  ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                  : "bg-zinc-950 border-zinc-900 text-zinc-600"
              }`}>
                {timelineStage !== "analyzing" && timelineStage !== "planning" && timelineStage !== "selection" ? <Check className="h-3 w-3" /> : "3"}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">AI Fleet Enrollment</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Enrolling specialized agents matching necessary query execution capabilities.
                </p>
              </div>
            </div>

            {/* Stage 4: Chronological Execution Matrix */}
            <div className="flex gap-4 items-start relative z-10">
              <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                timelineStage === "executing"
                  ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.35)] font-bold"
                  : timelineStage === "aggregating" || timelineStage === "completed"
                  ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                  : "bg-zinc-950 border-zinc-900 text-zinc-600"
              }`}>
                {timelineStage === "aggregating" || timelineStage === "completed" ? <Check className="h-3 w-3" /> : "4"}
              </div>
              <div className="space-y-2.5 w-full">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white">Execution Matrix (Real-Time Status)</div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Executing isolated sandbox runs with multi-agent consensus validation.
                  </p>
                </div>

                {/* Sub-Step Specialists List */}
                <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl space-y-2 font-mono">
                  {specialists.map((spec, sIdx) => {
                    const isExecuting = timelineStage === "executing" && sIdx === activeSpecialistIdx;
                    const isPassed = timelineStage === "aggregating" || timelineStage === "completed" || (timelineStage === "executing" && sIdx < activeSpecialistIdx);
                    
                    return (
                      <div
                        key={sIdx}
                        className={`p-2 rounded-lg border text-[11px] transition-all flex items-start justify-between ${
                          isExecuting
                            ? "bg-indigo-500/5 border-indigo-500/40 text-white animate-pulse shadow-[0_2px_10px_rgba(99,102,241,0.05)]"
                            : isPassed
                            ? "bg-zinc-900/40 border-zinc-900 text-zinc-300"
                            : "bg-transparent border-transparent text-zinc-600"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`h-4.5 w-4.5 rounded-full border text-[9px] flex items-center justify-center shrink-0 ${
                            isExecuting
                              ? "bg-indigo-500 border-indigo-400 text-white font-bold"
                              : isPassed
                              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                              : "bg-zinc-900 border-zinc-850 text-zinc-600"
                          }`}>
                            {isPassed ? <Check className="h-2 w-2" /> : sIdx + 1}
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-1.5 font-mono text-zinc-200">
                              <span className={isExecuting ? "text-indigo-400" : isPassed ? "text-zinc-300" : "text-zinc-600"}>
                                {spec.display_name.toUpperCase()}
                              </span>
                              <span className="text-[9px] text-zinc-500 font-normal font-sans">({spec.task})</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{spec.description}</p>
                          </div>
                        </div>

                        {/* Real-time status pill */}
                        <div className="shrink-0 mt-0.5">
                          {isExecuting ? (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full animate-pulse">
                              RUNNING
                            </span>
                          ) : isPassed ? (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                              SUCCESS
                            </span>
                          ) : (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-zinc-900 text-zinc-600 rounded-full">
                              PENDING
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stage 5: Solution Synthesis */}
            <div className="flex gap-4 items-start relative z-10">
              <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                timelineStage === "aggregating"
                  ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.35)] font-bold"
                  : timelineStage === "completed"
                  ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                  : "bg-zinc-950 border-zinc-900 text-zinc-600"
              }`}>
                {timelineStage === "completed" ? <Check className="h-3 w-3" /> : "5"}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">Solution Synthesis (Gemini API)</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Consolidating specialist evidence logs to formulate executive remediation structures.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Console Process Logs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4 flex-1 flex flex-col min-h-[460px]">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-zinc-400">orixa_atlas_telemetry.log</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
                LIVE TERMINAL FEED
              </span>
            </div>

            {/* Scrollable logs box */}
            <div className="flex-1 overflow-y-auto pr-2 max-h-[360px] font-mono text-xs text-zinc-400 space-y-2 select-text bg-zinc-950 p-2.5 rounded-lg border border-zinc-900/40">
              {liveLogs.map((log, idx) => {
                const isHighlight = log.includes("[WARN]") || log.includes("exception") || log.includes("error") || log.includes("DRIFT");
                const isSuccess = log.includes("[SUCCESS]") || log.includes("concluded") || log.includes("complete");
                return (
                  <div
                    key={idx}
                    className={`leading-relaxed whitespace-pre-wrap flex gap-1.5 ${
                      isHighlight
                        ? "text-rose-400 bg-rose-500/[0.03] border-l-2 border-rose-500 pl-1.5"
                        : isSuccess
                        ? "text-emerald-400 bg-emerald-500/[0.03] border-l-2 border-emerald-500 pl-1.5"
                        : "text-zinc-400"
                    }`}
                  >
                    <span className="text-zinc-600 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>

            {/* Specialist Detail Drawer showing active runner details during Executing stage */}
            {timelineStage === "executing" && activeSpecialistIdx >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-2 shrink-0 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500">
                  <span>ACTIVE SANDBOX DEPLOYMENT</span>
                  <span className="text-indigo-400 flex items-center gap-1">
                    <Activity className="h-3 w-3 animate-spin" /> EXECUTING
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-indigo-400 animate-pulse" />
                    {specialists[activeSpecialistIdx]?.display_name} Specialist Agent
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded bg-zinc-950">
                    Task: {specialists[activeSpecialistIdx]?.task}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal italic font-sans">
                  &quot;{specialists[activeSpecialistIdx]?.explanation}&quot;
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Complete Result Reports - Display ONLY if completed timeline Stage */}
      <AnimatePresence>
        {timelineStage === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Nav Tabs for detailed reports */}
            <div className="border-b border-zinc-900 flex flex-wrap gap-2 pt-2">
              {[
                { id: "overview", label: "Executive Synthesis", icon: <Brain className="h-4 w-4" /> },
                { id: "lineage", label: "Dataset Lineage Map", icon: <Network className="h-4 w-4" /> },
                { id: "catalog", label: "DataHub Catalog Specs", icon: <Database className="h-4 w-4" /> },
                { id: "remediations", label: "Mitigation Patches", icon: <CheckCircle className="h-4 w-4" /> },
                { id: "evidence", label: "Supporting Evidence", icon: <FileText className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4.5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-white font-bold bg-indigo-500/[0.02]"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panes */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900/80 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-6 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Narrative columns */}
                    <div className="md:col-span-8 space-y-5">
                      <div className="space-y-2">
                        <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                          Executive Summary
                        </h3>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {currentScenario.executive_summary}
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-zinc-900 pt-4">
                        <h3 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Root Cause Analysis
                        </h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {currentScenario.root_cause}
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-zinc-900 pt-4">
                        <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                          Risk Assessment
                        </h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {currentScenario.risk_assessment}
                        </p>
                      </div>
                    </div>

                    {/* Stats sidebar */}
                    <div className="md:col-span-4 space-y-4 bg-zinc-900/20 border border-zinc-900 p-5 rounded-xl">
                      <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
                        Orchestration Telemetry
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-900/80">
                          <span className="text-zinc-500">Risk Severity Rating:</span>
                          <span className={`font-mono font-black text-[11px] px-2 py-0.5 rounded border uppercase tracking-widest ${
                            currentScenario.category === "Security & PII"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {currentScenario.category === "Security & PII" ? "CRITICAL" : "HIGH"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-900/80">
                          <span className="text-zinc-500">Orchestration Confidence:</span>
                          <span className="font-mono text-white font-bold">
                            {(currentScenario.confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-900/80">
                          <span className="text-zinc-500">Active Specialists Dispatched:</span>
                          <span className="font-mono text-indigo-400 font-bold">
                            {specialists.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500">Memory Databases Matched:</span>
                          <span className="font-mono text-white font-bold">
                            {currentScenario.memory_matches.length}
                          </span>
                        </div>
                      </div>

                      {/* Micro Specialists Fleets display */}
                      <div className="pt-2 space-y-2">
                        <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                          Fleets Contributors
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {specialists.map((s, idx) => (
                            <span key={idx} className="text-[9px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-850 px-2 py-0.5 rounded">
                              {s.display_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LINEAGE TAB */}
              {activeTab === "lineage" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                      Visual Pipeline Lineage Diagram
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Traced upstream ingestion pipelines and downstream metrics tables from the DataHub catalog registry.
                    </p>
                  </div>

                  {/* Flow chart layout */}
                  <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative overflow-x-auto min-h-[180px]">
                    
                    {/* Upstream node */}
                    <div className="flex flex-col items-center">
                      <div className="px-4 py-3 bg-zinc-900/50 border border-zinc-850 rounded-xl text-center w-52 space-y-1 shadow-md">
                        <div className="text-[9px] font-mono text-zinc-500 font-bold uppercase">
                          UPSTREAM SOURCE
                        </div>
                        <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5 truncate">
                          {currentScenario.datahub_context.lineage.upstream[0] ? (
                            <>
                              {getPlatformIcon(currentScenario.datahub_context.lineage.upstream[0].platform)}
                              {currentScenario.datahub_context.lineage.upstream[0].name}
                            </>
                          ) : (
                            <span className="text-zinc-600 italic">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arrow 1 */}
                    {currentScenario.datahub_context.lineage.upstream[0] && (
                      <div className="flex flex-col items-center text-indigo-500 shrink-0">
                        <ChevronRight className="h-5 w-5 hidden md:block" />
                        <span className="h-4 w-[2px] bg-zinc-800 md:hidden" />
                      </div>
                    )}

                    {/* Central Affected Asset Node */}
                    <div className="flex flex-col items-center">
                      <div className="px-5 py-4 bg-indigo-500/[0.03] border-2 border-indigo-500/40 rounded-2xl text-center w-60 space-y-1.5 shadow-[0_4px_20px_rgba(99,102,241,0.1)] relative">
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-indigo-500 text-white font-mono text-[8px] font-bold uppercase tracking-wider">
                          TARGET AFFECTED ASSET
                        </span>
                        <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase pt-1">
                          {currentScenario.datahub_context.platform.toUpperCase()}
                        </div>
                        <div className="text-xs font-black text-white flex items-center justify-center gap-2">
                          {getPlatformIcon(currentScenario.datahub_context.platform)}
                          {currentScenario.datahub_context.name}
                        </div>
                        <div className="text-[9px] text-zinc-400 truncate">
                          Domain: {currentScenario.datahub_context.domain}
                        </div>
                      </div>
                    </div>

                    {/* Arrow 2 */}
                    {currentScenario.datahub_context.lineage.downstream[0] && (
                      <div className="flex flex-col items-center text-indigo-500 shrink-0">
                        <ChevronRight className="h-5 w-5 hidden md:block" />
                        <span className="h-4 w-[2px] bg-zinc-800 md:hidden" />
                      </div>
                    )}

                    {/* Downstream node */}
                    {currentScenario.datahub_context.lineage.downstream[0] && (
                      <div className="flex flex-col items-center">
                        <div className="px-4 py-3 bg-zinc-900/50 border border-zinc-850 rounded-xl text-center w-52 space-y-1 shadow-md">
                          <div className="text-[9px] font-mono text-zinc-500 font-bold uppercase">
                            DOWNSTREAM TARGET
                          </div>
                          <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5 truncate">
                            {getPlatformIcon(currentScenario.datahub_context.lineage.downstream[0].platform || "snowflake")}
                            {currentScenario.datahub_context.lineage.downstream[0].name}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* DATAHUB CATALOG TAB */}
              {activeTab === "catalog" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-zinc-900 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                        DataHub Metadata Snapshots
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Inspected column properties, type bindings, and PII tags inside catalog definitions.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">OWNERS:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentScenario.datahub_context.owners.length > 0 ? (
                          currentScenario.datahub_context.owners.map((owner, oIdx) => (
                            <span key={oIdx} className="text-[10px] font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-300">
                              {owner.name} ({owner.role})
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold animate-pulse">
                            NO ACTIVE OWNERS REGISTERED (ORPHAN)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fields Table */}
                  <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-900/40 border-b border-zinc-900 font-mono text-[10px] text-zinc-500 uppercase font-black">
                          <th className="p-3">Field Column Path</th>
                          <th className="p-3">Data Type</th>
                          <th className="p-3">Nullable</th>
                          <th className="p-3">Metadata Description</th>
                          <th className="p-3 text-right">Privacy Tags</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-xs font-sans text-zinc-400">
                        {currentScenario.datahub_context.fields.map((field, fIdx) => (
                          <tr key={fIdx} className="hover:bg-zinc-900/20 transition-colors">
                            <td className="p-3 font-mono font-bold text-zinc-200">{field.field_path}</td>
                            <td className="p-3 font-mono text-indigo-400 text-[11px]">{field.type}</td>
                            <td className="p-3 font-mono text-zinc-500">{field.nullable ? "TRUE" : "FALSE"}</td>
                            <td className="p-3 text-zinc-400">{field.description}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                {field.tags?.map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                      tag === "VULNERABILITY" || tag === "SECRET"
                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                        : "bg-zinc-900 text-zinc-500 border-zinc-800"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REMEDIATIONS TAB */}
              {activeTab === "remediations" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                      Forge Automated Remediation Patches
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Forge synthesized safe, deterministic remediation scripts to align databases, rotate credentials, or update K8s deployment manifests.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentScenario.remediations.map((rem, rIdx) => (
                      <div key={rIdx} className="border border-zinc-900 rounded-xl bg-zinc-950 p-5 space-y-4 shadow-sm">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded">
                              {rem.action_type}
                            </span>
                            <h4 className="text-sm font-bold text-white font-display mt-1">
                              {rem.title}
                            </h4>
                          </div>
                          <button
                            onClick={() => copyRemediationCode(rem.code, rIdx)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            {copiedRemediationIdx === rIdx ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" /> COPIED!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" /> COPY CODE
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                          {rem.description}
                        </p>
                        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg overflow-x-auto">
                          <pre className="font-mono text-[11px] text-zinc-300 whitespace-pre leading-relaxed select-all">
                            <code>{rem.code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EVIDENCE TAB */}
              {activeTab === "evidence" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                      Supporting Evidence & Verification Logs
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Physical audit records, terminal traces, and container signals verifying the incident scope.
                    </p>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-zinc-400 bg-zinc-950 p-5 rounded-xl border border-zinc-900/60 leading-relaxed max-h-[350px] overflow-y-auto">
                    {currentScenario.supporting_evidence.map((evidence, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-2 hover:bg-zinc-900/20 rounded transition-colors">
                        <span className="text-indigo-500 font-bold select-none">[Evidence-{idx+1}]</span>
                        <span>{evidence}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
