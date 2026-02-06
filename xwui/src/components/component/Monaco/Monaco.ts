/**
 * Monaco Component
 * Reusable Monaco Editor wrapper component
 */

export type MonacoLanguage = 
    | 'json' 
    | 'javascript' 
    | 'typescript'
    | 'python' 
    | 'html' 
    | 'css' 
    | 'sql' 
    | 'java' 
    | 'cpp' 
    | 'xml' 
    | 'yaml' 
    | 'markdown'
    | 'text'
    | 'plaintext';

export type MonacoTheme = 'vs' | 'vs-dark' | 'hc-black';

export interface MonacoConfig {
    value?: string;
    language?: MonacoLanguage;
    theme?: MonacoTheme;
    readOnly?: boolean;
    fontSize?: number;
    fontFamily?: string;
    minimap?: { enabled: boolean };
    wordWrap?: 'on' | 'off';
    lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
    automaticLayout?: boolean;
    scrollBeyondLastLine?: boolean;
    formatOnPaste?: boolean;
    formatOnType?: boolean;
    renderLineHighlight?: 'all' | 'line' | 'none' | 'gutter';
}

export interface MonacoEditor {
    getValue(): string;
    setValue(value: string): void;
    getModel(): any;
    setModel(model: any): void;
    updateOptions(options: any): void;
    layout(): void;
    dispose(): void;
    onDidChangeModelContent(callback: () => void): any;
    onDidChangeCursorPosition(callback: (e: any) => void): any;
}

export class Monaco {
    private container: HTMLElement;
    private config: MonacoConfig;
    private monacoEditor: MonacoEditor | null = null;
    private monaco: any = null;
    private resizeObserver: ResizeObserver | null = null;
    private isInitialized: boolean = false;
    private static monacoLoaded: boolean = false;
    private static loadingPromise: Promise<void> | null = null;

    constructor(container: HTMLElement, config?: MonacoConfig) {
        console.log('[Monaco] Constructor called');
        console.log('[Monaco] Container:', container);
        console.log('[Monaco] Container ID:', container?.id);
        console.log('[Monaco] Config:', config);
        
        this.container = container;
        this.config = {
            value: '',
            language: 'json',
            theme: this.detectTheme(),
            readOnly: false,
            fontSize: 14,
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            minimap: { enabled: true },
            wordWrap: 'on',
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
            renderLineHighlight: 'all',
            ...config
        };
        this.init();
    }

    private detectTheme(): MonacoTheme {
        const theme = localStorage.getItem('theme') || '';
        const isDark = document.documentElement.classList.contains('dark') || 
                      theme === 'dark' || 
                      theme === 'night';
        return isDark ? 'vs-dark' : 'vs';
    }

    private async init(): Promise<void> {
        await this.loadMonaco();
        await this.initializeEditor();
        this.setupResizeObserver();
        this.setupThemeListener();
    }

