/**
 * ScriptStudio Component
 * VS Code-like IDE interface with Monaco Editor, file explorer, and terminal
 */

export type Language = 'typescript' | 'javascript' | 'css' | 'json' | 'html';

export interface FileNode {
    id: string;
    name: string;
    language: Language;
    content: string;
}

export interface ScriptStudioConfig {
    files?: FileNode[];
    initialFileId?: string;
    showSidebar?: boolean;
    height?: string;
}

const DEFAULT_FILES: FileNode[] = [
    {
        id: '1',
        name: 'main.ts',
        language: 'typescript',
        content: `// Welcome to the Monaco Editor
// Try editing this TypeScript code

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

const fetchUser = async (id: number): Promise<User> => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        username: "dev_wizard",
        isAdmin: true
      });
    }, 1000);
  });
};

fetchUser(1).then(user => {
  console.log(\`User loaded: \${user.username}\`);
});
`
    },
    {
        id: '2',
        name: 'styles.css',
        language: 'css',
        content: `.container {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #1e1e1e;
}

.title {
  color: #61dafb;
  font-size: 1.5rem;
  font-weight: bold;
}
`
    },
    {
        id: '3',
        name: 'config.json',
        language: 'json',
        content: `{
  "appName": "MonacoDemo",
  "version": "1.0.0",
  "features": {
    "darkMode": true,
    "betaAccess": false
  }
}`
    }
];

export class ScriptStudio {
    private container: HTMLElement;
    private config: ScriptStudioConfig;
    private files: FileNode[];
    private activeFileId: string;
    private isSidebarOpen: boolean;
    private output: string = 'Ready...';
    
    private monacoEditor: any = null;
    private monaco: any = null;
    private resizeObserver: ResizeObserver | null = null;
    
    // DOM references
    private editorContainer: HTMLElement | null = null;
    private sidebarElement: HTMLElement | null = null;
    private tabBarElement: HTMLElement | null = null;
    private outputPanel: HTMLElement | null = null;
    private statusBar: HTMLElement | null = null;

    constructor(container: HTMLElement, config?: ScriptStudioConfig) {
        this.container = container;
        this.config = config || {};
        this.files = config?.files || [...DEFAULT_FILES];
        this.activeFileId = config?.initialFileId || this.files[0]?.id || '';
        this.isSidebarOpen = config?.showSidebar !== false;
        this.init();
    }

    private async init(): Promise<void> {
        try {
            this.setupDOM();
            this.setupEventListeners();
            await this.loadMonaco();
            await this.initializeMonaco();
            this.setupResizeHandler();
        } catch (error) {
            console.error('ScriptStudio initialization error:', error);
            const loadingEl = document.getElementById('script-studio-editor-loading');
            if (loadingEl) {
                loadingEl.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                loadingEl.style.color = '#f48771';
            }
        }
    }

