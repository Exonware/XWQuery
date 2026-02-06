/**
 * One-time migration: move testArea.innerHTML = `...` from Tester*.ts into
 * a <template> in the matching HTML, then replace with template clone in TS.
 * Run: npx tsx tools/migrate-innerhtml-to-template.ts
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';

const ROOT = join(process.cwd());
const SRC = join(ROOT, 'src', 'components');

function* walkTesterTs(dir: string): Generator<string> {
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
      if (name === 'testers') {
        const testersDir = full;
        const files = readdirSync(testersDir);
        for (const f of files) {
          if (f.endsWith('.ts') && f.startsWith('Tester')) {
            yield join(testersDir, f);
          }
        }
      } else if (!['node_modules', 'dist'].includes(name)) {
        yield* walkTesterTs(full);
      }
    }
  }
}

function templateIdFromBasename(base: string): string {
  const withoutExt = base.replace(/\.ts$/i, '');
  const withHyphens = withoutExt.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  return withHyphens.toLowerCase() + '-content';
}

function extractFirstTestAreaInnerHTML(tsContent: string): { html: string; start: number; end: number } | null {
  const marker = 'testArea.innerHTML = ';
  const idx = tsContent.indexOf(marker);
  if (idx === -1) return null;
  const afterMarker = idx + marker.length;
  if (tsContent[afterMarker] !== '`') return null;
  let pos = afterMarker + 1;
  const len = tsContent.length;
  while (pos < len) {
    const ch = tsContent[pos];
    if (ch === '\\') {
      pos += 2;
      continue;
    }
    if (ch === '`') {
      const rest = tsContent.slice(pos + 1).replace(/^\s*/, '');
      if (rest.startsWith(';')) {
        const html = tsContent.slice(afterMarker + 1, pos);
        return { html, start: idx, end: pos + 1 + rest.indexOf(';') + 1 };
      }
    }
    pos++;
  }
  return null;
}

function migrateOne(tsPath: string): boolean {
  const tsContent = readFileSync(tsPath, 'utf-8');
  const extracted = extractFirstTestAreaInnerHTML(tsContent);
  if (!extracted) return false;
  if (extracted.html.includes('${')) return false;
  const base = basename(tsPath);
  const htmlPath = join(dirname(tsPath), base.replace(/\.ts$/i, '.html'));
  if (!existsSync(htmlPath)) return false;

  const templateId = templateIdFromBasename(base);

  let htmlContent = readFileSync(htmlPath, 'utf-8');
  const scriptTag = /<\s*script\s+type\s*=\s*["']module["'][^>]*src\s*=[^>]*>/i;
  const scriptMatch = htmlContent.match(scriptTag);
  if (!scriptMatch) return false;
  const insertBefore = scriptMatch[0];
  const templateBlock = `\n    <template id="${templateId}">\n${extracted.html.trim()}\n    </template>\n\n    `;
  if (htmlContent.includes(`id="${templateId}"`)) return false;
  htmlContent = htmlContent.replace(insertBefore, templateBlock + insertBefore);
  writeFileSync(htmlPath, htmlContent, 'utf-8');

  const replacement = `const template = document.getElementById('${templateId}');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }`;
  const before = tsContent.slice(0, extracted.start);
  const after = tsContent.slice(extracted.end);
  const newTs = before + replacement + after;
  writeFileSync(tsPath, newTs, 'utf-8');
  return true;
}

function main() {
  let done = 0;
  let skipped = 0;
  for (const tsPath of walkTesterTs(SRC)) {
    const base = basename(tsPath);
    if (base === 'TesterXWUIViewport2D.ts') {
      skipped++;
      continue;
    }
    try {
      if (migrateOne(tsPath)) {
        done++;
        console.log('OK', tsPath.replace(ROOT, ''));
      }
    } catch (e) {
      console.warn('Skip', tsPath.replace(ROOT, ''), (e as Error).message);
      skipped++;
    }
  }
  console.log('Done:', done, 'Skipped:', skipped);
}

main();
