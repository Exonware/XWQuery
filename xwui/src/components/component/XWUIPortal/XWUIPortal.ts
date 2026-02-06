/**
 * XWUIPortal Component
 * Render children into a DOM node outside the component hierarchy
 * Useful for modals, tooltips, dropdowns that need to escape parent containers
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIPortalConfig {
    container?: HTMLElement | string; // Target container (element or selector)
    disablePortal?: boolean; // Skip portal rendering (render in place)
    className?: string;
    zIndex?: number;
}

// Data type
export interface XWUIPortalData {
    content?: string | HTMLElement;
    children?: string | HTMLElement;
}

export class XWUIPortal extends XWUIComponent<XWUIPortalData, XWUIPortalConfig> {
    private portalContainer: HTMLElement | null = null;
    private portalElement: HTMLElement | null = null;
    private targetContainer: HTMLElement | null = null;
    private isPortalActive: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIPortalData = {},
        conf_comp: XWUIPortalConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIPortalConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPortalConfig {
        return {
            container: conf_comp?.container ?? document.body,
            disablePortal: conf_comp?.disablePortal ?? false,
            className: conf_comp?.className,
            zIndex: conf_comp?.zIndex
        };
    }

    private resolveTargetContainer(): HTMLElement | null {
        if (this.config.disablePortal) {
            return this.container;
        }

        const container = this.config.container;
        
        if (!container) {
            return document.body;
        }

        if (container instanceof HTMLElement) {
            return container;
        }

        if (typeof container === 'string') {
            // Try to find element by selector
            const element = document.querySelector(container) as HTMLElement;
            if (element) {
                return element;
            }
            console.warn(`XWUIPortal: Container selector "${container}" not found, using document.body`);
            return document.body;
        }

        return document.body;
    }

    private render(): void {
        // Clear existing portal
        this.cleanup();

        this.targetContainer = this.resolveTargetContainer();
        
        if (!this.targetContainer) {
            console.error('XWUIPortal: Could not resolve target container');
            return;
        }

        // Create portal element
        this.portalElement = document.createElement('div');
        this.portalElement.className = 'xwui-portal';
        
        if (this.config.className) {
            this.portalElement.classList.add(this.config.className);
        }

        // Set z-index if provided
        if (this.config.zIndex !== undefined) {
            this.portalElement.style.zIndex = String(this.config.zIndex);
        }

        // Set content
        const content = this.data.children || this.data.content;
        if (content instanceof HTMLElement) {
            this.portalElement.appendChild(content);
        } else if (typeof content === 'string') {
            this.portalElement.innerHTML = content;
        }

        // Append to target container
        if (this.config.disablePortal) {
            // Render in place (no portal)
            this.container.innerHTML = '';
            this.container.appendChild(this.portalElement);
            this.isPortalActive = false;
        } else {
            // Render in portal container
            this.targetContainer.appendChild(this.portalElement);
            this.isPortalActive = true;
            
            // Store reference to portal container for cleanup
            this.portalContainer = this.targetContainer;
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
     * Update portal container
     */
    public setContainer(container: HTMLElement | string): void {
        this.config.container = container;
        this.render();
    }

    /**
     * Enable or disable portal
     */
    public setDisablePortal(disable: boolean): void {
        this.config.disablePortal = disable;
        this.render();
    }

    /**
     * Get the portal element
     */
    public getPortalElement(): HTMLElement | null {
        return this.portalElement;
    }

    /**
     * Get the target container
     */
    public getTargetContainer(): HTMLElement | null {
        return this.targetContainer;
    }

    /**
     * Check if portal is active
     */
    public isActive(): boolean {
        return this.isPortalActive;
    }

    /**
     * Cleanup portal element
     */
    private cleanup(): void {
        if (this.portalElement) {
            if (this.portalElement.parentNode) {
                this.portalElement.parentNode.removeChild(this.portalElement);
            }
            this.portalElement = null;
        }
        
        if (!this.config.disablePortal) {
            // Clear container content if portal was disabled
            this.container.innerHTML = '';
        }
    }

    public destroy(): void {
        this.cleanup();
        this.targetContainer = null;
        this.portalContainer = null;
        this.isPortalActive = false;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPortal as any).componentName = 'XWUIPortal';


