/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#05070C",
          900: "#0A0F1A",
          850: "#0D1420",
          800: "#101A2B",
          700: "#16223A",
        },
        signal: {
          green: "#2FBF82",
          "green-dim": "#1F8F63",
          amber: "#E8A63C",
          red: "#E14F4F",
        },
        ink: {
          100: "#EDF1F8",
          300: "#C4CCDC",
          500: "#8A93A6",
          700: "#5B6478",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(47, 191, 130, 0.35)",
        "glow-amber": "0 0 30px -6px rgba(232, 166, 60, 0.35)",
        "glow-red": "0 0 30px -6px rgba(225, 79, 79, 0.35)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 60px -30px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
        driveNS: {
          "0%": { top: "-10%", opacity: 0 },
          "12%": { opacity: 1 },
          "88%": { opacity: 1 },
          "100%": { top: "108%", opacity: 0 },
        },
        driveSN: {
          "0%": { top: "108%", opacity: 0 },
          "12%": { opacity: 1 },
          "88%": { opacity: 1 },
          "100%": { top: "-10%", opacity: 0 },
        },
        driveEW: {
          "0%": { left: "108%", opacity: 0 },
          "12%": { opacity: 1 },
          "88%": { opacity: 1 },
          "100%": { left: "-10%", opacity: 0 },
        },
        driveWE: {
          "0%": { left: "-10%", opacity: 0 },
          "12%": { opacity: 1 },
          "88%": { opacity: 1 },
          "100%": { left: "108%", opacity: 0 },
        },
        floatUp: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        ringSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-soft": "pulseSoft 2.2s ease-in-out infinite",
        "drive-ns": "driveNS 3.6s linear infinite",
        "drive-sn": "driveSN 3.6s linear infinite",
        "drive-ew": "driveEW 3.6s linear infinite",
        "drive-we": "driveWE 3.6s linear infinite",
        "float-up": "floatUp 0.7s ease-out forwards",
        "ring-spin": "ringSpin 6s linear infinite",
      },
    },
  },
  plugins: [],
};
