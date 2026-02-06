/**
 * XWUIInputDateRange Component
 * Date range input with picker - combines XWUIInput with XWUIPickerDateRange
 */

import { XWUIInputPicker, type XWUIInputPickerConfig, type XWUIInputPickerData } from '../XWUIInputPicker/XWUIInputPicker';
import { XWUIPickerDateRange } from '../XWUIPickerDateRange/XWUIPickerDateRange';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIInputDateRangeConfig extends XWUIInputPickerConfig {
    format?: string;
    separator?: string;
    iconName?: string;
}

export interface XWUIInputDateRangeData extends XWUIInputPickerData {
    value?: [Date, Date] | [string, string];
    minDate?: Date;
    maxDate?: Date;
}

export class XWUIInputDateRange extends XWUIInputPicker<XWUIInputDateRangeData, XWUIInputDateRangeConfig, XWUIPickerDateRange> {
    constructor(
        container: HTMLElement,
        data: XWUIInputDateRangeData = {},
        conf_comp: XWUIInputDateRangeConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
    }

    protected createConfig(
        conf_comp?: XWUIInputDateRangeConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputDateRangeConfig {
        const baseConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...baseConfig,
            format: conf_comp?.format ?? 'YYYY-MM-DD',
            separator: conf_comp?.separator ?? ' ~ ',
            iconName: conf_comp?.iconName ?? 'calendar',
            placeholder: conf_comp?.placeholder ?? 'Select date range'
        };
    }

    /**
     * Create picker instance
     */
    protected createPicker(container: HTMLElement): XWUIPickerDateRange {
        return new XWUIPickerDateRange(
            container,
            {
                value: this.data.value,
                minDate: this.data.minDate,
                maxDate: this.data.maxDate
            },
            {
                format: this.config.format,
                separator: this.config.separator,
                placement: this.config.view === 'full' ? 'bottom' : 'bottom',
                className: 'xwui-input-date-range-picker'
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

        // Handle date range selection
        this.pickerInstance.onChange((range: [Date, Date]) => {
            this.data.value = range;
            this.updateInputFromPicker(range);
        });
    }

    /**
     * Format date range value for display in input
     */
    protected formatValueForDisplay(value: any): string {
        if (!value || !Array.isArray(value) || value.length !== 2) return '';
        
        const format = this.config.format || 'YYYY-MM-DD';
        const separator = this.config.separator || ' ~ ';
        
        const formatDate = (date: Date | string) => {
            const d = date instanceof Date ? date : new Date(date);
            if (isNaN(d.getTime())) return '';
            
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            
            return format
                .replace('YYYY', String(year))
                .replace('MM', month)
                .replace('DD', day);
        };

        const start = formatDate(value[0]);
        const end = formatDate(value[1]);
        
        if (!start || !end) return '';
        
        return `${start}${separator}${end}`;
    }

    /**
     * Parse input value to date range
     */
    protected parseInputValue(inputValue: string): [Date, Date] | undefined {
        if (!inputValue || !inputValue.trim()) return undefined;
        
        const separator = this.config.separator || ' ~ ';
        const parts = inputValue.split(separator);
        
        if (parts.length !== 2) return undefined;
        
        const start = new Date(parts[0].trim());
        const end = new Date(parts[1].trim());
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;
        
        return [start, end];
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
     * Override setValue to handle date ranges
     */
    public setValue(value: [Date, Date] | [string, string] | undefined): void {
        this.data.value = value;
        
        if (value && Array.isArray(value) && value.length === 2) {
            const dateRange: [Date, Date] = [
                value[0] instanceof Date ? value[0] : new Date(value[0]),
                value[1] instanceof Date ? value[1] : new Date(value[1])
            ];
            this.data.value = dateRange;
            
            if (this.pickerInstance) {
                this.pickerInstance.setValue(dateRange);
            }
        } else {
            this.data.value = undefined;
            if (this.pickerInstance) {
                this.pickerInstance.setValue(undefined);
            }
        }
        
        this.updateInputFromPicker(this.data.value);
    }

    /**
     * Get value as date range
     */
    public getValue(): [Date, Date] | undefined {
        if (!this.data.value || !Array.isArray(this.data.value) || this.data.value.length !== 2) {
            return undefined;
        }
        
        return [
            this.data.value[0] instanceof Date ? this.data.value[0] : new Date(this.data.value[0]),
            this.data.value[1] instanceof Date ? this.data.value[1] : new Date(this.data.value[1])
        ];
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIInputDateRange as any).componentName = 'XWUIInputDateRange';

