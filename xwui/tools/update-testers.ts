/**
 * Script to update all tester HTML files to use XWUITester component and new style system
 * Run with: npx tsx tools/update-testers.ts
 */

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, dirname, sep } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STYLE_TEMPLATE = `    <!-- Base Styles -->
    <link rel="stylesheet" href="../../../styles/base/reset.css">
    <link rel="stylesheet" href="../../../styles/base/typography.css">
    <link rel="stylesheet" href="../../../styles/base/utilities.css">
    
    <!-- Brand -->
    <link rel="stylesheet" href="../../../styles/brand/xwui/brand.css">
    
    <!-- Style (Modern) -->
    <link rel="stylesheet" href="../../../styles/style/modern/spacing.css">
    <link rel="stylesheet" href="../../../styles/style/modern/shadows.css">
    
    <!-- Theme Color -->
    <link rel="stylesheet" href="../../../styles/theme/colors/light.css" id="themeColorSheet">
    
    <!-- Theme Accent -->
    <link rel="stylesheet" href="../../../styles/theme/accents/blue.css">
    
    <!-- Theme Roundness -->
    <link rel="stylesheet" href="../../../styles/theme/roundness/rounded.css">
    
    <!-- Theme Typography -->
    <link rel="stylesheet" href="../../../styles/theme/typography/inter.css">
    
    <!-- App-specific styles -->
    <link rel="stylesheet" href="../../../app/styles/testers.css">`;

