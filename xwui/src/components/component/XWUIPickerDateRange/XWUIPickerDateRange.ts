/**
 * XWUIPickerDateRange Component
 * Date range picker (calendar popup for range selection) - extends XWUIPicker
 * This is the popup/overlay part for date range selection
 */

import { XWUIPicker, type XWUIPickerConfig, type XWUIPickerData } from '../XWUIPicker/XWUIPicker';
import { XWUICalendar } from '../XWUICalendar/XWUICalendar';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIPickerDateRangeConfig extends XWUIPickerConfig {
    format?: string;
    separator?: string;
    className?: string;
}

export interface XWUIPickerDateRangeData extends XWUIPickerData {
    value?: [Date, Date] | [string, string];
    minDate?: Date;
    maxDate?: Date;
}

export class XWUIPickerDateRange extends XWUIPicker<XWUIPickerDateRangeData, XWUIPickerDateRangeConfig> {
    private calendarInstance: XWUICalendar | null = null;
    private selectedRange: [Date | null, Date | null] = [null, null];
    private isSelectingStart: boolean = true;
    private changeHandlers: Array<(range: [Date, Date]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIPickerDateRangeData = {},
        conf_comp: XWUIPickerDateRangeConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Initialize selected range from value
        if (this.data.value && Array.isArray(this.data.value) && this.data.value.length === 2) {
            this.selectedRange = [
                this.data.value[0] instanceof Date ? this.data.value[0] : new Date(this.data.value[0]),
                this.data.value[1] instanceof Date ? this.data.value[1] : new Date(this.data.value[1])
            ];
        }
    }

    protected createConfig(
        conf_comp?: XWUIPickerDateRangeConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPickerDateRangeConfig {
        const baseConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...baseConfig,
            format: conf_comp?.format ?? 'YYYY-MM-DD',
            separator: conf_comp?.separator ?? ' ~ ',
            className: conf_comp?.className
        };
    }

    /**
     * Render picker content - calendar component for range selection
     */
    protected renderPickerContent(): void {
        if (!this.pickerElement) return;

        this.pickerElement.classList.add('xwui-picker-date-range');

        // Create calendar container
        const calendarContainer = document.createElement('div');
        calendarContainer.className = 'xwui-picker-date-range-calendar';

        // Determine initial selected date (start of range if selecting start, end if selecting end)
        const initialDate = this.isSelectingStart 
            ? (this.selectedRange[0] || undefined)
            : (this.selectedRange[1] || this.selectedRange[0] || undefined);

        this.calendarInstance = new XWUICalendar(
            calendarContainer,
            {
                selectedDate: initialDate,
                minDate: this.data.minDate,
                maxDate: this.data.maxDate
            },
            {
                view: 'month',
                showToday: true,
                showNavigation: true
            },
            this.conf_sys,
            this.conf_usr
        );

        this.registerChildComponent(this.calendarInstance);

        // Handle date selection for range
        this.calendarInstance.onDateClick((date) => {
            if (this.isSelectingStart || !this.selectedRange[0]) {
                // Start selecting range
                this.selectedRange[0] = date;
                this.selectedRange[1] = null;
                this.isSelectingStart = false;
            } else {
                // Complete range selection
                if (date < this.selectedRange[0]!) {
                    // Selected date is before start, swap them
                    this.selectedRange[1] = this.selectedRange[0];
                    this.selectedRange[0] = date;
                } else {
                    this.selectedRange[1] = date;
                }
                
                // Range is complete
                if (this.selectedRange[0] && this.selectedRange[1]) {
                    this.data.value = [this.selectedRange[0], this.selectedRange[1]];
                    this.changeHandlers.forEach(handler => handler([this.selectedRange[0]!, this.selectedRange[1]!]));
                    this.close();
                }
            }
        });

        this.pickerElement.appendChild(calendarContainer);
    }

    /**
     * Format date according to config format
     */
    private formatDate(date: Date): string {
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
     * Get selected date range value
     */
    public getValue(): [Date, Date] | undefined {
        if (!this.selectedRange[0] || !this.selectedRange[1]) return undefined;
        return [this.selectedRange[0], this.selectedRange[1]];
    }

    /**
     * Set date range value
     */
    public setValue(range: [Date, Date] | [string, string] | undefined): void {
        if (!range || !Array.isArray(range) || range.length !== 2) {
            this.selectedRange = [null, null];
            this.data.value = undefined;
            return;
        }

        this.selectedRange = [
            range[0] instanceof Date ? range[0] : new Date(range[0]),
            range[1] instanceof Date ? range[1] : new Date(range[1])
        ];
        this.data.value = [this.selectedRange[0], this.selectedRange[1]];

        // Update calendar if needed
        if (this.calendarInstance && this.selectedRange[0]) {
            (this.calendarInstance as any).data.selectedDate = this.selectedRange[0];
            if (typeof (this.calendarInstance as any).render === 'function') {
                (this.calendarInstance as any).render();
            }
        }
    }

    /**
     * Register change handler
     */
    public onChange(handler: (range: [Date, Date]) => void): void {
        this.changeHandlers.push(handler);
    }

    /**
     * Remove change handler
     */
    public offChange(handler: (range: [Date, Date]) => void): void {
        this.changeHandlers = this.changeHandlers.filter(h => h !== handler);
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        this.changeHandlers = [];
        if (this.calendarInstance) {
            this.calendarInstance.destroy();
            this.calendarInstance = null;
        }
        super.destroy();
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIPickerDateRange as any).componentName = 'XWUIPickerDateRange';

