/**
 * XWUI Component Compliance Checker
 * 
 * Checks all XWUI components against the compliance checklist defined in GUIDE_DEV_TS_XWUI.md
 * 
 * Usage:
 *   node tools/check-component-compliance.js [ComponentName]
 * 
 * If ComponentName is provided, only checks that component.
 * Otherwise, checks all components.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.join(__dirname, '../src/components');

// Get component name from command line args
const componentName = process.argv[2];

// Compliance check results
const results = {
    compliant: [],
    partial: [],
    nonCompliant: [],
    errors: []
};

/**
 * Get all component directories
 */
function getComponentDirs() {
    const dirs = fs.readdirSync(componentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => name.startsWith('XWUI') || name === 'testers')
        .filter(name => name !== 'testers'); // Exclude testers folder itself
    
    if (componentName) {
        const filtered = dirs.filter(dir => dir === componentName || dir === `XWUI${componentName}`);
        if (filtered.length === 0) {
            console.error(`Component ${componentName} not found`);
            process.exit(1);
        }
        return filtered;
    }
    
    return dirs;
}

/**
 * Check file structure compliance
 */
function checkFileStructure(componentDir, componentName) {
    const checks = {
        hasTsFile: false,
        hasJsonFile: false,
        hasIndexFile: false,
        hasReactFile: false,
        hasTester: false,
        hasTesterCss: false,
        hasComponentCss: false,
        jsonFileName: null
    };
    
    const files = fs.readdirSync(componentDir);
    
    // Check for TypeScript file
    checks.hasTsFile = files.includes(`${componentName}.ts`);
    
    // Check for JSON schema file
    const jsonFile = files.find(f => f === `${componentName}.json`);
    const schemaJsonFile = files.find(f => f === `${componentName}.schema.json`);
    checks.hasJsonFile = !!jsonFile;
    checks.jsonFileName = jsonFile || schemaJsonFile;
    
    // Check for index file
    checks.hasIndexFile = files.includes('index.ts');
    
    // Check for react file
    checks.hasReactFile = files.includes('react.ts');
    
    // Check for tester
    const testersDir = path.join(componentDir, 'testers');
    if (fs.existsSync(testersDir)) {
        const testerFiles = fs.readdirSync(testersDir);
        checks.hasTester = testerFiles.includes(`Tester${componentName}.html`);
        checks.hasTesterCss = testerFiles.includes(`Tester${componentName}.css`);
    }
    
    // Check for component CSS
    checks.hasComponentCss = files.includes(`${componentName}.css`);
    
    return checks;
}

/**
 * Check TypeScript implementation
 */
function checkTypeScriptImplementation(componentDir, componentName) {
    const checks = {
        extendsXWUIComponent: false,
        hasInterfaces: false,
        hasCreateConfig: false,
        hasSetupDOM: false,
        hasDestroy: false,
        constructorSignature: false,
        importsCorrectly: false
    };
    
    const tsFile = path.join(componentDir, `${componentName}.ts`);
    if (!fs.existsSync(tsFile)) {
        return checks;
    }
    
    const content = fs.readFileSync(tsFile, 'utf-8');
    
    // Check extends XWUIComponent
    checks.extendsXWUIComponent = /extends\s+XWUIComponent/.test(content);
    
    // Check for interfaces
    checks.hasInterfaces = /export\s+interface\s+\w+Config/.test(content) && 
                          /export\s+interface\s+\w+Data/.test(content);
    
    // Check for createConfig method
    checks.hasCreateConfig = /protected\s+createConfig/.test(content);
    
    // Check for setupDOM method
    checks.hasSetupDOM = /private\s+setupDOM|protected\s+setupDOM/.test(content);
    
    // Check for destroy method
    checks.hasDestroy = /public\s+destroy\s*\(/.test(content);
    
    // Check constructor signature (should have container, data, conf_comp)
    checks.constructorSignature = /constructor\s*\([^)]*container[^)]*data[^)]*conf_comp/.test(content);
    
    // Check imports (should import from component folders, not barrel exports)
    checks.importsCorrectly = !/from\s+['"]\.\.\/index['"]/.test(content);
    
    return checks;
}

/**
 * Check JSON schema compliance
 */
