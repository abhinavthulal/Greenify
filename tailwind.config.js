/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          dark: '#0F7A35',
          medium: '#2F9E44',
          light: '#74C69D',
        },
      },
    },
  },
  plugins: [],
}
