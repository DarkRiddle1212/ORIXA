import React, { useState } from "react";
import {
  Layers,
  ArrowLeft,
  Play,
  Cpu,
  Database,
  Shield,
  Activity,
  Users,
  Brain,
  RotateCcw,
  TrendingUp,
  Server,
  Code,
  Network
} from "lucide-react";
import { motion } from "motion/react";

interface ArchitecturePageProps {
  onBack: () => void;
  onLaunchPlatform: () => void;
}

interface ComponentDetail {
  id: string;
  name: string;
  icon: any;
  category: "INGRESS" | "COORDINATION" | "INTELLIGENCE" | "PERSISTENCE";
  role: string;
  dialect: string;
  inputOutput: string;
  details: string;
  endpoints: string[];
}

const SYSTEM_COMPONENTS: ComponentDetail[] = [
  {
    id: "express-gateway",
    name: "Express Ingress Gateway",
    icon: Server,
    category: "INGRESS",
    role: "Primary web-facing controller. Serves production assets and proxies API traffic.",
    dialect: "HTTP/REST, Server-Sent Events (SSE) Protocol",
    inputOutput: "In: Browser Client Requests | Out: SSE Telemetry Feeds, Static UI Assets",
    details: "Guarantees unified network entry on Port 3000. Houses high-fidelity volatile telemetry feeds and handles real-time Server-Sent Events (SSE) for zero-latency operator logging updates.",
    endpoints: ["GET /api/health", "GET /api/v1/stream (SSE stream)", "POST /api/v1/atlas/simulate"]
  },
  {
    id: "atlas-supervisor",
    name: "Atlas Supervisor",
    icon: Cpu,
    category: "COORDINATION",
    role: "The core orchestration planner. Coordinates complex multi-agent analysis loops.",
    dialect: "JSON Action Schemas",
    inputOutput: "In: SRE Alerts / DB Mismatches | Out: Directed Specialist Instruction Sets",
    details: "Receives raw anomaly incidents, queries DataHub context to retrieve data structure lineages, and drafts step-by-step resolution tasks. Spawns and manages specialized AI actors in the correct chronological order.",
    endpoints: ["POST /api/v1/specialists/execute", "GET /api/v1/atlas/plans"]
  },
  {
    id: "datahub",
    name: "DataHub Catalog Sync",
    icon: Database,
    category: "PERSISTENCE",
    role: "Unified enterprise metadata registry. Grounding framework for multi-agent reasoning.",
    dialect: "DataHub Metadata Ingestion API",
    inputOutput: "In: Query Requests | Out: Database Schemas, Lineage Trees, Owner Profiles",
    details: "Provides real context about corporate datasets (acme_aerospace). Supplies physical columns, CCPA/GDPR classification tags, upstream/downstream lineage paths, and registered stewards to ground autonomous agents.",
    endpoints: ["GET /api/v1/context/search", "POST /api/v1/metadata/register"]
  },
  {
    id: "gemini",
    name: "Gemini Model Orchestrator",
    icon: Brain,
    category: "INTELLIGENCE",
    role: "Primary reasoning model engine.",
    dialect: "google-genai TypeScript / Python SDK",
    inputOutput: "In: Tokenized Context, System Prompts | Out: Code Patches, Risk Evaluations",
    details: "Leverages Google Gemini models to synthesize complex database view migrations, analyze code drift, estimate regulatory risks, and output pristine executable code patches.",
    endpoints: ["Internal SDK Integration: process.env.GEMINI_API_KEY"]
  },
  {
    id: "specialists",
    name: "AI Specialist Fleet (8 Units)",
    icon: Users,
    category: "COORDINATION",
    role: "Domain-specific automated analytical agents.",
    dialect: "Specialized Action Protocols",
    inputOutput: "In: Targeted Tasks | Out: Structured Standard Logs, Recommendations",
    details: "A dedicated fleet of 8 autonomous agents, including Atlas (schema auditor), Oracle (risk forecaster), Forge (patch architect), Guardian (PII compliance scanner), and Sentinel (Kubernetes log collector). Each specialist handles a specific operational task.",
    endpoints: ["GET /api/v1/specialists", "POST /api/v1/specialists/run"]
  },
  {
    id: "decision-center",
    name: "Decision DNA Center",
    icon: Shield,
    category: "INTELLIGENCE",
    role: "Human consensus gateway. Requires explicit approval before applying code changes.",
    dialect: "Role-Based Access Control (RBAC)",
    inputOutput: "In: AI Recommendations, SQL patches | Out: Final Execution Consensus Logs",
    details: "The ultimate security sandbox. AI-designed DDL and config patches are locked behind a cryptographic operator confirmation gate. Prevents unauthorized database mutations.",
    endpoints: ["POST /api/v1/approve", "GET /api/v1/approvals/history"]
  },
  {
    id: "replay",
    name: "Chronological Incident Replay",
    icon: RotateCcw,
    category: "INTELLIGENCE",
    role: "SRE historical replay engine.",
    dialect: "Time-Series Query Engine",
    inputOutput: "In: Incident ID | Out: Frame-by-Frame Execution Timelines",
    details: "Chronologically indexes past data incident logs, allowing operators to step forward, pause, and review exact execution events, terminal standard outputs, and generated artifacts.",
    endpoints: ["GET /api/v1/replay/incidents", "GET /api/v1/replay/timeline"]
  },
  {
    id: "org-memory",
    name: "Organizational Memory Archive",
    icon: Database,
    category: "PERSISTENCE",
    role: "Persistent vector lookup database for historic incident resolutions.",
    dialect: "Cosine Similarity Vector Querying",
    inputOutput: "In: Anomaly Vectors | Out: High-Similarity Historic Incident Resolutions",
    details: "Indexes past outages, resolutions, and system events. Helps active specialists recall historical solutions and apply proven remediation methods to current problems.",
    endpoints: ["GET /api/v1/memory/search", "POST /api/v1/memory/index"]
  },
  {
    id: "predictions",
    name: "Drift Prediction Engine",
    icon: TrendingUp,
    category: "INTELLIGENCE",
    role: "Beta-level performance forecasting component.",
    dialect: "ML Inference Regression Protocols",
    inputOutput: "In: Time-series database size, rates | Out: Predicted Pool Exhaustion timestamps",
    details: "Monitors ingestion rates and predicts database pool starvation, memory limits, and regression drift metrics before failures occur.",
    endpoints: ["GET /api/v1/predictions/drift"]
  }
];

