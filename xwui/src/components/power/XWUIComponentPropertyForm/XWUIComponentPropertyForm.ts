/**
 * XWUIComponentPropertyForm Component
 * Converts a JSON schema to an editable form using XWUIForm.
 * Automatically generates appropriate input components based on schema types.
 * Supports read and write modes.
 * Can read JSON schema from a file path or URL.
 */

import { XWUIComponent } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIForm, type XWUIFormData, type XWUIFormConfig } from '../XWUIForm/XWUIForm';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUITextarea } from '../XWUITextarea/XWUITextarea';
import { XWUISelect } from '../XWUISelect/XWUISelect';
import { XWUICheckbox } from '../XWUICheckbox/XWUICheckbox';
import { XWUIDatePicker } from '../XWUIDatePicker/XWUIDatePicker';
import { XWUITimePicker } from '../XWUITimePicker/XWUITimePicker';
import { XWUIInputNumber } from '../XWUIInputNumber/XWUIInputNumber';

// JSON Schema types
interface JSONSchema {
    type?: string | string[];
    properties?: Record<string, JSONSchema>;
    required?: string[];
    enum?: any[];
    default?: any;
    description?: string;
    title?: string;
    format?: string;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    items?: JSONSchema;
    additionalProperties?: boolean | JSONSchema;
}

// Component-level configuration
export interface XWUIComponentPropertyFormConfig {
    mode?: 'read' | 'write';
    layout?: 'vertical' | 'horizontal' | 'inline';
    labelWidth?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIComponentPropertyFormData {
    schema?: JSONSchema | string; // Can be object or path/URL to JSON file
    values?: Record<string, any>;
}

export class XWUIComponentPropertyForm extends XWUIComponent<XWUIComponentPropertyFormData, XWUIComponentPropertyFormConfig> {
    private formInstance: XWUIForm | null = null;
    private inputInstances: Map<string, XWUIComponent<any, any>> = new Map();
    private changeHandlers: Array<(values: Record<string, any>) => void> = [];
    private schemaObject: JSONSchema | null = null;
    private isLoading: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIComponentPropertyFormData = {},
        conf_comp: XWUIComponentPropertyFormConfig = {}
    ) {
        super(container, data, conf_comp);
        this.loadSchema();
    }

