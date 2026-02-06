#!/usr/bin/env node
/**
 * Benchmark: page load time (navigation start → load event) for all XWUI examples.
 * Prerequisite: start all servers first (examples\run-all-servers.bat), then run:
 *   cd examples && npm install && npm run benchmark:install && npm run benchmark
 * Or from repo root: node examples/benchmark-load.js (requires Playwright installed in examples/)
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Same ports as run-all-servers.bat
const EXAMPLES = [
  { name: 'Vanilla', port: 3000 },
  { name: 'Alpine', port: 3001 },
  { name: 'Next', port: 3002 },
  { name: 'Nuxt', port: 3003 },
  { name: 'htmx', port: 3010 },
  { name: 'Stimulus', port: 3011 },
  { name: 'Petite-Vue', port: 3012 },
  { name: 'jQuery', port: 3013 },
  { name: 'Backbone', port: 3014 },
  { name: 'Riot', port: 3015 },
  { name: 'Marko', port: 3016 },
  { name: 'Knockout', port: 3017 },
  { name: 'Hyperapp', port: 3018 },
  { name: 'Dojo', port: 3019 },
  { name: 'Ember', port: 3020 },
  { name: 'Aurelia', port: 3021 },
  { name: 'Fresh', port: 3022 },
  { name: 'Stencil', port: 3023 },
  { name: 'React', port: 5173 },
  { name: 'Vue', port: 5174 },
  { name: 'Svelte', port: 5175 },
  { name: 'Solid', port: 5176 },
  { name: 'Qwik', port: 5177 },
  { name: 'Preact', port: 5178 },
  { name: 'Lit', port: 5179 },
  { name: 'Astro', port: 5180 },
  { name: 'Mithril', port: 5181 },
  { name: 'SvelteKit', port: 5182 },
  { name: 'Remix', port: 5183 },
  { name: 'Gatsby', port: 8000 },
  { name: 'Eleventy', port: 8080 },
  { name: 'Angular', port: 4201 },
];

const RUNS = 3; // number of loads per URL; we use median
const TIMEOUT_MS = 45000; // allow slow dev servers (e.g. Vite first compile)
const RETRY_DELAY_MS = 3000; // wait before retry when a request fails (server may still be starting)
const MAX_RETRIES = 2; // retry up to 2 times per run for failed goto

// Optional: node benchmark-load.js --only=React (only measure that framework)
const onlyName = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const EXAMPLES_TO_RUN = onlyName ? EXAMPLES.filter((e) => e.name.toLowerCase() === onlyName.toLowerCase()) : EXAMPLES;
if (onlyName && EXAMPLES_TO_RUN.length === 0) {
  console.error(`Unknown framework: ${onlyName}`);
  process.exit(1);
}
if (onlyName) console.log(`Measuring only: ${EXAMPLES_TO_RUN.map((e) => e.name).join(', ')}\n`);

async function measureLoadTime(page, url, retriesLeft = MAX_RETRIES) {
  try {
    await page.goto(url, { waitUntil: 'load', timeout: TIMEOUT_MS });
    const loadTime = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.loadEventEnd > 0) return nav.loadEventEnd - nav.startTime;
      return 0;
    });
    return { loadTime, ok: true };
  } catch (e) {
    if (retriesLeft > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return measureLoadTime(page, url, retriesLeft - 1);
    }
    return { loadTime: null, ok: false, error: e.message };
  }
}

function median(arr) {
  const a = arr.filter((x) => x != null && !isNaN(x)).sort((a, b) => a - b);
  if (a.length === 0) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

async function main() {
  console.log('XWUI Examples – Load time benchmark');
  console.log('Ensure all servers are running (examples\\run-all-servers.bat)\n');

  const results = [];
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    for (const ex of EXAMPLES_TO_RUN) {
      const base = `http://127.0.0.1:${ex.port}`;
      const indexUrl = `${base}/`;
      const uberUrl = `${base}/uber/uber.html`;

      process.stdout.write(`${ex.name} (button) ... `);
      const indexTimes = [];
      for (let r = 0; r < RUNS; r++) {
        const { loadTime, ok } = await measureLoadTime(page, indexUrl);
        if (ok && loadTime != null) indexTimes.push(loadTime);
      }
      const indexMs = median(indexTimes);
      console.log(indexMs != null ? `${indexMs.toFixed(0)} ms` : 'failed');

      process.stdout.write(`${ex.name} (uber)   ... `);
      const uberTimes = [];
      for (let r = 0; r < RUNS; r++) {
        const { loadTime, ok } = await measureLoadTime(page, uberUrl);
        if (ok && loadTime != null) uberTimes.push(loadTime);
      }
      const uberMs = median(uberTimes);
      console.log(uberMs != null ? `${uberMs.toFixed(0)} ms` : 'failed');

      results.push({
        name: ex.name,
        port: ex.port,
        buttonMs: indexMs,
        uberMs: uberMs,
      });
    }

    await page.close();
  } finally {
    await browser.close();
  }

  // Sort by button load time (ascending = fastest first)
  const byButton = [...results].filter((r) => r.buttonMs != null).sort((a, b) => a.buttonMs - b.buttonMs);
  const byUber = [...results].filter((r) => r.uberMs != null).sort((a, b) => a.uberMs - b.uberMs);

  const reactResult = results.find((r) => r.name === 'React');
  const reactButton = reactResult?.buttonMs ?? null;
  const reactUber = reactResult?.uberMs ?? null;

  const failedCount = results.filter((r) => r.buttonMs == null && r.uberMs == null).length;
  let md = `# XWUI Examples – Load Time Benchmark

Generated: ${new Date().toISOString()}

**Metric:** Time from navigation start until \`load\` event (ms). Median of ${RUNS} runs per URL.

**Prerequisite:** All example servers must be running (e.g. \`examples\\run-all-servers.bat\`), then run \`npm run benchmark\` from the \`examples\` folder.
${failedCount > 0 ? '\n\nFrameworks shown as — had no successful measurement (request failed or timed out; their dev server may still have been starting or was not reachable).' : ''}

---

## Button demo (index page)

| Rank | Framework | Load (ms) |
|------|-----------|-----------|
`;
  byButton.forEach((r, i) => {
    const vs = reactButton != null && r.buttonMs != null ? ` (vs React: ${(r.buttonMs - reactButton).toFixed(0)} ms)` : '';
    md += `| ${i + 1} | ${r.name} | ${r.buttonMs.toFixed(0)}${vs} |\n`;
  });

  md += `
---

## Uber-like page

| Rank | Framework | Load (ms) |
|------|-----------|-----------|
`;
  byUber.forEach((r, i) => {
    const vs = reactUber != null && r.uberMs != null ? ` (vs React: ${(r.uberMs - reactUber).toFixed(0)} ms)` : '';
    md += `| ${i + 1} | ${r.name} | ${r.uberMs.toFixed(0)}${vs} |\n`;
  });

  const reactMeasured = reactButton != null && reactUber != null;
  const fasterButton = reactMeasured ? byButton.filter((r) => r.buttonMs != null && r.buttonMs < reactButton).map((r) => r.name).join(', ') || 'none' : '—';
  const slowerButton = reactMeasured ? byButton.filter((r) => r.buttonMs != null && r.buttonMs > reactButton).map((r) => r.name).join(', ') || 'none' : '—';
  const fasterUber = reactMeasured ? byUber.filter((r) => r.uberMs != null && r.uberMs < reactUber).map((r) => r.name).join(', ') || 'none' : '—';
  const slowerUber = reactMeasured ? byUber.filter((r) => r.uberMs != null && r.uberMs > reactUber).map((r) => r.name).join(', ') || 'none' : '—';

  md += `
---

## React vs others (summary)

- **Button demo:** React load time = ${reactButton != null ? `${reactButton.toFixed(0)} ms` : 'N/A (no successful measurement)'}. Frameworks faster than React: ${fasterButton}. Slower: ${slowerButton}.
- **Uber page:** React load time = ${reactUber != null ? `${reactUber.toFixed(0)} ms` : 'N/A (no successful measurement)'}. Frameworks faster than React: ${fasterUber}. Slower: ${slowerUber}.
${!reactMeasured ? `
*React (and some other frameworks) showed no measurement—often because their dev server was still starting when the benchmark ran. Start all servers, wait until Vite/metaframework terminals show "ready", then run \`npm run benchmark\`.*
` : ''}

---

## Raw data (all frameworks)

| Framework | Button (ms) | Uber (ms) |
|-----------|-------------|-----------|
`;
  results.forEach((r) => {
    const b = r.buttonMs != null ? r.buttonMs.toFixed(0) : '—';
    const u = r.uberMs != null ? r.uberMs.toFixed(0) : '—';
    md += `| ${r.name} | ${b} | ${u} |\n`;
  });

  md += `
*Servers: 127.0.0.1, ports as in run-all-servers.bat.*
`;

  const outPath = path.join(__dirname, 'BENCHMARK-LOAD.md');
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`\nWrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
