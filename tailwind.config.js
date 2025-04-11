/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./**/*.{js,ts,jsx,tsx}",
      "./index.tsx", // ルートの index.tsx を明示的に追加
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }