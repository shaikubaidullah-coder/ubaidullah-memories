import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper, #faf6ee)",
        "accent-pink": "var(--color-accent-pink, #d47a8f)",
        "accent-yellow": "var(--color-accent-yellow, #f2ca65)",
        "accent-blue": "var(--color-accent-blue, #7eafce)",
        "accent-green": "var(--color-accent-green, #89ac94)",
        "text-ink": "var(--color-text-ink, #2c2520)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        handwritten: ["var(--font-architects-daughter)", "cursive"],
      },
      animation: {
        shake: "shake 0.4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "25%": { transform: "translateX(-4px) rotate(-3deg)" },
          "75%": { transform: "translateX(4px) rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
