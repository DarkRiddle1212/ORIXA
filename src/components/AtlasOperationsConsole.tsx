import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Clock,
  Cpu,
  Layers,
  Terminal,
  Activity,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCw,
  TrendingUp,
  Sliders,
  Shield,
  Search,
  Database,
  RefreshCw,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Server,
  Lock,
  Compass,
  FileText,
  UserCheck,
  Send,
  SlidersHorizontal,
  Eye,
  Workflow,
  ListCollapse,
  BadgeAlert,
  HardDrive,
  Network
} from "lucide-react";

interface AtlasOperationsConsoleProps {
  addLog: (log: string) => void;
  activeInvestigationId?: string;
  onNavigateTab?: (tab: "Dashboard" | "Atlas" | "Context" | "Investigations" | "Specialists" | "Knowledge" | "Predictions" | "Settings" | "Memory" | "Demo" | "Replay" | "Map" | "Decision") => void;
  liveState?: any;
  realTimeStatus?: "Connected" | "Reconnecting" | "Offline";
}

const STAGES = [
  "Receiving Request",
  "Reading Organizational Context",
  "Searching Organizational Memory",
  "Coordinating Specialists",
  "Generating Recommendation",
  "Completed"
];

const STAGE_DESCRIPTIONS: Record<string, string> = {
  "Receiving Request": "Ingesting operational alerts, threat vectors, or natural language prompts into Orixa isolated thread space.",
  "Reading Organizational Context": "Scanning active physical databases, DataHub catalogs, schema lineage paths, and tenant access rules.",
  "Searching Organizational Memory": "Querying semantic vector memory databases for correlated historic incidents, mitigations, and runbook rules.",
  "Coordinating Specialists": "Coordinating the specialist multi-agent squad to execute target validation, threat assessment, and blast radius isolation.",
  "Generating Recommendation": "Compiling final rollback-supported migration scripts, VPC security rules, and comprehensive executive reports.",
  "Completed": "Delivering recommendation package safely to the Orixa Decision Center, ready for immediate human-in-the-loop validation."
};

const INVESTIGATION_DETAILS: Record<string, {
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  blastRadius: string;
  policyGrounding: string;
  rootCause: string;
  governanceCode: string;
  threatScore: number;
  targetedSystems: string[];
  specialistRationale: Record<string, string>;
}> = {
  "silent-schema-disaster": {
    name: "Silent Schema Drift: users_sandbox deviation",
    severity: "HIGH",
    blastRadius: "14 downstream datasets, 2 Looker dashboards, 1 billing ETL pipeline",
    policyGrounding: "GOV-SEC-09 (Database Write Access & Production Integrity Check)",
    rootCause: "Column mismatch in billing sandboxed physical table, causing silent sync degradation",
    governanceCode: "GOV-SEC-09",
    threatScore: 8.4,
    targetedSystems: ["Postgres users_sandbox", "Fivetran Sync Broker", "Looker Finance Dashboard", "dbt Core Models"],
    specialistRationale: {
      "Receiving Request": "Allocating isolated supervision thread space and parsing DataHub catalog deviation alerts.",
      "Reading Organizational Context": "Architect is scanning the active physical schema catalogs and matching column metadata fields with DataHub graph nodes.",
      "Searching Organizational Memory": "Archivist is querying vector memories for historic column mismatch patterns. Historic incident #MEM-8FA4 retrieved.",
      "Coordinating Specialists": "Architect is computing graph-depth dependency maps to isolate down-stream pipeline failure risks.",
      "Generating Recommendation": "Compiler is synthesizing PostgreSQL schema alteration transaction blocks and rollback verification checks.",
      "Completed": "Operational recommendation packages compiled. Forwarding payload to Decision Center for review."
    }
  },
  "compromised-dev-keys-leak": {
    name: "Compromised Dev Keys Leak: staging token",
    severity: "CRITICAL",
    blastRadius: "Production staging clusters, Vault secrets backend, developer CLI authorization tokens",
    policyGrounding: "SEC-CRED-14 (Access Key Rotation & Isolation Boundaries)",
    rootCause: "Unencrypted staging access token committed in public sandbox branch",
    governanceCode: "SEC-CRED-14",
    threatScore: 9.6,
    targetedSystems: ["HashiCorp Vault KV", "K8s Staging Pods", "Github Sandbox Repository", "AWS IAM Credentials"],
    specialistRationale: {
      "Receiving Request": "Signal interception active. Ingesting suspicious repository metadata and sandbox logs.",
      "Reading Organizational Context": "Sentinel scanner is auditing sandbox commit hashes, repository authors, and container access policies.",
      "Searching Organizational Memory": "Archivist searching vector repositories for matches with historic credentials exposure mitigation structures.",
      "Coordinating Specialists": "Sentinel isolation engine running active quarantine checks on live container network gateways.",
      "Generating Recommendation": "Sentinel synthesizing security containment playbook guidelines, IAM revokers, and token replacement triggers.",
      "Completed": "Malicious access path fully mitigated. Playbook actions completed. Final audit report available in Decision Center."
    }
  }
};

const BACKGROUND_SRE_EVENTS = [
  "Performing periodic DataHub lineage index alignment check...",
  "Lineage graph verified: 14 downstream dataset nodes intact.",
  "Metadata sync socket TCP/3001 reporting healthy latency: 12ms.",
  "Scanning active workspace container sandbox directory permissions...",
  "Retrieving governance policies list from Orixa Local Schema Database...",
  "Evaluating compliance parameters: no violation alerts detected.",
  "Archivist micro-thread: refreshing index matrices...",
  "Evaluating cluster consensus: active specialists are in continuous state sync.",
  "System telemetry checkpoint: Memory 32.4%, CPU 4.8%, ThreadPool OK.",
  "Sentinel node: heartbeating on network ingress filter (VPC-02-SANDBOX)...",
  "Director Daemon: analyzing physical schema entropy for postgres sandboxes..."
];

