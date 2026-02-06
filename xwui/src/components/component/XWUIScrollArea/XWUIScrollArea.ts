/**
 * XWUIScrollArea Component
 * Custom scrollable area
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIScrollAreaConfig {
    orientation?: 'vertical' | 'horizontal' | 'both';
    hideScrollbar?: boolean;
    className?: string;
}

// Data type
export interface XWUIScrollAreaData {
    content: HTMLElement | string;
}

export class XWUIScrollArea extends XWUIComponent<XWUIScrollAreaData, XWUIScrollAreaConfig> {
    private scrollAreaElement: HTMLElement | null = null;
    private viewportElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIScrollAreaData,
        conf_comp: XWUIScrollAreaConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIScrollAreaConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIScrollAreaConfig {
        return {
            orientation: conf_comp?.orientation ?? 'vertical',
            hideScrollbar: conf_comp?.hideScrollbar ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.scrollAreaElement = document.createElement('div');
        this.scrollAreaElement.className = 'xwui-scroll-area';
        this.scrollAreaElement.classList.add(`xwui-scroll-area-${this.config.orientation}`);
        
        if (this.config.hideScrollbar) {
            this.scrollAreaElement.classList.add('xwui-scroll-area-hide-scrollbar');
        }
        if (this.config.className) {
            this.scrollAreaElement.classList.add(this.config.className);
        }

        this.viewportElement = document.createElement('div');
        this.viewportElement.className = 'xwui-scroll-area-viewport';

        if (typeof this.data.content === 'string') {
            this.viewportElement.innerHTML = this.data.content;
        } else {
            this.viewportElement.appendChild(this.data.content);
        }

        this.scrollAreaElement.appendChild(this.viewportElement);
        this.container.appendChild(this.scrollAreaElement);
    }

    public scrollToTop(): void {
        if (this.viewportElement) {
            this.viewportElement.scrollTop = 0;
        }
    }

    public scrollToBottom(): void {
        if (this.viewportElement) {
            this.viewportElement.scrollTop = this.viewportElement.scrollHeight;
        }
    }

    public scrollTo(x: number, y: number): void {
        if (this.viewportElement) {
            this.viewportElement.scrollLeft = x;
            this.viewportElement.scrollTop = y;
        }
    }

    public getElement(): HTMLElement | null {
        return this.scrollAreaElement;
    }

    public destroy(): void {
        if (this.scrollAreaElement) {
            this.scrollAreaElement.remove();
            this.scrollAreaElement = null;
            this.viewportElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIScrollArea as any).componentName = 'XWUIScrollArea';


