/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: { max: '1200px' },
      md: '768px',
      lmd: { max: '768px' },
      lg: '1024px',
      llg: { max: '1024px' },
    },
    colors: {
      "white": "#ffffff",
      "black": "#000000",
      "transparent": 'transparent',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Kanit', 'sans-serif'],
        barlowcondensed: ['"barlowcondensed"'],
        'RubikMonoOne-Regular': ['"RubikMonoOne-Regular"'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    function ({ addUtilities }) {
      addUtilities({
        ".partnersShadow": {
          "box-shadow": 'rgba(255, 115, 0, 0.65) 0px 0px 8px 8px;'
        }
      });
    }
  ],
};
