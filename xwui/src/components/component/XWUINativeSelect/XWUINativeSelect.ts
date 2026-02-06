/**
 * XWUINativeSelect Component
 * Wrapper for browser native <select> element
 * Critical for mobile UX and accessibility
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUINativeSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface XWUINativeSelectOptGroup {
    label: string;
    options: XWUINativeSelectOption[];
}

// Component-level configuration
export interface XWUINativeSelectConfig {
    size?: 'small' | 'medium' | 'large';
    variant?: 'outlined' | 'filled';
    disabled?: boolean;
    multiple?: boolean;
    fullWidth?: boolean;
    error?: boolean;
    className?: string;
    required?: boolean;
    autofocus?: boolean;
}

// Data type
export interface XWUINativeSelectData {
    options: Array<XWUINativeSelectOption | XWUINativeSelectOptGroup>;
    value?: string | string[];
    placeholder?: string;
    label?: string;
    helperText?: string;
    errorText?: string;
    name?: string;
    id?: string;
}

export class XWUINativeSelect extends XWUIComponent<XWUINativeSelectData, XWUINativeSelectConfig> {
    private wrapperElement: HTMLElement | null = null;
    private selectElement: HTMLSelectElement | null = null;
    private labelElement: HTMLLabelElement | null = null;
    private helperElement: HTMLElement | null = null;
    private changeHandlers: Array<(value: string | string[], event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUINativeSelectData,
        conf_comp: XWUINativeSelectConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUINativeSelectConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUINativeSelectConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            variant: conf_comp?.variant ?? 'outlined',
            disabled: conf_comp?.disabled ?? false,
            multiple: conf_comp?.multiple ?? false,
            fullWidth: conf_comp?.fullWidth ?? false,
            error: conf_comp?.error ?? false,
            className: conf_comp?.className,
            required: conf_comp?.required ?? false,
            autofocus: conf_comp?.autofocus ?? false
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-native-select-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        if (this.config.fullWidth) {
            this.container.classList.add('xwui-native-select-full-width');
        }

        // Label
        if (this.data.label) {
            this.labelElement = document.createElement('label');
            this.labelElement.className = 'xwui-native-select-label';
            this.labelElement.textContent = this.data.label;
            if (this.data.id) {
                this.labelElement.setAttribute('for', this.data.id);
            }
            this.container.appendChild(this.labelElement);
        }

        // Select wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-native-select-wrapper';
        this.wrapperElement.classList.add(`xwui-native-select-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-native-select-${this.config.variant}`);
        
        if (this.config.error || this.data.errorText) {
            this.wrapperElement.classList.add('xwui-native-select-error');
        }

        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-native-select-disabled');
        }

        // Native select element
        this.selectElement = document.createElement('select');
        this.selectElement.className = 'xwui-native-select';
        this.selectElement.multiple = this.config.multiple || false;
        this.selectElement.disabled = this.config.disabled || false;
        this.selectElement.required = this.config.required || false;
        this.selectElement.autofocus = this.config.autofocus || false;

        if (this.data.id) {
            this.selectElement.id = this.data.id;
        }

        if (this.data.name) {
            this.selectElement.name = this.data.name;
        }

        // Build options
        this.buildOptions();

        // Set value
        if (this.data.value !== undefined) {
            this.setCurrentValue(this.data.value);
        }

        // Change handler
        this.selectElement.addEventListener('change', (e) => {
            const value = this.getCurrentValue();
            this.changeHandlers.forEach(handler => handler(value, e));
        });

        this.wrapperElement.appendChild(this.selectElement);
        this.container.appendChild(this.wrapperElement);

        // Helper/Error text
        if (this.data.helperText || this.data.errorText) {
            this.helperElement = document.createElement('div');
            this.helperElement.className = this.data.errorText 
                ? 'xwui-native-select-error-text' 
                : 'xwui-native-select-helper-text';
            this.helperElement.textContent = this.data.errorText || this.data.helperText || '';
            this.container.appendChild(this.helperElement);
        }
    }

    private buildOptions(): void {
        if (!this.selectElement) return;

        // Add placeholder if single select
        if (!this.config.multiple && this.data.placeholder) {
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = this.data.placeholder;
            placeholderOption.disabled = true;
            placeholderOption.selected = !this.data.value;
            this.selectElement.appendChild(placeholderOption);
        }

        // Build options and optgroups
        this.data.options.forEach(item => {
            if ('options' in item) {
                // It's an optgroup
                const optgroup = document.createElement('optgroup');
                optgroup.label = item.label;
                
                item.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    if (option.disabled) {
                        optionElement.disabled = true;
                    }
                    optgroup.appendChild(optionElement);
                });
                
                this.selectElement?.appendChild(optgroup);
            } else {
                // It's a regular option
                const optionElement = document.createElement('option');
                optionElement.value = item.value;
                optionElement.textContent = item.label;
                if (item.disabled) {
                    optionElement.disabled = true;
                }
                this.selectElement?.appendChild(optionElement);
            }
        });
    }

    private getCurrentValue(): string | string[] {
        if (!this.selectElement) return this.config.multiple ? [] : '';

        if (this.config.multiple) {
            return Array.from(this.selectElement.selectedOptions).map(opt => opt.value);
        } else {
            return this.selectElement.value;
        }
    }

    private setCurrentValue(value: string | string[]): void {
        if (!this.selectElement) return;

        if (this.config.multiple) {
            const values = Array.isArray(value) ? value : [value];
            Array.from(this.selectElement.options).forEach(option => {
                option.selected = values.includes(option.value);
            });
        } else {
            this.selectElement.value = Array.isArray(value) ? value[0] || '' : value || '';
        }
    }

    public getValue(): string | string[] {
        return this.getCurrentValue();
    }

    public setValue(value: string | string[]): void {
        this.data.value = value;
        this.setCurrentValue(value);
    }

    public onChange(handler: (value: string | string[], event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLSelectElement | null {
        return this.selectElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        if (this.selectElement) {
            this.selectElement.removeEventListener('change', () => {});
            this.selectElement = null;
        }
        this.wrapperElement = null;
        this.labelElement = null;
        this.helperElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUINativeSelect as any).componentName = 'XWUINativeSelect';


