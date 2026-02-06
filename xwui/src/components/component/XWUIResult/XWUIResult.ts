/**
 * XWUIResult Component
 * Result page/section with icons for success, error, info, warning
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIResultConfig {
    status?: 'success' | 'error' | 'info' | 'warning';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIResultData {
    title: string;
    description?: string;
    icon?: string;
    extra?: HTMLElement | string;
}

export class XWUIResult extends XWUIComponent<XWUIResultData, XWUIResultConfig> {
    private resultElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIResultData,
        conf_comp: XWUIResultConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIResultConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIResultConfig {
        return {
            status: conf_comp?.status ?? 'info',
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.resultElement = document.createElement('div');
        this.resultElement.className = 'xwui-result';
        this.resultElement.classList.add(`xwui-result-${this.config.status}`);
        this.resultElement.classList.add(`xwui-result-${this.config.size}`);
        
        if (this.config.className) {
            this.resultElement.classList.add(this.config.className);
        }

        // Icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'xwui-result-icon';
        
        if (this.data.icon) {
            iconContainer.innerHTML = this.data.icon;
        } else {
            iconContainer.innerHTML = this.getDefaultIcon();
        }
        
        this.resultElement.appendChild(iconContainer);

        // Title
        const title = document.createElement('div');
        title.className = 'xwui-result-title';
        title.textContent = this.data.title;
        this.resultElement.appendChild(title);

        // Description
        if (this.data.description) {
            const desc = document.createElement('div');
            desc.className = 'xwui-result-description';
            desc.textContent = this.data.description;
            this.resultElement.appendChild(desc);
        }

        // Extra content
        if (this.data.extra) {
            const extra = document.createElement('div');
            extra.className = 'xwui-result-extra';
            
            if (typeof this.data.extra === 'string') {
                extra.innerHTML = this.data.extra;
            } else {
                extra.appendChild(this.data.extra);
            }
            
            this.resultElement.appendChild(extra);
        }

        this.container.appendChild(this.resultElement);
    }

    private getDefaultIcon(): string {
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
        };
        return icons[this.config.status || 'info'];
    }

    public getElement(): HTMLElement | null {
        return this.resultElement;
    }

    public destroy(): void {
        if (this.resultElement) {
            this.resultElement.remove();
            this.resultElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIResult as any).componentName = 'XWUIResult';


