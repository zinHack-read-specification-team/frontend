/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff',
          dark: '#1a1b26'
        },
        secondary: {
          light: '#f3f4f6',
          dark: '#1f2133'
        },
        accent: {
          light: '#2563eb',
          dark: '#3b82f6'
        }
      }
    },
  },
  plugins: [],
} 