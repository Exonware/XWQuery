/**
 * XWUISpoiler Component
 * Collapsible content with "show more" toggle
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUISpoilerConfig {
    maxHeight?: number;
    showLabel?: string;
    hideLabel?: string;
    transitionDuration?: number;
    className?: string;
}

export interface XWUISpoilerData {
    content?: string | HTMLElement;
}

export class XWUISpoiler extends XWUIComponent<XWUISpoilerData, XWUISpoilerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private contentElement: HTMLElement | null = null;
    private toggleButton: HTMLButtonElement | null = null;
    private isExpanded: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUISpoilerData = {},
        conf_comp: XWUISpoilerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISpoilerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISpoilerConfig {
        return {
            maxHeight: conf_comp?.maxHeight ?? 100,
            showLabel: conf_comp?.showLabel ?? 'Show more',
            hideLabel: conf_comp?.hideLabel ?? 'Show less',
            transitionDuration: conf_comp?.transitionDuration ?? 300,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-spoiler-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-spoiler';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'xwui-spoiler-content-wrapper';
        contentWrapper.style.maxHeight = `${this.config.maxHeight}px`;
        contentWrapper.style.overflow = 'hidden';
        contentWrapper.style.transition = `max-height ${this.config.transitionDuration}ms ease`;

        this.contentElement = document.createElement('div');
        this.contentElement.className = 'xwui-spoiler-content';
        
        if (typeof this.data.content === 'string') {
            this.contentElement.innerHTML = this.data.content;
        } else if (this.data.content) {
            this.contentElement.appendChild(this.data.content);
        }

        contentWrapper.appendChild(this.contentElement);
        this.wrapperElement.appendChild(contentWrapper);

        // Toggle button
        this.toggleButton = document.createElement('button');
        this.toggleButton.type = 'button';
        this.toggleButton.className = 'xwui-spoiler-toggle';
        this.toggleButton.textContent = this.config.showLabel || 'Show more';
        this.toggleButton.addEventListener('click', () => this.toggle());
        
        this.wrapperElement.appendChild(this.toggleButton);

        this.container.appendChild(this.wrapperElement);

        // Check if content needs spoiling
        this.checkContentHeight();
    }

    private checkContentHeight(): void {
        if (!this.contentElement || !this.wrapperElement) return;

        const contentHeight = this.contentElement.scrollHeight;
        const maxHeight = this.config.maxHeight || 100;

        if (contentHeight <= maxHeight) {
            // Content fits, hide toggle button
            if (this.toggleButton) {
                this.toggleButton.style.display = 'none';
            }
        }
    }

    private toggle(): void {
        this.isExpanded = !this.isExpanded;
        
        const contentWrapper = this.wrapperElement?.querySelector('.xwui-spoiler-content-wrapper') as HTMLElement;
        
        if (contentWrapper && this.contentElement) {
            if (this.isExpanded) {
                contentWrapper.style.maxHeight = `${this.contentElement.scrollHeight}px`;
                if (this.toggleButton) {
                    this.toggleButton.textContent = this.config.hideLabel || 'Show less';
                }
            } else {
                contentWrapper.style.maxHeight = `${this.config.maxHeight}px`;
                if (this.toggleButton) {
                    this.toggleButton.textContent = this.config.showLabel || 'Show more';
                }
            }
        }
    }

    public destroy(): void {
        if (this.toggleButton) {
            this.toggleButton = null;
        }
        if (this.contentElement) {
            this.contentElement = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISpoiler as any).componentName = 'XWUISpoiler';


