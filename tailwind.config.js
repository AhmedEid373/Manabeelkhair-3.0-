/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#f83535',
          600: '#c8232c',
          700: '#a81820',
          800: '#8b181f',
          900: '#731820',
          950: '#3f070b',
        },
      },
    },
  },
  plugins: [],
};
