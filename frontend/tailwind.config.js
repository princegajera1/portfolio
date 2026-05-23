/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7c6fff', // premium purple
        secondary: '#00e5ff', // premium cyan
        accent: '#ff5f9e', // premium pink
        success: '#00ff88', // premium green
        danger: '#ff4444', // premium red
        dark: '#06060f', // bg
        surface: '#0d0d1a', // surface
        'surface-2': '#13132a', // surface2
        border: 'rgba(124,111,255,0.15)',
        text: '#e8e6ff',
        muted: '#6b6a8a'
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Poppins', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
        'typewriter': 'typewriter 3s steps(40) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px #6C63FF40' },
          '100%': { boxShadow: '0 0 40px #6C63FF80, 0 0 80px #6C63FF40' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #0A0A0F 100%)',
      },
    },
  },
  plugins: [],
}
