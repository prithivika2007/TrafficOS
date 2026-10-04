import React, { useState, useEffect, useRef } from "react";
import {
  Algo,
  Direction,
  DIRECTIONS,
  MAX_PER_LANE,
  AGING_STEP,
  Setup,
  Sim,
  Snapshot,
  addVehicle,
  createSim,
  defaultSetup,
  effectivePriority,
  snapshot,
  step,
} from "./simEngine";

interface TrafficOSSimulatorProps {
  initialAlgoConfig?: {
    algo?: string;
    quantum?: number;
  } | null;
}

const LANE_DOT: Record<Direction, string> = {
  NORTH: "bg-red-500",
  EAST: "bg-blue-500",
  SOUTH: "bg-purple-500",
  WEST: "bg-amber-500",
};
const LANE_SHORT: Record<Direction, string> = { NORTH: "N", EAST: "E", SOUTH: "S", WEST: "W" };

const ALGO_LABEL: Record<Algo, string> = {
  RR: "Round Robin (RR)",
  PRIORITY_AGING: "Priority + Aging",
  SJF: "Shortest Job First (SJF)",
  FCFS: "First-Come First-Served",
};

const ALGO_HINT: Record<Algo, string> = {
  FCFS: "Lanes are served in arrival order; each lane runs until its queue is empty (non-preemptive).",
  SJF: "The lane with the fewest waiting vehicles goes first; it runs until empty (non-preemptive).",
  RR: "Every lane gets one time quantum of green in circular order, then the next lane (preemptive).",
  PRIORITY_AGING: `The best-priority lane goes first (1 = highest). Waiting lanes gain a level every ${AGING_STEP}s so none starves.`,
};

const isAlgo = (a?: string): a is Algo =>
  a === "RR" || a === "PRIORITY_AGING" || a === "SJF" || a === "FCFS";

type Phase = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED";

