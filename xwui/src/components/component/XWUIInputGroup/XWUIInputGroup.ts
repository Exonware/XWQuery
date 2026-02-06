/**
 * XWUIInputGroup Component
 * Input with prefix/suffix elements
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIInputGroupConfig {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIInputGroupData {
    prefix?: HTMLElement | string;
    suffix?: HTMLElement | string;
    input: HTMLElement | string;
    leftAddon?: HTMLElement | string;
    rightAddon?: HTMLElement | string;
}

export class XWUIInputGroup extends XWUIComponent<XWUIInputGroupData, XWUIInputGroupConfig> {
    private groupElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIInputGroupData,
        conf_comp: XWUIInputGroupConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputGroupConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputGroupConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.groupElement = document.createElement('div');
        this.groupElement.className = 'xwui-input-group';
        this.groupElement.classList.add(`xwui-input-group-${this.config.size}`);
        
        if (this.config.className) {
            this.groupElement.classList.add(this.config.className);
        }

        // Prefix (support both prefix and leftAddon)
        const prefixValue = this.data.prefix ?? this.data.leftAddon;
        if (prefixValue) {
            const prefix = document.createElement('div');
            prefix.className = 'xwui-input-group-prefix';
            
            if (typeof prefixValue === 'string') {
                prefix.innerHTML = prefixValue;
            } else {
                prefix.appendChild(prefixValue);
            }
            
            this.groupElement.appendChild(prefix);
        }

        // Input
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'xwui-input-group-input';
        
        if (this.data.input) {
            if (typeof this.data.input === 'string') {
                inputWrapper.innerHTML = this.data.input;
            } else if (this.data.input instanceof HTMLElement) {
                inputWrapper.appendChild(this.data.input);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                inputWrapper.appendChild(input);
            }
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            inputWrapper.appendChild(input);
        }
        
        this.groupElement.appendChild(inputWrapper);

        // Suffix (support both suffix and rightAddon)
        const suffixValue = this.data.suffix ?? this.data.rightAddon;
        if (suffixValue) {
            const suffix = document.createElement('div');
            suffix.className = 'xwui-input-group-suffix';
            
            if (typeof this.data.suffix === 'string') {
                suffix.innerHTML = this.data.suffix;
            } else {
                suffix.appendChild(this.data.suffix);
            }
            
            this.groupElement.appendChild(suffix);
        }

        this.container.appendChild(this.groupElement);
    }

    public getElement(): HTMLElement | null {
        return this.groupElement;
    }

    public destroy(): void {
        if (this.groupElement) {
            this.groupElement.remove();
            this.groupElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIInputGroup as any).componentName = 'XWUIInputGroup';


