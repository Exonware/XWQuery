/**
 * DocumentViewer Component
 * Simple wrapper around Monaco component with tab structure
 */

import { Monaco, type MonacoConfig, type MonacoLanguage, type MonacoTheme } from '../Monaco/Monaco';

export type DocumentViewerConfig = MonacoConfig;

export class DocumentViewer {
    private container: HTMLElement;
    private monaco: Monaco;
    private tabContainer!: HTMLElement;
    private jsonTabContent!: HTMLElement;
    private htmlTabContent!: HTMLElement;
    private renderTabContent!: HTMLElement;
    private monacoContainer!: HTMLElement;
    private htmlContainer!: HTMLElement;
    private renderContainer!: HTMLElement;
    private activeTab: 'json' | 'html' | 'render' = 'json';

    constructor(container: HTMLElement, config?: DocumentViewerConfig) {
        this.container = container;
        this.loadCSS();
        this.setupDOM();
        this.setupTabs();
        this.monaco = new Monaco(this.monacoContainer, config);
    }

    private loadCSS(): void {
        // Check if CSS is already loaded (by ID or by href containing DocumentViewer.css)
        const existingLinkById = document.getElementById('document-viewer-stylesheet');
        if (existingLinkById) {
            return;
        }
        
        // Check if CSS is already loaded via HTML link tag
        const allLinks = document.querySelectorAll('link[rel="stylesheet"]');
        for (let i = 0; i < allLinks.length; i++) {
            const href = (allLinks[i] as HTMLLinkElement).href;
            if (href && href.includes('DocumentViewer.css')) {
                return; // CSS already loaded
            }
        }

        // Create and append stylesheet link
        const link = document.createElement('link');
        link.id = 'document-viewer-stylesheet';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        
        // Try to determine the base path
        const scripts = document.getElementsByTagName('script');
        let basePath = '/static/';
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src.includes('/dist/')) {
                // Extract base path from script src
                const match = src.match(/(.*\/)dist\//);
                if (match) {
                    basePath = match[1];
                    break;
                }
            }
        }
        
        // Try multiple possible paths
        const possiblePaths = [
            `${basePath}dist/components/DocumentViewer/DocumentViewer.css`,
            `${basePath}components/DocumentViewer/DocumentViewer.css`,
            '/static/dist/components/DocumentViewer/DocumentViewer.css',
            '/frontend/dist/components/DocumentViewer/DocumentViewer.css',
            '../../dist/components/DocumentViewer/DocumentViewer.css'
        ];

