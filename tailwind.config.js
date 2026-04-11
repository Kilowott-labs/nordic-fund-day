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
    './designs/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"DM Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
