// tailwind.config.js (ESM)
import scrollbar from 'tailwind-scrollbar';
import typography from '@tailwindcss/typography';


/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [scrollbar,typography],
};
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',  // Indigo-500 as default
      },
    },
  },
}


export default config;
