/**
 * XWUISpace Component
 * Add spacing between elements
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUISpaceConfig {
    size?: string | number;
    direction?: 'horizontal' | 'vertical';
    wrap?: boolean;
    split?: boolean;
    className?: string;
}

export interface XWUISpaceData {
    items?: Array<string | HTMLElement>;
}

export class XWUISpace extends XWUIComponent<XWUISpaceData, XWUISpaceConfig> {
    private spaceElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISpaceData = {},
        conf_comp: XWUISpaceConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISpaceConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISpaceConfig {
        return {
            size: conf_comp?.size ?? '8px',
            direction: conf_comp?.direction ?? 'horizontal',
            wrap: conf_comp?.wrap ?? false,
            split: conf_comp?.split ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-space-wrapper';

        this.spaceElement = document.createElement('div');
        this.spaceElement.className = 'xwui-space';
        
        if (this.config.className) {
            this.spaceElement.classList.add(this.config.className);
        }

        this.spaceElement.style.display = 'flex';
        this.spaceElement.style.flexDirection = this.config.direction === 'vertical' ? 'column' : 'row';
        this.spaceElement.style.flexWrap = this.config.wrap ? 'wrap' : 'nowrap';
        
        const size = typeof this.config.size === 'number' ? `${this.config.size}px` : this.config.size;
        this.spaceElement.style.gap = size;

        const items = this.data.items || [];
        
        items.forEach((item, index) => {
            if (this.config.split && index > 0) {
                const divider = document.createElement('span');
                divider.className = 'xwui-space-split';
                divider.textContent = '|';
                this.spaceElement.appendChild(divider);
            }
            
            const itemElement = document.createElement('div');
            itemElement.className = 'xwui-space-item';
            
            if (item instanceof HTMLElement) {
                itemElement.appendChild(item);
            } else if (typeof item === 'string') {
                itemElement.innerHTML = item;
            }
            
            this.spaceElement.appendChild(itemElement);
        });

        this.container.appendChild(this.spaceElement);
    }

    public setItems(items: Array<string | HTMLElement>): void {
        this.data.items = items;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.spaceElement;
    }

    public destroy(): void {
        if (this.spaceElement) {
            this.spaceElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISpace as any).componentName = 'XWUISpace';


