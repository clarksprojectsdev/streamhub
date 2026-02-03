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
        surface: "#0f0f12",
        surfaceElevated: "#18181c",
        accent: "#e11d48",
        accentHover: "#f43f5e",
        muted: "#71717a",
      },
    },
  },
  plugins: [],
};
export default config;
