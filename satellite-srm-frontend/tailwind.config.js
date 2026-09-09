/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        srm: {
          base:     '#020c1b',
          surface:  '#071525',
          elevated: '#0d1f38',
          border:   'rgba(255,255,255,0.07)',
          cyan:     '#00d4ff',
          blue:     '#3b82f6',
          emerald:  '#10b981',
        },
        space: {
          darkest:  '#020c1b',
          dark:     '#071525',
          card:     '#0d1f38',
          border:   '#1a3352',
        },
        primary: {
          DEFAULT: '#00d4ff',
          dark:    '#0099cc',
          light:   '#33ddff',
        },
        accent: {
          cyan:    '#00d4ff',
          blue:    '#3b82f6',
          violet:  '#8b5cf6',
          emerald: '#10b981',
          amber:   '#f59e0b',
          red:     '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', '14px'],
      },
      spacing: {
        'nav': '68px',
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-srm':      'linear-gradient(135deg, #00d4ff 0%, #3b82f6 50%, #8b5cf6 100%)',
        'gradient-hero':     'linear-gradient(160deg, #020c1b 0%, #071525 40%, #0a1a2e 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.7' },
          '50%':      { transform: 'scale(1.12)', opacity: '0.2' },
        },
        'orbit': {
          '0%':   { transform: 'rotate(0deg) translateX(110px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(110px) rotate(-360deg)' },
        },
        'scan': {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0.7' },
          '50%':      { transform: 'translateY(300%)',  opacity: '0.2' },
        },
        'progress': {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        'slide-right': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'counter-up': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up':   'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in':      'fade-in 0.4s ease both',
        'float':        'float 5s ease-in-out infinite',
        'shimmer':      'shimmer 1.8s linear infinite',
        'pulse-ring':   'pulse-ring 2.5s ease-in-out infinite',
        'orbit':        'orbit 16s linear infinite',
        'scan':         'scan 2.5s ease-in-out infinite',
        'slide-right':  'slide-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'counter-up':   'counter-up 0.5s ease both',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 12s linear infinite',
      },
      boxShadow: {
        'glow-cyan':    '0 0 30px rgba(0, 212, 255, 0.25)',
        'glow-cyan-lg': '0 0 60px rgba(0, 212, 255, 0.2)',
        'glow-blue':    '0 0 30px rgba(59, 130, 246, 0.2)',
        'card':         '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover':   '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 212, 255, 0.08)',
        'glass':        '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.07)',
        'btn-cyan':     '0 0 20px rgba(0, 212, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3)',
        'btn-cyan-lg':  '0 0 36px rgba(0, 212, 255, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      dropShadow: {
        'glow-cyan': ['0 0 8px rgba(0, 212, 255, 0.5)', '0 0 20px rgba(0, 212, 255, 0.3)'],
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        'xs': '4px',
      },
    },
  },
  plugins: [],
};
