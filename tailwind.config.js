/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD700',
          dark: '#FFC700',
          light: '#FFE44D'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#2D2D2D'
        }
      }
    },
  },
  plugins: [],
};