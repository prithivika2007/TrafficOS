import { useEffect, useState } from "react";

const LINKS = [
  { label: "Landing", href: "#landing" },
  { label: "Kernel Mapping", href: "#kernel" },
  { label: "Lab Manual", href: "#manual" },
  { label: "Scheduling Algorithms", href: "#algorithms" },
  { label: "Simulation", href: "#simulation" },
  { label: "Live CCTV", href: "#live-cctv" },
];

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy-950/80 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 border border-white/[0.08]">
            <span className="absolute h-1.5 w-1.5 rounded-full bg-signal-red top-1.5" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-signal-amber" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-signal-green bottom-1.5 group-hover:animate-pulse-soft" />
          </span>
          <span className="font-display font-semibold text-[15px] tracking-tight text-ink-100">
            TrafficOS
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-5 font-body text-sm text-ink-300">
          {LINKS.map((link) => {
            const tab = link.href === "#live-cctv"
              ? "live"
              : link.href === "#simulation"
                ? "simulator"
                : link.href.slice(1);
            const isActive = activeTab === tab;

            return (
              <li key={link.href}>
                <button
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveTab?.(tab)}
                  className={`relative py-1 transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-signal-green after:transition-all after:duration-300 ${
                    isActive
                      ? "text-ink-100 after:w-full"
                      : "text-ink-300 hover:text-ink-100 after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab?.("live")}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-500/50"
          >
            🌐 Live CCTV
          </button>
          <button
            type="button"
            onClick={() => setActiveTab?.("simulator")}
            className="inline-flex items-center gap-1.5 rounded-full border border-signal-green/30 bg-signal-green/10 px-4 py-1.5 text-sm font-medium text-signal-green transition-all hover:bg-signal-green/15 hover:border-signal-green/50 hover:shadow-glow"
          >
            Start Simulation
          </button>
        </div>
      </nav>
    </header>
  );
}