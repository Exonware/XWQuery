/**
 * XWUIVisuallyHidden Component
 * Hide content visually while keeping it accessible to screen readers
 * Follows ARIA best practices for visually hidden content
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIVisuallyHiddenConfig {
    as?: keyof HTMLElementTagNameMap;
    className?: string;
}

// Data type
export interface XWUIVisuallyHiddenData {
    content?: string;
    children?: string | HTMLElement;
}

export class XWUIVisuallyHidden extends XWUIComponent<XWUIVisuallyHiddenData, XWUIVisuallyHiddenConfig> {
    private element: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIVisuallyHiddenData = {},
        conf_comp: XWUIVisuallyHiddenConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIVisuallyHiddenConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIVisuallyHiddenConfig {
        return {
            as: conf_comp?.as ?? 'span',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-visually-hidden-container';

        // Create the visually hidden element
        const elementType = this.config.as || 'span';
        this.element = document.createElement(elementType);
        this.element.className = 'xwui-visually-hidden';
        
        if (this.config.className) {
            this.element.classList.add(this.config.className);
        }

        // Set content
        if (this.data.children instanceof HTMLElement) {
            // If children is an HTMLElement, append it
            this.element.appendChild(this.data.children);
        } else if (this.data.children) {
            // If children is a string, set as innerHTML
            this.element.innerHTML = this.data.children;
        } else if (this.data.content) {
            // Fallback to content property
            this.element.textContent = this.data.content;
        }

        this.container.appendChild(this.element);
    }

    /**
     * Set content
     */
    public setContent(content: string | HTMLElement): void {
        if (content instanceof HTMLElement) {
            this.data.children = content;
        } else {
            this.data.content = content;
        }
        this.render();
    }

    /**
     * Get the visually hidden element
     */
    public getElement(): HTMLElement | null {
        return this.element;
    }

    /**
     * Show the element visually (remove visually hidden class)
     */
    public show(): void {
        if (this.element) {
            this.element.classList.remove('xwui-visually-hidden');
        }
    }

    /**
     * Hide the element visually (add visually hidden class)
     */
    public hide(): void {
        if (this.element) {
            this.element.classList.add('xwui-visually-hidden');
        }
    }

    public destroy(): void {
        if (this.element) {
            this.element = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIVisuallyHidden as any).componentName = 'XWUIVisuallyHidden';


