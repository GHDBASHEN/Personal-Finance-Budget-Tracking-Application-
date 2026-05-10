/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // slate-900
        surface: '#1e293b', // slate-800
        primary: '#3b82f6', // blue-500
        secondary: '#10b981', // emerald-500
        accent: '#8b5cf6', // violet-500
        danger: '#ef4444', // red-500
      },
    },
  },
  plugins: [],
}
