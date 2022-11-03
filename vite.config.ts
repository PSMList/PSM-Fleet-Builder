import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: true
  // },
  build: {
    copyPublicDir: false
  },
  plugins: [preact()]
})
