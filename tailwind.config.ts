import type { Config } from "tailwindcss";

/**
 * Design tokens — "Premium Healthcare / Pharmacy" palette.
 * Deep teal as the primary brand color (calm, clinical, trustworthy —
 * avoids the generic SaaS-blue/violet look), amber reserved specifically
 * for "duty/attention" states (mirrors the on-duty pharmacy concept),
 * and a muted red only for destructive/closed states. Keep new UI within
 * this palette rather than introducing ad-hoc colors per page.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#EAF5F2",
          100: "#D2E9E2",
          200: "#A6D3C6",
          300: "#78BBA8",
          400: "#4B9F89",
          500: "#0E7C66", // primary
          600: "#0B6353",
          700: "#0A5647",
          800: "#083F34",
          900: "#062C24",
        },
        amber: {
          50: "#FBF3E1",
          100: "#F5E4BC",
          400: "#DCAE41",
          500: "#C9971F",
          600: "#A87A15",
        },
        danger: {
          50: "#FCECEA",
          100: "#F8D4CF",
          400: "#E2564C",
          500: "#D93A32",
          600: "#B62E27",
        },
        success: {
          50: "#E7F6EE",
          500: "#1E9E63",
          600: "#187F4F",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          border: "rgb(var(--surface-border) / <alpha-value>)",
          muted: "rgb(var(--surface-muted) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(20 32 29 / 0.04), 0 1px 6px -1px rgb(20 32 29 / 0.06)",
        popover: "0 8px 24px -4px rgb(20 32 29 / 0.12), 0 2px 8px -2px rgb(20 32 29 / 0.08)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in-from-start": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
