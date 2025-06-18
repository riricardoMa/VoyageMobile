/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Custom brand colors from Fuschia and Iris palette
        fuschia: {
          'rodeo-dust': '#C6B29A',    // rgb(195, 179, 157)
          'vanilla': '#d5c8b8',       // rgb(213, 200, 184)
          'dust-storm': '#e1d6ca',    // rgb(225, 214, 202)
        },
        iris: {
          'parchment': '#f1e5da',     // rgb(241, 229, 218)
          'bone': '#e3d1c6',          // rgb(227, 209, 198)
        },
        schemes: {
          'error': '#B3261E',
          'on-error-container': '#852221',
        }
      },
    },
  },
  plugins: [],
}; 