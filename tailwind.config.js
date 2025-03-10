module.exports = {
  content: ["./projects/**/*.{html,ts}", "./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        portrait: {raw: "(orientation: portrait)"},
        landscape: {raw: "(orientation: landscape)"},
        "portrait-mobile": {raw: "(orientation: portrait) and (max-width: 768px)"},
        "landscape-mobile": {raw: "(orientation: landscape) and (max-width: 768px)"},
        xs: "300px",
        s: "500px",
        xl2: "1680px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      fontFamily: {
        custom: ["chivo", 'sans-serif']
      }
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
