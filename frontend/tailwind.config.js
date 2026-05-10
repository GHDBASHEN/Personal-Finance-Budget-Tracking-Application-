/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // slate-50
        surface: '#ffffff', // white
        primary: '#4f46e5', // indigo-600
        secondary: '#059669', // emerald-600
        accent: '#c026d3', // fuchsia-600
        danger: '#dc2626', // red-600
      },
    },
  },
  plugins: [],
}
