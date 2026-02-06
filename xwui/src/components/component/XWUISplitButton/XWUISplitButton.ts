/**
 * XWUISplitButton Component
 * Button with main action and dropdown arrow for secondary actions
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIMenuDropdown } from '../XWUIMenuDropdown/XWUIMenuDropdown';

export interface XWUISplitButtonItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

// Component-level configuration
export interface XWUISplitButtonConfig {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    dropdownPlacement?: 'bottom' | 'top' | 'left' | 'right';
    className?: string;
}

// Data type
export interface XWUISplitButtonData {
    label?: string;
    text?: string;
    onClick?: (event: MouseEvent) => void;
    items: XWUISplitButtonItem[];
}

export class XWUISplitButton extends XWUIComponent<XWUISplitButtonData, XWUISplitButtonConfig> {
    private wrapperElement: HTMLElement | null = null;
    private mainButton: XWUIButton | null = null;
    private dropdownButton: XWUIButton | null = null;
    private dropdownMenu: XWUIMenuDropdown | null = null;
    private dropdownContainer: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISplitButtonData,
        conf_comp: XWUISplitButtonConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISplitButtonConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISplitButtonConfig {
        return {
            variant: conf_comp?.variant ?? 'primary',
            size: conf_comp?.size ?? 'medium',
            disabled: conf_comp?.disabled ?? false,
            loading: conf_comp?.loading ?? false,
            dropdownPlacement: conf_comp?.dropdownPlacement ?? 'bottom',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-split-button-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-split-button-wrapper';

        // Main button
        const mainButtonContainer = document.createElement('div');
        mainButtonContainer.className = 'xwui-split-button-main';
        
        this.mainButton = new XWUIButton(
            mainButtonContainer,
            {
                text: this.data.label || this.data.text || 'Action',
                label: this.data.label || this.data.text || 'Action'
            },
            {
                variant: this.config.variant,
                size: this.config.size,
                disabled: this.config.disabled,
                loading: this.config.loading
            }
        );
        this.registerChildComponent(this.mainButton);

        // Add main button click handler
        if (this.data.onClick) {
            this.mainButton.onClick(this.data.onClick);
        }

        this.wrapperElement.appendChild(mainButtonContainer);

        // Divider
        const divider = document.createElement('div');
        divider.className = 'xwui-split-button-divider';
        this.wrapperElement.appendChild(divider);

        // Dropdown button
        const dropdownButtonContainer = document.createElement('div');
        dropdownButtonContainer.className = 'xwui-split-button-dropdown';
        
        // Note: XWUIButton uses XWUIItem which currently has hardcoded SVGs
        // For now, we'll use a simple approach - the icon name will be passed to XWUIButton
        // TODO: When XWUIItem is updated to use XWUIIcon, this will automatically use it
        this.dropdownButton = new XWUIButton(
            dropdownButtonContainer,
            {
                text: '',
                label: 'More options'
            },
            {
                variant: this.config.variant,
                size: this.config.size,
                disabled: this.config.disabled,
                // Pass icon name - XWUIButton/XWUIItem should handle this through XWUIIcon when updated
                icon: 'chevron-down',
                iconPosition: 'right'
            }
        );
        this.registerChildComponent(this.dropdownButton);

        // Add aria-label for dropdown button
        const dropdownButtonEl = this.dropdownButton.getElement();
        if (dropdownButtonEl) {
            dropdownButtonEl.setAttribute('aria-label', 'More options');
            dropdownButtonEl.setAttribute('aria-haspopup', 'true');
        }

        this.wrapperElement.appendChild(dropdownButtonContainer);

        this.container.appendChild(this.wrapperElement);

        // Create dropdown menu
        this.createDropdownMenu();
    }

    private createDropdownMenu(): void {
        if (!this.dropdownButton || !this.data.items || this.data.items.length === 0) return;

        // Create container for dropdown
        this.dropdownContainer = document.createElement('div');
        this.dropdownContainer.className = 'xwui-split-button-dropdown-container';
        document.body.appendChild(this.dropdownContainer);

        // Get dropdown button element
        const dropdownButtonEl = this.dropdownButton.getElement();
        if (!dropdownButtonEl) return;

        // Create dropdown menu
        this.dropdownMenu = new XWUIMenuDropdown(
            this.dropdownContainer,
            {
                items: this.data.items.map(item => ({
                    id: item.id,
                    label: item.label,
                    icon: item.icon,
                    disabled: item.disabled
                })),
                triggerElement: dropdownButtonEl
            },
            {
                trigger: 'click',
                placement: this.config.dropdownPlacement,
                align: 'start',
                closeOnSelect: true
            }
        );
        this.registerChildComponent(this.dropdownMenu);

        // Handle menu item clicks
        this.dropdownMenu.onItemClick((item, event) => {
            // Item click is handled by dropdown menu
            // You can add custom handlers here if needed
        });
    }

    /**
     * Set main button click handler
     */
    public setOnClick(handler: (event: MouseEvent) => void): void {
        this.data.onClick = handler;
        if (this.mainButton) {
            // Remove existing handlers and add new one
            this.mainButton.onClick(handler);
        }
    }

    /**
     * Set dropdown items
     */
    public setItems(items: XWUISplitButtonItem[]): void {
        this.data.items = items;
        if (this.dropdownMenu) {
            this.dropdownMenu.destroy();
            this.dropdownMenu = null;
        }
        if (this.dropdownContainer) {
            this.dropdownContainer.remove();
            this.dropdownContainer = null;
        }
        this.createDropdownMenu();
    }

    /**
     * Set main button text
     */
    public setLabel(label: string): void {
        this.data.label = label;
        this.data.text = label;
        // Re-render main button
        if (this.mainButton) {
            const container = this.wrapperElement?.querySelector('.xwui-split-button-main');
            if (container) {
                container.innerHTML = '';
                this.mainButton = new XWUIButton(
                    container,
                    {
                        text: label,
                        label: label
                    },
                    {
                        variant: this.config.variant,
                        size: this.config.size,
                        disabled: this.config.disabled,
                        loading: this.config.loading
                    }
                );
                if (this.data.onClick) {
                    this.mainButton.onClick(this.data.onClick);
                }
            }
        }
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // Child components are automatically destroyed by base class
        if (this.dropdownContainer) {
            this.dropdownContainer.remove();
            this.dropdownContainer = null;
        }
        this.mainButton = null;
        this.dropdownButton = null;
        this.dropdownMenu = null;
        this.wrapperElement = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISplitButton as any).componentName = 'XWUISplitButton';


