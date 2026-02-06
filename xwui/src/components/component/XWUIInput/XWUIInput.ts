/**
 * XWUIInput Component
 * Text input with various types and states
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';

// Component-level configuration
export interface XWUIInputConfig {
    type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
    size?: 'small' | 'medium' | 'large';
    variant?: 'outlined' | 'filled' | 'underlined';
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    error?: boolean;
    fullWidth?: boolean;
    clearable?: boolean;
    showPasswordToggle?: boolean;
    prefix?: string | HTMLElement;
    suffix?: string | HTMLElement;
    className?: string;
}

// Data type
export interface XWUIInputData {
    value?: string;
    placeholder?: string;
    label?: string;
    helperText?: string;
    errorText?: string;
    name?: string;
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    maxLength?: number;
    pattern?: string;
    autocomplete?: string;
}

export class XWUIInput extends XWUIComponent<XWUIInputData, XWUIInputConfig> {
    private wrapperElement: HTMLElement | null = null;
    private inputElement: HTMLInputElement | null = null;
    private labelElement: HTMLElement | null = null;
    private helperElement: HTMLElement | null = null;
    private isPasswordVisible: boolean = false;
    private changeHandlers: Array<(value: string, event: Event) => void> = [];
    private focusHandlers: Array<(event: FocusEvent) => void> = [];
    private blurHandlers: Array<(event: FocusEvent) => void> = [];
    private clearIcon: XWUIIcon | null = null;
    private passwordToggleIcon: XWUIIcon | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIInputData = {},
        conf_comp: XWUIInputConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputConfig {
        return {
            type: conf_comp?.type ?? 'text',
            size: conf_comp?.size ?? 'medium',
            variant: conf_comp?.variant ?? 'outlined',
            disabled: conf_comp?.disabled ?? false,
            readonly: conf_comp?.readonly ?? false,
            required: conf_comp?.required ?? false,
            error: conf_comp?.error ?? false,
            fullWidth: conf_comp?.fullWidth ?? false,
            clearable: conf_comp?.clearable ?? false,
            showPasswordToggle: conf_comp?.showPasswordToggle ?? true,
            prefix: conf_comp?.prefix,
            suffix: conf_comp?.suffix,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-input-wrapper';
        this.wrapperElement.classList.add(`xwui-input-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-input-${this.config.variant}`);
        
        if (this.config.fullWidth) {
            this.wrapperElement.classList.add('xwui-input-full-width');
        }
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-input-disabled');
        }
        if (this.config.error) {
            this.wrapperElement.classList.add('xwui-input-error');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Label
        if (this.data.label) {
            this.labelElement = document.createElement('label');
            this.labelElement.className = 'xwui-input-label';
            this.labelElement.textContent = this.data.label;
            if (this.config.required) {
                const asterisk = document.createElement('span');
                asterisk.className = 'xwui-input-required';
                asterisk.textContent = ' *';
                this.labelElement.appendChild(asterisk);
            }
            if (this.data.id) {
                this.labelElement.setAttribute('for', this.data.id);
            }
            this.wrapperElement.appendChild(this.labelElement);
        }

        // Input container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'xwui-input-container';

        // Prefix
        if (this.config.prefix) {
            const prefixElement = document.createElement('span');
            prefixElement.className = 'xwui-input-prefix';
            if (typeof this.config.prefix === 'string') {
                prefixElement.innerHTML = this.config.prefix;
            } else {
                prefixElement.appendChild(this.config.prefix);
            }
            inputContainer.appendChild(prefixElement);
        }

        // Input element
        this.inputElement = document.createElement('input');
        this.inputElement.className = 'xwui-input';
        this.inputElement.type = this.config.type === 'password' && this.isPasswordVisible ? 'text' : this.config.type || 'text';
        
        if (this.data.value !== undefined) this.inputElement.value = this.data.value;
        if (this.data.placeholder) this.inputElement.placeholder = this.data.placeholder;
        if (this.data.name) this.inputElement.name = this.data.name;
        if (this.data.id) this.inputElement.id = this.data.id;
        if (this.data.min !== undefined) this.inputElement.min = String(this.data.min);
        if (this.data.max !== undefined) this.inputElement.max = String(this.data.max);
        if (this.data.step !== undefined) this.inputElement.step = String(this.data.step);
        if (this.data.maxLength !== undefined) this.inputElement.maxLength = this.data.maxLength;
        if (this.data.pattern) this.inputElement.pattern = this.data.pattern;
        if (this.data.autocomplete) this.inputElement.autocomplete = this.data.autocomplete;
        
        this.inputElement.disabled = this.config.disabled || false;
        this.inputElement.readOnly = this.config.readonly || false;
        this.inputElement.required = this.config.required || false;

        // Event listeners
        this.inputElement.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            this.data.value = value;
            this.changeHandlers.forEach(handler => handler(value, e));
            this.updateClearButtonVisibility();
        });

        this.inputElement.addEventListener('focus', (e) => {
            inputContainer.classList.add('xwui-input-focused');
            this.focusHandlers.forEach(handler => handler(e));
        });

        this.inputElement.addEventListener('blur', (e) => {
            inputContainer.classList.remove('xwui-input-focused');
            this.blurHandlers.forEach(handler => handler(e));
        });

        inputContainer.appendChild(this.inputElement);

        // Clear button - Use XWUIIcon
        if (this.config.clearable) {
            const clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.className = 'xwui-input-clear';
            
            const clearIconContainer = document.createElement('div');
            this.clearIcon = new XWUIIcon(clearIconContainer, 'close', { size: 18 }, this.conf_sys, this.conf_usr);
            this.registerChildComponent(this.clearIcon);
            clearButton.appendChild(clearIconContainer);
            
            clearButton.addEventListener('click', () => this.clear());
            if (!this.data.value) {
                clearButton.style.display = 'none';
            }
            inputContainer.appendChild(clearButton);
        }

        // Password toggle - Use XWUIIcon
        if (this.config.type === 'password' && this.config.showPasswordToggle) {
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'xwui-input-password-toggle';
            toggleButton.setAttribute('aria-label', this.isPasswordVisible ? 'Hide password' : 'Show password');
            
            const toggleIconContainer = document.createElement('div');
            const iconName = this.isPasswordVisible ? 'eye-off' : 'eye';
            this.passwordToggleIcon = new XWUIIcon(toggleIconContainer, iconName, { size: 20 }, this.conf_sys, this.conf_usr);
            this.registerChildComponent(this.passwordToggleIcon);
            toggleButton.appendChild(toggleIconContainer);
            
            toggleButton.addEventListener('click', () => this.togglePasswordVisibility());
            inputContainer.appendChild(toggleButton);
        }

        // Suffix
        if (this.config.suffix) {
            const suffixElement = document.createElement('span');
            suffixElement.className = 'xwui-input-suffix';
            if (typeof this.config.suffix === 'string') {
                suffixElement.innerHTML = this.config.suffix;
            } else {
                suffixElement.appendChild(this.config.suffix);
            }
            inputContainer.appendChild(suffixElement);
        }

        this.wrapperElement.appendChild(inputContainer);

        // Helper text
        const helperText = this.config.error && this.data.errorText ? this.data.errorText : this.data.helperText;
        if (helperText) {
            this.helperElement = document.createElement('span');
            this.helperElement.className = 'xwui-input-helper';
            if (this.config.error) {
                this.helperElement.classList.add('xwui-input-helper-error');
            }
            this.helperElement.textContent = helperText;
            this.wrapperElement.appendChild(this.helperElement);
        }

        this.container.appendChild(this.wrapperElement);
    }

    private updateClearButtonVisibility(): void {
        const clearButton = this.wrapperElement?.querySelector('.xwui-input-clear') as HTMLElement;
        if (clearButton) {
            clearButton.style.display = this.data.value ? 'flex' : 'none';
        }
    }

    private togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
        if (this.inputElement) {
            this.inputElement.type = this.isPasswordVisible ? 'text' : 'password';
        }
        const toggleButton = this.wrapperElement?.querySelector('.xwui-input-password-toggle') as HTMLButtonElement;
        if (toggleButton && this.passwordToggleIcon) {
            toggleButton.setAttribute('aria-label', this.isPasswordVisible ? 'Hide password' : 'Show password');
            // Update icon
            const iconName = this.isPasswordVisible ? 'eye-off' : 'eye';
            this.passwordToggleIcon.setIcon(iconName);
        }
    }

    public getValue(): string {
        return this.inputElement?.value || '';
    }

    public setValue(value: string): void {
        this.data.value = value;
        if (this.inputElement) {
            this.inputElement.value = value;
        }
        this.updateClearButtonVisibility();
    }

    public clear(): void {
        this.setValue('');
        this.inputElement?.focus();
        this.changeHandlers.forEach(handler => handler('', new Event('clear')));
    }

    public focus(): void {
        this.inputElement?.focus();
    }

    public blur(): void {
        this.inputElement?.blur();
    }

    public select(): void {
        this.inputElement?.select();
    }

    public setError(error: boolean, errorText?: string): void {
        this.config.error = error;
        if (errorText) {
            this.data.errorText = errorText;
        }
        this.render();
    }

    public setDisabled(disabled: boolean): void {
        this.config.disabled = disabled;
        if (this.inputElement) {
            this.inputElement.disabled = disabled;
        }
        if (this.wrapperElement) {
            if (disabled) {
                this.wrapperElement.classList.add('xwui-input-disabled');
            } else {
                this.wrapperElement.classList.remove('xwui-input-disabled');
            }
        }
    }

    public onChange(handler: (value: string, event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public onFocus(handler: (event: FocusEvent) => void): void {
        this.focusHandlers.push(handler);
    }

    public onBlur(handler: (event: FocusEvent) => void): void {
        this.blurHandlers.push(handler);
    }

    public getInputElement(): HTMLInputElement | null {
        return this.inputElement;
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        this.focusHandlers = [];
        this.blurHandlers = [];
        this.clearIcon = null;
        this.passwordToggleIcon = null;
        super.destroy();
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
            this.inputElement = null;
            this.labelElement = null;
            this.helperElement = null;
        }
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIInput as any).componentName = 'XWUIInput';

