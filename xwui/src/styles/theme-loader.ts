/**
 * Theme Loader Utility
 * Dynamically loads and switches between theme combinations
 * Uses styles.data.json for configuration
 */

// Load manifest asynchronously to avoid JSON import issues in browsers
let themeManifestCache: ThemeManifest | null = null;
let themeManifestPromise: Promise<ThemeManifest> | null = null;
let cachedManifestPath: string | null = null; // Cache successful path to avoid re-detection
let manifestLastModified: number = 0; // Track manifest modification time for cache invalidation

async function loadThemeManifest(basePath?: string): Promise<ThemeManifest> {
  if (themeManifestCache) {
    return themeManifestCache;
  }
  
  if (themeManifestPromise) {
    return themeManifestPromise;
  }
  
  themeManifestPromise = (async () => {
    try {
      // Construct path to styles.data.json
      // In dev: /src/styles/styles.data.json
      // In production: /dist/src/styles/styles.data.json
      let manifestPath: string;
      
      if (basePath) {
        // Use provided base path - ensure it ends with /styles or contains styles
        if (basePath.endsWith('/styles') || basePath.includes('/styles/')) {
          manifestPath = `${basePath}/styles.data.json`;
        } else if (basePath.endsWith('styles')) {
          manifestPath = `${basePath}/styles.data.json`;
        } else {
          // Assume basePath is the styles directory
          manifestPath = `${basePath}/styles.data.json`;
        }
      } else {
        // ✅ OPTIMIZED: Use cached path if available to avoid re-detection
        if (cachedManifestPath) {
          manifestPath = cachedManifestPath;
          // ✅ OPTIMIZED: Add cache-busting query param in dev mode to ensure fresh manifest
          const cacheBuster = import.meta.env?.DEV ? `?t=${Date.now()}` : '';
          const response = await fetch(`${manifestPath}${cacheBuster}`, {
            cache: import.meta.env?.DEV ? 'no-cache' : 'default'
          });
          if (!response.ok) {
            // Cached path failed, clear it and try detection again
            cachedManifestPath = null;
            throw new Error(`Failed to load styles.data.json from cached path ${manifestPath}: ${response.status} ${response.statusText}`);
          }
          const manifest = await response.json() as ThemeManifest;
          themeManifestCache = manifest;
          return manifest;
        }
        
        // Try to detect path from current location
        // Try common paths concurrently for better performance
        const possiblePaths = [
          '/src/styles/styles.data.json',
          '/dist/src/styles/styles.data.json',
          './styles.data.json',
          '../styles.data.json'
        ];
        
        // Try all paths concurrently and use the first successful one
        manifestPath = possiblePaths[0]; // Default to first
        // ✅ OPTIMIZED: Add cache-busting in dev mode
        const cacheBuster = import.meta.env?.DEV ? `?t=${Date.now()}` : '';
        const pathResults = await Promise.allSettled(
          possiblePaths.map(path => fetch(`${path}${cacheBuster}`, {
            cache: import.meta.env?.DEV ? 'no-cache' : 'default'
          }))
        );
        
        // Find the first successful response and reuse it
        let response: Response | null = null;
        for (let i = 0; i < pathResults.length; i++) {
          const result = pathResults[i];
          if (result.status === 'fulfilled' && result.value.ok) {
            manifestPath = possiblePaths[i];
            response = result.value;
            // Cache the successful path
            cachedManifestPath = manifestPath;
            break;
          }
        }
        
        // If we found a successful response, use it; otherwise fetch the default path
        if (!response) {
          const cacheBuster = import.meta.env?.DEV ? `?t=${Date.now()}` : '';
          response = await fetch(`${manifestPath}${cacheBuster}`, {
            cache: import.meta.env?.DEV ? 'no-cache' : 'default'
          });
          if (!response.ok) {
            throw new Error(`Failed to load styles.data.json from ${manifestPath}: ${response.status} ${response.statusText}`);
          }
          // Cache even the default path if it works
          cachedManifestPath = manifestPath;
        }
        
        const manifest = await response.json() as ThemeManifest;
        themeManifestCache = manifest;
        return manifest;
      }
      
      // If basePath was provided, fetch from the constructed path
      // ✅ OPTIMIZED: Add cache-busting in dev mode
      const cacheBuster = import.meta.env?.DEV ? `?t=${Date.now()}` : '';
      const response = await fetch(`${manifestPath}${cacheBuster}`, {
        cache: import.meta.env?.DEV ? 'no-cache' : 'default'
      });
      if (!response.ok) {
        throw new Error(`Failed to load styles.data.json from ${manifestPath}: ${response.status} ${response.statusText}`);
      }
      const manifest = await response.json() as ThemeManifest;
      themeManifestCache = manifest;
      // Cache the path for future use
      if (!cachedManifestPath) {
        cachedManifestPath = manifestPath;
      }
      return manifest;
    } catch (error) {
      console.error('Failed to load theme manifest:', error);
      // Return empty manifest as fallback
      return {
        brand: {},
        style: {},
        color: {},
        accent: {},
        lines: {},
        roundness: {},
        glow: {},
        font: {},
        icons: {},
        icons_colors: {},
        emojis: {}
      } as ThemeManifest;
    }
  })();
  
  return themeManifestPromise;
}

