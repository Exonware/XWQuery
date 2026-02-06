#!/usr/bin/env node
/**
 * Syncs examples/common/ assets (xwui-button.mjs + xwui/*.css) into each framework example.
 * Run from xwui repo root: node examples/sync-common.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commonDir = path.join(__dirname, 'common');
const commonFiles = [
  { src: 'xwui-theme-examples.css', destDir: '' },
  { src: 'xwui-button.mjs', destDir: '' },
  { src: 'xwui/XWUIButton/XWUIButton.css', destDir: 'xwui/XWUIButton' },
  { src: 'xwui/XWUIItem/XWUIItem.css', destDir: 'xwui/XWUIItem' },
];

const uberFiles = [
  { src: 'uber/uber.css', destDir: 'uber' },
  { src: 'uber/uber.html', destDir: 'uber' },
];

const examples = [
  { name: 'angular-xwui', publicDir: 'public' },
  { name: 'react', publicDir: 'public' },
  { name: 'vue', publicDir: 'public' },
  { name: 'svelte', publicDir: 'public' },
  { name: 'solid', publicDir: 'public' },
  { name: 'qwik', publicDir: 'public' },
  { name: 'preact', publicDir: 'public' },
  { name: 'lit', publicDir: 'public' },
  { name: 'astro', publicDir: 'public' },
  { name: 'next', publicDir: 'public' },
  { name: 'nuxt', publicDir: 'public' },
  { name: 'remix', publicDir: 'public' },
  { name: 'gatsby', publicDir: 'static' },
  { name: 'mithril', publicDir: 'public' },
  { name: 'sveltekit', publicDir: 'static' },
];

// Assets at root of example (no public/ or static/)
const rootExamples = [
  'vanilla', 'alpine', 'htmx', 'stimulus', 'petite-vue', 'jquery', 'backbone',
  'riot', 'marko', 'knockout', 'hyperapp', 'dojo', 'ember', 'aurelia', 'fresh', 'stencil', 'eleventy',
];

function copyFile(srcPath, destPath) {
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(srcPath, destPath);
}

// Sync to examples with public/
for (const ex of examples) {
  const examplePath = path.join(__dirname, ex.name);
  if (!fs.existsSync(examplePath)) continue;
  const publicPath = path.join(examplePath, ex.publicDir);
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  for (const f of commonFiles) {
    const src = path.join(commonDir, f.src);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(publicPath, f.destDir ? path.join(f.destDir, path.basename(f.src)) : f.src);
    copyFile(src, dest);
    console.log(`  ${ex.name}: ${f.src}`);
  }
  for (const f of uberFiles) {
    const src = path.join(commonDir, f.src);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(publicPath, f.destDir ? path.join(f.destDir, path.basename(f.src)) : f.src);
    copyFile(src, dest);
    console.log(`  ${ex.name}: ${f.src}`);
  }
}

// Sync to vanilla and alpine (root of example, no public/)
for (const name of rootExamples) {
  const examplePath = path.join(__dirname, name);
  if (!fs.existsSync(examplePath)) continue;
  for (const f of commonFiles) {
    const src = path.join(commonDir, f.src);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(examplePath, f.destDir ? path.join(f.destDir, path.basename(f.src)) : f.src);
    copyFile(src, dest);
    console.log(`  ${name}: ${f.src}`);
  }
  for (const f of uberFiles) {
    const src = path.join(commonDir, f.src);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(examplePath, f.destDir ? path.join(f.destDir, path.basename(f.src)) : f.src);
    copyFile(src, dest);
    console.log(`  ${name}: ${f.src}`);
  }
}

console.log('Done. Common assets (incl. uber) synced to all examples.');