function findTesterFiles(dir: string, fileList: string[] = []): string[] {
    const files = readdirSync(dir);
    
    files.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
            if (file.startsWith('XWUI') || file === 'Assistant' || file === 'Console' || 
                file === 'DocumentViewer' || file === 'Header' || file === 'Menu' || 
                file === 'Monaco' || file === 'ScriptEditor' || file === 'ScriptStudio' || 
                file === 'Viewer') {
                findTesterFiles(filePath, fileList);
            }
        } else if (file.startsWith('Tester') && file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function updateTesterFile(filePath: string): boolean {
    let content = readFileSync(filePath, 'utf-8');
    let updated = false;
    
    // Extract component name from path (e.g., XWUIAlert from .../XWUIAlert/testers/...)
    const pathParts = filePath.split(sep);
    const componentIndex = pathParts.findIndex(p => 
        p.startsWith('XWUI') || 
        ['Assistant', 'Console', 'DocumentViewer', 'Header', 'Menu', 'Monaco', 
         'ScriptEditor', 'ScriptStudio', 'Viewer'].includes(p)
    );
    const componentName = componentIndex >= 0 ? pathParts[componentIndex] : null;
    
    if (!componentName) {
        console.log(`Skipping ${filePath} - could not extract component name`);
        return false;
    }
    
    // Skip if already updated (contains XWUITester import)
    const needsXWUITesterUpdate = !content.includes('XWUITester');
    
    // Check if needs style system update
    const needsStyleUpdate = !content.includes('styles/base/reset.css') || 
                            !content.includes('data-brand="xwui"');
    
    if (!needsXWUITesterUpdate && !needsStyleUpdate) {
        console.log(`Skipping ${filePath} - already updated`);
        return false;
    }
    
    // Update style system first
    if (needsStyleUpdate) {
        // Calculate relative path depth
        const depth = filePath.split(sep).filter(p => p === 'testers').length;
        const relativePath = '../'.repeat(depth === 1 ? 3 : 4);
        
        // Replace old style links
        const oldPatterns = [
            /<link[^>]*href=["'][^"']*app\/styles\/base\.css["'][^>]*>/gi,
            /<link[^>]*href=["'][^"']*app\/styles\/testers\.css["'][^>]*>/gi,
            /<link[^>]*href=["'][^"']*app\/styles\/theme_[^"']*\.css["'][^>]*>/gi,
            /<link[^>]*id=["']themeStylesheet["'][^>]*>/gi,
        ];
        
        oldPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                content = content.replace(pattern, '');
                updated = true;
            }
        });
        
        // Insert new styles before </head> or before component CSS
        const styleTemplate = STYLE_TEMPLATE.replace(/\.\.\/\.\.\/\.\.\//g, relativePath);
        
        if (content.includes('</head>')) {
            // Insert before </head> if not already present
            if (!content.includes('styles/base/reset.css')) {
                content = content.replace('</head>', `    ${styleTemplate}\n    \n</head>`);
                updated = true;
            }
        }
        
        // Update html tag with data attributes
        if (!content.includes('data-brand="xwui"')) {
            content = content.replace(
                /<html([^>]*)>/i, 
                '<html$1 data-brand="xwui" data-style="modern" data-theme="light" data-accent="blue" data-roundness="rounded" data-font="inter">'
            );
            updated = true;
        }
        
        // Update theme toggle scripts
        content = content.replace(
            /document\.getElementById\(['"]themeStylesheet['"]\)\.href\s*=\s*[^;]+;/g,
            `const colorSheet = document.getElementById('themeColorSheet');
            if (colorSheet) {
                colorSheet.href = '${relativePath}styles/theme/colors/' + (isDark ? 'dark' : 'light') + '.css';
            }
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');`
        );
    }
    
    // Update to use XWUITester component
    if (needsXWUITesterUpdate) {
        // Extract title and description from existing HTML
        const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
        const descMatch = content.match(/<p>(.*?)<\/p>/);
        const title = titleMatch ? titleMatch[1].trim() : `${componentName} Component Tester`;
        const desc = descMatch ? descMatch[1].trim() : `${componentName} component.`;
        
        // Extract test area content (between <div class="test-area"> and closing </div> before status)
        const testAreaMatch = content.match(/<div class="test-area">([\s\S]*?)<\/div>\s*<\/div>\s*<div id="status"/) ||
                              content.match(/<div class="test-area">([\s\S]*?)<\/div>\s*<div id="status"/) ||
                              content.match(/<div class="test-area">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div id="status"/);
        let testAreaContent = testAreaMatch ? testAreaMatch[1] : '';
        
        // If test area content is empty, try to extract from body
        if (!testAreaContent) {
            const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/);
            if (bodyMatch) {
                const bodyContent = bodyMatch[1];
                // Try to find content between test-header and status
                const contentMatch = bodyContent.match(/<div class="test-header">[\s\S]*?<\/div>([\s\S]*?)<div id="status"/);
                if (contentMatch) {
                    testAreaContent = contentMatch[1].trim();
                    // Remove wrapper divs if present
                    testAreaContent = testAreaContent.replace(/^<div[^>]*>/, '').replace(/<\/div>\s*$/, '');
                }
            }
        }
        
        // Extract script content (the component initialization code)
        const scriptMatch = content.match(/<script type="module">([\s\S]*?)<\/script>/);
        let scriptContent = scriptMatch ? scriptMatch[1] : '';
        
        // Remove old status element references and update script
        let updatedScript = scriptContent
            .replace(/const statusEl = document\.getElementById\('status'\);/g, '')
            .replace(/statusEl\.textContent = /g, 'tester.setStatus(')
            .replace(/statusEl\.className = 'status success';/g, "'success');")
            .replace(/statusEl\.className = 'status error';/g, "'error');")
            .replace(/statusEl\.className = 'status info';/g, "'info');");
        
        // Ensure script has proper structure
        if (!updatedScript.includes('XWUITester')) {
            // Add XWUITester import and initialization
            const importMatch = scriptContent.match(/import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]\.\.\/index\.ts['"];/);
            const componentImport = importMatch ? importMatch[1].trim() : componentName;
            
            // Clean up test area content - escape backticks and template literals
            const escapedTestArea = testAreaContent
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\${/g, '\\${');
            
            // Clean up script content
            const cleanedScript = scriptContent
                .replace(/import\s+\{[^}]+\}\s+from\s+['"]\.\.\/index\.ts['"];/g, '')
                .replace(/const statusEl = document\.getElementById\('status'\);/g, '')
                .replace(/statusEl\.textContent = /g, 'tester.setStatus(')
                .replace(/statusEl\.className = 'status success';/g, "'success');")
                .replace(/statusEl\.className = 'status error';/g, "'error');")
                .replace(/statusEl\.className = 'status info';/g, "'info');")
                .trim();
            
            // Properly escape single quotes in strings
            const escapedTitle = title.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
            const escapedDesc = desc.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
            
            updatedScript = `import { XWUITester } from '../../XWUITester/index.ts';
        import { ${componentImport} } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: '${escapedTitle}',
            desc: '${escapedDesc}',
            componentName: '${componentName}'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        testArea.innerHTML = \`${escapedTestArea}\`;
        
        ${cleanedScript}`;
        }
        
        // Build new HTML structure
        const titleTag = content.match(/<title>(.*?)<\/title>/);
        const pageTitle = titleTag ? titleTag[1] : title;
        
        // Replace body content
        const newBody = `    <div id="tester-container"></div>

    <script type="module">
        ${updatedScript}
    </script>`;
        
        // Replace the old body content
        content = content.replace(/<body>[\s\S]*?<\/body>/, newBody);
        
        // Ensure XWUITester CSS is included
        if (!content.includes('XWUITester.css')) {
            // Find component CSS link and add XWUITester CSS after it
            const componentCssPattern = new RegExp(`(<link rel="stylesheet" href="\\.\\./${componentName}\\.css">)`, 'i');
            if (componentCssPattern.test(content)) {
                content = content.replace(
                    componentCssPattern,
                    `$1\n    <link rel="stylesheet" href="../../XWUITester/XWUITester.css">`
                );
            } else {
                // Add before </head>
                content = content.replace('</head>', `    <link rel="stylesheet" href="../../XWUITester/XWUITester.css">\n</head>`);
            }
        }
        
        updated = true;
    }
    
    if (updated) {
        writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated: ${filePath}`);
        return true;
    }
    
    return false;
}

// Main execution
const componentsDir = join(__dirname, '../src/components');
const testerFiles = findTesterFiles(componentsDir);

console.log(`Found ${testerFiles.length} tester files`);

let updatedCount = 0;
testerFiles.forEach(file => {
    if (updateTesterFile(file)) {
        updatedCount++;
    }
});

console.log(`\nUpdated ${updatedCount} tester files`);
