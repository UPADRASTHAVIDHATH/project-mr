/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mr: {
          bg: '#0a0d14',
          card: '#111726',
          border: '#1f293d',
          accent: '#3b82f6',
          critical: '#ef4444',
          high: '#f97316',
          moderate: '#eab308',
          low: '#22c55e'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}
