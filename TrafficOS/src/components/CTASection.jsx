export default function CTASection() {
  return (
    <section id="simulation" className="px-6 lg:px-10 py-24 lg:py-32">
      <div className="max-w-4xl mx-auto text-center rounded-[28px] glass-panel shadow-panel px-8 py-16 lg:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-noise-grid opacity-40" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-signal-green/20 blur-[100px]" />

        <div className="relative">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink-100">
            Ready to see the scheduler in action?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-ink-400 leading-relaxed">
            Simulate traffic, visualize scheduling decisions, and compare the
            performance of two classic Operating System algorithms.
          </p>

          <a
            href="#simulation"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-signal-green px-7 py-3.5 font-medium text-navy-950 transition-all hover:shadow-glow hover:-translate-y-0.5"
          >
            Launch TrafficOS
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
