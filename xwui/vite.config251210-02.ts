import { defineConfig } from 'vite';
import { resolve, join, dirname } from 'path';
import { readdirSync, statSync, copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// ============================================================================
// CONFIGURATION: Component-Agnostic Build Settings
// ============================================================================
// All paths, patterns, and behaviors are configurable here
// Modify these values to adapt to any project structure
const BUILD_CONFIG = {
  // Source directories to scan for HTML entry points
  sourceDirs: ['src/components', 'src/pages', 'src/app', 'src/api'] as string[],
  
  // Styles directory (copied as-is)
  stylesDir: 'src/styles' as string,
  
  // HTML entry file patterns (files matching these will be entry points)
  htmlEntryPatterns: {
    prefixes: ['Tester'] as string[], // Files starting with these prefixes become entries
    exactNames: ['index', 'run'] as string[], // Exact filenames that become entries
    rootIndexAsMain: true, // Map root 'index.html' to 'main' entry
  },
  
  // Directories to skip during recursive copy
  skipDirs: ['generators'] as string[],
  
  // Static file extensions to copy (from sourceDirs)
  staticExtensions: /\.(json|css|svg|png|jpg|jpeg|gif|grammar)$/i,
  
  // React CDN injection configuration (optional, set enabled: false to disable)
  reactCdn: {
    enabled: true,
    // Pattern to match HTML files that need React CDN injection
    htmlPattern: /XWUIStoryStudio\/run\.html/,
    // Pattern to match bundle script tags
    bundlePattern: /<script[^>]*src="([^"]*xwui-story-studio[^"]*)"[^>]*><\/script>/,
    // Module export names to try (in order)
    moduleExports: ['default', 'XWStoryApp'] as string[],
    // Root element ID for React mounting
    rootElementId: 'root',
  },
  
  // Path aliases
  aliases: {
    '@': './src',
    '@components': './src/components',
  } as Record<string, string>,
};

// ============================================================================
// HELPER: Dynamic Entry Discovery
// ============================================================================
// Recursively finds all HTML files in a directory to use as entry points
// Uses BUILD_CONFIG for patterns - completely component-agnostic
function getHtmlEntries(rootDir: string) {
  const entries: Record<string, string> = {};
  if (!existsSync(rootDir)) return entries;

  function scan(dir: string) {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith('.html')) {
        const name = item.replace(/\.html$/, '');
        
        // Check if file matches any entry pattern
        const matchesPrefix = BUILD_CONFIG.htmlEntryPatterns.prefixes.some(prefix => name.startsWith(prefix));
        const matchesExact = BUILD_CONFIG.htmlEntryPatterns.exactNames.includes(name);
        
        if (matchesPrefix || matchesExact) {
          let key = name;
          
          // Handle root index.html -> main
          if (name === 'index' && dir === rootDir && BUILD_CONFIG.htmlEntryPatterns.rootIndexAsMain) {
            key = 'main';
          }
          // Handle prefix patterns (e.g., TesterButton -> testerButton)
          else if (matchesPrefix) {
            const prefix = BUILD_CONFIG.htmlEntryPatterns.prefixes.find(p => name.startsWith(p));
            if (prefix) {
              const suffix = name.slice(prefix.length);
              key = `${prefix.toLowerCase()}${suffix}`;
            }
          }
          
          // Simple collision handling
          if (!entries[key]) {
            entries[key] = fullPath;
          }
        }
      }
    }
  }
  scan(rootDir);
  return entries;
}

// ============================================================================
// HELPER: Simple Recursive Copy
// ============================================================================
// Component-agnostic: uses BUILD_CONFIG.skipDirs for directories to skip
function copyRecursive(src: string, dest: string, filter?: (name: string) => boolean) {
  if (!existsSync(src)) return;
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip directories listed in BUILD_CONFIG.skipDirs
      if (!BUILD_CONFIG.skipDirs.includes(entry.name)) {
        copyRecursive(srcPath, destPath, filter);
      }
    } else {
      if (!filter || filter(entry.name)) {
        copyFileSync(srcPath, destPath);
      }
    }
  }
}

