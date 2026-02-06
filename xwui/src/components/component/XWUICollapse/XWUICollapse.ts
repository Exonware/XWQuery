/**
 * XWUICollapse Component
 * Animated expand/collapse container
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUICollapseConfig {
    expanded?: boolean;
    duration?: number;              // Animation duration in ms
    easing?: string;                // CSS easing function
    destroyOnCollapse?: boolean;    // Whether to remove content from DOM when collapsed
    className?: string;
}

// Data type
export interface XWUICollapseData {
    content?: HTMLElement | string;
}

export class XWUICollapse extends XWUIComponent<XWUICollapseData, XWUICollapseConfig> {
    private wrapperElement: HTMLElement | null = null;
    private contentElement: HTMLElement | null = null;
    private isExpanded: boolean = false;
    private isAnimating: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUICollapseData = {},
        conf_comp: XWUICollapseConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.isExpanded = this.config.expanded ?? false;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICollapseConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICollapseConfig {
        return {
            expanded: conf_comp?.expanded ?? false,
            duration: conf_comp?.duration ?? 200,
            easing: conf_comp?.easing ?? 'ease-out',
            destroyOnCollapse: conf_comp?.destroyOnCollapse ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-collapse';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        this.wrapperElement.style.overflow = 'hidden';
        this.wrapperElement.style.transition = `height ${this.config.duration}ms ${this.config.easing}`;

        // Create content container
        this.contentElement = document.createElement('div');
        this.contentElement.className = 'xwui-collapse-content';

        // Add content
        if (this.data.content) {
            if (typeof this.data.content === 'string') {
                this.contentElement.innerHTML = this.data.content;
            } else {
                this.contentElement.appendChild(this.data.content);
            }
        }

        this.wrapperElement.appendChild(this.contentElement);
        this.container.appendChild(this.wrapperElement);

        // Set initial state
        if (this.isExpanded) {
            this.wrapperElement.style.height = 'auto';
            this.wrapperElement.classList.add('xwui-collapse-expanded');
        } else {
            this.wrapperElement.style.height = '0';
            this.wrapperElement.classList.add('xwui-collapse-collapsed');
        }
    }

    public expand(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isExpanded || this.isAnimating || !this.wrapperElement || !this.contentElement) {
                resolve();
                return;
            }

            this.isAnimating = true;
            this.wrapperElement.classList.remove('xwui-collapse-collapsed');
            this.wrapperElement.classList.add('xwui-collapse-expanding');

            // Get the target height
            const targetHeight = this.contentElement.scrollHeight;

            // Set explicit height to enable animation
            this.wrapperElement.style.height = '0';
            
            // Force reflow
            this.wrapperElement.offsetHeight;

            // Animate to target height
            this.wrapperElement.style.height = `${targetHeight}px`;

            const onTransitionEnd = () => {
                if (this.wrapperElement) {
                    this.wrapperElement.removeEventListener('transitionend', onTransitionEnd);
                    this.wrapperElement.style.height = 'auto';
                    this.wrapperElement.classList.remove('xwui-collapse-expanding');
                    this.wrapperElement.classList.add('xwui-collapse-expanded');
                }
                this.isExpanded = true;
                this.isAnimating = false;
                resolve();
            };

            this.wrapperElement.addEventListener('transitionend', onTransitionEnd, { once: true });

            // Fallback in case transition doesn't fire
            setTimeout(() => {
                if (this.isAnimating) {
                    onTransitionEnd();
                }
            }, this.config.duration! + 50);
        });
    }

    public collapse(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.isExpanded || this.isAnimating || !this.wrapperElement || !this.contentElement) {
                resolve();
                return;
            }

            this.isAnimating = true;
            this.wrapperElement.classList.remove('xwui-collapse-expanded');
            this.wrapperElement.classList.add('xwui-collapse-collapsing');

            // Get current height and set it explicitly
            const currentHeight = this.contentElement.scrollHeight;
            this.wrapperElement.style.height = `${currentHeight}px`;

            // Force reflow
            this.wrapperElement.offsetHeight;

            // Animate to 0
            this.wrapperElement.style.height = '0';

            const onTransitionEnd = () => {
                if (this.wrapperElement) {
                    this.wrapperElement.removeEventListener('transitionend', onTransitionEnd);
                    this.wrapperElement.classList.remove('xwui-collapse-collapsing');
                    this.wrapperElement.classList.add('xwui-collapse-collapsed');
                }
                this.isExpanded = false;
                this.isAnimating = false;

                // Optionally destroy content
                if (this.config.destroyOnCollapse && this.contentElement) {
                    this.contentElement.innerHTML = '';
                }

                resolve();
            };

            this.wrapperElement.addEventListener('transitionend', onTransitionEnd, { once: true });

            // Fallback in case transition doesn't fire
            setTimeout(() => {
                if (this.isAnimating) {
                    onTransitionEnd();
                }
            }, this.config.duration! + 50);
        });
    }

    public toggle(): Promise<void> {
        return this.isExpanded ? this.collapse() : this.expand();
    }

    public setContent(content: HTMLElement | string): void {
        this.data.content = content;
        if (this.contentElement) {
            this.contentElement.innerHTML = '';
            if (typeof content === 'string') {
                this.contentElement.innerHTML = content;
            } else {
                this.contentElement.appendChild(content);
            }
        }
    }

    public getExpanded(): boolean {
        return this.isExpanded;
    }

    public setExpanded(expanded: boolean, animate: boolean = true): Promise<void> {
        if (animate) {
            return expanded ? this.expand() : this.collapse();
        } else {
            this.isExpanded = expanded;
            if (this.wrapperElement) {
                this.wrapperElement.style.transition = 'none';
                if (expanded) {
                    this.wrapperElement.style.height = 'auto';
                    this.wrapperElement.classList.remove('xwui-collapse-collapsed');
                    this.wrapperElement.classList.add('xwui-collapse-expanded');
                } else {
                    this.wrapperElement.style.height = '0';
                    this.wrapperElement.classList.remove('xwui-collapse-expanded');
                    this.wrapperElement.classList.add('xwui-collapse-collapsed');
                }
                // Restore transition
                setTimeout(() => {
                    if (this.wrapperElement) {
                        this.wrapperElement.style.transition = `height ${this.config.duration}ms ${this.config.easing}`;
                    }
                }, 0);
            }
            return Promise.resolve();
        }
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public getContentElement(): HTMLElement | null {
        return this.contentElement;
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
            this.contentElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICollapse as any).componentName = 'XWUICollapse';


