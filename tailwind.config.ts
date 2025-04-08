import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Colores principales
        primary: {
          50: "#FF5733", // Color del botón naranja
          600: "#E64A2E", // Hover state
          700: "#CC4229", // Active state
        },
        // Colores de marca
        brand: {
          primary: "#2B3D5C", // Azul oscuro de niux
          accent: "#4CAF50", // Verde del check
        },
        // Modo claro
        light: {
          bg: {
            primary: "#FFFFFF", // Fondo principal
            secondary: "#F8F9FA", // Fondo secundario
            input: "#F1F3F5", // Fondo inputs
          },
          text: {
            primary: "#1E2124", // Texto principal
            secondary: "#4B5563", // Subtítulos
            tertiary: "#6B7280", // Texto de ayuda
          },
          border: {
            light: "#E5E7EB", // Bordes suaves
            medium: "#D1D5DB", // Bordes inputs
          },
        },
        // Modo oscuro
        dark: {
          bg: {
            primary: "#1B2340", // Fondo principal (base)
            secondary: "#232B4A", // Fondo secundario (ligeramente más claro)
            input: "#2A335C", // Fondo inputs (más claro para contraste)
          },
          text: {
            primary: "#FFFFFF", // Texto principal
            secondary: "#E5E7EB", // Subtítulos
            tertiary: "#9CA3AF", // Texto de ayuda
          },
          border: {
            light: "#2F3A66", // Bordes suaves (tono complementario)
            medium: "#3A477D", // Bordes inputs (más claro)
          },
        },
        // Estados
        success: "#4CAF50",
        error: {
          light: "#DC2626",
          dark: "#EF4444",
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
} satisfies Config;
