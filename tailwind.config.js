/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // Add if you have a components folder
  ],
  theme: {
    extend: {
      colors: {
        navy: "#00032e",
        gold: "#edbf6d",
      },
    },
  },
  plugins: [],
};
