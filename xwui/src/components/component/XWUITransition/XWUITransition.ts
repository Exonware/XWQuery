/**
 * XWUITransition Component
 * Animation wrapper component for enter/exit transitions
 * Supports fade, slide, scale, grow, and collapse transitions
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITransitionConfig {
    type?: 'fade' | 'slide' | 'scale' | 'grow' | 'collapse';
    duration?: number; // milliseconds
    easing?: string; // CSS easing function
    in?: boolean; // Control visibility
    direction?: 'up' | 'down' | 'left' | 'right'; // For slide transitions
    appear?: boolean; // Run transition on initial mount
    unmountOnExit?: boolean; // Remove from DOM when exited
    className?: string;
}

// Data type
export interface XWUITransitionData {
    children?: string | HTMLElement;
    content?: string | HTMLElement;
}

export class XWUITransition extends XWUIComponent<XWUITransitionData, XWUITransitionConfig> {
    private wrapperElement: HTMLElement | null = null;
    private contentElement: HTMLElement | null = null;
    private isEntering: boolean = false;
    private isExiting: boolean = false;
    private isMounted: boolean = false;
    private timeoutId: number | null = null;

    constructor(
        container: HTMLElement,
        data: XWUITransitionData = {},
        conf_comp: XWUITransitionConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.isMounted = true;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITransitionConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITransitionConfig {
        return {
            type: conf_comp?.type ?? 'fade',
            duration: conf_comp?.duration ?? 300,
            easing: conf_comp?.easing ?? 'ease-in-out',
            in: conf_comp?.in ?? true,
            direction: conf_comp?.direction ?? 'up',
            appear: conf_comp?.appear ?? false,
            unmountOnExit: conf_comp?.unmountOnExit ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        if (!this.isMounted && this.config.unmountOnExit) {
            return;
        }

        // Clear timeout if exists
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        this.container.innerHTML = '';
        this.container.className = 'xwui-transition-container';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-transition';
        this.wrapperElement.classList.add(`xwui-transition-${this.config.type}`);
        
        if (this.config.direction) {
            this.wrapperElement.classList.add(`xwui-transition-${this.config.type}-${this.config.direction}`);
        }
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Set transition duration and easing
        const duration = this.config.duration || 300;
        this.wrapperElement.style.transitionDuration = `${duration}ms`;
        this.wrapperElement.style.transitionTimingFunction = this.config.easing || 'ease-in-out';

        // Create content element
        this.contentElement = document.createElement('div');
        this.contentElement.className = 'xwui-transition-content';

        // Set content
        const content = this.data.children || this.data.content;
        if (content instanceof HTMLElement) {
            this.contentElement.appendChild(content);
        } else if (typeof content === 'string') {
            this.contentElement.innerHTML = content;
        }

        this.wrapperElement.appendChild(this.contentElement);
        this.container.appendChild(this.wrapperElement);

        // Handle initial state
        if (this.config.appear && this.config.in !== false) {
            // Start in entered state immediately (no animation)
            this.setState('entered');
        } else if (this.config.in !== false) {
            // Start exited, then animate to entered
            this.setState('exited');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.setState('entering');
                });
            });
        } else {
            // Start in exited state
            this.setState('exited');
        }
    }

    private setState(state: 'entering' | 'entered' | 'exiting' | 'exited'): void {
        if (!this.wrapperElement) return;

        // Remove all state classes
        this.wrapperElement.classList.remove(
            'xwui-transition-entering',
            'xwui-transition-entered',
            'xwui-transition-exiting',
            'xwui-transition-exited'
        );

        // Add current state class
        this.wrapperElement.classList.add(`xwui-transition-${state}`);

        this.isEntering = state === 'entering';
        this.isExiting = state === 'exiting';

        const duration = this.config.duration || 300;

        if (state === 'entering') {
            // Trigger enter animation
            requestAnimationFrame(() => {
                if (this.wrapperElement) {
                    this.wrapperElement.classList.add('xwui-transition-entered');
                    this.isEntering = false;
                }
            });
        } else if (state === 'exiting') {
            // Wait for exit animation to complete
            this.timeoutId = window.setTimeout(() => {
                if (this.wrapperElement) {
                    this.wrapperElement.classList.add('xwui-transition-exited');
                    this.isExiting = false;

                    if (this.config.unmountOnExit) {
                        this.container.innerHTML = '';
                        this.wrapperElement = null;
                        this.contentElement = null;
                        this.isMounted = false;
                    }
                }
            }, duration);
        }
    }

    /**
     * Enter transition
     */
    public enter(): void {
        if (!this.isMounted) {
            this.isMounted = true;
            this.render();
        }
        this.config.in = true;
        this.setState('entering');
    }

    /**
     * Exit transition
     */
    public exit(): void {
        this.config.in = false;
        this.setState('exiting');
    }

    /**
     * Toggle transition
     */
    public toggle(): void {
        if (this.config.in) {
            this.exit();
        } else {
            this.enter();
        }
    }

    /**
     * Set content
     */
    public setContent(content: string | HTMLElement): void {
        this.data.children = content;
        this.render();
    }

    /**
     * Set transition type
     */
    public setType(type: XWUITransitionConfig['type']): void {
        if (!type) return;
        this.config.type = type;
        this.render();
    }

    /**
     * Set duration
     */
    public setDuration(duration: number): void {
        this.config.duration = duration;
        if (this.wrapperElement) {
            this.wrapperElement.style.transitionDuration = `${duration}ms`;
        }
    }

    public destroy(): void {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.isMounted = false;
        if (this.wrapperElement) {
            this.wrapperElement = null;
        }
        if (this.contentElement) {
            this.contentElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITransition as any).componentName = 'XWUITransition';


