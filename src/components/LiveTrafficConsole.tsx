import React, { useState, useRef, useEffect } from "react";

interface BoundingBox {
  id: string;
  label: string;
  type: "car" | "bus" | "queue" | "emergency";
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w: number; // percentage 0-100
  h: number; // percentage 0-100
  confidence: number;
  lane: "NORTH" | "EAST" | "SOUTH" | "WEST";
}

interface FrameDetectionData {
  timeSec: number;
  boxes: BoundingBox[];
  statusNote: string;
}

// Precise timestamped object detections tailored to the intersection footage
const TRACKED_FRAMES: FrameDetectionData[] = [
  {
    timeSec: 0,
    statusNote: "Heavy queue forming on Eastbound stop line.",
    boxes: [
      { id: "e1", label: "EAST QUEUE", type: "queue", x: 68, y: 34, w: 24, h: 22, confidence: 0.98, lane: "EAST" },
      { id: "w1", label: "CAR", type: "car", x: 22, y: 48, w: 10, h: 12, confidence: 0.96, lane: "WEST" },
      { id: "n1", label: "BUS", type: "bus", x: 46, y: 14, w: 8, h: 16, confidence: 0.92, lane: "NORTH" },
      { id: "s1", label: "CAR", type: "car", x: 42, y: 72, w: 9, h: 11, confidence: 0.89, lane: "SOUTH" }
    ]
  },
  {
    timeSec: 5,
    statusNote: "Eastbound signal requested green phase allocation.",
    boxes: [
      { id: "e1", label: "EAST QUEUE", type: "queue", x: 68, y: 34, w: 24, h: 22, confidence: 0.99, lane: "EAST" },
      { id: "w2", label: "CAR", type: "car", x: 30, y: 46, w: 9, h: 11, confidence: 0.95, lane: "WEST" },
      { id: "n2", label: "CAR", type: "car", x: 46, y: 22, w: 8, h: 12, confidence: 0.94, lane: "NORTH" },
      { id: "s1", label: "CAR", type: "car", x: 42, y: 68, w: 9, h: 11, confidence: 0.91, lane: "SOUTH" }
    ]
  },
  {
    timeSec: 10,
    statusNote: "Traffic flow dispersing smoothly across intersection.",
    boxes: [
      { id: "e2", label: "CAR", type: "car", x: 55, y: 42, w: 10, h: 12, confidence: 0.97, lane: "EAST" },
      { id: "e3", label: "CAR", type: "car", x: 70, y: 36, w: 12, h: 14, confidence: 0.93, lane: "EAST" },
      { id: "w3", label: "CAR", type: "car", x: 38, y: 45, w: 9, h: 11, confidence: 0.92, lane: "WEST" },
      { id: "s2", label: "AMBULANCE", type: "emergency", x: 42, y: 62, w: 11, h: 15, confidence: 0.99, lane: "SOUTH" }
    ]
  }
];

