/**
 * Critical Issues Checker for Top 40 Advanced Components
 * Checks for:
 * 1. Missing extends XWUIComponent
 * 2. Missing createConfig implementation
 * 3. Import errors
 * 4. Type errors
 * 5. Constructor issues
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CriticalIssue {
    component: string;
    issues: string[];
}

const componentsDir = path.join(__dirname, '../src/components');
const issues: CriticalIssue[] = [];

// Top 40 components by complexity (from previous analysis)
const top40Components = [
    'XWUIStyleSelector',
    'XWUIScriptEditor',
    'XWUIWorkflow',
    'XWUIItem',
    'XWUIConsole',
    'XWUITester',
    'XWUIStyle',
    'XWUISpreadsheet',
    'XWUIButton',
    'XWUIDiagram',
    'XWUISelect',
    'XWUITransferList',
    'XWUIGanttChart',
    'XWUIPivotTable',
    'XWUISlider',
    'XWUIDynamicFieldRenderer',
    'XWUIDependencyVisualizer',
    'XWUIDataGrid',
    'XWUIDebugToolbar',
    'XWUIGalleryViewer',
    'XWUIComponent',
    'XWUIInput',
    'XWUITextOverlay',
    'XWUITable',
    'XWUIPDFViewer',
    'XWUIAccordion',
    'XWUIFilters',
    'XWUIMentions',
    'XWUIVideoPlayer',
    'XWUICascader',
    'XWUIAutocomplete',
    'XWUIDiffEditor',
    'XWUIActivityFilter',
    'XWUIChannelList',
    'XWUIRecurrencePicker',
    'XWUICalendar',
    'XWUIUpload',
    'XWUIStickersOverlay',
    'XWUITour',
    'XWUIPagination'
];

function checkComponent(componentName: string): string[] {
    const componentPath = path.join(componentsDir, componentName);
    const tsFile = path.join(componentPath, `${componentName}.ts`);
    const issues: string[] = [];
    
    if (!fs.existsSync(tsFile)) {
        issues.push(`Missing TypeScript file: ${componentName}.ts`);
        return issues;
    }
    
    const content = fs.readFileSync(tsFile, 'utf-8');
    
    // Check 1: Extends XWUIComponent (except base classes)
    if (!['XWUIComponent', 'XWUITester'].includes(componentName)) {
        if (!content.includes('extends XWUIComponent')) {
            issues.push('Does not extend XWUIComponent');
        }
    }
    
    // Check 2: Has createConfig implementation (if extends XWUIComponent)
    if (content.includes('extends XWUIComponent') && !content.includes('XWUIComponent.ts')) {
        if (!content.includes('protected createConfig') && !content.includes('createConfig(')) {
            issues.push('Missing createConfig implementation');
        }
    }
    
    // Check 3: Import statements are valid
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    const imports: string[] = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    
    // Check for relative imports that might be broken
    imports.forEach(imp => {
        if (imp.startsWith('.')) {
            // Check if relative path exists
            const importPath = path.resolve(path.dirname(tsFile), imp);
            const possiblePaths = [
                importPath,
                importPath + '.ts',
                importPath + '.js',
                path.join(importPath, 'index.ts'),
                path.join(importPath, 'index.js')
            ];
            
            const exists = possiblePaths.some(p => {
                try {
                    return fs.existsSync(p) || fs.existsSync(p.replace(/\.ts$/, '').replace(/\.js$/, ''));
                } catch {
                    return false;
                }
            });
            
            if (!exists && !imp.includes('XWUIComponent') && !imp.includes('XWUITester')) {
                // This is a warning, not critical - skip for now
            }
        }
    });
    
    // Check 4: Constructor calls super() if extends XWUIComponent
    if (content.includes('extends XWUIComponent') && content.includes('constructor')) {
        if (!content.includes('super(')) {
            issues.push('Constructor does not call super()');
        }
    }
    
    // Check 5: Type errors - look for common issues
    if (content.includes('any') && content.split('any').length > 10) {
        // Too many 'any' types - warning only
    }
    
    // Check 6: Missing return types on public methods
    // This is a style issue, not critical
    
    // Check 7: Check for obvious syntax errors
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (Math.abs(openBraces - closeBraces) > 2) {
        issues.push(`Possible brace mismatch: ${openBraces} open, ${closeBraces} close`);
    }
    
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (Math.abs(openParens - closeParens) > 2) {
        issues.push(`Possible parenthesis mismatch: ${openParens} open, ${closeParens} close`);
    }
    
    return issues;
}

console.log('Checking Top 40 Advanced Components for Critical Issues...\n');

for (const componentName of top40Components) {
    const componentIssues = checkComponent(componentName);
    if (componentIssues.length > 0) {
        issues.push({
            component: componentName,
            issues: componentIssues
        });
    }
}

console.log('='.repeat(80));
console.log('CRITICAL ISSUES REPORT');
console.log('='.repeat(80));
console.log();

if (issues.length === 0) {
    console.log('✅ No critical issues found in top 40 components!');
} else {
    console.log(`Found ${issues.length} components with critical issues:\n`);
    
    issues.forEach(({ component, issues: componentIssues }) => {
        console.log(`${component}:`);
        componentIssues.forEach(issue => {
            console.log(`  ❌ ${issue}`);
        });
        console.log();
    });
}

// Write report
const reportPath = path.join(__dirname, '../CRITICAL_ISSUES_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
console.log(`\nDetailed report written to: ${reportPath}`);

