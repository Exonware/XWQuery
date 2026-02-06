/**
 * XWUILabel Component
 * Form label component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUILabelConfig {
    required?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    htmlFor?: string;
    className?: string;
}

// Data type
export interface XWUILabelData {
    text: string;
}

export class XWUILabel extends XWUIComponent<XWUILabelData, XWUILabelConfig> {
    private labelElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUILabelData,
        conf_comp: XWUILabelConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUILabelConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUILabelConfig {
        return {
            required: conf_comp?.required ?? false,
            disabled: conf_comp?.disabled ?? false,
            size: conf_comp?.size ?? 'medium',
            htmlFor: conf_comp?.htmlFor,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.labelElement = document.createElement('label');
        this.labelElement.className = 'xwui-label';
        this.labelElement.classList.add(`xwui-label-${this.config.size}`);
        
        if (this.config.disabled) {
            this.labelElement.classList.add('xwui-label-disabled');
        }
        if (this.config.className) {
            this.labelElement.classList.add(this.config.className);
        }

        if (this.config.htmlFor) {
            this.labelElement.setAttribute('for', this.config.htmlFor);
        }

        this.labelElement.textContent = this.data.text;

        if (this.config.required) {
            const required = document.createElement('span');
            required.className = 'xwui-label-required';
            required.textContent = ' *';
            required.setAttribute('aria-label', 'required');
            this.labelElement.appendChild(required);
        }

        this.container.appendChild(this.labelElement);
    }

    public setText(text: string): void {
        this.data.text = text;
        if (this.labelElement) {
            const required = this.labelElement.querySelector('.xwui-label-required');
            this.labelElement.textContent = text;
            if (required && this.config.required) {
                this.labelElement.appendChild(required);
            }
        }
    }

    public getElement(): HTMLElement | null {
        return this.labelElement;
    }

    public destroy(): void {
        if (this.labelElement) {
            this.labelElement.remove();
            this.labelElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUILabel as any).componentName = 'XWUILabel';


