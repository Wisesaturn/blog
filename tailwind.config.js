/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretandard: ['Pretandard', 'sans-serif'],
      },
      keyframes: {
        open: {
          from: { transform: 'scale(95%)' },
          to: { transform: 'scale(100%)' },
        },
      },
      animation: {
        open: 'open .25s ease-in-out forwards',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography')],
};
