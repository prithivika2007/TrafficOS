import React from "react";

export default function Hero({ onLaunch }) {
  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 overflow-hidden font-mono text-slate-100">
      {/* Background Glow & Ambient Effects */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-cyan-500/10 to-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Main Glassmorphic Showcase Card */}
      <div className="relative z-10 max-w-3xl w-full p-8 md:p-12 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center space-y-8">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold tracking-wider uppercase shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          AIML Department Expo Showcase • TrafficOS v2.4
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Redefining Urban Mobility via <span className="bg-gradient-to-r from-amber-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">OS Micro-Control</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Transitioning traffic intersections from rigid static timers to dynamic CPU-inspired scheduling. Experience zero-starvation round-robin workflows and instant emergency preemption.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          {[
            { title: "Round Robin (RR)", desc: "Fair cyclical green-light quanta distribution." },
            { title: "Dynamic Aging", desc: "Prevents process starvation over time." },
            { title: "Ambulance AI", desc: "Instant preemption for emergency lanes." },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 shadow-inner">
              <div className="text-xs font-bold text-amber-300 mb-1">0{idx + 1}. {item.title}</div>
              <div className="text-[11px] text-slate-400 leading-normal">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA Launch Button */}
        <div className="pt-2">
          <button
            onClick={onLaunch}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-extrabold text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <span>Launch Kernel Simulator</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}