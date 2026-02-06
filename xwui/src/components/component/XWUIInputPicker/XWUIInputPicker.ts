/**
 * XWUIInputPicker Base Component
 * Base composition component that combines XWUIInput with a picker
 * Supports full view (inline) and minimized view (popup)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUIPicker } from '../XWUIPicker/XWUIPicker';
import { createIcon } from '../XWUIIcon/icon-utils';

export interface XWUIInputPickerConfig {
    view?: 'full' | 'minimized'; // 'full' = inline picker, 'minimized' = popup picker
    showIcon?: boolean;
    iconName?: string;
    placeholder?: string;
    readonly?: boolean;
    clearable?: boolean;
    className?: string;
}

export interface XWUIInputPickerData {
    value?: any; // Type to be specified by child classes
}

/**
 * Base class for input picker components
 * Combines XWUIInput with a picker component
 */
export abstract class XWUIInputPicker<
    TData extends XWUIInputPickerData = XWUIInputPickerData,
    TConfig extends XWUIInputPickerConfig = XWUIInputPickerConfig,
    TPicker extends XWUIPicker<any, any> = XWUIPicker<any, any>
> extends XWUIComponent<TData, TConfig> {
    protected wrapperElement: HTMLElement | null = null;
    protected inputInstance: XWUIInput | null = null;
    protected pickerInstance: TPicker | null = null;
    protected inputContainer: HTMLElement | null = null;
    protected pickerContainer: HTMLElement | null = null;
    protected iconButton: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: TData = {} as TData,
        conf_comp: TConfig = {} as TConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: TConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): TConfig {
        return {
            view: conf_comp?.view ?? 'minimized',
            showIcon: conf_comp?.showIcon ?? true,
            iconName: conf_comp?.iconName ?? 'calendar',
            placeholder: conf_comp?.placeholder,
            readonly: conf_comp?.readonly ?? true,
            clearable: conf_comp?.clearable ?? true,
            className: conf_comp?.className,
            ...conf_comp
        } as TConfig;
    }

    /**
     * Render the input picker component
     */
    protected render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-input-picker-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-input-picker';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(...this.config.className.split(' '));
        }

        // Input wrapper
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'xwui-input-picker-input-wrapper';

        // Input container
        this.inputContainer = document.createElement('div');
        
        const displayValue = this.formatValueForDisplay(this.data.value);
        
        this.inputInstance = new XWUIInput(
            this.inputContainer,
            {
                value: displayValue,
                placeholder: this.config.placeholder
            },
            {
                type: 'text',
                readonly: this.config.readonly,
                clearable: this.config.clearable
            },
            this.conf_sys,
            this.conf_usr
        );

        this.registerChildComponent(this.inputInstance);

        // Handle input click/focus to open picker (if minimized)
        const inputEl = this.inputContainer.querySelector('input');
        if (inputEl) {
            if (this.config.view === 'minimized') {
                inputEl.addEventListener('click', () => this.openPicker(inputEl));
                inputEl.addEventListener('focus', () => this.openPicker(inputEl));
            }
        }

        // Handle clear button
        if (this.config.clearable) {
            const clearButton = this.inputContainer.querySelector('.xwui-input-clear');
            if (clearButton) {
                clearButton.addEventListener('click', () => {
                    this.setValue(undefined);
                });
            }
        }

        inputWrapper.appendChild(this.inputContainer);

        // Icon button
        if (this.config.showIcon) {
            this.iconButton = document.createElement('button');
            this.iconButton.type = 'button';
            this.iconButton.className = 'xwui-input-picker-icon';
            this.iconButton.setAttribute('aria-label', 'Open picker');
            
            const { container: iconContainer } = createIcon(
                this,
                this.config.iconName || 'calendar',
                { size: 20 },
                this.conf_sys,
                this.conf_usr
            );
            this.iconButton.appendChild(iconContainer);
            
            this.iconButton.addEventListener('click', () => {
                const triggerEl = this.iconButton || inputEl;
                if (this.config.view === 'minimized') {
                    this.togglePicker(triggerEl!);
                } else {
                    this.togglePicker(triggerEl!);
                }
            });
            
            inputWrapper.appendChild(this.iconButton);
        }

        this.wrapperElement.appendChild(inputWrapper);

        // Picker container
        this.pickerContainer = document.createElement('div');
        this.pickerContainer.className = 'xwui-input-picker-picker-container';

        // Create picker instance
        this.pickerInstance = this.createPicker(this.pickerContainer);
        this.registerChildComponent(this.pickerInstance as any);

        // Setup picker change handler
        this.setupPickerHandlers();

        // Add picker to wrapper or body based on view mode
        if (this.config.view === 'full') {
            // Full view: show picker inline (always visible)
            this.wrapperElement.appendChild(this.pickerContainer);
            // Picker is always visible in full mode, no need to open/close
        }
        // Minimized view: picker is attached to body by XWUIPicker (popup mode)

        this.container.appendChild(this.wrapperElement);
    }

    /**
     * Create picker instance - must be implemented by child classes
     */
    protected abstract createPicker(container: HTMLElement): TPicker;

    /**
     * Setup picker event handlers - must be implemented by child classes
     */
    protected abstract setupPickerHandlers(): void;

    /**
     * Format value for display in input - must be implemented by child classes
     */
    protected abstract formatValueForDisplay(value: any): string;

    /**
     * Parse input value to picker value - must be implemented by child classes
     */
    protected abstract parseInputValue(inputValue: string): any;

    /**
     * Update input value from picker value - must be implemented by child classes
     */
    protected abstract updateInputFromPicker(pickerValue: any): void;

    /**
     * Open picker
     */
    protected openPicker(triggerElement?: HTMLElement): void {
        if (this.pickerInstance) {
            const trigger = triggerElement || this.iconButton || this.inputContainer;
            this.pickerInstance.open(trigger || undefined);
        }
    }

    /**
     * Close picker
     */
    protected closePicker(): void {
        if (this.pickerInstance) {
            this.pickerInstance.close();
        }
    }

    /**
     * Toggle picker open/close
     */
    protected togglePicker(triggerElement?: HTMLElement): void {
        if (this.pickerInstance) {
            const trigger = triggerElement || this.iconButton || this.inputContainer;
            this.pickerInstance.toggle(trigger || undefined);
        }
    }

    /**
     * Set value
     */
    public setValue(value: any): void {
        this.data.value = value;
        this.updateInputFromPicker(value);
        
        if (this.pickerInstance) {
            (this.pickerInstance as any).setValue?.(value);
        }
    }

    /**
     * Get value
     */
    public getValue(): any {
        return this.data.value;
    }

    /**
     * Get input instance
     */
    public getInput(): XWUIInput | null {
        return this.inputInstance;
    }

    /**
     * Get picker instance
     */
    public getPicker(): TPicker | null {
        return this.pickerInstance;
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        if (this.inputInstance) {
            this.inputInstance.destroy();
            this.inputInstance = null;
        }
        if (this.pickerInstance) {
            this.pickerInstance.destroy();
            this.pickerInstance = null;
        }
        this.inputContainer = null;
        this.pickerContainer = null;
        this.iconButton = null;
        this.wrapperElement = null;
        super.destroy();
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIInputPicker as any).componentName = 'XWUIInputPicker';

