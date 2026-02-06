const fs = require('fs');
const path = require('path');
const htmlPath = path.join(process.cwd(), 'src/components/testers/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const re = /<script>([\s\S]*?)<\/script>/;
const m = html.match(re);
if (m) {
  const scriptContent = m[1].trimEnd();
  const tsPath = path.join(process.cwd(), 'src/components/testers/index.ts');
  fs.writeFileSync(tsPath, scriptContent + '\n', 'utf8');
  const newHtml = html.replace(m[0], '    <script type="module" src="./index.ts"></script>');
  fs.writeFileSync(htmlPath, newHtml, 'utf8');
  console.log('Migrated testers index.html');
} else {
  console.log('No plain <script> match');
}
