/**
 * XWUIField Component
 * Form field wrapper with label, input, and error message
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUILabel } from '../XWUILabel/XWUILabel';

// Component-level configuration
export interface XWUIFieldConfig {
    required?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIFieldData {
    label?: string;
    error?: string;
    hint?: string;
    input: HTMLElement | string;
}

export class XWUIField extends XWUIComponent<XWUIFieldData, XWUIFieldConfig> {
    private fieldElement: HTMLElement | null = null;
    private labelInstance: XWUILabel | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIFieldData,
        conf_comp: XWUIFieldConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIFieldConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFieldConfig {
        return {
            required: conf_comp?.required ?? false,
            disabled: conf_comp?.disabled ?? false,
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.fieldElement = document.createElement('div');
        this.fieldElement.className = 'xwui-field';
        this.fieldElement.classList.add(`xwui-field-${this.config.size}`);
        
        if (this.config.className) {
            this.fieldElement.classList.add(this.config.className);
        }

        // Label
        if (this.data.label) {
            const labelContainer = document.createElement('div');
            this.labelInstance = new XWUILabel(
                labelContainer,
                { text: this.data.label },
                {
                    required: this.config.required,
                    disabled: this.config.disabled,
                    size: this.config.size
                }
            );
            this.registerChildComponent(this.labelInstance);
            this.fieldElement.appendChild(labelContainer);
        }

        // Input
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'xwui-field-input';
        if (this.data.error) {
            inputWrapper.classList.add('xwui-field-input-error');
        }
        if (this.data.input) {
            if (typeof this.data.input === 'string') {
                inputWrapper.innerHTML = this.data.input;
            } else if (this.data.input instanceof HTMLElement) {
                inputWrapper.appendChild(this.data.input);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                inputWrapper.appendChild(input);
            }
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            inputWrapper.appendChild(input);
        }
        this.fieldElement.appendChild(inputWrapper);

        // Error message
        if (this.data.error) {
            const error = document.createElement('div');
            error.className = 'xwui-field-error';
            error.textContent = this.data.error;
            this.fieldElement.appendChild(error);
        }

        // Hint
        if (this.data.hint && !this.data.error) {
            const hint = document.createElement('div');
            hint.className = 'xwui-field-hint';
            hint.textContent = this.data.hint;
            this.fieldElement.appendChild(hint);
        }

        this.container.appendChild(this.fieldElement);
    }

    public setError(error: string | undefined): void {
        this.data.error = error;
        this.render();
    }

    public setHint(hint: string | undefined): void {
        this.data.hint = hint;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.fieldElement;
    }

    public destroy(): void {
        // Child component (labelInstance) is automatically destroyed by base class
        if (this.fieldElement) {
            this.fieldElement.remove();
            this.fieldElement = null;
        }
        this.labelInstance = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIField as any).componentName = 'XWUIField';


