import { defineConfig } from 'vite'
import suidPlugin from '@suid/vite-plugin';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true
  },
  plugins: [
    suidPlugin(),
    solidPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});