function checkJsonSchema(componentDir, componentName) {
    const checks = {
        exists: false,
        correctName: false,
        hasTopLevelFields: false,
        hasId: false,
        idMatches: false,
        hasConfComp: false,
        hasData: false,
        noMeta: false,
        errors: []
    };
    
    const jsonFile = path.join(componentDir, `${componentName}.json`);
    const schemaJsonFile = path.join(componentDir, `${componentName}.schema.json`);
    
    let filePath = null;
    if (fs.existsSync(jsonFile)) {
        filePath = jsonFile;
        checks.exists = true;
        checks.correctName = true;
    } else if (fs.existsSync(schemaJsonFile)) {
        filePath = schemaJsonFile;
        checks.exists = true;
        checks.correctName = false; // Wrong name
    }
    
    if (!filePath) {
        return checks;
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const schema = JSON.parse(content);
        
        // Check top-level fields
        checks.hasTopLevelFields = !!(schema.$schema && schema.name && schema.description && schema.path && schema.tags);
        
        // Check ID
        checks.hasId = !!schema.id;
        checks.idMatches = schema.id === componentName;
        
        // Check properties structure
        if (schema.properties) {
            checks.hasConfComp = !!schema.properties.conf_comp;
            checks.hasData = !!schema.properties.data;
        }
        
        // Check no meta section
        checks.noMeta = !schema.meta;
        
    } catch (error) {
        checks.errors.push(error.message);
    }
    
    return checks;
}

/**
 * Check CSS compliance
 */
