"use client";

import React, { useState } from "react";
import { Terminal, Shield, Cpu, Activity, Database, Key } from "lucide-react";

export default function Home() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-[#e4e4e7] overflow-hidden">
      {/* Top Banner */}
      <header className="border-b border-[#1f1f23] bg-[#09090b]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-black shadow-lg shadow-emerald-500/20">
            Ω
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-white">ORIXA</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#a1a1aa] font-mono">
              Enterprise Intelligence Operating System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            ENGINE_ONLINE
          </span>
          <span className="text-[#52525b]">|</span>
          <span className="text-gray-400">v1.0.0-foundation</span>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-[#1f1f23] bg-[#07070a] p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-[11px] font-mono tracking-widest text-[#52525b] uppercase px-3">
              Core Core Modules
            </div>
            <nav className="space-y-1">
              {["Dashboard", "Investigations", "Knowledge", "Specialists", "Settings"].map((nav) => (
                <button
                  key={nav}
                  onClick={() => setActiveNav(nav)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-between ${
                    activeNav === nav
                      ? "bg-[#18181b] text-white font-medium border-l-2 border-emerald-500"
                      : "text-gray-400 hover:text-white hover:bg-[#0f0f13]"
                  }`}
                >
                  <span>{nav}</span>
                  <span className="text-[10px] font-mono text-[#52525b]">0{["Dashboard", "Investigations", "Knowledge", "Specialists", "Settings"].indexOf(nav) + 1}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 bg-[#09090b] rounded-lg border border-[#1f1f23] text-xs font-mono space-y-1">
            <div className="text-[#71717a]">TENANT</div>
            <div className="text-white font-medium">Acme Aerospace</div>
            <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
              <Shield className="h-3 w-3" /> SECURE_SANDBOX
            </div>
          </div>
        </aside>

        {/* Console view area */}
        <main className="flex-1 p-8 bg-radial from-[#0c0c10] to-[#050507] overflow-y-auto">
          {activeNav === "Dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">System Dashboard</h2>
                  <p className="text-sm text-[#a1a1aa]">Real-time operational status of isolated analytical domains.</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 text-xs font-mono">
                  ACTIVE_CONTAINERS_HEALTHY
                </div>
              </div>

              {/* Grid of micro cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#09090b] border border-[#1f1f23] rounded-lg">
                  <div className="flex items-center gap-2 text-[#71717a] text-xs font-mono mb-2">
                    <Activity className="h-4 w-4 text-emerald-400" /> INSTANCE LATENCY
                  </div>
                  <div className="text-2xl font-bold text-white">12 ms</div>
                  <div className="text-[10px] text-gray-500 mt-1 font-mono">AVG LAST 100 INBOUND REQS</div>
                </div>
                <div className="p-4 bg-[#09090b] border border-[#1f1f23] rounded-lg">
                  <div className="flex items-center gap-2 text-[#71717a] text-xs font-mono mb-2">
                    <Database className="h-4 w-4 text-teal-400" /> POSTGRES POOLS
                  </div>
                  <div className="text-2xl font-bold text-white">3 / 20 connections</div>
                  <div className="text-[10px] text-gray-500 mt-1 font-mono">ASYNC ENGINE AUTO-SCALE ACTIVE</div>
                </div>
                <div className="p-4 bg-[#09090b] border border-[#1f1f23] rounded-lg">
                  <div className="flex items-center gap-2 text-[#71717a] text-xs font-mono mb-2">
                    <Cpu className="h-4 w-4 text-purple-400" /> RUNNING SPECIALISTS
                  </div>
                  <div className="text-2xl font-bold text-white">4 Active</div>
                  <div className="text-[10px] text-gray-500 mt-1 font-mono">ISOLATED SANDBOX BOUNDARY READY</div>
                </div>
              </div>

              <div className="p-6 bg-[#09090b] border border-[#1f1f23] rounded-lg font-mono">
                <div className="flex items-center gap-2 text-[#a1a1aa] mb-4">
                  <Terminal className="h-4 w-4" /> System Startup Sequences
                </div>
                <div className="space-y-1.5 text-xs text-[#71717a]">
                  <p className="text-emerald-400">[OK] Initialized PostgreSQL connection pool with Asyncpg (20 concurrent links limit)</p>
                  <p className="text-emerald-400">[OK] Redis connection pooling established at host: redis_7_alpine</p>
                  <p className="text-emerald-400">[OK] Audited log tracing middleware mounted with UUID correlation tags</p>
                  <p className="text-teal-400">[INFO] Loaded 3 intelligence structures from schema models: Organization, User, Project</p>
                  <p className="text-yellow-400">[WARN] DataHub semantic synchronization pending config schema key settings</p>
                </div>
              </div>
            </div>
          )}

          {activeNav === "Investigations" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">Investigations</h2>
              <p className="text-sm text-[#a1a1aa]">Track security audits, file corruption monitoring, and anomaly detection logs.</p>
              <div className="p-8 text-center bg-[#09090b] border border-dashed border-[#1f1f23] rounded-lg">
                <Shield className="h-8 w-8 text-[#52525b] mx-auto mb-3" />
                <p className="text-sm font-medium text-white">No Active Investigations Drills Loaded</p>
                <p className="text-xs text-gray-500 mt-1">Ready to sync with DataHub workspace streams when configured.</p>
              </div>
            </div>
          )}

          {activeNav === "Knowledge" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">Knowledge Index</h2>
              <p className="text-sm text-[#a1a1aa]">View relational organization data and indexed schema nodes synced via DataHub.</p>
              <div className="p-8 text-center bg-[#09090b] border border-dashed border-[#1f1f23] rounded-lg">
                <Database className="h-8 w-8 text-[#52525b] mx-auto mb-3" />
                <p className="text-sm font-medium text-white">Knowledge Sync Hub Offline</p>
                <p className="text-xs text-gray-500 mt-1">Configure your organization settings to start semantic mapping models.</p>
              </div>
            </div>
          )}

          {activeNav === "Specialists" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">Specialists Fleet</h2>
              <p className="text-sm text-[#a1a1aa]">Dedicated AI agents monitoring and assessing analytical operations.</p>
              <div className="p-8 text-center bg-[#09090b] border border-dashed border-[#1f1f23] rounded-lg">
                <Cpu className="h-8 w-8 text-[#52525b] mx-auto mb-3" />
                <p className="text-sm font-medium text-white">Specialists Standby Mode</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting workspace API token verification keys to start analysis logs.</p>
              </div>
            </div>
          )}

          {activeNav === "Settings" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">Operating System Settings</h2>
              <p className="text-sm text-[#a1a1aa]">Configure multi-tenant separation parameters and security access lists.</p>
              <div className="p-8 text-center bg-[#09090b] border border-dashed border-[#1f1f23] rounded-lg">
                <Key className="h-8 w-8 text-[#52525b] mx-auto mb-3" />
                <p className="text-sm font-medium text-white">System Configuration Boundaries Sealed</p>
                <p className="text-xs text-gray-500 mt-1">Access requires active SuperAdmin verification tokens.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
