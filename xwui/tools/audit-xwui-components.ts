/**
 * XWUI Components Audit Script
 * Checks all XWUI components for compliance with standards:
 * 1. CSS files with behavioral/structural styles using styles.ts patterns
 * 2. *.schema.json files exist
 * 3. Components extend XWUIComponent
 * 4. Testers folder exists with testers extending XWUITester
 * 5. Schema.json has enough info for manifest generation
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComponentAuditResult {
    name: string;
    path: string;
    hasCSS: boolean;
    cssHasStylesReference: boolean;
    hasSchema: boolean;
    extendsXWUIComponent: boolean;
    hasTestersFolder: boolean;
    hasTesterFiles: boolean;
    testersExtendXWUITester: boolean;
    schemaHasManifestInfo: boolean;
    issues: string[];
}

const componentsDir = path.join(__dirname, '../src/components');
const results: ComponentAuditResult[] = [];

// Get all XWUI component directories
function getXWUIComponents(): string[] {
    const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory() && entry.name.startsWith('XWUI'))
        .map(entry => entry.name);
}

// Check if CSS file exists and has styles.ts reference
function checkCSS(componentPath: string, componentName: string): { hasCSS: boolean; hasReference: boolean } {
    const cssFile = path.join(componentPath, `${componentName}.css`);
    const hasCSS = fs.existsSync(cssFile);
    
    if (!hasCSS) {
        return { hasCSS: false, hasReference: false };
    }
    
    const cssContent = fs.readFileSync(cssFile, 'utf-8');
    const hasReference = cssContent.includes('styles.ts') || 
                        cssContent.includes('@_Archieve/exonware-xmsgr-frontend/src/components/xmsgr/styles/styles.ts') ||
                        cssContent.includes('Structural styles using patterns from');
    
    return { hasCSS: true, hasReference };
}

// Check if schema.json exists
function checkSchema(componentPath: string, componentName: string): boolean {
    const schemaFile = path.join(componentPath, `${componentName}.schema.json`);
    return fs.existsSync(schemaFile);
}

// Check if component extends XWUIComponent
function checkExtendsXWUIComponent(componentPath: string, componentName: string): boolean {
    const tsFile = path.join(componentPath, `${componentName}.ts`);
    if (!fs.existsSync(tsFile)) {
        return false;
    }
    
    const content = fs.readFileSync(tsFile, 'utf-8');
    return content.includes('extends XWUIComponent');
}

// Check if testers folder exists
function checkTestersFolder(componentPath: string): boolean {
    const testersPath = path.join(componentPath, 'testers');
    return fs.existsSync(testersPath) && fs.statSync(testersPath).isDirectory();
}

// Check if tester files exist and extend XWUITester
function checkTesters(componentPath: string, componentName: string): { hasFiles: boolean; extendTester: boolean } {
    const testersPath = path.join(componentPath, 'testers');
    if (!fs.existsSync(testersPath)) {
        return { hasFiles: false, extendTester: false };
    }
    
    const testerFiles = fs.readdirSync(testersPath)
        .filter(file => file.endsWith('.html') && file.startsWith('Tester'));
    
    if (testerFiles.length === 0) {
        return { hasFiles: false, extendTester: false };
    }
    
    // Check at least one tester extends XWUITester
    let extendTester = false;
    for (const testerFile of testerFiles) {
        const testerPath = path.join(testersPath, testerFile);
        const content = fs.readFileSync(testerPath, 'utf-8');
        if (content.includes('XWUITester') && content.includes('from') && content.includes('XWUITester')) {
            extendTester = true;
            break;
        }
    }
    
    return { hasFiles: true, extendTester };
}

// Check if schema.json has enough info for manifest generation
function checkSchemaManifestInfo(componentPath: string, componentName: string): boolean {
    const schemaFile = path.join(componentPath, `${componentName}.schema.json`);
    if (!fs.existsSync(schemaFile)) {
        return false;
    }
    
    try {
        const schemaContent = fs.readFileSync(schemaFile, 'utf-8');
        const schema = JSON.parse(schemaContent);
        
        // Check for basic properties that would be useful for manifest
        // At minimum, should have title or description
        const hasTitle = schema.title || schema.properties?.conf_comp?.title || schema.properties?.data?.title;
        const hasDescription = schema.description || schema.properties?.conf_comp?.description || schema.properties?.data?.description;
        
        return !!(hasTitle || hasDescription);
    } catch {
        return false;
    }
}

// Audit a single component
function auditComponent(componentName: string): ComponentAuditResult {
    const componentPath = path.join(componentsDir, componentName);
    const issues: string[] = [];
    
    // Check CSS
    const { hasCSS, hasReference } = checkCSS(componentPath, componentName);
    if (!hasCSS) {
        issues.push('Missing CSS file');
    } else if (!hasReference) {
        issues.push('CSS file missing styles.ts reference comment');
    }
    
    // Check schema
    const hasSchema = checkSchema(componentPath, componentName);
    if (!hasSchema) {
        issues.push('Missing schema.json file');
    }
    
    // Check extends XWUIComponent
    const extendsXWUIComponent = checkExtendsXWUIComponent(componentPath, componentName);
    if (!extendsXWUIComponent) {
        issues.push('Component does not extend XWUIComponent');
    }
    
    // Check testers folder
    const hasTestersFolder = checkTestersFolder(componentPath);
    if (!hasTestersFolder) {
        issues.push('Missing testers folder');
    }
    
    // Check tester files
    const { hasFiles, extendTester } = checkTesters(componentPath, componentName);
    if (!hasFiles) {
        issues.push('No tester HTML files found');
    } else if (!extendTester) {
        issues.push('Tester files do not extend XWUITester');
    }
    
    // Check schema manifest info
    const schemaHasManifestInfo = checkSchemaManifestInfo(componentPath, componentName);
    if (!schemaHasManifestInfo) {
        issues.push('Schema.json missing title/description for manifest generation');
    }
    
    return {
        name: componentName,
        path: componentPath,
        hasCSS,
        cssHasStylesReference: hasReference,
        hasSchema,
        extendsXWUIComponent,
        hasTestersFolder,
        hasTesterFiles: hasFiles,
        testersExtendXWUITester: extendTester,
        schemaHasManifestInfo,
        issues
    };
}

// Main audit function
function runAudit() {
    console.log('Starting XWUI Components Audit...\n');
    
    const components = getXWUIComponents();
    console.log(`Found ${components.length} XWUI components to audit\n`);
    
    for (const componentName of components) {
        const result = auditComponent(componentName);
        results.push(result);
    }
    
    // Generate report
    console.log('='.repeat(80));
    console.log('AUDIT REPORT');
    console.log('='.repeat(80));
    console.log();
    
    const componentsWithIssues = results.filter(r => r.issues.length > 0);
    const componentsWithoutIssues = results.filter(r => r.issues.length === 0);
    
    console.log(`Total Components: ${results.length}`);
    console.log(`Components with issues: ${componentsWithIssues.length}`);
    console.log(`Components without issues: ${componentsWithoutIssues.length}`);
    console.log();
    
    // Summary by issue type
    console.log('SUMMARY BY ISSUE TYPE:');
    console.log('-'.repeat(80));
    const issueCounts: Record<string, number> = {};
    results.forEach(result => {
        result.issues.forEach(issue => {
            issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        });
    });
    
    Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([issue, count]) => {
            console.log(`  ${issue}: ${count}`);
        });
    console.log();
    
    // Detailed report
    if (componentsWithIssues.length > 0) {
        console.log('COMPONENTS WITH ISSUES:');
        console.log('-'.repeat(80));
        componentsWithIssues.forEach(result => {
            console.log(`\n${result.name}:`);
            result.issues.forEach(issue => {
                console.log(`  ❌ ${issue}`);
            });
        });
        console.log();
    }
    
    if (componentsWithoutIssues.length > 0) {
        console.log('COMPONENTS WITHOUT ISSUES:');
        console.log('-'.repeat(80));
        componentsWithoutIssues.forEach(result => {
            console.log(`  ✅ ${result.name}`);
        });
    }
    
    // Write detailed JSON report
    const reportPath = path.join(__dirname, '../XWUI_COMPONENTS_AUDIT_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed JSON report written to: ${reportPath}`);
}

// Run the audit
runAudit();

