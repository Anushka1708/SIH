/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDeep: '#0f172a',  // Dark background shade
        surface: '#1e293b', // Card/Surface background shade
        growth: '#22c55e',  // Brand accent green/growth color
        clay: '#e2e8f0',    // Muted grey/clay shade
      },
      fontFamily: {
        head: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}