 /** @type {import('tailwindcss').Config} */
 export default {
   darkMode: "class",
   content: ["./index.html", "./src/**/*.{js,jsx}"],
   theme: {
     extend: {
colors: {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  violet: "#7C3AED",
  bg: "#F4F5FB",
  sidebar1: "#151235",
  sidebar2: "#211B4E",
  muted: "#6B7280",
  line: "#ECEBF5",   // renamed from "border"
  green: "#16A34A",
  greenSoft: "#E8F8EE",
  amber: "#D97706",
  amberSoft: "#FEF3E2",
  red: "#DC2626",
  redSoft: "#FDECEC",
},
       fontFamily: {
         sans: ["Inter", "sans-serif"],
         mono: ["Space Mono", "monospace"],
       },
       borderRadius: {
         xl2: "18px",
       },
     },
  },
   plugins: [],
};

