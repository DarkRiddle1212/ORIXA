import React, { useState, useEffect, useCallback } from "react";
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Activity, 
  Database, 
  Key, 
  ChevronRight, 
  AlertTriangle, 
  RefreshCw, 
  Server, 
  Search, 
  Layers, 
  Users, 
  FileText, 
  Sliders, 
  CheckCircle,
  Network,
  Lock,
  ArrowRight,
  TrendingUp,
  Brain,
  Sparkles,
  Play,
  Check,
  Loader,
  Copy,
  GitBranch,
  Tag,
  Globe,
  Calendar,
  Briefcase,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import OrganizationalMemory from "./components/OrganizationalMemory";
import DemoMode from "./components/DemoMode";
import IncidentReplay from "./components/IncidentReplay";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import EnterpriseIntelligenceMap from "./components/EnterpriseIntelligenceMap";
import DecisionCenter from "./components/DecisionCenter";
import AtlasOperationsConsole from "./components/AtlasOperationsConsole";
import LandingPage from "./components/LandingPage";
import ArchitecturePage from "./components/ArchitecturePage";

// ============================================================================
// Core Interactive Data Templates
// ============================================================================

interface Specialist {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  status: string;
  health: string;
  capabilities: string[];
  supported_tasks: string[];
  responsibilities: string[];
  threatCoverage: string;
  avatarColor: string;
  logs: string[];
  thumbs_up?: number;
  thumbs_down?: number;
}

const INITIAL_SPECIALISTS: Specialist[] = [
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
    threatCoverage: "Schema mutations, column drift, catalog mismatches",
    avatarColor: "from-blue-500 to-indigo-500",
    logs: [
      "Atlas: Registered and ready for DataHub synchronization.",
      "Atlas: Scanning staging tables for metadata sync indexes.",
      "Atlas: Awaiting instruction from supervisor."
    ]
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
    threatCoverage: "Port scanning, SQL injection attempts, API abuse footprinting",
    avatarColor: "from-emerald-500 to-teal-400",
    logs: [
      "Sentinel: Monitoring active logs on port 3000.",
      "Sentinel: Threat classification engine online [OK].",
      "Sentinel: Active isolation fences validated on staging tables."
    ]
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
    threatCoverage: "GDPR breaches, cleartext PII leaks, unauthorized scans",
    avatarColor: "from-cyan-500 to-blue-500",
    logs: [
      "Guardian: Operational and scanning staging tables for unencrypted emails.",
      "Guardian: Compliance safety checks passed [92.1% score].",
      "Guardian: Registered CCPA column exception logs."
    ]
  },
  {
    id: "architect-topology-spec",
    name: "architect",
    display_name: "Architect",
    description: "System topology mapping, analytical pipeline routing, and sandbox boundary modeling.",
    category: "Topology & Infrastructure",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Topology visualization", "Service-to-service mapping", "Resource modeling"],
    supported_tasks: ["trace_pipeline_dependencies", "model_service_routing"],
    responsibilities: [
      "Trace pipeline dependencies across microservices.",
      "Map connection routing graphs for PostgreSQL, Redis, and FastAPI servers.",
      "Formulate network isolation bounds for staging sandboxes."
    ],
    threatCoverage: "Resource allocation gaps, circular dependencies, routing leaks",
    avatarColor: "from-purple-500 to-indigo-500",
    logs: [
      "Architect: Graph container network mapped.",
      "Architect: Host routing rules configured on port 3000.",
      "Architect: Operational topology cached in Redis manager."
    ]
  },
  {
    id: "forge-migration-spec",
    name: "forge",
    display_name: "Forge",
    description: "Automated database migration script writing, schema mutation deployments, and safe transactional rollbacks.",
    category: "Migration & Automation",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["SQL DDL script drafting", "Safe migration deployment", "Transactional rollback engine"],
    supported_tasks: ["draft_alignment_sql", "deploy_schema_mutation", "execute_migration_rollback"],
    responsibilities: [
      "Draft SQL DDL alignment scripts to reconcile physical schemas with metadata.",
      "Execute safe database migrations with automatic pre-flight validations.",
      "Perform safe operational rollbacks on relational tables in case of failure."
    ],
    threatCoverage: "Failed migrations, broken database states, raw table lockups",
    avatarColor: "from-orange-500 to-red-400",
    logs: [
      "Forge: Migration pipeline prepared and locked.",
      "Forge: Readied transaction manager for fallback rollback scenarios.",
      "Forge: Compiled database reflection structures successfully."
    ]
  },
  {
    id: "oracle-prediction-spec",
    name: "oracle",
    display_name: "Oracle",
    description: "Time-series operational risk modeling, pool starvation prediction, and compatibility forecasting.",
    category: "Predictive Analytics",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Time-series forecasting", "Resource starvation prediction", "Vulnerability metrics modelling"],
    supported_tasks: ["forecast_pool_starvation", "estimate_schema_drift_risk", "calculate_auc_accuracy"],
    responsibilities: [
      "Forecast database connection starvation bottlenecks using ARIMA mathematical models.",
      "Predict structural schema drift likelihood across tenant environments.",
      "Analyze telemetry streams to project degradation rates and compliance risk curves."
    ],
    threatCoverage: "Pool starvation, memory/CPU exhaustion, schema drift timelines",
    avatarColor: "from-amber-500 to-orange-400",
    logs: [
      "Oracle: Initialized ARIMA forecasting model.",
      "Oracle: Pulling active dataset from time-series logs.",
      "Oracle: Time-series database queries compiled in 1.4ms."
    ]
  },
  {
    id: "archivist-knowledge-spec",
    name: "archivist",
    display_name: "Archivist",
    description: "Organizational memory management, semantic policy ingestion, and grounding attribution tracing.",
    category: "Semantic Memory",
    status: "IDLE",
    health: "GREEN",
    capabilities: ["Semantic search indexing", "Document chunking", "Explainability grounding"],
    supported_tasks: ["ingest_policy_guideline", "search_knowledge_base", "ground_agent_decision"],
    responsibilities: [
      "Ingest and parse corporate compliance documents and security standard PDFs.",
      "Expose search engines to lookup relevant operational policies.",
      "Ground specialist operations with traceable attributions to official runbook chapters."
    ],
    threatCoverage: "Inaccurate agent decisions, ungrounded actions, missing runbooks",
    avatarColor: "from-pink-500 to-rose-400",
    logs: [
      "Archivist: Semantic memory space allocated.",
      "Archivist: Indexed corporate compliance policies document.",
      "Archivist: Semantic query vectors verified [OK]."
    ]
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
    threatCoverage: "Slack delivery failures, SSO authorization leaks, untrusted API syncs",
    avatarColor: "from-violet-500 to-fuchsia-400",
    logs: [
      "Ambassador: Slack integration channels synced.",
      "Ambassador: Configured secure webhooks for multi-tenant notifications.",
      "Ambassador: Multi-channel event listeners online."
    ]
  }
];

