/**
 * One-time migration: extract inline <script type="module"> from tester HTML
 * into companion Tester*.ts (or index.ts), then replace with <script src="...">.
 * Run: npx tsx tools/migrate-inline-ts-to-external.ts
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

// Match first <script type="module">...</script> (non-greedy content)
const SCRIPT_MODULE_REGEX = /<script([^>]*type\s*=\s*["']module["'][^>]*)>([\s\S]*?)<\/script>/i;

function* walkHtmlFiles(dir: string): Generator<string> {
  if (!dir || !existsSync(dir)) return;
  const names = readdirSync(dir);
  for (const name of names) {
    const full = join(dir, name);
    let isDir = false;
    try {
      isDir = statSync(full).isDirectory();
    } catch {
      continue;
    }
    if (isDir) {
      if (!['node_modules', 'dist', 'generators', 'grammars'].includes(name)) {
        yield* walkHtmlFiles(full);
      }
    } else if (name.endsWith('.html') && (name.startsWith('Tester') || name === 'index.html')) {
      yield full;
    }
  }
}

function migrateFile(htmlPath: string): boolean {
  const content = readFileSync(htmlPath, 'utf-8');
  const match = content.match(SCRIPT_MODULE_REGEX);
  if (!match) return false;

  const fullTag = match[0];
  const scriptContent = match[2].trimEnd();
  const dir = dirname(htmlPath);
  const baseName = basename(htmlPath, '.html');
  const tsPath = join(dir, `${baseName}.ts`);

  writeFileSync(tsPath, scriptContent + '\n', 'utf-8');

  const newScriptTag = `    <script type="module" src="./${baseName}.ts"></script>`;
  const newContent = content.replace(fullTag, newScriptTag);
  writeFileSync(htmlPath, newContent, 'utf-8');

  return true;
}

function main() {
  let count = 0;
  const dirs = [
    join(SRC, 'components'),
    join(SRC, 'app'),
  ];
  for (const dir of dirs) {
    for (const htmlPath of walkHtmlFiles(dir)) {
      if (migrateFile(htmlPath)) {
        count++;
        console.log(htmlPath.replace(ROOT, ''));
      }
    }
  }
  console.log(`\nMigrated ${count} HTML files.`);
}

main();
