import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/users': 'https://yummy-ghosts-trade.loca.lt',
      // '/upload': 'https://yummy-ghosts-trade.loca.lt',
      // '/images': 'https://yummy-ghosts-trade.loca.lt',

      // '/users': 'http://localhost:8000',
      // '/upload': 'http://localhost:8000',
      // '/images': 'http://localhost:8000',
      // '/defects': 'http://localhost:8000',
      // '/replace-image': 'http://localhost:8000',
      // '/reports': 'http://localhost:8000',

      '/users': 'https://4741d6c468491dc0b321c252f639b1f1.serveo.net',
      '/upload': 'https://4741d6c468491dc0b321c252f639b1f1.serveo.net',
      '/images': 'https://4741d6c468491dc0b321c252f639b1f1.serveo.net',
      '/defects': 'https://4741d6c468491dc0b321c252f639b1f1.serveo.net',
      '/replace-image': 'https://4741d6c468491dc0b321c252f639b1f1.serveo.net',
      '/reports': 'https://4741d6c468491dc0b321c252f639b1f1.serveo.net',
    }
  }
})