export default function AtlasOperationsConsole({ addLog, activeInvestigationId = "silent-schema-disaster", onNavigateTab, liveState, realTimeStatus }: AtlasOperationsConsoleProps) {
  const [selectedInvestigation, setSelectedInvestigation] = useState<string>(activeInvestigationId);
  const [currentStage, setCurrentStage] = useState<string>("Coordinating Specialists");
  const [afterLongInactivity, setAfterLongInactivity] = useState<boolean>(false);
  const [stateData, setStateData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<{ hasError: boolean; reason: string; action: string } | null>(null);

  // UX refined states
  const [activeBriefingTab, setActiveBriefingTab] = useState<"directives" | "assertions" | "audit">("directives");
  const [activeLedgerTab, setActiveLedgerTab] = useState<"datahub" | "memory" | "governance">("datahub");
  const [cpuUsage, setCpuUsage] = useState<number>(4.8);
  const [memoryUsage, setMemoryUsage] = useState<number>(32.4);
  const [simulatedLogs, setSimulatedLogs] = useState<Array<{ time: string; text: string }>>([
    { time: "03:48:10", text: "Atlas background worker: continuous catalog sync active." },
    { time: "03:49:15", text: "Evaluating schema health metrics on branch 'users_sandbox'." },
    { time: "03:50:02", text: "Supervisor fleet verified 8 independent AI specialists." }
  ]);

  // Command input simulation
  const [manualCommand, setManualCommand] = useState<string>("");

  // Sparkline simulation
  const [sparkValues, setSparkValues] = useState<number[]>([20, 45, 28, 80, 55, 60, 35, 45, 60, 50, 75, 40]);

  // Auto-running simulation for the console progress
  const [isAutoProgress, setIsAutoProgress] = useState<boolean>(!liveState);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConsoleState = async (id: string, stage: string, inactivity: boolean) => {
    try {
      const response = await fetch(`/api/v1/atlas_console/state?investigation_id=${id}&stage=${encodeURIComponent(stage)}&after_long_inactivity=${inactivity}`);
      if (!response.ok) {
        throw new Error("Metadata connection timed out.");
      }
      const data = await response.json();
      setStateData(data);
      setErrorState(null);
    } catch (err: any) {
      console.error(err);
      setErrorState({
        hasError: true,
        reason: "DataHub connection metadata port (TCP/3001) unavailable or credentials expired.",
        action: "Verify DataHub availability in the Settings panel, or switch to local cache."
      });
    } finally {
      setLoading(false);
    }
  };

  // Synchronize with liveState if provided by SSE
  useEffect(() => {
    if (liveState) {
      setStateData(liveState);
      setSelectedInvestigation(liveState.current_investigation_id);
      setCurrentStage(liveState.progress.stage_name);
      setIsAutoProgress(false); // Let server drive progression
      setLoading(false);
    }
  }, [liveState]);

  // Fallback Polling if liveState is NOT provided
  useEffect(() => {
    if (!liveState) {
      fetchConsoleState(selectedInvestigation, currentStage, afterLongInactivity);
    }
  }, [selectedInvestigation, currentStage, afterLongInactivity, liveState]);

  // Stage automation effect (only active when NOT in real-time)
  useEffect(() => {
    if (isAutoProgress && !liveState) {
      progressTimerRef.current = setInterval(() => {
        setCurrentStage((prevStage) => {
          const currentIndex = STAGES.indexOf(prevStage);
          if (currentIndex === -1 || currentIndex === STAGES.length - 1) {
            return STAGES[0]; // Reset loop
          }
          return STAGES[currentIndex + 1];
        });
      }, 7000);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isAutoProgress, liveState]);

  // Simulate persistent live monitoring changes
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setCpuUsage((prev) => {
        const diff = (Math.random() - 0.5) * 1.5;
        const val = prev + diff;
        return parseFloat(Math.min(Math.max(val, 2.0), 12.0).toFixed(1));
      });
      setMemoryUsage((prev) => {
        const diff = (Math.random() - 0.5) * 0.8;
        const val = prev + diff;
        return parseFloat(Math.min(Math.max(val, 30.0), 36.0).toFixed(1));
      });
      setSparkValues((prev) => {
        const next = [...prev.slice(1)];
        next.push(Math.floor(Math.random() * 80) + 15);
        return next;
      });
    }, 4000);

    const logsInterval = setInterval(() => {
      const randomEvent = BACKGROUND_SRE_EVENTS[Math.floor(Math.random() * BACKGROUND_SRE_EVENTS.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setSimulatedLogs((prev) => [
        { time: timeStr, text: randomEvent },
        ...prev.slice(0, 12)
      ]);
    }, 5500);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(logsInterval);
    };
  }, []);

  const handleStageSelect = (stage: string) => {
    setIsAutoProgress(false);
    setCurrentStage(stage);
    addLog(`Atlas Console: Operator manually set active stage to "${stage}" for inspection.`);
  };

  const toggleAutoProgress = () => {
    setIsAutoProgress(!isAutoProgress);
    addLog(`Atlas Console: ${!isAutoProgress ? "Enabled" : "Paused"} auto-progression workflow.`);
  };

  const triggerErrorSimulation = () => {
    addLog("Atlas Console: Simulated connection fault to DataHub catalog registry.");
    setErrorState({
      hasError: true,
      reason: "Atlas metadata socket handshake failure with DataHub Enterprise Broker.",
      action: "Restart cluster container or toggle standard offline caching in settings."
    });
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCommand.trim()) return;
    executeConsoleCommand(manualCommand);
  };

  const executeConsoleCommand = (commandText: string) => {
    addLog(`Operator command: "${commandText}"`);
    
    const cmd = commandText.toLowerCase().trim();
    const now = new Date().toTimeString().split(" ")[0];
    let reply = "Directive logged. Dispatching background validation thread.";
    
    if (cmd === "status" || cmd === "diagnose") {
      reply = `System Status: [${stateData?.status || "HEALTHY"}]. Active specialized nodes are synchronized. Uptime: 99.98%`;
    } else if (cmd === "sync" || cmd === "datahub") {
      reply = "Initiating priority DataHub catalog graph synchronization. Lineage sockets verified in 12ms.";
    } else if (cmd === "specialist" || cmd === "agents") {
      reply = "Consensus matrices active: Architect (98%), Sentinel (100%), Archivist (92%), Forge (94%) responsive.";
    } else if (cmd === "quarantine") {
      reply = "CRITICAL DIRECTIVE: Isolating targeted branch 'users_sandbox' network gate and deploying firewall container patch.";
    } else if (cmd === "help") {
      reply = "Valid commands: 'status' (health check), 'sync' (refresh catalog), 'agents' (view AI roster), 'quarantine' (isolate environment).";
    }

    setSimulatedLogs((prev) => [
      { time: now, text: `Command Ingest: ${commandText}` },
      { time: now, text: `Atlas Response: [DIRECTOR] ${reply}` },
      ...prev
    ]);
    setManualCommand("");
  };

  const getStatusBadgeStyles = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("investig")) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    if (s.includes("wait") || s.includes("review")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (s.includes("ready") || s.includes("healthy") || s.includes("complete")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s.includes("offline")) return "bg-zinc-800 text-zinc-400 border-zinc-700";
    return "bg-zinc-900 border-zinc-800 text-zinc-300";
  };

  const currentCaseDetails = INVESTIGATION_DETAILS[selectedInvestigation] || INVESTIGATION_DETAILS["silent-schema-disaster"];

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)]" id="atlas-operations-console-core">
      
      {/* 1. TOP CONSOLE SUPERVISORY HEADER */}
      <div className="p-5 border-b border-zinc-900 bg-zinc-950/75 backdrop-blur-md flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] relative">
            <Brain className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                Supervisor Fleet Interface
              </span>
              <span className="text-zinc-800 text-xs">|</span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
                Live Console Active (TCP/3001)
              </span>
            </div>
            <h3 className="text-base font-display font-black text-white tracking-wide mt-0.5 flex items-center gap-2">
              Atlas Operations Console
              <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md font-medium">
                v2.4.0-Production
              </span>
            </h3>
          </div>
        </div>

        {/* Dynamic global metrics line */}
        <div className="hidden xl:flex items-center gap-6 text-[10px] font-mono border-l border-zinc-900 pl-6 mr-auto">
          <div className="space-y-0.5">
            <div className="text-zinc-500">ACTIVE SPECIALISTS</div>
            <div className="text-white font-black">5 ONLINE / 1 SLEEPING</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-zinc-500">COORDINATION CONSENSUS</div>
            <div className="text-indigo-400 font-black">ACTIVE (100%)</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-zinc-500">ORGANIZATIONAL MEMORY URN</div>
            <div className="text-emerald-400 font-black">ORIXA-MEM-V3</div>
          </div>
        </div>

        {/* Interactive Controller buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onNavigateTab && (
            <div className="flex items-center gap-1 border border-zinc-900 bg-zinc-950 p-1 rounded-lg mr-2">
              <button
                onClick={() => onNavigateTab("Decision")}
                className="px-2 py-1 rounded text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer hover:bg-zinc-900"
                title="Go to Decision Center"
              >
                Decisions
              </button>
              <span className="text-zinc-800 text-[10px] select-none">|</span>
              <button
                onClick={() => onNavigateTab("Replay")}
                className="px-2 py-1 rounded text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer hover:bg-zinc-900"
                title="Go to Incident Replay"
              >
                Replay
              </button>
              <span className="text-zinc-800 text-[10px] select-none">|</span>
              <button
                onClick={() => onNavigateTab("Map")}
                className="px-2 py-1 rounded text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer hover:bg-zinc-900"
                title="Go to Intelligence Map"
              >
                Map
              </button>
            </div>
          )}

          <button
            onClick={() => {
              const nextId = selectedInvestigation === "silent-schema-disaster" ? "compromised-dev-keys-leak" : "silent-schema-disaster";
              setSelectedInvestigation(nextId);
              addLog(`Atlas Console: Switched active target to "${nextId}".`);
            }}
            className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-200 rounded-lg text-[10px] font-mono transition-all cursor-pointer font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Compass className="h-3 w-3 text-indigo-400" />
            ROTATE CASE
          </button>

          <button
            onClick={toggleAutoProgress}
            className={`px-2.5 py-1.5 border rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isAutoProgress
                ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/20"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            {isAutoProgress ? (
              <>
                <RotateCw className="h-3 w-3 animate-spin" /> STAGE LOOPING
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-emerald-400" /> LOOP STAGES
              </>
            )}
          </button>

          <button
            onClick={triggerErrorSimulation}
            className="p-1.5 bg-zinc-950 hover:bg-red-950/20 border border-zinc-900 hover:border-red-900/30 text-zinc-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
            title="Simulate DataHub Connection Fault"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {errorState ? (
        <div className="p-8 bg-red-950/10 border border-red-900/20 m-5 rounded-2xl flex items-start gap-4 animate-fade-in">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
              UNABLE TO RETRIEVE METADATA
            </h4>
            <div className="space-y-1">
              <p className="text-xs text-zinc-300 font-sans">
                <span className="font-bold font-mono text-red-300/80">Reason:</span> {errorState.reason}
              </p>
              <p className="text-xs text-zinc-400 font-sans">
                <span className="font-bold font-mono text-zinc-500">Suggested Action:</span> {errorState.action}
              </p>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setErrorState(null);
                  fetchConsoleState(selectedInvestigation, currentStage, afterLongInactivity);
                  addLog("Atlas Console: Re-established metadata pipeline sync.");
                }}
                className="px-3 py-1.5 bg-red-950/30 hover:bg-red-950/50 border border-red-900/50 text-red-400 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer"
              >
                RETRY HANDSHAKE
              </button>
              <button
                onClick={() => {
                  setErrorState(null);
                  setCurrentStage("Completed");
                  addLog("Atlas Console: Engaged offline caching backup.");
                }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer"
              >
                ENGAGE LOCAL CACHE
              </button>
            </div>
          </div>
        </div>
      ) : loading || !stateData ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-7 w-7 text-indigo-500 animate-spin" />
          <span className="text-[10px] font-mono text-zinc-500 tracking-wider animate-pulse">
            SYNCHRONIZING ATLAS STATE FEED...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-zinc-900">
          
          {/* ==========================================
              LEFT COLUMN (7 COLS): Briefings, Telemetry, Stage Path, Specialists
              ========================================== */}
          <div className="lg:col-span-7 bg-zinc-950 p-6 space-y-6">
            
            {/* 2. OPERATIONAL BRIEFINGS CARD (DIRECTOR CONTEXT) */}
            <div className="border border-zinc-900 rounded-xl bg-zinc-950 overflow-hidden shadow-inner">
              <div className="bg-zinc-900/40 px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                    Operations Director Executive Briefing
                  </span>
                </div>
                
                {/* 3 tabs: Directives, Assertions, AND Audit (Newly implemented for UX Polish) */}
                <div className="flex gap-1 border border-zinc-800 bg-zinc-950/50 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveBriefingTab("directives")}
                    className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                      activeBriefingTab === "directives"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Directives
                  </button>
                  <button
                    onClick={() => setActiveBriefingTab("assertions")}
                    className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                      activeBriefingTab === "assertions"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Assertions
                  </button>
                  <button
                    onClick={() => setActiveBriefingTab("audit")}
                    className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                      activeBriefingTab === "audit"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Director's Log
                  </button>
                </div>
              </div>

              <div className="p-4 min-h-[140px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeBriefingTab === "directives" && (
                    <motion.div
                      key="directives"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="space-y-3"
                    >
                      <div className="p-3 bg-indigo-950/10 border border-indigo-900/30 rounded-xl">
                        <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                          DIRECTOR SUPERVISORY DIRECTIVE
                        </span>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                          {stateData.greeting}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[10px] text-zinc-400 font-mono">
                        <div className="flex items-center gap-2 border border-zinc-900/60 bg-zinc-950 p-2 rounded-lg">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-white block font-sans">DataHub Lineage</span>
                            <span className="text-zinc-500 text-[9px]">Continuous Alignment OK</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 border border-zinc-900/60 bg-zinc-950 p-2 rounded-lg">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-white block font-sans">Multi-Agent Consensus</span>
                            <span className="text-zinc-500 text-[9px]">All 5 Specialist Threads Synced</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeBriefingTab === "assertions" && (
                    <motion.div
                      key="assertions"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="space-y-2.5"
                    >
                      <span className="text-[8px] font-mono font-black text-amber-400 uppercase tracking-widest block">
                        CONTINUOUS SYSTEM ASSERTIONS REGISTER
                      </span>
                      <div className="text-[10px] font-mono text-zinc-400 space-y-1.5">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-1 text-zinc-500 font-bold uppercase text-[9px]">
                          <span>Assertion ID</span>
                          <span>Target Constraint</span>
                          <span>Status</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-zinc-300 py-1 border-b border-zinc-900/40">
                          <span className="font-bold">SCHEMA_DRIFT_DETECTED</span>
                          <span className="text-zinc-400">branch_sandbox_v1 == DB_PROD</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[9px]">
                            UNRESOLVED
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-zinc-300 py-1 border-b border-zinc-900/40">
                          <span className="font-bold">CREDENTIAL_ISOLATION_LIMIT</span>
                          <span className="text-zinc-400">quarantine_rules_enabled == true</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px]">
                            VERIFIED
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-zinc-300 py-1 border-b border-zinc-900/40">
                          <span className="font-bold">METADATA_GRAPH_INTEGRITY</span>
                          <span className="text-zinc-400">all_downstream_nodes_mapped</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px]">
                            STABLE
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-zinc-300 py-1">
                          <span className="font-bold">PII_ENCRYPT_ENFORCEMENT</span>
                          <span className="text-zinc-400">unmasked_fields == 0</span>
                          {selectedInvestigation === "silent-schema-disaster" ? (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[9px]">
                              FAILED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[9px]">
                              ATTENTION
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeBriefingTab === "audit" && (
                    <motion.div
                      key="audit"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="space-y-2.5"
                    >
                      <span className="text-[8px] font-mono font-black text-indigo-400 uppercase tracking-widest block">
                        DIRECTOR'S SUPERVISORY AUDIT DECK
                      </span>
                      
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {selectedInvestigation === "silent-schema-disaster" ? (
                          <>
                            <div className="flex gap-2 items-start text-[10px] font-mono text-zinc-400">
                              <span className="text-indigo-400 font-bold">[08:15:30]</span>
                              <p className="flex-1 leading-normal">
                                <strong className="text-white">SYSTEM_DAEMON</strong>: Initialized multi-agent correlation mapping on postgres catalog schema <code className="text-zinc-200">users_sandbox</code>.
                              </p>
                            </div>
                            <div className="flex gap-2 items-start text-[10px] font-mono text-zinc-400">
                              <span className="text-indigo-400 font-bold">[08:16:11]</span>
                              <p className="flex-1 leading-normal">
                                <strong className="text-white">MEMORY_ALIGN</strong>: Retrieved historical database schema drift matching index <code className="text-indigo-300">#MEM-8FA4</code> with 89% similarity.
                              </p>
                            </div>
                            <div className="flex gap-2 items-start text-[10px] font-mono text-zinc-400">
                              <span className="text-indigo-400 font-bold">[08:16:44]</span>
                              <p className="flex-1 leading-normal">
                                <strong className="text-white">COORD_STATION</strong>: Dispatched <code className="text-amber-400">Architect</code> specialist node to trace Looker schema dependency mappings.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex gap-2 items-start text-[10px] font-mono text-zinc-400">
                              <span className="text-red-400 font-bold">[11:20:00]</span>
                              <p className="flex-1 leading-normal">
                                <strong className="text-white">SENTINEL_FIREWALL</strong>: Isolated sandbox ingress ports (Port 3000 block on cluster staging-02) due to security baseline violation.
                              </p>
                            </div>
                            <div className="flex gap-2 items-start text-[10px] font-mono text-zinc-400">
                              <span className="text-indigo-400 font-bold">[11:21:05]</span>
                              <p className="flex-1 leading-normal">
                                <strong className="text-white">GOV_AUDIT</strong>: Verified token exposure in sandbox git commits matching policy rules <code className="text-zinc-200">SEC-CRED-14</code>.
                              </p>
                            </div>
                            <div className="flex gap-2 items-start text-[10px] font-mono text-zinc-400">
                              <span className="text-indigo-400 font-bold">[11:21:40]</span>
                              <p className="flex-1 leading-normal">
                                <strong className="text-white">PLAYBOOK_DEPLOY</strong>: Generated secure credentials rotation patch. Dispatched alerts to <code className="text-zinc-200">#security-war-room</code>.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 3. PERSISTENT LIVE METRICS HUD & SYSTEM PULSE GAUGE */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 hover:border-zinc-800 transition-all">
                <div className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-wider flex items-center justify-between">
                  <span>System Status</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold border rounded uppercase ${getStatusBadgeStyles(stateData.status)}`}>
                    {stateData.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 hover:border-zinc-800 transition-all">
                <div className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-wider flex items-center justify-between">
                  <span>CPU Active Load</span>
                  <Activity className="h-2.5 w-2.5 text-indigo-400 animate-pulse" />
                </div>
                <div className="pt-1 text-white font-mono text-xs font-black flex items-center justify-between">
                  <span>{cpuUsage}%</span>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1 rounded-sm">Nominal</span>
                </div>
                {/* Simulated live visual sparkline bars */}
                <div className="flex items-end gap-[1px] h-3 pt-1">
                  {sparkValues.map((val, idx) => (
                    <div 
                      key={idx} 
                      className="bg-indigo-500/80 rounded-[1px] flex-1"
                      style={{ height: `${val / 8}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 hover:border-zinc-800 transition-all">
                <div className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-wider flex items-center justify-between">
                  <span>Audit Memory</span>
                  <HardDrive className="h-2.5 w-2.5 text-zinc-500" />
                </div>
                <div className="pt-1 text-white font-mono text-xs font-black flex items-center justify-between">
                  <span>{memoryUsage}%</span>
                  <span className="text-[9px] text-zinc-400 font-bold bg-zinc-900 border border-zinc-800 px-1 rounded-sm">32.4GB/128G</span>
                </div>
                {/* Horizontal dynamic usage bar */}
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-zinc-400 transition-all duration-1000" style={{ width: `${memoryUsage}%` }} />
                </div>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 hover:border-zinc-800 transition-all">
                <div className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-wider flex items-center justify-between">
                  <span>Est. Execution</span>
                  <Clock className="h-2.5 w-2.5 text-indigo-400 animate-spin-slow" />
                </div>
                <div className="pt-1 text-indigo-400 font-mono text-xs font-black flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sliders className="h-3 w-3 shrink-0" />
                    <span>{stateData.progress.estimated_remaining_seconds}s</span>
                  </span>
                  <span className="text-[9px] text-zinc-500">Remaining</span>
                </div>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden mt-1.5 relative">
                  <div className="h-full bg-indigo-500 animate-pulse" style={{ width: `${100 - (stateData.progress.estimated_remaining_seconds * 10)}%` }} />
                </div>
              </div>

            </div>

            {/* 4. CURRENT INVESTIGATION SUMMARY & RICHER CONTEXT LEDGER */}
            <div className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-xl relative overflow-hidden space-y-4 shadow-inner">
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[8px] font-mono border border-red-500/20 rounded uppercase tracking-widest font-black flex items-center gap-1 shadow-sm">
                  <BadgeAlert className="h-2.5 w-2.5" />
                  {currentCaseDetails.severity} SEVERITY
                </span>
                <span className="px-2 py-0.5 bg-zinc-950 text-zinc-400 text-[8px] font-mono border border-zinc-800 rounded font-bold">
                  THREAT_SCORE: {currentCaseDetails.threatScore}/10
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-mono text-indigo-400 uppercase font-black tracking-widest flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Target Under Automated Audit & Supervision
                </div>
                <h4 className="text-sm font-display font-black text-white tracking-wide">
                  {stateData.current_investigation}
                </h4>
              </div>

              {/* Rich Context Explanation details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-900/60 text-xs">
                <div className="space-y-1 bg-zinc-950 p-2.5 border border-zinc-900/80 rounded-lg">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Estimated Blast Radius</span>
                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                    {currentCaseDetails.blastRadius}
                  </p>
                </div>
                <div className="space-y-1 bg-zinc-950 p-2.5 border border-zinc-900/80 rounded-lg">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Governance Policy Alignment</span>
                  <p className="text-[11px] text-zinc-300 font-mono leading-normal text-indigo-300">
                    {currentCaseDetails.policyGrounding}
                  </p>
                </div>
              </div>

              {/* Targeted Systems Visual Roster for Rich Context */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-black block">
                  Targeted Systems Under Observation
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCaseDetails.targetedSystems.map((sys, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-zinc-950 border border-zinc-900 text-zinc-300 rounded text-[10px] font-mono flex items-center gap-1 hover:border-zinc-700 transition-colors cursor-default"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. STAGE-BASED PROGRESS VISUALIZER WITH INTERACTIVE HOVERS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Supervisor Investigation Phase
                </h4>
                <span className="text-[10px] font-mono text-zinc-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                  {stateData.progress.progress_percentage}% Compilation Progress
                </span>
              </div>

              {/* Graphical Stage Progress Path */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {STAGES.map((st, sIdx) => {
                  const currentIdx = STAGES.indexOf(currentStage);
                  const isCurrent = st === currentStage;
                  const isCompleted = STAGES.indexOf(st) < currentIdx;
                  
                  return (
                    <button
                      key={st}
                      onClick={() => handleStageSelect(st)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all group relative ${
                        isCurrent
                          ? "bg-indigo-950/20 border-indigo-500/80 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] scale-[1.02]"
                          : isCompleted
                          ? "bg-zinc-900/40 border-emerald-900/40 text-emerald-400 hover:bg-zinc-900/70"
                          : "bg-zinc-950 border-zinc-900/60 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
                      }`}
                      title={`${st}: ${STAGE_DESCRIPTIONS[st]}`}
                    >
                      <div className="text-[8px] font-mono uppercase font-black tracking-wider flex items-center justify-between">
                        <span>Phase {sIdx + 1}</span>
                        {isCompleted && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                        {isCurrent && <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-ping" />}
                      </div>
                      <div className="text-[10px] font-black font-sans mt-1 leading-tight line-clamp-2">
                        {st}
                      </div>

                      {/* Micro-hover card showing stage specifics */}
                      <div className="absolute z-20 invisible group-hover:visible bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[10px] text-zinc-400 font-sans leading-relaxed w-48 -bottom-24 left-1/2 transform -translate-x-1/2 shadow-xl pointer-events-none">
                        <span className="font-mono font-bold text-white block mb-0.5 uppercase tracking-wide border-b border-zinc-900 pb-1">
                          {st}
                        </span>
                        {STAGE_DESCRIPTIONS[st]}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Linear animated progress bar with glowing tip */}
              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden relative">
                <motion.div 
                  className="h-full bg-indigo-500 rounded-full relative"
                  initial={{ width: "0%" }}
                  animate={{ width: `${stateData.progress.progress_percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <span className="absolute right-0 top-0 h-full w-2 bg-white animate-pulse" />
                </motion.div>
              </div>
            </div>

            {/* 6. ENHANCED SPECIALIST SELECTION ENGINE & STANDBY ROSTER */}
            <AnimatePresence mode="wait">
              {stateData.current_specialist ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4 shadow-sm relative overflow-hidden"
                >
                  {/* Subtle vector grid backdrop for futuristic SRE vibe */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 relative z-10">
                    <h5 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 text-indigo-400 animate-pulse" /> Specialist Selection Engine (Active & Standby Roster)
                    </h5>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                      Confidence Index: <span className="text-indigo-400 font-black">{stateData.current_specialist.confidence}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
                    {/* Active Specialist Card */}
                    <div className="md:col-span-8 flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0 mt-0.5 shadow-[0_0_15px_rgba(99,102,241,0.1)] animate-pulse">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-white">
                            {stateData.current_specialist.specialist_name === "Architect" && selectedInvestigation === "compromised-dev-keys-leak" ? "Sentinel" : stateData.current_specialist.specialist_name}
                          </span>
                          <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-400 uppercase font-bold">
                            {selectedInvestigation === "compromised-dev-keys-leak" ? "Security threat analysis & Containment" : stateData.current_specialist.role}
                          </span>
                          <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 uppercase">
                            ACTIVE NODE
                          </span>
                        </div>
                        
                        <div className="p-3 bg-zinc-900/50 border border-zinc-900 rounded-lg space-y-1">
                          <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-wider font-black block">
                            Active Coordinator Task Assignment
                          </span>
                          <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                            {stateData.current_specialist.current_activity}
                          </p>
                        </div>

                        {/* Specialist Selection Rationale */}
                        <div className="space-y-1 bg-zinc-950 p-3 border border-zinc-900 rounded-lg">
                          <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-wider font-black block">
                            Selection Rationale
                          </span>
                          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                            {currentCaseDetails.specialistRationale[currentStage] || "Assigned by SRE coordinator state matrix to trace entity dependency paths."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-900/60 mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-ping" />
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                              STATUS: {stateData.current_specialist.completion_status}
                            </span>
                          </div>

                          {/* Dynamic thumbs rater */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 group relative">
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                                Contribution Rating:
                              </span>
                              <HelpCircle className="h-3 w-3 text-zinc-600 hover:text-indigo-400 transition-colors cursor-help" />
                              
                              {/* Custom CSS/Tailwind Tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 w-64 hidden group-hover:block z-50 p-2.5 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 font-sans leading-normal rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
                                <div className="absolute -bottom-1 right-2.5 w-2 h-2 bg-zinc-950 border-b border-r border-zinc-800 rotate-45" />
                                <div className="font-mono text-[9px] text-indigo-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                                  <span className="h-1 w-1 bg-indigo-500 rounded-full" />
                                  Operator Feedback Engine
                                </div>
                                Ratings are stored to improve future agent selection accuracy, minimize model decision drift, and enhance systemic trust across the intelligence OS.
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={async () => {
                                  try {
                                    const specName = stateData.current_specialist.specialist_name === "Supervisor" ? "atlas" : stateData.current_specialist.specialist_name;
                                    const res = await fetch(`/api/v1/specialists/${specName.toLowerCase()}/rate`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ rating: "up" })
                                    });
                                    if (res.ok) {
                                      addLog(`Operator: Approved active contribution of specialist ${specName}. Dynamic accuracy scores adjusted.`);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="h-6 px-2 rounded bg-emerald-950/40 hover:bg-emerald-900/30 border border-emerald-900/40 text-emerald-400 font-mono text-[9px] font-extrabold transition-all cursor-pointer flex items-center gap-1"
                                title="Approve Contribution (Thumbs Up)"
                              >
                                👍 {stateData.current_specialist.thumbs_up !== undefined ? stateData.current_specialist.thumbs_up : ""}
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const specName = stateData.current_specialist.specialist_name === "Supervisor" ? "atlas" : stateData.current_specialist.specialist_name;
                                    const res = await fetch(`/api/v1/specialists/${specName.toLowerCase()}/rate`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ rating: "down" })
                                    });
                                    if (res.ok) {
                                      addLog(`Operator: Flagged specialist ${specName} for selection deviation.`);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="h-6 px-2 rounded bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/40 text-rose-400 font-mono text-[9px] font-extrabold transition-all cursor-pointer flex items-center gap-1"
                                title="Drift Penalty (Thumbs Down)"
                              >
                                👎 {stateData.current_specialist.thumbs_down !== undefined ? stateData.current_specialist.thumbs_down : ""}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Standby Specialist list to show Atlas multi-agent roster */}
                    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-4 space-y-2">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-black block">
                        CO-SPECIALISTS ON DECK
                      </span>
                      
                      <div className="space-y-1.5 text-[10px] font-mono">
                        <div className="flex justify-between items-center bg-zinc-900/30 p-1.5 border border-zinc-900/60 rounded">
                          <span className="text-white">Sentinel</span>
                          <span className="text-[8px] px-1 py-0.2 bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 rounded uppercase">
                            Standby
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-900/30 p-1.5 border border-zinc-900/60 rounded">
                          <span className="text-white">Archivist</span>
                          <span className="text-[8px] px-1 py-0.2 bg-zinc-950 text-zinc-500 border border-zinc-900 rounded uppercase">
                            Monitoring
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-900/30 p-1.5 border border-zinc-900/60 rounded">
                          <span className="text-white">Guardian</span>
                          <span className="text-[8px] px-1 py-0.2 bg-zinc-950 text-zinc-500 border border-zinc-900 rounded uppercase">
                            Monitoring
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-900/30 p-1.5 border border-zinc-900/60 rounded">
                          <span className="text-white">Forge</span>
                          <span className="text-[8px] px-1 py-0.2 bg-zinc-950 text-zinc-500 border border-zinc-900 rounded uppercase">
                            Idle
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-4 bg-zinc-900/10 border border-zinc-900 rounded-xl text-center text-xs text-zinc-500 font-mono">
                  No active specialist assigned. Recommendation payload completely generated.
                </div>
              )}
            </AnimatePresence>

          </div>

          {/* ==========================================
              RIGHT COLUMN (5 COLS): Chronology, Terminal, Grounding tabs, Activity Ledger
              ========================================== */}
          <div className="lg:col-span-5 bg-zinc-950 p-6 flex flex-col justify-between gap-6">
            
            {/* 7. CHRONOLOGICAL EVENT STREAM (STYLIZED TIMELINE) */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-indigo-400" />
                  Chronological Event Stream
                </h4>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span className="text-[8px] font-mono text-zinc-500 uppercase font-black">STREAMING</span>
                </div>
              </div>

              {/* Feed Streams container */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {stateData.latest_messages?.map((msg: any, idx: number) => {
                  const lowercaseMessage = (msg.message || "").toLowerCase();
                  let colorClass = "text-zinc-300";
                  let bgBorderClass = "bg-zinc-950 border-zinc-900/60";
                  
                  if (lowercaseMessage.includes("initiated") || lowercaseMessage.includes("assigned")) {
                    colorClass = "text-indigo-300 font-bold";
                    bgBorderClass = "bg-indigo-950/5 border-indigo-900/30";
                  } else if (lowercaseMessage.includes("complete") || lowercaseMessage.includes("success") || lowercaseMessage.includes("synchronized") || lowercaseMessage.includes("prepared")) {
                    colorClass = "text-emerald-300 font-medium";
                    bgBorderClass = "bg-emerald-950/5 border-emerald-900/30";
                  } else if (lowercaseMessage.includes("drift") || lowercaseMessage.includes("alert") || lowercaseMessage.includes("warn") || lowercaseMessage.includes("risk") || lowercaseMessage.includes("violation") || lowercaseMessage.includes("suspicious")) {
                    colorClass = "text-amber-300 font-semibold";
                    bgBorderClass = "bg-amber-950/5 border-amber-900/30";
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 border rounded-lg hover:border-zinc-800 transition-all flex items-start gap-3 relative overflow-hidden group ${bgBorderClass}`}
                    >
                      <div className="text-[9px] font-mono text-zinc-500 font-bold shrink-0 mt-0.5">
                        {msg.timestamp}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-[11px] font-mono leading-relaxed ${colorClass}`}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 8. CONTINUOUS LIVE DEEMON LOGS & INTERACTIVE COMMAND INPUT */}
            <div className="space-y-2.5 border-t border-b border-zinc-900 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <Server className="h-3 w-3 text-emerald-400 animate-pulse" />
                  Live Monitoring Pipeline Daemon
                </span>
                <span className="text-[9px] font-mono text-zinc-500 font-semibold bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded">
                  System: ACTIVE
                </span>
              </div>
              
              <div className="h-32 bg-zinc-950 border border-zinc-900 rounded-lg p-3 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-1.5 custom-scrollbar">
                {simulatedLogs.map((log, lIdx) => {
                  let logTextColor = "text-zinc-400";
                  if (log.text.includes("latency") || log.text.includes("verified")) {
                    logTextColor = "text-emerald-400/80";
                  } else if (log.text.includes("quarantine") || log.text.includes("deviation") || log.text.includes("drift")) {
                    logTextColor = "text-amber-400/80";
                  } else if (log.text.includes("Command Ingest")) {
                    logTextColor = "text-indigo-400 font-bold";
                  } else if (log.text.includes("Response")) {
                    logTextColor = "text-white font-bold bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-900/30";
                  }

                  return (
                    <div key={lIdx} className="flex gap-2">
                      <span className="text-zinc-600 select-none">[{log.time}]</span>
                      <span className={lIdx === 0 && !log.text.includes("Response") ? "text-white font-medium" : logTextColor}>
                        {log.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Command Input Simulation */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={manualCommand}
                  onChange={(e) => setManualCommand(e.target.value)}
                  placeholder="Inject director directive (e.g. 'status', 'sync', 'agents')..."
                  className="bg-zinc-950 border border-zinc-900 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 flex-1 focus:ring-1 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-indigo-400 rounded-lg cursor-pointer transition-colors hover:text-indigo-300"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Dynamic clickable prompt hints for the command console (UX Polish) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold">Suggestions:</span>
                {["status", "sync", "agents", "quarantine"].map((suggest) => (
                  <button
                    key={suggest}
                    type="button"
                    onClick={() => executeConsoleCommand(suggest)}
                    className="text-[8px] font-mono px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded hover:border-indigo-500/40 transition-all cursor-pointer"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>

            {/* 9. GROUNDING CONTEXT LEDGER WITH DETAILED POLICY TEXTS */}
            <div className="border border-zinc-900 rounded-xl bg-zinc-950 overflow-hidden space-y-3 p-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">
                  <Search className="h-3.5 w-3.5 shrink-0" /> Grounding Context
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveLedgerTab("datahub")}
                    className={`text-[9px] font-mono uppercase font-black transition-colors cursor-pointer ${
                      activeLedgerTab === "datahub" ? "text-white underline decoration-indigo-500 decoration-2 underline-offset-4" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    DataHub
                  </button>
                  <button
                    onClick={() => setActiveLedgerTab("governance")}
                    className={`text-[9px] font-mono uppercase font-black transition-colors cursor-pointer ${
                      activeLedgerTab === "governance" ? "text-white underline decoration-indigo-500 decoration-2 underline-offset-4" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Governance
                  </button>
                  <button
                    onClick={() => setActiveLedgerTab("memory")}
                    className={`text-[9px] font-mono uppercase font-black transition-colors cursor-pointer ${
                      activeLedgerTab === "memory" ? "text-white underline decoration-indigo-500 decoration-2 underline-offset-4" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Memory
                  </button>
                </div>
              </div>

              <div className="min-h-[110px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeLedgerTab === "datahub" && (
                    <motion.div
                      key="datahub"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1.5"
                    >
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold block">Active DataHub Graph URN Reference</span>
                      <div className="bg-zinc-900/40 p-2 border border-zinc-900 rounded font-mono text-[9px] text-zinc-300 select-all font-semibold leading-normal">
                        urn:li:dataset:(urn:li:dataPlatform:postgres,users_sandbox,PROD)
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                        Atlas continuously maps this dataset's physical schema definitions, scanning relational columns dynamically to catch unregistered changes before they disrupt analytical warehouses.
                      </p>
                    </motion.div>
                  )}

                  {activeLedgerTab === "governance" && (
                    <motion.div
                      key="governance"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1.5"
                    >
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold block">Governance Policy Constraint Rules</span>
                      <div className="bg-zinc-900/40 p-2 border border-zinc-900 rounded font-mono text-[9px] text-indigo-300 leading-normal">
                        policy:urn:li:policy:{currentCaseDetails.governanceCode.toLowerCase()}
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                        <strong>Policy Assertion:</strong> All development sandboxes storing structural user keys are subject to automatic quarantine boundaries. Continuous schema drifts must receive secondary human approvals within 24 hours.
                      </p>
                    </motion.div>
                  )}

                  {activeLedgerTab === "memory" && (
                    <motion.div
                      key="memory"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1.5"
                    >
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold block">Matched Historical Incident URN</span>
                      <div className="bg-zinc-900/40 p-2 border border-zinc-900 rounded font-mono text-[9px] text-emerald-300 font-semibold leading-normal">
                        urn:li:incident:{selectedInvestigation === "silent-schema-disaster" ? "MEM-8FA4" : "MEM-3C21"}
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                        Matched a historic incident with <span className="text-white font-bold font-mono">89% confidence</span>. On 2025-08-14, a column mismatch disrupted active billing tables; local mitigation was achieved through automatic VPC quarantine.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 10. METADATA CHANGE TIMELINE AND RECENT ACTIVITY TIMELINE */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                Supervisor Change Logs & Audit Ledger
              </h4>

              <div className="space-y-3.5 relative before:absolute before:inset-y-0 before:left-2 before:w-[1px] before:bg-zinc-900">
                {stateData.recent_activities?.map((act: any) => (
                  <div key={act.id} className="relative pl-6 space-y-1 group">
                    <span className="absolute left-0.5 top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 font-black">
                      <span className="text-zinc-400">{act.activity}</span>
                      <span className="px-1.5 py-0.2 bg-zinc-900 text-zinc-500 rounded border border-zinc-800">{act.stage}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                      {act.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
