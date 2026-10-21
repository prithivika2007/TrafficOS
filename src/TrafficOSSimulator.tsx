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
  presetSetup,
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
  NORTH: "bg-rose-500 shadow-lg shadow-rose-500/50",
  EAST: "bg-blue-500 shadow-lg shadow-blue-500/50",
  SOUTH: "bg-purple-500 shadow-lg shadow-purple-500/50",
  WEST: "bg-amber-500 shadow-lg shadow-amber-500/50",
};
const LANE_COLOR: Record<Direction, string> = {
  NORTH: "#f43f5e",
  EAST: "#3b82f6",
  SOUTH: "#a855f7",
  WEST: "#f59e0b",
};
const LANE_SHORT: Record<Direction, string> = { NORTH: "N", EAST: "E", SOUTH: "S", WEST: "W" };
const CAR_ROTATION: Record<Direction, number> = {
  NORTH: 180,
  EAST: -90,
  SOUTH: 0,
  WEST: 90,
};

const ALGO_LABEL: Record<Algo, string> = {
  RR: "Round Robin (RR)",
  PRIORITY_AGING: "Priority + Aging",
};

const ALGO_HINT: Record<Algo, string> = {
  RR: "Every lane gets one time quantum of green in circular order, then preemptively rotates.",
  PRIORITY_AGING: `Prioritizes critical lanes. Waiting queues gain priority weight every ${AGING_STEP}s to eliminate starvation.`,
};

const isAlgo = (a?: string): a is Algo =>
  a === "RR" || a === "PRIORITY_AGING";

type Phase = "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED";

const STATIC_TIMER_QUANTUM = 5;

interface BenchmarkSnapshots {
  staticTimers: Snapshot;
}

interface FinalAnalysisReport {
  algorithm: Algo;
  elapsed: number;
  normalWait: number;
  algorithmWait: number;
  waitReduction: number;
  normalThroughput: number;
  algorithmThroughput: number;
  throughputChange: number;
  vehiclesServed: number;
  contextSwitches: number;
  hasWaitSamples: boolean;
}

const createStaticBaseline = (setup: Setup): Sim => createSim(setup, "RR");

const snapshotStaticBaseline = (baseline: Sim): BenchmarkSnapshots => ({
  staticTimers: snapshot(baseline),
});

const createFinalAnalysisReport = (
  algorithm: Algo,
  elapsed: number,
  baseline: Snapshot,
  activeRun: Snapshot
): FinalAnalysisReport => {
  const selected = activeRun;
  const hasWaitSamples = baseline.served > 0 && selected.served > 0;
  const waitReduction =
    hasWaitSamples && baseline.avgWait > 0
      ? ((baseline.avgWait - selected.avgWait) / baseline.avgWait) * 100
      : 0;
  const throughputChange =
    baseline.throughput > 0
      ? ((selected.throughput - baseline.throughput) / baseline.throughput) * 100
      : 0;

  return {
    algorithm,
    elapsed,
    normalWait: baseline.avgWait,
    algorithmWait: selected.avgWait,
    waitReduction,
    normalThroughput: baseline.throughput,
    algorithmThroughput: selected.throughput,
    throughputChange,
    vehiclesServed: selected.served,
    contextSwitches: selected.contextSwitches,
    hasWaitSamples,
  };
};

