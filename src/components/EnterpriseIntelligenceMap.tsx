import React, { useState, useRef, useEffect } from "react";
import {
  Activity,
  Cpu,
  Database,
  Layers,
  Brain,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  Info,
  Play,
  Pause,
  MessageSquare,
  Shield,
  ShieldCheck,
  GitBranch,
  FileCode,
  TrendingUp,
  Archive,
  Share2,
  CheckCircle,
  ArrowUpRight,
  User,
  AlertTriangle,
  RotateCcw,
  SkipForward,
  FastForward,
  Server,
  Lock,
  Compass,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ============================================================================
// Internal Data Models & Types
// ============================================================================

export interface NodeItem {
  id: string;
  label: string;
  type: "request" | "orchestrator" | "metadata" | "memory" | "specialist" | "cognitive" | "output";
  x: number;
  y: number;
  description: string;
  iconName: string;
  glowId: string;
}

export interface ConnectionItem {
  id: string;
  from: string;
  to: string;
  path: string;
  label: string;
}

// Map Sync Modes
export type SyncMode = "ATLAS_LIVE" | "DEMO_PLAYBACK" | "CHRONOLOGICAL_REPLAY" | "DECISION_CENTER";

// Pre-baked scenarios for Demo Playback
export interface MapScenarioStep {
  stepIndex: number;
  title: string;
  description: string;
  activeNodes: string[];
  activeConnections: string[];
  nodeTelemetryOverrides: Record<string, {
    status: string;
    task: string;
    activity: string;
    confidence?: string;
  }>;
}

export interface MapScenario {
  id: string;
  title: string;
  category: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  steps: MapScenarioStep[];
  datahubInfo: {
    urn: string;
    name: string;
    platform: string;
    owners: string[];
    fields: { path: string; type: string; desc: string }[];
    lineageUpstream: string[];
    lineageDownstream: string[];
  };
  memoryInfo: {
    incidentsMatched: string[];
    lessonsLearned: string[];
    vectorDatabaseSize: string;
  };
}

// 5 High-Fidelity Scenarios mapped to the 13 nodes of the Topology Map
const MAP_PLAYBACK_SCENARIOS: MapScenario[] = [
  {
    id: "silent-schema-disaster",
    title: "Silent Schema Disaster",
    category: "Schema Drift",
    riskLevel: "HIGH",
    datahubInfo: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.core.users,PROD)",
      name: "core.users",
      platform: "postgres",
      owners: ["secops@acme-aerospace.com", "dba-oncall@acme-aerospace.com"],
      fields: [
        { path: "id", type: "UUID", desc: "Unique account key" },
        { path: "email", type: "VARCHAR", desc: "User contact address" },
        { path: "password_hash", type: "VARCHAR", desc: "Credential validation hash" },
        { path: "phone_encrypted", type: "VARCHAR", desc: "Encrypted telephone identifier" }
      ],
      lineageUpstream: ["core_postgres_users_backup"],
      lineageDownstream: ["analytics.user_demographics (Snowflake)", "Executive Metrics (Tableau)"]
    },
    memoryInfo: {
      incidentsMatched: ["Incident #482: Staging database type mismatch", "Incident #221: Orders schema column dropped"],
      lessonsLearned: ["Lock schema catalog during daily analytic ingests", "Alias legacy names for retro-compatibility"],
      vectorDatabaseSize: "24,510 vectors indexed"
    },
    steps: [
      {
        stepIndex: 0,
        title: "Inbound User Intent Captured",
        description: "An automated DataHub structural catalog mismatch is flagged on core.users.",
        activeNodes: ["request", "atlas"],
        activeConnections: ["request-to-atlas"],
        nodeTelemetryOverrides: {
          request: { status: "TRIGGERED", task: "Ingesting intent", activity: "Schema drift warning ingested for core.users" },
          atlas: { status: "ORCHESTRATING", task: "Checking thread boundaries", activity: "Allocated isolation boundary thread ORX-824A" }
        }
      },
      {
        stepIndex: 1,
        title: "Querying DataHub Metadata",
        description: "Atlas query nodes pull catalog specifications to trace lineage and verify database configurations.",
        activeNodes: ["datahub", "atlas"],
        activeConnections: ["datahub-to-atlas"],
        nodeTelemetryOverrides: {
          datahub: { status: "SYNCHRONIZING", task: "Retrieving dataset specs", activity: "Loaded lineage model for core.users (14 downstreams)" },
          atlas: { status: "ORCHESTRATING", task: "Fetching schema specifications", activity: "Compared active staging schemas with catalog blueprints" }
        }
      },
      {
        stepIndex: 2,
        title: "Organizational Memory Recall",
        description: "Atlas queries vector database repositories, retrieving 2 historical mismatch resolution playbooks.",
        activeNodes: ["memory", "atlas", "archivist"],
        activeConnections: ["memory-to-atlas", "atlas-to-archivist"],
        nodeTelemetryOverrides: {
          memory: { status: "INDEXED", task: "Vector search", activity: "Retrieved similar Incident #482 with 94.2% match rate" },
          archivist: { status: "ACTIVE", task: "Grounding incident memory", activity: "Ingested historical lessons-learned for DDL views alignment" }
        }
      },
      {
        stepIndex: 3,
        title: "Specialist Dispatch: Drift Verification",
        description: "Atlas schedules Architect and Oracle specialists to forecast connection degradation and map downstreams.",
        activeNodes: ["atlas", "architect", "oracle"],
        activeConnections: ["atlas-to-architect", "atlas-to-oracle"],
        nodeTelemetryOverrides: {
          architect: { status: "EXECUTING", task: "Downstream trace", activity: "Flagged column 'phone_raw' missing on 14 downstream sets", confidence: "98.5%" },
          oracle: { status: "COMPUTING", task: "Pool starvation forecast", activity: "Predicted 94.2% probability of Tableau ETL failure in 48h", confidence: "94.0%" }
        }
      },
      {
        stepIndex: 4,
        title: "Specialist Dispatch: DDL Synthesis",
        description: "Forge specialist is activated to write backward-compatible Postgres view layer patches.",
        activeNodes: ["atlas", "forge"],
        activeConnections: ["atlas-to-forge"],
        nodeTelemetryOverrides: {
          forge: { status: "SYNTHESIZING", task: "Writing alignment script", activity: "Generated transaction views aliasing phone_encrypted as phone_raw", confidence: "95.0%" }
        }
      },
      {
        stepIndex: 5,
        title: "Gemini Synthesis Engine",
        description: "Gemini cognitive layer consolidates all agent reports, tracing roots to create a structured recommendation.",
        activeNodes: ["architect", "oracle", "forge", "gemini"],
        activeConnections: ["architect-to-gemini", "oracle-to-gemini", "forge-to-gemini"],
        nodeTelemetryOverrides: {
          gemini: { status: "REASONING", task: "Consolidating findings", activity: "Drafted Executive Briefing and verified zero CCPA scope leaks", confidence: "98.0%" }
        }
      },
      {
        stepIndex: 6,
        title: "Resolution Recommendation Compiled",
        description: "Orixa compiles DDL scripts, rollback commands, and Slack notifications, registering the package in Decision Center.",
        activeNodes: ["gemini", "recommendation"],
        activeConnections: ["gemini-to-recommendation"],
        nodeTelemetryOverrides: {
          recommendation: { status: "COMPILED", task: "Ready for Operator review", activity: "Rendered compat views SQL script and Slack webhooks" }
        }
      }
    ]
  },
  {
    id: "stale-ml-feature",
    title: "Stale ML Feature",
    category: "Machine Learning",
    riskLevel: "HIGH",
    datahubInfo: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:snowflake,acme_aerospace.analytics.ml_features_prod,PROD)",
      name: "analytics.ml_features_prod",
      platform: "snowflake",
      owners: ["mlops@acme-aerospace.com", "safety@acme-aerospace.com"],
      fields: [
        { path: "sensor_id", type: "VARCHAR", desc: "Weather station sensor key" },
        { path: "wind_speed_knots", type: "FLOAT", desc: "Average wind speeds" },
        { path: "shear_index", type: "FLOAT", desc: "Calculated shear risk vector" },
        { path: "last_sync_timestamp", type: "TIMESTAMP", desc: "Last update validation flag" }
      ],
      lineageUpstream: ["core.weather_telemetry (Postgres)"],
      lineageDownstream: ["flight_risk_xgb (Spark predictor model)"]
    },
    memoryInfo: {
      incidentsMatched: ["Incident #092: ML Feature Store starvation", "Incident #510: Kubernetes cluster OOM limit"],
      lessonsLearned: ["Verify Airflow execution status", "Expand GKE worker memory limits to 16Gi"],
      vectorDatabaseSize: "24,510 vectors indexed"
    },
    steps: [
      {
        stepIndex: 0,
        title: "Inbound Weather Disruption Triggered",
        description: "Drones flight course-corrections fail. Atlas on-call receives telemetry exception warnings.",
        activeNodes: ["request", "atlas"],
        activeConnections: ["request-to-atlas"],
        nodeTelemetryOverrides: {
          request: { status: "TRIGGERED", task: "Ingesting intent", activity: "Drone coarse-correction anomalies logged" },
          atlas: { status: "ORCHESTRATING", task: "Allocating task space", activity: "Assigned thread ORX-9904 (ML feature tracking)" }
        }
      },
      {
        stepIndex: 1,
        title: "Asset Catalog Scan",
        description: "Atlas checks the active Snowflake ML feature table status, verifying last sync timestamps.",
        activeNodes: ["datahub", "atlas"],
        activeConnections: ["datahub-to-atlas"],
        nodeTelemetryOverrides: {
          datahub: { status: "SYNCHRONIZED", task: "Tracing Snowflake links", activity: "Identified dependency on analytics.ml_features_prod" },
          atlas: { status: "ORCHESTRATING", task: "Verifying timestamps", activity: "Detected feature store sync age is 72 hours (stale)" }
        }
      },
      {
        stepIndex: 2,
        title: "Checking SRE Logs & Memory",
        description: "Archivist checks previous OOM history and queries Sentinel to scrub GKE cluster logging streams.",
        activeNodes: ["memory", "atlas", "sentinel", "archivist"],
        activeConnections: ["memory-to-atlas", "atlas-to-sentinel", "atlas-to-archivist"],
        nodeTelemetryOverrides: {
          memory: { status: "INDEXED", task: "Recall checks", activity: "Matched Incident #092: stale features on GKE RAM boundaries" },
          sentinel: { status: "SCANNING", task: "Scrubbing container events", activity: "Located 'OOMKilled' exit code 137 on GKE sync worker" },
          archivist: { status: "ACTIVE", task: "Compiling memories", activity: "Grounded recommendation to raise RAM allocation configs" }
        }
      },
      {
        stepIndex: 3,
        title: "Infrastructure Topology Check",
        description: "Architect specialist traces active Airflow DAG schedulers and maps microservice networks.",
        activeNodes: ["atlas", "architect"],
        activeConnections: ["atlas-to-architect"],
        nodeTelemetryOverrides: {
          architect: { status: "EXECUTING", task: "Mapping dependency links", activity: "Traced route blockage to GKE node starvation", confidence: "98.0%" }
        }
      },
      {
        stepIndex: 4,
        title: "Generating Cognitive Inference",
        description: "Gemini cognitive layer links stale sensor inputs, OOM errors, and GKE configs to draft mitigation playbooks.",
        activeNodes: ["sentinel", "architect", "gemini"],
        activeConnections: ["sentinel-to-gemini", "architect-to-gemini"],
        nodeTelemetryOverrides: {
          gemini: { status: "REASONING", task: "Correlating anomalies", activity: "Synthesizing Kubernetes memory increase templates and airflow runs", confidence: "94.5%" }
        }
      },
      {
        stepIndex: 5,
        title: "Remediation Playbook Compiled",
        description: "The mitigation package is finalized with K8s deployment files and Airflow trigger scripts.",
        activeNodes: ["gemini", "recommendation"],
        activeConnections: ["gemini-to-recommendation"],
        nodeTelemetryOverrides: {
          recommendation: { status: "COMPILED", task: "Awaiting approval", activity: "K8s manifest patch to 16Gi RAM compiled" }
        }
      }
    ]
  },
  {
    id: "pii-governance-violation",
    title: "PII Governance Violation",
    category: "Security & PII",
    riskLevel: "CRITICAL",
    datahubInfo: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.sandbox.project_alpha,SANDBOX)",
      name: "sandbox.project_alpha",
      platform: "postgres",
      owners: ["secops@acme-aerospace.com"],
      fields: [
        { path: "session_id", type: "UUID", desc: "Dev session tracker" },
        { path: "email_raw", type: "VARCHAR", desc: "PII: Unencrypted email strings" },
        { path: "tax_id_unencrypted", type: "VARCHAR", desc: "CRITICAL: Plain text Social Security Numbers" }
      ],
      lineageUpstream: ["core.users (Production backup)"],
      lineageDownstream: []
    },
    memoryInfo: {
      incidentsMatched: ["Incident #882: Unsalted credentials leak", "Incident #014: CCPA compliance breach"],
      lessonsLearned: ["Truncate sandbox raw copies", "Enforce network boundary whitelists immediately"],
      vectorDatabaseSize: "24,510 vectors indexed"
    },
    steps: [
      {
        stepIndex: 0,
        title: "Unencrypted PII Detected",
        description: "Guardian continuous scans spot raw Tax IDs (pattern matches US SSN) in a public staging cluster.",
        activeNodes: ["request", "atlas"],
        activeConnections: ["request-to-atlas"],
        nodeTelemetryOverrides: {
          request: { status: "ALERT", task: "Scanned PII leak", activity: "Plaintext Tax ID pattern ^\\d{3}-\\d{2}-\\d{4}$ located" },
          atlas: { status: "ORCHESTRATING", task: "Dispatching emergency response", activity: "Locked workspace thread bounds for isolation" }
        }
      },
      {
        stepIndex: 1,
        title: "Compliance Governance Mapping",
        description: "Guardian registers a CCPA compliance exception on the DataHub sandbox catalogue.",
        activeNodes: ["datahub", "atlas", "guardian"],
        activeConnections: ["datahub-to-atlas", "atlas-to-guardian"],
        nodeTelemetryOverrides: {
          datahub: { status: "EXCEPTION", task: "Registering compliance tags", activity: "Appended PII_VULNERABLE flag to sandbox.project_alpha" },
          guardian: { status: "EXECUTING", task: "Scrutinizing table cells", activity: "Sampled 420 plaintext customer social security rows", confidence: "99.0%" }
        }
      },
      {
        stepIndex: 2,
        title: "Emergency Workspace Lockdown",
        description: "Sentinel is dispatched to isolate the vulnerable sandbox cluster, dropping active open ports.",
        activeNodes: ["atlas", "sentinel"],
        activeConnections: ["atlas-to-sentinel"],
        nodeTelemetryOverrides: {
          sentinel: { status: "LOCKDOWN", task: "Isolating containers", activity: "Blocked external traffic on port 3000 to cluster staging-02", confidence: "100.0%" }
        }
      },
      {
        stepIndex: 3,
        title: "Slack Coordination & War-room",
        description: "Ambassador specialist posts P1 alert reports to Slack and triggers developer ticket workflows.",
        activeNodes: ["atlas", "ambassador"],
        activeConnections: ["atlas-to-ambassador"],
        nodeTelemetryOverrides: {
          ambassador: { status: "DISPATCHING", task: "Broadcasting warning", activity: "Posted alert warning to Slack #security-war-room" }
        }
      },
      {
        stepIndex: 4,
        title: "Gemini Incident Synthesis",
        description: "Gemini analyzes container access profiles and designs immediate database purge scripts.",
        activeNodes: ["guardian", "sentinel", "gemini"],
        activeConnections: ["guardian-to-gemini", "sentinel-to-gemini"],
        nodeTelemetryOverrides: {
          gemini: { status: "REASONING", task: "Compiling containment log", activity: "Formulated DDL script to truncate sandbox table", confidence: "99.0%" }
        }
      },
      {
        stepIndex: 5,
        title: "Lockdown Resolution Compiled",
        description: "Orixa prepares the SQL truncate scripts and VPC firewall patches to secure staging boundaries.",
        activeNodes: ["gemini", "recommendation"],
        activeConnections: ["gemini-to-recommendation"],
        nodeTelemetryOverrides: {
          recommendation: { status: "COMPILED", task: "Safe purge package active", activity: "DDL schema purge and port denies assembled" }
        }
      }
    ]
  },
  {
    id: "broken-data-pipeline",
    title: "Broken Data Pipeline",
    category: "Infrastructure Failures",
    riskLevel: "MEDIUM",
    datahubInfo: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:gcp,acme_aerospace.networks.vpc_subnets,PROD)",
      name: "networks.vpc_subnets",
      platform: "spark",
      owners: ["networks@acme-aerospace.com"],
      fields: [
        { path: "subnet_id", type: "VARCHAR", desc: "GCP Subnet configuration key" },
        { path: "cidr_block", type: "VARCHAR", desc: "Allocated network address bounds" },
        { path: "whitelisted_ips", type: "VARCHAR", desc: "Permitted ingress firewall ranges" }
      ],
      lineageUpstream: [],
      lineageDownstream: ["dbt_reporting_loaders", "finance_reporting_load (ETL)"]
    },
    memoryInfo: {
      incidentsMatched: ["Incident #012: NAT Ingress block", "Incident #550: Snowflake routing timeout"],
      lessonsLearned: ["Whitelist NAT cluster gateway subnets", "Configure automated connectivity alerts"],
      vectorDatabaseSize: "24,510 vectors indexed"
    },
    steps: [
      {
        stepIndex: 0,
        title: "Ingress Failure Ingested",
        description: "A subnet rollout drops connection ranges of analytical loaders. Daily financial ledger ingest halts.",
        activeNodes: ["request", "atlas"],
        activeConnections: ["request-to-atlas"],
        nodeTelemetryOverrides: {
          request: { status: "TRIGGERED", task: "Awaiting ping", activity: "Inbounds ledger load timeout: tcp_connection_handshake_timeout" },
          atlas: { status: "ORCHESTRATING", task: "Booting trace threads", activity: "Assigned VPC-trace thread space" }
        }
      },
      {
        stepIndex: 1,
        title: "Tracing Active Subnets",
        description: "Atlas checks DataHub vpc network schemas to locate the Whitelist properties.",
        activeNodes: ["datahub", "atlas"],
        activeConnections: ["datahub-to-atlas"],
        nodeTelemetryOverrides: {
          datahub: { status: "SYNCHRONIZED", task: "Loading net metadata", activity: "Fetched networks.vpc_subnets specs" }
        }
      },
      {
        stepIndex: 2,
        title: "Scrubbing Network Connections",
        description: "Sentinel is dispatched to inspect socket logs, revealing 10 connection retries rejected by denial rules.",
        activeNodes: ["atlas", "sentinel"],
        activeConnections: ["atlas-to-sentinel"],
        nodeTelemetryOverrides: {
          sentinel: { status: "ACTIVE", task: "Scrutinizing sockets", activity: "Confirmed route blocked by denial rule: deny-unvetted-staging-egress" }
        }
      },
      {
        stepIndex: 3,
        title: "Mapping VPC Topology",
        description: "Architect specialist maps the route from the dbt executor to the Snowflake cloud cluster.",
        activeNodes: ["atlas", "architect"],
        activeConnections: ["atlas-to-architect"],
        nodeTelemetryOverrides: {
          architect: { status: "EXECUTING", task: "Tracing VPC routers", activity: "Confirmed egress drop from NAT subnet 10.140.0.0/20", confidence: "98.0%" }
        }
      },
      {
        stepIndex: 4,
        title: "Assembling Connection Fix",
        description: "Gemini reasons about VPC firewalls and drafts Terraform rules to restore warehouse access.",
        activeNodes: ["sentinel", "architect", "gemini"],
        activeConnections: ["sentinel-to-gemini", "architect-to-gemini"],
        nodeTelemetryOverrides: {
          gemini: { status: "REASONING", task: "Formulating network patch", activity: "Designed terraform rule for loader NAT egress whitelist", confidence: "95.0%" }
        }
      },
      {
        stepIndex: 5,
        title: "Infrastructure Recommendation Compiled",
        description: "Playbooks containing Terraform ingress additions and router reloads are saved for execution.",
        activeNodes: ["gemini", "recommendation"],
        activeConnections: ["gemini-to-recommendation"],
        nodeTelemetryOverrides: {
          recommendation: { status: "COMPILED", task: "Awaiting execution", activity: "Terraform network route allow-rule written" }
        }
      }
    ]
  },
  {
    id: "missing-dataset-owner",
    title: "Missing Dataset Owner",
    category: "Data Governance",
    riskLevel: "MEDIUM",
    datahubInfo: {
      urn: "urn:li:dataset:(urn:li:dataPlatform:postgres,acme_aerospace.finance.ledger,PROD)",
      name: "finance.ledger",
      platform: "postgres",
      owners: [], // EMPTY - causing orphan state
      fields: [
        { path: "transaction_id", type: "UUID", desc: "Unique ledger entry" },
        { path: "amount_cents", type: "INTEGER", desc: "Transactional volume" },
        { path: "reconciled", type: "BOOLEAN", desc: "SOX audit verification" }
      ],
      lineageUpstream: ["raw_transactions"],
      lineageDownstream: ["corporate_SOX_audit_ledger"]
    },
    memoryInfo: {
      incidentsMatched: ["Incident #104: Orphaned tables", "Incident #311: SOX compliance drift"],
      lessonsLearned: ["Scan dataset catalogs for empty owners", "Assign default data steward groups"],
      vectorDatabaseSize: "24,510 vectors indexed"
    },
    steps: [
      {
        stepIndex: 0,
        title: "Orphaned Table Exception",
        description: "A quality scan fails. Daily finance ledger update stalled because no metadata owner exists to sign off.",
        activeNodes: ["request", "atlas"],
        activeConnections: ["request-to-atlas"],
        nodeTelemetryOverrides: {
          request: { status: "ALERT", task: "Orphaned catalog", activity: "Finance ledger has no active owners mapped" },
          atlas: { status: "ORCHESTRATING", task: "Parsing owners", activity: "Assigned thread ORX-104B for steward alignment" }
        }
      },
      {
        stepIndex: 1,
        title: "Metadata Inbound Check",
        description: "Atlas checks the DataHub schema catalog, confirming the owners list is entirely empty.",
        activeNodes: ["datahub", "atlas"],
        activeConnections: ["datahub-to-atlas"],
        nodeTelemetryOverrides: {
          datahub: { status: "ORPHAN", task: "Auditing catalog tags", activity: "Owners attribute validated as EMPTY on finance.ledger" }
        }
      },
      {
        stepIndex: 2,
        title: "Organizational Memory Semantic Scan",
        description: "Archivist runs semantic matching to locate default finance stewards and historic owners.",
        activeNodes: ["memory", "archivist", "atlas"],
        activeConnections: ["memory-to-atlas", "atlas-to-archivist"],
        nodeTelemetryOverrides: {
          memory: { status: "INDEXED", task: "Recall checks", activity: "Matched Incident #104: finance group default stewards" },
          archivist: { status: "ACTIVE", task: "Scanning git commits", activity: "Traced table creator as @crm-data-leads", confidence: "92.0%" }
        }
      },
      {
        stepIndex: 3,
        title: "Guardian Compliance Assessment",
        description: "Guardian verifies the regulatory implications of an orphaned finance table under SOX rules.",
        activeNodes: ["atlas", "guardian"],
        activeConnections: ["atlas-to-guardian"],
        nodeTelemetryOverrides: {
          guardian: { status: "ACTIVE", task: "SOX auditing", activity: "Flagged SOX Audit violation on orphaned corporate ledgers", confidence: "95.0%" }
        }
      },
      {
        stepIndex: 4,
        title: "Assigning Steward Role",
        description: "Gemini reconciles the findings and creates direct owners mapping commands.",
        activeNodes: ["archivist", "guardian", "gemini"],
        activeConnections: ["archivist-to-gemini", "guardian-to-gemini"],
        nodeTelemetryOverrides: {
          gemini: { status: "REASONING", task: "Generating steward maps", activity: "Drafted curl metadata payload to register @finance-bi as owners", confidence: "96.0%" }
        }
      },
      {
        stepIndex: 5,
        title: "Steward Register compiled",
        description: "The catalog patch is assembled to assign Default Steward Teams and unlock the analytical ingest.",
        activeNodes: ["gemini", "recommendation"],
        activeConnections: ["gemini-to-recommendation"],
        nodeTelemetryOverrides: {
          recommendation: { status: "COMPILED", task: "Awaiting execution", activity: "Owners catalog alignment patch ready" }
        }
      }
    ]
  }
];

