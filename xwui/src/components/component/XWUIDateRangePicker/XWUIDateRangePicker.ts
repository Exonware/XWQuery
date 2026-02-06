/**
 * XWUIDateRangePicker Component
 * Date range selection
 * 
 * NOTE: This component is now a wrapper around XWUIInputDateRange for backward compatibility.
 * For new code, use XWUIInputDateRange directly.
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInputDateRange } from '../XWUIInputDateRange/XWUIInputDateRange';

export interface XWUIDateRangePickerConfig {
    format?: string;
    placeholder?: string;
    separator?: string;
    showCalendarIcon?: boolean;
    className?: string;
}

export interface XWUIDateRangePickerData {
    value?: [Date, Date] | [string, string];
    minDate?: Date;
    maxDate?: Date;
}

export class XWUIDateRangePicker extends XWUIComponent<XWUIDateRangePickerData, XWUIDateRangePickerConfig> {
    private inputDateRangeInstance: XWUIInputDateRange | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIDateRangePickerData = {},
        conf_comp: XWUIDateRangePickerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDateRangePickerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDateRangePickerConfig {
        return {
            format: conf_comp?.format ?? 'YYYY-MM-DD',
            placeholder: conf_comp?.placeholder ?? 'Select date range',
            separator: conf_comp?.separator ?? ' ~ ',
            showCalendarIcon: conf_comp?.showCalendarIcon ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-date-range-picker-container';

        // Create XWUIInputDateRange instance
        this.inputDateRangeInstance = new XWUIInputDateRange(
            this.container,
            {
                value: this.data.value,
                minDate: this.data.minDate,
                maxDate: this.data.maxDate
            },
            {
                format: this.config.format,
                separator: this.config.separator,
                placeholder: this.config.placeholder,
                showIcon: this.config.showCalendarIcon,
                iconName: 'calendar',
                view: 'minimized', // Use popup mode for backward compatibility
                className: this.config.className
            },
            this.conf_sys,
            this.conf_usr
        );

        this.registerChildComponent(this.inputDateRangeInstance);
    }

    private formatDateRange(): string {
        const range = this.inputDateRangeInstance?.getValue();
        if (!range || !Array.isArray(range) || range.length !== 2) {
            return '';
        }
        
        const format = this.config.format || 'YYYY-MM-DD';
        const separator = this.config.separator || ' ~ ';
        
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return format
                .replace('YYYY', String(year))
                .replace('MM', month)
                .replace('DD', day);
        };

        return `${formatDate(range[0])}${separator}${formatDate(range[1])}`;
    }

    public getValue(): [Date, Date] | undefined {
        return this.inputDateRangeInstance?.getValue();
    }

    public setValue(range: [Date, Date] | [string, string] | undefined): void {
        if (this.inputDateRangeInstance) {
            this.inputDateRangeInstance.setValue(range);
            this.data.value = range;
        }
    }

    public getElement(): HTMLElement | null {
        return this.container.querySelector('.xwui-input-picker') as HTMLElement;
    }

    public destroy(): void {
        if (this.inputDateRangeInstance) {
            this.inputDateRangeInstance.destroy();
            this.inputDateRangeInstance = null;
        }
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDateRangePicker as any).componentName = 'XWUIDateRangePicker';

