/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f4f3ee",
        card: "#eeedfe",
        cardtext: "#26215c",
        cardlabel: "#534ab7"
      }
    }
  },
  plugins: []
};
