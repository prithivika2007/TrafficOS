import useInView from "../hooks/useInView.js";

function RoundRobinDiagram() {
  const nodes = [
    { label: "N", style: { top: 0, left: "50%", transform: "translate(-50%, -50%)" } },
    { label: "E", style: { top: "50%", right: 0, transform: "translate(50%, -50%)" } },
    { label: "S", style: { bottom: 0, left: "50%", transform: "translate(-50%, 50%)" } },
    { label: "W", style: { top: "50%", left: 0, transform: "translate(-50%, -50%)" } },
  ];
  return (
    <div className="relative mx-auto my-8 h-36 w-36">
      <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.14] motion-safe:animate-ring-spin" />
      <div className="absolute inset-3 rounded-full border border-white/[0.06]" />
      {nodes.map((n) => (
        <div
          key={n.label}
          style={n.style}
          className="absolute flex h-8 w-8 items-center justify-center rounded-full border border-signal-green/30 bg-signal-green/10 font-mono text-xs text-signal-green"
        >
          {n.label}
        </div>
      ))}
    </div>
  );
}

function PriorityAgingDiagram() {
  const lanes = [
    { label: "N", value: 90, aging: false },
    { label: "E", value: 35, aging: true },
    { label: "S", value: 55, aging: true },
    { label: "W", value: 20, aging: true },
  ];
  return (
    <div className="my-8 space-y-3">
      {lanes.map((lane) => (
        <div key={lane.label} className="flex items-center gap-3">
          <span className="w-4 font-mono text-xs text-ink-500">{lane.label}</span>
          <div className="h-2.5 flex-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className={`h-full rounded-full ${lane.value >= 80 ? "bg-signal-green" : "bg-signal-amber/70"}`}
              style={{ width: `${lane.value}%` }}
            />
          </div>
          {lane.aging && <span className="font-mono text-[10px] text-signal-amber/80">+aging</span>}
        </div>
      ))}
    </div>
  );
}

function StrategyCard({ eyebrow, title, description, tag, children, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
      className={`rounded-2xl glass-panel shadow-panel p-7 lg:p-8 transition-all duration-500 hover:border-signal-green/20 hover:shadow-glow ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span className="font-mono text-[11px] tracking-[0.14em] text-ink-500">{eyebrow}</span>
      <h3 className="mt-2 font-display text-2xl font-semibold text-ink-100">{title}</h3>
      <p className="mt-3 text-ink-400 leading-relaxed">{description}</p>
      {children}
      <span className="inline-flex items-center rounded-full border border-white/[0.1] px-3 py-1 font-mono text-[11px] text-ink-500">
        {tag}
      </span>
    </div>
  );
}

export default function SchedulingStrategies() {
  return (
    <section id="algorithms" className="px-6 lg:px-10 py-20 lg:py-28 bg-navy-900/40 border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] tracking-[0.14em] text-ink-500">ALGORITHMS</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink-100">
            Two Scheduling Strategies
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <StrategyCard
            index={0}
            eyebrow="STRATEGY 01"
            title="Round Robin"
            description="Every lane gets an equal turn. The controller cycles through each lane in fixed order, giving no lane priority over another."
            tag="Circular Queue"
          >
            <RoundRobinDiagram />
          </StrategyCard>

          <StrategyCard
            index={1}
            eyebrow="STRATEGY 02"
            title="Priority + Aging"
            description="Busy lanes get priority, while waiting lanes gain priority over time — so no lane is left waiting indefinitely."
            tag="Priority Queue + Aging"
          >
            <PriorityAgingDiagram />
          </StrategyCard>
        </div>
      </div>
    </section>
  );
}
