const theme = require('tailwindcss/defaultTheme');

theme.colors.green;

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...theme.colors,
      primary: { ...theme.colors.green, 500: '#1f784c' },
    },
    extend: {
      height: {
        84: '21rem',
        124: '31rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
