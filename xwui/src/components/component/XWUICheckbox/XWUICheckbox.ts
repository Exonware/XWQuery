/**
 * XWUICheckbox Component
 * Checkbox input with label support and indeterminate state
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUICheckboxConfig {
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    indeterminate?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'error';
    className?: string;
}

// Data type
export interface XWUICheckboxData {
    checked?: boolean;
    label?: string;
    description?: string;
    name?: string;
    id?: string;
    value?: string;
}

export class XWUICheckbox extends XWUIComponent<XWUICheckboxData, XWUICheckboxConfig> {
    private wrapperElement: HTMLElement | null = null;
    private inputElement: HTMLInputElement | null = null;
    private changeHandlers: Array<(checked: boolean, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUICheckboxData = {},
        conf_comp: XWUICheckboxConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICheckboxConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICheckboxConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            disabled: conf_comp?.disabled ?? false,
            indeterminate: conf_comp?.indeterminate ?? false,
            color: conf_comp?.color ?? 'primary',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Create wrapper
        this.wrapperElement = document.createElement('label');
        this.wrapperElement.className = 'xwui-checkbox';
        this.wrapperElement.classList.add(`xwui-checkbox-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-checkbox-${this.config.color}`);
        
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-checkbox-disabled');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Hidden input
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'checkbox';
        this.inputElement.className = 'xwui-checkbox-input';
        this.inputElement.checked = this.data.checked || false;
        this.inputElement.disabled = this.config.disabled || false;
        this.inputElement.indeterminate = this.config.indeterminate || false;
        
        if (this.data.name) this.inputElement.name = this.data.name;
        if (this.data.id) this.inputElement.id = this.data.id;
        if (this.data.value) this.inputElement.value = this.data.value;

        this.inputElement.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            this.data.checked = checked;
            this.config.indeterminate = false;
            this.inputElement!.indeterminate = false;
            this.changeHandlers.forEach(handler => handler(checked, e));
        });

        this.wrapperElement.appendChild(this.inputElement);

        // Custom checkbox visual
        const checkboxVisual = document.createElement('span');
        checkboxVisual.className = 'xwui-checkbox-visual';
        
        // Check icon
        const checkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkIcon.setAttribute('viewBox', '0 0 24 24');
        checkIcon.setAttribute('fill', 'none');
        checkIcon.setAttribute('stroke', 'currentColor');
        checkIcon.setAttribute('stroke-width', '3');
        checkIcon.classList.add('xwui-checkbox-icon', 'xwui-checkbox-icon-check');
        checkIcon.innerHTML = '<path d="M20 6 9 17l-5-5"/>';
        checkboxVisual.appendChild(checkIcon);
        
        // Indeterminate icon
        const indeterminateIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        indeterminateIcon.setAttribute('viewBox', '0 0 24 24');
        indeterminateIcon.setAttribute('fill', 'none');
        indeterminateIcon.setAttribute('stroke', 'currentColor');
        indeterminateIcon.setAttribute('stroke-width', '3');
        indeterminateIcon.classList.add('xwui-checkbox-icon', 'xwui-checkbox-icon-indeterminate');
        indeterminateIcon.innerHTML = '<path d="M5 12h14"/>';
        checkboxVisual.appendChild(indeterminateIcon);

        this.wrapperElement.appendChild(checkboxVisual);

        // Label and description
        if (this.data.label || this.data.description) {
            const textWrapper = document.createElement('span');
            textWrapper.className = 'xwui-checkbox-text';

            if (this.data.label) {
                const labelSpan = document.createElement('span');
                labelSpan.className = 'xwui-checkbox-label';
                labelSpan.textContent = this.data.label;
                textWrapper.appendChild(labelSpan);
            }

            if (this.data.description) {
                const descSpan = document.createElement('span');
                descSpan.className = 'xwui-checkbox-description';
                descSpan.textContent = this.data.description;
                textWrapper.appendChild(descSpan);
            }

            this.wrapperElement.appendChild(textWrapper);
        }

        this.container.appendChild(this.wrapperElement);
    }

    public isChecked(): boolean {
        return this.inputElement?.checked || false;
    }

    public setChecked(checked: boolean): void {
        this.data.checked = checked;
        if (this.inputElement) {
            this.inputElement.checked = checked;
            this.inputElement.indeterminate = false;
            this.config.indeterminate = false;
        }
    }

    public toggle(): void {
        this.setChecked(!this.isChecked());
        this.changeHandlers.forEach(handler => handler(this.isChecked(), new Event('toggle')));
    }

    public setIndeterminate(indeterminate: boolean): void {
        this.config.indeterminate = indeterminate;
        if (this.inputElement) {
            this.inputElement.indeterminate = indeterminate;
        }
    }

    public isIndeterminate(): boolean {
        return this.inputElement?.indeterminate || false;
    }

    public setDisabled(disabled: boolean): void {
        this.config.disabled = disabled;
        if (this.inputElement) {
            this.inputElement.disabled = disabled;
        }
        if (this.wrapperElement) {
            if (disabled) {
                this.wrapperElement.classList.add('xwui-checkbox-disabled');
            } else {
                this.wrapperElement.classList.remove('xwui-checkbox-disabled');
            }
        }
    }

    public onChange(handler: (checked: boolean, event: Event) => void): void {
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
            this.inputElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICheckbox as any).componentName = 'XWUICheckbox';


