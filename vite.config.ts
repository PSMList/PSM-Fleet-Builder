import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// Modules shared by both the fleet and collection entries are forced into a
// single "builder" chunk (builder.js / builder.css) so they are downloaded
// once. The fleet/collection chunks only contain their entry-specific code.
function builderChunk(id: string) {
  if (
    id.includes('node_modules') ||
    id.includes('/src/common/') ||
    id.includes('/src/store/') ||
    id.includes('/src/utils/') ||
    id.includes('/src/features/items/') ||
    id.includes('/src/entries/render')
  ) {
    return 'builder';
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [solidPlugin()],
  build: {
    copyPublicDir: false,
    target: 'esnext',
    minify: false,
    rollupOptions: {
      input: {
        fleet: resolve(__dirname, 'src/entries/fleet.tsx'),
        collection: resolve(__dirname, 'src/entries/collection.tsx'),
      },
      output: {
        // js/fleet.js, js/collection.js (entries) and js/builder.js (shared)
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        // css/fleet.css, css/collection.css, css/builder.css
        assetFileNames: (info) => {
          const name = info.names?.[0] ?? info.name ?? '';
          if (name.endsWith('.css')) return 'css/[name][extname]';
          return 'assets/[name][extname]';
        },
        manualChunks: builderChunk,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
