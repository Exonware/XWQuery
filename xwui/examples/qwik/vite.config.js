import { defineConfig } from 'vite';

// Plain Vite build so we get index.html + runnable dist. XWUIButton works the same.
export default defineConfig({
  server: { port: 5177, strictPort: true },
});
