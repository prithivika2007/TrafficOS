import { useEffect, useState } from "react";

// Round-robin order used to cycle the decorative demo — mirrors the
// North → East → South → West → North order described in the
// Round Robin section below.
const ARMS = ["NORTH", "EAST", "SOUTH", "WEST"];

function TrafficPod({ state, orientation }) {
  // state: "green" | "red"
  const isVertical = orientation === "vertical";
  return (
    <div
      className={`flex items-center gap-1 rounded-md border border-white/[0.08] bg-navy-900/90 p-1 ${
        isVertical ? "flex-row" : "flex-col"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${state === "red" ? "bg-signal-red shadow-glow-red" : "bg-signal-red/20"}`} />
      <span className={`h-1.5 w-1.5 rounded-full bg-signal-amber/20`} />
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === "green" ? "bg-signal-green shadow-glow motion-safe:animate-pulse-soft" : "bg-signal-green/20"
        }`}
      />
    </div>
  );
}

export default function IntersectionVisual() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // keep a single static state for reduced-motion users
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % ARMS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const active = ARMS[activeIdx];

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* status badges */}
      <div className="absolute -top-4 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-navy-900/90 px-3 py-1.5 font-mono text-[11px] tracking-wide text-ink-300 shadow-panel">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-green motion-safe:animate-pulse-soft" />
        CURRENT&nbsp;PROCESS:&nbsp;<span className="text-ink-100">{active}</span>
      </div>
      <div className="absolute -top-4 right-3 z-20 hidden sm:flex items-center gap-1.5 rounded-full border border-signal-green/25 bg-signal-green/10 px-3 py-1.5 font-mono text-[11px] tracking-wide text-signal-green shadow-panel">
        CPU → GREEN&nbsp;SIGNAL
      </div>

      <div className="relative aspect-square rounded-[28px] glass-panel shadow-panel overflow-hidden bg-noise-grid mt-2">
        {/* roads */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[36%] bg-navy-800/90" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[36%] bg-navy-800/90" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-white/[0.12]" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-white/[0.12]" />
        {/* intersection core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36%] h-[36%] bg-navy-900 border border-white/[0.06]" />

        {/* ---- NORTH arm ---- */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[36%]">
          <div className="absolute left-1/2 -translate-x-1/2 top-[27%] z-10">
            <TrafficPod state={active === "NORTH" ? "green" : "red"} orientation="vertical" />
          </div>
          {active === "NORTH" ? (
            <div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-6 rounded-[3px] bg-signal-green/90 shadow-glow motion-safe:animate-drive-ns"
              style={{ animationPlayState: "running" }}
            />
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 top-[16%] w-3 h-6 rounded-[3px] bg-ink-700/70" />
          )}
        </div>

        {/* ---- SOUTH arm ---- */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[36%]">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[27%] z-10">
            <TrafficPod state={active === "SOUTH" ? "green" : "red"} orientation="vertical" />
          </div>
          {active === "SOUTH" ? (
            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-6 rounded-[3px] bg-signal-green/90 shadow-glow motion-safe:animate-drive-sn" />
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[16%] w-3 h-6 rounded-[3px] bg-ink-700/70" />
          )}
        </div>

        {/* ---- WEST arm ---- */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[36%]">
          <div className="absolute top-1/2 -translate-y-1/2 left-[27%] z-10">
            <TrafficPod state={active === "WEST" ? "green" : "red"} orientation="horizontal" />
          </div>
          {active === "WEST" ? (
            <div className="absolute top-1/2 -translate-y-1/2 h-3 w-6 rounded-[3px] bg-signal-green/90 shadow-glow motion-safe:animate-drive-we" />
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 left-[16%] h-3 w-6 rounded-[3px] bg-ink-700/70" />
          )}
        </div>

        {/* ---- EAST arm ---- */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[36%]">
          <div className="absolute top-1/2 -translate-y-1/2 right-[27%] z-10">
            <TrafficPod state={active === "EAST" ? "green" : "red"} orientation="horizontal" />
          </div>
          {active === "EAST" ? (
            <div className="absolute top-1/2 -translate-y-1/2 h-3 w-6 rounded-[3px] bg-signal-green/90 shadow-glow motion-safe:animate-drive-ew" />
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 right-[16%] h-3 w-6 rounded-[3px] bg-ink-700/70" />
          )}
        </div>

        {/* compass labels */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-ink-700">N</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-ink-700">S</span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-ink-700">W</span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-ink-700">E</span>
      </div>

      <p className="mt-3 text-center font-mono text-[11px] text-ink-700">
        live demo · scheduler cycles lanes every few seconds
      </p>
    </div>
  );
}
