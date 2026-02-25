/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#0b0f1a',
        surface:  '#111827',
        surface2: '#1a2236',
        border:   '#1e2d47',
        accent:   '#00d4ff',
        accent2:  '#7b61ff',
        green:    '#00e5a0',
        red:      '#ff4d6a',
        muted:    '#64748b',
        tagbg:    '#0d1f35',
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        mono:  ['DM Mono', 'monospace'],
        syne:  ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
