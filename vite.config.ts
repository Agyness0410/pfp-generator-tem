import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['0xherstory.xyz', 'localhost', '127.0.0.1']
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
