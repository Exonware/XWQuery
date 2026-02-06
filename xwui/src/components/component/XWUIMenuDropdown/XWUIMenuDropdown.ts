/**
 * XWUIMenuDropdown Component
 * Dropdown menu triggered by button/action
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIItemGroup } from '../XWUIItemGroup/XWUIItemGroup';

export interface XWUIMenuDropdownItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    divider?: boolean;
    children?: XWUIMenuDropdownItem[];
}

// Component-level configuration
export interface XWUIMenuDropdownConfig {
    trigger?: 'click' | 'hover';
    placement?: 'bottom' | 'top' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    closeOnSelect?: boolean;
    className?: string;
}

// Data type
export interface XWUIMenuDropdownData {
    items: XWUIMenuDropdownItem[];
    triggerElement?: HTMLElement | string;
}

export class XWUIMenuDropdown extends XWUIComponent<XWUIMenuDropdownData, XWUIMenuDropdownConfig> {
    private menuElement: HTMLElement | null = null;
    private overlayElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private clickHandlers: Array<(item: XWUIMenuDropdownItem, event: Event) => void> = [];
    private triggerElement: HTMLElement | null = null;
    private escapeHandler: ((e: KeyboardEvent) => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMenuDropdownData,
        conf_comp: XWUIMenuDropdownConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeTrigger();
        this.createMenu();
    }

    protected createConfig(
        conf_comp?: XWUIMenuDropdownConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMenuDropdownConfig {
        return {
            trigger: conf_comp?.trigger ?? 'click',
            placement: conf_comp?.placement ?? 'bottom',
            align: conf_comp?.align ?? 'start',
            closeOnSelect: conf_comp?.closeOnSelect ?? true,
            className: conf_comp?.className
        };
    }

    private initializeTrigger(): void {
        if (this.data.triggerElement) {
            if (typeof this.data.triggerElement === 'string') {
                this.triggerElement = document.querySelector(this.data.triggerElement) as HTMLElement;
            } else {
                this.triggerElement = this.data.triggerElement;
            }
        } else {
            // Use container as trigger if no trigger specified
            this.triggerElement = this.container;
        }
        
        if (!this.triggerElement) {
            console.warn('XWUIMenuDropdown: Trigger element not found');
        }
    }

    private createMenu(): void {
        // Overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'xwui-dropdown-menu-overlay';
        this.overlayElement.addEventListener('click', (e) => {
            // Only close if clicking directly on the overlay, not on the menu
            if (e.target === this.overlayElement) {
                this.close();
            }
        });

        // Menu
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'xwui-dropdown-menu';
        this.menuElement.classList.add(`xwui-dropdown-menu-${this.config.placement}`);
        this.menuElement.classList.add(`xwui-dropdown-menu-align-${this.config.align}`);
        this.menuElement.setAttribute('role', 'menu');
        
        if (this.config.className) {
            this.menuElement.classList.add(this.config.className);
        }

        this.renderItems();

        this.overlayElement.appendChild(this.menuElement);
        
        // Prevent menu clicks from bubbling to overlay
        this.menuElement.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Event listeners
        if (this.triggerElement) {
            if (this.config.trigger === 'click') {
                this.triggerElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle();
                });
            } else if (this.config.trigger === 'hover') {
                this.triggerElement.addEventListener('mouseenter', () => this.open());
                this.triggerElement.addEventListener('mouseleave', () => this.close());
            }
        }
    }

    private renderItems(): void {
        if (!this.menuElement) return;

        this.menuElement.innerHTML = '';

        this.data.items.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.className = 'xwui-dropdown-menu-divider';
                divider.setAttribute('role', 'separator');
                this.menuElement!.appendChild(divider);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'xwui-dropdown-menu-item';
                menuItem.setAttribute('role', 'menuitem');
                menuItem.setAttribute('data-id', item.id);

                if (item.disabled) {
                    menuItem.classList.add('xwui-dropdown-menu-item-disabled');
                    menuItem.setAttribute('aria-disabled', 'true');
                } else {
                    menuItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (this.config.closeOnSelect) {
                            this.close();
                        }
                        this.clickHandlers.forEach(handler => handler(item, e));
                    });
                }

                if (item.icon) {
                    const icon = document.createElement('span');
                    icon.className = 'xwui-dropdown-menu-item-icon';
                    icon.innerHTML = item.icon;
                    menuItem.appendChild(icon);
                }

                const label = document.createElement('span');
                label.className = 'xwui-dropdown-menu-item-label';
                label.textContent = item.label;
                menuItem.appendChild(label);

                if (item.children && item.children.length > 0) {
                    const arrow = document.createElement('span');
                    arrow.className = 'xwui-dropdown-menu-item-arrow';
                    arrow.innerHTML = '›';
                    menuItem.appendChild(arrow);
                }

                this.menuElement!.appendChild(menuItem);
            }
        });
    }

    public open(): void {
        if (this.isOpen || !this.overlayElement || !this.menuElement) return;
        
        if (!this.triggerElement) {
            console.warn('XWUIMenuDropdown: Cannot open - trigger element not found');
            return;
        }

        document.body.appendChild(this.overlayElement);
        this.updatePosition();

        // Escape key handler
        this.escapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);

        // Use double requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.overlayElement?.classList.add('xwui-dropdown-menu-overlay-visible');
                this.menuElement?.classList.add('xwui-dropdown-menu-visible');
            });
        });

        this.isOpen = true;
    }

    public close(): void {
        if (!this.isOpen || !this.overlayElement) return;

        this.overlayElement.classList.remove('xwui-dropdown-menu-overlay-visible');
        this.menuElement?.classList.remove('xwui-dropdown-menu-visible');

        setTimeout(() => {
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
            }
        }, 200);

        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }

        this.isOpen = false;
    }

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private updatePosition(): void {
        if (!this.triggerElement || !this.menuElement) return;

        const triggerRect = this.triggerElement.getBoundingClientRect();
        
        // Force a layout calculation to get accurate menu dimensions
        this.menuElement.style.visibility = 'hidden';
        this.menuElement.style.display = 'block';
        const menuRect = this.menuElement.getBoundingClientRect();
        this.menuElement.style.visibility = '';
        this.menuElement.style.display = '';

        let top = 0;
        let left = 0;

        switch (this.config.placement) {
            case 'bottom':
                top = triggerRect.bottom + 4;
                break;
            case 'top':
                top = triggerRect.top - (menuRect.height || 200) - 4;
                break;
            case 'left':
                top = triggerRect.top;
                left = triggerRect.left - (menuRect.width || 200) - 4;
                break;
            case 'right':
                top = triggerRect.top;
                left = triggerRect.right + 4;
                break;
        }

        switch (this.config.align) {
            case 'start':
                left = triggerRect.left;
                break;
            case 'center':
                left = triggerRect.left + (triggerRect.width / 2) - ((menuRect.width || 200) / 2);
                break;
            case 'end':
                left = triggerRect.right - (menuRect.width || 200);
                break;
        }

        // Ensure menu stays within viewport
        const padding = 8;
        const maxLeft = window.innerWidth - (menuRect.width || 200) - padding;
        const maxTop = window.innerHeight - (menuRect.height || 200) - padding;
        
        left = Math.max(padding, Math.min(left, maxLeft));
        top = Math.max(padding, Math.min(top, maxTop));

        this.menuElement.style.top = `${top}px`;
        this.menuElement.style.left = `${left}px`;
    }

    public onItemClick(handler: (item: XWUIMenuDropdownItem, event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    public isOpened(): boolean {
        return this.isOpen;
    }

    public getElement(): HTMLElement | null {
        return this.menuElement;
    }

    public destroy(): void {
        this.close();
        this.clickHandlers = [];
        this.triggerElement = null;
        this.menuElement = null;
        this.overlayElement = null;
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIMenuDropdown as any).componentName = 'XWUIMenuDropdown';

