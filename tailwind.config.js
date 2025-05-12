/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'header-bg': 'var(--header-bg)',
        'horse-list-bg': 'var(--horse-list-bg)',
        'program-bg': 'var(--program-bg)',
        'results-bg': 'var(--results-bg)',
      },
      transitionProperty: {
        'left': 'left',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
} 