// ============================================================================
// PLUGIN: Copy Assets & Styles
// ============================================================================
// OPTIMIZATION: Copy styles as-is (folders, css, json, svg, png) - no processing for speed
// Component-agnostic: uses BUILD_CONFIG for all paths and patterns
function copyStaticAssetsPlugin(): Plugin {
  return {
    name: 'copy-static-assets',
    writeBundle() {
      // 1. Copy styles directory EXACTLY as is (Folders, JSON, CSS, SVG, PNG, etc)
      const stylesSrc = resolve(__dirname, BUILD_CONFIG.stylesDir);
      const stylesDest = resolve(__dirname, 'dist', BUILD_CONFIG.stylesDir.replace('src/', ''));
      copyRecursive(stylesSrc, stylesDest, (name) => !name.endsWith('.ts')); // Skip .ts files
      console.log(`✨ [Copy] ${BUILD_CONFIG.stylesDir} copied to dist/${BUILD_CONFIG.stylesDir.replace('src/', '')}`);

      // 2. Copy static assets from source directories that Vite might miss
      // (Vite handles imported assets, but this ensures non-imported ones move over too if needed)
      BUILD_CONFIG.sourceDirs.forEach(dir => {
        const srcDir = resolve(__dirname, dir);
        const destDir = resolve(__dirname, 'dist', dir.replace('src/', ''));
        
        copyRecursive(srcDir, destDir, (name) => {
          // Copy explicit static extensions, ignore .ts/.html (Vite builds those)
          return BUILD_CONFIG.staticExtensions.test(name);
        });
      });
    }
  };
}