// ============================================================================
// Core Nodes & Connections coordinates (820x500 virtual coordinate space)
// ============================================================================

const MAP_NODES: NodeItem[] = [
  { id: "request", label: "User Request", type: "request", x: 60, y: 250, description: "Inbound user intent or system anomaly alarm triggers an isolated Orixa mission execution.", iconName: "MessageSquare", glowId: "glow-zinc" },
  { id: "atlas", label: "Atlas Supervisor", type: "orchestrator", x: 190, y: 250, description: "Central reactive orchestrator. Runs parallel pipelines, schedules specialists, and checks sandbox constraints.", iconName: "Sparkles", glowId: "glow-cyan" },
  { id: "datahub", label: "DataHub Context", type: "metadata", x: 320, y: 130, description: "Enterprise catalog context layer. Stores datasets, schema structures, business glossary mappings, and owners.", iconName: "Database", glowId: "glow-blue" },
  { id: "memory", label: "Organizational Memory", type: "memory", x: 320, y: 370, description: "Vector database storing past resolution logs, structural layout patterns, and dbt DAG dependency histories.", iconName: "Layers", glowId: "glow-emerald" },
  { id: "sentinel", label: "Sentinel Specialist", type: "specialist", x: 480, y: 50, description: "Threat-intelligence and sandbox containment specialist. Performs PII masking audits and scans firewall rules.", iconName: "Shield", glowId: "glow-amber" },
  { id: "guardian", label: "Guardian Specialist", type: "specialist", x: 480, y: 110, description: "Regulatory compliance auditing, sensitive raw attribute classification (PII), and policy alignment.", iconName: "ShieldCheck", glowId: "glow-amber" },
  { id: "architect", label: "Architect Specialist", type: "specialist", x: 480, y: 170, description: "System topology mapping, analytical pipeline routing, and sandbox boundary modeling.", iconName: "GitBranch", glowId: "glow-amber" },
  { id: "forge", label: "Forge Specialist", type: "specialist", x: 480, y: 230, description: "Automated database migration script writing, schema mutation deployments, and safe transactional rollbacks.", iconName: "FileCode", glowId: "glow-amber" },
  { id: "oracle", label: "Oracle Specialist", type: "specialist", x: 480, y: 290, description: "Time-series operational risk modeling, connection pool starvation prediction, and compatibility forecasting.", iconName: "TrendingUp", glowId: "glow-amber" },
  { id: "archivist", label: "Archivist Specialist", type: "specialist", x: 480, y: 350, description: "Organizational memory management, semantic policy ingestion, and grounding attribution tracing.", iconName: "Archive", glowId: "glow-amber" },
  { id: "ambassador", label: "Ambassador Specialist", type: "specialist", x: 480, y: 410, description: "External API integration routing, notification hooks, and secure multi-tenant identity mappings.", iconName: "Share2", glowId: "glow-amber" },
  { id: "gemini", label: "Gemini Intelligence", type: "cognitive", x: 650, y: 250, description: "Enterprise cognitive layer. Translates user intents, builds tactical tasks, and synthesizes multi-agent resolutions.", iconName: "Brain", glowId: "glow-purple" },
  { id: "recommendation", label: "Recommendation", type: "output", x: 760, y: 250, description: "Synthesized resolution plan, mitigation DDL scripts, rollback commands, and Slack notifications compiled.", iconName: "CheckCircle", glowId: "glow-rose" }
];