        // Use the first path for now - if it fails, the styles will just not load
        // In production, you'd want to handle this more robustly
        link.href = possiblePaths[0];
        document.head.appendChild(link);
    }

    private setupDOM(): void {
        // Clear container
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.height = '100%';
        this.container.style.width = '100%';
        this.container.style.minHeight = '0';
        this.container.style.overflow = 'hidden';

        // Create tab structure
        this.tabContainer = document.createElement('div');
        this.tabContainer.className = 'document-viewer-tabs';
        
        // Create JSON tab
        const jsonTab = document.createElement('div');
        jsonTab.className = 'document-viewer-tab active';
        jsonTab.setAttribute('data-tab', 'json');
        jsonTab.textContent = 'JSON';
        
        // Create HTML tab
        const htmlTab = document.createElement('div');
        htmlTab.className = 'document-viewer-tab';
        htmlTab.setAttribute('data-tab', 'html');
        htmlTab.textContent = 'HTML';
        
        // Create RENDER tab
        const renderTab = document.createElement('div');
        renderTab.className = 'document-viewer-tab';
        renderTab.setAttribute('data-tab', 'render');
        renderTab.textContent = 'RENDER';
        
        this.tabContainer.appendChild(jsonTab);
        this.tabContainer.appendChild(htmlTab);
        this.tabContainer.appendChild(renderTab);
        this.container.appendChild(this.tabContainer);

        // Create JSON tab content with Monaco
        this.jsonTabContent = document.createElement('div');
        this.jsonTabContent.className = 'document-viewer-tab-content active';
        this.jsonTabContent.id = 'documentViewerJsonTab';

        this.monacoContainer = document.createElement('div');
        this.monacoContainer.className = 'document-viewer-monaco-container';
        this.jsonTabContent.appendChild(this.monacoContainer);

        // Create HTML tab content
        this.htmlTabContent = document.createElement('div');
        this.htmlTabContent.className = 'document-viewer-tab-content';
        this.htmlTabContent.id = 'documentViewerHtmlTab';

        this.htmlContainer = document.createElement('div');
        this.htmlContainer.className = 'document-viewer-html-container';
        this.htmlContainer.textContent = 'HTML content will appear here';
        this.htmlTabContent.appendChild(this.htmlContainer);

        // Create RENDER tab content
        this.renderTabContent = document.createElement('div');
        this.renderTabContent.className = 'document-viewer-tab-content';
        this.renderTabContent.id = 'documentViewerRenderTab';

        this.renderContainer = document.createElement('div');
        this.renderContainer.className = 'document-viewer-render-container';
        this.renderContainer.textContent = 'Rendered content will appear here';
        this.renderTabContent.appendChild(this.renderContainer);

        // Append all tab contents
        this.container.appendChild(this.jsonTabContent);
        this.container.appendChild(this.htmlTabContent);
        this.container.appendChild(this.renderTabContent);
    }

    private setupTabs(): void {
        // Set up click handlers for tabs
        const tabs = this.tabContainer.querySelectorAll('.document-viewer-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab') as 'json' | 'html' | 'render';
                if (tabName) {
                    this.handleTabClick(tabName, tab as HTMLElement);
                }
            });
        });
    }

    private handleTabClick(tabName: 'json' | 'html' | 'render', tabElement: HTMLElement): void {
        // Update tab active states
        this.tabContainer.querySelectorAll('.document-viewer-tab').forEach(t => {
            t.classList.remove('active');
        });
        tabElement.classList.add('active');

        // Update tab content visibility - hide all first
        this.jsonTabContent.classList.remove('active');
        this.htmlTabContent.classList.remove('active');
        this.renderTabContent.classList.remove('active');

        // Show the appropriate tab content
        this.activeTab = tabName;
        if (tabName === 'json') {
            this.jsonTabContent.classList.add('active');
            // Layout Monaco when switching back to JSON tab
            if (this.monaco.isReady()) {
                setTimeout(() => this.monaco.layout(), 100);
            }
        } else if (tabName === 'html') {
            this.htmlTabContent.classList.add('active');
            this.updateHtmlContent();
        } else if (tabName === 'render') {
            this.renderTabContent.classList.add('active');
            this.updateRenderContent();
        }
    }

    private updateHtmlContent(): void {
        // For now, just show a placeholder or the JSON value as HTML
        // You can enhance this later to convert JSON to HTML
        const jsonValue = this.monaco.getValue();
        this.htmlContainer.textContent = jsonValue || 'No content';
    }

    private updateRenderContent(): void {
        // For now, just show a placeholder
        // You can enhance this later to render HTML content
        const jsonValue = this.monaco.getValue();
        this.renderContainer.textContent = jsonValue || 'No content to render';
    }

    public getValue(): string {
        return this.monaco.getValue();
    }

    public setValue(value: string): void {
        this.monaco.setValue(value);
    }

    public setLanguage(language: MonacoLanguage): void {
        this.monaco.setLanguage(language);
    }

    public setTheme(theme: MonacoTheme): void {
        this.monaco.setTheme(theme);
    }

    public isReady(): boolean {
        return this.monaco.isReady();
    }

    public getEditor(): any {
        return this.monaco.getEditor();
    }

    public layout(): void {
        this.monaco.layout();
    }

    public destroy(): void {
        this.monaco.dispose();
    }
}
