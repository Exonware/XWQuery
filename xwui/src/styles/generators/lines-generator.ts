/**
 * Lines (Border) CSS Generator
 * Generates CSS files for all shape type × lines preset combinations
 * Creates organized subfolders with specific CSS classes for
 * color × style × thickness mixes.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { GENERIC_TYPES, DETAILED_TYPES } from './shape-types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lines presets control overall border visibility/thickness scale
const LINES_PRESETS = {
    subtle: {
        id: 'subtle',
        label: 'SUBTLE LINES',
        description: 'Very soft, low-contrast borders',
        default: false,
        widths: {
            thin: 0.5,
            regular: 1,
            thick: 1.5,
            heavy: 2
        }
    },
    balanced: {
        id: 'balanced',
        label: 'BALANCED LINES',
        description: 'Default, balanced border visibility',
        default: true,
        widths: {
            thin: 1,
            regular: 1.5,
            thick: 2,
            heavy: 3
        }
    },
    strong: {
        id: 'strong',
        label: 'STRONG LINES',
        description: 'Stronger borders for high contrast UIs',
        default: false,
        widths: {
            thin: 1,
            regular: 2,
            thick: 3,
            heavy: 4
        }
    },
    outline: {
        id: 'outline',
        label: 'OUTLINE LINES',
        description: 'Pronounced outlines and focus rings',
        default: false,
        widths: {
            thin: 1,
            regular: 2,
            thick: 3,
            heavy: 4
        }
    },
    none: {
        id: 'none',
        label: 'NO LINES',
        description: 'Turns off most borders',
        default: false,
        widths: {
            thin: 0,
            regular: 0,
            thick: 0,
            heavy: 0
        }
    }
} as const;

type LinesPresetKey = keyof typeof LINES_PRESETS;

// Line colors derived from theme color tokens
const LINE_COLORS = ['light', 'medium', 'strong', 'accent'] as const;
type LineColor = (typeof LINE_COLORS)[number];

// Line styles
const LINE_STYLES = ['solid', 'dashed', 'dotted', 'none'] as const;
type LineStyle = (typeof LINE_STYLES)[number];

// Line thickness tokens (mapped to preset widths)
const LINE_THICKNESSES = ['thin', 'regular', 'thick', 'heavy'] as const;
type LineThickness = (typeof LINE_THICKNESSES)[number];

/**
 * Map line color name to CSS variable expression
 */
function getLineColorVar(color: LineColor): string {
    switch (color) {
        case 'light':
            return 'var(--border-light, var(--border-color, rgba(0,0,0,0.05)))';
        case 'medium':
            return 'var(--border-medium, var(--border-color, rgba(0,0,0,0.08)))';
        case 'strong':
            return 'var(--border-strong, var(--border-color, rgba(0,0,0,0.12)))';
        case 'accent':
            return 'var(--accent-primary, var(--border-strong, var(--border-color, rgba(0,0,0,0.12))))';
        default:
            return 'var(--border-color, rgba(0,0,0,0.08))';
    }
}

/**
 * Generate utility class name for generic lines
 * Example: .line-light-solid-thin
 */
function getGenericLineClassName(
    color: LineColor,
    style: LineStyle,
    thickness: LineThickness
): string {
    return `.line-${color}-${style}-${thickness}`;
}

/**
 * Generate utility class name for a specific shape type
 * Example: .line-input-light-solid-thin
 */
function getShapeLineClassName(
    shapeType: string,
    color: LineColor,
    style: LineStyle,
    thickness: LineThickness
): string {
    return `.line-${shapeType}-${color}-${style}-${thickness}`;
}

/**
 * Generate CSS content for root preset file (e.g. balanced.css)
 * - Sets global border width tokens based on preset
 * - Adds generic utility classes for color × style × thickness mixes
 */
