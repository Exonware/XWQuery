/**
 * XWUICenter Component
 * Center content horizontally and/or vertically
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUICenterConfig {
    horizontal?: boolean;
    vertical?: boolean;
    inline?: boolean;
    className?: string;
}

export interface XWUICenterData {
    content?: string | HTMLElement;
    children?: string | HTMLElement;
}

export class XWUICenter extends XWUIComponent<XWUICenterData, XWUICenterConfig> {
    private centerElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUICenterData = {},
        conf_comp: XWUICenterConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICenterConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICenterConfig {
        return {
            horizontal: conf_comp?.horizontal ?? true,
            vertical: conf_comp?.vertical ?? false,
            inline: conf_comp?.inline ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-center-wrapper';

        this.centerElement = document.createElement('div');
        this.centerElement.className = 'xwui-center';
        
        if (this.config.className) {
            this.centerElement.classList.add(this.config.className);
        }

        if (this.config.inline) {
            this.centerElement.style.display = 'inline-block';
            if (this.config.horizontal) {
                this.centerElement.style.textAlign = 'center';
            }
        } else {
            this.centerElement.style.display = 'flex';
            
            if (this.config.horizontal) {
                this.centerElement.style.justifyContent = 'center';
            }
            
            if (this.config.vertical) {
                this.centerElement.style.alignItems = 'center';
            }
            
            if (this.config.horizontal && !this.config.vertical) {
                this.centerElement.style.flexDirection = 'row';
            } else if (this.config.vertical && !this.config.horizontal) {
                this.centerElement.style.flexDirection = 'column';
            }
        }

        const content = this.data.children || this.data.content;
        if (content instanceof HTMLElement) {
            this.centerElement.appendChild(content);
        } else if (typeof content === 'string') {
            this.centerElement.innerHTML = content;
        }

        this.container.appendChild(this.centerElement);
    }

    public setContent(content: string | HTMLElement): void {
        this.data.children = content;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.centerElement;
    }

    public destroy(): void {
        if (this.centerElement) {
            this.centerElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICenter as any).componentName = 'XWUICenter';


