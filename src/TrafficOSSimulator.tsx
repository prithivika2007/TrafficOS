import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Cpu } from 'lucide-react';

interface Vehicle {
  id: string;
  type: 'car' | 'bus' | 'emergency';
  lane: 'North' | 'East' | 'South' | 'West';
  burstTime: number;
  priority: number;
  waitingTime: number;
}

export default function TrafficOSSimulator() {
  const [algorithm, setAlgorithm] = useState<'RoundRobin' | 'Priority'>('RoundRobin');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeLane, setActiveLane] = useState<'North' | 'East' | 'South' | 'West'>('North');
  const [timeSlice, setTimeSlice] = useState<number>(3);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'V1', type: 'car', lane: 'North', burstTime: 5, priority: 2, waitingTime: 0 },
    { id: 'V2', type: 'bus', lane: 'East', burstTime: 8, priority: 3, waitingTime: 0 },
    { id: 'V3', type: 'emergency', lane: 'South', burstTime: 3, priority: 1, waitingTime: 0 },
    { id: 'V4', type: 'car', lane: 'West', burstTime: 4, priority: 2, waitingTime: 0 },
  ]);

  const lanes: ('North' | 'East' | 'South' | 'West')[] = ['North', 'East', 'South', 'West'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setActiveLane((prev) => {
          const currentIndex = lanes.indexOf(prev);
          return lanes[(currentIndex + 1) % lanes.length];
        });

        setVehicles((prev) =>
          prev.map((v) =>
            v.lane === activeLane
              ? { ...v, burstTime: Math.max(0, v.burstTime - 1) }
              : { ...v, waitingTime: v.waitingTime + 1 }
          )
        );
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeLane]);

  const addVehicle = (lane: 'North' | 'East' | 'South' | 'West') => {
    const newV: Vehicle = {
      id: `V${vehicles.length + 1}`,
      type: Math.random() > 0.8 ? 'emergency' : 'car',
      lane,
      burstTime: Math.floor(Math.random() * 5) + 3,
      priority: Math.floor(Math.random() * 3) + 1,
      waitingTime: 0,
    };
    setVehicles([...vehicles, newV]);
  };

  return (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-mono space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
            <Cpu className="w-5 h-5" /> 4-Way Traffic Intersection Kernel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mapping CPU Scheduling & Preemption to Real-World Intersection Signals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-emerald-400 font-bold outline-none"
          >
            <option value="RoundRobin">Round Robin (Time Slice: {timeSlice}s)</option>
            <option value="Priority">Priority Queue + Preemption</option>
          </select>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              isRunning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause Engine' : 'Start Engine'}
          </button>

          <button
            onClick={() => setVehicles([])}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {lanes.map((lane) => {
          const laneVehicles = vehicles.filter((v) => v.lane === lane);
          const isActive = activeLane === lane;

          return (
            <div
              key={lane}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {lane} Lane
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                  }`}
                />
              </div>

              <div className="space-y-2 min-h-[100px]">
                {laneVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs"
                  >
                    <span className="font-bold text-slate-200">{v.id}</span>
                    <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-amber-400">
                      Burst: {v.burstTime}s
                    </span>
                  </div>
                ))}
                {laneVehicles.length === 0 && (
                  <p className="text-[11px] text-slate-600 text-center pt-8">Queue Empty</p>
                )}
              </div>

              <button
                onClick={() => addVehicle(lane)}
                className="mt-3 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded border border-slate-700 font-bold"
              >
                + Spawn Process
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}