/**
 * XWUINavigationRail Component
 * Mobile bottom navigation bar with icon + label items
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUINavigationRailItem {
    id: string;
    label: string;
    icon?: string | HTMLElement;
    href?: string;
    active?: boolean;
    className?: string;
}

// Component-level configuration
export interface XWUINavigationRailConfig {
    direction?: 'ltr' | 'rtl';
    className?: string;
}

// Data type
export interface XWUINavigationRailData {
    items: XWUINavigationRailItem[];
}

export class XWUINavigationRail extends XWUIComponent<XWUINavigationRailData, XWUINavigationRailConfig> {
    private railElement: HTMLElement | null = null;
    private clickHandlers: Array<(item: XWUINavigationRailItem) => void> = [];
    private activeItemId: string | null = null;

    constructor(
        container: HTMLElement,
        data: XWUINavigationRailData,
        conf_comp: XWUINavigationRailConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUINavigationRailConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUINavigationRailConfig {
        return {
            direction: conf_comp?.direction ?? 'ltr',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.railElement = document.createElement('nav');
        this.railElement.className = 'xwui-navigation-rail';
        
        if (this.config.direction === 'rtl') {
            this.railElement.classList.add('xwui-navigation-rail-rtl');
        }
        
        if (this.config.className) {
            this.railElement.classList.add(this.config.className);
        }

        this.railElement.setAttribute('role', 'navigation');
        this.railElement.setAttribute('aria-label', 'Bottom navigation');

        this.data.items.forEach(item => {
            const itemElement = this.createItemElement(item);
            this.railElement!.appendChild(itemElement);
        });

        this.container.appendChild(this.railElement);
    }

    private createItemElement(item: XWUINavigationRailItem): HTMLElement {
        const itemElement = document.createElement('button');
        itemElement.className = 'xwui-navigation-rail-item';
        
        if (item.active || this.activeItemId === item.id) {
            itemElement.classList.add('xwui-navigation-rail-item-active');
        }
        
        if (item.className) {
            itemElement.classList.add(item.className);
        }

        itemElement.setAttribute('aria-label', item.label);
        itemElement.setAttribute('data-item-id', item.id);

        // Icon
        if (item.icon) {
            const iconElement = document.createElement('div');
            iconElement.className = 'xwui-navigation-rail-item-icon';
            
            if (typeof item.icon === 'string') {
                iconElement.textContent = item.icon;
            } else {
                iconElement.appendChild(item.icon);
            }
            
            itemElement.appendChild(iconElement);
        }

        // Label
        const labelElement = document.createElement('span');
        labelElement.className = 'xwui-navigation-rail-item-label';
        labelElement.textContent = item.label;
        itemElement.appendChild(labelElement);

        // Click handler
        itemElement.addEventListener('click', () => {
            this.setActiveItem(item.id);
            this.clickHandlers.forEach(handler => handler(item));
            
            if (item.href) {
                window.location.href = item.href;
            }
        });

        return itemElement;
    }

    public setActiveItem(itemId: string): void {
        this.activeItemId = itemId;
        this.data.items.forEach(item => {
            item.active = item.id === itemId;
        });
        this.render();
    }

    public getActiveItem(): XWUINavigationRailItem | null {
        return this.data.items.find(item => item.id === this.activeItemId) || null;
    }

    public onClick(handler: (item: XWUINavigationRailItem) => void): void {
        this.clickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.railElement;
    }

    public destroy(): void {
        this.clickHandlers = [];
        if (this.railElement) {
            this.railElement.remove();
            this.railElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUINavigationRail as any).componentName = 'XWUINavigationRail';