export const TrafficOSSimulator: React.FC<TrafficOSSimulatorProps> = ({
  initialAlgoConfig,
}) => {
  // ---- Setup (what the user configures before pressing START) -----------------
  const [selectedAlgo, setSelectedAlgo] = useState<Algo>(
    isAlgo(initialAlgoConfig?.algo) ? initialAlgoConfig!.algo as Algo : "RR"
  );
  const [timeQuantum, setTimeQuantum] = useState<number>(initialAlgoConfig?.quantum || 3);
  const [aging, setAging] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [setup, setSetup] = useState<Setup>(defaultSetup());

  // ---- Live simulation --------------------------------------------------------
  const simRef = useRef<Sim>(createSim(setup));
  const [snap, setSnap] = useState<Snapshot>(() => snapshot(simRef.current));
  const [running, setRunning] = useState<boolean>(false);

  // Latest settings for the animation loop (avoids stale closures).
  const cfgRef = useRef({ algo: selectedAlgo, quantum: timeQuantum, aging, speed });
  cfgRef.current = { algo: selectedAlgo, quantum: timeQuantum, aging, speed };

  // Sync when App passes a new algorithm / quantum (from the Lab Manual buttons).
  useEffect(() => {
    if (isAlgo(initialAlgoConfig?.algo)) setSelectedAlgo(initialAlgoConfig!.algo as Algo);
    if (initialAlgoConfig?.quantum) setTimeQuantum(initialAlgoConfig.quantum);
  }, [initialAlgoConfig]);

  // Before START, editing the lane setup rebuilds the scene so the queued cars appear live.
  useEffect(() => {
    if (simRef.current.started) return;
    simRef.current = createSim(setup);
    setSnap(snapshot(simRef.current));
  }, [setup]);

  // Animation loop: runs every frame while RUNNING.
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    let frameId = 0;

    const loop = (now: number) => {
      const c = cfgRef.current;
      const dt = Math.min((now - last) / 1000, 0.1) * c.speed; // clamp after tab switches
      last = now;
      step(simRef.current, dt, c.algo, c.quantum, c.aging);
      setSnap(snapshot(simRef.current));
      if (simRef.current.finished) {
        setRunning(false);
      } else {
        frameId = requestAnimationFrame(loop);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [running]);

  const phase: Phase = snap.finished
    ? "COMPLETED"
    : running
    ? "RUNNING"
    : snap.started
    ? "PAUSED"
    : "IDLE";

  const totalVehicles = DIRECTIONS.reduce((n, d) => n + setup[d].count, 0);

  // ---- Controls ---------------------------------------------------------------
  const reset = () => {
    setRunning(false);
    simRef.current = createSim(setup);
    setSnap(snapshot(simRef.current));
  };

  const startPause = () => {
    if (phase === "RUNNING") {
      setRunning(false);
    } else if (phase === "COMPLETED") {
      simRef.current = createSim(setup);
      setSnap(snapshot(simRef.current));
      setRunning(true);
    } else if (totalVehicles > 0 || simRef.current.cars.length > 0) {
      setRunning(true);
    }
  };

  // STEP TICK: advance the simulation by exactly one second.
  const stepTick = () => {
    if (phase === "COMPLETED") return;
    const c = cfgRef.current;
    step(simRef.current, 1, c.algo, c.quantum, c.aging);
    setSnap(snapshot(simRef.current));
  };

  const injectVehicle = (lane: Direction) => {
    if (addVehicle(simRef.current, lane)) setSnap(snapshot(simRef.current));
  };

  const setLane = (lane: Direction, patch: Partial<Setup[Direction]>) =>
    setSetup((prev) => ({ ...prev, [lane]: { ...prev[lane], ...patch } }));

  // ---- Rendering helpers ------------------------------------------------------
  // Map progress % to absolute 2D visual layout
  const getVehicleStyle = (lane: Direction, progress: number) => {
    switch (lane) {
      case "NORTH": // Drive down (+Y)
        return { top: `${progress}%`, left: "48%" };
      case "SOUTH": // Drive up (-Y)
        return { bottom: `${progress}%`, left: "52%" };
      case "EAST": // Drive left (-X)
        return { right: `${progress}%`, top: "48%" };
      case "WEST": // Drive right (+X)
        return { left: `${progress}%`, top: "52%" };
    }
  };

  const signalOf = (lane: Direction) => {
    if (snap.active === lane) return "🟢 GREEN";
    if (snap.clearing && snap.lastLane === lane) return "🟡 YELLOW";
    return "🔴 RED";
  };

  const activeIdx = snap.active ? DIRECTIONS.indexOf(snap.active) : -1;
  const preemptive = selectedAlgo === "RR" || selectedAlgo === "PRIORITY_AGING";
  const locked = snap.started; // setup is frozen once the run has begun (RESET to edit)

  // Gantt: closed segments plus the one currently green
  const segs = snap.segments
    .map((s) => ({ ...s, end: s.end ?? snap.clock }))
    .filter((s) => s.end - s.start > 0.01)
    .slice(-14);

  const selectCls =
    "w-full bg-navy-950 border border-navy-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50";

  return (
    <div className="space-y-6 font-mono text-slate-100">
      {/* Top Simulator Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-panel">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={startPause}
            disabled={phase === "IDLE" && totalVehicles === 0}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all disabled:opacity-40 ${
              phase === "RUNNING"
                ? "bg-amber-500 hover:bg-amber-400 text-navy-950 shadow-glow-amber"
                : "bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-glow-green"
            }`}
          >
            {phase === "RUNNING"
              ? "PAUSE SIMULATION"
              : phase === "PAUSED"
              ? "RESUME SIMULATION"
              : phase === "COMPLETED"
              ? "RESTART SIMULATION"
              : "START SIMULATION"}
          </button>

          <button
            onClick={stepTick}
            disabled={phase === "RUNNING" || phase === "COMPLETED" || totalVehicles === 0}
            className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-xs font-semibold text-cyan-400 border border-cyan-500/30 disabled:opacity-40"
          >
            STEP TICK
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-xs font-semibold text-ink-300 border border-navy-700"
          >
            RESET
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-ink-500">
            CLOCK: <span className="text-cyan-400 font-bold">{snap.clock.toFixed(1)}s</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-500">STATE:</span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                phase === "RUNNING"
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                  : phase === "COMPLETED"
                  ? "bg-cyan-950 text-cyan-400 border border-cyan-500/30"
                  : "bg-navy-800 text-ink-400 border border-navy-700"
              }`}
            >
              {phase}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-navy-900 border border-navy-700/60 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Scheduler Parameters
          </h3>

          <div>
            <label className="block text-xs text-ink-400 mb-1">Active Algorithm</label>
            <select
              value={selectedAlgo}
              onChange={(e) => setSelectedAlgo(e.target.value as Algo)}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {(Object.keys(ALGO_LABEL) as Algo[]).map((a) => (
                <option key={a} value={a}>
                  {ALGO_LABEL[a]}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[10px] leading-relaxed text-ink-500">{ALGO_HINT[selectedAlgo]}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-ink-500 mb-1">TIME QUANTUM</label>
              <select
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Number(e.target.value))}
                disabled={!preemptive}
                className={selectCls}
              >
                {[1, 2, 3, 5].map((q) => (
                  <option key={q} value={q}>
                    {q}s
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-ink-500 mb-1">SIM SPEED</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className={selectCls}
              >
                {[1, 2, 4].map((s) => (
                  <option key={s} value={s}>
                    {s}x
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedAlgo === "PRIORITY_AGING" && (
            <button
              onClick={() => setAging((a) => !a)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                aging
                  ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                  : "bg-navy-800 text-ink-400 border-navy-700"
              }`}
            >
              DYNAMIC AGING: {aging ? "ACTIVE" : "OFF (lanes can starve)"}
            </button>
          )}

          {/* Per-lane workload */}
          <div>
            <label className="block text-[10px] text-ink-500 mb-2 uppercase">
              Lane workload {locked && "(locked — press RESET to edit)"}
            </label>
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 text-[10px] text-ink-500">
                <span>LANE</span>
                <span>VEHICLES</span>
                <span className={selectedAlgo === "PRIORITY_AGING" ? "" : "opacity-40"}>PRIORITY</span>
              </div>
              {DIRECTIONS.map((d) => (
                <div key={d} className="grid grid-cols-[1fr_1fr_1fr] gap-2 items-center">
                  <span className="flex items-center gap-2 text-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${LANE_DOT[d]}`} />
                    {d}
                  </span>
                  <select
                    value={setup[d].count}
                    disabled={locked}
                    onChange={(e) => setLane(d, { count: Number(e.target.value) })}
                    className={selectCls}
                  >
                    {Array.from({ length: MAX_PER_LANE + 1 }, (_, n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <select
                    value={setup[d].priority}
                    disabled={locked || selectedAlgo !== "PRIORITY_AGING"}
                    onChange={(e) => setLane(d, { priority: Number(e.target.value) })}
                    className={selectCls}
                  >
                    {[1, 2, 3, 4, 5].map((p) => (
                      <option key={p} value={p}>
                        P{p}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Live injection */}
          <div>
            <label className="block text-[10px] text-ink-500 mb-2 uppercase">
              Inject a vehicle while running
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => injectVehicle(d)}
                  disabled={!snap.started || snap.queued[d] >= MAX_PER_LANE}
                  className="px-2 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 border border-navy-700 text-xs text-cyan-400 disabled:opacity-40"
                >
                  + {LANE_SHORT[d]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-navy-850 border border-navy-700/50">
              <span className="text-ink-500 block text-[10px]">GREEN SIGNAL</span>
              <span className="text-emerald-400 font-bold">
                {snap.active ?? (snap.clearing ? "CONTEXT SWITCH" : "—")}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-navy-850 border border-navy-700/50">
              <span className="text-ink-500 block text-[10px]">CONTEXT SWITCHES</span>
              <span className="text-purple-400 font-bold">{snap.contextSwitches}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Canvas */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-navy-900 border border-navy-700/60 flex flex-col justify-between">
          <div className="relative w-full h-80 bg-navy-950 rounded-xl border border-navy-800 overflow-hidden flex items-center justify-center">
            {/* Roads Layout */}
            <div className="absolute w-20 h-full bg-navy-850 border-x border-dashed border-navy-700"></div>
            <div className="absolute h-20 w-full bg-navy-850 border-y border-dashed border-navy-700"></div>

            {/* Signal Indicator Text */}
            <div className="absolute top-3 text-[11px] font-bold text-ink-300">
              N: {signalOf("NORTH")}
            </div>
            <div className="absolute bottom-3 text-[11px] font-bold text-ink-300">
              S: {signalOf("SOUTH")}
            </div>
            <div className="absolute left-3 text-[11px] font-bold text-ink-300">
              W: {signalOf("WEST")}
            </div>
            <div className="absolute right-3 text-[11px] font-bold text-ink-300">
              E: {signalOf("EAST")}
            </div>

            {/* Dynamic Moving Vehicle Dots */}
            {snap.cars.map((v) => (
              <div
                key={v.id}
                className={`absolute w-4 h-4 rounded-full ${LANE_DOT[v.lane]} shadow-lg transform -translate-x-1/2 -translate-y-1/2`}
                style={getVehicleStyle(v.lane, v.progress)}
              />
            ))}
          </div>

          {/* Queue Index Grid */}
          <div className="mt-4 p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-ink-500 font-bold block mb-2 uppercase">
              Circular Queue Traversal Array: (i + 1) MOD 4
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {DIRECTIONS.map((dir, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={dir}
                    className={`p-2 rounded-lg border transition-all ${
                      isActive
                        ? "bg-cyan-950/80 border-cyan-500 text-cyan-400 font-bold"
                        : "bg-navy-900 border-navy-800 text-ink-500"
                    }`}
                  >
                    <div className="text-[9px]">INDEX [{idx}]</div>
                    <div>{dir}</div>
                    <div className="text-[9px] mt-0.5">
                      {snap.queued[dir]} waiting
                      {selectedAlgo === "PRIORITY_AGING" &&
                        ` · P${effectivePriority(simRef.current, dir, aging)}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gantt timeline */}
          <div className="mt-4 p-3 rounded-xl bg-navy-950 border border-navy-800">
            <span className="text-[10px] text-ink-500 font-bold block mb-2 uppercase">
              Gantt Timeline (green slices)
            </span>
            {segs.length === 0 ? (
              <div className="text-[11px] text-ink-500">Press START to generate the schedule.</div>
            ) : (
              <div className="flex gap-0.5 h-8">
                {segs.map((s, i) => (
                  <div
                    key={i}
                    title={`${s.lane}: ${s.start.toFixed(1)}s → ${s.end.toFixed(1)}s`}
                    style={{ flexGrow: Math.max(s.end - s.start, 0.6), flexBasis: 0 }}
                    className={`${LANE_DOT[s.lane]} rounded-sm flex items-center justify-center text-[10px] font-bold text-navy-950 min-w-[18px]`}
                  >
                    {LANE_SHORT[s.lane]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {[
              { label: "AVG WAIT", value: `${snap.avgWait.toFixed(1)}s`, cls: "text-cyan-400" },
              { label: "AVG TURNAROUND", value: `${snap.avgTat.toFixed(1)}s`, cls: "text-emerald-400" },
              { label: "THROUGHPUT", value: `${snap.throughput.toFixed(1)}/min`, cls: "text-sky-400" },
              { label: "SERVED", value: `${snap.served}`, cls: "text-purple-400" },
              { label: "LONGEST LANE WAIT", value: `${snap.maxLaneWait.toFixed(1)}s`, cls: "text-rose-400" },
            ].map((m) => (
              <div key={m.label} className="p-2.5 rounded-xl bg-navy-850 border border-navy-700/50">
                <span className="text-ink-500 block text-[9px]">{m.label}</span>
                <span className={`${m.cls} font-bold`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficOSSimulator;