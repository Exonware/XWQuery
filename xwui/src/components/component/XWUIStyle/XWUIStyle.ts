/**
 * XWUIStyle Component
 * Automatically loads and applies theme CSS files based on configuration
 * Uses styles.data.json and ThemeLoader
 */

import { XWUIComponent, XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { ThemeLoader, ThemeConfig } from '../../../styles/theme-loader';

export interface XWUIStyleConfig {
    basePath?: string;
    preset?: string; // Preset mode: 'system' (auto), 'custom' (manual), or any preset name from presets folder
    brand?: string;
    style?: string;
    color?: string;
    accent?: string;
    lines?: string | { preset?: string; [shape: string]: string | undefined };
    roundness?: string | { preset?: string; [shape: string]: string | undefined };
    glow?: string | { preset?: string; [shape: string]: string | undefined };
    font?: string | { preset?: string; [shape: string]: string | undefined };
    icons?: string;
    icons_colors?: string;
    emojis?: string;
    autoLoad?: boolean; // Automatically load on init
}

export interface XWUIStyleData {
    id?: string; // Component ID for cookie storage (e.g., "xwui-style-testers")
    preset?: string; // Preset mode: 'system' (auto), 'custom' (manual), or any preset name from presets folder
    brand?: string;
    style?: string;
    color?: string;
    accent?: string;
    lines?: string | { preset?: string; [shape: string]: string | undefined };
    roundness?: string | { preset?: string; [shape: string]: string | undefined };
    glow?: string | { preset?: string; [shape: string]: string | undefined };
    font?: string | { preset?: string; [shape: string]: string | undefined };
    icons?: string;
    icons_colors?: string;
    emojis?: string;
    customThemeConfig?: Partial<ThemeConfig>; // Store custom theme selections
}

export class XWUIStyle extends XWUIComponent<XWUIStyleData, XWUIStyleConfig> {
    private themeLoader: ThemeLoader;
    private currentConfig: ThemeConfig = {};
    private isUpdating: boolean = false; // Flag to prevent infinite loops

    constructor(
        container: HTMLElement,
        data: XWUIStyleData = {},
        conf_comp?: XWUIStyleConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Enable cookies in config
        const configWithCookies = { ...conf_comp, cookies: true };
        super(container, data, configWithCookies, conf_sys, conf_usr);
        
        const basePath = this.config.basePath || this.detectBasePath();
        this.themeLoader = new ThemeLoader(basePath);
        
        // Initialize with defaults first (will be updated when manifest loads)
        // Note: Data from cookies is already loaded by base class constructor
        // Start async manifest load immediately
        this.themeLoader.getManifestAsync().then(manifest => {
            // Update config once manifest is loaded
            this.currentConfig = {
                brand: this.getDefaultFromManifest('brand', manifest) as any,
                style: this.getDefaultFromManifest('style', manifest) as any,
                color: this.getDefaultFromManifest('color', manifest) as any,
                accent: this.getDefaultFromManifest('accent', manifest) as any,
                lines: this.getDefaultFromManifest('lines', manifest) as any,
                roundness: this.getDefaultFromManifest('roundness', manifest) as any,
                font: this.getDefaultFromManifest('font', manifest) as any,
                icons: this.getDefaultFromManifest('icons', manifest) as any,
                icons_colors: this.getDefaultFromManifest('icons_colors', manifest) as any,
                emojis: this.getDefaultFromManifest('emojis', manifest) as any
            };
        }).catch(err => {
            console.warn('Failed to load theme manifest, using empty config:', err);
        });
        
        // Initialize with empty config for now (will be updated when manifest loads)
        const emptyManifest = this.themeLoader.getManifest();
        this.currentConfig = {
            brand: this.getDefaultFromManifest('brand', emptyManifest) as any,
            style: this.getDefaultFromManifest('style', emptyManifest) as any,
            color: this.getDefaultFromManifest('color', emptyManifest) as any,
            accent: this.getDefaultFromManifest('accent', emptyManifest) as any,
            lines: this.getDefaultFromManifest('lines', emptyManifest) as any,
            roundness: this.getDefaultFromManifest('roundness', emptyManifest) as any,
            font: this.getDefaultFromManifest('font', emptyManifest) as any,
            icons: this.getDefaultFromManifest('icons', emptyManifest) as any,
            icons_colors: this.getDefaultFromManifest('icons_colors', emptyManifest) as any,
            emojis: this.getDefaultFromManifest('emojis', emptyManifest) as any
        };
        
        // Load preset and merge configurations asynchronously
        // This will use data loaded from cookies (if available)
        this.initializeWithPreset();
        
        // Load customThemeConfig from localStorage after base data is loaded
        this.loadCustomThemeConfigFromStorage();
    }
    
    /**
     * Load customThemeConfig from localStorage (stored separately to avoid cookie size limits)
     */
    private loadCustomThemeConfigFromStorage(): void {
        if (this.storageKey) {
            try {
                const customConfigKey = `${this.storageKey}-customThemeConfig`;
                const saved = localStorage.getItem(customConfigKey);
                if (saved) {
                    this.data.customThemeConfig = JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Failed to load custom theme config from localStorage:', e);
            }
        }
    }
    
    /**
     * Called when data is reloaded from storage (cross-tab sync or same-page sync)
     * This happens when any component with the same ID updates its data
     */
    protected onDataReloaded(): void {
        // Prevent infinite loops - if we're already updating, ignore this call
        if (this.isUpdating) {
            return;
        }
        
        // Reload customThemeConfig from localStorage (large configs stored separately)
        if (this.storageKey) {
            try {
                const customConfigKey = `${this.storageKey}-customThemeConfig`;
                const saved = localStorage.getItem(customConfigKey);
                if (saved) {
                    this.data.customThemeConfig = JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Failed to load custom theme config from localStorage:', e);
            }
        }
        
        // Re-merge configurations with reloaded data
        this.initializeWithPreset();
        
        // Dispatch style-changed event so other components (XWUIStyleSwitch, XWUIStyleSelector) can react
        window.dispatchEvent(new CustomEvent('xwui-style-changed', {
            detail: {
                preset: this.data.preset || this.config.preset || 'system',
                theme: this.currentConfig,
                customTheme: this.getCustomThemeConfig()
            }
        }));
    }
    
    /**
     * Get custom theme config from data
     * Loads from localStorage if not in memory (for large configs)
     */
    private getCustomThemeConfig(): Partial<ThemeConfig> {
        // If in memory, return it
        if (this.data.customThemeConfig && Object.keys(this.data.customThemeConfig).length > 0) {
            return this.data.customThemeConfig;
        }
        
        // Try loading from localStorage (large configs stored separately)
        if (this.storageKey) {
            try {
                const customConfigKey = `${this.storageKey}-customThemeConfig`;
                const saved = localStorage.getItem(customConfigKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Load into memory for future access
                    this.data.customThemeConfig = parsed;
                    return parsed;
                }
            } catch (e) {
                console.warn('Failed to load custom theme config from localStorage:', e);
            }
        }
        
        return {};
    }
    
    /**
     * Set custom theme config in data
     * Stores large customThemeConfig separately in localStorage to avoid cookie size limits
     * Does NOT trigger cookie saves - cookies are handled separately via saveDataToCookies override
     */
    private setCustomThemeConfig(config: Partial<ThemeConfig>): void {
        // Store in memory (but this won't be saved to cookies - see saveDataToCookies override)
        this.data.customThemeConfig = config;
        
        // Store large config separately in localStorage (not cookies)
        if (this.storageKey) {
            try {
                const customConfigKey = `${this.storageKey}-customThemeConfig`;
                localStorage.setItem(customConfigKey, JSON.stringify(config));
            } catch (e) {
                console.warn('Failed to save custom theme config to localStorage:', e);
            }
        }
    }
    
    /**
     * Override saveDataToCookies to exclude large customThemeConfig from cookies
     */
    protected saveDataToCookies(): void {
        if (!this.cookiesEnabled || !this.storageKey || this.isLoadingFromStorage) return;
        
        try {
            // Exclude customThemeConfig from cookies (save it separately in localStorage)
            const { customThemeConfig, ...dataForCookies } = this.data;
            const dataStr = JSON.stringify(dataForCookies);
            
            // Save to cookies (small data only)
            XWUIComponent.setCookie(this.storageKey, dataStr);
            
            // Also save to localStorage for cross-tab sync (without customThemeConfig)
            localStorage.setItem(this.storageKey, dataStr);
            
            // customThemeConfig is already saved separately by setCustomThemeConfig
            
            // Trigger cross-tab sync (fires in other tabs/windows)
            localStorage.setItem(`${this.storageKey}-updated`, Date.now().toString());
            
            // Trigger same-page sync (fires immediately for components on same page)
            const eventName = `xwui-sync-${this.storageKey}`;
            window.dispatchEvent(new Event(eventName));
        } catch (e) {
            console.warn(`Failed to save data for ${this.storageKey}:`, e);
        }
    }
    

    /**
     * Initialize theme with preset (async)
     * Uses data loaded from cookies (if available) to restore previous state
     */
    private async initializeWithPreset(): Promise<void> {
        // Prevent infinite loops - if we're already updating, skip
        if (this.isUpdating) {
            return;
        }
        
        this.isUpdating = true;
        try {
            // Merge configurations - this will use data.preset and data.* properties loaded from cookies
            this.currentConfig = await this.mergeConfigurations();
            
            if (this.config.autoLoad !== false) {
                this.loadTheme();
            }
        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * Detect base path from script tags or current location
     */
    private detectBasePath(): string {
        // Try to detect from script src
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src.includes('/dist/')) {
                const match = src.match(/(.*\/)dist\//);
                if (match) {
                    return match[1] + 'src/styles';
                }
            }
            if (src.includes('/src/')) {
                const match = src.match(/(.*\/)src\//);
                if (match) {
                    return match[1] + 'src/styles';
                }
            }
        }
        
        // Fallback: try to detect from current path
        const path = window.location.pathname;
        if (path.includes('/dist/')) {
            return path.split('/dist/')[0] + '/src/styles';
        }
        if (path.includes('/src/')) {
            return path.split('/src/')[0] + '/src/styles';
        }
        
        // Default fallback
        return 'styles';
    }

    /**
     * Read theme configuration from HTML data attributes
     */
    private readHtmlDataAttributes(): Partial<ThemeConfig> {
        const html = document.documentElement;
        const htmlTheme: Partial<ThemeConfig> = {};
        
        const brand = html.getAttribute('data-brand');
        if (brand) htmlTheme.brand = brand as any;
        
        const style = html.getAttribute('data-style');
        if (style) htmlTheme.style = style as any;
        
        const color = html.getAttribute('data-theme');
        if (color) htmlTheme.color = color as any;
        
        const accent = html.getAttribute('data-accent');
        if (accent) htmlTheme.accent = accent as any;
        
        const roundness = html.getAttribute('data-roundness');
        if (roundness) htmlTheme.roundness = roundness as any;
        
        const glow = html.getAttribute('data-glow');
        if (glow) htmlTheme.glow = glow as any;
        
        const font = html.getAttribute('data-font');
        if (font) htmlTheme.font = font as any;
        
        const lines = html.getAttribute('data-lines');
        if (lines) htmlTheme.lines = lines as any;
        
        const icons = html.getAttribute('data-icons');
        if (icons) htmlTheme.icons = icons as any;
        
        const iconsColors = html.getAttribute('data-icons-colors');
        if (iconsColors) htmlTheme.icons_colors = iconsColors as any;
        
        const emojis = html.getAttribute('data-emojis');
        if (emojis) htmlTheme.emojis = emojis as any;
        
        return htmlTheme;
    }

    /**
     * Get available presets from the presets folder
     */
    public async getAvailablePresets(): Promise<string[]> {
        try {
            const basePath = this.config.basePath || this.detectBasePath();
            const presetsPath = `${basePath}/presets`;
            
            // Handle different path formats
            let fullPath: string;
            if (presetsPath.startsWith('http://') || presetsPath.startsWith('https://')) {
                fullPath = presetsPath;
            } else if (presetsPath.startsWith('/')) {
                fullPath = `${window.location.origin}${presetsPath}`;
            } else if (presetsPath.startsWith('./') || presetsPath.startsWith('../')) {
                const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
                fullPath = new URL(presetsPath, baseUrl).href;
            } else {
                fullPath = `${window.location.origin}/${presetsPath}`;
            }
            
            // Try to fetch a directory listing or index file
            // Since we can't list directories directly via HTTP, we'll try common preset names
            // and also check if there's a manifest or index file
            // Only check for presets that actually exist (light, dark)
            // Other presets like 'auto', 'night', 'day' are optional and may not exist
            const commonPresets = ['light', 'dark'];
            const availablePresets: string[] = [];
            
            // Try to fetch each common preset to see if it exists
            for (const preset of commonPresets) {
                try {
                    const presetPath = `${fullPath}/${preset}.json`;
                    const response = await fetch(presetPath, { method: 'HEAD' });
                    if (response.ok) {
                        availablePresets.push(preset);
                    }
                    // Silently ignore 404s and other non-ok responses - presets are optional
                } catch (e) {
                    // Preset doesn't exist or network error - continue silently
                    // Note: Browser may still log network errors in console, but we don't log them here
                }
            }
            
            // Also try to fetch a presets manifest if it exists
            try {
                const manifestPath = `${fullPath}/presets.json`;
                const manifestResponse = await fetch(manifestPath);
                if (manifestResponse.ok) {
                    const manifest = await manifestResponse.json();
                    if (Array.isArray(manifest)) {
                        availablePresets.push(...manifest);
                    } else if (manifest.presets && Array.isArray(manifest.presets)) {
                        availablePresets.push(...manifest.presets);
                    }
                }
            } catch (e) {
                // No manifest file, that's okay
            }
            
            // Remove duplicates and sort
            return [...new Set(availablePresets)].sort();
        } catch (error) {
            console.warn('Error getting available presets:', error);
            // Return default presets if we can't determine
            return ['light', 'dark'];
        }
    }

    /**
     * Load preset configuration from JSON file
     */
    private async loadPreset(presetName: string): Promise<Partial<ThemeConfig> | null> {
        try {
            const basePath = this.config.basePath || this.detectBasePath();
            const presetPath = `${basePath}/presets/${presetName}.json`;
            
            // Handle different path formats
            let fullPath: string;
            if (presetPath.startsWith('http://') || presetPath.startsWith('https://')) {
                fullPath = presetPath;
            } else if (presetPath.startsWith('/')) {
                fullPath = `${window.location.origin}${presetPath}`;
            } else if (presetPath.startsWith('./') || presetPath.startsWith('../')) {
                const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
                fullPath = new URL(presetPath, baseUrl).href;
            } else {
                fullPath = `${window.location.origin}/${presetPath}`;
            }
            
            const response = await fetch(fullPath);
            if (!response.ok) {
                console.warn(`Failed to load preset ${presetName}:`, response.statusText);
                return null;
            }
            
            const preset = await response.json();
            return preset as Partial<ThemeConfig>;
        } catch (error) {
            // Silently fail for missing preset files (404s are expected if presets don't exist)
            if (error instanceof Error && error.message.includes('404')) {
                // Don't log 404 errors for presets - they're optional
                return null;
            }
            console.warn(`Error loading preset ${presetName}:`, error);
            return null;
        }
    }

    /**
     * Get system preset based on user's system preference
     * Returns the preset name that matches the system preference
     */
    private async getSystemPreset(): Promise<string> {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Check if dark preset exists
            const availablePresets = await this.getAvailablePresets();
            if (availablePresets.includes('dark')) {
                return 'dark';
            }
            // Fallback to first available preset or 'light'
            return availablePresets.length > 0 ? availablePresets[0] : 'light';
        }
        // Check if light preset exists
        const availablePresets = await this.getAvailablePresets();
        if (availablePresets.includes('light')) {
            return 'light';
        }
        // Fallback to first available preset or 'dark'
        return availablePresets.length > 0 ? availablePresets[0] : 'dark';
    }

    /**
     * Merge configurations in priority order: data > conf_comp > conf_usr > conf_sys > preset > HTML data attributes > defaults
     * All values are validated against the manifest before being used
     */
    private async mergeConfigurations(): Promise<ThemeConfig> {
        // Ensure manifest is loaded before validation
        const manifest = await this.themeLoader.getManifestAsync();
        
        // Get defaults from manifest (use type assertion since we know manifest structure)
        const defaults: ThemeConfig = {
            brand: this.getDefaultFromManifest('brand', manifest) as any,
            style: this.getDefaultFromManifest('style', manifest) as any,
            color: this.getDefaultFromManifest('color', manifest) as any,
            accent: this.getDefaultFromManifest('accent', manifest) as any,
            lines: this.getDefaultFromManifest('lines', manifest) as any,
            roundness: this.getDefaultFromManifest('roundness', manifest) as any,
            glow: this.getDefaultFromManifest('glow', manifest) as any,
            font: this.getDefaultFromManifest('font', manifest) as any,
            icons: this.getDefaultFromManifest('icons', manifest) as any,
            icons_colors: this.getDefaultFromManifest('icons_colors', manifest) as any,
            emojis: this.getDefaultFromManifest('emojis', manifest) as any
        };
        
        // Read HTML data attributes
        const htmlTheme = this.readHtmlDataAttributes();
        const validatedHtmlTheme = await this.validateThemeConfig(htmlTheme);
        
        // Determine preset mode
        const presetMode = this.data.preset || this.config.preset || 'system';
        let presetTheme: Partial<ThemeConfig> = {};
        
        if (presetMode !== 'custom' && presetMode !== 'system') {
            // Load preset from JSON file
            const preset = await this.loadPreset(presetMode);
            if (preset) {
                presetTheme = await this.validateThemeConfig(preset);
            }
        } else if (presetMode === 'system') {
            // System mode: detect OS preference and use corresponding preset
            const systemPresetName = await this.getSystemPreset();
            const preset = await this.loadPreset(systemPresetName);
            if (preset) {
                presetTheme = await this.validateThemeConfig(preset);
            }
        }
        
        // Merge conf_sys (if it has theme settings)
        const sysTheme = (this.conf_sys as any)?.theme as ThemeConfig | undefined;
        const validatedSysTheme = sysTheme ? await this.validateThemeConfig(sysTheme) : {};
        
        // Merge conf_usr (if it has theme settings)
        const usrTheme = (this.conf_usr as any)?.theme as ThemeConfig | undefined;
        const validatedUsrTheme = usrTheme ? await this.validateThemeConfig(usrTheme) : {};
        
        // Merge conf_comp (validate all values) - only if preset is 'custom'
        const compTheme: Partial<ThemeConfig> = presetMode === 'custom' ? {
            brand: this.config.brand as any,
            style: this.config.style as any,
            color: this.config.color as any,
            accent: this.config.accent as any,
            lines: this.config.lines as any,
            roundness: this.config.roundness as any,
            glow: this.config.glow as any,
            font: this.config.font as any,
            icons: this.config.icons as any,
            icons_colors: this.config.icons_colors as any,
            emojis: this.config.emojis as any
        } : {};
        const validatedCompTheme = await this.validateThemeConfig(compTheme);
        
        // Merge data (highest priority - user override, validate all values) - only if preset is 'custom'
        const dataTheme: Partial<ThemeConfig> = presetMode === 'custom' ? {
            brand: this.data.brand as any,
            style: this.data.style as any,
            color: this.data.color as any,
            accent: this.data.accent as any,
            lines: this.data.lines as any,
            roundness: this.data.roundness as any,
            glow: this.data.glow as any,
            font: this.data.font as any,
            icons: this.data.icons as any,
            icons_colors: this.data.icons_colors as any,
            emojis: this.data.emojis as any
        } : {};
        const validatedDataTheme = await this.validateThemeConfig(dataTheme);
        
        // Merge customThemeConfig if preset is 'custom' (highest priority)
        const customThemeConfig = presetMode === 'custom' ? this.getCustomThemeConfig() : {};
        const validatedCustomTheme = await this.validateThemeConfig(customThemeConfig);
        
        // Merge in priority order: customThemeConfig > data > conf_comp > conf_usr > conf_sys > preset > HTML data attributes > defaults
        return {
            ...defaults,
            ...validatedHtmlTheme,
            ...presetTheme,
            ...validatedSysTheme,
            ...validatedUsrTheme,
            ...validatedCompTheme,
            ...validatedDataTheme,
            ...validatedCustomTheme
        };
    }

    /**
     * Get default value from manifest for a category
     */
    private getDefaultFromManifest(
        category: keyof ThemeConfig,
        manifest: any
    ): any {
        const options = manifest[category];
        if (!options) return undefined;
        
        for (const key in options) {
            if (options[key]?.default) {
                return key;
            }
        }
        
        // Fallback to first option
        const keys = Object.keys(options);
        return keys[0] || undefined;
    }

    /**
     * Validate that a value exists in the manifest for a given category
     */
    private async validateOption(category: keyof ThemeConfig, value: string | undefined): Promise<string | undefined> {
        if (!value) return undefined;
        
        const manifest = await this.themeLoader.getManifestAsync();
        const options = manifest[category];
        if (!options) return undefined;
        
        // Check if value exists in manifest
        if (options[value]) {
            return value;
        }
        
        console.warn(`Invalid ${category} value "${value}". Using default instead.`);
        return this.getDefaultFromManifest(category, manifest);
    }

    /**
     * Validate all theme configuration values against manifest
     */
    private async validateThemeConfig(config: Partial<ThemeConfig>): Promise<Partial<ThemeConfig>> {
        const validated: Partial<ThemeConfig> = {};
        
        if (config.brand !== undefined) {
            validated.brand = await this.validateOption('brand', config.brand as string) as any;
        }
        if (config.style !== undefined) {
            validated.style = await this.validateOption('style', config.style as string) as any;
        }
        if (config.color !== undefined) {
            validated.color = await this.validateOption('color', config.color as string) as any;
        }
        if (config.accent !== undefined) {
            validated.accent = await this.validateOption('accent', config.accent as string) as any;
        }
        if (config.icons !== undefined) {
            validated.icons = await this.validateOption('icons', config.icons as string) as any;
        }
        if (config.icons_colors !== undefined) {
            validated.icons_colors = await this.validateOption('icons_colors', config.icons_colors as string) as any;
        }
        if (config.emojis !== undefined) {
            validated.emojis = await this.validateOption('emojis', config.emojis as string) as any;
        }
        
        // Handle nested properties (lines, roundness, font)
        if (config.lines !== undefined) {
            if (typeof config.lines === 'string') {
                validated.lines = await this.validateOption('lines', config.lines) as any;
            } else if (typeof config.lines === 'object' && config.lines !== null) {
                const linesObj: any = {};
                if (config.lines.preset) {
                    linesObj.preset = await this.validateOption('lines', config.lines.preset as string);
                }
                // Validate shape-specific overrides
                const manifest = await this.themeLoader.getManifestAsync();
                const linesOptions = manifest.lines;
                for (const key in config.lines) {
                    if (key !== 'preset') {
                        const value = config.lines[key];
                        if (value && typeof value === 'string' && linesOptions[value]) {
                            linesObj[key] = await this.validateOption('lines', value);
                        }
                    }
                }
                validated.lines = linesObj;
            }
        }
        
        if (config.roundness !== undefined) {
            if (typeof config.roundness === 'string') {
                validated.roundness = await this.validateOption('roundness', config.roundness) as any;
            } else if (typeof config.roundness === 'object' && config.roundness !== null) {
                const roundnessObj: any = {};
                if (config.roundness.preset) {
                    roundnessObj.preset = await this.validateOption('roundness', config.roundness.preset as string);
                }
                // Validate shape-specific overrides
                const manifest = await this.themeLoader.getManifestAsync();
                const roundnessOptions = manifest.roundness;
                for (const key in config.roundness) {
                    if (key !== 'preset') {
                        const value = config.roundness[key];
                        if (value && typeof value === 'string' && roundnessOptions[value]) {
                            roundnessObj[key] = await this.validateOption('roundness', value);
                        }
                    }
                }
                validated.roundness = roundnessObj;
            }
        }
        
        if (config.glow !== undefined) {
            if (typeof config.glow === 'string') {
                validated.glow = await this.validateOption('glow', config.glow) as any;
            } else if (typeof config.glow === 'object' && config.glow !== null) {
                const glowObj: any = {};
                if (config.glow.preset) {
                    glowObj.preset = await this.validateOption('glow', config.glow.preset as string);
                }
                // Validate shape-specific overrides
                const manifest = await this.themeLoader.getManifestAsync();
                const glowOptions = manifest.glow;
                for (const key in config.glow) {
                    if (key !== 'preset') {
                        const value = config.glow[key];
                        if (value && typeof value === 'string' && glowOptions[value]) {
                            glowObj[key] = await this.validateOption('glow', value);
                        }
                    }
                }
                validated.glow = glowObj;
            }
        }
        
        if (config.font !== undefined) {
            if (typeof config.font === 'string') {
                validated.font = await this.validateOption('font', config.font) as any;
            } else if (typeof config.font === 'object' && config.font !== null) {
                const fontObj: any = {};
                if (config.font.preset) {
                    fontObj.preset = await this.validateOption('font', config.font.preset as string);
                }
                // Validate shape-specific overrides
                const manifest = await this.themeLoader.getManifestAsync();
                const fontOptions = manifest.font;
                for (const key in config.font) {
                    if (key !== 'preset') {
                        const value = config.font[key];
                        if (value && typeof value === 'string' && fontOptions[value]) {
                            fontObj[key] = await this.validateOption('font', value);
                        }
                    }
                }
                validated.font = fontObj;
            }
        }
        
        return validated;
    }

    /**
     * Load theme based on current configuration
     * Handles both simple string values and nested objects (for lines, roundness, font)
     */
    public loadTheme(config?: Partial<ThemeConfig>): void {
        if (config) {
            // Merge config, handling nested properties
            this.currentConfig = this.mergeThemeConfig(this.currentConfig, config);
        }
        
        // Convert nested config to flat config for ThemeLoader
        const flatConfig = this.flattenThemeConfig(this.currentConfig);
        this.themeLoader.loadTheme(flatConfig);
        
        // Update data attributes on document root
        const root = document.documentElement;
        if (this.currentConfig.brand) {
            root.setAttribute('data-brand', this.currentConfig.brand as string);
        }
        if (this.currentConfig.style) {
            root.setAttribute('data-style', this.currentConfig.style as string);
        }
        if (this.currentConfig.color) {
            root.setAttribute('data-theme', this.currentConfig.color as string);
        }
        if (this.currentConfig.accent) {
            root.setAttribute('data-accent', this.currentConfig.accent as string);
        }
        
        // Handle nested properties
        if (this.currentConfig.lines) {
            const linesValue = typeof this.currentConfig.lines === 'string' 
                ? this.currentConfig.lines 
                : (this.currentConfig.lines as any).preset;
            if (linesValue) {
                root.setAttribute('data-lines', linesValue);
            }
        }
        
        if (this.currentConfig.roundness) {
            const roundnessValue = typeof this.currentConfig.roundness === 'string' 
                ? this.currentConfig.roundness 
                : (this.currentConfig.roundness as any).preset;
            if (roundnessValue) {
                root.setAttribute('data-roundness', roundnessValue);
            }
        }
        
        if (this.currentConfig.glow) {
            const glowValue = typeof this.currentConfig.glow === 'string' 
                ? this.currentConfig.glow 
                : (this.currentConfig.glow as any).preset;
            if (glowValue) {
                root.setAttribute('data-glow', glowValue);
            }
        }
        
        if (this.currentConfig.font) {
            const fontValue = typeof this.currentConfig.font === 'string' 
                ? this.currentConfig.font 
                : (this.currentConfig.font as any).preset;
            if (fontValue) {
                root.setAttribute('data-font', fontValue);
            }
        }
        
        if (this.currentConfig.icons) {
            root.setAttribute('data-icons', this.currentConfig.icons as string);
        }
        if (this.currentConfig.icons_colors) {
            root.setAttribute('data-icons-colors', this.currentConfig.icons_colors as string);
        }
        if (this.currentConfig.emojis) {
            root.setAttribute('data-emojis', this.currentConfig.emojis as string);
        }
    }

    /**
     * Merge theme config, handling nested properties
     */
    private mergeThemeConfig(current: ThemeConfig, updates: Partial<ThemeConfig>): ThemeConfig {
        const merged = { ...current };
        
        // Handle simple properties
        if (updates.brand !== undefined) merged.brand = updates.brand;
        if (updates.style !== undefined) merged.style = updates.style;
        if (updates.color !== undefined) merged.color = updates.color;
        if (updates.accent !== undefined) merged.accent = updates.accent;
        if (updates.icons !== undefined) merged.icons = updates.icons;
        if (updates.icons_colors !== undefined) merged.icons_colors = updates.icons_colors;
        if (updates.emojis !== undefined) merged.emojis = updates.emojis;
        
        // Handle nested properties (lines, roundness, font)
        if (updates.lines !== undefined) {
            if (typeof updates.lines === 'string') {
                merged.lines = updates.lines;
            } else if (typeof updates.lines === 'object') {
                merged.lines = { ...(merged.lines as any || {}), ...updates.lines };
            }
        }
        
        if (updates.roundness !== undefined) {
            if (typeof updates.roundness === 'string') {
                merged.roundness = updates.roundness;
            } else if (typeof updates.roundness === 'object') {
                merged.roundness = { ...(merged.roundness as any || {}), ...updates.roundness };
            }
        }
        
        if (updates.glow !== undefined) {
            if (typeof updates.glow === 'string') {
                merged.glow = updates.glow;
            } else if (typeof updates.glow === 'object') {
                merged.glow = { ...(merged.glow as any || {}), ...updates.glow };
            }
        }
        
        if (updates.font !== undefined) {
            if (typeof updates.font === 'string') {
                merged.font = updates.font;
            } else if (typeof updates.font === 'object') {
                merged.font = { ...(merged.font as any || {}), ...updates.font };
            }
        }
        
        return merged;
    }

    /**
     * Flatten nested theme config to simple format for ThemeLoader
     */
    private flattenThemeConfig(config: ThemeConfig): ThemeConfig {
        const flat: ThemeConfig = {};
        
        if (config.brand) flat.brand = config.brand;
        if (config.style) flat.style = config.style;
        if (config.color) flat.color = config.color;
        if (config.accent) flat.accent = config.accent;
        if (config.icons) flat.icons = config.icons;
        if (config.icons_colors) flat.icons_colors = config.icons_colors;
        if (config.emojis) flat.emojis = config.emojis;
        
        // Extract preset from nested properties
        if (config.lines) {
            flat.lines = typeof config.lines === 'string' 
                ? config.lines 
                : (config.lines as any).preset;
        }
        
        if (config.roundness) {
            flat.roundness = typeof config.roundness === 'string' 
                ? config.roundness 
                : (config.roundness as any).preset;
        }
        
        if (config.font) {
            flat.font = typeof config.font === 'string' 
                ? config.font 
                : (config.font as any).preset;
        }
        
        return flat;
    }

    /**
     * Update theme configuration
     * Validates all values against the manifest before applying
     * Note: If preset is not 'custom', individual theme updates are ignored
     */
    public async updateTheme(updates: Partial<ThemeConfig>): Promise<void> {
        const presetMode = this.data.preset || this.config.preset || 'system';
        
        // If preset is not 'custom', ignore individual updates (preset takes precedence)
        if (presetMode !== 'custom') {
            console.warn('Theme updates ignored: preset mode is active. Set preset to "custom" to allow manual theme changes.');
            return;
        }
        
        // Prevent infinite loops
        if (this.isUpdating) {
            return;
        }
        
        this.isUpdating = true;
        try {
            const validated = await this.validateThemeConfig(updates);
            this.currentConfig = { ...this.currentConfig, ...validated };
            
            // Store custom selections in customThemeConfig (saved to localStorage only, not cookies)
            const currentCustom = this.getCustomThemeConfig();
            const newCustomConfig = { ...currentCustom, ...validated };
            this.setCustomThemeConfig(newCustomConfig);
            
            // Don't save validated theme data to cookies - it's too large
            // Only save small metadata (preset) to cookies via setCustomThemeConfig's internal logic
            
            this.loadTheme();
        } finally {
            this.isUpdating = false;
        }
        
        // Dispatch custom event for same-page synchronization
        window.dispatchEvent(new CustomEvent('xwui-style-changed', {
            detail: {
                preset: this.data.preset || this.config.preset || 'system',
                theme: this.currentConfig,
                customTheme: this.getCustomThemeConfig()
            }
        }));
    }
    
    /**
     * Update theme via data (user override - highest priority)
     */
    public async updateThemeData(updates: Partial<XWUIStyleData>): Promise<void> {
        // Prevent infinite loops
        if (this.isUpdating) {
            return;
        }
        
        this.isUpdating = true;
        try {
            // Separate small metadata from large theme data
            const { 
                preset, 
                id, 
                customThemeConfig,
                brand, style, color, accent, lines, roundness, glow, font, icons, icons_colors, emojis,
                ...otherUpdates 
            } = updates;
            
            // Save only small metadata to cookies (preset, id)
            const smallData: Partial<XWUIStyleData> = {};
            if (preset !== undefined) smallData.preset = preset;
            if (id !== undefined) smallData.id = id;
            if (Object.keys(smallData).length > 0 || Object.keys(otherUpdates).length > 0) {
                this.updateData({ ...smallData, ...otherUpdates });
            }
            
            // If preset is being updated, also update config
            if (preset !== undefined) {
                this.config.preset = preset;
            }
            
            // Handle theme properties - save to customThemeConfig (localStorage only)
            const presetMode = this.data.preset || this.config.preset || 'system';
            if (presetMode === 'custom') {
                // Extract theme config from updates
                const themeUpdates: Partial<ThemeConfig> = {};
                if (brand !== undefined) themeUpdates.brand = brand;
                if (style !== undefined) themeUpdates.style = style;
                if (color !== undefined) themeUpdates.color = color;
                if (accent !== undefined) themeUpdates.accent = accent;
                if (lines !== undefined) themeUpdates.lines = lines;
                if (roundness !== undefined) themeUpdates.roundness = roundness;
                if (glow !== undefined) themeUpdates.glow = glow;
                if (font !== undefined) themeUpdates.font = font;
                if (icons !== undefined) themeUpdates.icons = icons;
                if (icons_colors !== undefined) themeUpdates.icons_colors = icons_colors;
                if (emojis !== undefined) themeUpdates.emojis = emojis;
                if (customThemeConfig) {
                    Object.assign(themeUpdates, customThemeConfig);
                }
                
                if (Object.keys(themeUpdates).length > 0) {
                    const validated = await this.validateThemeConfig(themeUpdates);
                    const currentCustom = this.getCustomThemeConfig();
                    this.setCustomThemeConfig({ ...currentCustom, ...validated });
                }
            }
            // Re-merge configurations with new data
            this.currentConfig = await this.mergeConfigurations();
            // Load theme with updated config
            this.loadTheme();
        } finally {
            this.isUpdating = false;
        }
        
        // Dispatch custom event for same-page synchronization
        window.dispatchEvent(new CustomEvent('xwui-style-changed', {
            detail: {
                preset: this.data.preset || this.config.preset || 'system',
                theme: this.currentConfig,
                customTheme: this.getCustomThemeConfig()
            }
        }));
    }

    /**
     * Set preset mode and reload theme
     */
    public async setPreset(preset: string): Promise<void> {
        // Prevent infinite loops
        if (this.isUpdating) {
            return;
        }
        
        this.isUpdating = true;
        try {
            const previousPreset = this.data.preset || this.config.preset || 'system';
            
            // If switching away from custom, save current custom selections
            if (previousPreset === 'custom') {
                // Save all current theme config as custom selections
                this.setCustomThemeConfig({ ...this.currentConfig });
            }
            
            this.config.preset = preset as any;
            
            // If switching to custom, restore saved custom selections to data
            if (preset === 'custom') {
                const customConfig = this.getCustomThemeConfig();
                // If no custom selections saved yet, initialize with current config (but don't validate everything yet)
                if (Object.keys(customConfig).length === 0) {
                    this.setCustomThemeConfig({ ...this.currentConfig });
                    // Just save preset for now, validate later when theme is actually changed
                    this.updateData({ preset: preset as any });
                } else {
                    // Only validate if we have existing custom config - but do it without blocking
                    // Validate in a non-blocking way by skipping validation if it's too large
                    const configKeys = Object.keys(customConfig);
                    if (configKeys.length < 20) {
                        // Small config - safe to validate
                        const validated = await this.validateThemeConfig(customConfig);
                        // Save custom config separately (not in cookies)
                        this.setCustomThemeConfig(validated);
                        // Save preset only (small data for cookies) - don't spread validated (too large for cookies)
                        this.updateData({ 
                            preset: preset as any
                        });
                    } else {
                        // Large config - just save preset and config without validation to avoid lag
                        // Save custom config separately (not in cookies)
                        this.setCustomThemeConfig(customConfig);
                        // Save preset only (small data for cookies)
                        this.updateData({ 
                            preset: preset as any
                        });
                    }
                }
            } else {
                // For non-custom presets, still save preset to data
                this.updateData({ preset: preset as any });
            }
            
            this.currentConfig = await this.mergeConfigurations();
            this.loadTheme();
        } finally {
            this.isUpdating = false;
        }
        
        // Dispatch custom event for same-page synchronization
        window.dispatchEvent(new CustomEvent('xwui-style-changed', {
            detail: {
                preset: preset,
                theme: this.currentConfig,
                customTheme: this.getCustomThemeConfig()
            }
        }));
    }

    /**
     * Get current preset mode
     */
    public getPreset(): string {
        return this.data.preset || this.config.preset || 'system';
    }

    /**
     * Get current theme configuration
     */
    public getTheme(): ThemeConfig {
        return { ...this.currentConfig };
    }

    /**
     * Get theme loader instance
     */
    public getThemeLoader(): ThemeLoader {
        return this.themeLoader;
    }

    /**
     * Get theme manifest
     */
    public getManifest() {
        return this.themeLoader.getManifest();
    }

    /**
     * Create config from component config
     */
    protected createConfig(
        conf_comp?: XWUIStyleConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIStyleConfig {
        return {
            basePath: conf_comp?.basePath,
            preset: conf_comp?.preset ?? 'system', // Default to system preset
            brand: conf_comp?.brand,
            style: conf_comp?.style,
            color: conf_comp?.color,
            accent: conf_comp?.accent,
            lines: conf_comp?.lines,
            roundness: conf_comp?.roundness,
            glow: conf_comp?.glow,
            font: conf_comp?.font,
            icons: conf_comp?.icons,
            icons_colors: conf_comp?.icons_colors,
            emojis: conf_comp?.emojis,
            autoLoad: conf_comp?.autoLoad ?? true
        };
    }

    /**
     * Destroy component
     */
    public destroy(): void {
        // Cleanup if needed
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIStyle as any).componentName = 'XWUIStyle';

