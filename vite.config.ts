import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true
  },
  plugins: [
    solidPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});