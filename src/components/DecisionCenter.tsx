import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Brain,
  CheckCircle,
  AlertTriangle,
  FileText,
  Network,
  Database,
  Layers,
  Cpu,
  Terminal,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Info,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  Check,
  RefreshCw,
  Search
} from "lucide-react";

interface DecisionCenterProps {
  addLog: (log: string) => void;
  liveState?: any;
  realTimeStatus?: "Connected" | "Reconnecting" | "Offline";
}

export default function DecisionCenter({ addLog, liveState, realTimeStatus }: DecisionCenterProps) {
  const [selectedId, setSelectedId] = useState<string>("silent-schema-disaster");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Expanded detail states
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [localAuditTrail, setLocalAuditTrail] = useState<any[]>([]);
  const [expandedTrailId, setExpandedTrailId] = useState<string | null>(null);

  const investigationsList = [
    { id: "silent-schema-disaster", title: "Silent Schema Disaster", type: "Schema Drift" },
    { id: "compromised-dev-keys-leak", title: "Compromised Dev Keys Leak", type: "Threat Containment" },
    { id: "unencrypted-pii-columns", title: "Unencrypted PII Columns Compliance", type: "Compliance Audit" }
  ];

  const fetchExplanation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/explanations/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch explainability profile: ${response.statusText}`);
      }
      const json = await response.json();
      setData(json);
      setApprovalStatus(json.human_approval_status || "PENDING");
      setLocalAuditTrail(json.audit_trail || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while loading decisions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (liveState && liveState.current_investigation_id === selectedId) {
      setApprovalStatus(liveState.decision_status);
    }
  }, [liveState, selectedId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    addLog(`System: Copied remediation script code snippet.`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleApproval = async (action: "APPROVED" | "REJECTED") => {
    setApprovalStatus(action);
    const now = new Date().toISOString();
    const newAuditEntry = {
      id: `aud-manual-${Math.random().toString(36).substring(2, 6)}`,
      action: action === "APPROVED" ? "RECOMMENDATION_APPROVED" : "RECOMMENDATION_REJECTED",
      performed_by: "secops-officer@acme-aerospace.com",
      timestamp: now,
      details: `Operator manually set decision center state to ${action}. Mitigation pipeline queued.`
    };
    setLocalAuditTrail((prev) => [newAuditEntry, ...prev]);
    addLog(`Decision Center: Operator manually ${action} investigation findings for correlation ID ${selectedId}.`);

    try {
      await fetch(`/api/v1/explanations/${selectedId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
    } catch (err) {
      console.error("Failed to persist decision on server:", err);
    }
  };

  // Radial trust progress calculation
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "stroke-emerald-400 text-emerald-400";
    if (score >= 0.7) return "stroke-amber-400 text-amber-400";
    return "stroke-red-400 text-red-400";
  };

  return (
    <div className="space-y-6" id="decision-center-root">
      {/* Top Selector Panel */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900/80 via-zinc-950 to-zinc-900/80 p-6 rounded-2xl border border-zinc-800/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                ORIXA INTELLIGENCE HUB // SECURE EXPLAINABILITY ENGINE
              </h3>
            </div>
            <h2 className="text-2xl font-display font-extrabold tracking-tight text-white leading-none">
              Explainability & Decision Center
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl font-sans leading-relaxed">
              Trace every automated audit, schema alignment recommendation, and risk mitigation action back to ground truth logs, agent team logs, and regulatory compliance rulebooks.
            </p>
          </div>

          {/* Selector Tabs with High Fidelity Premium styling */}
          <div className="flex flex-wrap items-center gap-2 lg:self-center">
            {investigationsList.map((inv) => {
              const isSelected = selectedId === inv.id;
              return (
                <button
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id)}
                  className={`relative px-4 py-3 rounded-xl text-left transition-all duration-300 border cursor-pointer group ${
                    isSelected
                      ? "bg-gradient-to-b from-zinc-800/80 to-zinc-900/95 border-indigo-500/50 text-white shadow-[0_4px_20px_rgba(99,102,241,0.15)]"
                      : "bg-zinc-950/40 border-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <div className="text-[8px] font-mono opacity-50 uppercase tracking-widest font-black group-hover:text-indigo-400 transition-colors">
                        {inv.type}
                      </div>
                      <div className="mt-0.5 text-xs font-bold font-mono tracking-wide">
                        {inv.title}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    )}
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
                  )}
                </button>
              );
            })}
            
            <button
              onClick={() => fetchExplanation(selectedId)}
              className="p-3 bg-zinc-950/60 border border-zinc-900 hover:bg-zinc-900 hover:border-zinc-800 rounded-xl text-zinc-500 hover:text-indigo-400 transition-all cursor-pointer shadow-inner"
              title="Force Diagnostics Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Skeleton left column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-zinc-850 rounded-full" />
                  <div className="h-4 w-48 bg-zinc-850 rounded-lg" />
                </div>
                <div className="h-4 w-20 bg-zinc-850 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-zinc-850 rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-zinc-850 rounded-lg" />
                <div className="h-4 w-2/3 bg-zinc-850 rounded-lg" />
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-4 w-32 bg-zinc-850 rounded-lg" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-zinc-850 rounded-xl" />
                <div className="h-16 bg-zinc-850 rounded-xl" />
                <div className="h-16 bg-zinc-850 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Skeleton right column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-6 w-24 bg-zinc-850 rounded-lg" />
              <div className="h-20 bg-zinc-850 rounded-xl" />
              <div className="space-y-2">
                <div className="h-8 w-full bg-zinc-850 rounded-xl" />
                <div className="h-8 w-full bg-zinc-850 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="p-16 text-center bg-red-950/10 border border-red-900/30 rounded-2xl space-y-4 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(239,68,68,0.08),rgba(0,0,0,0))]" />
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h4 className="text-base font-display font-bold text-red-400 tracking-wide">Explainability Bridge Disrupted</h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">{error}</p>
          </div>
        </div>
      ) : !data ? null : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (8 COLS): Live Briefings, Evidence Panels, Specialists & Evidence Trail */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. ATLAS OPERATIONAL BRIEFING */}
            <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Brain className="h-40 w-40 text-indigo-400" />
              </div>
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                      Supervisor Reconciliation Desk
                    </h4>
                    <span className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase">COGNITIVE ACTIVE // BASELINE MATCH</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded">
                    CLASS: CONFIDENTIAL
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-lg font-bold uppercase tracking-widest">
                    {selectedId === "silent-schema-disaster" ? "INV-0241" : selectedId === "compromised-dev-keys-leak" ? "INV-0242" : "INV-0243"}
                  </span>
                </div>
              </div>

              <div className="space-y-5 font-sans leading-relaxed">
                <p className="text-sm text-zinc-200 font-medium leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-900/50">
                  {data.atlas_summary || data.executive_summary}
                </p>
                
                {data.root_cause && (
                  <div className="p-4 bg-zinc-900/20 border border-zinc-800/40 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[3px] h-full bg-amber-500/80" />
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                      Root Cause Diagnosis
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-1">
                      {data.root_cause}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. THE SUPPORTING EVIDENCE PANEL */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pl-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Layers className="h-3.5 w-3.5" />
                  </span>
                  <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400">
                    Supporting Evidence Dossier
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Grounded Telemetry Diagnostics</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.evidence_panel || []).length > 0 ? (
                  data.evidence_panel.map((card: any) => {
                    const isExpanded = expandedEvidenceId === card.card_id;
                    return (
                      <div
                        key={card.card_id}
                        onClick={() => setExpandedEvidenceId(isExpanded ? null : card.card_id)}
                        className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group overflow-hidden ${
                          isExpanded
                            ? "bg-zinc-900/80 border-indigo-500/60 shadow-[0_4px_32px_rgba(99,102,241,0.1)] -translate-y-0.5"
                            : "bg-zinc-950/60 border-zinc-900/80 hover:border-zinc-800/80 hover:bg-zinc-900/20 hover:-translate-y-0.5"
                        }`}
                      >
                        {/* Dossier top line */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                            <span className="text-[10px] font-bold text-white font-mono flex items-center gap-2">
                              <Database className="h-3.5 w-3.5 text-indigo-400" />
                              {card.title}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                              Confidence Gain: +{Math.round((card.confidence_impact || 0.2) * 100)}%
                            </span>
                          </div>

                          <div className="space-y-3 text-xs leading-relaxed">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono uppercase text-zinc-500 block font-semibold tracking-wider">What was inspected:</span>
                              <p className="text-zinc-300 font-sans">{card.what_inspected}</p>
                            </div>
                            <div className="space-y-1 bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900/40">
                              <span className="text-[9px] font-mono uppercase text-zinc-500 block font-semibold tracking-wider">What was found:</span>
                              <p className="text-zinc-200 font-sans font-medium">{card.what_found}</p>
                            </div>
                          </div>
                        </div>

                        {/* Dossier bottom line */}
                        <div className="flex items-center justify-between border-t border-zinc-900/50 pt-3 mt-4">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide">Ref Source: {card.source}</span>
                          <span className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors font-bold flex items-center gap-1">
                            {isExpanded ? "Collapse Audit Details ▲" : "Inspect Why It Matters ▼"}
                          </span>
                        </div>

                        {/* Expandable Why It Matters */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-zinc-800/50 pt-4 mt-4 space-y-2 bg-zinc-950/90 -mx-5 -mb-5 p-5 relative"
                            >
                              <div className="absolute top-0 left-0 w-[2px] h-full bg-indigo-500" />
                              <span className="text-[9px] font-mono uppercase text-indigo-400 font-black tracking-widest block">Systemic Governance Impact</span>
                              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{card.why_matters}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                ) : (
                  data.evidence_timeline?.map((ev: any) => (
                    <div
                      key={ev.id}
                      className="p-5 rounded-2xl border bg-zinc-950/60 border-zinc-900 space-y-3 hover:border-zinc-800 transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                        <span className="text-[10px] font-bold text-white font-mono">{ev.title}</span>
                        <span className="text-[9px] font-mono text-zinc-500">+{Math.round(ev.confidence_impact * 100)}%</span>
                      </div>
                      <p className="text-xs text-zinc-400">{ev.description}</p>
                      <div className="text-[9px] font-mono text-zinc-500">Source: {ev.source}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. AI SPECIALISTS & COGNITIVE FLEET */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pl-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                  <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400">
                    Specialist Rationale & Consensus Agent Fleet
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Distributed Brain Topology</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(data.specialist_contributions || []).length > 0 ? (
                  data.specialist_contributions.map((spec: any, sIdx: number) => (
                    <div
                      key={sIdx}
                      className="bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-800/80 transition-all shadow-md relative group overflow-hidden"
                    >
                      {/* Left glowing marker */}
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-zinc-900 group-hover:bg-indigo-500 transition-colors" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300">
                            <User className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                                {spec.name}
                              </h5>
                              <span className="text-[8px] font-mono text-indigo-400 font-extrabold px-2 py-0.5 bg-indigo-950/20 border border-indigo-900/30 rounded-full uppercase tracking-wider">
                                {spec.role}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 block mt-1">
                              Selection Criteria: <span className="text-zinc-400 font-sans">{spec.reason_for_selection || "Requested as target specialist"}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 justify-between md:justify-end text-right border-t md:border-t-0 border-zinc-900/50 pt-3 md:pt-0">
                          <div>
                            <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-wider">Execution speed</span>
                            <span className="text-[11px] font-mono font-bold text-zinc-300">
                              {spec.completion_time_seconds || "2.1"}s
                            </span>
                          </div>
                          <div className="border-l border-zinc-900 pl-4">
                            <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-wider">Decision weight</span>
                            <span className="text-[11px] font-mono font-extrabold text-indigo-400">
                              {Math.round((spec.confidence || 0.9) * 100)}% Conf
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900/60">
                        <span className="text-[9px] font-mono uppercase text-zinc-500 block font-bold tracking-widest">Key Assertions & Findings</span>
                        <ul className="space-y-2">
                          {(spec.findings || []).map((f: string, fIdx: number) => (
                            <li key={fIdx} className="text-xs text-zinc-300 flex items-start gap-2.5 font-sans leading-relaxed">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(99,102,241,1)]" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  data.specialists_contributed?.map((spec: any, sIdx: number) => (
                    <div
                      key={sIdx}
                      className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                        <h5 className="text-xs font-bold text-white uppercase font-mono">{spec.display_name}</h5>
                        <span className="text-xs text-zinc-400 font-mono">{spec.role}</span>
                      </div>
                      <ul className="space-y-1 text-xs text-zinc-400">
                        {spec.findings?.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-start gap-1">
                            <span className="text-indigo-400 font-mono">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 4. EXPANDABLE EVIDENCE TRAIL */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pl-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Network className="h-3.5 w-3.5" />
                  </span>
                  <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400">
                    Chronological Decision Cascade & Trail
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Immutable Context Ledger</span>
              </div>

              <div className="bg-gradient-to-b from-zinc-950 to-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-md">
                <div className="relative before:absolute before:inset-y-0 before:left-3.5 before:w-[1px] before:bg-zinc-900/80 space-y-6">
                  {(data.evidence_trail || []).map((layer: any, idx: number) => {
                    const isExpanded = expandedTrailId === layer.id;
                    return (
                      <div key={layer.id || idx} className="relative pl-10 group">
                        
                        {/* Interactive timeline node dot */}
                        <span
                          onClick={() => setExpandedTrailId(isExpanded ? null : layer.id)}
                          className={`absolute left-1.5 top-0.5 h-5 w-5 rounded-full bg-zinc-950 border ${
                            isExpanded ? "border-indigo-400" : "border-zinc-800 group-hover:border-zinc-600"
                          } flex items-center justify-center transition-all z-10 cursor-pointer shadow-md`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full transition-transform ${isExpanded ? "bg-indigo-400 scale-125 animate-pulse" : "bg-zinc-600 group-hover:bg-zinc-400"}`} />
                        </span>

                        <div
                          className="space-y-1.5 cursor-pointer"
                          onClick={() => setExpandedTrailId(isExpanded ? null : layer.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase font-black tracking-wider">
                              {layer.label}
                            </span>
                            <span className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors font-bold uppercase tracking-wider">
                              {isExpanded ? "Collapse Code State ▲" : "Inspect Payload State ▼"}
                            </span>
                          </div>
                          
                          <h5 className="text-xs font-bold text-white font-mono group-hover:text-indigo-400 transition-colors">
                            {layer.title}
                          </h5>
                          
                          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                            {layer.details}
                          </p>
                        </div>

                        <AnimatePresence>
                          {isExpanded && layer.expanded_payload && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-zinc-900/60 pt-4 mt-3 bg-zinc-950/60 rounded-xl p-4 border border-zinc-900"
                            >
                              <span className="text-[8px] font-mono uppercase text-zinc-500 block font-bold tracking-widest mb-2">Context JSON State payload</span>
                              <pre className="text-[10px] font-mono text-zinc-300 overflow-x-auto p-3.5 bg-zinc-950 rounded-xl border border-zinc-900/80 leading-relaxed shadow-inner">
                                {JSON.stringify(layer.expanded_payload, null, 2)}
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 COLS): Resolution Blueprint, Decision DNA, Risk Assessment, Approvals, Audit Logs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. RESOLUTION BLUEPRINT / TARGET */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 border border-zinc-800/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Terminal className="h-4 w-4" />
                </span>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Target Resolution Strategy
                </h4>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-1.5 relative overflow-hidden">
                  <span className="text-[8px] font-mono uppercase text-zinc-500 block font-bold tracking-widest">PROPOSED ACTION PLAN</span>
                  <p className="text-xs font-sans font-extrabold text-white leading-snug">
                    {data.final_recommendation || data.recommended_actions?.[0]?.title || "Unspecified"}
                  </p>
                </div>

                {data.recommended_actions?.map((action: any) => {
                  return (
                    <div key={action.id} className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-900 pt-3">
                        <span className="uppercase tracking-wider font-semibold">DDL Action Script</span>
                        <button
                          onClick={() => handleCopy(action.code_snippet)}
                          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors font-bold uppercase tracking-wider text-[9px]"
                        >
                          {copiedText === action.code_snippet ? (
                            <>
                              <Check className="h-3 w-3" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy Script
                            </>
                          )}
                        </button>
                      </div>

                      <div className="relative rounded-xl border border-zinc-900 overflow-hidden bg-zinc-950/80 p-3.5 shadow-inner">
                        <pre className="text-[10px] font-mono text-amber-300/90 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48">
                          {action.code_snippet}
                        </pre>
                      </div>

                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. DECISION DNA PROFILE */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 border border-zinc-800/40 rounded-2xl p-6 space-y-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Network className="h-4 w-4" />
                </span>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Decision DNA Profile
                </h4>
              </div>

              {/* Graphical radial indicator with glowing ring */}
              <div className="relative flex items-center justify-center h-44 w-44 mx-auto mt-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="41" fill="transparent" stroke="#121214" strokeWidth="6" />
                  {/* Value Ring */}
                  <motion.circle
                    cx="50" cy="50" r="41" fill="transparent"
                    className={getScoreColor(data.confidence?.score || 0.85)}
                    strokeWidth="6" strokeDasharray="257.6"
                    initial={{ strokeDashoffset: 257.6 }}
                    animate={{ strokeDashoffset: 257.6 - (257.6 * (data.confidence?.score || 0.85)) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 space-y-0.5">
                  <span className="text-3xl font-mono font-black text-white tracking-tight leading-none">
                    {Math.round((data.confidence?.score || 0.85) * 100)}%
                  </span>
                  <span className="text-[8px] font-mono text-zinc-500 font-black uppercase tracking-widest">
                    RECONCILIATION ACCURACY
                  </span>
                </div>
              </div>

              {/* 5-Point Alignment Sliders */}
              <div className="space-y-4 border-t border-zinc-900 pt-5">
                {[
                  { label: "Context Quality", val: data.decision_dna?.context_quality || 0.90 },
                  { label: "Evidence Coverage", val: data.decision_dna?.evidence_coverage || 0.85 },
                  { label: "Historical Similarity", val: data.decision_dna?.historical_similarity || 0.92 },
                  { label: "Specialist Agreement", val: data.decision_dna?.specialist_agreement || 0.95 },
                  { label: "Overall Confidence", val: data.decision_dna?.overall_confidence || 0.91 }
                ].map((dna, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[9px] text-zinc-400">
                      <span className="font-semibold">{dna.label}</span>
                      <span className="text-white font-extrabold">{Math.round(dna.val * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden p-[1px] border border-zinc-900">
                      <motion.div
                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${dna.val * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. RISK ASSESSMENT */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 border border-zinc-800/40 rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" /> Systemic Risk Index
                </h4>
                <span className={`text-[8px] font-mono font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                  (data.risk_assessment?.severity || data.risk?.risk_level) === "CRITICAL"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : (data.risk_assessment?.severity || data.risk?.risk_level) === "HIGH"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800"
                }`}>
                  {data.risk_assessment?.severity || data.risk?.risk_level || "MEDIUM"} RISK INDEX
                </span>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                  <span className="text-[8px] font-mono uppercase text-emerald-400 block font-bold tracking-widest">OUTCOME IF ACCEPTED</span>
                  <p className="text-zinc-300 leading-relaxed font-medium">
                    {data.risk_assessment?.if_accepted || "Safe system baseline is restored immediately."}
                  </p>
                </div>

                <div className="space-y-1 bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                  <span className="text-[8px] font-mono uppercase text-red-400 block font-bold tracking-widest">OUTCOME IF IGNORED</span>
                  <p className="text-zinc-300 leading-relaxed font-medium">
                    {data.risk_assessment?.if_ignored || data.risk?.description}
                  </p>
                </div>

                <div className="border-t border-zinc-900 pt-3.5 space-y-1 pl-1">
                  <span className="text-[8px] font-mono uppercase text-zinc-500 block font-bold tracking-widest">IMPACT SCOPE ANALYSIS</span>
                  <p className="text-zinc-400 font-mono text-[10px] bg-zinc-950 p-2 rounded border border-zinc-900">
                    {data.risk_assessment?.downstream_impact || "All downstream analytical pipelines."}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. HUMAN APPROVAL VERIFICATION */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 border border-zinc-800/40 rounded-2xl p-5 space-y-4 shadow-md">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                Human Approval Overrides
              </h4>

              <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-900 space-y-4 text-center">
                <div className="text-xs text-zinc-400 flex items-center justify-center gap-1.5 font-sans">
                  <User className="h-3.5 w-3.5 text-zinc-500" />
                  Operator State:{" "}
                  <span className={`font-mono font-black uppercase tracking-wider text-[11px] ${
                    approvalStatus === "APPROVED"
                      ? "text-emerald-400"
                      : approvalStatus === "REJECTED"
                      ? "text-red-400"
                      : "text-amber-400"
                  }`}>
                    {approvalStatus}
                  </span>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleApproval("APPROVED")}
                    disabled={approvalStatus === "APPROVED"}
                    className="flex-1 py-3 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> APPROVE
                  </button>
                  <button
                    onClick={() => handleApproval("REJECTED")}
                    disabled={approvalStatus === "REJECTED"}
                    className="flex-1 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" /> REJECT
                  </button>
                </div>
              </div>
            </div>

            {/* 5. DECISION AUDIT LEDGER */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950 border border-zinc-800/40 rounded-2xl p-5 space-y-4 shadow-md max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                Decision Audit Ledger
              </h4>

              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2 before:w-[1px] before:bg-zinc-900">
                {localAuditTrail?.map((entry: any) => (
                  <div key={entry.id} className="relative pl-6 space-y-1 text-[11px]">
                    <span className="absolute left-0.5 top-1.5 h-3 w-3 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,1)]" />
                    </span>
                    <div className="flex items-center justify-between font-mono text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                      <span>{entry.action}</span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-zinc-300 font-sans leading-relaxed">{entry.details}</p>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Operator: {entry.performed_by}</div>
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
