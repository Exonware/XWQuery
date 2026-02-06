/**
 * XWUIComponent Base Class
 * Base class for all XWUI components providing common configuration pattern:
 * - conf_sys: System-level configuration (admin-editable)
 * - conf_usr: User-level configuration (user preferences)
 * - conf_comp: Component-level configuration (instance-specific)
 * - schema: JSON schema path
 * - data: Component data
 */

// System-level configuration (admin-editable, visual formats only)
export interface XWUISystemConfig {
    locale?: string;
    timezone?: string;
    direction?: 'ltr' | 'rtl';
    cookies?: boolean; // Enable cookie persistence for all components
    cookiesShared?: boolean; // If true, share data across all instances of same component type
    formats?: {
        date?: string;
        time?: string;
        datetime?: string;
        currency?: {
            defaultSymbol?: string;
            defaultDecimals?: number;
        };
        number?: {
            defaultDecimals?: number;
            useGrouping?: boolean;
        };
        percentage?: {
            defaultDecimals?: number;
        };
        fileSize?: {
            defaultUnit?: 'bytes' | 'auto';
            defaultDecimals?: number;
        };
        duration?: {
            defaultUnit?: 'seconds' | 'minutes' | 'hours' | 'auto';
            defaultFormat?: 'short' | 'long';
        };
    };
}

// User-level configuration (user preferences, visual formats only)
export interface XWUIUserConfig {
    locale?: string;
    timezone?: string;
    direction?: 'ltr' | 'rtl';
    cookies?: boolean; // Enable cookie persistence for all components
    cookiesShared?: boolean; // If true, share data across all instances of same component type
    formats?: {
        date?: string;
        time?: string;
        datetime?: string;
        currency?: {
            defaultSymbol?: string;
            defaultDecimals?: number;
        };
        number?: {
            defaultDecimals?: number;
            useGrouping?: boolean;
        };
        percentage?: {
            defaultDecimals?: number;
        };
        fileSize?: {
            defaultUnit?: 'bytes' | 'auto';
            defaultDecimals?: number;
        };
        duration?: {
            defaultUnit?: 'seconds' | 'minutes' | 'hours' | 'auto';
            defaultFormat?: 'short' | 'long';
        };
    };
}

/**
 * Base class for all XWUI components
 * Provides common configuration pattern and utilities
 * 
 * Standard inputs:
 * - container: parent item it is inside (built-in, automatically available)
 * - schema: loads from *.schema.json in the same folder of the component
 * - conf_sys: system configuration (localizations, theme, etc.)
 * - conf_usr: user configuration (user info, overrides, etc.)
 * - conf_comp: component settings (set when initializing the component)
 * - data: data to update the component (set when initializing the component)
 */
export abstract class XWUIComponent<TData = any, TConfig = any> {
    public readonly container: HTMLElement;
    public readonly schema: string;
    public readonly uid: string;
    public data: TData;
    public config: TConfig;
    public readonly conf_sys?: XWUISystemConfig;
    public readonly conf_usr?: XWUIUserConfig;
    protected effectiveConfig: XWUISystemConfig;
    
    /**
     * Collection of child XWUI components that should be automatically destroyed
     * when this component is destroyed. Components should register child components
     * using registerChildComponent() method.
     */
    protected childComponents: Set<XWUIComponent<any, any>> = new Set();

    /**
     * Static base path for CSS files
     * Can be set globally to control where component CSS files are loaded from
     * Defaults to auto-detection based on script location
     */
    public static cssBasePath: string | null = null;

    /**
     * Static component name - must be set by each component class
     * This survives minification because it's set at class definition time
     * Each component should set this after class definition:
     * (ComponentName as any).componentName = 'ComponentName';
     */
    public static readonly componentName: string;

    /**
     * Track loaded CSS links for cleanup on destroy
     */
    private loadedCSSLinks: HTMLLinkElement[] = [];
    
    /**
     * Cookie persistence enabled flag
     */
    private cookiesEnabled: boolean = false;
    
    /**
     * Component storage key (component name + uid for unique identification)
     */
    private storageKey: string = '';
    
