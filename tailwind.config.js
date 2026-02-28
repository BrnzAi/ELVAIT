/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode removed — site is light-first
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#D2FFB8',
          red: '#FF4C4C',
          grey: '#777777',
          'grey-medium': '#B4B4B4',
          'grey-light': '#F0F0F0',
          black: '#000000',
          white: '#FFFFFF',
        },
        go: {
          light: '#22c55e',
          DEFAULT: '#16a34a',
          dark: '#15803d',
        },
        fixfirst: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        nogo: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
