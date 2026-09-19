/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0f7fc',
          100: '#e0eff9',
          200: '#b9def2',
          300: '#7bc4e7',
          400: '#38a5d8',
          500: '#1489c4',
          600: '#0b6ea3',
          700: '#0a5883',
          800: '#0c4b6e',
          900: '#0c2e44',
          950: '#061a29',
        },
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          card: '#ffffff',
          cardMuted: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 1px 3px 0 rgba(12, 46, 68, 0.05), 0 1px 2px -1px rgba(12, 46, 68, 0.05)',
        'premium-hover': '0 10px 25px -5px rgba(12, 46, 68, 0.08), 0 8px 10px -6px rgba(12, 46, 68, 0.04)',
        'glow-ocean': '0 0 25px -5px rgba(14, 137, 196, 0.35)',
        'glow-aqua': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(34, 197, 94, 0.35)',
      },
      animation: {
        'ripple-slow': 'ripple 4s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'ripple-delayed': 'ripple 4s cubic-bezier(0, 0.2, 0.8, 1) 2s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
