import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Skiff.com Design System Theme Palette
        skiff: {
          bg: "#0A0A0B",          // Skiff signature deep obsidian
          sidebar: "#111113",     // Skiff dark sidebar/surface
          surface: "#18181B",     // Skiff dark card surface
          "surface-hover": "#222226",
          border: "#27272A",      // Skiff crisp dark border
          "border-light": "#3F3F46",
          accent: "#FF4405",      // Skiff electric orange/ember accent
          "accent-hover": "#EA3800",
          "accent-subtle": "rgba(255, 68, 5, 0.12)",
          text: "#FAFAFA",        // Skiff crisp pure white text
          "text-secondary": "#A1A1AA", // Skiff muted secondary
          "text-tertiary": "#71717A",  // Skiff subtle tertiary
          blue: "#3B82F6",        // Skiff mail blue
          green: "#10B981",       // Skiff encrypted green
          purple: "#8B5CF6",      // Skiff calendar purple
          light: {
            bg: "#FAFAFA",
            surface: "#FFFFFF",
            border: "#E4E4E7",
            text: "#09090B",
            "text-secondary": "#71717A",
          },
        },
        // Miro Theme Palette (for backward compatibility)
        miro: {
          navy: "#0A0A0B",
          "navy-light": "#18181B",
          yellow: "#FF4405",
          "yellow-hover": "#EA3800",
          blue: "#3B82F6",
          "blue-hover": "#2563EB",
          "blue-light": "#1E293B",
          bg: "#0A0A0B",
          card: "#111113",
          border: "#27272A",
          text: "#FAFAFA",
          "text-muted": "#A1A1AA",
          gray: "#71717A",
        },
        // PostPilot backward compatibility
        postpilot: {
          teal: "#FF4405",
          "teal-dark": "#EA3800",
          "teal-light": "rgba(255, 68, 5, 0.1)",
          orange: "#FF4405",
          "orange-dark": "#EA3800",
          "orange-light": "rgba(255, 68, 5, 0.1)",
          sand: "#0A0A0B",
          cream: "#111113",
          border: "#27272A",
          ink: "#FAFAFA",
          "ink-muted": "#A1A1AA",
          navy: "#0A0A0B",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        skiff: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
        "skiff-md": "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)",
        "skiff-lg": "0 10px 25px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)",
        "skiff-glow": "0 0 24px -4px rgba(255, 68, 5, 0.25)",
        miro: "0 1px 3px 0 rgba(0, 0, 0, 0.4)",
        "miro-lg": "0 10px 25px -3px rgba(0, 0, 0, 0.6)",
        warm: "0 1px 3px 0 rgba(0, 0, 0, 0.4)",
        "warm-lg": "0 10px 25px -3px rgba(0, 0, 0, 0.6)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
} satisfies Config;