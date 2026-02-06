/**
 * Generate Component Index
 * Scans components directory and generates a manifest with all components and their testers
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.resolve(__dirname, '../src/components');

interface TesterInfo {
    name: string;
    filename: string;
    path: string;
    relativePath: string;
}

interface ComponentInfo {
    name: string;
    path: string;
    hasTesters: boolean;
    testers: TesterInfo[];
}

const TIER_DIRS = ['component', 'power', 'super'];

function scanDirForComponents(dir: string, pathPrefix: string): ComponentInfo[] {
    const result: ComponentInfo[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name === 'testers') continue; // index page, not a component
        const componentName = entry.name;
        const componentPath = path.join(dir, componentName);
        const testersDir = path.join(componentPath, 'testers');
        const relativePath = pathPrefix ? `${pathPrefix}/${componentName}` : componentName;
        if (!fs.existsSync(testersDir)) {
            result.push({ name: componentName, path: relativePath, hasTesters: false, testers: [] });
            continue;
        }
        const testers: TesterInfo[] = [];
        try {
            const testerFiles = fs.readdirSync(testersDir);
            for (const file of testerFiles) {
                if (file.endsWith('.html') && file.toLowerCase().includes('tester')) {
                    let testerName = file.replace(/\.html$/i, '')
                        .replace(new RegExp(`^Tester${componentName}`, 'i'), '')
                        .replace(/^[._-]/, '')
                        .replace(/^$/, 'Default');
                    if (testerName === '' || testerName === componentName) {
                        testerName = 'Default';
                    } else {
                        testerName = testerName
                            .replace(/^(three-ways|variants|sandbox|email|react)$/i, (match) => {
                                return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                            });
                    }
                    testers.push({
                        name: testerName,
                        filename: file,
                        path: path.join(testersDir, file),
                        relativePath: `${relativePath}/testers/${file}`
                    });
                }
            }
        } catch (error) {
            console.warn(`Error reading testers for ${componentName}:`, error);
        }
        result.push({
            name: componentName,
            path: relativePath,
            hasTesters: testers.length > 0,
            testers: testers.sort((a, b) => a.filename.localeCompare(b.filename))
        });
    }
    return result;
}

/**
 * Scan components directory and find all components with testers.
 * Supports tiered layout: component/, power/, super/ each contain XWUI* folders.
 */
function scanComponents(): ComponentInfo[] {
    const components: ComponentInfo[] = [];
    if (!fs.existsSync(componentsDir)) {
        console.error(`Components directory not found: ${componentsDir}`);
        return components;
    }
    const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name === 'testers') continue;
        const childPath = path.join(componentsDir, entry.name);
        if (TIER_DIRS.includes(entry.name)) {
            const tierComponents = scanDirForComponents(childPath, entry.name);
            components.push(...tierComponents);
        } else {
            const testersDir = path.join(childPath, 'testers');
            const testers: TesterInfo[] = [];
            if (fs.existsSync(testersDir)) {
                try {
                    const testerFiles = fs.readdirSync(testersDir);
                    for (const file of testerFiles) {
                        if (file.endsWith('.html') && file.toLowerCase().includes('tester')) {
                            let testerName = file.replace(/\.html$/i, '').replace(new RegExp(`^Tester${entry.name}`, 'i'), '').replace(/^[._-]/, '').replace(/^$/, 'Default');
                            if (testerName === '' || testerName === entry.name) testerName = 'Default';
                            else testerName = testerName.replace(/^(three-ways|variants|sandbox|email|react)$/i, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());
                            testers.push({
                                name: testerName,
                                filename: file,
                                path: path.join(testersDir, file),
                                relativePath: `${entry.name}/testers/${file}`
                            });
                        }
                    }
                } catch (e) {
                    console.warn(`Error reading testers for ${entry.name}:`, e);
                }
            }
            components.push({
                name: entry.name,
                path: entry.name,
                hasTesters: testers.length > 0,
                testers: testers.sort((a, b) => a.filename.localeCompare(b.filename))
            });
        }
    }
    components.sort((a, b) => a.name.localeCompare(b.name));
    return components;
}

/**
 * Generate index-data.ts: component manifest for index.ts to import (no inline script in HTML).
 */
function generateIndexDataTS(components: ComponentInfo[]): string {
    const manifest = JSON.stringify(components, null, 2);
    return `// Generated by tools/generate-component-index.ts - do not edit by hand
export const components = ${manifest};
`;
}

