/**
 * Styles Schema Generator
 * Generates comprehensive styles.schema.json by scanning file/folder structure
 * Uses $ref for reusability and includes shape-specific options for lines, roundness, glow, and typography
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, type Dirent } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface JSONSchema {
    $schema: string;
    title: string;
    type: string;
    description?: string;
    properties: Record<string, any>;
    $defs?: Record<string, any>;
    required?: string[];
}

interface CategoryConfig {
    name: string;
    path: string[];
    scanType: 'folders' | 'files' | 'files-and-folders' | 'folders-with-subfiles';
    description: string;
    defaultKey?: string;
}

interface ShapeBasedCategoryConfig extends CategoryConfig {
    scanType: 'folders-with-subfiles';
    presetRef: string;
    presetDescription: string;
    shapeDescriptionTemplate: string;
    defaultPresetValue?: string;
}

/**
 * List all folders in a directory
 */
function list_folders(dirPath: string): string[] {
    if (!existsSync(dirPath)) return [];
    
    const entries = readdirSync(dirPath, { withFileTypes: true }) as Dirent[];
    return entries
        .filter((entry: Dirent) => entry.isDirectory())
        .map((entry: Dirent) => entry.name)
        .sort();
}

/**
 * List all CSS files in a directory (excluding subdirectories)
 */
function list_files(dirPath: string): string[] {
    if (!existsSync(dirPath)) return [];
    
    const entries = readdirSync(dirPath, { withFileTypes: true }) as Dirent[];
    return entries
        .filter((entry: Dirent) => entry.isFile() && entry.name.endsWith('.css'))
        .map((entry: Dirent) => basename(entry.name, '.css'))
        .sort();
}

/**
 * Generate enum schema from array of values
 */
function generateEnumSchema(
    values: string[], 
    description: string, 
    defaultValue?: string
): any {
    return {
        type: 'string',
        description: description,
        enum: values,
        default: defaultValue || values[0],
        examples: values.slice(0, 3)
    };
}

/**
 * Generate schema based on files
 */
function generate_based_on_files(
    stylesPath: string,
    config: CategoryConfig,
    defaultValue?: string
): any {
    const fullPath = join(stylesPath, ...config.path);
    const files = list_files(fullPath);
    return generateEnumSchema(files, config.description, defaultValue);
}

/**
 * Generate schema based on folders
 */
function generate_based_on_folders(
    stylesPath: string,
    config: CategoryConfig,
    defaultValue?: string
): any {
    const fullPath = join(stylesPath, ...config.path);
    const folders = list_folders(fullPath);
    return generateEnumSchema(folders, config.description, defaultValue);
}

/**
 * Generate schema based on files and folders
 */
function generate_based_on_files_and_folders(
    stylesPath: string,
    config: CategoryConfig,
    defaultValue?: string
): any {
    const fullPath = join(stylesPath, ...config.path);
    
    if (!existsSync(fullPath)) return generateEnumSchema([], config.description, defaultValue);
    
    const entries = readdirSync(fullPath, { withFileTypes: true }) as Dirent[];
    const items = entries
        .map((entry: Dirent) => {
            if (entry.isFile() && entry.name.endsWith('.css')) {
                return basename(entry.name, '.css');
            } else if (entry.isDirectory()) {
                return entry.name;
            }
            return null;
        })
        .filter((name): name is string => name !== null)
        .sort();
    
    return generateEnumSchema(items, config.description, defaultValue);
}

/**
 * Generate schema based on folders with subfiles (for lines/roundness/glow/typography)
 * ✅ OPTIMIZED: Cache directory reads
 */
function generate_based_on_folders_with_subfiles(
    stylesPath: string,
    config: ShapeBasedCategoryConfig,
    defaultValue?: string
): any {
    const fullPath = join(stylesPath, ...config.path);
    
    // ✅ OPTIMIZED: Single directory read cached
    if (!existsSync(fullPath)) {
        return {
            type: 'object',
            description: config.description,
            properties: {
                preset: {
                    allOf: [
                        { $ref: `#/$defs/${config.presetRef}` },
                        { description: config.presetDescription }
                    ]
                }
            },
            default: {
                preset: defaultValue || config.defaultPresetValue || 'default'
            }
        };
    }
    
    // Get root preset files
    const rootPresets = list_files(fullPath);
    
    // Get all shape folders
    const shapeFolders = list_folders(fullPath);
    
    // ✅ OPTIMIZED: Build shape properties efficiently
    const shapeProperties: Record<string, any> = {};
    
    shapeFolders.forEach(shape => {
        const shapePath = join(fullPath, shape);
        // Only check if directory exists (already verified by list_folders)
        const presets = list_files(shapePath);
        
        if (presets.length > 0) {
            shapeProperties[shape] = {
                allOf: [
                    { $ref: `#/$defs/${config.presetRef}` },
                    { description: config.shapeDescriptionTemplate.replace('{shape}', shape) }
                ]
            };
        }
    });
    
    // Determine default preset value
    const defaultPreset = defaultValue || 
        config.defaultPresetValue ||
        (rootPresets.includes('balanced') ? 'balanced' : 
         rootPresets.includes('rounded') ? 'rounded' : 
         rootPresets[0]);
    
    return {
        type: 'object',
        description: config.description,
        properties: {
            preset: {
                allOf: [
                    { $ref: `#/$defs/${config.presetRef}` },
                    { description: config.presetDescription }
                ]
            },
            ...shapeProperties
        },
        default: {
            preset: defaultPreset
        }
    };
}

