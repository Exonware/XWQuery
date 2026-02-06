/**
 * XWUIContainer Component
 * Container with max-width and optional centering
 * Typically used for page/content containers
 * Extends XWUIBox to inherit all box functionality
 */

import { XWUIBox, type XWUIBoxConfig, type XWUIBoxData } from '../XWUIBox/XWUIBox';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration - extends XWUIBoxConfig
export interface XWUIContainerConfig extends XWUIBoxConfig {
    maxWidth?: string | number;
    center?: boolean;
}

// Data type - same as XWUIBoxData
export interface XWUIContainerData extends XWUIBoxData {
}

export class XWUIContainer extends XWUIBox {
    private containerConfig: XWUIContainerConfig;

    constructor(
        container: HTMLElement,
        data: XWUIContainerData = {},
        conf_comp: XWUIContainerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Merge container-specific config with box config
        const boxConfig: XWUIBoxConfig = {
            as: 'div',
            padding: conf_comp.padding ?? '0',
            className: conf_comp.className,
            ...conf_comp
        };
        super(container, data, boxConfig, conf_sys, conf_usr);
        
        // Store container config for later use (AFTER super() call)
        this.containerConfig = conf_comp;
        
        // Apply container-specific styles after parent render
        requestAnimationFrame(() => {
            this.applyContainerStyles();
        });
    }

    protected createConfig(
        conf_comp?: XWUIContainerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIContainerConfig {
        const boxConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...boxConfig,
            maxWidth: conf_comp?.maxWidth ?? '1200px',
            center: conf_comp?.center ?? true
        };
    }

    private applyContainerStyles(): void {
        const element = this.getElement();
        if (!element) return;

        element.classList.add('xwui-container');

        // Apply max-width
        const maxWidth = this.containerConfig.maxWidth ?? '1200px';
        if (maxWidth !== undefined) {
            const maxWidthValue = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
            element.style.maxWidth = maxWidthValue;
        }

        // Apply centering
        const center = this.containerConfig.center ?? true;
        if (center) {
            element.style.marginLeft = 'auto';
            element.style.marginRight = 'auto';
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIContainer as any).componentName = 'XWUIContainer';


