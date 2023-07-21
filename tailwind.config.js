/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1F3F77",
        "secondary": "#0054A6",
        "red": "#ff8080",
        "gray": "#414042",
        "gray_light": "#F1F2F4",
        "white": "#FFFFFF",
        "black": "#000000",
    },
  },
  plugins: [],
}}

