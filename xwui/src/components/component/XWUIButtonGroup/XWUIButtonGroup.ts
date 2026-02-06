/**
 * XWUIButtonGroup Component
 * Group of buttons
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';

export interface XWUIButtonGroupItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

// Component-level configuration
export interface XWUIButtonGroupConfig {
    variant?: 'default' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

// Data type
export interface XWUIButtonGroupData {
    buttons: XWUIButtonGroupItem[];
    selected?: string[];
}

export class XWUIButtonGroup extends XWUIComponent<XWUIButtonGroupData, XWUIButtonGroupConfig> {
    private groupElement: HTMLElement | null = null;
    private buttonInstances: Map<string, XWUIButton> = new Map();
    private clickHandlers: Array<(buttonId: string, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIButtonGroupData,
        conf_comp: XWUIButtonGroupConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.selected = this.data.selected || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIButtonGroupConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIButtonGroupConfig {
        return {
            variant: conf_comp?.variant ?? 'default',
            size: conf_comp?.size ?? 'medium',
            orientation: conf_comp?.orientation ?? 'horizontal',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.groupElement = document.createElement('div');
        this.groupElement.className = 'xwui-button-group';
        this.groupElement.classList.add(`xwui-button-group-${this.config.orientation}`);
        this.groupElement.classList.add(`xwui-button-group-${this.config.variant}`);
        
        if (this.config.className) {
            this.groupElement.classList.add(this.config.className);
        }

        if (!this.data.buttons || !Array.isArray(this.data.buttons)) {
            console.warn('XWUIButtonGroup: No buttons provided');
            return;
        }
        
        this.data.buttons.forEach((button, index) => {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'xwui-button-group-item';

            const buttonEl = document.createElement('div');
            const buttonInstance = new XWUIButton(
                buttonEl,
                {
                    label: button.label,
                    icon: button.icon
                },
                {
                    variant: this.config.variant === 'default' ? 'primary' : this.config.variant,
                    size: this.config.size,
                    disabled: button.disabled
                }
            );

            if (this.data.selected?.includes(button.id)) {
                buttonEl.classList.add('xwui-button-group-item-selected');
            }

            buttonInstance.onClick((e) => {
                if (!button.disabled) {
                    this.handleButtonClick(button.id, e);
                }
            });

            this.buttonInstances.set(button.id, buttonInstance);
            buttonWrapper.appendChild(buttonEl);
            this.groupElement!.appendChild(buttonWrapper);
        });

        this.container.appendChild(this.groupElement);
    }

    private handleButtonClick(buttonId: string, event: Event): void {
        // Toggle selection
        if (!this.data.selected) {
            this.data.selected = [];
        }

        const index = this.data.selected.indexOf(buttonId);
        if (index > -1) {
            this.data.selected.splice(index, 1);
        } else {
            this.data.selected.push(buttonId);
        }

        this.updateSelection();
        this.clickHandlers.forEach(handler => handler(buttonId, event));
    }

    private updateSelection(): void {
        this.data.buttons.forEach(button => {
            const buttonEl = this.groupElement?.querySelector(`[data-button-id="${button.id}"]`)?.parentElement;
            if (buttonEl) {
                if (this.data.selected?.includes(button.id)) {
                    buttonEl.classList.add('xwui-button-group-item-selected');
                } else {
                    buttonEl.classList.remove('xwui-button-group-item-selected');
                }
            }
        });
    }

    public onButtonClick(handler: (buttonId: string, event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.groupElement;
    }

    public destroy(): void {
        this.buttonInstances.forEach(instance => instance.destroy());
        this.buttonInstances.clear();
        this.clickHandlers = [];
        if (this.groupElement) {
            this.groupElement.remove();
            this.groupElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIButtonGroup as any).componentName = 'XWUIButtonGroup';


