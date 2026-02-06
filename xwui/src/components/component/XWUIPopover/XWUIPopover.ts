/**
 * XWUIPopover Component
 * Content popover on hover/click (Hover Card)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIPopoverConfig {
    trigger?: 'click' | 'hover';
    placement?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    arrow?: boolean;
    closeOnClickOutside?: boolean;
    className?: string;
}

// Data type
export interface XWUIPopoverData {
    title?: string;
    content: HTMLElement | string;
    triggerElement?: HTMLElement | string;
}

export class XWUIPopover extends XWUIComponent<XWUIPopoverData, XWUIPopoverConfig> {
    private popoverElement: HTMLElement | null = null;
    private overlayElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private triggerElement: HTMLElement | null = null;
    private escapeHandler: ((e: KeyboardEvent) => void) | null = null;
    private hoverTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIPopoverData,
        conf_comp: XWUIPopoverConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeTrigger();
        this.createPopover();
    }

    protected createConfig(
        conf_comp?: XWUIPopoverConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPopoverConfig {
        return {
            trigger: conf_comp?.trigger ?? 'hover',
            placement: conf_comp?.placement ?? 'top',
            align: conf_comp?.align ?? 'center',
            arrow: conf_comp?.arrow ?? true,
            closeOnClickOutside: conf_comp?.closeOnClickOutside ?? true,
            className: conf_comp?.className
        };
    }

    private initializeTrigger(): void {
        if (this.data.triggerElement) {
            if (typeof this.data.triggerElement === 'string') {
                this.triggerElement = document.querySelector(this.data.triggerElement);
            } else {
                this.triggerElement = this.data.triggerElement;
            }
        } else {
            this.triggerElement = this.container;
        }
    }

    private createPopover(): void {
        // Overlay (for click outside)
        if (this.config.closeOnClickOutside) {
            this.overlayElement = document.createElement('div');
            this.overlayElement.className = 'xwui-popover-overlay';
            this.overlayElement.addEventListener('click', () => this.close());
        }

        // Popover
        this.popoverElement = document.createElement('div');
        this.popoverElement.className = 'xwui-popover';
        this.popoverElement.classList.add(`xwui-popover-${this.config.placement}`);
        this.popoverElement.classList.add(`xwui-popover-align-${this.config.align}`);
        this.popoverElement.setAttribute('role', 'tooltip');
        
        if (this.config.className) {
            this.popoverElement.classList.add(this.config.className);
        }

        if (this.config.arrow) {
            const arrow = document.createElement('div');
            arrow.className = 'xwui-popover-arrow';
            this.popoverElement.appendChild(arrow);
        }

        const content = document.createElement('div');
        content.className = 'xwui-popover-content';

        if (this.data.title) {
            const title = document.createElement('div');
            title.className = 'xwui-popover-title';
            title.textContent = this.data.title;
            content.appendChild(title);
        }

        const body = document.createElement('div');
        body.className = 'xwui-popover-body';
        
        if (typeof this.data.content === 'string') {
            body.innerHTML = this.data.content;
        } else {
            body.appendChild(this.data.content);
        }
        
        content.appendChild(body);
        this.popoverElement.appendChild(content);

        // Event listeners
        if (this.triggerElement) {
            if (this.config.trigger === 'click') {
                this.triggerElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle();
                });
            } else if (this.config.trigger === 'hover') {
                this.triggerElement.addEventListener('mouseenter', () => {
                    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
                    this.open();
                });
                this.triggerElement.addEventListener('mouseleave', () => {
                    this.hoverTimeout = setTimeout(() => this.close(), 100);
                });
            }
        }
    }

    public open(): void {
        if (this.isOpen || !this.popoverElement || !this.triggerElement) return;

        const parent = this.config.closeOnClickOutside && this.overlayElement 
            ? this.overlayElement 
            : document.body;

        if (this.overlayElement && this.config.closeOnClickOutside) {
            this.overlayElement.appendChild(this.popoverElement);
            document.body.appendChild(this.overlayElement);
        } else {
            document.body.appendChild(this.popoverElement);
        }

        this.updatePosition();

        // Escape key handler
        if (this.config.trigger === 'click') {
            this.escapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.close();
                }
            };
            document.addEventListener('keydown', this.escapeHandler);
        }

        requestAnimationFrame(() => {
            if (this.overlayElement) {
                this.overlayElement.classList.add('xwui-popover-overlay-visible');
            }
            this.popoverElement?.classList.add('xwui-popover-visible');
        });

        this.isOpen = true;
    }

    public close(): void {
        if (!this.isOpen || !this.popoverElement) return;

        if (this.overlayElement) {
            this.overlayElement.classList.remove('xwui-popover-overlay-visible');
        }
        this.popoverElement.classList.remove('xwui-popover-visible');

        setTimeout(() => {
            if (this.popoverElement && this.popoverElement.parentNode) {
                this.popoverElement.parentNode.removeChild(this.popoverElement);
            }
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
            }
        }, 200);

        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }

        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        this.isOpen = false;
    }

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private updatePosition(): void {
        if (!this.triggerElement || !this.popoverElement) return;

        const triggerRect = this.triggerElement.getBoundingClientRect();
        const popoverRect = this.popoverElement.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (this.config.placement) {
            case 'top':
                top = triggerRect.top - popoverRect.height - 8;
                break;
            case 'bottom':
                top = triggerRect.bottom + 8;
                break;
            case 'left':
                top = triggerRect.top;
                left = triggerRect.left - popoverRect.width - 8;
                break;
            case 'right':
                top = triggerRect.top;
                left = triggerRect.right + 8;
                break;
        }

        switch (this.config.align) {
            case 'start':
                left = triggerRect.left;
                break;
            case 'center':
                left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
                break;
            case 'end':
                left = triggerRect.right - popoverRect.width;
                break;
        }

        // Keep within viewport
        const padding = 8;
        if (left < padding) left = padding;
        if (left + popoverRect.width > window.innerWidth - padding) {
            left = window.innerWidth - popoverRect.width - padding;
        }
        if (top < padding) top = padding;
        if (top + popoverRect.height > window.innerHeight - padding) {
            top = window.innerHeight - popoverRect.height - padding;
        }

        this.popoverElement.style.top = `${top}px`;
        this.popoverElement.style.left = `${left}px`;
    }

    public isOpened(): boolean {
        return this.isOpen;
    }

    public getElement(): HTMLElement | null {
        return this.popoverElement;
    }

    public destroy(): void {
        this.close();
        this.triggerElement = null;
        this.popoverElement = null;
        this.overlayElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPopover as any).componentName = 'XWUIPopover';


