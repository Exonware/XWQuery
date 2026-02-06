/**
 * XWUIDurationPicker Component
 * Combined hours and minutes input for time duration
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInputNumber } from '../XWUIInputNumber/XWUIInputNumber';

// Component-level configuration
export interface XWUIDurationPickerConfig {
    min?: number; // Minimum duration in minutes
    max?: number; // Maximum duration in minutes
    step?: number; // Step for minutes (default: 15)
    showPresets?: boolean; // Show preset duration buttons
    presets?: Array<{ label: string; minutes: number }>; // Custom presets
    className?: string;
}

// Data type
export interface XWUIDurationPickerData {
    hours?: number;
    minutes?: number;
    totalMinutes?: number; // Total duration in minutes (auto-calculated)
}

export class XWUIDurationPicker extends XWUIComponent<XWUIDurationPickerData, XWUIDurationPickerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private hoursInput: XWUIInputNumber | null = null;
    private minutesInput: XWUIInputNumber | null = null;
    private changeHandlers: Array<(data: XWUIDurationPickerData) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIDurationPickerData = {},
        conf_comp: XWUIDurationPickerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.normalizeData();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDurationPickerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDurationPickerConfig {
        return {
            min: conf_comp?.min,
            max: conf_comp?.max,
            step: conf_comp?.step ?? 15,
            showPresets: conf_comp?.showPresets ?? false,
            presets: conf_comp?.presets ?? [
                { label: '15m', minutes: 15 },
                { label: '30m', minutes: 30 },
                { label: '1h', minutes: 60 },
                { label: '2h', minutes: 120 },
                { label: '4h', minutes: 240 },
                { label: '8h', minutes: 480 }
            ],
            className: conf_comp?.className
        };
    }

    private normalizeData(): void {
        // If totalMinutes is provided, calculate hours and minutes
        if (this.data.totalMinutes !== undefined) {
            const total = Math.max(0, this.data.totalMinutes);
            this.data.hours = Math.floor(total / 60);
            this.data.minutes = total % 60;
        } else {
            // Ensure valid values
            this.data.hours = Math.max(0, this.data.hours || 0);
            this.data.minutes = Math.max(0, Math.min(59, this.data.minutes || 0));
            this.data.totalMinutes = this.data.hours * 60 + this.data.minutes;
        }
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-duration-picker';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Input group container
        const inputGroup = document.createElement('div');
        inputGroup.className = 'xwui-duration-picker-inputs';

        // Hours input
        const hoursContainer = document.createElement('div');
        hoursContainer.className = 'xwui-duration-picker-hours';
        
        const hoursLabel = document.createElement('label');
        hoursLabel.className = 'xwui-duration-picker-label';
        hoursLabel.textContent = 'Hours';
        hoursContainer.appendChild(hoursLabel);

        const hoursInputContainer = document.createElement('div');
        this.hoursInput = new XWUIInputNumber(hoursInputContainer, {
            value: this.data.hours || 0,
            min: 0,
            max: 999,
            step: 1
        }, {
            size: 'small'
        });

        hoursInputContainer.addEventListener('change', () => {
            this.data.hours = this.hoursInput?.getValue() || 0;
            this.data.totalMinutes = (this.data.hours || 0) * 60 + (this.data.minutes || 0);
            this.validateAndUpdate();
        });

        hoursContainer.appendChild(hoursInputContainer);
        inputGroup.appendChild(hoursContainer);

        // Separator
        const separator = document.createElement('span');
        separator.className = 'xwui-duration-picker-separator';
        separator.textContent = ':';
        inputGroup.appendChild(separator);

        // Minutes input
        const minutesContainer = document.createElement('div');
        minutesContainer.className = 'xwui-duration-picker-minutes';
        
        const minutesLabel = document.createElement('label');
        minutesLabel.className = 'xwui-duration-picker-label';
        minutesLabel.textContent = 'Minutes';
        minutesContainer.appendChild(minutesLabel);

        const minutesInputContainer = document.createElement('div');
        this.minutesInput = new XWUIInputNumber(minutesInputContainer, {
            value: this.data.minutes || 0,
            min: 0,
            max: 59,
            step: this.config.step || 15
        }, {
            size: 'small'
        });

        minutesInputContainer.addEventListener('change', () => {
            this.data.minutes = this.minutesInput?.getValue() || 0;
            this.data.totalMinutes = (this.data.hours || 0) * 60 + (this.data.minutes || 0);
            this.validateAndUpdate();
        });

        minutesContainer.appendChild(minutesInputContainer);
        inputGroup.appendChild(minutesContainer);

        this.wrapperElement.appendChild(inputGroup);

        // Presets
        if (this.config.showPresets && this.config.presets && this.config.presets.length > 0) {
            const presetsContainer = document.createElement('div');
            presetsContainer.className = 'xwui-duration-picker-presets';
            
            this.config.presets.forEach(preset => {
                const presetButton = document.createElement('button');
                presetButton.className = 'xwui-duration-picker-preset';
                presetButton.textContent = preset.label;
                presetButton.setAttribute('type', 'button');
                
                presetButton.addEventListener('click', () => {
                    this.setTotalMinutes(preset.minutes);
                });
                
                presetsContainer.appendChild(presetButton);
            });
            
            this.wrapperElement.appendChild(presetsContainer);
        }

        // Total display
        const totalDisplay = document.createElement('div');
        totalDisplay.className = 'xwui-duration-picker-total';
        totalDisplay.textContent = this.formatTotalMinutes(this.data.totalMinutes || 0);
        this.wrapperElement.appendChild(totalDisplay);

        this.container.appendChild(this.wrapperElement);
    }

    private validateAndUpdate(): void {
        const total = this.data.totalMinutes || 0;
        
        if (this.config.min !== undefined && total < this.config.min) {
            this.data.totalMinutes = this.config.min;
            this.normalizeData();
            this.updateInputs();
        } else if (this.config.max !== undefined && total > this.config.max) {
            this.data.totalMinutes = this.config.max;
            this.normalizeData();
            this.updateInputs();
        }

        this.updateTotalDisplay();
        this.notifyChange();
    }

    private updateInputs(): void {
        if (this.hoursInput) {
            this.hoursInput.setValue(this.data.hours || 0);
        }
        if (this.minutesInput) {
            this.minutesInput.setValue(this.data.minutes || 0);
        }
    }

    private updateTotalDisplay(): void {
        const totalDisplay = this.wrapperElement?.querySelector('.xwui-duration-picker-total');
        if (totalDisplay) {
            totalDisplay.textContent = this.formatTotalMinutes(this.data.totalMinutes || 0);
        }
    }

    private formatTotalMinutes(minutes: number): string {
        if (minutes === 0) return '0 minutes';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) return `${mins} minute${mins !== 1 ? 's' : ''}`;
        if (mins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
        return `${hours}h ${mins}m`;
    }

    private notifyChange(): void {
        this.changeHandlers.forEach(handler => handler({ ...this.data }));
    }

    public setTotalMinutes(minutes: number): void {
        this.data.totalMinutes = Math.max(0, minutes);
        this.normalizeData();
        this.render();
    }

    public getTotalMinutes(): number {
        return this.data.totalMinutes || 0;
    }

    public getData(): XWUIDurationPickerData {
        return { ...this.data };
    }

    public onChange(handler: (data: XWUIDurationPickerData) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.hoursInput) {
            this.hoursInput.destroy();
            this.hoursInput = null;
        }
        if (this.minutesInput) {
            this.minutesInput.destroy();
            this.minutesInput = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.changeHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDurationPicker as any).componentName = 'XWUIDurationPicker';


