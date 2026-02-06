#!/usr/bin/env node
/**
 * Start ONE example server, wait for it, run benchmark for that one only, then kill server.
 * Usage: node benchmark-one.js React
 *        node benchmark-one.js Vue
 *        node benchmark-one.js Vanilla
 * (Framework name as in EXAMPLES list; case-insensitive.)
 */
import { spawn } from 'child_process';
import { chromium } from 'playwright';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EX = path.join(__dirname);

const EXAMPLES = [
  { name: 'Vanilla', port: 3000, cmd: 'npx', args: ['-y', 'serve', '-l', '3000'], cwd: 'vanilla', shell: true },
  { name: 'React', port: 5173, cmd: 'npx', args: ['vite', '--port', '5173'], cwd: 'react', shell: true },
  { name: 'Vue', port: 5174, cmd: 'node', args: ['node_modules/vite/bin/vite.js', '--port', '5174'], cwd: 'vue', shell: false },
  { name: 'Svelte', port: 5175, cmd: 'node', args: ['node_modules/vite/bin/vite.js', '--port', '5175'], cwd: 'svelte', shell: false },
  { name: 'Solid', port: 5176, cmd: 'node', args: ['node_modules/vite/bin/vite.js', '--port', '5176'], cwd: 'solid', shell: false },
  { name: 'Preact', port: 5178, cmd: 'node', args: ['node_modules/vite/bin/vite.js', '--port', '5178'], cwd: 'preact', shell: false },
  { name: 'Lit', port: 5179, cmd: 'node', args: ['node_modules/vite/bin/vite.js', '--port', '5179'], cwd: 'lit', shell: false },
  { name: 'Next', port: 3002, cmd: 'npm', args: ['run', 'dev'], cwd: 'next', shell: true },
  { name: 'Nuxt', port: 3003, cmd: 'npm', args: ['run', 'dev'], cwd: 'nuxt', shell: true },
  { name: 'Eleventy', port: 8080, cmd: 'npm', args: ['run', 'dev'], cwd: 'eleventy', shell: true },
];

function waitForPort(port, timeoutMs = 60000) {
  return new Promise((resolve) => {
    const start = Date.now();
    function tryConnect() {
      if (Date.now() - start > timeoutMs) {
        resolve(false);
        return;
      }
      const sock = net.createConnection(port, '127.0.0.1', () => {
        sock.destroy();
        resolve(true);
      });
      sock.on('error', () => {
        sock.destroy();
        setTimeout(tryConnect, 500);
      });
    }
    tryConnect();
  });
}

async function main() {
  const name = process.argv[2] || 'React';
  const ex = EXAMPLES.find((e) => e.name.toLowerCase() === name.toLowerCase());
  if (!ex) {
    console.error('Usage: node benchmark-one.js <FrameworkName>');
    console.error('Known:', EXAMPLES.map((e) => e.name).join(', '));
    process.exit(1);
  }

  const cwd = path.resolve(EX, ex.cwd);
  console.log(`Starting ${ex.name} (port ${ex.port})...`);
  const opts = { cwd, env: process.env, shell: ex.shell !== false };
  opts.stdio = ['ignore', 'ignore', 'pipe'];
  const child = spawn(ex.cmd, ex.args, opts);
  if (child.stderr) {
    child.stderr.on('data', (d) => process.stderr.write(`[${ex.name}] ${d}`));
  }
  child.unref();

  console.log('Waiting for server to be ready...');
  const up = await waitForPort(ex.port, 60000);
  if (!up) {
    console.error(`${ex.name} did not start within 60s`);
    try {
      child.kill('SIGTERM');
    } catch (_) {}
    process.exit(1);
  }
  console.log(`${ex.name} is up. Running benchmark (3 runs each)...\n`);

  const RUNS = 3;
  const TIMEOUT_MS = 30000;
  const base = `http://127.0.0.1:${ex.port}`;
  const indexUrl = `${base}/`;
  const uberUrl = `${base}/uber/uber.html`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const times = { button: [], uber: [] };

  async function measureLoadTime(url) {
    try {
      await page.goto(url, { waitUntil: 'load', timeout: TIMEOUT_MS });
      const loadTime = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav && nav.loadEventEnd > 0) return nav.loadEventEnd - nav.startTime;
        return 0;
      });
      return loadTime;
    } catch (e) {
      return null;
    }
  }

  for (let r = 0; r < RUNS; r++) {
    const t1 = await measureLoadTime(indexUrl);
    if (t1 != null) times.button.push(t1);
    const t2 = await measureLoadTime(uberUrl);
    if (t2 != null) times.uber.push(t2);
  }
  await page.close();
  await browser.close();

  function median(arr) {
    const a = arr.filter((x) => x != null && !isNaN(x)).sort((a, b) => a - b);
    if (a.length === 0) return null;
    const m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }

  const buttonMs = median(times.button);
  const uberMs = median(times.uber);

  console.log('--- Result ---');
  console.log(`${ex.name} (button demo): ${buttonMs != null ? buttonMs.toFixed(0) + ' ms' : 'failed'}`);
  console.log(`${ex.name} (uber page):   ${uberMs != null ? uberMs.toFixed(0) + ' ms' : 'failed'}`);

  try {
    if (child.pid) child.kill('SIGTERM');
  } catch (_) {}
  console.log('\nServer stopped.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
