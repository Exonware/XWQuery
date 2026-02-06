/**
 * XWUIStack Component
 * Stack layout (vertical flex with spacing)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIStackConfig {
    direction?: 'row' | 'column';
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    wrap?: boolean;
    spacing?: string | number;
    gap?: string | number; // Alias for spacing
    className?: string;
}

export interface XWUIStackData {
    items?: Array<string | HTMLElement>;
}

export class XWUIStack extends XWUIComponent<XWUIStackData, XWUIStackConfig> {
    private stackElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIStackData = {},
        conf_comp: XWUIStackConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIStackConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIStackConfig {
        return {
            direction: conf_comp?.direction ?? 'column',
            align: conf_comp?.align ?? 'stretch',
            justify: conf_comp?.justify ?? 'flex-start',
            wrap: conf_comp?.wrap ?? false,
            spacing: conf_comp?.spacing ?? conf_comp?.gap ?? '8px',
            gap: conf_comp?.gap ?? conf_comp?.spacing ?? '8px',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-stack-wrapper';

        this.stackElement = document.createElement('div');
        this.stackElement.className = 'xwui-stack';
        
        if (this.config.className) {
            this.stackElement.classList.add(this.config.className);
        }

        this.stackElement.style.display = 'flex';
        this.stackElement.style.flexDirection = this.config.direction || 'column';
        this.stackElement.style.alignItems = this.config.align || 'stretch';
        this.stackElement.style.justifyContent = this.config.justify || 'flex-start';
        this.stackElement.style.flexWrap = this.config.wrap ? 'wrap' : 'nowrap';
        
        const spacing = this.config.spacing || this.config.gap || '8px';
        const gap = typeof spacing === 'number' ? `${spacing}px` : spacing;
        this.stackElement.style.gap = gap;

        const items = this.data.items || [];
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'xwui-stack-item';
            
            if (item instanceof HTMLElement) {
                itemElement.appendChild(item);
            } else if (typeof item === 'string') {
                itemElement.innerHTML = item;
            }
            
            this.stackElement.appendChild(itemElement);
        });

        this.container.appendChild(this.stackElement);
    }

    public setItems(items: Array<string | HTMLElement>): void {
        this.data.items = items;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.stackElement;
    }

    public destroy(): void {
        if (this.stackElement) {
            this.stackElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIStack as any).componentName = 'XWUIStack';


