/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "views/*.ejs",
    "views/**/*.ejs"
  ],
  theme: {
    extend: {
      fontFamily: {
          "cairo": ["cairo"]
      }
    },
  },
  plugins: [],
}