function generateRootPresetCSS(presetKey: LinesPresetKey): string {
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

    // Generic utilities – same names across presets, behavior driven by tokens
    css += `/* Generic line utilities (color × style × thickness)\n`;
    css += `   These use theme border tokens from the active color theme\n`;
    css += `   and width tokens from the active lines preset. */\n\n`;

    LINE_COLORS.forEach(color => {
        LINE_STYLES.forEach(style => {
            LINE_THICKNESSES.forEach(thickness => {
                const className = getGenericLineClassName(color, style, thickness);
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
 * Generate CSS content for a specific shape type and lines preset
 * - Provides shape-specific tokens like --border-input-width
 * - Adds a few convenience utilities per shape
 */
function generateShapeTypeLinesCSS(
    shapeType: string,
    presetKey: LinesPresetKey
): string {
    const preset = LINES_PRESETS[presetKey];

    const shapeLabel =
        (GENERIC_TYPES as any)[shapeType]?.label ??
        (DETAILED_TYPES as any)[shapeType]?.label ??
        shapeType;

    const title = `${String(shapeLabel).toUpperCase()} LINES - ${preset.label}`;

    const shapeWidthVar = `--border-${shapeType}-width`;
    const shapeStyleVar = `--border-${shapeType}-style`;
    const shapeColorVar = `--border-${shapeType}-color`;

    let css = `/* ============================================\n`;
    css += `   ${title}\n`;
    css += `   ============================================ */\n\n`;

    css += `:root[data-lines="${preset.id}"] {\n`;
    css += `    /* Shape-specific default tokens for ${shapeType} */\n`;
    css += `    ${shapeWidthVar}: var(--border-width-regular, ${preset.widths.regular}px);\n`;
    css += `    ${shapeStyleVar}: solid;\n`;
    css += `    ${shapeColorVar}: var(--border-medium, var(--border-color));\n`;
    css += `}\n\n`;

    css += `/* Shape line utilities (color × style × thickness) */\n\n`;

    LINE_COLORS.forEach(color => {
        LINE_STYLES.forEach(style => {
            LINE_THICKNESSES.forEach(thickness => {
                const className = getShapeLineClassName(shapeType, color, style, thickness);
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

    // Convenience class to apply default shape tokens
    css += `/* Convenience: use the shape tokens directly */\n`;
    css += `.line-${shapeType}-${preset.id} {\n`;
    css += `    border-style: var(${shapeStyleVar}, solid);\n`;
    css += `    border-width: var(${shapeWidthVar}, var(--border-width-regular, ${preset.widths.regular}px));\n`;
    css += `    border-color: var(${shapeColorVar}, var(--border-medium, var(--border-color)));\n`;
    css += `}\n`;

    return css.trimEnd() + '\n';
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): string {
    // Go up from generators to styles, then to theme/lines
    let outputDir = join(__dirname, '..', 'theme', 'lines');

    if (!existsSync(outputDir)) {
        const altPath = resolve(process.cwd(), 'src', 'styles', 'theme', 'lines');
        if (existsSync(altPath)) {
            outputDir = altPath;
        } else {
            outputDir = altPath;
        }
    }

    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    return outputDir;
}

/**
 * Generate all root preset CSS files (subtle.css, balanced.css, etc.)
 */
function generateRootPresetFiles(outputDir: string): void {
    (Object.keys(LINES_PRESETS) as LinesPresetKey[]).forEach(presetKey => {
        const css = generateRootPresetCSS(presetKey);
        const filePath = join(outputDir, `${LINES_PRESETS[presetKey].id}.css`);
        writeFileSync(filePath, css, 'utf-8');
        console.log(`✓ Generated lines preset: ${LINES_PRESETS[presetKey].id}.css`);
    });
}

/**
 * Generate all shape type CSS files under theme/lines/{shapeType}
 * for each lines preset.
 */
function generateShapeLinesFiles(outputDir: string): void {
    const allShapeTypes = Array.from(
        new Set([
            ...Object.keys(GENERIC_TYPES),
            ...Object.keys(DETAILED_TYPES)
        ])
    );

    allShapeTypes.forEach(shapeType => {
        const shapeDir = join(outputDir, shapeType);
        if (!existsSync(shapeDir)) {
            mkdirSync(shapeDir, { recursive: true });
        }

        (Object.keys(LINES_PRESETS) as LinesPresetKey[]).forEach(presetKey => {
            const css = generateShapeTypeLinesCSS(shapeType, presetKey);
            const filePath = join(shapeDir, `${LINES_PRESETS[presetKey].id}.css`);
            writeFileSync(filePath, css, 'utf-8');
            console.log(`✓ Generated lines: ${shapeType}/${LINES_PRESETS[presetKey].id}.css`);
        });
    });
}

/**
 * Main generator function
 */
function generateAllLinesFiles(): void {
    const outputDir = ensureOutputDir();

    console.log('Generating lines (border) CSS files...');
    console.log(`Output directory: ${outputDir}\n`);

    // Root presets
    console.log('Generating lines presets...');
    generateRootPresetFiles(outputDir);

    // Shape-specific combinations
    console.log('\nGenerating shape-specific lines...');
    generateShapeLinesFiles(outputDir);

    console.log('\n✓ All lines CSS files generated successfully!');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('lines-generator')) {
    generateAllLinesFiles();
}

export {
    generateAllLinesFiles,
    generateRootPresetCSS,
    generateShapeTypeLinesCSS,
    LINES_PRESETS,
    LINE_COLORS,
    LINE_STYLES,
    LINE_THICKNESSES
};


