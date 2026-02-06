import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all HTML files in testers directories
const htmlFiles = await glob('src/components/*/testers/*.html');

console.log(`Found ${htmlFiles.length} HTML files to process`);

let totalFixed = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let fixes = 0;

  // Fix function return type annotations
  const functionReturnRegex = /\bfunction\s+(\w+)\s*\(([^)]*)\)\s*:\s*[A-Za-z_][A-Za-z0-9_<>\[\],\s|&]*\s*{/g;
  content = content.replace(functionReturnRegex, (match, name, params) => {
    console.log(`  Fixed function return type: ${name}`);
    fixes++;
    return `function ${name}(${params}) {`;
  });

  // Fix method return type annotations
  const methodReturnRegex = /\b(\w+)\s*\(([^)]*)\)\s*:\s*[A-Za-z_][A-Za-z0-9_<>\[\],\s|&]*\s*{/g;
  content = content.replace(methodReturnRegex, (match, name, params) => {
    console.log(`  Fixed method return type: ${name}`);
    fixes++;
    return `${name}(${params}) {`;
  });

  // Fix parameter type annotations
  const paramRegex = /(\w+)\s*:\s*[A-Za-z_][A-Za-z0-9_<>\[\],\s|&]*(?=\s*[,)])/g;
  content = content.replace(paramRegex, (match, param) => {
    console.log(`  Fixed parameter type: ${param}`);
    fixes++;
    return param;
  });

  // Fix non-null assertion operators
  const assertionRegex = /([A-Za-z_$][A-Za-z0-9_$]*)\s*!(?![=!])/g;
  content = content.replace(assertionRegex, (match, expr) => {
    console.log(`  Fixed non-null assertion: ${expr}!`);
    fixes++;
    return expr;
  });

  // Fix type-only imports
  const typeImportRegex = /\bimport\s*{\s*([^}]*\btype\s+[^}]*)\s*}\s*from/g;
  content = content.replace(typeImportRegex, (match, imports) => {
    const cleanedImports = imports
      .split(',')
      .map(imp => imp.trim())
      .filter(imp => !imp.startsWith('type '))
      .map(imp => imp.replace(/^type\s+/, ''))
      .join(', ');

    if (cleanedImports.trim()) {
      console.log(`  Fixed type-only import, kept: ${cleanedImports}`);
      fixes++;
      return `import { ${cleanedImports} } from`;
    } else {
      console.log(`  Removed type-only import`);
      fixes++;
      return '// Removed type-only import';
    }
  });

  // Fix mixed type/value imports in import statements only
  const mixedImportRegex1 = /import\s*{\s*([^}]*),\s*type\s+([^}]+)\s*}\s*from/g;
  content = content.replace(mixedImportRegex1, (match, before, type) => {
    console.log(`  Removed type import: ${type} from mixed import`);
    fixes++;
    return `import { ${before} } from`;
  });

  const mixedImportRegex2 = /import\s*{\s*type\s+([^}]+)\s*,\s*([^}]+)\s*}\s*from/g;
  content = content.replace(mixedImportRegex2, (match, type, after) => {
    console.log(`  Removed type import: ${type} from mixed import`);
    fixes++;
    return `import { ${after} } from`;
  });

  if (fixes > 0) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${fixes} TypeScript syntax issues in ${file}`);
    totalFixed++;
  }
});

console.log(`\nDone! Fixed TypeScript syntax in ${totalFixed} HTML files`);
