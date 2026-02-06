#!/usr/bin/env node
/**
 * Start all example servers as child processes, wait for ports, run benchmark, then kill servers.
 * Run from repo root: node examples/benchmark-with-servers.js
 * Or from examples: node benchmark-with-servers.js
 */
import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EX = path.join(ROOT, 'examples');

function waitForPort(port, timeoutMs = 5000) {
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

function spawnServer(cwd, command, args, port) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'ignore',
    shell: true,
    env: { ...process.env },
  });
  child.unref();
  return child;
}

const SERVER_JOBS = [
  { name: 'Vanilla', cwd: path.join(EX, 'vanilla'), cmd: 'npx', args: ['-y', 'serve', '-l', '3000'], port: 3000 },
  { name: 'Alpine', cwd: path.join(EX, 'alpine'), cmd: 'npx', args: ['-y', 'serve', '-l', '3001'], port: 3001 },
  { name: 'htmx', cwd: path.join(EX, 'htmx'), cmd: 'npx', args: ['-y', 'serve', '-l', '3010'], port: 3010 },
  { name: 'Stimulus', cwd: path.join(EX, 'stimulus'), cmd: 'npx', args: ['-y', 'serve', '-l', '3011'], port: 3011 },
  { name: 'Petite-Vue', cwd: path.join(EX, 'petite-vue'), cmd: 'npx', args: ['-y', 'serve', '-l', '3012'], port: 3012 },
  { name: 'jQuery', cwd: path.join(EX, 'jquery'), cmd: 'npx', args: ['-y', 'serve', '-l', '3013'], port: 3013 },
  { name: 'Backbone', cwd: path.join(EX, 'backbone'), cmd: 'npx', args: ['-y', 'serve', '-l', '3014'], port: 3014 },
  { name: 'Riot', cwd: path.join(EX, 'riot'), cmd: 'npx', args: ['-y', 'serve', '-l', '3015'], port: 3015 },
  { name: 'Marko', cwd: path.join(EX, 'marko'), cmd: 'npx', args: ['-y', 'serve', '-l', '3016'], port: 3016 },
  { name: 'Knockout', cwd: path.join(EX, 'knockout'), cmd: 'npx', args: ['-y', 'serve', '-l', '3017'], port: 3017 },
  { name: 'Hyperapp', cwd: path.join(EX, 'hyperapp'), cmd: 'npx', args: ['-y', 'serve', '-l', '3018'], port: 3018 },
  { name: 'Dojo', cwd: path.join(EX, 'dojo'), cmd: 'npx', args: ['-y', 'serve', '-l', '3019'], port: 3019 },
  { name: 'Ember', cwd: path.join(EX, 'ember'), cmd: 'npx', args: ['-y', 'serve', '-l', '3020'], port: 3020 },
  { name: 'Aurelia', cwd: path.join(EX, 'aurelia'), cmd: 'npx', args: ['-y', 'serve', '-l', '3021'], port: 3021 },
  { name: 'Fresh', cwd: path.join(EX, 'fresh'), cmd: 'npx', args: ['-y', 'serve', '-l', '3022'], port: 3022 },
  { name: 'Stencil', cwd: path.join(EX, 'stencil'), cmd: 'npx', args: ['-y', 'serve', '-l', '3023'], port: 3023 },
  { name: 'Next', cwd: path.join(EX, 'next'), cmd: 'npx', args: ['next', 'dev', '--port', '3002'], port: 3002 },
  { name: 'Nuxt', cwd: path.join(EX, 'nuxt'), cmd: 'npx', args: ['nuxi', 'dev', '-p', '3003'], port: 3003 },
  // noShell: use node with absolute path (forward slashes for shell)
  { name: 'React', cwd: path.join(EX, 'react'), cmd: 'node', args: [path.join(EX, 'react', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5173'], port: 5173, noShell: true },
  { name: 'Vue', cwd: path.join(EX, 'vue'), cmd: 'node', args: [path.join(EX, 'vue', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5174'], port: 5174, noShell: true },
  { name: 'Svelte', cwd: path.join(EX, 'svelte'), cmd: 'node', args: [path.join(EX, 'svelte', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5175'], port: 5175, noShell: true },
  { name: 'Solid', cwd: path.join(EX, 'solid'), cmd: 'node', args: [path.join(EX, 'solid', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5176'], port: 5176, noShell: true },
  { name: 'Qwik', cwd: path.join(EX, 'qwik'), cmd: 'node', args: [path.join(EX, 'qwik', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5177'], port: 5177, noShell: true },
  { name: 'Preact', cwd: path.join(EX, 'preact'), cmd: 'node', args: [path.join(EX, 'preact', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5178'], port: 5178, noShell: true },
  { name: 'Lit', cwd: path.join(EX, 'lit'), cmd: 'node', args: [path.join(EX, 'lit', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5179'], port: 5179, noShell: true },
  { name: 'Astro', cwd: path.join(EX, 'astro'), cmd: 'node', args: [path.join(EX, 'astro', 'node_modules', 'astro', 'astro.js').replace(/\\/g, '/'), 'dev', '--port', '5180'], port: 5180, noShell: true },
  { name: 'Mithril', cwd: path.join(EX, 'mithril'), cmd: 'node', args: [path.join(EX, 'mithril', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), '--port', '5181'], port: 5181, noShell: true },
  { name: 'SvelteKit', cwd: path.join(EX, 'sveltekit'), cmd: 'node', args: [path.join(EX, 'sveltekit', 'node_modules', 'vite', 'bin', 'vite.js').replace(/\\/g, '/'), 'dev', '--port', '5182'], port: 5182, noShell: true },
  { name: 'Remix', cwd: path.join(EX, 'remix'), cmd: 'node', args: [path.join(EX, 'remix', 'node_modules', '@remix-run', 'dev', 'dist', 'cli.js').replace(/\\/g, '/'), 'vite:dev', '--port', '5183'], port: 5183, noShell: true },
  { name: 'Gatsby', cwd: path.join(EX, 'gatsby'), cmd: 'node', args: [path.join(EX, 'gatsby', 'node_modules', 'gatsby', 'cli.js').replace(/\\/g, '/'), 'develop', '--port', '8000'], port: 8000, noShell: true },
  { name: 'Eleventy', cwd: path.join(EX, 'eleventy'), cmd: 'npx', args: ['eleventy', '--serve', '--port', '8080'], port: 8080 },
  { name: 'Angular', cwd: path.join(EX, 'angular-xwui'), cmd: 'node', args: [path.join(EX, 'angular-xwui', 'node_modules', '@angular', 'cli', 'bin', 'ng.js').replace(/\\/g, '/'), 'serve', '--port', '4201'], port: 4201, noShell: true },
];

async function main() {
  console.log('Starting serve/npx servers...');
  const children = [];
  const shellJobs = SERVER_JOBS.filter((j) => !j.noShell);
  const nodeJobs = SERVER_JOBS.filter((j) => j.noShell);
  for (const job of shellJobs) {
    const child = spawn(job.cmd, job.args, {
      cwd: job.cwd,
      stdio: 'ignore',
      shell: true,
      env: process.env,
    });
    child.unref();
    children.push(child);
  }
  await new Promise((r) => setTimeout(r, 3000));
  console.log('Starting Vite/Node servers (2s apart)...');
  const { appendFileSync } = await import('fs');
  const errLog = path.join(__dirname, 'benchmark-server-errors.log');
  for (let i = 0; i < nodeJobs.length; i++) {
    const job = nodeJobs[i];
    const captureFirst = i === 0;
    const child = spawn(job.cmd, job.args, {
      cwd: job.cwd,
      stdio: captureFirst ? ['ignore', 'ignore', 'pipe'] : 'ignore',
      env: process.env,
    });
    if (captureFirst && child.stderr) {
      child.stderr.on('data', (d) => appendFileSync(errLog, `[${job.name}] ${d.toString()}`));
    }
    child.unref();
    children.push(child);
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log('Waiting for ports (parallel, slow starters up to 90s)...');
  const slowPorts = [3002, 3003, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180, 5181, 5182, 5183, 8000, 4201];
  const results = await Promise.all(
    SERVER_JOBS.map(async (job) => {
      const timeout = slowPorts.includes(job.port) ? 90000 : 20000;
      const ok = await waitForPort(job.port, timeout);
      return { name: job.name, port: job.port, ok };
    })
  );
  for (const r of results) {
    console.log(`  ${r.name} (${r.port}) ${r.ok ? 'up' : 'TIMEOUT'}`);
  }
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.log(`Warning: ${failed.length} server(s) did not start: ${failed.map((f) => f.name).join(', ')}`);
  }
  console.log('Running benchmark...');
  const benchProc = spawn('node', ['benchmark-load.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  await new Promise((resolve, reject) => {
    benchProc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
  });
  console.log('Killing servers...');
  const isWin = process.platform === 'win32';
  for (const child of children) {
    try {
      if (child.pid) {
        if (isWin) {
          spawn('taskkill', ['/T', '/F', '/PID', child.pid.toString()], { stdio: 'ignore', shell: true });
        } else {
          child.kill('SIGTERM');
        }
      }
    } catch (_) {}
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