function checkCssCompliance(componentDir, componentName) {
    const checks = {
        hasCss: false,
        usesVariables: false,
        noHardcodedColors: false,
        noHardcodedSpacing: false,
        hasStyleDependencies: false,
        testerCssExists: false
    };
    
    const cssFile = path.join(componentDir, `${componentName}.css`);
    checks.hasCss = fs.existsSync(cssFile);
    
    if (checks.hasCss) {
        const content = fs.readFileSync(cssFile, 'utf-8');
        
        // Check for CSS variables usage
        checks.usesVariables = /var\(--/.test(content);
        
        // Check for hardcoded colors (hex, rgb, rgba, named colors)
        checks.noHardcodedColors = !/#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|:\s*(red|blue|green|black|white|yellow|orange|purple|pink|gray|grey)/i.test(content);
        
        // Check for hardcoded spacing (px, rem, em values in padding/margin)
        checks.noHardcodedSpacing = !/(padding|margin|gap):\s*\d+(px|rem|em)/.test(content);
        
        // Check for style dependencies comment
        checks.hasStyleDependencies = /Style Dependencies|style.*dependencies/i.test(content);
    }
    
    // Check for tester CSS
    const testerCssFile = path.join(componentDir, 'testers', `Tester${componentName}.css`);
    checks.testerCssExists = fs.existsSync(testerCssFile);
    
    return checks;
}

/**
 * Check index file compliance
 */
function checkIndexFile(componentDir, componentName) {
    const checks = {
        exists: false,
        exportsComponent: false,
        exportsTypes: false,
        registersCustomElement: false,
        hasFlatAttrs: false
    };
    
    const indexFile = path.join(componentDir, 'index.ts');
    checks.exists = fs.existsSync(indexFile);
    
    if (checks.exists) {
        const content = fs.readFileSync(indexFile, 'utf-8');
        
        // Check exports
        checks.exportsComponent = new RegExp(`export\\s+.*\\b${componentName}\\b`).test(content);
        checks.exportsTypes = /export\s+type/.test(content);
        
        // Check Custom Element registration
        checks.registersCustomElement = /createXWUIElement/.test(content);
        
        // Check flat attrs mapping
        checks.hasFlatAttrs = /flatAttrsToConfig|flatAttrsToData/.test(content);
    }
    
    return checks;
}

/**
 * Check component reuse
 */
function checkComponentReuse(componentDir, componentName) {
    const checks = {
        reusesComponents: false,
        importsCorrectly: false,
        cleansUpChildren: false
    };
    
    const tsFile = path.join(componentDir, `${componentName}.ts`);
    if (!fs.existsSync(tsFile)) {
        return checks;
    }
    
    const content = fs.readFileSync(tsFile, 'utf-8');
    
    // Check if component imports other XWUI components
    checks.reusesComponents = /import.*XWUI\w+\s+from\s+['"]\.\.\/XWUI/.test(content);
    
    // Check imports from component folders (not barrel exports)
    checks.importsCorrectly = !/from\s+['"]\.\.\/index['"]/.test(content);
    
    // Check destroy method cleans up children
    const destroyMatch = content.match(/public\s+destroy\s*\([^)]*\)\s*\{([^}]+)\}/);
    if (destroyMatch) {
        const destroyBody = destroyMatch[1];
        checks.cleansUpChildren = /\.destroy\(\)/.test(destroyBody);
    }
    
    return checks;
}

/**
 * Check tester compliance
 */
function checkTester(componentDir, componentName) {
    const checks = {
        exists: false,
        loadsStylesSystem: false,
        loadsComponentCss: false,
        hasTesterCss: false,
        usesImports: false
    };
    
    const testerFile = path.join(componentDir, 'testers', `Tester${componentName}.html`);
    checks.exists = fs.existsSync(testerFile);
    
    if (checks.exists) {
        const content = fs.readFileSync(testerFile, 'utf-8');
        
        // Check for styles system loading
        checks.loadsStylesSystem = /styles\/(base|brand|style|theme)/.test(content);
        
        // Check for component CSS loading
        checks.loadsComponentCss = new RegExp(`${componentName}\\.css`).test(content);
        
        // Check for tester CSS (should NOT exist)
        const testerCssFile = path.join(componentDir, 'testers', `Tester${componentName}.css`);
        checks.hasTesterCss = fs.existsSync(testerCssFile);
        
        // Check for ES module imports
        checks.usesImports = /import.*from.*index\\.ts/.test(content);
    }
    
    return checks;
}

/**
 * Calculate compliance score for a component
 */
function calculateCompliance(componentName, allChecks) {
    const categories = {
        fileStructure: {
            checks: ['hasTsFile', 'hasJsonFile', 'hasIndexFile', 'hasTester', 'hasComponentCss'],
            weights: [1, 1, 1, 1, 0.5]
        },
        typescript: {
            checks: ['extendsXWUIComponent', 'hasInterfaces', 'hasCreateConfig', 'hasSetupDOM', 'hasDestroy', 'constructorSignature'],
            weights: [1, 1, 1, 1, 1, 1]
        },
        jsonSchema: {
            checks: ['exists', 'correctName', 'hasTopLevelFields', 'hasId', 'idMatches', 'hasConfComp', 'hasData', 'noMeta'],
            weights: [1, 1, 1, 1, 1, 1, 1, 1]
        },
        css: {
            checks: ['usesVariables', 'noHardcodedColors', 'noHardcodedSpacing', 'hasStyleDependencies'],
            weights: [1, 1, 1, 0.5]
        },
        indexFile: {
            checks: ['exists', 'exportsComponent', 'exportsTypes', 'registersCustomElement', 'hasFlatAttrs'],
            weights: [1, 1, 1, 1, 1]
        },
        componentReuse: {
            checks: ['reusesComponents', 'importsCorrectly', 'cleansUpChildren'],
            weights: [0.5, 1, 1]
        },
        tester: {
            checks: ['exists', 'loadsStylesSystem', 'loadsComponentCss', 'usesImports'],
            weights: [1, 1, 0.5, 1]
        }
    };
    
    const scores = {};
    let totalScore = 0;
    let maxScore = 0;
    
    for (const [category, config] of Object.entries(categories)) {
        let categoryScore = 0;
        let categoryMax = 0;
        
        for (let i = 0; i < config.checks.length; i++) {
            const check = config.checks[i];
            const weight = config.weights[i];
            const value = allChecks[category]?.[check];
            
            if (value !== undefined) {
                categoryMax += weight;
                if (value === true || (typeof value === 'number' && value > 0)) {
                    categoryScore += weight;
                }
            }
        }
        
        scores[category] = {
            score: categoryScore,
            max: categoryMax,
            percentage: categoryMax > 0 ? (categoryScore / categoryMax * 100).toFixed(1) : 0
        };
        
        totalScore += categoryScore;
        maxScore += categoryMax;
    }
    
    const overallPercentage = maxScore > 0 ? (totalScore / maxScore * 100).toFixed(1) : 0;
    
    return {
        scores,
        overall: {
            score: totalScore,
            max: maxScore,
            percentage: overallPercentage
        }
    };
}

/**
 * Generate compliance report for a component
 */
function checkComponent(componentName) {
    const componentDir = path.join(componentsDir, componentName);
    
    if (!fs.existsSync(componentDir)) {
        return { error: `Component directory not found: ${componentName}` };
    }
    
    const allChecks = {
        fileStructure: checkFileStructure(componentDir, componentName),
        typescript: checkTypeScriptImplementation(componentDir, componentName),
        jsonSchema: checkJsonSchema(componentDir, componentName),
        css: checkCssCompliance(componentDir, componentName),
        indexFile: checkIndexFile(componentDir, componentName),
        componentReuse: checkComponentReuse(componentDir, componentName),
        tester: checkTester(componentDir, componentName)
    };
    
    const compliance = calculateCompliance(componentName, allChecks);
    
    return {
        componentName,
        checks: allChecks,
        compliance
    };
}

/**
 * Main function
 */
function main() {
    const componentDirs = getComponentDirs();
    const reports = [];
    
    console.log(`Checking ${componentDirs.length} components...\n`);
    
    for (const componentDir of componentDirs) {
        try {
            const report = checkComponent(componentDir);
            if (report.error) {
                results.errors.push(report);
                console.error(`Error checking ${componentDir}: ${report.error}`);
            } else {
                    reports.push(report);
            }
        } catch (error) {
            results.errors.push({ component: componentDir, error: error.message });
            console.error(`Error checking ${componentDir}: ${error.message}`);
        }
    }
    
    // Categorize results
    for (const report of reports) {
        const percentage = parseFloat(report.compliance.overall.percentage);
        if (percentage >= 80) {
            results.compliant.push(report);
        } else if (percentage >= 50) {
            results.partial.push(report);
        } else {
            results.nonCompliant.push(report);
        }
    }
    
    // Print summary
    console.log('\n=== COMPLIANCE SUMMARY ===\n');
    console.log(`Total Components: ${reports.length}`);
    console.log(`Compliant (≥80%): ${results.compliant.length}`);
    console.log(`Partial (50-79%): ${results.partial.length}`);
    console.log(`Non-Compliant (<50%): ${results.nonCompliant.length}`);
    console.log(`Errors: ${results.errors.length}\n`);
    
    // Print detailed results
    if (componentName) {
        // Single component - detailed report
        const report = reports[0];
        if (report) {
            console.log(`\n=== DETAILED REPORT: ${report.componentName} ===\n`);
            console.log(`Overall Compliance: ${report.compliance.overall.percentage}%`);
            console.log(`Score: ${report.compliance.overall.score}/${report.compliance.overall.max}\n`);
            
            for (const [category, score] of Object.entries(report.compliance.scores)) {
                console.log(`${category}: ${score.percentage}% (${score.score}/${score.max})`);
            }
            
            console.log('\n=== DETAILED CHECKS ===\n');
            for (const [category, checks] of Object.entries(report.checks)) {
                console.log(`\n${category.toUpperCase()}:`);
                for (const [check, value] of Object.entries(checks)) {
                    const status = value === true ? '✓' : value === false ? '✗' : value;
                    console.log(`  ${check}: ${status}`);
                }
            }
        }
    } else {
        // All components - summary table
        console.log('\n=== COMPLIANCE BY COMPONENT ===\n');
        console.log('Component'.padEnd(30) + 'Compliance'.padEnd(15) + 'Status');
        console.log('-'.repeat(60));
        
        const allReports = [...results.compliant, ...results.partial, ...results.nonCompliant]
            .sort((a, b) => parseFloat(b.compliance.overall.percentage) - parseFloat(a.compliance.overall.percentage));
        
        for (const report of allReports) {
            const percentage = report.compliance.overall.percentage;
            const status = parseFloat(percentage) >= 80 ? '✓ Compliant' : 
                         parseFloat(percentage) >= 50 ? '⚠ Partial' : '✗ Non-Compliant';
            console.log(report.componentName.padEnd(30) + `${percentage}%`.padEnd(15) + status);
        }
    }
    
    // Save JSON report
    const reportFile = path.join(__dirname, '../COMPONENT_COMPLIANCE_REPORT.json');
    fs.writeFileSync(reportFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
            total: reports.length,
            compliant: results.compliant.length,
            partial: results.partial.length,
            nonCompliant: results.nonCompliant.length,
            errors: results.errors.length
        },
        reports: reports.map(r => ({
            componentName: r.componentName,
            compliance: r.compliance,
            checks: r.checks
        }))
    }, null, 2));
    
    console.log(`\n\nDetailed report saved to: ${reportFile}`);
}

main();

