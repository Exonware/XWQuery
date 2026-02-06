/**
 * XWUITimePicker Component
 * Time selection component (12h/24h formats)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITimePickerConfig {
    format?: '12h' | '24h';
    showSeconds?: boolean;
    className?: string;
}

// Data type
export interface XWUITimePickerData {
    value?: string | { hours?: number; minutes?: number; seconds?: number } | { hour?: number; minute?: number; second?: number }; // HH:mm or HH:mm:ss format, or object with time values
}

export class XWUITimePicker extends XWUIComponent<XWUITimePickerData, XWUITimePickerConfig> {
    private pickerElement: HTMLElement | null = null;
    private hourSelect: HTMLSelectElement | null = null;
    private minuteSelect: HTMLSelectElement | null = null;
    private secondSelect: HTMLSelectElement | null = null;
    private amPmSelect: HTMLSelectElement | null = null;
    private changeHandlers: Array<(value: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUITimePickerData = {},
        conf_comp: XWUITimePickerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITimePickerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITimePickerConfig {
        return {
            format: conf_comp?.format ?? '24h',
            showSeconds: conf_comp?.showSeconds ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.pickerElement = document.createElement('div');
        this.pickerElement.className = 'xwui-time-picker';
        
        if (this.config.className) {
            this.pickerElement.classList.add(this.config.className);
        }

        const timeValue = this.parseTime(this.data.value);

        // Hour select
        this.hourSelect = document.createElement('select');
        this.hourSelect.className = 'xwui-time-picker-select';
        const maxHour = this.config.format === '12h' ? 12 : 23;
        const minHour = this.config.format === '12h' ? 1 : 0;
        
        for (let i = minHour; i <= maxHour; i++) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i).padStart(2, '0');
            if (i === timeValue.hour) {
                option.selected = true;
            }
            this.hourSelect.appendChild(option);
        }
        this.hourSelect.addEventListener('change', () => this.updateValue());
        this.pickerElement.appendChild(this.hourSelect);

        const colon1 = document.createElement('span');
        colon1.className = 'xwui-time-picker-separator';
        colon1.textContent = ':';
        this.pickerElement.appendChild(colon1);

        // Minute select
        this.minuteSelect = document.createElement('select');
        this.minuteSelect.className = 'xwui-time-picker-select';
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i).padStart(2, '0');
            if (i === timeValue.minute) {
                option.selected = true;
            }
            this.minuteSelect.appendChild(option);
        }
        this.minuteSelect.addEventListener('change', () => this.updateValue());
        this.pickerElement.appendChild(this.minuteSelect);

        // Second select (optional)
        if (this.config.showSeconds) {
            const colon2 = document.createElement('span');
            colon2.className = 'xwui-time-picker-separator';
            colon2.textContent = ':';
            this.pickerElement.appendChild(colon2);

            this.secondSelect = document.createElement('select');
            this.secondSelect.className = 'xwui-time-picker-select';
            for (let i = 0; i < 60; i++) {
                const option = document.createElement('option');
                option.value = String(i);
                option.textContent = String(i).padStart(2, '0');
                if (i === timeValue.second) {
                    option.selected = true;
                }
                this.secondSelect.appendChild(option);
            }
            this.secondSelect.addEventListener('change', () => this.updateValue());
            this.pickerElement.appendChild(this.secondSelect);
        }

        // AM/PM select (for 12h format)
        if (this.config.format === '12h') {
            this.amPmSelect = document.createElement('select');
            this.amPmSelect.className = 'xwui-time-picker-select';
            const amOption = document.createElement('option');
            amOption.value = 'AM';
            amOption.textContent = 'AM';
            const pmOption = document.createElement('option');
            pmOption.value = 'PM';
            pmOption.textContent = 'PM';
            if (timeValue.hour >= 12) {
                pmOption.selected = true;
            } else {
                amOption.selected = true;
            }
            this.amPmSelect.appendChild(amOption);
            this.amPmSelect.appendChild(pmOption);
            this.amPmSelect.addEventListener('change', () => this.updateValue());
            this.pickerElement.appendChild(this.amPmSelect);
        }

        this.container.appendChild(this.pickerElement);
    }

    private parseTime(value?: string | { hours?: number; minutes?: number; seconds?: number } | { hour?: number; minute?: number; second?: number }): { hour: number; minute: number; second: number } {
        if (!value) {
            const now = new Date();
            return {
                hour: now.getHours(),
                minute: now.getMinutes(),
                second: now.getSeconds()
            };
        }

        // Handle object format { hours, minutes, seconds } or { hour, minute, second }
        if (typeof value === 'object' && !Array.isArray(value)) {
            return {
                hour: value.hour ?? value.hours ?? 0,
                minute: value.minute ?? value.minutes ?? 0,
                second: value.second ?? value.seconds ?? 0
            };
        }

        // Handle string format "HH:mm" or "HH:mm:ss"
        if (typeof value !== 'string') {
            const now = new Date();
            return {
                hour: now.getHours(),
                minute: now.getMinutes(),
                second: now.getSeconds()
            };
        }

        const parts = value.split(':');
        let hour = parseInt(parts[0]) || 0;
        const minute = parseInt(parts[1]) || 0;
        const second = parseInt(parts[2]) || 0;

        // Handle 12h format conversion
        if (this.config.format === '12h' && hour > 12) {
            hour = hour - 12;
        } else if (this.config.format === '12h' && hour === 0) {
            hour = 12;
        }

        return { hour, minute, second };
    }

    private updateValue(): void {
        if (!this.hourSelect || !this.minuteSelect) return;

        let hour = parseInt(this.hourSelect.value);
        const minute = parseInt(this.minuteSelect.value);
        const second = this.secondSelect ? parseInt(this.secondSelect.value) : 0;

        // Handle 12h format
        if (this.config.format === '12h' && this.amPmSelect) {
            if (this.amPmSelect.value === 'PM' && hour !== 12) {
                hour += 12;
            } else if (this.amPmSelect.value === 'AM' && hour === 12) {
                hour = 0;
            }
        }

        const timeString = this.config.showSeconds
            ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
            : `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        this.data.value = timeString;
        this.changeHandlers.forEach(handler => handler(timeString));
    }

    public getValue(): string {
        return this.data.value || '';
    }

    public setValue(value: string): void {
        this.data.value = value;
        const timeValue = this.parseTime(value);
        
        if (this.hourSelect) {
            const displayHour = this.config.format === '12h' 
                ? (timeValue.hour > 12 ? timeValue.hour - 12 : (timeValue.hour === 0 ? 12 : timeValue.hour))
                : timeValue.hour;
            this.hourSelect.value = String(displayHour);
        }
        if (this.minuteSelect) {
            this.minuteSelect.value = String(timeValue.minute);
        }
        if (this.secondSelect) {
            this.secondSelect.value = String(timeValue.second);
        }
        if (this.amPmSelect) {
            this.amPmSelect.value = timeValue.hour >= 12 ? 'PM' : 'AM';
        }
    }

    public onChange(handler: (value: string) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.pickerElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        if (this.pickerElement) {
            this.pickerElement.remove();
            this.pickerElement = null;
        }
        this.hourSelect = null;
        this.minuteSelect = null;
        this.secondSelect = null;
        this.amPmSelect = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITimePicker as any).componentName = 'XWUITimePicker';