// Types for theme manifest structure
interface ThemeOption {
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

// Generate ThemeConfig type dynamically from manifest
// These types are based on the ThemeManifest interface structure
type BrandKeys = string;
type StyleKeys = string;
type ColorKeys = string;
type AccentKeys = string;
type LinesKeys = string;
type RoundnessKeys = string;
type GlowKeys = string;
type FontKeys = string;
type IconsKeys = string;
type IconsColorsKeys = string;
type EmojisKeys = string;

export interface ThemeConfig {
    brand?: BrandKeys;
    style?: StyleKeys;
    color?: ColorKeys;
    accent?: AccentKeys;
    lines?: LinesKeys | { preset?: LinesKeys; [shape: string]: LinesKeys | undefined };
    roundness?: RoundnessKeys | { preset?: RoundnessKeys; [shape: string]: RoundnessKeys | undefined };
    glow?: GlowKeys | { preset?: GlowKeys; [shape: string]: GlowKeys | undefined };
    font?: FontKeys | { preset?: FontKeys; [shape: string]: FontKeys | undefined };
    icons?: IconsKeys;
    icons_colors?: IconsColorsKeys;
    emojis?: EmojisKeys;
}

/**
 * Get default value for a theme category
 */
function getDefaultValue<T extends keyof ThemeManifest>(
    category: T,
    manifest: ThemeManifest
): keyof ThemeManifest[T] | undefined {
    const options = manifest[category];
    for (const key in options) {
        const option = options[key] as ThemeOption;
        if (option.default) {
            return key as keyof ThemeManifest[T];
        }
    }
    // Fallback to first available option
    const keys = Object.keys(options);
    return keys[0] as keyof ThemeManifest[T] | undefined;
}

/**
 * Theme Loader Class
 * Manages loading and switching of theme CSS files
 */
export class ThemeLoader {
    private basePath: string;
    private loadedSheets: Map<string, HTMLLinkElement> = new Map();
    private manifest: ThemeManifest | null = null;
    private manifestPromise: Promise<ThemeManifest> | null = null;
    
    constructor(basePath: string = 'styles', manifest?: ThemeManifest) {
        this.basePath = basePath;
        if (manifest) {
            this.manifest = manifest;
        } else {
            // Lazy load manifest
            this.manifestPromise = loadThemeManifest();
        }
    }
    
    /**
     * Ensure manifest is loaded
     */
    private async ensureManifest(): Promise<ThemeManifest> {
        if (this.manifest) {
            return this.manifest;
        }
        if (this.manifestPromise) {
            this.manifest = await this.manifestPromise;
            return this.manifest;
        }
        // Construct base path for manifest
        // If basePath is relative like 'styles', convert to absolute path
        let manifestBasePath = this.basePath;
        if (!manifestBasePath.startsWith('/') && !manifestBasePath.startsWith('http')) {
          // Relative path - try to resolve
          manifestBasePath = `/${this.basePath}`;
        }
        this.manifestPromise = loadThemeManifest(manifestBasePath);
        this.manifest = await this.manifestPromise;
        return this.manifest;
    }
    
    /**
     * Get the theme manifest (synchronous if already loaded, otherwise async)
     */
    getManifest(): ThemeManifest {
        if (this.manifest) {
            return this.manifest;
        }
        // If not loaded yet, return empty manifest and trigger async load
        // This allows synchronous access for type checking, but actual data will be loaded async
        if (!this.manifestPromise) {
            let manifestBasePath = this.basePath;
            if (!manifestBasePath.startsWith('/') && !manifestBasePath.startsWith('http')) {
              manifestBasePath = `/${this.basePath}`;
            }
            this.manifestPromise = loadThemeManifest(manifestBasePath);
            this.manifestPromise.then(manifest => {
                this.manifest = manifest;
            }).catch(err => {
                console.error('Failed to load theme manifest:', err);
            });
        }
        // Return empty manifest as fallback until loaded
        return {
            brand: {},
            style: {},
            color: {},
            accent: {},
            lines: {},
            roundness: {},
            glow: {},
            font: {},
            icons: {},
            icons_colors: {},
            emojis: {}
        } as ThemeManifest;
    }
    
