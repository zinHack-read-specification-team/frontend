import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://zin-hack-25.antalkon.ru',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
