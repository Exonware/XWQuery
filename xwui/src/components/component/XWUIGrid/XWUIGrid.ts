/**
 * XWUIGrid Component
 * CSS Grid wrapper with responsive breakpoints
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIGridConfig {
    columns?: number | string;          // Number of columns or grid-template-columns value
    rows?: number | string;             // Number of rows or grid-template-rows value
    gap?: string;                       // Grid gap
    rowGap?: string;                    // Row gap (overrides gap for rows)
    columnGap?: string;                 // Column gap (overrides gap for columns)
    alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
    justifyItems?: 'start' | 'end' | 'center' | 'stretch';
    alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
    justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
    autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
    autoRows?: string;
    autoColumns?: string;
    minChildWidth?: string;             // For auto-fit responsive grids
    responsive?: {                      // Responsive breakpoints
        sm?: Partial<XWUIGridConfig>;   // >= 640px
        md?: Partial<XWUIGridConfig>;   // >= 768px
        lg?: Partial<XWUIGridConfig>;   // >= 1024px
        xl?: Partial<XWUIGridConfig>;   // >= 1280px
    };
    className?: string;
}

// Data type (children content)
export interface XWUIGridData {
    children?: HTMLElement[];
}

export class XWUIGrid extends XWUIComponent<XWUIGridData, XWUIGridConfig> {
    private gridElement: HTMLElement | null = null;
    private styleElement: HTMLStyleElement | null = null;
    private gridId: string;

    constructor(
        container: HTMLElement,
        data: XWUIGridData = {},
        conf_comp: XWUIGridConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.gridId = `xwui-grid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIGridConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIGridConfig {
        return {
            columns: conf_comp?.columns ?? 12,
            rows: conf_comp?.rows,
            gap: conf_comp?.gap ?? '1rem',
            rowGap: conf_comp?.rowGap,
            columnGap: conf_comp?.columnGap,
            alignItems: conf_comp?.alignItems ?? 'stretch',
            justifyItems: conf_comp?.justifyItems ?? 'stretch',
            alignContent: conf_comp?.alignContent,
            justifyContent: conf_comp?.justifyContent,
            autoFlow: conf_comp?.autoFlow,
            autoRows: conf_comp?.autoRows,
            autoColumns: conf_comp?.autoColumns,
            minChildWidth: conf_comp?.minChildWidth,
            responsive: conf_comp?.responsive,
            className: conf_comp?.className
        };
    }

    private getGridTemplateColumns(columns: number | string | undefined): string {
        if (!columns) return '';
        if (typeof columns === 'number') {
            return `repeat(${columns}, 1fr)`;
        }
        return columns;
    }

    private getGridTemplateRows(rows: number | string | undefined): string {
        if (!rows) return '';
        if (typeof rows === 'number') {
            return `repeat(${rows}, 1fr)`;
        }
        return rows;
    }

    private generateResponsiveStyles(): string {
        if (!this.config.responsive) return '';

        const breakpoints = {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280
        };

        let styles = '';

        Object.entries(this.config.responsive).forEach(([breakpoint, config]) => {
            if (config) {
                const minWidth = breakpoints[breakpoint as keyof typeof breakpoints];
                styles += `
                    @media (min-width: ${minWidth}px) {
                        #${this.gridId} {
                            ${config.columns ? `grid-template-columns: ${this.getGridTemplateColumns(config.columns)};` : ''}
                            ${config.rows ? `grid-template-rows: ${this.getGridTemplateRows(config.rows)};` : ''}
                            ${config.gap ? `gap: ${config.gap};` : ''}
                            ${config.rowGap ? `row-gap: ${config.rowGap};` : ''}
                            ${config.columnGap ? `column-gap: ${config.columnGap};` : ''}
                            ${config.alignItems ? `align-items: ${config.alignItems};` : ''}
                            ${config.justifyItems ? `justify-items: ${config.justifyItems};` : ''}
                        }
                    }
                `;
            }
        });

        return styles;
    }

    private render(): void {
        this.container.innerHTML = '';

        // Remove existing style element
        if (this.styleElement) {
            this.styleElement.remove();
        }

        // Create grid element
        this.gridElement = document.createElement('div');
        this.gridElement.id = this.gridId;
        this.gridElement.className = 'xwui-grid';

        if (this.config.className) {
            this.gridElement.classList.add(this.config.className);
        }

        // Apply base styles
        const { columns, rows, gap, rowGap, columnGap, alignItems, justifyItems, alignContent, justifyContent, autoFlow, autoRows, autoColumns, minChildWidth } = this.config;

        this.gridElement.style.display = 'grid';

        // Handle auto-fit responsive grid
        if (minChildWidth) {
            this.gridElement.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`;
        } else if (columns) {
            this.gridElement.style.gridTemplateColumns = this.getGridTemplateColumns(columns);
        }

        if (rows) {
            this.gridElement.style.gridTemplateRows = this.getGridTemplateRows(rows);
        }

        if (gap) this.gridElement.style.gap = gap;
        if (rowGap) this.gridElement.style.rowGap = rowGap;
        if (columnGap) this.gridElement.style.columnGap = columnGap;
        if (alignItems) this.gridElement.style.alignItems = alignItems;
        if (justifyItems) this.gridElement.style.justifyItems = justifyItems;
        if (alignContent) this.gridElement.style.alignContent = alignContent;
        if (justifyContent) this.gridElement.style.justifyContent = justifyContent;
        if (autoFlow) this.gridElement.style.gridAutoFlow = autoFlow;
        if (autoRows) this.gridElement.style.gridAutoRows = autoRows;
        if (autoColumns) this.gridElement.style.gridAutoColumns = autoColumns;

        // Add responsive styles
        const responsiveStyles = this.generateResponsiveStyles();
        if (responsiveStyles) {
            this.styleElement = document.createElement('style');
            this.styleElement.textContent = responsiveStyles;
            document.head.appendChild(this.styleElement);
        }

        // Add children if provided
        if (this.data.children) {
            this.data.children.forEach(child => {
                this.gridElement!.appendChild(child);
            });
        }

        this.container.appendChild(this.gridElement);
    }

    public setColumns(columns: number | string): void {
        this.config.columns = columns;
        if (this.gridElement) {
            this.gridElement.style.gridTemplateColumns = this.getGridTemplateColumns(columns);
        }
    }

    public setGap(gap: string): void {
        this.config.gap = gap;
        if (this.gridElement) {
            this.gridElement.style.gap = gap;
        }
    }

    public addChild(element: HTMLElement): void {
        if (this.gridElement) {
            this.gridElement.appendChild(element);
        }
        if (!this.data.children) {
            this.data.children = [];
        }
        this.data.children.push(element);
    }

    public removeChild(element: HTMLElement): void {
        if (this.gridElement && this.gridElement.contains(element)) {
            this.gridElement.removeChild(element);
        }
        if (this.data.children) {
            const index = this.data.children.indexOf(element);
            if (index > -1) {
                this.data.children.splice(index, 1);
            }
        }
    }

    public clearChildren(): void {
        if (this.gridElement) {
            this.gridElement.innerHTML = '';
        }
        this.data.children = [];
    }

    public getElement(): HTMLElement | null {
        return this.gridElement;
    }

    public destroy(): void {
        if (this.styleElement) {
            this.styleElement.remove();
            this.styleElement = null;
        }
        if (this.gridElement) {
            this.gridElement.remove();
            this.gridElement = null;
        }
    }
}

/**
 * XWUIGridItem - Helper component for grid items with span control
 */
