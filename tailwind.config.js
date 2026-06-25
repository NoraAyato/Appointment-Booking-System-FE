/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#17223b',
        sage: '#4f8f7b',
        coral: '#de7d62',
        wheat: '#f4c46b',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(28, 45, 73, 0.12)',
      },
    },
  },
  plugins: [],
};
