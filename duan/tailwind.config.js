/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vietnam-red': '#730109',
        'vietnam-yellow': '#ffebd3',
        'vietnam-white': '#ffffff',
      },
      fontFamily: {
        'heading': ['Merriweather', 'serif'],
        'body': ['Roboto', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'flag-wave': 'flagWave 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}