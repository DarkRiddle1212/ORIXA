import React from "react";
import {
  Rocket,
  Layers,
  Play,
  Brain,
  Shield,
  Activity,
  Network,
  Users,
  Database,
  RotateCcw,
  TrendingUp,
  Cpu,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  Terminal,
  Compass
} from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onLaunchPlatform: () => void;
  onViewArchitecture: () => void;
  onRunDemo: () => void;
}

export default function LandingPage({
  onLaunchPlatform,
  onViewArchitecture,
  onRunDemo
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-300">
      
      {/* Premium Ambient Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* 1. Header / Navigation Row */}
      <header className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-indigo-400/20">
            <span className="text-lg tracking-tighter">Ω</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">ORIXA</span>
              <span className="text-[8px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0.0-RC1
              </span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-400">
          <a href="#problem" className="hover:text-white transition-all">PROBLEM</a>
          <a href="#how-it-works" className="hover:text-white transition-all">HOW IT WORKS</a>
          <a href="#features" className="hover:text-white transition-all">CAPABILITIES</a>
          <a href="#architecture" className="hover:text-white transition-all">ENGINEERING</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchPlatform}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all cursor-pointer"
          >
            Launch Console
          </button>
          <button
            onClick={onRunDemo}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Play className="h-3 w-3 fill-current text-white" />
            Run Live Demo
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Enterprise Intelligence Operating System</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 leading-[1.1] mb-6 font-display"
        >
          Context is the Boundary<br />Between Intelligence and Hallucination
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-sm md:text-lg max-w-2xl font-sans mb-12 leading-relaxed"
        >
          Orixa bridges the gap between raw LLM capabilities and reliable enterprise operations. 
          By combining <strong>DataHub metadata catalogs</strong>, <strong>organizational memory indexes</strong>, and real-time 
          <strong> SRE event tracing</strong>, Orixa coordinates a specialist fleet of autonomous agents that diagnose schema drift, 
          mitigate compliance risks, and guarantee structural integrity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <button
            onClick={onLaunchPlatform}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 text-white shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition-all cursor-pointer flex items-center gap-2 border border-indigo-400/20 group"
          >
            Launch Orixa Console
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onViewArchitecture}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            View Interactive Architecture
          </button>
          <button
            onClick={onRunDemo}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-purple-900/30 border border-purple-500/20 text-purple-300 hover:bg-purple-900/40 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="h-4 w-4 fill-current text-purple-400" />
            Run High-Fidelity Demo
          </button>
        </motion.div>

        {/* Dashboard Frame Preview Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-sm overflow-hidden group"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/40 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 font-mono text-zinc-400 text-[10px]">orixa-operator-console://analytics-drift-incident</span>
            </div>
            <span className="text-[10px] text-zinc-600">INGRESS GATEWAY STABLE</span>
          </div>
          <div className="p-4 bg-zinc-950 text-left rounded-b-xl border-t border-zinc-900 font-mono text-xs text-zinc-400 space-y-2 max-h-64 overflow-y-auto overflow-x-hidden scrollbar-thin">
            <p className="text-indigo-400"># orixa --status-monitor --verbose</p>
            <p className="text-zinc-500">[2026-07-16 09:47:11] [ORIXA GATEWAY] Boot sequence initialized.</p>
            <p className="text-zinc-500">[2026-07-16 09:47:12] [DATABASES] PostgreSQL connection pool online: 10 active slots.</p>
            <p className="text-zinc-500">[2026-07-16 09:47:13] [DATAHUB] Priority graph schema synchronization loaded (142 nodes catalogued).</p>
            <p className="text-zinc-500">[2026-07-16 09:47:14] [SPECIALISTS] 8 active autonomous units verified in Docker daemon.</p>
            <p className="text-emerald-400">[2026-07-16 09:47:15] [SSE_GATEWAY] Real-time event streaming channel established on port 3000/stream.</p>
            <p className="text-amber-400">[2026-07-16 09:47:16] [SRE_DAEMON] ANOMALY DETECTED: Physical table schema mismatch 'core.users' (V2.4 migration drift).</p>
            <p className="text-purple-400">[2026-07-16 09:47:16] [ATLAS_SUPERVISOR] Dispatched investigation pipeline for incident: silent-schema-disaster</p>
            <p className="text-zinc-300">└─ Coordinating Specialists: Atlas, Oracle, Forge... Drafting backward-compatible VIEW layer.</p>
          </div>
        </motion.div>
      </section>

      {/* 3. Problem Section */}
      <section id="problem" className="border-t border-zinc-900 bg-zinc-950/50 py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">The Failure Mode</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-3 mb-6 font-display">Why Enterprise AI Projects fail on Real-World Data</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Modern enterprises are deploying LLM agents rapidly, but they all crash into the same wall: <strong>stale, drifting, and unowned database structures</strong>. 
              When a schema transforms or a data pipeline starves, AI agents hallucinate, make bad calculations, and break regulatory policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">The Context Gap</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Database schemas mutate dynamically. When tables change without notifying the AI models, 
                agents compile invalid SQL, leading to broken interfaces or catastrophic execution queries.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">Governance & PII Exposure</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Developers frequently extract production database copies into unprotected sandboxes to debug. 
                Without automated discovery, plaintext Social Security Numbers, secrets, and customer PII are leaked.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200">Stale Parameter Silos</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Predictive models require fresh parameter stores. When pipeline ingestion workers silently fail (OOM), 
                models continue evaluating predictions using stale indexes, causing drift anomalies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Orixa Section (Pillars) */}
      <section id="how-it-works" className="border-t border-zinc-900 py-24 bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">Core Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-3 mb-6 font-display">The Path to Reliable Automation</h2>
            <p className="text-zinc-400 text-sm">
              We govern enterprise AI workflows through a transparent cycle of discovery and human alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Context", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Acquire real estate schemas, data lineage links, and catalog ownership metrics from DataHub API nodes." },
              { num: "02", title: "Intelligence", icon: Brain, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", desc: "Dispatch the Atlas supervisor to orchestrate domain-specific specialists, processing regressions, networks, and logs." },
              { num: "03", title: "Explainability", icon: Compass, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "Convert AI outputs into clean evidence paths, risk ratings, and clear structural remediation recommendations." },
              { num: "04", title: "Trust", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "Enforce human-in-the-loop consensus protocols before executing structural patches on enterprise databases." }
            ].map((item, index) => (
              <div key={index} className="relative p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-zinc-800 font-mono">{item.num}</span>
                    <div className={`h-10 w-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-200 mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Capabilities Bento (Atlas, Map, Decision, Memory, Replay, Predictions, DataHub) */}
      <section id="features" className="border-t border-zinc-900 bg-zinc-950/50 py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Engineering Arsenal</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-3 mb-6 font-display">Engineered for Technical Assurance</h2>
            <p className="text-zinc-400 text-sm">
              Discover Orixa's structural modules, ready-built to monitor corporate clusters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Atlas Supervisor */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">Atlas Supervisor Engine</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                A state-of-the-art container coordinator. It receives incident alerts, designs multi-step task plans, 
                and deploys a specialized fleet of up to 8 automated actors to resolve bottlenecks.
              </p>
            </div>

            {/* AI Specialists */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">8 Collaborative Specialists</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Includes specialized modules: <strong>Atlas</strong> (schema auditor), <strong>Oracle</strong> (risk forecaster), 
                <strong>Forge</strong> (patch architect), <strong>Guardian</strong> (security compliance checker), 
                and <strong>Sentinel</strong> (Kubernetes node log scanner).
              </p>
            </div>

            {/* Enterprise Map */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Network className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">Intelligence Topology Map</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Observe live multi-agent reasoning paths. A high-contrast interactive vector graph visualizes agent interactions, 
                data transfers, and decision timelines as they happen.
              </p>
            </div>

            {/* Decision Center */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">Decision DNA Ledger</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Zero untrusted overrides. Orixa generates detailed evidence summaries, compiles rollback code, 
                and awaits explicit cryptographic operator authorization before altering production databases.
              </p>
            </div>

            {/* Organizational Memory */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Database className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">Organizational Memory</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                A dense archive of past corporate incidents, runtime logs, and resolutions. Operates on unified vector embeddings, 
                enabling specialized actors to learn from historical precedent.
              </p>
            </div>

            {/* Incident Replay */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <RotateCcw className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">Chronological Replay</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                An interactive time-series timeline interface. Operators can rewind, play, and step through past incidents, 
                auditing exact execution coordinates and terminal standard outputs.
              </p>
            </div>

            {/* Predictions */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">Regression & Drift Forecaster</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Tracks drift metrics and forecasts dataset accuracy decay. Provides early warnings about data health degradation 
                before it breaks consumer-facing reporting tools.
              </p>
            </div>

            {/* DataHub Integration */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">DataHub Sync Gateway</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Connects directly to the DataHub metadata server. Pulls asset schemas, ownership structures, and lineage connections 
                to ground multi-agent logic in real enterprise metadata.
              </p>
            </div>

            {/* Security Guard */}
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-zinc-200">Compliance & Tenant Guard</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Secures data boundaries with JWT bearer credentials, Redis-backed rate limiting, strict CORS whitelists, 
                and verified tenant isolation boundaries.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Open Source / Footer */}
      <section className="border-t border-zinc-900 bg-zinc-950 py-16 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                Ω
              </div>
              <span className="text-lg font-bold tracking-widest text-white">ORIXA</span>
            </div>
            <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
              Orixa is an Open Source Enterprise Intelligence Operating System licensed under Apache 2.0. 
              Designed for reliability, security, and contextual automation.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-500">
            <span className="text-zinc-400">LICENSE: APACHE-2.0</span>
            <span>•</span>
            <span className="text-zinc-400">STABLE CONTAINER: ORIXA/ORIXA:LATEST</span>
            <span>•</span>
            <span className="text-zinc-400">CI BUILD: PASSING</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-zinc-900/60 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 gap-4">
          <span>&copy; {new Date().getFullYear()} Orixa Systems. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Security Center</span>
            <span className="hover:text-zinc-400 cursor-pointer">API Specs</span>
            <span className="hover:text-zinc-400 cursor-pointer">SRE SLA Contract</span>
          </div>
        </div>
      </section>

    </div>
  );
}
