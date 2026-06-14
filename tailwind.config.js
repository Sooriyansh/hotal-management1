module.exports = {
  content: ["./views/**/*.ejs", "./public/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: "#D4AF37",
          accent: "#FFD700",
          navy: "#0A192F",
          black: "#050505",
          emerald: "#0F766E",
          ruby: "#9F1239",
          ivory: "#F8F4E8"
        }
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
