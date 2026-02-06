/**
 * Fix malformed title tags in tester HTML files
 * Removes nested <title> tags and empty lines
 */

import { readFileSync, writeFileSync } from 'fs';
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const componentsDir = resolve(projectRoot, 'src/components');

// Regex pattern to match malformed title tags
// Matches: <title><title>...</title>\n    \n    \n    \n</title>
const malformedTitlePattern = /<title>\s*<title>([^<]+)<\/title>\s*\n\s*\n\s*\n\s*\n\s*<\/title>/g;

function fixTesterFile(filePath: string): boolean {
    try {
        const content = readFileSync(filePath, 'utf-8');
        const originalContent = content;
        
        // Replace malformed title tags
        const fixedContent = content.replace(malformedTitlePattern, (match, titleText) => {
            return `<title>${titleText.trim()}</title>`;
        });
        
        if (originalContent !== fixedContent) {
            writeFileSync(filePath, fixedContent, 'utf-8');
            console.log(`Fixed: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error fixing ${filePath}:`, error);
        return false;
    }
}

function scanAndFixTesters() {
    let fixedCount = 0;
    
    try {
        const componentDirs = readdirSync(componentsDir);
        
        for (const componentName of componentDirs) {
            const componentPath = resolve(componentsDir, componentName);
            const testersPath = resolve(componentPath, 'testers');
            
            try {
                const stat = statSync(testersPath);
                if (!stat.isDirectory()) continue;
                
                const testerFiles = readdirSync(testersPath);
                
                for (const file of testerFiles) {
                    if (!file.endsWith('.html')) continue;
                    if (!file.startsWith('Tester')) continue;
                    
                    const filePath = resolve(testersPath, file);
                    if (fixTesterFile(filePath)) {
                        fixedCount++;
                    }
                }
            } catch {
                // Component doesn't have a testers folder, skip it
                continue;
            }
        }
        
        console.log(`\nFixed ${fixedCount} tester file(s).`);
    } catch (error) {
        console.error('Error scanning components:', error);
        process.exit(1);
    }
}

// Run the fix
scanAndFixTesters();

