/**
 * XWUIInputDate Component
 * Date input with picker - combines XWUIInput with XWUIPickerDate
 */

import { XWUIInputPicker, type XWUIInputPickerConfig, type XWUIInputPickerData } from '../XWUIInputPicker/XWUIInputPicker';
import { XWUIPickerDate } from '../XWUIPickerDate/XWUIPickerDate';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIInputDateConfig extends XWUIInputPickerConfig {
    format?: string;
    iconName?: string;
}

export interface XWUIInputDateData extends XWUIInputPickerData {
    value?: Date | string;
    minDate?: Date;
    maxDate?: Date;
}

export class XWUIInputDate extends XWUIInputPicker<XWUIInputDateData, XWUIInputDateConfig, XWUIPickerDate> {
    constructor(
        container: HTMLElement,
        data: XWUIInputDateData = {},
        conf_comp: XWUIInputDateConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
    }

    protected createConfig(
        conf_comp?: XWUIInputDateConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputDateConfig {
        const baseConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...baseConfig,
            format: conf_comp?.format ?? 'YYYY-MM-DD',
            iconName: conf_comp?.iconName ?? 'calendar',
            placeholder: conf_comp?.placeholder ?? 'Select date'
        };
    }

    /**
     * Create picker instance
     */
    protected createPicker(container: HTMLElement): XWUIPickerDate {
        const dateValue = this.data.value 
            ? (this.data.value instanceof Date ? this.data.value : new Date(this.data.value))
            : undefined;

        return new XWUIPickerDate(
            container,
            {
                value: dateValue,
                minDate: this.data.minDate,
                maxDate: this.data.maxDate
            },
            {
                format: this.config.format,
                placement: this.config.view === 'full' ? 'bottom' : 'bottom',
                className: 'xwui-input-date-picker'
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

        // Handle date selection
        this.pickerInstance.onChange((date: Date) => {
            this.data.value = date;
            this.updateInputFromPicker(date);
        });
    }

    /**
     * Format date value for display in input
     */
    protected formatValueForDisplay(value: any): string {
        if (!value) return '';
        
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) return '';

        const format = this.config.format || 'YYYY-MM-DD';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', String(year))
            .replace('MM', month)
            .replace('DD', day);
    }

    /**
     * Parse input value to date
     */
    protected parseInputValue(inputValue: string): Date | undefined {
        if (!inputValue || !inputValue.trim()) return undefined;
        
        const date = new Date(inputValue);
        if (isNaN(date.getTime())) return undefined;
        
        return date;
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
     * Override setValue to handle both Date and string
     */
    public setValue(value: Date | string | undefined): void {
        this.data.value = value;
        
        const dateValue = value instanceof Date ? value : (value ? new Date(value) : undefined);
        if (dateValue && !isNaN(dateValue.getTime())) {
            this.data.value = dateValue;
        }
        
        this.updateInputFromPicker(this.data.value);
        
        if (this.pickerInstance) {
            this.pickerInstance.setValue(dateValue);
        }
    }

    /**
     * Get value as Date
     */
    public getValue(): Date | undefined {
        if (!this.data.value) return undefined;
        return this.data.value instanceof Date ? this.data.value : new Date(this.data.value);
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIInputDate as any).componentName = 'XWUIInputDate';

