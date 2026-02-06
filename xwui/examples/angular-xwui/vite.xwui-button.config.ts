/**
 * Builds a single ESM bundle that registers <xwui-button> Custom Element.
 * Output: examples/angular-xwui/public/xwui-button.mjs
 * Served at /xwui-button.mjs from public/ so the dev server can serve it as static (no pre-transform).
 * Run from repo root: npx vite build --config examples/angular-xwui/vite.xwui-button.config.ts
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'xwui-button-bootstrap.ts'),
      name: 'XWUIButton',
      fileName: () => 'xwui-button.mjs',
      formats: ['es'],
    },
    outDir: resolve(__dirname, 'public'),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'xwui-button.mjs',
        inlineDynamicImports: true,
      },
    },
    minify: false,
    sourcemap: true,
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../src'),
      '@components': resolve(__dirname, '../../src/components'),
    },
  },
});
