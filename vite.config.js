import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/stack-lab/' : '/',
  server: {
    port: 5180,
    host: '127.0.0.1',
  },
}))
