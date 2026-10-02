import React, { useState } from "react";
import TrafficOSSimulator from "./TrafficOSSimulator";

export default function App() {
  const [activeTab, setActiveTab] = useState("simulator");
  const [selectedAlgoConfig, setSelectedAlgoConfig] = useState(null);

  const handleLaunchSimulator = (algo) => {
    setSelectedAlgoConfig(algo);
    setActiveTab("simulator");
  };

  return (
    <div className="min-h-screen bg-navy-950 text-ink-100 font-body flex flex-col selection:bg-cyan-500 selection:text-navy-950">
      {/* Top OS Terminal Navigation Bar */}
      <header className="sticky top-0 z-50 bg-navy-900/90 backdrop-blur-md border-b border-navy-700/60 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-navy-800 border border-cyan-500/40 text-cyan-400 font-mono font-bold text-sm shadow-glow-cyan">
              <span className="animate-pulse-soft">T</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-signal-green animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold tracking-tight text-white text-base">
                  TrafficOS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  v2.0 LAB
                </span>
              </div>
              <p className="text-xs text-ink-500 font-mono hidden sm:block">
                Kernel Scheduling &amp; Micro-Intersection Control
              </p>
            </div>
          </div>

          {/* Navigation Links with Subtle Underline/Glow Hover Animations */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-navy-900 p-1 rounded-xl border border-navy-700/50">
            {[
              { id: "landing", label: "Landing" },
              { id: "kernel", label: "Kernel Mapping" },
              { id: "manual", label: "Lab Manual" },
              { id: "algorithms", label: "Scheduling Algorithms" },
              { id: "simulator", label: "Simulator" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                    isActive
                      ? "text-cyan-400 font-semibold bg-navy-800 border border-cyan-500/30 shadow-sm"
                      : "text-ink-300 hover:text-white hover:bg-navy-800/50"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "landing" && (
          <section className="animate-fade-in space-y-6">
            <div className="p-8 rounded-2xl bg-navy-900 border border-navy-700/60 shadow-panel relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-cyan-950 border border-cyan-500/30 mb-4">
                Real-Time OS Visualization
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
                Simulate Operating System Scheduling via Traffic Micro-Control
              </h1>
              <p className="text-ink-300 max-w-2xl text-sm leading-relaxed mb-6">
                Bridge the gap between theoretical CPU scheduling algorithms and visual micro-intersection management. Observe process states, context switches, Gantt timeline generation, and real-time vehicular throughput in a unified laboratory environment.
              </p>
              <button
                onClick={() => setActiveTab("simulator")}
                className="px-5 py-2.5 bg-cyan-500 text-navy-950 font-mono font-semibold text-xs rounded-xl hover:bg-cyan-400 hover:shadow-glow-cyan transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Launch Simulator Console →
              </button>
            </div>
          </section>
        )}

        {activeTab === "kernel" && (
          <section className="animate-fade-in p-6 rounded-2xl bg-navy-900 border border-navy-700/60 shadow-panel">
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Kernel Architecture &amp; Process Control
            </h2>
            <p className="text-ink-300 text-xs font-mono mb-6">
              Mapping CPU primitives to intersection hardware controllers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-700/50">
                <span className="text-cyan-400 font-bold block mb-1">Process Control Block (PCB)</span>
                <p className="text-ink-500 leading-relaxed">
                  Holds PID, burst time, remaining execution cycles, priority level, and current queue state.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-700/50">
                <span className="text-signal-green font-bold block mb-1">Interrupt Dispatcher</span>
                <p className="text-ink-500 leading-relaxed">
                  Handles timer interrupts, context switching state frames, and traffic signal timing pulses.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-700/50">
                <span className="text-signal-amber font-bold block mb-1">Scheduler Subsystem</span>
                <p className="text-ink-500 leading-relaxed">
                  Implements preemptive and non-preemptive queue selection routines (RR, Priority + Aging, SJF).
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "manual" && (
          <section className="animate-fade-in p-6 rounded-2xl bg-navy-900 border border-navy-700/60 shadow-panel">
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Laboratory Manual
            </h2>
            <p className="text-ink-300 text-xs font-mono mb-6">
              Guided experiments &amp; observations for students.
            </p>
            <div className="space-y-4 text-xs font-mono text-ink-300">
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-700/50">
                <h3 className="text-white font-bold mb-2">Experiment 1: Round Robin Time Quantum Analysis</h3>
                <p className="text-ink-500 mb-3">
                  Observe how changing the quantum length affects total context switches and average turnaround time.
                </p>
                <button
                  onClick={() => handleLaunchSimulator({ algo: "RR", quantum: 3 })}
                  className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all text-xs"
                >
                  Load RR Experiment (Quantum = 3) →
                </button>
              </div>
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-700/50">
                <h3 className="text-white font-bold mb-2">Experiment 2: Starvation Prevention via Aging</h3>
                <p className="text-ink-500 mb-3">
                  Analyze how priority aging elevates waiting low-priority processes to eliminate infinite blocking.
                </p>
                <button
                  onClick={() => handleLaunchSimulator({ algo: "PRIORITY_AGING" })}
                  className="px-3 py-1.5 bg-signal-green/10 text-signal-green border border-signal-green/30 rounded-lg hover:bg-signal-green/20 transition-all text-xs"
                >
                  Load Priority + Aging Experiment →
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "algorithms" && (
          <section className="animate-fade-in p-6 rounded-2xl bg-navy-900 border border-navy-700/60 shadow-panel space-y-4">
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Scheduling Algorithms Library
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-5 rounded-xl bg-navy-850 border border-navy-700/50 flex flex-col justify-between">
                <div>
                  <h3 className="text-cyan-400 font-bold text-sm mb-1">Round Robin (RR)</h3>
                  <p className="text-ink-500 mb-4 leading-relaxed">
                    Preemptive time-slice execution. Every process gets equal CPU access for a fixed duration before returning to the READY queue.
                  </p>
                </div>
                <button
                  onClick={() => handleLaunchSimulator({ algo: "RR", quantum: 2 })}
                  className="self-start px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all"
                >
                  Try Round Robin →
                </button>
              </div>

              <div className="p-5 rounded-xl bg-navy-850 border border-navy-700/50 flex flex-col justify-between">
                <div>
                  <h3 className="text-signal-green font-bold text-sm mb-1">Priority Scheduling with Aging</h3>
                  <p className="text-ink-500 mb-4 leading-relaxed">
                    Processes execute according to priority levels. Waiting processes incrementally gain priority over time to prevent starvation.
                  </p>
                </div>
                <button
                  onClick={() => handleLaunchSimulator({ algo: "PRIORITY_AGING" })}
                  className="self-start px-3 py-1.5 bg-signal-green/10 text-signal-green border border-signal-green/30 rounded-lg hover:bg-signal-green/20 transition-all"
                >
                  Try Priority + Aging →
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "simulator" && (
          <div className="animate-fade-in">
            <TrafficOSSimulator initialAlgoConfig={selectedAlgoConfig} />
          </div>
        )}
      </main>
    </div>
  );
}