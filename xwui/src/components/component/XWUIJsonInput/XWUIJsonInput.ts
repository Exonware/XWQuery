/**
 * XWUIInputJson Component
 * JSON input with validation
 * Extends XWUITextarea with JSON validation
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUITextarea } from '../XWUITextarea/XWUITextarea';

export interface XWUIInputJsonConfig {
    minRows?: number;
    maxRows?: number;
    formatOnBlur?: boolean;
    validateOnBlur?: boolean;
    className?: string;
}

export interface XWUIInputJsonData {
    value?: string | object;
}

export class XWUIInputJson extends XWUIComponent<XWUIInputJsonData, XWUIInputJsonConfig> {
    private textareaInstance: XWUITextarea | null = null;
    private errorElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIInputJsonData = {},
        conf_comp: XWUIInputJsonConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputJsonConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputJsonConfig {
        return {
            minRows: conf_comp?.minRows ?? 4,
            maxRows: conf_comp?.maxRows,
            formatOnBlur: conf_comp?.formatOnBlur ?? false,
            validateOnBlur: conf_comp?.validateOnBlur ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-json-input-container';

        // Convert object to JSON string if needed
        const jsonString = typeof this.data.value === 'object' && this.data.value !== null
            ? JSON.stringify(this.data.value, null, 2)
            : (this.data.value || '');

        // Error display
        this.errorElement = document.createElement('div');
        this.errorElement.className = 'xwui-json-input-error';
        this.errorElement.style.display = 'none';
        this.container.appendChild(this.errorElement);

        // Create textarea
        const textareaContainer = document.createElement('div');
        this.textareaInstance = new XWUITextarea(textareaContainer, {
            value: jsonString,
            placeholder: 'Enter JSON...'
        }, {
            minRows: this.config.minRows,
            maxRows: this.config.maxRows,
            autoResize: true
        });
        this.registerChildComponent(this.textareaInstance);

        // Add validation
        const textareaEl = textareaContainer.querySelector('textarea');
        if (textareaEl) {
            textareaEl.classList.add('xwui-json-input-textarea');
            textareaEl.style.fontFamily = 'monospace';
            
            if (this.config.validateOnBlur) {
                textareaEl.addEventListener('blur', () => {
                    this.validateAndFormat();
                });
            }
            
            textareaEl.addEventListener('input', () => {
                this.clearError();
            });
        }

        this.container.appendChild(textareaContainer);
    }

    private validateAndFormat(): void {
        if (!this.textareaInstance) return;
        
        const textareaEl = this.container.querySelector('textarea');
        if (!textareaEl) return;

        const value = textareaEl.value.trim();
        
        if (!value) {
            this.clearError();
            return;
        }

        try {
            const parsed = JSON.parse(value);
            
            // Format if enabled
            if (this.config.formatOnBlur) {
                const formatted = JSON.stringify(parsed, null, 2);
                textareaEl.value = formatted;
                this.data.value = parsed;
            } else {
                this.data.value = parsed;
            }
            
            this.clearError();
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Invalid JSON');
        }
    }

    private showError(message: string): void {
        if (!this.errorElement) return;
        
        this.errorElement.textContent = `Error: ${message}`;
        this.errorElement.style.display = 'block';
        
        const textareaEl = this.container.querySelector('textarea');
        if (textareaEl) {
            textareaEl.classList.add('xwui-json-input-error-state');
        }
    }

    private clearError(): void {
        if (!this.errorElement) return;
        
        this.errorElement.style.display = 'none';
        
        const textareaEl = this.container.querySelector('textarea');
        if (textareaEl) {
            textareaEl.classList.remove('xwui-json-input-error-state');
        }
    }

    public getValue(): object | undefined {
        try {
            const textareaEl = this.container.querySelector('textarea');
            if (!textareaEl) return undefined;
            
            const value = textareaEl.value.trim();
            return value ? JSON.parse(value) : undefined;
        } catch {
            return undefined;
        }
    }

    public destroy(): void {
        // Child component (textareaInstance) is automatically destroyed by base class
        this.textareaInstance = null;
        this.errorElement = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIInputJson as any).componentName = 'XWUIInputJson';


