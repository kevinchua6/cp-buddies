/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "main-blue": "#3b82f6",
        "hover-blue": "#1d4ed8",
        "main-light-green": "#EBF8D3",
        "btn-green": "#7FB519",
        "dark-gray": "#385600",
        "hover-dark-gray": "#2D2D2D",
      },
    },
  },
  plugins: [],
};
