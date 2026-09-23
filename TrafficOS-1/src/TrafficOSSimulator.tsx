
import React, { useState, useEffect, useRef, useMemo } from 'react';

// ============================================================================
// TOP-DOWN REALISTIC VEHICLE SVG COMPONENTS (PROCESS THREAD REPRESENTATIONS)
// ============================================================================

const CarSVG = ({ color = '#0284C7', className = '' }) => (
  <svg viewBox="0 0 40 20" className={`w-full h-full drop-shadow-md ${className}`}>
    <rect x="2" y="2" width="36" height="16" rx="4" fill="rgba(0,0,0,0.25)" />
    <rect x="1" y="1" width="36" height="16" rx="4" fill={color} stroke="#111827" strokeWidth="1" />
    <rect x="10" y="3" width="18" height="12" rx="2" fill="#111827" />
    <polygon points="23,4 27,4 26,14 23,14" fill="#38BDF8" opacity="0.85" />
    <polygon points="12,4 14,4 14,14 12,14" fill="#38BDF8" opacity="0.65" />
    <rect x="35" y="2.5" width="1.5" height="3" fill="#FACC15" rx="0.5" />
    <rect x="35" y="12.5" width="1.5" height="3" fill="#FACC15" rx="0.5" />
    <rect x="1" y="2" width="1" height="3" fill="#EF4444" />
    <rect x="1" y="13" width="1" height="3" fill="#EF4444" />
  </svg>
);

const BikeSVG = ({ color = '#10B981', className = '' }) => (
  <svg viewBox="0 0 24 12" className={`w-full h-full drop-shadow ${className}`}>
    <rect x="2" y="3" width="20" height="6" rx="3" fill={color} stroke="#111827" strokeWidth="0.8" />
    <line x1="16" y1="0.5" x2="16" y2="11.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="6" r="3.5" fill="#111827" />
    <circle cx="11.5" cy="6" r="1" fill="#38BDF8" />
    <rect x="21" y="4.5" width="1.5" height="3" fill="#FACC15" rx="0.5" />
  </svg>
);

const BusSVG = ({ color = '#D97706', className = '' }) => (
  <svg viewBox="0 0 70 26" className={`w-full h-full drop-shadow-lg ${className}`}>
    <rect x="1" y="1" width="68" height="24" rx="4" fill={color} stroke="#111827" strokeWidth="1.2" />
    <rect x="8" y="3" width="52" height="20" rx="2" fill="#B45309" opacity="0.4" />
    <rect x="18" y="6" width="10" height="14" rx="1" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="0.8" />
    <rect x="36" y="6" width="10" height="14" rx="1" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="0.8" />
    <path d="M 58 3 L 66 3 Q 68 3 68 13 Q 68 23 66 23 L 58 23 Z" fill="#111827" />
    <path d="M 60 4 L 65 4 Q 66.5 4 66.5 13 Q 66.5 22 65 22 L 60 22 Z" fill="#38BDF8" opacity="0.85" />
    <rect x="68" y="2" width="1.5" height="4" fill="#FACC15" />
    <rect x="68" y="20" width="1.5" height="4" fill="#FACC15" />
  </svg>
);

const AutoRickshawSVG = ({ className = '' }) => (
  <svg viewBox="0 0 34 20" className={`w-full h-full drop-shadow ${className}`}>
    <path d="M 2 10 L 9 2 L 28 2 L 31 5 L 31 15 L 28 18 L 9 18 Z" fill="#15803D" stroke="#111827" strokeWidth="1" />
    <path d="M 8 3 L 26 3 L 28 6 L 28 14 L 26 17 L 8 17 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
    <polygon points="6,4 10,4 10,16 6,16" fill="#38BDF8" opacity="0.85" />
    <circle cx="2.5" cy="10" r="1.8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.5" />
  </svg>
);

const AmbulanceSVG = ({ className = '' }) => (
  <svg viewBox="0 0 52 24" className={`w-full h-full drop-shadow-xl ${className}`}>
    <rect x="1" y="1" width="50" height="22" rx="4" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.5" />
    <rect x="1" y="10" width="50" height="4" fill="#EF4444" />
    <rect x="18" y="8" width="8" height="8" fill="#EF4444" rx="1" />
    <rect x="21" y="5" width="2" height="14" fill="#FFFFFF" />
    <rect x="15" y="11" width="14" height="2" fill="#FFFFFF" />
    <path d="M 40 3 L 48 3 Q 50 3 50 12 Q 50 21 48 21 L 40 21 Z" fill="#111827" />
    <path d="M 42 4 L 47 4 Q 48.5 4 48.5 12 Q 48.5 20 47 20 L 42 20 Z" fill="#38BDF8" opacity="0.85" />
    <circle cx="36" cy="4" r="2.5" fill="#EF4444" className="animate-ping" />
    <circle cx="36" cy="20" r="2.5" fill="#3B82F6" className="animate-ping" />
    <rect x="50" y="2" width="1.5" height="4" fill="#FACC15" />
    <rect x="50" y="18" width="1.5" height="4" fill="#FACC15" />
  </svg>
);

const RenderVehicle = ({ type, color, className = '' }) => {
  switch (type) {
    case 'auto':
      return <AutoRickshawSVG className={className} />;
    case 'bike':
      return <BikeSVG color={color || '#10B981'} className={className} />;
    case 'bus':
      return <BusSVG color={color || '#D97706'} className={className} />;
    case 'emergency':
      return <AmbulanceSVG className={className} />;
    case 'normal':
    default:
      return <CarSVG color={color || '#0284C7'} className={className} />;
  }
};

