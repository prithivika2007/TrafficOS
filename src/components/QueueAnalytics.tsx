import React, { useState, useEffect } from "react";

interface LaneMetric {
  lane: string;
  count: number;
  avgWaitSec: number;
  maxWaitSec: number;
  priority: string;
  color: string;
}

export default function QueueAnalytics(): React.JSX.Element {
  const [throughput, setThroughput] = useState<number>(142);
  const [avgLatency, setAvgLatency] = useState<number>(12.4);
  const [efficiency, setEfficiency] = useState<number>(94.8);
  const [emergencyEvents, setEmergencyEvents] = useState<number>(3);

  const [laneMetrics, setLaneMetrics] = useState<LaneMetric[]>([
    { lane: "NORTH", count: 8, avgWaitSec: 14.2, maxWaitSec: 28.0, priority: "P1", color: "bg-red-500" },
    { lane: "EAST", count: 5, avgWaitSec: 8.5, maxWaitSec: 16.4, priority: "P2", color: "bg-blue-500" },
    { lane: "SOUTH", count: 11, avgWaitSec: 18.1, maxWaitSec: 34.5, priority: "P0", color: "bg-purple-500" },
    { lane: "WEST", count: 4, avgWaitSec: 6.2, maxWaitSec: 12.0, priority: "P3", color: "bg-amber-500" },
  ]);

  const [latencyHistory, setLatencyHistory] = useState<number[]>([14, 13.5, 12.8, 15.1, 13.0, 12.4]);

  // Live real-time metric updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLaneMetrics((prev) =>
        prev.map((m) => {
          const deltaCount = Math.floor(Math.random() * 3) - 1;
          const newCount = Math.max(1, m.count + deltaCount);
          const newAvg = parseFloat((m.avgWaitSec + (Math.random() * 1.2 - 0.6)).toFixed(1));
          return {
            ...m,
            count: newCount,
            avgWaitSec: Math.max(3.0, newAvg),
            maxWaitSec: parseFloat((newAvg * 1.8 + Math.random() * 2).toFixed(1)),
          };
        })
      );

      setThroughput((prev) => prev + (Math.random() > 0.5 ? 1 : 0));
      setAvgLatency((prev) => {
        const nextVal = parseFloat(Math.max(8.0, prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
        setLatencyHistory((h) => [...h.slice(1), nextVal]);
        return nextVal;
      });
      setEfficiency((prev) => parseFloat(Math.min(99.9, Math.max(85.0, prev + (Math.random() * 0.4 - 0.2))).toFixed(1)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalVehicles = laneMetrics.reduce((acc, m) => acc + m.count, 0);

  return (
    <div className="space-y-6 text-slate-100">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black tracking-wide text-white flex items-center gap-2">
            <span>🛺</span> Intersection Analytics & Queue Real-Time Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live process waiting time distribution, scheduling latency, and flow throughput.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-cyan-400 font-bold">SAMPLING INTERVAL: 2000ms</span>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#090e1a] border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Queue Load</div>
          <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
            {totalVehicles} <span className="text-xs font-normal text-slate-400">vehicles in wait-state</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-2 font-mono">⚡ 4 Active Traffic Lanes</div>
        </div>

        <div className="bg-[#090e1a] border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Scheduling Latency</div>
          <div className="text-2xl font-black text-cyan-400 mt-1 flex items-baseline gap-2">
            {avgLatency}s <span className="text-xs font-normal text-slate-400">per cycle</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono">↓ -1.2s vs Round-Robin Static</div>
        </div>

        <div className="bg-[#090e1a] border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Throughput</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-2">
            {throughput} <span className="text-xs font-normal text-slate-400">vehicles / hr</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono">↑ 98.2% Clearance Rate</div>
        </div>

        <div className="bg-[#090e1a] border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preemptions Triggered</div>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-baseline gap-2">
            {emergencyEvents} <span className="text-xs font-normal text-slate-400">Emergency Vehicles</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-2 font-mono">🚨 Priority Overrides Active</div>
        </div>
      </div>

      {/* LANE QUEUE DISTRIBUTION & LATENCY SPARKLINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LANE DISTRIBUTION (2 Cols) */}
        <div className="lg:col-span-2 bg-[#090e1a] border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Lane Queue Distribution & Wait Latency</span>
            <span className="text-xs font-mono text-slate-400 font-normal">Updated Live</span>
          </h3>

          <div className="space-y-4 pt-2">
            {laneMetrics.map((item) => {
              const percentage = Math.round((item.count / totalVehicles) * 100) || 0;
              return (
                <div key={item.lane} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                      {item.lane} LANE
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-semibold">
                        {item.priority}
                      </span>
                    </span>
                    <span className="text-slate-300">
                      <strong className="text-white">{item.count}</strong> vehicles ({percentage}%) | Avg:{" "}
                      <strong className="text-cyan-400">{item.avgWaitSec}s</strong> | Max:{" "}
                      <strong className="text-amber-400">{item.maxWaitSec}s</strong>
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                    <div
                      className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LATENCY TICKER & SCHEDULER HEALTH */}
        <div className="bg-[#090e1a] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Scheduling Latency History
            </h3>
            <p className="text-xs text-slate-400 mt-1">Last 6 Sampling Quantum Ticks</p>

            <div className="mt-6 flex items-end justify-between h-32 gap-2 border-b border-slate-800 pb-2">
              {latencyHistory.map((val, idx) => {
                const heightPercent = Math.min(100, Math.max(15, (val / 20) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-cyan-300">{val}s</span>
                    <div className="w-full bg-slate-800 rounded-t-md overflow-hidden h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-500 rounded-t-md"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">T-{5 - idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="text-slate-400">Quantum Efficiency</div>
              <div className="text-emerald-400 font-bold text-base mt-0.5">{efficiency}%</div>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400">
              <div>STARVATION: <span className="text-emerald-400 font-bold">0%</span></div>
              <div>DEADLOCK: <span className="text-emerald-400 font-bold">NONE</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}