/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8e6',
          100: '#ffeec2',
          200: '#ffe299',
          300: '#ffd15d',
          400: '#ffbe2a',
          500: '#f5ab05',
          600: '#d98f00',
          700: '#b37305',
          800: '#8c5808',
          900: '#5f3a05',
        },
        accent: {
          50: '#ffede9',
          100: '#ffd4cb',
          200: '#ffb09d',
          300: '#ff876d',
          400: '#ff5e3d',
          500: '#e44722',
          600: '#c4381a',
          700: '#9f2b13',
          800: '#781f0d',
          900: '#4f1307',
        },
        ember: {
          50: '#fef8f3',
          100: '#fdeede',
          200: '#fbd8b8',
          300: '#f8c08b',
          400: '#f39c4d',
          500: '#ea8129',
          600: '#cb671c',
          700: '#a24c13',
          800: '#78360e',
          900: '#4d2207',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

