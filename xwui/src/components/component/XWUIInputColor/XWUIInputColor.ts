/**
 * XWUIInputColor Component
 * Color input with picker - combines XWUIInput with XWUIPickerColor
 */

import { XWUIInputPicker, type XWUIInputPickerConfig, type XWUIInputPickerData } from '../XWUIInputPicker/XWUIInputPicker';
import { XWUIPickerColor } from '../XWUIPickerColor/XWUIPickerColor';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIInputColorConfig extends XWUIInputPickerConfig {
    format?: 'hex' | 'rgb' | 'hsl';
    presets?: string[];
    iconName?: string;
}

export interface XWUIInputColorData extends XWUIInputPickerData {
    value?: string;
}

export class XWUIInputColor extends XWUIInputPicker<XWUIInputColorData, XWUIInputColorConfig, XWUIPickerColor> {
    private swatchElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIInputColorData = {},
        conf_comp: XWUIInputColorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
    }

    protected createConfig(
        conf_comp?: XWUIInputColorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputColorConfig {
        const baseConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...baseConfig,
            format: conf_comp?.format ?? 'hex',
            presets: conf_comp?.presets,
            iconName: conf_comp?.iconName ?? 'color-picker',
            placeholder: conf_comp?.placeholder ?? '#000000',
            readonly: conf_comp?.readonly ?? false // Allow text input for colors
        };
    }

    /**
     * Override render to add color swatch
     */
    protected render(): void {
        // Call parent render first
        super.render();
        
        // Add color swatch after render completes
        setTimeout(() => {
            this.setupColorSwatch();
        }, 0);
    }

    /**
     * Setup color swatch element
     */
    private setupColorSwatch(): void {
        // Add color swatch to input wrapper
        if (this.wrapperElement && !this.swatchElement) {
            const inputWrapper = this.wrapperElement.querySelector('.xwui-input-picker-input-wrapper');
            if (inputWrapper) {
                this.swatchElement = document.createElement('div');
                this.swatchElement.className = 'xwui-input-color-swatch';
                this.swatchElement.style.backgroundColor = this.data.value || '#000000';
                this.swatchElement.style.width = '24px';
                this.swatchElement.style.height = '24px';
                this.swatchElement.style.borderRadius = '4px';
                this.swatchElement.style.border = '1px solid var(--color-border, #ddd)';
                this.swatchElement.style.cursor = 'pointer';
                this.swatchElement.addEventListener('click', () => {
                    const triggerEl = this.swatchElement || this.iconButton || this.inputContainer;
                    this.togglePicker(triggerEl || undefined);
                });
                
                // Insert before icon button or at the end
                if (this.iconButton && this.iconButton.parentNode) {
                    this.iconButton.parentNode.insertBefore(this.swatchElement, this.iconButton);
                } else {
                    inputWrapper.appendChild(this.swatchElement);
                }
            }
        }
    }

    /**
     * Create picker instance
     */
    protected createPicker(container: HTMLElement): XWUIPickerColor {
        return new XWUIPickerColor(
            container,
            {
                value: this.data.value
            },
            {
                format: this.config.format,
                presets: this.config.presets,
                placement: this.config.view === 'full' ? 'bottom' : 'bottom',
                className: 'xwui-input-color-picker'
            },
            this.conf_sys,
            this.conf_usr
        );
    }

    /**
     * Setup picker event handlers
     */
    protected setupPickerHandlers(): void {
        if (!this.pickerInstance) return;

        // Handle color selection
        this.pickerInstance.onChange((color: string) => {
            this.data.value = color;
            this.updateInputFromPicker(color);
            this.updateSwatch();
        });

        // Also handle input changes
        if (this.inputInstance) {
            const inputEl = (this.inputInstance as any).wrapperElement?.querySelector('input') || 
                           (this.inputInstance as any).inputElement;
            if (inputEl) {
                inputEl.addEventListener('input', (e) => {
                    const value = (e.target as HTMLInputElement).value;
                    this.data.value = value;
                    this.updateSwatch();
                    if (this.pickerInstance) {
                        this.pickerInstance.setValue(value);
                    }
                });
                
                inputEl.addEventListener('blur', () => {
                    this.validateAndFormatColor();
                });
            }
        }
    }

    /**
     * Format color value for display in input
     */
    protected formatValueForDisplay(value: any): string {
        return value || '';
    }

    /**
     * Parse input value to color
     */
    protected parseInputValue(inputValue: string): string {
        return inputValue.trim();
    }

    /**
     * Update input from picker value
     */
    protected updateInputFromPicker(pickerValue: any): void {
        if (!this.inputInstance) return;
        
        const displayValue = this.formatValueForDisplay(pickerValue);
        this.inputInstance.setValue(displayValue);
    }

    /**
     * Update color swatch
     */
    private updateSwatch(): void {
        if (this.swatchElement) {
            this.swatchElement.style.backgroundColor = this.data.value || '#000000';
        }
    }

    /**
     * Validate and format color value
     */
    private validateAndFormatColor(): void {
        if (!this.data.value) return;
        
        let value = this.data.value.trim();
        
        // Try to validate and format
        if (value.startsWith('#')) {
            // Validate hex
            if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
                // Try to fix
                const hex = value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                if (hex.length === 6) {
                    value = '#' + hex;
                } else {
                    value = '#000000';
                }
            }
        } else if (value.startsWith('rgb') || value.startsWith('hsl')) {
            // Keep as is for rgb/hsl
        } else {
            // Try to interpret as hex
            const hexMatch = value.match(/[0-9A-Fa-f]{6}/);
            if (hexMatch) {
                value = '#' + hexMatch[0];
            } else {
                value = '#000000';
            }
        }

        this.setValue(value);
    }

    /**
     * Override setValue to update swatch
     */
    public setValue(value: string | undefined): void {
        this.data.value = value;
        this.updateInputFromPicker(value);
        this.updateSwatch();
        
        if (this.pickerInstance) {
            this.pickerInstance.setValue(value || '#000000');
        }
    }

    /**
     * Get value
     */
    public getValue(): string | undefined {
        return this.data.value;
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIInputColor as any).componentName = 'XWUIInputColor';