    /**
     * Flag to prevent recursive saves when loading from storage
     */
    private isLoadingFromStorage: boolean = false;

    /**
     * Generate a unique identifier
     */
    private static generateUID(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Ensure data has a uid property (auto-generate if missing)
     */
    private static ensureUID<T>(data: any, existingUID?: string): { data: T; uid: string } {
        // Check if data is an object with a uid property
        if (data && typeof data === 'object') {
            // If data already has a uid, use it
            if (data.uid && typeof data.uid === 'string') {
                return { data, uid: data.uid };
            }
            
            // If provided via existingUID parameter, use it
            if (existingUID && typeof existingUID === 'string') {
                return { data: { ...data, uid: existingUID }, uid: existingUID };
            }
            
            // Auto-generate uid
            const uid = XWUIComponent.generateUID();
            return { data: { ...data, uid }, uid };
        }
        
        // For non-object data, generate uid separately
        const uid = existingUID || XWUIComponent.generateUID();
        return { data, uid };
    }

    constructor(
        container: HTMLElement,
        data: TData,
        conf_comp?: TConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        this.container = container;
        this.conf_sys = conf_sys;
        this.conf_usr = conf_usr;
        
        // Automatically determine schema path from component class name
        // Use static componentName (survives minification) with fallback to constructor.name
        // e.g., "XWUIScriptEditor" -> "./XWUIScriptEditor.schema.json"
        const componentName = (this.constructor as any).componentName || this.constructor.name;
        this.schema = `./${componentName}.schema.json`;
        
        // Ensure uid exists in data or generate one
        const { data: dataWithUID, uid } = XWUIComponent.ensureUID<TData>(data);
        this.data = dataWithUID;
        this.uid = uid;
        
        // Merge configs with priority: conf_comp > conf_usr > conf_sys
        this.effectiveConfig = this.mergeConfigs(conf_comp, conf_usr, conf_sys);
        
        // Set config (subclasses should override this)
        this.config = this.createConfig(conf_comp, conf_usr, conf_sys);
        
        // Determine if cookies are enabled (conf_comp > conf_usr > conf_sys)
        const confCompCookies = (conf_comp as any)?.cookies;
        this.cookiesEnabled = confCompCookies ?? conf_usr?.cookies ?? conf_sys?.cookies ?? false;
        
        // Generate storage key based on ID if available, otherwise use component name
        // (componentName was already declared above on line 188)
        // Check if data has an 'id' property (for ID-based storage)
        const dataId = (this.data as any)?.id;
        if (this.cookiesEnabled && dataId && typeof dataId === 'string') {
            // Use ID from data (e.g., "xwui-style-testers")
            this.storageKey = dataId;
        } else {
            // Fallback: use component name + uid for instance-specific storage
            this.storageKey = `xwui-${componentName.toLowerCase()}-${this.uid}`;
        }
        
        // Load data from cookies if enabled
        if (this.cookiesEnabled) {
            this.loadDataFromCookies();
            this.setupCrossTabSync();
        }

        // Automatically load component CSS
        this.loadComponentCSS();
    }
    
    /**
     * Cookie utility functions (protected so subclasses can use them)
     */
    protected static setCookie(name: string, value: string, days: number = 365): void {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
    }
    
    protected static getCookie(name: string): string | null {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }
    
    /**
     * Load data from cookies/localStorage
     * Subclasses can override to load additional state
     */
    protected loadDataFromCookies(): void {
        if (!this.cookiesEnabled || !this.storageKey) return;
        
        // Set flag to prevent recursive saves
        this.isLoadingFromStorage = true;
        
        try {
            // Try localStorage first (for cross-tab sync), then cookies
            let savedData: string | null = null;
            try {
                savedData = localStorage.getItem(this.storageKey);
            } catch (e) {
                // localStorage might not be available
            }
            
            if (!savedData) {
                savedData = XWUIComponent.getCookie(this.storageKey);
            }
            
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    // Merge saved data with current data (saved data takes precedence)
                    // This ensures loaded data overwrites any defaults
                    this.data = { ...this.data, ...parsedData };
                } catch (e) {
                    console.warn(`Failed to parse saved data for ${this.storageKey}:`, e);
                }
            }
        } finally {
            // Reset flag after loading
            this.isLoadingFromStorage = false;
        }
    }
    
    /**
     * Save data to cookies/localStorage
     * Automatically triggers sync events - all components with matching ID will update
     */
    protected saveDataToCookies(): void {
        if (!this.cookiesEnabled || !this.storageKey || this.isLoadingFromStorage) return;
        
        try {
            const dataStr = JSON.stringify(this.data);
            
            // Save to both cookies and localStorage
            XWUIComponent.setCookie(this.storageKey, dataStr);
            localStorage.setItem(this.storageKey, dataStr);
            
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
     * Get storage key for this component (useful for subclasses)
     */
    protected getStorageKey(): string {
        return this.storageKey;
    }
    
    /**
     * Setup automatic synchronization for components with matching IDs
     * Uses event-based sync (both same-page and cross-tab)
     */
    private setupCrossTabSync(): void {
        if (!this.cookiesEnabled || !this.storageKey) return;
        
        const storageKey = this.storageKey;
        const component = this;
        
        // Handle data updates from any source (same-page or cross-tab)
        const handleUpdate = () => {
            if (component.isLoadingFromStorage) return; // Prevent recursive updates
            component.loadDataFromCookies();
            component.onDataReloaded();
        };
        
        // Listen for cross-tab updates (storage events only fire in other tabs)
        const storageHandler = (event: StorageEvent) => {
            if (event.key === `${storageKey}-updated` && event.newValue) {
                handleUpdate();
            }
        };
        window.addEventListener('storage', storageHandler);
        
        // Listen for same-page updates (fires immediately when component with same ID updates)
        const eventName = `xwui-sync-${storageKey}`;
        const customEventHandler = () => {
            handleUpdate();
        };
        window.addEventListener(eventName, customEventHandler);
        
        // Store handlers for potential cleanup
        (this as any)._storageHandler = storageHandler;
        (this as any)._customEventHandler = customEventHandler;
        (this as any)._syncEventName = eventName;
    }
    
    /**
     * Called when data is reloaded from storage (cross-tab sync)
     * Subclasses can override this to react to data changes
     */
    protected onDataReloaded(): void {
        // Default implementation does nothing
        // Subclasses can override to update UI, etc.
    }
    
    /**
     * Update component data and save to cookies if enabled
     * Use this method instead of directly modifying this.data to ensure cookies are saved
     */
    public updateData(updates: Partial<TData>): void {
        // Merge updates into existing data
        this.data = { ...this.data, ...updates };
        
        // Save to cookies/localStorage if enabled (triggers sync automatically)
        if (this.cookiesEnabled) {
            this.saveDataToCookies();
        }
    }

    /**
     * Merge configurations with priority: conf_comp > conf_usr > conf_sys
     */
    protected mergeConfigs(
        conf_comp?: any,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISystemConfig {
        const merged: XWUISystemConfig = {
            locale: conf_comp?.locale || conf_usr?.locale || conf_sys?.locale || 'en-US',
            timezone: conf_comp?.timezone || conf_usr?.timezone || conf_sys?.timezone || 'UTC',
            direction: conf_comp?.direction || conf_usr?.direction || conf_sys?.direction || 'ltr',
            formats: {
                date: conf_comp?.formats?.date || conf_usr?.formats?.date || conf_sys?.formats?.date || 'YYYY-MM-DD',
                time: conf_comp?.formats?.time || conf_usr?.formats?.time || conf_sys?.formats?.time || 'HH:mm:ss',
                datetime: conf_comp?.formats?.datetime || conf_usr?.formats?.datetime || conf_sys?.formats?.datetime || 'YYYY-MM-DD HH:mm:ss',
                currency: {
                    defaultSymbol: conf_comp?.formats?.currency?.defaultSymbol || 
                                 conf_usr?.formats?.currency?.defaultSymbol || 
                                 conf_sys?.formats?.currency?.defaultSymbol || '$',
                    defaultDecimals: conf_comp?.formats?.currency?.defaultDecimals ?? 
                                   conf_usr?.formats?.currency?.defaultDecimals ?? 
                                   conf_sys?.formats?.currency?.defaultDecimals ?? 2
                },
                number: {
                    defaultDecimals: conf_comp?.formats?.number?.defaultDecimals ?? 
                                   conf_usr?.formats?.number?.defaultDecimals ?? 
                                   conf_sys?.formats?.number?.defaultDecimals ?? 2,
                    useGrouping: conf_comp?.formats?.number?.useGrouping ?? 
                               conf_usr?.formats?.number?.useGrouping ?? 
                               conf_sys?.formats?.number?.useGrouping ?? true
                },
                percentage: {
                    defaultDecimals: conf_comp?.formats?.percentage?.defaultDecimals ?? 
                                   conf_usr?.formats?.percentage?.defaultDecimals ?? 
                                   conf_sys?.formats?.percentage?.defaultDecimals ?? 1
                },
                fileSize: {
                    defaultUnit: conf_comp?.formats?.fileSize?.defaultUnit || 
                               conf_usr?.formats?.fileSize?.defaultUnit || 
                               conf_sys?.formats?.fileSize?.defaultUnit || 'auto',
                    defaultDecimals: conf_comp?.formats?.fileSize?.defaultDecimals ?? 
                                   conf_usr?.formats?.fileSize?.defaultDecimals ?? 
                                   conf_sys?.formats?.fileSize?.defaultDecimals ?? 2
                },
                duration: {
                    defaultUnit: conf_comp?.formats?.duration?.defaultUnit || 
                               conf_usr?.formats?.duration?.defaultUnit || 
                               conf_sys?.formats?.duration?.defaultUnit || 'auto',
                    defaultFormat: conf_comp?.formats?.duration?.defaultFormat || 
                                 conf_usr?.formats?.duration?.defaultFormat || 
                                 conf_sys?.formats?.duration?.defaultFormat || 'short'
                }
            }
        };
        return merged;
    }

    /**
     * Create component-specific config
     * Subclasses should override this to merge their specific config
     */
    protected abstract createConfig(
        conf_comp?: any,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): TConfig;

    /**
     * Load system configuration from JSON file
     */
    public static async loadSystemConfig(path: string = './data/conf_sys.json'): Promise<XWUISystemConfig | undefined> {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                return undefined;
            }
            return await response.json() as XWUISystemConfig;
        } catch {
            return undefined;
        }
    }

    /**
     * Load user configuration from JSON file
     */
    public static async loadUserConfig(path: string = './data/conf_usr.json'): Promise<XWUIUserConfig | undefined> {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                return undefined;
            }
            return await response.json() as XWUIUserConfig;
        } catch {
            return undefined;
        }
    }

    /**
     * Get effective configuration (merged)
     */
    public getEffectiveConfig(): XWUISystemConfig {
        return this.effectiveConfig;
    }

    /**
     * Get effective direction
     */
    public getDirection(): 'ltr' | 'rtl' {
        return this.effectiveConfig.direction || 'ltr';
    }

    /**
     * Get effective locale
     */
    public getLocale(): string {
        return this.effectiveConfig.locale || 'en-US';
    }

    /**
     * Get effective timezone
     */
    public getTimezone(): string {
        return this.effectiveConfig.timezone || 'UTC';
    }

    /**
     * Convert PascalCase class name to kebab-case custom element name
     * e.g., "XWUIScriptEditor" -> "xwui-script-editor"
     */
    private static toKebabCase(str: string): string {
        return str
            .replace(/([A-Z])([A-Z])([a-z])/g, '$1-$2$3') // Handle consecutive capitals
            .replace(/([a-z])([A-Z])/g, '$1-$2') // Handle camelCase
            .toLowerCase();
    }

    /**
     * Detect base path for CSS files
     * Tries to determine the correct path based on current page location
     * Prioritizes current page location over script URLs to work correctly with Vite
     */
    private static detectCSSBasePath(): string {
        // If static base path is set, use it (highest priority)
        if (XWUIComponent.cssBasePath) {
            return XWUIComponent.cssBasePath;
        }

        // PRIORITY 1: Detect from current page location (most reliable for Vite)
        const currentPath = window.location.pathname;
        
        // If page is in dist/, calculate relative path to src/components
        if (currentPath.includes('/dist/')) {
            const distIndex = currentPath.indexOf('/dist/');
            const pathAfterDist = currentPath.substring(distIndex + '/dist/'.length);
            // Count depth: e.g., "src/components/XWUITester/testers/file.html" = 4 levels
            const depth = (pathAfterDist.match(/\//g) || []).length;
            // Go up to dist root, then to src/components
            return '../'.repeat(depth) + 'src/components';
        }
        
        // If page is in src/, calculate relative path to components
        if (currentPath.includes('/src/')) {
            // Get the directory of the current page (remove filename)
            const lastSlash = currentPath.lastIndexOf('/');
            const currentDir = lastSlash > 0 ? currentPath.substring(0, lastSlash) : currentPath;
            
            // Find where we are relative to /src/components/
            if (currentDir.includes('/src/components/')) {
                // We're inside src/components/, calculate relative path to components root
                // e.g., if we're at "src/components/XWUITester/testers/"
                // we need to go up 2 levels to get to "src/components/"
                const componentsIndex = currentDir.indexOf('/src/components/');
                const pathAfterComponents = currentDir.substring(componentsIndex + '/src/components/'.length);
                
                // Count directories after components/ (e.g., "XWUITester/testers" = 2 levels)
                // We need to go up that many levels to reach components/
                const depth = pathAfterComponents ? (pathAfterComponents.match(/\//g) || []).length + 1 : 0;
                
                // Return path that goes up to components/ directory
                // This will be used as: basePath + "/XWUIButton/XWUIButton.css"
                // So if basePath is "../../", result is "../../XWUIButton/XWUIButton.css" ✓
                return '../'.repeat(depth);
            } else {
                // We're in src/ but not in components/, need to navigate to components
                const srcIndex = currentDir.indexOf('/src/');
                const pathAfterSrc = currentDir.substring(srcIndex + '/src/'.length);
                const depth = pathAfterSrc ? (pathAfterSrc.match(/\//g) || []).length + 1 : 0;
                
                // Go up to src/, then to components
                return '../'.repeat(depth) + 'components';
            }
        }

        // PRIORITY 2: Try to detect from script tags (fallback)
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (!src) continue;
            
            // Only use script detection if current page path didn't give us a result
            // Skip if script is from Vite's virtual modules (they contain @vite or @fs)
            if (src.includes('@vite') || src.includes('@fs') || src.includes('?html-proxy')) {
                continue;
            }
            
            try {
                const scriptUrl = new URL(src, window.location.href);
                const scriptPath = scriptUrl.pathname;
                
                // If script is in src/components/, calculate relative path
                if (scriptPath.includes('/src/components/')) {
                    const componentsIndex = scriptPath.indexOf('/src/components/');
                    const pathAfterComponents = scriptPath.substring(componentsIndex + '/src/components/'.length);
                    // Get directory depth
                    const lastSlash = pathAfterComponents.lastIndexOf('/');
                    const dirPath = lastSlash > 0 ? pathAfterComponents.substring(0, lastSlash) : '';
                    const depth = dirPath ? (dirPath.match(/\//g) || []).length + 1 : 0;
                    return '../'.repeat(depth);
                }
                
                // If script is in dist/, calculate relative path to src/components
                if (scriptPath.includes('/dist/')) {
                    const distIndex = scriptPath.indexOf('/dist/');
                    const pathAfterDist = scriptPath.substring(distIndex + '/dist/'.length);
                    const depth = (pathAfterDist.match(/\//g) || []).length;
                    return '../'.repeat(depth) + 'src/components';
                }
            } catch (e) {
                // If URL parsing fails, continue to next script
                continue;
            }
        }

        // Default fallback - try relative path
        return '../components';
    }

    /**
     * Load component CSS file automatically
     * CSS file is expected to be at: {basePath}/{ComponentName}/{ComponentName}.css
     * e.g., "src/components/XWUIButton/XWUIButton.css"
     */
    private loadComponentCSS(): void {
        // Use static componentName (survives minification) with fallback to constructor.name
        // Static properties set at class definition time survive minification
        const componentName = (this.constructor as any).componentName || this.constructor.name;
        
        // Validate component name - if name is too short, it's likely minified
        if (!componentName || componentName.length === 0) {
            console.warn('XWUIComponent: Cannot load CSS - component name is empty');
            return;
        }
        
        // Warn if name is suspiciously short (likely minified)
        if (componentName.length <= 1) {
            console.warn('XWUIComponent: Component name appears to be minified:', componentName);
            console.warn('XWUIComponent: Component class should set static componentName property to survive minification');
            return;
        }
        
        const cssFileName = `${componentName}.css`;
        const cssId = `xwui-css-${componentName.toLowerCase()}`;

        // Check if CSS is already loaded (by ID or by href containing the CSS file)
        const existingLinkById = document.getElementById(cssId);
        if (existingLinkById) {
            return; // Already loaded
        }

        // Check if CSS is already loaded via HTML link tag
        const allLinks = document.querySelectorAll('link[rel="stylesheet"]');
        for (let i = 0; i < allLinks.length; i++) {
            const href = (allLinks[i] as HTMLLinkElement).href;
            if (href && href.includes(cssFileName)) {
                return; // CSS already loaded
            }
        }

        // Get base path
        const basePath = XWUIComponent.detectCSSBasePath();

        // Construct CSS path - ensure proper path separator
        // e.g., "src/components/XWUIButton/XWUIButton.css" or "../../XWUIButton/XWUIButton.css"
        const normalizedBasePath = basePath.replace(/\/+$/, ''); // Remove trailing slashes
        
        // Build the full CSS path
        // If basePath ends with a slash or is empty, don't add another slash
        const separator = normalizedBasePath && !normalizedBasePath.endsWith('/') ? '/' : '';
        const cssPath = normalizedBasePath + separator + componentName + '/' + cssFileName;

        // Resolve path to absolute URL
        // For relative paths (starting with ../), resolve relative to current page
        // For absolute paths (starting with /), use as-is
        let resolvedPath: string;
        try {
            if (cssPath.startsWith('/')) {
                // Absolute path - use as-is (but resolve relative to origin)
                resolvedPath = new URL(cssPath, window.location.origin).href;
            } else if (cssPath.startsWith('../') || cssPath.startsWith('./')) {
                // Relative path - resolve relative to current page location
                resolvedPath = new URL(cssPath, window.location.href).href;
            } else {
                // Relative path without ./ prefix - resolve relative to current page
                resolvedPath = new URL('./' + cssPath, window.location.href).href;
            }
        } catch (e) {
            // If URL resolution fails, log error and use path as-is
            console.warn(`XWUIComponent: Failed to resolve CSS path for ${componentName}:`, cssPath, e);
            resolvedPath = cssPath;
        }
        
        // Debug logging (can be removed in production)
        if (typeof window !== 'undefined' && (window as any).__XWUI_DEBUG__) {
            console.log(`XWUIComponent: Loading CSS for ${componentName}`, {
                basePath,
                normalizedBasePath,
                cssPath,
                resolvedPath,
                currentPage: window.location.pathname
            });
        }

        // Create and append stylesheet link
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = resolvedPath;

        // Add error handler to log if CSS fails to load
        link.onerror = () => {
            console.warn(`XWUIComponent: Failed to load CSS for ${componentName} from ${resolvedPath}`);
        };

        // Store reference for cleanup
        this.loadedCSSLinks.push(link);

        // Append to head
        document.head.appendChild(link);
    }

    /**
     * Unload component CSS files
     * Removes CSS links that were loaded by this component instance
     */
    private unloadComponentCSS(): void {
        this.loadedCSSLinks.forEach(link => {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        });
        this.loadedCSSLinks = [];
    }







    /**
     * Register a child XWUI component for automatic cleanup
     * When this component is destroyed, all registered child components
     * will be automatically destroyed as well.
     * 
     * @param component - The child XWUI component to register
     * 
     * Example:
     * ```typescript
     * const button = new XWUIButton(container, { label: 'Click me' });
     * this.registerChildComponent(button);
     * // Now button will be automatically destroyed when this component is destroyed
     * ```
     */
    protected registerChildComponent(component: XWUIComponent<any, any> | null | undefined): void {
        if (component) {
            this.childComponents.add(component);
        }
    }

    /**
     * Unregister a child component from automatic cleanup
     * Use this if you manually destroy a child component before destroying the parent.
     * 
     * @param component - The child component to unregister
     */
    protected unregisterChildComponent(component: XWUIComponent<any, any> | null | undefined): void {
        if (component) {
            this.childComponents.delete(component);
        }
    }

    /**
     * Automatically destroy all registered child components
     * This is called automatically by destroy() before component-specific cleanup.
     * Subclasses can also call this manually if needed.
     */
    protected destroyChildComponents(): void {
        for (const child of this.childComponents) {
            if (child) {
                try {
                    child.destroy();
                } catch (error) {
                    console.warn(`Error destroying child component:`, error);
                }
            }
        }
        this.childComponents.clear();
    }

    /**
     * Destroy component and clean up resources
     * 
     * This method MUST be implemented by all subclasses to:
     * - Clean up event listeners
     * - Clear DOM references
     * - Clear timers/intervals
     * - Set references to null
     * 
     * NOTE: Child components registered via registerChildComponent() are
     * automatically destroyed before this method is called. You don't need
     * to manually destroy them unless you want custom cleanup order.
     * 
     * Base implementation automatically destroys all registered child components.
     * Subclasses should override to add component-specific cleanup logic.
     * 
     * Example (using automatic child cleanup):
     * ```typescript
     * constructor(...) {
     *     super(...);
     *     this.button = new XWUIButton(container, { label: 'Click' });
     *     this.registerChildComponent(this.button); // Register for auto-cleanup
     *     this.dialog = new XWUIDialog(container, { title: 'Dialog' });
     *     this.registerChildComponent(this.dialog); // Register for auto-cleanup
     * }
     * 
     * public destroy(): void {
     *     // Child components (button, dialog) are automatically destroyed
     *     // Just clean up other resources:
     *     this.eventListeners.forEach(listener => {
     *         listener.element.removeEventListener(listener.event, listener.handler);
     *     });
     *     this.eventListeners = [];
     *     // Clear references
     *     this.button = null;
     *     this.dialog = null;
     * }
     * ```
     * 
     * Example (manual child cleanup - if you need custom order):
     * ```typescript
     * public destroy(): void {
     *     // Destroy child components manually (in specific order if needed)
     *     if (this.dialog) {
     *         this.dialog.destroy();
     *         this.unregisterChildComponent(this.dialog);
     *     }
     *     if (this.button) {
     *         this.button.destroy();
     *         this.unregisterChildComponent(this.button);
     *     }
     *     // Then call parent to clean up any remaining registered children
     *     super.destroy();
     * }
     * ```
     */
    public destroy(): void {
        // Automatically destroy all registered child components
        this.destroyChildComponents();
        
        // Unload component CSS
        this.unloadComponentCSS();
        
        // Subclasses should override to add component-specific cleanup
    }

    /**
     * Register this component as a Custom Element
     * Automatically called when component class is defined
     * Uses the generic createXWUIElement factory
     * 
     * Usage: Components should call this in their class definition:
     * ```typescript
     * export class MyComponent extends XWUIComponent {
     *     // ... class implementation
     * }
     * XWUIComponent.registerCustomElement(MyComponent);
     * ```
     * 
     * Note: For new components, prefer using createXWUIElement() directly in index.ts
     */
    public static registerCustomElement<T extends XWUIComponent<any, any>>(
        ComponentClass: new (container: HTMLElement, data?: any, conf_comp?: any, conf_sys?: XWUISystemConfig, conf_usr?: XWUIUserConfig) => T,
        elementName?: string
    ): void {
        const className = ComponentClass.name;
        const kebabName = elementName || this.toKebabCase(className);
        
        // Use the generic factory (dynamic import to avoid circular dependencies)
        import('./XWUIComponent.element').then(({ createXWUIElement }) => {
            createXWUIElement(ComponentClass, kebabName);
        });
    }
}

