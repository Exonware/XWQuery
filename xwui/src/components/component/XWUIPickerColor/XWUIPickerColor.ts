/**
 * XWUIPickerColor Component
 * Color picker (popup) - extends XWUIPicker
 * This is the popup/overlay part for color selection
 */

import { XWUIPicker, type XWUIPickerConfig, type XWUIPickerData } from '../XWUIPicker/XWUIPicker';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIPickerColorConfig extends XWUIPickerConfig {
    format?: 'hex' | 'rgb' | 'hsl';
    presets?: string[];
    className?: string;
}

export interface XWUIPickerColorData extends XWUIPickerData {
    value?: string;
}

export class XWUIPickerColor extends XWUIPicker<XWUIPickerColorData, XWUIPickerColorConfig> {
    private nativeColorInput: HTMLInputElement | null = null;
    private changeHandlers: Array<(color: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIPickerColorData = {},
        conf_comp: XWUIPickerColorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
    }

    protected createConfig(
        conf_comp?: XWUIPickerColorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPickerColorConfig {
        const baseConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...baseConfig,
            format: conf_comp?.format ?? 'hex',
            presets: conf_comp?.presets,
            className: conf_comp?.className
        };
    }

    /**
     * Render picker content - color picker UI
     */
    protected renderPickerContent(): void {
        if (!this.pickerElement) return;

        this.pickerElement.classList.add('xwui-picker-color');

        // Native color input
        this.nativeColorInput = document.createElement('input');
        this.nativeColorInput.type = 'color';
        this.nativeColorInput.className = 'xwui-picker-color-native';
        this.nativeColorInput.value = this.data.value || '#000000';
        this.nativeColorInput.addEventListener('change', (e) => {
            const value = (e.target as HTMLInputElement).value;
            this.setColor(value);
            this.close();
        });
        this.pickerElement.appendChild(this.nativeColorInput);

        // Presets container
        if (this.config.presets && this.config.presets.length > 0) {
            const presetsContainer = document.createElement('div');
            presetsContainer.className = 'xwui-picker-color-presets';
            
            this.config.presets.forEach(preset => {
                const presetBtn = document.createElement('button');
                presetBtn.type = 'button';
                presetBtn.className = 'xwui-picker-color-preset';
                presetBtn.setAttribute('aria-label', `Select color ${preset}`);
                presetBtn.style.backgroundColor = preset;
                presetBtn.addEventListener('click', () => {
                    this.setColor(preset);
                    this.close();
                });
                presetsContainer.appendChild(presetBtn);
            });

            this.pickerElement.appendChild(presetsContainer);
        }
    }

    /**
     * Set color value
     */
    public setColor(value: string): void {
        this.data.value = value;
        
        if (this.nativeColorInput) {
            this.nativeColorInput.value = value || '#000000';
        }
        
        this.changeHandlers.forEach(handler => handler(value));
    }

    /**
     * Get selected color value
     */
    public getValue(): string | undefined {
        return this.data.value;
    }

    /**
     * Set value (alias for setColor for consistency)
     */
    public setValue(value: string | undefined): void {
        this.setColor(value || '#000000');
    }

    /**
     * Register change handler
     */
    public onChange(handler: (color: string) => void): void {
        this.changeHandlers.push(handler);
    }

    /**
     * Remove change handler
     */
    public offChange(handler: (color: string) => void): void {
        this.changeHandlers = this.changeHandlers.filter(h => h !== handler);
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        this.changeHandlers = [];
        this.nativeColorInput = null;
        super.destroy();
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIPickerColor as any).componentName = 'XWUIPickerColor';

