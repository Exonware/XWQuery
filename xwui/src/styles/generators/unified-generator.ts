/**
 * Unified CSS Generator
 * Generates optimized CSS files for typography, lines, and roundness
 * Uses inheritance pattern: root files have full utilities, shape files only variables + one class
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { GENERIC_TYPES, DETAILED_TYPES, getDetailedShapeTypes, getShapeInfo } from './shape-types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// LINES CONFIGURATION
// ============================================================================

const LINES_PRESETS = {
    subtle: {
        id: 'subtle',
        label: 'SUBTLE LINES',
        description: 'Very soft, low-contrast borders',
        default: false,
        widths: { thin: 0.5, regular: 1, thick: 1.5, heavy: 2 }
    },
    balanced: {
        id: 'balanced',
        label: 'BALANCED LINES',
        description: 'Default, balanced border visibility',
        default: true,
        widths: { thin: 1, regular: 1.5, thick: 2, heavy: 3 }
    },
    strong: {
        id: 'strong',
        label: 'STRONG LINES',
        description: 'Stronger borders for high contrast UIs',
        default: false,
        widths: { thin: 1, regular: 2, thick: 3, heavy: 4 }
    },
    outline: {
        id: 'outline',
        label: 'OUTLINE LINES',
        description: 'Pronounced outlines and focus rings',
        default: false,
        widths: { thin: 1, regular: 2, thick: 3, heavy: 4 }
    },
    none: {
        id: 'none',
        label: 'NO LINES',
        description: 'Turns off most borders',
        default: false,
        widths: { thin: 0, regular: 0, thick: 0, heavy: 0 }
    }
} as const;

const LINE_COLORS = ['light', 'medium', 'strong', 'accent'] as const;
const LINE_STYLES = ['solid', 'dashed', 'dotted', 'none'] as const;
const LINE_THICKNESSES = ['thin', 'regular', 'thick', 'heavy'] as const;

function getLineColorVar(color: typeof LINE_COLORS[number]): string {
    switch (color) {
        case 'light': return 'var(--border-light, var(--border-color, rgba(0,0,0,0.05)))';
        case 'medium': return 'var(--border-medium, var(--border-color, rgba(0,0,0,0.08)))';
        case 'strong': return 'var(--border-strong, var(--border-color, rgba(0,0,0,0.12)))';
        case 'accent': return 'var(--accent-primary, var(--border-strong, var(--border-color, rgba(0,0,0,0.12))))';
        default: return 'var(--border-color, rgba(0,0,0,0.08))';
    }
}

// ============================================================================
// ROUNDNESS CONFIGURATION
// ============================================================================

const ROUNDNESS_PRESETS = {
    sharp: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0, full: 0 },
    minimal: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 8, full: 9999 },
    subtle: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10, xxl: 12, full: 9999 },
    rounded: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 20, full: 9999 },
    soft: { xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999 },
    pill: { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40, full: 9999 },
    'extra-rounded': { xs: 12, sm: 16, md: 24, lg: 32, xl: 40, xxl: 48, full: 9999 }
} as const;

// ============================================================================
// TYPOGRAPHY CONFIGURATION
// ============================================================================

// Typography presets are read dynamically from existing files
function getTypographyPresets(stylesPath: string): string[] {
    const typographyPath = join(stylesPath, 'theme', 'typography');
    if (!existsSync(typographyPath)) return [];
    
    const files = readdirSync(typographyPath, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.css'))
        .map(entry => basename(entry.name, '.css'))
        .sort();
    
    return files;
}

// ============================================================================
// GENERIC CSS GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate root preset CSS for lines (with full utilities)
 */
function generateLinesRootCSS(presetKey: keyof typeof LINES_PRESETS): string {
    const preset = LINES_PRESETS[presetKey];
    
    let css = `/* ============================================\n`;
    css += `   ${preset.label} - ${preset.description}\n`;
    css += `   @default: ${preset.default ? 'true' : 'false'}\n`;
    css += `   ============================================ */\n\n`;
    
    css += `:root[data-lines="${preset.id}"] {\n`;
    css += `    /* Global border width tokens (in px) */\n`;
    css += `    --border-width-thin: ${preset.widths.thin}px;\n`;
    css += `    --border-width-regular: ${preset.widths.regular}px;\n`;
    css += `    --border-width-thick: ${preset.widths.thick}px;\n`;
    css += `    --border-width-heavy: ${preset.widths.heavy}px;\n`;
    css += `}\n\n`;
    
    css += `/* Generic line utilities (color × style × thickness)\n`;
    css += `   These use theme border tokens from the active color theme\n`;
    css += `   and width tokens from the active lines preset. */\n\n`;
    
    LINE_COLORS.forEach(color => {
        LINE_STYLES.forEach(style => {
            LINE_THICKNESSES.forEach(thickness => {
                const className = `.line-${color}-${style}-${thickness}`;
                const colorVar = getLineColorVar(color);
                const widthVar = `var(--border-width-${thickness}, ${preset.widths[thickness]}px)`;
                const borderStyle = style === 'none' ? 'none' : style;
                
                css += `${className} {\n`;
                css += `    border-style: ${borderStyle};\n`;
                css += `    border-width: ${style === 'none' ? '0' : widthVar};\n`;
                css += `    border-color: ${colorVar};\n`;
                css += `}\n\n`;
            });
        });
    });
    
    return css.trimEnd() + '\n';
}

/**
 * Generate shape-specific CSS for lines (optimized: only variables + one class)
 */
function generateLinesShapeCSS(shapeType: string, presetKey: keyof typeof LINES_PRESETS): string {
    const preset = LINES_PRESETS[presetKey];
    const shapeInfo = getShapeInfo(shapeType);
    const shapeLabel = shapeInfo?.label || shapeType;
    
    let css = `/* ============================================\n`;
    css += `   ${shapeLabel.toUpperCase()} LINES - ${preset.label}\n`;
    css += `   ============================================ */\n\n`;
    
    css += `:root[data-lines="${preset.id}"] {\n`;
    css += `    /* Shape-specific tokens (inherit from root via fallbacks) */\n`;
    css += `    --border-${shapeType}-width: var(--border-width-regular, ${preset.widths.regular}px);\n`;
    css += `    --border-${shapeType}-style: solid;\n`;
    css += `    --border-${shapeType}-color: var(--border-medium, var(--border-color));\n`;
    css += `}\n\n`;
    
    css += `/* Convenience class using shape tokens */\n`;
    css += `.line-${shapeType}-${preset.id} {\n`;
    css += `    border-style: var(--border-${shapeType}-style, solid);\n`;
    css += `    border-width: var(--border-${shapeType}-width, var(--border-width-regular, ${preset.widths.regular}px));\n`;
    css += `    border-color: var(--border-${shapeType}-color, var(--border-medium, var(--border-color)));\n`;
    css += `}\n`;
    
    return css;
}

/**
 * Generate root preset CSS for roundness
 */
function generateRoundnessRootCSS(presetKey: keyof typeof ROUNDNESS_PRESETS): string {
    const preset = ROUNDNESS_PRESETS[presetKey];
    const presetName = presetKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let css = `/* ============================================\n`;
    css += `   ${presetName} ROUNDNESS - Border radius scale\n`;
    css += `   ============================================ */\n\n`;
    
    css += `:root[data-roundness="${presetKey}"],\n`;
    css += `:root:not([data-roundness]) {\n`;
    css += `    --radius-xs: ${preset.xs}px;\n`;
    css += `    --radius-sm: ${preset.sm}px;\n`;
    css += `    --radius-md: ${preset.md}px;\n`;
    css += `    --radius-lg: ${preset.lg}px;\n`;
    css += `    --radius-xl: ${preset.xl}px;\n`;
    css += `    --radius-2xl: ${preset.xxl}px;\n`;
    css += `    --radius-full: ${preset.full}px;\n`;
    css += `    \n`;
    css += `    /* Granular roundness controls (defaults) */\n`;
    
    // Generate default shape variables
    const allShapes = getDetailedShapeTypes();
    allShapes.forEach(shapeType => {
        const shapeInfo = getShapeInfo(shapeType);
        if (shapeInfo) {
            const defaultSize = shapeInfo.default;
            const radiusValue = preset[defaultSize as keyof typeof preset] || preset.md;
            css += `    --radius-${shapeType}: var(--radius-${defaultSize}, ${radiusValue}px);\n`;
        }
    });
    
    css += `}\n\n`;
    
    return css;
}

