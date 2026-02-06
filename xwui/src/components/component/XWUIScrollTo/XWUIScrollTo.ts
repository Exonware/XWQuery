/**
 * XWUIScrollTo Component
 * Smooth scroll to target element
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIScrollToConfig {
    behavior?: 'auto' | 'smooth';
    block?: 'start' | 'center' | 'end' | 'nearest';
    inline?: 'start' | 'center' | 'end' | 'nearest';
    offset?: number;
    className?: string;
}

// Data type
export interface XWUIScrollToData {
    targetId?: string;
    targetElement?: HTMLElement;
    content?: HTMLElement | string;
}

export class XWUIScrollTo extends XWUIComponent<XWUIScrollToData, XWUIScrollToConfig> {
    private scrollElement: HTMLElement | null = null;
    private targetElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIScrollToData = {},
        conf_comp: XWUIScrollToConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIScrollToConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIScrollToConfig {
        return {
            behavior: conf_comp?.behavior ?? 'smooth',
            block: conf_comp?.block ?? 'start',
            inline: conf_comp?.inline ?? 'nearest',
            offset: conf_comp?.offset ?? 0,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.scrollElement = document.createElement('div');
        this.scrollElement.className = 'xwui-scrollto';
        
        if (this.config.className) {
            this.scrollElement.classList.add(this.config.className);
        }

        if (this.data.content) {
            if (typeof this.data.content === 'string') {
                this.scrollElement.innerHTML = this.data.content;
            } else {
                this.scrollElement.appendChild(this.data.content);
            }
        }

        this.container.appendChild(this.scrollElement);

        // Find target element
        if (this.data.targetId) {
            this.targetElement = document.getElementById(this.data.targetId);
        } else if (this.data.targetElement) {
            this.targetElement = this.data.targetElement;
        }
    }

    public scrollToTarget(): void {
        if (!this.targetElement) {
            if (this.data.targetId) {
                this.targetElement = document.getElementById(this.data.targetId);
            }
        }

        if (!this.targetElement) {
            console.warn('XWUIScrollTo: Target element not found');
            return;
        }

        const options: ScrollIntoViewOptions = {
            behavior: this.config.behavior,
            block: this.config.block,
            inline: this.config.inline
        };

        if (this.config.offset && this.config.offset !== 0) {
            // Use scrollTo with offset calculation
            const elementPosition = this.targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - this.config.offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: this.config.behavior
            });
        } else {
            this.targetElement.scrollIntoView(options);
        }
    }

    public setTarget(targetId: string | HTMLElement): void {
        if (typeof targetId === 'string') {
            this.data.targetId = targetId;
            this.targetElement = document.getElementById(targetId);
        } else {
            this.data.targetElement = targetId;
            this.targetElement = targetId;
        }
    }

    public getElement(): HTMLElement | null {
        return this.scrollElement;
    }

    public destroy(): void {
        this.scrollElement = null;
        this.targetElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIScrollTo as any).componentName = 'XWUIScrollTo';


