/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': 'var(--font-space-grotesk)',
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        '[dir="rtl"]': {
          direction: 'rtl',
        },
      })
    },
  ],
  corePlugins: {
    direction: true,
  },
}
