/**
 * XWUIColorPicker Component
 * Color picker input
 * 
 * NOTE: This component is now a wrapper around XWUIInputColor for backward compatibility.
 * For new code, use XWUIInputColor directly.
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInputColor } from '../XWUIInputColor/XWUIInputColor';

export interface XWUIColorPickerConfig {
    format?: 'hex' | 'rgb' | 'hsl';
    showText?: boolean;
    allowClear?: boolean;
    presets?: string[];
    className?: string;
}

export interface XWUIColorPickerData {
    value?: string;
}

export class XWUIColorPicker extends XWUIComponent<XWUIColorPickerData, XWUIColorPickerConfig> {
    private inputColorInstance: XWUIInputColor | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIColorPickerData = {},
        conf_comp: XWUIColorPickerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIColorPickerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIColorPickerConfig {
        return {
            format: conf_comp?.format ?? 'hex',
            showText: conf_comp?.showText ?? true,
            allowClear: conf_comp?.allowClear ?? true,
            presets: conf_comp?.presets,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-color-picker-container';

        // Create XWUIInputColor instance
        this.inputColorInstance = new XWUIInputColor(
            this.container,
            {
                value: this.data.value
            },
            {
                format: this.config.format,
                presets: this.config.presets,
                showIcon: true,
                iconName: 'color-picker',
                view: 'minimized', // Use popup mode for backward compatibility
                clearable: this.config.allowClear,
                readonly: !this.config.showText, // If showText is false, make readonly (swatch only)
                className: this.config.className
            },
            this.conf_sys,
            this.conf_usr
        );

        this.registerChildComponent(this.inputColorInstance);
    }

    public getValue(): string | undefined {
        return this.inputColorInstance?.getValue();
    }

    public setValue(value: string | undefined): void {
        if (this.inputColorInstance) {
            this.inputColorInstance.setValue(value);
            this.data.value = value;
        }
    }

    public destroy(): void {
        if (this.inputColorInstance) {
            this.inputColorInstance.destroy();
            this.inputColorInstance = null;
        }
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIColorPicker as any).componentName = 'XWUIColorPicker';

