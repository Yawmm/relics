/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    margin: {
      "gutter-y": 'var(--gutter-y-margin)',
      "gutter-x": 'var(--gutter-x-margin)'
    },
    extend: {
      colors: {
        "main-50":  "#eef2ff",
        "main-100": "#e0e7ff",
        "main-200": "#c7d2fe",
        "main-300": "#a5b4fc",
        "main-400": "#818cf8",
        "main-500": "#6366f1",
        "main-600": "#4f46e5",
        "main-700": "#4338ca",
        "main-800": "#3730a3",
        "main-900": "#312e81",
        "main-950": "#1e1b4b",
      },
    },
  },
  plugins: [],
}