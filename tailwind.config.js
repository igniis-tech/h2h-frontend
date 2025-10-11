/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#0e3b3a",
        leaf: "#1e5e57",
        gold: "#d7b24a",
        cream: "#fff9ef",
      },
      fontFamily: {
        heading: ['"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.08)"
      }
    },
  },
  plugins: [],
}
