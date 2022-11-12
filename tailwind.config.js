/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography')],
};