export interface XWUIGridItemConfig {
    colSpan?: number;
    rowSpan?: number;
    colStart?: number;
    colEnd?: number;
    rowStart?: number;
    rowEnd?: number;
    alignSelf?: 'start' | 'end' | 'center' | 'stretch';
    justifySelf?: 'start' | 'end' | 'center' | 'stretch';
}

export function createGridItem(element: HTMLElement, config: XWUIGridItemConfig): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'xwui-grid-item';

    if (config.colSpan) wrapper.style.gridColumn = `span ${config.colSpan}`;
    if (config.rowSpan) wrapper.style.gridRow = `span ${config.rowSpan}`;
    if (config.colStart) wrapper.style.gridColumnStart = String(config.colStart);
    if (config.colEnd) wrapper.style.gridColumnEnd = String(config.colEnd);
    if (config.rowStart) wrapper.style.gridRowStart = String(config.rowStart);
    if (config.rowEnd) wrapper.style.gridRowEnd = String(config.rowEnd);
    if (config.alignSelf) wrapper.style.alignSelf = config.alignSelf;
    if (config.justifySelf) wrapper.style.justifySelf = config.justifySelf;

    wrapper.appendChild(element);
    return wrapper;
}
// Set component name at class definition (before minification) - survives build tools
(XWUIGrid as any).componentName = 'XWUIGrid';


