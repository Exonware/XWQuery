import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import type { Plugin } from 'vite';
import settings from './preservation_settings.json';

// Get project root (where package.json is located)
// This works reliably whether running from vite.config.ts or directly
const projectRoot = process.cwd();

// Default values for backward compatibility
const DEFAULT_DEBOUNCE_MS = 500;
const DEFAULT_MANIFEST_SCRIPT = 'src/styles/generators/manifest-generator.ts';
const DEFAULT_SKIP_DURING_BUILD = true;

/**
 * Plugin to auto-regenerate manifest on CSS file changes
 * Uses settings from preservation_settings.json
 */
export function createManifestWatcherPlugin(): Plugin {
  let isGenerating = false;
  let debounceTimer: NodeJS.Timeout | null = null;

  // Get styles preservation config
  const stylesConfig = settings.preservation?.styles;
  const rootDir = settings.root || 'dist';
  
  // Determine what to watch based on styles config
  const watchExtensions = stylesConfig?.ext?.map(ext => `.${ext}`) || ['.css'];
  const watchPatterns = ['src/styles']; // Styles directory to watch
  
  // Use default debounce or get from settings if available
  const debounceMs = (settings as any).debounceMs || DEFAULT_DEBOUNCE_MS;
  const skipDuringBuild = (settings as any).skipDuringBuild ?? DEFAULT_SKIP_DURING_BUILD;
  const manifestScript = (settings as any).manifestScript || DEFAULT_MANIFEST_SCRIPT;

  const generateManifest = (): Promise<void> => {
    return new Promise((promiseResolve, promiseReject) => {
      if (isGenerating) {
        // If already generating, wait for it to complete
        const checkInterval = setInterval(() => {
          if (!isGenerating) {
            clearInterval(checkInterval);
            promiseResolve();
          }
        }, 100);
        return;
      }
      
      isGenerating = true;

      const manifestScriptPath = resolve(projectRoot, manifestScript);
      const localTsx = join(projectRoot, 'node_modules', '.bin', 'tsx');
      
      // Build command and args
      let command: string;
      let args: string[];
      if (existsSync(localTsx)) {
        command = localTsx;
        args = [manifestScriptPath];
      } else {
        command = 'npx';
        args = ['tsx', manifestScriptPath];
      }

      const child = spawn(command, args, {
        cwd: projectRoot,
        stdio: 'pipe',
        shell: true,
        detached: false // Keep attached so we can wait for it
      });

      child.on('close', (code) => {
        isGenerating = false;
        if (code === 0) {
          promiseResolve();
        } else {
          promiseReject(new Error(`Manifest generation failed with code ${code}`));
        }
      });

      child.on('error', (err) => {
        isGenerating = false;
        promiseReject(err);
      });
    });
  };

  return {
    name: 'auto-regenerate-manifest',
    configureServer(server) {
      // Watch for file changes based on styles preservation config
      server.watcher.on('change', (path) => {
        const matchesInclude = watchPatterns.some(pattern => path.includes(pattern));
        const matchesExtension = watchExtensions.some(ext => path.endsWith(ext));
        
        if (matchesInclude && matchesExtension) {
          // Debounce to avoid multiple rapid regenerations
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            console.log('🔄 [Auto] CSS file changed, regenerating manifest...');
            generateManifest();
          }, debounceMs);
        }
      });

      server.watcher.on('add', (path) => {
        const matchesInclude = watchPatterns.some(pattern => path.includes(pattern));
        const matchesExtension = watchExtensions.some(ext => path.endsWith(ext));
        
        if (matchesInclude && matchesExtension) {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            console.log('✨ [Auto] New CSS file detected, regenerating manifest...');
            generateManifest();
          }, debounceMs);
        }
      });
    },
    async buildStart() {
      if (skipDuringBuild) {
        // Skip manifest generation during build for speed - assume it's already generated
        // Manifest is generated in package.json pre-build step (generate:styles:async)
        // This saves significant build time
        console.log('⏩ Skipping manifest generation (assumed pre-generated)');
      }
    }
  };
}

