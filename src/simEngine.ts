/**
 * TrafficOS simulation engine (pure TypeScript, no React).
 *
 * Mapping:  lane = process,  vehicle = unit of CPU work,  green light = CPU,
 *           quantum = green-slice length,  all-red gap = context switch.
 */

export type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";
export type Algo = "FCFS" | "SJF" | "RR" | "PRIORITY_AGING";

export const DIRECTIONS: Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];

// Canvas geometry: progress is a % of the canvas (0 = spawn edge, 100 = far edge).
export const STOP_LINE: Record<Direction, number> = { NORTH: 35, SOUTH: 35, EAST: 40, WEST: 40 };
export const SLOT_GAP: Record<Direction, number> = { NORTH: 5.5, SOUTH: 5.5, EAST: 5, WEST: 5 };

export const CAR_SPEED = 35; // % of canvas per second
export const HEADWAY = 1; // seconds between vehicles released on green (service time per vehicle)
export const CLEARANCE = 1; // seconds of all-red between lanes (context-switch cost)
export const AGING_STEP = 2; // a waiting lane gains one priority level every N seconds
export const MAX_PER_LANE = 7;

export interface Car {
  id: number;
  lane: Direction;
  progress: number;
  released: boolean;
  arrival: number;
  arrivalTime: number;
  arrivalIndex: number;
  releasedAt: number | null;
}

export interface Segment {
  lane: Direction;
  start: number;
  end: number | null; // null = still green
}

export interface LaneSetup {
  count: number; // vehicles queued at start (burst length)
  priority: number; // 1 = highest priority
}
export type Setup = Record<Direction, LaneSetup>;

export interface Sim {
  clock: number;
  cars: Car[];
  nextId: number;
  arrivalIndex: number;
  fcfsSchedule: Direction[];
  fcfsScheduleIndex: number;
  nextFCFSArrival: number;
  active: Direction | null;
  sliceElapsed: number;
  releaseTimer: number;
  clearance: number;
  lastLane: Direction | null;
  rrPtr: number;
  waitSince: Record<Direction, number>;
  priority: Record<Direction, number>;
  segments: Segment[];
  contextSwitches: number;
  served: number;
  waitSum: number;
  tatSum: number;
  started: boolean;
  finished: boolean;
}

export const presetSetup = (algo: Algo): Setup => {
  const priorities: Record<Direction, number> =
    algo === "PRIORITY_AGING"
      ? { NORTH: 4, EAST: 1, SOUTH: 3, WEST: 2 }
      : { NORTH: 2, EAST: 2, SOUTH: 2, WEST: 2 };

  const counts: Record<Direction, number> = {
    NORTH: 4,
    EAST: 4,
    SOUTH: 4,
    WEST: 4,
  };

  switch (algo) {
    case "FCFS":
      counts.NORTH = 2;
      counts.EAST = 6;
      counts.SOUTH = 3;
      counts.WEST = 5;
      break;
    case "SJF":
      counts.NORTH = 7;
      counts.EAST = 2;
      counts.SOUTH = 5;
      counts.WEST = 3;
      break;
    case "RR":
      counts.NORTH = 5;
      counts.EAST = 3;
      counts.SOUTH = 6;
      counts.WEST = 4;
      break;
    case "PRIORITY_AGING":
      counts.NORTH = 4;
      counts.EAST = 6;
      counts.SOUTH = 3;
      counts.WEST = 5;
      break;
  }

  return {
    NORTH: { count: counts.NORTH, priority: priorities.NORTH },
    EAST: { count: counts.EAST, priority: priorities.EAST },
    SOUTH: { count: counts.SOUTH, priority: priorities.SOUTH },
    WEST: { count: counts.WEST, priority: priorities.WEST },
  };
};

export const defaultSetup = (): Setup => presetSetup("RR");