export const TrafficOSSimulator: React.FC<TrafficOSSimulatorProps> = ({
  initialAlgoConfig,
}) => {
  const initialAlgo: Algo = isAlgo(initialAlgoConfig?.algo)
    ? initialAlgoConfig.algo
    : "RR";

  const [selectedAlgo, setSelectedAlgo] = useState<Algo>(initialAlgo);
  const [timeQuantum, setTimeQuantum] = useState<number>(initialAlgoConfig?.quantum || 3);
  const [aging, setAging] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [setup, setSetup] = useState<Setup>(() => presetSetup(initialAlgo));
  const [emergencyLane, setEmergencyLane] = useState<Direction | null>(null);

  const simRef = useRef<Sim>(createSim(setup, selectedAlgo, emergencyLane));
  const staticBaselineRef = useRef<Sim>(createStaticBaseline(setup));
  const [snap, setSnap] = useState<Snapshot>(() => snapshot(simRef.current));
  const [benchmarkSnapshots, setBenchmarkSnapshots] = useState<BenchmarkSnapshots>(
    () => snapshotStaticBaseline(staticBaselineRef.current)
  );
  const [finalReport, setFinalReport] = useState<FinalAnalysisReport | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  const cfgRef = useRef({ algo: selectedAlgo, quantum: timeQuantum, aging, speed });
  cfgRef.current = { algo: selectedAlgo, quantum: timeQuantum, aging, speed };

  useEffect(() => {
    if (isAlgo(initialAlgoConfig?.algo)) {
      const nextAlgo = initialAlgoConfig.algo;
      if (nextAlgo !== selectedAlgo) {
        setSelectedAlgo(nextAlgo);
        setSetup(presetSetup(nextAlgo));
        setEmergencyLane(null);
      }
    }
    if (initialAlgoConfig?.quantum) setTimeQuantum(initialAlgoConfig.quantum);
  }, [initialAlgoConfig]);

  useEffect(() => {
    if (simRef.current.started) return;
    simRef.current = createSim(
      setup,
      selectedAlgo,
      selectedAlgo === "PRIORITY_AGING" ? emergencyLane : null
    );
    staticBaselineRef.current = createStaticBaseline(setup);
    setSnap(snapshot(simRef.current));
    setBenchmarkSnapshots(snapshotStaticBaseline(staticBaselineRef.current));
  }, [setup, selectedAlgo, emergencyLane]);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    let frameId = 0;

    const loop = (now: number) => {
      const c = cfgRef.current;
      const dt = Math.min((now - last) / 1000, 0.1) * c.speed;
      last = now;
      step(simRef.current, dt, c.algo, c.quantum, c.aging);
      step(staticBaselineRef.current, dt, "RR", STATIC_TIMER_QUANTUM, false);
      const nextSnap = snapshot(simRef.current);
      const nextBenchmarkSnapshots = snapshotStaticBaseline(staticBaselineRef.current);
      setSnap(nextSnap);
      setBenchmarkSnapshots(nextBenchmarkSnapshots);
      if (simRef.current.finished) {
        setFinalReport(
          createFinalAnalysisReport(
            c.algo,
            nextSnap.clock,
            nextBenchmarkSnapshots.staticTimers,
            nextSnap
          )
        );
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

  const totalVehicles =
    DIRECTIONS.reduce((n, d) => n + setup[d].count, 0) +
    (selectedAlgo === "PRIORITY_AGING" && emergencyLane ? 1 : 0);
  const reset = () => {
    setRunning(false);
    const nextSetup = presetSetup(selectedAlgo);
    setEmergencyLane(null);
    setSetup(nextSetup);
    simRef.current = createSim(nextSetup, selectedAlgo);
    staticBaselineRef.current = createStaticBaseline(nextSetup);
    setSnap(snapshot(simRef.current));
    setBenchmarkSnapshots(snapshotStaticBaseline(staticBaselineRef.current));
    setFinalReport(null);
  };

  const startPause = () => {
    if (phase === "RUNNING") {
      const pausedSnap = snapshot(simRef.current);
      const pausedBaseline = snapshotStaticBaseline(staticBaselineRef.current);
      setSnap(pausedSnap);
      setBenchmarkSnapshots(pausedBaseline);
      setFinalReport(
        createFinalAnalysisReport(
          selectedAlgo,
          pausedSnap.clock,
          pausedBaseline.staticTimers,
          pausedSnap
        )
      );
      setRunning(false);
    } else if (phase === "COMPLETED") {
      simRef.current = createSim(
        setup,
        selectedAlgo,
        selectedAlgo === "PRIORITY_AGING" ? emergencyLane : null
      );
      staticBaselineRef.current = createStaticBaseline(setup);
      setSnap(snapshot(simRef.current));
      setBenchmarkSnapshots(snapshotStaticBaseline(staticBaselineRef.current));
      setFinalReport(null);
      setRunning(true);
    } else if (totalVehicles > 0 || simRef.current.cars.length > 0) {
      setFinalReport(null);
      setRunning(true);
    }
  };

  const stepTick = () => {
    if (phase === "COMPLETED") return;
    const c = cfgRef.current;
    step(simRef.current, 1, c.algo, c.quantum, c.aging);
    step(staticBaselineRef.current, 1, "RR", STATIC_TIMER_QUANTUM, false);
    const nextSnap = snapshot(simRef.current);
    const nextBenchmarkSnapshots = snapshotStaticBaseline(staticBaselineRef.current);
    setSnap(nextSnap);
    setBenchmarkSnapshots(nextBenchmarkSnapshots);
    if (finalReport || simRef.current.finished) {
      setFinalReport(
        createFinalAnalysisReport(
          c.algo,
          nextSnap.clock,
          nextBenchmarkSnapshots.staticTimers,
          nextSnap
        )
      );
    }

  };

  const injectVehicle = (lane: Direction) => {
    if (addVehicle(simRef.current, lane)) {
      addVehicle(staticBaselineRef.current, lane);
      setSnap(snapshot(simRef.current));
      setBenchmarkSnapshots(snapshotStaticBaseline(staticBaselineRef.current));
    }
  };

  const injectAmbulance = () => {
    const lane = emergencyLane ?? "SOUTH";
    if (addVehicle(simRef.current, lane, true)) {
      addVehicle(staticBaselineRef.current, lane);
      setSnap(snapshot(simRef.current));
      setBenchmarkSnapshots(snapshotStaticBaseline(staticBaselineRef.current));
    }
  };

  const setLane = (lane: Direction, patch: Partial<Setup[Direction]>) =>
    setSetup((prev) => ({ ...prev, [lane]: { ...prev[lane], ...patch } }));

  const getVehicleStyle = (lane: Direction, progress: number) => {
    switch (lane) {
      case "NORTH":
        return { top: `${progress}%`, left: "48%" };
      case "SOUTH":
        return { bottom: `${progress}%`, left: "52%" };
      case "EAST":
        return { right: `${progress}%`, top: "48%" };
      case "WEST":
        return { left: `${progress}%`, top: "52%" };
    }
  };

  const handleAlgoChange = (algo: Algo) => {
    setSelectedAlgo(algo);
    setSetup(presetSetup(algo));
    setEmergencyLane(null);
  };

  const hasAmbulance = (lane: Direction) =>
    snap.cars.some((car) => car.emergency && car.lane === lane);

  const signalOf = (lane: Direction) => {
    if (snap.emergencyState !== "IDLE") {
      return snap.emergencyState === "ACTIVE" && snap.active === lane
        ? "🟢 GREEN"
        : "🔴 RED";
    }
    if (snap.active === lane) return "🟢 GREEN";
    if (snap.clearing && snap.lastLane === lane) return "🟡 YELLOW";
    return "🔴 RED";
  };

  const activeIdx = snap.active ? DIRECTIONS.indexOf(snap.active) : -1;
  const preemptive = selectedAlgo === "RR" || selectedAlgo === "PRIORITY_AGING";
  const locked = snap.started;

  const segs = snap.segments
    .map((s) => ({ ...s, end: s.end ?? snap.clock }))
    .filter((s) => s.end - s.start > 0.01)
    .slice(-14);

  const staticWait = benchmarkSnapshots.staticTimers.avgWait;
  const selectedWait = snap.avgWait;
  const comparisonReady =
    benchmarkSnapshots.staticTimers.served > 0 &&
    snap.served > 0;
  const delaySavings = comparisonReady ? staticWait - selectedWait : 0;
  const efficiencyGain =
    comparisonReady && staticWait > 0 ? (delaySavings / staticWait) * 100 : 0;

  const benchmarkRows = [
    {
      label: "Static Timers",
      detail: `Usual traffic · fixed ${STATIC_TIMER_QUANTUM}s cycle`,
      metrics: benchmarkSnapshots.staticTimers,
      value: staticWait,
      barClass: "from-slate-500 to-slate-400",
      valueClass: "text-slate-300",
    },
    {
      label: selectedAlgo === "RR" ? "Round Robin" : "Priority + Aging",
      detail:
        selectedAlgo === "RR"
          ? `Active scheduler · ${timeQuantum}s cyclic quantum`
          : `Active scheduler · dynamic aging ${aging ? "on" : "off"}`,
      metrics: snap,
      value: selectedWait,
      barClass:
        selectedAlgo === "RR"
          ? "from-amber-600 to-amber-400"
          : "from-emerald-700 to-emerald-500",
      valueClass: selectedAlgo === "RR" ? "text-amber-300" : "text-emerald-300",
    },
  ];
  const benchmarkScale = Math.max(...benchmarkRows.map((row) => row.value), 0.1);

  const selectCls =
    "w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all disabled:opacity-40";

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-7xl mx-auto p-2">
      {/* Top Header Control Bar */}
      <div className="traffic-surface flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={startPause}
            disabled={phase === "IDLE" && totalVehicles === 0}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-lg disabled:opacity-40 flex items-center gap-2 ${
              phase === "RUNNING"
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
                : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20"
            }`}
          >
            {phase === "RUNNING" && <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />}
            {phase === "RUNNING"
              ? "PAUSE KERNEL"
              : phase === "PAUSED"
              ? "RESUME KERNEL"
              : phase === "COMPLETED"
              ? "RESTART KERNEL"
              : "START KERNEL"}
          </button>

          <button
            onClick={stepTick}
            disabled={phase === "RUNNING" || phase === "COMPLETED" || totalVehicles === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-all disabled:opacity-40"
          >
            STEP TICK
          </button>

          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-xs font-semibold text-slate-300 border border-slate-700 transition-all hover:border-slate-500"
          >
            RESET
          </button>
        </div>

        <div className="traffic-surface flex items-center gap-6 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800/80">
          <div className="text-xs">
            <span className="text-slate-500 mr-2">CLOCK:</span>
            <span className="text-amber-300 font-bold">{snap.clock.toFixed(1)}s</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">STATE:</span>
            <span
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold tracking-wide ${
                phase === "RUNNING"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : phase === "COMPLETED"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {phase}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="traffic-surface lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Scheduler Parameters
            </h3>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">Active Algorithm</label>
            <select
              value={selectedAlgo}
              disabled={locked}
              onChange={(e) => handleAlgoChange(e.target.value as Algo)}
              className={selectCls}
            >
              {(Object.keys(ALGO_LABEL) as Algo[]).map((a) => (
                <option key={a} value={a}>
                  {ALGO_LABEL[a]}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
              {ALGO_HINT[selectedAlgo]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1.5 font-medium">TIME QUANTUM</label>
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
              <label className="block text-[10px] text-slate-400 mb-1.5 font-medium">SIM SPEED</label>
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
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                aging
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${aging ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
              DYNAMIC AGING: {aging ? "ACTIVE" : "OFF"}
            </button>
          )}

          {/* Lane Workload Config */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <label className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              Lane Workload {locked && "(Locked — Reset to edit)"}
            </label>
            <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 text-[10px] text-slate-500 px-1 font-semibold">
              <span>LANE</span>
              <span>VEHICLES</span>
              <span className={selectedAlgo === "PRIORITY_AGING" ? "" : "opacity-30"}>PRIORITY</span>
            </div>
            <div className="space-y-1.5">
              {DIRECTIONS.map((d) => (
                <div key={d} className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 items-center bg-slate-950/40 p-1.5 rounded-xl border border-slate-800/50">
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
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
                    disabled={locked}
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

          {selectedAlgo === "PRIORITY_AGING" && (
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Emergency Vehicle Lane
              </label>
              <select
                value={emergencyLane ?? "NONE"}
                onChange={(e) =>
                  setEmergencyLane(e.target.value === "NONE" ? null : (e.target.value as Direction))
                }
                className={selectCls}
              >
                <option value="NONE">None</option>
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d[0] + d.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Live Injection Actions */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-[10px] text-slate-400 mb-2 uppercase font-semibold tracking-wider">
              Live Injection Controls
            </label>
            <div className={`grid ${selectedAlgo === "PRIORITY_AGING" ? "grid-cols-5" : "grid-cols-4"} gap-2`}>
              {DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => injectVehicle(d)}
                  disabled={!running || snap.queued[d] >= MAX_PER_LANE}
                  className="px-2 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-emerald-500/30 text-xs font-bold text-emerald-300 transition-all disabled:opacity-30 shadow-sm"
                  title={`Add vehicle to ${d}`}
                >
                  + {LANE_SHORT[d]}
                </button>
              ))}
              {selectedAlgo === "PRIORITY_AGING" && (
                <button
                  onClick={injectAmbulance}
                  disabled={!running}
                  className="px-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-[11px] font-bold text-rose-300 transition-all disabled:opacity-30 col-span-5 flex items-center justify-center gap-1.5"
                >
                  <span>🚑</span> TRIGGER EMERGENCY AMBULANCE PREEMPTION
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80">
            <div className="traffic-surface p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-semibold">GREEN SIGNAL</span>
              <span className="text-emerald-400 font-bold tracking-wide">
                {snap.active ?? (snap.clearing ? "SWITCHING" : "—")}
              </span>
            </div>
            <div className="traffic-surface p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[10px] font-semibold">CONTEXT SWITCHES</span>
              <span className="text-amber-300 font-bold tracking-wide">{snap.contextSwitches}</span>
            </div>
          </div>
        </div>

        {/* Right Canvas and Analytics Panel */}
        <div className="traffic-surface lg:col-span-8 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 flex flex-col justify-between shadow-xl">
          {/* Intersection Canvas */}
          <div className="traffic-road relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Roads */}
            <div className="absolute w-24 h-full bg-slate-900/90 border-x border-dashed border-slate-700/50 flex justify-center">
              <div className="absolute w-0.5 h-full bg-amber-400/20" />
            </div>
            <div className="absolute h-24 w-full bg-slate-900/90 border-y border-dashed border-slate-700/50 flex items-center">
              <div className="absolute w-full h-0.5 bg-amber-400/20" />
            </div>

            {/* Signal Labels */}
            <div className="absolute top-3 left-4 text-[11px] font-bold tracking-wide text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              NORTH: {signalOf("NORTH")} {hasAmbulance("NORTH") && <span className="text-rose-400 animate-pulse font-extrabold">🚨 EMERGENCY</span>}
            </div>
            <div className="absolute bottom-3 left-4 text-[11px] font-bold tracking-wide text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              SOUTH: {signalOf("SOUTH")} {hasAmbulance("SOUTH") && <span className="text-rose-400 animate-pulse font-extrabold">🚨 EMERGENCY</span>}
            </div>
            <div className="absolute left-3 top-16 text-[11px] font-bold tracking-wide text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              WEST: {signalOf("WEST")} {hasAmbulance("WEST") && <span className="text-rose-400 animate-pulse font-extrabold">🚨 EMERGENCY</span>}
            </div>
            <div className="absolute right-3 top-16 text-[11px] font-bold tracking-wide text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              EAST: {signalOf("EAST")} {hasAmbulance("EAST") && <span className="text-rose-400 animate-pulse font-extrabold">🚨 EMERGENCY</span>}
            </div>

            {/* Moving Vehicles */}
            {snap.cars.map((v) => (
              <div
                key={v.id}
                className="absolute w-4 h-6 transition-[top,left,right,bottom] duration-[17ms] ease-linear [backface-visibility:hidden]"
                style={{
                  ...getVehicleStyle(v.lane, v.progress),
                  transform: "translate(-50%, -50%)",
                }}
              >
                {v.emergency ? (
                  <div
                    aria-label="Ambulance"
                    className="relative flex h-full w-full items-center justify-center text-lg drop-shadow-lg"
                    style={{ transform: `rotate(${CAR_ROTATION[v.lane]}deg)` }}
                  >
                    🚑
                    <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-rose-500 animate-ping" />
                    <span className="absolute left-1/2 top-0 h-1.5 w-1.5 translate-x-1 rounded-full bg-blue-500 animate-ping" />
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 20 30"
                    aria-hidden="true"
                    className="w-full h-full drop-shadow-md"
                    style={{ transform: `rotate(${CAR_ROTATION[v.lane]}deg)` }}
                  >
                    <path
                      d="M6 1.5h8l3 5v17l-3 5H6l-3-5v-17l3-5Z"
                      fill={LANE_COLOR[v.lane]}
                      stroke="#0f172a"
                      strokeWidth="1.2"
                    />
                    <path d="M5 8h10v7H5z" fill="#f8fafc" opacity="0.9" />
                    <path d="M5 18h10v3H5z" fill="#0f172a" opacity="0.8" />
                    <path d="M7 3.5h6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Circular Queue Traversal Grid */}
          <div className="traffic-surface mt-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block mb-2.5 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Circular Queue Traversal Array: (i + 1) MOD 4
            </span>
            <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
              {DIRECTIONS.map((dir, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <div
                    key={dir}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="text-[9px] opacity-70">INDEX [{idx}]</div>
                    <div className="font-semibold">{dir}</div>
                    <div className="text-[10px] mt-0.5 text-slate-300">
                      {snap.queued[dir]} waiting
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gantt Timeline */}
          <div className="traffic-surface mt-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block mb-2.5 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Scheduler Gantt Timeline (Green Slices)
            </span>
            {segs.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-2">Press START KERNEL to generate scheduling execution trace...</div>
            ) : (
              <div className="flex gap-1 h-9 items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                {segs.map((s, i) => (
                  <div
                    key={i}
                    title={`${s.lane}: ${s.start.toFixed(1)}s → ${s.end.toFixed(1)}s`}
                    style={{ flexGrow: Math.max(s.end - s.start, 0.8), flexBasis: 0 }}
                    className={`${s.emergency ? "bg-rose-500 text-white ring-2 ring-white/80 animate-pulse font-black" : `${LANE_DOT[s.lane]} text-slate-950`} rounded-lg flex items-center justify-center text-[10px] font-bold min-w-[22px] shadow-sm`}
                  >
                    {LANE_SHORT[s.lane]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Performance Metrics */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
            {[
              { label: "AVG WAIT", value: `${snap.avgWait.toFixed(1)}s`, cls: "text-emerald-400" },
              { label: "AVG TURNAROUND", value: `${snap.avgTat.toFixed(1)}s`, cls: "text-emerald-400" },
              { label: "THROUGHPUT", value: `${snap.throughput.toFixed(1)}/min`, cls: "text-emerald-300" },
              { label: "SERVED", value: `${snap.served}`, cls: "text-amber-300" },
              { label: "LONGEST WAIT", value: `${snap.maxLaneWait.toFixed(1)}s`, cls: "text-rose-400" },
            ].map((m) => (
              <div key={m.label} className="traffic-surface p-3 rounded-2xl bg-slate-950/60 border border-slate-800 shadow-sm">
                <span className="text-slate-500 block text-[9px] font-semibold mb-1">{m.label}</span>
                <span className={`${m.cls} font-black text-sm tracking-tight`}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Comparative Efficiency Benchmark */}
          <section
            aria-labelledby="efficiency-benchmark-title"
            className="mt-5 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-5 sm:p-7 shadow-[0_16px_45px_rgba(0,0,0,0.32)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-700 pb-4">
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
                  Performance study · live scenario
                </p>
                <h3
                  id="efficiency-benchmark-title"
                  className="text-xl font-black tracking-wide text-white sm:text-2xl"
                >
                  Comparative Efficiency Benchmark
                </h3>
                <p className="mt-1 text-base leading-relaxed text-slate-300">
                  Live average wait from the selected scheduler against the static-timer baseline.
                </p>
              </div>
              <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm font-bold uppercase tracking-wider text-amber-300">
                {phase === "RUNNING" ? "LIVE TELEMETRY" : phase === "PAUSED" ? "RUN PAUSED" : phase === "COMPLETED" ? "RUN COMPLETE" : "READY"} · {snap.clock.toFixed(1)}s
              </span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
              <div className="space-y-4" aria-label="Average wait time comparisons">
                {benchmarkRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-1.5 flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <p className="text-base font-bold text-slate-100">{row.label}</p>
                        <p className="text-sm text-slate-400">{row.detail}</p>
                      </div>
                      <p className={`font-mono text-base font-bold tabular-nums ${row.valueClass}`}>
                        {row.value.toFixed(2)}
                        <span className="ml-1 text-sm font-bold text-slate-300">sec/car</span>
                      </p>
                    </div>
                    <div
                      className="h-4 overflow-hidden rounded-full border border-slate-700 bg-slate-800"
                      role="progressbar"
                      aria-label={`${row.label} average wait`}
                      aria-valuemin={0}
                      aria-valuemax={benchmarkScale}
                      aria-valuenow={row.value}
                    >
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${row.barClass} transition-[width] duration-300 ease-out`}
                        style={{ width: `${(row.value / benchmarkScale) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm text-slate-400">
                      <span>{row.metrics.served} served</span>
                      <span>{row.metrics.throughput.toFixed(1)} cars/min</span>
                      <span>{row.metrics.contextSwitches} context switches</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 shadow-inner">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
                  Delay saved per car
                </p>
                <p className="mt-1 font-mono text-4xl font-black tracking-tight text-amber-300 tabular-nums">
                  {delaySavings >= 0 ? "+" : ""}
                  {delaySavings.toFixed(2)}
                  <span className="ml-1.5 text-base font-bold text-amber-200">sec</span>
                </p>
                <div className="my-3 h-px bg-gradient-to-r from-amber-400/70 to-transparent" />
                <p className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Efficiency gain
                </p>
                <p className="mt-1 font-mono text-2xl font-black text-white tabular-nums">
                  {efficiencyGain.toFixed(1)}%
                </p>
                <p className="mt-2 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 font-mono text-sm leading-relaxed text-slate-200">
                  {comparisonReady && staticWait > 0
                    ? `(${staticWait.toFixed(2)}s − ${selectedWait.toFixed(2)}s) ÷ ${staticWait.toFixed(2)}s × 100`
                    : "Awaiting completed vehicles to establish a stable comparison."}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Positive savings means less waiting than the static-timer baseline. Static cycle:{" "}
                  {STATIC_TIMER_QUANTUM}s.
                </p>
              </div>
            </div>
          </section>

          {finalReport && (
            <section
              aria-labelledby="final-analysis-title"
              className="mt-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-amber-950/20 p-5 sm:p-7 shadow-[0_18px_48px_rgba(0,0,0,0.32)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                    {phase === "COMPLETED" ? "Completed run" : "Frozen run snapshot"} · {finalReport.elapsed.toFixed(1)} simulated seconds
                  </p>
                  <h3 id="final-analysis-title" className="mt-1 text-2xl font-black text-white sm:text-3xl">
                    Final Traffic Efficiency Analysis
                  </h3>
                </div>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-base font-black text-emerald-300">
                  {finalReport.algorithm === "RR" ? "ROUND ROBIN" : "PRIORITY + AGING"}
                </span>
              </div>

              {finalReport.hasWaitSamples ? (
                <p className="mt-5 text-lg leading-relaxed text-slate-200">
                  Under normal/static traffic, average wait times reached{" "}
                  <strong className="font-black text-white">
                    {finalReport.normalWait.toFixed(2)} seconds
                  </strong>{" "}
                  due to gridlock. However, using{" "}
                  <strong className="font-black text-emerald-300">
                    {finalReport.algorithm === "RR" ? "Round Robin" : "Priority + Aging"}
                  </strong>
                  , wait times were{" "}
                  <strong className="font-black text-emerald-300">
                    {finalReport.waitReduction >= 0
                      ? `reduced by ${finalReport.waitReduction.toFixed(1)}%`
                      : `increased by ${Math.abs(finalReport.waitReduction).toFixed(1)}%`}
                  </strong>
                  ,{" "}
                  {finalReport.throughputChange >= 0
                    ? `boosting throughput by ${finalReport.throughputChange.toFixed(1)}%`
                    : `with throughput ${Math.abs(finalReport.throughputChange).toFixed(1)}% below the static baseline`}
                  . The scheduler guarantees fair lane service, eliminating lane starvation.
                </p>
              ) : (
                <p className="mt-5 text-lg leading-relaxed text-slate-300">
                  This run was paused before vehicles completed service, so average wait and throughput comparisons are not yet statistically available. Resume the kernel to gather more telemetry; the report will freeze again when the run is paused or completed.
                </p>
              )}

              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: "Static avg wait", value: `${finalReport.normalWait.toFixed(2)}s` },
                  { label: "Selected avg wait", value: `${finalReport.algorithmWait.toFixed(2)}s` },
                  { label: "Wait reduction", value: `${finalReport.waitReduction.toFixed(1)}%` },
                  { label: "Static throughput", value: `${finalReport.normalThroughput.toFixed(1)}/min` },
                  { label: "Selected throughput", value: `${finalReport.algorithmThroughput.toFixed(1)}/min` },
                  { label: "Vehicles served", value: `${finalReport.vehiclesServed}` },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-slate-700 bg-slate-800/80 p-4 shadow-sm">
                    <dt className="text-sm font-bold text-slate-300">{metric.label}</dt>
                    <dd className="mt-1 font-mono text-xl font-black text-white">{metric.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm font-bold text-slate-400">
                Selected scheduler context switches: {finalReport.contextSwitches}. Baseline values use the same lane setup and a fixed {STATIC_TIMER_QUANTUM}-second static cycle.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrafficOSSimulator;