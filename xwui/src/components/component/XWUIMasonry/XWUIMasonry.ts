/**
 * XWUIMasonry Component
 * Pinterest-style masonry grid layout for items of different heights
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIMasonryConfig {
    columns?: number; // Number of columns (default: auto based on width)
    columnWidth?: number; // Fixed column width in pixels
    gap?: string | number; // Gap between items
    responsive?: boolean; // Adjust columns based on container width
    className?: string;
}

// Data type
export interface XWUIMasonryData {
    items: Array<string | HTMLElement>;
}

export class XWUIMasonry extends XWUIComponent<XWUIMasonryData, XWUIMasonryConfig> {
    private masonryElement: HTMLElement | null = null;
    private columnElements: HTMLElement[] = [];
    private resizeObserver: ResizeObserver | null = null;
    private itemElements: HTMLElement[] = [];

    constructor(
        container: HTMLElement,
        data: XWUIMasonryData,
        conf_comp: XWUIMasonryConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
        this.setupResizeObserver();
    }

    protected createConfig(
        conf_comp?: XWUIMasonryConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMasonryConfig {
        return {
            columns: conf_comp?.columns,
            columnWidth: conf_comp?.columnWidth,
            gap: conf_comp?.gap ?? 'var(--spacing-md)',
            responsive: conf_comp?.responsive ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-masonry-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        this.masonryElement = document.createElement('div');
        this.masonryElement.className = 'xwui-masonry';

        const gap = typeof this.config.gap === 'number' ? `${this.config.gap}px` : this.config.gap;
        this.masonryElement.style.gap = gap;

        // Calculate columns
        const columns = this.calculateColumns();
        this.createColumns(columns);
        this.distributeItems();

        this.container.appendChild(this.masonryElement);
    }

    private calculateColumns(): number {
        if (this.config.columns) {
            return this.config.columns;
        }

        if (this.config.columnWidth && this.container) {
            const containerWidth = this.container.clientWidth || this.container.offsetWidth;
            const gap = this.parseGap(this.config.gap || 'var(--spacing-md)');
            const availableWidth = containerWidth - (gap * 2); // Account for gaps
            return Math.max(1, Math.floor(availableWidth / (this.config.columnWidth + gap)));
        }

        // Default responsive columns based on container width
        if (this.config.responsive && this.container) {
            const containerWidth = this.container.clientWidth || this.container.offsetWidth;
            if (containerWidth >= 1200) return 4;
            if (containerWidth >= 768) return 3;
            if (containerWidth >= 480) return 2;
            return 1;
        }

        return 3; // Default
    }

    private parseGap(gap: string | number): number {
        if (typeof gap === 'number') return gap;
        
        // Try to parse CSS variable or px value
        const match = gap.match(/(\d+)px/);
        if (match) return parseInt(match[1], 10);
        
        // Default fallback
        return 16;
    }

    private createColumns(count: number): void {
        this.columnElements = [];
        this.masonryElement!.innerHTML = '';

        const gap = typeof this.config.gap === 'number' ? `${this.config.gap}px` : this.config.gap;
        
        for (let i = 0; i < count; i++) {
            const column = document.createElement('div');
            column.className = 'xwui-masonry-column';
            column.style.flex = '1';
            column.style.display = 'flex';
            column.style.flexDirection = 'column';
            column.style.gap = gap;
            
            this.columnElements.push(column);
            this.masonryElement!.appendChild(column);
        }
    }

    private distributeItems(): void {
        if (!this.masonryElement || this.columnElements.length === 0) return;

        // Clear columns
        this.columnElements.forEach(col => {
            col.innerHTML = '';
        });

        // Create item elements
        this.itemElements = this.data.items.map((item, index) => {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'xwui-masonry-item';

            if (typeof item === 'string') {
                itemWrapper.innerHTML = item;
            } else if (item instanceof HTMLElement) {
                itemWrapper.appendChild(item.cloneNode(true));
            }

            return itemWrapper;
        });

        // Distribute items to columns (fill shortest column first)
        this.itemElements.forEach((itemElement, index) => {
            const shortestColumn = this.getShortestColumn();
            shortestColumn.appendChild(itemElement);
        });
    }

    private getShortestColumn(): HTMLElement {
        let shortest = this.columnElements[0];
        let shortestHeight = shortest.offsetHeight;

        for (let i = 1; i < this.columnElements.length; i++) {
            const height = this.columnElements[i].offsetHeight;
            if (height < shortestHeight) {
                shortestHeight = height;
                shortest = this.columnElements[i];
            }
        }

        return shortest;
    }

    private setupResizeObserver(): void {
        if (!this.config.responsive || !window.ResizeObserver) return;

        this.resizeObserver = new ResizeObserver(() => {
            const newColumns = this.calculateColumns();
            if (newColumns !== this.columnElements.length) {
                this.render();
            }
        });

        if (this.container) {
            this.resizeObserver.observe(this.container);
        }
    }

    /**
     * Add item
     */
    public addItem(item: string | HTMLElement): void {
        this.data.items.push(item);
        this.distributeItems();
    }

    /**
     * Remove item by index
     */
    public removeItem(index: number): void {
        if (index >= 0 && index < this.data.items.length) {
            this.data.items.splice(index, 1);
            this.render();
        }
    }

    /**
     * Set items
     */
    public setItems(items: Array<string | HTMLElement>): void {
        this.data.items = items;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.masonryElement;
    }

    public destroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        this.columnElements = [];
        this.itemElements = [];
        this.masonryElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMasonry as any).componentName = 'XWUIMasonry';


