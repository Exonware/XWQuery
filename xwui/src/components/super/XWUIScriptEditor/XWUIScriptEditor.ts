/**
 * XWUIScriptEditor Component
 * Multi-editor code editor component supporting multiple editor engines
 * Uses centralized grammar system for all engines
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { GrammarType, getGrammar, getGrammarFromFileName, getGrammarFromExtension, type GrammarDefinition, GRAMMARS } from './grammars';
import { getEditorLanguageConfig, registerTextMateGrammarWithMonaco, convertLarkToMonarch } from './grammars/grammar-converter';

export type EditorEngine = 
    | 'monaco'           // Monaco Editor (VS Code editor)
    | 'codemirror6'      // CodeMirror 6 (modern, modular)
    | 'ace'              // Ace Editor (lightweight)
    | 'highlightjs'     // Highlight.js (syntax highlighting - view or edit based on mode)
    | 'orion'            // Eclipse Orion Editor
    | 'ckeditor-code';   // CKEditor Code Block

export type EditorMode = 'view' | 'edit';  // View mode (read-only) or Edit mode (editable)

// Component-level configuration (conf_comp)
export interface XWUIScriptEditorConfig {
    grammar?: GrammarType | string;  // Grammar/syntax type (from centralized grammars)
    fileName?: string;                // Optional: file name or path to auto-detect grammar from extension
    engine?: EditorEngine;            // Editor engine to use
    mode?: EditorMode;                // View mode (read-only) or Edit mode (editable)
    height?: string;
}

// Data type for XWUIScriptEditor (content is stored in data)
export interface XWUIScriptEditorData {
    content?: string;
}

export class XWUIScriptEditor extends XWUIComponent<XWUIScriptEditorData, XWUIScriptEditorConfig> {
    private currentEngine: EditorEngine;
    private currentGrammar: GrammarDefinition;
    private currentMode: EditorMode;
    private isDarkMode: boolean = false;
    
    // Editor instances (lazy loaded based on engine)
    private monacoEditor: any = null;
    private monaco: any = null;
    private cm6View: any = null;
    private aceEditor: any = null;
    private highlightjsElement: HTMLElement | null = null;
    private orionEditor: any = null;
    private ckeditorInstance: any = null;
    
    // CodeMirror 6 specific
    private cm6Language: any = null;
    private cm6Theme: any = null;
    private cm6ThemeModules: { oneDark: any; defaultHighlightStyle: any; syntaxHighlighting: any } | null = null;
    
    private resizeObserver: ResizeObserver | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIScriptEditorData = {},
        conf_comp: XWUIScriptEditorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Validate configuration against schema
        this.validateConfig(this.config);
        
        // Set engine (default: monaco)
        this.currentEngine = this.config?.engine || 'monaco';
        
        // Set mode (default: edit)
        this.currentMode = this.config?.mode || 'edit';
        
        // Set grammar (default: json)
        // Priority: 1. Explicit grammar config, 2. File name extension, 3. Default (json)
        let grammarId = this.config?.grammar;
        let grammar: GrammarDefinition | null = null;
        
        // If no explicit grammar, try to detect from file name
        if (!grammarId && this.config?.fileName) {
            const detectedGrammar = getGrammarFromFileName(this.config.fileName);
            if (detectedGrammar) {
                grammar = detectedGrammar;
                grammarId = detectedGrammar.id;
            }
        }
        
        // If still no grammar, use explicit grammar or default
        if (!grammar) {
            grammarId = grammarId || 'json';
            grammar = getGrammar(grammarId);
        }
        
        if (!grammar) {
            console.warn(`Unknown grammar: ${grammarId}, falling back to 'plaintext'`);
            this.currentGrammar = getGrammar('plaintext') || { id: 'plaintext', name: 'Plain Text', category: 'other' };
        } else {
            this.currentGrammar = grammar;
        }
        
        this.isDarkMode = this.detectDarkMode();
        this.init();
    }
    
    /**
     * Create component-specific config
     * Merges conf_comp with defaults
     */
    protected createConfig(
        conf_comp?: XWUIScriptEditorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIScriptEditorConfig {
        return {
            mode: conf_comp?.mode || 'edit',
            engine: conf_comp?.engine || 'monaco',
            height: conf_comp?.height || '70vh',
            grammar: conf_comp?.grammar,
            fileName: conf_comp?.fileName
        };
    }
    
    /**
     * Validates the configuration against the JSON schema
     * @param config Configuration object to validate
     * @throws Error if validation fails
     */
    private validateConfig(config: XWUIScriptEditorConfig): void {
        const errors: string[] = [];
        
        // Validate engine
        if (config.engine !== undefined) {
            const validEngines = ['monaco', 'codemirror6', 'ace', 'highlightjs', 'orion', 'ckeditor-code'];
            if (!validEngines.includes(config.engine)) {
                errors.push(`Invalid engine: "${config.engine}". Must be one of: ${validEngines.join(', ')}`);
            }
        }
        
        // Validate mode
        if (config.mode !== undefined) {
            const validModes = ['view', 'edit'];
            if (!validModes.includes(config.mode)) {
                errors.push(`Invalid mode: "${config.mode}". Must be one of: ${validModes.join(', ')}`);
            }
        }
        
        // Validate grammar - use getGrammar to check if it exists in the grammar system
        if (config.grammar !== undefined) {
            const grammar = getGrammar(config.grammar);
            if (!grammar) {
                errors.push(`Invalid grammar: "${config.grammar}". Must be one of the supported grammar types.`);
            }
        }
        
        // Content is validated in data, not config
        
        // Validate height type
        if (config.height !== undefined && typeof config.height !== 'string') {
            errors.push(`Invalid height: must be a string (e.g., "70vh", "500px"), got ${typeof config.height}`);
        }
        
        // Validate fileName type
        if (config.fileName !== undefined && typeof config.fileName !== 'string') {
            errors.push(`Invalid fileName: must be a string, got ${typeof config.fileName}`);
        }
        
        // Check for additional properties (schema has additionalProperties: false)
        const validKeys = ['grammar', 'fileName', 'engine', 'mode', 'height'];
        const configKeys = Object.keys(config);
        const invalidKeys = configKeys.filter(key => !validKeys.includes(key));
        if (invalidKeys.length > 0) {
            errors.push(`Invalid properties: ${invalidKeys.join(', ')}. Allowed properties: ${validKeys.join(', ')}`);
        }
        
        // Throw error if validation failed
        if (errors.length > 0) {
            const errorMessage = `XWUIScriptEditor configuration validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    private detectDarkMode(): boolean {
        return document.documentElement.classList.contains('dark') ||
               localStorage.getItem('theme') === 'dark' ||
               localStorage.getItem('theme') === 'night';
    }

    private async init(): Promise<void> {
        this.setupDOM();
        await this.loadEditorLibraries();
        this.setupEventListeners();
        await this.initializeEditors();
    }

    private setupDOM(): void {
        const height = this.config.height || '70vh';
        
        // Simple, pure editor - just the selected engine
        this.container.innerHTML = `
            <div class="xwui-script-editor-wrapper">
                <div class="xwui-script-editor-content">
                    <div id="xwui-script-editor-container" style="height: ${height}; width: 100%;"></div>
                </div>
            </div>
        `;
    }

    private async loadEditorLibraries(): Promise<void> {
        // Load libraries based on selected engine
        switch (this.currentEngine) {
            case 'monaco':
                if (!(window as any).monaco && !(window as any).require) {
                    await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js');
                }
                break;
            case 'codemirror6':
                // CodeMirror 6 uses ES modules, loaded dynamically
                break;
            case 'ace':
                if (!(window as any).ace) {
                    await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.3/ace.js');
                }
                break;
            case 'highlightjs':
                if (!(window as any).hljs) {
                    await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');
                    await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css');
                }
                break;
            case 'orion':
                // Eclipse Orion - Note: Orion might not be easily available via CDN
                // We'll skip loading here and handle fallback in initOrion()
                // No warning needed - fallback will be handled silently
                break;
            case 'ckeditor-code':
                if (!(window as any).ClassicEditor) {
                    // CKEditor 5 requires build configuration
                    // Try loading from CDN, but it may not work without proper build
                    await this.loadScript('https://cdn.ckeditor.com/ckeditor5/41.0.0/classic/ckeditor.js');
                    // Wait for CKEditor to initialize - check if it loaded
                    let retries = 0;
                    while (!(window as any).ClassicEditor && retries < 20) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        retries++;
                    }
                }
                break;
        }
    }
    
    private loadCSS(href: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if CSS already exists
            const existing = document.querySelector(`link[href="${href}"]`);
            if (existing) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => {
                console.warn(`Failed to load CSS: ${href}`);
                // Don't reject, just warn - some engines might work without the CSS
                resolve();
            };
            document.head.appendChild(link);
        });
    }

    private loadScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => {
                console.warn(`Failed to load script: ${src}`);
                // Don't reject, just warn - some engines might work without the library
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    private async initializeEditors(): Promise<void> {
        try {
            // Initialize only the selected engine
            switch (this.currentEngine) {
                case 'monaco':
                    await this.initMonaco();
                    break;
                case 'codemirror6':
                    await this.initCodeMirror6();
                    break;
                case 'ace':
                    this.initAce();
                    break;
                case 'highlightjs':
                    this.initHighlightJS();
                    break;
                case 'orion':
                    await this.initOrion();
                    break;
                case 'ckeditor-code':
                    await this.initCKEditor();
                    break;
            }

            // Set initial content and grammar
            this.setContent(this.data.content || '');
            this.setGrammar(this.currentGrammar.id);

            // Setup resize observer
            this.setupResizeHandler();
        } catch (error) {
            console.error('Failed to initialize editor:', error);
        }
    }

    private async initMonaco(): Promise<void> {
        return new Promise((resolve, reject) => {
            const container = document.getElementById('xwui-script-editor-container');
            if (!container) {
                reject(new Error('Monaco container not found'));
                return;
            }

            const initMonacoEditor = async () => {
                try {
                    const monaco = (window as any).monaco;
                    if (!monaco) {
                        reject(new Error('Monaco Editor not loaded'));
                        return;
                    }

                    this.monaco = monaco;
                    // Map grammar to Monaco language ID (using grammar converter)
                    const monacoLang = await this.mapGrammarToMonaco(this.currentGrammar.id);
                    
                    // Try to register TextMate grammar if available
                    try {
                        await registerTextMateGrammarWithMonaco(monaco, this.currentGrammar.id, this.currentGrammar);
                    } catch (error) {
                        console.debug(`TextMate grammar registration failed for ${this.currentGrammar.id}, using native language:`, error);
                    }
                    
                    this.monacoEditor = monaco.editor.create(container, {
                        value: this.data.content || '',
                        language: monacoLang,
                        theme: this.isDarkMode ? 'vs-dark' : 'vs',
                        automaticLayout: true,
                        fontSize: 14,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        wordWrap: 'on'
                    });

                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            // Check if Monaco is already loaded
            if ((window as any).monaco) {
                initMonacoEditor();
                return;
            }

            // Check if require.js is already available
            if ((window as any).require && typeof (window as any).require.config === 'function') {
                (window as any).require.config({
                    paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
                });
                (window as any).require(['vs/editor/editor.main'], () => {
                    initMonacoEditor();
                });
                return;
            }

            // Load Monaco loader script
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
            script.async = true;
            script.onload = () => {
                // Wait a bit for require to be fully initialized
                let retries = 0;
                const maxRetries = 20; // 20 * 50ms = 1 second max wait
                const checkRequire = () => {
                    const require = (window as any).require;
                    if (require && typeof require.config === 'function') {
                        require.config({
                            paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
                        });
                        require(['vs/editor/editor.main'], () => {
                            initMonacoEditor();
                        });
                    } else if (retries < maxRetries) {
                        retries++;
                        setTimeout(checkRequire, 50);
                    } else {
                        reject(new Error('Monaco loader not initialized after script load'));
                    }
                };
                checkRequire();
            };
            script.onerror = () => reject(new Error('Failed to load Monaco Editor'));
            document.body.appendChild(script);
        });
    }

    /**
     * Map grammar to Monaco Editor language
     * Uses grammar converter to generate TextMate grammar when possible
     * Falls back to native Monaco language IDs
     */
    private async mapGrammarToMonaco(grammarId: GrammarType): Promise<string> {
        const grammar = getGrammar(grammarId);
        if (!grammar) {
            return 'plaintext';
        }

        // Try to use grammar converter for TextMate/Monarch
        try {
            const langConfig = await getEditorLanguageConfig('monaco', grammarId, grammar);
            if (langConfig && typeof langConfig === 'string') {
                return langConfig;
            }
        } catch (error) {
            console.debug(`Failed to convert grammar ${grammarId} for Monaco, using fallback:`, error);
        }

        // Fallback to native Monaco language IDs
        const map: Record<string, string> = {
            javascript: 'javascript',
            typescript: 'typescript',
            json: 'json',
            html: 'html',
            css: 'css',
            python: 'python',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            csharp: 'csharp',
            go: 'go',
            rust: 'rust',
            php: 'php',
            ruby: 'ruby',
            sql: 'sql',
            xml: 'xml',
            yaml: 'yaml',
            toml: 'toml',
            markdown: 'markdown',
            dockerfile: 'dockerfile',
            makefile: 'makefile',
            bash: 'shell',
            powershell: 'powershell',
            text: 'plaintext',
            plaintext: 'plaintext'
        };
        return map[grammarId] || 'plaintext';
    }
    
    private mapGrammarToAce(grammarId: GrammarType): string {
        // Ace language mapping
        const map: Record<string, string> = {
            javascript: 'javascript',
            typescript: 'typescript',
            json: 'json',
            html: 'html',
            css: 'css',
            python: 'python',
            java: 'java',
            cpp: 'c_cpp',
            c: 'c_cpp',
            csharp: 'csharp',
            go: 'golang',
            rust: 'rust',
            php: 'php',
            ruby: 'ruby',
            sql: 'sql',
            xml: 'xml',
            yaml: 'yaml',
            toml: 'toml',
            markdown: 'markdown',
            dockerfile: 'dockerfile',
            makefile: 'makefile',
            bash: 'sh',
            powershell: 'powershell',
            text: 'text',
            plaintext: 'text'
        };
        return map[grammarId] || 'text';
    }
    
    private mapGrammarToPrism(grammarId: GrammarType): string {
        // Prism language mapping
        const map: Record<string, string> = {
            javascript: 'javascript',
            typescript: 'typescript',
            json: 'json',
            html: 'markup',
            css: 'css',
            python: 'python',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            csharp: 'csharp',
            go: 'go',
            rust: 'rust',
            php: 'php',
            ruby: 'ruby',
            sql: 'sql',
            xml: 'markup',
            yaml: 'yaml',
            toml: 'toml',
            markdown: 'markdown',
            dockerfile: 'docker',
            bash: 'bash',
            text: 'plain',
            plaintext: 'plain'
        };
        return map[grammarId] || 'plain';
    }
    
    private mapGrammarToHighlightJS(grammarId: GrammarType): string {
        // Highlight.js language mapping
        const map: Record<string, string> = {
            javascript: 'javascript',
            typescript: 'typescript',
            json: 'json',
            html: 'xml',
            css: 'css',
            python: 'python',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            csharp: 'csharp',
            go: 'go',
            rust: 'rust',
            php: 'php',
            ruby: 'ruby',
            sql: 'sql',
            xml: 'xml',
            yaml: 'yaml',
            toml: 'toml',
            markdown: 'markdown',
            dockerfile: 'dockerfile',
            bash: 'bash',
            text: 'plaintext',
            plaintext: 'plaintext'
        };
        return map[grammarId] || 'plaintext';
    }

    private async initCodeMirror6(): Promise<void> {
        try {
            // Dynamically import CodeMirror modules
            // @ts-ignore - Dynamic import from CDN
            const { EditorView, keymap, lineNumbers } = await import('https://esm.sh/@codemirror/view');
            // @ts-ignore - Dynamic import from CDN
            const { EditorState, Compartment } = await import('https://esm.sh/@codemirror/state');
            // @ts-ignore - Dynamic import from CDN
            const { defaultKeymap, indentWithTab, history } = await import('https://esm.sh/@codemirror/commands');
            // @ts-ignore - Dynamic import from CDN
            const { bracketMatching, defaultHighlightStyle, syntaxHighlighting } = await import('https://esm.sh/@codemirror/language');
            // @ts-ignore - Dynamic import from CDN
            const { autocompletion, closeBrackets } = await import('https://esm.sh/@codemirror/autocomplete');
            // @ts-ignore - Dynamic import from CDN
            const { oneDark } = await import('https://esm.sh/@codemirror/theme-one-dark');

            // Store theme modules for later use
            this.cm6ThemeModules = { oneDark, defaultHighlightStyle, syntaxHighlighting };

            // Import language support
            // @ts-ignore - Dynamic import from CDN
            const json = (await import('https://esm.sh/@codemirror/lang-json')).json;
            // @ts-ignore - Dynamic import from CDN
            const javascript = (await import('https://esm.sh/@codemirror/lang-javascript')).javascript;
            // @ts-ignore - Dynamic import from CDN
            const python = (await import('https://esm.sh/@codemirror/lang-python')).python;
            // @ts-ignore - Dynamic import from CDN
            const html = (await import('https://esm.sh/@codemirror/lang-html')).html;
            // @ts-ignore - Dynamic import from CDN
            const css = (await import('https://esm.sh/@codemirror/lang-css')).css;
            // @ts-ignore - Dynamic import from CDN
            const sql = (await import('https://esm.sh/@codemirror/lang-sql')).sql;
            // @ts-ignore - Dynamic import from CDN
            const java = (await import('https://esm.sh/@codemirror/lang-java')).java;
            // @ts-ignore - Dynamic import from CDN
            const cpp = (await import('https://esm.sh/@codemirror/lang-cpp')).cpp;
            // @ts-ignore - Dynamic import from CDN
            const xml = (await import('https://esm.sh/@codemirror/lang-xml')).xml;
            // @ts-ignore - Dynamic import from CDN
            const yaml = (await import('https://esm.sh/@codemirror/lang-yaml')).yaml;
            // @ts-ignore - Dynamic import from CDN
            const markdown = (await import('https://esm.sh/@codemirror/lang-markdown')).markdown;
            // @ts-ignore - Dynamic import from CDN - TOML support (package may not exist)
            let toml: any = null;
            try {
                // @ts-expect-error - Dynamic import from CDN, type may not be available
                const tomlModule = await import('https://esm.sh/@codemirror/lang-toml');
                toml = tomlModule.toml;
            } catch (e) {
                console.debug('TOML language support not available in CodeMirror, using plain text');
            }

            const container = document.getElementById('xwui-script-editor-container');
            if (!container) {
                throw new Error('CodeMirror container not found');
            }

            this.cm6Language = new Compartment();
            this.cm6Theme = new Compartment();

            const langMap: { [key: string]: () => any } = {
                json: () => json(),
                javascript: () => javascript(),
                python: () => python(),
                html: () => html(),
                css: () => css(),
                sql: () => sql(),
                java: () => java(),
                cpp: () => cpp(),
                xml: () => xml(),
                yaml: () => yaml(),
                toml: () => toml ? toml() : [],
                markdown: () => markdown()
            };

            const getLanguage = (grammarId: GrammarType) => {
                return langMap[grammarId] ? langMap[grammarId]() : [];
            };

            const startState = EditorState.create({
                doc: this.data.content || '',
                extensions: [
                    lineNumbers(),
                    history(),
                    bracketMatching(),
                    closeBrackets(),
                    autocompletion(),
                    keymap.of([...defaultKeymap, indentWithTab]),
                    this.cm6Language.of(getLanguage(this.currentGrammar.id)),
                    this.cm6Theme.of(this.isDarkMode ? oneDark : syntaxHighlighting(defaultHighlightStyle)),
                    EditorView.theme({
                        '&': { height: '100%' },
                        '.cm-scroller': { overflow: 'auto' }
                    })
                ]
            });

            this.cm6View = new EditorView({
                state: startState,
                parent: container
            });

            // Store language map and theme for later use
            (this.cm6View as any)._langMap = langMap;
        } catch (error) {
            console.error('Failed to initialize CodeMirror:', error);
        }
    }

    private initAce(): void {
        const container = document.getElementById('xwui-script-editor-container');
        if (!container) {
            console.error('Ace container not found');
            return;
        }

        const ace = (window as any).ace;
        if (!ace) {
            console.error('Ace Editor not loaded');
            return;
        }

        this.aceEditor = ace.edit(container);
        this.aceEditor.setTheme(this.isDarkMode ? 'ace/theme/tomorrow_night' : 'ace/theme/chrome');
        const aceLang = this.mapGrammarToAce(this.currentGrammar.id);
        this.aceEditor.session.setMode(`ace/mode/${aceLang}`);
        this.aceEditor.setValue(this.data.content || '', -1);
    }
    
    private initHighlightJS(): void {
        const container = document.getElementById('xwui-script-editor-container');
        if (!container) {
            console.error('Highlight.js container not found');
            return;
        }

        const hljs = (window as any).hljs;
        if (!hljs) {
            console.error('Highlight.js not loaded');
            return;
        }

        const lang = this.mapGrammarToHighlightJS(this.currentGrammar.id);
        
        // Use mode to determine if editable or read-only
        if (this.currentMode === 'edit') {
            // Create editable element for edit mode
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `hljs language-${lang}`;
            code.contentEditable = 'true';
            code.textContent = this.data.content || '';
            pre.appendChild(code);
            container.appendChild(pre);
            hljs.highlightElement(code);
            this.highlightjsElement = code;
        } else {
            // Read-only view mode
            container.className = `hljs language-${lang}`;
            container.textContent = this.data.content || '';
            hljs.highlightElement(container);
            this.highlightjsElement = container;
        }
    }
    
    private async initOrion(): Promise<void> {
        const container = document.getElementById('xwui-script-editor-container');
        if (!container) {
            throw new Error('Orion container not found');
        }

        // Wait for Orion to be available
        let retries = 0;
        const maxRetries = 20;
        while (!(window as any).orion && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 50));
            retries++;
        }

        const orion = (window as any).orion;
        if (!orion) {
            // Fallback: Use Monaco instead if Orion is not available
            // Orion requires manual setup and is not available via CDN, so silent fallback is expected
            console.debug('Orion editor not available (requires manual setup). Falling back to Monaco.');
            this.currentEngine = 'monaco';
            await this.loadEditorLibraries();
            await this.initMonaco();
            return;
        }

        // Orion editor initialization
        const lang = this.mapGrammarToMonaco(this.currentGrammar.id); // Orion uses similar language IDs
        this.orionEditor = orion.edit({
            parent: container,
            contents: this.data.content || '',
            language: lang,
            theme: this.isDarkMode ? 'dark' : 'light'
        });
    }
    
    private async initCKEditor(): Promise<void> {
        const container = document.getElementById('xwui-script-editor-container');
        if (!container) {
            throw new Error('CKEditor container not found');
        }

        // Wait for CKEditor to be available
        let retries = 0;
        const maxRetries = 20;
        while (!(window as any).ClassicEditor && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }

        const ClassicEditor = (window as any).ClassicEditor;
        if (!ClassicEditor) {
            // Fallback to Monaco if CKEditor fails to load
            // CKEditor 5 requires a custom build and is not easily available via CDN, so silent fallback is expected
            console.debug('CKEditor not loaded (requires custom build). Falling back to Monaco.');
            this.currentEngine = 'monaco';
            await this.loadEditorLibraries();
            await this.initMonaco();
            return;
        }

        // CKEditor - Note: CKEditor 5 requires custom build with CodeBlock plugin
        // For now, use basic editor without codeBlock toolbar item
        this.ckeditorInstance = await ClassicEditor.create(container, {
            initialData: this.data.content || '',
            toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
            // codeBlock toolbar item requires custom build with CodeBlock plugin
        });
    }
    

    private setupEventListeners(): void {
        // No event listeners needed - component is controlled via props/config
    }

    private setupResizeHandler(): void {
        const container = document.getElementById('xwui-script-editor-container');
        if (container && window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.monacoEditor) {
                    this.monacoEditor.layout();
                }
            });
            this.resizeObserver.observe(container);
        }

        window.addEventListener('resize', () => {
            if (this.monacoEditor) {
                this.monacoEditor.layout();
            }
        });
    }

    public setContent(content: string): void {
        this.data.content = content;

        switch (this.currentEngine) {
            case 'monaco':
                if (this.monacoEditor) {
                    this.monacoEditor.setValue(content);
                }
                break;
            case 'codemirror6':
                if (this.cm6View) {
                    this.cm6View.dispatch({
                        changes: { from: 0, to: this.cm6View.state.doc.length, insert: content }
                    });
                }
                break;
            case 'ace':
                if (this.aceEditor) {
                    this.aceEditor.setValue(content, -1);
                }
                break;
            case 'highlightjs':
                if (this.highlightjsElement) {
                    if (this.currentMode === 'edit' && this.highlightjsElement.contentEditable === 'true') {
                        // Editable mode
                        this.highlightjsElement.textContent = content;
                    } else {
                        // View mode
                        this.highlightjsElement.textContent = content;
                    }
                    const hljs = (window as any).hljs;
                    if (hljs) {
                        hljs.highlightElement(this.highlightjsElement);
                    }
                }
                break;
            case 'orion':
                if (this.orionEditor) {
                    this.orionEditor.setContents(this.currentGrammar.id, content);
                }
                break;
            case 'ckeditor-code':
                if (this.ckeditorInstance) {
                    this.ckeditorInstance.setData(content);
                }
                break;
        }
    }

    public getContent(): string {
        switch (this.currentEngine) {
            case 'monaco':
                return this.monacoEditor?.getValue() || this.data.content || '';
            case 'codemirror6':
                return this.cm6View?.state.doc.toString() || this.data.content || '';
            case 'ace':
                return this.aceEditor?.getValue() || this.data.content || '';
            case 'highlightjs':
                if (this.currentMode === 'edit' && this.highlightjsElement?.contentEditable === 'true') {
                    return this.highlightjsElement?.textContent || this.data.content || '';
                }
                return this.highlightjsElement?.textContent || this.data.content || '';
            case 'orion':
                return this.orionEditor?.getContents() || this.data.content || '';
            case 'ckeditor-code':
                return this.ckeditorInstance?.getData() || this.data.content || '';
            default:
                return this.data.content || '';
        }
    }

    public async setGrammar(grammarId: GrammarType | string): Promise<void> {
        const grammar = getGrammar(grammarId);
        if (!grammar) {
            console.warn(`Unknown grammar: ${grammarId}`);
            return;
        }
        
        this.currentGrammar = grammar;

        // Update based on current engine
        switch (this.currentEngine) {
            case 'monaco':
                if (this.monacoEditor && this.monaco) {
                    // Try to register TextMate grammar
                    try {
                        await registerTextMateGrammarWithMonaco(this.monaco, grammar.id, grammar);
                    } catch (error) {
                        console.debug(`TextMate grammar registration failed for ${grammar.id}:`, error);
                    }
                    const monacoLang = await this.mapGrammarToMonaco(grammar.id);
                    this.monaco.editor.setModelLanguage(this.monacoEditor.getModel(), monacoLang);
                }
                break;
            case 'codemirror6':
                if (this.cm6View && this.cm6Language) {
                    const langMap = (this.cm6View as any)._langMap;
                    if (langMap && langMap[grammar.id]) {
                        this.cm6View.dispatch({
                            effects: this.cm6Language.reconfigure(langMap[grammar.id]())
                        });
                    }
                }
                break;
            case 'ace':
                if (this.aceEditor) {
                    const aceLang = this.mapGrammarToAce(grammar.id);
                    this.aceEditor.session.setMode(`ace/mode/${aceLang}`);
                }
                break;
            case 'highlightjs':
                if (this.highlightjsElement) {
                    const lang = this.mapGrammarToHighlightJS(grammar.id);
                    this.highlightjsElement.className = `hljs language-${lang}`;
                    const hljs = (window as any).hljs;
                    if (hljs) {
                        hljs.highlightElement(this.highlightjsElement);
                    }
                }
                break;
            case 'orion':
                if (this.orionEditor) {
                    const lang = await this.mapGrammarToMonaco(grammar.id);
                    this.orionEditor.setLanguage(lang);
                }
                break;
            case 'ckeditor-code':
                // CKEditor handles grammar internally
                break;
        }
    }

    public getGrammar(): GrammarType {
        return this.currentGrammar.id;
    }
    
    public getEngine(): EditorEngine {
        return this.currentEngine;
    }
    
    /**
     * Set grammar from file name or path by detecting extension
     * @param fileName - File name or path (e.g., "script.js", "/path/to/file.py")
     * @returns true if grammar was detected and set, false otherwise
     */
    public async setGrammarFromFileName(fileName: string): Promise<boolean> {
        const grammar = getGrammarFromFileName(fileName);
        if (grammar) {
            await this.setGrammar(grammar.id);
            return true;
        }
        return false;
    }
    
    /**
     * Set grammar from file extension
     * @param extension - File extension (e.g., "js", "py", "json")
     * @returns true if grammar was detected and set, false otherwise
     */
    public async setGrammarFromExtension(extension: string): Promise<boolean> {
        const grammar = getGrammarFromExtension(extension);
        if (grammar) {
            await this.setGrammar(grammar.id);
            return true;
        }
        return false;
    }

    public async toggleTheme(): Promise<void> {
        this.isDarkMode = !this.isDarkMode;
        document.documentElement.classList.toggle('dark', this.isDarkMode);

        // Update theme toggle knob
        const knob = document.getElementById('xwui-script-editor-theme-toggle-knob');
        const toggle = document.getElementById('xwui-script-editor-theme-toggle');
        if (knob && toggle) {
            toggle.classList.toggle('active', this.isDarkMode);
            knob.style.transform = this.isDarkMode ? 'translateX(1.25rem)' : 'translateX(0)';
        }

        // Update theme based on current engine
        switch (this.currentEngine) {
            case 'monaco':
                if (this.monacoEditor && this.monaco) {
                    this.monaco.editor.setTheme(this.isDarkMode ? 'vs-dark' : 'vs');
                }
                break;
            case 'codemirror6':
                if (this.cm6View && this.cm6Theme && this.cm6ThemeModules) {
                    const { oneDark, defaultHighlightStyle, syntaxHighlighting } = this.cm6ThemeModules;
                    this.cm6View.dispatch({
                        effects: this.cm6Theme.reconfigure(
                            this.isDarkMode ? oneDark : syntaxHighlighting(defaultHighlightStyle)
                        )
                    });
                }
                break;
            case 'ace':
                if (this.aceEditor) {
                    this.aceEditor.setTheme(this.isDarkMode ? 'ace/theme/tomorrow_night' : 'ace/theme/chrome');
                }
                break;
            case 'highlightjs':
                // Highlight.js uses CSS themes, reload with new theme class
                const content = this.getContent();
                this.setContent(content);
                break;
            case 'orion':
                if (this.orionEditor) {
                    this.orionEditor.setTheme(this.isDarkMode ? 'dark' : 'light');
                }
                break;
            case 'ckeditor-code':
                // CKEditor themes are handled via CSS
                break;
        }
    }

    public async destroy(): Promise<void> {
        switch (this.currentEngine) {
            case 'monaco':
                if (this.monacoEditor) {
                    this.monacoEditor.dispose();
                    this.monacoEditor = null;
                }
                break;
            case 'codemirror6':
                if (this.cm6View) {
                    this.cm6View.destroy();
                    this.cm6View = null;
                }
                break;
            case 'ace':
                if (this.aceEditor) {
                    this.aceEditor.destroy();
                    this.aceEditor = null;
                }
                break;
            case 'highlightjs':
                this.highlightjsElement = null;
                break;
            case 'orion':
                if (this.orionEditor) {
                    this.orionEditor.destroy();
                    this.orionEditor = null;
                }
                break;
            case 'ckeditor-code':
                if (this.ckeditorInstance) {
                    await this.ckeditorInstance.destroy();
                    this.ckeditorInstance = null;
                }
                break;
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIScriptEditor as any).componentName = 'XWUIScriptEditor';


// Note: Custom Element is registered via createXWUIElement() in index.ts
