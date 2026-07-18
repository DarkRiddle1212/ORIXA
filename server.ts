import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

interface SchemaField {
  field_path: string;
  type: string;
  description: string;
  nullable: boolean;
  tags?: string[];
}

interface SchemaMetadata {
  fields: SchemaField[];
  primary_keys: string[];
  foreign_keys: Array<{ field: string; references: string }>;
}

interface DataHubOwner {
  email: string;
  name: string;
  type: string;
  role: string;
}

interface DataHubDataset {
  urn: string;
  name: string;
  platform: string;
  description: string;
  domain: string;
  tags: string[];
  owners: DataHubOwner[];
  schema_metadata: SchemaMetadata;
  created_at: string;
  updated_at: string;
}

interface LineageNode {
  urn: string;
  name: string;
  type: string;
  platform: string;
}

interface DataHubLineage {
  urn: string;
  upstream_nodes: LineageNode[];
  downstream_nodes: LineageNode[];
}

interface GlossaryTerm {
  urn: string;
  name: string;
  description: string;
  category: string;
}

interface DataHubDomain {
  urn: string;
  name: string;
  description: string;
}

interface MemoryItem {
  id: string;
  incident: string;
  user_request: string;
  context_snapshot: Record<string, any>;
  selected_specialists: string[];
  execution_plan: Array<{
    step_number: number;
    specialist_name: string;
    task: string;
    status: string;
  }>;
  recommendations: {
    risk_level?: string;
    remediations?: string[];
    [key: string]: any;
  };
  human_approvals: Array<{
    approver: string;
    action: string;
    timestamp: string;
  }>;
  final_outcome: string;
  lessons_learned: string[];
  tags: string[];
  affected_assets: string[];
  timestamp: string;
}

// Initialize high-fidelity seed datasets
const datasetsDb: Record<string, DataHubDataset> = {
  "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
    name: "core.users",
    platform: "postgres",
    description: "Core enterprise master customer accounts database. Contains critical profile, identity credentials, and billing relations. Subject to strict GDPR & CCPA CC-5 audits.",
    domain: "Engineering",
    tags: ["PII", "CCPA", "GDPR", "Tier-1", "MasterData"],
    owners: [
      { email: "secops@acme-aerospace.com", name: "SecOps Security Team", type: "GROUP", role: "STEWARD" },
      { email: "dba-oncall@acme-aerospace.com", name: "DBA Site Operations", type: "USER", role: "DATA_OWNER" }
    ],
    schema_metadata: {
      fields: [
        { field_path: "id", type: "UUID", description: "Primary unique surrogate key.", nullable: false, tags: ["surrogate_key"] },
        { field_path: "email", type: "VARCHAR", description: "User contact and identification address. CCPA/PII sensitive.", nullable: true, tags: ["PII", "CCPA"] },
        { field_path: "password_hash", type: "VARCHAR", description: "Argon2id credential hash. High security protection required.", nullable: false, tags: ["SECRET"] },
        { field_path: "credit_card_encrypted", type: "VARCHAR", description: "Encrypted card validation token mapped by third-party processors.", nullable: true, tags: ["PCI-DSS", "CCPA"] },
        { field_path: "created_at", type: "TIMESTAMP", description: "Row audit entry creation datetime.", nullable: false },
        { field_path: "updated_at", type: "TIMESTAMP", description: "Row audit entry last update datetime.", nullable: false }
      ],
      primary_keys: ["id"],
      foreign_keys: []
    },
    created_at: "2025-01-15T08:00:00Z",
    updated_at: "2026-07-10T14:22:11Z"
  },
  "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)",
    name: "analytics.user_demographics",
    platform: "snowflake",
    description: "Aggregated customer demographic analytics compiled weekly. Downstream schema drifted following recent pipeline run, breaking executive metrics.",
    domain: "Analytics",
    tags: ["DRIFTED", "dbt", "Weekly-Report", "Analytics-Internal"],
    owners: [
      { email: "analytics-lead@acme-aerospace.com", name: "Lead Data Architect", type: "USER", role: "DEVELOPER" }
    ],
    schema_metadata: {
      fields: [
        { field_path: "user_id", type: "VARCHAR", description: "Foreign customer ID link.", nullable: false },
        { field_path: "region_code", type: "VARCHAR", description: "Standard ISO geographical location code.", nullable: true },
        { field_path: "last_active_date", type: "DATE", description: "Calculated timestamp of last user interaction.", nullable: true },
        { field_path: "risk_score", type: "FLOAT", description: "Security risk ranking dynamically forecast by predictive models.", nullable: true, tags: ["SECURITY", "PREDICTIVE"] }
      ],
      primary_keys: ["user_id"],
      foreign_keys: [{ field: "user_id", references: "core.users.id" }]
    },
    created_at: "2025-06-20T12:00:00Z",
    updated_at: "2026-07-12T01:30:00Z"
  },
  "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)",
    name: "analytics.finance_reporting",
    platform: "snowflake",
    description: "Financial aggregate reports for SOX and general ledger audits. Downstream from main transactional core, storing sensitive accounting keys.",
    domain: "Finance",
    tags: ["FINANCIAL", "CCPA", "SOX", "Tier-1"],
    owners: [
      { email: "finance-steward@acme-aerospace.com", name: "Finance Controller Team", type: "GROUP", role: "STEWARD" }
    ],
    schema_metadata: {
      fields: [
        { field_path: "invoice_id", type: "VARCHAR", description: "Invoice surrogate key.", nullable: false },
        { field_path: "user_id", type: "VARCHAR", description: "Customer foreign key.", nullable: false },
        { field_path: "amount_usd", type: "DECIMAL(12,2)", description: "Gross transacted invoice value in USD.", nullable: false },
        { field_path: "tax_id_unencrypted", type: "VARCHAR", description: "CRITICAL SECURITY FINDING: Raw, unencrypted federal Tax/SSN identifier. High compliance infraction risk.", nullable: true, tags: ["PII", "CCPA", "VULNERABILITY"] },
        { field_path: "timestamp", type: "TIMESTAMP", description: "Transaction datetime.", nullable: false }
      ],
      primary_keys: ["invoice_id"],
      foreign_keys: [{ field: "user_id", references: "core.users.id" }]
    },
    created_at: "2025-03-10T09:00:00Z",
    updated_at: "2026-07-13T03:10:00Z"
  },
  "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)",
    name: "sandbox.project_alpha",
    platform: "postgres",
    description: "Developer sandbox environment database. Open ports and unvetted schemas expose structural vulnerability to unauthorized connections.",
    domain: "Engineering",
    tags: ["VULNERABLE", "Sandbox", "Threat-Scanner-Active"],
    owners: [
      { email: "secops@acme-aerospace.com", name: "SecOps Security Team", type: "GROUP", role: "STEWARD" }
    ],
    schema_metadata: {
      fields: [
        { field_path: "session_id", type: "UUID", description: "Standard developer session sequence.", nullable: false },
        { field_path: "sandbox_token", type: "VARCHAR", description: "Vulnerable plaintext credential file.", nullable: true, tags: ["VULNERABLE", "SECRET"] },
        { field_path: "payload", type: "JSON", description: "Raw payload response structures.", nullable: true }
      ],
      primary_keys: ["session_id"],
      foreign_keys: []
    },
    created_at: "2026-02-14T10:00:00Z",
    updated_at: "2026-07-13T08:55:00Z"
  }
};

// Lineage mappings matching seed datasets
const lineageDb: Record<string, DataHubLineage> = {
  "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
    upstream_nodes: [],
    downstream_nodes: [
      { urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)", name: "analytics.user_demographics", type: "DATASET", platform: "snowflake" },
      { urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)", name: "analytics.finance_reporting", type: "DATASET", platform: "snowflake" }
    ]
  },
  "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)",
    upstream_nodes: [
      { urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)", name: "core.users", type: "DATASET", platform: "postgres" }
    ],
    downstream_nodes: [
      { urn: "urn:li:dashboard:acme_aerospace.analytics.executive_dashboard", name: "Executive Metrics Dashboard", type: "DASHBOARD", platform: "tableau" }
    ]
  },
  "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)",
    upstream_nodes: [
      { urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)", name: "core.users", type: "DATASET", platform: "postgres" }
    ],
    downstream_nodes: []
  },
  "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)": {
    urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)",
    upstream_nodes: [],
    downstream_nodes: []
  }
};

const glossaryTerms: GlossaryTerm[] = [
  { urn: "urn:li:glossaryTerm:CreditCardNumber", name: "CreditCardNumber", description: "Encrypted visual card transaction hashes and tokens subject to PCI-DSS Level 1 compliance requirements.", category: "FINANCIAL" },
  { urn: "urn:li:glossaryTerm:TaxIdentifier", name: "TaxIdentifier", description: "Unencrypted Federal SSN, EIN, or government identity tokens. High safety isolation mandated.", category: "PII" },
  { urn: "urn:li:glossaryTerm:UserEmail", name: "UserEmail", description: "General user contact identity attribute. Under GDPR CC-3 boundary.", category: "PII" },
  { urn: "urn:li:glossaryTerm:SchemaConsistency", name: "SchemaConsistency", description: "Structural format mapping validation across enterprise distributed architectures.", category: "COMPLIANCE" }
];

const domainsList: DataHubDomain[] = [
  { urn: "urn:li:domain:Engineering", name: "Engineering", description: "Transactional databases, infrastructure metrics, and core microservice stores." },
  { urn: "urn:li:domain:Analytics", name: "Analytics", description: "Aggregated schemas, dbt compilation nodes, and dashboard visualization targets." },
  { urn: "urn:li:domain:Finance", name: "Finance", description: "Subscribers ledger, corporate balance reporting, and accounting pipelines." }
];

// Seed incidents database
let memoriesDb: MemoryItem[] = [
  {
    id: "mem-8fa4e28-1b03-49aa",
    incident: "Downstream Pipeline Interruption due to Schema Drift",
    user_request: "A schema change caused downstream failures in the analytics pipeline.",
    context_snapshot: {
      cluster: "acme-prod-east-01",
      triggered_by: "secops-alert-99",
      datahub_sync: true
    },
    selected_specialists: ["SchemaSpecialist", "PipelineSpecialist", "DataHubSpecialist"],
    execution_plan: [
      { step_number: 1, specialist_name: "SchemaSpecialist", task: "Compare current schema against reference master in DataHub", status: "COMPLETED" },
      { step_number: 2, specialist_name: "PipelineSpecialist", task: "Pinpoint breaking column drop in core_orders dataset", status: "COMPLETED" },
      { step_number: 3, specialist_name: "DataHubSpecialist", task: "Propagate modified field status to Tableau visualization nodes", status: "COMPLETED" }
    ],
    recommendations: {
      risk_level: "HIGH",
      remediations: [
        "Roll back latest migration on postgres core_orders schema.",
        "Configure strict column validation filters in airbyte loading pipelines."
      ]
    },
    human_approvals: [
      { approver: "secops-manager@acme.com", action: "APPROVED", timestamp: "2026-07-10T14:22:00Z" }
    ],
    final_outcome: "Schema drift resolved. Orders pipeline restarted. 1,240 delayed processing rows backfilled into staging tables successfully.",
    lessons_learned: [
      "Database migrations altering primary key components must run through DataHub pre-flight validations.",
      "Enforce alert margins when downstream processing delays exceed 5 minutes."
    ],
    tags: ["DRIFTED", "POSTGRES", "CRITICAL"],
    affected_assets: ["urn:li:dataset:(prod,postgres,acme.public.core_orders)"],
    timestamp: "2026-07-10T14:35:00Z"
  },
  {
    id: "mem-3bb4fa1-6677-49f0",
    incident: "Plaintext Secret & Sensitive PII Leak Detected",
    user_request: "Verify compliance issues or security leaks in user_profiles dataset.",
    context_snapshot: {
      cluster: "acme-staging-west",
      triggered_by: "compliance-scanner-04",
      datahub_sync: true
    },
    selected_specialists: ["SecuritySpecialist", "ComplianceSpecialist"],
    execution_plan: [
      { step_number: 1, specialist_name: "SecuritySpecialist", task: "Scan user_profiles column schemas for plain email or passwords", status: "COMPLETED" },
      { step_number: 2, specialist_name: "ComplianceSpecialist", task: "Audit compliance status under GDPR Article 30 requirements", status: "COMPLETED" }
    ],
    recommendations: {
      risk_level: "CRITICAL",
      remediations: [
        "Immediately redact and encrypt the 'plaintext_password' column in staging.",
        "Apply hashing algorithms using SEC_SALT_MD5 before logging to file targets."
      ]
    },
    human_approvals: [
      { approver: "compliance-officer@acme.com", action: "REDATED", timestamp: "2026-07-11T09:12:00Z" }
    ],
    final_outcome: "Leaked staging columns purged. Enforced standard SHA-256 password salting routines. Compliance status set back to certified.",
    lessons_learned: [
      "Never dump staging operational database records without checking tag validations.",
      "Assign strict ownership rules on public schemas."
    ],
    tags: ["PII", "GDPR", "SECRET", "VULNERABLE"],
    affected_assets: ["urn:li:dataset:(prod,snowflake,acme.analytics.user_profiles)"],
    timestamp: "2026-07-11T09:30:00Z"
  },
  {
    id: "mem-7bb1da5-2244-11f2",
    incident: "Analytical Warehouse Connection Timeout",
    user_request: "Snowflake reports connection timed out during aggregate refresh.",
    context_snapshot: {
      cluster: "snowflake-analytics-warehouse",
      triggered_by: "prometheus-sn-01",
      datahub_sync: true
    },
    selected_specialists: ["InfrastructureSpecialist", "DataHubSpecialist"],
    execution_plan: [
      { step_number: 1, specialist_name: "InfrastructureSpecialist", task: "Inspect routing tables and security group ingress limits", status: "COMPLETED" },
      { step_number: 2, specialist_name: "DataHubSpecialist", task: "Check DataHub connection state for active metadata heartbeats", status: "COMPLETED" }
    ],
    recommendations: {
      risk_level: "MEDIUM",
      remediations: [
        "Increase warehouse timeout limits from 60s to 180s.",
        "Verify Snowflake IP address ranges are whitelisted on our enterprise NAT gateway."
      ]
    },
    human_approvals: [
      { approver: "sre-lead@acme.com", action: "WHITELISTED", timestamp: "2026-07-12T16:45:00Z" }
    ],
    final_outcome: "Whitelisted outbound egress IP blocks and scale timeout parameters. Normal connection queries succeeded thereafter.",
    lessons_learned: [
      "Cloud analytical instances undergo transient scale events which need retry backoffs.",
      "Configure persistent Snowflake endpoints with standard keepalive loops."
    ],
    tags: ["SNOWFLAKE", "TIMEOUT", "STABLE"],
    affected_assets: ["urn:li:dataset:(prod,snowflake,acme.analytics.aggregates)"],
    timestamp: "2026-07-12T17:00:00Z"
  }
];

