/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#01190e',
          900: '#012414',
          800: '#01381f',
          700: '#014828',
          600: '#02683a',
          500: '#059669',
          400: '#10b981',
          100: '#d1fae5',
          50: '#ecfdf5',
        },
        oat: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EAE5D9',
          300: '#DCD4C3',
          400: '#BDB39E',
          500: '#8C826E',
          900: '#2A2529',
        },
        charcoal: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          200: '#E2E8F0',
          100: '#F1F5F9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