const slotPos = (lane: Direction, k: number) => STOP_LINE[lane] - k * SLOT_GAP[lane];
const FCFS_ARRIVAL_ORDER: Direction[] = [
  "EAST", "NORTH", "EAST", "WEST", "SOUTH", "EAST", "WEST", "EAST",
  "SOUTH", "WEST", "NORTH", "EAST", "WEST", "SOUTH", "WEST", "EAST",
];

function makeFCFSSchedule(setup: Setup): Direction[] {
  const remaining = Object.fromEntries(
    DIRECTIONS.map((lane) => [lane, Math.max(0, Math.floor(setup[lane].count))])
  ) as Record<Direction, number>;
  const schedule: Direction[] = [];

  for (const lane of FCFS_ARRIVAL_ORDER) {
    if (remaining[lane] > 0) {
      schedule.push(lane);
      remaining[lane]--;
    }
  }
  while (DIRECTIONS.some((lane) => remaining[lane] > 0)) {
    const lane = DIRECTIONS.find((candidate) => remaining[candidate] > 0);
    if (!lane) break;
    schedule.push(lane);
    remaining[lane]--;
  }
  return schedule;
}

/** Unreleased (waiting) vehicles of a lane, front of the queue first. */
export const queueOf = (sim: Sim, lane: Direction): Car[] =>
  sim.cars.filter((c) => c.lane === lane && !c.released).sort((a, b) => a.id - b.id);

const queueLen = (sim: Sim, lane: Direction) => queueOf(sim, lane).length;

export function createSim(setup: Setup, algo?: Algo): Sim {
  const sim: Sim = {
    clock: 0,
    cars: [],
    nextId: 1,
    arrivalIndex: 0,
    fcfsSchedule: algo === "FCFS" ? makeFCFSSchedule(setup) : [],
    fcfsScheduleIndex: 0,
    nextFCFSArrival: 1,
    active: null,
    sliceElapsed: 0,
    releaseTimer: 0,
    clearance: 0,
    lastLane: null,
    rrPtr: -1,
    waitSince: { NORTH: 0, EAST: 0, SOUTH: 0, WEST: 0 },
    priority: {
      NORTH: setup.NORTH.priority,
      EAST: setup.EAST.priority,
      SOUTH: setup.SOUTH.priority,
      WEST: setup.WEST.priority,
    },
    segments: [],
    contextSwitches: 0,
    served: 0,
    waitSum: 0,
    tatSum: 0,
    started: false,
    finished: false,
  };
  if (algo !== "FCFS") {
    // Initial vehicles are already queued at the stop line (arrival time 0).
    for (const lane of DIRECTIONS) {
      const n = Math.max(0, Math.min(MAX_PER_LANE, setup[lane].count));
      for (let k = 0; k < n; k++) {
        sim.arrivalIndex++;
        sim.cars.push({
          id: sim.nextId++,
          lane,
          progress: slotPos(lane, k),
          released: false,
          arrival: 0,
          arrivalTime: 0,
          arrivalIndex: sim.arrivalIndex,
          releasedAt: null,
        });
      }
    }
  }
  return sim;
}

/** Enqueue one more vehicle on a lane while the simulation is live. */
export function addVehicle(sim: Sim, lane: Direction): boolean {
  const k = queueLen(sim, lane);
  if (k >= MAX_PER_LANE) return false;
  if (k === 0) sim.waitSince[lane] = sim.clock; // lane just became "ready"
  sim.arrivalIndex++;
  sim.cars.push({
    id: sim.nextId++,
    lane,
    progress: 0, // drives in from the edge to the back of the queue
    released: false,
    arrival: sim.clock,
    arrivalTime: sim.clock,
    arrivalIndex: sim.arrivalIndex,
    releasedAt: null,
  });
  sim.finished = false;
  return true;
}

export const effectivePriority = (sim: Sim, lane: Direction, aging: boolean): number => {
  const base = sim.priority[lane];
  if (!aging) return base;
  const waited = sim.clock - sim.waitSince[lane];
  return Math.max(0, base - Math.floor(waited / AGING_STEP));
};