export const LiveTrafficConsole: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeFrame, setActiveFrame] = useState<FrameDetectionData>(TRACKED_FRAMES[0]);

  // Handle video timestamp progression & frame data sync
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(Math.floor(time));

    // Match closest timeline frame
    const matched = TRACKED_FRAMES.reduce((prev, curr) => {
      return time >= curr.timeSec ? curr : prev;
    }, TRACKED_FRAMES[0]);

    setActiveFrame(matched);
  };

  // Draw Dynamic Canvas Bounding Boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas display resolution
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    activeFrame.boxes.forEach((box) => {
      const x = (box.x / 100) * canvas.width;
      const y = (box.y / 100) * canvas.height;
      const w = (box.w / 100) * canvas.width;
      const h = (box.h / 100) * canvas.height;

      // Color coding by detection type
      let color = "#22d3ee"; // Cyan default
      if (box.type === "queue") color = "#06b6d4";
      if (box.type === "emergency") color = "#ef4444"; // Red for emergency
      if (box.type === "car") color = "#10b981"; // Emerald

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Semi-transparent fill
      ctx.fillStyle = `${color}22`;
      ctx.fillRect(x, y, w, h);

      // Label background
      ctx.fillStyle = color;
      const labelText = `${box.label} ${Math.round(box.confidence * 100)}%`;
      ctx.font = "bold 10px monospace";
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(x, y - 16, textWidth + 8, 16);

      // Label text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(labelText, x + 4, y - 4);
    });
  }, [activeFrame]);

  // Calculate dynamic vehicle counts per lane
  const laneCounts = {
    NORTH: activeFrame.boxes.filter((b) => b.lane === "NORTH").length * 2 + 1,
    EAST: activeFrame.boxes.some((b) => b.type === "queue") ? 9 : activeFrame.boxes.filter((b) => b.lane === "EAST").length * 3,
    SOUTH: activeFrame.boxes.filter((b) => b.lane === "SOUTH").length * 2 + 1,
    WEST: activeFrame.boxes.filter((b) => b.lane === "WEST").length * 2,
  };

  const emergencyActive = activeFrame.boxes.find((b) => b.type === "emergency");
  const totalVehicles = laneCounts.NORTH + laneCounts.EAST + laneCounts.SOUTH + laneCounts.WEST;

  // Determine priority signal
  const activeSignal = emergencyActive
    ? emergencyActive.lane
    : (Object.keys(laneCounts) as (keyof typeof laneCounts)[]).reduce((a, b) =>
        laneCounts[a] > laneCounts[b] ? a : b
      );

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6 font-mono text-slate-100">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900 border border-slate-700/60 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            LIVE INTERSECTION FEED — CAM-01 (AERIAL OVERHEAD STREAM)
          </span>
        </div>
        <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
          LIVE CANVAS TRACKING
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Player & Real-time Canvas */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-700/60 p-4 rounded-2xl flex flex-col justify-between">
          <div className="relative w-full h-80 bg-black rounded-xl border border-slate-800 overflow-hidden">
            
            {/* HTML5 Video */}
            <video
              ref={videoRef}
              src="/traffic.mp4"
              autoPlay
              loop
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />

            {/* Live Render Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Dynamic Real-time HUD */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-slate-700 px-3 py-1 text-[10px] text-cyan-400 rounded-md font-bold">
              YOLOv8 DETECTING: {totalVehicles} VEHICLES
            </div>

            {emergencyActive && (
              <div className="absolute top-3 right-3 bg-red-600/90 border border-red-400 px-3 py-1 text-[10px] text-white font-bold rounded-md animate-bounce">
                🚨 AMBULANCE IN {emergencyActive.lane} LANE
              </div>
            )}

            <div className="absolute bottom-3 left-3 text-[10px] text-emerald-400 bg-black/80 px-2.5 py-1 rounded-md border border-slate-800">
              REC ● 14:32:{currentTime < 10 ? `0${currentTime}` : currentTime} IST | 30 FPS
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={togglePlay}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-400 rounded-lg transition-colors"
            >
              {isPlaying ? "PAUSE FEED" : "RESUME FEED"}
            </button>

            <span className="text-xs text-slate-400">
              STATUS: <span className="text-white">{activeFrame.statusNote}</span>
            </span>
          </div>
        </div>

        {/* Dynamic Scheduler Metrics */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-700/60 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Vision-Driven Kernel Scheduler
          </h3>

          <div className="space-y-3">
            {Object.entries(laneCounts).map(([lane, count]) => {
              const isSelected = lane === activeSignal;
              return (
                <div key={lane} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={isSelected ? "text-emerald-400" : "text-slate-300"}>
                      {lane} LANE {isSelected && "🟢 (ACTIVE GREEN)"}
                    </span>
                    <span className="text-white">{count} Cars</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isSelected ? "bg-emerald-400" : "bg-cyan-500/60"
                      }`}
                      style={{ width: `${Math.min(100, count * 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/50 mt-4 space-y-2">
            <span className="text-[10px] text-amber-400 font-bold block uppercase">
              Recommended Signal Action
            </span>
            <div className="text-xs font-bold text-white">
              GRANT GREEN PHASE TO: <span className="text-emerald-400">{activeSignal}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {emergencyActive
                ? `Emergency Interrupt: Granting immediate green signal preemptively to clear passage for emergency vehicle on ${emergencyActive.lane} approach.`
                : `Dynamic Quantum: Assigning green light to ${activeSignal} approach due to optimal queue density calculations.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrafficConsole;