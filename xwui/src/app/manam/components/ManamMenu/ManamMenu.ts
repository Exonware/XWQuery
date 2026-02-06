/**
 * ManamMenu Component
 * Bottom navigation menu component for mobile apps with a prominent central action button
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../../../components/component/XWUIComponent/XWUIComponent';

export interface ManamMenuItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

export interface ManamMenuCentralButton {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

// Component-level configuration
export interface ManamMenuConfig {
    variant?: 'default' | 'elevated';
    className?: string;
}

// Data type
export interface ManamMenuData {
    items: ManamMenuItem[];
    centralButton?: ManamMenuCentralButton;
    activeId?: string;
}

export class ManamMenu extends XWUIComponent<ManamMenuData, ManamMenuConfig> {
    private menuElement: HTMLElement | null = null;
    private itemElements: Map<string, HTMLElement> = new Map();
    private centralButtonElement: HTMLElement | null = null;
    private clickHandlers: Array<(item: ManamMenuItem | ManamMenuCentralButton, event: Event) => void> = [];
    private changeHandlers: Array<(activeId: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: ManamMenuData,
        conf_comp: ManamMenuConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupDOM();
    }

    protected createConfig(
        conf_comp?: ManamMenuConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): ManamMenuConfig {
        return {
            variant: conf_comp?.variant ?? 'default',
            className: conf_comp?.className
        };
    }

    private setupDOM(): void {
        this.container.innerHTML = '';
        this.container.className = 'manam-menu-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        this.menuElement = document.createElement('nav');
        this.menuElement.className = 'manam-menu';
        this.menuElement.classList.add(`manam-menu-${this.config.variant}`);
        this.menuElement.setAttribute('role', 'navigation');
        this.menuElement.setAttribute('aria-label', 'Bottom navigation menu');

        // Create menu items wrapper
        const itemsWrapper = document.createElement('div');
        itemsWrapper.className = 'manam-menu-items';

        // Create left items (before central button)
        const leftItems = document.createElement('div');
        leftItems.className = 'manam-menu-items-left';

        // Create right items (after central button)
        const rightItems = document.createElement('div');
        rightItems.className = 'manam-menu-items-right';

        // Determine where to split items (if central button exists)
        const centralIndex = this.data.centralButton 
            ? Math.floor(this.data.items.length / 2)
            : this.data.items.length;

        // Create left items
        this.data.items.slice(0, centralIndex).forEach((item) => {
            const itemElement = this.createMenuItem(item);
            leftItems.appendChild(itemElement);
            this.itemElements.set(item.id, itemElement);
        });

        // Create central button if provided
        if (this.data.centralButton) {
            this.centralButtonElement = this.createCentralButton(this.data.centralButton);
            itemsWrapper.appendChild(leftItems);
            itemsWrapper.appendChild(this.centralButtonElement);
            
            // Create right items
            this.data.items.slice(centralIndex).forEach((item) => {
                const itemElement = this.createMenuItem(item);
                rightItems.appendChild(itemElement);
                this.itemElements.set(item.id, itemElement);
            });
            itemsWrapper.appendChild(rightItems);
        } else {
            // No central button, just add all items to left
            this.data.items.forEach((item) => {
                const itemElement = this.createMenuItem(item);
                leftItems.appendChild(itemElement);
                this.itemElements.set(item.id, itemElement);
            });
            itemsWrapper.appendChild(leftItems);
        }

        this.menuElement.appendChild(itemsWrapper);
        this.container.appendChild(this.menuElement);

        // Set active item
        if (this.data.activeId) {
            this.setActive(this.data.activeId);
        }
    }

    private createMenuItem(item: ManamMenuItem): HTMLElement {
        const itemElement = document.createElement('button');
        itemElement.className = 'manam-menu-item';
        itemElement.type = 'button';
        itemElement.setAttribute('role', 'tab');
        itemElement.setAttribute('aria-selected', 'false');
        itemElement.setAttribute('data-item-id', item.id);
        
        if (item.disabled) {
            itemElement.disabled = true;
            itemElement.classList.add('manam-menu-item-disabled');
        }

        // Icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'manam-menu-item-icon';
        
        if (item.icon) {
            // Check if icon is SVG string or icon name
            if (item.icon.trim().startsWith('<svg')) {
                iconContainer.innerHTML = item.icon;
            } else {
                // Assume it's an emoji or icon name - use text content
                iconContainer.textContent = item.icon;
            }
        }
        itemElement.appendChild(iconContainer);

        // Label
        const labelElement = document.createElement('span');
        labelElement.className = 'manam-menu-item-label';
        labelElement.textContent = item.label;
        itemElement.appendChild(labelElement);

        // Click handler
        itemElement.addEventListener('click', (e) => {
            if (!item.disabled) {
                this.handleItemClick(item, e);
            }
        });

        return itemElement;
    }

    private createCentralButton(button: ManamMenuCentralButton): HTMLElement {
        const buttonElement = document.createElement('button');
        buttonElement.className = 'manam-menu-central-button';
        buttonElement.type = 'button';
        buttonElement.setAttribute('role', 'button');
        buttonElement.setAttribute('data-button-id', button.id);
        
        if (button.disabled) {
            buttonElement.disabled = true;
            buttonElement.classList.add('manam-menu-central-button-disabled');
        }

        // Icon container
        if (button.icon) {
            const iconContainer = document.createElement('div');
            iconContainer.className = 'manam-menu-central-button-icon';
            
            // Check if icon is SVG string or icon name
            if (button.icon.trim().startsWith('<svg')) {
                iconContainer.innerHTML = button.icon;
            } else {
                iconContainer.textContent = button.icon;
            }
            buttonElement.appendChild(iconContainer);
        }

        // Label
        const labelElement = document.createElement('span');
        labelElement.className = 'manam-menu-central-button-label';
        labelElement.textContent = button.label;
        buttonElement.appendChild(labelElement);

        // Click handler
        buttonElement.addEventListener('click', (e) => {
            if (!button.disabled) {
                this.handleCentralButtonClick(button, e);
            }
        });

        return buttonElement;
    }

    private handleItemClick(item: ManamMenuItem, event: Event): void {
        this.setActive(item.id);
        this.clickHandlers.forEach(handler => handler(item, event));
        this.changeHandlers.forEach(handler => handler(item.id));
    }

    private handleCentralButtonClick(button: ManamMenuCentralButton, event: Event): void {
        this.clickHandlers.forEach(handler => handler(button, event));
    }

    /**
     * Set active item
     */
    public setActive(itemId: string): void {
        this.data.activeId = itemId;

        // Update all items
        this.itemElements.forEach((element, id) => {
            const isActive = id === itemId;
            element.classList.toggle('manam-menu-item-active', isActive);
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
    public onItemClick(handler: (item: ManamMenuItem | ManamMenuCentralButton, event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    /**
     * Add change handler
     */
    public onChange(handler: (activeId: string) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.menuElement;
    }

    public destroy(): void {
        // Clear event handlers
        this.clickHandlers = [];
        this.changeHandlers = [];
        
        // Clear item elements map
        this.itemElements.clear();
        
        // Clear DOM references
        this.menuElement = null;
        this.centralButtonElement = null;
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        super.destroy();
    }
}

// Set component name at class definition (before minification) - survives build tools
(ManamMenu as any).componentName = 'ManamMenu';
