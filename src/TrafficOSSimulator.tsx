import React, { useState, useEffect, useRef } from "react";

type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";
type SimulationState = "RUNNING" | "PAUSED";

interface Vehicle {
  id: string;
  direction: Direction;
  progress: number; // 0% (spawn) -> 40% (stop line) -> 100% (passed through)
  color: string;
}

interface TrafficOSSimulatorProps {
  initialAlgoConfig?: {
    algo?: string;
    quantum?: number;
  } | null;
}

const DIRECTIONS: Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];

export const TrafficOSSimulator: React.FC<TrafficOSSimulatorProps> = ({
  initialAlgoConfig,
}) => {
  const [simState, setSimState] = useState<SimulationState>("RUNNING");
  const [activeLaneIndex, setActiveLaneIndex] = useState<number>(0);
  const [selectedAlgo, setSelectedAlgo] = useState<string>(
    initialAlgoConfig?.algo || "RR"
  );
  const [timeQuantum, setTimeQuantum] = useState<number>(
    initialAlgoConfig?.quantum || 3
  );

  // Dynamic Vehicle Coordinates State
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: "v-north", direction: "NORTH", progress: 10, color: "bg-red-500" },
    { id: "v-east", direction: "EAST", progress: 10, color: "bg-blue-500" },
    { id: "v-south", direction: "SOUTH", progress: 10, color: "bg-purple-500" },
    { id: "v-west", direction: "WEST", progress: 10, color: "bg-amber-500" },
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if App.tsx updates initialAlgoConfig
  useEffect(() => {
    if (initialAlgoConfig?.algo) {
      setSelectedAlgo(initialAlgoConfig.algo);
    }
    if (initialAlgoConfig?.quantum) {
      setTimeQuantum(initialAlgoConfig.quantum);
    }
  }, [initialAlgoConfig]);

  // Main simulation step tick
  const stepTick = () => {
    const activeDirection = DIRECTIONS[activeLaneIndex];

    setVehicles((prevVehicles) =>
      prevVehicles.map((v) => {
        // Vehicle in active green light direction moves through intersection
        if (v.direction === activeDirection) {
          const nextProgress = v.progress + 15;
          if (nextProgress > 100) {
            return { ...v, progress: 0 }; // Respawn back at start line
          }
          return { ...v, progress: nextProgress };
        }

        // Vehicles waiting at red lights creep up and stop at 40% (stop line)
        if (v.progress < 40) {
          return { ...v, progress: Math.min(40, v.progress + 5) };
        }

        return v;
      })
    );

    // Switch traffic light turn
    setActiveLaneIndex((prev) => (prev + 1) % DIRECTIONS.length);
  };

  // Run simulation interval
  useEffect(() => {
    if (simState === "RUNNING") {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(stepTick, 800);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simState, activeLaneIndex]);

  // Map progress % to absolute 2D visual layout
  const getVehicleStyle = (v: Vehicle) => {
    switch (v.direction) {
      case "NORTH": // Drive down (+Y)
        return { top: `${v.progress}%`, left: "48%" };
      case "SOUTH": // Drive up (-Y)
        return { bottom: `${v.progress}%`, left: "52%" };
      case "EAST": // Drive left (-X)
        return { right: `${v.progress}%`, top: "48%" };
      case "WEST": // Drive right (+X)
        return { left: `${v.progress}%`, top: "52%" };
    }
  };

  const activeDirection = DIRECTIONS[activeLaneIndex];

  return (
    <div className="space-y-6 font-mono text-slate-100">
      {/* Top Simulator Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-panel">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setSimState((prev) => (prev === "RUNNING" ? "PAUSED" : "RUNNING"))
            }
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              simState === "RUNNING"
                ? "bg-amber-500 hover:bg-amber-400 text-navy-950 shadow-glow-amber"
                : "bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-glow-green"
            }`}
          >
            {simState === "RUNNING" ? "PAUSE SIMULATION" : "RESUME SIMULATION"}
          </button>

          <button
            onClick={stepTick}
            className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-xs font-semibold text-cyan-400 border border-cyan-500/30"
          >
            STEP TICK
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-500">STATE:</span>
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              simState === "RUNNING"
                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                : "bg-navy-800 text-ink-400 border border-navy-700"
            }`}
          >
            {simState}
          </span>
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
            <label className="block text-xs text-ink-400 mb-1">
              Active Algorithm
            </label>
            <select
              value={selectedAlgo}
              onChange={(e) => setSelectedAlgo(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="RR">Round Robin (RR)</option>
              <option value="PRIORITY_AGING">Priority + Aging</option>
              <option value="SJF">Shortest Job First (SJF)</option>
              <option value="FCFS">First-Come First-Served</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-navy-850 border border-navy-700/50">
              <span className="text-ink-500 block text-[10px]">TIME QUANTUM</span>
              <span className="text-cyan-400 font-bold">{timeQuantum}s</span>
            </div>
            <div className="p-3 rounded-xl bg-navy-850 border border-navy-700/50">
              <span className="text-ink-500 block text-[10px]">GREEN SIGNAL</span>
              <span className="text-emerald-400 font-bold">{activeDirection}</span>
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
              N: {activeDirection === "NORTH" ? "🟢 GREEN" : "🔴 RED"}
            </div>
            <div className="absolute bottom-3 text-[11px] font-bold text-ink-300">
              S: {activeDirection === "SOUTH" ? "🟢 GREEN" : "🔴 RED"}
            </div>
            <div className="absolute left-3 text-[11px] font-bold text-ink-300">
              W: {activeDirection === "WEST" ? "🟢 GREEN" : "🔴 RED"}
            </div>
            <div className="absolute right-3 text-[11px] font-bold text-ink-300">
              E: {activeDirection === "EAST" ? "🟢 GREEN" : "🔴 RED"}
            </div>

            {/* Dynamic Moving Vehicle Dots */}
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`absolute w-4 h-4 rounded-full ${v.color} shadow-lg transition-all duration-500 ease-linear transform -translate-x-1/2 -translate-y-1/2`}
                style={getVehicleStyle(v)}
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
                const isActive = idx === activeLaneIndex;
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficOSSimulator;