import React, { useState, useEffect, useRef } from "react";
import EnterpriseIntelligenceMap from "./EnterpriseIntelligenceMap";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Activity,
  Cpu,
  Layers,
  Database,
  Brain,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Search,
  Check,
  ChevronRight,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReplayEvent {
  id: string;
  timestamp: string;
  event_type: string;
  responsible_specialist: string | null;
  description: string;
  supporting_evidence: string[];
  status: string;
  related_assets: string[];
}

interface ReplayTimeline {
  investigation_id: string;
  title: string;
  short_description: string;
  category: string;
  confidence_score: number;
  root_cause: string;
  risk_assessment: string;
  events: ReplayEvent[];
}

interface IncidentReplayProps {
  addLog: (log: string) => void;
}

export default function IncidentReplay({ addLog }: IncidentReplayProps) {
  // Predefined options for quick load
  const availableScenarios = [
    { id: "silent-schema-disaster", title: "Silent Schema Disaster", desc: "A columns drop on core accounts breaks dbt/Spark" },
    { id: "stale-ml-feature", title: "Stale ML Feature", desc: "Pod OOM crashes degrade drone atmospheric models" },
    { id: "pii-governance-violation", title: "PII Governance Violation", desc: "Developer backup exposes SSNs inside sandbox" },
    { id: "broken-data-pipeline", title: "Broken Data Pipeline", desc: "Missing Terraform subnet whitelists break reporting" },
    { id: "missing-dataset-owner", title: "Missing Dataset Owner", desc: "An orphaned finance ledger stalls validation quality scan" }
  ];

  // Active state
  const [selectedScenario, setSelectedScenario] = useState<string>("silent-schema-disaster");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeline, setTimeline] = useState<ReplayTimeline | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Playback engine states
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 1x, 2x, 4x

  // Load timeline on mount/change
  useEffect(() => {
    fetchTimeline(selectedScenario);
  }, [selectedScenario]);

  // Master Playback ticker
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && timeline && currentStep < timeline.events.length - 1) {
      const baseDelay = 3000; // 3 seconds per step at 1x
      const delay = baseDelay / speedMultiplier;
      timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        const nextEvent = timeline.events[nextStep];
        addLog(`Replay [${timeline.title}]: Displaying Step ${nextStep + 1}/${timeline.events.length} -> [${nextEvent.event_type}]`);
        
        // Auto pause when we reach the end
        if (nextStep === timeline.events.length - 1) {
          setIsPlaying(false);
          addLog(`Replay [${timeline.title}]: Completed chronological playback.`);
        }
      }, delay);
    } else if (isPlaying && timeline && currentStep >= timeline.events.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStep, speedMultiplier, timeline]);

  const fetchTimeline = async (id: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsPlaying(false);
    setCurrentStep(0);
    try {
      const response = await fetch(`/api/v1/replay/${id}`);
      if (!response.ok) {
        throw new Error(`Endpoint returned status ${response.status}`);
      }
      const data: ReplayTimeline = await response.json();
      setTimeline(data);
      addLog(`Replay System: Loaded active chronology [${data.title}] with ${data.events.length} logs.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend Orixa Replay Engine. Please verify network interfaces.");
      addLog(`Replay System [ERROR]: Failed loading timeline '${id}': ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setIsPlaying(false);
    setCurrentStep(0);
    addLog(`Replay System: Requesting telemetry simulation for "${searchQuery}"`);
    try {
      const response = await fetch(`/api/v1/replay/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (!response.ok) {
        throw new Error(`Generation returned status ${response.status}`);
      }
      const data: ReplayTimeline = await response.json();
      setTimeline(data);
      addLog(`Replay System: Dynamically generated timeline [${data.title}] for search query.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to dynamically generate incident simulation traces.");
    } finally {
      setIsLoading(false);
    }
  };

  // Playback Control Triggers
  const handlePlayPause = () => {
    if (!timeline) return;
    if (isPlaying) {
      setIsPlaying(false);
      addLog("Replay System: Playback paused.");
    } else {
      // If at end, loop back to start
      if (currentStep >= timeline.events.length - 1) {
        setCurrentStep(0);
      }
      setIsPlaying(true);
      addLog(`Replay System: Initiated playback at ${speedMultiplier}x speed.`);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    addLog("Replay System: Playback chronology reset to initial event.");
  };

  const jumpToStep = (index: number) => {
    if (!timeline) return;
    setCurrentStep(index);
    addLog(`Replay System: Jumped directly to timeline step ${index + 1}/${timeline.events.length} [${timeline.events[index].event_type}]`);
  };

  // Icon Resolver for Event Types
  const getEventIcon = (type: string) => {
    switch (type) {
      case "ATLAS_ORCHESTRATION":
        return <Activity className="h-4 w-4 text-cyan-400" />;
      case "SPECIALIST_ACTIVITY":
        return <Cpu className="h-4 w-4 text-amber-400" />;
      case "DATAHUB_RETRIEVAL":
        return <Database className="h-4 w-4 text-blue-400" />;
      case "ORGANIZATIONAL_MEMORY":
        return <Layers className="h-4 w-4 text-emerald-400" />;
      case "GEMINI_REASONING":
        return <Brain className="h-4 w-4 text-purple-400" />;
      case "FINAL_RECOMMENDATION":
        return <Sparkles className="h-4 w-4 text-rose-400 animate-pulse" />;
      case "HUMAN_APPROVAL":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <HelpCircle className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case "ATLAS_ORCHESTRATION":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "SPECIALIST_ACTIVITY":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "DATAHUB_RETRIEVAL":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "ORGANIZATIONAL_MEMORY":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "GEMINI_REASONING":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "FINAL_RECOMMENDATION":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "HUMAN_APPROVAL":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div id="incident-replay-root" className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-2xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
              Tactical Mission Incident Replay
            </h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1 font-sans">
            Replay complex multi-agent security and schema investigations as continuous chronologies.
          </p>
        </div>

        {/* Custom Input Form for GREENFIELD Generative replay */}
        <form onSubmit={handleCustomGenerate} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search or simulate anomaly..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900/60 transition-colors py-2 px-3.5 rounded-lg text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" /> Simulate
          </button>
        </form>
      </div>

      {/* Scenario Grid Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {availableScenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenario(sc.id)}
            className={`text-left p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
              selectedScenario === sc.id
                ? "bg-zinc-900/80 border-cyan-500/30 shadow-[0_2px_12px_rgba(34,211,238,0.06)]"
                : "bg-zinc-950 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20"
            }`}
          >
            <div className={`text-[10px] font-mono font-bold tracking-wider uppercase mb-1 ${
              selectedScenario === sc.id ? "text-cyan-400" : "text-zinc-500"
            }`}>
              {sc.id.split("-").join(" ")}
            </div>
            <div className="text-xs font-bold text-white line-clamp-1">{sc.title}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{sc.desc}</div>
          </button>
        ))}
      </div>

      {/* Master Content Area */}
      {isLoading ? (
        <div className="h-96 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-mono text-zinc-400">ESTABLISHING TELEMETRY SEQUENCE CORRELATION...</div>
        </div>
      ) : errorMsg ? (
        <div className="p-6 bg-red-950/10 border border-red-900/30 rounded-xl space-y-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <h3 className="font-bold text-white text-sm">System Connection Fault</h3>
          </div>
          <p className="text-xs text-red-400 font-sans">{errorMsg}</p>
          <button
            onClick={() => fetchTimeline(selectedScenario)}
            className="mt-2 bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800/80 py-1.5 px-3 rounded text-xs font-semibold cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : timeline ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: MISSION DETAILS & PLAYBACK MECHANICS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Playback Deck Controls */}
            <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" /> Playback Deck
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-900/40">
                  EVENT {currentStep + 1} OF {timeline.events.length}
                </span>
              </div>

              {/* Graphical Segment Display */}
              <div className="grid grid-cols-9 gap-1.5 pt-1">
                {timeline.events.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToStep(idx)}
                    className={`h-2.5 rounded-sm transition-all cursor-pointer ${
                      idx === currentStep
                        ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                        : idx < currentStep
                        ? "bg-cyan-950/80 border border-cyan-800/40"
                        : "bg-zinc-900 border border-zinc-800"
                    }`}
                    title={`Jump to step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Time Indicators */}
              <div className="grid grid-cols-2 gap-4 py-1.5">
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Mission Time</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {timeline.events[currentStep]?.timestamp || "00:00:00"}
                  </div>
                </div>
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">System Integrity</div>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-1 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 animate-pulse text-cyan-400" />
                    {(timeline.confidence_score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Control Buttons row */}
              <div className="flex items-center justify-between gap-2 border-t border-zinc-900 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="p-2.5 bg-cyan-950 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-800 rounded-lg transition-colors cursor-pointer"
                    title={isPlaying ? "Pause" : "Play Timeline"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-cyan-400" /> : <Play className="h-4 w-4 fill-cyan-400" />}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
                    title="Restart Mission Replay"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                {/* Speed multipliers */}
                <div className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800">
                  {[1, 2, 4].map((mult) => (
                    <button
                      key={mult}
                      onClick={() => {
                        setSpeedMultiplier(mult);
                        addLog(`Replay Speed: Configured to ${mult}x.`);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded cursor-pointer transition-all ${
                        speedMultiplier === mult
                          ? "bg-cyan-950 text-cyan-400 border border-cyan-900"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {mult}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Incident Summary Info Card */}
            <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4">
              <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
                  Tactical Dossier
                </h3>
                <span className="text-[9px] font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                  {timeline.category}
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Target Incident</div>
                  <div className="text-sm font-bold text-white mt-0.5">{timeline.title}</div>
                  <div className="text-zinc-400 mt-1 font-sans leading-relaxed text-[11px]">{timeline.short_description}</div>
                </div>

                <div className="p-3.5 bg-red-950/10 border border-red-950 rounded-lg space-y-1">
                  <div className="text-[9px] font-mono text-red-400 uppercase font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Risk Assessment
                  </div>
                  <div className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                    {timeline.risk_assessment}
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-900/20 border border-zinc-800 rounded-lg space-y-1">
                  <div className="text-[9px] font-mono text-zinc-400 uppercase font-semibold">
                    Core Root Cause
                  </div>
                  <div className="text-[11px] text-zinc-300 font-mono leading-relaxed">
                    {timeline.root_cause}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PROFESSIONAL MISSION TIMELINE TRACKER */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Mission Replay System Map Integration */}
            <EnterpriseIntelligenceMap
              addLog={addLog}
              replayActive={true}
              replayCurrentStep={currentStep}
              replayTimeline={timeline}
            />

            {/* Chronological Grid Visualizer */}
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-6 relative">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <h3 className="font-semibold text-white flex items-center gap-2 text-sm font-sans">
                  <Activity className="h-4 w-4 text-cyan-400 animate-pulse" /> Chronicles of Command
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <span>SEC_ENVELOPE: ISOLATED</span>
                  <span>|</span>
                  <span>PLAYBACK: {isPlaying ? "STREAMING" : "PAUSED"}</span>
                </div>
              </div>

              {/* Vertical line path and elements */}
              <div className="relative pl-8 space-y-6 border-l border-zinc-900">
                {timeline.events.map((evt, idx) => {
                  const isActive = idx === currentStep;
                  const isPassed = idx < currentStep;

                  return (
                    <div
                      key={evt.id}
                      onClick={() => jumpToStep(idx)}
                      className={`relative group cursor-pointer transition-all duration-300 p-4 rounded-xl border ${
                        isActive
                          ? "bg-zinc-900/60 border-cyan-500/30 shadow-[0_2px_12px_rgba(34,211,238,0.04)] scale-[1.01]"
                          : isPassed
                          ? "bg-zinc-950 border-zinc-900/60 opacity-60 hover:opacity-100"
                          : "bg-zinc-950/40 border-transparent opacity-30 hover:opacity-80"
                      }`}
                    >
                      {/* Timeline Dot with specific visual status */}
                      <div className={`absolute -left-[45px] top-1/2 -translate-y-1/2 h-8.5 w-8.5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-cyan-950 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                          : isPassed
                          ? "bg-zinc-900 border-zinc-700"
                          : "bg-zinc-950 border-zinc-900"
                      }`}>
                        {getEventIcon(evt.event_type)}
                      </div>

                      {/* Header block within each event card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getEventBadgeClass(evt.event_type)}`}>
                            {evt.event_type.replace("_", " ")}
                          </span>
                          {evt.responsible_specialist && (
                            <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Cpu className="h-3 w-3 text-amber-400" /> Specialist: {evt.responsible_specialist}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {evt.timestamp}
                        </div>
                      </div>

                      {/* Event description */}
                      <p className={`text-xs font-sans leading-relaxed ${isActive ? "text-zinc-100" : "text-zinc-400"}`}>
                        {evt.description}
                      </p>

                      {/* Expanded Section for ACTIVE step details */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-3 pt-3 border-t border-zinc-800 space-y-3"
                          >
                            {/* Evidence log lines */}
                            {evt.supporting_evidence.length > 0 && (
                              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900/60">
                                <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5 font-bold flex items-center gap-1">
                                  <Terminal className="h-3 w-3" /> Telemetry Log & Evidence
                                </div>
                                <div className="space-y-1">
                                  {evt.supporting_evidence.map((line, lIdx) => (
                                    <div key={lIdx} className="text-[11px] font-mono text-zinc-400 leading-normal flex items-start gap-1.5">
                                      <ChevronRight className="h-3 w-3 shrink-0 text-zinc-600 mt-0.5" />
                                      <span className="break-all">{line}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Affected Catalog Assets URNs */}
                            {evt.related_assets.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                                  Catalog URNs:
                                </span>
                                {evt.related_assets.map((urn, uIdx) => (
                                  <span
                                    key={uIdx}
                                    className="text-[10px] font-mono bg-blue-950/20 text-blue-400 border border-blue-900/30 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-blue-950/40 cursor-pointer"
                                    title={urn}
                                  >
                                    <Database className="h-2.5 w-2.5" /> {urn.split(":").pop()?.split(",")[0] || "dataset"}
                                    <ExternalLink className="h-2 w-2 text-blue-500/80" />
                                  </span>
                                ))}
                              </div>
                            )}
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
      ) : (
        <div className="p-12 text-center text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-xs">
          NO ACTIVE TRACE MATRIX LOADED.
        </div>
      )}
    </div>
  );
}
