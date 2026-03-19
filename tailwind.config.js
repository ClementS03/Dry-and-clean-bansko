/** @type {import('tailwindcss').Config} */
const { colors, fonts } = require('./config/design')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: colors.gold, light: colors.goldLight, dark: colors.goldDark, muted: `${colors.gold}20` },
        ink: { DEFAULT: colors.ink, 800: colors.ink800, 700: colors.ink700, 600: colors.ink600, 500: colors.ink500 },
        cream: { DEFAULT: colors.cream, dark: colors.creamDark },
      },
      fontFamily: {
        display: [`'${fonts.display}'`, 'sans-serif'],
        body:    [`'${fonts.body}'`, 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,196,0,0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(245,196,0,0)' } },
        float:     { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
