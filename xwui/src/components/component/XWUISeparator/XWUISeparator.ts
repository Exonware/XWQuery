/**
 * XWUISeparator Component
 * Visual separator/divider component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUISeparatorConfig {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
    className?: string;
}

// Data type
export interface XWUISeparatorData {
    label?: string;
}

export class XWUISeparator extends XWUIComponent<XWUISeparatorData, XWUISeparatorConfig> {
    private separatorElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISeparatorData = {},
        conf_comp: XWUISeparatorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISeparatorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISeparatorConfig {
        return {
            orientation: conf_comp?.orientation ?? 'horizontal',
            decorative: conf_comp?.decorative ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.separatorElement = document.createElement('div');
        this.separatorElement.className = 'xwui-separator';
        this.separatorElement.classList.add(`xwui-separator-${this.config.orientation}`);
        
        if (this.config.decorative) {
            this.separatorElement.setAttribute('role', 'separator');
            this.separatorElement.setAttribute('aria-orientation', this.config.orientation);
        } else {
            this.separatorElement.setAttribute('role', 'none');
        }
        
        if (this.config.className) {
            this.separatorElement.classList.add(this.config.className);
        }

        if (this.data.label && this.config.orientation === 'horizontal') {
            const wrapper = document.createElement('div');
            wrapper.className = 'xwui-separator-with-label';
            
            const line1 = document.createElement('div');
            line1.className = 'xwui-separator-line';
            wrapper.appendChild(line1);
            
            const label = document.createElement('span');
            label.className = 'xwui-separator-label';
            label.textContent = this.data.label;
            wrapper.appendChild(label);
            
            const line2 = document.createElement('div');
            line2.className = 'xwui-separator-line';
            wrapper.appendChild(line2);
            
            this.separatorElement.appendChild(wrapper);
        }

        this.container.appendChild(this.separatorElement);
    }

    public getElement(): HTMLElement | null {
        return this.separatorElement;
    }

    public destroy(): void {
        if (this.separatorElement) {
            this.separatorElement.remove();
            this.separatorElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISeparator as any).componentName = 'XWUISeparator';


