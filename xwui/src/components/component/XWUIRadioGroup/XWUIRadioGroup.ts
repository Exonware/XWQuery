/**
 * XWUIRadioGroup Component
 * Radio button group with horizontal/vertical layouts
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIRadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

// Component-level configuration
export interface XWUIRadioGroupConfig {
    size?: 'small' | 'medium' | 'large';
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'error';
    className?: string;
}

// Data type
export interface XWUIRadioGroupData {
    options: XWUIRadioOption[];
    value?: string;
    name?: string;
    label?: string;
}

export class XWUIRadioGroup extends XWUIComponent<XWUIRadioGroupData, XWUIRadioGroupConfig> {
    private wrapperElement: HTMLElement | null = null;
    private changeHandlers: Array<(value: string, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIRadioGroupData,
        conf_comp: XWUIRadioGroupConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIRadioGroupConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIRadioGroupConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            orientation: conf_comp?.orientation ?? 'vertical',
            disabled: conf_comp?.disabled ?? false,
            color: conf_comp?.color ?? 'primary',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-radio-group';
        this.wrapperElement.classList.add(`xwui-radio-group-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-radio-group-${this.config.orientation}`);
        this.wrapperElement.classList.add(`xwui-radio-group-${this.config.color}`);
        this.wrapperElement.setAttribute('role', 'radiogroup');
        
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-radio-group-disabled');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Group label
        if (this.data.label) {
            const labelElement = document.createElement('div');
            labelElement.className = 'xwui-radio-group-label';
            labelElement.textContent = this.data.label;
            this.wrapperElement.appendChild(labelElement);
        }

        // Options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'xwui-radio-options';

        const groupName = this.data.name || `radio-group-${Date.now()}`;

        // Render each option
        this.data.options.forEach((option, index) => {
            const optionElement = this.createRadioOption(option, groupName, index);
            optionsContainer.appendChild(optionElement);
        });

        this.wrapperElement.appendChild(optionsContainer);
        this.container.appendChild(this.wrapperElement);
    }

    private createRadioOption(option: XWUIRadioOption, groupName: string, index: number): HTMLElement {
        const isDisabled = this.config.disabled || option.disabled;
        const isChecked = this.data.value === option.value;

        const label = document.createElement('label');
        label.className = 'xwui-radio';
        if (isDisabled) {
            label.classList.add('xwui-radio-disabled');
        }

        // Hidden input
        const input = document.createElement('input');
        input.type = 'radio';
        input.className = 'xwui-radio-input';
        input.name = groupName;
        input.value = option.value;
        input.checked = isChecked;
        input.disabled = isDisabled || false;
        input.id = `${groupName}-${index}`;

        input.addEventListener('change', (e) => {
            const value = (e.target as HTMLInputElement).value;
            this.data.value = value;
            this.changeHandlers.forEach(handler => handler(value, e));
        });

        label.appendChild(input);

        // Custom radio visual
        const radioVisual = document.createElement('span');
        radioVisual.className = 'xwui-radio-visual';
        
        const radioDot = document.createElement('span');
        radioDot.className = 'xwui-radio-dot';
        radioVisual.appendChild(radioDot);

        label.appendChild(radioVisual);

        // Label and description
        if (option.label || option.description) {
            const textWrapper = document.createElement('span');
            textWrapper.className = 'xwui-radio-text';

            if (option.label) {
                const labelSpan = document.createElement('span');
                labelSpan.className = 'xwui-radio-label';
                labelSpan.textContent = option.label;
                textWrapper.appendChild(labelSpan);
            }

            if (option.description) {
                const descSpan = document.createElement('span');
                descSpan.className = 'xwui-radio-description';
                descSpan.textContent = option.description;
                textWrapper.appendChild(descSpan);
            }

            label.appendChild(textWrapper);
        }

        return label;
    }

    public getValue(): string | undefined {
        return this.data.value;
    }

    public setValue(value: string): void {
        this.data.value = value;
        const inputs = this.wrapperElement?.querySelectorAll<HTMLInputElement>('.xwui-radio-input');
        inputs?.forEach(input => {
            input.checked = input.value === value;
        });
    }

    public setDisabled(disabled: boolean): void {
        this.config.disabled = disabled;
        this.render();
    }

    public onChange(handler: (value: string, event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIRadioGroup as any).componentName = 'XWUIRadioGroup';


