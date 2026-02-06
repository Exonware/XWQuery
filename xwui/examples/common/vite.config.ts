/**
 * Builds shared XWUI button bundle for all framework examples.
 * Output: examples/common/xwui-button.mjs
 * Run from repo root: npx vite build --config examples/common/vite.config.ts
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
    outDir: __dirname,
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
