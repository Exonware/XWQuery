/**
 * XWUIDynamicFieldRenderer Component
 * Render custom field types dynamically in forms and views
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIForm } from '../XWUIForm/XWUIForm';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUITextarea } from '../XWUITextarea/XWUITextarea';
import { XWUIDatePicker } from '../XWUIDatePicker/XWUIDatePicker';
import { XWUISelect } from '../XWUISelect/XWUISelect';
import { XWUIMultiSelect } from '../XWUIMultiSelect/XWUIMultiSelect';
import { XWUIInputNumber } from '../XWUIInputNumber/XWUIInputNumber';
import { XWUICheckbox } from '../XWUICheckbox/XWUICheckbox';
import { XWUISwitch } from '../XWUISwitch/XWUISwitch';
import { XWUILabel } from '../XWUILabel/XWUILabel';

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'switch' | 'email' | 'url';

export interface CustomField {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    defaultValue?: any;
    options?: Array<{ value: string; label: string }>; // For select/multiselect
    min?: number; // For number
    max?: number; // For number
    validation?: (value: any) => string | null; // Returns error message or null
}

// Component-level configuration
export interface XWUIDynamicFieldRendererConfig {
    layout?: 'vertical' | 'horizontal';
    showLabels?: boolean;
    className?: string;
}

// Data type
export interface XWUIDynamicFieldRendererData {
    fields: CustomField[];
    values?: Record<string, any>;
}

export class XWUIDynamicFieldRenderer extends XWUIComponent<XWUIDynamicFieldRendererData, XWUIDynamicFieldRendererConfig> {
    private wrapperElement: HTMLElement | null = null;
    private fieldComponents: Map<string, any> = new Map();
    private changeHandlers: Array<(fieldId: string, value: any) => void> = [];
    private validationErrors: Map<string, string> = new Map();

    constructor(
        container: HTMLElement,
        data: XWUIDynamicFieldRendererData,
        conf_comp: XWUIDynamicFieldRendererConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDynamicFieldRendererConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDynamicFieldRendererConfig {
        return {
            layout: conf_comp?.layout ?? 'vertical',
            showLabels: conf_comp?.showLabels ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-dynamic-field-renderer';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        this.fieldComponents.clear();

        this.data.fields.forEach(field => {
            const fieldElement = this.createField(field);
            this.wrapperElement!.appendChild(fieldElement);
        });

        this.container.appendChild(this.wrapperElement);
    }

    private createField(field: CustomField): HTMLElement {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'xwui-dynamic-field-renderer-field';
        fieldContainer.setAttribute('data-field-id', field.id);

        // Label
        if (this.config.showLabels) {
            const labelContainer = document.createElement('div');
            const label = new XWUILabel(labelContainer, {
                text: field.label,
                required: field.required
            });
            this.registerChildComponent(label);
            fieldContainer.appendChild(labelContainer);
        }

        // Field component
        const componentContainer = document.createElement('div');
        componentContainer.className = 'xwui-dynamic-field-renderer-component';

        const component = this.createFieldComponent(field, componentContainer);
        this.fieldComponents.set(field.id, component);

        // Error message
        const errorContainer = document.createElement('div');
        errorContainer.className = 'xwui-dynamic-field-renderer-error';
        errorContainer.style.display = 'none';

        fieldContainer.appendChild(componentContainer);
        fieldContainer.appendChild(errorContainer);

        return fieldContainer;
    }

    private createFieldComponent(field: CustomField, container: HTMLElement): any {
        const value = this.data.values?.[field.id] ?? field.defaultValue;

        switch (field.type) {
            case 'text':
            case 'email':
            case 'url':
                return this.createTextInput(container, field, value);
            
            case 'textarea':
                return this.createTextarea(container, field, value);
            
            case 'number':
                return this.createNumberInput(container, field, value);
            
            case 'date':
                return this.createDatePicker(container, field, value);
            
            case 'select':
                return this.createSelect(container, field, value);
            
            case 'multiselect':
                return this.createMultiSelect(container, field, value);
            
            case 'checkbox':
                return this.createCheckbox(container, field, value);
            
            case 'switch':
                return this.createSwitch(container, field, value);
            
            default:
                return this.createTextInput(container, field, value);
        }
    }

    private createTextInput(container: HTMLElement, field: CustomField, value: any): any {
        const input = new XWUIInput(container, {
            placeholder: field.placeholder,
            value: value || ''
        });
        this.registerChildComponent(input);

        input.getElement()?.setAttribute('name', field.name);
        input.getElement()?.setAttribute('type', field.type);

        input.getElement()?.addEventListener('change', () => {
            const newValue = input.getElement()?.value;
            this.handleFieldChange(field, newValue);
        });

        return input;
    }

    private createTextarea(container: HTMLElement, field: CustomField, value: any): any {
        const textarea = new XWUITextarea(container, {
            placeholder: field.placeholder,
            value: value || ''
        });
        this.registerChildComponent(textarea);

        textarea.getElement()?.setAttribute('name', field.name);

        textarea.getElement()?.addEventListener('change', () => {
            const newValue = textarea.getElement()?.value;
            this.handleFieldChange(field, newValue);
        });

        return textarea;
    }

    private createNumberInput(container: HTMLElement, field: CustomField, value: any): any {
        const numberInput = new XWUIInputNumber(container, {
            value: value || 0,
            min: field.min,
            max: field.max
        });
        this.registerChildComponent(numberInput);

        numberInput.getElement()?.setAttribute('name', field.name);

        numberInput.getElement()?.addEventListener('change', () => {
            const newValue = numberInput.getValue();
            this.handleFieldChange(field, newValue);
        });

        return numberInput;
    }

    private createDatePicker(container: HTMLElement, field: CustomField, value: any): any {
        const datePicker = new XWUIDatePicker(container, {
            value: value ? new Date(value) : undefined
        });
        this.registerChildComponent(datePicker);

        datePicker.getElement()?.setAttribute('name', field.name);

        datePicker.getElement()?.addEventListener('change', () => {
            const newValue = datePicker.getValue();
            this.handleFieldChange(field, newValue);
        });

        return datePicker;
    }

    private createSelect(container: HTMLElement, field: CustomField, value: any): any {
        const select = new XWUISelect(container, {
            options: field.options || [],
            value: value
        });
        this.registerChildComponent(select);

        select.getElement()?.setAttribute('name', field.name);

        select.getElement()?.addEventListener('change', () => {
            const newValue = select.getValue();
            this.handleFieldChange(field, newValue);
        });

        return select;
    }

    private createMultiSelect(container: HTMLElement, field: CustomField, value: any): any {
        const multiSelect = new XWUIMultiSelect(container, {
            options: field.options || [],
            value: Array.isArray(value) ? value : []
        });
        this.registerChildComponent(multiSelect);

        multiSelect.getElement()?.setAttribute('name', field.name);

        multiSelect.getElement()?.addEventListener('change', () => {
            const newValue = multiSelect.getValue();
            this.handleFieldChange(field, newValue);
        });

        return multiSelect;
    }

    private createCheckbox(container: HTMLElement, field: CustomField, value: any): any {
        const checkbox = new XWUICheckbox(container, {
            checked: value || false,
            label: field.label
        });
        this.registerChildComponent(checkbox);

        checkbox.getElement()?.setAttribute('name', field.name);

        checkbox.getElement()?.addEventListener('change', () => {
            const newValue = checkbox.isChecked();
            this.handleFieldChange(field, newValue);
        });

        return checkbox;
    }

    private createSwitch(container: HTMLElement, field: CustomField, value: any): any {
        const switchComponent = new XWUISwitch(container, {
            checked: value || false,
            label: field.label
        });
        this.registerChildComponent(switchComponent);

        switchComponent.getElement()?.setAttribute('name', field.name);

        switchComponent.getElement()?.addEventListener('change', () => {
            const newValue = switchComponent.isChecked();
            this.handleFieldChange(field, newValue);
        });

        return switchComponent;
    }

    private handleFieldChange(field: CustomField, value: any): void {
        // Validation
        if (field.validation) {
            const error = field.validation(value);
            if (error) {
                this.validationErrors.set(field.id, error);
                this.showError(field.id, error);
            } else {
                this.validationErrors.delete(field.id);
                this.hideError(field.id);
            }
        }

        // Update values
        if (!this.data.values) {
            this.data.values = {};
        }
        this.data.values[field.id] = value;

        // Notify change
        this.notifyChange(field.id, value);
    }

    private showError(fieldId: string, error: string): void {
        const fieldContainer = this.wrapperElement?.querySelector(`[data-field-id="${fieldId}"]`);
        const errorElement = fieldContainer?.querySelector('.xwui-dynamic-field-renderer-error');
        if (errorElement) {
            errorElement.textContent = error;
            errorElement.style.display = 'block';
        }
    }

    private hideError(fieldId: string): void {
        const fieldContainer = this.wrapperElement?.querySelector(`[data-field-id="${fieldId}"]`);
        const errorElement = fieldContainer?.querySelector('.xwui-dynamic-field-renderer-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    private notifyChange(fieldId: string, value: any): void {
        this.changeHandlers.forEach(handler => handler(fieldId, value));
    }

    public getValues(): Record<string, any> {
        return { ...(this.data.values || {}) };
    }

    public setValue(fieldId: string, value: any): void {
        if (!this.data.values) {
            this.data.values = {};
        }
        this.data.values[fieldId] = value;
        
        const component = this.fieldComponents.get(fieldId);
        if (component && typeof component.setValue === 'function') {
            component.setValue(value);
        }
    }

    public validate(): boolean {
        let isValid = true;
        
        this.data.fields.forEach(field => {
            const value = this.data.values?.[field.id];
            
            if (field.required && (value === undefined || value === null || value === '')) {
                this.showError(field.id, `${field.label} is required`);
                isValid = false;
            }
            
            if (field.validation && value !== undefined && value !== null && value !== '') {
                const error = field.validation(value);
                if (error) {
                    this.showError(field.id, error);
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    public onChange(handler: (fieldId: string, value: any) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // All registered child components (labels and field components) are automatically destroyed by base class
        this.fieldComponents.clear();
        
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.changeHandlers = [];
        this.validationErrors.clear();
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDynamicFieldRenderer as any).componentName = 'XWUIDynamicFieldRenderer';


