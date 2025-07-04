/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: '#B19CD9',
        secondary: '#FFE4E1',
        accent: '#87CEEB',
        surface: '#F0E6FF',
        background: '#FAF9FF',
        success: '#98D8AA',
        warning: '#FFD3B6',
        error: '#FFB3BA',
        info: '#A8E6CF'
      },
      boxShadow: {
        'clay': '0 8px 32px rgba(177, 156, 217, 0.15), inset 0 4px 8px rgba(255, 255, 255, 0.8)',
        'clay-lg': '0 16px 48px rgba(177, 156, 217, 0.2), inset 0 6px 12px rgba(255, 255, 255, 0.8)',
        'clay-pressed': '0 4px 16px rgba(177, 156, 217, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
        'soft': '0 8px 32px rgba(177, 156, 217, 0.15)',
        'soft-lg': '0 16px 48px rgba(177, 156, 217, 0.2)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'bounce-soft': 'bounce 1s ease-in-out infinite',
        'pulse-soft': 'pulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}