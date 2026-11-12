/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Charcoal: Signature deep graphite & midnight slate
        charcoal: {
          50: '#f6f7f8',
          100: '#eaecf0',
          200: '#d5d9e0',
          300: '#aeb6c4',
          400: '#7c889d',
          500: '#566276',
          600: '#3e4756',
          700: '#2d3340',
          800: '#212631',
          900: '#181b22', // Primary Dark Charcoal
          950: '#0f1116', // Midnight Charcoal
        },
        // 2. Sand: Warm desert sand & elegant cream beige
        sand: {
          50: '#faf8f5',
          100: '#f5ebe1', // Light warm sand
          200: '#ede0d4', // Classic sand
          300: '#dfcbba',
          400: '#cdb49c', // Accent sand border
          500: '#b8997e',
          600: '#9e7e64',
          700: '#7e624c',
          800: '#644e3d',
          900: '#4e3c2f',
          950: '#2b2018',
        },
        // 3. Electric Blue: Vibrant high-tech university cyan-blue
        electric: {
          50: '#eef6ff',
          100: '#d8ecff',
          200: '#b8deff',
          300: '#80c7ff',
          400: '#3da5ff',
          500: '#0a84ff',
          600: '#0066ff', // Signature Electric Blue
          700: '#0052d4',
          800: '#0041a8',
          900: '#003588',
          950: '#001e54',
        },
        // Seamless aliases so all existing components immediately adapt
        campus: {
          50: '#eef6ff',
          100: '#d8ecff',
          200: '#b8deff',
          300: '#80c7ff',
          400: '#3da5ff',
          500: '#0a84ff',
          600: '#0066ff',
          700: '#0052d4',
          800: '#0041a8',
          900: '#003588',
          950: '#001e54',
        },
        navy: {
          800: '#212631',
          900: '#181b22', // Charcoal 900
          950: '#0f1116', // Charcoal 950
        },
        blue: {
          50: '#eef6ff',
          100: '#d8ecff',
          200: '#b8deff',
          300: '#80c7ff',
          400: '#3da5ff',
          500: '#0a84ff',
          600: '#0066ff', // Electric Blue
          700: '#0052d4',
          800: '#0041a8',
          900: '#003588',
          950: '#001e54',
        },
        status: {
          submitted: '#0066ff', // Electric Blue
          underReview: '#8b5cf6', // Violet
          inProgress: '#f59e0b', // Amber
          resolved: '#10b981', // Emerald
          rejected: '#ef4444', // Red
          escalated: '#dc2626', // Crimson
          reopened: '#d97706', // Warm Sand/Amber
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
