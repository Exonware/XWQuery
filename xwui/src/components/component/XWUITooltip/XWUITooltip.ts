/**
 * XWUITooltip Component
 * Hover tooltip with placement options
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITooltipConfig {
    placement?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: 'hover' | 'click' | 'focus';
    delay?: number;
    offset?: number;
    arrow?: boolean;
    className?: string;
}

// Data type
export interface XWUITooltipData {
    content: string | HTMLElement;
    target?: HTMLElement;
}

export class XWUITooltip extends XWUIComponent<XWUITooltipData, XWUITooltipConfig> {
    private tooltipElement: HTMLElement | null = null;
    private isVisible: boolean = false;
    private showTimeout: ReturnType<typeof setTimeout> | null = null;
    private hideTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(
        container: HTMLElement,
        data: XWUITooltipData,
        conf_comp: XWUITooltipConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupTrigger();
        this.createTooltipElement();
    }

    protected createConfig(
        conf_comp?: XWUITooltipConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITooltipConfig {
        return {
            placement: conf_comp?.placement ?? 'top',
            trigger: conf_comp?.trigger ?? 'hover',
            delay: conf_comp?.delay ?? 200,
            offset: conf_comp?.offset ?? 8,
            arrow: conf_comp?.arrow ?? true,
            className: conf_comp?.className
        };
    }

    private createTooltipElement(): void {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'xwui-tooltip';
        this.tooltipElement.classList.add(`xwui-tooltip-${this.config.placement}`);
        
        if (this.config.arrow) {
            this.tooltipElement.classList.add('xwui-tooltip-arrow');
        }
        if (this.config.className) {
            this.tooltipElement.classList.add(this.config.className);
        }

        this.tooltipElement.setAttribute('role', 'tooltip');

        // Content
        if (typeof this.data.content === 'string') {
            this.tooltipElement.textContent = this.data.content;
        } else {
            this.tooltipElement.appendChild(this.data.content);
        }
    }

    private setupTrigger(): void {
        const target = this.data.target || this.container;

        if (this.config.trigger === 'hover') {
            target.addEventListener('mouseenter', () => this.scheduleShow());
            target.addEventListener('mouseleave', () => this.scheduleHide());
        } else if (this.config.trigger === 'click') {
            target.addEventListener('click', () => this.toggle());
            document.addEventListener('click', (e) => {
                if (this.isVisible && !target.contains(e.target as Node) && 
                    !this.tooltipElement?.contains(e.target as Node)) {
                    this.hide();
                }
            });
        } else if (this.config.trigger === 'focus') {
            target.addEventListener('focus', () => this.show());
            target.addEventListener('blur', () => this.hide());
        }
    }

    private scheduleShow(): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        this.showTimeout = setTimeout(() => this.show(), this.config.delay);
    }

    private scheduleHide(): void {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        this.hideTimeout = setTimeout(() => this.hide(), this.config.delay);
    }

    private calculatePosition(): { top: number; left: number } {
        const target = this.data.target || this.container;
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = this.tooltipElement!.getBoundingClientRect();
        const offset = this.config.offset || 8;

        let top = 0;
        let left = 0;

        switch (this.config.placement) {
            case 'top':
                top = targetRect.top - tooltipRect.height - offset;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + offset;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - offset;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + offset;
                break;
        }

        // Keep tooltip in viewport
        top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));
        left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));

        return { top: top + window.scrollY, left: left + window.scrollX };
    }

    public show(): void {
        if (this.isVisible || !this.tooltipElement) return;

        document.body.appendChild(this.tooltipElement);
        this.tooltipElement.style.visibility = 'hidden';
        this.tooltipElement.style.display = 'block';

        // Calculate and set position
        const { top, left } = this.calculatePosition();
        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;
        this.tooltipElement.style.visibility = 'visible';

        // Trigger animation
        requestAnimationFrame(() => {
            this.tooltipElement?.classList.add('xwui-tooltip-visible');
        });

        this.isVisible = true;
    }

    public hide(): void {
        if (!this.isVisible || !this.tooltipElement) return;

        this.tooltipElement.classList.remove('xwui-tooltip-visible');
        
        setTimeout(() => {
            if (this.tooltipElement && this.tooltipElement.parentNode) {
                this.tooltipElement.parentNode.removeChild(this.tooltipElement);
            }
        }, 150);

        this.isVisible = false;
    }

    public toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public setContent(content: string | HTMLElement): void {
        this.data.content = content;
        if (this.tooltipElement) {
            this.tooltipElement.innerHTML = '';
            if (typeof content === 'string') {
                this.tooltipElement.textContent = content;
            } else {
                this.tooltipElement.appendChild(content);
            }
        }
    }

    public getElement(): HTMLElement | null {
        return this.tooltipElement;
    }

    public destroy(): void {
        if (this.showTimeout) clearTimeout(this.showTimeout);
        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        this.hide();
        this.tooltipElement = null;
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUITooltip as any).componentName = 'XWUITooltip';

// Helper function for quick tooltips
export function tooltip(target: HTMLElement, content: string, options?: XWUITooltipConfig): XWUITooltip {
    const container = document.createElement('span');
    return new XWUITooltip(container, { content, target }, options);
}

