/**
 * XWUIPicker Base Component
 * Abstract base class for all picker components (date, color, etc.)
 * Handles common picker functionality: positioning, overlay, open/close, animation
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIPickerConfig {
    placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    offset?: number; // Distance from trigger element
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    className?: string;
}

export interface XWUIPickerData {
    // Base picker data - to be extended by specific pickers
}

/**
 * Abstract base class for picker components
 * Provides common functionality for popup/overlay pickers
 */
export abstract class XWUIPicker<TData extends XWUIPickerData = XWUIPickerData, TConfig extends XWUIPickerConfig = XWUIPickerConfig> extends XWUIComponent<TData, TConfig> {
    protected pickerElement: HTMLElement | null = null;
    protected overlayElement: HTMLElement | null = null;
    protected triggerElement: HTMLElement | null = null;
    protected isOpen: boolean = false;
    protected escapeHandler: ((e: KeyboardEvent) => void) | null = null;
    protected clickOutsideHandler: ((e: MouseEvent) => void) | null = null;

    constructor(
        container: HTMLElement,
        data: TData = {} as TData,
        conf_comp: TConfig = {} as TConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupPicker();
    }

    protected createConfig(
        conf_comp?: TConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): TConfig {
        const baseConfig = {
            placement: conf_comp?.placement ?? 'bottom',
            offset: conf_comp?.offset ?? 8,
            closeOnClickOutside: conf_comp?.closeOnClickOutside ?? true,
            closeOnEscape: conf_comp?.closeOnEscape ?? true,
            className: conf_comp?.className,
            ...conf_comp
        } as TConfig;
        return baseConfig;
    }

    /**
     * Setup picker DOM structure
     * Should be called by child classes after their specific setup
     */
    protected setupPicker(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-picker-container';

        // Create overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'xwui-picker-overlay';
        this.overlayElement.style.display = 'none';
        this.overlayElement.style.position = 'fixed';
        this.overlayElement.style.top = '0';
        this.overlayElement.style.left = '0';
        this.overlayElement.style.width = '100%';
        this.overlayElement.style.height = '100%';
        this.overlayElement.style.zIndex = '9998';
        this.overlayElement.style.backgroundColor = 'transparent';

        // Create picker element (to be populated by child classes)
        this.pickerElement = document.createElement('div');
        this.pickerElement.className = 'xwui-picker';
        
        if (this.config.className) {
            this.pickerElement.classList.add(...this.config.className.split(' '));
        }

        this.pickerElement.style.display = 'none';
        this.pickerElement.style.position = 'fixed';
        this.pickerElement.style.zIndex = '9999';

        // Render picker content (implemented by child classes)
        this.renderPickerContent();

        this.overlayElement.appendChild(this.pickerElement);
        document.body.appendChild(this.overlayElement);
    }

    /**
     * Render picker content - must be implemented by child classes
     */
    protected abstract renderPickerContent(): void;

    /**
     * Open picker and position it relative to trigger element
     */
    public open(triggerElement?: HTMLElement): void {
        if (this.isOpen || !this.pickerElement || !this.overlayElement) return;

        this.triggerElement = triggerElement || null;

        // Show overlay and picker
        this.overlayElement.style.display = 'block';
        this.pickerElement.style.display = 'block';

        // Position picker
        if (triggerElement) {
            this.updatePosition(triggerElement);
        }

        // Add animation class
        requestAnimationFrame(() => {
            if (this.pickerElement) {
                this.pickerElement.classList.add('xwui-picker-open');
            }
            if (this.overlayElement) {
                this.overlayElement.classList.add('xwui-picker-overlay-visible');
            }
        });

        // Setup event handlers
        this.setupEventHandlers();

        this.isOpen = true;
    }

