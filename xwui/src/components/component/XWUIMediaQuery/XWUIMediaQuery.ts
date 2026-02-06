/**
 * XWUIMediaQuery Component
 * Wrapper that shows/hides content based on media query matches
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIMediaQueryConfig {
    query: string; // Media query string (e.g., '(max-width: 768px)')
    matches?: boolean; // Initial matches state (will be set automatically)
    className?: string;
}

// Data type
export interface XWUIMediaQueryData {
    content?: string | HTMLElement;
}

export class XWUIMediaQuery extends XWUIComponent<XWUIMediaQueryData, XWUIMediaQueryConfig> {
    private wrapperElement: HTMLElement | null = null;
    private mediaQueryList: MediaQueryList | null = null;
    private changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMediaQueryData = {},
        conf_comp: XWUIMediaQueryConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupMediaQuery();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMediaQueryConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMediaQueryConfig {
        if (!conf_comp?.query) {
            throw new Error('XWUIMediaQuery: query is required');
        }
        
        return {
            query: conf_comp.query,
            matches: conf_comp.matches,
            className: conf_comp.className
        };
    }

    private setupMediaQuery(): void {
        if (!window.matchMedia) {
            console.warn('XWUIMediaQuery: matchMedia not supported');
            return;
        }

        this.mediaQueryList = window.matchMedia(this.config.query);
        this.config.matches = this.mediaQueryList.matches;

        this.changeHandler = (e: MediaQueryListEvent) => {
            this.config.matches = e.matches;
            this.updateVisibility();
        };

        // Modern browsers
        if (this.mediaQueryList.addEventListener) {
            this.mediaQueryList.addEventListener('change', this.changeHandler);
        } else {
            // Fallback for older browsers
            this.mediaQueryList.addListener(this.changeHandler);
        }
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-media-query-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-media-query-wrapper';

        // Set content
        if (this.data.content) {
            if (typeof this.data.content === 'string') {
                this.wrapperElement.innerHTML = this.data.content;
            } else if (this.data.content instanceof HTMLElement) {
                this.wrapperElement.appendChild(this.data.content);
            }
        }

        this.container.appendChild(this.wrapperElement);
        this.updateVisibility();
    }

    private updateVisibility(): void {
        if (!this.wrapperElement) return;

        if (this.config.matches) {
            this.wrapperElement.style.display = '';
            this.container.style.display = '';
        } else {
            this.wrapperElement.style.display = 'none';
            this.container.style.display = 'none';
        }
    }

    /**
     * Check if media query currently matches
     */
    public matches(): boolean {
        return this.config.matches || false;
    }

    /**
     * Set content
     */
    public setContent(content: string | HTMLElement): void {
        this.data.content = content;
        if (this.wrapperElement) {
            this.wrapperElement.innerHTML = '';
            if (typeof content === 'string') {
                this.wrapperElement.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                this.wrapperElement.appendChild(content);
            }
        }
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.mediaQueryList && this.changeHandler) {
            if (this.mediaQueryList.removeEventListener) {
                this.mediaQueryList.removeEventListener('change', this.changeHandler);
            } else {
                this.mediaQueryList.removeListener(this.changeHandler);
            }
        }
        this.mediaQueryList = null;
        this.changeHandler = null;
        this.wrapperElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMediaQuery as any).componentName = 'XWUIMediaQuery';


