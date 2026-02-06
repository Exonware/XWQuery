/**
 * XWUIMenuDrawer Component
 * Sliding panel (Side Sheet) with placement options
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';

// Component-level configuration
export interface XWUIMenuDrawerConfig {
    placement?: 'left' | 'right' | 'top' | 'bottom';
    size?: 'small' | 'medium' | 'large' | 'full';
    closable?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    mask?: boolean;
    className?: string;
}

// Data type
export interface XWUIMenuDrawerData {
    title?: string;
    content?: HTMLElement | string;
    footer?: HTMLElement;
}

export class XWUIMenuDrawer extends XWUIComponent<XWUIMenuDrawerData, XWUIMenuDrawerConfig> {
    private overlayElement: HTMLElement | null = null;
    private drawerElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private closeHandlers: Array<() => void> = [];
    private escapeHandler: ((e: KeyboardEvent) => void) | null = null;
    private closeIcon: XWUIIcon | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMenuDrawerData = {},
        conf_comp: XWUIMenuDrawerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.createDrawer();
    }

    protected createConfig(
        conf_comp?: XWUIMenuDrawerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMenuDrawerConfig {
        return {
            placement: conf_comp?.placement ?? 'right',
            size: conf_comp?.size ?? 'medium',
            closable: conf_comp?.closable ?? true,
            closeOnBackdrop: conf_comp?.closeOnBackdrop ?? true,
            closeOnEscape: conf_comp?.closeOnEscape ?? true,
            mask: conf_comp?.mask ?? true,
            className: conf_comp?.className
        };
    }

    private createDrawer(): void {
        // Overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'xwui-drawer-overlay';

        if (this.config.closeOnBackdrop) {
            this.overlayElement.addEventListener('click', (e) => {
                if (e.target === this.overlayElement) {
                    this.close();
                }
            });
        }

        // Drawer
        this.drawerElement = document.createElement('div');
        this.drawerElement.className = 'xwui-drawer';
        this.drawerElement.classList.add(`xwui-drawer-${this.config.placement}`);
        this.drawerElement.classList.add(`xwui-drawer-${this.config.size}`);
        this.drawerElement.setAttribute('role', 'dialog');
        this.drawerElement.setAttribute('aria-modal', 'true');
        
        if (this.config.className) {
            this.drawerElement.classList.add(this.config.className);
        }

        // Header
        if (this.data.title || this.config.closable) {
            const header = document.createElement('div');
            header.className = 'xwui-drawer-header';

            if (this.data.title) {
                const title = document.createElement('h2');
                title.className = 'xwui-drawer-title';
                title.textContent = this.data.title;
                // Generate unique ID to avoid duplicate IDs
                const uniqueId = `drawer-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                this.drawerElement.setAttribute('aria-labelledby', uniqueId);
                title.id = uniqueId;
                header.appendChild(title);
            }

            if (this.config.closable) {
                const closeButton = document.createElement('button');
                closeButton.className = 'xwui-drawer-close';
                closeButton.setAttribute('aria-label', 'Close drawer');
                closeButton.setAttribute('title', 'Close drawer');
                
                // Use XWUIIcon instead of inline SVG
                const iconContainer = document.createElement('div');
                this.closeIcon = new XWUIIcon(iconContainer, 'close', { size: 24 }, this.conf_sys, this.conf_usr);
                this.registerChildComponent(this.closeIcon);
                closeButton.appendChild(iconContainer);
                
                closeButton.addEventListener('click', () => this.close());
                header.appendChild(closeButton);
            }

            this.drawerElement.appendChild(header);
        }

        // Body
        const body = document.createElement('div');
        body.className = 'xwui-drawer-body';

        if (this.data.content) {
            if (typeof this.data.content === 'string') {
                body.innerHTML = this.data.content;
            } else {
                body.appendChild(this.data.content);
            }
        }

        this.drawerElement.appendChild(body);

        // Footer
        if (this.data.footer) {
            const footer = document.createElement('div');
            footer.className = 'xwui-drawer-footer';
            footer.appendChild(this.data.footer);
            this.drawerElement.appendChild(footer);
        }

        this.overlayElement.appendChild(this.drawerElement);
    }

    public open(): void {
        if (this.isOpen || !this.overlayElement) return;

        if (this.config.mask) {
            document.body.appendChild(this.overlayElement);
        } else {
            document.body.appendChild(this.drawerElement!);
        }
        document.body.style.overflow = 'hidden';

        // Trigger animation
        requestAnimationFrame(() => {
            this.overlayElement?.classList.add('xwui-drawer-overlay-visible');
            this.drawerElement?.classList.add('xwui-drawer-visible');
        });

        // Escape key handler
        if (this.config.closeOnEscape) {
            this.escapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.close();
                }
            };
            document.addEventListener('keydown', this.escapeHandler);
        }

        this.drawerElement?.focus();
        this.isOpen = true;
    }

    public close(): void {
        if (!this.isOpen || !this.overlayElement) return;

        this.overlayElement.classList.remove('xwui-drawer-overlay-visible');
        this.drawerElement?.classList.remove('xwui-drawer-visible');

        setTimeout(() => {
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
            }
            document.body.style.overflow = '';
        }, 300);

        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }

        this.isOpen = false;
        this.closeHandlers.forEach(handler => handler());
    }

    public setTitle(title: string): void {
        this.data.title = title;
        const titleElement = this.drawerElement?.querySelector('.xwui-drawer-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    public setContent(content: HTMLElement | string): void {
        this.data.content = content;
        const body = this.drawerElement?.querySelector('.xwui-drawer-body');
        if (body) {
            body.innerHTML = '';
            if (typeof content === 'string') {
                body.innerHTML = content;
            } else {
                body.appendChild(content);
            }
        }
    }

    public onClose(handler: () => void): void {
        this.closeHandlers.push(handler);
    }

    public isOpened(): boolean {
        return this.isOpen;
    }

    public getElement(): HTMLElement | null {
        return this.drawerElement;
    }

    public destroy(): void {
        this.close();
        this.closeHandlers = [];
        this.closeIcon = null;
        this.overlayElement = null;
        this.drawerElement = null;
        super.destroy();
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIMenuDrawer as any).componentName = 'XWUIMenuDrawer';

