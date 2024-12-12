/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4F46E5',
        'secondary': '#E5E7EB',
        'event-blue': '#3B82F6',
        'event-pink': '#EC4899',
        'event-orange': '#F97316',
        'event-green': '#22C55E',
        'event-purple': '#A855F7',
      },
    },
  },
  plugins: [],
}