    /**
     * Get the theme manifest (async - ensures it's loaded)
     */
    async getManifestAsync(): Promise<ThemeManifest> {
        return await this.ensureManifest();
    }
    
    /**
     * Get all available options for a category (async - ensures manifest is loaded)
     * ✅ OPTIMIZED: Check if manifest is already loaded before async call
     */
    async getOptions<T extends keyof ThemeManifest>(category: T): Promise<ThemeOption[]> {
        // Fast path: if manifest is already loaded, use it directly
        if (this.manifest) {
            return Object.values(this.manifest[category]);
        }
        const manifest = await this.ensureManifest();
        const options = manifest[category];
        return Object.values(options);
    }
    
    /**
     * Get a specific option by ID (async - ensures manifest is loaded)
     * ✅ OPTIMIZED: Check if manifest is already loaded before async call
     */
    async getOption<T extends keyof ThemeManifest>(
        category: T,
        id: string
    ): Promise<ThemeOption | undefined> {
        // Fast path: if manifest is already loaded, use it directly
        if (this.manifest) {
            const options = this.manifest[category];
            return options[id as keyof typeof options];
        }
        const manifest = await this.ensureManifest();
        const options = manifest[category];
        return options[id as keyof typeof options];
    }
    
    /**
     * Get all brands (async)
     */
    async getBrands(): Promise<ThemeOption[]> {
        return await this.getOptions('brand');
    }
    
    /**
     * Get all styles (async)
     */
    async getStyles(): Promise<ThemeOption[]> {
        return await this.getOptions('style');
    }
    
    /**
     * Get all colors (async)
     */
    async getColors(): Promise<ThemeOption[]> {
        return await this.getOptions('color');
    }
    
    /**
     * Get all accents (async)
     */
    async getAccents(): Promise<ThemeOption[]> {
        return await this.getOptions('accent');
    }
    
    /**
     * Get all lines (border) options (async)
     */
    async getLinesOptions(): Promise<ThemeOption[]> {
        return await this.getOptions('lines');
    }
    
    /**
     * Get all roundness options (async)
     */
    async getRoundnessOptions(): Promise<ThemeOption[]> {
        return await this.getOptions('roundness');
    }
    
    /**
     * Get all glow options (async)
     */
    async getGlowOptions(): Promise<ThemeOption[]> {
        return await this.getOptions('glow');
    }
    
    /**
     * Get all fonts (async)
     */
    async getFonts(): Promise<ThemeOption[]> {
        return await this.getOptions('font');
    }
    
    /**
     * Get all icons options (async)
     */
    async getIconsOptions(): Promise<ThemeOption[]> {
        return await this.getOptions('icons');
    }
    
    /**
     * Get all icon colors options (async)
     */
    async getIconsColorsOptions(): Promise<ThemeOption[]> {
        return await this.getOptions('icons_colors');
    }
    
    /**
     * Get all emojis options (async)
     */
    async getEmojisOptions(): Promise<ThemeOption[]> {
        return await this.getOptions('emojis');
    }
    
    /**
     * Get theme options for UI rendering with color swatches (async)
     * Returns options formatted for display in a theme picker UI
     * ✅ OPTIMIZED: Direct manifest access instead of calling async methods
     */
    async getThemeOptionsForUI(): Promise<{
        brands: ThemeOption[];
        styles: ThemeOption[];
        colors: ThemeOption[];
        accents: ThemeOption[];
            lines: ThemeOption[];
            roundness: ThemeOption[];
            glow: ThemeOption[];
            fonts: ThemeOption[];
        icons: ThemeOption[];
        icons_colors: ThemeOption[];
        emojis: ThemeOption[];
    }> {
        const manifest = await this.ensureManifest();
        // ✅ OPTIMIZED: Direct access to manifest instead of async method calls
        // This eliminates 11 unnecessary async function calls
        return {
            brands: Object.values(manifest.brand),
            styles: Object.values(manifest.style),
            colors: Object.values(manifest.color),
            accents: Object.values(manifest.accent),
            lines: Object.values(manifest.lines),
            roundness: Object.values(manifest.roundness),
            glow: Object.values(manifest.glow),
            fonts: Object.values(manifest.font),
            icons: Object.values(manifest.icons),
            icons_colors: Object.values(manifest.icons_colors),
            emojis: Object.values(manifest.emojis)
        };
    }
    
