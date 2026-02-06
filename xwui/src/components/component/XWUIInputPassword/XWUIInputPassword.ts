/**
 * XWUIInputPassword Component
 * Dedicated password input with visibility toggle
 * Wraps XWUIInput with password-specific defaults
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInput, type XWUIInputConfig, type XWUIInputData } from '../XWUIInput/XWUIInput';

export interface XWUIInputPasswordConfig extends Omit<XWUIInputConfig, 'type' | 'showPasswordToggle'> {
    showToggle?: boolean;
    strengthMeter?: boolean;
}

export interface XWUIInputPasswordData extends XWUIInputData {}

export class XWUIInputPassword extends XWUIComponent<XWUIInputPasswordData, XWUIInputPasswordConfig> {
    private inputInstance: XWUIInput | null = null;
    private strengthMeterElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIInputPasswordData = {},
        conf_comp: XWUIInputPasswordConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputPasswordConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputPasswordConfig {
        return {
            showToggle: conf_comp?.showToggle ?? true,
            strengthMeter: conf_comp?.strengthMeter ?? false,
            ...conf_comp
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-password-input-container';

        // Create input wrapper
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'xwui-password-input-wrapper';

        // Convert config to XWUIInput config
        const inputConfig: XWUIInputConfig = {
            ...this.config,
            type: 'password',
            showPasswordToggle: this.config.showToggle
        };

        // Create XWUIInput instance
        this.inputInstance = new XWUIInput(inputWrapper, this.data, inputConfig, this.conf_sys, this.conf_usr);
        
        this.container.appendChild(inputWrapper);

        // Add strength meter if enabled
        if (this.config.strengthMeter) {
            this.addStrengthMeter();
        }

        // Listen for value changes to update strength meter
        if (this.config.strengthMeter && this.inputInstance) {
            // Access the input element through the instance
            const inputEl = inputWrapper.querySelector('input');
            if (inputEl) {
                inputEl.addEventListener('input', () => this.updateStrengthMeter());
            }
        }
    }

    private addStrengthMeter(): void {
        this.strengthMeterElement = document.createElement('div');
        this.strengthMeterElement.className = 'xwui-password-strength-meter';
        this.container.appendChild(this.strengthMeterElement);
    }

    private updateStrengthMeter(): void {
        if (!this.strengthMeterElement) return;

        const inputEl = this.container.querySelector('input') as HTMLInputElement;
        if (!inputEl) return;

        const password = inputEl.value;
        const strength = this.calculatePasswordStrength(password);

        this.strengthMeterElement.className = 'xwui-password-strength-meter';
        this.strengthMeterElement.classList.add(`xwui-password-strength-${strength.level}`);
        this.strengthMeterElement.textContent = strength.text;
    }

    private calculatePasswordStrength(password: string): { level: 'weak' | 'medium' | 'strong'; text: string } {
        if (!password) {
            return { level: 'weak', text: '' };
        }

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) {
            return { level: 'weak', text: 'Weak' };
        } else if (score <= 4) {
            return { level: 'medium', text: 'Medium' };
        } else {
            return { level: 'strong', text: 'Strong' };
        }
    }

    public getInputInstance(): XWUIInput | null {
        return this.inputInstance;
    }

    public destroy(): void {
        if (this.inputInstance) {
            // XWUIInput doesn't have a destroy method, so just clear
            this.inputInstance = null;
        }
        this.strengthMeterElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIInputPassword as any).componentName = 'XWUIInputPassword';


