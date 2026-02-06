import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';
import { cp, readFile, writeFile, readdir, rm } from 'fs/promises';
import { fileURLToPath } from 'url';
import { createManifestWatcherPlugin } from './src/config/preservation_engine';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const BUILD_CONFIG = {
  sourceDirs: ['src/components', 'src/pages', 'src/app', 'src/api'],
  stylesDir: 'src/styles',
  skipDirs: ['generators', 'tokens', 'utils', '_virtual', 'node_modules'],
  staticExtensions: /\.(json|css|svg|png|jpg|jpeg|gif|grammar|html)$/i,
  aliases: { '@': './src', '@components': './src/components' },
};

let entriesCache: Record<string, Record<string, string>> | null = null;
let entriesCacheTime = 0;
const CACHE_TTL = 5000;

function getEntries(scanDir: string): Record<string, string> {
  const now = Date.now();
  if (entriesCache && (now - entriesCacheTime) < CACHE_TTL && entriesCache[scanDir]) {
    return entriesCache[scanDir];
  }
  const entries: Record<string, string> = {};
  if (!existsSync(scanDir)) {
    if (!entriesCache) entriesCache = {};
    entriesCache[scanDir] = entries;
    entriesCacheTime = now;
    return entries;
  }
  const srcRoot = resolve(__dirname, 'src');
  function scan(dir: string) {
    const items = readdirSync(dir);
    for (const item of items) {
      if (BUILD_CONFIG.skipDirs.includes(item)) continue;
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) scan(fullPath);
      else {
        const relativeDir = dir.replace(srcRoot, '').replace(/^[\\/]/, '');
        if (item.endsWith('.html') && (item.startsWith('Tester') || item === 'index.html')) {
          const name = item.replace(/\.html$/, '');
          entries[relativeDir ? join(relativeDir, name) : name] = fullPath;
        } else if (item === 'index.ts' || item === 'index.tsx') {
          entries[join(relativeDir, 'index')] = fullPath;
        }
      }
    }
  }
  scan(scanDir);
  if (!entriesCache) entriesCache = {};
  entriesCache[scanDir] = entries;
  entriesCacheTime = now;
  return entries;
}

async function runPostBuildTasks() {
  console.log('🚀 [Async] Build successful! Syncing assets...');
  const distDir = resolve(__dirname, 'dist');

  const copyDir = async (src: string, dest: string, filter?: (n: string) => boolean) => {
    try {
      if (!existsSync(src)) return;
      const srcName = src.split(/[\\/]/).pop() || '';
      if (BUILD_CONFIG.skipDirs.includes(srcName)) return;
      await cp(src, dest, {
        recursive: true,
        force: true,
        filter: (source) => {
          const name = source.split(/[\\/]/).pop() || '';
          if (BUILD_CONFIG.skipDirs.includes(name)) return false;
          const stat = statSync(source);
          if (stat.isDirectory()) return !BUILD_CONFIG.skipDirs.includes(name);
          if (stat.isFile()) return filter ? filter(name) : true;
          return true;
        },
      });
    } catch (e) {
      if (!(e as Error).message?.includes('ENOENT')) {
        console.warn(`⚠️  Failed to copy ${src} to ${dest}:`, e);
      }
    }
  };

  await Promise.all([
    copyDir(
      resolve(__dirname, BUILD_CONFIG.stylesDir),
      resolve(distDir, BUILD_CONFIG.stylesDir.replace('src/', '')),
      (n) => {
        if (n.endsWith('.ts')) return false;
        if (n.endsWith('.md')) return false;
        return true;
      }
    ),
    ...BUILD_CONFIG.sourceDirs.map(dir =>
      copyDir(
        resolve(__dirname, dir),
        resolve(distDir, dir.replace('src/', '')),
        (n) => BUILD_CONFIG.staticExtensions.test(n)
      )
    ),
  ]);

  console.log('🧹 Cleaning excluded folders...');
  for (const folder of ['tokens', 'utils', '_virtual', 'node_modules']) {
    const folderPath = join(distDir, folder);
    try {
      if (existsSync(folderPath)) {
        await rm(folderPath, { recursive: true, force: true });
        console.log(`  ✅ Removed ${folder}/`);
      }
    } catch (e) {
      if (!String(e).includes('ENOENT')) console.warn(`  ⚠️  Failed to remove ${folder}/:`, e);
    }
  }

  async function getHtmlFiles(dir: string): Promise<string[]> {
    let files: string[] = [];
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...await getHtmlFiles(p));
        else if (entry.name.endsWith('.html')) files.push(p);
      }
    } catch {}
    return files;
  }
  const htmlFiles = await getHtmlFiles(distDir);
  const BATCH_SIZE = 10;
  for (let i = 0; i < htmlFiles.length; i += BATCH_SIZE) {
    const batch = htmlFiles.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (file) => {
      try {
        let content = await readFile(file, 'utf-8');
        if (!content.includes('.ts') && !content.includes('.tsx')) return;
        let modified = false;
        content = content.replace(/(from\s+['"])([^'"]+\.tsx?)(['"])/g, (m, p1, p2, p3) => {
          if (p2.startsWith('.')) { modified = true; return `${p1}${p2.replace(/\.tsx?$/, '.js')}${p3}`; }
          return m;
        });
        content = content.replace(/(src\s*=\s*['"])([^'"]+\.tsx?)(['"])/g, (m, p1, p2, p3) => {
          if (p2.startsWith('.')) { modified = true; return `${p1}${p2.replace(/\.tsx?$/, '.js')}${p3}`; }
          return m;
        });
        if (modified) await writeFile(file, content, 'utf-8');
      } catch (e) {}
    }));
  }
  console.log('✅ [Async] Assets synced.');
}

export default defineConfig(({ mode }) => ({
  base: './',
  server: { host: '0.0.0.0', port: 3000, strictPort: false, open: false },
  define: {
    'import.meta.env.MODE': JSON.stringify(mode),
    'import.meta.env.PROD': JSON.stringify(mode === 'production'),
    'import.meta.env.DEV': JSON.stringify(mode === 'development'),
  },
  optimizeDeps: { esbuildOptions: { target: 'es2022' } },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2022',
    minify: false,
    sourcemap: false,
    cssCodeSplit: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2000,
    esbuild: { target: 'es2022', legalComments: 'none', loader: 'ts' },
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      input:
        mode === 'development'
          ? { main: resolve(__dirname, 'index.html') }
          : {
              main: resolve(__dirname, 'index.html'),
              ...BUILD_CONFIG.sourceDirs.reduce((acc, dir) => ({ ...acc, ...getEntries(resolve(__dirname, dir)) }), {}),
            },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) =>
          assetInfo.name?.startsWith('src/') ? assetInfo.name.replace('src/', '') : '[name][extname]',
        format: 'es',
      },
      treeshake: { moduleSideEffects: false },
    },
  },
  plugins: [
    createManifestWatcherPlugin(),
    { name: 'post-build-tasks', writeBundle() { runPostBuildTasks().catch(err => console.error('❌ [Async] Task failed:', err)); } },
  ],
  resolve: {
    alias: Object.fromEntries(Object.entries(BUILD_CONFIG.aliases).map(([k, v]) => [k, resolve(__dirname, v)])),
  },
}));