    protected createConfig(conf_comp?: XWUIComponentPropertyFormConfig): XWUIComponentPropertyFormConfig {
        return {
            mode: conf_comp?.mode ?? 'write',
            layout: conf_comp?.layout ?? 'vertical',
            labelWidth: conf_comp?.labelWidth,
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private async loadSchema(): Promise<void> {
        if (!this.data.schema) {
            this.setupDOM();
            return;
        }

        // If schema is a string, treat it as a path/URL
        if (typeof this.data.schema === 'string') {
            this.isLoading = true;
            try {
                const response = await fetch(this.data.schema);
                if (!response.ok) {
                    throw new Error(`Failed to load schema: ${response.statusText}`);
                }
                this.schemaObject = await response.json();
            } catch (error) {
                console.error('Error loading JSON schema:', error);
                // Try to parse as JSON string
                try {
                    this.schemaObject = JSON.parse(this.data.schema);
                } catch (parseError) {
                    console.error('Failed to parse schema as JSON:', parseError);
                    this.schemaObject = null;
                }
            } finally {
                this.isLoading = false;
                this.setupDOM();
            }
        } else {
            // Schema is already an object
            this.schemaObject = this.data.schema;
            this.setupDOM();
        }
    }

    private setupDOM(): void {
        this.container.innerHTML = '';

        if (this.isLoading) {
            const loadingDiv = document.createElement('div');
            loadingDiv.textContent = 'Loading schema...';
            loadingDiv.className = 'xwui-component-property-form-loading';
            this.container.appendChild(loadingDiv);
            return;
        }

        if (!this.schemaObject || !this.schemaObject.properties) {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'No schema provided or invalid schema';
            errorDiv.className = 'xwui-component-property-form-error';
            this.container.appendChild(errorDiv);
            return;
        }

        // Generate fields from schema
        const properties = this.schemaObject.properties;
        const required = this.schemaObject.required || [];
        const formFields: XWUIFormData['fields'] = [];

        // Create field components and collect them for XWUIForm
        Object.keys(properties).forEach(propertyName => {
            const propertySchema = properties[propertyName];
            const inputComponent = this.createInputComponent(
                propertyName,
                propertySchema,
                this.data.values?.[propertyName] ?? propertySchema.default,
                required.includes(propertyName)
            );
            
            if (inputComponent) {
                formFields.push({
                    name: propertyName,
                    label: propertySchema.title || propertyName,
                    required: required.includes(propertyName),
                    component: inputComponent.container
                });
            }
        });

        // Create form instance with fields
        const formContainer = document.createElement('div');
        this.container.appendChild(formContainer);

        const formData: XWUIFormData = {
            fields: formFields
        };

        const formConfig: XWUIFormConfig = {
            layout: this.config.layout,
            labelWidth: this.config.labelWidth,
            size: this.config.size,
            className: this.config.className
        };

        this.formInstance = new XWUIForm(formContainer, formData, formConfig);
        this.registerChildComponent(this.formInstance);
    }

    private createInputComponent(
        propertyName: string,
        propertySchema: JSONSchema,
        value: any,
        isRequired: boolean
    ): XWUIComponent<any, any> | null {
        const inputContainer = document.createElement('div');
        const schemaType = Array.isArray(propertySchema.type) 
            ? propertySchema.type[0] 
            : propertySchema.type || 'string';

        let inputInstance: XWUIComponent<any, any> | null = null;

        switch (schemaType) {
            case 'string':
                if (propertySchema.format === 'date') {
                    inputInstance = new XWUIDatePicker(
                        inputContainer,
                        { value: value ? new Date(value) : undefined, name: propertyName },
                        {
                            disabled: this.config.mode === 'read',
                            required: isRequired,
                            size: this.config.size
                        }
                    );
                } else if (propertySchema.format === 'time') {
                    inputInstance = new XWUITimePicker(
                        inputContainer,
                        { value: value, name: propertyName },
                        {
                            disabled: this.config.mode === 'read',
                            required: isRequired,
                            size: this.config.size
                        }
                    );
                } else if (propertySchema.enum) {
                    // Enum -> Select
                    const options = propertySchema.enum.map((enumValue: any) => ({
                        value: String(enumValue),
                        label: String(enumValue)
                    }));
                    inputInstance = new XWUISelect(
                        inputContainer,
                        {
                            options,
                            value: value !== undefined ? String(value) : undefined,
                            name: propertyName
                        },
                        {
                            disabled: this.config.mode === 'read',
                            required: isRequired,
                            size: this.config.size
                        }
                    );
                } else if (propertySchema.maxLength && propertySchema.maxLength > 100) {
                    // Long string -> Textarea
                    inputInstance = new XWUITextarea(
                        inputContainer,
                        {
                            value: value !== undefined ? String(value) : '',
                            placeholder: propertySchema.description,
                            name: propertyName,
                            maxLength: propertySchema.maxLength,
                            rows: propertySchema.minLength ? Math.max(3, Math.ceil(propertySchema.minLength / 50)) : 3
                        },
                        {
                            disabled: this.config.mode === 'read',
                            readonly: this.config.mode === 'read',
                            required: isRequired,
                            size: this.config.size
                        }
                    );
                } else {
                    // Regular string -> Input
                    let inputType: 'text' | 'email' | 'password' | 'url' | 'tel' = 'text';
                    if (propertySchema.format === 'email') inputType = 'email';
                    else if (propertySchema.format === 'uri' || propertySchema.format === 'url') inputType = 'url';
                    else if (propertySchema.format === 'tel' || propertySchema.format === 'phone') inputType = 'tel';

                    inputInstance = new XWUIInput(
                        inputContainer,
                        {
                            value: value !== undefined ? String(value) : '',
                            placeholder: propertySchema.description,
                            name: propertyName,
                            maxLength: propertySchema.maxLength,
                            pattern: propertySchema.pattern
                        },
                        {
                            type: inputType,
                            disabled: this.config.mode === 'read',
                            readonly: this.config.mode === 'read',
                            required: isRequired,
                            size: this.config.size
                        }
                    );
                }
                break;

            case 'number':
            case 'integer':
                inputInstance = new XWUIInputNumber(
                    inputContainer,
                    {
                        value: value !== undefined ? Number(value) : undefined,
                        name: propertyName,
                        min: propertySchema.minimum,
                        max: propertySchema.maximum
                    },
                    {
                        disabled: this.config.mode === 'read',
                        readonly: this.config.mode === 'read',
                        required: isRequired,
                        size: this.config.size
                    }
                );
                break;

            case 'boolean':
                inputInstance = new XWUICheckbox(
                    inputContainer,
                    {
                        checked: value !== undefined ? Boolean(value) : false,
                        label: propertySchema.title || propertyName,
                        name: propertyName
                    },
                    {
                        disabled: this.config.mode === 'read',
                        size: this.config.size
                    }
                );
                break;

            case 'array':
                // For arrays, create a simple textarea for JSON input
                inputInstance = new XWUITextarea(
                    inputContainer,
                    {
                        value: value !== undefined ? JSON.stringify(value, null, 2) : '',
                        placeholder: 'Enter JSON array',
                        name: propertyName
                    },
                    {
                        disabled: this.config.mode === 'read',
                        readonly: this.config.mode === 'read',
                        required: isRequired,
                        size: this.config.size
                    }
                );
                break;

            case 'object':
                // For objects, create a textarea for JSON input
                inputInstance = new XWUITextarea(
                    inputContainer,
                    {
                        value: value !== undefined ? JSON.stringify(value, null, 2) : '',
                        placeholder: 'Enter JSON object',
                        name: propertyName
                    },
                    {
                        disabled: this.config.mode === 'read',
                        readonly: this.config.mode === 'read',
                        required: isRequired,
                        size: this.config.size
                    }
                );
                break;

            default:
                // Fallback to text input
                inputInstance = new XWUIInput(
                    inputContainer,
                    {
                        value: value !== undefined ? String(value) : '',
                        placeholder: propertySchema.description,
                        name: propertyName
                    },
                    {
                        disabled: this.config.mode === 'read',
                        readonly: this.config.mode === 'read',
                        required: isRequired,
                        size: this.config.size
                    }
                );
        }

        if (inputInstance) {
            this.registerChildComponent(inputInstance);
            this.inputInstances.set(propertyName, inputInstance);

            // Add change handler to track value changes
            this.setupInputChangeHandler(propertyName, inputInstance, propertySchema);
        }

        return inputInstance;
    }

    private setupInputChangeHandler(
        propertyName: string,
        inputInstance: XWUIComponent<any, any>,
        propertySchema: JSONSchema
    ): void {
        // Handle different input types
        if (inputInstance instanceof XWUIInput) {
            inputInstance.onChange((value: string, event: Event) => {
                this.handleValueChange(propertyName, value, propertySchema);
            });
        } else if (inputInstance instanceof XWUITextarea) {
            inputInstance.onChange((value: string, event: Event) => {
                let parsedValue: any = value;
                if (propertySchema.type === 'array' || propertySchema.type === 'object') {
                    try {
                        parsedValue = JSON.parse(value);
                    } catch (e) {
                        // Invalid JSON, keep as string
                    }
                }
                this.handleValueChange(propertyName, parsedValue, propertySchema);
            });
        } else if (inputInstance instanceof XWUISelect) {
            inputInstance.onChange((value: string | string[], event: Event) => {
                this.handleValueChange(propertyName, value, propertySchema);
            });
        } else if (inputInstance instanceof XWUICheckbox) {
            inputInstance.onChange((checked: boolean, event: Event) => {
                this.handleValueChange(propertyName, checked, propertySchema);
            });
        } else if (inputInstance instanceof XWUIDatePicker) {
            // XWUIDatePicker doesn't have onChange, so we'll listen to input changes
            // For now, we'll handle it via the input's onChange if available
            const pickerElement = inputInstance.container;
            const inputElement = pickerElement?.querySelector('input');
            if (inputElement) {
                inputElement.addEventListener('change', () => {
                    const dateValue = inputElement.value;
                    if (dateValue) {
                        try {
                            const date = new Date(dateValue);
                            this.handleValueChange(propertyName, date.toISOString(), propertySchema);
                        } catch (e) {
                            this.handleValueChange(propertyName, dateValue, propertySchema);
                        }
                    }
                });
            }
        } else if (inputInstance instanceof XWUITimePicker) {
            inputInstance.onChange((time: string) => {
                this.handleValueChange(propertyName, time, propertySchema);
            });
        } else if (inputInstance instanceof XWUIInputNumber) {
            inputInstance.onChange((value: number, event: Event) => {
                this.handleValueChange(propertyName, value, propertySchema);
            });
        }
    }

    private handleValueChange(propertyName: string, value: any, propertySchema: JSONSchema): void {
        if (!this.data.values) {
            this.data.values = {};
        }
        this.data.values[propertyName] = value;

        // Notify change handlers
        this.changeHandlers.forEach(handler => {
            handler(this.data.values || {});
        });
    }

    public getValues(): Record<string, any> {
        return this.data.values || {};
    }

    public setValues(values: Record<string, any>): void {
        this.data.values = { ...values };
        // Re-render to update inputs
        this.setupDOM();
    }

    public setSchema(schema: JSONSchema | string): void {
        this.data.schema = schema;
        this.loadSchema();
    }

    public validate(): boolean {
        if (!this.formInstance) return false;
        return this.formInstance.validate();
    }

    public onChange(handler: (values: Record<string, any>) => void): void {
        this.changeHandlers.push(handler);
    }

    public destroy(): void {
        // Clear handlers
        this.changeHandlers = [];
        
        // Clear maps
        this.inputInstances.clear();
        
        // Clear references
        this.formInstance = null;
        this.schemaObject = null;
        
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIComponentPropertyForm as any).componentName = 'XWUIComponentPropertyForm';


