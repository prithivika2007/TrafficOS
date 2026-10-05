import { useEffect, useState } from "react";

const LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Algorithms", href: "#algorithms" },
  { label: "Simulation", href: "#simulation" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
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

        <ul className="hidden md:flex items-center gap-8 font-body text-sm text-ink-300">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative py-1 transition-colors hover:text-ink-100 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-signal-green after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#simulation"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-signal-green/30 bg-signal-green/10 px-4 py-1.5 text-sm font-medium text-signal-green transition-all hover:bg-signal-green/15 hover:border-signal-green/50 hover:shadow-glow"
        >
          Start Simulation
        </a>
      </nav>
    </header>
  );
}
