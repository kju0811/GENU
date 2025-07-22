/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          fadeInUp: {
            '0%': { opacity: 0, transform: 'translateY(40px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        },
        animation: {
          fadeInUp: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        },
      },
    },    
    plugins: [
        require("daisyui")
    ],
    daisyui: {
      themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
      darkTheme: "dark", // name of one of the included themes for dark mode
      base: true, // applies background color and foreground color for root element by default
      styled: true, // include daisyUI colors and design decisions for all components
      utils: true, // adds responsive and modifier utility classes
      prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
      logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
      themeRoot: ":root", // The element that receives theme color CSS variables
    },
  }