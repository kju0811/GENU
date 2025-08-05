import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 우선 3000사용
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:9093', // ← 백엔드서버에 맞게 변경
    },
  },
  build: {
    outDir: 'frontend_build',
  },
})
