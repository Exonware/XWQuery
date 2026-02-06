/**
 * XWUIForm Component
 * Form wrapper with validation
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIFormConfig {
    layout?: 'vertical' | 'horizontal' | 'inline';
    labelWidth?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIFormData {
    fields?: Array<{
        name: string;
        label: string;
        required?: boolean;
        component?: HTMLElement;
    }>;
}

export class XWUIForm extends XWUIComponent<XWUIFormData, XWUIFormConfig> {
    private formElement: HTMLFormElement | null = null;
    private submitHandlers: Array<(data: Record<string, any>, event: Event) => void> = [];
    private resetHandlers: Array<() => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIFormData = {},
        conf_comp: XWUIFormConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIFormConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFormConfig {
        return {
            layout: conf_comp?.layout ?? 'vertical',
            labelWidth: conf_comp?.labelWidth,
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.formElement = document.createElement('form');
        this.formElement.className = 'xwui-form';
        this.formElement.classList.add(`xwui-form-${this.config.layout}`);
        this.formElement.classList.add(`xwui-form-${this.config.size}`);
        
        if (this.config.className) {
            this.formElement.classList.add(this.config.className);
        }

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = this.getFormData();
            this.submitHandlers.forEach(handler => handler(formData, e));
        });

        if (this.data.fields) {
            this.data.fields.forEach(field => {
                const fieldWrapper = this.createFieldWrapper(field);
                this.formElement!.appendChild(fieldWrapper);
            });
        }

        this.container.appendChild(this.formElement);
    }

    private createFieldWrapper(field: XWUIFormData['fields'][0]): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-form-field';

        if (this.config.layout === 'horizontal') {
            const labelWrapper = document.createElement('div');
            labelWrapper.className = 'xwui-form-label-wrapper';
            if (this.config.labelWidth) {
                labelWrapper.style.width = this.config.labelWidth;
            }

            const label = document.createElement('label');
            label.className = 'xwui-form-label';
            label.textContent = field.label;
            if (field.required) {
                const required = document.createElement('span');
                required.className = 'xwui-form-required';
                required.textContent = ' *';
                label.appendChild(required);
            }
            labelWrapper.appendChild(label);
            wrapper.appendChild(labelWrapper);

            const controlWrapper = document.createElement('div');
            controlWrapper.className = 'xwui-form-control-wrapper';
            if (field.component) {
                controlWrapper.appendChild(field.component);
            }
            wrapper.appendChild(controlWrapper);
        } else {
            const label = document.createElement('label');
            label.className = 'xwui-form-label';
            label.textContent = field.label;
            if (field.required) {
                const required = document.createElement('span');
                required.className = 'xwui-form-required';
                required.textContent = ' *';
                label.appendChild(required);
            }
            wrapper.appendChild(label);

            const controlWrapper = document.createElement('div');
            controlWrapper.className = 'xwui-form-control-wrapper';
            if (field.component) {
                controlWrapper.appendChild(field.component);
            }
            wrapper.appendChild(controlWrapper);
        }

        return wrapper;
    }

    public getFormData(): Record<string, any> {
        const formData: Record<string, any> = {};
        
        if (this.formElement) {
            const inputs = this.formElement.querySelectorAll('input, select, textarea');
            inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
                const name = input.getAttribute('name');
                if (name) {
                    if (input.type === 'checkbox') {
                        formData[name] = (input as HTMLInputElement).checked;
                    } else if (input.type === 'radio') {
                        const checked = this.formElement!.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement;
                        formData[name] = checked ? checked.value : null;
                    } else {
                        formData[name] = input.value;
                    }
                }
            });
        }

        return formData;
    }

    public validate(): boolean {
        if (!this.formElement) return false;

        let isValid = true;
        const fields = this.formElement.querySelectorAll('.xwui-form-field');

        fields.forEach(field => {
            const input = field.querySelector('input[required], select[required], textarea[required]') as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            if (input && !input.value.trim()) {
                isValid = false;
                input.classList.add('xwui-form-error');
            } else if (input) {
                input.classList.remove('xwui-form-error');
            }
        });

        return isValid;
    }

    public reset(): void {
        if (this.formElement) {
            this.formElement.reset();
            this.resetHandlers.forEach(handler => handler());
        }
    }

    public onSubmit(handler: (data: Record<string, any>, event: Event) => void): void {
        this.submitHandlers.push(handler);
    }

    public onReset(handler: () => void): void {
        this.resetHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.formElement;
    }

    public destroy(): void {
        this.submitHandlers = [];
        this.resetHandlers = [];
        if (this.formElement) {
            this.formElement.remove();
            this.formElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIForm as any).componentName = 'XWUIForm';