/** The scheduler: choose the next lane to get the green light (or null if nothing is waiting). */
export function pickLane(sim: Sim, algo: Algo, aging: boolean): Direction | null {
  const cands = DIRECTIONS.filter((d) => queueLen(sim, d) > 0);
  if (cands.length === 0) return null;

  switch (algo) {
    case "FCFS": {
      // earliest-arrived waiting vehicle wins
      return cands.reduce((best, d) =>
        queueOf(sim, d)[0].arrivalTime < queueOf(sim, best)[0].arrivalTime ||
        (queueOf(sim, d)[0].arrivalTime === queueOf(sim, best)[0].arrivalTime &&
          queueOf(sim, d)[0].arrivalIndex < queueOf(sim, best)[0].arrivalIndex)
          ? d
          : best
      );
    }
    case "SJF": {
      // shortest remaining queue wins
      return cands.reduce((best, d) => (queueLen(sim, d) < queueLen(sim, best) ? d : best));
    }
    case "RR": {
      for (let i = 1; i <= DIRECTIONS.length; i++) {
        const idx = (sim.rrPtr + i + DIRECTIONS.length) % DIRECTIONS.length;
        if (cands.includes(DIRECTIONS[idx])) return DIRECTIONS[idx];
      }
      return cands[0];
    }
    case "PRIORITY_AGING": {
      return cands.reduce((best, d) => {
        const pd = effectivePriority(sim, d, aging);
        const pb = effectivePriority(sim, best, aging);
        if (pd < pb) return d;
        if (pd === pb && sim.waitSince[d] < sim.waitSince[best]) return d; // longer wait wins ties
        return best;
      });
    }
  }
}

function startSlice(sim: Sim, lane: Direction) {
  if (sim.lastLane && sim.lastLane !== lane) sim.contextSwitches++;
  sim.lastLane = lane;
  sim.active = lane;
  sim.sliceElapsed = 0;
  sim.releaseTimer = HEADWAY; // first vehicle is released immediately
  sim.rrPtr = DIRECTIONS.indexOf(lane);

  const last = sim.segments[sim.segments.length - 1];
  if (last && last.lane === lane && last.end === sim.clock) last.end = null; // merge contiguous slices
  else sim.segments.push({ lane, start: sim.clock, end: null });
}

function endSlice(sim: Sim) {
  const lane = sim.active;
  if (!lane) return;
  const seg = sim.segments[sim.segments.length - 1];
  if (seg && seg.end === null) seg.end = sim.clock;
  sim.waitSince[lane] = sim.clock; // lane goes to the back of the line (aging restarts)
  sim.active = null;
}

function addFCFSArrival(sim: Sim, lane: Direction) {
  const k = queueLen(sim, lane);
  if (k === 0) sim.waitSince[lane] = sim.clock;
  sim.arrivalIndex++;
  sim.cars.push({
    id: sim.nextId++,
    lane,
    progress: 0,
    released: false,
    arrival: sim.clock,
    arrivalTime: sim.clock,
    arrivalIndex: sim.arrivalIndex,
    releasedAt: null,
  });
}

