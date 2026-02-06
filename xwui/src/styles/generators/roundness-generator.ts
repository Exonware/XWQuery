/**
 * Roundness CSS Generator
 * Generates CSS files for all shape type × roundness preset combinations
 * Creates organized subfolders with specific CSS classes
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Roundness presets with base size values
const ROUNDNESS_PRESETS = {
    sharp: {
        xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0, full: 0
    },
    minimal: {
        xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 8, full: 9999
    },
    subtle: {
        xs: 2, sm: 4, md: 6, lg: 8, xl: 10, xxl: 12, full: 9999
    },
    rounded: {
        xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 20, full: 9999
    },
    soft: {
        xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999
    },
    pill: {
        xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40, full: 9999
    },
    'extra-rounded': {
        xs: 12, sm: 16, md: 24, lg: 32, xl: 40, xxl: 48, full: 9999
    }
};

import { GENERIC_TYPES, DETAILED_TYPES } from './shape-types.js';

/**
 * Generate CSS content for a specific shape type and roundness preset
 */
function generateShapeTypeCSS(shapeType: string, roundnessName: string, roundnessValues: typeof ROUNDNESS_PRESETS.sharp): string {
    const isGeneric = GENERIC_TYPES[shapeType as keyof typeof GENERIC_TYPES] !== undefined;
    const shapeInfo = isGeneric 
        ? GENERIC_TYPES[shapeType as keyof typeof GENERIC_TYPES]
        : DETAILED_TYPES[shapeType as keyof typeof DETAILED_TYPES];
    
    if (!shapeInfo) {
        throw new Error(`Unknown shape type: ${shapeType}`);
    }
    
    const defaultBaseSize = shapeInfo.default;
    const radiusValue = roundnessValues[defaultBaseSize as keyof typeof roundnessValues];
    const label = shapeInfo.label;
    
    // Generate title
    const title = `${label.toUpperCase()} - ${roundnessName.toUpperCase().replace(/-/g, ' ')} ROUNDNESS`;
    
    // Generate CSS with data attribute selector
    const dataAttr = `data-roundness="${roundnessName}"`;
    const shapeVar = `--radius-${shapeType}`;
    
    let css = `/* ============================================\n`;
    css += `   ${title}\n`;
    css += `   ============================================ */\n\n`;
    
    css += `:root[${dataAttr}] {\n`;
    css += `    ${shapeVar}: ${radiusValue}px;\n`;
    
    // Add fallback chain for detailed types
    if (!isGeneric && 'generic' in shapeInfo) {
        const genericVar = `--radius-${shapeInfo.generic}`;
        const baseSizeVar = `--radius-${defaultBaseSize}`;
        css += `    /* Fallback: ${genericVar} → ${baseSizeVar} → ${radiusValue}px */\n`;
    }
    
    css += `}\n\n`;
    
    // Add utility class for direct usage
    const className = `.radius-${shapeType}-${roundnessName}`;
    css += `/* Utility class for direct application */\n`;
    css += `${className} {\n`;
    css += `    border-radius: var(${shapeVar}, ${radiusValue}px) !important;\n`;
    css += `}\n`;
    
    return css;
}

/**
 * Generate all CSS files for a shape type
 */
function generateShapeTypeFiles(shapeType: string, outputDir: string): void {
    const shapeDir = join(outputDir, shapeType);
    
    // Create directory if it doesn't exist
    if (!existsSync(shapeDir)) {
        mkdirSync(shapeDir, { recursive: true });
    }
    
    // Generate CSS file for each roundness preset
    Object.entries(ROUNDNESS_PRESETS).forEach(([roundnessName, roundnessValues]) => {
        const css = generateShapeTypeCSS(shapeType, roundnessName, roundnessValues);
        const filePath = join(shapeDir, `${roundnessName}.css`);
        writeFileSync(filePath, css, 'utf-8');
        console.log(`✓ Generated: ${shapeType}/${roundnessName}.css`);
    });
}

/**
 * Main generator function
 */
function generateAllRoundnessFiles(): void {
    // Go up from generators to styles, then to theme/roundness
    let outputDir = join(__dirname, '..', 'theme', 'roundness');
    
    // If that doesn't exist, try relative to current working directory
    if (!existsSync(outputDir)) {
        const altPath = resolve(process.cwd(), 'src', 'styles', 'theme', 'roundness');
        if (existsSync(altPath)) {
            outputDir = altPath;
        } else {
            // Create the directory structure
            outputDir = resolve(process.cwd(), 'src', 'styles', 'theme', 'roundness');
        }
    }
    
    console.log('Generating roundness CSS files...');
    console.log(`Output directory: ${outputDir}\n`);
    
    // Generate files for generic types
    console.log('Generating generic types...');
    Object.keys(GENERIC_TYPES).forEach(shapeType => {
        generateShapeTypeFiles(shapeType, outputDir);
    });
    
    console.log('\nGenerating detailed types...');
    // Generate files for detailed types
    Object.keys(DETAILED_TYPES).forEach(shapeType => {
        // Skip if already generated as generic
        if (!GENERIC_TYPES[shapeType as keyof typeof GENERIC_TYPES]) {
            generateShapeTypeFiles(shapeType, outputDir);
        }
    });
    
    console.log('\n✓ All roundness CSS files generated successfully!');
    console.log(`\nTotal shape types: ${Object.keys(GENERIC_TYPES).length + Object.keys(DETAILED_TYPES).length}`);
    console.log(`Total files: ${(Object.keys(GENERIC_TYPES).length + Object.keys(DETAILED_TYPES).length) * Object.keys(ROUNDNESS_PRESETS).length}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('roundness-generator')) {
    generateAllRoundnessFiles();
}

export { generateAllRoundnessFiles, generateShapeTypeCSS, ROUNDNESS_PRESETS, GENERIC_TYPES, DETAILED_TYPES };

