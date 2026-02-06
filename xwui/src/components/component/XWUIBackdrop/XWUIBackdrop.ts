/**
 * XWUIBackdrop Component
 * Overlay backdrop component for modals, dialogs, and drawers
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIBackdropConfig {
    visible?: boolean;
    invisible?: boolean; // Transparent backdrop
    onClick?: (event: MouseEvent) => void;
    className?: string;
    zIndex?: number;
}

// Data type
export interface XWUIBackdropData {
    // Backdrop doesn't need data, but interface is required
}

export class XWUIBackdrop extends XWUIComponent<XWUIBackdropData, XWUIBackdropConfig> {
    private backdropElement: HTMLElement | null = null;
    private clickHandler: ((e: MouseEvent) => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIBackdropData = {},
        conf_comp: XWUIBackdropConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupDOM();
    }

    protected createConfig(
        conf_comp?: XWUIBackdropConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBackdropConfig {
        return {
            visible: conf_comp?.visible ?? true,
            invisible: conf_comp?.invisible ?? false,
            onClick: conf_comp?.onClick,
            className: conf_comp?.className,
            zIndex: conf_comp?.zIndex
        };
    }

    private setupDOM(): void {
        this.container.innerHTML = '';

        this.backdropElement = document.createElement('div');
        this.backdropElement.className = 'xwui-backdrop';
        
        if (this.config.invisible) {
            this.backdropElement.classList.add('xwui-backdrop-invisible');
        }
        
        if (this.config.className) {
            this.backdropElement.classList.add(this.config.className);
        }

        if (this.config.zIndex !== undefined) {
            this.backdropElement.style.zIndex = String(this.config.zIndex);
        }

        // Handle click
        if (this.config.onClick) {
            this.clickHandler = (e: MouseEvent) => {
                if (e.target === this.backdropElement) {
                    this.config.onClick!(e);
                }
            };
            this.backdropElement.addEventListener('click', this.clickHandler);
        }

        // Set visibility
        if (!this.config.visible) {
            this.backdropElement.style.display = 'none';
        }

        this.container.appendChild(this.backdropElement);
    }

    /**
     * Show the backdrop
     */
    public show(): void {
        if (this.backdropElement) {
            this.backdropElement.style.display = 'block';
            this.config.visible = true;
        }
    }

    /**
     * Hide the backdrop
     */
    public hide(): void {
        if (this.backdropElement) {
            this.backdropElement.style.display = 'none';
            this.config.visible = false;
        }
    }

    /**
     * Toggle backdrop visibility
     */
    public toggle(): void {
        if (this.config.visible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public destroy(): void {
        // Remove event listeners
        if (this.clickHandler && this.backdropElement) {
            this.backdropElement.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }

        // Clear DOM references
        this.backdropElement = null;

        // Call parent cleanup
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBackdrop as any).componentName = 'XWUIBackdrop';


