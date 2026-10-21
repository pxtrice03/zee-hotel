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
      '@': path.join(__dirname, './src'),
      '@components': path.join(__dirname, './src/components'),
      '@layout': path.join(__dirname, './src/layout'),
      '@routes': path.join(__dirname, './src/routes'),
      '@styles': path.join(__dirname, './src/styles')
    }
  },
  server: {
    proxy: {
      '/api': 'https://localhost:3000'
    }
  }
})