    private setupDOM(): void {
        const height = this.config.height || '100%';
        
        this.container.innerHTML = `
            <div class="script-studio-wrapper" style="height: ${height};">
                <!-- Activity Bar -->
                <div class="script-studio-activity-bar">
                    <div class="script-studio-activity-icon active" data-activity="explorer" title="Explorer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
                        </svg>
                    </div>
                    <div class="script-studio-activity-icon" data-activity="search" title="Search">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                    </div>
                    <div class="script-studio-activity-icon" data-activity="settings" title="Settings">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
                        </svg>
                    </div>
                </div>

                <!-- Sidebar -->
                ${this.isSidebarOpen ? `
                <div class="script-studio-sidebar">
                    <div class="script-studio-sidebar-header">
                        EXPLORER
                    </div>
                    <div class="script-studio-sidebar-content">
                        <div class="script-studio-file-tree">
                            <div class="script-studio-file-tree-header">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 4px;">
                                    <path d="M2 2v12h12V2H2zm0-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                </svg>
                                PROJECT
                            </div>
                            <div class="script-studio-file-list" id="script-studio-file-list">
                                ${this.files.map(file => `
                                    <div class="script-studio-file-item ${this.activeFileId === file.id ? 'active' : ''}" 
                                         data-file-id="${file.id}">
                                        ${this.getFileIcon(file.language)}
                                        <span>${file.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Main Content -->
                <div class="script-studio-main">
                    <!-- Tab Bar -->
                    <div class="script-studio-tab-bar" id="script-studio-tab-bar">
                        ${this.files.map(file => `
                            <div class="script-studio-tab ${this.activeFileId === file.id ? 'active' : ''}" 
                                 data-file-id="${file.id}">
                                ${this.getFileIcon(file.language)}
                                <span>${file.name}</span>
                                ${this.activeFileId === file.id ? `
                                    <svg class="script-studio-tab-close" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="3" y1="3" x2="11" y2="11"/>
                                        <line x1="11" y1="3" x2="3" y2="11"/>
                                    </svg>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Toolbar -->
                    <div class="script-studio-toolbar">
                        <div class="script-studio-toolbar-path">
                            <span id="script-studio-file-path">${this.getActiveFile()?.name || ''}</span>
                            <span class="script-studio-path-separator">&gt;</span>
                            <span>src</span>
                        </div>
                        <button class="script-studio-run-button" id="script-studio-run-button">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M2 2l8 4-8 4V2z"/>
                            </svg>
                            Run File
                        </button>
                    </div>

                    <!-- Editor Container -->
                    <div class="script-studio-editor-container">
                        <div id="script-studio-editor" class="script-studio-editor"></div>
                        <div class="script-studio-editor-loading" id="script-studio-editor-loading">
                            Loading Editor Engine...
                        </div>
                    </div>

                    <!-- Bottom Panel -->
                    <div class="script-studio-panel">
                        <div class="script-studio-panel-tabs">
                            <div class="script-studio-panel-tab active" data-panel="output">Output</div>
                            <div class="script-studio-panel-tab" data-panel="problems">Problems</div>
                            <div class="script-studio-panel-tab" data-panel="terminal">Terminal</div>
                        </div>
                        <div class="script-studio-panel-content" id="script-studio-panel-content">
                            <pre class="script-studio-output">${this.output}</pre>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="script-studio-status-bar">
                        <div class="script-studio-status-left">
                            <div class="script-studio-status-item">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                                    <circle cx="5" cy="5" r="4"/>
                                </svg>
                                <span>master*</span>
                            </div>
                            <div class="script-studio-status-item">0 errors, 0 warnings</div>
                        </div>
                        <div class="script-studio-status-right">
                            <div class="script-studio-status-item">Ln 12, Col 45</div>
                            <div class="script-studio-status-item">UTF-8</div>
                            <div class="script-studio-status-item">${this.getActiveFile()?.language === 'typescript' ? 'TypeScript' : (this.getActiveFile()?.language || '').toUpperCase()}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Store DOM references
        this.editorContainer = document.getElementById('script-studio-editor');
        this.sidebarElement = this.container.querySelector('.script-studio-sidebar');
        this.tabBarElement = document.getElementById('script-studio-tab-bar');
        this.outputPanel = document.getElementById('script-studio-panel-content');
        this.statusBar = this.container.querySelector('.script-studio-status-bar');
    }

    private getFileIcon(language: Language): string {
        const icons: { [key in Language]: string } = {
            typescript: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#4A9EFF"><path d="M1 1h14v14H1V1zm13 13V2H2v12h12zM8 3H7v5h1V3zm3 0H9v1h1v4h1V3z"/></svg>`,
            javascript: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#F7DF1E"><path d="M1 1h14v14H1V1zm13 13V2H2v12h12zM8 3H7v5h1V3zm3 0H9v1h1v4h1V3z"/></svg>`,
            css: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#1572B6"><path d="M1 1h14v14H1V1zm13 13V2H2v12h12z"/></svg>`,
            json: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#F7DF1E"><path d="M1 1h14v14H1V1zm13 13V2H2v12h12z"/></svg>`,
            html: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#E34F26"><path d="M1 1h14v14H1V1zm13 13V2H2v12h12z"/></svg>`
        };
        return icons[language] || `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 1h14v14H1V1zm13 13V2H2v12h12z"/></svg>`;
    }

    private getActiveFile(): FileNode | undefined {
        return this.files.find(f => f.id === this.activeFileId);
    }

    private async loadMonaco(): Promise<void> {
        return new Promise((resolve, reject) => {
            if ((window as any).monaco) {
                this.monaco = (window as any).monaco;
                resolve();
                return;
            }

            if ((window as any).require) {
                (window as any).require.config({
                    paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
                });
                (window as any).require(['vs/editor/editor.main'], () => {
                    this.monaco = (window as any).monaco;
                    resolve();
                });
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
            script.async = true;
            script.onload = () => {
                const require = (window as any).require;
                if (require) {
                    require.config({
                        paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
                    });
                    require(['vs/editor/editor.main'], () => {
                        this.monaco = (window as any).monaco;
                        resolve();
                    });
                } else {
                    reject(new Error('Monaco loader not found'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load Monaco Editor'));
            document.body.appendChild(script);
        });
    }

    private async initializeMonaco(): Promise<void> {
        if (!this.editorContainer) {
            console.error('ScriptStudio: Editor container not found');
            return;
        }

        if (!this.monaco) {
            console.error('ScriptStudio: Monaco not loaded');
            const loadingEl = document.getElementById('script-studio-editor-loading');
            if (loadingEl) {
                loadingEl.textContent = 'Failed to load Monaco Editor. Please check your internet connection.';
                loadingEl.style.color = '#f48771';
            }
            return;
        }

        const activeFile = this.getActiveFile();
        if (!activeFile) {
            console.error('ScriptStudio: No active file');
            return;
        }

        // Hide loading indicator
        const loadingEl = document.getElementById('script-studio-editor-loading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }

        // Create Monaco editor
        const uri = this.monaco.Uri.parse(`file:///${activeFile.name}`);
        let model = this.monaco.editor.getModel(uri);
        
        if (!model) {
            model = this.monaco.editor.createModel(activeFile.content, activeFile.language, uri);
        } else {
            model.setValue(activeFile.content);
            this.monaco.editor.setModelLanguage(model, activeFile.language);
        }

        this.monacoEditor = this.monaco.editor.create(this.editorContainer, {
            model: model,
            theme: this.getMonacoTheme(),
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Consolas', monospace",
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'all'
        });

        // Listen for content changes
        this.monacoEditor.onDidChangeModelContent(() => {
            const value = this.monacoEditor.getValue();
            this.updateFileContent(this.activeFileId, value);
        });

        // Listen for cursor position changes
        this.monacoEditor.onDidChangeCursorPosition((e: any) => {
            this.updateStatusBar(e.position.lineNumber, e.position.column);
        });
    }

    private getMonacoTheme(): string {
        const theme = localStorage.getItem('theme') || 'light';
        const themeMap: { [key: string]: string } = {
            'light': 'vs',
            'dark': 'vs-dark',
            'night': 'vs-dark',
            'silver': 'vs'
        };
        return themeMap[theme] || 'vs-dark';
    }

    private setupEventListeners(): void {
        // File list items
        const fileItems = this.container.querySelectorAll('.script-studio-file-item');
        fileItems.forEach(item => {
            item.addEventListener('click', () => {
                const fileId = (item as HTMLElement).getAttribute('data-file-id');
                if (fileId) {
                    this.switchFile(fileId);
                }
            });
        });

        // Tab items
        const tabs = this.container.querySelectorAll('.script-studio-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const closeBtn = target.closest('.script-studio-tab-close');
                if (closeBtn) {
                    e.stopPropagation();
                    // Close tab functionality (optional)
                    return;
                }
                const fileId = (tab as HTMLElement).getAttribute('data-file-id');
                if (fileId) {
                    this.switchFile(fileId);
                }
            });
        });

        // Run button
        const runButton = document.getElementById('script-studio-run-button');
        if (runButton) {
            runButton.addEventListener('click', () => {
                this.runCode();
            });
        }

        // Activity bar icons
        const activityIcons = this.container.querySelectorAll('.script-studio-activity-icon');
        activityIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const activity = (icon as HTMLElement).getAttribute('data-activity');
                // Handle activity switching (explorer, search, settings)
            });
        });

        // Panel tabs
        const panelTabs = this.container.querySelectorAll('.script-studio-panel-tab');
        panelTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const panel = (tab as HTMLElement).getAttribute('data-panel');
                this.switchPanel(panel || 'output');
            });
        });
    }

    private switchFile(fileId: string): void {
        if (this.activeFileId === fileId) {
            return;
        }

        this.activeFileId = fileId;
        const activeFile = this.getActiveFile();
        if (!activeFile) {
            return;
        }

        // Update file list
        const fileItems = this.container.querySelectorAll('.script-studio-file-item');
        fileItems.forEach(item => {
            if ((item as HTMLElement).getAttribute('data-file-id') === fileId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update tabs
        const tabs = this.container.querySelectorAll('.script-studio-tab');
        tabs.forEach(tab => {
            if ((tab as HTMLElement).getAttribute('data-file-id') === fileId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update file path
        const filePathEl = document.getElementById('script-studio-file-path');
        if (filePathEl) {
            filePathEl.textContent = activeFile.name;
        }

        // Update Monaco editor
        if (this.monacoEditor && this.monaco) {
            const uri = this.monaco.Uri.parse(`file:///${activeFile.name}`);
            let model = this.monaco.editor.getModel(uri);
            
            if (!model) {
                model = this.monaco.editor.createModel(activeFile.content, activeFile.language, uri);
            } else {
                model.setValue(activeFile.content);
            }
            
            this.monaco.editor.setModelLanguage(model, activeFile.language);
            this.monacoEditor.setModel(model);
        }

        // Update status bar language
        const statusLang = this.statusBar?.querySelector('.script-studio-status-right .script-studio-status-item:last-child');
        if (statusLang) {
            statusLang.textContent = activeFile.language === 'typescript' ? 'TypeScript' : activeFile.language.toUpperCase();
        }
    }

    private updateFileContent(fileId: string, content: string): void {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
            file.content = content;
        }
    }

    private updateStatusBar(line: number, column: number): void {
        const statusPos = this.statusBar?.querySelector('.script-studio-status-right .script-studio-status-item:first-child');
        if (statusPos) {
            statusPos.textContent = `Ln ${line}, Col ${column}`;
        }
    }

    private switchPanel(panel: string): void {
        const panelTabs = this.container.querySelectorAll('.script-studio-panel-tab');
        panelTabs.forEach(tab => {
            if ((tab as HTMLElement).getAttribute('data-panel') === panel) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update panel content based on panel type
        if (this.outputPanel) {
            if (panel === 'output') {
                this.outputPanel.innerHTML = `<pre class="script-studio-output">${this.output}</pre>`;
            } else if (panel === 'problems') {
                this.outputPanel.innerHTML = `<pre class="script-studio-output">No problems detected.</pre>`;
            } else if (panel === 'terminal') {
                this.outputPanel.innerHTML = `<pre class="script-studio-output">Terminal ready...</pre>`;
            }
        }
    }

    private runCode(): void {
        const activeFile = this.getActiveFile();
        if (!activeFile) {
            return;
        }

        if (activeFile.language === 'typescript' || activeFile.language === 'javascript') {
            this.output = 'Running code...';
            this.switchPanel('output');
            
            setTimeout(() => {
                this.output = `> Executed ${activeFile.name}\n> Process finished with exit code 0`;
                if (this.outputPanel) {
                    this.outputPanel.innerHTML = `<pre class="script-studio-output">${this.output}</pre>`;
                }
            }, 800);
        } else {
            this.output = `Cannot execute ${activeFile.language} files directly.`;
            this.switchPanel('output');
            if (this.outputPanel) {
                this.outputPanel.innerHTML = `<pre class="script-studio-output">${this.output}</pre>`;
            }
        }
    }

    private setupResizeHandler(): void {
        if (this.editorContainer && window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.monacoEditor) {
                    this.monacoEditor.layout();
                }
            });
            this.resizeObserver.observe(this.editorContainer);
        }

        window.addEventListener('resize', () => {
            if (this.monacoEditor) {
                this.monacoEditor.layout();
            }
        });
    }

    public getContent(fileId?: string): string {
        const targetFileId = fileId || this.activeFileId;
        const file = this.files.find(f => f.id === targetFileId);
        return file?.content || '';
    }

    public setContent(fileId: string, content: string): void {
        const file = this.files.find(f => f.id === fileId);
        if (file) {
            file.content = content;
            if (fileId === this.activeFileId && this.monacoEditor) {
                this.monacoEditor.setValue(content);
            }
        }
    }

    public addFile(file: FileNode): void {
        this.files.push(file);
        // Re-render would be needed, or just add to DOM
        this.refreshFileList();
    }

    public removeFile(fileId: string): void {
        this.files = this.files.filter(f => f.id !== fileId);
        if (this.activeFileId === fileId && this.files.length > 0) {
            this.switchFile(this.files[0].id);
        }
        this.refreshFileList();
    }

    private refreshFileList(): void {
        // This would need to re-render the file list and tabs
        // For now, just a placeholder
    }

    public destroy(): void {
        if (this.monacoEditor) {
            this.monacoEditor.dispose();
            this.monacoEditor = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }
}

