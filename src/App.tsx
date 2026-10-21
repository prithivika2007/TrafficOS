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
  const [activeTab, setActiveTab] = useState<TabId>("landing");
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
    { id: "landing", label: "Overview", icon: "✨" },
    { id: "simulator", label: "Kernel Simulator", icon: "⚙️" },
    { id: "console", label: "Live CCTV Feed", icon: "👁️" },
    { id: "analytics", label: "Queue Analytics", icon: "📊" },
    { id: "logs", label: "Kernel Logs", icon: "📋" },
  ];

  return (
    <div className="trafficos-light traffic-root relative flex min-h-screen w-full flex-col overflow-hidden bg-[#090d16] font-sans text-slate-100 antialiased selection:bg-amber-300 selection:text-slate-950">
      {/* 1. TOP OS STATUS BAR */}
      <header className="traffic-surface relative z-10 h-12 border-b border-amber-500/20 bg-slate-950/90 px-4 flex items-center justify-between text-sm text-slate-300 font-sans select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 font-bold text-amber-300 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-sm shadow-amber-400" />
            TRAFFIC_OS v2.4-KERNEL
          </span>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:flex items-center gap-1.5">
            <span className="text-slate-400">CPU:</span>
            <span className="text-emerald-400 font-bold">{cpuUsage}%</span>
          </span>
          <span className="hidden md:inline-block text-slate-700">|</span>
          <span className="hidden md:flex items-center gap-1.5">
            <span className="text-slate-400">SCHEDULER:</span>
            <span className="text-amber-300 font-semibold">ROUND_ROBIN_W_AGING</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] tracking-wider uppercase">
            <span className="traffic-light" aria-label="Traffic signal: green">
              <span className="traffic-light__bulb traffic-light__bulb--red" />
              <span className="traffic-light__bulb traffic-light__bulb--amber" />
              <span className="traffic-light__bulb traffic-light__bulb--green is-active" />
            </span>
            <span>SYSTEM ACTIVE</span>
          </div>
          <span className="text-slate-200 font-bold">{time}</span>
        </div>
      </header>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav className="traffic-surface sticky top-0 z-50 border-b border-amber-500/20 bg-slate-950/95 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-500 via-amber-400 to-emerald-500 p-[2px] shadow-lg shadow-amber-500/15">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center gap-0.5">
              <span className="flex flex-col gap-0.5" aria-hidden="true">
                <span className="h-1 w-1 rounded-full bg-red-500" />
                <span className="h-1 w-1 rounded-full bg-amber-400" />
                <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.65)]" />
              </span>
              <span className="font-black text-amber-300 tracking-tighter text-base">TOS</span>
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide text-white flex items-center gap-2">
              TrafficOS <span className="text-sm px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-bold">Pro Console</span>
            </h1>
          </div>
        </div>

        {/* LUXURY HIGH-CONTRAST TAB BUTTONS */}
        <div className="flex bg-slate-900/80 border border-slate-700/80 p-1.5 rounded-2xl gap-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-xl font-bold text-base transition-all duration-200 flex items-center gap-2 tracking-wide ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 font-black scale-[1.02] border border-amber-300"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. FULL-WIDTH MAIN CONTENT */}
      <main className="relative z-0 mx-auto w-full max-w-none flex-1 px-4 py-5 sm:px-6 md:px-8 lg:px-10">
        {activeTab === "simulator" && (
          <div className="traffic-surface rounded-3xl border border-slate-800/80 bg-[#0d1017]/80 backdrop-blur-xl p-3 sm:p-6 shadow-2xl">
            <TrafficOSSimulator />
          </div>
        )}

        {activeTab === "console" && (
          <div className="traffic-surface rounded-3xl border border-slate-800/80 bg-[#0d1017]/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
            <LiveTrafficConsole />
          </div>
        )}

        {activeTab === "landing" && (
          <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden px-2 py-8 font-sans sm:px-4">
            <div className="overview-ambient overview-ambient--gold" />
            <div className="overview-ambient overview-ambient--green" />

            <section className="traffic-surface overview-hero relative z-10 w-full max-w-6xl overflow-hidden rounded-[2rem] border p-6 shadow-2xl sm:p-9 lg:p-12">
              <div className="overview-hero__grid">
                <div className="overview-hero__copy">
                  <div className="overview-badge">
                    <span className="traffic-light" aria-label="Traffic signal cycling">
                      <span className="traffic-light__bulb traffic-light__bulb--red" />
                      <span className="traffic-light__bulb traffic-light__bulb--amber" />
                      <span className="traffic-light__bulb traffic-light__bulb--green is-active" />
                    </span>
                    AIML Department Expo Showcase · TrafficOS v2.4
                  </div>

                  <div className="mt-7 space-y-5">
                    <p className="overview-eyebrow">Intelligent traffic. Engineered to flow.</p>
                    <h2 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                      Simulating OS Scheduling via{" "}
                      <span className="overview-title-accent">Traffic Micro-Control</span>
                    </h2>
                    <p className="max-w-2xl text-lg font-semibold leading-relaxed text-slate-300 sm:text-xl">
                      Bridge theoretical CPU scheduling with visual intersection management.
                      Explore fair round-robin cycles, dynamic priority aging, and instant emergency preemption.
                    </p>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setActiveTab("simulator")}
                      className="group inline-flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 px-7 py-4 text-base font-black uppercase tracking-wider text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.24)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_48px_rgba(245,158,11,0.4)] active:scale-[0.98] sm:text-lg"
                    >
                      <span>Launch Kernel Simulator</span>
                      <span className="overview-launch-arrow" aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>

                <div className="overview-signal-wrap">
                  <div className="overview-signal-caption">Live scheduler state</div>
                  <div
                    className="overview-signal"
                    role="img"
                    aria-label="Animated traffic signal cycling through red, amber, and green"
                  >
                    <span className="overview-signal__highlight" />
                    <span className="overview-signal__lamp overview-signal__lamp--red" />
                    <span className="overview-signal__lamp overview-signal__lamp--amber" />
                    <span className="overview-signal__lamp overview-signal__lamp--green" />
                  </div>
                  <div className="overview-signal__post" />
                  <div className="overview-signal__base" />
                  <div className="overview-signal-status">
                    <span className="overview-signal-status__dot" />
                    CONTEXT SWITCH · SIGNAL CYCLE
                  </div>
                </div>
              </div>

              <div className="overview-divider" />

              <div className="grid grid-cols-1 gap-3 text-left md:grid-cols-3">
                {[
                  { title: "Round Robin (RR)", desc: "Fair cyclical green-light quantum distribution.", signal: "green" },
                  { title: "Dynamic Aging", desc: "Escalates waiting lanes to prevent starvation.", signal: "amber" },
                  { title: "Ambulance AI", desc: "Preempts the cycle for emergency passage.", signal: "red" },
                ].map((item, idx) => (
                  <div key={item.title} className="overview-feature">
                    <span className={`overview-feature__signal overview-feature__signal--${item.signal}`} />
                    <div>
                      <div className="text-base font-black text-white sm:text-lg">0{idx + 1}. {item.title}</div>
                      <div className="mt-1 text-sm font-semibold leading-relaxed text-slate-300 sm:text-base">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="traffic-surface rounded-3xl border border-slate-800/80 bg-[#0d1017]/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
            <QueueAnalytics />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="traffic-surface p-6 bg-[#080a0f] border border-slate-800/80 rounded-3xl font-mono text-xs text-slate-300 space-y-2.5 shadow-2xl">
            <div className="text-amber-300 font-bold border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>[KERNEL LOG SYSTEM — LIVE TRACE]</span>
              <span className="text-[10px] text-slate-500">BUFFER SIZE: 4.2 KB</span>
            </div>
            <div className="text-slate-400">[08:42:01] INFO: Initialized Intersection Node #01 [SRM_AIML_CLUSTER]</div>
            <div className="text-amber-300">[08:42:02] KERNEL: Active Algorithm set to Round-Robin (Time Quantum: 3s)</div>
            <div className="text-emerald-300">[08:42:05] SCHEDULER: Switched priority signal to NORTH lane (Weight: 1.0)</div>
            <div className="text-amber-350">[08:42:08] AGING_ENGINE: Evaluated starvation weights. Delta waiting threshold normal.</div>
          </div>
        )}
      </main>
    </div>
  );
}