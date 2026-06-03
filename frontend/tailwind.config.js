/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:    '#7c6fff',
        secondary:  '#00e5ff',
        accent:     '#ff5f9e',
        success:    '#00ff88',
        danger:     '#ff4444',
        dark:       '#06060f',
        surface:    '#0d0d1a',
        'surface-2':'#13132a',
        border:     'rgba(124,111,255,0.15)',
        text:       '#e8e6ff',
        muted:      '#6b6a8a',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'glow':      'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(124,111,255,0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(124,111,255,0.8), 0 0 80px rgba(124,111,255,0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'linear-gradient(135deg, #06060f 0%, #0d0d1a 50%, #06060f 100%)',
      },
    },
  },
  plugins: [],
};