function tick(sim: Sim, h: number, algo: Algo, quantum: number, aging: boolean) {
  if (sim.finished) return;
  sim.started = true;
  sim.clock += h;

  if (algo === "FCFS") {
    while (
      sim.fcfsScheduleIndex < sim.fcfsSchedule.length &&
      sim.clock >= sim.nextFCFSArrival - 1e-9
    ) {
      addFCFSArrival(sim, sim.fcfsSchedule[sim.fcfsScheduleIndex]);
      sim.fcfsScheduleIndex++;
      sim.nextFCFSArrival += 1;
    }
  }

  // 1) All-red gap, then dispatch.
  if (sim.active === null) {
    if (sim.clearance > 0) sim.clearance -= h;
    if (sim.clearance <= 0) {
      sim.clearance = 0;
      const lane = pickLane(sim, algo, aging);
      if (lane) startSlice(sim, lane);
    }
  }

  // 2) Run the current green slice.
  if (sim.active) {
    const lane = sim.active;
    sim.sliceElapsed += h;
    sim.releaseTimer += h;

    const preemptive = algo === "RR" || algo === "PRIORITY_AGING";
    const expired = preemptive && sim.sliceElapsed >= quantum - 1e-9;

    if (!expired) {
      while (sim.releaseTimer >= HEADWAY - 1e-9 && queueLen(sim, lane) > 0) {
        const head = queueOf(sim, lane)[0];
        head.released = true;
        head.releasedAt = sim.clock;
        sim.releaseTimer -= HEADWAY;
      }
    }

    // A lane is only "done" once its last vehicle has had its full service time (HEADWAY) on green.
    const empty = queueLen(sim, lane) === 0 && sim.releaseTimer >= HEADWAY - 1e-9;
    if (expired || empty) {
      endSlice(sim);
      const next = pickLane(sim, algo, aging);
      if (next === lane) startSlice(sim, lane); // same lane keeps going: no context switch
      else if (next !== null) sim.clearance = CLEARANCE;
    }
  }

  // 3) Move the vehicles.
  for (const lane of DIRECTIONS) {
    queueOf(sim, lane).forEach((c, k) => {
      const target = slotPos(lane, k);
      if (c.progress < target) c.progress = Math.min(target, c.progress + CAR_SPEED * h);
    });
  }
  const remaining: Car[] = [];
  for (const c of sim.cars) {
    if (c.released) {
      c.progress += CAR_SPEED * h;
      if (c.progress >= 100) {
        sim.served++;
        sim.waitSum += (c.releasedAt ?? sim.clock) - c.arrival;
        sim.tatSum += sim.clock - c.arrival;
        continue; // left the canvas
      }
    }
    remaining.push(c);
  }
  sim.cars = remaining;

  // 4) Done?
  if (
    sim.cars.length === 0 &&
    sim.active === null &&
    (algo !== "FCFS" || sim.fcfsScheduleIndex >= sim.fcfsSchedule.length)
  ) {
    sim.finished = true;
  }
}

/** Advance the simulation by `dt` seconds (internally split into small steps). */
export function step(sim: Sim, dt: number, algo: Algo, quantum: number, aging: boolean) {
  const H = 0.05;
  let left = dt;
  while (left > 1e-9 && !sim.finished) {
    const h = Math.min(H, left);
    tick(sim, h, algo, quantum, aging);
    left -= h;
  }
}

/** Plain-data copy for React state. */
export function snapshot(sim: Sim) {
  return {
    clock: sim.clock,
    cars: sim.cars.map((c) => ({ ...c })),
    active: sim.active,
    clearing: sim.active === null && sim.clearance > 0,
    lastLane: sim.lastLane,
    segments: sim.segments.map((s) => ({ ...s })),
    contextSwitches: sim.contextSwitches,
    served: sim.served,
    avgWait: sim.served ? sim.waitSum / sim.served : 0,
    avgTat: sim.served ? sim.tatSum / sim.served : 0,
    throughput: sim.clock > 0 ? (sim.served / sim.clock) * 60 : 0,
    queued: {
      NORTH: queueLen(sim, "NORTH"),
      EAST: queueLen(sim, "EAST"),
      SOUTH: queueLen(sim, "SOUTH"),
      WEST: queueLen(sim, "WEST"),
    } as Record<Direction, number>,
    maxLaneWait: Math.max(
      0,
      ...DIRECTIONS.filter((d) => queueLen(sim, d) > 0 && sim.active !== d).map(
        (d) => sim.clock - sim.waitSince[d]
      )
    ),
    started: sim.started,
    finished: sim.finished,
  };
}
export type Snapshot = ReturnType<typeof snapshot>;