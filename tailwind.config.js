/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretandard: ['Pretandard', 'sans-serif'],
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography')],
};
