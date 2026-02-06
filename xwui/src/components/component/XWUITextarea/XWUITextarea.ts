/**
 * XWUITextarea Component
 * Multi-line text input with auto-resize option
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITextareaConfig {
    size?: 'small' | 'medium' | 'large';
    variant?: 'outlined' | 'filled';
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    error?: boolean;
    fullWidth?: boolean;
    autoResize?: boolean;
    minRows?: number;
    maxRows?: number;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    className?: string;
}

// Data type
export interface XWUITextareaData {
    value?: string;
    placeholder?: string;
    label?: string;
    helperText?: string;
    errorText?: string;
    name?: string;
    id?: string;
    maxLength?: number;
    rows?: number;
}

export class XWUITextarea extends XWUIComponent<XWUITextareaData, XWUITextareaConfig> {
    private wrapperElement: HTMLElement | null = null;
    private textareaElement: HTMLTextAreaElement | null = null;
    private changeHandlers: Array<(value: string, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUITextareaData = {},
        conf_comp: XWUITextareaConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITextareaConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITextareaConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            variant: conf_comp?.variant ?? 'outlined',
            disabled: conf_comp?.disabled ?? false,
            readonly: conf_comp?.readonly ?? false,
            required: conf_comp?.required ?? false,
            error: conf_comp?.error ?? false,
            fullWidth: conf_comp?.fullWidth ?? false,
            autoResize: conf_comp?.autoResize ?? false,
            minRows: conf_comp?.minRows ?? 3,
            maxRows: conf_comp?.maxRows,
            resize: conf_comp?.resize ?? 'vertical',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-textarea-wrapper';
        this.wrapperElement.classList.add(`xwui-textarea-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-textarea-${this.config.variant}`);
        
        if (this.config.fullWidth) {
            this.wrapperElement.classList.add('xwui-textarea-full-width');
        }
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-textarea-disabled');
        }
        if (this.config.error) {
            this.wrapperElement.classList.add('xwui-textarea-error');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Label
        if (this.data.label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'xwui-textarea-label';
            labelElement.textContent = this.data.label;
            if (this.config.required) {
                const asterisk = document.createElement('span');
                asterisk.className = 'xwui-textarea-required';
                asterisk.textContent = ' *';
                labelElement.appendChild(asterisk);
            }
            if (this.data.id) {
                labelElement.setAttribute('for', this.data.id);
            }
            this.wrapperElement.appendChild(labelElement);
        }

        // Textarea element
        this.textareaElement = document.createElement('textarea');
        this.textareaElement.className = 'xwui-textarea';
        
        if (this.data.value !== undefined) this.textareaElement.value = this.data.value;
        if (this.data.placeholder) this.textareaElement.placeholder = this.data.placeholder;
        if (this.data.name) this.textareaElement.name = this.data.name;
        if (this.data.id) this.textareaElement.id = this.data.id;
        if (this.data.maxLength !== undefined) this.textareaElement.maxLength = this.data.maxLength;
        this.textareaElement.rows = this.data.rows || this.config.minRows || 3;
        
        this.textareaElement.disabled = this.config.disabled || false;
        this.textareaElement.readOnly = this.config.readonly || false;
        this.textareaElement.required = this.config.required || false;

        // Resize behavior
        if (this.config.autoResize) {
            this.textareaElement.style.resize = 'none';
            this.textareaElement.style.overflow = 'hidden';
        } else {
            this.textareaElement.style.resize = this.config.resize || 'vertical';
        }

        // Event listeners
        this.textareaElement.addEventListener('input', (e) => {
            const value = (e.target as HTMLTextAreaElement).value;
            this.data.value = value;
            this.changeHandlers.forEach(handler => handler(value, e));
            if (this.config.autoResize) {
                this.adjustHeight();
            }
        });

        this.textareaElement.addEventListener('focus', () => {
            this.wrapperElement?.classList.add('xwui-textarea-focused');
        });

        this.textareaElement.addEventListener('blur', () => {
            this.wrapperElement?.classList.remove('xwui-textarea-focused');
        });

        this.wrapperElement.appendChild(this.textareaElement);

        // Character count and helper
        const footerElement = document.createElement('div');
        footerElement.className = 'xwui-textarea-footer';

        // Helper text
        const helperText = this.config.error && this.data.errorText ? this.data.errorText : this.data.helperText;
        if (helperText) {
            const helperElement = document.createElement('span');
            helperElement.className = 'xwui-textarea-helper';
            if (this.config.error) {
                helperElement.classList.add('xwui-textarea-helper-error');
            }
            helperElement.textContent = helperText;
            footerElement.appendChild(helperElement);
        }

        // Character count
        if (this.data.maxLength) {
            const countElement = document.createElement('span');
            countElement.className = 'xwui-textarea-count';
            countElement.textContent = `${(this.data.value || '').length}/${this.data.maxLength}`;
            footerElement.appendChild(countElement);

            this.textareaElement.addEventListener('input', () => {
                countElement.textContent = `${this.textareaElement!.value.length}/${this.data.maxLength}`;
            });
        }

        if (footerElement.children.length > 0) {
            this.wrapperElement.appendChild(footerElement);
        }

        this.container.appendChild(this.wrapperElement);

        // Initial height adjustment for auto-resize
        if (this.config.autoResize && this.data.value) {
            setTimeout(() => this.adjustHeight(), 0);
        }
    }

    private adjustHeight(): void {
        if (!this.textareaElement) return;

        this.textareaElement.style.height = 'auto';
        const scrollHeight = this.textareaElement.scrollHeight;
        
        // Calculate min and max heights based on rows
        const lineHeight = parseInt(getComputedStyle(this.textareaElement).lineHeight) || 20;
        const padding = parseInt(getComputedStyle(this.textareaElement).paddingTop) + 
                       parseInt(getComputedStyle(this.textareaElement).paddingBottom);
        
        const minHeight = (this.config.minRows || 3) * lineHeight + padding;
        const maxHeight = this.config.maxRows ? this.config.maxRows * lineHeight + padding : Infinity;
        
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
        this.textareaElement.style.height = `${newHeight}px`;
        
        if (scrollHeight > maxHeight) {
            this.textareaElement.style.overflow = 'auto';
        } else {
            this.textareaElement.style.overflow = 'hidden';
        }
    }

    public getValue(): string {
        return this.textareaElement?.value || '';
    }

    public setValue(value: string): void {
        this.data.value = value;
        if (this.textareaElement) {
            this.textareaElement.value = value;
            if (this.config.autoResize) {
                this.adjustHeight();
            }
        }
    }

    public focus(): void {
        this.textareaElement?.focus();
    }

    public blur(): void {
        this.textareaElement?.blur();
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
        if (this.textareaElement) {
            this.textareaElement.disabled = disabled;
        }
        if (this.wrapperElement) {
            if (disabled) {
                this.wrapperElement.classList.add('xwui-textarea-disabled');
            } else {
                this.wrapperElement.classList.remove('xwui-textarea-disabled');
            }
        }
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
            this.textareaElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITextarea as any).componentName = 'XWUITextarea';


