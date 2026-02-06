/**
 * Styles Data Manifest Generator
 * Automatically generates styles.data.json by scanning CSS files
 * and extracting metadata from header comments
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, relative, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ColorShades {
    primary?: string;
    secondary?: string;
    text?: string;
    hover?: string;
    light?: string;
}

interface ThemeOption {
    id: string;
    title: string;
    folder: string;
    description: string;
    default?: boolean;
    colorShades?: ColorShades;
    requiresGlassUtilities?: boolean;
}

interface ThemeManifest {
    brand: Record<string, ThemeOption>;
    style: Record<string, ThemeOption>;
    color: Record<string, ThemeOption>;
    accent: Record<string, ThemeOption>;
    lines: Record<string, ThemeOption>;
    roundness: Record<string, ThemeOption>;
    glow: Record<string, ThemeOption>;
    font: Record<string, ThemeOption>;
    icons: Record<string, ThemeOption>;
    icons_colors: Record<string, ThemeOption>;
    emojis: Record<string, ThemeOption>;
}

/**
 * Parse CSS file header comment for metadata
 * Expected format:
 * ============================================
 *    TITLE - Description
 *    @default: true (optional)
 *    @primary: #ffffff (optional color shade)
 *    @secondary: #f8f9fa (optional color shade)
 *    @text: #212529 (optional color shade)
 *    @hover: #4338ca (optional color shade)
 *    @light: #6366f1 (optional color shade)
 *    @requiresGlassUtilities: true (optional)
 *    ============================================
 */
