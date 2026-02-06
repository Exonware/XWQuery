/**
 * Menu Component
 * Governance menu component with tree structure
 */

import { governanceApi } from '../../api';
import type { GovernanceData, GovernanceItem, GovernanceCategory } from '../../api/types';

export class Menu {
    private container: HTMLElement;
    private contentContainer: HTMLElement | null = null;
    private governanceData: GovernanceData | null = null;
    private activeItem: { category: string; fileId: string } | null = null;
    private apiBase: string;

    private readonly categoryIcons: Record<string, string> = {
        "standards": "📋",
        "bylaws": "⚖️",
        "strategies": "🎯",
        "od": "🏢",
        "policies": "📜",
        "processes": "⚙️",
        "procedures": "📝"
    };

    private readonly categoryNames: Record<string, string> = {
        "standards": "Standards",
        "bylaws": "Bylaws",
        "strategies": "Strategies",
        "od": "Organizational Design",
        "policies": "Policies",
        "processes": "Processes",
        "procedures": "Procedures"
    };

    constructor(container: HTMLElement) {
        this.container = container;
        this.apiBase = window.location.origin;
        this.init();
    }

    private init(): void {
        this.setupDOM();
        this.setupTheme();
        this.loadGovernanceIndex();
    }

    private setupDOM(): void {
        this.contentContainer = document.getElementById('menuContent');
        if (!this.contentContainer) {
            this.contentContainer = document.createElement('div');
            this.contentContainer.id = 'menuContent';
            this.contentContainer.className = 'menu-content';
            this.container.appendChild(this.contentContainer);
        }
    }

    private setupTheme(): void {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'themeChange') {
                document.documentElement.setAttribute('data-theme', event.data.theme);
            }
        });

        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    private async loadGovernanceIndex(): Promise<void> {
        if (!this.contentContainer) return;

        this.contentContainer.innerHTML = '<div class="menu-loading">Loading governance index...</div>';

        try {
            // Use the API client with automatic fallback
            this.governanceData = await governanceApi.getGovernanceIndexWithFallback();
            
            if (this.governanceData) {
                console.log(`Governance index loaded, ${Object.keys(this.governanceData).length} categories`);
            }
            this.renderTree();
        } catch (error) {
            console.error('Error loading governance index:', error);
            if (this.contentContainer) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                this.contentContainer.innerHTML = `
                    <div class="menu-error">
                        Error loading governance index: ${errorMessage}<br>
                        <small>Tip: Run the backend server with: <code>python backend/server.py</code></small>
                    </div>
                `;
            }
        }
    }

    private renderTree(): void {
        if (!this.contentContainer || !this.governanceData || Object.keys(this.governanceData).length === 0) {
            if (this.contentContainer) {
                this.contentContainer.innerHTML = '<div class="menu-empty">No governance documents found</div>';
            }
            return;
        }

        const treeHtml = Object.entries(this.governanceData)
            .map(([categoryKey, categoryData]) => {
                const itemsHtml = categoryData.items && categoryData.items.length > 0
                    ? categoryData.items.map(item => {
                        const itemId = `${categoryKey}-${item.id}`;
                        const displayText = item.id || item.code || item.filename.replace('.json', '');
                        return `
                            <div class="tree-item" data-category="${categoryKey}" data-id="${item.id}" data-file="${item.filename}" onclick="window.menuComponent?.selectItem('${itemId}', '${categoryKey}', '${item.id}')">
                                <span class="tree-item-icon">📄</span>
                                <span class="tree-item-title" title="${this.escapeHtml(item.title || item.code || item.id)}">${this.escapeHtml(displayText)}</span>
                            </div>
                        `;
                    }).join('')
                    : '<div class="tree-item" style="opacity: 0.5; cursor: default;">No items</div>';

                const categoryIcon = this.categoryIcons[categoryKey] || "📁";
                const categoryName = this.categoryNames[categoryKey] || categoryData.name;

                return `
                    <div class="tree-category" data-category="${categoryKey}">
                        <div class="tree-category-header" onclick="window.menuComponent?.toggleCategory('${categoryKey}')">
                            <span class="tree-category-icon">▶</span>
                            <span class="tree-category-icon-emoji">${categoryIcon}</span>
                            <span>${this.escapeHtml(categoryName)}</span>
                            <span class="tree-category-count">${categoryData.count}</span>
                        </div>
                        <div class="tree-items">${itemsHtml}</div>
                    </div>
                `;
            })
            .join('');

        this.contentContainer.innerHTML = `<div class="governance-tree">${treeHtml}</div>`;
        
        // Expose methods to window for onclick handlers
        (window as any).menuComponent = this;
    }

    public toggleCategory(categoryKey: string): void {
        const category = document.querySelector(`.tree-category[data-category="${categoryKey}"]`);
        if (category) {
            category.classList.toggle('expanded');
            const header = category.querySelector('.tree-category-header');
            if (header) {
                header.classList.toggle('expanded');
            }
        }
    }

    public selectItem(itemId: string, category: string, fileId: string): void {
        // Remove active class from all items
        document.querySelectorAll('.tree-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to selected item
        const item = document.querySelector(`.tree-item[data-id="${fileId}"][data-category="${category}"]`);
        if (item) {
            item.classList.add('active');
            this.activeItem = { category, fileId };
            this.loadFile(category, fileId);
        }
    }

    private async loadFile(category: string, fileId: string): Promise<void> {
        console.log('Menu: Loading file', { category, fileId });
        
        try {
            // Use the API client to load the file
            const fileData = await governanceApi.getGovernanceFileWithFallback(category, fileId);
            
            // Send the loaded data to the parent window
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'loadGovernanceFile',
                    category: category,
                    fileId: fileId,
                    data: fileData
                }, '*');
                console.log('Menu: File loaded and sent to parent');
            } else {
                console.warn('Menu: window.parent not available');
            }
        } catch (error) {
            console.error('Error loading governance file:', error);
            // Fallback: send URL-based message for Viewer to handle
            const fileUrl = `${this.apiBase}/api/governance/${category}/${fileId}`;
            const categoryPaths: Record<string, string> = {
                "standards": "data/standards",
                "bylaws": "data/bylaws",
                "strategies": "data/strat",
                "od": "data/org",
                "policies": "data/policies",
                "processes": "data/processes",
                "procedures": "data/procedures"
            };
            const staticPath = categoryPaths[category];
            const fallbackUrl = staticPath ? `${staticPath}/${fileId}.json` : null;
            
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'loadGovernanceFile',
                    category: category,
                    fileId: fileId,
                    url: fileUrl,
                    fallbackUrl: fallbackUrl
                }, '*');
            }
        }
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    public destroy(): void {
        (window as any).menuComponent = null;
    }
}