    /**
     * Get current theme configuration (async)
     */
    async getCurrentTheme(): Promise<ThemeConfig> {
        const saved = localStorage.getItem('xwui-theme');
        if (saved) {
            try {
                return JSON.parse(saved) as ThemeConfig;
            } catch (e) {
                console.warn('Failed to parse saved theme');
            }
        }
        
        // Return defaults
        const manifest = await this.ensureManifest();
        return {
            brand: getDefaultValue('brand', manifest) as BrandKeys,
            style: getDefaultValue('style', manifest) as StyleKeys,
            color: getDefaultValue('color', manifest) as ColorKeys,
            accent: getDefaultValue('accent', manifest) as AccentKeys,
            lines: getDefaultValue('lines', manifest) as LinesKeys,
            roundness: getDefaultValue('roundness', manifest) as RoundnessKeys,
            glow: getDefaultValue('glow', manifest) as GlowKeys,
            font: getDefaultValue('font', manifest) as FontKeys,
            icons: getDefaultValue('icons', manifest) as IconsKeys,
            icons_colors: getDefaultValue('icons_colors', manifest) as IconsColorsKeys,
            emojis: getDefaultValue('emojis', manifest) as EmojisKeys
        };
    }
    
    /**
     * Load a theme configuration (async)
     * Handles both simple string values and nested objects for lines, roundness, glow, font
     */
    async loadTheme(config: ThemeConfig = {}): Promise<void> {
        const manifest = await this.ensureManifest();
        
        // Extract values, handling nested structures
        const getValue = <T extends any>(value: T | { preset?: T } | undefined, defaultKey: keyof ThemeManifest): T => {
            if (!value) return getDefaultValue(defaultKey, manifest) as T;
            if (typeof value === 'string') return value as T;
            if (typeof value === 'object' && 'preset' in value) {
                return (value.preset || getDefaultValue(defaultKey, manifest)) as T;
            }
            return getDefaultValue(defaultKey, manifest) as T;
        };

        const brand = config.brand || getDefaultValue('brand', manifest) as BrandKeys;
        const style = config.style || getDefaultValue('style', manifest) as StyleKeys;
        const color = config.color || getDefaultValue('color', manifest) as ColorKeys;
        const accent = config.accent || getDefaultValue('accent', manifest) as AccentKeys;
        const lines = getValue(config.lines, 'lines') as LinesKeys;
        const roundness = getValue(config.roundness, 'roundness') as RoundnessKeys;
        const glow = getValue(config.glow, 'glow') as GlowKeys;
        const font = getValue(config.font, 'font') as FontKeys;
        const icons = config.icons || getDefaultValue('icons', manifest) as IconsKeys;
        const icons_colors = config.icons_colors || getDefaultValue('icons_colors', manifest) as IconsColorsKeys;
        const emojis = config.emojis || getDefaultValue('emojis', manifest) as EmojisKeys;
        
        // Set data attributes on document root
        if (brand) document.documentElement.setAttribute('data-brand', brand);
        if (style) document.documentElement.setAttribute('data-style', style);
        if (color) document.documentElement.setAttribute('data-theme', color);
        if (accent) document.documentElement.setAttribute('data-accent', accent);
        if (lines) document.documentElement.setAttribute('data-lines', lines);
        if (roundness) document.documentElement.setAttribute('data-roundness', roundness);
        if (glow) document.documentElement.setAttribute('data-glow', glow);
        if (font) document.documentElement.setAttribute('data-font', font);
        if (icons) document.documentElement.setAttribute('data-icons', icons);
        if (icons_colors) document.documentElement.setAttribute('data-icons-colors', icons_colors);
        if (emojis) document.documentElement.setAttribute('data-emojis', emojis);
        
        // Load base styles
        this.loadSheet('base-reset', `${this.basePath}/base/reset.css`);
        this.loadSheet('base-typography', `${this.basePath}/base/typography.css`);
        this.loadSheet('base-utilities', `${this.basePath}/base/utilities.css`);
        
        // ✅ OPTIMIZED: Direct access to manifest instead of await getOption()
        // Since manifest is already loaded, we can access options synchronously
        // This eliminates 11 sequential async calls
        
        // Load brand
        if (brand) {
            const brandOption = manifest.brand[brand];
            if (brandOption) {
                this.loadSheet('brand', `${this.basePath}/${brandOption.folder}/brand.css`);
            }
        }
        
        // Load style
        if (style) {
            const styleOption = manifest.style[style];
            if (styleOption) {
                this.loadSheet('style-spacing', `${this.basePath}/${styleOption.folder}/spacing.css`);
                this.loadSheet('style-shadows', `${this.basePath}/${styleOption.folder}/shadows.css`);
                
                // Load glass utilities if required
                if (styleOption.requiresGlassUtilities) {
                    this.loadSheet('style-glass-utilities', `${this.basePath}/${styleOption.folder}/utilities.css`);
                }
            }
        }
        
        // Load theme color
        if (color) {
            const colorOption = manifest.color[color];
            if (colorOption) {
                this.loadSheet('theme-color', `${this.basePath}/${colorOption.folder}/${color}.css`);
            }
        }
        
        // Load accent
        if (accent) {
            const accentOption = manifest.accent[accent];
            if (accentOption) {
                this.loadSheet('theme-accent', `${this.basePath}/${accentOption.folder}/${accent}.css`);
            }
        }
        
        // Load lines (border styles)
        if (lines) {
            const linesOption = manifest.lines[lines];
            if (linesOption) {
                this.loadSheet('theme-lines', `${this.basePath}/${linesOption.folder}/${lines}.css`);
            }
        }
        
        // Load roundness
        if (roundness) {
            const roundnessOption = manifest.roundness[roundness];
            if (roundnessOption) {
                this.loadSheet('theme-roundness', `${this.basePath}/${roundnessOption.folder}/${roundness}.css`);
            }
        }
        
        // Load glow
        if (glow) {
            const glowOption = manifest.glow[glow];
            if (glowOption) {
                this.loadSheet('theme-glow', `${this.basePath}/${glowOption.folder}/${glow}.css`);
            }
        }
        
        // Load typography
        if (font) {
            const fontOption = manifest.font[font];
            if (fontOption) {
                this.loadSheet('theme-typography', `${this.basePath}/${fontOption.folder}/${font}.css`);
            }
        }
        
        // Load icons
        if (icons) {
            const iconsOption = manifest.icons[icons];
            if (iconsOption) {
                this.loadSheet('theme-icons', `${this.basePath}/${iconsOption.folder}/${icons}.css`);
            }
        }
        
        // Load icons_colors
        if (icons_colors) {
            const iconsColorsOption = manifest.icons_colors[icons_colors];
            if (iconsColorsOption) {
                this.loadSheet('theme-icons-colors', `${this.basePath}/${iconsColorsOption.folder}/${icons_colors}.css`);
            }
        }
        
        // Load emojis
        if (emojis) {
            const emojisOption = manifest.emojis[emojis];
            if (emojisOption) {
                this.loadSheet('theme-emojis', `${this.basePath}/${emojisOption.folder}/${emojis}.css`);
            }
        }
        
        // Save to localStorage
        localStorage.setItem('xwui-theme', JSON.stringify(config));
    }
    
