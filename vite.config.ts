import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: ['modern-compiler'],
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    host: true,
  },
  plugins: [solidPlugin()],
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
