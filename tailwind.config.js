/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#171219',
          lighter: '#310D20'
        },
        accent: {
          indigo: '#225560',
          purple: '#F0803C',
          cyan: '#EDF060'
        },
        custom: {
          richBlack: '#050B14',    // Deep Space Black/Blue
          midnightGreen: '#00F0FF', // Neon Cyan
          gargoyleGas: '#8B5CF6',   // Electric Purple
          carrotOrange: '#3B82F6',  // Bright Blue
          darkPurple: '#1E293B'     // Slate (Muted borders)
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
        sans: ['"Inter"', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
