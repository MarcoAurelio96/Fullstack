/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iron: {
          900: '#222831', // El tono más oscuro
          800: '#393E46', // Gris oscuro
          accent: '#FFD369', // El amarillo
          100: '#EEEEEE', // Blanco roto
        }
      }
    },
  },
  plugins: [],
}