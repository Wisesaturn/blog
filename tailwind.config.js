/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        layout: '48rem',
      },
      boxShadow: {
        invert: '0 -1px 6px 3.5px rgb(0 0 0 / 0.15);',
      },
      colors: {
        black: '#333333',
        green: {
          dark: '#326E3E',
          darker: '#50ad63',
          main: '#86BB92',
          brighter: '#9DFAB3',
          bright: '#BBFACB',
        },
      },
      fontFamily: {
        pretandard: ['Pretandard', 'sans-serif'],
      },
      keyframes: {
        push: {
          to: {
            backgroundColor: 'rgba(233, 233, 233, 0.3)',
            transform: 'scale(94.25%)',
            brightness: '65%',
            opacity: '0.8',
          },
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
