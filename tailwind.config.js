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
          darker: '#449454',
          main: '#50ad63',
          brighter: '#73FA8E',
          bright: '#BBFACB',
        },
        yellow: '#fffa82',
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
        slideRight: {
          from: {
            opacity: 0,
            transform: 'translateX(-15%)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        bounceCenterAndFadeOut: {
          '0%': {
            transform: 'scale(0%)',
            left: 0,
            top: 0,
            marginTop: '-2.5rem',
            opacity: 0,
          },
          '10%': {
            opacity: 1,
            transform: 'scale(102.75%)',
          },
          '20%': {
            transform: 'scale(100%)',
          },
          '90%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
            left: 0,
            top: 0,
            marginTop: '-2.5rem',
          },
        },
      },
      animation: {
        push: 'push .15s ease-out forwards',
        upDisappear: 'upDisappear .2s ease-in forwards',
        slideRight: 'slideRight .55s ease-in-out forwards',
        skeletonUI: 'skeleton-gradient 1.5s infinite ease-in-out',
        bounceCenterAndFadeOut: 'bounceCenterAndFadeOut 2s forwards ease-in-out',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography')],
};
