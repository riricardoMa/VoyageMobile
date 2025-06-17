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
          'rodeo-dust': '#c3b39d',    // rgb(195, 179, 157)
          'vanilla': '#d5c8b8',       // rgb(213, 200, 184)
          'dust-storm': '#e1d6ca',    // rgb(225, 214, 202)
        },
        iris: {
          'parchment': '#f1e5da',     // rgb(241, 229, 218)
          'bone': '#e3d1c6',          // rgb(227, 209, 198)
        },
        // You can also use these as semantic color names
        primary: '#c3b39d',           // Fuschia Rodeo Dust
        secondary: '#d5c8b8',         // Fuschia vanilla
        accent: '#e1d6ca',            // Fuschia Dust Storm
        background: '#f1e5da',        // Iris parchment
        surface: '#e3d1c6',           // Iris Bone
        'auth-background': '#f3f0eb', // Auth welcome screen background (243, 240, 235)
        'auth-login-text': '#333333', // Auth login text (51, 51, 51)
      },
    },
  },
  plugins: [],
}; 