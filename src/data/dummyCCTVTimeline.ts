export interface CCTVFrameData {
  timestampSec: number;
  counts: { NORTH: number; EAST: number; SOUTH: number; WEST: number };
  emergencyVehicle?: { lane: "NORTH" | "EAST" | "SOUTH" | "WEST"; type: "AMBULANCE" | "FIRE" };
  statusNote: string;
}

export const DUMMY_CCTV_TIMELINE: CCTVFrameData[] = [
  {
    timestampSec: 0,
    counts: { NORTH: 4, EAST: 3, SOUTH: 5, WEST: 2 },
    statusNote: "Normal Flow across all directions.",
  },
  {
    timestampSec: 15,
    counts: { NORTH: 18, EAST: 4, SOUTH: 6, WEST: 3 },
    statusNote: "HEAVY BOTTLE-NECK detected on NORTH approach.",
  },
  {
    timestampSec: 35,
    counts: { NORTH: 14, EAST: 5, SOUTH: 8, WEST: 2 },
    emergencyVehicle: { lane: "NORTH", type: "AMBULANCE" },
    statusNote: "🚨 HARDWARE INTERRUPT: P1 Emergency Ambulance detected in NORTH queue!",
  },
  {
    timestampSec: 50,
    counts: { NORTH: 3, EAST: 12, SOUTH: 15, WEST: 4 },
    statusNote: "Emergency cleared. Queue dispersing.",
  },
];