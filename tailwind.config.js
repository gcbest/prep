/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        navy: {
          50: '#eef3f9',
          100: '#d7e2f0',
          200: '#b2c8e2',
          300: '#84a6cf',
          400: '#5883ba',
          500: '#3a66a0',
          600: '#2c5183',
          700: '#25426a',
          800: '#1e3453',
          900: '#16263d',
          950: '#0e1828',
        },
      },
    },
  },
  plugins: [],
};
