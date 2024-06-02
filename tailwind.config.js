/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './.storybook/preview.tsx'],
  darkMode: ['class', '[color-theme="dark"]'],
  theme: {
    extend: {
      maxWidth: {
        layout: '65.5rem;',
      },
      minHeight: {
        screen: 'calc(100vh - 64px);',
      },
      boxShadow: {
        invert: '0 -1px 6px 3.5px rgb(0 0 0 / 0.15);',
      },
      colors: {
        black: '#333333',
        green: {
          dark: '#064e3b',
          darker: '#047857',
          main: '#059669',
          brighter: '#6ee7b7',
          bright: '#d1fae5',
        },
        yellow: '#fffa82',
      },
      fontFamily: {
        pretandard: ['Pretandard', 'sans-serif'],
      },
      keyframes: {
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
        slideRight: 'slideRight .55s ease-in-out forwards',
        bounceCenterAndFadeOut: 'bounceCenterAndFadeOut 2s forwards ease-in-out',
      },
    },
  },
};
