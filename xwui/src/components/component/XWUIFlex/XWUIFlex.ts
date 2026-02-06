/**
 * XWUIFlex Component
 * Flexbox layout container
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIFlexConfig {
    direction?: 'row' | 'column';
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    wrap?: boolean;
    gap?: string | number;
    className?: string;
}

export interface XWUIFlexData {
    items?: Array<string | HTMLElement>;
}

export class XWUIFlex extends XWUIComponent<XWUIFlexData, XWUIFlexConfig> {
    private flexElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIFlexData = {},
        conf_comp: XWUIFlexConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIFlexConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFlexConfig {
        return {
            direction: conf_comp?.direction ?? 'row',
            align: conf_comp?.align ?? 'stretch',
            justify: conf_comp?.justify ?? 'flex-start',
            wrap: conf_comp?.wrap ?? false,
            gap: conf_comp?.gap ?? '0',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-flex-wrapper';

        this.flexElement = document.createElement('div');
        this.flexElement.className = 'xwui-flex';
        
        if (this.config.className) {
            this.flexElement.classList.add(this.config.className);
        }

        this.flexElement.style.display = 'flex';
        this.flexElement.style.flexDirection = this.config.direction || 'row';
        this.flexElement.style.alignItems = this.config.align || 'stretch';
        this.flexElement.style.justifyContent = this.config.justify || 'flex-start';
        this.flexElement.style.flexWrap = this.config.wrap ? 'wrap' : 'nowrap';
        
        const gap = typeof this.config.gap === 'number' ? `${this.config.gap}px` : this.config.gap;
        this.flexElement.style.gap = gap || '0';

        const items = this.data.items || [];
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'xwui-flex-item';
            
            if (item instanceof HTMLElement) {
                itemElement.appendChild(item);
            } else if (typeof item === 'string') {
                itemElement.innerHTML = item;
            }
            
            this.flexElement.appendChild(itemElement);
        });

        this.container.appendChild(this.flexElement);
    }

    public setItems(items: Array<string | HTMLElement>): void {
        this.data.items = items;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.flexElement;
    }

    public destroy(): void {
        if (this.flexElement) {
            this.flexElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIFlex as any).componentName = 'XWUIFlex';


