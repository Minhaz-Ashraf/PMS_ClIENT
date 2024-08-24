/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'input': '#EFEFEF',
        'primary':'  #2E36C0',
        'secondary': '#F7F7F7',
        
       
      },
      fontFamily: {
        head: ['Montserrat', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