/**
 * Generate shape-specific CSS for roundness (optimized: only variables + one class)
 */
function generateRoundnessShapeCSS(shapeType: string, presetKey: keyof typeof ROUNDNESS_PRESETS): string {
    const preset = ROUNDNESS_PRESETS[presetKey];
    const shapeInfo = getShapeInfo(shapeType);
    const shapeLabel = shapeInfo?.label || shapeType;
    const defaultSize = shapeInfo?.default || 'md';
    const radiusValue = preset[defaultSize as keyof typeof preset] || preset.md;
    
    let css = `/* ============================================\n`;
    css += `   ${shapeLabel.toUpperCase()} - ${presetKey.toUpperCase().replace(/-/g, ' ')} ROUNDNESS\n`;
    css += `   ============================================ */\n\n`;
    
    css += `:root[data-roundness="${presetKey}"] {\n`;
    css += `    /* Shape-specific radius (inherits from root via fallback) */\n`;
    css += `    --radius-${shapeType}: ${radiusValue}px;\n`;
    
    // Add fallback chain for detailed types
    if (shapeInfo && 'generic' in shapeInfo && shapeInfo.generic) {
        const genericVar = `--radius-${shapeInfo.generic}`;
        const baseSizeVar = `--radius-${defaultSize}`;
        css += `    /* Fallback: ${genericVar} → ${baseSizeVar} → ${radiusValue}px */\n`;
    }
    
    css += `}\n\n`;
    
    css += `/* Utility class for direct application */\n`;
    css += `.radius-${shapeType}-${presetKey} {\n`;
    css += `    border-radius: var(--radius-${shapeType}, ${radiusValue}px) !important;\n`;
    css += `}\n`;
    
    return css;
}

/**
 * Generate root preset CSS for typography
 */
function generateTypographyRootCSS(fontName: string, fontFamily: string, monoFamily: string): string {
    const fontLabel = fontName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    let css = `/* ============================================\n`;
    css += `   ${fontLabel.toUpperCase()} TYPOGRAPHY - ${fontLabel} font family\n`;
    css += `   ============================================ */\n\n`;
    
    css += `:root[data-font="${fontName}"],\n`;
    css += `:root:not([data-font]) {\n`;
    css += `    --font-family-base: ${fontFamily};\n`;
    css += `    --font-family-mono: ${monoFamily};\n`;
    css += `}\n\n`;
    
    return css;
}

/**
 * Generate shape-specific CSS for typography (optimized: only variables + one class)
 */
function generateTypographyShapeCSS(shapeType: string, fontName: string): string {
    const shapeInfo = getShapeInfo(shapeType);
    const shapeLabel = shapeInfo?.label || shapeType;
    
    let css = `/* ============================================\n`;
    css += `   ${shapeLabel.toUpperCase()} TYPOGRAPHY - ${fontName.toUpperCase()}\n`;
    css += `   ============================================ */\n\n`;
    
    css += `:root[data-font="${fontName}"] {\n`;
    css += `    /* Shape-specific font (inherits from root via fallback) */\n`;
    
    if (shapeType === 'code' || shapeType === 'code-block') {
        css += `    --font-${shapeType}-family: var(--font-family-mono, monospace);\n`;
    } else if (shapeType === 'headings' || shapeType === 'heading') {
        css += `    --font-${shapeType}-family: var(--font-family-base, sans-serif);\n`;
    } else {
        css += `    --font-${shapeType}-family: var(--font-family-base, sans-serif);\n`;
    }
    
    css += `}\n\n`;
    
    css += `/* Utility class for direct application */\n`;
    css += `.font-${shapeType}-${fontName} {\n`;
    css += `    font-family: var(--font-${shapeType}-family, var(--font-family-base, sans-serif)) !important;\n`;
    css += `}\n`;
    
    return css;
}

