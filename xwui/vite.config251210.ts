import { defineConfig } from 'vite';
// @ts-ignore - Node.js built-in modules
import { resolve } from 'path';
// @ts-ignore - Node.js built-in modules
import { fileURLToPath } from 'url';
// @ts-ignore - Node.js built-in modules
import { readdirSync, readFileSync, statSync, copyFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
// @ts-ignore - Node.js built-in modules
import { readFileSync as readFileSyncBinary } from 'fs';
// @ts-ignore - Node.js built-in modules
import { dirname, join } from 'path';
import type { Plugin } from 'vite';

// @ts-ignore - Node.js built-in
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Discover tester HTML files dynamically from component folders
// Scans src/components/*/testers/ for Tester*.html files
function getTesterInputs() {
  const componentsDir = resolve(__dirname, 'src/components');
  const entries: Record<string, string> = {};

  let componentDirs: string[] = [];
  try {
    componentDirs = readdirSync(componentsDir);
  } catch {
    // If components directory does not exist, just return empty entries
    return entries;
  }

  // Scan each component folder for testers subdirectory
  for (const componentName of componentDirs) {
    const componentPath = resolve(componentsDir, componentName);
    const testersPath = resolve(componentPath, 'testers');
    
    try {
      // Check if testers directory exists
      const stat = statSync(testersPath);
      if (!stat.isDirectory()) continue;

      // Read testers directory
      const testerFiles = readdirSync(testersPath);
      
      for (const file of testerFiles) {
        if (!file.endsWith('.html')) continue;

        const nameWithoutExt = file.replace(/\.html$/, '');
        if (!nameWithoutExt.startsWith('Tester')) continue;

        // Preserve the previous naming convention: testerXWUIItemGroup, testerConsole, etc.
        const suffix = nameWithoutExt.slice('Tester'.length); // e.g. "XWUIItemGroup"
        const key = `tester${suffix}`; // e.g. "testerXWUIItemGroup"

        entries[key] = resolve(testersPath, file);
      }
    } catch {
      // Component doesn't have a testers folder, skip it
      continue;
    }
  }

  return entries;
}

// Discover tester HTML files dynamically from pages folders
// Scans src/pages/*/testers/ for Tester*.html files
function getPagesTesterInputs() {
  const pagesDir = resolve(__dirname, 'src/pages');
  const entries: Record<string, string> = {};

  try {
    if (!existsSync(pagesDir)) {
      return entries;
    }

    const pageDirs = readdirSync(pagesDir);
    
    // Scan each page folder for testers subdirectory
    for (const pageName of pageDirs) {
      const pagePath = resolve(pagesDir, pageName);
      const testersPath = resolve(pagePath, 'testers');
      
      try {
        // Check if testers directory exists
        const stat = statSync(testersPath);
        if (!stat.isDirectory()) continue;

        // Read testers directory
        const testerFiles = readdirSync(testersPath);
        
        for (const file of testerFiles) {
          if (!file.endsWith('.html')) continue;

          const nameWithoutExt = file.replace(/\.html$/, '');
          if (!nameWithoutExt.startsWith('Tester')) continue;

          // Use page name prefix to avoid conflicts: testerXWUIPage, etc.
          const suffix = nameWithoutExt.slice('Tester'.length); // e.g. "XWUIPage"
          const key = `tester${suffix}`; // e.g. "testerXWUIPage"

          entries[key] = resolve(testersPath, file);
        }
      } catch {
        // Page doesn't have a testers folder, skip it
        continue;
      }
    }
  } catch {
    // If pages directory does not exist or can't be read, just return empty entries
    return entries;
  }

  return entries;
}

// Discover tester HTML files dynamically from app/manam/components folders
// Scans src/app/manam/components/*/testers/ for Tester*.html files
function getAppManamTesterInputs() {
  const componentsDir = resolve(__dirname, 'src/app/manam/components');
  const entries: Record<string, string> = {};

  try {
    if (!existsSync(componentsDir)) {
      return entries;
    }

    const componentDirs = readdirSync(componentsDir);
    
    // Scan each component folder for testers subdirectory
    for (const componentName of componentDirs) {
      const componentPath = resolve(componentsDir, componentName);
      const testersPath = resolve(componentPath, 'testers');
      
      try {
        // Check if testers directory exists
        const stat = statSync(testersPath);
        if (!stat.isDirectory()) continue;

        // Read testers directory
        const testerFiles = readdirSync(testersPath);
        
        for (const file of testerFiles) {
          if (!file.endsWith('.html')) continue;

          const nameWithoutExt = file.replace(/\.html$/, '');
          if (!nameWithoutExt.startsWith('Tester')) continue;

          // Use component name prefix: testerManamMenu, etc.
          const suffix = nameWithoutExt.slice('Tester'.length); // e.g. "ManamMenu"
          const key = `tester${suffix}`; // e.g. "testerManamMenu"

          entries[key] = resolve(testersPath, file);
        }
      } catch {
        // Component doesn't have a testers folder, skip it
        continue;
      }
    }
  } catch {
    // If app/manam/components directory does not exist or can't be read, just return empty entries
    return entries;
  }

  return entries;
}

export default defineConfig({
  // Use relative base so builds can be served from a subfolder (e.g. /xwui/ or a file-based static server)
  base: './',
  // Configure esbuild to handle TypeScript files (both .ts and .tsx)
  // Vite automatically handles .ts and .tsx files
  esbuild: {
    include: /\.(tsx?|jsx?)$/,
    exclude: [],
    // Ensure TypeScript syntax is properly parsed
    tsconfigRaw: {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        jsx: 'preserve',
        strict: false,
        skipLibCheck: true
      }
    }
  },
  optimizeDeps: {
    // Include Three.js in pre-bundling
    include: ['three'],
    // Exclude React from pre-bundling - we use CDN via import map
    exclude: ['react', 'react-dom'],
    // Configure esbuild options for dependency pre-bundling
    esbuildOptions: {
      // Vite automatically handles TypeScript files
      target: 'es2022',
      format: 'esm',
      // More lenient TypeScript parsing
      tsconfigRaw: {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          lib: ['ES2022', 'DOM'],
          jsx: 'preserve',
          strict: false,
          skipLibCheck: true,
          allowJs: true,
          // Allow more flexible syntax
          noImplicitAny: false
        }
      }
    },
    // Force re-optimization if needed
    force: false,
    // Entries to scan - exclude HTML files, they're handled by plugins
    entries: []
  },
  // ============================================================================
  // BUILD CONFIGURATION - OPTIMIZED FOR SPEED
  // ============================================================================
  // Key optimizations:
  // 1. Styles copied as-is (folders, css, json, svg, png) - no processing
  // 2. Components/app/pages/api: .ts converted to .js, HTML imports updated
  // 3. Sourcemaps disabled, esbuild minification, minimal chunk splitting
  // ============================================================================
  build: {
    outDir: 'dist',
    sourcemap: false, // OPTIMIZATION: Disable sourcemaps for faster builds
    // Don't empty outDir if files are locked (common on Windows/OneDrive)
    emptyOutDir: false,
    // Ensure TypeScript/TSX files are handled during build
    target: 'es2022',
    // Vite automatically handles .ts and .tsx files during build
    // OPTIMIZATION: Speed optimizations - minimize processing time
    minify: 'esbuild', // Faster than terser
    chunkSizeWarningLimit: 1000, // Increase warning threshold to reduce warnings
    rollupOptions: {
      // OPTIMIZATION: Minimize chunk splitting for faster builds
      output: {
        manualChunks: undefined, // Let Vite decide automatically (faster)
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      input: {
        // Main app entry - use root index.html as source
        // This will be built to dist/index.html
        // DO NOT use dist/index.html as input (that's the output - it would create dist/dist/!)
        main: resolve(__dirname, 'index.html'),
        // Testers index page (optional - only include if file exists)
        ...(existsSync(resolve(__dirname, 'src/components/component/testers/index.html')) 
          ? { 'testers-index': resolve(__dirname, 'src/components/component/testers/index.html') }
          : {}),
        // XWUIStoryStudio run.html
        ...(existsSync(resolve(__dirname, 'src/components/XWUIStoryStudio/run.html'))
          ? { 'xwui-story-studio': resolve(__dirname, 'src/components/XWUIStoryStudio/run.html') }
          : {}),
        // Tester entries discovered dynamically from src/components/*/testers/
        ...getTesterInputs(),
        // Tester entries discovered dynamically from src/pages/*/testers/
        ...getPagesTesterInputs(),
        // Tester entries from app/manam/components/*/testers/
        ...getAppManamTesterInputs()
      },
      // Externalize React as a peer dependency
      // This keeps the library bundle smaller - users provide their own React
      // For demo/testers, React can be loaded from CDN or installed separately
      // BUT: Don't externalize for run.html since it uses CDN imports
      external: (id) => {
        // Don't externalize React for xwui-story-studio build (it uses CDN)
        if (id === 'react' || id === 'react-dom') {
          // Check if this is the xwui-story-studio build
          const isStoryStudio = process.env.npm_lifecycle_event === 'build:vite' && 
                                 process.argv.includes('xwui-story-studio');
          return !isStoryStudio;
        }
        return false;
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components')
    },
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json']
  },
  server: {
    port: 3000,
    open: false,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    },
    // Ensure Vite serves files from src/ directory in development
    middlewareMode: false
  },
  // Vite plugins
  plugins: [
    // Plugin to serve files directly from dist/ directory at root
    {
      name: 'serve-dist-root',
      enforce: 'pre', // Run before other plugins
      configureServer(server) {
        // Middleware to serve files from dist/ for root-level requests
        const serveDistRoot = (req: any, res: any, next: any) => {
          const url = req.url || '';
          const cleanUrl = url.split('?')[0].split('#')[0];
          
          // Skip if it's already a /dist/ or /src/ path (handled elsewhere)
          if (url.startsWith('/dist/') || url.startsWith('/src/') || url.startsWith('/node_modules/')) {
            next();
            return;
          }
          
          // Try to serve from dist/ directory
          // For root path, serve dist/index.html
          let distPath: string;
          if (cleanUrl === '/' || cleanUrl === '') {
            distPath = resolve(__dirname, 'dist', 'index.html');
          } else {
            // Remove leading slash and try dist/
            const relativePath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
            distPath = resolve(__dirname, 'dist', relativePath);
          }
          
          if (existsSync(distPath)) {
            const stat = statSync(distPath);
            if (stat.isFile()) {
              try {
                // Determine if file is binary (images, fonts, etc.)
                const isBinary = distPath.match(/\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|otf|webp|avif)$/i);
                
                // Set appropriate MIME type based on file extension
                let contentType = 'application/octet-stream';
                if (distPath.endsWith('.js') || distPath.endsWith('.mjs')) {
                  contentType = 'application/javascript; charset=utf-8';
                } else if (distPath.endsWith('.css')) {
                  contentType = 'text/css; charset=utf-8';
                } else if (distPath.endsWith('.json')) {
                  contentType = 'application/json; charset=utf-8';
                } else if (distPath.endsWith('.html')) {
                  contentType = 'text/html; charset=utf-8';
                } else if (distPath.endsWith('.svg')) {
                  contentType = 'image/svg+xml';
                } else if (distPath.endsWith('.png')) {
                  contentType = 'image/png';
                } else if (distPath.endsWith('.jpg') || distPath.endsWith('.jpeg')) {
                  contentType = 'image/jpeg';
                } else if (distPath.endsWith('.gif')) {
                  contentType = 'image/gif';
                } else if (distPath.endsWith('.woff')) {
                  contentType = 'font/woff';
                } else if (distPath.endsWith('.woff2')) {
                  contentType = 'font/woff2';
                } else if (distPath.endsWith('.ttf')) {
                  contentType = 'font/ttf';
                }
                
                // Read file content (binary for images/fonts, text for others)
                const fileContent = isBinary 
                  ? readFileSync(distPath) // Binary mode (returns Buffer)
                  : readFileSync(distPath, 'utf-8'); // Text mode
                
                res.setHeader('Content-Type', contentType);
                res.setHeader('Cache-Control', 'no-cache');
                res.statusCode = 200;
                res.end(fileContent);
                console.log(`[Serve Dist Root] Served: ${url} -> ${distPath}`);
                return; // Handled - don't call next()
              } catch (error: any) {
                console.warn('[Serve Dist Root] Failed to read:', distPath, error?.message);
              }
            }
          }
          
          // File not found in dist/, let Vite handle it
          next();
        };
        
        // Insert at the very beginning of the middleware stack
        (server.middlewares as any).stack.unshift({
          route: '',
          handle: serveDistRoot
        });
      }
    } as Plugin,
    // Plugin to handle .ts and .tsx files dynamically in dev server and build
    {
      name: 'ts-tsx-module-handler',
      enforce: 'pre', // Run before other plugins
      configureServer(server) {
        // Insert middleware at the beginning to catch /dist/ requests before Vite's handlers
        const distHandler = (req: any, res: any, next: any) => {
          const url = req.url || '';
          
          // Serve static files from /dist/ directory (JS, CSS, JSON, etc.)
          if (url.startsWith('/dist/')) {
            const cleanUrl = url.split('?')[0].split('#')[0];
            
            // Resolve the actual file path
            const relativePath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
            const distPath = resolve(__dirname, relativePath);
            
            if (existsSync(distPath)) {
              const stat = statSync(distPath);
              if (stat.isFile()) {
                try {
                  const fileContent = readFileSync(distPath, 'utf-8');
                  
                  // Set appropriate MIME type based on file extension
                  let contentType = 'application/octet-stream';
                  if (distPath.endsWith('.js') || distPath.endsWith('.mjs')) {
                    contentType = 'application/javascript; charset=utf-8';
                  } else if (distPath.endsWith('.css')) {
                    contentType = 'text/css; charset=utf-8';
                  } else if (distPath.endsWith('.json')) {
                    contentType = 'application/json; charset=utf-8';
                  } else if (distPath.endsWith('.html')) {
                    contentType = 'text/html; charset=utf-8';
                  } else if (distPath.endsWith('.svg')) {
                    contentType = 'image/svg+xml';
                  }
                  
                  res.setHeader('Content-Type', contentType);
                  res.setHeader('Cache-Control', 'no-cache');
                  res.statusCode = 200;
                  res.end(fileContent);
                  console.log(`[Dist Handler] Served: ${url} -> ${distPath}`);
                  return; // Handled - don't call next()
                } catch (error: any) {
                  console.warn('[Dist Handler] Failed to read:', distPath, error?.message);
                }
              } else {
                console.warn('[Dist Handler] Path exists but is not a file:', distPath);
              }
            } else {
              console.warn('[Dist Handler] File not found:', distPath, '(requested:', url, ')');
            }
          }
          
          // Check if this is a .ts or .tsx file request from /dist/ (legacy support)
          const isDistTsFile = url.startsWith('/dist/') && /\.tsx?(\?|&|#|$)/.test(url);
          
          if (isDistTsFile) {
            // Convert /dist/components/X/.../index.ts to /dist/components/X/.../index.js
            const cleanUrl = url.split('?')[0].split('#')[0];
            const jsUrl = cleanUrl.replace(/\.tsx?$/, '.js');
            
            // Resolve the actual file path
            const relativePath = jsUrl.startsWith('/') ? jsUrl.slice(1) : jsUrl;
            const distPath = resolve(__dirname, relativePath);
            
            if (existsSync(distPath)) {
              try {
                const jsContent = readFileSync(distPath, 'utf-8');
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                res.setHeader('Cache-Control', 'no-cache');
                res.statusCode = 200;
                res.end(jsContent);
                return; // Handled - don't call next()
              } catch (error: any) {
                console.warn('[TS Handler] Failed to read:', distPath, error?.message);
              }
            } else {
              console.warn('[TS Handler] File not found:', distPath);
            }
          }
          
          // Check if this is a .ts or .tsx file request from /src/ (for transformation)
          const isSrcTsFile = url.startsWith('/src/') && /\.tsx?(\?|&|#|$)/.test(url);
          
          if (isSrcTsFile) {
            const cleanUrl = url.split('?')[0].split('#')[0];
            
            // Use Vite's transform pipeline
            server.transformRequest(cleanUrl, { ssr: false })
              .then((result: any) => {
                if (result?.code) {
                  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                  res.setHeader('Cache-Control', 'no-cache');
                  res.statusCode = 200;
                  res.end(result.code);
                } else {
                  next();
                }
              })
              .catch((error: any) => {
                console.warn('[TS Handler] Transform failed:', cleanUrl, error?.message);
                next();
              });
            return; // Don't call next() yet - async handler will
          }
          
          next(); // Not a .ts file we handle, pass through
        };
        
        // Insert at the beginning of the middleware stack
        (server.middlewares as any).stack.unshift({
          route: '',
          handle: distHandler
        });
      }
    } as Plugin,
    // Plugin to ensure HTML files from src/ are served correctly in dev mode
    {
      name: 'html-src-handler',
      configureServer(server) {
        // Vite should automatically serve HTML files, but we ensure src/ paths work
        // This is mainly for logging/debugging - Vite handles this by default
        server.middlewares.use((req: any, res: any, next: any) => {
          const url = req.url || '';
          // Log HTML requests from src/ for debugging
          if (url.includes('/src/') && url.endsWith('.html')) {
            console.log('[HTML Handler] Serving:', url);
          }
          next(); // Always pass through - Vite handles HTML serving
        });
      }
    },
    // Plugin to ensure inline scripts with TypeScript are processed correctly
    {
      name: 'inline-script-typescript',
      // Run this plugin early to intercept before Vite's HTML plugin tries to load
      enforce: 'pre',
      // Also handle the module during resolve to ensure it's recognized early
      async resolveId(id, importer) {
        // Vite creates virtual modules like: "path/to/file.html?html-proxy&index=0.js"
        // We need to ensure these resolve correctly
        if (id.includes('html-proxy') && id.endsWith('.js')) {
          // Return the ID as-is to mark it as handled
          return id;
        }
        return null;
      },
      // Load the virtual module content
      async load(id) {
        if (id.includes('html-proxy') && id.endsWith('.js')) {
          // Extract the HTML file path from the virtual module ID
          // ID format: "D:/path/to/file.html?html-proxy&index=0.js"
          const htmlPath = id.split('?')[0];
          
          try {
            // Normalize the path (handle both absolute and relative paths)
            const normalizedPath = resolve(htmlPath);
            
            // Read the HTML file
            const htmlContent = readFileSync(normalizedPath, 'utf-8');
            
            // Extract ALL inline script content (in case there are multiple)
            // Match <script type="module">...</script>
            const scriptMatches = htmlContent.matchAll(/<script\s+type=["']module["']>([\s\S]*?)<\/script>/g);
            const scripts: string[] = [];
            for (const match of scriptMatches) {
              if (match[1]) {
                scripts.push(match[1]);
              }
            }
            
            // If we found scripts, return the first one (or concatenate if multiple)
            // Vite's HTML plugin uses index=0, index=1, etc. for multiple scripts
            const indexMatch = id.match(/index=(\d+)/);
            const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;
            
            if (scripts[index]) {
              // Pre-transform TypeScript to JavaScript here to avoid dependency scan errors
              const scriptContent = scripts[index];
              
              // Check if it contains TypeScript syntax
              const hasTypeScript = /:\s*(string|number|boolean|HTMLElement|ReturnType|Promise|void|any|never)\b/.test(scriptContent) ||
                                   /!\s*[,\)]/.test(scriptContent) ||
                                   /\bas\s+(HTMLElement|string|number|boolean)/.test(scriptContent);
              
              if (hasTypeScript) {
                // Transform TypeScript to JavaScript immediately
                try {
                  const esbuildModule = await import('esbuild');
                  const result = await esbuildModule.transform(scriptContent, {
                    loader: 'ts',
                    target: 'es2022',
                    format: 'esm',
                    jsx: 'preserve',
                    tsconfigRaw: {
                      compilerOptions: {
                        target: 'ES2022',
                        module: 'ESNext',
                        lib: ['ES2022', 'DOM'],
                        jsx: 'preserve',
                        strict: false,
                        skipLibCheck: true
                      }
                    }
                  });
                  
                  // Return transformed JavaScript code
                  return result.code;
                } catch (transformError: any) {
                  console.warn(`[Inline Script TS Transform] Failed to transform TypeScript in ${htmlPath}:`, transformError?.message || transformError);
                  // Fall back to returning original code - might fail but at least we tried
                  return scriptContent;
                }
              }
              
              // No TypeScript syntax, return as-is
              return scriptContent;
            }
          } catch (error: any) {
            console.warn(`[Inline Script Handler] Failed to load ${htmlPath}:`, error?.message || error);
          }
        }
        return null;
      },
      // Transform the code - explicitly handle TypeScript syntax
      async transform(code, id, options) {
        if (id.includes('html-proxy') && id.endsWith('.js')) {
          // Check if the code contains TypeScript syntax
          const hasTypeScript = /:\s*(string|number|boolean|HTMLElement|ReturnType|Promise|void|any|never)\b/.test(code) ||
                               /!\s*[,\)]/.test(code) ||
                               /\bas\s+(HTMLElement|string|number|boolean)/.test(code);
          
          if (hasTypeScript) {
            // Use Vite's esbuild service to transform TypeScript
            // Access esbuild through the plugin context
            const esbuild = options?.ssr ? 
              (await import('esbuild')).transform :
              // For client builds, use Vite's esbuild service
              async (code: string, options: any) => {
                const esbuild = await import('esbuild');
                // Determine loader based on file extension - handle both .ts and .tsx
                const loader = (options?.id || '').endsWith('.tsx') || code.includes('</') || code.includes('/>') ? 'tsx' : 'ts';
                return esbuild.transform(code, {
                  loader: loader,
                  target: 'es2020',
                  format: 'esm',
                  jsx: 'preserve',
                  ...options
                });
              };
            
            try {
              // Determine loader based on file extension - handle both .ts and .tsx
              const loader = id.endsWith('.tsx') || code.includes('</') || code.includes('/>') ? 'tsx' : 'ts';
              const result = await esbuild(code, {
                loader: loader,
                target: 'es2022', // Support top-level await
                format: 'esm',
                jsx: 'preserve'
              });
              
              return {
                code: result.code,
                map: result.map || null
              };
            } catch (error: any) {
              // If esbuild transform fails, try with more lenient settings
              try {
                const esbuildModule = await import('esbuild');
                // Determine loader based on file extension - handle both .ts and .tsx
                const loader = id.endsWith('.tsx') || code.includes('</') || code.includes('/>') ? 'tsx' : 'ts';
                const result = await esbuildModule.transform(code, {
                  loader: loader,
                  target: 'es2022', // Support top-level await
                  format: 'esm',
                  jsx: 'preserve',
                  // More lenient settings for inline scripts
                  tsconfigRaw: {
                    compilerOptions: {
                      target: 'ES2022',
                      module: 'ESNext',
                      lib: ['ES2022', 'DOM'],
                      jsx: 'preserve',
                      strict: false,
                      skipLibCheck: true
                    }
                  }
                });
                
                return {
                  code: result.code,
                  map: result.map || null
                };
              } catch (fallbackError: any) {
                console.warn(`[Inline Script TS Transform] Failed to transform TypeScript in ${id}:`, fallbackError?.message || fallbackError);
                // Fall back to returning null - let Vite handle it (may fail, but at least we tried)
                return null;
              }
            }
          }
          
          // No TypeScript syntax, let Vite handle it normally
          return null;
        }
        return null;
      }
    } as Plugin,
    // Plugin to ensure inline CSS is processed correctly
    {
      name: 'inline-css-handler',
      // Run this plugin early to intercept before Vite's HTML plugin tries to load
      enforce: 'pre',
      // Handle virtual modules created by Vite's HTML plugin from inline styles
      resolveId(id) {
        // Vite creates virtual modules like: "path/to/file.html?html-proxy&inline-css&index=0.css"
        // We need to ensure these resolve correctly
        if (id.includes('html-proxy') && id.includes('inline-css') && id.endsWith('.css')) {
          // Return the ID as-is to mark it as handled
          return id;
        }
        return null;
      },
      // Load the virtual module content
      async load(id) {
        if (id.includes('html-proxy') && id.includes('inline-css') && id.endsWith('.css')) {
          // Extract the HTML file path from the virtual module ID
          // ID format: "D:/path/to/file.html?html-proxy&inline-css&index=0.css"
          const htmlPath = id.split('?')[0];
          
          try {
            // Normalize the path (handle both absolute and relative paths)
            const normalizedPath = resolve(htmlPath);
            
            // Read the HTML file
            const htmlContent = readFileSync(normalizedPath, 'utf-8');
            
            // Extract ALL inline style content (in case there are multiple)
            // Match <style>...</style> (with or without attributes)
            const styleMatches = htmlContent.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g);
            const styles: string[] = [];
            for (const match of styleMatches) {
              if (match[1]) {
                styles.push(match[1]);
              }
            }
            
            // If we found styles, return the one at the specified index
            // Vite's HTML plugin uses index=0, index=1, etc. for multiple styles
            const indexMatch = id.match(/index=(\d+)/);
            const index = indexMatch ? parseInt(indexMatch[1], 10) : 0;
            
            if (styles[index]) {
              // Return the CSS content - Vite will process it automatically
              return styles[index];
            }
          } catch (error: any) {
            console.warn(`[Inline CSS Handler] Failed to load ${htmlPath}:`, error?.message || error);
          }
        }
        return null;
      },
      // Transform is not needed for CSS - Vite handles it automatically
      transform(code, id) {
        return null;
      }
    } as Plugin,
    // Plugin to import .grammar files as strings
    {
      name: 'grammar-file-loader',
      enforce: 'pre',
      resolveId(id) {
        if (id.endsWith('.grammar')) {
          return id; // Mark as handled
        }
        return null;
      },
      load(id) {
        if (id.endsWith('.grammar')) {
          try {
            const grammarPath = resolve(id);
            const grammarContent = readFileSync(grammarPath, 'utf-8');
            // Export as default string
            return `export default ${JSON.stringify(grammarContent)};`;
          } catch (error: any) {
            console.warn(`[Grammar Loader] Failed to load ${id}:`, error?.message || error);
            return `export default "";`;
          }
        }
        return null;
      }
    } as Plugin,
    // Plugin to copy grammar files to dist (needed for runtime fetch)
    {
      name: 'copy-grammar-files',
      writeBundle() {
        // Copy grammar files from src/components/XWUIScriptEditor/grammars/ to dist
        const grammarsSourceDir = resolve(__dirname, 'src/components/XWUIScriptEditor/grammars');
        const grammarsDestDir = resolve(__dirname, 'dist/components/XWUIScriptEditor/grammars');
        
        try {
          // Create destination directory
          mkdirSync(grammarsDestDir, { recursive: true });
          
          // Read all files in grammars directory
          const files = readdirSync(grammarsSourceDir);
          
          // Copy .grammar files and grammars_master.json
          files.forEach(file => {
            if (file.endsWith('.grammar') || file === 'grammars_master.json') {
              const sourcePath = join(grammarsSourceDir, file);
              const destPath = join(grammarsDestDir, file);
              copyFileSync(sourcePath, destPath);
            }
          });
          
          console.log(`[Copy Grammar Files] Copied grammar files to ${grammarsDestDir}`);
        } catch (error: any) {
          console.warn(`[Copy Grammar Files] Failed to copy grammar files:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to copy styles JSON files to dist (needed for runtime fetch)
    {
      name: 'copy-styles-json',
      writeBundle() {
        // Copy styles JSON files from src/styles/ to dist/styles/
        const stylesSourceDir = resolve(__dirname, 'src/styles');
        const stylesDestDir = resolve(__dirname, 'dist/styles');
        
        try {
          // Create destination directory
          mkdirSync(stylesDestDir, { recursive: true });
          
          // Copy styles.schema.json and styles.data.json
          const filesToCopy = ['styles.schema.json', 'styles.data.json'];
          
          filesToCopy.forEach(file => {
            const sourcePath = join(stylesSourceDir, file);
            const destPath = join(stylesDestDir, file);
            
            try {
              // Check if source file exists
              if (statSync(sourcePath).isFile()) {
                copyFileSync(sourcePath, destPath);
                console.log(`[Copy Styles JSON] Copied ${file} to ${destPath}`);
              }
            } catch (error: any) {
              console.warn(`[Copy Styles JSON] Failed to copy ${file}:`, error?.message || error);
            }
          });
          
          console.log(`[Copy Styles JSON] Copied styles JSON files to ${stylesDestDir}`);
        } catch (error: any) {
          console.warn(`[Copy Styles JSON] Failed to copy styles JSON files:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to inject React CDN imports and rendering code into xwui-story-studio HTML
    {
      name: 'inject-react-cdn',
      transformIndexHtml(html, context) {
        // Only transform the xwui-story-studio HTML file
        if (context.filename && context.filename.includes('XWUIStoryStudio/run.html')) {
          // Inject import map before any script tags to map React to CDN
          const importMap = `
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@19",
      "react-dom": "https://esm.sh/react-dom@19",
      "react-dom/client": "https://esm.sh/react-dom@19/client"
    }
  }
  </script>`;
          
          // Find the bundle script tag
          const bundleScriptMatch = html.match(/<script[^>]*src="([^"]*xwui-story-studio[^"]*)"[^>]*><\/script>/);
          if (bundleScriptMatch) {
            const bundlePath = bundleScriptMatch[1];
            // Inject rendering code after the bundle script
            const renderCode = `
  <script type="module">
    // Import React and ReactDOM from CDN (via import map)
    import React from "react";
    import { createRoot } from "react-dom/client";
    
    // Import the bundled component
    const module = await import("${bundlePath}");
    const XWStoryApp = module.default || module.XWStoryApp || module;
    
    // Render the app
    const rootElement = document.getElementById('root');
    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(React.createElement(XWStoryApp));
    } else {
        console.error('Root element not found');
    }
  </script>`;
            // Insert import map in head and render code after bundle script
            let result = html.replace('</head>', importMap + '\n</head>');
            result = result.replace(bundleScriptMatch[0], bundleScriptMatch[0] + renderCode);
            return result;
          }
          // Fallback: just add import map if bundle script not found
          return html.replace('</head>', importMap + '\n</head>');
        }
        return html;
      }
    } as Plugin,
    // Plugin to copy entire styles folder structure to dist (needed for runtime CSS loading)
    {
      name: 'copy-styles-folder',
      writeBundle() {
        // Copy entire src/styles/ folder structure to dist/styles/
        const stylesSourceDir = resolve(__dirname, 'src/styles');
        const stylesDestDir = resolve(__dirname, 'dist/styles');
        
        // Recursive function to copy directory structure
        const copyDirectory = (source: string, dest: string) => {
          try {
            // Create destination directory
            mkdirSync(dest, { recursive: true });
            
            // Read all items in source directory
            const items = readdirSync(source);
            
            for (const item of items) {
              const sourcePath = join(source, item);
              const destPath = join(dest, item);
              
              const stat = statSync(sourcePath);
              
              if (stat.isDirectory()) {
                // Skip generators directory (TypeScript files)
                if (item === 'generators') {
                  continue;
                }
                // Recursively copy subdirectories
                copyDirectory(sourcePath, destPath);
              } else if (stat.isFile()) {
                // Copy CSS, JSON, and markdown files
                if (item.endsWith('.css') || item.endsWith('.json') || item.endsWith('.md')) {
                  copyFileSync(sourcePath, destPath);
                }
                // Skip other files (like .ts files)
              }
            }
          } catch (error: any) {
            console.warn(`[Copy Styles Folder] Failed to copy ${source}:`, error?.message || error);
          }
        };
        
        try {
          copyDirectory(stylesSourceDir, stylesDestDir);
          console.log(`[Copy Styles Folder] Successfully copied styles folder structure to ${stylesDestDir}`);
        } catch (error: any) {
          console.warn(`[Copy Styles Folder] Failed to copy styles folder:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to copy SVG files from component folders to dist
    {
      name: 'copy-component-svgs',
      writeBundle() {
        // Copy SVG files from src/components/*/ to dist/components/*/
        const componentsSourceDir = resolve(__dirname, 'src/components');
        const componentsDestDir = resolve(__dirname, 'dist/components');
        
        // Recursive function to find and copy SVG files
        const copySVGFiles = (source: string, dest: string) => {
          try {
            // Create destination directory
            mkdirSync(dest, { recursive: true });
            
            // Read all items in source directory
            const items = readdirSync(source);
            
            for (const item of items) {
              const sourcePath = join(source, item);
              const destPath = join(dest, item);
              
              try {
                const stat = statSync(sourcePath);
                
                if (stat.isDirectory()) {
                  // Recursively copy subdirectories
                  copySVGFiles(sourcePath, destPath);
                } else if (stat.isFile() && item.endsWith('.svg')) {
                  // Copy SVG files
                  copyFileSync(sourcePath, destPath);
                  console.log(`[Copy Component SVGs] Copied ${sourcePath} to ${destPath}`);
                }
              } catch (error: any) {
                // Skip files/directories that can't be accessed
                continue;
              }
            }
          } catch (error: any) {
            console.warn(`[Copy Component SVGs] Failed to copy ${source}:`, error?.message || error);
          }
        };
        
        try {
          copySVGFiles(componentsSourceDir, componentsDestDir);
          console.log(`[Copy Component SVGs] Successfully copied SVG files to ${componentsDestDir}`);
        } catch (error: any) {
          console.warn(`[Copy Component SVGs] Failed to copy SVG files:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to copy CSS files from component folders to dist
    {
      name: 'copy-component-css',
      writeBundle() {
        // Copy CSS files from src/components/*/ to dist/components/*/
        const componentsSourceDir = resolve(__dirname, 'src/components');
        const componentsDestDir = resolve(__dirname, 'dist/components');
        
        // Recursive function to find and copy CSS files
        const copyCSSFiles = (source: string, dest: string) => {
          try {
            // Create destination directory
            mkdirSync(dest, { recursive: true });
            
            // Read all items in source directory
            const items = readdirSync(source);
            
            for (const item of items) {
              const sourcePath = join(source, item);
              const destPath = join(dest, item);
              
              try {
                const stat = statSync(sourcePath);
                
                if (stat.isDirectory()) {
                  // Recursively copy subdirectories
                  copyCSSFiles(sourcePath, destPath);
                } else if (stat.isFile() && item.endsWith('.css')) {
                  // Copy CSS files
                  copyFileSync(sourcePath, destPath);
                  console.log(`[Copy Component CSS] Copied ${sourcePath} to ${destPath}`);
                }
              } catch (error: any) {
                // Skip files/directories that can't be accessed
                continue;
              }
            }
          } catch (error: any) {
            console.warn(`[Copy Component CSS] Failed to copy ${source}:`, error?.message || error);
          }
        };
        
        try {
          copyCSSFiles(componentsSourceDir, componentsDestDir);
          console.log(`[Copy Component CSS] Successfully copied CSS files to ${componentsDestDir}`);
        } catch (error: any) {
          console.warn(`[Copy Component CSS] Failed to copy CSS files:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to compile TypeScript files to JavaScript and copy to dist/
    {
      name: 'compile-ts-to-js',
      async writeBundle() {
        // Compile src/components/ to dist/components/
        const componentsSourceDir = resolve(__dirname, 'src/components');
        const componentsDestDir = resolve(__dirname, 'dist/components');
        
        // Compile src/styles/ to dist/styles/
        const stylesSourceDir = resolve(__dirname, 'src/styles');
        const stylesDestDir = resolve(__dirname, 'dist/styles');
        
        // Recursive function to compile and copy TypeScript files
        const compileTSFiles = async (source: string, dest: string, skipDirs: string[] = ['testers', 'generators']) => {
          try {
            // Create destination directory
            mkdirSync(dest, { recursive: true });
            
            // Read all items in source directory
            const items = readdirSync(source);
            
            for (const item of items) {
              const sourcePath = join(source, item);
              const destPath = join(dest, item);
              
              try {
                const stat = statSync(sourcePath);
                
                if (stat.isDirectory()) {
                  // Skip certain directories (HTML files are handled separately, generators are build tools)
                  if (skipDirs.includes(item)) {
                    continue;
                  }
                  // Recursively process subdirectories
                  await compileTSFiles(sourcePath, destPath, skipDirs);
                } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
                  // Compile TypeScript to JavaScript
                  try {
                    const tsContent = readFileSync(sourcePath, 'utf-8');
                    const esbuild = await import('esbuild');
                    const result = await esbuild.transform(tsContent, {
                      loader: item.endsWith('.tsx') ? 'tsx' : 'ts',
                      target: 'es2022',
                      format: 'esm',
                      jsx: 'preserve',
                      tsconfigRaw: {
                        compilerOptions: {
                          target: 'ES2022',
                          module: 'ESNext',
                          lib: ['ES2022', 'DOM'],
                          jsx: 'preserve',
                          strict: false,
                          skipLibCheck: true
                        }
                      }
                    });
                    
                    // Transform import paths to add .js extensions in the compiled code
                    let jsCode = result.code;
                    
                    // Helper function to check if a path should get .js extension
                    const shouldAddJsExtension = (importPath: string): boolean => {
                      // Skip if it's a URL, absolute path, or data URI
                      if (importPath.startsWith('http') || importPath.startsWith('/') || importPath.startsWith('data:')) {
                        return false;
                      }
                      // Skip if it's a package import (doesn't start with . or /)
                      // Relative paths start with ./ or ../, so check for that
                      if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
                        return false;
                      }
                      // Only skip if it already has a valid JavaScript module extension
                      // Valid extensions: .js, .mjs, .json, .css, .wasm
                      const validExtensions = ['.js', '.mjs', '.json', '.css', '.wasm'];
                      const hasValidExtension = validExtensions.some(ext => importPath.endsWith(ext));
                      if (hasValidExtension) {
                        return false;
                      }
                      // If it ends with .ts or .tsx, it will be handled separately
                      if (importPath.endsWith('.ts') || importPath.endsWith('.tsx')) {
                        return false;
                      }
                      // Everything else (including .element, .test, etc.) needs .js added
                      return true;
                    };
                    
                    // Replace .ts and .tsx extensions with .js in import/export statements
                    // Handle both single-line and multi-line imports/exports (including } from pattern)
                    // Process all "from" statements (covers both import and export)
                    jsCode = jsCode.replace(/(\s+from\s+["'])([^"'\n]+)(["'])/g, (match, prefix, importPath, suffix) => {
                      if (importPath.endsWith('.ts') || importPath.endsWith('.tsx')) {
                        // Convert .ts/.tsx to .js
                        if (!importPath.startsWith('http') && !importPath.startsWith('/') && !importPath.startsWith('data:')) {
                          return prefix + importPath.replace(/\.tsx?$/, '.js') + suffix;
                        }
                      } else if (shouldAddJsExtension(importPath)) {
                        // Add .js to imports without extension
                        return prefix + importPath + '.js' + suffix;
                      }
                      return match;
                    });
                    // Also handle dynamic imports
                    jsCode = jsCode.replace(/(import\s*\(\s*["'])([^"'\n]+)(["']\s*\))/g, (match, prefix, importPath, suffix) => {
                      if (importPath.endsWith('.ts') || importPath.endsWith('.tsx')) {
                        if (!importPath.startsWith('http') && !importPath.startsWith('/') && !importPath.startsWith('data:')) {
                          return prefix + importPath.replace(/\.tsx?$/, '.js') + suffix;
                        }
                      } else if (shouldAddJsExtension(importPath)) {
                        return prefix + importPath + '.js' + suffix;
                      }
                      return match;
                    });
                    
                    // Write compiled JavaScript file
                    const jsFileName = item.replace(/\.tsx?$/, '.js');
                    const jsDestPath = join(dest, jsFileName);
                    writeFileSync(jsDestPath, jsCode, 'utf-8');
                    console.log(`[Compile TS to JS] Compiled ${sourcePath} to ${jsDestPath}`);
                    
                    // Also write source map if available
                    if (result.map) {
                      const mapDestPath = join(dest, jsFileName + '.map');
                      writeFileSync(mapDestPath, result.map, 'utf-8');
                    }
                  } catch (compileError: any) {
                    console.warn(`[Compile TS to JS] Failed to compile ${sourcePath}:`, compileError?.message || compileError);
                  }
                }
              } catch (error: any) {
                // Skip files/directories that can't be accessed
                continue;
              }
            }
          } catch (error: any) {
            console.warn(`[Compile TS to JS] Failed to process ${source}:`, error?.message || error);
          }
        };
        
        try {
          // Compile components directory
          await compileTSFiles(componentsSourceDir, componentsDestDir);
          console.log(`[Compile TS to JS] Successfully compiled TypeScript files to ${componentsDestDir}`);
          
          // Compile styles directory (if it exists)
          if (existsSync(stylesSourceDir)) {
            await compileTSFiles(stylesSourceDir, stylesDestDir, ['generators', 'test']); // Skip generators and test directories
            console.log(`[Compile TS to JS] Successfully compiled TypeScript files to ${stylesDestDir}`);
          }
        } catch (error: any) {
          console.warn(`[Compile TS to JS] Failed to compile TypeScript files:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to copy testers.css to dist/src/app/styles/
    {
      name: 'copy-testers-css',
      writeBundle() {
        const testersCssSource = resolve(__dirname, 'src/app/styles/testers.css');
        const testersCssDest = resolve(__dirname, 'dist/app/styles/testers.css');
        
        try {
          if (existsSync(testersCssSource)) {
            // Create destination directory
            mkdirSync(dirname(testersCssDest), { recursive: true });
            // Copy the file
            copyFileSync(testersCssSource, testersCssDest);
            console.log(`[Copy Testers CSS] Copied ${testersCssSource} to ${testersCssDest}`);
          } else {
            console.warn(`[Copy Testers CSS] Source file not found: ${testersCssSource}`);
          }
        } catch (error: any) {
          console.warn(`[Copy Testers CSS] Failed to copy testers.css:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to copy tester HTML files to maintain directory structure in dist
    {
      name: 'copy-tester-html-files',
      writeBundle() {
        // Copy tester HTML files from src/components/*/testers/ to dist/components/*/testers/
        const componentsSourceDir = resolve(__dirname, 'src/components');
        const componentsDestDir = resolve(__dirname, 'dist/components');
        
        // Recursive function to find and copy tester HTML files
        const copyTesterHTMLFiles = (source: string, dest: string) => {
          try {
            // Create destination directory
            mkdirSync(dest, { recursive: true });
            
            // Read all items in source directory
            const items = readdirSync(source);
            
            for (const item of items) {
              const sourcePath = join(source, item);
              const destPath = join(dest, item);
              
              try {
                const stat = statSync(sourcePath);
                
                if (stat.isDirectory()) {
                  // Recursively copy subdirectories
                  copyTesterHTMLFiles(sourcePath, destPath);
                } else if (stat.isFile() && item.startsWith('Tester') && item.endsWith('.html')) {
                  // Copy tester HTML files (Tester*.html)
                  copyFileSync(sourcePath, destPath);
                  console.log(`[Copy Tester HTML] Copied ${sourcePath} to ${destPath}`);
                }
              } catch (error: any) {
                // Skip files/directories that can't be accessed
                continue;
              }
            }
          } catch (error: any) {
            console.warn(`[Copy Tester HTML] Failed to copy ${source}:`, error?.message || error);
          }
        };
        
        try {
          copyTesterHTMLFiles(componentsSourceDir, componentsDestDir);
          console.log(`[Copy Tester HTML] Successfully copied tester HTML files to ${componentsDestDir}`);
        } catch (error: any) {
          console.warn(`[Copy Tester HTML] Failed to copy tester HTML files:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to copy pages folder to dist
    {
      name: 'copy-pages-folder',
      writeBundle() {
        // Copy entire src/pages/ folder structure to dist/pages/
        const pagesSourceDir = resolve(__dirname, 'src/pages');
        const pagesDestDir = resolve(__dirname, 'dist/pages');
        
        // Recursive function to copy directory structure
        const copyDirectory = (source: string, dest: string) => {
          try {
            // Create destination directory
            mkdirSync(dest, { recursive: true });
            
            // Read all items in source directory
            const items = readdirSync(source);
            
            for (const item of items) {
              const sourcePath = join(source, item);
              const destPath = join(dest, item);
              
              try {
                const stat = statSync(sourcePath);
                
                if (stat.isDirectory()) {
                  // Recursively copy subdirectories
                  copyDirectory(sourcePath, destPath);
                } else if (stat.isFile()) {
                  // Copy all files (JSON, TS, HTML, SVG, MD, etc.)
                  copyFileSync(sourcePath, destPath);
                  console.log(`[Copy Pages Folder] Copied ${sourcePath} to ${destPath}`);
                }
              } catch (error: any) {
                // Skip files/directories that can't be accessed
                console.warn(`[Copy Pages Folder] Skipped ${sourcePath}:`, error?.message || error);
                continue;
              }
            }
          } catch (error: any) {
            console.warn(`[Copy Pages Folder] Failed to copy ${source}:`, error?.message || error);
          }
        };
        
        try {
          // Check if pages directory exists
          if (existsSync(pagesSourceDir)) {
            copyDirectory(pagesSourceDir, pagesDestDir);
            console.log(`[Copy Pages Folder] Successfully copied pages folder structure to ${pagesDestDir}`);
          } else {
            console.warn(`[Copy Pages Folder] Source directory does not exist: ${pagesSourceDir}`);
          }
        } catch (error: any) {
          console.warn(`[Copy Pages Folder] Failed to copy pages folder:`, error?.message || error);
        }
      }
    } as Plugin,
    // Plugin to fix asset paths in HTML files in subdirectories
    {
      name: 'fix-html-asset-paths',
      writeBundle() {
        const distDir = resolve(__dirname, 'dist');
        
        // Recursive function to find and fix HTML files
        const fixHtmlFiles = (dir: string) => {
          try {
            if (!existsSync(dir)) return;
            
            const items = readdirSync(dir);
            
            for (const item of items) {
              const itemPath = join(dir, item);
              const stat = statSync(itemPath);
              
              if (stat.isDirectory()) {
                // Recursively process subdirectories
                fixHtmlFiles(itemPath);
              } else if (item.endsWith('.html')) {
                // Fix asset paths in HTML files
                try {
                  let content = readFileSync(itemPath, 'utf-8');
                  let modified = false;
                  
                  // Calculate relative path from HTML file to dist root
                  // HTML file is at: dist/components/XWUIPage/testers/file.html
                  // Assets are at: dist/assets/
                  // Calculate depth: count directory segments from dist to HTML file's directory
                  const htmlDir = dirname(itemPath);
                  const relativeToDist = htmlDir.replace(distDir, '').replace(/^[\\/]/, '');
                  const depth = relativeToDist ? relativeToDist.split(/[\\/]/).filter(Boolean).length : 0;
                  const relativePath = depth > 0 ? '../'.repeat(depth) + 'assets/' : 'assets/';
                  
                  // Fix script src paths (e.g., assets/testerXWUIPage-xxx.js)
                  content = content.replace(
                    /(<script[^>]*src=["'])(assets\/[^"']+)(["'])/g,
                    (match, prefix, assetPath, suffix) => {
                      if (!assetPath.startsWith('../') && !assetPath.startsWith('/')) {
                        modified = true;
                        return prefix + relativePath + assetPath + suffix;
                      }
                      return match;
                    }
                  );
                  
                  // Fix link href paths for CSS (e.g., assets/inter-xxx.css)
                  content = content.replace(
                    /(<link[^>]*href=["'])(assets\/[^"']+)(["'])/g,
                    (match, prefix, assetPath, suffix) => {
                      if (!assetPath.startsWith('../') && !assetPath.startsWith('/')) {
                        modified = true;
                        return prefix + relativePath + assetPath + suffix;
                      }
                      return match;
                    }
                  );
                  
                  // Fix preload links
                  content = content.replace(
                    /(<link[^>]*rel=["']modulepreload["'][^>]*href=["'])(assets\/[^"']+)(["'])/g,
                    (match, prefix, assetPath, suffix) => {
                      if (!assetPath.startsWith('../') && !assetPath.startsWith('/')) {
                        modified = true;
                        return prefix + relativePath + assetPath + suffix;
                      }
                      return match;
                    }
                  );
                  
                  // Convert .ts and .tsx imports to .js in inline scripts (for production builds)
                  // Match import statements in inline <script type="module"> tags
                  // Pattern 1: import ... from "...ts" or import ... from '...ts'
                  content = content.replace(/(import\s+.*?\s+from\s+["'])([^"']+\.tsx?)(["'])/g, (match, prefix, importPath, suffix) => {
                    // Only convert if it's a relative path (not a URL or absolute path)
                    if (!importPath.startsWith('http') && !importPath.startsWith('/') && !importPath.startsWith('data:')) {
                      modified = true;
                      // Convert .ts or .tsx to .js
                      const jsPath = importPath.replace(/\.tsx?$/, '.js');
                      return prefix + jsPath + suffix;
                    }
                    return match;
                  });
                  
                  // Pattern 2: Dynamic imports - import("...ts") or import('...ts')
                  content = content.replace(/(import\s*\(\s*["'])([^"']+\.tsx?)(["']\s*\))/g, (match, prefix, importPath, suffix) => {
                    // Only convert if it's a relative path (not a URL or absolute path)
                    if (!importPath.startsWith('http') && !importPath.startsWith('/') && !importPath.startsWith('data:')) {
                      modified = true;
                      // Convert .ts or .tsx to .js
                      const jsPath = importPath.replace(/\.tsx?$/, '.js');
                      return prefix + jsPath + suffix;
                    }
                    return match;
                  });
                  
                  // Deduplicate import statements - remove duplicate imports from the same module
                  // This handles cases where the same import appears multiple times in the script
                  content = content.replace(/(<script\s+type=["']module["']>)([\s\S]*?)(<\/script>)/g, (match, openTag, scriptContent, closeTag) => {
                    const seenImports = new Set<string>();
                    const lines = scriptContent.split('\n');
                    const deduplicatedLines: string[] = [];
                    
                    for (const line of lines) {
                      // Check if this is an import statement
                      const importMatch = line.match(/^\s*import\s+.*?\s+from\s+["']([^"']+)["']/);
                      if (importMatch) {
                        const modulePath = importMatch[1];
                        const normalizedLine = line.trim();
                        const importKey = `${modulePath}::${normalizedLine}`;
                        
                        // Check if we've seen this exact import before
                        if (!seenImports.has(importKey)) {
                          seenImports.add(importKey);
                          deduplicatedLines.push(line);
                        } else {
                          // Duplicate - skip this line
                          modified = true;
                        }
                      } else {
                        // Not an import, keep the line
                        deduplicatedLines.push(line);
                      }
                    }
                    
                    const deduplicated = deduplicatedLines.join('\n');
                    return openTag + deduplicated + closeTag;
                  });
                  
                  if (modified) {
                    // Write back the modified content
                    writeFileSync(itemPath, content, 'utf-8');
                    console.log(`[Fix HTML Asset Paths] Fixed paths in ${itemPath} (depth: ${depth}, path: ${relativePath})`);
                  }
                } catch (error: any) {
                  console.warn(`[Fix HTML Asset Paths] Failed to fix ${itemPath}:`, error?.message || error);
                }
              }
            }
          } catch (error: any) {
            console.warn(`[Fix HTML Asset Paths] Failed to process ${dir}:`, error?.message || error);
          }
        };
        
        // Start from dist directory
        fixHtmlFiles(distDir);
      }
    } as Plugin,
    // Plugin to flatten dist/src/ structure - move everything from dist/src/ to dist/
    {
      name: 'flatten-dist-structure',
      writeBundle() {
        const distSrcDir = resolve(__dirname, 'dist/src');
        const distDir = resolve(__dirname, 'dist');
        
        // Recursive function to move files from dist/src/ to dist/
        const flattenDirectory = (source: string, dest: string) => {
          try {
            if (!existsSync(source)) {
              return; // Source doesn't exist, skip
            }
            
            const items = readdirSync(source);
            
            for (const item of items) {
              const sourcePath = join(source, item);
              const destPath = join(dest, item);
              
              try {
                const stat = statSync(sourcePath);
                
                if (stat.isDirectory()) {
                  // Skip if destination already exists and is a directory
                  if (existsSync(destPath)) {
                    const destStat = statSync(destPath);
                    if (destStat.isDirectory()) {
                      // Merge directories recursively
                      flattenDirectory(sourcePath, destPath);
                      continue;
                    }
                  }
                  
                  // Create destination directory and move contents
                  mkdirSync(destPath, { recursive: true });
                  flattenDirectory(sourcePath, destPath);
                  
                  // Try to remove source directory if empty
                  try {
                    const remainingItems = readdirSync(sourcePath);
                    if (remainingItems.length === 0) {
                      readdirSync(sourcePath); // Check if truly empty
                      // Directory is empty, but we'll leave it for now to avoid errors
                    }
                  } catch {
                    // Ignore errors when checking/removing
                  }
                } else if (stat.isFile()) {
                  // Move file from dist/src/ to dist/
                  if (existsSync(destPath)) {
                    // File exists, overwrite it
                    copyFileSync(sourcePath, destPath);
                  } else {
                    // File doesn't exist, copy it
                    copyFileSync(sourcePath, destPath);
                  }
                  console.log(`[Flatten Dist] Moved ${sourcePath} -> ${destPath}`);
                }
              } catch (error: any) {
                console.warn(`[Flatten Dist] Failed to process ${sourcePath}:`, error?.message || error);
              }
            }
          } catch (error: any) {
            console.warn(`[Flatten Dist] Failed to flatten ${source}:`, error?.message || error);
          }
        };
        
        try {
          if (existsSync(distSrcDir)) {
            console.log('[Flatten Dist] Flattening dist/src/ structure to dist/...');
            flattenDirectory(distSrcDir, distDir);
            
            // After moving everything, try to remove dist/src/ if it's empty or only has empty dirs
            try {
              const remainingItems = readdirSync(distSrcDir);
              if (remainingItems.length === 0) {
                // Directory appears empty, but we'll leave it to avoid file lock issues
                console.log('[Flatten Dist] dist/src/ is now empty (left in place to avoid file locks)');
              } else {
                console.log(`[Flatten Dist] dist/src/ still has ${remainingItems.length} items (may be empty directories)`);
              }
            } catch {
              // Ignore errors
            }
            
            console.log('[Flatten Dist] Flattening complete');
          } else {
            console.log('[Flatten Dist] dist/src/ does not exist, nothing to flatten');
          }
        } catch (error: any) {
          console.warn(`[Flatten Dist] Failed to flatten dist structure:`, error?.message || error);
        }
      }
    } as Plugin,
    // OPTIMIZATION: Copy styles as-is (folders, css, json, svg, png) - no processing for speed
    // This plugin copies the entire src/styles directory to dist/styles without any transformation
    {
      name: 'copy-styles-as-is',
      enforce: 'post', // Run after build
      writeBundle() {
        const stylesSrc = resolve(__dirname, 'src/styles');
        const stylesDest = resolve(__dirname, 'dist/styles');
        
        // Recursively copy styles directory preserving structure
        function copyDir(src: string, dest: string) {
          if (!existsSync(src)) return;
          
          // Create destination directory
          if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true });
          }
          
          const entries = readdirSync(src, { withFileTypes: true });
          
          for (const entry of entries) {
            const srcPath = join(src, entry.name);
            const destPath = join(dest, entry.name);
            
            if (entry.isDirectory()) {
              // Recursively copy subdirectories
              copyDir(srcPath, destPath);
            } else {
              // Copy files as-is (css, json, svg, png, etc.)
              // Skip .ts files in styles (only copy assets)
              if (!entry.name.endsWith('.ts')) {
                copyFileSync(srcPath, destPath);
              }
            }
          }
        }
        
        try {
          copyDir(stylesSrc, stylesDest);
          console.log('[Copy Styles] Copied styles directory as-is to dist/styles');
        } catch (error: any) {
          console.warn('[Copy Styles] Failed to copy styles:', error?.message || error);
        }
      }
    } as Plugin,
    // OPTIMIZATION: Convert .ts imports to .js in HTML files after build
    // Components/app/pages/api: convert .ts to .js and update HTML mentions of .ts to .js
    {
      name: 'convert-ts-to-js-in-html',
      enforce: 'post', // Run after build
      writeBundle() {
        const distDir = resolve(__dirname, 'dist');
        
        // Find all HTML files in dist
        function findHtmlFiles(dir: string): string[] {
          const files: string[] = [];
          if (!existsSync(dir)) return files;
          
          const entries = readdirSync(dir, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            
            if (entry.isDirectory()) {
              // Recursively search subdirectories
              files.push(...findHtmlFiles(fullPath));
            } else if (entry.name.endsWith('.html')) {
              files.push(fullPath);
            }
          }
          
          return files;
        }
        
        try {
          const htmlFiles = findHtmlFiles(distDir);
          
          for (const htmlFile of htmlFiles) {
            let content = readFileSync(htmlFile, 'utf-8');
            let modified = false;
            
            // Replace .ts and .tsx imports with .js in script tags
            // Pattern: from '../index.ts' -> from '../index.js'
            // Pattern: from './Component.ts' -> from './Component.js'
            const tsImportRegex = /(from\s+['"])([^'"]+\.tsx?)(['"])/g;
            const newContent = content.replace(tsImportRegex, (match, prefix, path, suffix) => {
              modified = true;
              const jsPath = path.replace(/\.tsx?$/, '.js');
              return `${prefix}${jsPath}${suffix}`;
            });
            
            // Also replace in src attributes: src="./file.ts" -> src="./file.js"
            const tsSrcRegex = /(src\s*=\s*['"])([^'"]+\.tsx?)(['"])/g;
            const finalContent = newContent.replace(tsSrcRegex, (match, prefix, path, suffix) => {
              modified = true;
              const jsPath = path.replace(/\.tsx?$/, '.js');
              return `${prefix}${jsPath}${suffix}`;
            });
            
            if (modified) {
              writeFileSync(htmlFile, finalContent, 'utf-8');
              console.log(`[TS->JS] Updated imports in ${htmlFile.replace(distDir, 'dist')}`);
            }
          }
          
          console.log(`[TS->JS] Processed ${htmlFiles.length} HTML files`);
        } catch (error: any) {
          console.warn('[TS->JS] Failed to convert TS imports to JS:', error?.message || error);
        }
      }
    } as Plugin
  ],
  // Vite handles TypeScript automatically, no plugin needed
  // It will automatically resolve .ts imports without .js extensions
  // Now you can use .ts extension directly in HTML imports!
});


