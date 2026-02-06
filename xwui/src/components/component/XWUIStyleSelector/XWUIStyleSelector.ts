/**
 * XWUIStyleSelector Component
 * Dynamically generates form fields based on styles.schema.json
 * Loads options from styles.data.json
 * Automatically applies changes to XWUIStyle
 */

import { XWUIComponent, XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Types for schema and data
interface SchemaProperty {
    type: string;
    description?: string;
    enum?: string[];
    default?: any;
    properties?: Record<string, SchemaProperty>;
    allOf?: Array<{ $ref?: string } | SchemaProperty>;
}

interface StyleSchema {
    $schema?: string;
    title?: string;
    type?: string;
    description?: string;
    properties?: Record<string, SchemaProperty>;
    $defs?: Record<string, SchemaProperty>;
}

interface StyleData {
    [category: string]: Record<string, {
        id: string;
        title: string;
        folder: string;
        description: string;
        default?: boolean;
        colorShades?: {
            primary?: string;
            secondary?: string;
            text?: string;
            hover?: string;
            light?: string;
        };
        requiresGlassUtilities?: boolean;
    }>;
}

export interface XWUIStyleSelectorConfig {
    basePath?: string;
    schemaPath?: string;
    dataPath?: string;
    showLabels?: boolean;
    showBrand?: boolean;
    showStyle?: boolean;
    showColor?: boolean;
    showAccent?: boolean;
    showLines?: boolean;
    showRoundness?: boolean;
    showGlow?: boolean;
    showFont?: boolean;
    showIcons?: boolean;
    showIconsColors?: boolean;
    showEmojis?: boolean;
    styleInstance?: any; // Reference to XWUIStyle instance
}

export interface XWUIStyleSelectorData {
    id?: string; // Component ID for cookie storage - should match XWUIStyle ID (e.g., "xwui-style-testers")
    selectedPreset?: string; // Store the selected preset (synced with XWUIStyle)
    selectedValues?: Record<string, string>; // Store selected dropdown values
    targetValues?: Record<string, string>; // Store target select values for nested properties
}

// Theme category type
type ThemeCategory = 'brand' | 'style' | 'color' | 'accent' | 'lines' | 'roundness' | 'glow' | 'font' | 'icons' | 'icons_colors' | 'emojis';

// Nested theme config structure
interface NestedThemeConfig {
    brand?: string;
    style?: string;
    color?: string;
    accent?: string;
    lines?: {
        preset?: string;
        [shape: string]: string | undefined;
    };
    roundness?: {
        preset?: string;
        [shape: string]: string | undefined;
    };
    glow?: {
        preset?: string;
        [shape: string]: string | undefined;
    };
    font?: {
        preset?: string;
        [shape: string]: string | undefined;
    };
    icons?: string;
    icons_colors?: string;
    emojis?: string;
}

export class XWUIStyleSelector extends XWUIComponent<XWUIStyleSelectorData, XWUIStyleSelectorConfig> {
    private styleSchema: StyleSchema | null = null;
    private styleData: StyleData | null = null;
    private dropdowns: Map<string, HTMLElement> = new Map();
    private selectedValues: Map<string, string> = new Map(); // Internal Map for selected values
    private styleInstance: any; // Reference to XWUIStyle instance
    private schemaDefs: Record<string, SchemaProperty> = {};
    private applyThemeDebounceTimer: number | null = null; // Debounce timer for applyTheme

    constructor(
        container: HTMLElement,
        data: XWUIStyleSelectorData = {},
        conf_comp?: XWUIStyleSelectorConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Enable cookies in config
        const configWithCookies = { ...conf_comp, cookies: true };
        super(container, data, configWithCookies, conf_sys, conf_usr);
        
        this.styleInstance = this.config.styleInstance;
        
        // Initialize selectedValues from data
        if (this.data.selectedValues) {
            for (const [key, value] of Object.entries(this.data.selectedValues)) {
                this.selectedValues.set(key, value);
            }
        }
        
        // Initialize asynchronously
        this.initialize();
    }
    
    /**
     * Save current selections to data (called when selections change)
     */
    private syncSelectionsToData(): void {
        const values: Record<string, string> = {};
        this.selectedValues.forEach((value, key) => {
            values[key] = value;
        });
        
        const targets: Record<string, string> = {};
        this.dropdowns.forEach((dropdown, key) => {
            if (dropdown instanceof HTMLSelectElement && key.endsWith('.target')) {
                targets[key] = dropdown.value;
            }
        });
        
        this.updateData({ 
            selectedValues: values,
            targetValues: targets
        });
    }
    
    /**
     * Called when data is reloaded from storage (cross-tab sync)
     */
    protected onDataReloaded(): void {
        // Reload selections from data
        if (this.data.selectedValues) {
            this.selectedValues.clear();
            for (const [key, value] of Object.entries(this.data.selectedValues)) {
                this.selectedValues.set(key, value);
            }
        }
        
        // Reload target values
        if (this.data.targetValues) {
            for (const [key, value] of Object.entries(this.data.targetValues)) {
                const targetSelect = this.dropdowns.get(key) as HTMLSelectElement;
                if (targetSelect) {
                    targetSelect.value = value;
                }
            }
        }
        
        // Update UI
        this.updateAllDropdowns();
        
        // If we have a style instance, sync with it
        if (this.styleInstance) {
            // Check if preset changed and update style instance
            const preset = this.styleInstance.getPreset();
            const savedPreset = this.data.selectedPreset || (this.styleInstance.data as any)?.preset;
            
            if (savedPreset && savedPreset !== preset) {
                // Preset changed, update style instance
                this.styleInstance.setPreset(savedPreset).then(() => {
                    // After preset is set, apply theme if custom
                    const newPreset = this.styleInstance?.getPreset();
                    if (newPreset === 'custom') {
                        void this.applyTheme();
                    }
                });
            } else if (preset === 'custom') {
                // Apply theme if preset is custom
                void this.applyTheme();
            }
        }
    }
    

    /**
     * Initialize component asynchronously
     */
    private async initialize(): Promise<void> {
        try {
            // Load schema and data
            await this.loadSchemaAndData();
            
            // Wait longer for style instance to finish loading cookies/preset if it exists
            // This ensures data from cookies is fully loaded before we try to restore selections
            if (this.styleInstance) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            // Setup DOM
            this.setupDOM();
            
            // Load initial selections (async to handle preset changes)
            await this.loadInitialSelections();
            
            // Update dropdowns
            this.updateAllDropdowns();
            
            // Listen for style changes from other components (same-page sync)
            window.addEventListener('xwui-style-changed', ((event: CustomEvent) => {
                if (event.detail?.theme && this.styleInstance) {
                    // Reload selections from the updated theme
                    this.loadSelectionsFromTheme(event.detail.theme);
                    this.updateAllDropdowns();
                    
                    // Sync preset if it changed
                    if (event.detail?.preset) {
                        const currentPreset = this.styleInstance.getPreset();
                        if (event.detail.preset !== currentPreset) {
                            this.styleInstance.setPreset(event.detail.preset);
                        }
                        // Update our data to keep in sync
                        this.updateData({ selectedPreset: event.detail.preset });
                    }
                }
            }) as EventListener);
        } catch (error) {
            console.error('Error initializing XWUIStyleSelector:', error);
            this.container.innerHTML = `<div class="error">Failed to load style selector: ${error}</div>`;
        }
    }

    /**
     * Load schema and data JSON files
     */
    private async loadSchemaAndData(): Promise<void> {
        const basePath = this.config.basePath || this.detectBasePath();
        const schemaPath = this.config.schemaPath || `${basePath}/styles.schema.json`;
        const dataPath = this.config.dataPath || `${basePath}/styles.data.json`;

        try {
            // Simple path resolution - Vite handles serving files correctly
            // In dev: serves from src/, in production: files are copied to dist/src/styles/
            const resolvePath = (path: string): string => {
                // If it's already an absolute URL, use as-is
                if (path.startsWith('http://') || path.startsWith('https://')) {
                    return path;
                }
                
                // For relative paths, resolve relative to current page
                // Vite dev server serves from src/, production serves from dist/
                // Both will have the files at the correct location
                try {
                    return new URL(path, window.location.href).href;
                } catch {
                    // If URL resolution fails, return path as-is (might be a server-relative path)
                    return path;
                }
            };

            // Load schema
            const schemaUrl = resolvePath(schemaPath);
            const schemaResponse = await fetch(schemaUrl);
            if (!schemaResponse.ok) {
                console.error(`Failed to load schema from: ${schemaPath} -> ${schemaUrl} (status: ${schemaResponse.status} ${schemaResponse.statusText})`);
                console.error(`Current page path: ${window.location.pathname}`);
                console.error(`Tried paths: ${schemaPath}`);
                throw new Error(`Failed to load schema from ${schemaPath} (resolved to: ${schemaUrl}): ${schemaResponse.statusText}`);
            }
            this.styleSchema = await schemaResponse.json();
            
            // Store schema definitions
            if (this.styleSchema && this.styleSchema.$defs) {
                this.schemaDefs = this.styleSchema.$defs;
            }

            // Load data
            const dataUrl = resolvePath(dataPath);
            const dataResponse = await fetch(dataUrl);
            if (!dataResponse.ok) {
                console.error(`Failed to load data from: ${dataPath} -> ${dataUrl} (status: ${dataResponse.status} ${dataResponse.statusText})`);
                throw new Error(`Failed to load data from ${dataPath} (resolved to: ${dataUrl}): ${dataResponse.statusText}`);
            }
            this.styleData = await dataResponse.json();
        } catch (error) {
            console.error('Error loading schema/data:', error);
            throw error;
        }
    }

    /**
     * Detect base path
     */
    private detectBasePath(): string {
        // First, check the current page location - this is more reliable than script tags
        const currentPath = window.location.pathname;
        
        // If we're accessing a file from src/ in the URL, we're in dev mode
        if (currentPath.includes('/src/')) {
            // Extract the base URL and ensure we point to src/styles
            const pathParts = currentPath.split('/src/');
            if (pathParts.length > 1) {
                // We're in src/, so styles are at src/styles relative to the project root
                // For relative resolution, go up from current location to project root, then to src/styles
                // Calculate relative depth: count how many directories deep we are
                const depth = (pathParts[1].match(/\//g) || []).length;
                // Go up to project root, then down to src/styles
                return '../'.repeat(depth) + 'styles';
            }
        }
        
        // If we're accessing from dist/, we're in production mode
        if (currentPath.includes('/dist/')) {
            // In production, styles JSON files should be at dist/src/styles
            const pathParts = currentPath.split('/dist/');
            if (pathParts.length > 1) {
                const depth = (pathParts[1].match(/\//g) || []).length;
                // Go up to dist root, then to src/styles
                return '../'.repeat(depth) + 'src/styles';
            }
            return 'src/styles';
        }
        
        // Fallback: check script tags
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src && src.includes('/src/') && !src.includes('/dist/')) {
                // Dev mode - files are in src/
                const match = src.match(/(.*\/)src\//);
                if (match) {
                    // Check if this is a module script (type="module")
                    // In Vite dev mode, module scripts are served directly from src
                    return '../../../styles'; // Relative from typical component location
                }
            }
        }
        
        // Default fallback for development
        return '../../../styles';
    }

    /**
     * Get options for a category from data
     */
    private getOptionsForCategory(category: string): Array<{ id: string; title: string; description: string; default?: boolean; colorShades?: any }> {
        if (!this.styleData || !this.styleData[category]) {
            return [];
        }
        
        const categoryData = this.styleData[category];
        return Object.values(categoryData).map(option => ({
            id: option.id,
            title: option.title,
            description: option.description,
            default: option.default,
            colorShades: option.colorShades
        }));
    }

    /**
     * Get enum values from schema property
     */
    private getEnumFromSchema(property: SchemaProperty): string[] {
        if (property.enum) {
            return property.enum;
        }
        
        // Check allOf for $ref
        if (property.allOf) {
            for (const item of property.allOf) {
                if (item && typeof item === 'object') {
                    const refItem = item as { $ref?: string };
                    if (refItem.$ref) {
                        const refName = refItem.$ref.replace('#/$defs/', '');
                        const def = this.schemaDefs[refName];
                        if (def && def.enum) {
                            return def.enum;
                        }
                    }
                }
            }
        }
        
        return [];
    }

    /**
     * Get property from schema
     */
    private getSchemaProperty(path: string): SchemaProperty | null {
        if (!this.styleSchema || !this.styleSchema.properties) {
            return null;
        }

        const parts = path.split('.');
        let current: any = this.styleSchema.properties;

        for (const part of parts) {
            if (current[part]) {
                current = current[part];
                // If it's an allOf with $ref, resolve it
                if (current.allOf) {
                    for (const item of current.allOf) {
                        if (item && typeof item === 'object') {
                            const refItem = item as { $ref?: string };
                            if (refItem.$ref) {
                                const refName = refItem.$ref.replace('#/$defs/', '');
                                const def = this.schemaDefs[refName];
                                if (def) {
                                    current = def;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                return null;
            }
        }

        return current;
    }


    /**
     * Load initial selections from current theme or config
     * Dynamically processes all properties from schema
     */
    private async loadInitialSelections(): Promise<void> {
        // Load target values from data (if available) - from cookies
        if (this.data.targetValues) {
            for (const [key, value] of Object.entries(this.data.targetValues)) {
                const targetSelect = this.dropdowns.get(key) as HTMLSelectElement;
                if (targetSelect) {
                    targetSelect.value = value;
                }
            }
        }
        
        // Load saved selections from cookies into the Map FIRST
        // This ensures saved data from cookies is restored
        if (this.data.selectedValues && Object.keys(this.data.selectedValues).length > 0) {
            for (const [key, value] of Object.entries(this.data.selectedValues)) {
                this.selectedValues.set(key, value);
            }
        }
        
        // Check if we have saved selections in data
        const hasSavedData = this.data.selectedValues && Object.keys(this.data.selectedValues).length > 0;
        
        // Get preset from style instance or data
        // Wait a bit more if style instance exists to ensure it has loaded its data
        let preset = this.styleInstance?.getPreset?.() || this.data.selectedPreset || 'system';
        if (this.styleInstance && !preset) {
            // Give style instance a moment to load data from cookies
            await new Promise(resolve => setTimeout(resolve, 100));
            preset = this.styleInstance.getPreset() || this.data.selectedPreset || 'system';
        }
        
        // If we have saved data, prioritize it over theme
        // Only load from theme if we don't have saved data
        const shouldLoadFromTheme = !hasSavedData;
        
        // If we have saved data and preset is 'custom', ensure preset is set and apply theme
        if (hasSavedData && this.styleInstance) {
            // Ensure preset is set to custom first (if not already)
            const currentPreset = this.styleInstance.getPreset();
            if (preset === 'custom' && currentPreset !== 'custom') {
                // Set preset to custom first
                await this.styleInstance.setPreset('custom');
            }
            
            // If we have saved selections and preset is custom, apply them to the theme
            if (preset === 'custom' && hasSavedData) {
                // Apply the saved selections to restore the custom theme
                await this.applyTheme();
            }
        }
        
        // Also sync preset to our data if style instance has a different preset
        if (this.styleInstance) {
            const stylePreset = this.styleInstance.getPreset();
            if (stylePreset && stylePreset !== this.data.selectedPreset) {
                this.updateData({ selectedPreset: stylePreset });
                preset = stylePreset;
            } else if (preset && preset !== this.data.selectedPreset) {
                // If we have a preset from data but style instance doesn't match, update it
                this.updateData({ selectedPreset: preset });
            }
        }
        
        // Try to get from XWUIStyle instance if available
        if (this.styleInstance && typeof this.styleInstance.getTheme === 'function') {
            const theme = this.styleInstance.getTheme();
            if (shouldLoadFromTheme) {
                // Only load from theme if we don't have saved data
                this.loadSelectionsFromTheme(theme);
            }
            // Update dropdowns to reflect current state (either from saved data or theme)
            this.updateAllDropdowns();
            return;
        }
        
        // Dynamically load from data attributes based on schema properties
        if (!this.styleSchema || !this.styleSchema.properties) {
            return;
        }
        
        const root = document.documentElement;
        
        // Process each property in schema
        for (const [key, property] of Object.entries(this.styleSchema.properties)) {
            // Handle nested properties (lines, roundness, glow, font) with two-dropdown layout
            if (property.type === 'object' && property.properties) {
                const targetSelect = this.dropdowns.get(`${key}.target`) as HTMLSelectElement;
                const valueKey = `${key}.value`;
                
                if (targetSelect) {
                    // Check if target was loaded from cookies (it should be set already)
                    // If not, load from data attributes
                    if (targetSelect.value === '' || targetSelect.value === 'preset') {
                        // Only set if not already loaded from cookies
                        if (!this.selectedValues.has(valueKey)) {
                            // Check for preset value
                            const presetValue = root.getAttribute(`data-${key}`) || '';
                            if (presetValue) {
                                targetSelect.value = 'preset';
                                this.selectedValues.set(valueKey, presetValue);
                            } else {
                                // Check if all shapes have the same value
                                const shapeValues: Record<string, string> = {};
                                let allSame = true;
                                let firstValue: string | null = null;
                                
                                for (const [subKey] of Object.entries(property.properties)) {
                                    if (subKey === 'preset') continue;
                                    const shapeAttrName = `data-${key}-${subKey}`;
                                    const shapeValue = root.getAttribute(shapeAttrName) || '';
                                    if (shapeValue) {
                                        shapeValues[subKey] = shapeValue;
                                        if (firstValue === null) {
                                            firstValue = shapeValue;
                                        } else if (firstValue !== shapeValue) {
                                            allSame = false;
                                        }
                                    }
                                }
                                
                                if (allSame && firstValue) {
                                    targetSelect.value = 'all';
                                    this.selectedValues.set(valueKey, firstValue);
                                } else if (Object.keys(shapeValues).length > 0) {
                                    // Use first shape found
                                    const firstShape = Object.keys(shapeValues)[0];
                                    targetSelect.value = firstShape;
                                    this.selectedValues.set(valueKey, shapeValues[firstShape]);
                                }
                            }
                        }
                    }
                }
            } else {
                // For simple properties, check data attribute
                // Only set if not already loaded from cookies
                if (!this.selectedValues.has(key)) {
                    // Map 'color' to 'data-theme' for backward compatibility
                    const attrName = key === 'color' ? 'data-theme' : `data-${key}`;
                    const value = root.getAttribute(attrName) || '';
                    if (value) {
                        this.selectedValues.set(key, value);
                    }
                }
            }
        }
        
        // Update all dropdowns after loading
        this.updateAllDropdowns();
    }

    /**
     * Load selections from theme config (handles nested structure)
     * Dynamically processes theme object based on schema
     */
    private loadSelectionsFromTheme(theme: any): void {
        if (!this.styleSchema || !this.styleSchema.properties) {
            return;
        }
        
        // Helper to check if all shapes have the same value
        const checkIfAllShapesSame = (category: string, valueObj: any): string | null => {
            if (typeof valueObj !== 'object' || valueObj === null) return null;
            
            const shapes: string[] = [];
            if (this.styleSchema?.properties?.[category]?.properties) {
                for (const [subKey] of Object.entries(this.styleSchema.properties[category].properties!)) {
                    if (subKey !== 'preset') {
                        shapes.push(subKey);
                    }
                }
            }
            
            if (shapes.length === 0) return null;
            
            const firstShape = shapes.find(shape => valueObj[shape]);
            if (!firstShape) return null;
            
            const firstValue = valueObj[firstShape];
            const allSame = shapes.every(shape => valueObj[shape] === firstValue);
            
            return allSame ? firstValue : null;
        };
        
        // Process each property in schema
        for (const [key, property] of Object.entries(this.styleSchema.properties)) {
            const themeValue = theme[key];
            
            if (themeValue !== undefined && themeValue !== null) {
                // Handle nested properties (lines, roundness, glow, font) with two-dropdown layout
                if (property.type === 'object' && property.properties && property.properties.preset) {
                    const targetSelect = this.dropdowns.get(`${key}.target`) as HTMLSelectElement;
                    const valueKey = `${key}.value`;
                    
                    if (targetSelect) {
                        if (typeof themeValue === 'string') {
                            // Simple string value - set to preset
                            targetSelect.value = 'preset';
                            this.selectedValues.set(valueKey, themeValue);
                        } else if (typeof themeValue === 'object' && themeValue !== null) {
                            // Check if all shapes have the same value
                            const allSameValue = checkIfAllShapesSame(key, themeValue);
                            if (allSameValue) {
                                targetSelect.value = 'all';
                                this.selectedValues.set(valueKey, allSameValue);
                            } else if (themeValue.preset) {
                                targetSelect.value = 'preset';
                                this.selectedValues.set(valueKey, themeValue.preset);
                            } else {
                                // Find first shape override
                                const shapes: string[] = [];
                                if (property.properties) {
                                    for (const [subKey] of Object.entries(property.properties)) {
                                        if (subKey !== 'preset') {
                                            shapes.push(subKey);
                                        }
                                    }
                                }
                                const firstShape = shapes.find(shape => themeValue[shape]);
                                if (firstShape) {
                                    targetSelect.value = firstShape;
                                    this.selectedValues.set(valueKey, themeValue[firstShape]);
                                }
                            }
                        }
                    }
                } else {
                    // Simple property
                    if (typeof themeValue === 'string') {
                        this.selectedValues.set(key, themeValue);
                    }
                }
            }
        }
        
        // Update all dropdowns after loading
        this.updateAllDropdowns();
    }

    /**
     * Setup DOM structure based on schema
     * Groups properties into pairs on the same row
     */
    private setupDOM(): void {
        if (!this.styleSchema || !this.styleSchema.properties) {
            return;
        }

        this.container.innerHTML = '';
        this.container.className = 'xwui-style-selector-container';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-style-selector-wrapper';
        
        const properties = this.styleSchema.properties;
        
        // Define the layout: pairs of properties to display on the same row
        const layoutPairs: Array<[string, string?]> = [
            ['brand', 'style'],           // Line 1: Brand | Visual Style
            ['color', 'accent'],          // Line 2: Color Theme | Accent Color
            ['lines'],                    // Line 3: Border Lines (Component | Style)
            ['roundness'],                // Line 4: Border Radius (Component | Style)
            ['glow'],                     // Line 5: Glow Effects (Component | Style)
            ['font'],                     // Line 6: Typography (Component | Style)
            ['icons', 'icons_colors'],    // Line 6: Icon Set | Icon Colors
            ['emojis']                    // Line 7: Emoji Set
        ];
        
        // Process each pair
        for (const [key1, key2] of layoutPairs) {
            const row = document.createElement('div');
            row.className = 'xwui-style-selector-row';
            row.style.display = 'flex';
            row.style.gap = 'var(--spacing-md, 1rem)';
            row.style.marginBottom = 'var(--spacing-md, 1rem)';
            row.style.alignItems = 'flex-start';
            
            // Process first property in pair
            if (properties[key1]) {
                const property1 = properties[key1];
                const showKey1 = `show${key1.charAt(0).toUpperCase() + key1.slice(1)}` as keyof XWUIStyleSelectorConfig;
                
                if (this.config[showKey1] !== false) {
                    const item1 = this.createPropertyItem(key1, property1);
                    if (item1) {
                        item1.style.flex = key2 ? '1' : '1';
                        row.appendChild(item1);
                    }
                }
            }
            
            // Process second property in pair (if exists)
            if (key2 && properties[key2]) {
                const property2 = properties[key2];
                const showKey2 = `show${key2.charAt(0).toUpperCase() + key2.slice(1)}` as keyof XWUIStyleSelectorConfig;
                
                if (this.config[showKey2] !== false) {
                    const item2 = this.createPropertyItem(key2, property2);
                    if (item2) {
                        item2.style.flex = '1';
                        row.appendChild(item2);
                    }
                }
            }
            
            if (row.children.length > 0) {
                wrapper.appendChild(row);
            }
        }
        
        this.container.appendChild(wrapper);
    }
    
    /**
     * Create a property item (dropdown or two-dropdown layout)
     */
    private createPropertyItem(key: string, property: SchemaProperty): HTMLElement | null {
        // Handle nested properties (lines, roundness, glow, font) with two-dropdown layout
        if (property.type === 'object' && property.properties) {
            // Create container for nested property
            const container = document.createElement('div');
            container.className = 'xwui-style-selector-property-item';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = 'var(--spacing-xs, 0.25rem)';
            
            // Create label
            const label = document.createElement('label');
            label.className = 'xwui-style-selector-label';
            label.textContent = this.getLabel(key);
            label.style.fontSize = 'var(--font-size-sm, 0.875rem)';
            label.style.fontWeight = 'var(--font-weight-medium, 500)';
            label.style.color = 'var(--text-secondary, #6c757d)';
            label.style.marginBottom = 'var(--spacing-xs, 0.25rem)';
            container.appendChild(label);
            
            // Create two-dropdown layout: Component selector + Style selector
            const twoDropdownContainer = document.createElement('div');
            twoDropdownContainer.style.display = 'flex';
            twoDropdownContainer.style.gap = 'var(--spacing-sm, 0.5rem)';
            twoDropdownContainer.style.alignItems = 'flex-start';
            
            // Create Component selector dropdown (Preset, ALL, or specific component)
            const targetContainer = document.createElement('div');
            targetContainer.style.flex = '0 0 200px';
            const targetSelect = document.createElement('select');
            targetSelect.className = 'xwui-style-selector-target-select';
            targetSelect.setAttribute('data-category', key);
            targetSelect.style.width = '100%';
            targetSelect.style.padding = 'var(--spacing-sm, 0.625rem) var(--spacing-sm, 0.875rem)';
            targetSelect.style.border = 'var(--border-input-width, var(--border-width-regular, 1.5px)) var(--border-input-style, solid) var(--border-input-color, var(--control-border, #dee2e6))';
            targetSelect.style.borderRadius = 'var(--radius-input, var(--radius-sm, 0.375rem))';
            targetSelect.style.background = 'var(--control-bg, #ffffff)';
            targetSelect.style.color = 'var(--control-text, #212529)';
            targetSelect.style.fontSize = 'var(--font-size-sm, 0.875rem)';
            targetSelect.style.cursor = 'pointer';
            
            // Add options: Preset, ALL, then all shapes
            const presetOption = document.createElement('option');
            presetOption.value = 'preset';
            presetOption.textContent = 'Preset';
            presetOption.selected = true;
            targetSelect.appendChild(presetOption);
            
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'ALL';
            targetSelect.appendChild(allOption);
            
            // Add shape options
            for (const [subKey] of Object.entries(property.properties)) {
                if (subKey === 'preset') continue;
                const shapeOption = document.createElement('option');
                shapeOption.value = subKey;
                shapeOption.textContent = this.getShapeLabel(key, subKey) || (subKey.charAt(0).toUpperCase() + subKey.slice(1));
                targetSelect.appendChild(shapeOption);
            }
            
            // Add accessibility attributes
            targetSelect.setAttribute('aria-label', `Select ${key} component (preset, all components, or specific component)`);
            targetSelect.setAttribute('title', `Select ${key} component`);
            
            targetContainer.appendChild(targetSelect);
            twoDropdownContainer.appendChild(targetContainer);
            
            // Create searchable Style dropdown
            const valueKey = `${key}.value`;
            const valueDropdown = this.createSearchableDropdown(key, `Select ${key} style...`, 'value');
            valueDropdown.style.flex = '1';
            valueDropdown.style.minWidth = '0';
            this.dropdowns.set(valueKey, valueDropdown);
            twoDropdownContainer.appendChild(valueDropdown);
            
            // Store target select reference
            this.dropdowns.set(`${key}.target`, targetSelect);
            
            // Initialize value dropdown with options
            this.populateOptions(valueKey);
            
            // Add change handler for target select
            targetSelect.addEventListener('change', () => {
                const currentValue = this.selectedValues.get(valueKey);
                
                if (currentValue) {
                    this.updateDropdownDisplay(valueKey);
                }
                
                if (currentValue) {
                    void this.applyTheme();
                    // Sync to data (automatically saves to cookies via base class)
                    this.syncSelectionsToData();
                }
            });
            
            container.appendChild(twoDropdownContainer);
            return container;
        } else {
            // Simple property - create dropdown with label
            const container = document.createElement('div');
            container.className = 'xwui-style-selector-property-item';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = 'var(--spacing-xs, 0.25rem)';
            
            // Create label
            const label = document.createElement('label');
            label.className = 'xwui-style-selector-label';
            label.textContent = this.getLabel(key);
            label.style.fontSize = 'var(--font-size-sm, 0.875rem)';
            label.style.fontWeight = 'var(--font-weight-medium, 500)';
            label.style.color = 'var(--text-secondary, #6c757d)';
            label.style.marginBottom = 'var(--spacing-xs, 0.25rem)';
            container.appendChild(label);
            
            // Create searchable dropdown
            const dropdown = this.createSearchableDropdown(key, this.getLabel(key));
            this.dropdowns.set(key, dropdown);
            container.appendChild(dropdown);
            
            return container;
        }
    }
    
    /**
     * Get label for a shape within a category
     */
    private getShapeLabel(category: string, shape: string): string {
        // Try to get from schema property description
        if (this.styleSchema && this.styleSchema.properties && this.styleSchema.properties[category]) {
            const categoryProperty = this.styleSchema.properties[category];
            if (categoryProperty.properties && categoryProperty.properties[shape]) {
                const shapeProperty = categoryProperty.properties[shape];
                if (shapeProperty.description) {
                    return shapeProperty.description;
                }
            }
        }
        
        // Fallback: capitalize first letter
        return shape.charAt(0).toUpperCase() + shape.slice(1);
    }

    /**
     * Get label for a category from schema or fallback to capitalized name
     */
    private getLabel(category: string): string {
        // Try to get from schema description
        if (this.styleSchema && this.styleSchema.properties && this.styleSchema.properties[category]) {
            const property = this.styleSchema.properties[category];
            if (property.description) {
                // Use the description from schema
                return property.description;
            }
        }
        
        // Fallback: capitalize first letter
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    /**
     * Create a searchable dropdown element
     */
    private createSearchableDropdown(category: string, placeholder: string, subKey?: string): HTMLElement {
        const dropdown = document.createElement('div');
        const fullKey = subKey ? `${category}.${subKey}` : category;
        dropdown.className = `xwui-style-selector-dropdown xwui-style-selector-dropdown-${category}`;
        dropdown.setAttribute('data-category', fullKey);
        
        const selected = document.createElement('div');
        selected.className = 'xwui-style-selector-selected';
        selected.setAttribute('tabindex', '0');
        
        const selectedText = document.createElement('span');
        selectedText.className = 'xwui-style-selector-selected-text';
        selectedText.textContent = placeholder;
        selected.appendChild(selectedText);
        
        const arrow = document.createElement('span');
        arrow.className = 'xwui-style-selector-arrow';
        arrow.innerHTML = '▼';
        selected.appendChild(arrow);
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'xwui-style-selector-search-container';
        searchContainer.style.display = 'none';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'xwui-style-selector-search';
        searchInput.placeholder = 'Search...';
        const searchId = `search-${fullKey.replace(/\./g, '-')}`;
        searchInput.setAttribute('id', searchId);
        searchInput.setAttribute('name', searchId);
        searchInput.setAttribute('aria-label', `Search ${category} options`);
        searchContainer.appendChild(searchInput);
        
        const optionsList = document.createElement('div');
        optionsList.className = 'xwui-style-selector-options';
        searchContainer.appendChild(optionsList);
        
        dropdown.appendChild(selected);
        dropdown.appendChild(searchContainer);
        
        // Event listeners
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(fullKey);
        });
        
        selected.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleDropdown(fullKey);
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value.toLowerCase();
            this.filterOptions(fullKey, query);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown(fullKey);
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target as Node)) {
                this.closeDropdown(fullKey);
            }
        });
        
        return dropdown;
    }

    /**
     * Toggle dropdown open/closed
     */
    private toggleDropdown(key: string): void {
        const dropdown = this.dropdowns.get(key);
        if (!dropdown) return;
        
        const searchContainer = dropdown.querySelector('.xwui-style-selector-search-container') as HTMLElement;
        const isOpen = searchContainer.style.display !== 'none';
        
        // Close all dropdowns first
        this.closeAllDropdowns();
        
        if (!isOpen) {
            searchContainer.style.display = 'block';
            dropdown.classList.add('open');
            const searchInput = dropdown.querySelector('.xwui-style-selector-search') as HTMLInputElement;
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            this.populateOptions(key);
        }
    }

    /**
     * Close dropdown
     */
    private closeDropdown(key: string): void {
        const dropdown = this.dropdowns.get(key);
        if (!dropdown) return;
        
        // Skip HTMLSelectElement items (target selects) - they don't have search containers
        if (dropdown instanceof HTMLSelectElement) {
            return;
        }
        
        const searchContainer = dropdown.querySelector('.xwui-style-selector-search-container') as HTMLElement;
        if (!searchContainer) return; // Safety check
        
        searchContainer.style.display = 'none';
        dropdown.classList.remove('open');
        const searchInput = dropdown.querySelector('.xwui-style-selector-search') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = '';
        }
    }

    /**
     * Close all dropdowns
     */
    private closeAllDropdowns(): void {
        this.dropdowns.forEach((dropdown, key) => {
            // Skip target select elements (HTMLSelectElement) - they're not searchable dropdowns
            if (dropdown instanceof HTMLSelectElement) {
                return;
            }
            this.closeDropdown(key);
        });
    }

    /**
     * Populate options in dropdown
     */
    private populateOptions(key: string): void {
        const dropdown = this.dropdowns.get(key);
        if (!dropdown) return;
        
        const optionsList = dropdown.querySelector('.xwui-style-selector-options') as HTMLElement;
        const [category, subKey] = key.split('.');
        
        // Handle value dropdown for nested properties
        if (subKey === 'value') {
            // Get options from data for the category
            const options = this.getOptionsForCategory(category);
            
            optionsList.innerHTML = '';
            
            if (options.length === 0) {
                const noOptions = document.createElement('div');
                noOptions.className = 'xwui-style-selector-option xwui-style-selector-option-empty';
                noOptions.textContent = 'No options available';
                optionsList.appendChild(noOptions);
                return;
            }
            
            options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.className = 'xwui-style-selector-option';
                // For lines/roundness/glow, show title - description, for font just title
                if (category === 'font') {
                    optionElement.textContent = option.title;
                } else {
                    optionElement.textContent = `${option.title} - ${option.description}`;
                }
                optionElement.setAttribute('data-value', option.id);
                
                // Add color swatch if available
                if (option.colorShades?.primary) {
                    const swatch = document.createElement('span');
                    swatch.className = 'xwui-style-selector-swatch';
                    swatch.style.backgroundColor = option.colorShades.primary;
                    optionElement.insertBefore(swatch, optionElement.firstChild);
                }
                
                if (this.selectedValues.get(key) === option.id) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.addEventListener('click', () => {
                    this.selectOption(key, option.id);
                });
                
                optionsList.appendChild(optionElement);
            });
            return;
        }
        
        // Original logic for other dropdowns
        // Get options from data
        const options = this.getOptionsForCategory(category);
        
        optionsList.innerHTML = '';
        
        if (options.length === 0) {
            const noOptions = document.createElement('div');
            noOptions.className = 'xwui-style-selector-option xwui-style-selector-option-empty';
            noOptions.textContent = 'No options available';
            optionsList.appendChild(noOptions);
            return;
        }
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'xwui-style-selector-option';
            optionElement.textContent = option.title;
            optionElement.setAttribute('data-value', option.id);
            
            // Add color swatch if available
            if (option.colorShades?.primary) {
                const swatch = document.createElement('span');
                swatch.className = 'xwui-style-selector-swatch';
                swatch.style.backgroundColor = option.colorShades.primary;
                optionElement.insertBefore(swatch, optionElement.firstChild);
            }
            
            if (this.selectedValues.get(key) === option.id) {
                optionElement.classList.add('selected');
            }
            
            optionElement.addEventListener('click', () => {
                this.selectOption(key, option.id);
            });
            
            optionsList.appendChild(optionElement);
        });
    }

    /**
     * Filter options based on search query
     */
    private filterOptions(key: string, query: string): void {
        const dropdown = this.dropdowns.get(key);
        if (!dropdown) return;
        
        const optionsList = dropdown.querySelector('.xwui-style-selector-options') as HTMLElement;
        const options = optionsList.querySelectorAll('.xwui-style-selector-option');
        
        options.forEach(option => {
            const text = option.textContent?.toLowerCase() || '';
            const value = option.getAttribute('data-value')?.toLowerCase() || '';
            const matches = text.includes(query) || value.includes(query);
            (option as HTMLElement).style.display = matches ? 'block' : 'none';
        });
    }

    /**
     * Select an option
     */
    private selectOption(key: string, value: string): void {
        this.selectedValues.set(key, value);
        this.updateDropdownDisplay(key);
        this.closeDropdown(key);
        void this.applyTheme();
        // Sync to data (automatically saves to cookies via base class)
        this.syncSelectionsToData();
    }

    /**
     * Update dropdown display
     */
    private updateDropdownDisplay(key: string): void {
        const dropdown = this.dropdowns.get(key);
        if (!dropdown) return;
        
        const selectedText = dropdown.querySelector('.xwui-style-selector-selected-text') as HTMLElement;
        if (!selectedText) return;
        
        const parts = key.split('.');
        const category = parts[0];
        const subKey = parts[1]; // For nested properties like "lines.button" or "lines.value"
        
        // Handle value dropdown for nested properties
        if (subKey === 'value') {
            const options = this.getOptionsForCategory(category);
            const value = this.selectedValues.get(key);
            const option = options.find(opt => opt.id === value);
            
            if (option) {
                if (category === 'font') {
                    selectedText.textContent = option.title;
                } else {
                    selectedText.textContent = `${option.title} - ${option.description}`;
                }
                dropdown.classList.add('has-selection');
            } else {
                selectedText.textContent = `Select ${category}...`;
                dropdown.classList.remove('has-selection');
            }
            return;
        }
        
        // Original logic for other dropdowns
        const options = this.getOptionsForCategory(category);
        const value = this.selectedValues.get(key);
        const option = options.find(opt => opt.id === value);
        
        // Get appropriate label - use shape label for nested properties
        let label: string;
        if (subKey) {
            label = this.getShapeLabel(category, subKey);
        } else {
            label = this.getLabel(category);
        }
        
        if (option) {
            selectedText.textContent = this.config.showLabels && !subKey ? `${label}: ${option.title}` : option.title;
            dropdown.classList.add('has-selection');
        } else {
            selectedText.textContent = label;
            dropdown.classList.remove('has-selection');
        }
    }

    /**
     * Update all dropdowns
     */
    private updateAllDropdowns(): void {
        this.dropdowns.forEach((dropdown, key) => {
            // Only update searchable dropdowns, not target select elements
            if (dropdown instanceof HTMLSelectElement) {
                return; // Skip target select elements
            }
            this.updateDropdownDisplay(key);
        });
    }

    /**
     * Apply theme changes
     * Dynamically builds theme config based on schema properties
     * Debounced to prevent lag when making rapid changes
     */
    private async applyTheme(): Promise<void> {
        // Clear existing debounce timer
        if (this.applyThemeDebounceTimer !== null) {
            clearTimeout(this.applyThemeDebounceTimer);
        }
        
        // Set new debounce timer (100ms delay)
        this.applyThemeDebounceTimer = window.setTimeout(async () => {
            // Build theme config from selected values
            const themeConfig: any = {};
            
            if (!this.styleSchema || !this.styleSchema.properties) {
                this.applyThemeDebounceTimer = null;
                return;
            }
        
            // Process each property in schema
            for (const [key, property] of Object.entries(this.styleSchema.properties)) {
            // Handle nested properties (lines, roundness, glow, font) with two-dropdown layout
            if (property.type === 'object' && property.properties) {
                const targetSelect = this.dropdowns.get(`${key}.target`) as HTMLSelectElement;
                const valueKey = `${key}.value`;
                const value = this.selectedValues.get(valueKey);
                
                if (!targetSelect || !value) {
                    continue;
                }
                
                const target = targetSelect.value;
                
                if (target === 'preset') {
                    // Simple string value for preset
                    themeConfig[key] = value;
                } else if (target === 'all') {
                    // Set all shapes to the same value
                    const nestedConfig: any = { preset: value };
                    // Get all shapes from schema
                    for (const [subKey] of Object.entries(property.properties)) {
                        if (subKey !== 'preset') {
                            nestedConfig[subKey] = value;
                        }
                    }
                    themeConfig[key] = nestedConfig;
                } else {
                    // Object with shape override
                    const nestedConfig: any = {};
                    // Try to preserve existing preset if available
                    const currentTheme = this.styleInstance?.getTheme?.() || {};
                    const currentValue = currentTheme[key];
                    if (typeof currentValue === 'object' && currentValue !== null && currentValue.preset) {
                        nestedConfig.preset = currentValue.preset;
                    }
                    nestedConfig[target] = value;
                    themeConfig[key] = nestedConfig;
                }
            } else {
                // Simple property
                const value = this.selectedValues.get(key);
                if (value) {
                    themeConfig[key] = value;
                }
            }
        }
        
        // Update via XWUIStyle instance if available
        if (this.styleInstance && typeof this.styleInstance.updateTheme === 'function') {
            // Ensure preset is set to 'custom' when making manual changes
            const currentPreset = this.styleInstance.getPreset();
            if (currentPreset !== 'custom') {
                // Set preset to custom first, then apply theme changes
                await this.styleInstance.setPreset('custom');
            }
            // Apply selections to theme (preset is now 'custom')
            this.styleInstance.updateTheme(themeConfig);
            // Sync selections to data (automatically saves to cookies via base class)
            this.syncSelectionsToData();
        } else {
            // Fallback: update data attributes directly
            const root = document.documentElement;
            for (const [key, value] of Object.entries(themeConfig)) {
                const property = this.styleSchema.properties![key];
                
                if (property && property.type === 'object' && property.properties) {
                    // Nested property - set all nested values
                    if (value && typeof value === 'object') {
                        const nestedValue = value as Record<string, string>;
                        // Set preset if exists
                        if (nestedValue.preset) {
                            root.setAttribute(`data-${key}`, nestedValue.preset);
                        }
                        // Set shape-specific values
                        for (const [subKey, subValue] of Object.entries(nestedValue)) {
                            if (subKey !== 'preset' && subValue) {
                                root.setAttribute(`data-${key}-${subKey}`, subValue);
                            }
                        }
                    }
                } else {
                    // Simple property
                    // Map 'color' to 'data-theme' for backward compatibility
                    const attrName = key === 'color' ? 'data-theme' : `data-${key}`;
                    root.setAttribute(attrName, String(value));
                }
            }
        }
        
        this.applyThemeDebounceTimer = null; // Clear timer after execution
        }, 100); // 100ms debounce delay
    }

    /**
     * Get current selections
     * Dynamically builds config based on schema properties
     */
    public getSelections(): any {
        const config: any = {};
        
        if (!this.styleSchema || !this.styleSchema.properties) {
            return config;
        }
        
        // Process each property in schema
        for (const [key, property] of Object.entries(this.styleSchema.properties)) {
            // Handle nested properties (lines, roundness, glow, font)
            if (property.type === 'object' && property.properties) {
                const nestedConfig: any = {};
                let hasNestedValues = false;
                
                // Collect all nested values (preset + shape-specific)
                for (const [subKey] of Object.entries(property.properties)) {
                    const fullKey = `${key}.${subKey}`;
                    const value = this.selectedValues.get(fullKey);
                    if (value) {
                        nestedConfig[subKey] = value;
                        hasNestedValues = true;
                    }
                }
                
                if (hasNestedValues) {
                    config[key] = nestedConfig;
                }
            } else {
                // Simple property
                const value = this.selectedValues.get(key);
                if (value) {
                    config[key] = value;
                }
            }
        }
        
        return config;
    }

    /**
     * Set selections programmatically
     * Dynamically processes selections based on schema
     */
    public setSelections(selections: any): void {
        if (!this.styleSchema || !this.styleSchema.properties) {
            return;
        }
        
        // Process each property in schema
        for (const [key, property] of Object.entries(this.styleSchema.properties)) {
            const selectionValue = selections[key];
            
            if (selectionValue !== undefined && selectionValue !== null) {
                // Handle nested properties (lines, roundness, glow, font)
                if (property.type === 'object' && property.properties) {
                    if (typeof selectionValue === 'string') {
                        // String value - treat as preset
                        if (property.properties.preset) {
                            this.selectedValues.set(`${key}.preset`, selectionValue);
                        }
                    } else if (selectionValue && typeof selectionValue === 'object') {
                        // Object with nested properties - set all shape-specific values
                        for (const [subKey, subValue] of Object.entries(selectionValue)) {
                            if (typeof subValue === 'string' && property.properties[subKey]) {
                                this.selectedValues.set(`${key}.${subKey}`, subValue);
                            }
                        }
                    }
                } else {
                    // Simple property
                    if (typeof selectionValue === 'string') {
                        this.selectedValues.set(key, selectionValue);
                    }
                }
            }
        }
        
        this.updateAllDropdowns();
        void this.applyTheme();
        // Sync to data (automatically saves to cookies via base class)
        this.syncSelectionsToData();
    }

    /**
     * Set XWUIStyle instance
     */
    public setStyleInstance(styleInstance: any): void {
        this.styleInstance = styleInstance;
    }

    /**
     * Create config from component config
     */
    protected createConfig(
        conf_comp?: XWUIStyleSelectorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIStyleSelectorConfig {
        return {
            basePath: conf_comp?.basePath,
            schemaPath: conf_comp?.schemaPath,
            dataPath: conf_comp?.dataPath,
            showLabels: conf_comp?.showLabels ?? true,
            showBrand: conf_comp?.showBrand ?? true,
            showStyle: conf_comp?.showStyle ?? true,
            showColor: conf_comp?.showColor ?? true,
            showAccent: conf_comp?.showAccent ?? true,
            showLines: conf_comp?.showLines ?? true,
            showRoundness: conf_comp?.showRoundness ?? true,
            showGlow: conf_comp?.showGlow ?? true,
            showFont: conf_comp?.showFont ?? true,
            showIcons: conf_comp?.showIcons ?? true,
            showIconsColors: conf_comp?.showIconsColors ?? true,
            showEmojis: conf_comp?.showEmojis ?? true,
            styleInstance: conf_comp?.styleInstance
        };
    }


    /**
     * Destroy component
     */
    public destroy(): void {
        this.closeAllDropdowns();
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIStyleSelector as any).componentName = 'XWUIStyleSelector';