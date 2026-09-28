/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        line: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#b8d0ff',
          300: '#8bb1ff',
          400: '#5586ff',
          500: '#2b5cf5',
          600: '#1958c7',
          700: '#1443a0',
          800: '#123680',
          900: '#122e66',
          950: '#0b1120',
        },
        teal: {
          400: '#2dd4e8',
          500: '#00b4d8',
        },
        pass: '#16a34a',
        fail: '#dc2626',
        inspecting: '#f59e0b',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(18, 46, 102, 0.12)',
        glow: '0 0 24px rgba(43, 92, 245, 0.35)',
      },
      backgroundImage: {
        'grid-light': 'linear-gradient(to right, rgba(18,46,102,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,46,102,0.05) 1px, transparent 1px)',
        'grid-dark': 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
      },
      animation: {
        scanline: 'scanline 2.4s linear infinite',
        pulseSoft: 'pulseSoft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
