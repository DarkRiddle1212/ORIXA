import React, { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  Shield,
  TrendingUp,
  Database,
  CheckCircle,
  AlertTriangle,
  Clock,
  Terminal,
  ArrowUpRight,
  User,
  Zap,
  RefreshCw,
  Bell,
  Sparkles,
  Search,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "", duration = 1200 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      
      setDisplayValue(easeProgress * value);
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
}

interface ActivityItem {
  id: string;
  timestamp: string;
  type: "started" | "retrieved" | "activated" | "generated" | "delivered";
  title: string;
  description: string;
  severity: "info" | "warning" | "success" | "critical";
  assetUrn?: string;
}

interface ExecutiveDashboardProps {
  specialistsCount: number;
  activeAlertsCount: number;
  databasePoolSize: number;
  isDataHubConnected: boolean;
  addLog: (msg: string) => void;
}

export default function ExecutiveDashboard({
  specialistsCount,
  activeAlertsCount,
  databasePoolSize,
  isDataHubConnected,
  addLog
}: ExecutiveDashboardProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [welcomeSub, setWelcomeSub] = useState<string>("");

  // Live stream activity array
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "act-5",
      timestamp: "10:00:15",
      type: "delivered",
      title: "Recommendations Delivered",
      description: "Orixa compiled V2.4 migration resolution, establishing alias views for core.users.",
      severity: "success",
      assetUrn: "urn:li:dataset:postgres,core.users"
    },
    {
      id: "act-4",
      timestamp: "09:58:40",
      type: "generated",
      title: "Predictions Generated",
      description: "Oracle model cluster predicted 94.2% regression risk score on downstream Snowflake reporting.",
      severity: "warning",
      assetUrn: "urn:li:dataset:snowflake,analytic.ltv"
    },
    {
      id: "act-3",
      timestamp: "09:56:12",
      type: "activated",
      title: "Specialists Activated",
      description: "Atlas, Oracle, and Sentinel nodes initialized to analyze logical physical drift.",
      severity: "info"
    },
    {
      id: "act-2",
      timestamp: "09:55:01",
      type: "retrieved",
      title: "Context Retrieved",
      description: "Metadata catalog delta loaded. Discovered missing column 'phone_raw' on postgres URN.",
      severity: "info",
      assetUrn: "urn:li:dataset:postgres,core.users"
    },
    {
      id: "act-1",
      timestamp: "09:54:30",
      type: "started",
      title: "Investigation Started",
      description: "Airflow pipeline failure alert 'pyspark_daily_agg' triggered Orixa root-cause analyzer.",
      severity: "critical"
    }
  ]);

  // Keep clock running
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Smart Welcome Text based on Hour of Day
  useEffect(() => {
    const hours = currentTime.getHours();
    let salutation = "Good morning";
    if (hours >= 12 && hours < 17) {
      salutation = "Good afternoon";
    } else if (hours >= 17) {
      salutation = "Good evening";
    }

    setWelcomeMessage(`${salutation}.`);

    if (activeAlertsCount > 0) {
      setWelcomeSub(`Atlas is monitoring your enterprise. Action required: ${activeAlertsCount} active sandbox investigations.`);
    } else {
      setWelcomeSub("Atlas is monitoring your enterprise. All production pipelines are synchronized, with no critical incidents detected.");
    }
  }, [currentTime, activeAlertsCount]);

  // Periodically insert new realistic live system logs to show real-time stream flow
  useEffect(() => {
    const logInterval = setInterval(() => {
      const logs = [
        {
          type: "retrieved" as const,
          title: "Metadata Catalog Synced",
          description: "DataHub metadata crawler processed 18 schemas in sandbox Projects.",
          severity: "success" as const,
          assetUrn: "urn:li:dataset:postgres,core.accounts"
        },
        {
          type: "generated" as const,
          title: "Predictive Drill Audited",
          description: "ARIMA model computed degradation coefficient: drift threshold is optimal.",
          severity: "info" as const
        },
        {
          type: "activated" as const,
          title: "Sentinel Fleet Active",
          description: "Isolated container cluster project isolation scanned for port exposures.",
          severity: "info" as const
        },
        {
          type: "started" as const,
          title: "Inbound Pipeline Probe",
          description: "A scheduled dbt catalog alignment probe was executed from local coordinator.",
          severity: "info" as const,
          assetUrn: "urn:li:dataset:dbt,marts.finance"
        }
      ];

      // Pick random log
      const selected = logs[Math.floor(Math.random() * logs.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const newAct: ActivityItem = {
        id: `act-live-${now.getTime()}`,
        timestamp: timeStr,
        ...selected
      };

      setActivities(prev => [newAct, ...prev.slice(0, 7)]);
      addLog(`Enterprise Stream: [${selected.title}] - ${selected.description}`);
    }, 20000); // add a new activity every 20 seconds

    return () => clearInterval(logInterval);
  }, [addLog]);

  // Render activity icon helper
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "started":
        return <Shield className="h-4 w-4 text-red-400" />;
      case "retrieved":
        return <Database className="h-4 w-4 text-blue-400" />;
      case "activated":
        return <Cpu className="h-4 w-4 text-amber-400" />;
      case "generated":
        return <TrendingUp className="h-4 w-4 text-purple-400" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default:
        return <Activity className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getActivityBadgeClass = (severity: ActivityItem["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "success":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-800";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Smart Welcome Personalized Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 bg-zinc-950 border border-zinc-900 rounded-2xl relative overflow-hidden shadow-xl"
        id="smart-welcome-banner"
      >
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-0 right-0 h-44 w-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">SYSTEM STATUS: COGNITIVE OVERWATCH</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white">
              {welcomeMessage}
            </h1>
            <p className="text-sm md:text-base text-zinc-400 font-sans leading-relaxed max-w-3xl">
              {welcomeSub}
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 md:border-l border-zinc-900 pt-4 md:pt-0 md:pl-8 gap-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Enterprise Local Time</div>
            <div className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded-md mt-1">
              JULY 14, 2026
            </div>
          </div>
        </div>
      </motion.div>

      {/* Five Executive KPI Cards with Animated Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" id="executive-kpis-grid">
        
        {/* KPI 1: Enterprise Health */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 bg-zinc-900/15 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 rounded-2xl flex flex-col justify-between backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl min-h-[145px] relative group overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-12 w-12 bg-emerald-500/5 rounded-full blur-md pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-display font-bold tracking-widest text-zinc-500 uppercase">Enterprise Health</span>
              <div className="text-2xl font-bold text-white font-mono tracking-tight flex items-baseline gap-0.5">
                <AnimatedCounter value={98.4} decimals={1} suffix="%" />
              </div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1.5 mt-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              EXCELLENT OVERALL
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">9 microservices operational</p>
          </div>
        </motion.div>

        {/* KPI 2: AI Specialists Online */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 bg-zinc-900/15 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 rounded-2xl flex flex-col justify-between backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl min-h-[145px] relative group overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-12 w-12 bg-amber-500/5 rounded-full blur-md pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-display font-bold tracking-widest text-zinc-500 uppercase">AI Specialists</span>
              <div className="text-2xl font-bold text-white font-mono tracking-tight">
                <AnimatedCounter value={specialistsCount || 8} decimals={0} suffix=" Online" />
              </div>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1.5 mt-4">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              SUPERVISOR ACTIVE
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">Full capabilities initialized</p>
          </div>
        </motion.div>

        {/* KPI 3: Active Investigations */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 bg-zinc-900/15 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 rounded-2xl flex flex-col justify-between backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl min-h-[145px] relative group overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-12 w-12 bg-cyan-500/5 rounded-full blur-md pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-display font-bold tracking-widest text-zinc-500 uppercase">Active Investigations</span>
              <div className="text-2xl font-bold text-white font-mono tracking-tight">
                <AnimatedCounter value={activeAlertsCount} decimals={0} suffix={activeAlertsCount === 1 ? " Alert" : " Alerts"} />
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110 ${
              activeAlertsCount > 0 ? "bg-red-500/15 border-red-500/25 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
            }`}>
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className={`text-[10px] font-mono font-semibold flex items-center gap-1.5 mt-4 ${
              activeAlertsCount > 0 ? "text-red-400 animate-pulse" : "text-cyan-400"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${activeAlertsCount > 0 ? "bg-red-500 animate-ping" : "bg-cyan-500"}`} />
              {activeAlertsCount > 0 ? "DRILL IN PROGRESS" : "STANDBY GREEN"}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">Multi-sandbox boundaries active</p>
          </div>
        </motion.div>

        {/* KPI 4: High Risk Predictions */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 bg-zinc-900/15 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 rounded-2xl flex flex-col justify-between backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl min-h-[145px] relative group overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-12 w-12 bg-purple-500/5 rounded-full blur-md pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-display font-bold tracking-widest text-zinc-500 uppercase">High Risk Predictions</span>
              <div className="text-2xl font-bold text-white font-mono tracking-tight">
                <AnimatedCounter value={84.5} decimals={1} suffix="%" />
              </div>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-purple-400 font-mono font-semibold flex items-center gap-1.5 mt-4">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              SCHEMA DRIFT DEGRADATION
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">Risk metrics updating in real-time</p>
          </div>
        </motion.div>

        {/* KPI 5: Organizational Memories */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="p-5 bg-zinc-900/15 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 rounded-2xl flex flex-col justify-between backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl min-h-[145px] relative group overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-12 w-12 bg-blue-500/5 rounded-full blur-md pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-display font-bold tracking-widest text-zinc-500 uppercase">Organizational Memories</span>
              <div className="text-2xl font-bold text-white font-mono tracking-tight">
                <AnimatedCounter value={14801} decimals={0} />
              </div>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-blue-400 font-mono font-semibold flex items-center gap-1.5 mt-4">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              {isDataHubConnected ? "DATAHUB INTEGRATED" : "LOCAL COLD STORAGE"}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">Catalog mappings synced</p>
          </div>
        </motion.div>

      </div>

      {/* Enterprise Status indicators & Live Activity Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Enterprise Indicators & Relational State */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4 shadow-md relative">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" /> SYSTEM SIGNALS
              </h3>
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Signal 1 */}
              <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <div className="space-y-1">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Vite Server Gateway</div>
                  <div className="text-zinc-200 font-semibold">Port 3000 Inbound Ingress</div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-2 py-0.5 rounded">
                  ONLINE
                </span>
              </div>

              {/* Signal 2 */}
              <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <div className="space-y-1">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Database Connection Pool</div>
                  <div className="text-zinc-200 font-semibold">{databasePoolSize} Active / 20 Limit</div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded">
                  {((databasePoolSize / 20) * 100).toFixed(0)}% LOAD
                </span>
              </div>

              {/* Signal 3 */}
              <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <div className="space-y-1">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">Redis Cache Pipeline</div>
                  <div className="text-zinc-200 font-semibold">98.4% Hit Rate • 450 rps</div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded">
                  STABLE
                </span>
              </div>

              {/* Signal 4 */}
              <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl">
                <div className="space-y-1">
                  <div className="text-zinc-500 text-[10px] font-mono uppercase">DataHub Sync Engine</div>
                  <div className="text-zinc-200 font-semibold">Enterprise Catalog Sync</div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                  isDataHubConnected 
                    ? "bg-blue-950 text-blue-400 border-blue-800/40" 
                    : "bg-zinc-900 text-zinc-500 border-zinc-800"
                }`}>
                  {isDataHubConnected ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Live Activity Feed */}
        <div className="lg:col-span-8">
          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-semibold text-white font-sans">
                  Live Enterprise Activity Stream
                </h3>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider">SECURE OVERWATCH CAPABILITY</span>
            </div>

            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-900">
              <AnimatePresence initial={false}>
                {activities.map((act) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -15, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 15, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 rounded-xl flex items-start gap-3.5 transition-all duration-200"
                  >
                    <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 mt-0.5 shadow-inner">
                      {getActivityIcon(act.type)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs font-sans">{act.title}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider ${getActivityBadgeClass(act.severity)}`}>
                            {act.type}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 shrink-0">
                          <Clock className="h-3 w-3" /> {act.timestamp}
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{act.description}</p>
                      
                      {act.assetUrn && (
                        <div className="pt-1.5 flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-zinc-600">URN Context:</span>
                          <span className="text-[9px] font-mono text-cyan-400/90 bg-cyan-950/20 border border-cyan-900/30 px-1.5 py-0.2 rounded">
                            {act.assetUrn}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