/**
 * Get default value from styles.data.json for a category
 */
function getDefaultFromData(
    data: any,
    categoryName: string
): string | undefined {
    const category = data[categoryName];
    if (!category) return undefined;
    
    const defaultOption = Object.values(category).find(
        (opt: any) => opt.default === true
    );
    return defaultOption ? (defaultOption as any).id : undefined;
}

/**
 * Generate complete styles schema by scanning file structure
 */
function generateStylesSchema(stylesPath: string): JSONSchema {
    // Category configurations - single source of truth
    const categoryConfigs: (CategoryConfig | ShapeBasedCategoryConfig)[] = [
        {
            name: 'brand',
            path: ['brand'],
            scanType: 'folders',
            description: 'Brand identity (logos, colors, etc.)',
            defaultKey: 'brand'
        },
        {
            name: 'style',
            path: ['style'],
            scanType: 'folders',
            description: 'Visual style system (shadows, spacing, etc.)',
            defaultKey: 'style'
        },
        {
            name: 'color',
            path: ['theme', 'colors'],
            scanType: 'files',
            description: 'Color theme (light, dark, etc.)',
            defaultKey: 'color'
        },
        {
            name: 'accent',
            path: ['theme', 'accents'],
            scanType: 'files',
            description: 'Accent color palette',
            defaultKey: 'accent'
        },
        {
            name: 'lines',
            path: ['theme', 'lines'],
            scanType: 'folders-with-subfiles',
            description: 'Border lines configuration with global preset and shape-specific overrides',
            presetRef: 'linesPreset',
            presetDescription: 'Global lines preset (applies to all shapes unless overridden)',
            shapeDescriptionTemplate: 'Lines preset for {shape} component (overrides global preset)',
            defaultKey: 'lines',
            defaultPresetValue: 'balanced'
        },
        {
            name: 'roundness',
            path: ['theme', 'roundness'],
            scanType: 'folders-with-subfiles',
            description: 'Border radius configuration with global preset and shape-specific overrides',
            presetRef: 'roundnessPreset',
            presetDescription: 'Global roundness preset (applies to all shapes unless overridden)',
            shapeDescriptionTemplate: 'Roundness preset for {shape} component (overrides global preset)',
            defaultKey: 'roundness',
            defaultPresetValue: 'rounded'
        },
        {
            name: 'glow',
            path: ['theme', 'glow'],
            scanType: 'folders-with-subfiles',
            description: 'Glow effects configuration with global preset and component-specific overrides',
            presetRef: 'glowPreset',
            presetDescription: 'Global glow preset (applies to all components unless overridden)',
            shapeDescriptionTemplate: 'Glow preset for {shape} component (overrides global preset)',
            defaultKey: 'glow',
            defaultPresetValue: 'none'
        },
        {
            name: 'font',
            path: ['theme', 'typography'],
            scanType: 'folders-with-subfiles',
            description: 'Typography font family configuration with global preset and shape-specific overrides',
            presetRef: 'fontPreset',
            presetDescription: 'Global font preset (applies to all shapes unless overridden)',
            shapeDescriptionTemplate: 'Font preset for {shape} component (overrides global preset)',
            defaultKey: 'font',
            defaultPresetValue: 'inter'
        },
        {
            name: 'icons',
            path: ['theme', 'icons'],
            scanType: 'files-and-folders',
            description: 'Icon set',
            defaultKey: 'icons'
        },
        {
            name: 'icons_colors',
            path: ['theme', 'icons_colors'],
            scanType: 'files-and-folders',
            description: 'Icon colors',
            defaultKey: 'icons_colors'
        },
        {
            name: 'emojis',
            path: ['theme', 'emojis'],
            scanType: 'files-and-folders',
            description: 'Emoji set',
            defaultKey: 'emojis'
        }
    ];
    
    // Load defaults from styles.data.json if available
    let defaults: Record<string, string> = {};
    const dataPath = join(stylesPath, 'styles.data.json');
    if (existsSync(dataPath)) {
        try {
            const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
            categoryConfigs.forEach(config => {
                if (config.defaultKey) {
                    const defaultValue = getDefaultFromData(data, config.defaultKey);
                    if (defaultValue) {
                        defaults[config.name] = defaultValue;
                    }
                }
            });
        } catch (e) {
            // Ignore errors, use fallback defaults
        }
    }
    
    // Generate schema properties for each category
    const properties: Record<string, any> = {};
    
    categoryConfigs.forEach(config => {
        const defaultValue = defaults[config.name];
        
        switch (config.scanType) {
            case 'folders':
                properties[config.name] = generate_based_on_folders(
                    stylesPath,
                    config,
                    defaultValue
                );
                break;
                
            case 'files':
                properties[config.name] = generate_based_on_files(
                    stylesPath,
                    config,
                    defaultValue
                );
                break;
                
            case 'files-and-folders':
                properties[config.name] = generate_based_on_files_and_folders(
                    stylesPath,
                    config,
                    defaultValue
                );
                break;
                
            case 'folders-with-subfiles':
                const shapeConfig = config as ShapeBasedCategoryConfig;
                properties[config.name] = generate_based_on_folders_with_subfiles(
                    stylesPath,
                    shapeConfig,
                    defaultValue
                );
                break;
        }
    });
    
    // Generate reusable definitions for shape-based categories
    const defs: Record<string, any> = {};
    
    const linesConfig = categoryConfigs.find(c => c.name === 'lines') as ShapeBasedCategoryConfig;
    if (linesConfig) {
        const linesPath = join(stylesPath, ...linesConfig.path);
        defs.linesPreset = generateEnumSchema(
            list_files(linesPath),
            'Lines preset option',
            'balanced'
        );
    }
    
    const roundnessConfig = categoryConfigs.find(c => c.name === 'roundness') as ShapeBasedCategoryConfig;
    if (roundnessConfig) {
        const roundnessPath = join(stylesPath, ...roundnessConfig.path);
        defs.roundnessPreset = generateEnumSchema(
            list_files(roundnessPath),
            'Roundness preset option',
            'rounded'
        );
    }
    
    const glowConfig = categoryConfigs.find(c => c.name === 'glow') as ShapeBasedCategoryConfig;
    if (glowConfig) {
        const glowPath = join(stylesPath, ...glowConfig.path);
        defs.glowPreset = generateEnumSchema(
            list_files(glowPath),
            'Glow preset option',
            'none'
        );
    }
    
    const fontConfig = categoryConfigs.find(c => c.name === 'font') as ShapeBasedCategoryConfig;
    if (fontConfig) {
        const fontPath = join(stylesPath, ...fontConfig.path);
        defs.fontPreset = generateEnumSchema(
            list_files(fontPath),
            'Font preset option',
            'inter'
        );
    }
    
    // Build main schema
    return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'XWUI Styles Configuration Schema',
        type: 'object',
        description: 'Comprehensive schema for XWUI theme configuration. Includes global options and shape-specific overrides for lines, roundness, glow, and typography.',
        properties,
        $defs: defs
    };
}

