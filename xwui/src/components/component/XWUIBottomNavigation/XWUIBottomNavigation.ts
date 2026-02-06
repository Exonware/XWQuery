/**
 * XWUIBottomNavigation Component
 * Bottom navigation bar for mobile app navigation
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIBottomNavigationItem {
    id: string;
    label: string;
    icon?: string;
    badge?: string | number;
    disabled?: boolean;
}

// Component-level configuration
export interface XWUIBottomNavigationConfig {
    variant?: 'default' | 'elevated';
    showLabels?: boolean;
    fixed?: boolean;
    className?: string;
}

// Data type
export interface XWUIBottomNavigationData {
    items: XWUIBottomNavigationItem[];
    activeId?: string;
}

export class XWUIBottomNavigation extends XWUIComponent<XWUIBottomNavigationData, XWUIBottomNavigationConfig> {
    private navElement: HTMLElement | null = null;
    private itemElements: Map<string, HTMLElement> = new Map();
    private clickHandlers: Array<(item: XWUIBottomNavigationItem, event: Event) => void> = [];
    private changeHandlers: Array<(activeId: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIBottomNavigationData,
        conf_comp: XWUIBottomNavigationConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIBottomNavigationConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBottomNavigationConfig {
        return {
            variant: conf_comp?.variant ?? 'default',
            showLabels: conf_comp?.showLabels ?? true,
            fixed: conf_comp?.fixed ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-bottom-navigation-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        this.navElement = document.createElement('nav');
        this.navElement.className = 'xwui-bottom-navigation';
        this.navElement.classList.add(`xwui-bottom-navigation-${this.config.variant}`);
        this.navElement.setAttribute('role', 'navigation');
        this.navElement.setAttribute('aria-label', 'Bottom navigation');

        if (this.config.fixed) {
            this.navElement.classList.add('xwui-bottom-navigation-fixed');
        }

        // Create items
        this.data.items.forEach((item, index) => {
            const itemElement = this.createItem(item, index);
            this.navElement!.appendChild(itemElement);
            this.itemElements.set(item.id, itemElement);
        });

        // Set active item
        if (this.data.activeId) {
            this.setActive(this.data.activeId);
        }

        this.container.appendChild(this.navElement);
    }

    private createItem(item: XWUIBottomNavigationItem, index: number): HTMLElement {
        const itemElement = document.createElement('button');
        itemElement.className = 'xwui-bottom-navigation-item';
        itemElement.type = 'button';
        itemElement.setAttribute('role', 'tab');
        itemElement.setAttribute('aria-selected', 'false');
        itemElement.setAttribute('data-item-id', item.id);
        
        if (item.disabled) {
            itemElement.disabled = true;
            itemElement.classList.add('xwui-bottom-navigation-item-disabled');
        }

        // Icon
        if (item.icon) {
            const iconContainer = document.createElement('div');
            iconContainer.className = 'xwui-bottom-navigation-item-icon';
            
            // Check if icon is SVG string or icon name
            if (item.icon.trim().startsWith('<svg')) {
                iconContainer.innerHTML = item.icon;
            } else {
                // Assume it's an emoji or icon name
                iconContainer.textContent = item.icon;
            }
            
            itemElement.appendChild(iconContainer);
        }

        // Label
        if (this.config.showLabels) {
            const labelElement = document.createElement('span');
            labelElement.className = 'xwui-bottom-navigation-item-label';
            labelElement.textContent = item.label;
            itemElement.appendChild(labelElement);
        }

        // Badge
        if (item.badge !== undefined && item.badge !== null) {
            const badgeElement = document.createElement('span');
            badgeElement.className = 'xwui-bottom-navigation-item-badge';
            badgeElement.textContent = String(item.badge);
            itemElement.appendChild(badgeElement);
        }

        // Click handler
        itemElement.addEventListener('click', (e) => {
            if (!item.disabled) {
                this.handleItemClick(item, e);
            }
        });

        return itemElement;
    }

    private handleItemClick(item: XWUIBottomNavigationItem, event: Event): void {
        this.setActive(item.id);
        this.clickHandlers.forEach(handler => handler(item, event));
        this.changeHandlers.forEach(handler => handler(item.id));
    }

    /**
     * Set active item
     */
    public setActive(itemId: string): void {
        this.data.activeId = itemId;

        // Update all items
        this.itemElements.forEach((element, id) => {
            const isActive = id === itemId;
            element.classList.toggle('xwui-bottom-navigation-item-active', isActive);
            element.setAttribute('aria-selected', String(isActive));
        });
    }

    /**
     * Get active item ID
     */
    public getActive(): string | undefined {
        return this.data.activeId;
    }

    /**
     * Add item click handler
     */
    public onItemClick(handler: (item: XWUIBottomNavigationItem, event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    /**
     * Add change handler
     */
    public onChange(handler: (activeId: string) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.navElement;
    }

    public destroy(): void {
        this.itemElements.forEach((element) => {
            element.removeEventListener('click', () => {});
        });
        this.itemElements.clear();
        this.clickHandlers = [];
        this.changeHandlers = [];
        this.navElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBottomNavigation as any).componentName = 'XWUIBottomNavigation';


