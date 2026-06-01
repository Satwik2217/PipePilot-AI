import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0067C7",
        accent: "#F5A623",
        surface: "#F8FAFC"
      }
    }
  },
  plugins: []
};

export default config;
