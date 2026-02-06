/**
 * XWUISpinner Component
 * Loading spinner with overlay option
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUISpinnerConfig {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'white';
    overlay?: boolean;
    blur?: boolean;
    className?: string;
}

// Data type
export interface XWUISpinnerData {
    label?: string;
    spinning?: boolean;
}

export class XWUISpinner extends XWUIComponent<XWUISpinnerData, XWUISpinnerConfig> {
    static componentName = 'XWUISpinner';
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISpinnerData = {},
        conf_comp: XWUISpinnerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        if (this.data.spinning === undefined) {
            this.data.spinning = true;
        }
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISpinnerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISpinnerConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            color: conf_comp?.color ?? 'primary',
            overlay: conf_comp?.overlay ?? false,
            blur: conf_comp?.blur ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        if (!this.data.spinning) {
            return;
        }

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-spinner';
        this.wrapperElement.classList.add(`xwui-spinner-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-spinner-${this.config.color}`);
        
        if (this.config.overlay) {
            this.wrapperElement.classList.add('xwui-spinner-overlay');
        }
        if (this.config.blur) {
            this.wrapperElement.classList.add('xwui-spinner-blur');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Spinner SVG
        const spinner = document.createElement('div');
        spinner.className = 'xwui-spinner-icon';
        spinner.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
        `;
        this.wrapperElement.appendChild(spinner);

        // Label
        if (this.data.label) {
            const labelElement = document.createElement('span');
            labelElement.className = 'xwui-spinner-label';
            labelElement.textContent = this.data.label;
            this.wrapperElement.appendChild(labelElement);
        }

        this.container.appendChild(this.wrapperElement);
    }

    public show(label?: string): void {
        this.data.spinning = true;
        if (label) {
            this.data.label = label;
        }
        this.render();
    }

    public hide(): void {
        this.data.spinning = false;
        this.render();
    }

    public setLabel(label: string): void {
        this.data.label = label;
        const labelElement = this.wrapperElement?.querySelector('.xwui-spinner-label');
        if (labelElement) {
            labelElement.textContent = label;
        } else if (this.data.spinning) {
            this.render();
        }
    }

    public isSpinning(): boolean {
        return this.data.spinning || false;
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISpinner as any).componentName = 'XWUISpinner';


