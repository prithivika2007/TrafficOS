import React, { useState, useEffect } from "react";
import TrafficOSSimulator from "./TrafficOSSimulator";
import LiveTrafficConsole from "./components/LiveTrafficConsole";
import QueueAnalytics from "./components/QueueAnalytics";

type TabId = "landing" | "simulator" | "console" | "analytics" | "logs";

interface NavTab {
  id: TabId;
  label: string;
  icon: string;
}

export default function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>("simulator");
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  const [cpuUsage, setCpuUsage] = useState<number>(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setCpuUsage(Math.floor(12 + Math.random() * 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navTabs: NavTab[] = [
    { id: "landing", label: "Overview", icon: "🚗" },
    { id: "simulator", label: "Kernel Simulator", icon: "🏎️" },
    { id: "console", label: "Live CCTV Feed", icon: "🚓" },
    { id: "analytics", label: "Queue Analytics", icon: "🛺" },
    { id: "logs", label: "Kernel Logs", icon: "🚕" },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* 1. TOP OS STATUS BAR */}
      <header className="h-9 bg-[#0f172a] border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300 font-medium select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 font-mono font-bold text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            TRAFFIC_OS v2.4-KERNEL
          </span>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:flex items-center gap-1 font-mono">
            <span className="text-slate-400">CPU:</span>
            <span className="text-emerald-400 font-bold">{cpuUsage}%</span>
          </span>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:flex items-center gap-1 font-mono">
            <span className="text-slate-400">SCHEDULER:</span>
            <span className="text-cyan-300 font-semibold">ROUND_ROBIN</span>
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SYSTEM ACTIVE</span>
          </div>
          <span className="text-white font-bold">{time}</span>
        </div>
      </header>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center font-black text-cyan-400 tracking-tighter text-base">
              TOS
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-white flex items-center gap-2">
              TrafficOS <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">Pro Console</span>
            </h1>
          </div>
        </div>

        {/* HIGH-CONTRAST TAB BUTTONS */}
        <div className="flex bg-[#090e1a] border border-slate-700 p-1 rounded-xl gap-1.5">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all duration-150 flex items-center gap-2 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 border border-cyan-300/40"
                    : "text-slate-200 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. CONSTRAINED MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
        {activeTab === "simulator" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-3 sm:p-5 shadow-2xl">
            <TrafficOSSimulator onSwitchToConsole={() => setActiveTab("console")} />
          </div>
        )}

        {activeTab === "console" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 shadow-2xl">
            <LiveTrafficConsole />
          </div>
        )}

        {activeTab === "landing" && (
          <div className="p-10 text-center space-y-5 bg-[#0d1424] border border-slate-800 rounded-3xl max-w-3xl mx-auto shadow-2xl mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold">
              🏎️ Real-Time Vision Kernel Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Simulate Operating System Scheduling via Traffic Micro-Control
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Bridge theoretical CPU scheduling algorithms with visual intersection management. Drag and drop interactive workload vehicles to simulate live preemptions.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setActiveTab("simulator")}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all text-sm"
              >
                Launch Kernel Simulator 🏎️ →
              </button>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-4 sm:p-6 shadow-2xl">
            <QueueAnalytics />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="p-6 bg-[#050811] border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 space-y-2">
            <div className="text-cyan-400 font-bold border-b border-slate-800 pb-2">[KERNEL LOG SYSTEM]</div>
            <div>[08:42:01] INFO: Initialized Intersection Node #01</div>
            <div>[08:42:02] KERNEL: Active Algorithm set to Round-Robin (Time Quantum: 4s)</div>
            <div>[08:42:05] SCHEDULER: Switched priority signal to NORTH lane</div>
          </div>
        )}
      </main>
    </div>
  );
}