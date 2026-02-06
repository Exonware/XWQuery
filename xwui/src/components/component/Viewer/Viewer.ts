/**
 * Viewer Component
 * JSON viewer and editor component with Monaco editor support
 */

import { governanceApi } from '../../api';
import { Monaco, type MonacoConfig } from '../Monaco';

export interface ViewerConfig {
    showUploadButton?: boolean;
}

export class Viewer {
    private container: HTMLElement;
    private config: ViewerConfig;
    private jsonInput: HTMLTextAreaElement | null = null;
    private jsonEditorContainer: HTMLElement | null = null;
    private htmlEditorContainer: HTMLElement | null = null;
    private htmlCode: HTMLTextAreaElement | null = null;
    private viewContent: HTMLElement | null = null;
    private fileInput: HTMLInputElement | null = null;
    private fileName: HTMLElement | null = null;
    private fileControls: HTMLElement | null = null;
    private jsonMonaco: Monaco | null = null; // Monaco component for JSON
    private htmlMonaco: Monaco | null = null; // Monaco component for HTML
    private resizeObserver: ResizeObserver | null = null;

    constructor(container: HTMLElement, config?: ViewerConfig) {
        console.log('[Viewer] Constructor called');
        console.log('[Viewer] Container:', container);
        console.log('[Viewer] Container ID:', container?.id);
        console.log('[Viewer] Config:', config);
        
        this.container = container;
        this.config = config || { showUploadButton: true }; // Default to showing upload button
        this.init();
    }

    private async init(): Promise<void> {
        this.setupDOM();
        this.setupTabs();
        this.setupFileInput();
        this.setupMessageListener();
        await this.initMonaco();
        this.setupResizeHandler();
    }

    // Public getters for backward compatibility
    public get jsonEditor(): any {
        return this.jsonMonaco?.getEditor() || null;
    }

    public get htmlEditor(): any {
        return this.htmlMonaco?.getEditor() || null;
    }

    private setupDOM(): void {
        console.log('[Viewer] Setting up DOM elements...');
        this.jsonInput = document.getElementById('jsonInput') as HTMLTextAreaElement;
        this.jsonEditorContainer = document.getElementById('jsonEditorContainer');
        this.htmlEditorContainer = document.getElementById('htmlEditorContainer');
        this.htmlCode = document.getElementById('htmlCode') as HTMLTextAreaElement;
        this.viewContent = document.getElementById('viewContent');
        this.fileInput = document.getElementById('fileInput') as HTMLInputElement;
        this.fileName = document.getElementById('fileName');
        
        // Log found elements
        console.log('[Viewer] DOM elements found:', {
            jsonInput: !!this.jsonInput,
            jsonEditorContainer: !!this.jsonEditorContainer,
            htmlEditorContainer: !!this.htmlEditorContainer,
            htmlCode: !!this.htmlCode,
            viewContent: !!this.viewContent,
            fileInput: !!this.fileInput,
            fileName: !!this.fileName
        });
        
        // If not found globally, try within container
        if (!this.jsonEditorContainer && this.container) {
            console.log('[Viewer] JSON container not found globally, searching in container...');
            this.jsonEditorContainer = this.container.querySelector('#jsonEditorContainer') as HTMLElement;
        }
        if (!this.htmlEditorContainer && this.container) {
            console.log('[Viewer] HTML container not found globally, searching in container...');
            this.htmlEditorContainer = this.container.querySelector('#htmlEditorContainer') as HTMLElement;
        }
        
        if (!this.jsonEditorContainer) {
            console.error('[Viewer] ERROR: jsonEditorContainer element not found!');
            console.error('[Viewer] Container HTML:', this.container?.innerHTML?.substring(0, 500));
        } else {
            console.log('[Viewer] JSON container found:', {
                id: this.jsonEditorContainer.id,
                className: this.jsonEditorContainer.className,
                parent: this.jsonEditorContainer.parentElement?.tagName
            });
        }
        if (!this.htmlEditorContainer) {
            console.error('[Viewer] ERROR: htmlEditorContainer element not found!');
        } else {
            console.log('[Viewer] HTML container found:', {
                id: this.htmlEditorContainer.id,
                className: this.htmlEditorContainer.className,
                parent: this.htmlEditorContainer.parentElement?.tagName
            });
        }
        
        // Ensure containers are visible and have dimensions
        if (this.jsonEditorContainer) {
            const style = window.getComputedStyle(this.jsonEditorContainer);
            if (style.display === 'none') {
                console.warn('[Viewer] JSON container is hidden, making it visible');
                this.jsonEditorContainer.style.display = 'block';
            }
        }
        
        // Find file controls container (could be .viewer-file-controls, .file-controls, or parent of fileInput)
        this.fileControls = document.querySelector('.viewer-file-controls') as HTMLElement ||
                           document.querySelector('.file-controls') as HTMLElement ||
                           (this.fileInput?.parentElement as HTMLElement);
        
        // Show/hide upload button based on configuration
        // Default to true if not specified
        const shouldShow = this.config.showUploadButton !== false;
        
        if (this.fileControls) {
            if (!shouldShow) {
                this.fileControls.style.display = 'none';
            } else {
                // Restore display to flex (default for .viewer-file-controls/.file-controls)
                // Check if it's a file controls container (should be flex) or just a parent (could be block)
                if (this.fileControls.classList.contains('viewer-file-controls') || 
                    this.fileControls.classList.contains('file-controls')) {
                    this.fileControls.style.display = 'flex';
                } else {
                    // For parent elements, remove inline style to use CSS default
                    this.fileControls.style.display = '';
                }
            }
        }
    }

    private setupTabs(): void {
        // Set up click handlers for Monaco-style tabs
        const tabs = document.querySelectorAll('.monaco-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                if (tabName) {
                    this.handleTabClick(tabName, tab as HTMLElement);
                }
            });
        });

        // Ensure initial tab state is set (JSON tab should be active by default)
        const activeTab = document.querySelector('.monaco-tab.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('data-tab');
            if (tabName) {
                // Make sure the corresponding tab content is also active
                if (tabName === 'json') {
                    const jsonTab = document.getElementById('jsonTab');
                    if (jsonTab) {
                        jsonTab.classList.add('active');
                    }
                } else if (tabName === 'html') {
                    const htmlTab = document.getElementById('htmlTab');
                    if (htmlTab) {
                        htmlTab.classList.add('active');
                    }
                } else if (tabName === 'view') {
                    const viewTab = document.getElementById('viewTab');
                    if (viewTab) {
                        viewTab.classList.add('active');
                    }
                }
            }
        } else {
            // If no tab is marked active, activate the first one (JSON)
            const firstTab = tabs[0] as HTMLElement;
            if (firstTab) {
                firstTab.classList.add('active');
                const tabName = firstTab.getAttribute('data-tab');
                if (tabName === 'json') {
                    const jsonTab = document.getElementById('jsonTab');
                    if (jsonTab) {
                        jsonTab.classList.add('active');
                    }
                }
            }
        }
    }

    private handleTabClick(tabName: string, tabElement: HTMLElement): void {
        // Update tab active states
        document.querySelectorAll('.monaco-tab').forEach(t => {
            t.classList.remove('active');
        });
        tabElement.classList.add('active');

        // Update tab content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show the appropriate tab content
        if (tabName === 'json') {
            const jsonTab = document.getElementById('jsonTab');
            if (jsonTab) {
                jsonTab.classList.add('active');
            }
            this.showTab('json');
        } else if (tabName === 'html') {
            const htmlTab = document.getElementById('htmlTab');
            if (htmlTab) {
                htmlTab.classList.add('active');
            }
            this.showTab('html');
            // Ensure HTML is generated
            this.processJson();
        } else if (tabName === 'view') {
            const viewTab = document.getElementById('viewTab');
            if (viewTab) {
                viewTab.classList.add('active');
            }
            // Ensure view is rendered
            this.processJson();
        }
    }

    private async initMonaco(): Promise<void> {
        console.log('[Viewer] Starting Monaco initialization...');
        
        try {
            // Check containers
            console.log('[Viewer] JSON container:', this.jsonEditorContainer ? 'found' : 'NOT FOUND');
            console.log('[Viewer] HTML container:', this.htmlEditorContainer ? 'found' : 'NOT FOUND');
            
            if (this.jsonEditorContainer) {
                try {
                    // Check container dimensions
                    const rect = this.jsonEditorContainer.getBoundingClientRect();
                    console.log('[Viewer] JSON container dimensions:', {
                        width: rect.width,
                        height: rect.height,
                        display: window.getComputedStyle(this.jsonEditorContainer).display,
                        visibility: window.getComputedStyle(this.jsonEditorContainer).visibility
                    });
                    
                    if (rect.width === 0 || rect.height === 0) {
                        console.warn('[Viewer] JSON container has zero dimensions, setting minimum size');
                        this.jsonEditorContainer.style.minHeight = '400px';
                        this.jsonEditorContainer.style.minWidth = '100%';
                    }
                    
                    console.log('[Viewer] Initializing JSON Monaco component...');
                    // Initialize JSON Monaco component
                    const jsonConfig: MonacoConfig = {
                        value: '',
                        language: 'json',
                        theme: this.getMonacoTheme(),
                        automaticLayout: true,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        formatOnPaste: true,
                        formatOnType: true,
                    };

                    console.log('[Viewer] Creating JSON Monaco instance with config:', jsonConfig);
                    this.jsonMonaco = new Monaco(this.jsonEditorContainer, jsonConfig);
                    console.log('[Viewer] JSON Monaco instance created');

                    // Wait for Monaco to be ready
                    console.log('[Viewer] Waiting for JSON Monaco to be ready...');
                    await this.waitForMonacoReady(this.jsonMonaco);
                    
                    const isReady = this.jsonMonaco.isReady();
                    console.log('[Viewer] JSON Monaco ready status:', isReady);

                    if (!isReady) {
                        throw new Error('JSON Monaco component did not become ready');
                    }

                    // Hide textarea when Monaco is ready
                    if (this.jsonInput) {
                        this.jsonInput.style.display = 'none';
                        this.jsonInput.setAttribute('data-monaco-active', 'true');
                        console.log('[Viewer] JSON textarea hidden');
                    }
                    this.jsonEditorContainer.style.display = 'block';
                    console.log('[Viewer] JSON editor container displayed');

                    // Listen for changes
                    const editor = this.jsonMonaco.getEditor();
                    if (editor) {
                        editor.onDidChangeModelContent(() => {
                            if (this.processJson) {
                                this.processJson();
                            }
                        });
                        console.log('[Viewer] JSON editor change listener attached');
                    } else {
                        console.warn('[Viewer] JSON editor instance is null, cannot attach change listener');
                    }
                } catch (error) {
                    console.error('[Viewer] Error initializing JSON Monaco:', error);
                    console.error('[Viewer] Error details:', {
                        message: error instanceof Error ? error.message : String(error),
                        stack: error instanceof Error ? error.stack : undefined,
                        container: this.jsonEditorContainer,
                        containerId: this.jsonEditorContainer?.id
                    });
                    // Fallback to textarea
                    if (this.jsonInput) {
                        this.jsonInput.style.display = 'block';
                        console.log('[Viewer] Falling back to JSON textarea');
                    }
                }
            } else {
                console.warn('[Viewer] JSON editor container not found, skipping JSON Monaco initialization');
            }

            if (this.htmlEditorContainer) {
                try {
                    // Check container dimensions
                    const rect = this.htmlEditorContainer.getBoundingClientRect();
                    console.log('[Viewer] HTML container dimensions:', {
                        width: rect.width,
                        height: rect.height,
                        display: window.getComputedStyle(this.htmlEditorContainer).display,
                        visibility: window.getComputedStyle(this.htmlEditorContainer).visibility
                    });
                    
                    if (rect.width === 0 || rect.height === 0) {
                        console.warn('[Viewer] HTML container has zero dimensions, setting minimum size');
                        this.htmlEditorContainer.style.minHeight = '400px';
                        this.htmlEditorContainer.style.minWidth = '100%';
                    }
                    
                    console.log('[Viewer] Initializing HTML Monaco component...');
                    // Initialize HTML Monaco component
                    const htmlConfig: MonacoConfig = {
                        value: '',
                        language: 'html',
                        theme: this.getMonacoTheme(),
                        automaticLayout: true,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        readOnly: true,
                    };

                    console.log('[Viewer] Creating HTML Monaco instance with config:', htmlConfig);
                    this.htmlMonaco = new Monaco(this.htmlEditorContainer, htmlConfig);
                    console.log('[Viewer] HTML Monaco instance created');

                    // Wait for Monaco to be ready
                    console.log('[Viewer] Waiting for HTML Monaco to be ready...');
                    await this.waitForMonacoReady(this.htmlMonaco);
                    
                    const isReady = this.htmlMonaco.isReady();
                    console.log('[Viewer] HTML Monaco ready status:', isReady);

                    if (!isReady) {
                        throw new Error('HTML Monaco component did not become ready');
                    }

                    // Hide textarea when Monaco is ready
                    if (this.htmlCode) {
                        this.htmlCode.style.display = 'none';
                        this.htmlCode.setAttribute('data-monaco-active', 'true');
                        console.log('[Viewer] HTML textarea hidden');
                    }
                    this.htmlEditorContainer.style.display = 'none'; // Hidden by default
                    console.log('[Viewer] HTML editor container hidden (default state)');
                } catch (error) {
                    console.error('[Viewer] Error initializing HTML Monaco:', error);
                    console.error('[Viewer] Error details:', {
                        message: error instanceof Error ? error.message : String(error),
                        stack: error instanceof Error ? error.stack : undefined,
                        container: this.htmlEditorContainer,
                        containerId: this.htmlEditorContainer?.id
                    });
                    // Fallback to textarea
                    if (this.htmlCode) {
                        this.htmlCode.style.display = 'block';
                        console.log('[Viewer] Falling back to HTML textarea');
                    }
                }
            } else {
                console.warn('[Viewer] HTML editor container not found, skipping HTML Monaco initialization');
            }

            // Update theme when it changes
            const themeHandler = (event: MessageEvent) => {
                if (event.data && event.data.type === 'themeChange') {
                    const theme = this.getMonacoTheme(event.data.theme);
                    if (this.jsonMonaco) {
                        this.jsonMonaco.setTheme(theme as 'vs' | 'vs-dark' | 'hc-black');
                    }
                    if (this.htmlMonaco) {
                        this.htmlMonaco.setTheme(theme as 'vs' | 'vs-dark' | 'hc-black');
                    }
                }
            };
            window.addEventListener('message', themeHandler);
            console.log('[Viewer] Theme change listener attached');

            console.log('[Viewer] Monaco initialization completed');
        } catch (error) {
            console.error('[Viewer] Failed to initialize Monaco Editor:', error);
            console.error('[Viewer] Error details:', {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                name: error instanceof Error ? error.name : typeof error
            });
            // Fallback to textarea
            if (this.jsonInput) {
                this.jsonInput.style.display = 'block';
                console.log('[Viewer] Falling back to textarea due to initialization error');
            }
        }
    }

    private async waitForMonacoReady(monaco: Monaco, maxWait: number = 10000): Promise<void> {
        const startTime = Date.now();
        let checkCount = 0;
        while (!monaco.isReady() && (Date.now() - startTime) < maxWait) {
            checkCount++;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const elapsed = Date.now() - startTime;
        if (!monaco.isReady()) {
            console.error(`[Viewer] Monaco editor did not become ready within ${maxWait}ms timeout`);
            console.error(`[Viewer] Waited ${elapsed}ms, checked ${checkCount} times`);
            console.error(`[Viewer] Monaco instance:`, monaco);
        } else {
            console.log(`[Viewer] Monaco editor became ready after ${elapsed}ms (${checkCount} checks)`);
        }
    }

    private getMonacoTheme(theme?: string): 'vs' | 'vs-dark' | 'hc-black' {
        const currentTheme = theme || localStorage.getItem('theme') || 'light';
        const themeMap: { [key: string]: 'vs' | 'vs-dark' | 'hc-black' } = {
            'light': 'vs',
            'dark': 'vs-dark',
            'night': 'vs-dark',
            'silver': 'vs'
        };
        return themeMap[currentTheme] || 'vs';
    }

    private setupResizeHandler(): void {
        // Use ResizeObserver to handle container resizing
        if (this.jsonEditorContainer && window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.jsonMonaco) {
                    this.jsonMonaco.layout();
                }
                if (this.htmlMonaco) {
                    this.htmlMonaco.layout();
                }
            });
            this.resizeObserver.observe(this.jsonEditorContainer);
        }

        // Also listen to window resize
        window.addEventListener('resize', () => {
            if (this.jsonMonaco) {
                this.jsonMonaco.layout();
            }
            if (this.htmlMonaco) {
                this.htmlMonaco.layout();
            }
        });
    }

    private setupFileInput(): void {
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                if (this.fileName) {
                    this.fileName.textContent = file.name;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    
                    // Set value in textarea (fallback)
                    if (this.jsonInput) {
                        this.jsonInput.value = content;
                    }
                    
                    // Set value in Monaco editor (primary)
                    this.setJsonEditorValue(content);
                    
                    // Switch to JSON tab to show the loaded content
                    const jsonTab = document.querySelector('.monaco-tab[data-tab="json"]') as HTMLElement;
                    if (jsonTab) {
                        this.handleTabClick('json', jsonTab);
                    }
                    
                    // Process the JSON after a short delay to ensure Monaco is ready
                    setTimeout(() => {
                        this.processJson();
                    }, 200);
                };
                reader.onerror = (error) => {
                    console.error('File read error:', error);
                    alert('Error reading file');
                };
                reader.readAsText(file);
            });
        }
    }

    private setupMessageListener(): void {
        window.addEventListener('message', async (event) => {
            if (event.data && event.data.type === 'loadGovernanceFile') {
                await this.loadGovernanceFile(event.data);
            }
        });
    }

    private async loadGovernanceFile(data: {
        url?: string;
        fallbackUrl?: string;
        category: string;
        fileId: string;
        data?: any; // Pre-loaded data from Menu component
    }): Promise<void> {
        try {
            let jsonData: any;

            // If data is already provided (from Menu API call), use it
            if (data.data) {
                jsonData = data.data;
            } else {
                // Otherwise, use the API client
                jsonData = await governanceApi.getGovernanceFileWithFallback(
                    data.category,
                    data.fileId
                );
            }

            const jsonString = JSON.stringify(jsonData, null, 2);
            
            if (this.jsonInput) {
                this.jsonInput.value = jsonString;
            }
            
            if (this.setJsonEditorValue) {
                this.setJsonEditorValue(jsonString);
            }
            
            if (this.fileName) {
                this.fileName.textContent = `${data.category}/${data.fileId}.json`;
            }
            
            if (this.processJson) {
                this.processJson();
            }
            
            setTimeout(() => {
                if (this.processJson) {
                    this.processJson();
                }
            }, 500);
        } catch (error) {
            console.error('Error loading governance file:', error);
            alert(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public processJson(): void {
        const jsonValue = this.getJsonValue();
        if (!jsonValue) return;

        try {
            const data = JSON.parse(jsonValue);
            
            // Update view content
            if (this.viewContent) {
                this.viewContent.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word;">' + 
                    JSON.stringify(data, null, 2) + '</pre>';
            }

            // Generate HTML representation (basic)
            const htmlContent = this.generateHtmlFromJson(data);
            this.setHtmlEditorValue(htmlContent);
            
        } catch (e) {
            console.error('JSON parse error:', e);
            if (this.viewContent) {
                this.viewContent.innerHTML = `<div style="color: var(--accent-error); padding: 20px;">Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}</div>`;
            }
        }
    }

    private generateHtmlFromJson(data: any): string {
        // Basic HTML generation - can be enhanced
        const jsonString = JSON.stringify(data, null, 2);
        return `<!DOCTYPE html>
<html>
<head>
    <title>JSON View</title>
    <style>
        body { font-family: system-ui, sans-serif; padding: 20px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <pre>${jsonString}</pre>
</body>
</html>`;
    }

    public setJsonEditorValue(value: string): void {
        try {
            if (this.jsonMonaco) {
                if (this.jsonMonaco.isReady()) {
                    this.jsonMonaco.setValue(value);
                    console.log('[Viewer] Set JSON value via Monaco component');
                } else {
                    console.warn('[Viewer] JSON Monaco not ready, setting value anyway');
                    this.jsonMonaco.setValue(value);
                }
                // Ensure the editor container is visible
                if (this.jsonEditorContainer) {
                    this.jsonEditorContainer.style.display = 'block';
                }
                // Hide textarea if Monaco is active
                if (this.jsonInput) {
                    this.jsonInput.style.display = 'none';
                }
            } else if (this.jsonInput) {
                console.warn('[Viewer] JSON Monaco not available, using textarea fallback');
                this.jsonInput.value = value;
                // Show textarea if Monaco is not ready
                if (this.jsonEditorContainer) {
                    this.jsonEditorContainer.style.display = 'none';
                }
                this.jsonInput.style.display = 'block';
            } else {
                console.error('[Viewer] Neither JSON Monaco nor textarea available!');
            }
        } catch (error) {
            console.error('[Viewer] Error setting JSON editor value:', error);
        }
    }

    public setHtmlEditorValue(value: string): void {
        try {
            if (this.htmlMonaco) {
                if (this.htmlMonaco.isReady()) {
                    this.htmlMonaco.setValue(value);
                    console.log('[Viewer] Set HTML value via Monaco component');
                } else {
                    console.warn('[Viewer] HTML Monaco not ready, setting value anyway');
                    this.htmlMonaco.setValue(value);
                }
            } else if (this.htmlCode) {
                console.warn('[Viewer] HTML Monaco not available, using textarea fallback');
                this.htmlCode.value = value;
            } else {
                console.error('[Viewer] Neither HTML Monaco nor textarea available!');
            }
        } catch (error) {
            console.error('[Viewer] Error setting HTML editor value:', error);
        }
    }

    public getJsonValue(): string {
        try {
            if (this.jsonMonaco && this.jsonMonaco.isReady()) {
                return this.jsonMonaco.getValue();
            } else if (this.jsonInput) {
                return this.jsonInput.value;
            }
            return '';
        } catch (error) {
            console.error('[Viewer] Error getting JSON value:', error);
            if (this.jsonInput) {
                return this.jsonInput.value;
            }
            return '';
        }
    }

    public showTab(tabName: 'json' | 'html' | 'view'): void {
        // Show/hide Monaco editors based on tab
        if (tabName === 'json') {
            if (this.jsonEditorContainer) {
                this.jsonEditorContainer.style.display = 'block';
            }
            if (this.htmlEditorContainer) {
                this.htmlEditorContainer.style.display = 'none';
            }
            // Ensure JSON tab content is visible
            const jsonTab = document.getElementById('jsonTab');
            if (jsonTab) {
                jsonTab.classList.add('active');
            }
        } else if (tabName === 'html') {
            if (this.htmlEditorContainer) {
                this.htmlEditorContainer.style.display = 'block';
            }
            if (this.jsonEditorContainer) {
                this.jsonEditorContainer.style.display = 'none';
            }
            // Ensure HTML tab content is visible
            const htmlTab = document.getElementById('htmlTab');
            if (htmlTab) {
                htmlTab.classList.add('active');
            }
            // Trigger layout update
            setTimeout(() => {
                if (this.htmlMonaco) {
                    this.htmlMonaco.layout();
                }
            }, 100);
        } else if (tabName === 'view') {
            // Hide both editors for view tab
            if (this.jsonEditorContainer) {
                this.jsonEditorContainer.style.display = 'none';
            }
            if (this.htmlEditorContainer) {
                this.htmlEditorContainer.style.display = 'none';
            }
            // Ensure view tab content is visible
            const viewTab = document.getElementById('viewTab');
            if (viewTab) {
                viewTab.classList.add('active');
            }
        }
    }

    public setShowUploadButton(show: boolean): void {
        this.config.showUploadButton = show;
        if (this.fileControls) {
            if (!show) {
                this.fileControls.style.display = 'none';
            } else {
                // Restore display to flex (default for .viewer-file-controls/.file-controls)
                if (this.fileControls.classList.contains('viewer-file-controls') || 
                    this.fileControls.classList.contains('file-controls')) {
                    this.fileControls.style.display = 'flex';
                } else {
                    // For parent elements, remove inline style to use CSS default
                    this.fileControls.style.display = '';
                }
            }
        }
    }

    public destroy(): void {
        if (this.jsonMonaco) {
            this.jsonMonaco.dispose();
            this.jsonMonaco = null;
        }
        if (this.htmlMonaco) {
            this.htmlMonaco.dispose();
            this.htmlMonaco = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }
}

