/**
 * XWUIPickerDate Component
 * Date picker (calendar popup) - extends XWUIPicker
 * This is the popup/overlay part for date selection
 */

import { XWUIPicker, type XWUIPickerConfig, type XWUIPickerData } from '../XWUIPicker/XWUIPicker';
import { XWUICalendar } from '../XWUICalendar/XWUICalendar';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIPickerDateConfig extends XWUIPickerConfig {
    format?: string;
    className?: string;
}

export interface XWUIPickerDateData extends XWUIPickerData {
    value?: Date | string;
    minDate?: Date;
    maxDate?: Date;
}

export class XWUIPickerDate extends XWUIPicker<XWUIPickerDateData, XWUIPickerDateConfig> {
    private calendarInstance: XWUICalendar | null = null;
    private changeHandlers: Array<(date: Date) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIPickerDateData = {},
        conf_comp: XWUIPickerDateConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
    }

    protected createConfig(
        conf_comp?: XWUIPickerDateConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPickerDateConfig {
        const baseConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...baseConfig,
            format: conf_comp?.format ?? 'YYYY-MM-DD',
            className: conf_comp?.className
        };
    }

    /**
     * Render picker content - calendar component
     */
    protected renderPickerContent(): void {
        if (!this.pickerElement) return;

        this.pickerElement.classList.add('xwui-picker-date');
        
        const calendarContainer = document.createElement('div');
        calendarContainer.className = 'xwui-picker-date-calendar';

        const selectedDate = this.data.value 
            ? (this.data.value instanceof Date ? this.data.value : new Date(this.data.value))
            : undefined;

        this.calendarInstance = new XWUICalendar(
            calendarContainer,
            {
                selectedDate,
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

        // Handle date selection
        this.calendarInstance.onDateClick((date) => {
            this.data.value = date;
            this.changeHandlers.forEach(handler => handler(date));
            this.close();
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
     * Get selected date value
     */
    public getValue(): Date | undefined {
        if (!this.data.value) return undefined;
        return this.data.value instanceof Date ? this.data.value : new Date(this.data.value);
    }

    /**
     * Set date value
     */
    public setValue(date: Date | string | undefined): void {
        this.data.value = date;
        
        if (this.calendarInstance) {
            const dateObj = date 
                ? (date instanceof Date ? date : new Date(date))
                : undefined;
            // Update calendar instance
            (this.calendarInstance as any).data.selectedDate = dateObj;
            if (typeof (this.calendarInstance as any).render === 'function') {
                (this.calendarInstance as any).render();
            }
        }
    }

    /**
     * Register change handler
     */
    public onChange(handler: (date: Date) => void): void {
        this.changeHandlers.push(handler);
    }

    /**
     * Remove change handler
     */
    public offChange(handler: (date: Date) => void): void {
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
(XWUIPickerDate as any).componentName = 'XWUIPickerDate';

