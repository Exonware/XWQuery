/**
 * XWUITag Component
 * Base tag component for simple tag display
 * XWUIChip extends this component with interactivity and richer visuals
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITagConfig {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUITagData {
    label: string;
}

export class XWUITag extends XWUIComponent<XWUITagData, XWUITagConfig> {
    private tagElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUITagData,
        conf_comp: XWUITagConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITagConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITagConfig {
        return {
            variant: conf_comp?.variant ?? 'default',
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.tagElement = document.createElement('span');
        this.tagElement.className = 'xwui-tag';
        this.tagElement.classList.add(`xwui-tag-${this.config.variant}`);
        this.tagElement.classList.add(`xwui-tag-${this.config.size}`);
        
        if (this.config.className) {
            this.tagElement.classList.add(this.config.className);
        }

        // Label
        const label = document.createElement('span');
        label.className = 'xwui-tag-label';
        label.textContent = this.data.label;
        this.tagElement.appendChild(label);

        this.container.appendChild(this.tagElement);
    }

    public setLabel(label: string): void {
        this.data.label = label;
        const labelElement = this.tagElement?.querySelector('.xwui-tag-label');
        if (labelElement) {
            labelElement.textContent = label;
        }
    }

    public getElement(): HTMLElement | null {
        return this.tagElement;
    }

    public destroy(): void {
        if (this.tagElement) {
            this.tagElement.remove();
            this.tagElement = null;
        }
    }
}

(XWUITag as any).componentName = 'XWUITag';

