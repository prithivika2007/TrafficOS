import IntersectionVisual from "./IntersectionVisual.jsx";

export default function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 px-6 lg:px-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-noise-grid opacity-60" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-10 items-center">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-ink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-amber" />
            OS SCHEDULING × REAL-WORLD TRAFFIC
          </span>

          <h1 className="mt-6 font-display font-semibold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-gradient">
            Where Operating Systems Meet the Road.
          </h1>

          <p className="mt-6 text-lg text-ink-300 leading-relaxed">
            An interactive simulation that applies CPU scheduling algorithms to a
            four-way traffic intersection — every lane a process, every green light
            a slice of CPU time.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#simulation"
              className="group inline-flex items-center gap-2 rounded-full bg-signal-green px-6 py-3 font-medium text-navy-950 transition-all hover:shadow-glow hover:-translate-y-0.5"
            >
              Start Simulation
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-6 py-3 font-medium text-ink-100 transition-all hover:border-white/[0.24] hover:bg-white/[0.03]"
            >
              Explore How It Works
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6 font-mono text-xs text-ink-700">
            <span>PROCESS = LANE</span>
            <span className="h-1 w-1 rounded-full bg-ink-700" />
            <span>CPU = SIGNAL</span>
            <span className="h-1 w-1 rounded-full bg-ink-700" />
            <span>SCHEDULER = CONTROLLER</span>
          </div>
        </div>

        <IntersectionVisual />
      </div>
    </section>
  );
}
