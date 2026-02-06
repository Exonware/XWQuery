/**
 * Fix component CSS link ordering in tester files
 * Component CSS should come after base styles
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findTesterFiles(dir: string, fileList: string[] = []): string[] {
    const files = readdirSync(dir);
    
    files.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
            findTesterFiles(filePath, fileList);
        } else if (file.startsWith('Tester') && file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function fixTesterFile(filePath: string): boolean {
    let content = readFileSync(filePath, 'utf-8');
    let updated = false;
    
    // Find component CSS link (e.g., <link rel="stylesheet" href="../XWUICollapse.css">)
    const componentCssMatch = content.match(/<link[^>]*href=["']\.\.\/[^"']*\.css["'][^>]*>/);
    
    if (componentCssMatch) {
        const componentCss = componentCssMatch[0];
        const componentName = componentCss.match(/href=["']\.\.\/([^"']+)\.css["']/)?.[1];
        
        if (componentName) {
            // Remove the component CSS from its current position
            content = content.replace(componentCss + '\n', '');
            content = content.replace(componentCss, '');
            
            // Add it after testers.css
            const testersCssPattern = /(<link[^>]*testers\.css[^>]*>)/;
            if (testersCssPattern.test(content)) {
                content = content.replace(
                    testersCssPattern,
                    `$1\n    \n    <!-- Component CSS -->\n    ${componentCss}`
                );
                updated = true;
            }
        }
    }
    
    // Remove empty lines after title
    content = content.replace(/<title>[^<]+<\/title>\s*\n\s*\n\s*\n/g, '<title>$&</title>\n    \n');
    
    if (updated) {
        writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed: ${filePath}`);
        return true;
    }
    
    return false;
}

// Main execution
const componentsDir = join(__dirname, '../src/components');
const testerFiles = findTesterFiles(componentsDir);

console.log(`Found ${testerFiles.length} tester files`);

let fixedCount = 0;
testerFiles.forEach(file => {
    if (fixTesterFile(file)) {
        fixedCount++;
    }
});

console.log(`\nFixed ${fixedCount} tester files`);

