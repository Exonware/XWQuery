/**
 * XWUIInputNumber Component
 * Dedicated number input with increment/decrement controls
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIInputNumberConfig {
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    controls?: boolean;
    parser?: (value: string) => number;
    formatter?: (value: number) => string;
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    className?: string;
}

export interface XWUIInputNumberData {
    value?: number;
    placeholder?: string;
}

export class XWUIInputNumber extends XWUIComponent<XWUIInputNumberData, XWUIInputNumberConfig> {
    private wrapperElement: HTMLElement | null = null;
    private inputElement: HTMLInputElement | null = null;
    private incrementButton: HTMLButtonElement | null = null;
    private decrementButton: HTMLButtonElement | null = null;
    private changeHandlers: Array<(value: number, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIInputNumberData = {},
        conf_comp: XWUIInputNumberConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputNumberConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputNumberConfig {
        return {
            min: conf_comp?.min,
            max: conf_comp?.max,
            step: conf_comp?.step ?? 1,
            precision: conf_comp?.precision,
            controls: conf_comp?.controls ?? true,
            parser: conf_comp?.parser,
            formatter: conf_comp?.formatter,
            size: conf_comp?.size ?? 'medium',
            disabled: conf_comp?.disabled ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-number-input-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-number-input';
        this.wrapperElement.classList.add(`xwui-number-input-${this.config.size}`);
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-number-input-disabled');
        }

        // Decrement button
        if (this.config.controls) {
            this.decrementButton = document.createElement('button');
            this.decrementButton.className = 'xwui-number-input-control xwui-number-input-decrement';
            this.decrementButton.type = 'button';
            this.decrementButton.innerHTML = '−';
            this.decrementButton.disabled = this.config.disabled || false;
            this.decrementButton.addEventListener('click', () => this.decrement());
            this.wrapperElement.appendChild(this.decrementButton);
        }

        // Input
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'number';
        this.inputElement.className = 'xwui-number-input-field';
        
        if (this.config.min !== undefined) {
            this.inputElement.min = String(this.config.min);
        }
        if (this.config.max !== undefined) {
            this.inputElement.max = String(this.config.max);
        }
        if (this.config.step !== undefined) {
            this.inputElement.step = String(this.config.step);
        }
        
        this.inputElement.placeholder = this.data.placeholder || '';
        this.inputElement.disabled = this.config.disabled || false;
        
        if (this.data.value !== undefined) {
            this.inputElement.value = this.formatValue(this.data.value);
        }

        this.inputElement.addEventListener('input', (e) => this.handleInput(e));
        this.inputElement.addEventListener('blur', (e) => this.handleBlur(e));
        this.inputElement.addEventListener('change', (e) => this.handleChange(e));

        this.wrapperElement.appendChild(this.inputElement);

        // Increment button
        if (this.config.controls) {
            this.incrementButton = document.createElement('button');
            this.incrementButton.className = 'xwui-number-input-control xwui-number-input-increment';
            this.incrementButton.type = 'button';
            this.incrementButton.innerHTML = '+';
            this.incrementButton.disabled = this.config.disabled || false;
            this.incrementButton.addEventListener('click', () => this.increment());
            this.wrapperElement.appendChild(this.incrementButton);
        }

        this.container.appendChild(this.wrapperElement);
        this.updateButtonStates();
    }

    private formatValue(value: number): string {
        if (this.config.formatter) {
            return this.config.formatter(value);
        }
        
        if (this.config.precision !== undefined) {
            return value.toFixed(this.config.precision);
        }
        
        return String(value);
    }

    private parseValue(value: string): number {
        if (this.config.parser) {
            return this.config.parser(value);
        }
        
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }

    private clampValue(value: number): number {
        let clamped = value;
        
        if (this.config.min !== undefined && clamped < this.config.min) {
            clamped = this.config.min;
        }
        if (this.config.max !== undefined && clamped > this.config.max) {
            clamped = this.config.max;
        }

        if (this.config.precision !== undefined) {
            clamped = parseFloat(clamped.toFixed(this.config.precision));
        }

        return clamped;
    }

    private getCurrentValue(): number {
        if (!this.inputElement) return 0;
        return this.parseValue(this.inputElement.value);
    }

    private updateValue(value: number): void {
        const clamped = this.clampValue(value);
        this.data.value = clamped;
        
        if (this.inputElement) {
            this.inputElement.value = this.formatValue(clamped);
        }
        
        this.updateButtonStates();
    }

    private increment(): void {
        const current = this.getCurrentValue();
        const step = this.config.step || 1;
        this.updateValue(current + step);
        this.notifyChange();
    }

    private decrement(): void {
        const current = this.getCurrentValue();
        const step = this.config.step || 1;
        this.updateValue(current - step);
        this.notifyChange();
    }

    private handleInput(event: Event): void {
        // Update internal state but don't clamp yet
        const value = this.parseValue((event.target as HTMLInputElement).value);
        this.data.value = value;
        this.updateButtonStates();
    }

    private handleBlur(event: Event): void {
        // Clamp value on blur
        const value = this.getCurrentValue();
        this.updateValue(value);
        this.notifyChange();
    }

    private handleChange(event: Event): void {
        const value = this.getCurrentValue();
        this.updateValue(value);
        this.notifyChange();
    }

    private notifyChange(): void {
        const value = this.data.value || 0;
        const changeEvent = new Event('change', { bubbles: true });
        this.changeHandlers.forEach(handler => {
            handler(value, changeEvent);
        });
    }

    private updateButtonStates(): void {
        if (!this.incrementButton || !this.decrementButton) return;
        
        const current = this.getCurrentValue();
        const disabled = this.config.disabled || false;
        
        this.decrementButton.disabled = disabled || (this.config.min !== undefined && current <= this.config.min);
        this.incrementButton.disabled = disabled || (this.config.max !== undefined && current >= this.config.max);
    }

    public getValue(): number {
        return this.data.value || 0;
    }

    public setValue(value: number): void {
        this.updateValue(value);
    }

    public onChange(handler: (value: number, event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public destroy(): void {
        this.changeHandlers = [];
        if (this.inputElement) {
            this.inputElement = null;
        }
        if (this.incrementButton) {
            this.incrementButton = null;
        }
        if (this.decrementButton) {
            this.decrementButton = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIInputNumber as any).componentName = 'XWUIInputNumber';


