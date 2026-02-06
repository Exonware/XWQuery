/**
 * XWUIHoverCard Component
 * Popover triggered on hover
 * Wraps XWUIPopover with hover-specific defaults
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIPopover, type XWUIPopoverConfig, type XWUIPopoverData } from '../XWUIPopover/XWUIPopover';

export interface XWUIHoverCardConfig extends Omit<XWUIPopoverConfig, 'trigger'> {
    openDelay?: number;
    closeDelay?: number;
    openOnHover?: boolean;
}

export interface XWUIHoverCardData extends XWUIPopoverData {}

export class XWUIHoverCard extends XWUIComponent<XWUIHoverCardData, XWUIHoverCardConfig> {
    private popoverInstance: XWUIPopover | null = null;
    private openTimeout: ReturnType<typeof setTimeout> | null = null;
    private closeTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIHoverCardData,
        conf_comp: XWUIHoverCardConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIHoverCardConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIHoverCardConfig {
        return {
            trigger: 'hover', // Always hover for hover card
            openDelay: conf_comp?.openDelay ?? 200,
            closeDelay: conf_comp?.closeDelay ?? 100,
            openOnHover: conf_comp?.openOnHover ?? true,
            ...conf_comp
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-hover-card-container';

        // Create popover config
        const popoverConfig: XWUIPopoverConfig = {
            ...this.config,
            trigger: 'hover'
        };

        // Create XWUIPopover instance
        this.popoverInstance = new XWUIPopover(this.container, this.data, popoverConfig, this.conf_sys, this.conf_usr);

        // Add delay support by wrapping hover handlers
        if (this.data.triggerElement) {
            const triggerEl = typeof this.data.triggerElement === 'string' 
                ? document.querySelector(this.data.triggerElement)
                : this.data.triggerElement;
            
            if (triggerEl) {
                // Override hover behavior with delays
                triggerEl.addEventListener('mouseenter', () => {
                    if (this.openTimeout) clearTimeout(this.openTimeout);
                    this.openTimeout = setTimeout(() => {
                        if (this.popoverInstance) {
                            this.popoverInstance.open();
                        }
                    }, this.config.openDelay || 200);
                });

                triggerEl.addEventListener('mouseleave', () => {
                    if (this.openTimeout) clearTimeout(this.openTimeout);
                    this.closeTimeout = setTimeout(() => {
                        if (this.popoverInstance) {
                            this.popoverInstance.close();
                        }
                    }, this.config.closeDelay || 100);
                });
            }
        }
    }

    public destroy(): void {
        if (this.openTimeout) clearTimeout(this.openTimeout);
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
        if (this.popoverInstance) {
            this.popoverInstance.destroy();
            this.popoverInstance = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIHoverCard as any).componentName = 'XWUIHoverCard';


