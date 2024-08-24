/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "576",
    },
    extend: {
      fontFamily: {
        satoshi: ['"Satoshi"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
