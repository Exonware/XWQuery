/**
 * XWUIMenuContext Component
 * Right-click context menu
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIMenuDropdown, type XWUIMenuDropdownItem } from '../XWUIMenuDropdown/XWUIMenuDropdown';

// Component-level configuration
export interface XWUIMenuContextConfig {
    className?: string;
}

// Data type
export interface XWUIMenuContextData {
    items: XWUIMenuDropdownItem[];
    targetElement?: HTMLElement | string;
}

export class XWUIMenuContext extends XWUIComponent<XWUIMenuContextData, XWUIMenuContextConfig> {
    private contextMenuInstance: XWUIMenuDropdown | null = null;
    private targetElement: HTMLElement | null = null;
    private contextMenuHandler: ((e: MouseEvent) => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMenuContextData,
        conf_comp: XWUIMenuContextConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initialize();
    }

    protected createConfig(
        conf_comp?: XWUIMenuContextConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMenuContextConfig {
        return {
            className: conf_comp?.className
        };
    }

    private initialize(): void {
        // Find target element
        if (this.data.targetElement) {
            if (typeof this.data.targetElement === 'string') {
                this.targetElement = document.querySelector(this.data.targetElement);
            } else {
                this.targetElement = this.data.targetElement;
            }
        } else {
            this.targetElement = this.container;
        }

        // Create dropdown menu instance
        this.contextMenuInstance = new XWUIMenuDropdown(
            this.container,
            {
                items: this.data.items,
                triggerElement: this.targetElement
            },
            {
                trigger: 'click',
                placement: 'bottom',
                align: 'start',
                closeOnSelect: true,
                className: this.config.className
            }
        );

        // Override trigger to use right-click
        if (this.targetElement) {
            this.contextMenuHandler = (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                // Position menu at cursor
                this.openAt(e.clientX, e.clientY);
            };

            this.targetElement.addEventListener('contextmenu', this.contextMenuHandler);
        }

        // Close on click outside
        document.addEventListener('click', () => {
            if (this.contextMenuInstance?.isOpened()) {
                this.contextMenuInstance.close();
            }
        });
    }

    private openAt(x: number, y: number): void {
        if (!this.contextMenuInstance) return;
        
        this.contextMenuInstance.open();
        
        // Update position manually
        const menuElement = this.contextMenuInstance.getElement();
        if (menuElement) {
            menuElement.style.position = 'fixed';
            menuElement.style.top = `${y}px`;
            menuElement.style.left = `${x}px`;
        }
    }

    public onItemClick(handler: (item: XWUIMenuDropdownItem, event: Event) => void): void {
        if (this.contextMenuInstance) {
            this.contextMenuInstance.onItemClick(handler);
        }
    }

    public destroy(): void {
        if (this.targetElement && this.contextMenuHandler) {
            this.targetElement.removeEventListener('contextmenu', this.contextMenuHandler);
        }
        if (this.contextMenuInstance) {
            this.contextMenuInstance.destroy();
            this.contextMenuInstance = null;
        }
        this.targetElement = null;
        this.contextMenuHandler = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMenuContext as any).componentName = 'XWUIMenuContext';


