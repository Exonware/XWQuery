/**
 * XWUIHidden Component
 * Show/hide content based on breakpoints
 * Similar to Material UI's Hidden component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Breakpoint type
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Component-level configuration
export interface XWUIHiddenConfig {
    below?: Breakpoint; // Hide below this breakpoint
    above?: Breakpoint; // Hide above this breakpoint
    only?: Breakpoint | Breakpoint[]; // Hide only at these breakpoints
    implementation?: 'css' | 'js'; // Use CSS or JavaScript
    className?: string;
}

// Data type
export interface XWUIHiddenData {
    content?: string | HTMLElement;
}

// Breakpoint values (standard Tailwind/MUI breakpoints)
const BREAKPOINTS: Record<Breakpoint, number> = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};

export class XWUIHidden extends XWUIComponent<XWUIHiddenData, XWUIHiddenConfig> {
    private wrapperElement: HTMLElement | null = null;
    private resizeHandler: (() => void) | null = null;
    private currentMatches: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIHiddenData = {},
        conf_comp: XWUIHiddenConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
        
        if (this.config.implementation !== 'css') {
            this.setupResizeListener();
            this.updateVisibility();
        }
    }

    protected createConfig(
        conf_comp?: XWUIHiddenConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIHiddenConfig {
        return {
            below: conf_comp?.below,
            above: conf_comp?.above,
            only: conf_comp?.only,
            implementation: conf_comp?.implementation ?? 'js',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-hidden-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        // Add CSS classes for CSS implementation
        if (this.config.implementation === 'css') {
            this.addCSSClasses();
        }

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-hidden-wrapper';

        // Set content
        if (this.data.content) {
            if (typeof this.data.content === 'string') {
                this.wrapperElement.innerHTML = this.data.content;
            } else if (this.data.content instanceof HTMLElement) {
                this.wrapperElement.appendChild(this.data.content);
            }
        }

        this.container.appendChild(this.wrapperElement);
    }

    private addCSSClasses(): void {
        // Add breakpoint classes for CSS-based hiding
        if (this.config.below) {
            this.container.classList.add(`xwui-hidden-below-${this.config.below}`);
        }
        if (this.config.above) {
            this.container.classList.add(`xwui-hidden-above-${this.config.above}`);
        }
        if (this.config.only) {
            const only = Array.isArray(this.config.only) ? this.config.only : [this.config.only];
            only.forEach(bp => {
                this.container.classList.add(`xwui-hidden-only-${bp}`);
            });
        }
    }

    private setupResizeListener(): void {
        this.resizeHandler = () => {
            this.updateVisibility();
        };
        window.addEventListener('resize', this.resizeHandler);
    }

    private updateVisibility(): void {
        if (!this.wrapperElement || this.config.implementation === 'css') return;

        const width = window.innerWidth;
        const shouldHide = this.shouldHide(width);

        if (shouldHide !== this.currentMatches) {
            this.currentMatches = shouldHide;
            if (shouldHide) {
                this.container.style.display = 'none';
            } else {
                this.container.style.display = '';
            }
        }
    }

    private shouldHide(width: number): boolean {
        // Hide below breakpoint
        if (this.config.below) {
            const breakpoint = BREAKPOINTS[this.config.below];
            if (width < breakpoint) {
                return true;
            }
        }

        // Hide above breakpoint
        if (this.config.above) {
            const breakpoint = BREAKPOINTS[this.config.above];
            if (width >= breakpoint) {
                return true;
            }
        }

        // Hide only at specific breakpoints
        if (this.config.only) {
            const only = Array.isArray(this.config.only) ? this.config.only : [this.config.only];
            const isAtBreakpoint = only.some(bp => {
                const bpValue = BREAKPOINTS[bp];
                const nextBp = this.getNextBreakpoint(bp);
                return width >= bpValue && (nextBp === null || width < BREAKPOINTS[nextBp]);
            });
            return !isAtBreakpoint;
        }

        return false;
    }

    private getNextBreakpoint(current: Breakpoint): Breakpoint | null {
        const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
        const index = order.indexOf(current);
        return index >= 0 && index < order.length - 1 ? order[index + 1] : null;
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
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        this.wrapperElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIHidden as any).componentName = 'XWUIHidden';