// ============================================================================
// FILE GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate all lines CSS files
 * ✅ OPTIMIZED: Batch directory creation and parallel file writes
 */
async function generateLinesFiles(stylesPath: string): Promise<void> {
    const outputDir = join(stylesPath, 'theme', 'lines');
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
    
    const shapes = getDetailedShapeTypes();
    const presets = Object.keys(LINES_PRESETS) as Array<keyof typeof LINES_PRESETS>;
    
    console.log('Generating lines CSS files...');
    
    // ✅ OPTIMIZED: Generate all root preset files in parallel
    await Promise.all(
        presets.map(async (presetKey) => {
            const css = generateLinesRootCSS(presetKey);
            const filePath = join(outputDir, `${presetKey}.css`);
            writeFileSync(filePath, css, 'utf-8');
            console.log(`  ✓ ${presetKey}.css`);
        })
    );
    
    // ✅ OPTIMIZED: Pre-create all shape directories, then generate files in parallel
    const shapeDirs = shapes.map(shapeType => join(outputDir, shapeType));
    shapeDirs.forEach(shapeDir => {
        if (!existsSync(shapeDir)) mkdirSync(shapeDir, { recursive: true });
    });
    
    // Generate shape-specific files in parallel batches
    await Promise.all(
        shapes.map(async (shapeType) => {
            const shapeDir = join(outputDir, shapeType);
            await Promise.all(
                presets.map(async (presetKey) => {
                    const css = generateLinesShapeCSS(shapeType, presetKey);
                    const filePath = join(shapeDir, `${presetKey}.css`);
                    writeFileSync(filePath, css, 'utf-8');
                })
            );
            console.log(`  ✓ ${shapeType}/ (${presets.length} files)`);
        })
    );
}

/**
 * Generate all roundness CSS files
 * ✅ OPTIMIZED: Batch directory creation and parallel file writes
 */
async function generateRoundnessFiles(stylesPath: string): Promise<void> {
    const outputDir = join(stylesPath, 'theme', 'roundness');
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
    
    const shapes = getDetailedShapeTypes();
    const presets = Object.keys(ROUNDNESS_PRESETS) as Array<keyof typeof ROUNDNESS_PRESETS>;
    
    console.log('Generating roundness CSS files...');
    
    // ✅ OPTIMIZED: Generate all root preset files in parallel
    await Promise.all(
        presets.map(async (presetKey) => {
            const css = generateRoundnessRootCSS(presetKey);
            const filePath = join(outputDir, `${presetKey}.css`);
            writeFileSync(filePath, css, 'utf-8');
            console.log(`  ✓ ${presetKey}.css`);
        })
    );
    
    // ✅ OPTIMIZED: Pre-create all shape directories, then generate files in parallel
    const shapeDirs = shapes.map(shapeType => join(outputDir, shapeType));
    shapeDirs.forEach(shapeDir => {
        if (!existsSync(shapeDir)) mkdirSync(shapeDir, { recursive: true });
    });
    
    // Generate shape-specific files in parallel batches
    await Promise.all(
        shapes.map(async (shapeType) => {
            const shapeDir = join(outputDir, shapeType);
            await Promise.all(
                presets.map(async (presetKey) => {
                    const css = generateRoundnessShapeCSS(shapeType, presetKey);
                    const filePath = join(shapeDir, `${presetKey}.css`);
                    writeFileSync(filePath, css, 'utf-8');
                })
            );
            console.log(`  ✓ ${shapeType}/ (${presets.length} files)`);
        })
    );
}

/**
 * Generate all typography CSS files
 * ✅ OPTIMIZED: Parallel file reads and writes
 */