// Interactive mock files to view in settings
const SYSTEM_CODE_TEMPLATES = {
  "ARCHITECTURE.md": `# Orixa Monorepo Configuration
/frontend   # Next.js 15 Web App Router Console
/backend    # FastAPI Python 3.12 Gateway
/docker     # Orchestration Compose blueprints
/docs       # Engineering specifications
/examples   # CLI curl request scenarios
/scripts    # Seeding & database migration scripts`,
  "FastAPI main.py": `from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.middleware.logging import AuditLoggingMiddleware

app = FastAPI(title=settings.PROJECT_NAME)
app.add_middleware(AuditLoggingMiddleware)

@app.get("/health")
def get_system_health():
    return {"status": "healthy", "engine": "Orixa OS Gateway v1"}`,
  "Postgres Schema.py": `class Organization(Base, TimestampModel):
    __tablename__ = "organizations"
    name: Mapped[str] = mapped_column(String(100), unique=True)
    domain: Mapped[str] = mapped_column(String(100), nullable=True)

class User(Base, TimestampModel):
    __tablename__ = "users"
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    role: Mapped[str] = mapped_column(String(20), default="Viewer")
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"))`,
  "docker-compose.yml": `version: '3.8'
services:
  db:
    image: postgres:16-alpine
    container_name: orixa_postgres
    ports: ["5432:5432"]
  redis:
    image: redis:7-alpine
    container_name: orixa_redis
  backend:
    build: { context: ../, dockerfile: docker/backend.Dockerfile }
  frontend:
    build: { context: ../, dockerfile: docker/frontend.Dockerfile }`
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"Landing" | "Architecture" | "Dashboard" | "Atlas" | "Context" | "Investigations" | "Specialists" | "Knowledge" | "Predictions" | "Settings" | "Memory" | "Demo" | "Replay" | "Map" | "Decision">("Landing");
  const [userRole, setUserRole] = useState<"SuperAdmin" | "Analyst" | "Viewer">("SuperAdmin");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Real-time SSE Connection States
  const [realTimeStatus, setRealTimeStatus] = useState<"Connected" | "Reconnecting" | "Offline">("Offline");
  const [liveAtlasState, setLiveAtlasState] = useState<any>(null);

  // Command Palette states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");

  const getStageEnum = (stage: string) => {
    switch (stage) {
      case "Receiving Request": return "analyzing";
      case "Reading Organizational Context": return "planning";
      case "Searching Organizational Memory": return "selection";
      case "Coordinating Specialists": return "executing";
      case "Generating Recommendation": return "aggregating";
      case "Completed": return "completed";
      default: return "idle";
    }
  };

  const addLog = useCallback((msg: string) => {
    setConsoleLogs(prev => [msg, ...prev.slice(0, 19)]);
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connectSSE = () => {
      setRealTimeStatus("Reconnecting");
      eventSource = new EventSource("/api/v1/stream");

      eventSource.onopen = () => {
        setRealTimeStatus("Connected");
        addLog("System: Real-Time SRE Operational Stream Connected.");
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "state_update") {
            setLiveAtlasState(payload.state);
            const currentStage = payload.state.progress.stage_name;
            setActiveTimelineStage(getStageEnum(currentStage));
            setIsAtlasRunning(currentStage !== "Completed");
            
            // Highlight active specialist in the specialists fleet view
            if (payload.state.current_specialist) {
              setSpecialists(prev => prev.map(s => {
                if (s.display_name.toLowerCase().includes(payload.state.current_specialist.specialist_name.toLowerCase())) {
                  return { ...s, status: "RUNNING" };
                }
                return { ...s, status: "IDLE" };
              }));
            } else {
              setSpecialists(prev => prev.map(s => ({ ...s, status: "IDLE" })));
            }
          }
        } catch (err) {
          console.error("Error parsing SSE update:", err);
        }
      };

      eventSource.onerror = () => {
        setRealTimeStatus("Offline");
        if (eventSource) {
          eventSource.close();
        }
        reconnectTimeout = setTimeout(connectSSE, 6000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [addLog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Context Explorer States
  const [contextQuery, setContextQuery] = useState<string>("acme"); // Default query to fetch all datasets
  const [catalogDatasets, setCatalogDatasets] = useState<any[]>([]);
  const [catalogGlossary, setCatalogGlossary] = useState<any[]>([]);
  const [catalogDomains, setCatalogDomains] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [selectedDatasetLineage, setSelectedDatasetLineage] = useState<any>(null);
  const [selectedDatasetOwners, setSelectedDatasetOwners] = useState<any[]>([]);
  const [isContextLoading, setIsContextLoading] = useState<boolean>(false);
  const [selectedExplorerTab, setSelectedExplorerTab] = useState<"schema" | "lineage" | "owners" | "governance" | "documentation">("schema");
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("All");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>("All");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("All");
  
  // Atlas Orchestrator Live States
  const [atlasQuery, setAtlasQuery] = useState<string>("A schema change caused downstream failures.");
  const [isAtlasRunning, setIsAtlasRunning] = useState<boolean>(false);
  const [atlasResult, setAtlasResult] = useState<any>(null);
  const [atlasStageLogs, setAtlasStageLogs] = useState<string[]>([]);
  const [activeTimelineStage, setActiveTimelineStage] = useState<"idle" | "analyzing" | "planning" | "selection" | "executing" | "aggregating" | "completed">("idle");
  const [activeAtlasStepIndex, setActiveAtlasStepIndex] = useState<number>(-1);
  const [copiedRemediationIndex, setCopiedRemediationIndex] = useState<number | null>(null);
  const [isRootCauseOpen, setIsRootCauseOpen] = useState<boolean>(true);
  const [isRiskAssessmentOpen, setIsRiskAssessmentOpen] = useState<boolean>(true);
  const [isSpecialistsOpen, setIsSpecialistsOpen] = useState<boolean>(true);

  // Interactive logs buffer
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "System: Initializing Orixa OS UI Console Interface...",
    "System: Mounting telemetry dashboards and monitoring nodes...",
    "System: Operational database state simulated: 2 Tenant Nodes loaded.",
    "System: Ready. Select dashboard tabs to investigate active security scopes."
  ]);

  const [specialists, setSpecialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("sentinel-threat-spec");
  const [activeCodeFile, setActiveCodeFile] = useState<keyof typeof SYSTEM_CODE_TEMPLATES>("ARCHITECTURE.md");
  const [isExecutingTask, setIsExecutingTask] = useState<string | null>(null);
  
  // Simulation configurations
  const [isDataHubConnected, setIsDataHubConnected] = useState(true);
  const [databasePoolSize, setDatabasePoolSize] = useState(3);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);

  // Background sync with FastAPI specialist endpoints on mount and interval
  useEffect(() => {
    const syncSpecialists = async () => {
      try {
        const res = await fetch("/api/v1/specialists");
        if (res.ok) {
          const remoteList = await res.json();
          setSpecialists(prev => prev.map(local => {
            const remoteSpec = remoteList.find((r: any) => r.name === local.name);
            if (remoteSpec) {
              return {
                ...local,
                status: remoteSpec.status,
                health: remoteSpec.health,
                capabilities: remoteSpec.capabilities,
                supported_tasks: remoteSpec.supported_tasks,
                thumbs_up: remoteSpec.thumbs_up,
                thumbs_down: remoteSpec.thumbs_down
              };
            }
            return local;
          }));
        }
      } catch (err) {
        console.warn("Backend specialist API offline or unreachable, staying in offline sandbox simulation mode.", err);
      }
    };

    syncSpecialists();
    const interval = setInterval(syncSpecialists, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectCatalogDataset = async (urn: string) => {
    try {
      const resDs = await fetch(`/api/v1/context/dataset/${encodeURIComponent(urn)}`);
      if (resDs.ok) {
        const dsData = await resDs.json();
        setSelectedDataset(dsData);
      }
      
      const resLin = await fetch(`/api/v1/context/lineage/${encodeURIComponent(urn)}`);
      if (resLin.ok) {
        const linData = await resLin.json();
        setSelectedDatasetLineage(linData);
      }

      const resOwn = await fetch(`/api/v1/context/owners/${encodeURIComponent(urn)}`);
      if (resOwn.ok) {
        const ownData = await resOwn.json();
        setSelectedDatasetOwners(ownData.owners || []);
      }
    } catch (err) {
      console.error(`Failed to load details for dataset ${urn}:`, err);
    }
  };

  const handleContextSearch = async (q: string) => {
    setIsContextLoading(true);
    try {
      const res = await fetch(`/api/v1/context/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setCatalogDatasets(data.datasets || []);
        setCatalogGlossary(data.glossary_terms || []);
        
        const resDom = await fetch(`/api/v1/context/domains`);
        if (resDom.ok) {
          const domData = await resDom.json();
          setCatalogDomains(domData.domains || []);
        }
        
        if (data.datasets && data.datasets.length > 0) {
          const exists = data.datasets.some((d: any) => d.urn === selectedDataset?.urn);
          if (!exists) {
            await selectCatalogDataset(data.datasets[0].urn);
          } else if (selectedDataset) {
            await selectCatalogDataset(selectedDataset.urn);
          }
        } else {
          setSelectedDataset(null);
          setSelectedDatasetLineage(null);
          setSelectedDatasetOwners([]);
        }
      }
    } catch (err) {
      console.error("Failed to query Context search:", err);
    } finally {
      setIsContextLoading(false);
    }
  };

  useEffect(() => {
    handleContextSearch(contextQuery);
  }, [contextQuery]);

  // Auto log appending to simulate ticking metrics
  useEffect(() => {
    const intervals = [
      "System: Syncing analytical schema tree metadata with DataHub...",
      "System: Database connection pool recycled [3 connection links re-pooled]",
      "Sentinel: Inbound log footprint scanned successfully",
      "Atlas: DataHub operational catalog synchronization complete",
      "Oracle: Resource saturation forecast calculated"
    ];

    const timer = setInterval(() => {
      const randomMsg = intervals[Math.floor(Math.random() * intervals.length)];
      setConsoleLogs(prev => [randomMsg, ...prev.slice(0, 19)]);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  const handleRateSpecialist = async (name: string, rating: "up" | "down") => {
    try {
      const res = await fetch(`/api/v1/specialists/${name.toLowerCase()}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating })
      });
      if (res.ok) {
        const data = await res.json();
        setSpecialists(prev => prev.map(s => {
          if (s.name.toLowerCase() === name.toLowerCase()) {
            return {
              ...s,
              thumbs_up: data.thumbs_up,
              thumbs_down: data.thumbs_down
            };
          }
          return s;
        }));
        addLog(`Operator Feedback: Logged ${rating === "up" ? "Positive (👍)" : "Negative (👎)"} rating for specialist ${data.specialist}. Dynamic selection weights updated.`);
      }
    } catch (err) {
      console.error("Error rating specialist:", err);
    }
  };

  const handleExecuteTask = async (specName: string, taskName: string) => {
    if (isExecutingTask) return;
    setIsExecutingTask(taskName);
    addLog(`System: Dispatched task '${taskName}' to backend Orixa specialist: '${specName}'`);
    
    try {
      const response = await fetch(`/api/v1/specialists/${specName}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskName,
          payload: { operator: userRole, triggeredAt: new Date().toISOString() }
        })
      });

      if (!response.ok) {
        const errDetail = await response.json();
        throw new Error(errDetail.detail || "Task execution pipeline aborted");
      }

      const result = await response.json();
      addLog(`[SUCCESS] Specialist '${specName}' completed execution of task '${taskName}'!`);
      
      setSpecialists(prev => prev.map(s => {
        if (s.name === specName) {
          return {
            ...s,
            status: "IDLE",
            logs: [
              `[SUCCESS]: Task '${taskName}' executed successfully.`,
              `Result: ${result.status} - ${result.result}`,
              ...result.logs.map((logLine: string) => `Agent Trace: ${logLine}`),
              ...s.logs
            ]
          };
        }
        return s;
      }));
    } catch (e: any) {
      addLog(`[FAILURE] Specialist '${specName}' failed to execute task '${taskName}': ${e.message}`);
      setSpecialists(prev => prev.map(s => {
        if (s.name === specName) {
          return {
            ...s,
            status: "ERROR",
            logs: [
              `[FAILURE]: Execution of task '${taskName}' failed.`,
              `Error: ${e.message}`,
              ...s.logs
            ]
          };
        }
        return s;
      }));
    } finally {
      setIsExecutingTask(null);
    }
  };

  const handleTriggerDrill = () => {
    addLog("System [ALERT]: Security containment drill triggered by user!");
    addLog("System [ALERT]: Isolating operational analytics projects sandboxes...");
    setActiveAlertsCount(prev => prev + 1);
    
    // Set all specialists to Analyzing/Alert
    setSpecialists(prev => prev.map(s => {
      if (s.id === "sentinel-threat-spec") return { ...s, status: "ALERT", logs: ["Sentinel [WARNING]: High threat alert containment in progress!", ...s.logs] };
      return { ...s, status: "ANALYZING" };
    }));
  };

  const handleResetTelemetry = () => {
    addLog("System: Telemetry counters successfully recycled and audited.");
    setActiveAlertsCount(0);
    setSpecialists(INITIAL_SPECIALISTS);
  };

  const handleAtlasSimulate = async (customQuery?: string) => {
    const targetQuery = customQuery || atlasQuery;
    if (!targetQuery.strip || isAtlasRunning) {
      // Basic check if it is somehow called with non-strings
      if (typeof targetQuery !== "string" || !targetQuery.trim()) return;
    }
    
    const queryStr = typeof targetQuery === "string" ? targetQuery : atlasQuery;
    if (!queryStr.trim()) return;

    setIsAtlasRunning(true);
    setAtlasResult(null);
    setActiveTimelineStage("analyzing");
    setActiveAtlasStepIndex(-1);
    setAtlasStageLogs(["[SYSTEM]: Connecting to Atlas supervisor gateway on port_3000..."]);

    addLog(`Atlas: Dispatched multi-agent orchestration for query: "${queryStr}"`);

    try {
      const response = await fetch("/api/v1/atlas/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryStr })
      });

      if (!response.ok) {
        throw new Error(`Orchestrator returned unhealthy status code: ${response.status}`);
      }

      const data = await response.json();

      // Stage 1: Analyzing
      setTimeout(() => {
        setActiveTimelineStage("planning");
        setAtlasStageLogs(prev => [
          ...prev,
          `[ANALYZING] Classifying user intent. Found match: ${data.intent.toUpperCase()} (Confidence: ${(data.confidence * 100).toFixed(1)}%)`,
          `[ANALYZING] Checking isolation boundaries for current tenant [Acme Aerospace]`
        ]);

        // Stage 2: Planning
        setTimeout(() => {
          setActiveTimelineStage("selection");
          setAtlasStageLogs(prev => [
            ...prev,
            `[PLANNING] Structuring execution flow matrix. Built ${data.plan_steps.length} sequential operations.`,
            `[PLANNING] Allocating process telemetry locks on Postgres nodes...`
          ]);

          // Stage 3: Selection
          setTimeout(() => {
            setActiveTimelineStage("executing");
            setAtlasStageLogs(prev => [
              ...prev,
              `[SELECTION] Assigned specialist nodes: ${data.selected_specialists.join(", ")}`,
              `[SELECTION] Handshaking secure RPC streams...`
            ]);

            // Stage 4: Execution
            let stepIdx = 0;
            const runNextStep = () => {
              if (stepIdx < data.plan_steps.length) {
                const currentStep = data.plan_steps[stepIdx];
                setActiveAtlasStepIndex(stepIdx);

                const specOutput = data.specialist_outputs[currentStep.specialist_name];
                const specLogs = specOutput ? specOutput.logs || [] : [];
                const explanation = specOutput ? specOutput.explanation : currentStep.description;

                setAtlasStageLogs(prev => {
                  const newLogs = [
                    ...prev,
                    `[EXECUTING] Step ${currentStep.step_number}/${data.plan_steps.length}: Dispatching [${currentStep.specialist_name.toUpperCase()}] for Task: ${currentStep.task}`,
                    `[${currentStep.specialist_name.toUpperCase()}] Output: "${explanation}"`
                  ];
                  specLogs.forEach((l: string) => {
                    newLogs.push(`  | ${l}`);
                  });
                  newLogs.push(`[EXECUTING] Step ${currentStep.step_number} finished with status [SUCCESS]`);
                  return newLogs;
                });

                stepIdx++;
                setTimeout(runNextStep, 1000);
              } else {
                // Stage 5: Aggregating
                setActiveTimelineStage("aggregating");
                setActiveAtlasStepIndex(-1);
                setAtlasStageLogs(prev => [
                  ...prev,
                  `[AGGREGATING] Collecting process stream reports from specialized nodes...`,
                  `[AGGREGATING] Consolidating findings and building remediation schema...`
                ]);

                // Stage 6: Completed
                setTimeout(() => {
                  setActiveTimelineStage("completed");
                  setAtlasResult(data);
                  setIsAtlasRunning(false);
                  setAtlasStageLogs(prev => [
                    ...prev,
                    `[SUCCESS] Multi-agent orchestration completed. Executive report deployed below.`,
                    `[SYSTEM] Supervisor standing by.`
                  ]);
                  addLog("Atlas: Orchestration successfully completed. Synthesis report compiled.");
                }, 1000);
              }
            };

            setTimeout(runNextStep, 800);

          }, 1000);
        }, 1000);
      }, 1000);

    } catch (err: any) {
      setAtlasStageLogs(prev => [
        ...prev,
        `[CRITICAL FAILURE] Pipeline execution crashed: ${err.message}`
      ]);
      setIsAtlasRunning(false);
      setActiveTimelineStage("idle");
      addLog(`Atlas [ERROR]: Orchestration failed: ${err.message}`);
    }
  };

  // Autoscroll helper for Atlas logs
  useEffect(() => {
    const el = document.getElementById("atlas-terminal-logs");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [atlasStageLogs]);

  if (activeTab === "Landing") {
    return (
      <LandingPage
        onLaunchPlatform={() => {
          setActiveTab("Dashboard");
          addLog("Landing: Launched Orixa Operator Console");
        }}
        onViewArchitecture={() => {
          setActiveTab("Architecture");
          addLog("Landing: Navigated to Core Architecture Map");
        }}
        onRunDemo={() => {
          setActiveTab("Demo");
          addLog("Landing: Initiated High-Fidelity Demo Playground");
        }}
      />
    );
  }

  if (activeTab === "Architecture") {
    return (
      <ArchitecturePage
        onBack={() => {
          setActiveTab("Landing");
          addLog("Architecture: Returned to Landing Page");
        }}
        onLaunchPlatform={() => {
          setActiveTab("Dashboard");
          addLog("Architecture: Launched Orixa Operator Console");
        }}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/20 selection:text-blue-400 font-sans antialiased">
      
      {/* 1. Global Platform Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-indigo-400/20">
            <span className="text-xl tracking-tighter font-display">Ω</span>
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-zinc-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">ORIXA</h1>
              <span className="text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                ACTIVE
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-display font-semibold">
              Enterprise Intelligence Operating System
            </p>
          </div>
        </div>

        {/* Global Telemetry Bar */}
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all">
            <Server className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-zinc-500 font-sans font-medium text-[10px]">HOST:</span>
            <span className="text-zinc-300 font-medium">port_3000/ingress</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-zinc-500 font-sans font-medium text-[10px]">POSTGRES:</span>
            <span className="text-blue-400 font-semibold">{databasePoolSize} POOL</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-zinc-500 font-sans font-medium text-[10px]">DATAHUB:</span>
            <span className={isDataHubConnected ? "text-indigo-400 font-semibold animate-pulse" : "text-amber-500 font-semibold"}>
              {isDataHubConnected ? "SYNCED" : "STANDBY"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                realTimeStatus === "Connected" ? "bg-emerald-400" : realTimeStatus === "Reconnecting" ? "bg-amber-400 animate-pulse" : "bg-red-400"
              } opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                realTimeStatus === "Connected" ? "bg-emerald-500" : realTimeStatus === "Reconnecting" ? "bg-amber-500" : "bg-red-500"
              }`}></span>
            </span>
            <span className="text-zinc-500 font-sans font-medium text-[10px]">LIVE SYNC:</span>
            <span className={`font-semibold ${
              realTimeStatus === "Connected" ? "text-emerald-400 font-semibold" : realTimeStatus === "Reconnecting" ? "text-amber-400 animate-pulse font-semibold" : "text-red-400 font-semibold"
            }`}>
              {realTimeStatus.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-500 font-sans font-medium text-[10px]">USER ROLE:</span>
            <span className="text-white font-bold">{userRole}</span>
          </div>

          <button
            onClick={() => {
              setIsAboutOpen(true);
              addLog("Console: Opened Platform About specifications modal");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
          >
            <Info className="h-3.5 w-3.5" /> ABOUT PLATFORM
          </button>
        </div>
      </header>

      {/* 2. Main Platform Grid */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Navigation Left Rail */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <div className="text-[11px] font-sans font-bold tracking-wider text-zinc-500 uppercase px-3">
              Operational Engines
            </div>             <nav className="space-y-1">
              {[
                { name: "Landing", badge: "Home" },
                { name: "Architecture", badge: "Diag" },
                { name: "Dashboard", badge: "Live" },
                { name: "Map", badge: "Topology" },
                { name: "Atlas", badge: "Supervisor" },
                { name: "Context", badge: "Catalog" },
                { name: "Investigations", badge: activeAlertsCount > 0 ? `${activeAlertsCount}!` : undefined },
                { name: "Decision", badge: "Audit" },
                { name: "Specialists", badge: "8" },
                { name: "Knowledge", badge: "Core" },
                { name: "Memory", badge: "Archive" },
                { name: "Predictions", badge: "Beta" },
                { name: "Demo", badge: "New" },
                { name: "Replay", badge: "Mission" },
                { name: "Settings", badge: undefined }
              ].map((tab) => (
                <button
                  id={`nav-${tab.name.toLowerCase()}`}
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name as any);
                    addLog(`Navigation: Accessed module context -> ${tab.name}`);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between cursor-pointer border ${
                    activeTab === tab.name
                      ? "bg-zinc-900 border-indigo-500/30 text-white font-semibold shadow-[0_2px_8px_-2px_rgba(99,102,241,0.2)] border-l-2 border-l-indigo-500"
                      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 hover:border-zinc-900"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {tab.name === "Landing" && <Globe className="h-4 w-4 text-indigo-400" />}
                    {tab.name === "Architecture" && <Layers className="h-4 w-4 text-purple-400" />}
                    {tab.name === "Dashboard" && <Activity className="h-4 w-4" />}
                    {tab.name === "Map" && <Network className="h-4 w-4 text-cyan-400" />}
                    {tab.name === "Atlas" && <Brain className="h-4 w-4 text-indigo-400" />}
                    {tab.name === "Context" && <Search className="h-4 w-4 text-blue-400" />}
                    {tab.name === "Investigations" && <Shield className="h-4 w-4" />}
                    {tab.name === "Decision" && <CheckCircle className="h-4 w-4 text-indigo-400" />}
                    {tab.name === "Specialists" && <Cpu className="h-4 w-4" />}
                    {tab.name === "Knowledge" && <Database className="h-4 w-4" />}
                    {tab.name === "Memory" && <Layers className="h-4 w-4 text-emerald-400" />}
                    {tab.name === "Predictions" && <TrendingUp className="h-4 w-4" />}
                    {tab.name === "Demo" && <Sparkles className="h-4 w-4 text-amber-400" />}
                    {tab.name === "Replay" && <Play className="h-4 w-4 text-cyan-400" />}
                    {tab.name === "Settings" && <Sliders className="h-4 w-4" />}
                    {tab.name === "Landing" ? "Product Landing" : tab.name === "Architecture" ? "System Architecture" : tab.name === "Context" ? "Context Explorer" : tab.name === "Memory" ? "Organizational Memory" : tab.name === "Demo" ? "Demo Mode" : tab.name === "Replay" ? "Incident Replay" : tab.name === "Map" ? "Intelligence Map" : tab.name === "Decision" ? "Decision Center" : tab.name}
                  </span>
                  {tab.badge && (
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${
                      tab.badge.endsWith("!") 
                        ? "bg-red-500/10 text-red-400 border-red-500/20 font-bold animate-pulse" 
                        : activeTab === tab.name 
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                          : "bg-zinc-900/80 text-zinc-500 border-zinc-900"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Infrastructure status indicators */}
          <div className="space-y-4 pt-5 border-t border-zinc-800/60">
            <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/80 text-xs font-mono space-y-2.5 shadow-inner">
              <div className="text-zinc-500 text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                DOCKER_CONTAINERS
              </div>
              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div className="flex justify-between">
                  <span>postgres_db</span>
                  <span className="text-blue-400 font-semibold">UP</span>
                </div>
                <div className="flex justify-between">
                  <span>redis_cache</span>
                  <span className="text-blue-400 font-semibold">UP</span>
                </div>
                <div className="flex justify-between">
                  <span>orixa_backend</span>
                  <span className="text-blue-400 font-semibold">UP</span>
                </div>
                <div className="flex justify-between">
                  <span>orixa_frontend</span>
                  <span className="text-blue-400 font-semibold">UP</span>
                </div>
              </div>
            </div>

            <div className="px-2">
              <div className="text-[10px] text-zinc-500 font-sans font-bold tracking-wider uppercase">
                DECRYPT_KEY_SALT:
              </div>
              <div className="text-[10px] text-zinc-400 font-mono truncate bg-zinc-950 px-2 py-1.5 rounded-lg mt-1.5 border border-zinc-800/80 shadow-inner">
                AES_256_GCM_SHA_X8
              </div>
            </div>
          </div>
        </aside>

        {/* 3. Center Dashboard Display Panel */}
        <main className="flex-1 p-6 lg:p-8 bg-zinc-950 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              
              {/* DASHBOARD TAB */}
              {activeTab === "Dashboard" && (
                <div className="space-y-8" id="enterprise-dashboard-layer">
                  
                  {/* Top Executive Actions Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                    <div>
                      <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
                        Enterprise Intelligence Operating System
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1 font-sans">
                        Tactical live dashboard displaying microservice health, cognitive map topologies, and active sandboxes.
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={handleTriggerDrill}
                        className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm shadow-red-500/5"
                      >
                        <Shield className="h-3.5 w-3.5" /> TRIGGER LOCKDOWN DRILL
                      </button>
                      <button 
                        onClick={handleResetTelemetry}
                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-bold hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm"
                      >
                        <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" /> RE-AUDIT TELEMETRY
                      </button>
                    </div>
                  </div>

                  {/* 1. Executive Dashboard (KPIs, Smart Welcome, Live Activity Feed) */}
                  <ExecutiveDashboard
                    specialistsCount={specialists.length}
                    activeAlertsCount={activeAlertsCount}
                    databasePoolSize={databasePoolSize}
                    isDataHubConnected={isDataHubConnected}
                    addLog={addLog}
                  />

                  {/* Atlas Operations Console */}
                  <div className="pt-4">
                    <AtlasOperationsConsole 
                      addLog={addLog}
                      onNavigateTab={setActiveTab}
                      liveState={liveAtlasState}
                      realTimeStatus={realTimeStatus}
                    />
                  </div>

                  {/* 2. Enterprise Intelligence Map (Miniature on Dashboard) */}
                  <div className="pt-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-zinc-900 pb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                          <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase font-bold">
                            Enterprise Intelligence Topology
                          </h3>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
                          Miniature visual mapping representing multi-agent coordination pipelines.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("Map");
                          addLog("Navigation: Launched full Enterprise Intelligence Topology map.");
                        }}
                        className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-all border border-cyan-900/30 bg-cyan-950/20 px-2.5 py-1.5 rounded-lg cursor-pointer shrink-0"
                      >
                        Open Full Map →
                      </button>
                    </div>
                    <EnterpriseIntelligenceMap
                      isAtlasRunning={isAtlasRunning}
                      addLog={addLog}
                      miniature={true}
                      onOpenFullMap={() => {
                        setActiveTab("Map");
                        addLog("Navigation: Launched full Enterprise Intelligence Topology map via quick overlay.");
                      }}
                    />
                  </div>

                  {/* 3. Advanced Diagnostic Command Center */}
                  <div className="border-t border-zinc-900 pt-8 space-y-4">
                    <div>
                      <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-widest font-bold">
                        Advanced Diagnostics Command Center
                      </h3>
                      <p className="text-xs text-zinc-500 font-sans mt-0.5">
                        Deep inspection of isolated workspace sandboxes, connection pools, and container sockets.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Active Sandboxes List */}
                      <div className="p-6 bg-zinc-900/15 border border-zinc-900/60 rounded-xl space-y-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
                          <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                            <Server className="h-4 w-4 text-blue-400" /> Isolated Sandboxes
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80">
                            ORG_ID: ACME-AERO
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 flex items-center justify-between hover:border-blue-500/20 transition-all duration-300">
                            <div className="space-y-1">
                              <div className="text-xs font-bold text-zinc-200">Alpha Ingress Log Sandbox</div>
                              <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
                                <span className="text-blue-400 font-semibold">ACTIVE</span>
                                <span>•</span>
                                <span>POSTGRESQL</span>
                                <span>•</span>
                                <span>REQS: 4,001</span>
                              </div>
                            </div>
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6]" />
                          </div>

                          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 flex items-center justify-between hover:border-blue-500/20 transition-all duration-300">
                            <div className="space-y-1">
                              <div className="text-xs font-bold text-zinc-200">Beta Outage Risks Sandbox</div>
                              <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
                                <span className="text-blue-400 font-semibold">ACTIVE</span>
                                <span>•</span>
                                <span>REDIS</span>
                                <span>•</span>
                                <span>REQS: 914</span>
                              </div>
                            </div>
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6]" />
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            addLog("System: Creating new project sandbox: Project Gamma [Ready]");
                            addLog("System: Schema maps and indexes initialized successfully for Project Gamma");
                          }}
                          className="w-full text-left text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-all duration-200 cursor-pointer pt-1"
                        >
                          + Allocate New Sandbox Workspace <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Diagnostic Raw Console Heartbeats */}
                      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono border-b border-zinc-900 pb-2.5">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5 text-zinc-400" /> Heartbeat Monitor
                          </span>
                          <span className="text-zinc-600 font-bold uppercase">BUFFER LIMIT</span>
                        </div>
                        <div className="h-44 overflow-y-auto font-mono text-[10px] space-y-2 text-zinc-400 scrollbar-thin scrollbar-thumb-zinc-900 pr-2">
                          {consoleLogs.map((log, index) => (
                            <div key={index} className="flex gap-2 leading-relaxed">
                              <span className="text-zinc-600 shrink-0">[{13 - index}]</span>
                              <span className={`break-all ${
                                log.includes("[ALERT]") ? "text-red-400 font-semibold bg-red-950/20 px-1 py-0.5 rounded" : 
                                log.includes("[WARN]") ? "text-yellow-400 font-medium" :
                                log.includes("Sentry-X") ? "text-blue-400" :
                                log.includes("Anomalist") ? "text-cyan-400" : "text-zinc-300"
                              }`}>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Connection Pools & Integration Switch */}
                      <div className="p-6 bg-zinc-900/15 border border-zinc-900/60 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
                          <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                            <Database className="h-4 w-4 text-blue-400" /> Connection Pools
                          </h4>
                        </div>

                        <div className="space-y-3.5">
                          <div>
                            <div className="flex justify-between text-zinc-400 font-mono text-[10px] mb-1.5">
                              <span>Connection Pool load factor</span>
                              <span className="text-white font-bold">{databasePoolSize} / 20 pools</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 shadow-sm" 
                                style={{ width: `${(databasePoolSize / 20) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-lg border border-zinc-900 font-mono text-[10px]">
                            <span className="text-zinc-500 font-sans font-semibold">ADJUST POOL SIZE:</span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => {
                                  if (databasePoolSize < 20) {
                                    setDatabasePoolSize(p => p + 1);
                                    addLog("System: Scaled up postgres SQL connection pools [+1]");
                                  }
                                }}
                                className="w-6 h-6 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded cursor-pointer transition-all"
                              >
                                +
                              </button>
                              <button 
                                onClick={() => {
                                  if (databasePoolSize > 1) {
                                    setDatabasePoolSize(p => p - 1);
                                    addLog("System: Scaled down postgres SQL connection pools [-1]");
                                  }
                                }}
                                className="w-6 h-6 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded cursor-pointer transition-all"
                              >
                                -
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2 bg-zinc-950 rounded-xl border border-zinc-900 text-[11px] font-sans">
                            <span className="text-zinc-400 font-mono pl-1">DataHub Sync Gateway</span>
                            <button 
                              onClick={() => {
                                setIsDataHubConnected(!isDataHubConnected);
                                addLog(`System: DataHub sync gateway toggled to ${!isDataHubConnected ? "ACTIVE" : "STANDBY"}`);
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer transition-all ${
                                isDataHubConnected 
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                                  : "bg-zinc-900 text-zinc-500 border-zinc-800"
                              }`}
                            >
                              {isDataHubConnected ? "SYNCHRONIZED" : "STANDBY"}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* INVESTIGATIONS TAB */}
              {activeTab === "Investigations" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">Operational Security Investigations</h2>
                    <p className="text-sm text-zinc-400 mt-1 font-sans">Review anomalies detected within isolated sandboxes and execute containment drills.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-red-950/10 border border-red-900/30 rounded-xl space-y-2.5">
                      <div className="text-[10px] text-red-400 font-mono tracking-wider uppercase font-semibold">Active Incidents</div>
                      <div className="text-3xl font-bold text-white font-mono tracking-tight">0</div>
                      <p className="text-xs text-zinc-400">Zero active security breaches in isolated operational boundaries.</p>
                    </div>

                    <div className="p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-2.5 backdrop-blur-sm">
                      <div className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase font-semibold">Contained Drills Executed</div>
                      <div className="text-3xl font-bold text-white font-mono tracking-tight">{activeAlertsCount}</div>
                      <p className="text-xs text-zinc-400">Containment verification loops launched by security administrators.</p>
                    </div>

                    <div className="p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-2.5 backdrop-blur-sm">
                      <div className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase font-semibold">Sandbox Isolation Status</div>
                      <div className="text-3xl font-bold text-blue-400 font-mono tracking-tight">100%</div>
                      <p className="text-xs text-zinc-400">All analytics projects currently insulated with active SQL triggers.</p>
                    </div>
                  </div>

                  {/* Simulated Incident Log */}
                  <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-400" /> Active Containment Log and Audit Trail
                      </h3>
                      <span className="text-xs font-mono text-zinc-500">AUDIT_MODE: BLOCKING</span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-4 bg-red-950/15 rounded-xl border border-red-900/35 flex items-start gap-3.5">
                        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">[AUDIT WARNING] Sandbox drill initialized</span>
                            <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-semibold border border-red-500/20">SIMULATION</span>
                          </div>
                          <p className="text-zinc-400 leading-relaxed">Operator triggered database lockdown drill simulation to verify project boundaries isolation.</p>
                          <div className="text-[10px] text-zinc-500">2026-07-13T03:37:38Z • CORRELATION_ID: f8a123-db-contain</div>
                        </div>
                      </div>

                      <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/80 flex items-start gap-3.5">
                        <CheckCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">[OK] Filesystem Integrity audit check passed</span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-500/20">SENTRY</span>
                          </div>
                          <p className="text-zinc-400 leading-relaxed">Anomalist successfully verified filesystem configuration tables across organization tenant Acme Aerospace.</p>
                          <div className="text-[10px] text-zinc-500">2026-07-13T03:35:10Z • CORRELATION_ID: a92b34-fs-verify</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* ATLAS SUPERVISOR TAB */}
              {activeTab === "Atlas" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 flex items-center gap-2">
                        <Brain className="h-6 w-6 text-indigo-400 animate-pulse" /> Atlas Supervisor Orchestration Engine
                      </h2>
                      <p className="text-sm text-zinc-400 mt-1 font-sans">
                        Input operational threats or natural language queries. Atlas plans, selects specialized AI agents, manages execution sequences, and synthesizes consolidated solutions.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-900 text-zinc-400 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-bold">SUPERVISOR READY</span>
                    </div>
                  </div>

                  {/* Operational Entry Panel */}
                  <div className="p-6 bg-zinc-900/10 border border-zinc-900 rounded-2xl space-y-5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 uppercase tracking-widest font-display font-bold flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Enter Operational Threat Alert or Natural Language Request
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={atlasQuery}
                          onChange={(e) => setAtlasQuery(e.target.value)}
                          placeholder="Describe the operational incident or security threat context..."
                          className="flex-1 bg-zinc-950 border border-zinc-900 focus:border-indigo-500/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                          disabled={isAtlasRunning}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAtlasSimulate();
                          }}
                        />
                        <button
                          onClick={() => handleAtlasSimulate()}
                          disabled={isAtlasRunning || !atlasQuery.trim()}
                          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md shadow-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                          {isAtlasRunning ? (
                            <>
                              <Loader className="h-4 w-4 animate-spin" /> ORCHESTRATING...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" /> DISPATCH ATLAS
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Scenario presets */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-display font-extrabold block">
                        Quick-Launch Scenario Playbooks (Multi-Agent Blueprints)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          {
                            label: "Schema drift & downstream failures",
                            query: "A schema change caused downstream failures."
                          },
                          {
                            label: "Intrusion threat scanner on staging",
                            query: "An unauthorized intrusion threat was detected on sandbox Project Alpha."
                          },
                          {
                            label: "Scan database for unencrypted CCPA PII",
                            query: "Verify database compliance rating and scan unencrypted sensitive attributes."
                          },
                          {
                            label: "Connection starvation prediction",
                            query: "Check physical route topologies and forecast connection starvation bottlenecks."
                          }
                        ].map((scenario, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setAtlasQuery(scenario.query);
                              handleAtlasSimulate(scenario.query);
                            }}
                            disabled={isAtlasRunning}
                            className="p-3.5 bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl text-left transition-all duration-200 cursor-pointer text-xs font-sans flex items-center justify-between group disabled:opacity-50"
                          >
                            <span className="text-zinc-300 group-hover:text-indigo-400 transition-colors truncate pr-2 font-medium">
                              {scenario.label}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500 group-hover:text-indigo-400 group-hover:border-indigo-500/20 shrink-0 uppercase tracking-widest border border-zinc-900 px-2 py-0.5 rounded bg-zinc-950 transition-all">
                              SIMULATE
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Orchestration Interface Grid */}
                  {(isAtlasRunning || atlasResult) && (
                    <div className="space-y-6">
                      <style dangerouslySetInnerHTML={{__html: `
                        @keyframes dash {
                          to {
                            stroke-dashoffset: -20;
                          }
                        }
                        .animate-dash {
                          animation: dash 3s linear infinite;
                        }
                      `}} />

                      {/* Check if active run is NOT completed, display live running stream split screen */}
                      {activeTimelineStage !== "completed" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* Left Column: Visual Stepper Pipeline (5 Cols) */}
                          <div className="lg:col-span-5 p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-6 backdrop-blur-md">
                            <div className="border-b border-zinc-800/80 pb-3 flex items-center justify-between">
                              <h3 className="font-semibold text-white text-sm flex items-center gap-2 font-display">
                                <Layers className="h-4 w-4 text-indigo-400" /> Orchestration Sequence
                              </h3>
                              <span className="text-[10px] font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/5 border border-indigo-500/10 uppercase tracking-wider">
                                {activeTimelineStage}
                              </span>
                            </div>

                            {/* Pipeline Stepper */}
                            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800/60">
                              
                              {/* Step 1: Intent Analysis */}
                              <div className="flex gap-4 items-start relative z-10">
                                <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                                  activeTimelineStage === "analyzing" 
                                    ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)] font-bold"
                                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                                }`}>
                                  {activeTimelineStage !== "analyzing" ? <Check className="h-3 w-3" /> : "1"}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs font-semibold text-white">Intent Classification & Parsing</div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                                    Natural language parsing to deduce problem vectors and organizational context.
                                  </p>
                                </div>
                              </div>

                              {/* Step 2: Strategic Planning */}
                              <div className="flex gap-4 items-start relative z-10">
                                <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                                  activeTimelineStage === "planning" 
                                    ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)] font-bold"
                                    : activeTimelineStage !== "analyzing" && activeTimelineStage !== "planning"
                                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-500"
                                }`}>
                                  {activeTimelineStage !== "analyzing" && activeTimelineStage !== "planning" ? <Check className="h-3 w-3" /> : "2"}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs font-semibold text-white">Strategic Task Planning</div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                                    Structuring a structured, execution flow of chronological agent dispatches.
                                  </p>
                                </div>
                              </div>

                              {/* Step 3: Specialist Selection */}
                              <div className="flex gap-4 items-start relative z-10">
                                <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                                  activeTimelineStage === "selection" 
                                    ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)] font-bold"
                                    : activeTimelineStage !== "analyzing" && activeTimelineStage !== "planning" && activeTimelineStage !== "selection"
                                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-500"
                                }`}>
                                  {activeTimelineStage !== "analyzing" && activeTimelineStage !== "planning" && activeTimelineStage !== "selection" ? <Check className="h-3 w-3" /> : "3"}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs font-semibold text-white">AI Fleet Enrollment</div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                                    Selecting domain specialists matching capabilities requested by strategic steps.
                                  </p>
                                </div>
                              </div>

                              {/* Step 4: Specialist Execution */}
                              <div className="flex gap-4 items-start relative z-10">
                                <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                                  activeTimelineStage === "executing" 
                                    ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)] font-bold"
                                    : activeTimelineStage === "aggregating"
                                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-500"
                                }`}>
                                  {activeTimelineStage === "aggregating" ? <Check className="h-3 w-3" /> : "4"}
                                </div>
                                <div className="space-y-2.5 w-full">
                                  <div className="space-y-1">
                                    <div className="text-xs font-semibold text-white">Chronological Execution Matrix</div>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                                      Synchronous specialist task dispatch loops inside sandbox isolation wrappers.
                                    </p>
                                  </div>

                                  {/* Step checklists */}
                                  <div className="bg-zinc-950 border border-zinc-800/80 p-3 rounded-xl space-y-2 mt-1 font-mono">
                                    {((isAtlasRunning && activeTimelineStage === "executing")) ? (
                                      [
                                        { step_number: 1, specialist_name: "Sentinel", task: "Log/Threat Inspection", description: "Query security telemetry indexes" },
                                        { step_number: 2, specialist_name: "Architect", task: "Schema DDL Extraction", description: "Trace active table dependencies" },
                                        { step_number: 3, specialist_name: "Oracle", task: "Downstream Impact Prediction", description: "Assess semantic network graphs" }
                                      ].map((step: any, sIdx: number) => {
                                        const isCurrent = activeAtlasStepIndex === sIdx;
                                        const isPassed = activeAtlasStepIndex > sIdx;
                                        return (
                                          <div 
                                            key={sIdx} 
                                            className={`p-2 rounded-lg border text-[11px] transition-all flex items-start gap-2.5 ${
                                              isCurrent 
                                                ? "bg-indigo-500/5 border-indigo-500/40 text-white animate-pulse" 
                                                : isPassed 
                                                ? "bg-zinc-900/40 border-zinc-800/60 text-zinc-300"
                                                : "bg-transparent border-transparent text-zinc-600"
                                            }`}
                                          >
                                            <div className={`h-4 w-4 rounded-full border text-[9px] flex items-center justify-center shrink-0 ${
                                              isCurrent 
                                                ? "bg-indigo-500 border-indigo-400 text-white font-bold"
                                                : isPassed 
                                                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                                : "bg-zinc-900 border-zinc-800 text-zinc-600"
                                            }`}>
                                              {isPassed ? <Check className="h-2 w-2" /> : step.step_number}
                                            </div>
                                            <div className="space-y-0.5">
                                              <div className="font-bold flex items-center gap-1.5 font-mono">
                                                <span className={isCurrent ? "text-indigo-400" : isPassed ? "text-zinc-300" : "text-zinc-600"}>
                                                  {step.specialist_name.toUpperCase()}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 font-normal">({step.task})</span>
                                              </div>
                                              <p className="text-[10px] text-zinc-400 font-sans">{step.description}</p>
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="text-[10px] text-zinc-600 text-center py-2 italic font-sans">Waiting for planning matrix...</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Step 5: Aggregating */}
                              <div className="flex gap-4 items-start relative z-10">
                                <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                                  activeTimelineStage === "aggregating" 
                                    ? "bg-indigo-500 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.3)] font-bold"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-500"
                                }`}>
                                  5
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs font-semibold text-white">Consolidation & Core Synthesis</div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                                    Resolving operational conflicts, merging schemas, and scoring hazard levels.
                                  </p>
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Right Column: Console Telemetry Stream (7 Cols) */}
                          <div className="lg:col-span-7 space-y-6">
                            <div className="p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-3 backdrop-blur-md">
                              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-red-500/70" />
                                    <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                                    <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                                  </div>
                                  <span className="text-[11px] font-mono text-zinc-400">atlas_supervisor_process_logs.sh</span>
                                </div>
                                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded shadow-inner">
                                  LIVE STREAM
                                </span>
                              </div>

                              <div 
                                id="atlas-terminal-logs"
                                className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 font-mono text-xs text-zinc-300 h-96 overflow-y-auto space-y-2 pr-2 shadow-inner"
                              >
                                {atlasStageLogs.map((log, lIdx) => {
                                  let txtClass = "text-zinc-300";
                                  if (log.includes("[CRITICAL]") || log.includes("[FAILURE]")) txtClass = "text-red-400 font-semibold";
                                  else if (log.includes("[SUCCESS]")) txtClass = "text-emerald-400 font-semibold";
                                  else if (log.includes("[ANALYZING]")) txtClass = "text-blue-400";
                                  else if (log.includes("[PLANNING]")) txtClass = "text-indigo-400";
                                  else if (log.includes("[SELECTION]")) txtClass = "text-amber-400";
                                  else if (log.startsWith("  |")) txtClass = "text-zinc-500 pl-4";

                                  return (
                                    <div key={lIdx} className="leading-relaxed flex gap-2">
                                      <span className="text-zinc-700 shrink-0 select-none">&gt;</span>
                                      <span className={txtClass}>{log}</span>
                                    </div>
                                  );
                                })}
                                <div className="flex items-center gap-2 text-zinc-500">
                                  <span className="text-zinc-700 select-none">&gt;</span>
                                  <span className="animate-pulse text-indigo-400">●</span>
                                  <span className="italic text-[11px] animate-pulse font-sans text-zinc-500">Streaming active multi-agent orchestrator frames...</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      ) : (
                        
                        /* ==========================================
                           COMPLETED STATE: FULL-WIDTH DEMO-CENTERPIECE
                           ========================================== */
                        <div className="space-y-6">
                          
                          {/* 1. Header Meta Panel */}
                          <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 border border-indigo-500/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg shadow-indigo-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full filter blur-3xl" />
                            <div className="space-y-1.5 relative z-10">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
                                  INVESTIGATION FILE #ORX-824A
                                </span>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">RESOLVED</span>
                              </div>
                              <h3 className="text-lg font-bold font-display text-white tracking-wide flex items-center gap-2">
                                <Brain className="h-5 w-5 text-indigo-400" /> Executive Remediation Workspace
                              </h3>
                              <p className="text-xs text-zinc-400 font-sans">
                                Trace ID: <span className="font-mono text-zinc-300">{atlasResult?.session_id || "f8a123-db-contain"}</span> • Federated diagnostic complete in <span className="text-emerald-400 font-bold">2,450ms</span> under Gemini Enterprise boundaries.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2.5 relative z-10 shrink-0">
                              <div className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5" /> HAZARD: {atlasResult?.recommendation?.risk_level?.toUpperCase() || "HIGH"}
                              </div>
                              <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5" /> CONFIDENCE: {((atlasResult?.recommendation?.confidence_score || 0.95) * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>

                          {/* 2. Flagship Linage Drift Visualization */}
                          <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl space-y-4">
                            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <h4 className="text-sm font-semibold text-white font-display flex items-center gap-2">
                                  <Network className="h-4.5 w-4.5 text-blue-400" /> Federated DataHub Asset Lineage & Drift Analysis
                                </h4>
                                <p className="text-xs text-zinc-400 font-sans">Visual trace of mutated schemas, active dependencies, and failed downstream BI metrics</p>
                              </div>
                              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded">
                                DATAHUB STATUS: SYNCED
                              </span>
                            </div>

                            {/* Node flow diagram */}
                            <div className="relative w-full overflow-hidden bg-zinc-950/80 rounded-xl border border-zinc-900 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 shadow-inner">
                              
                              {/* Node 1: Source */}
                              <div className="flex flex-col items-center text-center p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 w-full md:w-52 relative z-10">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                  <Database className="h-5 w-5" />
                                </div>
                                <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 mb-1">UPSTREAM CATALOG</span>
                                <span className="text-xs font-semibold text-white truncate max-w-full font-mono">sales_raw_postgres</span>
                                <span className="text-[10px] text-zinc-500 font-sans mt-1">MySQL/Postgres • Sales Domain</span>
                              </div>

                              {/* Line 1 */}
                              <div className="hidden md:block flex-1 relative h-6">
                                <svg className="w-full h-full" overflow="visible">
                                  <path
                                    d="M 0 10 L 100 10"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2.5"
                                    strokeDasharray="5 5"
                                    className="animate-dash"
                                    style={{ strokeDashoffset: 100 }}
                                  />
                                </svg>
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-emerald-400 font-semibold bg-zinc-950 px-2 py-0.5 rounded border border-emerald-500/10">
                                  INGEST_OK
                                </span>
                              </div>

                              {/* Node 2: Spark Drift */}
                              <div className="flex flex-col items-center text-center p-4 bg-zinc-900/40 rounded-xl border border-red-500/30 w-full md:w-56 relative z-10 shadow-[0_0_20px_rgba(239,68,68,0.03)] animate-pulse">
                                <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                                  <Sliders className="h-5 w-5" />
                                </div>
                                <span className="text-[9px] font-mono font-bold text-red-400 tracking-wider uppercase bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 mb-1 flex items-center gap-1">
                                  <AlertTriangle className="h-2.5 w-2.5" /> CRITICAL DRIFT
                                </span>
                                <span className="text-xs font-semibold text-white truncate max-w-full font-mono">pyspark_daily_agg</span>
                                <span className="text-[10px] text-red-400 font-mono mt-1">column "amount": float -&gt; varchar</span>
                              </div>

                              {/* Line 2 */}
                              <div className="hidden md:block flex-1 relative h-6">
                                <svg className="w-full h-full" overflow="visible">
                                  <path
                                    d="M 0 10 L 100 10"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="2.5"
                                    strokeDasharray="5 5"
                                    className="animate-dash"
                                    style={{ strokeDashoffset: 100 }}
                                  />
                                </svg>
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-red-400 font-semibold bg-zinc-950 px-2 py-0.5 rounded border border-red-500/10">
                                  CAST_FAIL
                                </span>
                              </div>

                              {/* Node 3: Target */}
                              <div className="flex flex-col items-center text-center p-4 bg-zinc-900/40 rounded-xl border border-amber-500/20 w-full md:w-52 relative z-10">
                                <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                  <TrendingUp className="h-5 w-5" />
                                </div>
                                <span className="text-[9px] font-mono font-bold text-amber-400 tracking-wider uppercase bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 mb-1">STALE METRIC</span>
                                <span className="text-xs font-semibold text-white truncate max-w-full font-mono">sales_dashboard_cube</span>
                                <span className="text-[10px] text-zinc-500 font-sans mt-1">Looker BI • Finance Domain</span>
                              </div>

                            </div>

                            {/* Catalog Asset Metadata Detail */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-xs font-sans">
                              <div>
                                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider mb-1">Asset Owner</span>
                                <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                                  <Users className="h-3.5 w-3.5 text-indigo-400" /> @crm-data-leads, @finance-bi
                                </span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider mb-1">Ecosystem Domain</span>
                                <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                                  <Globe className="h-3.5 w-3.5 text-blue-400" /> Sales Operations
                                </span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider mb-1">PII Classification</span>
                                <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                                  <Lock className="h-3.5 w-3.5 text-red-400" /> Certified PII Compliant
                                </span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider mb-1">Governance Tags</span>
                                <span className="text-zinc-200 font-semibold flex items-center gap-1 font-mono text-[10px]">
                                  <Tag className="h-3 w-3 text-amber-400" /> #CCPA-Scope, #bigquery, #reconciled
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 3. Splitted Bento Grid Layout */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            
                            {/* Left Column (5 Cols) - Live Orchestration Sequence & Specialists */}
                            <div className="lg:col-span-5 space-y-6">
                              
                              {/* Sequence Timeline */}
                              <div className="p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4">
                                <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-widest font-display flex items-center gap-1.5">
                                  <Layers className="h-3.5 w-3.5 text-indigo-400" /> Orchestration Sequence Timeline
                                </h4>
                                
                                <div className="space-y-3 font-sans text-xs relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                                  {[
                                    { label: "Investigation Request Received", desc: `Ingested query: "${atlasResult?.query}"` },
                                    { label: "Intent Routed & Classified", desc: `Routed to intent "SCHEMA_ALIGNMENT" (98% Confidence)` },
                                    { label: "DataHub Catalog Query", desc: "Federated search matched 1 dataset in Sales domain" },
                                    { label: "Organizational Memory Vector Search", desc: "Identified similar historical incidents" },
                                    { label: "AI Specialists Enrollment Completed", desc: "Assigned specialists: Atlas, Forge, Oracle" },
                                    { label: "Specialist Execution Successful", desc: "Executed audit_schema, estimate_drift_risk, DDL synthesis" },
                                    { label: "Gemini Synthesis Engine Active", desc: "Consolidated multi-agent outputs, computed root cause" },
                                    { label: "Playbooks & Report Compiled", desc: "Mitigation steps and safe-DDL migration templates generated" }
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start relative z-10 pl-1.5">
                                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(99,102,241,0.5)] shrink-0 mt-1" />
                                      <div className="space-y-0.5">
                                        <div className="font-semibold text-zinc-100">{item.label}</div>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Specialists Panel */}
                              <div className="p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4">
                                <div className="border-b border-zinc-800/80 pb-2 flex items-center justify-between">
                                  <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-widest font-display flex items-center gap-1.5">
                                    <Cpu className="h-3.5 w-3.5 text-indigo-400" /> AI Specialist Contributions
                                  </h4>
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase">3 Agents Enrolled</span>
                                </div>

                                <div className="space-y-3.5">
                                  {[
                                    {
                                      name: "Atlas Sentry",
                                      role: "Database Catalog Audits",
                                      desc: "Scanned table schemas against Master registry, isolated incompatible drift in pyspark_daily_agg column.",
                                      conf: 98,
                                      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"
                                    },
                                    {
                                      name: "Oracle Sentry",
                                      role: "Risk & Forecasting Sentry",
                                      desc: "Traced table lineages and connection vectors, forecast 100% downstream Looker pipeline failures.",
                                      conf: 94,
                                      avatar: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&q=80"
                                    },
                                    {
                                      name: "Forge Specialist",
                                      role: "Playbook Synthesis",
                                      desc: "Synthesized direct SQL migration scripts to correct column alignments and restore BI streams.",
                                      conf: 95,
                                      avatar: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=150&q=80"
                                    }
                                  ].map((spec, sIdx) => (
                                    <div key={sIdx} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 flex items-start gap-3">
                                      <img 
                                        src={spec.avatar} 
                                        alt={spec.name} 
                                        className="h-9 w-9 rounded-lg object-cover border border-zinc-800 shrink-0"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="truncate">
                                            <span className="text-xs font-bold text-white block">{spec.name}</span>
                                            <span className="text-[9px] text-zinc-500 block font-sans truncate">{spec.role}</span>
                                          </div>
                                          <span className="text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/10">
                                            {spec.conf}% CONF
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{spec.desc}</p>
                                        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                          <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500" style={{ width: `${spec.conf}%` }} />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Organizational Memory Match Panel */}
                              <div className="p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4">
                                <div className="border-b border-zinc-800/80 pb-2 flex items-center justify-between">
                                  <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-widest font-display flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Organizational Memory Search
                                  </h4>
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase">VECTOR RECALL</span>
                                </div>

                                <div className="space-y-3.5">
                                  {(atlasResult?.similar_incidents && atlasResult.similar_incidents.length > 0) ? (
                                    atlasResult.similar_incidents.map((inc: any, iIdx: number) => (
                                      <div key={iIdx} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-2 text-xs">
                                        <div className="flex items-start justify-between gap-2 border-b border-zinc-900 pb-1.5">
                                          <span className="font-bold text-zinc-200 block truncate">{inc.incident}</span>
                                          <span className="text-[9px] text-indigo-400 font-bold shrink-0 uppercase tracking-wider bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 font-mono">
                                            92% Match
                                          </span>
                                        </div>
                                        <div className="space-y-1 text-[11px]">
                                          <p className="text-zinc-400 leading-relaxed">
                                            <span className="text-zinc-500 font-bold uppercase text-[9px] block">Previous Outcome</span>
                                            {inc.final_outcome}
                                          </p>
                                          <p className="text-zinc-400 leading-relaxed">
                                            <span className="text-zinc-500 font-bold uppercase text-[9px] block">Lessons Learned</span>
                                            {inc.lessons_learned?.join(", ") || "Ensure downstream analytical variables are realigned during migrations."}
                                          </p>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    /* Preloaded Scenarios Fallback (Sprint 9 Requirement) */
                                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 space-y-2 text-xs">
                                      <div className="flex items-start justify-between gap-2 border-b border-zinc-900 pb-1.5">
                                        <span className="font-bold text-zinc-200 block truncate">Incident #482: Staging database type mismatch</span>
                                        <span className="text-[9px] text-indigo-400 font-bold shrink-0 uppercase tracking-wider bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 font-mono">
                                          92% Match
                                        </span>
                                      </div>
                                      <div className="space-y-1.5 text-[11px] font-sans">
                                        <div>
                                          <span className="text-zinc-500 font-bold uppercase text-[9px] block">Previous Outcome</span>
                                          <p className="text-zinc-300">Resolved successfully by introducing a DDL casting statement explicitly inside Spark pipeline wrappers.</p>
                                        </div>
                                        <div>
                                          <span className="text-zinc-500 font-bold uppercase text-[9px] block">Lessons Learned</span>
                                          <p className="text-zinc-300">Lock bigquery schema catalogs during daily analytical ingest runs to isolate drift prior to Looker dashboards refreshing.</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>

                            {/* Right Column (7 Cols) - Executive Diagnostics Report & Remediation Code */}
                            <div className="lg:col-span-7 space-y-6">
                              
                              {/* Executive Diagnosis & Synthesized Recommendation */}
                              <div className="p-6 bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-indigo-500/25 rounded-2xl space-y-5 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full filter blur-3xl -z-10" />
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-4">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-0.5 rounded">
                                      EXECUTIVE REPORT COMPRESSED
                                    </span>
                                    <h3 className="font-semibold text-white text-base font-display">Executive Diagnostics Synthesis</h3>
                                  </div>
                                </div>

                                <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-4.5 rounded-xl border border-zinc-850 space-y-2 shadow-inner font-sans">
                                  <p className="font-bold text-zinc-100 flex items-center gap-1.5 text-xs">
                                    <Info className="h-4 w-4 text-indigo-400" /> Core Diagnosis Overview
                                  </p>
                                  <p className="text-zinc-300 text-xs leading-relaxed">
                                    {atlasResult?.recommendation?.overview || "An upstream schema drift was identified in the source system where amount column type evolved to string. The pyspark daily aggregation wrapper lacks safe-casting constraints, yielding analytical exceptions in downstream Looker dashboards."}
                                  </p>
                                </div>

                                {/* Accordion Core diagnostics */}
                                <div className="space-y-3">
                                  
                                  {/* Diagnosis Accordion */}
                                  <div className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/30">
                                    <button
                                      onClick={() => setIsRootCauseOpen(!isRootCauseOpen)}
                                      className="w-full flex items-center justify-between p-3.5 text-left hover:bg-zinc-900/20 transition-colors cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                                        <Activity className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>Root Cause Diagnosis</span>
                                      </div>
                                      {isRootCauseOpen ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
                                    </button>
                                    {isRootCauseOpen && (
                                      <div className="p-3.5 border-t border-zinc-900 text-xs text-zinc-400 leading-relaxed bg-zinc-950/20 whitespace-pre-line font-sans">
                                        {atlasResult?.recommendation?.root_cause_analysis || "The table schema check identified an inconsistency. PostgreSQL database source schema column 'amount' (originally Numeric / float) evolved to a VARCHAR format. Downstream Apache Spark ETL pipeline job 'pyspark_daily_agg' threw casting errors when processing aggregations of string values, breaking looker visualizer queries."}
                                      </div>
                                    )}
                                  </div>

                                  {/* Compliance Accordion */}
                                  <div className="border border-zinc-850 rounded-xl overflow-hidden bg-zinc-950/30">
                                    <button
                                      onClick={() => setIsRiskAssessmentOpen(!isRiskAssessmentOpen)}
                                      className="w-full flex items-center justify-between p-3.5 text-left hover:bg-zinc-900/20 transition-colors cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                                        <Shield className="h-3.5 w-3.5 text-indigo-400" />
                                        <span>Governance & Compliance Risk Assessment</span>
                                      </div>
                                      {isRiskAssessmentOpen ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
                                    </button>
                                    {isRiskAssessmentOpen && (
                                      <div className="p-3.5 border-t border-zinc-900 text-xs text-zinc-400 leading-relaxed bg-zinc-950/20 whitespace-pre-line font-sans">
                                        {atlasResult?.recommendation?.risk_assessment || "No sensitive plain PII variables are exposed as a result of this table mismatch. However, the operational outage breaks finance analytical reports required under public audit regulations. Risk exposure rated as low-compliance hazard, but with extreme operational criticality."}
                                      </div>
                                    )}
                                  </div>

                                </div>

                                {/* Findings lists */}
                                <div className="space-y-3">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold flex items-center gap-1.5 font-sans">
                                    <Search className="h-3.5 w-3.5 text-indigo-400" /> Grounded Investigation Findings
                                  </span>
                                  <div className="grid grid-cols-1 gap-2">
                                    {(atlasResult?.recommendation?.findings || [
                                      "Upstream PostgreSQL database schema column amount was modified to VARCHAR(64).",
                                      "Daily spark job pyspark_daily_agg threw CAST operations syntax error in line 42.",
                                      "Looker reporting dashboard sales_dashboard_cube is showing 0 metrics since UTC 03:00."
                                    ]).map((f: string, fIdx: number) => (
                                      <div key={fIdx} className="flex gap-2.5 text-xs text-zinc-300 bg-zinc-950/40 border border-zinc-850 p-3 rounded-xl leading-relaxed font-sans">
                                        <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                                        <span>{f}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Remediation playbooks */}
                                <div className="space-y-4 pt-2">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold flex items-center gap-1.5 font-sans">
                                    <Sliders className="h-3.5 w-3.5 text-indigo-400" /> Remediation DDL Playbooks & Scripts
                                  </span>
                                  <div className="space-y-3">
                                    {(atlasResult?.recommendation?.remediations || [
                                      {
                                        title: "PostgreSQL Database Column Realignment",
                                        description: "Safely cast string attributes back to numeric representations inside the database table layer to realign downstream reporting schemas.",
                                        code: "ALTER TABLE sales_raw_postgres \nALTER COLUMN amount TYPE numeric USING amount::numeric;"
                                      },
                                      {
                                        title: "PySpark Job casting filter update",
                                        description: "Apply a safe cast fallback expression inside the PySpark task aggregations configuration file to prevent transformation starvation crashes.",
                                        code: "df_clean = df.withColumn('amount', col('amount').cast('double'))"
                                      }
                                    ]).map((r: any, rIdx: number) => (
                                      <div key={rIdx} className="bg-zinc-950 border border-zinc-850 rounded-xl p-4.5 space-y-3 shadow-inner">
                                        <div className="flex items-center justify-between gap-2 border-b border-zinc-900 pb-2">
                                          <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 bg-indigo-500/10 border border-indigo-500/20 rounded text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                                              {rIdx + 1}
                                            </div>
                                            <span className="text-xs font-semibold text-white font-sans">{r.title || `Action ${rIdx + 1}`}</span>
                                          </div>
                                          
                                          {r.code && (
                                            <button
                                              onClick={() => {
                                                navigator.clipboard.writeText(r.code);
                                                setCopiedRemediationIndex(rIdx);
                                                setTimeout(() => setCopiedRemediationIndex(null), 2000);
                                              }}
                                              className="p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded transition-colors text-xs flex items-center gap-1 cursor-pointer font-sans"
                                            >
                                              {copiedRemediationIndex === rIdx ? (
                                                <>
                                                  <Check className="h-3 w-3 text-emerald-400" />
                                                  <span className="text-[10px] font-mono text-emerald-400 font-bold">COPIED</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="h-3 w-3" />
                                                  <span className="text-[10px] font-mono">COPY</span>
                                                </>
                                              )}
                                            </button>
                                          )}
                                        </div>
                                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{r.description}</p>
                                        
                                        {r.code && (
                                          <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-850 font-mono text-xs text-indigo-300 whitespace-pre overflow-x-auto relative pr-10 leading-relaxed shadow-inner">
                                            {r.code}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>

                              {/* Toggleable Raw Logs terminal trace console */}
                              <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900/20">
                                <div className="p-4 bg-zinc-950/40 border-b border-zinc-850/60 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Terminal className="h-4 w-4 text-zinc-400 animate-pulse" />
                                    <span className="text-xs font-semibold text-zinc-300 font-display">Supervisor Raw Terminal Trace</span>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const el = document.getElementById("atlas-raw-trace-drawer");
                                      if (el) el.classList.toggle("hidden");
                                    }}
                                    className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-300 cursor-pointer transition-colors"
                                  >
                                    TOGGLE CONSOLE
                                  </button>
                                </div>
                                <div id="atlas-raw-trace-drawer" className="hidden p-4 bg-zinc-950 font-mono text-[11px] text-zinc-400 max-h-56 overflow-y-auto space-y-1.5 leading-relaxed">
                                  {atlasStageLogs.map((log, lIdx) => (
                                    <div key={lIdx} className="flex gap-2">
                                      <span className="text-zinc-700 select-none">&gt;</span>
                                      <span>{log}</span>
                                    </div>
                                  ))}
                                  <div className="text-zinc-600 italic">// Trace end. Standing by.</div>
                                </div>
                              </div>

                            </div>

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* CONTEXT EXPLORER TAB */}
              {activeTab === "Context" && (
                <div className="space-y-6">
                  {/* Page Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 flex items-center gap-2">
                        <Database className="h-6 w-6 text-blue-500" /> Enterprise Data Catalog
                      </h2>
                      <p className="text-sm text-zinc-400 mt-1 font-sans">
                        Explore corporate data assets, data lineages, security classifications, ownership grids, and metadata managed under DataHub.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs font-mono font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        DATAHUB CONNECTION: OPERATIONAL
                      </span>
                      <button 
                        onClick={() => handleContextSearch(contextQuery)}
                        className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Force Sync
                      </button>
                    </div>
                  </div>

                  {/* KPI Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 backdrop-blur-sm shadow-sm">
                      <div className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                        <Database className="h-3.5 w-3.5 text-blue-400" /> TOTAL DATASETS
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{catalogDatasets.length} Assets</div>
                      <div className="text-[10px] text-zinc-500">Fully documented and schema-aligned</div>
                    </div>
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 backdrop-blur-sm shadow-sm">
                      <div className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                        <Network className="h-3.5 w-3.5 text-indigo-400" /> GLOSSARY TERMS
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{catalogGlossary.length} Terms</div>
                      <div className="text-[10px] text-zinc-500">Business vocabulary nodes synced</div>
                    </div>
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 backdrop-blur-sm shadow-sm">
                      <div className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-emerald-400" /> ACTIVE DOMAINS
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{catalogDomains.length} Business Hubs</div>
                      <div className="text-[10px] text-zinc-500">Delineated organizational boundaries</div>
                    </div>
                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 backdrop-blur-sm shadow-sm">
                      <div className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-red-400" /> DATA GOVERNANCE
                      </div>
                      <div className="text-2xl font-bold text-red-400 font-mono">GDPR / CCPA</div>
                      <div className="text-[10px] text-zinc-500">Active classification & compliance tracking</div>
                    </div>
                  </div>

                  {/* Catalog Body Block */}
                  <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl backdrop-blur-sm space-y-6">
                    {/* Search & Filter Controls Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end pb-4 border-b border-zinc-800/80">
                      {/* Search */}
                      <div className="md:col-span-1 space-y-1.5">
                        <label className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase">Search Catalog</label>
                        <div className="relative">
                          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
                          <input 
                            type="text" 
                            value={contextQuery}
                            onChange={(e) => setContextQuery(e.target.value)}
                            placeholder="Search datasets..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition shadow-inner font-mono animate-none"
                          />
                        </div>
                      </div>

                      {/* Filter by Domain */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase">Domain Segment</label>
                        <select 
                          value={selectedDomainFilter}
                          onChange={(e) => setSelectedDomainFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                        >
                          <option value="All">All Domains</option>
                          {catalogDomains.map(d => (
                            <option key={d.urn} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filter by Platform */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase">Platform Infrastructure</label>
                        <select 
                          value={selectedPlatformFilter}
                          onChange={(e) => setSelectedPlatformFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                        >
                          <option value="All">All Platforms</option>
                          <option value="postgres">PostgreSQL</option>
                          <option value="snowflake">Snowflake</option>
                          <option value="tableau">Tableau</option>
                        </select>
                      </div>

                      {/* Filter by Compliance Tags */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-sans font-bold tracking-wider text-zinc-500 uppercase">Governance Tags</label>
                        <select 
                          value={selectedTagFilter}
                          onChange={(e) => setSelectedTagFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                        >
                          <option value="All">All Classifications</option>
                          <option value="PII">PII (Sensitive)</option>
                          <option value="CCPA">CCPA Regulated</option>
                          <option value="GDPR">GDPR Compliant</option>
                          <option value="DRIFTED">Schema Drifted</option>
                          <option value="SECRET">Plaintext Secret</option>
                          <option value="VULNERABLE">Vulnerability Warning</option>
                        </select>
                      </div>
                    </div>

                    {/* Main Catalog View Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* LEFT COLUMN: DATASET CARD LIST (1/3 Width) */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest px-1 font-semibold flex justify-between items-center">
                          <span>Discovered Assets ({
                            catalogDatasets.filter(d => {
                              const domainMatch = selectedDomainFilter === "All" || d.domain === selectedDomainFilter;
                              const platformMatch = selectedPlatformFilter === "All" || d.platform === selectedPlatformFilter;
                              const tagMatch = selectedTagFilter === "All" || (d.tags && d.tags.includes(selectedTagFilter));
                              return domainMatch && platformMatch && tagMatch;
                            }).length
                          })</span>
                          {isContextLoading && <Loader className="h-3.5 w-3.5 animate-spin text-blue-400" />}
                        </div>

                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                          {catalogDatasets
                            .filter(d => {
                              const domainMatch = selectedDomainFilter === "All" || d.domain === selectedDomainFilter;
                              const platformMatch = selectedPlatformFilter === "All" || d.platform === selectedPlatformFilter;
                              const tagMatch = selectedTagFilter === "All" || (d.tags && d.tags.includes(selectedTagFilter));
                              return domainMatch && platformMatch && tagMatch;
                            })
                            .map(d => {
                              const isSelected = selectedDataset?.urn === d.urn;
                              return (
                                <button
                                  key={d.urn}
                                  onClick={() => {
                                    selectCatalogDataset(d.urn);
                                    addLog(`Catalog Explorer: Switched dataset view to -> ${d.name}`);
                                  }}
                                  className={`w-full p-4 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between cursor-pointer text-xs space-y-3 ${
                                    isSelected
                                      ? "bg-zinc-900 border-blue-500 shadow-sm shadow-blue-500/5"
                                      : "bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900/50"
                                  }`}
                                >
                                  <div className="space-y-1.5 w-full">
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-semibold text-white font-mono text-[13px]">{d.name}</span>
                                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                                        d.platform === "snowflake" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                                        d.platform === "postgres" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                        "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                                      }`}>
                                        {d.platform}
                                      </span>
                                    </div>
                                    <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">{d.description}</p>
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-800/40 w-full gap-2">
                                    <span className="text-[10px] font-sans font-medium text-zinc-500 flex items-center gap-1">
                                      <Briefcase className="h-3 w-3 text-zinc-600" /> {d.domain}
                                    </span>
                                    
                                    <div className="flex items-center gap-1 overflow-hidden">
                                      {d.tags && d.tags.slice(0, 2).map((tag: string) => (
                                        <span 
                                          key={tag} 
                                          className={`text-[8px] font-mono px-1.5 py-0.2 border rounded ${
                                            tag === "PII" || tag === "VULNERABLE" || tag === "DRIFTED" 
                                              ? "text-red-400 border-red-500/20 bg-red-500/5" 
                                              : tag === "CCPA" || tag === "GDPR" 
                                              ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                                              : "text-zinc-400 border-zinc-800 bg-zinc-900"
                                          }`}
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {d.tags && d.tags.length > 2 && (
                                        <span className="text-[8px] text-zinc-600 font-mono font-bold">+{d.tags.length - 2}</span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          
                          {catalogDatasets.filter(d => {
                            const domainMatch = selectedDomainFilter === "All" || d.domain === selectedDomainFilter;
                            const platformMatch = selectedPlatformFilter === "All" || d.platform === selectedPlatformFilter;
                            const tagMatch = selectedTagFilter === "All" || (d.tags && d.tags.includes(selectedTagFilter));
                            return domainMatch && platformMatch && tagMatch;
                          }).length === 0 && (
                            <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl space-y-2">
                              <Search className="h-6 w-6 mx-auto text-zinc-600" />
                              <p className="text-xs">No matching data catalog assets discovered.</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Business Glossary Term Section */}
                        <div className="pt-4 border-t border-zinc-800/60 space-y-3">
                          <div className="text-[10px] text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                            <Network className="h-3.5 w-3.5 text-indigo-400" /> Integrated Glossary terms
                          </div>
                          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                            {catalogGlossary.map((term: any) => (
                              <div key={term.urn} className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-800/80 space-y-1">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="font-mono text-zinc-200 font-bold">{term.name}</span>
                                  <span className="text-[8px] font-mono px-1.5 py-0.2 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 font-semibold">{term.category}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">{term.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: DETAILED ASSET PROFILER (2/3 Width) */}
                      <div className="lg:col-span-2">
                        {selectedDataset ? (
                          <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-6 backdrop-blur-sm shadow-sm relative">
                            {/* Asset Title / Meta Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800/80 pb-4">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                                    selectedDataset.platform === "snowflake" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                                    "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  }`}>
                                    {selectedDataset.platform.toUpperCase()} DATABASE
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                                    <Briefcase className="h-3.5 w-3.5" /> Domain: <span className="text-zinc-300 font-sans font-semibold">{selectedDataset.domain}</span>
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-white font-mono">{selectedDataset.name}</h3>
                                
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-800/80 max-w-md">
                                  <span className="truncate text-[9px]">URN: {selectedDataset.urn}</span>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(selectedDataset.urn);
                                      addLog("System: Copied catalog asset URN to clipboard!");
                                    }} 
                                    className="text-zinc-500 hover:text-white transition shrink-0 ml-1.5 cursor-pointer"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-right shrink-0 font-mono text-[10px] text-zinc-500 space-y-1">
                                <div>CREATED: <span className="text-zinc-400">{new Date(selectedDataset.created_at).toLocaleDateString()}</span></div>
                                <div>SYNCED: <span className="text-zinc-400">{new Date(selectedDataset.updated_at).toLocaleString()}</span></div>
                              </div>
                            </div>

                            {/* Asset Description Paragraph */}
                            <div className="space-y-1.5 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/40">
                              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-sans font-bold flex items-center gap-1">
                                <Info className="h-3 w-3 text-blue-400" /> Catalog Definition
                              </div>
                              <p className="text-sm text-zinc-300 leading-relaxed font-sans">{selectedDataset.description}</p>
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {selectedDataset.tags && selectedDataset.tags.map((tag: string) => (
                                  <span key={tag} className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                                    tag === "PII" || tag === "VULNERABLE" || tag === "DRIFTED" 
                                      ? "text-red-400 border-red-500/20 bg-red-500/5 font-semibold" 
                                      : tag === "CCPA" || tag === "GDPR" 
                                      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 font-semibold"
                                      : "text-zinc-400 border-zinc-800 bg-zinc-900"
                                  }`}>
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Tab Row Selector */}
                            <div className="flex border-b border-zinc-800 overflow-x-auto">
                              {[
                                { id: "schema", label: "Physical Schema", icon: Database },
                                { id: "lineage", label: "Lineage Flow", icon: Network },
                                { id: "owners", label: "Metadata Owners", icon: Users },
                                { id: "governance", label: "Governance Rules", icon: Shield },
                                { id: "documentation", label: "Documentation", icon: FileText }
                              ].map(t => (
                                <button
                                  key={t.id}
                                  onClick={() => {
                                    setSelectedExplorerTab(t.id as any);
                                    addLog(`Catalog Explorer: Switched detailed profiler tab to -> ${t.label}`);
                                  }}
                                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                                    selectedExplorerTab === t.id
                                      ? "border-blue-500 text-white font-bold bg-blue-500/5"
                                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                                  }`}
                                >
                                  <t.icon className="h-3.5 w-3.5" />
                                  {t.label}
                                </button>
                              ))}
                            </div>

                            {/* Tab Contents */}
                            <div className="space-y-4">
                              
                              {/* 1. SCHEMA TAB */}
                              {selectedExplorerTab === "schema" && (
                                <div className="space-y-3">
                                  <div className="text-xs text-zinc-500 font-mono flex items-center justify-between border-b border-zinc-800/40 pb-2">
                                    <span>Mapped Fields ({selectedDataset.schema_metadata?.fields?.length || 0})</span>
                                    <span>PRIMARY KEY: <span className="text-blue-400">{selectedDataset.schema_metadata?.primary_keys?.join(", ") || "None"}</span></span>
                                  </div>

                                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                                    {selectedDataset.schema_metadata?.fields?.map((field: any, fIdx: number) => (
                                      <div key={fIdx} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 hover:border-zinc-700/60 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                        <div className="space-y-1">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-white font-bold">{field.field_path}</span>
                                            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded font-semibold uppercase">{field.type}</span>
                                            {field.nullable ? (
                                              <span className="text-[9px] font-sans text-zinc-600 uppercase font-medium">Nullable</span>
                                            ) : (
                                              <span className="text-[9px] font-sans text-blue-500 bg-blue-500/5 border border-blue-500/10 px-1 py-0.2 rounded uppercase font-bold">Required</span>
                                            )}
                                          </div>
                                          <p className="text-zinc-400 font-sans leading-relaxed text-[11px]">{field.description}</p>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          {field.tags && field.tags.map((tag: string) => (
                                            <span 
                                              key={tag} 
                                              className={`text-[8px] font-mono px-1.5 py-0.2 border rounded ${
                                                tag === "PII" || tag === "SECRET" || tag === "VULNERABILITY"
                                                  ? "text-red-400 border-red-500/20 bg-red-500/5 font-semibold"
                                                  : "text-zinc-400 border-zinc-800 bg-zinc-900"
                                              }`}
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 2. LINEAGE TAB */}
                              {selectedExplorerTab === "lineage" && (
                                <div className="space-y-4">
                                  <div className="text-xs text-zinc-500 font-mono border-b border-zinc-800/40 pb-2 flex items-center justify-between">
                                    <span>Data Pipeline Dependency lineage Map</span>
                                    <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 border border-indigo-500/10 px-1.5 py-0.2 rounded">PROVENANCE</span>
                                  </div>

                                  <div className="p-6 bg-zinc-950/80 rounded-xl border border-zinc-800/80 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 min-h-[200px] overflow-x-auto relative shadow-inner">
                                    
                                    <div className="flex flex-col gap-3 shrink-0">
                                      <div className="text-[9px] text-zinc-500 font-sans font-bold uppercase text-center tracking-wider pb-1 border-b border-zinc-800">Upstream Inputs</div>
                                      {selectedDatasetLineage && selectedDatasetLineage.upstream_nodes && selectedDatasetLineage.upstream_nodes.length > 0 ? (
                                        selectedDatasetLineage.upstream_nodes.map((node: any, nIdx: number) => (
                                          <div key={nIdx} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 max-w-[180px] hover:border-blue-500/20 transition-all duration-200">
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="font-mono text-zinc-200 font-bold text-[10px] truncate">{node.name}</span>
                                              <span className="text-[8px] font-mono px-1 border border-zinc-800 bg-zinc-950 rounded uppercase text-zinc-500">{node.platform}</span>
                                            </div>
                                            <div className="text-[8px] text-zinc-500 font-mono truncate">{node.urn}</div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="p-4 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-[10px] max-w-[150px] leading-relaxed font-sans">
                                          No Upstream Parent dependencies
                                        </div>
                                      )}
                                    </div>

                                    <div className="hidden md:flex flex-col items-center justify-center shrink-0">
                                      <div className="h-0.5 w-8 bg-zinc-800 relative">
                                        <div className="absolute -right-1.5 -top-1 border-y-4 border-y-transparent border-l-6 border-l-zinc-800" />
                                      </div>
                                    </div>

                                    <div className="p-4 bg-zinc-900/60 border-2 border-blue-500 rounded-2xl max-w-[220px] text-center space-y-2 relative shadow-md shadow-blue-500/5 shrink-0">
                                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-500 text-white font-mono text-[8px] font-bold tracking-wider uppercase">
                                        CURRENT ASSET
                                      </div>
                                      <div className="pt-1 flex items-center justify-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                                        <span className="font-mono text-white font-bold text-xs truncate">{selectedDataset.name}</span>
                                      </div>
                                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed px-1 font-sans">{selectedDataset.description}</p>
                                      <div className="text-[8px] text-blue-400 font-mono">{selectedDataset.platform} ({selectedDataset.schema_metadata?.fields?.length || 0} fields)</div>
                                    </div>

                                    <div className="hidden md:flex flex-col items-center justify-center shrink-0">
                                      <div className="h-0.5 w-8 bg-zinc-800 relative">
                                        <div className="absolute -right-1.5 -top-1 border-y-4 border-y-transparent border-l-6 border-l-zinc-800" />
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-3 shrink-0">
                                      <div className="text-[9px] text-zinc-500 font-sans font-bold uppercase text-center tracking-wider pb-1 border-b border-zinc-800">Downstream Consumers</div>
                                      {selectedDatasetLineage && selectedDatasetLineage.downstream_nodes && selectedDatasetLineage.downstream_nodes.length > 0 ? (
                                        selectedDatasetLineage.downstream_nodes.map((node: any, nIdx: number) => (
                                          <div key={nIdx} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 max-w-[180px] hover:border-indigo-500/20 transition-all duration-200">
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="font-mono text-zinc-200 font-bold text-[10px] truncate">{node.name}</span>
                                              <span className="text-[8px] font-mono px-1 border border-zinc-800 bg-zinc-950 rounded uppercase text-zinc-500">{node.platform}</span>
                                            </div>
                                            <div className="text-[8px] text-zinc-500 font-mono truncate">{node.urn}</div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="p-4 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-[10px] max-w-[150px] leading-relaxed font-sans">
                                          No Downstream consumer targets
                                        </div>
                                      )}
                                    </div>

                                  </div>
                                </div>
                              )}

                              {/* 3. OWNERS TAB */}
                              {selectedExplorerTab === "owners" && (
                                <div className="space-y-4">
                                  <div className="text-xs text-zinc-500 font-mono border-b border-zinc-800/40 pb-2 flex items-center justify-between">
                                    <span>Registered Stewardship Grid</span>
                                    <span className="text-[10px] text-blue-400 font-bold bg-blue-500/5 border border-indigo-500/10 px-1.5 py-0.2 rounded font-sans">SSO SYNCHRONIZED</span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedDatasetOwners && selectedDatasetOwners.length > 0 ? (
                                      selectedDatasetOwners.map((owner: any, oIdx: number) => (
                                        <div key={oIdx} className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex items-center gap-3 hover:border-zinc-700/60 transition duration-200 shadow-inner">
                                          <div className="h-9 w-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs shrink-0">
                                            {owner.name[0]}
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold text-white font-sans">{owner.name}</span>
                                              <span className="text-[8px] font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded text-zinc-500 font-semibold">{owner.type}</span>
                                            </div>
                                            <div className="text-[10px] font-mono text-zinc-400 truncate max-w-[180px]">{owner.email}</div>
                                            <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-blue-400">ROLE: {owner.role}</div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-4 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 col-span-2 text-xs font-sans">
                                        No stewardship details found for this catalog asset.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* 4. GOVERNANCE & TAGS TAB */}
                              {selectedExplorerTab === "governance" && (
                                <div className="space-y-4">
                                  <div className="text-xs text-zinc-500 font-mono border-b border-zinc-800/40 pb-2">
                                    Regulatory Compliance Audits & Security Constraints
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/80 space-y-3 shadow-inner">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-sans font-bold text-white flex items-center gap-2">
                                          <Lock className="h-3.5 w-3.5 text-emerald-400" /> CCPA Privacy Alignment
                                        </span>
                                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">COMPLIANT</span>
                                      </div>
                                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                                        Subject to CCPA CC-5 master accounting audits. Personal user profiles are mapped to strict sandbox access boundaries.
                                      </p>
                                      <div className="text-[9px] font-mono text-zinc-500">
                                        COMPLIANCE MANAGER: <span className="text-zinc-300 font-semibold">secops@acme-aerospace.com</span>
                                      </div>
                                    </div>

                                    <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-800/80 space-y-3 shadow-inner">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-sans font-bold text-white flex items-center gap-2">
                                          <Lock className="h-3.5 w-3.5 text-emerald-400" /> GDPR Data Portability
                                        </span>
                                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CERTIFIED</span>
                                      </div>
                                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                                        Under GDPR Article 30 boundary constraints. Field indexes undergo periodic scans for unencrypted data leaks and cleartext identifiers.
                                      </p>
                                      <div className="text-[9px] font-mono text-zinc-500">
                                        AUDIT METRIC CODE: <span className="text-zinc-300 font-semibold">GDPR_REG_CC_3</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 5. DOCUMENTATION TAB */}
                              {selectedExplorerTab === "documentation" && (
                                <div className="space-y-3">
                                  <div className="text-xs text-zinc-500 font-mono border-b border-zinc-800/40 pb-2 flex items-center justify-between">
                                    <span>Rich Catalog Readme</span>
                                    <span className="text-[10px] text-zinc-600 font-mono uppercase font-bold font-sans">DataHub MarkDown</span>
                                  </div>

                                  <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800 font-sans text-xs text-zinc-300 leading-relaxed space-y-3 shadow-inner">
                                    <h4 className="text-sm font-semibold text-white font-mono">Operations runbook - {selectedDataset.name}</h4>
                                    <p>This dataset holds critical telemetry configurations. To perform schema alterations on this schema structure, open a pipeline drift mitigation request via the Orixa Forge specialist. Pre-flight validations are enforced at compilation time.</p>
                                    
                                    <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1 leading-normal">
                                      <div>1. Schema adjustments must be cataloged in DataHub.</div>
                                      <div>2. PII identifiers must always be obfuscated or encrypted.</div>
                                      <div>3. Linear lineage links must remain intact downstream.</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>

                          </div>
                        ) : (
                          <div className="p-12 text-center border border-dashed border-zinc-800 bg-zinc-900/10 rounded-2xl space-y-4 min-h-[300px] flex flex-col justify-center items-center">
                            <Search className="h-10 w-10 text-zinc-600 animate-pulse" />
                            <div className="space-y-1 max-w-sm">
                              <h4 className="text-white font-sans font-semibold text-sm">No Catalog Asset Profile Selected</h4>
                              <p className="text-xs text-zinc-400 leading-relaxed font-sans">Select a dataset from the left discovered fleet to load full schema structures, SSO owners, visual dependencies, and compliance grids.</p>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* KNOWLEDGE TAB */}
              {activeTab === "Knowledge" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">Knowledge and Schema Mapping</h2>
                    <p className="text-sm text-zinc-400 mt-1 font-sans">Inspect the database schemas, metadata indexes, and semantic nodes synced from corporate databases.</p>
                  </div>

                  <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-400" /> Relational Data Schema Tree
                      </h3>
                      <span className="text-xs text-zinc-500 font-mono bg-zinc-950 px-2.5 py-0.5 rounded border border-zinc-800">POSTGRESQL ORM ENGINE v2.0</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-4 hover:border-zinc-700/60 transition-all duration-300 shadow-sm">
                        <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase border-b border-zinc-800 pb-2.5 flex items-center justify-between">
                          <span>1. Tenant Model</span>
                          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/5 border border-blue-500/10 px-1.5 py-0.2 rounded">PRIMARY</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white font-mono">Organization</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">Delineates tenant data boundaries. Projects and users must map to a specific organization.</p>
                        <div className="space-y-1.5 text-[11px] font-mono text-zinc-500">
                          <div className="flex justify-between"><span>id (UUID)</span><span className="text-zinc-400">PK</span></div>
                          <div className="flex justify-between"><span>name (VARCHAR)</span><span className="text-zinc-400">UNIQUE</span></div>
                          <div className="flex justify-between"><span>domain (VARCHAR)</span><span className="text-zinc-400">NULLABLE</span></div>
                        </div>
                      </div>

                      <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-4 hover:border-zinc-700/60 transition-all duration-300 shadow-sm">
                        <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase border-b border-zinc-800 pb-2.5 flex items-center justify-between">
                          <span>2. Identity Model</span>
                          <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 border border-indigo-500/10 px-1.5 py-0.2 rounded">RBAC</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white font-mono">User</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">Registered system operators bound to organizations, containing roles and active credentials.</p>
                        <div className="space-y-1.5 text-[11px] font-mono text-zinc-500">
                          <div className="flex justify-between"><span>id (UUID)</span><span className="text-zinc-400">PK</span></div>
                          <div className="flex justify-between"><span>email (VARCHAR)</span><span className="text-zinc-400">UNIQUE, INDEX</span></div>
                          <div className="flex justify-between"><span>role (VARCHAR)</span><span className="text-zinc-400">Viewer/Admin</span></div>
                          <div className="flex justify-between"><span>org_id (UUID)</span><span className="text-indigo-400">FK -&gt; Org</span></div>
                        </div>
                      </div>

                      <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-4 hover:border-zinc-700/60 transition-all duration-300 shadow-sm">
                        <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase border-b border-zinc-800 pb-2.5 flex items-center justify-between">
                          <span>3. Boundary Model</span>
                          <span className="text-[10px] text-purple-400 font-bold bg-purple-500/5 border border-purple-500/10 px-1.5 py-0.2 rounded">JSONB</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white font-mono">Project</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">Workspace boundaries holding JSONB analytical metadata configurations for operations.</p>
                        <div className="space-y-1.5 text-[11px] font-mono text-zinc-500">
                          <div className="flex justify-between"><span>id (UUID)</span><span className="text-zinc-400">PK</span></div>
                          <div className="flex justify-between"><span>name (VARCHAR)</span><span className="text-zinc-400">NULLABLE</span></div>
                          <div className="flex justify-between"><span>metadata_json (JSONB)</span><span className="text-purple-400 font-semibold">DYNAMIC</span></div>
                          <div className="flex justify-between"><span>org_id (UUID)</span><span className="text-purple-400">FK -&gt; Org</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIALISTS TAB */}
              {activeTab === "Specialists" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">AI Specialists Fleet Console</h2>
                    <p className="text-sm text-zinc-400 mt-1 font-sans">Manage, inspect, and deploy dedicated analytical agents configured within active projects.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Specialists List */}
                    <div className="lg:col-span-1 space-y-3">
                      <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest px-1 font-semibold flex justify-between items-center">
                        <span>Registered Fleet (8)</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                        {specialists.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedSpecialist(s.id);
                              addLog(`Specialist Fleet: Switched monitor to -> ${s.display_name}`);
                            }}
                            className={`w-full p-4 rounded-xl text-left border transition-all duration-300 flex items-start justify-between cursor-pointer ${
                              selectedSpecialist === s.id
                                ? "bg-zinc-900 border-blue-500 shadow-sm shadow-blue-500/5"
                                : "bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900/50"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className={`h-6 w-6 rounded bg-gradient-to-tr ${s.avatarColor} flex items-center justify-center text-[10px] text-black font-extrabold`}>
                                  {s.display_name[0]}
                                </div>
                                <span className="font-semibold text-white font-mono text-sm">{s.display_name}</span>
                              </div>
                              <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed">{s.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                                s.status === "ACTIVE" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                s.status === "ANALYZING" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse" :
                                s.status === "ALERT" ? "bg-red-500/10 text-red-400 border-red-500/20 font-semibold animate-pulse" :
                                s.status === "IDLE" ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10" :
                                "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                              }`}>
                                {s.status}
                              </span>
                              <span className={`text-[8px] font-mono px-1 border rounded ${
                                s.health === "GREEN" ? "text-emerald-400 border-emerald-500/10 bg-emerald-500/5" :
                                s.health === "YELLOW" ? "text-amber-400 border-amber-500/10 bg-amber-500/5" :
                                "text-red-400 border-red-500/10 bg-red-500/5"
                              }`}>
                                {s.health}
                              </span>
                              {((s.thumbs_up ?? 0) + (s.thumbs_down ?? 0)) > 0 ? (
                                <span className="text-[9px] font-mono font-black text-indigo-400 mt-1 uppercase tracking-tighter">
                                  {Math.round(((s.thumbs_up ?? 0) / ((s.thumbs_up ?? 0) + (s.thumbs_down ?? 0))) * 100)}% Acc
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-tighter">100% Acc</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Specialist Monitor Screen */}
                    <div className="lg:col-span-2">
                      {(() => {
                        const s = specialists.find(spec => spec.id === selectedSpecialist);
                        if (!s) return null;
                        return (
                          <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-6 backdrop-blur-sm shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                              <div className="flex items-center gap-3">
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${s.avatarColor} flex items-center justify-center font-bold text-black text-lg`}>
                                  {s.display_name[0]}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-white font-mono">{s.display_name} Specialist</h3>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono">
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                                      HEALTH: {s.health}
                                    </div>
                                  </div>
                                  <span className="text-xs text-zinc-500 font-mono">ROLE BOUNDARY: {s.category} isolation</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="text-zinc-500 font-sans font-semibold">Specialist Status:</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs border font-semibold ${
                                  s.status === "ACTIVE" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                  s.status === "ANALYZING" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse" :
                                  s.status === "ALERT" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                  "bg-zinc-800/60 text-zinc-400 border-zinc-700/60"
                                }`}>
                                  {s.status}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left Column: Description & Capabilities */}
                              <div className="space-y-4">
                                {/* Operator Feedback & Selector Accuracy Card */}
                                <div className="p-4 bg-zinc-950/80 border border-zinc-800/60 rounded-xl space-y-3.5 shadow-inner">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono font-black flex items-center gap-1">
                                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                      Selector Selection Accuracy & Feedback
                                    </span>
                                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded font-bold">
                                      {((s.thumbs_up ?? 0) + (s.thumbs_down ?? 0)) > 0 
                                        ? `${Math.round(((s.thumbs_up ?? 0) / ((s.thumbs_up ?? 0) + (s.thumbs_down ?? 0))) * 100)}% dynamic confidence` 
                                        : "100% dynamic confidence"
                                      }
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                                    <div className="p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-850/50 flex flex-col items-center justify-center text-center">
                                      <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Approved Contributions</span>
                                      <span className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
                                        👍 {s.thumbs_up ?? 0}
                                      </span>
                                    </div>
                                    <div className="p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-850/50 flex flex-col items-center justify-center text-center">
                                      <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Drift Penalties</span>
                                      <span className="text-lg font-black text-rose-400 flex items-center gap-1.5">
                                        👎 {s.thumbs_down ?? 0}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between gap-4 pt-1">
                                    <span className="text-[10px] text-zinc-500 font-sans leading-tight">
                                      Rate this specialist's live actions and telemetry to fine-tune future automatic assignment priority weights:
                                    </span>
                                    <div className="flex gap-1.5 shrink-0">
                                      <button
                                        onClick={() => handleRateSpecialist(s.name, "up")}
                                        className="h-8 px-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1"
                                        title="Approve specialist contribution"
                                      >
                                        👍 UP
                                      </button>
                                      <button
                                        onClick={() => handleRateSpecialist(s.name, "down")}
                                        className="h-8 px-3 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1"
                                        title="Penalize selection drift"
                                      >
                                        👎 DOWN
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-sans font-bold">Purpose Scope</span>
                                  <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/30 p-3 rounded-xl border border-zinc-800/40">{s.description}</p>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-sans font-bold">Mitigation Coverage</span>
                                  <div className="text-xs bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 font-mono text-zinc-300 shadow-inner">
                                    {s.threatCoverage}
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-sans font-bold">Capabilities</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {s.capabilities.map((cap, cIdx) => (
                                      <span key={cIdx} className="text-[10px] font-mono text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded-full">
                                        {cap}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Responsibilities */}
                              <div className="space-y-4">
                                <div className="space-y-1.5">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-sans font-bold">Autonomous Responsibilities</span>
                                  <div className="space-y-2.5 bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/40">
                                    {s.responsibilities.map((resp, rIdx) => (
                                      <div key={rIdx} className="flex gap-2 text-xs text-zinc-300 leading-relaxed items-start">
                                        <span className="text-blue-500 font-extrabold shrink-0 mt-0.5">•</span>
                                        <span>{resp}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Supported Task execution buttons */}
                            <div className="space-y-2 border-t border-zinc-800/80 pt-4">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-sans font-bold flex items-center gap-1.5">
                                <Cpu className="h-3 w-3 text-blue-400" /> Manual Specialist Dispatches (REST Gateways)
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {s.supported_tasks.map((task, tIdx) => (
                                  <button
                                    key={tIdx}
                                    disabled={isExecutingTask !== null}
                                    onClick={() => handleExecuteTask(s.name, task)}
                                    className={`p-3 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 text-left rounded-xl transition-all duration-200 cursor-pointer text-xs font-mono flex items-center justify-between group ${
                                      isExecutingTask === task ? "opacity-50" : ""
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <div className="text-white group-hover:text-blue-400 transition-colors">{task}</div>
                                      <div className="text-[9px] text-zinc-500">POST /api/v1/execute</div>
                                    </div>
                                    <div className="text-zinc-600 group-hover:text-zinc-400 text-[10px] font-sans font-semibold">
                                      {isExecutingTask === task ? (
                                        <span className="animate-spin inline-block mr-1">⚡</span>
                                      ) : (
                                        <span>RUN</span>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Terminal-like log monitor */}
                            <div className="space-y-2">
                              <span className="text-xs text-zinc-500 uppercase tracking-wider font-sans font-bold flex items-center gap-1.5">
                                <Terminal className="h-3 w-3 text-zinc-400" /> Dedicated Process Streams logs
                              </span>
                              <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl font-mono text-xs space-y-2 text-zinc-400 h-40 overflow-y-auto pr-2 shadow-inner">
                                {s.logs.map((log, lIdx) => (
                                  <div key={lIdx} className="flex gap-2">
                                    <span className="text-zinc-600">&gt;</span>
                                    <span className={log.includes("Blocked") || log.includes("[WARNING]") || log.includes("[FAILURE]") ? "text-red-400 font-semibold bg-red-950/20 px-1 py-0.2 rounded" : log.includes("[SUCCESS]") ? "text-emerald-400 font-semibold" : "text-zinc-300"}>
                                      {log}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "Settings" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">Tenant and Codebase Settings</h2>
                    <p className="text-sm text-zinc-400 mt-1 font-sans">Audit the local monorepo config files, simulate role switches, and modify DB connections.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Simulator configurations */}
                    <div className="space-y-6 lg:col-span-1">
                      <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4 backdrop-blur-sm shadow-sm">
                        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-400" /> Identity Simulator
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          Switch operator roles to verify RBAC security configurations across isolated project metadata boundaries.
                        </p>
                        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-950 rounded-xl border border-zinc-800">
                          {["SuperAdmin", "Analyst", "Viewer"].map((role) => (
                            <button
                              key={role}
                              onClick={() => {
                                setUserRole(role as any);
                                addLog(`Identity Simulator: Switched identity access scope to -> ${role}`);
                              }}
                              className={`text-[11px] font-mono py-1.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                                userRole === role 
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold shadow-sm" 
                                  : "text-zinc-500 border-transparent hover:text-zinc-300"
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                        <div className="text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-zinc-400 space-y-1.5 shadow-inner">
                          <div className="flex justify-between">
                            <span>Write Permission:</span>
                            <span className={userRole !== "Viewer" ? "text-blue-400 font-semibold" : "text-red-400 font-semibold"}>
                              {userRole !== "Viewer" ? "ENABLED" : "DENIED"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Isolation Control:</span>
                            <span className={userRole === "SuperAdmin" ? "text-blue-400 font-semibold" : "text-red-400 font-semibold"}>
                              {userRole === "SuperAdmin" ? "GRANTED" : "REVOKED"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4 backdrop-blur-sm shadow-sm">
                        <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase">Multi-Tenancy Info</div>
                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Active Tenant Name:</span>
                            <span className="text-white font-mono font-medium">Acme Aerospace</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Tenant Domain:</span>
                            <span className="text-zinc-400 font-mono">acme-aero.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Database Engine:</span>
                            <span className="text-blue-400 font-mono font-semibold">Async PostgreSQL</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Codebase Inspector */}
                    <div className="lg:col-span-2 p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-5 backdrop-blur-sm shadow-sm">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                        <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-blue-400" /> Monorepo Codebase Blueprint Inspector
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">READONLY CONFIGS</span>
                      </div>
                      
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        Verify the actual file configurations written in the Orixa Monorepo foundation code. Select a file blueprint below to inspect:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {Object.keys(SYSTEM_CODE_TEMPLATES).map((filename) => (
                          <button
                            key={filename}
                            onClick={() => {
                              setActiveCodeFile(filename as any);
                              addLog(`Codebase Inspector: Switched file view -> ${filename}`);
                            }}
                            className={`px-3.5 py-2 rounded-lg font-mono text-xs border transition-all duration-200 cursor-pointer ${
                              activeCodeFile === filename
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20 font-semibold"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                            }`}
                          >
                            {filename}
                          </button>
                        ))}
                      </div>

                      <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 whitespace-pre overflow-x-auto max-h-60 leading-relaxed shadow-inner pr-4">
                        {SYSTEM_CODE_TEMPLATES[activeCodeFile]}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREDICTIONS TAB */}
              {activeTab === "Predictions" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">Machine Risk Predictions</h2>
                    <p className="text-sm text-zinc-400 mt-1 font-sans">Continuous time-series forecasting of operational vulnerabilities, database connection bottlenecks, and compliance drift risks.</p>
                  </div>

                  {/* Prediction Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-3 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Estimated Schema Drift</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">HIGH RISK</span>
                      </div>
                      <div className="text-3xl font-bold text-white font-mono tracking-tight">84.50%</div>
                      <div className="text-xs text-zinc-400 font-sans leading-relaxed">
                        Predicted incompatible column type drift in sandbox <span className="text-blue-400 font-mono">Project Alpha</span> within 48 hours.
                      </div>
                    </div>

                    <div className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-3 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Pool Starvation Forecast</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">STABLE</span>
                      </div>
                      <div className="text-3xl font-bold text-white font-mono tracking-tight">12.10%</div>
                      <div className="text-xs text-zinc-400 font-sans leading-relaxed">
                        Database connection pool starvation risk remains low based on historical timeseries trend calculations.
                      </div>
                    </div>

                    <div className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-3 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Compliance Violation Risk</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">MONITOR</span>
                      </div>
                      <div className="text-3xl font-bold text-white font-mono tracking-tight">41.25%</div>
                      <div className="text-xs text-zinc-400 font-sans leading-relaxed">
                        Probability of unencrypted cleartext identifiers exposed in analytical pipelines synced from schema models.
                      </div>
                    </div>
                  </div>

                  {/* Interactive Forecasting sandbox */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-5 backdrop-blur-sm shadow-sm">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-400" /> Continuous Operational Health & Anomaly Trend Forecast
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">MODEL: ARIMA_GUEST_V2</span>
                      </div>

                      <div className="p-10 bg-zinc-950/80 rounded-xl border border-zinc-800/80 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 border border-blue-500/20 animate-pulse">
                          <Brain className="h-6 w-6" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-semibold text-white font-sans">Active Risk Forecasting Sandbox Mode</h4>
                          <p className="text-xs text-zinc-400 max-w-md leading-relaxed font-sans">
                            Adjust the simulation sliders on the right panel to calculate degradation values, project table conflicts, and inspect predictive metrics.
                          </p>
                        </div>
                        
                        {/* Simulated Visual Sparkline Graph */}
                        <div className="flex items-end gap-1.5 h-16 w-full max-w-xs pt-4">
                          {[25, 30, 45, 35, 55, 60, 48, 70, 85, 90, 75, 84].map((val, i) => (
                            <div 
                              key={i} 
                              className={`w-full rounded-t transition-all duration-500 ${
                                val > 80 ? "bg-red-500/60" : val > 50 ? "bg-amber-500/60" : "bg-blue-500/60"
                              }`} 
                              style={{ height: `${val}%` }} 
                            />
                          ))}
                        </div>
                        <div className="flex justify-between w-full max-w-xs text-[10px] font-mono text-zinc-500">
                          <span>-12h</span>
                          <span>-6h</span>
                          <span>Now</span>
                          <span className="text-blue-400">+12h (Forecast)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-5 backdrop-blur-sm shadow-sm">
                      <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase border-b border-zinc-800/80 pb-3">Simulation Controls</div>
                      
                      <div className="space-y-4 text-xs">
                        <div className="space-y-2">
                          <div className="flex justify-between font-mono">
                            <span className="text-zinc-400">Data Degradation Factor</span>
                            <span className="text-blue-400 font-semibold">1.84x</span>
                          </div>
                          <input 
                            type="range" 
                            min="1.0" 
                            max="5.0" 
                            step="0.1" 
                            defaultValue="1.8" 
                            onChange={(e) => {
                              addLog(`Predictions Simulator: Re-indexing risk projections with degradation factor ${e.target.value}x`);
                            }}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                          />
                        </div>

                        <div className="pt-3 border-t border-zinc-800/60 space-y-3 font-mono text-[11px] text-zinc-400">
                          <div className="flex justify-between">
                            <span>Predicted anomaly drift:</span>
                            <span className="text-red-400 font-semibold">48 hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Model accuracy index:</span>
                            <span className="text-blue-400 font-semibold">94.8% (AUC)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Continuous dataset:</span>
                            <span className="text-zinc-300 font-semibold">45,102 inbounds</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button 
                            onClick={() => {
                              addLog("Predictions Simulator: Recalculated models with active ARIMA parameter gates");
                              addLog("Predictions: Recalibration complete. Drift alarm thresholds successfully adjusted.");
                            }}
                            className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-lg font-semibold transition-all duration-200 text-[11px] cursor-pointer"
                          >
                            RE-CALIBRATE PROJECTIONS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TOPOLOGY INTELLIGENCE MAP TAB */}
              {activeTab === "Map" && (
                <div className="space-y-6">
                  <EnterpriseIntelligenceMap
                    addLog={addLog}
                    isAtlasRunning={isAtlasRunning}
                    activeTimelineStage={activeTimelineStage}
                  />
                </div>
              )}

              {/* ORGANIZATIONAL MEMORY TAB */}
              {activeTab === "Memory" && (
                <OrganizationalMemory addLog={addLog} />
              )}

              {/* DEMO MODE TAB */}
              {activeTab === "Demo" && (
                <DemoMode addLog={addLog} />
              )}

              {/* INCIDENT REPLAY TAB */}
              {activeTab === "Replay" && (
                <IncidentReplay addLog={addLog} />
              )}

              {/* DECISION CENTER TAB */}
              {activeTab === "Decision" && (
                <DecisionCenter addLog={addLog} liveState={liveAtlasState} realTimeStatus={realTimeStatus} />
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Console System Status Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
        <div>
          <span>© 2026 ORIXA Intelligence Systems Inc. All operational sandboxes encrypted under AES-256 constraints.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-blue-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            CORE_HEALTH: SECURE
          </span>
          <span>|</span>
          <span>TIME: 2026-07-13T03:37:38Z</span>
        </div>
      </footer>

      {/* 5. Command Palette Modal (Ctrl+K) */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommandPaletteOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            
            {/* Palette Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Search input header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/80 bg-zinc-900">
                <span className="text-zinc-500 text-xs font-mono">⌘K</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="Type a command or search Orixa operations..."
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-sm font-sans py-1"
                />
                <button
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs px-2 py-1 rounded bg-zinc-850"
                >
                  ESC
                </button>
              </div>

              {/* Commands List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-zinc-800/20 max-h-[50vh] scrollbar-thin scrollbar-thumb-zinc-800">
                {/* Navigation Group */}
                <div className="pb-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">Navigation</div>
                  {[
                    { label: "Go to Dashboard Console", tab: "Dashboard", desc: "Main operator summary and SRE feeds" },
                    { label: "Go to Atlas Operations Console", tab: "Atlas", desc: "Atlas Supervisor real-time telemetry" },
                    { label: "Go to Enterprise Map", tab: "Map", desc: "Observe active multi-agent reasoning flow" },
                    { label: "Go to Decision DNA Center", tab: "Decision", desc: "Operator consensus and approval ledger" },
                    { label: "Go to Context Catalog (DataHub)", tab: "Context", desc: "Explore metadata schemas and lineages" },
                    { label: "Go to Organizational Memory", tab: "Memory", desc: "Query vector embeddings and past events" },
                    { label: "Go to Incident Replay", tab: "Replay", desc: "Interactive time-series replay" },
                  ]
                    .filter(c => c.label.toLowerCase().includes(commandSearch.toLowerCase()) || c.desc.toLowerCase().includes(commandSearch.toLowerCase()))
                    .map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(item.tab as any);
                          setIsCommandPaletteOpen(false);
                          addLog(`Command Palette: Navigated to tab "${item.tab}"`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-800/80 group transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-medium text-zinc-200 group-hover:text-white">{item.label}</div>
                          <div className="text-[10px] text-zinc-500">{item.desc}</div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/60">ENTER</span>
                      </button>
                    ))}
                </div>

                {/* Operations Group */}
                <div className="pt-2 pb-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">System Controls</div>
                  {[
                    {
                      label: "Toggle DataHub Connection Mode",
                      action: () => {
                        setIsDataHubConnected(!isDataHubConnected);
                        addLog(`Command Palette: Toggled DataHub Sync Gateway to ${!isDataHubConnected ? "ACTIVE" : "STANDBY"}`);
                      },
                      desc: "Toggle between live REST socket and local cached metadata"
                    },
                    {
                      label: "Synchronize Metadata Lineage Cache",
                      action: () => {
                        addLog("Command Palette: Triggering priority metadata graph synchronization...");
                        setIsDataHubConnected(true);
                      },
                      desc: "Refresh schema fields, owners and lineage connections"
                    },
                    {
                      label: "Simulate Urgent Physical Drift Incident",
                      action: () => {
                        setActiveTab("Atlas");
                        setIsAtlasRunning(true);
                        setActiveTimelineStage("analyzing");
                        addLog("Command Palette: Dispatched SRE drift alert event mock.");
                      },
                      desc: "Inject virtual cluster failure and boot Atlas pipeline"
                    },
                    {
                      label: "Clear Platform Activity Logs",
                      action: () => {
                        setConsoleLogs(["System: Platform logs successfully re-initialized."]);
                      },
                      desc: "Flush volatile telemetry memory caches"
                    }
                  ]
                    .filter(c => c.label.toLowerCase().includes(commandSearch.toLowerCase()) || c.desc.toLowerCase().includes(commandSearch.toLowerCase()))
                    .map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          item.action();
                          setIsCommandPaletteOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-500/10 group transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-medium text-zinc-200 group-hover:text-white">{item.label}</div>
                          <div className="text-[10px] text-zinc-500">{item.desc}</div>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">RUN</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Use keyboard shortcut <kbd className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-400 font-bold">⌘K</kbd> to toggle</span>
                <span>Press <kbd className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-400">Esc</kbd> to exit</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Orixa Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Branding Header */}
              <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-indigo-400/20">
                  <span className="text-2xl font-display">Ω</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-black tracking-widest text-white leading-none">ORIXA</h3>
                  <p className="text-[10px] font-mono font-bold text-indigo-400 mt-1 uppercase tracking-wider">
                    Enterprise Intelligence Operating System
                  </p>
                </div>
              </div>

              {/* Core Context Content */}
              <div className="p-6 space-y-4 text-xs font-sans text-zinc-300 leading-relaxed">
                <p>
                  Orixa is an innovative operational control plane designed to transform enterprise data catalogs (grounded on <strong>DataHub</strong> schemas) into secure, explainable, and collaborative intelligence workflows.
                </p>
                
                <div className="p-3.5 bg-zinc-950/50 border border-zinc-850 rounded-xl space-y-2 font-mono text-[10px]">
                  <div className="text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    System Specifications
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Platform Build:</span>
                    <span className="text-zinc-300 font-bold">v1.0.0-RC1 (Stable)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Kernel Coexistence:</span>
                    <span className="text-zinc-300">Express / FastAPI dual-core</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cognitive Layer:</span>
                    <span className="text-indigo-400 font-semibold">Google Gemini Models</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Security Gate:</span>
                    <span className="text-emerald-400">Decision DNA Human Consent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">License:</span>
                    <span className="text-zinc-300">Apache 2.0 (OSS Enterprise)</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-zinc-400">
                  <p className="font-semibold text-zinc-200">The Orixa Philosophy:</p>
                  <p className="italic font-display text-zinc-500 text-xs">"Context → Intelligence → Explainability → Trust"</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">© 2026 Orixa Technologies</span>
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-750 transition-all cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
