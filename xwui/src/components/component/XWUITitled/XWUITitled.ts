/**
 * XWUITitled Component
 * Component for displaying icon, title, subtitle, and body content
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIconSpan } from '../XWUIIcon/icon-utils';

// Component-level configuration
export interface XWUITitledConfig {
    iconSize?: number; // Icon size in pixels (standard sizes: 4, 8, 16, 32, 64, 128, 256, etc.)
    className?: string;
}

// Data type
export interface XWUITitledData {
    icon?: string; // Icon name for XWUIIcon
    title?: string;
    subtitle?: string;
    body?: HTMLElement | string;
}

export class XWUITitled extends XWUIComponent<XWUITitledData, XWUITitledConfig> {
    private titledElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUITitledData = {},
        conf_comp: XWUITitledConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITitledConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITitledConfig {
        return {
            iconSize: conf_comp?.iconSize ?? 16, // Default to 16px
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.titledElement = document.createElement('div');
        this.titledElement.className = 'xwui-titled';
        
        if (this.config.className) {
            this.titledElement.classList.add(this.config.className);
        }

        // Icon (optional)
        if (this.data.icon) {
            const iconContainer = document.createElement('div');
            iconContainer.className = 'xwui-titled-icon';
            const iconConfig: import('../XWUIIcon/XWUIIcon').XWUIIconConfig = {
                size: this.config.iconSize
            };
            const iconSpan = createIconSpan(this, this.data.icon, iconConfig, {}, this.conf_sys, this.conf_usr);
            iconContainer.appendChild(iconSpan);
            this.titledElement.appendChild(iconContainer);
        }

        // Content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'xwui-titled-content';

        // Title (optional)
        if (this.data.title) {
            const title = document.createElement('h3');
            title.className = 'xwui-titled-title';
            title.textContent = this.data.title;
            contentWrapper.appendChild(title);
        }

        // Subtitle (optional)
        if (this.data.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'xwui-titled-subtitle';
            subtitle.textContent = this.data.subtitle;
            contentWrapper.appendChild(subtitle);
        }

        // Body (optional)
        if (this.data.body) {
            const body = document.createElement('div');
            body.className = 'xwui-titled-body';
            if (typeof this.data.body === 'string') {
                body.innerHTML = this.data.body;
            } else {
                body.appendChild(this.data.body);
            }
            contentWrapper.appendChild(body);
        }

        this.titledElement.appendChild(contentWrapper);
        this.container.appendChild(this.titledElement);
    }

    public setIcon(icon: string): void {
        this.data.icon = icon;
        this.render();
    }

    public setTitle(title: string): void {
        this.data.title = title;
        const titleElement = this.titledElement?.querySelector('.xwui-titled-title');
        if (titleElement) {
            titleElement.textContent = title;
        } else if (this.data.title) {
            this.render();
        }
    }

    public setSubtitle(subtitle: string): void {
        this.data.subtitle = subtitle;
        const subtitleElement = this.titledElement?.querySelector('.xwui-titled-subtitle');
        if (subtitleElement) {
            subtitleElement.textContent = subtitle;
        } else if (this.data.subtitle) {
            this.render();
        }
    }

    public setBody(body: HTMLElement | string): void {
        this.data.body = body;
        const bodyElement = this.titledElement?.querySelector('.xwui-titled-body');
        if (bodyElement) {
            bodyElement.innerHTML = '';
            if (typeof body === 'string') {
                bodyElement.innerHTML = body;
            } else {
                bodyElement.appendChild(body);
            }
        } else if (this.data.body) {
            this.render();
        }
    }

    public getElement(): HTMLElement | null {
        return this.titledElement;
    }

    public destroy(): void {
        if (this.titledElement) {
            this.titledElement.remove();
            this.titledElement = null;
        }
    }
}

(XWUITitled as any).componentName = 'XWUITitled';