// ============================================================================
// PLUGIN: Convert .ts imports to .js in HTML files
// ============================================================================
// OPTIMIZATION: Convert .ts to .js and update HTML mentions of .ts to .js
// Component-agnostic: works on all HTML files in dist
function convertTsToJsInHtmlPlugin(): Plugin {
  return {
    name: 'convert-ts-to-js-in-html',
    enforce: 'post', // Run after build
    writeBundle() {
      const distDir = resolve(__dirname, 'dist');
      
      // Find all HTML files in dist recursively
      function findHtmlFiles(dir: string): string[] {
        const files: string[] = [];
        if (!existsSync(dir)) return files;
        
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          if (entry.isDirectory()) {
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
            // Only convert relative paths (not URLs or absolute paths)
            if (!path.startsWith('http') && !path.startsWith('/') && !path.startsWith('data:')) {
              modified = true;
              const jsPath = path.replace(/\.tsx?$/, '.js');
              return `${prefix}${jsPath}${suffix}`;
            }
            return match;
          });
          
          // Also replace in src attributes: src="./file.ts" -> src="./file.js"
          const tsSrcRegex = /(src\s*=\s*['"])([^'"]+\.tsx?)(['"])/g;
          const finalContent = newContent.replace(tsSrcRegex, (match, prefix, path, suffix) => {
            // Only convert relative paths (not URLs or absolute paths)
            if (!path.startsWith('http') && !path.startsWith('/') && !path.startsWith('data:')) {
              modified = true;
              const jsPath = path.replace(/\.tsx?$/, '.js');
              return `${prefix}${jsPath}${suffix}`;
            }
            return match;
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
  };
}

// ============================================================================
// PLUGIN: Inject React CDN (Optional)
// ============================================================================
// Component-agnostic: uses BUILD_CONFIG.reactCdn for all patterns
// Set BUILD_CONFIG.reactCdn.enabled = false to disable
function injectReactCdnPlugin(): Plugin | null {
  if (!BUILD_CONFIG.reactCdn.enabled) return null;
  
  return {
    name: 'inject-react-cdn',
    transformIndexHtml(html, context) {
      // Check if this HTML file matches the pattern
      if (!context.filename || !BUILD_CONFIG.reactCdn.htmlPattern.test(context.filename)) {
        return html;
      }
      
      const importMap = `
  <script type="importmap">
  { "imports": { "react": "https://esm.sh/react@19", "react-dom": "https://esm.sh/react-dom@19", "react-dom/client": "https://esm.sh/react-dom@19/client" } }
  </script>`;
      
      const bundleScriptMatch = html.match(BUILD_CONFIG.reactCdn.bundlePattern);
      if (bundleScriptMatch) {
        const bundlePath = bundleScriptMatch[1];
        // Try module exports in order
        const moduleExports = BUILD_CONFIG.reactCdn.moduleExports
          .map(name => `module.${name}`)
          .join(' || ');
        
        const renderCode = `
  <script type="module">
    import React from "react";
    import { createRoot } from "react-dom/client";
    const module = await import("${bundlePath}");
    const App = ${moduleExports} || module;
    const root = createRoot(document.getElementById('${BUILD_CONFIG.reactCdn.rootElementId}'));
    root.render(React.createElement(App));
  </script>`;
        return html.replace('</head>', `${importMap}\n</head>`)
                   .replace(bundleScriptMatch[0], bundleScriptMatch[0] + renderCode);
      }
      return html.replace('</head>', `${importMap}\n</head>`);
    }
  };
}

// ============================================================================
// MAIN CONFIGURATION
// ============================================================================
// Component-agnostic: all paths and patterns come from BUILD_CONFIG
export default defineConfig(({ mode }) => {
  // Determine if React should be external (e.g., for CDN builds)
  // This can be customized based on build flags or environment
  const shouldExternalizeReact = process.env.npm_lifecycle_event === 'build:vite' && 
                                  process.argv.includes('xwui-story-studio');

  return {
    base: './', // CRITICAL: This ensures all asset paths in HTML are relative (e.g. assets/foo.js)
    
    // ============================================================================
    // BUILD CONFIGURATION - OPTIMIZED FOR SPEED
    // ============================================================================
    // Key optimizations:
    // 1. Styles copied as-is (folders, css, json, svg, png) - no processing
    // 2. Source directories: .ts converted to .js, HTML imports updated
    // 3. Sourcemaps disabled, esbuild minification, minimal chunk splitting
    // All paths and patterns are configurable via BUILD_CONFIG
    // ============================================================================
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      target: 'es2022',
      minify: 'esbuild', // OPTIMIZATION: Faster than terser
      sourcemap: false, // OPTIMIZATION: Disable sourcemaps for faster builds
      chunkSizeWarningLimit: 1000, // Increase warning threshold to reduce warnings
      
      rollupOptions: {
        // Entry Points - discover all HTML files dynamically from BUILD_CONFIG.sourceDirs
        input: {
          main: resolve(__dirname, 'index.html'), // Root index
          ...BUILD_CONFIG.sourceDirs.reduce((acc, dir) => {
            const entries = getHtmlEntries(resolve(__dirname, dir));
            return { ...acc, ...entries };
          }, {} as Record<string, string>),
        },

        // OPTIMIZATION: Output configuration for speed
        output: {
          // Use hashed filenames for cache busting (standard Vite pattern)
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Let Vite decide chunk splitting automatically (faster)
          manualChunks: undefined,
        },

        // External Dependencies
        external: (id) => {
          if (id === 'react' || id === 'react-dom') return shouldExternalizeReact;
          return false;
        }
      }
    },

    plugins: [
      // OPTIMIZATION: Copy styles and static assets as-is (no processing)
      copyStaticAssetsPlugin(),

      // OPTIMIZATION: Convert .ts imports to .js in HTML files (REQUIRED for production)
      convertTsToJsInHtmlPlugin(),

      // Inject React CDN (optional, configured via BUILD_CONFIG.reactCdn)
      injectReactCdnPlugin(),
    ].filter((p): p is Plugin => p !== null),

    resolve: {
      alias: Object.fromEntries(
        Object.entries(BUILD_CONFIG.aliases).map(([key, value]) => [
          key,
          resolve(__dirname, value)
        ])
      )
    }
  };
});