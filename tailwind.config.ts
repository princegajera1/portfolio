import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dark: {
          DEFAULT: '#0a0a0f',
          lighter: '#12121e',
          card: '#1a1a2e'
        },
        accent: {
          indigo: '#6366f1',
          purple: '#8b5cf6',
          cyan: '#00f0ff'
        },
        custom: {
          richBlack: '#0a0a0f',    // Deep Space Navy
          midnightGreen: '#00F0FF', // Neon Cyan
          gargoyleGas: '#8B5CF6',   // Electric Purple
          carrotOrange: '#6366f1',  // Electric Indigo
          darkPurple: '#1A1A2E'     // Muted borders/slate card
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"]
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
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