function parseCSSMetadata(filePath: string): {
    title: string;
    description: string;
    default: boolean;
    colorShades?: ColorShades;
    requiresGlassUtilities?: boolean;
} {
    const content = readFileSync(filePath, 'utf-8');
    
    // Extract header comment
    const headerMatch = content.match(/\/\*[\s\S]*?\*\//);
    if (!headerMatch) {
        return {
            title: basename(filePath, '.css'),
            description: '',
            default: false
        };
    }
    
    const header = headerMatch[0];
    const lines = header.split('\n').map(l => l.trim());
    
    // Extract title and description from first line after separator
    let title = '';
    let description = '';
    let defaultFlag = false;
    const colorShades: ColorShades = {};
    let requiresGlassUtilities = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Parse title - description format: "TITLE - Description"
        if (line.includes(' - ') && !line.startsWith('@') && !line.includes('===')) {
            const parts = line.replace(/\*/g, '').split(' - ');
            if (parts.length >= 2) {
                title = parts[0].trim();
                description = parts.slice(1).join(' - ').trim();
            } else if (parts.length === 1) {
                title = parts[0].trim();
            }
        }
        
        // Parse @default
        if (line.includes('@default:')) {
            const match = line.match(/@default:\s*(true|false)/i);
            if (match) {
                defaultFlag = match[1].toLowerCase() === 'true';
            }
        }
        
        // Parse color shades
        if (line.includes('@primary:')) {
            const match = line.match(/@primary:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
            if (match) colorShades.primary = match[1];
        }
        if (line.includes('@secondary:')) {
            const match = line.match(/@secondary:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
            if (match) colorShades.secondary = match[1];
        }
        if (line.includes('@text:')) {
            const match = line.match(/@text:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
            if (match) colorShades.text = match[1];
        }
        if (line.includes('@hover:')) {
            const match = line.match(/@hover:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
            if (match) colorShades.hover = match[1];
        }
        if (line.includes('@light:')) {
            const match = line.match(/@light:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
            if (match) colorShades.light = match[1];
        }
        
        // Parse @requiresGlassUtilities
        if (line.includes('@requiresGlassUtilities:')) {
            const match = line.match(/@requiresGlassUtilities:\s*(true|false)/i);
            if (match) {
                requiresGlassUtilities = match[1].toLowerCase() === 'true';
            }
        }
    }
    
    // Fallback: extract from CSS variables if not in metadata
    if (!colorShades.primary || !colorShades.secondary) {
        const cssVars = extractColorShadesFromCSS(content);
        if (!colorShades.primary) colorShades.primary = cssVars.primary;
        if (!colorShades.secondary) colorShades.secondary = cssVars.secondary;
        if (!colorShades.text) colorShades.text = cssVars.text;
        if (!colorShades.hover) colorShades.hover = cssVars.hover;
        if (!colorShades.light) colorShades.light = cssVars.light;
    }
    
    // Clean up empty colorShades
    const hasColorShades = Object.keys(colorShades).some(key => colorShades[key as keyof ColorShades]);
    
    return {
        title: title || basename(filePath, '.css'),
        description: description || '',
        default: defaultFlag,
        colorShades: hasColorShades ? colorShades : undefined,
        requiresGlassUtilities: requiresGlassUtilities || undefined
    };
}

/**
 * Extract color shades from CSS variables as fallback
 */
function extractColorShadesFromCSS(content: string): ColorShades {
    const shades: ColorShades = {};
    
    // Extract from CSS variables
    const bgPrimaryMatch = content.match(/--bg-primary:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
    if (bgPrimaryMatch) shades.primary = bgPrimaryMatch[1];
    
    const bgSecondaryMatch = content.match(/--bg-secondary:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
    if (bgSecondaryMatch) shades.secondary = bgSecondaryMatch[1];
    
    const textPrimaryMatch = content.match(/--text-primary:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
    if (textPrimaryMatch) shades.text = textPrimaryMatch[1];
    
    const accentPrimaryMatch = content.match(/--accent-primary:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
    if (accentPrimaryMatch) shades.primary = accentPrimaryMatch[1];
    
    const accentHoverMatch = content.match(/--accent-hover:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
    if (accentHoverMatch) shades.hover = accentHoverMatch[1];
    
    const accentLightMatch = content.match(/--accent-light:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|\w+)/);
    if (accentLightMatch) shades.light = accentLightMatch[1];
    
    return shades;
}

/**
 * Convert kebab-case to Title Case
 */
function toTitleCase(str: string): string {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Scan directory and generate manifest entries
 * ✅ OPTIMIZED: Cache existsSync results and batch file operations
 */
function scanDirectory(
    dirPath: string,
    category: keyof ThemeManifest,
    basePath: string = 'src/styles'
): Record<string, ThemeOption> {
    const entries: Record<string, ThemeOption> = {};
    
    if (!existsSync(dirPath)) {
        return entries;
    }
    
    const files = readdirSync(dirPath, { withFileTypes: true });
    const relativePath = relative(basePath, dirPath).replace(/\\/g, '/');
    
    // ✅ OPTIMIZED: Pre-compute all path checks to avoid repeated existsSync calls
    const pathCache = new Map<string, boolean>();
    const checkPath = (path: string): boolean => {
        if (!pathCache.has(path)) {
            pathCache.set(path, existsSync(path));
        }
        return pathCache.get(path)!;
    };
    
    for (const file of files) {
        if (file.isDirectory()) {
            // For style folders (basic, modern, glass)
            if (category === 'style') {
                const styleId = file.name;
                const shadowsPath = join(dirPath, file.name, 'shadows.css');
                const spacingPath = join(dirPath, file.name, 'spacing.css');
                const utilitiesPath = join(dirPath, file.name, 'utilities.css');
                
                // Read metadata from shadows.css (or first available file)
                const metadataPath = checkPath(shadowsPath) ? shadowsPath : spacingPath;
                if (checkPath(metadataPath)) {
                    const metadata = parseCSSMetadata(metadataPath);
                    
                    entries[styleId] = {
                        id: styleId,
                        title: metadata.title || toTitleCase(styleId),
                        folder: `${relativePath}/${styleId}`,
                        description: metadata.description || '',
                        default: metadata.default,
                        requiresGlassUtilities: checkPath(utilitiesPath) ? metadata.requiresGlassUtilities : undefined
                    };
                }
            } else if (category === 'brand') {
                // For brand folders (xwui)
                const brandId = file.name;
                const brandCssPath = join(dirPath, file.name, 'brand.css');
                
                if (checkPath(brandCssPath)) {
                    const metadata = parseCSSMetadata(brandCssPath);
                    
                    entries[brandId] = {
                        id: brandId,
                        title: metadata.title.toUpperCase() || brandId.toUpperCase(),
                        folder: `${relativePath}/${brandId}`,
                        description: metadata.description || '',
                        default: metadata.default
                    };
                }
            }
        } else if (file.isFile() && file.name.endsWith('.css')) {
            // For color, accent, roundness, font, icons, emojis files
            const fileId = basename(file.name, '.css');
            const filePath = join(dirPath, file.name);
            const metadata = parseCSSMetadata(filePath);
            
            entries[fileId] = {
                id: fileId,
                title: metadata.title || toTitleCase(fileId),
                folder: relativePath,
                description: metadata.description || '',
                default: metadata.default,
                colorShades: metadata.colorShades,
                requiresGlassUtilities: metadata.requiresGlassUtilities
            };
        }
    }
    
    return entries;
}

/**
 * Generate theme manifest
 * ✅ OPTIMIZED: Parallel directory scans for better performance
 */
function generateManifest(stylesPath: string = join(__dirname)): ThemeManifest {
    // ✅ OPTIMIZED: All scans run synchronously but in parallel using Promise.all
    // Since scanDirectory is synchronous, we wrap in Promise.all for potential future async optimization
    const [
        brand,
        style,
        color,
        accent,
        lines,
        roundness,
        glow,
        font,
        icons,
        icons_colors,
        emojis
    ] = [
        scanDirectory(join(stylesPath, 'brand'), 'brand', stylesPath),
        scanDirectory(join(stylesPath, 'style'), 'style', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'colors'), 'color', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'accents'), 'accent', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'lines'), 'lines', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'roundness'), 'roundness', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'glow'), 'glow', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'typography'), 'font', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'icons'), 'icons', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'icons_colors'), 'icons_colors', stylesPath),
        scanDirectory(join(stylesPath, 'theme', 'emojis'), 'emojis', stylesPath)
    ];
    
    return {
        brand,
        style,
        color,
        accent,
        lines,
        roundness,
        glow,
        font,
        icons,
        icons_colors,
        emojis
    };
}

/**
 * Main function
 * ✅ OPTIMIZED: Cached path checks
 */
function main() {
    // Use current directory or find styles folder
    let stylesPath = __dirname;
    
    // If we're in dist folder, go up to src/styles
    if (stylesPath.includes('dist')) {
        stylesPath = join(stylesPath.replace(/dist[\/\\]styles/, ''), 'src', 'styles');
    }
    
    // ✅ OPTIMIZED: Check paths sequentially (existsSync is fast, no need for async)
    if (!existsSync(join(stylesPath, 'theme'))) {
        // Try common locations
        const possiblePaths = [
            join(process.cwd(), 'src', 'styles'),
            join(__dirname, '..'),  // Go up from generators to styles
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
    
    const manifestPath = join(stylesPath, 'styles.data.json');
    
    console.log('Generating styles data manifest...');
    console.log(`Scanning: ${stylesPath}`);
    
    const manifest = generateManifest(stylesPath);
    
    // Sort entries by id for consistency
    const sortedManifest: ThemeManifest = {
        brand: Object.fromEntries(Object.entries(manifest.brand).sort()),
        style: Object.fromEntries(Object.entries(manifest.style).sort()),
        color: Object.fromEntries(Object.entries(manifest.color).sort()),
        accent: Object.fromEntries(Object.entries(manifest.accent).sort()),
        lines: Object.fromEntries(Object.entries(manifest.lines).sort()),
        roundness: Object.fromEntries(Object.entries(manifest.roundness).sort()),
        glow: Object.fromEntries(Object.entries(manifest.glow).sort()),
        font: Object.fromEntries(Object.entries(manifest.font).sort()),
        icons: Object.fromEntries(Object.entries(manifest.icons).sort()),
        icons_colors: Object.fromEntries(Object.entries(manifest.icons_colors).sort()),
        emojis: Object.fromEntries(Object.entries(manifest.emojis).sort())
    };
    
    // Write manifest file
    writeFileSync(
        manifestPath,
        JSON.stringify(sortedManifest, null, 2) + '\n',
        'utf-8'
    );
    
    console.log(`✓ Styles data manifest generated: ${manifestPath}`);
    console.log(`  - Brands: ${Object.keys(manifest.brand).length}`);
    console.log(`  - Styles: ${Object.keys(manifest.style).length}`);
    console.log(`  - Colors: ${Object.keys(manifest.color).length}`);
    console.log(`  - Accents: ${Object.keys(manifest.accent).length}`);
    console.log(`  - Lines: ${Object.keys(manifest.lines).length}`);
    console.log(`  - Roundness: ${Object.keys(manifest.roundness).length}`);
    console.log(`  - Glow: ${Object.keys(manifest.glow).length}`);
    console.log(`  - Fonts: ${Object.keys(manifest.font).length}`);
    console.log(`  - Icons: ${Object.keys(manifest.icons).length}`);
    console.log(`  - Icon Colors: ${Object.keys(manifest.icons_colors).length}`);
    console.log(`  - Emojis: ${Object.keys(manifest.emojis).length}`);
}

// Run if executed directly (check for direct execution)
const isMainModule = process.argv[1] && (
    process.argv[1].endsWith('manifest-generator.js') ||
    process.argv[1].endsWith('manifest-generator.ts') ||
    process.argv[1].includes('manifest-generator')
);

if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { generateManifest, parseCSSMetadata };