/**
 * Generate the index HTML page (no inline script; script loads from index.ts).
 */
function generateIndexHTML(_components: ComponentInfo[]): string {
    return `<!DOCTYPE html>
<html lang="en" data-brand="xwui" data-style="modern" data-theme="light" data-accent="blue" data-roundness="rounded" data-font="inter">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XWUI Components - Testers Index</title>
    
    <!-- Base Styles -->
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
    <link rel="stylesheet" href="../../../styles/app/testers.css">
    
    <style>
        .components-index {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .components-index h1 {
            margin-bottom: 1rem;
            font-size: 2rem;
            font-weight: 600;
        }
        
        .components-index .description {
            margin-bottom: 2rem;
            color: #666;
        }
        
        .search-bar {
            margin-bottom: 2rem;
            padding: 0.75rem 1rem;
            width: 100%;
            max-width: 500px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .search-bar:focus {
            outline: none;
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .components-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .component-card {
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            padding: 1.5rem;
            background: white;
            transition: box-shadow 0.2s;
        }
        
        .component-card:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .component-card h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .component-card .component-description {
            margin-bottom: 1rem;
            color: #666;
            font-size: 0.9rem;
        }
        
        .testers-list {
            margin-top: 1rem;
        }
        
        .testers-list .tester-link {
            display: inline-block;
            padding: 0.5rem 1rem;
            margin: 0.25rem 0.5rem 0.25rem 0;
            background: #f0f0f0;
            color: #333;
            text-decoration: none;
            border-radius: 4px;
            font-size: 0.875rem;
            transition: background-color 0.2s;
        }
        
        .testers-list .tester-link:hover {
            background: #1890ff;
            color: white;
        }
        
        .no-testers {
            color: #999;
            font-size: 0.875rem;
            font-style: italic;
        }
        
        .stats {
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f5f5f5;
            border-radius: 4px;
        }
        
        .stats span {
            margin-right: 1.5rem;
            color: #666;
        }
        
        .stats strong {
            color: #333;
        }
        
        .tester-count {
            display: inline-block;
            margin-left: 0.5rem;
            padding: 0.125rem 0.5rem;
            background: #1890ff;
            color: white;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="components-index">
        <h1>XWUI Components - Testers Index</h1>
        <p class="description">
            Dynamic listing of all XWUI components and their available testers. 
            Click on any tester link to open the component test page.
        </p>
        
        <input type="text" 
               class="search-bar" 
               id="searchInput" 
               placeholder="Search components or testers...">
        
        <div class="stats" id="stats"></div>
        
        <div class="components-grid" id="componentsGrid"></div>
    </div>

    <script type="module" src="./index.ts"></script>
</body>
</html>`;
}

/**
 * Main execution
 */
function main() {
    console.log('Scanning components directory...');
    const components = scanComponents();
    
    console.log(`Found ${components.length} components`);
    console.log(`Components with testers: ${components.filter(c => c.hasTesters).length}`);
    console.log(`Total testers: ${components.reduce((sum, c) => sum + c.testers.length, 0)}`);
    
    // Generate the index HTML
    const indexPath = path.resolve(__dirname, '../src/components/component/testers/index.html');
    const indexHTML = generateIndexHTML(components);
    
    // Ensure directory exists
    const indexDir = path.dirname(indexPath);
    if (!fs.existsSync(indexDir)) {
        fs.mkdirSync(indexDir, { recursive: true });
    }
    
    // Write the index HTML (no inline script; loads index.ts)
    fs.writeFileSync(indexPath, indexHTML, 'utf-8');
    console.log(`Generated index at: ${indexPath}`);

    // Write index-data.ts so index.ts can import the components array (keeps HTML script-free)
    const indexDataPath = path.resolve(indexDir, 'index-data.ts');
    fs.writeFileSync(indexDataPath, generateIndexDataTS(components), 'utf-8');
    console.log(`Generated index-data at: ${indexDataPath}`);
    
    // Also generate a JSON manifest for programmatic access
    const manifestPath = path.resolve(__dirname, '../src/components/component/testers/manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(components, null, 2), 'utf-8');
    console.log(`Generated manifest at: ${manifestPath}`);
}

// Run if executed directly
main();

export { scanComponents, generateIndexHTML, generateIndexDataTS };

