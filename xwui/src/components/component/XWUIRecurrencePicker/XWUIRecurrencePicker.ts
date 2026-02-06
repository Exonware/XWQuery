/**
 * XWUIRecurrencePicker Component
 * Configure recurring task patterns (daily, weekly, monthly, yearly, custom)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUISelect } from '../XWUISelect/XWUISelect';
import { XWUIInputNumber } from '../XWUIInputNumber/XWUIInputNumber';
import { XWUICheckbox } from '../XWUICheckbox/XWUICheckbox';
import { XWUIDatePicker } from '../XWUIDatePicker/XWUIDatePicker';
import { XWUIAccordion } from '../XWUIAccordion/XWUIAccordion';
import { XWUIAlert } from '../XWUIAlert/XWUIAlert';

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RecurrencePattern {
    type: RecurrenceType;
    interval?: number; // Every N days/weeks/months/years
    daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    monthOfYear?: number; // 0-11 (January-December)
    endDate?: Date;
    occurrences?: number;
}

// Component-level configuration
export interface XWUIRecurrencePickerConfig {
    showPreview?: boolean;
    className?: string;
}

// Data type
export interface XWUIRecurrencePickerData {
    startDate?: Date | string;
    pattern?: RecurrencePattern;
}

export class XWUIRecurrencePicker extends XWUIComponent<XWUIRecurrencePickerData, XWUIRecurrencePickerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private changeHandlers: Array<(pattern: RecurrencePattern) => void> = [];
    private typeSelect: XWUISelect | null = null;
    private intervalInput: XWUIInputNumber | null = null;
    private checkboxInstances: XWUICheckbox[] = [];
    private dayInput: XWUIInputNumber | null = null;
    private alertComponent: XWUIAlert | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIRecurrencePickerData = {},
        conf_comp: XWUIRecurrencePickerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        if (!this.data.pattern) {
            this.data.pattern = { type: 'daily', interval: 1 };
        }
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIRecurrencePickerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIRecurrencePickerConfig {
        return {
            showPreview: conf_comp?.showPreview ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-recurrence-picker';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Recurrence type selector
        const typeContainer = document.createElement('div');
        typeContainer.className = 'xwui-recurrence-picker-type';
        
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Repeat';
        typeLabel.className = 'xwui-recurrence-picker-label';
        typeContainer.appendChild(typeLabel);

        const typeSelectContainer = document.createElement('div');
        this.typeSelect = new XWUISelect(typeSelectContainer, {
            options: [
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
                { value: 'custom', label: 'Custom' }
            ],
            value: this.data.pattern?.type || 'daily'
        });

        this.typeSelect.onChange((value: string | number) => {
            const newType = value as RecurrenceType;
            this.data.pattern = { ...this.data.pattern, type: newType };
            this.render();
            this.notifyChange();
        });

        typeContainer.appendChild(typeSelectContainer);
        this.wrapperElement.appendChild(typeContainer);

        // Interval input
        const intervalContainer = document.createElement('div');
        intervalContainer.className = 'xwui-recurrence-picker-interval';
        
        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = 'Every';
        intervalLabel.className = 'xwui-recurrence-picker-label';
        intervalContainer.appendChild(intervalLabel);

        const intervalInputContainer = document.createElement('div');
        this.intervalInput = new XWUIInputNumber(intervalInputContainer, {
            value: this.data.pattern?.interval || 1
        }, {
            min: 1,
            max: 999
        });

        this.intervalInput.onChange(() => {
            const interval = this.intervalInput?.getValue() || 1;
            this.data.pattern = { ...this.data.pattern, interval };
            this.notifyChange();
        });

        intervalContainer.appendChild(intervalInputContainer);
        
        const intervalUnit = document.createElement('span');
        intervalUnit.className = 'xwui-recurrence-picker-unit';
        intervalUnit.textContent = this.getUnitLabel(this.data.pattern?.type || 'daily');
        intervalContainer.appendChild(intervalUnit);
        
        this.wrapperElement.appendChild(intervalContainer);

        // Type-specific options
        if (this.data.pattern?.type === 'weekly') {
            this.renderWeeklyOptions();
        } else if (this.data.pattern?.type === 'monthly') {
            this.renderMonthlyOptions();
        } else if (this.data.pattern?.type === 'yearly') {
            this.renderYearlyOptions();
        }

        // End date/occurrences
        this.renderEndOptions();

        // Preview
        if (this.config.showPreview) {
            this.renderPreview();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private getUnitLabel(type: RecurrenceType): string {
        const units: Record<RecurrenceType, string> = {
            daily: 'day(s)',
            weekly: 'week(s)',
            monthly: 'month(s)',
            yearly: 'year(s)',
            custom: 'period(s)'
        };
        return units[type];
    }

    private renderWeeklyOptions(): void {
        const daysContainer = document.createElement('div');
        daysContainer.className = 'xwui-recurrence-picker-days';
        
        const daysLabel = document.createElement('label');
        daysLabel.textContent = 'Days of week';
        daysLabel.className = 'xwui-recurrence-picker-label';
        daysContainer.appendChild(daysLabel);

        const daysGroup = document.createElement('div');
        daysGroup.className = 'xwui-recurrence-picker-days-group';
        
        this.checkboxInstances = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach((day, index) => {
            const checkboxContainer = document.createElement('div');
            const checkbox = new XWUICheckbox(checkboxContainer, {
                checked: this.data.pattern?.daysOfWeek?.includes(index) || false,
                label: day
            });
            this.checkboxInstances.push(checkbox);

            checkbox.onChange(() => {
                const daysOfWeek = this.data.pattern?.daysOfWeek || [];
                const dayIndex = daysOfWeek.indexOf(index);
                if (dayIndex > -1) {
                    daysOfWeek.splice(dayIndex, 1);
                } else {
                    daysOfWeek.push(index);
                }
                this.data.pattern = { ...this.data.pattern, daysOfWeek };
                this.notifyChange();
            });

            daysGroup.appendChild(checkboxContainer);
        });

        daysContainer.appendChild(daysGroup);
        this.wrapperElement!.appendChild(daysContainer);
    }

    private renderMonthlyOptions(): void {
        const dayContainer = document.createElement('div');
        dayContainer.className = 'xwui-recurrence-picker-day-of-month';
        
        const dayLabel = document.createElement('label');
        dayLabel.textContent = 'Day of month';
        dayLabel.className = 'xwui-recurrence-picker-label';
        dayContainer.appendChild(dayLabel);

        const dayInputContainer = document.createElement('div');
        this.dayInput = new XWUIInputNumber(dayInputContainer, {
            value: this.data.pattern?.dayOfMonth || 1
        }, {
            min: 1,
            max: 31
        });

        this.dayInput.onChange(() => {
            const dayOfMonth = this.dayInput?.getValue() || 1;
            this.data.pattern = { ...this.data.pattern, dayOfMonth };
            this.notifyChange();
        });

        dayContainer.appendChild(dayInputContainer);
        this.wrapperElement!.appendChild(dayContainer);
    }

    private renderYearlyOptions(): void {
        // Similar to monthly but with month selection
        this.renderMonthlyOptions();
    }

    private renderEndOptions(): void {
        const endContainer = document.createElement('div');
        endContainer.className = 'xwui-recurrence-picker-end';
        // Implementation for end date/occurrences
        this.wrapperElement!.appendChild(endContainer);
    }

    private renderPreview(): void {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'xwui-recurrence-picker-preview';
        
        const alertContainer = document.createElement('div');
        this.alertComponent = new XWUIAlert(alertContainer, {
            message: this.generatePreviewText(),
            variant: 'info'
        });

        previewContainer.appendChild(alertContainer);
        this.wrapperElement!.appendChild(previewContainer);
    }

    private generatePreviewText(): string {
        if (!this.data.pattern) return '';
        
        const interval = this.data.pattern.interval || 1;
        const unit = this.getUnitLabel(this.data.pattern.type);
        
        return `Repeats every ${interval} ${unit}`;
    }

    private notifyChange(): void {
        if (this.data.pattern) {
            this.changeHandlers.forEach(handler => handler({ ...this.data.pattern }));
        }
        if (this.config.showPreview) {
            const alert = this.wrapperElement?.querySelector('.xwui-alert');
            if (alert) {
                alert.textContent = this.generatePreviewText();
            }
        }
    }

    public getPattern(): RecurrencePattern | undefined {
        return this.data.pattern ? { ...this.data.pattern } : undefined;
    }

    public setPattern(pattern: RecurrencePattern): void {
        this.data.pattern = { ...pattern };
        this.render();
    }

    public onChange(handler: (pattern: RecurrencePattern) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.typeSelect) {
            this.typeSelect.destroy();
            this.typeSelect = null;
        }
        if (this.intervalInput) {
            this.intervalInput.destroy();
            this.intervalInput = null;
        }
        this.checkboxInstances.forEach(checkbox => checkbox.destroy());
        this.checkboxInstances = [];
        if (this.dayInput) {
            this.dayInput.destroy();
            this.dayInput = null;
        }
        if (this.alertComponent) {
            this.alertComponent.destroy();
            this.alertComponent = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.changeHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIRecurrencePicker as any).componentName = 'XWUIRecurrencePicker';