const MAP_CONNECTIONS: ConnectionItem[] = [
  { id: "request-to-atlas", from: "request", to: "atlas", path: "M 60 250 L 190 250", label: "User Intent Dispatch" },
  { id: "datahub-to-atlas", from: "datahub", to: "atlas", path: "M 320 130 C 270 130, 240 180, 190 250", label: "Context Feed" },
  { id: "memory-to-atlas", from: "memory", to: "atlas", path: "M 320 370 C 270 370, 240 320, 190 250", label: "Recall Retrieval" },
  { id: "atlas-to-sentinel", from: "atlas", to: "sentinel", path: "M 190 250 L 480 50", label: "Security Dispatch" },
  { id: "atlas-to-guardian", from: "atlas", to: "guardian", path: "M 190 250 L 480 110", label: "Compliance Dispatch" },
  { id: "atlas-to-architect", from: "atlas", to: "architect", path: "M 190 250 L 480 170", label: "Topology Trace" },
  { id: "atlas-to-forge", from: "atlas", to: "forge", path: "M 190 250 L 480 230", label: "Schema Execution" },
  { id: "atlas-to-oracle", from: "atlas", to: "oracle", path: "M 190 250 L 480 290", label: "Vulnerability Forecast" },
  { id: "atlas-to-archivist", from: "atlas", to: "archivist", path: "M 190 250 L 480 350", label: "Attribution Audit" },
  { id: "atlas-to-ambassador", from: "atlas", to: "ambassador", path: "M 190 250 L 480 410", label: "SSO Webhook Dispatch" },
  { id: "sentinel-to-gemini", from: "sentinel", to: "gemini", path: "M 480 50 L 650 250", label: "Containment Findings" },
  { id: "guardian-to-gemini", from: "guardian", to: "gemini", path: "M 480 110 L 650 250", label: "Policy Attributions" },
  { id: "architect-to-gemini", from: "architect", to: "gemini", path: "M 480 170 L 650 250", label: "Lineage Graphs" },
  { id: "forge-to-gemini", from: "forge", to: "gemini", path: "M 480 230 L 650 250", label: "DDL Alignments" },
  { id: "oracle-to-gemini", from: "oracle", to: "gemini", path: "M 480 290 L 650 250", label: "Vulnerability Indexes" },
  { id: "archivist-to-gemini", from: "archivist", to: "gemini", path: "M 480 350 L 650 250", label: "Grounding Context" },
  { id: "ambassador-to-gemini", from: "ambassador", to: "gemini", path: "M 480 410 L 650 250", label: "SSO Verification" },
  { id: "gemini-to-recommendation", from: "gemini", to: "recommendation", path: "M 650 250 L 760 250", label: "Compile Resolution" }
];