export default function ArchitecturePage({
  onBack,
  onLaunchPlatform
}: ArchitecturePageProps) {
  const [selectedCompId, setSelectedCompId] = useState<string>("express-gateway");
  const selectedComp = SYSTEM_COMPONENTS.find(c => c.id === selectedCompId) || SYSTEM_COMPONENTS[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-300 relative">
      
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* 1. Header */}
      <header className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          BACK TO LANDING
        </button>
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-500" />
          <h1 className="text-md font-bold tracking-widest text-zinc-200">ORIXA CORE ARCHITECTURE</h1>
        </div>
        <button
          onClick={onLaunchPlatform}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Launch Platform
        </button>
      </header>

      {/* 2. Page Title */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-center">
        <h2 className="text-3xl font-black tracking-tight text-white mb-3 font-display">System Architecture Map</h2>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Orixa is structured around a decoupled multi-agent engine. Select any system module in the 
          diagram below to audit its specifications, standard inputs/outputs, and live API endpoints.
        </p>
      </section>

      {/* 3. Main Architecture Interactive Frame */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Visual Graph Panel (7 Columns) */}
        <div className="lg:col-span-7 bg-zinc-900/30 rounded-2xl border border-zinc-900 p-6 flex flex-col justify-between min-h-[500px]">
          <div className="text-xs font-mono text-zinc-500 mb-6 flex items-center justify-between">
            <span>INTERACTIVE TOPO GRAPH (CLICK BLOCKS TO INSPECT)</span>
            <span className="text-indigo-400 animate-pulse">● MODEL COEXISTENCE</span>
          </div>

          {/* Decoupled Layout Diagram */}
          <div className="space-y-8 my-auto relative">
            
            {/* INGRESS GROUP */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedCompId("express-gateway")}
                className={`px-5 py-3 rounded-xl border font-mono text-xs flex items-center gap-3 transition-all cursor-pointer ${
                  selectedCompId === "express-gateway"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <Server className="h-4 w-4 text-indigo-400" />
                <div>
                  <p className="font-bold">Port 3000 / Express Ingress Gateway</p>
                  <p className="text-[10px] text-zinc-500">Asset Router & Real-Time SSE</p>
                </div>
              </button>
            </div>

            {/* Downward Lines to Coordinator */}
            <div className="flex justify-center -my-4 h-6">
              <div className="w-0.5 bg-gradient-to-b from-indigo-500 to-indigo-500/20" />
            </div>

            {/* COORDINATION GROUP */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              
              <button
                onClick={() => setSelectedCompId("atlas-supervisor")}
                className={`px-5 py-3 rounded-xl border font-mono text-xs flex items-center gap-3 transition-all cursor-pointer w-full md:w-auto ${
                  selectedCompId === "atlas-supervisor"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Cpu className="h-4 w-4 text-blue-400" />
                <div className="text-left">
                  <p className="font-bold">Atlas Supervisor</p>
                  <p className="text-[10px] text-zinc-500">Task Planner Coordinator</p>
                </div>
              </button>

              <div className="hidden md:block w-8 h-0.5 bg-zinc-800" />

              <button
                onClick={() => setSelectedCompId("specialists")}
                className={`px-5 py-3 rounded-xl border font-mono text-xs flex items-center gap-3 transition-all cursor-pointer w-full md:w-auto ${
                  selectedCompId === "specialists"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Users className="h-4 w-4 text-indigo-400" />
                <div className="text-left">
                  <p className="font-bold">8 Specialist Actors</p>
                  <p className="text-[10px] text-zinc-500">Forge, Oracle, Guardian, Sentinel...</p>
                </div>
              </button>
              
            </div>

            {/* Horizontal Line connecting Persistence */}
            <div className="flex justify-between items-center px-8 relative -my-4 h-6">
              <div className="w-1/2 h-0.5 bg-zinc-800" />
              <div className="w-0.5 h-6 bg-zinc-800" />
              <div className="w-1/2 h-0.5 bg-zinc-800" />
            </div>

            {/* PERSISTENCE AND MODEL GROUNDING */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <button
                onClick={() => setSelectedCompId("datahub")}
                className={`p-4 rounded-xl border font-mono text-xs text-left space-y-2 transition-all cursor-pointer ${
                  selectedCompId === "datahub"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Database className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="font-bold">DataHub Sync</p>
                  <p className="text-[9px] text-zinc-500">Metadata Grounding Catalog</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedCompId("gemini")}
                className={`p-4 rounded-xl border font-mono text-xs text-left space-y-2 transition-all cursor-pointer ${
                  selectedCompId === "gemini"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Brain className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="font-bold">Gemini AI Model</p>
                  <p className="text-[9px] text-zinc-500">Reasoning & Synthesis Core</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedCompId("org-memory")}
                className={`p-4 rounded-xl border font-mono text-xs text-left space-y-2 transition-all cursor-pointer ${
                  selectedCompId === "org-memory"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Database className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="font-bold">Org Memory</p>
                  <p className="text-[9px] text-zinc-500">Incident Vector Archive</p>
                </div>
              </button>

            </div>

            {/* Vertical Line to Operations */}
            <div className="flex justify-center -my-4 h-6">
              <div className="w-0.5 bg-zinc-800" />
            </div>

            {/* INTELLIGENCE AND OPERATOR INTERACTION */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              
              <button
                onClick={() => setSelectedCompId("decision-center")}
                className={`p-4 rounded-xl border font-mono text-xs text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedCompId === "decision-center"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Shield className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="font-bold">Decision DNA Center</p>
                  <p className="text-[9px] text-zinc-500">Operator Action Approval Consensus</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedCompId("replay")}
                className={`p-4 rounded-xl border font-mono text-xs text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedCompId === "replay"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <RotateCcw className="h-4 w-4 text-teal-400" />
                <div>
                  <p className="font-bold">Incident Replay</p>
                  <p className="text-[9px] text-zinc-500">Step Replay Temporal Timeline</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedCompId("predictions")}
                className={`p-4 rounded-xl border font-mono text-xs text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedCompId === "predictions"
                    ? "bg-indigo-900/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <TrendingUp className="h-4 w-4 text-orange-400" />
                <div>
                  <p className="font-bold">Predictions Engine</p>
                  <p className="text-[9px] text-zinc-500">Ingestion Pool & Drift Analytics</p>
                </div>
              </button>

            </div>

          </div>

          <div className="text-[10px] text-zinc-500 mt-6 text-center font-mono">
            Orixa decoupled multi-agent graph architecture • Licensed Apache-2.0
          </div>
        </div>

        {/* Detailed Inspection Panel (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Main Inspection Card */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <selectedComp.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-indigo-400 font-bold tracking-wider">{selectedComp.category} NODE</span>
                <h3 className="text-lg font-black text-white leading-tight font-display">{selectedComp.name}</h3>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              
              <div>
                <span className="text-zinc-500 font-bold block mb-1">SYSTEM ROLE:</span>
                <p className="text-zinc-300 font-sans text-xs leading-relaxed">{selectedComp.role}</p>
              </div>

              <div>
                <span className="text-zinc-500 font-bold block mb-1">COMMUNICATION DIALECT:</span>
                <p className="text-zinc-300 font-sans text-xs bg-zinc-950/40 px-2.5 py-1.5 rounded-lg border border-zinc-900">{selectedComp.dialect}</p>
              </div>

              <div>
                <span className="text-zinc-500 font-bold block mb-1">INPUT / OUTPUT INTERFACE:</span>
                <p className="text-zinc-300 font-sans text-xs bg-zinc-950/40 px-2.5 py-1.5 rounded-lg border border-zinc-900">{selectedComp.inputOutput}</p>
              </div>

              <div>
                <span className="text-zinc-500 font-bold block mb-1">OPERATIONAL DETAILS:</span>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">{selectedComp.details}</p>
              </div>

              <div>
                <span className="text-zinc-500 font-bold block mb-2">TARGET API ENDPOINTS:</span>
                <div className="space-y-1.5">
                  {selectedComp.endpoints.map((ep, i) => (
                    <div key={i} className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-300">
                      <Code className="h-3 w-3 text-zinc-500" />
                      <span>{ep}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Decoupled Coexistence Model Info Box */}
          <div className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border border-indigo-500/20 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" />
              SRE SECURE BOUNDARY COEXISTENCE MODEL
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Orixa splits operations into two sandboxed runtimes. The Express gateway hosts high-fidelity mock databases, 
              live synchronization, and handles low-latency static assets. 
              The Python backend operates Relational models, Redis registries, and deep LangGraph workflows. 
              This architecture guarantees maximum stability and performance in Cloud Run containment profiles.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
