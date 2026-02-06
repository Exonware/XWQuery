/**
 * XWUIInputOTP Component
 * One-time password input with multiple digits
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIInputOTPConfig {
    length?: number;
    type?: 'text' | 'number' | 'password';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIInputOTPData {
    value?: string;
}

export class XWUIInputOTP extends XWUIComponent<XWUIInputOTPData, XWUIInputOTPConfig> {
    private otpElement: HTMLElement | null = null;
    private inputs: HTMLInputElement[] = [];
    private changeHandlers: Array<(value: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIInputOTPData = {},
        conf_comp: XWUIInputOTPConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputOTPConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputOTPConfig {
        return {
            length: conf_comp?.length ?? 6,
            type: conf_comp?.type ?? 'text',
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.otpElement = document.createElement('div');
        this.otpElement.className = 'xwui-input-otp';
        this.otpElement.classList.add(`xwui-input-otp-${this.config.size}`);
        
        if (this.config.className) {
            this.otpElement.classList.add(this.config.className);
        }

        this.inputs = [];
        const value = this.data.value || '';

        for (let i = 0; i < this.config.length!; i++) {
            const input = document.createElement('input');
            input.type = this.config.type === 'password' ? 'password' : this.config.type === 'number' ? 'number' : 'text';
            input.className = 'xwui-input-otp-digit';
            input.maxLength = 1;
            input.value = value[i] || '';
            
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const value = target.value;
                
                // Only allow single character
                if (value.length > 1) {
                    target.value = value[value.length - 1];
                }
                
                // Move to next input
                if (value && i < this.config.length! - 1) {
                    this.inputs[i + 1]?.focus();
                }
                
                this.updateValue();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && i > 0) {
                    this.inputs[i - 1]?.focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || (window as any).clipboardData).getData('text');
                const digits = paste.slice(0, this.config.length!).split('');
                digits.forEach((digit, idx) => {
                    if (this.inputs[i + idx]) {
                        this.inputs[i + idx].value = digit;
                    }
                });
                this.updateValue();
                const nextIndex = Math.min(i + digits.length, this.config.length! - 1);
                this.inputs[nextIndex]?.focus();
            });

            this.otpElement.appendChild(input);
            this.inputs.push(input);
        }

        this.container.appendChild(this.otpElement);
    }

    private updateValue(): void {
        const value = this.inputs.map(input => input.value).join('');
        this.data.value = value;
        this.changeHandlers.forEach(handler => handler(value));
    }

    public getValue(): string {
        return this.data.value || '';
    }

    public setValue(value: string): void {
        this.data.value = value.slice(0, this.config.length!);
        this.inputs.forEach((input, index) => {
            input.value = this.data.value![index] || '';
        });
    }

    public onChange(handler: (value: string) => void): void {
        this.changeHandlers.push(handler);
    }

    public focus(): void {
        this.inputs[0]?.focus();
    }

    public getElement(): HTMLElement | null {
        return this.otpElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        this.inputs = [];
        if (this.otpElement) {
            this.otpElement.remove();
            this.otpElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIInputOTP as any).componentName = 'XWUIInputOTP';


