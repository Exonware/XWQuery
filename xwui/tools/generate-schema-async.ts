/**
 * Async Schema Generator Wrapper
 * Runs schema generation in the background without blocking the build
 * Optimized for speed - runs directly without window spawning overhead
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const schemaScript = resolve(projectRoot, 'src', 'styles', 'generators', 'schema-generator.ts');

// Run directly without window spawning - much faster
// Try local tsx first, then npx tsx (without --yes to avoid check overhead)

const localTsx = join(projectRoot, 'node_modules', '.bin', 'tsx');
const tsxCmd = existsSync(localTsx) ? localTsx : 'npx';
const tsxArgs = existsSync(localTsx) ? [schemaScript] : ['tsx', schemaScript];

const child = spawn(tsxCmd, tsxArgs, {
    cwd: projectRoot,
    stdio: 'pipe',
    shell: true,
    detached: true
});

child.unref();
console.log('[Schema Generator] Generation started in background');

process.exit(0);