const IconPlay = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
);
const IconPause = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
);
const IconStep = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M6 5h2v14H6zm3 7l8.5 6V6z"/></svg>
);
const IconReset = () => (
  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const IconCpu = () => (
  <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>
);
const IconArrowRight = () => (
  <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const IconSparkles = () => (
  <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
);
const IconBook = () => (
  <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);

// ============================================================================
// SCHEDULING ENGINE DATA MODELS & INITIAL STATE
// ============================================================================

const ALGORITHM_OPTIONS = [
  { id: 'RR', name: 'Round Robin (RR)', type: 'Preemptive Sched.', description: 'Fixed time-quantum ($q$) dispatching using circular queue modulo index arithmetic.' },
  { id: 'PRIORITY_AGING', name: 'Priority + Dynamic Aging', type: 'Preemptive + Dynamic', description: 'Min-heap priority execution with dynamic aging counter to eliminate indefinite starvation.' }
];

const getRandomVehicleType = () => {
  const r = Math.random();
  if (r < 0.05) return 'emergency';
  if (r < 0.20) return 'bus';
  if (r < 0.35) return 'auto';
  if (r < 0.70) return 'bike';
  return 'normal';
};

const createVehicleData = (idPrefix, typeOverride = null, arrivalTime = 0) => {
  const type = typeOverride || getRandomVehicleType();
  const isEmergency = type === 'emergency';
  const isBus = type === 'bus';
  const isAuto = type === 'auto';
  const isBike = type === 'bike';

  const priority = isEmergency ? 1 : isBus ? 2 : isAuto ? 3 : isBike ? 5 : 4;
  const burstTime = isEmergency ? 2 : isBus ? 5 : isAuto ? 2 : isBike ? 2 : 3;

  return {
    id: `${idPrefix}-${Math.floor(100 + Math.random() * 900)}`,
    type,
    originalBurstTime: burstTime,
    burstTime,
    arrivalTime,
    waitTime: 0,
    turnaroundTime: 0,
    priority,
    basePriority: priority,
    ageTicks: 0,
    isStarving: false,
    color: isEmergency ? '#EF4444' : isBus ? '#D97706' : isAuto ? '#CA8A04' : isBike ? '#10B981' : '#0284C7'
  };
};

const DEMO_SCENARIOS = {
  NORMAL_TRAFFIC: {
    id: 'NORMAL_TRAFFIC',
    name: '1. Normal Traffic (Fair Slicing)',
    algorithm: 'RR',
    timeQuantum: 3,
    agingEnabled: true,
    conceptTitle: 'Round-Robin Time Slicing & Fairness',
    conceptTag: 'Fair Share CPU Allocation',
    explanation: 'Demonstrates uniform CPU time-sharing across active process queues without starvation.',
    learningTheory: 'In Round-Robin (RR) scheduling, every process ready queue receives equal time slices (quantums) sequentially. No single process hogging CPU cycles can block others indefinitely.',
    tryThis: 'Notice how every lane gets serviced sequentially regardless of vehicle type. Try reducing time quantum q=2s to see more frequent context switches.',
    queues: () => ({
      NORTH: [createVehicleData('N', 'normal', 0), createVehicleData('N', 'bike', 0)],
      EAST: [createVehicleData('E', 'auto', 0), createVehicleData('E', 'normal', 0)],
      SOUTH: [createVehicleData('S', 'bike', 0), createVehicleData('S', 'bus', 0)],
      WEST: [createVehicleData('W', 'normal', 0), createVehicleData('W', 'auto', 0)]
    })
  },
  HEAVY_NORTH: {
    id: 'HEAVY_NORTH',
    name: '2. Heavy North Traffic (Queue Bottleneck)',
    algorithm: 'RR',
    timeQuantum: 4,
    agingEnabled: true,
    conceptTitle: 'Multithreaded Queue Congestion & Latency',
    conceptTag: 'Queue Saturated Workload',
    explanation: 'Demonstrates how a heavy backlog in one thread queue affects overall system turnaround time.',
    learningTheory: 'When a process thread queue (North) accumulates heavy execution demand, round-robin time slicing prevents North from starving South/East/West, but North wait times compound as bursts exceed $q$.',
    tryThis: 'Switch to Priority + Dynamic Aging to see how higher priority buses in North bypass lower priority sedans.',
    queues: () => ({
      NORTH: [
        createVehicleData('N', 'bus', 0),
        createVehicleData('N', 'auto', 0),
        createVehicleData('N', 'normal', 0),
        createVehicleData('N', 'bike', 0),
        createVehicleData('N', 'bus', 0)
      ],
      EAST: [createVehicleData('E', 'bike', 0)],
      SOUTH: [createVehicleData('S', 'auto', 0)],
      WEST: [createVehicleData('W', 'normal', 0)]
    })
  },
  EMERGENCY_VEHICLE: {
    id: 'EMERGENCY_VEHICLE',
    name: '3. Emergency Vehicle (Preemption)',
    algorithm: 'PRIORITY_AGING',
    timeQuantum: 3,
    agingEnabled: true,
    conceptTitle: 'Hardware Interrupt & Priority Preemption',
    conceptTag: 'Real-Time Interrupt Lines',
    explanation: 'Demonstrates immediate CPU preemption when a critical priority process (P1 Ambulance) enters the ready queue.',
    learningTheory: 'Real-time operating systems support preemptive scheduling where high-priority hardware interrupts (P1 Emergency) interrupt running lower-priority tasks immediately to guarantee minimal response time.',
    tryThis: 'Observe how the signal immediately triggers a context switch to West as soon as the P1 Ambulance arrives!',
    queues: () => ({
      NORTH: [createVehicleData('N', 'bus', 0), createVehicleData('N', 'normal', 0)],
      EAST: [createVehicleData('E', 'auto', 0)],
      SOUTH: [createVehicleData('S', 'bike', 0)],
      WEST: [createVehicleData('W', 'emergency', 0), createVehicleData('W', 'normal', 0)]
    })
  },
  STARVATION_DEMO: {
    id: 'STARVATION_DEMO',
    name: '4. Starvation Demonstration (Indefinite Blocking)',
    algorithm: 'PRIORITY_AGING',
    timeQuantum: 3,
    agingEnabled: false,
    conceptTitle: 'Starvation & Dynamic Aging Resolution',
    conceptTag: 'Indefinite Blocking Mitigation',
    explanation: 'Demonstrates how strict priority scheduling without aging causes low-priority threads (P5 Bikes) to starve indefinitely.',
    learningTheory: 'Without Dynamic Aging, high-priority tasks (P1/P2) continuously dominate CPU cycles. Low-priority processes suffer indefinite postponement (Starvation). Enabling Dynamic Aging periodically boosts wait age to guarantee execution.',
    tryThis: 'Watch the red Starvation Alert on South P5 Bike! Then click "Toggle Aging: ACTIVE" to watch its priority promote from P5 -> P1 and execute!',
    queues: () => ({
      NORTH: [createVehicleData('N', 'emergency', 0), createVehicleData('N', 'bus', 0)],
      EAST: [createVehicleData('E', 'bus', 0), createVehicleData('E', 'auto', 0)],
      SOUTH: [createVehicleData('S', 'bike', 0), createVehicleData('S', 'bike', 0)],
      WEST: [createVehicleData('W', 'bus', 0)]
    })
  }
};

// ============================================================================
// 2D TOP-DOWN HERO INTERSECTION CANVAS COMPONENT
// ============================================================================

const HeroIntersectionCanvas = ({
  activeLane = 'NORTH',
  isYellow = false,
  laneData = {},
  signalTimer = 3,
  timeQuantum = 3,
  heightClass = 'h-[440px]'
}) => {
  const lanes = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

  const getSignalState = (lane) => {
    if (lane === activeLane) {
      return isYellow ? 'YELLOW' : 'GREEN';
    }
    return 'RED';
  };

  return (
    <div className={`w-full ${heightClass} bg-[#1E293B] rounded-3xl relative overflow-hidden border border-[#334155] shadow-2xl flex items-center justify-center font-mono select-none`}>
      {/* Background Asphalt Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Road Layout */}
      {/* Vertical Road (North-South) */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-40 bg-[#334155] border-x-2 border-slate-600 flex justify-between">
        <div className="w-full h-full border-r-2 border-dashed border-amber-400 opacity-60" />
      </div>

      {/* Horizontal Road (East-West) */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-40 bg-[#334155] border-y-2 border-slate-600 flex flex-col justify-between">
        <div className="w-full h-full border-b-2 border-dashed border-amber-400 opacity-60" />
      </div>

      {/* Intersection Center Box (CPU Core Domain) */}
      <div className="absolute w-40 h-40 bg-[#1E293B]/90 border-2 border-slate-500 rounded-lg flex items-center justify-center z-10 shadow-inner">
        <div className="text-center space-y-1 p-2">
          <div className="flex items-center justify-center space-x-1 text-[10px] text-sky-400 font-bold uppercase tracking-widest">
            <IconCpu />
            <span>CPU CORE 0</span>
          </div>
          <div className="text-xs font-black text-white bg-slate-800/90 px-2.5 py-1 rounded-md border border-slate-700">
            {isYellow ? (
              <span className="text-amber-400 animate-pulse">CS OVERHEAD...</span>
            ) : (
              <span className="text-emerald-400">DISPATCH: {activeLane}</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 font-bold">
            TIMED QUANTUM: <span className="text-sky-300 font-mono">{signalTimer}s</span> / {timeQuantum}s
          </div>
        </div>
      </div>

      {/* Lane Indicators & Queues */}
      {lanes.map((lane) => {
        const state = getSignalState(lane);
        const queue = laneData[lane] || [];
        const isNorth = lane === 'NORTH';
        const isSouth = lane === 'SOUTH';
        const isEast = lane === 'EAST';
        const isWest = lane === 'WEST';

        return (
          <React.Fragment key={lane}>
            {/* Traffic Light Signal Box */}
            <div
              className={`absolute z-20 flex p-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-lg gap-1.5 items-center ${
                isNorth
                  ? 'top-4 left-1/2 -translate-x-1/2 flex-row'
                  : isSouth
                  ? 'bottom-4 left-1/2 -translate-x-1/2 flex-row'
                  : isWest
                  ? 'left-4 top-1/2 -translate-y-1/2 flex-col'
                  : 'right-4 top-1/2 -translate-y-1/2 flex-col'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  state === 'RED' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-red-950 opacity-40'
                }`}
              />
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  state === 'YELLOW' ? 'bg-amber-400 shadow-[0_0_10px_#facc15]' : 'bg-amber-950 opacity-40'
                }`}
              />
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  state === 'GREEN' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-emerald-950 opacity-40'
                }`}
              />
            </div>

            {/* Ready Queue Container Visuals */}
            <div
              className={`absolute flex gap-2 items-center z-10 ${
                isNorth
                  ? 'top-16 left-1/2 -translate-x-1/2 flex-col-reverse'
                  : isSouth
                  ? 'bottom-16 left-1/2 -translate-x-1/2 flex-col'
                  : isWest
                  ? 'left-16 top-1/2 -translate-y-1/2 flex-row-reverse'
                  : 'right-16 top-1/2 -translate-y-1/2 flex-row'
              }`}
            >
              {queue.slice(0, 4).map((car, idx) => {
                const isExecuting = lane === activeLane && idx === 0 && state === 'GREEN';
                return (
                  <div
                    key={car.id || idx}
                    className={`relative p-1 rounded-lg border transition-all duration-300 flex items-center justify-center ${
                      isExecuting
                        ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_12px_rgba(52,211,153,0.5)] scale-105'
                        : car.isStarving
                        ? 'border-red-500 bg-red-950/70 animate-bounce'
                        : 'border-slate-700 bg-slate-900/80'
                    } ${isNorth || isSouth ? 'w-16 h-8' : 'w-16 h-8'}`}
                  >
                    <RenderVehicle type={car.type} color={car.color} className="w-12 h-6" />
                    <div className="absolute -top-2 -right-2 bg-slate-800 text-[9px] font-bold px-1 rounded border border-slate-600 text-sky-300">
                      P{car.priority}
                    </div>
                    {car.burstTime !== undefined && (
                      <div className="absolute -bottom-2 -left-2 bg-slate-900 text-[8px] px-1 rounded border border-slate-700 text-slate-300 font-mono">
                        {car.burstTime}s
                      </div>
                    )}
                  </div>
                );
              })}
              {queue.length === 0 && (
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-2 py-1 bg-slate-900/60 rounded border border-slate-800">
                  READY Q EMPTY
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================================
// OS METAPHOR CHEATSHEET BANNER
// ============================================================================

const OSMetaphorCheatsheet = () => (
  <div className="bg-white border border-[#D1D5DB] rounded-2xl p-4 shadow-sm text-xs font-mono text-[#111827]">
    <div className="text-[11px] font-extrabold text-[#0284C7] uppercase tracking-wider mb-2 flex items-center space-x-2">
      <IconCpu />
      <span>OS Kernel Primitive Mapping Reference Directory</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
      <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
        <div className="text-[#6B7280] text-[9px]">READY QUEUE</div>
        <div className="font-bold text-[#111827] mt-0.5">Lane Waiting Line</div>
      </div>
      <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
        <div className="text-[#6B7280] text-[9px]">CPU EXECUTION</div>
        <div className="font-bold text-[#22C55E] mt-0.5">Green Signal Phase</div>
      </div>
      <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
        <div className="text-[#6B7280] text-[9px]">CONTEXT SWITCH</div>
        <div className="font-bold text-[#CA8A04] mt-0.5">Yellow Clearance</div>
      </div>
      <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
        <div className="text-[#6B7280] text-[9px]">HARDWARE INTERRUPT</div>
        <div className="font-bold text-[#EF4444] mt-0.5">P1 Emergency Vehicle</div>
      </div>
      <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
        <div className="text-[#6B7280] text-[9px]">STARVATION</div>
        <div className="font-bold text-[#DC2626] mt-0.5">Indefinite Wait (P5)</div>
      </div>
      <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
        <div className="text-[#6B7280] text-[9px]">DYNAMIC AGING</div>
        <div className="font-bold text-[#7C3AED] mt-0.5">Wait Age Promotion</div>
      </div>
    </div>
  </div>
);

// ============================================================================
// SCHEDULER EXPLANATION & LOG TERMINAL PANEL
// ============================================================================

const SchedulerExplanationPanel = ({
  selectedAlgo,
  activeLane,
  decisionLogs,
  agingEnabled,
  explanationText,
  verboseMode,
  setVerboseMode
}) => (
  <div className="bg-white border border-[#D1D5DB] rounded-2xl p-4 shadow-sm text-xs font-mono text-[#111827] space-y-3">
    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
          Kernel Decision Terminal Logs
        </h3>
      </div>
      <button
        onClick={() => setVerboseMode(!verboseMode)}
        className="text-[10px] text-[#0284C7] font-bold hover:underline"
      >
        {verboseMode ? 'Hide Details' : 'Show Verbose Logs'}
      </button>
    </div>

    <div className="p-3 bg-[#0F172A] text-[#F8FAFC] rounded-xl font-mono text-[11px] leading-relaxed border border-[#334155] space-y-1">
      <div className="text-[#38BDF8] font-bold">▶ CURRENT SCHEDULER PHASE</div>
      <div className="text-slate-300">{explanationText}</div>
    </div>

    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
      <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">RECENT DISPATCH EVENT TRAIL</div>
      {decisionLogs.length === 0 ? (
        <div className="text-[11px] text-[#9CA3AF] italic">No dispatch events logged yet. Start simulation clock.</div>
      ) : (
        decisionLogs.map((log, i) => (
          <div key={i} className="p-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[10px] space-y-0.5">
            <div className="flex items-center justify-between font-bold">
              <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                log.type === 'PREEMPTION'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : log.type === 'AGING'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : log.type === 'STARVATION'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-sky-100 text-sky-700 border border-sky-200'
              }`}>
                {log.type}
              </span>
              <span className="text-[#9CA3AF]">t = {log.timestamp}s</span>
            </div>
            <div className="text-[#374151]">{log.message}</div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ============================================================================
// PERFORMANCE METRICS CLUSTER PANEL
// ============================================================================

const PerformanceMetricsCluster = ({
  clearedCount,
  totalWaitAccumulator,
  totalTATAccumulator,
  simTime,
  contextSwitchCount,
  starvationCount,
  totalInjectedCount
}) => {
  const avgWait = clearedCount > 0 ? (totalWaitAccumulator / clearedCount).toFixed(1) : '0.0';
  const avgTAT = clearedCount > 0 ? (totalTATAccumulator / clearedCount).toFixed(1) : '0.0';
  const throughput = simTime > 0 ? ((clearedCount / simTime) * 60).toFixed(1) : '0.0';
  const cpuUtil = simTime > 0 ? Math.min(100, Math.round(((simTime - contextSwitchCount) / simTime) * 100)) : 100;

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-2xl p-4 shadow-sm text-xs font-mono text-[#111827] space-y-3">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#111827]">
          Kernel Telemetry & Performance Metrics
        </h3>
        <span className="text-[10px] text-[#0284C7] font-bold">Sim Clock: {simTime}s</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
          <div className="text-[9px] text-[#6B7280]">AVG WAIT ($\bar{W}$)</div>
          <div className="text-base font-extrabold text-[#0284C7] mt-0.5">{avgWait}s</div>
        </div>
        <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
          <div className="text-[9px] text-[#6B7280]">AVG TAT ($\bar{TAT}$)</div>
          <div className="text-base font-extrabold text-[#15803D] mt-0.5">{avgTAT}s</div>
        </div>
        <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
          <div className="text-[9px] text-[#6B7280]">THROUGHPUT</div>
          <div className="text-base font-extrabold text-[#7C3AED] mt-0.5">{throughput} p/m</div>
        </div>
        <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
          <div className="text-[9px] text-[#6B7280]">CPU UTILIZATION</div>
          <div className="text-base font-extrabold text-[#0369A1] mt-0.5">{cpuUtil}%</div>
        </div>
        <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
          <div className="text-[9px] text-[#6B7280]">CONTEXT SWITCHES</div>
          <div className="text-base font-extrabold text-[#D97706] mt-0.5">{contextSwitchCount}</div>
        </div>
        <div className="p-2 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
          <div className="text-[9px] text-[#6B7280]">STARVING THREADS</div>
          <div className={`text-base font-extrabold mt-0.5 ${starvationCount > 0 ? 'text-[#EF4444] animate-pulse' : 'text-[#22C55E]'}`}>
            {starvationCount}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DATA STRUCTURE VISUALIZERS (CIRCULAR QUEUE & MIN-HEAP)
// ============================================================================

const CircularQueueVisualizer = ({ activeLane, timeQuantum, signalTimer }) => {
  const lanes = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
  const activeIndex = lanes.indexOf(activeLane);

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-2xl p-4 shadow-sm text-xs font-mono text-[#111827] space-y-3">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#0284C7]">
          Circular Queue Traversal Array ($i = (i+1) \bmod 4$)
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {lanes.map((lane, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={lane}
              className={`p-2 rounded-xl border text-center transition-all ${
                isActive
                  ? 'bg-[#F0F9FF] border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-md'
                  : 'bg-[#F8F9FA] border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              <div className="text-[9px] font-bold text-[#6B7280]">INDEX [{idx}]</div>
              <div className={`text-xs font-extrabold mt-0.5 ${isActive ? 'text-[#0284C7]' : 'text-[#374151]'}`}>
                {lane}
              </div>
              {isActive && (
                <div className="mt-1 text-[8px] bg-[#0284C7] text-white px-1 py-0.5 rounded font-bold">
                  ACTIVE DISPATCH
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PriorityQueueVisualizer = ({ laneData, agingEnabled }) => {
  const allQueuedCars = useMemo(() => {
    const list = [];
    Object.keys(laneData).forEach((lane) => {
      laneData[lane].forEach((car) => {
        list.push({ ...car, lane });
      });
    });
    return list.sort((a, b) => a.priority - b.priority);
  }, [laneData]);

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-2xl p-4 shadow-sm text-xs font-mono text-[#111827] space-y-3">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#7C3AED]">
          Min-Heap Priority Queue (Sorted by Priority $P_i$)
        </h3>
        <span className="text-[10px] text-[#6B7280]">{agingEnabled ? 'Aging Enabled' : 'Aging Disabled'}</span>
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
        {allQueuedCars.length === 0 ? (
          <div className="text-[11px] text-[#9CA3AF] italic">All ready queues empty.</div>
        ) : (
          allQueuedCars.map((car, idx) => (
            <div
              key={car.id || idx}
              className={`p-2 rounded-xl border flex items-center justify-between ${
                idx === 0
                  ? 'bg-[#F5F3FF] border-[#7C3AED] font-bold text-[#6D28D9]'
                  : 'bg-[#F8F9FA] border-[#E5E7EB] text-[#374151]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white border rounded">
                  P{car.priority}
                </span>
                <span className="text-[11px] font-sans">{car.id} ({car.lane})</span>
              </div>
              <div className="text-[10px] text-[#6B7280]">
                Burst: {car.burstTime}s | Wait: {car.waitTime}s
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// LEARNING MODE EDUCATIONAL PANEL
// ============================================================================

const LearningModePanel = ({ activeScenario, selectedAlgo, agingEnabled, timeQuantum }) => {
  const currentDemo = DEMO_SCENARIOS[activeScenario] || DEMO_SCENARIOS.NORMAL_TRAFFIC;

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-2xl p-4 space-y-3 shadow-sm font-sans text-[#111827]">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <div className="flex items-center space-x-2">
          <IconBook />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0284C7] font-mono">
            Learning Mode: Core OS Concept Guide
          </h3>
        </div>
        <span className="text-[10px] bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] px-2 py-0.5 rounded font-mono font-bold">
          {currentDemo.conceptTag}
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-extrabold text-[#111827] flex items-center space-x-2">
          <span>{currentDemo.conceptTitle}</span>
        </h4>
        <p className="text-xs text-[#4B5563] leading-relaxed">
          {currentDemo.learningTheory}
        </p>
      </div>

      <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl space-y-1.5 font-mono text-[11px]">
        <div className="text-[10px] text-[#0284C7] font-bold uppercase tracking-wide">
          Guided Experiment Challenge
        </div>
        <div className="text-[#374151] font-sans text-xs font-semibold leading-snug">
          👉 {currentDemo.tryThis}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center pt-1">
        <div className="bg-[#F9FAFB] p-2 rounded-lg border border-[#E5E7EB]">
          <div className="text-[#6B7280]">ACTIVE SCHEDULER</div>
          <div className="font-bold text-[#0284C7] mt-0.5">{selectedAlgo === 'RR' ? 'Round Robin' : 'Priority Queue'}</div>
        </div>
        <div className="bg-[#F9FAFB] p-2 rounded-lg border border-[#E5E7EB]">
          <div className="text-[#6B7280]">TIME QUANTUM</div>
          <div className="font-bold text-[#15803D] mt-0.5">{selectedAlgo === 'RR' ? `${timeQuantum}s` : 'Preemptive'}</div>
        </div>
        <div className="bg-[#F9FAFB] p-2 rounded-lg border border-[#E5E7EB]">
          <div className="text-[#6B7280]">DYNAMIC AGING</div>
          <div className={`font-bold mt-0.5 ${agingEnabled ? 'text-[#15803D]' : 'text-[#EF4444]'}`}>
            {agingEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIDE-BY-SIDE ALGORITHM COMPARISON COMPONENT
// ============================================================================

const CompareAlgorithmsView = ({ initialQueues }) => {
  const [compSimTime, setCompSimTime] = useState(0);
  const [isCompRunning, setIsCompRunning] = useState(false);

  // RR Engine State
  const [rrLaneData, setRrLaneData] = useState(() => JSON.parse(JSON.stringify(initialQueues)));
  const [rrActiveLane, setRrActiveLane] = useState('NORTH');
  const [rrSignalTimer, setRrSignalTimer] = useState(3);
  const [rrCleared, setRrCleared] = useState(0);
  const [rrWaitAccum, setRrWaitAccum] = useState(0);
  const [rrContextSwitches, setRrContextSwitches] = useState(0);

  // Priority + Aging Engine State
  const [prioLaneData, setPrioLaneData] = useState(() => JSON.parse(JSON.stringify(initialQueues)));
  const [prioActiveLane, setPrioActiveLane] = useState('NORTH');
  const [prioCleared, setPrioCleared] = useState(0);
  const [prioWaitAccum, setPrioWaitAccum] = useState(0);
  const [prioContextSwitches, setPrioContextSwitches] = useState(0);

  const handleResetCompare = () => {
    setIsCompRunning(false);
    setCompSimTime(0);
    setRrLaneData(JSON.parse(JSON.stringify(initialQueues)));
    setRrActiveLane('NORTH');
    setRrSignalTimer(3);
    setRrCleared(0);
    setRrWaitAccum(0);
    setRrContextSwitches(0);

    setPrioLaneData(JSON.parse(JSON.stringify(initialQueues)));
    setPrioActiveLane('NORTH');
    setPrioCleared(0);
    setPrioWaitAccum(0);
    setPrioContextSwitches(0);
  };

  const advanceCompareStep = () => {
    setCompSimTime((t) => t + 1);

    // --- 1. Advance RR Engine ---
    setRrLaneData((prev) => {
      const data = JSON.parse(JSON.stringify(prev));
      const activeQ = data[rrActiveLane];
      if (activeQ.length > 0) {
        activeQ[0].burstTime -= 1;
        if (activeQ[0].burstTime <= 0) {
          const finished = activeQ.shift();
          setRrCleared((c) => c + 1);
          setRrWaitAccum((w) => w + finished.waitTime);
        }
      }
      Object.keys(data).forEach((lane) => {
        data[lane].forEach((car, idx) => {
          if (lane !== rrActiveLane || idx !== 0) car.waitTime += 1;
        });
      });
      return data;
    });

    setRrSignalTimer((t) => {
      if (t <= 1) {
        const order = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
        const nextIdx = (order.indexOf(rrActiveLane) + 1) % 4;
        setRrActiveLane(order[nextIdx]);
        setRrContextSwitches((c) => c + 1);
        return 3;
      }
      return t - 1;
    });

    // --- 2. Advance Priority Engine ---
    let prioTargetLane = prioActiveLane;
    let highestPriority = 99;

    setPrioLaneData((prev) => {
      const data = JSON.parse(JSON.stringify(prev));

      Object.keys(data).forEach((lane) => {
        if (data[lane].length > 0 && data[lane][0].priority < highestPriority) {
          highestPriority = data[lane][0].priority;
          prioTargetLane = lane;
        }
      });

      if (prioTargetLane !== prioActiveLane) {
        setPrioActiveLane(prioTargetLane);
        setPrioContextSwitches((c) => c + 1);
      }

      const activeQ = data[prioTargetLane];
      if (activeQ && activeQ.length > 0) {
        activeQ[0].burstTime -= 1;
        if (activeQ[0].burstTime <= 0) {
          const finished = activeQ.shift();
          setPrioCleared((c) => c + 1);
          setPrioWaitAccum((w) => w + finished.waitTime);
        }
      }

      Object.keys(data).forEach((lane) => {
        data[lane].forEach((car, idx) => {
          if (lane !== prioTargetLane || idx !== 0) {
            car.waitTime += 1;
            car.ageTicks += 1;
            if (car.ageTicks >= 3 && car.priority > 1) {
              car.priority -= 1;
              car.ageTicks = 0;
            }
          }
        });
      });

      return data;
    });
  };

  useEffect(() => {
    if (!isCompRunning) return;
    const timer = setInterval(advanceCompareStep, 800);
    return () => clearInterval(timer);
  }, [isCompRunning, rrActiveLane, prioActiveLane]);

  const rrAvgWait = rrCleared > 0 ? (rrWaitAccum / rrCleared).toFixed(1) : '0.0';
  const prioAvgWait = prioCleared > 0 ? (prioWaitAccum / prioCleared).toFixed(1) : '0.0';

  const rrThroughput = compSimTime > 0 ? ((rrCleared / compSimTime) * 60).toFixed(1) : '0.0';
  const prioThroughput = compSimTime > 0 ? ((prioCleared / compSimTime) * 60).toFixed(1) : '0.0';

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-2xl p-5 space-y-5 shadow-sm font-sans text-[#111827]">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E7EB] pb-3 gap-2 font-mono">
        <div>
          <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-wide">
            Side-by-Side Algorithm Comparison Mode
          </h3>
          <p className="text-xs text-[#6B7280]">
            Simulating identical queue workloads simultaneously under Round Robin vs Priority + Dynamic Aging
          </p>
        </div>

        <div className="flex items-center space-x-2 font-sans">
          <button
            onClick={() => setIsCompRunning(!isCompRunning)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
              isCompRunning ? 'bg-[#CA8A04] text-white' : 'bg-[#22C55E] text-white'
            }`}
          >
            {isCompRunning ? <IconPause /> : <IconPlay />}
            <span>{isCompRunning ? 'Pause Dual Engine' : 'Start Dual Engine'}</span>
          </button>
          <button
            onClick={advanceCompareStep}
            disabled={isCompRunning}
            className="px-3 py-1.5 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#374151] border border-[#D1D5DB] rounded-xl text-xs font-semibold disabled:opacity-50"
          >
            Clock Tick
          </button>
          <button
            onClick={handleResetCompare}
            className="px-3 py-1.5 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#4B5563] border border-[#D1D5DB] rounded-xl text-xs font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Metrics Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-center">
        <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-2xl space-y-2">
          <div className="text-[10px] text-[#6B7280] font-bold uppercase">Average Waiting Time ($\bar{W}$)</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded-xl border border-[#E5E7EB]">
              <div className="text-[9px] text-[#0284C7] font-bold">ROUND ROBIN</div>
              <div className="text-lg font-extrabold text-[#0284C7] mt-0.5">{rrAvgWait}s</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-[#E5E7EB]">
              <div className="text-[9px] text-[#7C3AED] font-bold">PRIORITY + AGING</div>
              <div className="text-lg font-extrabold text-[#7C3AED] mt-0.5">{prioAvgWait}s</div>
            </div>
          </div>
          <div className="text-[10px] font-sans text-[#4B5563] pt-1">
            {Number(prioAvgWait) < Number(rrAvgWait)
              ? 'Priority scheduling minimized latency for urgent tasks.'
              : 'Round Robin maintained uniform queue wait times.'}
          </div>
        </div>

        <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-2xl space-y-2">
          <div className="text-[10px] text-[#6B7280] font-bold uppercase">Throughput (Completed Processes / Min)</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded-xl border border-[#E5E7EB]">
              <div className="text-[9px] text-[#0284C7] font-bold">ROUND ROBIN</div>
              <div className="text-lg font-extrabold text-[#15803D] mt-0.5">{rrThroughput} p/m</div>
              <div className="text-[9px] text-[#6B7280] font-mono mt-0.5">{rrCleared} cleared</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-[#E5E7EB]">
              <div className="text-[9px] text-[#7C3AED] font-bold">PRIORITY + AGING</div>
              <div className="text-lg font-extrabold text-[#15803D] mt-0.5">{prioThroughput} p/m</div>
              <div className="text-[9px] text-[#6B7280] font-mono mt-0.5">{prioCleared} cleared</div>
            </div>
          </div>
          <div className="text-[10px] font-sans text-[#4B5563] pt-1">
            {rrCleared === prioCleared
              ? 'Both schedulers cleared identical process counts.'
              : prioCleared > rrCleared
              ? 'Priority algorithm cleared short burst jobs faster.'
              : 'Round Robin maintained higher task throughput.'}
          </div>
        </div>

        <div className="p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-2xl space-y-2">
          <div className="text-[10px] text-[#6B7280] font-bold uppercase">Context Switch Overhead</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded-xl border border-[#E5E7EB]">
              <div className="text-[9px] text-[#0284C7] font-bold">ROUND ROBIN</div>
              <div className="text-lg font-extrabold text-[#D97706] mt-0.5">{rrContextSwitches}</div>
              <div className="text-[9px] text-[#6B7280] font-mono mt-0.5">q=3s quantum</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-[#E5E7EB]">
              <div className="text-[9px] text-[#7C3AED] font-bold">PRIORITY + AGING</div>
              <div className="text-lg font-extrabold text-[#D97706] mt-0.5">{prioContextSwitches}</div>
              <div className="text-[9px] text-[#6B7280] font-mono mt-0.5">Preemptive</div>
            </div>
          </div>
          <div className="text-[10px] font-sans text-[#4B5563] pt-1">
            {rrContextSwitches > prioContextSwitches
              ? 'RR incurred higher switch overhead due to quantum expirations.'
              : 'Priority incurred context switches on preemption interrupts.'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#0369A1] font-bold">
            <span>ROUND ROBIN ENGINE</span>
            <span>DISPATCHING: {rrActiveLane}</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            {['NORTH', 'EAST', 'SOUTH', 'WEST'].map((lane) => (
              <div key={lane} className={`p-1.5 rounded text-center border ${rrActiveLane === lane ? 'bg-[#22C55E] text-white font-bold' : 'bg-white text-[#374151]'}`}>
                {lane[0]}: {rrLaneData[lane]?.length || 0} queued
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[#6D28D9] font-bold">
            <span>PRIORITY + AGING ENGINE</span>
            <span>DISPATCHING: {prioActiveLane}</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            {['NORTH', 'EAST', 'SOUTH', 'WEST'].map((lane) => (
              <div key={lane} className={`p-1.5 rounded text-center border ${prioActiveLane === lane ? 'bg-[#7C3AED] text-white font-bold' : 'bg-white text-[#374151]'}`}>
                {lane[0]}: {prioLaneData[lane]?.length || 0} queued
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIMULATION CONTROL TOOLBAR
// ============================================================================

const PlaybackControls = ({
  isRunning,
  setIsRunning,
  simSpeed,
  setSimSpeed,
  onStep,
  onReset,
  selectedAlgo,
  setSelectedAlgo,
  timeQuantum,
  setTimeQuantum,
  agingEnabled,
  setAgingEnabled,
  activeScenario,
  onSelectScenario,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="bg-white border border-[#D1D5DB] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm text-[#111827] font-mono">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={activeScenario}
          onChange={(e) => onSelectScenario(e.target.value)}
          className="bg-[#F8F9FA] border border-[#0284C7] text-[#0284C7] text-xs font-extrabold rounded-xl px-3 py-2 cursor-pointer focus:outline-none"
        >
          {Object.values(DEMO_SCENARIOS).map((scenario) => (
            <option key={scenario.id} value={scenario.id} className="bg-white text-[#111827]">
              {scenario.name}
            </option>
          ))}
        </select>

        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="bg-[#F8F9FA] border border-[#D1D5DB] text-[#374151] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
        >
          {ALGORITHM_OPTIONS.map((a) => (
            <option key={a.id} value={a.id} className="bg-white text-[#111827]">
              {a.name}
            </option>
          ))}
        </select>

        {selectedAlgo === 'RR' && (
          <div className="flex items-center space-x-2 bg-[#F8F9FA] border border-[#D1D5DB] px-3 py-1.5 rounded-xl text-xs font-sans">
            <span className="text-[#4B5563] font-mono text-[11px]">Quantum ($q$):</span>
            <span className="text-[#0284C7] font-bold font-mono">{timeQuantum}s</span>
            <input
              type="range"
              min="2"
              max="8"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(Number(e.target.value))}
              className="w-16 accent-[#0284C7] cursor-pointer"
            />
          </div>
        )}

        {selectedAlgo === 'PRIORITY_AGING' && (
          <button
            onClick={() => setAgingEnabled(!agingEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-2 ${
              agingEnabled
                ? 'bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]'
                : 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5] animate-pulse'
            }`}
          >
            <span>{agingEnabled ? 'Aging: ACTIVE' : 'Aging: INACTIVE (Starvation Demo)'}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 font-sans">
        <button
          onClick={() => setViewMode(viewMode === 'COMPARE' ? 'SINGLE' : 'COMPARE')}
          className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition ${
            viewMode === 'COMPARE'
              ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
              : 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE] hover:bg-[#EDE9FE]'
          }`}
        >
          {viewMode === 'COMPARE' ? '⚡ Exit Dual Compare' : '⚡ Compare RR vs Priority Side-by-Side'}
        </button>

        {viewMode === 'SINGLE' && (
          <>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm ${
                isRunning
                  ? 'bg-[#CA8A04] hover:bg-[#A16207] text-white'
                  : 'bg-[#22C55E] hover:bg-[#16A34A] text-white'
              }`}
            >
              {isRunning ? <IconPause /> : <IconPlay />}
              <span>{isRunning ? 'Pause' : 'Execute'}</span>
            </button>

            <button
              onClick={onStep}
              disabled={isRunning}
              className="px-3 py-2 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#374151] border border-[#D1D5DB] rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <IconStep />
              <span>Clock Tick</span>
            </button>

            <button
              onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
              className="px-3 py-2 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#0284C7] border border-[#D1D5DB] rounded-xl text-xs font-bold transition font-mono"
            >
              {simSpeed}x Speed
            </button>
          </>
        )}

        <button
          onClick={onReset}
          className="px-3 py-2 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#4B5563] border border-[#D1D5DB] rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
        >
          <IconReset />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// LANDING PAGE COMPONENT (PEDAGOGICAL OVERVIEW)
// ============================================================================

const LandingPage = ({ onLaunchSimulator }) => {
  const previewLaneData = {
    NORTH: [
      { id: 'P-N101', type: 'auto', priority: 3, waitTime: 2, color: '#CA8A04' },
      { id: 'P-N102', type: 'bike', priority: 5, waitTime: 4, color: '#10B981' }
    ],
    EAST: [
      { id: 'P-E201', type: 'bus', priority: 2, waitTime: 1, color: '#D97706' }
    ],
    SOUTH: [
      { id: 'P-S301', type: 'normal', priority: 4, waitTime: 3, color: '#0284C7' }
    ],
    WEST: [
      { id: 'P-W401', type: 'emergency', priority: 1, waitTime: 0, color: '#EF4444' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans">
      <nav className="border-b border-[#D1D5DB] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0284C7] to-[#10B981] rounded-xl flex items-center justify-center text-white font-mono font-black shadow-sm">
              TOS
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-mono text-[#111827]">
                Traffic<span className="text-[#0284C7]">OS</span> Kernel Lab
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-[#6B7280] border-l border-[#D1D5DB] pl-2 font-mono">
                Interactive Operating System Scheduling Simulator
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm font-medium text-[#4B5563]">
            <a href="#mapping" className="hover:text-[#111827] transition hidden md:block">Kernel Mapping</a>
            <a href="#how-it-works" className="hover:text-[#111827] transition hidden md:block">Laboratory Manual</a>
            <a href="#algorithms" className="hover:text-[#111827] transition hidden md:block">Scheduling Algorithms</a>
            <button
              onClick={onLaunchSimulator}
              className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm"
            >
              <span>Launch Simulator Environment</span>
              <IconArrowRight />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] rounded-full text-xs font-mono font-semibold">
              <IconSparkles />
              <span>Computer Architecture & Operating Systems Laboratory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Process Scheduling & CPU Dispatching in <span className="text-[#0284C7]">Real-Time Systems</span>
            </h1>

            <p className="text-base text-[#4B5563] leading-relaxed">
              TrafficOS maps core operating system algorithms—Round Robin time quantum execution, min-heap priority queues, context switching overhead, hardware preemption, and dynamic aging—onto a physical 4-way intersection model.
            </p>

            <div className="p-4 bg-white border border-[#D1D5DB] rounded-2xl shadow-sm space-y-2 font-mono text-xs">
              <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">OPERATING SYSTEM METAPHOR DIRECTORY</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#F8F9FA] p-2 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[#6B7280]">Process Thread ($P_i$)</span> = <strong className="text-[#0284C7]">Traffic Lane Queue</strong>
                </div>
                <div className="bg-[#F8F9FA] p-2 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[#6B7280]">CPU Time Slice</span> = <strong className="text-[#22C55E]">Green Signal Phase</strong>
                </div>
                <div className="bg-[#F8F9FA] p-2 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[#6B7280]">Context Switch Overhead</span> = <strong className="text-[#CA8A04]">Yellow Clearance Phase</strong>
                </div>
                <div className="bg-[#F8F9FA] p-2 rounded-lg border border-[#E5E7EB]">
                  <span className="text-[#6B7280]">Hardware Interrupt</span> = <strong className="text-[#EF4444]">Emergency Vehicle</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchSimulator}
                className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-sm transition flex items-center space-x-2 shadow-md"
              >
                <span>Launch Interactive Simulator</span>
                <IconArrowRight />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroIntersectionCanvas
              activeLane="NORTH"
              isYellow={false}
              laneData={previewLaneData}
              signalTimer={4}
              timeQuantum={4}
              heightClass="h-[380px] sm:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* Kernel Primitive Mapping */}
      <section id="mapping" className="py-12 bg-white border-y border-[#D1D5DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#0284C7] font-bold">KERNEL ABSTRACT MODELING</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Direct OS Kernel Primitive Mapping</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="text-xs font-mono text-[#0284C7] font-bold uppercase">01 / PROCESS QUEUES</div>
              <h3 className="font-bold text-base text-[#111827]">Lane Buffer = Ready Queue ($P_i$)</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Incoming lanes act as process ready queues holding threads waiting for CPU cycle allocation.
              </p>
            </div>

            <div className="p-5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="text-xs font-mono text-[#22C55E] font-bold uppercase">02 / CPU TIME SLICING</div>
              <h3 className="font-bold text-base text-[#111827]">Green Signal = CPU Execution Time</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Granting right-of-way represents CPU dispatching, allowing process threads to execute and exit the queue.
              </p>
            </div>

            <div className="p-5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-2xl space-y-2">
              <div className="text-xs font-mono text-[#CA8A04] font-bold uppercase">03 / CONTEXT SWITCH OVERHEAD</div>
              <h3 className="font-bold text-base text-[#111827]">Yellow Clearance = Context Switch Latency</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Models register state saving, pipeline flushing, and dispatch latency during queue context switching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D1D5DB] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#6B7280]">
          <div>
            TrafficOS © 2026 • Real-Time CPU Dispatching & Scheduling Laboratory
          </div>
          <button
            onClick={onLaunchSimulator}
            className="text-[#0284C7] hover:underline font-bold"
          >
            Launch Interactive Laboratory →
          </button>
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// SIMULATION ENGINE DASHBOARD VIEW
// ============================================================================

const SimulationDashboard = ({ onBackToLanding }) => {
  const [activeScenario, setActiveScenario] = useState('NORMAL_TRAFFIC');
  const [viewMode, setViewMode] = useState('SINGLE');

  const [selectedAlgo, setSelectedAlgo] = useState('RR');
  const [timeQuantum, setTimeQuantum] = useState(3);
  const [agingEnabled, setAgingEnabled] = useState(true);
  const [verboseMode, setVerboseMode] = useState(true);

  const [isRunning, setIsRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simTime, setSimTime] = useState(0);

  const [activeLane, setActiveLane] = useState('NORTH');
  const [isYellow, setIsYellow] = useState(false);
  const [signalTimer, setSignalTimer] = useState(3);
  const [laneData, setLaneData] = useState(() => DEMO_SCENARIOS.NORMAL_TRAFFIC.queues());

  const [clearedCount, setClearedCount] = useState(0);
  const [totalWaitAccumulator, setTotalWaitAccumulator] = useState(0);
  const [totalTATAccumulator, setTotalTATAccumulator] = useState(0);
  const [contextSwitchCount, setContextSwitchCount] = useState(0);
  const [starvationCount, setStarvationCount] = useState(0);
  const [totalInjectedCount, setTotalInjectedCount] = useState(8);

  const [decisionLogs, setDecisionLogs] = useState([]);
  const [explanationText, setExplanationText] = useState('NORTH ready queue dispatched via circular array pointer [0].');

  const addLog = (type, message) => {
    setDecisionLogs((prev) => [
      { type, message, timestamp: simTime },
      ...prev.slice(0, 20)
    ]);
  };

  const loadScenario = (scenarioKey) => {
    const scenario = DEMO_SCENARIOS[scenarioKey] || DEMO_SCENARIOS.NORMAL_TRAFFIC;
    setActiveScenario(scenarioKey);
    setSelectedAlgo(scenario.algorithm);
    setTimeQuantum(scenario.timeQuantum);
    setAgingEnabled(scenario.agingEnabled);

    setIsRunning(false);
    setSimTime(0);
    setClearedCount(0);
    setTotalWaitAccumulator(0);
    setTotalTATAccumulator(0);
    setContextSwitchCount(0);
    setStarvationCount(0);
    setActiveLane('NORTH');
    setIsYellow(false);

    const freshQueues = scenario.queues();
    setLaneData(freshQueues);

    let totalCount = 0;
    Object.keys(freshQueues).forEach((k) => { totalCount += freshQueues[k].length; });
    setTotalInjectedCount(totalCount);

    addLog('SCENARIO_LOAD', `Loaded guided demo scenario: ${scenario.name}`);
    setExplanationText(scenario.explanation);
  };

  const addVehicle = (laneKey, typeOverride = null) => {
    const newVehicle = createVehicleData(laneKey[0], typeOverride, simTime);
    setLaneData((prev) => ({
      ...prev,
      [laneKey]: [...prev[laneKey], newVehicle]
    }));
    setTotalInjectedCount((c) => c + 1);

    if (newVehicle.type === 'emergency') {
      addLog('PREEMPTION', `Hardware Interrupt Line IRQ1: High-priority emergency process (${newVehicle.id}) attached to ${laneKey} ready queue!`);
    } else {
      addLog('PROCESS_ENQUEUE', `Process thread ${newVehicle.id} (P${newVehicle.priority}, Burst: ${newVehicle.burstTime}s) enqueued at ${laneKey}.`);
    }
  };

  const advanceSimulationStep = () => {
    setSimTime((t) => t + 1);

    if (isYellow) {
      setIsYellow(false);
      setSignalTimer(timeQuantum);
      addLog('CONTEXT_SWITCH', `Context Switch Overhead Complete: Restored context to ${activeLane} ready queue thread.`);
      return;
    }

    setLaneData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const activeQueue = newData[activeLane];

      if (activeQueue.length > 0) {
        const currentCar = activeQueue[0];
        currentCar.burstTime -= 1;

        if (currentCar.burstTime <= 0) {
          activeQueue.shift();
          const tat = (simTime + 1) - currentCar.arrivalTime;
          setClearedCount((c) => c + 1);
          setTotalWaitAccumulator((w) => w + currentCar.waitTime);
          setTotalTATAccumulator((t) => t + tat);
          addLog('PROCESS_CLEAR', `Process thread ${currentCar.id} completed CPU burst execution. TAT: ${tat}s, Wait: ${currentCar.waitTime}s.`);
        }
      }

      Object.keys(newData).forEach((lane) => {
        newData[lane].forEach((car, idx) => {
          if (lane !== activeLane || idx !== 0) {
            car.waitTime += 1;
            car.ageTicks += 1;

            if (!agingEnabled && car.waitTime >= 10 && car.priority >= 4) {
              if (!car.isStarving) {
                car.isStarving = true;
                setStarvationCount((s) => s + 1);
                addLog('STARVATION', `STARVATION ALERT: Process ${car.id} in ${lane} ready queue blocked for ${car.waitTime}s without CPU allocation!`);
              }
            }

            if (agingEnabled && car.ageTicks >= 3 && car.priority > 1) {
              const oldPriority = car.priority;
              car.priority -= 1;
              car.ageTicks = 0;
              car.isStarving = false;
              addLog('AGING', `Dynamic Aging Promotion: Process ${car.id} (${lane}) waited ${car.waitTime}s -> Priority promoted from P${oldPriority} to P${car.priority}!`);
            }
          }
        });
      });

      return newData;
    });

    if (selectedAlgo === 'RR') {
      setSignalTimer((prevTimer) => {
        const nextTimer = prevTimer - 1;
        if (nextTimer <= 0) {
          const order = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
          const currIdx = order.indexOf(activeLane);
          const nextIdx = (currIdx + 1) % 4;
          const nextLane = order[nextIdx];

          setIsYellow(true);
          setContextSwitchCount((c) => c + 1);
          setActiveLane(nextLane);
          setExplanationText(`Round Robin Quantum ($q=${timeQuantum}s$) expired for Queue ${activeLane}. Modulo pointer ($i=(${currIdx}+1)\\bmod 4 = ${nextIdx}$) switched dispatch to Queue ${nextLane}.`);
          addLog('CONTEXT_SWITCH', `RR Time Quantum depleted. Context switch initiated -> Yellow clearance phase -> Advancing pointer to Queue ${nextLane} (idx ${nextIdx}).`);
          return timeQuantum;
        }
        return nextTimer;
      });
    } else if (selectedAlgo === 'PRIORITY_AGING') {
      let highestPriority = 99;
      let targetLane = activeLane;
      let targetCarId = '';

      Object.keys(laneData).forEach((lane) => {
        if (laneData[lane].length > 0) {
          const topCar = laneData[lane][0];
          if (topCar.priority < highestPriority) {
            highestPriority = topCar.priority;
            targetLane = lane;
            targetCarId = topCar.id;
          }
        }
      });

      if (targetLane !== activeLane) {
        setIsYellow(true);
        setContextSwitchCount((c) => c + 1);
        setActiveLane(targetLane);

        if (agingEnabled) {
          setExplanationText(`Preemptive Dispatch: Queue ${targetLane} selected. Process ${targetCarId} reached Priority P${highestPriority} via Dynamic Aging.`);
        } else {
          setExplanationText(`Preemptive Dispatch: Queue ${targetLane} selected. Process ${targetCarId} top of Min-Heap with Priority P${highestPriority}.`);
        }
        addLog('PREEMPTION', `Preemptive Context Switch -> Diverting CPU cycle to Queue ${targetLane} (Highest priority thread P${highestPriority} in Min-Heap).`);
      }
    }
  };

  useEffect(() => {
    if (!isRunning || viewMode === 'COMPARE') return;
    const intervalTime = 1000 / simSpeed;
    const timer = setInterval(() => {
      advanceSimulationStep();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isRunning, simSpeed, activeLane, isYellow, selectedAlgo, timeQuantum, agingEnabled, laneData, viewMode]);

  const handleReset = () => {
    loadScenario(activeScenario);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans p-4 sm:p-6 lg:p-8 space-y-4">
      {/* Header Bar */}
      <header className="flex flex-wrap items-center justify-between border-b border-[#D1D5DB] pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLanding}
            className="px-3 py-1.5 bg-white border border-[#D1D5DB] hover:bg-[#F3F4F6] text-[#374151] rounded-xl text-xs font-semibold transition flex items-center space-x-1"
          >
            <span>← Overview & Manual</span>
          </button>
          <div>
            <h1 className="text-xl font-extrabold font-mono text-[#111827] tracking-tight">
              Traffic<span className="text-[#0284C7]">OS</span> Kernel Simulator Engine
            </h1>
            <p className="text-xs text-[#6B7280] font-mono">Interactive CPU Process Scheduling Laboratory</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <span className="px-3 py-1 bg-[#F0FDF4] text-[#15803D] border border-[#86EFAC] rounded-xl text-xs font-bold">
            Guided Learning Mode
          </span>
        </div>
      </header>

      {/* OS Kernel Metaphor Reference Directory */}
      <OSMetaphorCheatsheet />

      {/* Simulation Playback Controls Toolbar */}
      <PlaybackControls
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        onStep={advanceSimulationStep}
        onReset={handleReset}
        selectedAlgo={selectedAlgo}
        setSelectedAlgo={setSelectedAlgo}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        agingEnabled={agingEnabled}
        setAgingEnabled={setAgingEnabled}
        activeScenario={activeScenario}
        onSelectScenario={loadScenario}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Side-by-Side Compare Mode View */}
      {viewMode === 'COMPARE' ? (
        <CompareAlgorithmsView initialQueues={laneData} />
      ) : (
        /* Single Engine View Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2 space-y-4">
            <HeroIntersectionCanvas
              activeLane={activeLane}
              isYellow={isYellow}
              laneData={laneData}
              signalTimer={signalTimer}
              timeQuantum={timeQuantum}
            />

            {/* Process Thread Injector Controls */}
            <div className="bg-white border border-[#D1D5DB] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono shadow-sm">
              <span className="text-[#4B5563] font-sans font-bold">Inject Process Thread:</span>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => addVehicle('WEST', 'auto')} className="px-2.5 py-1 bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] rounded-lg font-bold">
                  + Thread P3 (Auto)
                </button>
                <button onClick={() => addVehicle('NORTH', 'bike')} className="px-2.5 py-1 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] rounded-lg font-bold">
                  + Thread P5 (Motorcycle)
                </button>
                <button onClick={() => addVehicle('EAST', 'normal')} className="px-2.5 py-1 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] rounded-lg font-bold">
                  + Thread P4 (Sedan)
                </button>
                <button onClick={() => addVehicle('SOUTH', 'bus')} className="px-2.5 py-1 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74] rounded-lg font-bold">
                  + Thread P2 (Transit Bus)
                </button>
                <button onClick={() => addVehicle('WEST', 'emergency')} className="px-2.5 py-1 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5] rounded-lg font-bold">
                  + Interrupt IRQ P1 (Ambulance)
                </button>
              </div>
            </div>

            {/* Learning Mode Panel */}
            <LearningModePanel
              activeScenario={activeScenario}
              selectedAlgo={selectedAlgo}
              agingEnabled={agingEnabled}
              timeQuantum={timeQuantum}
            />
          </div>

          {/* Right Panel: Kernel Dispatch Logs, Telemetry & Data Structure Visualizer */}
          <div className="space-y-4">
            <SchedulerExplanationPanel
              selectedAlgo={selectedAlgo}
              activeLane={activeLane}
              decisionLogs={decisionLogs}
              agingEnabled={agingEnabled}
              explanationText={explanationText}
              verboseMode={verboseMode}
              setVerboseMode={setVerboseMode}
            />

            <PerformanceMetricsCluster
              clearedCount={clearedCount}
              totalWaitAccumulator={totalWaitAccumulator}
              totalTATAccumulator={totalTATAccumulator}
              simTime={simTime}
              contextSwitchCount={contextSwitchCount}
              starvationCount={starvationCount}
              totalInjectedCount={totalInjectedCount}
            />

            {selectedAlgo === 'RR' ? (
              <CircularQueueVisualizer
                activeLane={activeLane}
                timeQuantum={timeQuantum}
                signalTimer={signalTimer}
              />
            ) : (
              <PriorityQueueVisualizer
                laneData={laneData}
                agingEnabled={agingEnabled}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT & ROUTER
// ============================================================================

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash === '#/simulator' ? '/simulator' : '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/simulator') {
        setCurrentRoute('/simulator');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToSimulator = () => {
    window.location.hash = '#/simulator';
    setCurrentRoute('/simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    window.location.hash = '#/';
    setCurrentRoute('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#111827]">
      {currentRoute === '/simulator' ? (
        <SimulationDashboard onBackToLanding={navigateToLanding} />
      ) : (
        <LandingPage onLaunchSimulator={navigateToSimulator} />
      )}
    </main>
  );
}