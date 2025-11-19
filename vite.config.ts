import { fileURLToPath, URL } from 'node:url'

import path from "path"
import tailwindcss from "@tailwindcss/vite"

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  server: {
    hmr: {
      overlay: false,
    },
    port: 5173,
    proxy: {
      // Proxy semua request API ke Express
      '/api': {
        target: 'http://localhost:8000', // ← ganti dengan port Express kamu
        changeOrigin: true,
        secure: false,
      },
      // Proxy WebSocket (penting untuk socket.io, ws, dll)
      '/socket.io': {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true,
      },
      // Kalau pakai ws biasa (bukan socket.io)
      '/ws': {
        target: 'http://localhost:8000',
        ws: true,
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
