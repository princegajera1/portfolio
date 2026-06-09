/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design System Colors
        bg: {
          dark: '#0A0A0F',
          light: '#F8F8FC',
        },
        surface: {
          dark: '#111118',
          light: '#FFFFFF',
        },
        primary: '#6C63FF', // Electric violet-purple
        secondary: '#00D4FF', // Cyan-electric
        muted: {
          dark: '#1A1A2E',
          light: '#ECECF4',
        },
        border: {
          dark: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(0, 0, 0, 0.08)',
        },
        text: {
          primary: {
            dark: '#F0F0FF',
            light: '#0A0A1A',
          },
          secondary: {
            dark: '#8888AA',
            light: '#555577',
          }
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 40px rgba(108, 99, 255, 0.15)',
        'glow-secondary': '0 0 40px rgba(0, 212, 255, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
