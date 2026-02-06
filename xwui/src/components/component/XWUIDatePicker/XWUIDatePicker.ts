/**
 * XWUIDatePicker Component
 * Calendar date selection component
 * 
 * NOTE: This component is now a wrapper around XWUIInputDate for backward compatibility.
 * For new code, use XWUIInputDate directly.
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInputDate } from '../XWUIInputDate/XWUIInputDate';

// Component-level configuration
export interface XWUIDatePickerConfig {
    format?: string;
    placeholder?: string;
    showCalendarIcon?: boolean;
    className?: string;
}

// Data type
export interface XWUIDatePickerData {
    value?: Date | string;
    minDate?: Date;
    maxDate?: Date;
}

export class XWUIDatePicker extends XWUIComponent<XWUIDatePickerData, XWUIDatePickerConfig> {
    private inputDateInstance: XWUIInputDate | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIDatePickerData = {},
        conf_comp: XWUIDatePickerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDatePickerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDatePickerConfig {
        return {
            format: conf_comp?.format ?? 'YYYY-MM-DD',
            placeholder: conf_comp?.placeholder ?? 'Select date',
            showCalendarIcon: conf_comp?.showCalendarIcon ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-date-picker-container';

        // Create XWUIInputDate instance
        this.inputDateInstance = new XWUIInputDate(
            this.container,
            {
                value: this.data.value,
                minDate: this.data.minDate,
                maxDate: this.data.maxDate
            },
            {
                format: this.config.format,
                placeholder: this.config.placeholder,
                showIcon: this.config.showCalendarIcon,
                iconName: 'calendar',
                view: 'minimized', // Use popup mode for backward compatibility
                className: this.config.className
            },
            this.conf_sys,
            this.conf_usr
        );

        this.registerChildComponent(this.inputDateInstance);
    }

    public getValue(): Date | undefined {
        return this.inputDateInstance?.getValue();
    }

    public setValue(date: Date | string | undefined): void {
        if (this.inputDateInstance) {
            this.inputDateInstance.setValue(date);
            this.data.value = date;
        }
    }

    public getElement(): HTMLElement | null {
        return this.container.querySelector('.xwui-input-picker') as HTMLElement;
    }

    public destroy(): void {
        if (this.inputDateInstance) {
            this.inputDateInstance.destroy();
            this.inputDateInstance = null;
        }
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDatePicker as any).componentName = 'XWUIDatePicker';

