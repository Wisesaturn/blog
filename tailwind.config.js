/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          dark: '#586E54',
          darker: '#8BAD86',
          main: '#A9D4A3',
          lighter: '#bdecb6',
          light: '#EEFAEB',
        },
      },
      fontFamily: {
        pretandard: ['Pretandard', 'sans-serif'],
      },
      keyframes: {
        push: {
          to: { transform: 'scale(94.25%)' },
        },
        open: {
          from: { transform: 'scale(95%)' },
          to: { transform: 'scale(100%)' },
        },
      },
      animation: {
        push: 'push .15s ease-out forwards',
        open: 'open .25s ease-in-out forwards',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography')],
};
