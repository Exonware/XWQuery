/**
 * XWUIDialog Component
 * Modal dialog with configurable header, body, footer
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';

// Component-level configuration
export interface XWUIDialogConfig {
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    closable?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    centered?: boolean;
    scrollable?: boolean;
    className?: string;
}

// Data type
export interface XWUIDialogData {
    title?: string;
    content?: HTMLElement | string;
    footer?: HTMLElement;
}

export class XWUIDialog extends XWUIComponent<XWUIDialogData, XWUIDialogConfig> {
    private overlayElement: HTMLElement | null = null;
    private dialogElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private closeHandlers: Array<() => void> = [];
    private escapeHandler: ((e: KeyboardEvent) => void) | null = null;
    private closeIcon: XWUIIcon | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIDialogData = {},
        conf_comp: XWUIDialogConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.createDialog();
    }

    protected createConfig(
        conf_comp?: XWUIDialogConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDialogConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            closable: conf_comp?.closable ?? true,
            closeOnBackdrop: conf_comp?.closeOnBackdrop ?? true,
            closeOnEscape: conf_comp?.closeOnEscape ?? true,
            centered: conf_comp?.centered ?? true,
            scrollable: conf_comp?.scrollable ?? true,
            className: conf_comp?.className
        };
    }

    private createDialog(): void {
        // Overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'xwui-dialog-overlay';

        if (this.config.closeOnBackdrop) {
            this.overlayElement.addEventListener('click', (e) => {
                if (e.target === this.overlayElement) {
                    this.close();
                }
            });
        }

        // Dialog
        this.dialogElement = document.createElement('div');
        this.dialogElement.className = 'xwui-dialog';
        this.dialogElement.classList.add(`xwui-dialog-${this.config.size}`);
        this.dialogElement.setAttribute('role', 'dialog');
        this.dialogElement.setAttribute('aria-modal', 'true');
        
        if (this.config.centered) {
            this.dialogElement.classList.add('xwui-dialog-centered');
        }
        if (this.config.scrollable) {
            this.dialogElement.classList.add('xwui-dialog-scrollable');
        }
        if (this.config.className) {
            this.dialogElement.classList.add(this.config.className);
        }

        // Header
        if (this.data.title || this.config.closable) {
            const header = document.createElement('div');
            header.className = 'xwui-dialog-header';

            if (this.data.title) {
                const title = document.createElement('h2');
                title.className = 'xwui-dialog-title';
                title.textContent = this.data.title;
                // Generate unique ID to avoid duplicate IDs
                const uniqueId = `dialog-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                this.dialogElement.setAttribute('aria-labelledby', uniqueId);
                title.id = uniqueId;
                header.appendChild(title);
            }

            if (this.config.closable) {
                const closeButton = document.createElement('button');
                closeButton.className = 'xwui-dialog-close';
                closeButton.setAttribute('aria-label', 'Close dialog');
                closeButton.setAttribute('title', 'Close dialog');
                
                // Use XWUIIcon instead of inline SVG
                const iconContainer = document.createElement('div');
                this.closeIcon = new XWUIIcon(iconContainer, 'close', { size: 24 }, this.conf_sys, this.conf_usr);
                this.registerChildComponent(this.closeIcon);
                closeButton.appendChild(iconContainer);
                
                closeButton.addEventListener('click', () => this.close());
                header.appendChild(closeButton);
            }

            this.dialogElement.appendChild(header);
        }

        // Body
        const body = document.createElement('div');
        body.className = 'xwui-dialog-body';

        if (this.data.content) {
            if (typeof this.data.content === 'string') {
                body.innerHTML = this.data.content;
            } else {
                body.appendChild(this.data.content);
            }
        }

        this.dialogElement.appendChild(body);

        // Footer
        if (this.data.footer) {
            const footer = document.createElement('div');
            footer.className = 'xwui-dialog-footer';
            footer.appendChild(this.data.footer);
            this.dialogElement.appendChild(footer);
        }

        this.overlayElement.appendChild(this.dialogElement);
    }

    public open(): void {
        if (this.isOpen || !this.overlayElement) return;

        document.body.appendChild(this.overlayElement);
        document.body.style.overflow = 'hidden';

        // Trigger animation
        requestAnimationFrame(() => {
            this.overlayElement?.classList.add('xwui-dialog-overlay-visible');
            this.dialogElement?.classList.add('xwui-dialog-visible');
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

        // Focus trap
        this.dialogElement?.focus();

        this.isOpen = true;
    }

    public close(): void {
        if (!this.isOpen || !this.overlayElement) return;

        this.overlayElement.classList.remove('xwui-dialog-overlay-visible');
        this.dialogElement?.classList.remove('xwui-dialog-visible');

        setTimeout(() => {
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
            }
            document.body.style.overflow = '';
        }, 200);

        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }

        this.isOpen = false;
        this.closeHandlers.forEach(handler => handler());
    }

    public setTitle(title: string): void {
        this.data.title = title;
        const titleElement = this.dialogElement?.querySelector('.xwui-dialog-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    public setContent(content: HTMLElement | string): void {
        this.data.content = content;
        const body = this.dialogElement?.querySelector('.xwui-dialog-body');
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
        return this.dialogElement;
    }

    public destroy(): void {
        this.close();
        this.closeHandlers = [];
        this.closeIcon = null;
        this.overlayElement = null;
        this.dialogElement = null;
        super.destroy();
    }
}

// Helper function
export function confirm(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
}): Promise<boolean> {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        
        const footer = document.createElement('div');
        footer.style.display = 'flex';
        footer.style.gap = '0.75rem';
        footer.style.justifyContent = 'flex-end';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'xwui-dialog-btn xwui-dialog-btn-secondary';
        cancelBtn.textContent = options.cancelText || 'Cancel';

        const confirmBtn = document.createElement('button');
        confirmBtn.className = `xwui-dialog-btn xwui-dialog-btn-${options.variant || 'primary'}`;
        confirmBtn.textContent = options.confirmText || 'Confirm';

        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);

        const dialog = new XWUIDialog(container, {
            title: options.title,
            content: options.message,
            footer
        }, { size: 'small' });

        cancelBtn.addEventListener('click', () => {
            dialog.close();
            resolve(false);
        });

        confirmBtn.addEventListener('click', () => {
            dialog.close();
            resolve(true);
        });

        dialog.onClose(() => resolve(false));
        dialog.open();
    });
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDialog as any).componentName = 'XWUIDialog';


