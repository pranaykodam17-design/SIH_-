/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B2B3A',
        slate: '#64748B',
        wash: '#F0F5FA',
        surface: '#FFFFFF',
        'band-blue': '#3B7DD8',
        'band-nir': '#C7453A',
        border: '#D4DEE8',
        // Preserve srm tokens for backward compat during migration
        srm: {
          base: '#F0F5FA',
          surface: '#FFFFFF',
          elevated: '#F7FAFD',
          border: '#D4DEE8',
          cyan: '#3B7DD8',
          blue: '#3B7DD8',
          emerald: '#16A34A',
        },
        space: {
          darkest: '#FFFFFF',
          dark: '#F7FAFD',
          card: '#FFFFFF',
          border: '#D4DEE8',
        },
        primary: {
          DEFAULT: '#3B7DD8',
          dark: '#2E6BC4',
          light: '#5B9AE8',
        },
        accent: {
          cyan: '#3B7DD8',
          blue: '#3B7DD8',
          violet: '#7C5CCC',
          emerald: '#16A34A',
          amber: '#D97706',
          red: '#C7453A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', '14px'],
      },
      spacing: {
        'nav': '64px',
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
        '3xl': '8px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease both',
        'slide-up': 'slide-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'shimmer': 'shimmer 1.8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'glass': '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
