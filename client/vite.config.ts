import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/reservations': 'https://localhost:3000'
    }
  }
})