    /**
     * Load Monaco Editor from CDN (shared across all instances)
     */
    private async loadMonaco(): Promise<void> {
        console.log('[Monaco] Loading Monaco Editor...');
        console.log('[Monaco] Already loaded:', Monaco.monacoLoaded);
        console.log('[Monaco] Window.monaco exists:', !!(window as any).monaco);
        
        // If already loaded, return immediately
        if (Monaco.monacoLoaded && (window as any).monaco) {
            this.monaco = (window as any).monaco;
            console.log('[Monaco] Using already loaded Monaco');
            return;
        }

        // If loading in progress, wait for it
        if (Monaco.loadingPromise) {
            console.log('[Monaco] Waiting for existing load promise...');
            await Monaco.loadingPromise;
            this.monaco = (window as any).monaco;
            console.log('[Monaco] Load promise completed, Monaco available:', !!this.monaco);
            return;
        }

        // Start loading
        console.log('[Monaco] Starting new Monaco load...');
        Monaco.loadingPromise = new Promise((resolve, reject) => {
            // Check if already available
            if ((window as any).monaco) {
                console.log('[Monaco] Monaco already available on window');
                this.monaco = (window as any).monaco;
                Monaco.monacoLoaded = true;
                Monaco.loadingPromise = null;
                resolve();
                return;
            }

            // Check if require is available
            if ((window as any).require) {
                console.log('[Monaco] Using existing require.js');
                (window as any).require.config({
                    paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
                });
                (window as any).require(['vs/editor/editor.main'], () => {
                    this.monaco = (window as any).monaco;
                    Monaco.monacoLoaded = true;
                    Monaco.loadingPromise = null;
                    console.log('[Monaco] Monaco loaded via require.js');
                    resolve();
                });
                return;
            }

            // Load script dynamically
            console.log('[Monaco] Loading Monaco loader script...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
            script.async = true;
            script.onload = () => {
                console.log('[Monaco] Loader script loaded');
                const require = (window as any).require;
                if (require) {
                    console.log('[Monaco] Configuring require paths...');
                    require.config({
                        paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
                    });
                    require(['vs/editor/editor.main'], () => {
                        this.monaco = (window as any).monaco;
                        Monaco.monacoLoaded = true;
                        Monaco.loadingPromise = null;
                        console.log('[Monaco] Monaco editor loaded successfully');
                        resolve();
                    });
                } else {
                    Monaco.loadingPromise = null;
                    const error = new Error('Monaco loader not found after script load');
                    console.error('[Monaco] ERROR:', error);
                    reject(error);
                }
            };
            script.onerror = () => {
                Monaco.loadingPromise = null;
                const error = new Error('Failed to load Monaco Editor script');
                console.error('[Monaco] ERROR: Script load failed:', error);
                console.error('[Monaco] Script src:', script.src);
                reject(error);
            };
            document.body.appendChild(script);
            console.log('[Monaco] Script element appended to body');
        });

        try {
            await Monaco.loadingPromise;
            console.log('[Monaco] Monaco loading completed successfully');
        } catch (error) {
            console.error('[Monaco] ERROR: Monaco loading failed:', error);
            throw error;
        }
    }

    /**
     * Initialize Monaco editor instance
     */
    private async initializeEditor(): Promise<void> {
        console.log('[Monaco] Initializing editor...');
        console.log('[Monaco] Container:', this.container);
        console.log('[Monaco] Container ID:', this.container?.id);
        console.log('[Monaco] Container parent:', this.container?.parentElement);
        console.log('[Monaco] Monaco loaded:', !!this.monaco);
        
        if (!this.monaco) {
            console.error('[Monaco] ERROR: Monaco not loaded');
            console.error('[Monaco] Window.monaco:', (window as any).monaco);
            return;
        }

        if (!this.container) {
            console.error('[Monaco] ERROR: Container not found');
            return;
        }

        try {
            console.log('[Monaco] Creating editor with config:', {
                language: this.config.language,
                theme: this.config.theme,
                readOnly: this.config.readOnly,
                fontSize: this.config.fontSize
            });
            
            this.monacoEditor = this.monaco.editor.create(this.container, {
                value: this.config.value || '',
                language: this.config.language || 'json',
                theme: this.config.theme || 'vs',
                readOnly: this.config.readOnly || false,
                fontSize: this.config.fontSize || 14,
                fontFamily: this.config.fontFamily || "'Fira Code', 'Consolas', 'Monaco', monospace",
                minimap: this.config.minimap || { enabled: true },
                wordWrap: this.config.wordWrap || 'on',
                lineNumbers: this.config.lineNumbers || 'on',
                automaticLayout: this.config.automaticLayout !== false,
                scrollBeyondLastLine: this.config.scrollBeyondLastLine !== false,
                formatOnPaste: this.config.formatOnPaste || false,
                formatOnType: this.config.formatOnType || false,
                renderLineHighlight: this.config.renderLineHighlight || 'all'
            });

            this.isInitialized = true;
            console.log('[Monaco] Editor created successfully, initialized:', this.isInitialized);
        } catch (error) {
            console.error('[Monaco] ERROR: Failed to create editor:', error);
            console.error('[Monaco] Error details:', {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                name: error instanceof Error ? error.name : typeof error,
                container: this.container,
                containerId: this.container?.id,
                monacoAvailable: !!this.monaco,
                monacoEditor: !!this.monaco?.editor
            });
            this.isInitialized = false;
            throw error; // Re-throw to let caller handle it
        }
    }

    /**
     * Setup resize observer for automatic layout
     */
    private setupResizeObserver(): void {
        if (!this.config.automaticLayout && this.monacoEditor) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.monacoEditor) {
                    this.monacoEditor.layout();
                }
            });
            this.resizeObserver.observe(this.container);
        }
    }

    /**
     * Setup theme change listener
     */
    private setupThemeListener(): void {
        const themeHandler = (event: MessageEvent) => {
            if (event.data && event.data.type === 'themeChange' && this.monaco && this.monacoEditor) {
                const theme = this.getThemeFromString(event.data.theme);
                this.monaco.editor.setTheme(theme);
            }
        };
        window.addEventListener('message', themeHandler);
    }

    private getThemeFromString(theme?: string): MonacoTheme {
        if (!theme) {
            return this.detectTheme();
        }
        const isDark = theme === 'dark' || theme === 'night';
        return isDark ? 'vs-dark' : 'vs';
    }

    /**
     * Get the Monaco editor instance
     */
    public getEditor(): MonacoEditor | null {
        return this.monacoEditor;
    }

    /**
     * Get the Monaco module
     */
    public getMonaco(): any {
        return this.monaco;
    }

    /**
     * Get current editor value
     */
    public getValue(): string {
        return this.monacoEditor ? this.monacoEditor.getValue() : '';
    }

    /**
     * Set editor value
     */
    public setValue(value: string): void {
        if (this.monacoEditor) {
            this.monacoEditor.setValue(value);
        }
    }

    /**
     * Set language
     */
    public setLanguage(language: MonacoLanguage): void {
        if (this.monacoEditor && this.monaco) {
            const model = this.monacoEditor.getModel();
            if (model) {
                this.monaco.editor.setModelLanguage(model, language);
            }
        }
    }

    /**
     * Set theme
     */
    public setTheme(theme: MonacoTheme): void {
        if (this.monaco && this.monacoEditor) {
            this.monaco.editor.setTheme(theme);
        }
    }

    /**
     * Update editor options
     */
    public updateOptions(options: Partial<MonacoConfig>): void {
        if (this.monacoEditor) {
            this.monacoEditor.updateOptions(options);
        }
    }

    /**
     * Layout the editor (call on resize)
     */
    public layout(): void {
        if (this.monacoEditor) {
            this.monacoEditor.layout();
        }
    }

    /**
     * Dispose the editor
     */
    public dispose(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.monacoEditor) {
            this.monacoEditor.dispose();
            this.monacoEditor = null;
        }

        this.isInitialized = false;
    }

    /**
     * Check if editor is initialized
     */
    public isReady(): boolean {
        return this.isInitialized && this.monacoEditor !== null;
    }
}

