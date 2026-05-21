/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D0D0F',
          secondary: '#141416',
          elevated: '#1C1C20',
        },
        border: {
          subtle: '#2A2A30',
          strong: '#3D3D45',
        },
        text: {
          primary: '#F0F0F2',
          secondary: '#9090A0',
          muted: '#5A5A68',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          amber: '#F59E0B',
          green: '#10B981',
          red: '#EF4444',
          teal: '#14B8A6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