interface EnterpriseIntelligenceMapProps {
  addLog: (msg: string) => void;
  isAtlasRunning?: boolean;
  activeTimelineStage?: "idle" | "analyzing" | "planning" | "selection" | "executing" | "aggregating" | "completed";
  
  // Replay Integration
  replayActive?: boolean;
  replayCurrentStep?: number;
  replayTimeline?: any;
  miniature?: boolean;
  onOpenFullMap?: () => void;
}

export default function EnterpriseIntelligenceMap({
  addLog,
  isAtlasRunning = false,
  activeTimelineStage = "idle",
  replayActive = false,
  replayCurrentStep = 0,
  replayTimeline = null,
  miniature = false,
  onOpenFullMap
}: EnterpriseIntelligenceMapProps) {
  
  // Camera State
  const [zoom, setZoom] = useState<number>(miniature ? 0.65 : 0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>(
    miniature ? { x: 100, y: 70 } : { x: 30, y: 15 }
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronization Mode
  const [syncMode, setSyncMode] = useState<SyncMode>(
    replayActive ? "CHRONOLOGICAL_REPLAY" : isAtlasRunning ? "ATLAS_LIVE" : "DEMO_PLAYBACK"
  );

  // Demo Playback Controller State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("silent-schema-disaster");
  const [currentScenarioStep, setCurrentScenarioStep] = useState<number>(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x

  // Node Inspector Side Panel State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("atlas");

  // Dynamic simulation fallback heartbeat
  const [fallbackSecond, setFallbackSecond] = useState<number>(0);

  // Sync mode changes with parent variables
  useEffect(() => {
    if (replayActive) {
      setSyncMode("CHRONOLOGICAL_REPLAY");
    } else if (isAtlasRunning) {
      setSyncMode("ATLAS_LIVE");
    }
  }, [replayActive, isAtlasRunning]);

  // Heartbeat for fallback offline simulation when not running anything else
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (syncMode === "DEMO_PLAYBACK" && !isDemoPlaying) {
      timer = setInterval(() => {
        setFallbackSecond(prev => (prev + 1) % 6);
      }, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [syncMode, isDemoPlaying]);

  // Demo Playback Master Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (syncMode === "DEMO_PLAYBACK" && isDemoPlaying) {
      const activeScenario = MAP_PLAYBACK_SCENARIOS.find(s => s.id === selectedScenarioId);
      if (activeScenario) {
        const totalSteps = activeScenario.steps.length;
        const delay = 4000 / playbackSpeed;

        timer = setTimeout(() => {
          setCurrentScenarioStep(prev => {
            const next = prev + 1;
            if (next >= totalSteps) {
              setIsDemoPlaying(false);
              addLog(`Map Demo Playback: Scenario "${activeScenario.title}" finished.`);
              return prev;
            }
            addLog(`Map Demo Playback: Step ${next + 1}/${totalSteps} -> ${activeScenario.steps[next].title}`);
            return next;
          });
        }, delay);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [syncMode, isDemoPlaying, currentScenarioStep, selectedScenarioId, playbackSpeed]);

  // Reset zoom/pan when miniature status changes
  useEffect(() => {
    if (miniature) {
      setZoom(0.65);
      setPan({ x: 100, y: 70 });
    } else {
      setZoom(0.95);
      setPan({ x: 30, y: 15 });
    }
  }, [miniature]);

  // Camera Drag Helpers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (miniature) return;
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || miniature) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.4));
  };

  const handleResetCamera = () => {
    setZoom(0.95);
    setPan({ x: 30, y: 15 });
  };

  // Helper to resolve Lucide Icons dynamically
  const renderNodeIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "MessageSquare": return <MessageSquare className={className} />;
      case "Sparkles": return <Sparkles className={className} />;
      case "Database": return <Database className={className} />;
      case "Layers": return <Layers className={className} />;
      case "Shield": return <Shield className={className} />;
      case "ShieldCheck": return <ShieldCheck className={className} />;
      case "GitBranch": return <GitBranch className={className} />;
      case "FileCode": return <FileCode className={className} />;
      case "TrendingUp": return <TrendingUp className={className} />;
      case "Archive": return <Archive className={className} />;
      case "Share2": return <Share2 className={className} />;
      case "Brain": return <Brain className={className} />;
      case "CheckCircle": return <CheckCircle className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  // ============================================================================
  // Core Reasoning State Compiler (Bridges Map to Replay/Atlas/Demo/Decision)
  // ============================================================================
  const compileActiveTelemetry = () => {
    const activeNodes = new Set<string>();
    const activeConns = new Set<string>();
    
    // Fallback/Default node properties
    const nodeTelemetryMap: Record<string, {
      status: string;
      task: string;
      lastExecution: string;
      confidence: string;
      dependencies: string[];
      recentActivity: string;
    }> = {};

    // Initialize defaults for all 13 nodes
    MAP_NODES.forEach(node => {
      nodeTelemetryMap[node.id] = {
        status: "STANDBY",
        task: "Inactive",
        lastExecution: "03:37:38 UTC",
        confidence: "N/A",
        dependencies: node.id === "request" ? [] : node.id === "atlas" ? ["request"] : ["atlas"],
        recentActivity: "No operational history in this sandboxed thread container"
      };
    });

    // Overwrite based on selected SyncMode
    if (syncMode === "CHRONOLOGICAL_REPLAY" && replayTimeline && replayTimeline.events) {
      // Replay Chronology Synchronization
      const currentEvt = replayTimeline.events[replayCurrentStep];
      if (currentEvt) {
        const type = currentEvt.event_type;
        const specName = currentEvt.responsible_specialist ? currentEvt.responsible_specialist.toLowerCase() : null;

        activeNodes.add("atlas");

        if (type === "ATLAS_ORCHESTRATION") {
          activeNodes.add("request");
          activeConns.add("request-to-atlas");
          nodeTelemetryMap.request = {
            status: "TRIGGERED", task: "Ingesting incident request", lastExecution: "Just now",
            confidence: "100%", dependencies: [], recentActivity: currentEvt.description
          };
          nodeTelemetryMap.atlas = {
            status: "ORCHESTRATING", task: "Spawning execution bounds", lastExecution: "Just now",
            confidence: "100%", dependencies: ["request"], recentActivity: "Created reactive thread space to investigate catalog deviation."
          };
        } else if (type === "DATAHUB_RETRIEVAL") {
          activeNodes.add("datahub");
          activeConns.add("datahub-to-atlas");
          nodeTelemetryMap.datahub = {
            status: "ACTIVE", task: "Syncing metadata assets", lastExecution: "Just now",
            confidence: "100%", dependencies: ["atlas"], recentActivity: currentEvt.description
          };
        } else if (type === "ORGANIZATIONAL_MEMORY") {
          activeNodes.add("memory");
          activeConns.add("memory-to-atlas");
          nodeTelemetryMap.memory = {
            status: "INDEXING", task: "Scrubbing semantic matches", lastExecution: "Just now",
            confidence: `${(replayTimeline.confidence_score * 100).toFixed(0)}%`, dependencies: ["atlas"], recentActivity: currentEvt.description
          };
        } else if (type === "SPECIALIST_ACTIVITY" && specName) {
          activeNodes.add(specName);
          activeConns.add(`atlas-to-${specName}`);
          nodeTelemetryMap[specName] = {
            status: "EXECUTING", task: "Running analytical script", lastExecution: "Just now",
            confidence: `${(replayTimeline.confidence_score * 100).toFixed(0)}%`, dependencies: ["atlas"], recentActivity: currentEvt.description
          };
        } else if (type === "GEMINI_REASONING") {
          activeNodes.add("gemini");
          if (specName) {
            activeNodes.add(specName);
            activeConns.add(`${specName}-to-gemini`);
          } else {
            activeNodes.add("forge");
            activeConns.add("forge-to-gemini");
          }
          nodeTelemetryMap.gemini = {
            status: "REASONING", task: "Synthesizing multi-agent outputs", lastExecution: "Just now",
            confidence: `${(replayTimeline.confidence_score * 100).toFixed(0)}%`, dependencies: specName ? [specName] : ["forge"], recentActivity: currentEvt.description
          };
        } else if (type === "FINAL_RECOMMENDATION" || type === "HUMAN_APPROVAL") {
          activeNodes.add("gemini");
          activeNodes.add("recommendation");
          activeConns.add("gemini-to-recommendation");
          nodeTelemetryMap.recommendation = {
            status: "COMPILED", task: "Review complete", lastExecution: "Just now",
            confidence: "100%", dependencies: ["gemini"], recentActivity: currentEvt.description
          };
        }
      }
    } else if (syncMode === "ATLAS_LIVE" && isAtlasRunning) {
      // Live Atlas supervisor execution synchronization
      activeNodes.add("atlas");
      nodeTelemetryMap.atlas.status = "ACTIVE ORCHESTRATION";
      nodeTelemetryMap.atlas.task = `Running stage: ${activeTimelineStage}`;

      if (activeTimelineStage === "analyzing") {
        activeNodes.add("request");
        activeConns.add("request-to-atlas");
        nodeTelemetryMap.request.status = "INGESTING";
        nodeTelemetryMap.request.task = "Analyzing anomaly log data";
        nodeTelemetryMap.request.recentActivity = "Anomaly signal received from physical Postgres gateway.";
      } else if (activeTimelineStage === "planning") {
        activeNodes.add("datahub");
        activeConns.add("datahub-to-atlas");
        nodeTelemetryMap.datahub.status = "RETRIEVING";
        nodeTelemetryMap.datahub.task = "Reading schema dependencies";
        nodeTelemetryMap.datahub.recentActivity = "Loaded upstream database nodes from DataHub Metadata Service.";
      } else if (activeTimelineStage === "selection") {
        activeNodes.add("memory");
        activeConns.add("memory-to-atlas");
        nodeTelemetryMap.memory.status = "SEARCHING";
        nodeTelemetryMap.memory.task = "Polling cosine vector similarity matrices";
        nodeTelemetryMap.memory.recentActivity = "Isolated 2 historic recipes matching column drift criteria.";
      } else if (activeTimelineStage === "executing") {
        // Enrolled specialists active
        activeNodes.add("sentinel");
        activeNodes.add("forge");
        activeNodes.add("oracle");
        activeConns.add("atlas-to-sentinel");
        activeConns.add("atlas-to-forge");
        activeConns.add("atlas-to-oracle");

        nodeTelemetryMap.sentinel.status = "ACTIVE SCAN";
        nodeTelemetryMap.sentinel.task = "Analyzing VPC router tables";
        nodeTelemetryMap.sentinel.confidence = "98%";

        nodeTelemetryMap.forge.status = "COMPILING DDL";
        nodeTelemetryMap.forge.task = "Drafting SQL view overrides";
        nodeTelemetryMap.forge.confidence = "95%";

        nodeTelemetryMap.oracle.status = "FORECASTING";
        nodeTelemetryMap.oracle.task = "Simulating connection degradation";
        nodeTelemetryMap.oracle.confidence = "94%";
      } else if (activeTimelineStage === "aggregating") {
        activeNodes.add("sentinel");
        activeNodes.add("forge");
        activeNodes.add("oracle");
        activeNodes.add("gemini");
        activeConns.add("sentinel-to-gemini");
        activeConns.add("forge-to-gemini");
        activeConns.add("oracle-to-gemini");

        nodeTelemetryMap.gemini.status = "COGNITIVE CONSOLIDATION";
        nodeTelemetryMap.gemini.task = "Running multi-agent analysis";
        nodeTelemetryMap.gemini.recentActivity = "Evaluating CCPA regulatory parameters against active sandboxes.";
      } else if (activeTimelineStage === "completed") {
        activeNodes.add("gemini");
        activeNodes.add("recommendation");
        activeConns.add("gemini-to-recommendation");
        nodeTelemetryMap.recommendation.status = "ACTIVE_RECOMMENDATION";
        nodeTelemetryMap.recommendation.task = "Mitigation SQL views generated and ready";
      }
    } else if (syncMode === "DECISION_CENTER") {
      // Decision Center Synchronization
      // Focuses on highlights of decision outcomes and specialist alignments
      activeNodes.add("datahub");
      activeNodes.add("memory");
      activeNodes.add("atlas");
      activeNodes.add("gemini");
      activeNodes.add("recommendation");
      activeNodes.add("architect");
      activeNodes.add("guardian");
      activeNodes.add("sentinel");

      activeConns.add("datahub-to-atlas");
      activeConns.add("memory-to-atlas");
      activeConns.add("architect-to-gemini");
      activeConns.add("guardian-to-gemini");
      activeConns.add("sentinel-to-gemini");
      activeConns.add("gemini-to-recommendation");

      nodeTelemetryMap.datahub.status = "VERIFIED CONTEXT";
      nodeTelemetryMap.memory.status = "MATCH FOUND";
      nodeTelemetryMap.recommendation.status = "DECISION_READY";
      nodeTelemetryMap.recommendation.task = "Awaiting physical operator approval";
      nodeTelemetryMap.recommendation.recentActivity = "Mitigation payload successfully synchronized and locked.";
    } else if (syncMode === "DEMO_PLAYBACK") {
      // Interactive Playback engine (Default)
      const scenario = MAP_PLAYBACK_SCENARIOS.find(s => s.id === selectedScenarioId);
      if (scenario) {
        const step = scenario.steps[currentScenarioStep];
        if (step) {
          step.activeNodes.forEach(nid => activeNodes.add(nid));
          step.activeConnections.forEach(cid => activeConns.add(cid));

          // Apply step overrides
          Object.entries(step.nodeTelemetryOverrides).forEach(([nid, override]) => {
            nodeTelemetryMap[nid] = {
              status: override.status,
              task: override.task,
              lastExecution: "Just now",
              confidence: override.confidence || "98.2%",
              dependencies: nid === "request" ? [] : nid === "atlas" ? ["request"] : ["atlas"],
              recentActivity: override.activity
            };
          });
        }
      }
    } else {
      // Offline fallback cyclical flow aesthetics
      const sec = fallbackSecond;
      activeNodes.add("atlas");
      if (sec === 0) {
        activeNodes.add("request");
        activeConns.add("request-to-atlas");
      } else if (sec === 1) {
        activeNodes.add("datahub");
        activeConns.add("datahub-to-atlas");
      } else if (sec === 2) {
        activeNodes.add("memory");
        activeConns.add("memory-to-atlas");
      } else if (sec === 3) {
        activeNodes.add("forge");
        activeNodes.add("oracle");
        activeConns.add("atlas-to-forge");
        activeConns.add("atlas-to-oracle");
      } else if (sec === 4) {
        activeNodes.add("forge");
        activeNodes.add("oracle");
        activeNodes.add("gemini");
        activeConns.add("forge-to-gemini");
        activeConns.add("oracle-to-gemini");
      } else if (sec === 5) {
        activeNodes.add("gemini");
        activeNodes.add("recommendation");
        activeConns.add("gemini-to-recommendation");
      }
    }

    return { activeNodes, activeConns, nodeTelemetryMap };
  };

  const { activeNodes, activeConns, nodeTelemetryMap } = compileActiveTelemetry();
  const selectedNode = MAP_NODES.find(n => n.id === selectedNodeId);
  const activeScenario = MAP_PLAYBACK_SCENARIOS.find(s => s.id === selectedScenarioId);

  // Quick Trigger Action for node inspection checks
  const handleQuickTriggerDiagnostic = (nodeName: string) => {
    addLog(`Diagnostic Engine: Triggered localized diagnostic sweep on Node [${nodeName}]`);
    addLog(`Diagnostic Engine: [${nodeName}] returned OK. Thread allocation: healthy, Latency: 3.5ms, CPU load: 1.2%`);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="orixa-intelligence-map-panel">
      
      {/* 1. Header & Configuration Panel (Hidden in miniature mode) */}
      {!miniature && (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
              <h2 className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                Orixa Reasoning process Map
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                Enterprise Core v2.4
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Observe how enterprise context, organizational memory, and specialized threat dispatches flow through Orixa during active investigations.
            </p>
          </div>

          {/* Sync Mode Selector Switch */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-bold mr-1">
              Context Synchronization Source:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-850">
              {[
                { id: "DEMO_PLAYBACK", label: "Demo Mode" },
                { id: "ATLAS_LIVE", label: "Atlas Live" },
                { id: "DECISION_CENTER", label: "Decision Center" },
                { id: "CHRONOLOGICAL_REPLAY", label: "Replay Sync" }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSyncMode(mode.id as SyncMode);
                    addLog(`Intelligence Map: Switched synchronization source to [${mode.label}]`);
                  }}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all cursor-pointer border ${
                    syncMode === mode.id
                      ? "bg-cyan-950 text-cyan-400 border-cyan-800/60 font-bold shadow-md shadow-cyan-500/5"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Map Playground and Node Side Panel */}
      <div className={miniature ? "w-full" : "grid grid-cols-1 lg:grid-cols-12 gap-6"}>
        
        {/* Map Canvas viewport (Col span 8 on desktop) */}
        <div className={`${
          miniature ? "w-full h-[220px]" : "lg:col-span-8 h-[520px]"
        } bg-zinc-950 border border-zinc-900 rounded-2xl relative overflow-hidden select-none shadow-2xl transition-all duration-300 flex flex-col justify-between`}>
          
          {/* Top Control Overlay for Full View */}
          {!miniature && (
            <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 z-20 pointer-events-none">
              
              {/* Dynamic status chip describing active mode state */}
              <div className="px-3.5 py-1.5 rounded-xl border bg-zinc-950/90 text-zinc-200 border-zinc-850/80 text-[11px] font-mono shadow-xl flex items-center gap-2 pointer-events-auto">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  syncMode === "ATLAS_LIVE" && isAtlasRunning ? "bg-emerald-400 animate-ping" :
                  syncMode === "CHRONOLOGICAL_REPLAY" && replayActive ? "bg-cyan-400 animate-pulse" :
                  syncMode === "DEMO_PLAYBACK" && isDemoPlaying ? "bg-purple-400 animate-pulse" : "bg-zinc-500"
                }`} />
                <span>
                  {syncMode === "ATLAS_LIVE" ? `ATLAS: ${activeTimelineStage.toUpperCase()}` :
                   syncMode === "CHRONOLOGICAL_REPLAY" ? `REPLAY STEP: ${replayCurrentStep + 1}` :
                   syncMode === "DECISION_CENTER" ? "DECISION CENTER MATRIX LOADED" :
                   `DEMO: ${activeScenario?.title.toUpperCase()} (Step ${currentScenarioStep + 1}/${activeScenario?.steps.length})`}
                </span>
              </div>

              {/* Camera navigation panel */}
              <div className="flex items-center gap-1.5 p-1 bg-zinc-950/90 border border-zinc-850/80 rounded-xl shadow-xl pointer-events-auto">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                  title="Zoom In"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                  title="Zoom Out"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleResetCamera}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                  title="Recenter Camera"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Canvas SVG Grid Surface */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full h-full relative ${miniature ? "" : "cursor-grab"} ${isDragging ? "cursor-grabbing" : ""}`}
          >
            {/* Soft grid background dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

            <svg
              className="w-full h-full"
              viewBox="0 0 820 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG Glowing filters definitions */}
              <defs>
                <filter id="glow-zinc" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-rose" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Master Translate/Zoom Group */}
              <g
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.15s ease-out"
                }}
              >
                {/* A. RENDER CONNECTION PIPELINES FIRST (Drawn behind nodes) */}
                {MAP_CONNECTIONS.map(conn => {
                  const isActive = activeConns.has(conn.id);

                  return (
                    <g key={conn.id} className="group/pipeline">
                      {/* Interactive broad invisible click-path */}
                      <path
                        d={conn.path}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="16"
                        className="cursor-pointer"
                        onClick={() => {
                          if (miniature) return;
                          addLog(`Intelligence Map: Pipeline vector [${conn.label}] checked. Active: ${isActive ? "YES" : "NO"}`);
                        }}
                      />

                      {/* Deep black contrast offset line */}
                      <path d={conn.path} fill="none" stroke="#08080c" strokeWidth="4" />

                      {/* Standard static line */}
                      <path d={conn.path} fill="none" stroke="#14141d" strokeWidth="1.5" />

                      {/* Active colored flowing dash line overlay */}
                      {isActive && (
                        <path
                          d={conn.path}
                          fill="none"
                          stroke={
                            conn.id.includes("gemini") ? "rgba(168, 85, 247, 0.45)" :
                            conn.id.includes("datahub") ? "rgba(59, 130, 246, 0.45)" :
                            conn.id.includes("memory") ? "rgba(16, 185, 129, 0.45)" :
                            conn.id.includes("recommendation") ? "rgba(244, 63, 94, 0.45)" :
                            "rgba(34, 211, 238, 0.45)"
                          }
                          strokeWidth="2"
                          className="animate-flow"
                          style={{ strokeDasharray: "5, 5" }}
                        />
                      )}

                      {/* Flowing animated particles running along SVG path */}
                      {isActive && (
                        <circle
                          r="3"
                          fill={
                            conn.id.includes("gemini") ? "#c084fc" :
                            conn.id.includes("datahub") ? "#60a5fa" :
                            conn.id.includes("memory") ? "#34d399" :
                            conn.id.includes("recommendation") ? "#fb7185" :
                            "#22d3ee"
                          }
                          filter={`url(#${
                            conn.id.includes("gemini") ? "glow-purple" :
                            conn.id.includes("datahub") ? "glow-blue" :
                            conn.id.includes("memory") ? "glow-emerald" :
                            conn.id.includes("recommendation") ? "glow-rose" :
                            "glow-cyan"
                          })`}
                        >
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path={conn.path}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* B. RENDER NETWORK NODES (Foreground) */}
                {MAP_NODES.map(node => {
                  const isSelected = !miniature && selectedNodeId === node.id;
                  const isActive = activeNodes.has(node.id);
                  const nodeState = nodeTelemetryMap[node.id];

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className={`${miniature ? "" : "cursor-pointer"} group/node`}
                      onClick={() => {
                        if (miniature) {
                          if (onOpenFullMap) onOpenFullMap();
                          return;
                        }
                        setSelectedNodeId(node.id);
                        addLog(`Intelligence Map: Opened diagnostics on node resource -> [${node.label}]`);
                      }}
                    >
                      {/* Outer pulsing ring for active processing states */}
                      {isActive && (
                        <circle
                          r="26"
                          fill="none"
                          stroke={
                            node.id === "gemini" ? "rgba(168, 85, 247, 0.2)" :
                            node.id === "recommendation" ? "rgba(244, 63, 94, 0.2)" :
                            node.id === "datahub" ? "rgba(59, 130, 246, 0.2)" :
                            node.id === "memory" ? "rgba(16, 185, 129, 0.2)" :
                            node.type === "specialist" ? "rgba(245, 158, 11, 0.2)" :
                            "rgba(34, 211, 238, 0.2)"
                          }
                          strokeWidth="2.5"
                          className="animate-ping"
                          style={{ animationDuration: "1.8s" }}
                        />
                      )}

                      {/* Main node backing shell */}
                      <circle
                        r="18"
                        fill="#050508"
                        stroke={
                          isSelected
                            ? node.id === "gemini" ? "#c084fc" :
                              node.id === "recommendation" ? "#f43f5e" :
                              node.id === "datahub" ? "#3b82f6" :
                              node.id === "memory" ? "#10b981" :
                              node.type === "specialist" ? "#f59e0b" :
                              "#22d3ee"
                            : isActive
                            ? node.id === "gemini" ? "rgba(168, 85, 247, 0.6)" :
                              node.id === "recommendation" ? "rgba(244, 63, 94, 0.6)" :
                              node.id === "datahub" ? "rgba(59, 130, 246, 0.6)" :
                              node.id === "memory" ? "rgba(16, 185, 129, 0.6)" :
                              node.type === "specialist" ? "rgba(245, 158, 11, 0.6)" :
                              "rgba(34, 211, 238, 0.6)"
                            : "#161622"
                        }
                        strokeWidth={isSelected ? "3" : isActive ? "2.2" : "1.5"}
                        filter={isSelected || isActive ? `url(#${node.glowId})` : "none"}
                        className="transition-all duration-300 group-hover/node:stroke-zinc-500"
                      />

                      {/* Icon inside circle */}
                      <g transform="translate(-7.5, -7.5)" className="pointer-events-none">
                        {renderNodeIcon(
                          node.iconName,
                          `h-[15px] w-[15px] ${
                            isActive
                              ? node.id === "gemini" ? "text-purple-400 animate-pulse" :
                                node.id === "recommendation" ? "text-rose-400" :
                                node.id === "datahub" ? "text-blue-400" :
                                node.id === "memory" ? "text-emerald-400" :
                                node.type === "specialist" ? "text-amber-400" :
                                "text-cyan-400"
                              : "text-zinc-600"
                          }`
                        )}
                      </g>

                      {/* Node Label Text */}
                      <text
                        y="28"
                        textAnchor="middle"
                        fill={isSelected ? "#ffffff" : isActive ? "#e4e4e7" : "#52525e"}
                        fontSize="8.5"
                        fontWeight={isSelected || isActive ? "bold" : "normal"}
                        fontFamily="monospace"
                        className="pointer-events-none transition-colors"
                      >
                        {node.label}
                      </text>

                      {/* Dynamic status tags inside SVG for active control vibe */}
                      {isActive && !miniature && (
                        <text
                          y="-24"
                          textAnchor="middle"
                          fill={
                            node.id === "gemini" ? "#c084fc" :
                            node.id === "recommendation" ? "#fb7185" :
                            node.id === "datahub" ? "#60a5fa" :
                            node.id === "memory" ? "#34d399" :
                            node.type === "specialist" ? "#fbbf24" :
                            "#67e8f9"
                          }
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="monospace"
                          className="pointer-events-none tracking-widest"
                        >
                          {nodeState.status.toUpperCase()}
                        </text>
                      )}

                      {/* Node category mini tag (visible on hover) */}
                      {!miniature && (
                        <text
                          y="38"
                          textAnchor="middle"
                          fill="#3f3f4e"
                          fontSize="6.5"
                          fontFamily="monospace"
                          className="pointer-events-none opacity-0 group-hover/node:opacity-100 transition-opacity"
                        >
                          {node.type.toUpperCase()}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Instruction footnote overlay */}
            {!miniature && (
              <div className="absolute bottom-4 left-4 bg-zinc-950/90 border border-zinc-900 rounded-xl p-3 backdrop-blur-md flex items-center gap-2 max-w-[280px] shadow-lg pointer-events-none z-10">
                <Info className="h-4 w-4 text-cyan-400 shrink-0" />
                <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                  Drag the viewport canvas to pan. Mouse-wheel to zoom. Click nodes to inspect in-depth DataHub schemas, vector memory similarity scores, and execution logs.
                </p>
              </div>
            )}

            {/* Miniature Hover Overlay */}
            {miniature && (
              <div className="absolute inset-0 bg-zinc-950/20 hover:bg-zinc-950/60 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100 group cursor-pointer z-20" onClick={onOpenFullMap}>
                <button className="px-4 py-2 bg-zinc-900/90 border border-zinc-800 text-cyan-400 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xl transition-all scale-95 group-hover:scale-100 backdrop-blur-sm cursor-pointer">
                  Open Full Intelligence Map
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* C. BOTTOM PLAYBACK CONTROLS FOR DEMO MODE */}
          {!miniature && syncMode === "DEMO_PLAYBACK" && activeScenario && (
            <div className="border-t border-zinc-900/80 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              
              {/* Scenario selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Active Scenario:</span>
                <select
                  value={selectedScenarioId}
                  onChange={(e) => {
                    setSelectedScenarioId(e.target.value);
                    setCurrentScenarioStep(0);
                    setIsDemoPlaying(false);
                    addLog(`Intelligence Map: Selected scenario for demo playback -> [${e.target.value}]`);
                  }}
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-lg text-[11px] font-mono px-2.5 py-1 focus:outline-none focus:border-cyan-500"
                >
                  {MAP_PLAYBACK_SCENARIOS.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {/* Play / pause buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentScenarioStep(0);
                    setIsDemoPlaying(false);
                    addLog("Intelligence Map: Reset scenario to initial stage.");
                  }}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Reset Scenario"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => {
                    setIsDemoPlaying(!isDemoPlaying);
                    addLog(`Intelligence Map: ${!isDemoPlaying ? "Started" : "Paused"} scenario playback.`);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDemoPlaying
                      ? "bg-purple-950 text-purple-400 border border-purple-800"
                      : "bg-cyan-950 text-cyan-400 border border-cyan-800"
                  }`}
                >
                  {isDemoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {isDemoPlaying ? "Pause Playback" : "Start Playback"}
                </button>

                <button
                  onClick={() => {
                    const total = activeScenario.steps.length;
                    setCurrentScenarioStep(prev => {
                      const next = prev + 1;
                      if (next >= total) {
                        addLog("Intelligence Map: Already at final step of scenario.");
                        return prev;
                      }
                      addLog(`Intelligence Map: Manually stepped forward to step ${next + 1}/${total}`);
                      return next;
                    });
                  }}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Next Step"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Speed rate selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Speed:</span>
                <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                  {[1, 2, 4].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded-md ${
                        playbackSpeed === speed
                          ? "bg-cyan-500/10 text-cyan-400 font-bold"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Stepper Indicator line */}
          {!miniature && syncMode === "DEMO_PLAYBACK" && activeScenario && (
            <div className="h-1 bg-zinc-900 flex">
              {activeScenario.steps.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentScenarioStep(idx);
                    setIsDemoPlaying(false);
                    addLog(`Intelligence Map: Jumped directly to scenario step ${idx + 1}`);
                  }}
                  className={`flex-1 h-full transition-colors duration-300 cursor-pointer ${
                    idx <= currentScenarioStep
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-zinc-950"
                  } border-r border-zinc-900/60`}
                />
              ))}
            </div>
          )}

        </div>

        {/* 3. Detailed Side Panel Node Inspector (Col span 4) */}
        {!miniature && (
          <div className="lg:col-span-4 flex flex-col h-[520px]">
            {selectedNode ? (
              <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 relative shadow-2xl">
                
                {/* Node Details Section */}
                <div className="space-y-4">
                  
                  {/* Category, Status indicator */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-bold">
                      Telemetry Node: {selectedNode.type.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      activeNodes.has(selectedNode.id)
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-zinc-900 text-zinc-500 border-zinc-800"
                    }`}>
                      {nodeTelemetryMap[selectedNode.id]?.status || "STANDBY"}
                    </span>
                  </div>

                  {/* Icon & Label */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
                      {renderNodeIcon(selectedNode.iconName, "h-5 w-5 text-cyan-400")}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base font-sans leading-tight">
                        {selectedNode.label}
                      </h3>
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        URN: {`urn:li:node:${selectedNode.id}`}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {selectedNode.description}
                  </p>

                  {/* Operational Parameters Panel */}
                  <div className="p-3.5 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-2 font-mono text-[11px] leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Current Task:</span>
                      <span className="text-zinc-200 font-medium truncate max-w-[180px]" title={nodeTelemetryMap[selectedNode.id]?.task}>
                        {nodeTelemetryMap[selectedNode.id]?.task}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Last Execution:</span>
                      <span className="text-zinc-300">
                        {nodeTelemetryMap[selectedNode.id]?.lastExecution}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Confidence Rating:</span>
                      <span className="text-blue-400 font-bold">
                        {nodeTelemetryMap[selectedNode.id]?.confidence}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-zinc-900 pt-1.5 mt-1.5">
                      <span className="text-zinc-500">Dependencies:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {nodeTelemetryMap[selectedNode.id]?.dependencies.length > 0 ? (
                          nodeTelemetryMap[selectedNode.id]?.dependencies.map(dep => (
                            <span key={dep} className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                              {dep}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-zinc-600">None (Primary trigger)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Panel */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                      Recent Thread Activity logs
                    </span>
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 text-[11px] text-zinc-400 leading-relaxed font-sans border-l-2 border-l-cyan-500">
                      {nodeTelemetryMap[selectedNode.id]?.recentActivity}
                    </div>
                  </div>

                  {/* D. TYPE-SPECIFIC DEEP METADATA VISUALIZATION */}
                  
                  {/* 1. DATAHUB CONTEXT VISUALIZATION */}
                  {selectedNode.id === "datahub" && activeScenario && (
                    <div className="space-y-3 pt-2.5 border-t border-zinc-900 animate-fade-in">
                      <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                        DataHub Enterprise Catalog Assets
                      </div>
                      <div className="p-3.5 bg-blue-950/10 border border-blue-900/20 rounded-xl space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-500 block uppercase font-mono">Dataset Identifier</span>
                          <span className="text-xs font-mono font-bold text-white truncate block" title={activeScenario.datahubInfo.urn}>
                            {activeScenario.datahubInfo.urn}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-zinc-900 pt-2 font-mono text-zinc-400">
                          <div>
                            <span className="text-zinc-600 uppercase block">Database Platform</span>
                            <span className="text-zinc-300 font-bold uppercase">{activeScenario.datahubInfo.platform}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 uppercase block">Owners Enrolled</span>
                            <span className="text-zinc-300">{activeScenario.datahubInfo.owners[0] || "None"}</span>
                          </div>
                        </div>

                        {/* Interactive fields tree */}
                        <div className="border-t border-zinc-900 pt-2.5 space-y-1.5">
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Active Schema Fields ({activeScenario.datahubInfo.fields.length})</span>
                          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                            {activeScenario.datahubInfo.fields.map(field => (
                              <div key={field.path} className="flex items-center justify-between p-1 rounded bg-zinc-950 border border-zinc-900 text-[10px] font-mono">
                                <span className="text-zinc-300 font-semibold">{field.path}</span>
                                <span className="text-blue-400 uppercase font-bold text-[9px]">{field.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Lineage Mapping */}
                        <div className="border-t border-zinc-900 pt-2 text-[10px] font-mono">
                          <span className="text-zinc-600 uppercase block">Downstream Lineage Dependencies:</span>
                          <span className="text-blue-300 truncate block mt-0.5">{activeScenario.datahubInfo.lineageDownstream.join(" -> ") || "No downstream nodes"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. ORGANIZATIONAL MEMORY VISUALIZATION */}
                  {selectedNode.id === "memory" && activeScenario && (
                    <div className="space-y-3 pt-2.5 border-t border-zinc-900 animate-fade-in">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                        Vector recall Matches
                      </div>
                      <div className="p-3.5 bg-emerald-950/10 border border-emerald-900/20 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                          <span>INDEX CAPACITY:</span>
                          <span className="text-emerald-400 font-bold">{activeScenario.memoryInfo.vectorDatabaseSize}</span>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Historical Matches</span>
                          <div className="space-y-1.5">
                            {activeScenario.memoryInfo.incidentsMatched.map(incident => (
                              <div key={incident} className="p-2 bg-zinc-950 rounded-lg border border-zinc-900 text-[10.5px] font-sans text-zinc-300 border-l-2 border-l-emerald-500">
                                {incident}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-zinc-900 pt-2 text-[10px] font-mono">
                          <span className="text-zinc-600 uppercase block">Synthesized Lessons-Learned</span>
                          <span className="text-emerald-300 leading-relaxed block mt-1">{activeScenario.memoryInfo.lessonsLearned[0]}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. COGNITIVE REASONING VISUALIZATION */}
                  {selectedNode.id === "gemini" && (
                    <div className="space-y-3 pt-2.5 border-t border-zinc-900 animate-fade-in">
                      <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                        Cognitive Layer Specifications
                      </div>
                      <div className="p-3.5 bg-purple-950/10 border border-purple-900/20 rounded-xl space-y-2 text-[10.5px] font-mono text-zinc-400">
                        <div className="flex justify-between">
                          <span>Cognitive Model:</span>
                          <span className="text-purple-300 font-bold">Gemini 2.5 Flash</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inference tokens mapped:</span>
                          <span className="text-zinc-300">4,120 input / 840 output</span>
                        </div>
                        <div className="border-t border-zinc-900/80 pt-1.5 mt-1.5">
                          <span className="text-zinc-500 font-semibold block uppercase text-[9px] mb-0.5">Active prompt boundaries:</span>
                          <p className="text-zinc-300 leading-normal font-sans">
                            Constructed complete incident summary with 98% confidence. Grounded under CCPA Article 5 compliance standards.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. RECOMMENDATION/OUTPUT VISUALIZATION */}
                  {selectedNode.id === "recommendation" && activeScenario && (
                    <div className="space-y-3 pt-2.5 border-t border-zinc-900 animate-fade-in">
                      <div className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold">
                        Mitigation playbooks & Code
                      </div>
                      <div className="p-3 bg-rose-950/10 border border-rose-900/20 rounded-xl space-y-2">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase flex justify-between">
                          <span>Risk Severity:</span>
                          <span className="text-rose-400 font-bold">{activeScenario.riskLevel}</span>
                        </div>
                        <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-900 font-mono text-[9px] text-zinc-300 overflow-x-auto whitespace-pre">
                          {`-- Compiling safe view schema aliasing\nBEGIN;\nCREATE OR REPLACE VIEW core.users_compat AS\n  SELECT \n    id,\n    phone_encrypted AS phone_raw\n  FROM core.users;\nCOMMIT;`}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Audit trigger check footer button */}
                <div className="border-t border-zinc-900 pt-4 mt-4 shrink-0">
                  <button
                    onClick={() => handleQuickTriggerDiagnostic(selectedNode.label)}
                    className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white transition-all text-zinc-300 rounded-xl py-2 text-xs font-bold font-sans flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-zinc-950/40"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" /> Trigger Local Node Audit
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <Info className="h-6 w-6 text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500 font-mono">SELECT A NODE TO INSPECT TELEMETRY DATA</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Embedded Styles for SVG Keyframes */}
      <style>{`
        @keyframes flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-flow {
          animation: flow 1s linear infinite;
        }
      `}</style>

    </div>
  );
}