/**
 * Main function
 */
function main() {
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
    
    const schemaPath = join(stylesPath, 'styles.schema.json');
    
    console.log('Generating comprehensive styles schema...');
    console.log(`Scanning: ${stylesPath}`);
    
    const schema = generateStylesSchema(stylesPath);
    
    // Write schema file
    writeFileSync(
        schemaPath,
        JSON.stringify(schema, null, 2) + '\n',
        'utf-8'
    );
    
    console.log(`✓ Styles schema generated: ${schemaPath}`);
    console.log(`  - Categories: ${Object.keys(schema.properties).length}`);
    
    // Dynamic reporting
    Object.entries(schema.properties).forEach(([name, prop]) => {
        if (prop.type === 'object' && prop.properties) {
            const shapeCount = Object.keys(prop.properties).length - 1;
            console.log(`  - ${name}: ${shapeCount} shapes (plus preset)`);
        } else if (prop.enum) {
            console.log(`  - ${name}: ${prop.enum.length} options`);
        }
    });
    
    console.log(`  - Reusable definitions: ${Object.keys(schema.$defs || {}).length}`);
}

// Run if executed directly
const isMainModule = process.argv[1] && (
    process.argv[1].endsWith('schema-generator.js') ||
    process.argv[1].endsWith('schema-generator.ts') ||
    process.argv[1].includes('schema-generator')
);

if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { 
    generateStylesSchema,
    list_files,
    list_folders,
    generate_based_on_files,
    generate_based_on_folders,
    generate_based_on_files_and_folders,
    generate_based_on_folders_with_subfiles
};
