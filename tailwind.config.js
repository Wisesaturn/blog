/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        invert: '0 -1px 6px 3.5px rgb(0 0 0 / 0.15);',
      },
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
        upDisappear: {
          to: { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        push: 'push .15s ease-out forwards',
        upDisappear: 'upDisappear .2s ease-in forwards',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography')],
};