    /**
     * Load a CSS stylesheet
     */
    private loadSheet(id: string, href: string): void {
        let link = this.loadedSheets.get(id);
        
        if (!link) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.id = id;
            document.head.appendChild(link);
            this.loadedSheets.set(id, link);
        }
        
        // For relative paths, Vite will handle resolution automatically
        // Just use the href as-is - Vite dev server serves from src/, 
        // and production build copies files to dist/src/styles/
        link.href = href;
    }
    
    /**
     * Load theme from localStorage or use defaults (async)
     */
    async loadSavedTheme(): Promise<void> {
        const saved = localStorage.getItem('xwui-theme');
        if (saved) {
            try {
                const config = JSON.parse(saved) as ThemeConfig;
                await this.loadTheme(config);
                return;
            } catch (e) {
                console.warn('Failed to parse saved theme, using defaults');
            }
        }
        
        // Use defaults
        await this.loadTheme();
    }
    
    /**
     * Update a single theme aspect (async)
     */
    async updateTheme(updates: Partial<ThemeConfig>): Promise<void> {
        const saved = localStorage.getItem('xwui-theme');
        const current: ThemeConfig = saved ? JSON.parse(saved) : {};
        const newConfig = { ...current, ...updates };
        await this.loadTheme(newConfig);
    }
}

/**
 * Default theme loader instance
 */
export const themeLoader = new ThemeLoader();

/**
 * Export function to get theme manifest for external use (async)
 */
export async function getThemeManifest(): Promise<ThemeManifest> {
    return await loadThemeManifest();
}

export type { ThemeOption, ThemeManifest };
