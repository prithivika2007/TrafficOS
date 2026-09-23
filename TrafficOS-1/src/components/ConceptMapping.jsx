import useInView from "../hooks/useInView.js";

const MAPPINGS = [
  { os: "PROCESS", real: "Traffic Lane", note: "Each lane waits its turn to run." },
  { os: "CPU", real: "Green Signal", note: "Only one lane executes at a time." },
  { os: "SCHEDULER", real: "Traffic Controller", note: "Decides which lane runs next." },
  { os: "WAITING TIME", real: "Time at Red Signal", note: "How long a lane sits idle." },
  { os: "AGING", real: "Priority Increases While Waiting", note: "Prevents lane starvation." },
];

function ConceptCard({ item, index }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${index * 80}ms` : "0ms" }}
      className={`group rounded-2xl glass-panel shadow-panel p-5 transition-all duration-500 hover:-translate-y-1 hover:border-signal-green/25 hover:shadow-glow ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span className="font-mono text-[11px] tracking-[0.12em] text-signal-green/80">{item.os}</span>
      <p className="mt-2 font-display text-lg font-medium text-ink-100 leading-snug">{item.real}</p>
      <p className="mt-2 text-sm text-ink-500 leading-relaxed">{item.note}</p>
    </div>
  );
}

export default function ConceptMapping() {
  return (
    <section id="how-it-works" className="px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] tracking-[0.14em] text-ink-500">SYSTEM MODEL</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink-100">
            One Intersection. One Scheduler.
          </h2>
          <p className="mt-4 text-ink-400 leading-relaxed">
            Every concept in classical CPU scheduling has a direct, visible counterpart
            at the intersection. TrafficOS makes that mapping literal.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MAPPINGS.map((item, i) => (
            <ConceptCard key={item.os} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
