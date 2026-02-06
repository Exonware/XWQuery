/**
 * XWUIToggleGroup Component
 * Group of toggle buttons
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';

export interface XWUIToggleGroupItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

// Component-level configuration
export interface XWUIToggleGroupConfig {
    variant?: 'default' | 'outlined';
    size?: 'small' | 'medium' | 'large';
    multiple?: boolean;
    className?: string;
}

// Data type
export interface XWUIToggleGroupData {
    items: XWUIToggleGroupItem[];
    selected?: string[];
}

export class XWUIToggleGroup extends XWUIComponent<XWUIToggleGroupData, XWUIToggleGroupConfig> {
    private groupElement: HTMLElement | null = null;
    private buttonInstances: Map<string, XWUIButton> = new Map();
    private changeHandlers: Array<(selected: string[]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIToggleGroupData,
        conf_comp: XWUIToggleGroupConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.selected = this.data.selected || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIToggleGroupConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIToggleGroupConfig {
        return {
            variant: conf_comp?.variant ?? 'default',
            size: conf_comp?.size ?? 'medium',
            multiple: conf_comp?.multiple ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.groupElement = document.createElement('div');
        this.groupElement.className = 'xwui-toggle-group';
        this.groupElement.classList.add(`xwui-toggle-group-${this.config.variant}`);
        
        if (this.config.className) {
            this.groupElement.classList.add(this.config.className);
        }

        this.data.items.forEach((item, index) => {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'xwui-toggle-group-item';
            buttonWrapper.setAttribute('data-item-id', item.id);

            const isSelected = this.data.selected?.includes(item.id);
            
            const buttonEl = document.createElement('div');
            const buttonInstance = new XWUIButton(
                buttonEl,
                {
                    text: item.label,
                    label: item.label,
                    icon: item.icon
                },
                {
                    variant: isSelected ? 'primary' : this.config.variant === 'default' ? 'secondary' : 'outlined',
                    size: this.config.size,
                    disabled: item.disabled
                }
            );
            this.registerChildComponent(buttonInstance);
            
            // Ensure button has accessible label
            const buttonElement = buttonEl.querySelector('button');
            if (buttonElement && !buttonElement.textContent?.trim() && !buttonElement.getAttribute('aria-label')) {
                buttonElement.setAttribute('aria-label', item.label || item.id);
            }

            if (isSelected) {
                buttonEl.classList.add('xwui-toggle-group-item-selected');
            }

            buttonInstance.onClick((e) => {
                if (!item.disabled) {
                    this.handleToggle(item.id, e);
                }
            });

            this.buttonInstances.set(item.id, buttonInstance);
            buttonWrapper.appendChild(buttonEl);
            this.groupElement.appendChild(buttonWrapper);
        });

        this.container.appendChild(this.groupElement);
    }

    private handleToggle(itemId: string, event: Event): void {
        if (!this.data.selected) {
            this.data.selected = [];
        }

        const index = this.data.selected.indexOf(itemId);
        if (index > -1) {
            // Deselect
            this.data.selected.splice(index, 1);
        } else {
            // Select
            if (this.config.multiple) {
                this.data.selected.push(itemId);
            } else {
                this.data.selected = [itemId];
            }
        }

        this.render();
        this.changeHandlers.forEach(handler => handler([...this.data.selected!]));
    }

    public setSelected(selected: string[]): void {
        this.data.selected = selected;
        this.render();
    }

    public getSelected(): string[] {
        return this.data.selected || [];
    }

    public onChange(handler: (selected: string[]) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.groupElement;
    }

    public destroy(): void {
        // Child components (buttonInstances) are automatically destroyed by base class
        this.buttonInstances.clear();
        this.changeHandlers = [];
        if (this.groupElement) {
            this.groupElement.remove();
            this.groupElement = null;
        }
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIToggleGroup as any).componentName = 'XWUIToggleGroup';