// Seed active specialists details
const specialistsFleet = [
  {
    id: "atlas-schema-spec",
    name: "atlas",
    display_name: "Atlas",
    description: "DataHub integration, database catalog auditing, and automated schema alignment mapping.",
    category: "Metadata & Catalog",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Metadata indexing", "Catalog delta scans", "Schema mapping"],
    supported_tasks: ["audit_schema", "sync_datahub_metadata", "map_schema_drift"],
    responsibilities: [
      "Scan physical databases for structural schema deviations.",
      "Synchronize metadata indices with the DataHub operational catalog.",
      "Track model-to-table lineage maps across multi-tenant sandboxes."
    ],
    thumbs_up: 18,
    thumbs_down: 1
  },
  {
    id: "sentinel-threat-spec",
    name: "sentinel",
    display_name: "Sentinel",
    description: "Continuous real-time threat detection, connection latency telemetry, and containment drill orchestration.",
    category: "Security & Containment",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Log threat classification", "Latency tracking", "Automated workspace isolation"],
    supported_tasks: ["trigger_lockdown_drill", "scan_operational_logs", "isolate_tenant_workspace"],
    responsibilities: [
      "Monitor multi-tenant staging boundaries for database pool saturation.",
      "Identify abnormal access footprints and unauthorized schema query commands.",
      "Initiate and isolate workspace boundaries during lockdown procedures."
    ],
    thumbs_up: 24,
    thumbs_down: 2
  },
  {
    id: "guardian-privacy-spec",
    name: "guardian",
    display_name: "Guardian",
    description: "Regulatory compliance auditing, sensitive raw attribute classification (PII), and policy alignment.",
    category: "Compliance & Auditing",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["PII scanning", "GDPR/CCPA policy mapping", "Audit trail validation"],
    supported_tasks: ["scan_sensitive_columns", "verify_regulatory_alignment", "certify_audit_integrity"],
    responsibilities: [
      "Audit database column catalogs for cleartext PII identifiers.",
      "Verify schema structures against GDPR, CCPA, and HIPAA compliance policies.",
      "Generate compliance score cards and log deviation warnings."
    ],
    thumbs_up: 15,
    thumbs_down: 0
  },
  {
    id: "architect-topology-spec",
    name: "architect",
    display_name: "Architect",
    description: "System topology mapping, analytical pipeline routing, and sandbox boundary modeling.",
    category: "Topology & Infrastructure",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Pipeline graph resolution", "Redis key topology scans", "Port mapping validation"],
    supported_tasks: ["trace_pipeline_dependencies", "validate_decoupling", "audit_ingress_routing"],
    responsibilities: [
      "Map real-time data flow pipelines between upstream systems and analytics databases.",
      "Inspect network boundaries and security limits between cloud clusters.",
      "Trace API endpoints and Redis caches to build cohesive environment topology diagrams."
    ],
    thumbs_up: 19,
    thumbs_down: 1
  },
  {
    id: "forge-migration-spec",
    name: "forge",
    display_name: "Forge",
    description: "Automated database migration script writing, schema mutation deployments, and safe transactional rollbacks.",
    category: "Migration & Automation",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["DDL script generation", "Safe database migrations", "State change rollbacks"],
    supported_tasks: ["draft_alignment_sql", "dryrun_migration", "rollback_last_migration"],
    responsibilities: [
      "Generate robust SQL DDL scripts to execute schema alignments.",
      "Validate proposed mutations via dry-run simulation against transient sandboxes.",
      "Formulate robust ROLLBACK plans to guarantee transaction safety."
    ],
    thumbs_up: 21,
    thumbs_down: 3
  },
  {
    id: "oracle-prediction-spec",
    name: "oracle",
    display_name: "Oracle",
    description: "Time-series operational risk modeling, pool starvation prediction, and compatibility forecasting.",
    category: "Predictive Analytics",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Risk scoring forecasting", "Starvation prediction regression", "Time-series regression models"],
    supported_tasks: ["estimate_schema_drift_risk", "forecast_pool_starvation", "calculate_auc_accuracy"],
    responsibilities: [
      "Build predictive time-series models estimating connection pool starvation risks.",
      "Estimate compound drift risk indexes following undocumented migrations.",
      "Simulate operational failure timelines and alert latency parameters."
    ],
    thumbs_up: 14,
    thumbs_down: 2
  },
  {
    id: "archivist-knowledge-spec",
    name: "archivist",
    display_name: "Archivist",
    description: "Organizational memory management, semantic policy ingestion, and grounding attribution tracing.",
    category: "Semantic Memory",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Grounded semantic querying", "Runbook policy mapping", "Grounding trace analysis"],
    supported_tasks: ["search_knowledge_base", "ground_agent_decision", "audit_memory_consistency"],
    responsibilities: [
      "Index corporate data governance policies, runbooks, and recovery playbooks.",
      "Compare agent execution steps with codified historical memories to enforce best practice policies.",
      "Log ground truth benchmarks and evaluate system confidence intervals."
    ],
    thumbs_up: 11,
    thumbs_down: 1
  },
  {
    id: "ambassador-comm-spec",
    name: "ambassador",
    display_name: "Ambassador",
    description: "External API integration routing, notification hooks, and secure multi-tenant identity mappings.",
    category: "Integrations & Routing",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Multi-channel webhook routing", "Slack workflow synchronization", "Access matrix mapping"],
    supported_tasks: ["send_slack_alert", "sync_tenant_identities", "broadcast_containment_status"],
    responsibilities: [
      "Broadcast security containment alerts and system locks to Slack and Teams webhooks.",
      "Synchronize SSO identity groups with multi-tenant organizational access matrices.",
      "Coordinate external API calls to downstream alerts and support tickets."
    ],
    thumbs_up: 7,
    thumbs_down: 0
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ============================================================================
  // API Routes
  // ============================================================================

  // 1. Specialists Fleet Overview
  app.get("/api/v1/specialists", (req, res) => {
    res.json(specialistsFleet);
  });

  // 1b. Rate a specialist contribution
  app.post("/api/v1/specialists/:name/rate", (req, res) => {
    const specName = req.params.name.toLowerCase();
    const { rating } = req.body;

    const spec = specialistsFleet.find(s => s.name === specName);
    if (!spec) {
      return res.status(404).json({ detail: `Specialist '${req.params.name}' does not exist.` });
    }

    if (rating === "up") {
      spec.thumbs_up = (spec.thumbs_up || 0) + 1;
    } else if (rating === "down") {
      spec.thumbs_down = (spec.thumbs_down || 0) + 1;
    } else {
      return res.status(400).json({ detail: "Invalid rating value. Must be 'up' or 'down'." });
    }

    // Broadcast state to keep everyone synced in real-time
    broadcastState();

    res.json({
      status: "success",
      specialist: spec.display_name,
      thumbs_up: spec.thumbs_up,
      thumbs_down: spec.thumbs_down
    });
  });

  // 2. Context Layer: Asset Search
  app.get("/api/v1/context/search", (req, res) => {
    const q = (req.query.q || "").toString().toLowerCase();
    
    const datasets = Object.values(datasetsDb).filter(dataset => {
      return (
        dataset.name.toLowerCase().includes(q) ||
        (dataset.description || "").toLowerCase().includes(q) ||
        dataset.tags.some(t => t.toLowerCase().includes(q))
      );
    });

    const glossary = glossaryTerms.filter(term => {
      return (
        term.name.toLowerCase().includes(q) ||
        term.description.toLowerCase().includes(q)
      );
    });

    res.json({
      query: req.query.q || "",
      datasets,
      glossary_terms: glossary,
      total_matched: datasets.length + glossary.length
    });
  });

  // 3. Context Layer: Specific Dataset Detail
  app.get("/api/v1/context/dataset/:urn", (req, res) => {
    const { urn } = req.params;
    const dataset = datasetsDb[urn];
    if (dataset) {
      res.json(dataset);
    } else {
      res.status(404).json({ detail: `Dataset URN '${urn}' was not found.` });
    }
  });

  // 4. Context Layer: Lineage Mapping
  app.get("/api/v1/context/lineage/:urn", (req, res) => {
    const { urn } = req.params;
    const lineage = lineageDb[urn];
    if (lineage) {
      res.json(lineage);
    } else {
      res.json({ urn, upstream_nodes: [], downstream_nodes: [] });
    }
  });

  // 5. Context Layer: Dataset Owners
  app.get("/api/v1/context/owners/:urn", (req, res) => {
    const { urn } = req.params;
    const dataset = datasetsDb[urn];
    if (dataset) {
      res.json({ urn, owners: dataset.owners });
    } else {
      res.json({ urn, owners: [] });
    }
  });

  // 6. Context Layer: Active Domains
  app.get("/api/v1/context/domains", (req, res) => {
    res.json({ domains: domainsList });
  });

  // 7. Specialist Direct Task Execution
  app.post("/api/v1/specialists/:name/execute", (req, res) => {
    const specName = req.params.name.toLowerCase();
    const { task, payload } = req.body;

    const spec = specialistsFleet.find(s => s.name === specName);
    if (!spec) {
      return res.status(404).json({ detail: `Specialist '${req.params.name}' does not exist in the active fleet.` });
    }

    if (!spec.supported_tasks.includes(task)) {
      return res.status(400).json({ detail: `Task '${task}' is not supported by specialist '${spec.display_name}'.` });
    }

    // High fidelity results matching Python base specialist outputs
    let result = "Standard execution finished.";
    let logs: string[] = [];
    let explanation = "";

    if (specName === "atlas") {
      if (task === "audit_schema") {
        result = "SUCCESS: Identified 1 critical structural drift.";
        explanation = "Audited the users_sandbox catalog. Identified an unregistered cleartext column 'phone_raw' that deviates from registered definitions.";
        logs = [
          "Connecting to database core postgres pool...",
          "Loaded 18 registered catalog definition entries.",
          "Scanning staging column names for tables matching pattern 'users'...",
          "MATCH: Found table 'users_sandbox' with columns: [id, email, password_hash, phone_raw].",
          "DRIFT DETECTED: Column 'phone_raw' has no registered metadata catalog entry."
        ];
      } else if (task === "sync_datahub_metadata") {
        result = "SUCCESS: Synchronized 14,801 nodes.";
        explanation = "Synchronized all model nodes and connection graphs with the DataHub Enterprise catalog successfully.";
        logs = ["Contacting DataHub REST gateway...", "Posted metadata dataset entities schema details.", "Re-indexed downstream catalog search indexes."];
      } else {
        result = "SUCCESS: Schema drift percentage computed.";
        explanation = "Calculated drift metrics for active workspaces. Estimated schema variation risk at 8.5% across active staging databases.";
        logs = ["Evaluating 4 Staging workspaces...", "Synthesizing catalog variation indices..."];
      }
    } else if (specName === "sentinel") {
      if (task === "trigger_lockdown_drill") {
        result = "SUCCESS: Active containment drill 'drill_998_active' initiated.";
        explanation = "Triggered an emergency containment drill. Suspended connection write-access for sandbox Project Alpha.";
        logs = ["Enforcing SRE policy drill boundaries...", "Blocked network endpoints for cluster acme-prod-east-01."];
      } else if (task === "scan_operational_logs") {
        result = "SUCCESS: Operational log inspection finished safely.";
        explanation = "Analyzed operational logs and container metrics. No anomalous cross-tenant queries detected.";
        logs = ["Scrubbing 4,210 operational logs lines...", "Checking connection pool logs..."];
      } else {
        result = "SUCCESS: Sandbox container isolated.";
        explanation = "Enforced container-level network isolation on workspace Staging Sandbox Delta.";
        logs = ["Flagging sandbox boundary Project Alpha...", "Executing container route isolate scripts..."];
      }
    } else if (specName === "guardian") {
      if (task === "scan_sensitive_columns") {
        result = "SUCCESS: Isolated 1 raw cleartext PII attribute.";
        explanation = "Flagged unencrypted raw column attribute 'phone_raw' classified as 'PII_PHONE_NUMBER' inside users_sandbox.";
        logs = ["Accessing dataset metadata dictionary...", "Evaluating entropy bounds for 'phone_raw'...", "WARNING: 'phone_raw' contains plain numbers."];
      } else {
        result = "SUCCESS: Compliance score 92.1% certified.";
        explanation = "Validated staging tables against CCPA and GDPR constraints. Score impacted by unmasked column attributes.";
        logs = ["Checking Article 30 registry data files...", "Compiling regulatory compliance score card..."];
      }
    } else {
      result = "SUCCESS: Task processed successfully.";
      explanation = `Assigned task '${task}' completed safely by specialized agent '${spec.display_name}'.`;
      logs = [`Initiating analytical execution on agent '${spec.display_name}'`, `Synchronized parameters matching trigger metadata.`, "Completed step."];
    }

    res.json({
      status: "SUCCESS",
      result,
      explanation,
      logs
    });
  });

  // 8. Atlas Supervisor: Core Ingestion Simulation Pipeline
  app.post("/api/v1/atlas/simulate", async (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ detail: "Query cannot be empty or solely whitespace." });
    }

    const qLower = query.toLowerCase();

    // Context analysis
    let intent = "GENERAL_INVESTIGATION";
    let selected_specialists: string[] = ["archivist", "sentinel", "oracle"];
    let confidence = 0.70;

    let targetName = "production_users";
    let targetUrn = "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)";
    let targetPlatform = "postgres";
    let targetDomain = "Engineering";

    // Reconcile matching datasets
    const matchedDatasets = Object.values(datasetsDb).filter(dataset => {
      return (
        qLower.includes(dataset.name.toLowerCase()) ||
        dataset.tags.some(t => qLower.includes(t.toLowerCase()))
      );
    });

    if (matchedDatasets.length > 0) {
      const ds = matchedDatasets[0];
      targetName = ds.name;
      targetUrn = ds.urn;
      targetPlatform = ds.platform;
      targetDomain = ds.domain;
    }

    // Heuristics for intent selection
    if (/schema|drift|table|deviat|catalog|datahub|reconcile|column/.test(qLower)) {
      intent = "SCHEMA_ALIGNMENT";
      selected_specialists = ["atlas", "forge", "oracle"];
      confidence = 0.95;
    } else if (/threat|attack|lockdown|breach|scan|isolate|intrusion|drill|security/.test(qLower)) {
      intent = "THREAT_CONTAINMENT";
      selected_specialists = ["sentinel", "archivist", "ambassador"];
      confidence = 0.95;
    } else if (/compliance|privacy|gdpr|ccpa|pii|audit|certify|sensit/.test(qLower)) {
      intent = "COMPLIANCE_AUDIT";
      selected_specialists = ["guardian", "archivist", "ambassador"];
      confidence = 0.95;
    } else if (/network|route|topology|pipeline|service|depend/.test(qLower)) {
      intent = "TOPOLOGY_ROUTING";
      selected_specialists = ["architect", "oracle"];
      confidence = 0.95;
    }

    // Structure standard plan steps
    let plan_steps: any[] = [];
    if (intent === "SCHEMA_ALIGNMENT") {
      plan_steps = [
        {
          step_number: 1,
          specialist_name: "atlas",
          task: "audit_schema",
          description: `Audit physical table catalog schemas against DataHub's master registry to detect drift on asset '${targetName}' [${targetUrn}].`,
          payload: { target: targetName, urn: targetUrn, platform: targetPlatform }
        },
        {
          step_number: 2,
          specialist_name: "oracle",
          task: "estimate_schema_drift_risk",
          description: `Calculate risk scores and timelines for potential downstream schema failures for ${targetName}.`,
          payload: { target: targetName, urn: targetUrn, domain: targetDomain }
        },
        {
          step_number: 3,
          specialist_name: "forge",
          task: "draft_alignment_sql",
          description: `Synthesize precise DDL migration instructions to correct column deviations in '${targetName}'.`,
          payload: { target: targetName, urn: targetUrn, platform: targetPlatform }
        }
      ];
    } else if (intent === "THREAT_CONTAINMENT") {
      plan_steps = [
        {
          step_number: 1,
          specialist_name: "sentinel",
          task: "scan_operational_logs",
          description: `Inspect API request parameters and gateway connection headers for intrusion footprints on target asset '${targetName}'.`,
          payload: { duration_hours: 2, target: targetName, urn: targetUrn }
        },
        {
          step_number: 2,
          specialist_name: "archivist",
          task: "ground_agent_decision",
          description: "Cross-reference recent event patterns against official corporate security runbook chapters.",
          payload: { topic: "unauthorized_logins", domain: targetDomain }
        },
        {
          step_number: 3,
          specialist_name: "sentinel",
          task: "isolate_tenant_workspace",
          description: `Enforce strict firewall rules and connection limits on sandbox workspace containing '${targetName}'.`,
          payload: { sandbox: "Staging Sandbox Delta", isolate_urn: targetUrn }
        },
        {
          step_number: 4,
          specialist_name: "ambassador",
          task: "send_slack_alert",
          description: `Broadcast emergency containment status and remediation steps for '${targetName}' to Slack alert webhooks.`,
          payload: { channel: "security-war-room" }
        }
      ];
    } else if (intent === "COMPLIANCE_AUDIT") {
      plan_steps = [
        {
          step_number: 1,
          specialist_name: "guardian",
          task: "scan_sensitive_columns",
          description: `Conduct a deep scan on table metadata dictionaries of '${targetName}' [${targetUrn}] to isolate unencrypted plain PII attributes.`,
          payload: { scan_depth: "full", urn: targetUrn, target: targetName }
        },
        {
          step_number: 2,
          specialist_name: "archivist",
          task: "search_knowledge_base",
          description: `Lookup active regulatory boundaries and internal corporate data masking runbooks for domain '${targetDomain}'.`,
          payload: { filter: "PII Encryption", domain: targetDomain }
        },
        {
          step_number: 3,
          specialist_name: "guardian",
          task: "verify_regulatory_alignment",
          description: `Validate active structures on '${targetName}' against GDPR/CCPA alignment policies to certify conformity.`,
          payload: { strict: true, urn: targetUrn }
        }
      ];
    } else if (intent === "TOPOLOGY_ROUTING") {
      plan_steps = [
        {
          step_number: 1,
          specialist_name: "architect",
          task: "trace_pipeline_dependencies",
          description: `Map microservice-to-database connections and cached Redis indices for catalog asset '${targetName}'.`,
          payload: { map_type: "deep_dependency", urn: targetUrn, target: targetName }
        },
        {
          step_number: 2,
          specialist_name: "oracle",
          task: "forecast_pool_starvation",
          description: `Perform predictive time-series regression to estimate connection pool exhaustion thresholds for '${targetName}'.`,
          payload: { forecast_window_mins: 1440, urn: targetUrn }
        }
      ];
    } else {
      plan_steps = [
        {
          step_number: 1,
          specialist_name: "archivist",
          task: "search_knowledge_base",
          description: `Scan existing organizational runbooks and historical case studies for diagnostic hints targeting asset '${targetName}'.`,
          payload: { query, urn: targetUrn }
        },
        {
          step_number: 2,
          specialist_name: "sentinel",
          task: "scan_operational_logs",
          description: `Verify system stability and connection latency logs on dataset platform: ${targetPlatform.toUpperCase()}.`,
          payload: { sample_size: 100, platform: targetPlatform, urn: targetUrn }
        },
        {
          step_number: 3,
          specialist_name: "oracle",
          task: "calculate_auc_accuracy",
          description: `Calculate risk vectors and anomaly prediction reliability bounds for domain: ${targetDomain}.`,
          payload: { model: "general_arima", domain: targetDomain }
        }
      ];
    }

    // Pre-populate specialist outputs with detailed logs and explanations
    const specialist_outputs: Record<string, any> = {};
    if (intent === "SCHEMA_ALIGNMENT") {
      specialist_outputs["atlas"] = {
        task: "audit_schema",
        status: "SUCCESS",
        explanation: `Audited the ${targetName} table schema. Detected unencrypted 'phone_raw' column missing from registered catalog declarations.`,
        logs: [
          "Connecting to database core postgres pool...",
          "Comparing actual layout keys against DataHub model indices.",
          "UNREGISTRED COLUMN DETECTED: 'phone_raw' varchar(255)."
        ]
      };
      specialist_outputs["oracle"] = {
        task: "estimate_schema_drift_risk",
        status: "SUCCESS",
        explanation: "Time-series predictive forecast indicates high drift mutation rate (84.5% certainty).",
        logs: ["Polling schema mutation logs...", "Aggregating drift variables...", "Risk Index score computed: 0.845"]
      };
      specialist_outputs["forge"] = {
        task: "draft_alignment_sql",
        status: "SUCCESS",
        explanation: "Drafted SQL migration statement adding encrypted variables and dropping the vulnerable plaintext column.",
        logs: ["Compiling DDL template for Postgres platform...", "Inserting sha256 digest conversion variables...", "DDL statement generated."]
      };
    } else if (intent === "THREAT_CONTAINMENT") {
      specialist_outputs["sentinel"] = {
        task: "scan_operational_logs",
        status: "SUCCESS",
        explanation: "Anomalous SQL transaction write patterns detected on staging sandboxes. Threat mitigated.",
        logs: ["Scrubbing log lines...", "Anomaly pattern matched: SQL_INJECTION_SUSPICION"]
      };
      specialist_outputs["archivist"] = {
        task: "ground_agent_decision",
        status: "SUCCESS",
        explanation: "Cross-referenced activity logs with security runbook Chapter 9 on isolation limits.",
        logs: ["Querying internal compliance database...", "Found Runbook Chapter 9 matches."]
      };
      specialist_outputs["ambassador"] = {
        task: "send_slack_alert",
        status: "SUCCESS",
        explanation: "Broadcasted emergency status update and workspace lockdown reports to Slack channel #security-war-room.",
        logs: ["Posting JSON payload to Slack webhook...", "Server responded with status code 200 OK."]
      };
    } else if (intent === "COMPLIANCE_AUDIT") {
      specialist_outputs["guardian"] = {
        task: "scan_sensitive_columns",
        status: "SUCCESS",
        explanation: "Isolated raw plain PII attribute 'phone_raw' which lacks compliance hash views.",
        logs: ["Accessing dictionary files...", "Matched attribute tags with CCPA boundary profiles."]
      };
      specialist_outputs["archivist"] = {
        task: "search_knowledge_base",
        status: "SUCCESS",
        explanation: "Retrieved encryption policies and standard masking techniques for Engineering domains.",
        logs: ["Running vector similarity match against policies folder...", "Top match: POLICY_PII_ENCRYPTION_v2.md"]
      };
    } else {
      specialist_outputs["archivist"] = {
        task: "search_knowledge_base",
        status: "SUCCESS",
        explanation: "Checked corporate documentation catalog and history cards. Found no matching records. Initiating baseline checks.",
        logs: ["Querying knowledge index...", "0 direct matches. Using default diagnostic fallback."]
      };
      specialist_outputs["sentinel"] = {
        task: "scan_operational_logs",
        status: "SUCCESS",
        explanation: "Operational checks clean. Core databases latency parameters are stable.",
        logs: ["Checking average query latency...", "Latency: 11.2ms [STABLE]"]
      };
      specialist_outputs["oracle"] = {
        task: "calculate_auc_accuracy",
        status: "SUCCESS",
        explanation: "Predictive stability is 98.4%. System is performing within healthy limits.",
        logs: ["Re-loading model weights...", "Accuracy coefficient calculated: 0.984"]
      };
    }

    // Find similar historical memories/incidents from in-memory database
    const similar_incidents = memoriesDb.filter(m => {
      return (
        m.tags.some(t => qLower.includes(t.toLowerCase())) ||
        m.user_request.toLowerCase().includes(intent.toLowerCase().replace("_", " ")) ||
        m.incident.toLowerCase().includes(intent.toLowerCase().replace("_", " "))
      );
    });

    // Create execution recommendation report
    let recommendation: any = null;
    let useGemini = false;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Compile a clean context synthesis prompt for Gemini
        const systemPrompt = `You are the core intelligence module for ORIXA, the Enterprise Intelligence Operating System.
We are analyzing a critical operational incident requested by a developer.
Your goal is to synthesize the following context into a clean, structured JSON report that is highly realistic, strategic, and professional.

User Query: "${query}"
Detected Intent: ${intent}
Affected Catalog Asset: ${targetName} (${targetUrn})
Matched Historical Incidents: ${JSON.stringify(similar_incidents)}
Specialists Fleet Findings: ${JSON.stringify(specialist_outputs)}

You MUST respond strictly in valid JSON format.
The JSON must contain the exact key structures:
{
  "overview": "A clear, cohesive 2-3 sentence executive narrative explaining what Orixa orchestrated, what was detected, and what actions were compiled.",
  "findings": [
    "3-4 high-impact, direct technical findings prefixed with specialist name, e.g. 'Schema Audit [Atlas]: ...'"
  ],
  "key_findings": [
    "Exactly duplicate the list of findings here for backward compatibility."
  ],
  "remediations": [
    {
      "action_type": "SQL_MIGRATION" | "SECURITY_PATCH" | "ACCESS_CONTROL" | "CONFIG_PATCH",
      "title": "Clear Action Title",
      "description": "Short strategic summary of the next steps to perform",
      "code": "DDL, SQL, or command scripts to resolve the issue"
    }
  ],
  "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence_score": 0.0 to 1.0,
  "root_cause_analysis": "Diagnostic summary of the failure origin.",
  "risk_assessment": "The compounding risk description if remediations are deferred.",
  "specialist_contributions": [
    {
      "specialist_name": "atlas" | "oracle" | "sentinel" | etc,
      "contribution": "A concise sentence detailing exactly how this specialist contributed metadata, predictions, or logs."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: systemPrompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response && response.text) {
          recommendation = JSON.parse(response.text.trim());
          useGemini = true;
        }
      } catch (geminiErr) {
        console.warn("Gemini API execution failed, gracefully falling back to offline rule-based synthesis.", geminiErr);
      }
    }

    if (!useGemini) {
      // Offline fallback synthesis mapping
      if (intent === "SCHEMA_ALIGNMENT") {
        recommendation = {
          overview: "Atlas coordinated a schema reconciliation scan. The pipeline detected critical model-to-table column deviations in the production_users catalog, verified downstream impact, and drafted an immediate DDL patch.",
          findings: [
            `Schema Audit [Atlas]: Discovered a cleartext 'phone_raw' column in '${targetName}' missing from DataHub's master registry definition file.`,
            `Drift Analytics [Oracle]: Calculated an 84.5% risk score of undocumented structural variations in Staging Sandboxes.`,
            "Remediation [Forge]: Synthesized safe DDL commands transitioning tables to encrypted parameters."
          ],
          key_findings: [
            `Schema Audit [Atlas]: Discovered a cleartext 'phone_raw' column in '${targetName}' missing from DataHub's master registry definition file.`,
            `Drift Analytics [Oracle]: Calculated an 84.5% risk score of undocumented structural variations in Staging Sandboxes.`,
            "Remediation [Forge]: Synthesized safe DDL commands transitioning tables to encrypted parameters."
          ],
          remediations: [
            {
              action_type: "SQL_MIGRATION",
              title: "Apply Cryptographic Column Migration",
              description: "Apply Forge's generated DDL schema patch to migrate the plain 'phone_raw' column to encrypted formats.",
              code: "BEGIN;\nALTER TABLE users_sandbox ADD COLUMN phone_encrypted VARCHAR(512);\nUPDATE users_sandbox SET phone_encrypted = encode(digest(phone_raw, 'sha256'), 'hex') WHERE phone_raw IS NOT NULL;\nALTER TABLE users_sandbox DROP COLUMN phone_raw;\nCOMMIT;"
            }
          ],
          risk_level: "HIGH",
          confidence_score: 0.95,
          root_cause_analysis: "Staging database undergone custom manual schema mutations without registering the change via DataHub integration webhooks.",
          risk_assessment: "Plaintext phone numbers exposed in query logs violate CCPA Article 5 compliance regulations. Compounding threat index high.",
          specialist_contributions: [
            { specialist_name: "atlas", contribution: "Audited tables layout and checked catalog delta specifications." },
            { specialist_name: "oracle", contribution: "Estimated drift risk coefficients and predicted pool failures." },
            { specialist_name: "forge", contribution: "Constructed precise DDL patch files matching target platform." }
          ]
        };
      } else if (intent === "THREAT_CONTAINMENT") {
        recommendation = {
          overview: "Atlas Supervisor triggered active threat isolation procedures. The fleet analyzed connection headers, validated privilege runbooks, isolated sandbox 'Project Alpha', and pushed Slack alerts.",
          findings: [
            `Threat Scan [Sentinel]: Flagged suspicious query footprints on dataset '${targetName}'.`,
            "Compliance Grounding [Archivist]: Cross-referenced access patterns with security chapters.",
            "Isolation [Sentinel]: Enforced container network fence blocking write permissions."
          ],
          key_findings: [
            `Threat Scan [Sentinel]: Flagged suspicious query footprints on dataset '${targetName}'.`,
            "Compliance Grounding [Archivist]: Cross-referenced access patterns with security chapters.",
            "Isolation [Sentinel]: Enforced container network fence blocking write permissions."
          ],
          remediations: [
            {
              action_type: "SECURITY_PATCH",
              title: "Isolate Sandbox & Rotate API Keys",
              description: "Review SRE connection parameters and immediately execute token rotation workflows on sandbox Staging Sandbox Delta.",
              code: `orixa auth rotate-keys --sandbox "Staging Sandbox Delta"`
            }
          ],
          risk_level: "CRITICAL",
          confidence_score: 0.95,
          root_cause_analysis: "Credential leakage via development sandbox repository configurations.",
          risk_assessment: "Delayed key rotation might enable privilege escalation into core production clusters.",
          specialist_contributions: [
            { specialist_name: "sentinel", contribution: "Analyzed request footprints and isolated vulnerable endpoints." },
            { specialist_name: "archivist", contribution: "Mapped operations vectors to certified Security Runbooks." }
          ]
        };
      } else if (intent === "COMPLIANCE_AUDIT") {
        recommendation = {
          overview: "Atlas supervised a regulatory compliance scan. The system evaluated existing database columns against GDPR, CCPA, and HIPAA compliance boundaries to identify plaintext PII.",
          findings: [
            `PII Discovery [Guardian]: Flagged unencrypted raw column attributes in '${targetName}' classified as 'PII_PHONE_NUMBER'.`,
            "Policy Lookup [Archivist]: Synced active GDPR and HIPAA rules for financial domains.",
            "Compliance Rating [Guardian]: Calculated a compliance rating score of 92.1% due to unmasked columns."
          ],
          key_findings: [
            `PII Discovery [Guardian]: Flagged unencrypted raw column attributes in '${targetName}' classified as 'PII_PHONE_NUMBER'.`,
            "Policy Lookup [Archivist]: Synced active GDPR and HIPAA rules for financial domains.",
            "Compliance Rating [Guardian]: Calculated a compliance rating score of 92.1% due to unmasked columns."
          ],
          remediations: [
            {
              action_type: "ACCESS_CONTROL",
              title: "Revoke Public Query Access",
              description: "Suspend public query rights on the users_sandbox dataset until safe data views are configured.",
              code: "REVOKE SELECT ON users_sandbox FROM PUBLIC;\nGRANT SELECT ON users_sandbox TO compliance_audit_role;"
            }
          ],
          risk_level: "MEDIUM",
          confidence_score: 0.95,
          root_cause_analysis: "Undocumented column migrations containing plain text contact variables.",
          risk_assessment: "Subject to GDPR regulatory penalty clauses if active schemas are exposed.",
          specialist_contributions: [
            { specialist_name: "guardian", contribution: "Identified unmasked PII variables and evaluated compliance rating score." },
            { specialist_name: "archivist", contribution: "Retrieved legal frameworks and data masking guidelines." }
          ]
        };
      } else {
        recommendation = {
          overview: "Atlas supervised a general system diagnostic scan. All core relational databases, caches, and AI Specialist health metrics are normal.",
          findings: [
            "Runbook Scan [Archivist]: Grounded current operations against system baseline profiles.",
            "Stability Check [Sentinel]: Verified average latency parameters remain well within limits."
          ],
          key_findings: [
            "Runbook Scan [Archivist]: Grounded current operations against system baseline profiles.",
            "Stability Check [Sentinel]: Verified average latency parameters remain well within limits."
          ],
          remediations: [
            {
              action_type: "HEALTH_CHECK",
              title: "Maintain Standard Baseline Monitoring",
              description: "Periodic system audits succeeded. Continue active baseline SRE monitoring.",
              code: "orixa status --fleet --detailed"
            }
          ],
          risk_level: "LOW",
          confidence_score: 0.80,
          root_cause_analysis: "None. System performing within acceptable SLA thresholds.",
          risk_assessment: "None. Baselines are fully optimized.",
          specialist_contributions: [
            { specialist_name: "archivist", contribution: "Grounded prompt scope against cached historical runbooks." },
            { specialist_name: "sentinel", contribution: "Verified average latency metrics of relational clusters." }
          ]
        };
      }
    }

    // Build the complete orchestration response structure
    const session_id = `sess-${Math.random().toString(36).substring(2, 11)}`;
    const orchestration_logs = [
      `Atlas: Initializing multi-agent orchestration boundary. Trace ID: ${session_id}`,
      `Atlas: Ingestion prompt: '${query}'`,
      `Atlas: Stage [ANALYZING] initiated. Running NLP intent routing...`,
      `Atlas: Interrogating DataHub Context Layer to retrieve live organizational catalog context...`,
      matchedDatasets.length > 0 
        ? `Atlas: DataHub Context Layer matched ${matchedDatasets.length} catalog asset(s).`
        : `Atlas: DataHub Context Layer returned 0 matching datasets. Utilizing global heuristics.`,
      `Atlas: Interrogating Organizational Memory for similar historical incidents...`,
      similar_incidents.length > 0 
        ? `Atlas: Organizational Memory matched ${similar_incidents.length} historical incident(s).`
        : `Atlas: No similar historical incidents found in Organizational Memory. Building greenfield plan.`,
      `Atlas: Stage [PLANNING] initiated. Formulating multi-disciplinary execution plan...`,
      `Atlas: Detected intent '${intent}' with confidence ${confidence}`,
      `Atlas: Formulated chronological plan containing ${plan_steps.length} step(s). Specialists: ${selected_specialists.join(", ")}`,
      `Atlas: Stage [EXECUTING] initiated. Dispatching sequential sub-tasks...`,
      ...plan_steps.flatMap(step => [
        `Atlas: Dispatching Step ${step.step_number}/${plan_steps.length} to specialist '${step.specialist_name}' -> Task: {step.task}`,
        `Atlas: Specialist '${step.specialist_name}' successfully completed task. Explanation: "${specialist_outputs[step.specialist_name]?.explanation || step.description}"`
      ]),
      `Atlas: Stage [AGGREGATING] initiated. Correlating specialist outputs...`,
      `Atlas: Stage [COMPLETED]. Generating executive reports and remediations...`,
      process.env.GEMINI_API_KEY 
        ? `Atlas: Routing multi-source context to Gemini Intelligence Engine...`
        : `Atlas: Rule-based synthesis completed.`
    ];

    res.json({
      session_id,
      query,
      stage: "COMPLETED",
      intent,
      confidence,
      selected_specialists,
      plan_steps,
      specialist_outputs,
      recommendation,
      orchestration_logs,
      similar_incidents
    });
  });

  // 9. Organizational Memory: List Memories or filter by asset/specialist
  app.get("/api/v1/memory", (req, res) => {
    const { asset_urn, specialist, limit } = req.query;
    let list = [...memoriesDb];

    if (asset_urn) {
      list = list.filter(m => m.affected_assets.includes(asset_urn.toString()));
    } else if (specialist) {
      list = list.filter(m => m.selected_specialists.some(s => s.toLowerCase() === specialist.toString().toLowerCase()));
    }

    // Sort descending by timestamp
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (limit) {
      list = list.slice(0, parseInt(limit.toString()));
    }

    res.json(list);
  });

  // 10. Organizational Memory: Save Custom Record
  app.post("/api/v1/memory", (req, res) => {
    const payload = req.body;
    
    const newId = `mem-${Math.random().toString(36).substring(2, 10)}`;
    const newItem: MemoryItem = {
      id: newId,
      incident: payload.incident,
      user_request: payload.user_request,
      context_snapshot: payload.context_snapshot || { source: "manual_archive", user: "system_admin" },
      selected_specialists: payload.selected_specialists || [],
      execution_plan: payload.execution_plan || [],
      recommendations: payload.recommendations || { risk_level: "MEDIUM", remediations: [] },
      human_approvals: payload.human_approvals || [{ approver: "system_admin", action: "MANUAL_ARCHIVED", timestamp: new Date().toISOString() }],
      final_outcome: payload.final_outcome,
      lessons_learned: payload.lessons_learned || [],
      tags: payload.tags || [],
      affected_assets: payload.affected_assets || [],
      timestamp: new Date().toISOString()
    };

    memoriesDb.unshift(newItem);
    res.status(201).json(newItem);
  });

  // 11. Organizational Memory: Search
  app.get("/api/v1/memory/search", (req, res) => {
    const q = (req.query.q || "").toString().toLowerCase();
    
    if (!q) {
      return res.json(memoriesDb);
    }

    const filtered = memoriesDb.filter(m => {
      return (
        m.incident.toLowerCase().includes(q) ||
        m.user_request.toLowerCase().includes(q) ||
        m.final_outcome.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q)) ||
        m.lessons_learned.some(l => l.toLowerCase().includes(q))
      );
    });

    res.json(filtered);
  });

  // 12. Organizational Memory: Synthesis Summary of specific incident IDs
  app.get("/api/v1/memory/summary", (req, res) => {
    let ids: string[] = [];
    if (Array.isArray(req.query.ids)) {
      ids = req.query.ids.map(id => id.toString());
    } else if (req.query.ids) {
      ids = [req.query.ids.toString()];
    }

    const matched = memoriesDb.filter(m => ids.includes(m.id));
    if (matched.length === 0) {
      return res.json({ summary: "No matching incident memory files selected for consolidation." });
    }

    const summaryText = `CONSOLIDATED EXECUTIVE SUMMARY REPORT - ORIXA INTEL

Analyzed ${matched.length} historical incident(s) from Organizational Memory.

Summary of Incidents:
${matched.map((m, idx) => `[Card ${idx + 1}] Incident: ${m.incident}
  - Request: "${m.user_request}"
  - Outcome: "${m.final_outcome}"
  - Risk rating: ${m.recommendations.risk_level || "MEDIUM"}
  - Affected assets: ${m.affected_assets.join(", ")}`).join("\n\n")}

Core Consolidated Lessons Learned:
${Array.from(new Set(matched.flatMap(m => m.lessons_learned))).map((lesson, idx) => `  ${idx + 1}. ${lesson}`).join("\n")}

Remediation Playbook:
  - Enforce automated pre-flight checks and DataHub validation before applying active DDL column drops or mutations.
  - Implement unencrypted column scanning triggers inside operational logs and CI/CD validation.
  - Scale database thread limits and configure query timeout safeguards to protect pools during scaling actions.`;

    res.json({ summary: summaryText });
  });

  // ============================================================================
  // 13. Incident Replay System Endpoints
  // ============================================================================

  const replayScenarios = {
    "silent-schema-disaster": {
      title: "Silent Schema Disaster",
      short_description: "A schema change breaks downstream dashboards silently.",
      category: "Schema",
      confidence_score: 0.98,
      root_cause: "Dropped column 'phone_raw' on postgres.core.users broke downstream Spark jobs and Tableau dashboards.",
      risk_assessment: "High risk of inaccurate executive billing and analytics reporting, degrading customer cohort metrics.",
      events: [
        {
          event_type: "ATLAS_ORCHESTRATION",
          responsible_specialist: null,
          description: "Atlas detects schema mismatch warnings propagated from Snowflake analytics warehouse.",
          supporting_evidence: ["Warning: demographics aggregation failed on Null column exception."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)"]
        },
        {
          event_type: "DATAHUB_RETRIEVAL",
          responsible_specialist: null,
          description: "Atlas interrogates DataHub context, revealing physical table schema has diverged from registered catalog URN.",
          supporting_evidence: ["Diff: Column 'phone_raw' dropped. Unregistered column 'phone_encrypted' found."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)"]
        },
        {
          event_type: "ORGANIZATIONAL_MEMORY",
          responsible_specialist: null,
          description: "Retrieved similar incident MEM-8FA4E: 'Pipeline Interruption due to Schema Drift' solved with a backward-compatible SQL view.",
          supporting_evidence: ["Historical Similarity Match: 94.2%"],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "atlas",
          description: "Specialist 'Atlas' runs deep physical table diagnostic checking Postgres server logs and connection pools.",
          supporting_evidence: [
            "Atlas [INFO]: Connecting to core database pool...",
            "Atlas [WARN]: Column 'phone_raw' has been removed."
          ],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "oracle",
          description: "Specialist 'Oracle' calculates downstream dependency disruption risks and pipeline regression probabilities.",
          supporting_evidence: ["Oracle [WARN]: Downstream regression probability at 94.2% on demographics table."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.user_demographics,PROD)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "forge",
          description: "Specialist 'Forge' drafts safe SQL migration schema patch to re-expose legacy columns as backward-compatible aliased views.",
          supporting_evidence: ["Forge [SUCCESS]: Generated view mapping V2_users_compat."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "GEMINI_REASONING",
          responsible_specialist: null,
          description: "Gemini synthesizes findings: Dropping 'phone_raw' broke spark daily ingest. View aliasing view is recommended.",
          supporting_evidence: ["Synthesized core recommendation with 98% structural confidence score."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "FINAL_RECOMMENDATION",
          responsible_specialist: null,
          description: "Atlas presents executive summary of root cause, structural patch script, and DataHub registration curl command.",
          supporting_evidence: ["Remediation plan generated: SQL compatibility view & DataHub metadata sync."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "HUMAN_APPROVAL",
          responsible_specialist: null,
          description: "SecOps Lead approves the Forge compatibility SQL schema patch.",
          supporting_evidence: ["Approved by owoadeemmy@gmail.com. Status shifted to EXECUTED."],
          status: "COMPLETED",
          related_assets: []
        }
      ]
    },
    "stale-ml-feature": {
      title: "Stale ML Feature",
      short_description: "Drone risk models degrade due to 72h stale wind-shear and sensor telemetry parameters.",
      category: "Machine Learning",
      confidence_score: 0.92,
      root_cause: "dbt pipeline sync worker pod was OOM-Killed on Kubernetes because sensor volume exceeded the 8GB memory ceiling limit.",
      risk_assessment: "Critical risk to flight safety: stale atmospheric indices lead to poor flight vector path corrections.",
      events: [
        {
          event_type: "ATLAS_ORCHESTRATION",
          responsible_specialist: null,
          description: "Operations flags flight risk model anomalies. Dispatches Atlas to trace data latency vectors.",
          supporting_evidence: ["Model accuracy (AUC) fell from standard 0.94 baseline to 0.58."],
          status: "COMPLETED",
          related_assets: ["urn:li:model:acme_aerospace.flight_risk_xgb"]
        },
        {
          event_type: "DATAHUB_RETRIEVAL",
          responsible_specialist: null,
          description: "Atlas interrogates lineage, identifying 'analytics.ml_features_prod' as the stale driver database.",
          supporting_evidence: ["DataHub lineage: users_telemetry -> ml_features_prod -> flight_risk_xgb"],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.ml_features_prod,PROD)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "architect",
          description: "Specialist 'Architect' traces active API pipelines and establishes feature update intervals.",
          supporting_evidence: ["Architect [WARN]: Parent dependency ml_features_prod is 72.4 hours stale."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.ml_features_prod,PROD)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "sentinel",
          description: "Specialist 'Sentinel' scans operational Kubernetes logs, discovering container out-of-memory crashes.",
          supporting_evidence: ["Sentinel [WARN]: Pod ml-feature-store-sync-df8a9 terminated with Exit Code 137 (OOMKilled)."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "GEMINI_REASONING",
          responsible_specialist: null,
          description: "Gemini reasons: Sensor density from storms exceeded memory bounds. Kubernetes deployment specs must be bumped to 16Gi.",
          supporting_evidence: ["Proposed memory limits modification to prevent future execution failures."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "FINAL_RECOMMENDATION",
          responsible_specialist: null,
          description: "Atlas issues container resource patch and manual Airflow rerun instructions.",
          supporting_evidence: ["Resource request update: raise pod limit from 8Gi to 16Gi."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "HUMAN_APPROVAL",
          responsible_specialist: null,
          description: "DevOps engineer approves Kubernetes resource manifest bump to 16Gi.",
          supporting_evidence: ["Approved by oncall-ops@acme-aerospace.com."],
          status: "COMPLETED",
          related_assets: []
        }
      ]
    },
    "pii-governance-violation": {
      title: "PII Governance Violation",
      short_description: "Plaintext SSNs and unencrypted emails leaked inside unauthorized project sandbox.",
      category: "Security & PII",
      confidence_score: 0.99,
      root_cause: "A developer backup script copied raw production users records into a public-facing staging sandbox.",
      risk_assessment: "Severe GDPR and CCPA violation. High vulnerability to external breaches and severe regulatory fines.",
      events: [
        {
          event_type: "ATLAS_ORCHESTRATION",
          responsible_specialist: null,
          description: "Threat engine identifies unmasked data formats. Dispatches Atlas to isolate the sandbox.",
          supporting_evidence: ["Alert: compliance rating dropped below baseline thresholds."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "guardian",
          description: "Specialist 'Guardian' samples staging table columns, discovering unencrypted Social Security Numbers.",
          supporting_evidence: ["Guardian [WARN]: Found 420 instances matching plaintext SSN pattern ^\\d{3}-\\d{2}-\\d{4}$."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "sentinel",
          description: "Specialist 'Sentinel' deploys IP access blocks to isolate the vulnerable staging database.",
          supporting_evidence: ["Sentinel [SUCCESS]: Blocked external traffic on Port 3000 to cluster staging-02."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "ambassador",
          description: "Specialist 'Ambassador' issues emergency notifications to security war-room on Slack.",
          supporting_evidence: ["Ambassador [SUCCESS]: Dispatched Slack hook to #security-war-room."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "GEMINI_REASONING",
          responsible_specialist: null,
          description: "Gemini evaluates breach: Immediate table truncation is required followed by VPC ingress firewall configuration.",
          supporting_evidence: ["Synthesized threat classification as CRITICAL policy infraction."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "FINAL_RECOMMENDATION",
          responsible_specialist: null,
          description: "Atlas drafts SQL cleanup statements to truncate sandbox tables and a firewall script.",
          supporting_evidence: ["Purge script: TRUNCATE TABLE sandbox.project_alpha."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "HUMAN_APPROVAL",
          responsible_specialist: null,
          description: "SecOps Director authorizes physical table truncation and VPC lock.",
          supporting_evidence: ["Approved. Truncation executed successfully on staging database."],
          status: "COMPLETED",
          related_assets: []
        }
      ]
    },
    "broken-data-pipeline": {
      title: "Broken Data Pipeline",
      short_description: "analytical load server IPs dropped during a network upgrade, breaking daily reporting.",
      category: "Infrastructure",
      confidence_score: 0.95,
      root_cause: "Terraform script omitted dbt-mesh loader IP ranges from the Snowflake warehouse whitelist.",
      risk_assessment: "Stalled SOX compliance audits and incomplete corporate reports.",
      events: [
        {
          event_type: "ATLAS_ORCHESTRATION",
          responsible_specialist: null,
          description: "Daily finance pipeline fails to connect, raising connection socket timeouts.",
          supporting_evidence: ["Prometheus Alert: finance_reporting_load timed out after 10 retries."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "architect",
          description: "Specialist 'Architect' audits ingress routing, discovering firewall rule blockages.",
          supporting_evidence: ["Architect [WARN]: Egress blocked by firewall rule 'deny-unvetted-staging-egress'."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.finance_reporting,PROD)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "sentinel",
          description: "Specialist 'Sentinel' analyzes TCP handshakes, identifying connection socket timeouts.",
          supporting_evidence: ["Sentinel [WARN]: TCP connection handshake timeout after 15000ms."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "GEMINI_REASONING",
          responsible_specialist: null,
          description: "Gemini analyzes subnet updates: A missing Terraform variable omitted DBT_LOADER_NAT. Terraform must be patched.",
          supporting_evidence: ["Identified specific commit 'f22ea8' which introduced the regression."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "FINAL_RECOMMENDATION",
          responsible_specialist: null,
          description: "Atlas drafts Terraform ingress rule addition and network keepalive configuration rules.",
          supporting_evidence: ["Drafted google_compute_firewall.allow_dbt_egress resource patch."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "HUMAN_APPROVAL",
          responsible_specialist: null,
          description: "SRE Lead approves whitelisting and applies Terraform patch.",
          supporting_evidence: ["Approved. Connection pool successfully re-established on Snowflake port 443."],
          status: "COMPLETED",
          related_assets: []
        }
      ]
    },
    "missing-dataset-owner": {
      title: "Missing Dataset Owner",
      short_description: "An orphaned financial ledger dataset blocks resolution of validation anomalies.",
      category: "Governance",
      confidence_score: 0.89,
      root_cause: "The lead database steward left the company without executing a transitional ownership delegation.",
      risk_assessment: "Unstewarded data quality anomalies risk violating quarterly audit validation metrics.",
      events: [
        {
          event_type: "ATLAS_ORCHESTRATION",
          responsible_specialist: null,
          description: "Soda quality scans flag negative balances. Atlas attempts to assign a steward ticket.",
          supporting_evidence: ["Data anomaly: negative balance values detected inside ledger."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.finance.ledger_v2,PROD)"]
        },
        {
          event_type: "DATAHUB_RETRIEVAL",
          responsible_specialist: null,
          description: "Atlas checks catalog contacts: dataset URN has zero registered owners or steward profiles.",
          supporting_evidence: ["GET /api/v1/dataset/finance.ledger_v2/owners returned empty array."],
          status: "COMPLETED",
          related_assets: ["urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.finance.ledger_v2,PROD)"]
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "archivist",
          description: "Specialist 'Archivist' checks code commit patterns and team charts to locate the author.",
          supporting_evidence: ["Archivist [SUCCESS]: Identified Sarah Vance as author of 92% of lines in schema DDL."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "SPECIALIST_ACTIVITY",
          responsible_specialist: "ambassador",
          description: "Specialist 'Ambassador' drafts automated Slack ownership confirmation requests.",
          supporting_evidence: ["Ambassador [SUCCESS]: Opened ticket GOV-OWNER-9912 assigned to Treasury Group."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "GEMINI_REASONING",
          responsible_specialist: null,
          description: "Gemini recommends enrolling the Treasury Platform Team and setting up a pre-commit owner validation gate.",
          supporting_evidence: ["Formulated rule prohibiting asset deployment without registered contacts."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "FINAL_RECOMMENDATION",
          responsible_specialist: null,
          description: "Atlas outputs REST registry payload to enrollment endpoint and a Git gatekeeper shell script.",
          supporting_evidence: ["Registering Sarah Vance (DATA_OWNER) and Treasury Group (STEWARD)."],
          status: "COMPLETED",
          related_assets: []
        },
        {
          event_type: "HUMAN_APPROVAL",
          responsible_specialist: null,
          description: "Sarah Vance confirms ownership claim and registers the Treasury platform.",
          supporting_evidence: ["Ownership claimed and DataHub catalog synchronized."],
          status: "COMPLETED",
          related_assets: []
        }
      ]
    }
  };

  function buildReplayTimeline(investigationId, queryText) {
    let chosenKey = "silent-schema-disaster";
    const normalizedId = (investigationId || "").toLowerCase();
    const normalizedQuery = (queryText || "").toLowerCase();

    if (replayScenarios[normalizedId]) {
      chosenKey = normalizedId;
    } else {
      for (const k of Object.keys(replayScenarios)) {
        if (normalizedId.includes(k) || normalizedQuery.includes(k) || replayScenarios[k].title.toLowerCase().includes(normalizedQuery)) {
          chosenKey = k;
          break;
        }
      }
    }

    const sc = replayScenarios[chosenKey];
    const baseTime = new Date();
    baseTime.setMinutes(baseTime.getMinutes() - sc.events.length * 2);

    const eventsList = sc.events.map((ev, idx) => {
      const evTime = new Date(baseTime.getTime() + idx * 2 * 60 * 1000);
      const hrs = String(evTime.getUTCHours()).padStart(2, "0");
      const mins = String(evTime.getUTCMinutes()).padStart(2, "0");
      const secs = String(evTime.getUTCSeconds()).padStart(2, "0");
      return {
        id: `evt-${chosenKey}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: `${hrs}:${mins}:${secs} UTC`,
        event_type: ev.event_type,
        responsible_specialist: ev.responsible_specialist,
        description: ev.description,
        supporting_evidence: ev.supporting_evidence || [],
        status: ev.status || "COMPLETED",
        related_assets: ev.related_assets || []
      };
    });

    return {
      investigation_id: investigationId || `inv-${chosenKey}-${Math.random().toString(36).substring(2, 8)}`,
      title: sc.title,
      short_description: sc.short_description,
      category: sc.category,
      confidence_score: sc.confidence_score,
      root_cause: sc.root_cause,
      risk_assessment: sc.risk_assessment,
      events: eventsList
    };
  }

  app.get("/api/v1/replay/:investigation_id", (req, res) => {
    const { investigation_id } = req.params;
    const timeline = buildReplayTimeline(investigation_id, "");
    res.json(timeline);
  });

  app.post("/api/v1/replay/generate", (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ detail: "Query cannot be empty or contain solely blank whitespace." });
    }
    const timeline = buildReplayTimeline(`inv-gen-${Math.random().toString(36).substring(2, 8)}`, query);
    res.status(201).json(timeline);
  });

  // ============================================================================
  // Explainability & Decision Center Endpoints
  // ============================================================================

  function buildExplanationResponse(investigationId: string) {
    const now = new Date().toISOString();
    let intent = "SCHEMA_ALIGNMENT";
    const idLower = (investigationId || "").toLowerCase();
    
    if (idLower.includes("threat") || idLower.includes("contain") || idLower.includes("sentinel") || idLower.includes("compromise") || idLower.includes("key")) {
      intent = "THREAT_CONTAINMENT";
    } else if (idLower.includes("compliance") || idLower.includes("privacy") || idLower.includes("guardian")) {
      intent = "COMPLIANCE_AUDIT";
    }

    let evidenceTimeline: any[] = [];
    let specialists: any[] = [];
    let risk = { risk_level: "LOW", description: "", mitigations: [] as string[] };
    let actions: any[] = [];
    let executiveSummary = "";
    let rootCause = "";
    let score = 0.8;
    let grade = "MEDIUM";
    let factors: string[] = [];
    let specialistAgreement = 1.0;

    if (intent === "SCHEMA_ALIGNMENT") {
      evidenceTimeline = [
        {
          id: `ev-drift-${Math.random().toString(36).substring(2, 6)}`,
          type: "schema_drift",
          source: "Atlas Supervisor",
          title: "Column Deviation Detected",
          description: "Physical column catalog scan pinpointed an unregistered plain attribute 'phone_raw' varchar(255) in 'users_sandbox' which deviates from the registered schema definition.",
          confidence_impact: 0.45,
          timestamp: now,
          metadata: { target_table: "users_sandbox", drifted_columns: ["phone_raw"], db_platform: "postgres" }
        },
        {
          id: `ev-pii-${Math.random().toString(36).substring(2, 6)}`,
          type: "pii_leak",
          source: "Guardian Specialist",
          title: "Plaintext PII Warning Triggered",
          description: "Automated entropy scanning verified that column 'phone_raw' stores unmasked phone numbers, violating CCPA personal identifiable data policies.",
          confidence_impact: 0.35,
          timestamp: now,
          metadata: { privacy_boundary: "CCPA_CC-5", entropy_level: 0.89, classification: "PII_PHONE_NUMBER" }
        },
        {
          id: `ev-trace-${Math.random().toString(36).substring(2, 6)}`,
          type: "datahub_sync",
          source: "DataHub Catalog",
          title: "Downstream Lineage Threat",
          description: "Identified 1 active downstream Snowflake analytical dashboard ('Executive Metrics Dashboard') depending directly on the drifting schema, confirming immediate business disruption risks.",
          confidence_impact: 0.20,
          timestamp: now,
          metadata: { downstream_nodes: 1, dependent_dashboards: ["Executive Metrics Dashboard"] }
        }
      ];

      specialists = [
        {
          specialist_name: "atlas",
          display_name: "Atlas",
          role: "Schema Alignment Specialist",
          findings: ["Physical column 'phone_raw' in 'users_sandbox' lacks registered metadata definition."],
          confidence_score: 0.95
        },
        {
          specialist_name: "oracle",
          display_name: "Oracle",
          role: "Drift Analytics Specialist",
          findings: ["Calculated 84.5% chance of downstream pipeline breakdown if column is not updated."],
          confidence_score: 0.88
        },
        {
          specialist_name: "forge",
          display_name: "Forge",
          role: "Migration Script Planner",
          findings: ["Synthesized transactional DDL statements migrating column to secure crypt-parameters."],
          confidence_score: 0.92
        }
      ];

      risk = {
        risk_level: "HIGH",
        description: "Plaintext customer contact variables left accessible violate CCPA Article 5 privacy boundaries.",
        mitigations: [
          "Roll back latest dev migration or alter column 'phone_raw' immediately.",
          "Enable pre-flight database metadata inspection checks in dbt loader pipelines."
        ]
      };

      actions = [
        {
          id: "rec-action-001",
          title: "Apply Cryptographic Column Migration",
          description: "Encrypts the plaintext phone column and drops the cleartext variable under a transactional safety block.",
          code_snippet: "BEGIN;\nALTER TABLE users_sandbox ADD COLUMN phone_encrypted VARCHAR(512);\nUPDATE users_sandbox SET phone_encrypted = encode(digest(phone_raw, 'sha256'), 'hex') WHERE phone_raw IS NOT NULL;\nALTER TABLE users_sandbox DROP COLUMN phone_raw;\nCOMMIT;",
          status: "PENDING"
        }
      ];

      executiveSummary = "Atlas coordinated an automated schema reconciliation scan. The intelligence pipeline detected critical column layout deviations in the 'users_sandbox' catalog, verified downstream analytics impact, and formulated an immediately deployable database migration patch.";
      rootCause = "The development sandbox database underwent custom manual schema modifications without registering alterations via standard DataHub webhooks.";
      score = 0.95;
      grade = "HIGH";
      factors = [
        "Highly robust verification (3 independent evidence signals compiled).",
        "Unanimous consensus among active specialized agents (3/3 green status).",
        "Grounding matched with certified Organizational Memory runbook cases."
      ];
      specialistAgreement = 1.0;

    } else if (intent === "THREAT_CONTAINMENT") {
      evidenceTimeline = [
        {
          id: `ev-threat-${Math.random().toString(36).substring(2, 6)}`,
          type: "pii_leak",
          source: "Sentinel Specialist",
          title: "Suspicious Connection Query",
          description: "Identified rapid schema inspection commands from an unrecognized development IP block attempting to select cleartext credentials.",
          confidence_impact: 0.50,
          timestamp: now,
          metadata: { unauthorized_ips: ["192.168.42.102"], matched_pattern: "SQL_INJECTION_SUSPICION" }
        },
        {
          id: `ev-mem-${Math.random().toString(36).substring(2, 6)}`,
          type: "historical_match",
          source: "Organizational Memory",
          title: "Security Runbook Correlation",
          description: "Verified SRE playbook constraints in Chapter 9, mandating immediate container network workspace isolation.",
          confidence_impact: 0.30,
          timestamp: now,
          metadata: { runbook_chapter: 9, remediation_recipe: "Isolate Sandbox" }
        }
      ];

      specialists = [
        {
          specialist_name: "sentinel",
          display_name: "Sentinel",
          role: "Threat Containment Specialist",
          findings: ["Flagged unauthorized schema inspections from unlisted dev IP block."],
          confidence_score: 0.96
        },
        {
          specialist_name: "archivist",
          display_name: "Archivist",
          role: "Compliance Grounding Specialist",
          findings: ["Matched query pattern with intrusion and privilege escalation models."],
          confidence_score: 0.90
        }
      ];

      risk = {
        risk_level: "CRITICAL",
        description: "Potential credential leak might lead to unauthorized write privileges inside core production databases.",
        mitigations: [
          "Isolate sandbox container immediately.",
          "Revoke all active developer connection strings and regenerate API secrets."
        ]
      };

      actions = [
        {
          id: "rec-action-002",
          title: "Isolate Sandbox & Rotate API Keys",
          description: "Executes CLI isolation procedures and updates API authentication tokens.",
          code_snippet: 'orixa auth rotate-keys --sandbox "Staging Sandbox Delta"',
          status: "PENDING"
        }
      ];

      executiveSummary = "Atlas triggered active threat mitigation containment. The sentinel fleet analyzed request credentials, restricted public write permissions on isolated workspaces, and updated security SRE war rooms.";
      rootCause = "Compromised developer credentials committed in local text variables.";
      score = 0.93;
      grade = "HIGH";
      factors = [
        "Robust verification (2 independent evidence signals compiled).",
        "Unanimous consensus among active specialized agents (2/2 green status)."
      ];
      specialistAgreement = 1.0;

    } else {
      evidenceTimeline = [
        {
          id: `ev-gen-${Math.random().toString(36).substring(2, 6)}`,
          type: "specialist_log",
          source: "Archivist Specialist",
          title: "Standard Operational Baseline Matches",
          description: "Checked background performance stats against operational baselines. Database latencies and connection pools are stable.",
          confidence_impact: 0.20,
          timestamp: now,
          metadata: { latency_ms: 11.2, pool_utilization_pct: 15 }
        }
      ];

      specialists = [
        {
          specialist_name: "archivist",
          display_name: "Archivist",
          role: "Organizational Memory Audit Specialist",
          findings: ["Confirmed system variables and relational table columns are aligned to baselines."],
          confidence_score: 0.85
        }
      ];

      risk = {
        risk_level: "LOW",
        description: "System is performing within highly optimized SLA baseline margins. Compounding risks are minimal.",
        mitigations: []
      };

      actions = [
        {
          id: "rec-action-003",
          title: "Maintain Baseline Monitoring",
          description: "Standard diagnostic loop validated. Continue continuous telemetry logging.",
          code_snippet: "orixa status --fleet --detailed",
          status: "PENDING"
        }
      ];

      executiveSummary = "Atlas orchestrated a general diagnostic sweep of active database pools and catalog assets. All microservice routes, metadata hooks, and latency bounds are performing within acceptable parameters.";
      rootCause = "No anomalies detected.";
      score = 0.85;
      grade = "MEDIUM";
      factors = [
        "Standard diagnostic baseline checks conform to reference benchmarks."
      ];
      specialistAgreement = 1.0;
    }

    const auditTrail = [
      {
        id: `aud-${Math.random().toString(36).substring(2, 6)}`,
        action: "ORCHESTRATION_TRIGGERED",
        performed_by: "atlas-supervisor@orixa.enterprise.ai",
        timestamp: now,
        details: `Atlas Supervisor initiated diagnostic boundary investigation '${investigationId}' matching user request.`
      },
      ...evidenceTimeline.map((ev, index) => ({
        id: `aud-${Math.random().toString(36).substring(2, 6)}`,
        action: "EVIDENCE_APPENDED",
        performed_by: `${ev.source.toLowerCase().replace(/\s+/g, "-")}@orixa.enterprise.ai`,
        timestamp: now,
        details: `Successfully cataloged evidence: ${ev.title}.`
      }))
    ];

    const datahubContext = [
      {
        asset_urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
        asset_name: "core.users",
        last_synchronized: "2026-07-13T01:30:00Z",
        registered_fields: 6,
        domain: "Engineering"
      }
    ];

    const memoryMatches = [
      {
        id: "mem-8fa4e28-1b03-49aa",
        incident: "Downstream Pipeline Interruption due to Schema Drift",
        match_strength: 0.89,
        relevance_explanation: "Historic drift on billing core mirrors current sandbox drift characteristics."
      }
    ];

    let finalRecommendation = "Establish masked view layer over column 'tax_id_unencrypted' and restrict direct query privileges.";
    let atlasSummary = "COMPLIANCE REPORT: Automated dictionary scan flagged high-entropy plain SSN records inside table 'finance_reporting'. This is a direct SOX compliance infraction. Guardian recommends establishing a masked view layer over sensitive attributes to re-establish financial data isolation. Recommendation: Deploy view patch MASK-VIEW-82.";
    let evidencePanel: any[] = [];
    let specialistContributions: any[] = [];
    let decisionDna = {
      context_quality: 0.90,
      evidence_coverage: 0.85,
      historical_similarity: 0.92,
      specialist_agreement: 0.95,
      overall_confidence: 0.91
    };
    let riskAssessment = {
      if_accepted: "Vulnerable plain-text tax identifiers are securely masked using column-level encryption views, satisfying financial audit standards.",
      if_ignored: "Internal ledger databases remain in non-compliance, risking failure of upcoming SOX financial audits and exposing raw user PII.",
      severity: "HIGH",
      downstream_impact: "3 active financial reporting dashboards, corporate SOX certification status, and 140K accounts."
    };
    let evidenceTrail: any[] = [];

    if (intent === "SCHEMA_ALIGNMENT") {
      finalRecommendation = "Rename customer_phone_raw to customer_phone.";
      atlasSummary = "OPERATIONAL BRIEFING: Atlas detected structural column drift on table 'users_sandbox' at 09:14 UTC. Analysis of downstream lineage via DataHub pinpoints 14 affected datasets and 2 critical Looker dashboards. Under CCPA regulation CC-5, unencrypted phone contact logs pose significant legal risks. Consensus between specialists (Atlas, Oracle, Forge) is 100%. Recommendation: Apply database migration patch DDL-2942 to sync and secure fields.";
      evidencePanel = [
        {
          card_id: "ev-dh-lineage",
          title: "DataHub Lineage Check",
          what_inspected: "Upstream physical PostgreSQL tables mapped to Snowflake core analytic pipelines.",
          what_found: "14 downstream datasets, 2 Looker billing reports, and 1 main billing ETL depending directly on users_sandbox.id field.",
          why_matters: "A schema modification on the sandbox database will silently cascade, breaking financial ingestion runs.",
          source: "DataHub Lineage Service",
          confidence_impact: 0.30
        },
        {
          card_id: "ev-owner-metadata",
          title: "Ownership Metadata Check",
          what_inspected: "DataHub asset owner records and team rosters for users_sandbox database.",
          what_found: "Asset is owned by the Data Platform Team with no registered backup DBA steward.",
          why_matters: "No automated safety warnings were issued to owners prior to execution because notification webhooks were unconfigured.",
          source: "DataHub Ownership Service",
          confidence_impact: 0.15
        },
        {
          card_id: "ev-schema-evolution",
          title: "Schema Evolution Trace",
          what_inspected: "Chronological DDL alterations on active pg_catalog indices in the sandbox workspace.",
          what_found: "Column 'customer_phone_raw' was added yesterday afternoon under commit transaction #DEV-9842.",
          why_matters: "This column mismatch deviates from production where 'customer_phone' is registered, causing a structural sync conflict.",
          source: "Atlas Schema Scanner",
          confidence_impact: 0.25
        },
        {
          card_id: "ev-gov-policies",
          title: "Governance Policies Check",
          what_inspected: "Active data sovereignty rules and security catalog tags on users_sandbox fields.",
          what_found: "Column 'customer_phone_raw' is unencrypted, violating safety policy CCPA CC-5 and GOV-SEC-09.",
          why_matters: "Raw customer contacts left in plaintext violate statutory privacy laws and trigger immediate compliance audit flags.",
          source: "Guardian Compliance Auditor",
          confidence_impact: 0.20
        }
      ];
      specialistContributions = [
        {
          name: "atlas",
          role: "Schema Alignment Specialist",
          task: "audit_schema",
          findings: [
            "Unregistered plain-text column 'customer_phone_raw' varchar(255) located.",
            "Schema model conflicts with registered production layout definition."
          ],
          confidence: 0.98,
          completion_time_seconds: 3.2,
          reason_for_selection: "Assigned as primary catalog auditor for metadata verification."
        },
        {
          name: "oracle",
          role: "Drift Analytics Specialist",
          task: "estimate_schema_drift_risk",
          findings: [
            "Calculated high failure risk index (84.5%) for analytical pipelines.",
            "Downstream ETL pool saturation predicted if column change runs unresolved."
          ],
          confidence: 0.91,
          completion_time_seconds: 2.1,
          reason_for_selection: "Required to forecast cascade failure timelines on downstream reporting warehouses."
        },
        {
          name: "forge",
          role: "Migration Script Planner",
          task: "draft_alignment_sql",
          findings: [
            "Formulated safe DDL statements adding secure crypt parameters.",
            "Mapped robust drop update operations inside transactional rollback blocks."
          ],
          confidence: 0.94,
          completion_time_seconds: 1.4,
          reason_for_selection: "Responsible for compiling database transactional corrective scripts."
        }
      ];
      decisionDna = {
        context_quality: 0.94,
        evidence_coverage: 0.92,
        historical_similarity: 0.88,
        specialist_agreement: 1.00,
        overall_confidence: 0.95
      };
      riskAssessment = {
        if_accepted: "Normal analytical reports and billing ETL schedules are preserved. Column 'customer_phone_raw' is aligned to 'customer_phone' and encrypted, satisfying CCPA policies and re-establishing system schema balance.",
        if_ignored: "The weekly Snowflake analytical report runs fail on Monday morning. The looker dashboard will fail to load with column mismatch error, disrupting regional executive summaries. Compliance fines may be levied under GDPR Article 30.",
        severity: "HIGH",
        downstream_impact: "14 datasets, 2 executive dashboards, and 4.2M processed transaction records."
      };
      evidenceTrail = [
        {
          id: "trail-1-rec",
          label: "Recommendation Blueprint",
          title: "Remediation Strategy Proposed",
          details: "Drafted operational database migration: Rename customer_phone_raw to customer_phone.",
          expanded_payload: { ddl_migration_id: "MIG-2942", rollback_supported: true }
        },
        {
          id: "trail-2-ev",
          label: "Physical Evidence Checked",
          title: "Database Column Mismatch",
          details: "Unregistered variable 'customer_phone_raw' detected inside users_sandbox.",
          expanded_payload: { physical_field: "customer_phone_raw", field_type: "varchar(255)" }
        },
        {
          id: "trail-3-dh",
          label: "DataHub Metadata Verified",
          title: "Lineage Dependency Map",
          details: "14 downstream datasets and 2 critical dashboards depend directly on user identity schemas.",
          expanded_payload: { downstream_node_count: 14, impacted_dashboards: ["Executive Metrics Dashboard"] }
        },
        {
          id: "trail-4-spec",
          label: "Specialist Findings Evaluated",
          title: "Consensus Achieved (100%)",
          details: "Atlas, Oracle, and Forge verified unanimous coordination logs regarding drift.",
          expanded_payload: { specialists_involved: ["atlas", "oracle", "forge"], agreement: 1.0 }
        },
        {
          id: "trail-5-mem",
          label: "Historical Memory Synced",
          title: "Incident Correlation Analysis",
          details: "Matched incident #MEM-8FA4 regarding schema drift on public billing nodes (89% match).",
          expanded_payload: { matching_incident_id: "MEM-8FA4", similarity_score: 0.89 }
        },
        {
          id: "trail-6-risk",
          label: "Risk Forecast Completed",
          title: "Downstream Pipeline Interruption",
          details: "Deferring alignment risks breaking critical weekly reporting metrics. Severity: HIGH.",
          expanded_payload: { deferral_consequence: riskAssessment.if_ignored, impact_scope: riskAssessment.downstream_impact }
        }
      ];
    } else if (intent === "THREAT_CONTAINMENT") {
      finalRecommendation = "Revoke compromised Vault staging token, restrict subnet ingress rules, and rotate authorization headers for Eastern clusters.";
      atlasSummary = "SECURITY ALERT: Unencrypted staging credentials identified inside git commit history on branch sandbox-patch-99. Active logging confirms lateral connection attempts from unauthorized developer subnets. Sentinel threat engine recommends immediate isolation of container staging instances. Recommendation: Run Vault rotation command SEC-RO-42 and isolate Staging Sandbox Delta environment.";
      evidencePanel = [
        {
          card_id: "ev-threat-intel",
          title: "Network Ingress Trace",
          what_inspected: "Operational gateway connection headers and staging cluster container subnets.",
          what_found: "Active, unauthorized API requests from an unlisted developer CLI IP block on subnet 10.14.0.0/16.",
          why_matters: "Indicates that leaked credentials are being actively utilized in an unauthorized attempts to dump system variables.",
          source: "Sentinel Threat Detection",
          confidence_impact: 0.35
        },
        {
          card_id: "ev-key-commit",
          title: "Credential Exposure Trace",
          what_inspected: "Staging branch git commits and cleartext configuration variables.",
          what_found: "An unencrypted Vault staging token was committed plaintext to public branch 'sandbox-patch-99'.",
          why_matters: "Allows arbitrary container orchestration control without going through authorized SSO identity gates.",
          source: "Archivist Code Scanner",
          confidence_impact: 0.30
        },
        {
          card_id: "ev-gov-isolation",
          title: "Isolation Boundaries Check",
          what_inspected: "Active security groups, firewall rules, and VPC container boundaries.",
          what_found: "Development sandbox lacks strict security group egress limits, allowing connections outwards.",
          why_matters: "Enables potential lateral movement from sandbox staging to production endpoints if keys are unrotated.",
          source: "Sentinel Isolation Engine",
          confidence_impact: 0.25
        }
      ];
      specialistContributions = [
        {
          name: "sentinel",
          role: "Threat Containment Specialist",
          task: "scan_operational_logs",
          findings: [
            "Logged unauthorized read attempts targeting customer contact endpoints.",
            "Flagged active IP block 192.168.42.102 making unauthorized configuration select operations."
          ],
          confidence: 0.97,
          completion_time_seconds: 4.1,
          reason_for_selection: "Dispatched to scan operational request footprints and manage active boundaries."
        },
        {
          name: "archivist",
          role: "Compliance Grounding Specialist",
          task: "ground_agent_decision",
          findings: [
            "Matched leak structure with Runbook Chapter 9 isolation playbook requirements.",
            "Identified plaintext Vault token exposed on staging git history branch."
          ],
          confidence: 0.90,
          completion_time_seconds: 1.8,
          reason_for_selection: "Employed to query organizational safety guidelines and incident databases."
        }
      ];
      decisionDna = {
        context_quality: 0.96,
        evidence_coverage: 0.90,
        historical_similarity: 0.75,
        specialist_agreement: 0.98,
        overall_confidence: 0.93
      };
      riskAssessment = {
        if_accepted: "Vault tokens are immediately revoked and rotated, staging subnets are isolated, and security baseline integrity is restored, preventing any unauthorized resource access.",
        if_ignored: "Malicious actors could use the leaked token to gain access to other staging databases, steal internal user data, or disrupt running sandbox microservices.",
        severity: "CRITICAL",
        downstream_impact: "All staging databases, active Vault secrets, and container workloads on Eastern subnet."
      };
      evidenceTrail = [
        {
          id: "trail-1-rec",
          label: "Recommendation Blueprint",
          title: "Credentials Key Rotation",
          details: "Revoke exposed Vault keys: Revoke compromised Vault staging token.",
          expanded_payload: { vault_engine: "kv-staging", rotation_policy: "immediate" }
        },
        {
          id: "trail-2-ev",
          label: "Physical Evidence Checked",
          title: "Git Log Exposure Located",
          details: "Plain Vault credentials key was committed to staging branch configuration files.",
          expanded_payload: { exposed_file: "config.yaml", branch: "sandbox-patch-99" }
        },
        {
          id: "trail-3-dh",
          label: "DataHub Context Used",
          title: "Resource Boundaries Map",
          details: "Isolated dev sandbox container lacks egress firewall rules.",
          expanded_payload: { sandbox: "Staging Sandbox Delta", egress_restricted: false }
        },
        {
          id: "trail-4-spec",
          label: "Specialist Findings Evaluated",
          title: "Sentinel Containment Logs",
          details: "Sentinel confirmed active API select attempts from unrecognized development subnet.",
          expanded_payload: { unauthorized_requests: 42, originating_ip: "192.168.42.102" }
        },
        {
          id: "trail-5-risk",
          label: "Risk Forecast Completed",
          title: "Lateral Movement Threat",
          details: "Unrotated keys enable unauthorized lateral staging access. Severity: CRITICAL.",
          expanded_payload: { deferral_consequence: riskAssessment.if_ignored, impact_scope: riskAssessment.downstream_impact }
        }
      ];
    } else {
      evidencePanel = [
        {
          card_id: "ev-pii-scan",
          title: "Sensitive Column Audit",
          what_inspected: "Data dictionaries and sample rows for active snowflake tables.",
          what_found: "Column 'tax_id_unencrypted' stores raw Social Security and Tax IDs in cleartext.",
          why_matters: "Fails PCI-DSS and SOX financial protection compliance parameters. High vulnerability index.",
          source: "Guardian PII Scanner",
          confidence_impact: 0.40
        },
        {
          card_id: "ev-historical-incident",
          title: "Historical Incident Match",
          what_inspected: "Semantic correlation records in Orixa's long-term incident database.",
          what_found: "Matched incident #MEM-3C21 with 92% similarity regarding unmasked staging metrics.",
          why_matters: "Historic remediation patterns show that failing to restrict views immediately leads to regulatory warnings.",
          source: "Archivist Incident Database",
          confidence_impact: 0.30
        }
      ];
      specialistContributions = [
        {
          name: "guardian",
          role: "Privacy Auditing Specialist",
          task: "scan_sensitive_columns",
          findings: [
            "Flagged plain-text column 'tax_id_unencrypted' as severe data leak risk.",
            "Isolate 140,000 exposed Social Security / Tax numbers lacking compliance masks."
          ],
          confidence: 0.95,
          completion_time_seconds: 2.8,
          reason_for_selection: "Dispatched as chief policy auditor for PII attribute validation."
        }
      ];
      evidenceTrail = [
        {
          id: "trail-1-rec",
          label: "Recommendation Blueprint",
          title: "Secure View Masking Layer",
          details: "Establish crypt view views on unmasked values: Establish masked view layer.",
          expanded_payload: { masking_algorithm: "SHA-256", view_name: "vw_finance_reporting" }
        },
        {
          id: "trail-2-ev",
          label: "Physical Evidence Checked",
          title: "Raw Plain PII Unmasked",
          details: "Column 'tax_id_unencrypted' stores plain SSN variables.",
          expanded_payload: { table_name: "finance_reporting", pii_columns: ["tax_id_unencrypted"] }
        },
        {
          id: "trail-3-dh",
          label: "DataHub Context Used",
          title: "Compliance Policies Checked",
          details: "Fails SOX data isolation parameters and GDPR CC-3 boundaries.",
          expanded_payload: { violated_policies: ["SOX-SEC-01", "GDPR-CC-3"] }
        },
        {
          id: "trail-4-risk",
          label: "Risk Forecast Completed",
          title: "Auditing Infraction Penalty",
          details: "Unresolved records risk SOX audit failure. Severity: HIGH.",
          expanded_payload: { deferral_consequences: riskAssessment.if_ignored }
        }
      ];
    }

    const modifiedAuditTrail = [
      {
        id: "aud-rec-init",
        action: "INVESTIGATION_DISPATCHED",
        performed_by: "atlas-supervisor@orixa.enterprise.ai",
        timestamp: now,
        details: `Atlas Supervisor initiated diagnostic boundary investigation '${investigationId}' matching user request.`
      },
      ...evidenceTimeline.map((ev, index) => ({
        id: `aud-${index}-${Math.random().toString(36).substring(2, 6)}`,
        action: "EVIDENCE_APPENDED",
        performed_by: `${ev.source.toLowerCase().replace(/\s+/g, "-")}@orixa.enterprise.ai`,
        timestamp: now,
        details: `Successfully cataloged evidence: ${ev.title}.`
      }))
    ];

    return {
      investigation_id: investigationId,
      executive_summary: executiveSummary,
      root_cause: rootCause,
      confidence: {
        score,
        grade,
        factors,
        specialist_agreement: specialistAgreement,
        calculated_at: now
      },
      risk,
      evidence_timeline: evidenceTimeline,
      specialists_contributed: specialists,
      organizational_memory_matches: memoryMatches,
      datahub_context_used: datahubContext,
      recommended_actions: actions,
      human_approval_status: "PENDING",
      audit_trail: modifiedAuditTrail,

      // Enriched fields for Atlas Operations Console & Decision Center Alignment
      final_recommendation: finalRecommendation,
      atlas_summary: atlasSummary,
      evidence_panel: evidencePanel,
      specialist_contributions: specialistContributions,
      decision_dna: decisionDna,
      risk_assessment: riskAssessment,
      evidence_trail: evidenceTrail
    };
  }

  // ============================================================================
  // Live Operational State Machine & SSE Streaming (Production-Grade Real-Time)
  // ============================================================================

  const STAGES = [
    "Receiving Request",
    "Reading Organizational Context",
    "Searching Organizational Memory",
    "Coordinating Specialists",
    "Generating Recommendation",
    "Completed"
  ];

  const STAGE_PERCENTAGES: Record<string, number> = {
    "Receiving Request": 20,
    "Reading Organizational Context": 40,
    "Searching Organizational Memory": 65,
    "Coordinating Specialists": 85,
    "Generating Recommendation": 95,
    "Completed": 100
  };

  const STAGE_ESTIMATED_TIMES: Record<string, number> = {
    "Receiving Request": 15,
    "Reading Organizational Context": 12,
    "Searching Organizational Memory": 9,
    "Coordinating Specialists": 6,
    "Generating Recommendation": 3,
    "Completed": 0
  };

  const approvalStates: Record<string, string> = {
    "silent-schema-disaster": "PENDING",
    "compromised-dev-keys-leak": "PENDING",
    "unencrypted-pii-columns": "PENDING"
  };

  let activeInvestigationId = "silent-schema-disaster";
  let currentStageIndex = 0;
  let forceStage: string | null = null;
  const sseClients = new Set<any>();

  function getLiveState() {
    const stage = forceStage || STAGES[currentStageIndex];
    const progressPct = STAGE_PERCENTAGES[stage] !== undefined ? STAGE_PERCENTAGES[stage] : 20;
    const estRemaining = STAGE_ESTIMATED_TIMES[stage] !== undefined ? STAGE_ESTIMATED_TIMES[stage] : 5;
    const currentApprovalStatus = approvalStates[activeInvestigationId] || "PENDING";

    const getAdjustedConfidence = (specName: string, basePercent: number) => {
      const spec = specialistsFleet.find(s => s.name.toLowerCase() === specName.toLowerCase());
      if (!spec) return `${basePercent}%`;
      const up = spec.thumbs_up || 0;
      const down = spec.thumbs_down || 0;
      const total = up + down;
      if (total === 0) return `${basePercent}%`;
      const ratio = up / total;
      const penaltyOrBonus = (ratio - 0.9) * 15; // 90% is neutral
      const adjusted = Math.min(100, Math.max(50, Math.round(basePercent + penaltyOrBonus)));
      return `${adjusted}%`;
    };

    let activeSpecialist = null;
    if (stage !== "Completed") {
      if (stage === "Reading Organizational Context") {
        const specItem = specialistsFleet.find(s => s.name === "architect");
        activeSpecialist = {
          specialist_name: "Architect",
          role: "Downstream System Dependency Tracing",
          current_activity: "Scanning physical tables, DataHub catalogs, and schema lineage paths.",
          completion_status: "IN_PROGRESS",
          confidence: getAdjustedConfidence("architect", 98),
          thumbs_up: specItem ? specItem.thumbs_up : 19,
          thumbs_down: specItem ? specItem.thumbs_down : 1
        };
      } else if (stage === "Searching Organizational Memory") {
        const specItem = specialistsFleet.find(s => s.name === "archivist");
        activeSpecialist = {
          specialist_name: "Archivist",
          role: "Organizational Memory Retrieval",
          current_activity: "Searching semantic vector database for correlated historical drift incidents.",
          completion_status: "IN_PROGRESS",
          confidence: getAdjustedConfidence("archivist", 94),
          thumbs_up: specItem ? specItem.thumbs_up : 11,
          thumbs_down: specItem ? specItem.thumbs_down : 1
        };
      } else if (stage === "Coordinating Specialists") {
        const specItem = specialistsFleet.find(s => s.name === "sentinel");
        activeSpecialist = {
          specialist_name: "Sentinel",
          role: "Multi-Agent Threat Assessment",
          current_activity: "Checking boundary vulnerabilities and compiling down-stream pipeline risks.",
          completion_status: "IN_PROGRESS",
          confidence: getAdjustedConfidence("sentinel", 100),
          thumbs_up: specItem ? specItem.thumbs_up : 24,
          thumbs_down: specItem ? specItem.thumbs_down : 2
        };
      } else if (stage === "Generating Recommendation") {
        const specItem = specialistsFleet.find(s => s.name === "forge");
        activeSpecialist = {
          specialist_name: "Forge",
          role: "Mitigation Script Synthesis",
          current_activity: "Synthesizing precise DDL/DML alter scripts and rollback test scripts.",
          completion_status: "IN_PROGRESS",
          confidence: getAdjustedConfidence("forge", 92),
          thumbs_up: specItem ? specItem.thumbs_up : 21,
          thumbs_down: specItem ? specItem.thumbs_down : 3
        };
      } else {
        const specItem = specialistsFleet.find(s => s.name === "atlas");
        activeSpecialist = {
          specialist_name: "Supervisor",
          role: "Operational Ingestion Daemon",
          current_activity: "Ingesting incoming telemetry stream and initializing triage context.",
          completion_status: "IN_PROGRESS",
          confidence: getAdjustedConfidence("atlas", 100),
          thumbs_up: specItem ? specItem.thumbs_up : 18,
          thumbs_down: specItem ? specItem.thumbs_down : 1
        };
      }
    }

    let latest_messages = [
      { timestamp: "09:14:12", message: "Investigation initiated." },
      { timestamp: "09:14:13", message: "Retrieving DataHub organizational context." },
      { timestamp: "09:14:15", message: "Catalog synchronized with physical pg_catalog scans." },
      { timestamp: "09:14:18", message: "Searching Organizational Memory for drift patterns." },
      { timestamp: "09:14:20", message: "2 historical incidents matching schema deviations found." },
      { timestamp: "09:14:22", message: "Atlas Supervisor coordination complete. Architect assigned." },
      { timestamp: "09:14:24", message: "Sentinel threat analyzer assigned." },
      { timestamp: "09:14:27", message: "Risk and downstream compliance evaluation in progress." },
      { timestamp: "09:14:31", message: "Transactional schema mitigation recommendation generated." }
    ];

    if (activeInvestigationId === "compromised-dev-keys-leak") {
      latest_messages = [
        { timestamp: "14:02:10", message: "Security threat investigation dispatched." },
        { timestamp: "14:02:11", message: "Retrieving credential metadata models." },
        { timestamp: "14:02:13", message: "Scanning sandbox active container workspace logs." },
        { timestamp: "14:02:15", message: "Archivist matched suspicious credentials in commit registry." },
        { timestamp: "14:02:18", message: "Security policy incident playbook isolated. SRE chapter 9 engaged." },
        { timestamp: "14:02:22", message: "Sentinel containment scripts evaluated." },
        { timestamp: "14:02:25", message: "Risk escalation identified: critical database write capability threat." },
        { timestamp: "14:02:29", message: "Mitigation prepared: rotate sandbox credentials and restrict network subnets." }
      ];
    }

    let maxLogs = 1;
    if (stage === "Reading Organizational Context") maxLogs = 3;
    else if (stage === "Searching Organizational Memory") maxLogs = 5;
    else if (stage === "Coordinating Specialists") maxLogs = 7;
    else if (stage === "Generating Recommendation" || stage === "Completed") maxLogs = 9;
    
    const filtered_messages = latest_messages.slice(0, maxLogs);

    let status = "Healthy";
    if (stage === "Generating Recommendation" || stage === "Completed") {
      status = "Recommendation Ready";
    } else {
      status = "Investigating";
    }

    const now = new Date();
    const hour = now.getHours();
    let greeting = "System monitoring active. Orixa security daemon is fully synced.";
    if (hour >= 5 && hour < 12) {
      greeting = "Good morning. Atlas has completed the latest enterprise health assessment. All system paths stable.";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon. Enterprise monitoring is active. Dynamic multi-agent audits are running.";
    } else if (hour >= 17 && hour < 22) {
      greeting = "Good evening. Orixa live synchronization daemon is tracking active cloud nodes.";
    }

    return {
      status,
      greeting,
      current_investigation_id: activeInvestigationId,
      current_investigation: activeInvestigationId === "compromised-dev-keys-leak" ? "Compromised Dev Keys Leak: staging token" : "Silent Schema Drift: users_sandbox deviation",
      current_specialist: activeSpecialist,
      progress: {
        stage_name: stage,
        progress_percentage: progressPct,
        elapsed_seconds: 24,
        estimated_remaining_seconds: estRemaining
      },
      latest_messages: filtered_messages,
      decision_status: currentApprovalStatus,
      recent_activities: [
        {
          id: "act-01",
          timestamp: "2026-07-15T10:30:00Z",
          stage: "Reading Organizational Context",
          activity: "DataHub Lineage Inspection",
          detail: "Mapped downstream analytics dependencies. Identified 1 dependent looker dashboard on sandbox schemas."
        },
        {
          id: "act-02",
          timestamp: "2026-07-15T10:32:00Z",
          stage: "Searching Organizational Memory",
          activity: "Memory Pattern Retrieval",
          detail: "Retrieved incident #MEM-8FA4 for historic column mismatches on billing tables. Match strength: 89%."
        },
        {
          id: "act-03",
          timestamp: "2026-07-15T10:35:00Z",
          stage: "Coordinating Specialists",
          activity: "Specialist Consensus Reached",
          detail: "Sentinel threat engine and Atlas schema alignments validated unanimous risk containment plan."
        }
      ]
    };
  }

  function broadcastState() {
    const state = getLiveState();
    const payload = JSON.stringify({ type: "state_update", state });
    for (const client of sseClients) {
      client.write(`data: ${payload}\n\n`);
    }
  }

  // SSE Stream Endpoint
  app.get("/api/v1/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    sseClients.add(res);

    // Initial broadcast to client on connect
    res.write(`data: ${JSON.stringify({ type: "state_update", state: getLiveState() })}\n\n`);

    req.on("close", () => {
      sseClients.delete(res);
    });
  });

  // State Machine Auto-Progression
  setInterval(() => {
    if (forceStage !== null) return;

    const currentApprovalStatus = approvalStates[activeInvestigationId] || "PENDING";
    if (currentStageIndex < STAGES.length - 1) {
      currentStageIndex++;
      broadcastState();
    } else {
      // Loop or rotate case once approved/rejected
      if (currentApprovalStatus === "APPROVED" || currentApprovalStatus === "REJECTED") {
        activeInvestigationId = activeInvestigationId === "silent-schema-disaster" ? "compromised-dev-keys-leak" : "silent-schema-disaster";
        approvalStates[activeInvestigationId] = "PENDING";
        currentStageIndex = 0;
        broadcastState();
      }
    }
  }, 10000); // 10 seconds per stage transition

  // Periodic heartbeat / state sync broadcast
  setInterval(() => {
    broadcastState();
  }, 4000);

  app.get("/api/v1/explanations/:investigation_id", (req, res) => {
    const { investigation_id } = req.params;
    const responseData = buildExplanationResponse(investigation_id);
    responseData.human_approval_status = approvalStates[investigation_id] || "PENDING";
    res.json(responseData);
  });

  app.post("/api/v1/explanations/:investigation_id/approve", (req, res) => {
    const { investigation_id } = req.params;
    const { action } = req.body; // APPROVED or REJECTED
    approvalStates[investigation_id] = action || "APPROVED";

    if (activeInvestigationId === investigation_id) {
      currentStageIndex = STAGES.indexOf("Completed");
    }

    broadcastState();
    res.json({ success: true, status: approvalStates[investigation_id] });
  });

  app.get("/api/v1/evidence/:investigation_id", (req, res) => {
    const { investigation_id } = req.params;
    res.json(buildExplanationResponse(investigation_id).evidence_timeline);
  });

  app.get("/api/v1/confidence/:investigation_id", (req, res) => {
    const { investigation_id } = req.params;
    res.json(buildExplanationResponse(investigation_id).confidence);
  });

  app.get("/api/v1/atlas_console/state", (req, res) => {
    // If request contains query parameters, use them (legacy/manual control)
    // otherwise return the dynamic server-side liveState
    const reqInvestigationId = req.query.investigation_id as string;
    const reqStage = req.query.stage as string;

    if (reqStage) {
      // Manual control
      forceStage = reqStage;
      if (reqInvestigationId) {
        activeInvestigationId = reqInvestigationId;
      }
      broadcastState();
      res.json(getLiveState());
    } else {
      // Dynamic liveState sync
      forceStage = null;
      res.json(getLiveState());
    }
  });

  // ============================================================================
  // Vite Middleware & SPA Fallback
  // ============================================================================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ORIXA GATEWAY] Server boot complete. Listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical error while starting the Orixa gateway server:", err);
});
