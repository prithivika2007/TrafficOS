# TrafficOS — Landing Page

Landing page UI for **"Traffic Signal Controller as an Operating System
Scheduling Problem."** This is presentation-only — no scheduling logic is
wired up yet, so it's ready to later connect to a separate simulation
dashboard.

## Stack

- React 18 + Vite
- Tailwind CSS (custom theme in `tailwind.config.js`)

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Structure

```
src/
  App.jsx                        composes the page
  index.css                      Tailwind directives + base styles
  hooks/
    useInView.js                 scroll-reveal IntersectionObserver hook
  components/
    Navbar.jsx
    Hero.jsx
    IntersectionVisual.jsx       animated four-way intersection (hero visual)
    ConceptMapping.jsx           "One Intersection. One Scheduler."
    SchedulingStrategies.jsx     Round Robin / Priority + Aging cards
    CTASection.jsx
    Footer.jsx
```

## Notes

- All continuous motion (car movement, light pulse, ring spin) respects
  `prefers-reduced-motion` — both via Tailwind's `motion-safe:` variant and a
  media-query check in `IntersectionVisual.jsx` that freezes the demo on a
  single lane for reduced-motion users.
- The intersection cycles through North → East → South → West every ~3.2s as
  a decorative Round-Robin-style demo. It's purely visual — it doesn't call
  into any real scheduling logic.
- Colors, fonts, and animation keyframes are all defined centrally in
  `tailwind.config.js` so the look stays consistent as you add the real
  simulation dashboard.
