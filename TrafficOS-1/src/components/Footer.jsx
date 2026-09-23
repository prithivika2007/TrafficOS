export default function Footer() {
  return (
    <footer id="about" className="px-6 lg:px-10 py-12 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-navy-800 border border-white/[0.08]">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
            </span>
            <span className="font-display font-semibold text-ink-100">TrafficOS</span>
          </div>
          <p className="mt-2 text-sm text-ink-500 max-w-sm">
            An OS scheduling simulation for smarter intersections.
          </p>
        </div>

        <div className="font-mono text-[11px] tracking-[0.1em] text-ink-700">
          DSA <span className="text-ink-700/50">•</span> OPERATING SYSTEMS{" "}
          <span className="text-ink-700/50">•</span> SCHEDULING ALGORITHMS
        </div>
      </div>
    </footer>
  );
}
