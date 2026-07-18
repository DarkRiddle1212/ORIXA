import React, { useState, useEffect } from "react";
import { 
  Search, 
  Tag, 
  Layers, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  AlertTriangle, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Sparkles,
  RefreshCw,
  FileText,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { motion } from "motion/react";

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

export default function OrganizationalMemory({ addLog }: { addLog: (log: string) => void }) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("All");
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  
  // Custom Synthesis State
  const [selectedIdsForSynthesis, setSelectedIdsForSynthesis] = useState<string[]>([]);
  const [synthesizedText, setSynthesizedText] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // New Memory Creation Modal / Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newIncident, setNewIncident] = useState("");
  const [newRequest, setNewRequest] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newSpecialists, setNewSpecialists] = useState("");
  const [newAssets, setNewAssets] = useState("");
  const [newLessons, setNewLessons] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newRisk, setNewRisk] = useState("MEDIUM");
  const [newRemediations, setNewRemediations] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load Memories
  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      // Fetch directly from FastAPI back-end
      const url = searchQuery 
        ? `/api/v1/memory/search?q=${encodeURIComponent(searchQuery)}`
        : `/api/v1/memory`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
        if (data.length > 0 && !selectedMemory) {
          setSelectedMemory(data[0]);
        }
      } else {
        throw new Error("HTTP Unhealthy");
      }
    } catch (e) {
      console.error("Backend memory endpoint returned error, using seed data fallback", e);
      // Fail-safe seed items
      const seedItems: MemoryItem[] = [
        {
          id: "mem-seed-1",
          incident: "Database Pool Starvation via Connection Leak",
          user_request: "Investigate why database connections dropped to critical levels.",
          context_snapshot: { cluster: "acme-prod-01", triggered_by: "prometheus-09" },
          selected_specialists: ["InfrastructureSpecialist", "SecuritySpecialist"],
          execution_plan: [
            { step_number: 1, specialist_name: "InfrastructureSpecialist", task: "Analyze connection pool parameters", status: "COMPLETED" },
            { step_number: 2, specialist_name: "SecuritySpecialist", task: "Audit active sessions for unclosed cursors", status: "COMPLETED" }
          ],
          recommendations: {
            risk_level: "HIGH",
            remediations: ["Configure SQL_IDLE_TIMEOUT limits.", "Recycle unused connection descriptors inside Fastapi main.py."]
          },
          human_approvals: [{ approver: "admin@acme-systems.com", action: "APPROVED", timestamp: "2026-07-09T18:12:00Z" }],
          final_outcome: "Connection leak resolved. Reclaiming stale connection pool structures reduced latency from 450ms back to 12ms.",
          lessons_learned: [
            "All long-running transactional scripts must wrap connection instances inside context managers.",
            "Enforce a maximum of 15 connections per developer workspace thread."
          ],
          tags: ["POSTGRES", "LEAK", "STABLE"],
          affected_assets: ["urn:li:dataset:(prod,postgres,acme.public.analytics)"],
          timestamp: "2026-07-09T18:30:00Z"
        }
      ];
      setMemories(seedItems);
      if (!selectedMemory) setSelectedMemory(seedItems[0]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [searchQuery]);

  // Handle Save Memory
  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident || !newRequest || !newOutcome) return;
    setIsSaving(true);
    try {
      const payload = {
        incident: newIncident,
        user_request: newRequest,
        final_outcome: newOutcome,
        selected_specialists: newSpecialists.split(",").map(s => s.trim()).filter(Boolean),
        affected_assets: newAssets.split(",").map(a => a.trim()).filter(Boolean),
        lessons_learned: newLessons.split("\n").map(l => l.trim()).filter(Boolean),
        tags: newTags.split(",").map(t => t.trim().toUpperCase()).filter(Boolean),
        recommendations: {
          risk_level: newRisk,
          remediations: newRemediations.split("\n").map(r => r.trim()).filter(Boolean)
        },
        context_snapshot: { source: "manual_archive", user: "system_admin" },
        human_approvals: [{ approver: "owoadeemmy@gmail.com", action: "MANUAL_ARCHIVED", timestamp: new Date().toISOString() }]
      };

      const response = await fetch("/api/v1/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        addLog(`Memory: Successfully saved custom incident memory card -> "${newIncident}"`);
        setIsCreateOpen(false);
        // Reset inputs
        setNewIncident("");
        setNewRequest("");
        setNewOutcome("");
        setNewSpecialists("");
        setNewAssets("");
        setNewLessons("");
        setNewTags("");
        setNewRemediations("");
        fetchMemories();
      } else {
        throw new Error("Failed to post payload");
      }
    } catch (err: any) {
      addLog(`Memory [ERROR]: Could not commit memory record: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Synthesis
  const handleSynthesize = async () => {
    if (selectedIdsForSynthesis.length === 0) return;
    setIsSynthesizing(true);
    setSynthesizedText(null);
    try {
      const idsQuery = selectedIdsForSynthesis.map(id => `ids=${encodeURIComponent(id)}`).join("&");
      const res = await fetch(`/api/v1/memory/summary?${idsQuery}`);
      if (res.ok) {
        const data = await res.json();
        setSynthesizedText(data.summary);
        addLog(`Memory: Synthesized ${selectedIdsForSynthesis.length} incident records into cohesive intelligence summary`);
      } else {
        throw new Error("Synthesis service unavailable");
      }
    } catch (e: any) {
      addLog(`Memory [ERROR]: Operational synthesis failed: ${e.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Toggle selection for synthesis
  const toggleSelectForSynthesis = (id: string) => {
    setSelectedIdsForSynthesis(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Derive Filters
  const allUniqueTags = Array.from(new Set(memories.flatMap(m => m.tags)));
  const allUniqueSpecialists = Array.from(new Set(memories.flatMap(m => m.selected_specialists)));
  const allUniqueAssets = Array.from(new Set(memories.flatMap(m => m.affected_assets)));

  // Filter memories
  const filteredMemories = memories.filter(m => {
    if (selectedTag !== "All" && !m.tags.includes(selectedTag)) return false;
    if (selectedSpecialist !== "All" && !m.selected_specialists.includes(selectedSpecialist)) return false;
    if (selectedAssetFilter !== "All" && !m.affected_assets.includes(selectedAssetFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 flex items-center gap-2">
            <Layers className="h-6 w-6 text-emerald-400" /> Organizational Memory
          </h2>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            Enterprise intelligence repository. Transforming microservice incident resolutions and specialists plans into structured knowledge.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedIdsForSynthesis([]);
              setSynthesizedText(null);
              fetchMemories();
              addLog("Memory: Synced and loaded historical operational records.");
            }}
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-semibold hover:bg-zinc-800 hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" /> RE-INDEX MEMORY
          </button>
          
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-500/10"
          >
            <Plus className="h-4 w-4" /> ARCHIVE CUSTOM INCIDENT
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-wider block">Total Knowledge Cards</span>
          <div className="text-2xl font-bold text-white font-mono">{memories.length}</div>
          <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Fully compiled & indexable
          </span>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-wider block">Lessons Codified</span>
          <div className="text-2xl font-bold text-zinc-300 font-mono">
            {memories.reduce((acc, m) => acc + m.lessons_learned.length, 0)}
          </div>
          <span className="text-[10px] text-zinc-400 font-sans">Across distinct tenant microservices</span>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-wider block">Active Fleet Mappings</span>
          <div className="text-2xl font-bold text-zinc-300 font-mono">
            {allUniqueSpecialists.length} Specialists
          </div>
          <span className="text-[10px] text-zinc-400 font-sans">Retrieved execution tracks</span>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-wider block">Impacted Data Assets</span>
          <div className="text-2xl font-bold text-zinc-300 font-mono">
            {allUniqueAssets.length} URNs
          </div>
          <span className="text-[10px] text-blue-400 font-sans">Referenced in lineage graphs</span>
        </div>
      </div>

      {/* Main Grid: Filters & Timeline left, Details right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand Panel (Search, Filters, and Timeline) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search box & filter panel */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4 shadow-sm backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search Incident registry, lessons, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-sans"
              />
            </div>

            {/* Micro Filters */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">Tag Indexes</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedTag("All")}
                    className={`px-2.5 py-1 rounded text-[10px] font-sans transition-all duration-150 cursor-pointer border ${
                      selectedTag === "All"
                        ? "bg-emerald-600/15 text-emerald-400 border-emerald-500/30"
                        : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    All Tags
                  </button>
                  {allUniqueTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all duration-150 cursor-pointer border ${
                        selectedTag === tag
                          ? "bg-emerald-600/15 text-emerald-400 border-emerald-500/30"
                          : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-zinc-900">
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Agent Specialist</label>
                  <select
                    value={selectedSpecialist}
                    onChange={(e) => setSelectedSpecialist(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-[10px] text-zinc-300 focus:outline-none"
                  >
                    <option value="All">All Specialists</option>
                    {allUniqueSpecialists.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Target Asset</label>
                  <select
                    value={selectedAssetFilter}
                    onChange={(e) => setSelectedAssetFilter(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-[10px] text-zinc-300 focus:outline-none"
                  >
                    <option value="All">All Assets</option>
                    {allUniqueAssets.map((a: any) => (
                      <option key={a} value={a}>{a.length > 25 ? `${a.substring(0, 25)}...` : a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Incident Feed */}
          <div className="p-4 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <span className="text-[11px] font-sans font-bold text-zinc-400 uppercase tracking-wider">Incident Timeline</span>
              <span className="text-[10px] text-zinc-500 font-mono">Matched: {filteredMemories.length}</span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-500 text-xs font-mono space-y-2">
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                <span>Re-indexing memory structures...</span>
              </div>
            ) : filteredMemories.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No matching memory cards found in registry.
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {filteredMemories.map((m) => {
                  const isSelected = selectedMemory?.id === m.id;
                  const isCheckedForSynth = selectedIdsForSynthesis.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg border transition-all duration-300 flex items-start gap-3 relative cursor-pointer group ${
                        isSelected 
                          ? "bg-zinc-900/80 border-emerald-500/40 shadow-sm"
                          : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-900/30"
                      }`}
                      onClick={() => setSelectedMemory(m)}
                    >
                      {/* Checkbox for Synthesis */}
                      <div 
                        className="mt-0.5" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectForSynthesis(m.id);
                        }}
                      >
                        <div className={`h-4 w-4 rounded border flex items-center justify-center transition-all duration-150 ${
                          isCheckedForSynth
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                        }`}>
                          {isCheckedForSynth && <span className="text-[9px] font-bold">✓</span>}
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[11px] font-bold text-zinc-300 font-sans truncate group-hover:text-emerald-400 transition-colors duration-200">
                            {m.incident}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500 flex items-center gap-1 shrink-0">
                            <Clock className="h-2.5 w-2.5 text-zinc-600" /> {m.timestamp.slice(5, 10)}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                          "{m.user_request}"
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          {m.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                              #{t}
                            </span>
                          ))}
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ml-auto ${
                            m.recommendations.risk_level === "CRITICAL"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : m.recommendations.risk_level === "HIGH"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {m.recommendations.risk_level || "MEDIUM"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Synthesis Actions */}
            {selectedIdsForSynthesis.length > 0 && (
              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>Selected for Synthesis:</span>
                  <span className="text-emerald-400 font-bold">{selectedIdsForSynthesis.length} items</span>
                </div>
                <button
                  onClick={handleSynthesize}
                  disabled={isSynthesizing}
                  className="w-full py-2 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 rounded-lg text-[11px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSynthesizing ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> SYNTHESIZING COMPILING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" /> SYNTHESIZE ENTERPRISE RUNBOOKS
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Hand Panel (Expanded Details & Synthesis Display) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Synthesis report display if active */}
          {synthesizedText && (
            <div className="p-5 bg-zinc-900/50 border border-emerald-500/20 rounded-xl space-y-4 shadow-sm relative">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-sans">
                  <Sparkles className="h-4 w-4" /> Synthesized Operational Analysis Report
                </span>
                <button
                  onClick={() => setSynthesizedText(null)}
                  className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300"
                >
                  DISMISS REPORT
                </button>
              </div>
              <div className="text-xs font-sans text-zinc-300 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto pr-2">
                {synthesizedText}
              </div>
            </div>
          )}

          {/* Core Memory Card Details */}
          {selectedMemory ? (
            <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-6 shadow-sm backdrop-blur-sm">
              
              {/* Header metadata row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800/80 pb-4 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Memory Node ID: {selectedMemory.id}</span>
                  <h3 className="text-lg font-bold text-white font-sans">{selectedMemory.incident}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800">
                    {selectedMemory.timestamp.replace("T", " ").replace("Z", "")}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-md ${
                    selectedMemory.recommendations.risk_level === "CRITICAL"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : selectedMemory.recommendations.risk_level === "HIGH"
                        ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {selectedMemory.recommendations.risk_level || "MEDIUM"} HAZARD
                  </span>
                </div>
              </div>

              {/* Original User Request / Problem context */}
              <div className="space-y-2">
                <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
                  Original Query / Trigger Context
                </div>
                <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800/80 font-sans text-xs text-zinc-300 leading-relaxed shadow-inner">
                  "{selectedMemory.user_request}"
                </div>
              </div>

              {/* Splitted detail content grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Selected Specialists & Timeline Plan */}
                <div className="space-y-3.5">
                  <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                    Specialist Agents & Plan Steps
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMemory.selected_specialists.map(spec => (
                        <span key={spec} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-[10px] text-zinc-400 font-mono">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="p-3.5 bg-zinc-950/50 rounded-lg border border-zinc-850 text-xs font-sans space-y-3">
                      {selectedMemory.execution_plan.map((step, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <span className="h-4 w-4 shrink-0 rounded-full bg-zinc-900 border border-zinc-700 text-[9px] font-mono text-zinc-400 flex items-center justify-center mt-0.5">
                            {step.step_number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-semibold text-zinc-300">{step.specialist_name}</span>
                              <span className="text-emerald-400 font-mono font-bold uppercase text-[8px]">{step.status}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">{step.task}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations and Remediation Procedures */}
                <div className="space-y-3.5">
                  <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
                    Previous Recommendations
                  </div>
                  
                  <div className="p-3.5 bg-zinc-950/50 rounded-lg border border-zinc-850 text-xs space-y-2.5">
                    {selectedMemory.recommendations.remediations && selectedMemory.recommendations.remediations.length > 0 ? (
                      selectedMemory.recommendations.remediations.map((rem, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-[11px] text-zinc-300 leading-normal">
                          <span className="text-emerald-400 select-none mt-0.5">•</span>
                          <p>{rem}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-zinc-500 italic">No remediations logged</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Affected Assets & Snapshot Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-zinc-900">
                <div className="space-y-3">
                  <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-zinc-400" />
                    Affected Enterprise Assets (Data Lineage)
                  </div>
                  <div className="p-3.5 bg-zinc-950/30 rounded-lg border border-zinc-850 space-y-1.5">
                    {selectedMemory.affected_assets.map(asset => (
                      <div key={asset} className="text-[10px] font-mono text-blue-400 truncate bg-zinc-950/60 px-2 py-1 rounded border border-zinc-800">
                        {asset}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-zinc-400" />
                    Human Sign-offs & Approvals
                  </div>
                  <div className="p-3 bg-zinc-950/30 rounded-lg border border-zinc-850 space-y-2">
                    {selectedMemory.human_approvals.map((app, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-mono bg-zinc-950/60 px-2.5 py-1 rounded border border-zinc-800">
                        <span className="text-zinc-400 truncate max-w-[120px]">{app.approver}</span>
                        <span className="text-emerald-400 font-semibold">{app.action}</span>
                        <span className="text-zinc-500 text-[8px]">{app.timestamp.slice(11, 16)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lessons Learned */}
              <div className="space-y-3.5 pt-3 border-t border-zinc-900">
                <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
                  Lessons Learned & Codified Rules
                </div>
                
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2.5 shadow-inner">
                  {selectedMemory.lessons_learned.map((lesson, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-zinc-300 leading-relaxed">
                      <span className="text-emerald-400 font-bold select-none mt-0.5">[Rule {idx+1}]</span>
                      <p>{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Outcome */}
              <div className="space-y-3 pt-3 border-t border-zinc-900">
                <div className="text-xs text-zinc-500 font-sans font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Resolution & Final Outcome
                </div>
                <div className="p-4 bg-emerald-950/15 border border-emerald-500/20 rounded-xl text-xs text-zinc-300 leading-relaxed">
                  {selectedMemory.final_outcome}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4 text-zinc-500 h-96">
              <FileText className="h-10 w-10 text-zinc-600 animate-pulse" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-400">No Memory Card Selected</h4>
                <p className="text-xs text-zinc-500 max-w-sm">Select an incident memory timeline card from the left panel to inspect the deep-dive multi-agent execution results.</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Manual Archiving Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-400" /> Manual Archive Operational Incident
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Incident Title *</label>
                  <input
                    type="text"
                    required
                    value={newIncident}
                    onChange={(e) => setNewIncident(e.target.value)}
                    placeholder="e.g. Broken downstream analytics loading pipeline"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Target Risk Level</label>
                  <select
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Original User Request *</label>
                <textarea
                  required
                  rows={2}
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                  placeholder="The original problem context description or natural language query"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Final Outcome / Remediation Details *</label>
                <textarea
                  required
                  rows={2}
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="How was the incident resolved? Detail specific results."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Enrolled Specialists (comma separated)</label>
                  <input
                    type="text"
                    value={newSpecialists}
                    onChange={(e) => setNewSpecialists(e.target.value)}
                    placeholder="e.g. SecuritySpecialist, PipelineSpecialist"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Affected Assets (comma separated URNs)</label>
                  <input
                    type="text"
                    value={newAssets}
                    onChange={(e) => setNewAssets(e.target.value)}
                    placeholder="e.g. urn:li:dataset:(prod,postgres,acme.public.orders)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Lessons Learned (one per line)</label>
                  <textarea
                    rows={2}
                    value={newLessons}
                    onChange={(e) => setNewLessons(e.target.value)}
                    placeholder="Codified operational heuristics learned"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Previous Recommendations / Actions (one per line)</label>
                  <textarea
                    rows={2}
                    value={newRemediations}
                    onChange={(e) => setNewRemediations(e.target.value)}
                    placeholder="Proactive remediations suggested"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. DRIFTED, REDACTED, COMPLIANCE"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 rounded-lg text-xs font-semibold cursor-pointer text-zinc-400"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-md shadow-emerald-500/10 cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> COMMITTING...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> ARCHIVE RECORD
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