    /**
     * Close picker
     */
    public close(): void {
        if (!this.isOpen) return;

        // Remove animation class
        if (this.pickerElement) {
            this.pickerElement.classList.remove('xwui-picker-open');
        }
        if (this.overlayElement) {
            this.overlayElement.classList.remove('xwui-picker-overlay-visible');
        }

        // Hide after animation
        setTimeout(() => {
            if (this.overlayElement) {
                this.overlayElement.style.display = 'none';
            }
            if (this.pickerElement) {
                this.pickerElement.style.display = 'none';
            }
        }, 200);

        // Remove event handlers
        this.removeEventHandlers();

        this.isOpen = false;
    }

    /**
     * Toggle picker open/close
     */
    public toggle(triggerElement?: HTMLElement): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open(triggerElement);
        }
    }

    /**
     * Update picker position relative to trigger element
     */
    protected updatePosition(triggerElement: HTMLElement): void {
        if (!this.pickerElement) return;

        const triggerRect = triggerElement.getBoundingClientRect();
        const pickerRect = this.pickerElement.getBoundingClientRect();
        const offset = this.config.offset || 8;
        const placement = this.config.placement || 'bottom';

        let top = 0;
        let left = 0;

        // Calculate position based on placement
        switch (placement) {
            case 'bottom':
            case 'bottom-start':
            case 'bottom-end':
                top = triggerRect.bottom + offset;
                left = triggerRect.left;
                if (placement === 'bottom-end') {
                    left = triggerRect.right - pickerRect.width;
                } else if (placement === 'bottom') {
                    left = triggerRect.left + (triggerRect.width / 2) - (pickerRect.width / 2);
                }
                break;
            case 'top':
            case 'top-start':
            case 'top-end':
                top = triggerRect.top - pickerRect.height - offset;
                left = triggerRect.left;
                if (placement === 'top-end') {
                    left = triggerRect.right - pickerRect.width;
                } else if (placement === 'top') {
                    left = triggerRect.left + (triggerRect.width / 2) - (pickerRect.width / 2);
                }
                break;
            case 'left':
                top = triggerRect.top;
                left = triggerRect.left - pickerRect.width - offset;
                break;
            case 'right':
                top = triggerRect.top;
                left = triggerRect.right + offset;
                break;
        }

        // Keep picker in viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left + pickerRect.width > viewportWidth) {
            left = viewportWidth - pickerRect.width - 8;
        }
        if (left < 0) {
            left = 8;
        }
        if (top + pickerRect.height > viewportHeight) {
            top = viewportHeight - pickerRect.height - 8;
        }
        if (top < 0) {
            top = 8;
        }

        this.pickerElement.style.top = `${top}px`;
        this.pickerElement.style.left = `${left}px`;
    }

    /**
     * Setup event handlers for closing picker
     */
    private setupEventHandlers(): void {
        // Escape key handler
        if (this.config.closeOnEscape) {
            this.escapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.close();
                }
            };
            document.addEventListener('keydown', this.escapeHandler);
        }

        // Click outside handler
        if (this.config.closeOnClickOutside && this.overlayElement) {
            this.clickOutsideHandler = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                if (this.pickerElement && !this.pickerElement.contains(target)) {
                    if (this.triggerElement && this.triggerElement.contains(target)) {
                        return; // Don't close if clicking trigger
                    }
                    this.close();
                }
            };
            // Use capture phase to catch clicks before they bubble
            document.addEventListener('click', this.clickOutsideHandler, true);
        }
    }

    /**
     * Remove event handlers
     */
    private removeEventHandlers(): void {
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
        if (this.clickOutsideHandler) {
            document.removeEventListener('click', this.clickOutsideHandler, true);
            this.clickOutsideHandler = null;
        }
    }

    /**
     * Check if picker is open
     */
    public isOpened(): boolean {
        return this.isOpen;
    }

    /**
     * Get picker element
     */
    public getPickerElement(): HTMLElement | null {
        return this.pickerElement;
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        this.close();
        this.removeEventHandlers();

        if (this.overlayElement && this.overlayElement.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement);
        }

        this.pickerElement = null;
        this.overlayElement = null;
        this.triggerElement = null;

        super.destroy();
    }
}

// Set component name at class definition (before minification) - survives build tools
// Note: This is an abstract base class, but we set it for consistency
(XWUIPicker as any).componentName = 'XWUIPicker';

