import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0F1A14",
        surface: "#1A2E22",
        "surface-elevated": "#243828",
        primary: "#4ADE80",
        accent: "#D4A843",
        "accent-dim": "#A8882F",
        "text-primary": "#F0F4F0",
        "text-secondary": "#A8B8A8",
        "text-muted": "#6B7B6B",
        danger: "#EF6B6B",
      },
      fontFamily: {
        arabic: ["Amiri Quran", "Scheherazade New", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
