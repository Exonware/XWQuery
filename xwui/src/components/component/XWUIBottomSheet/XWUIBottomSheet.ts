/**
 * XWUIBottomSheet Component
 * Mobile-style modal sliding up from bottom
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIBottomSheetConfig {
    closable?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    maxHeight?: string;
    className?: string;
}

// Data type
export interface XWUIBottomSheetData {
    content: HTMLElement | string;
    title?: string;
}

export class XWUIBottomSheet extends XWUIComponent<XWUIBottomSheetData, XWUIBottomSheetConfig> {
    private overlayElement: HTMLElement | null = null;
    private sheetElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private closeHandlers: Array<() => void> = [];
    private escapeHandler: ((e: KeyboardEvent) => void) | null = null;
    private originalBodyOverflow: string = '';

    constructor(
        container: HTMLElement,
        data: XWUIBottomSheetData,
        conf_comp: XWUIBottomSheetConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.createBottomSheet();
    }

    protected createConfig(
        conf_comp?: XWUIBottomSheetConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBottomSheetConfig {
        return {
            closable: conf_comp?.closable ?? true,
            closeOnBackdrop: conf_comp?.closeOnBackdrop ?? true,
            closeOnEscape: conf_comp?.closeOnEscape ?? true,
            maxHeight: conf_comp?.maxHeight ?? '90vh',
            className: conf_comp?.className
        };
    }

    private createBottomSheet(): void {
        // Overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'xwui-bottomsheet-overlay';

        if (this.config.closeOnBackdrop) {
            this.overlayElement.addEventListener('click', (e) => {
                if (e.target === this.overlayElement) {
                    this.close();
                }
            });
        }

        // Bottom Sheet
        this.sheetElement = document.createElement('div');
        this.sheetElement.className = 'xwui-bottomsheet';
        this.sheetElement.setAttribute('role', 'dialog');
        this.sheetElement.setAttribute('aria-modal', 'true');
        
        if (this.config.maxHeight) {
            this.sheetElement.style.maxHeight = this.config.maxHeight;
        }
        
        if (this.config.className) {
            this.sheetElement.classList.add(this.config.className);
        }

        this.sheetElement.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Title (optional)
        if (this.data.title) {
            const title = document.createElement('div');
            title.className = 'xwui-bottomsheet-title';
            title.textContent = this.data.title;
            this.sheetElement.appendChild(title);
        }

        // Content
        const content = document.createElement('div');
        content.className = 'xwui-bottomsheet-content';
        
        if (typeof this.data.content === 'string') {
            content.innerHTML = this.data.content;
        } else {
            content.appendChild(this.data.content);
        }
        
        this.sheetElement.appendChild(content);

        this.overlayElement.appendChild(this.sheetElement);
    }

    public open(): void {
        if (this.isOpen || !this.overlayElement) return;

        document.body.appendChild(this.overlayElement);
        this.originalBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Escape key handler
        if (this.config.closeOnEscape) {
            this.escapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.close();
                }
            };
            document.addEventListener('keydown', this.escapeHandler);
        }

        requestAnimationFrame(() => {
            this.overlayElement?.classList.add('xwui-bottomsheet-overlay-visible');
            this.sheetElement?.classList.add('xwui-bottomsheet-visible');
        });

        this.isOpen = true;
    }

    public close(): void {
        if (!this.isOpen || !this.overlayElement) return;

        this.overlayElement.classList.remove('xwui-bottomsheet-overlay-visible');
        this.sheetElement?.classList.remove('xwui-bottomsheet-visible');

        setTimeout(() => {
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
            }
            document.body.style.overflow = this.originalBodyOverflow;
        }, 300);

        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }

        this.isOpen = false;
        this.closeHandlers.forEach(handler => handler());
    }

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public onClose(handler: () => void): void {
        this.closeHandlers.push(handler);
    }

    public isOpened(): boolean {
        return this.isOpen;
    }

    public getElement(): HTMLElement | null {
        return this.sheetElement;
    }

    public destroy(): void {
        this.close();
        this.closeHandlers = [];
        this.overlayElement = null;
        this.sheetElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBottomSheet as any).componentName = 'XWUIBottomSheet';


