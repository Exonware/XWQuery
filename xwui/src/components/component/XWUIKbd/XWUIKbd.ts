/**
 * XWUIKbd Component
 * Keyboard key display component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIKbdConfig {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIKbdData {
    keys: string | string[];
}

export class XWUIKbd extends XWUIComponent<XWUIKbdData, XWUIKbdConfig> {
    private kbdElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIKbdData,
        conf_comp: XWUIKbdConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIKbdConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIKbdConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.kbdElement = document.createElement('kbd');
        this.kbdElement.className = 'xwui-kbd';
        this.kbdElement.classList.add(`xwui-kbd-${this.config.size}`);
        
        if (this.config.className) {
            this.kbdElement.classList.add(this.config.className);
        }

        const keys = Array.isArray(this.data.keys) ? this.data.keys : [this.data.keys];
        
        keys.forEach((key, index) => {
            const keyElement = document.createElement('span');
            keyElement.className = 'xwui-kbd-key';
            keyElement.textContent = key;
            this.kbdElement!.appendChild(keyElement);

            if (index < keys.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'xwui-kbd-separator';
                separator.textContent = '+';
                this.kbdElement!.appendChild(separator);
            }
        });

        this.container.appendChild(this.kbdElement);
    }

    public getElement(): HTMLElement | null {
        return this.kbdElement;
    }

    public destroy(): void {
        if (this.kbdElement) {
            this.kbdElement.remove();
            this.kbdElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIKbd as any).componentName = 'XWUIKbd';