async function generateTypographyFiles(stylesPath: string): Promise<void> {
    const outputDir = join(stylesPath, 'theme', 'typography');
    if (!existsSync(outputDir)) {
        console.log('Typography directory not found. Skipping typography generation.');
        return;
    }
    
    const fonts = getTypographyPresets(stylesPath);
    if (fonts.length === 0) {
        console.log('No typography presets found. Skipping typography generation.');
        return;
    }
    
    // ✅ OPTIMIZED: Read all font files in parallel
    const fontDataEntries = await Promise.all(
        fonts.map(async (fontName) => {
            const fontPath = join(outputDir, `${fontName}.css`);
            if (existsSync(fontPath)) {
                const content = readFileSync(fontPath, 'utf-8');
                // Extract font-family-base and font-family-mono from existing files
                const baseMatch = content.match(/--font-family-base:\s*([^;]+)/);
                const monoMatch = content.match(/--font-family-mono:\s*([^;]+)/);
                
                return {
                    fontName,
                    data: {
                        base: baseMatch ? baseMatch[1].trim() : 'sans-serif',
                        mono: monoMatch ? monoMatch[1].trim() : 'monospace'
                    }
                };
            }
            return null;
        })
    );
    
    const fontData: Record<string, { base: string; mono: string }> = {};
    fontDataEntries.forEach(entry => {
        if (entry) {
            fontData[entry.fontName] = entry.data;
        }
    });
    
    const shapes = getDetailedShapeTypes().filter(s => 
        ['headings', 'body', 'label', 'caption', 'code', 'button', 'input'].includes(s)
    );
    
    console.log('Generating typography CSS files...');
    
    // ✅ OPTIMIZED: Generate root preset files in parallel
    await Promise.all(
        fonts.map(async (fontName) => {
            const data = fontData[fontName];
            if (data) {
                const css = generateTypographyRootCSS(fontName, data.base, data.mono);
                const filePath = join(outputDir, `${fontName}.css`);
                writeFileSync(filePath, css, 'utf-8');
                console.log(`  ✓ ${fontName}.css`);
            }
        })
    );
    
    // ✅ OPTIMIZED: Pre-create all shape directories, then generate files in parallel
    const shapeDirs = shapes.map(shapeType => join(outputDir, shapeType));
    shapeDirs.forEach(shapeDir => {
        if (!existsSync(shapeDir)) mkdirSync(shapeDir, { recursive: true });
    });
    
    // Generate shape-specific files in parallel batches
    await Promise.all(
        shapes.map(async (shapeType) => {
            const shapeDir = join(outputDir, shapeType);
            await Promise.all(
                fonts.map(async (fontName) => {
                    const css = generateTypographyShapeCSS(shapeType, fontName);
                    const filePath = join(shapeDir, `${fontName}.css`);
                    writeFileSync(filePath, css, 'utf-8');
                })
            );
            console.log(`  ✓ ${shapeType}/ (${fonts.length} files)`);
        })
    );
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function main() {
    // Find styles directory
    let stylesPath = join(__dirname, '..');
    
    if (!existsSync(join(stylesPath, 'theme'))) {
        const possiblePaths = [
            join(process.cwd(), 'src', 'styles'),
            join(__dirname, '..', '..', 'styles'),
            __dirname
        ];
        
        for (const possiblePath of possiblePaths) {
            if (existsSync(join(possiblePath, 'theme'))) {
                stylesPath = possiblePath;
                break;
            }
        }
    }
    
    console.log('Unified CSS Generator');
    console.log(`Styles path: ${stylesPath}\n`);
    
    await generateLinesFiles(stylesPath);
    console.log('');
    
    await generateRoundnessFiles(stylesPath);
    console.log('');
    
    await generateTypographyFiles(stylesPath);
    console.log('');
    
    console.log('✓ All CSS files generated successfully!');
    console.log('\nOptimization: Shape files only contain variables + one convenience class.');
    console.log('Full utilities are in root preset files for maximum efficiency.');
}

// Run if executed directly
const isMainModule = process.argv[1] && (
    process.argv[1].endsWith('unified-generator.js') ||
    process.argv[1].endsWith('unified-generator.ts') ||
    process.argv[1].includes('unified-generator')
);

if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { generateLinesFiles, generateRoundnessFiles, generateTypographyFiles };

