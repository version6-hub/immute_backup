/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0B0D12",
          surface: "#11141B",
          elevated: "#171B26",
          line: "#1F2230",
        },
        ink: {
          DEFAULT: "#F5F3EC",
          muted: "#A8ABB8",
          dim: "#555969",
        },
        emerald: { accent: "#00D9A0" },
        gilt: "#D4AF37",
        terra: "#F97B6B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        display: ["Fraunces", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
