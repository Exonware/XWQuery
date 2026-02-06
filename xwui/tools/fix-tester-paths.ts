/**
 * Fix testers.css paths in all tester HTML files
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../src/components');

/**
 * Find all tester HTML files and fix the testers.css path
 */
function fixTesterPaths(): void {
    const testerFiles: string[] = [];
    
    function scanDirectory(dir: string): void {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                if (entry.name === 'testers') {
                    // Found a testers directory, check for HTML files
                    const testerFiles = fs.readdirSync(fullPath);
                    testerFiles.forEach(file => {
                        if (file.endsWith('.html')) {
                            const htmlPath = path.join(fullPath, file);
                            testerFiles.push(htmlPath);
                        }
                    });
                } else {
                    // Recurse into subdirectories
                    scanDirectory(fullPath);
                }
            }
        }
    }
    
    scanDirectory(componentsDir);
    
    // Collect all tester files
    function collectTesterFiles(dir: string): void {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                if (entry.name === 'testers') {
                    const files = fs.readdirSync(fullPath);
                    files.forEach(file => {
                        if (file.endsWith('.html')) {
                            testerFiles.push(path.join(fullPath, file));
                        }
                    });
                } else {
                    collectTesterFiles(fullPath);
                }
            }
        }
    }
    
    collectTesterFiles(componentsDir);
    
    console.log(`Found ${testerFiles.length} tester HTML files`);
    
    let fixedCount = 0;
    
    testerFiles.forEach(filePath => {
        try {
            let content = fs.readFileSync(filePath, 'utf-8');
            let modified = false;
            
            // Fix wrong path patterns
            const patterns = [
                { from: /href="\.\.\/\.\.\/\.\.\/styles\/app\/testers\.css"/g, to: 'href="../../../app/styles/testers.css"' },
                { from: /href="\.\.\/\.\.\/app\/styles\/testers\.css"/g, to: 'href="../../../app/styles/testers.css"' },
            ];
            
            patterns.forEach(pattern => {
                if (pattern.from.test(content)) {
                    content = content.replace(pattern.from, pattern.to);
                    modified = true;
                }
            });
            
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf-8');
                fixedCount++;
                console.log(`Fixed: ${path.relative(componentsDir, filePath)}`);
            }
        } catch (error) {
            console.error(`Error fixing ${filePath}:`, error);
        }
    });
    
    console.log(`\nFixed ${fixedCount} tester files`);
}

fixTesterPaths();

