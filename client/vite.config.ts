import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
      "@lib": path.join(__dirname, "./src/lib"),
      "@layout": path.join(__dirname, "./src/layout"),
      "@pages": path.join(__dirname, "./src/pages"),
      "@routes": path.join(__dirname, "./src/routes"),
      "@assets": path.join(__dirname, "./src/assets")
    },
  },
})
