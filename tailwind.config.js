/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './blocks/src/**/*.js',
    './blocks/src/**/*.jsx',
    './blocks/src/**/*.php',
    './src/**/*.js',
    './src/**/*.jsx',
    './templates/**/*.html',
    './core/src/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        ragna: ['"Ragna"', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
