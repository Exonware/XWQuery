/**
 * XWUIDescriptionList Component
 * Description list (term-value pairs)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface DescriptionListItem {
    label: string;
    value: string | HTMLElement;
    span?: number;
}

export interface XWUIDescriptionListConfig {
    bordered?: boolean;
    column?: number;
    size?: 'small' | 'medium' | 'large';
    layout?: 'horizontal' | 'vertical';
    className?: string;
}

export interface XWUIDescriptionListData {
    items?: DescriptionListItem[];
}

export class XWUIDescriptionList extends XWUIComponent<XWUIDescriptionListData, XWUIDescriptionListConfig> {
    private listElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIDescriptionListData = {},
        conf_comp: XWUIDescriptionListConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDescriptionListConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDescriptionListConfig {
        return {
            bordered: conf_comp?.bordered ?? false,
            column: conf_comp?.column ?? 3,
            size: conf_comp?.size ?? 'medium',
            layout: conf_comp?.layout ?? 'horizontal',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-description-list-container';

        this.listElement = document.createElement('div');
        this.listElement.className = 'xwui-description-list';
        this.listElement.classList.add(`xwui-description-list-${this.config.size}`);
        this.listElement.classList.add(`xwui-description-list-${this.config.layout}`);
        
        if (this.config.bordered) {
            this.listElement.classList.add('xwui-description-list-bordered');
        }
        
        if (this.config.className) {
            this.listElement.classList.add(this.config.className);
        }

        // Set grid columns
        if (this.config.column) {
            this.listElement.style.gridTemplateColumns = `repeat(${this.config.column}, 1fr)`;
        }

        const items = this.data.items || [];
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'xwui-description-list-item';
            
            if (item.span) {
                itemElement.style.gridColumn = `span ${item.span}`;
            }
            
            if (this.config.bordered) {
                itemElement.classList.add('xwui-description-list-item-bordered');
            }

            const term = document.createElement('dt');
            term.className = 'xwui-description-list-term';
            term.textContent = item.label;
            itemElement.appendChild(term);

            const desc = document.createElement('dd');
            desc.className = 'xwui-description-list-desc';
            
            if (typeof item.value === 'string') {
                desc.textContent = item.value;
            } else {
                desc.appendChild(item.value);
            }
            
            itemElement.appendChild(desc);

            this.listElement.appendChild(itemElement);
        });

        this.container.appendChild(this.listElement);
    }

    public destroy(): void {
        if (this.listElement) {
            this.listElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDescriptionList as any).componentName = 'XWUIDescriptionList';


