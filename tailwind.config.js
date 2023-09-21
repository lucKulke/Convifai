/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        middle: "990px",
        wide: "1440px",
      },
    },
  },
  plugins: [],
};
