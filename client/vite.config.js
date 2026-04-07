import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Where the Node API runs (must match server/.env PORT). Default 5000.
  const env = loadEnv(mode, process.cwd(), '')
  // Match server PORT (default 5050). Port 5000 on macOS is often AirPlay → 403 from wrong service.
  const apiTarget =
    env.VITE_API_PROXY_TARGET || env.VITE_API_URL || 'http://127.0.0.1:5050'

  const proxy = {
    '/api': {
      target: apiTarget,
      changeOrigin: true,
      secure: false,
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy,
    },
    preview: {
      proxy,
    },
  }
})
