/**
 * XWUISelect Component
 * Dropdown select with single and multi-select modes
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';

export interface XWUISelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    group?: string;
}

// Component-level configuration
export interface XWUISelectConfig {
    size?: 'small' | 'medium' | 'large';
    variant?: 'outlined' | 'filled';
    disabled?: boolean;
    multiple?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    fullWidth?: boolean;
    error?: boolean;
    maxHeight?: string;
    className?: string;
}

// Data type
export interface XWUISelectData {
    options: XWUISelectOption[];
    value?: string | string[];
    placeholder?: string;
    label?: string;
    helperText?: string;
    errorText?: string;
    name?: string;
    id?: string;
}

export class XWUISelect extends XWUIComponent<XWUISelectData, XWUISelectConfig> {
    private wrapperElement: HTMLElement | null = null;
    private triggerElement: HTMLElement | null = null;
    private dropdownElement: HTMLElement | null = null;
    private searchInput: HTMLInputElement | null = null;
    private isOpen: boolean = false;
    private filteredOptions: XWUISelectOption[] = [];
    private changeHandlers: Array<(value: string | string[], event: Event) => void> = [];
    private clearIcon: XWUIIcon | null = null;
    private arrowIcon: XWUIIcon | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISelectData,
        conf_comp: XWUISelectConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.filteredOptions = [...data.options];
        this.render();
        this.setupOutsideClickHandler();
    }

    protected createConfig(
        conf_comp?: XWUISelectConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISelectConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            variant: conf_comp?.variant ?? 'outlined',
            disabled: conf_comp?.disabled ?? false,
            multiple: conf_comp?.multiple ?? false,
            searchable: conf_comp?.searchable ?? false,
            clearable: conf_comp?.clearable ?? false,
            fullWidth: conf_comp?.fullWidth ?? false,
            error: conf_comp?.error ?? false,
            maxHeight: conf_comp?.maxHeight ?? '250px',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-select-wrapper';
        this.wrapperElement.classList.add(`xwui-select-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-select-${this.config.variant}`);
        
        if (this.config.fullWidth) {
            this.wrapperElement.classList.add('xwui-select-full-width');
        }
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-select-disabled');
        }
        if (this.config.error) {
            this.wrapperElement.classList.add('xwui-select-error');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Label
        if (this.data.label) {
            const labelElement = document.createElement('label');
            labelElement.className = 'xwui-select-label';
            labelElement.textContent = this.data.label;
            this.wrapperElement.appendChild(labelElement);
        }

        // Trigger
        this.triggerElement = document.createElement('div');
        this.triggerElement.className = 'xwui-select-trigger';
        this.triggerElement.setAttribute('role', 'combobox');
        this.triggerElement.setAttribute('aria-expanded', 'false');
        this.triggerElement.setAttribute('tabindex', this.config.disabled ? '-1' : '0');

        // Display value
        const displayValue = document.createElement('span');
        displayValue.className = 'xwui-select-value';
        displayValue.textContent = this.getDisplayValue();
        this.triggerElement.appendChild(displayValue);

        // Icons container
        const iconsContainer = document.createElement('span');
        iconsContainer.className = 'xwui-select-icons';

        // Clear button - create if clearable is enabled
        if (this.config.clearable) {
            const clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.className = 'xwui-select-clear';
            clearButton.style.display = (this.data.value && (Array.isArray(this.data.value) ? this.data.value.length > 0 : true)) ? 'block' : 'none';
            
            // Use XWUIIcon instead of inline SVG
            const clearIconContainer = document.createElement('div');
            this.clearIcon = new XWUIIcon(clearIconContainer, 'close', { size: 18 }, this.conf_sys, this.conf_usr);
            this.registerChildComponent(this.clearIcon);
            clearButton.appendChild(clearIconContainer);
            
            clearButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clear();
            });
            iconsContainer.appendChild(clearButton);
        }

        // Arrow - Use XWUIIcon instead of inline SVG
        const arrow = document.createElement('span');
        arrow.className = 'xwui-select-arrow';
        const arrowIconContainer = document.createElement('div');
        this.arrowIcon = new XWUIIcon(arrowIconContainer, 'chevron-down', { size: 20 }, this.conf_sys, this.conf_usr);
        this.registerChildComponent(this.arrowIcon);
        arrow.appendChild(arrowIconContainer);
        iconsContainer.appendChild(arrow);

        this.triggerElement.appendChild(iconsContainer);

        // Click handler
        this.triggerElement.addEventListener('click', () => {
            if (!this.config.disabled) {
                this.toggle();
            }
        });

        // Keyboard handler
        this.triggerElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        this.wrapperElement.appendChild(this.triggerElement);

        // Dropdown
        this.dropdownElement = document.createElement('div');
        this.dropdownElement.className = 'xwui-select-dropdown';
        this.dropdownElement.style.maxHeight = this.config.maxHeight || '250px';

        // Search input
        if (this.config.searchable) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'xwui-select-search';
            
            this.searchInput = document.createElement('input');
            this.searchInput.type = 'text';
            this.searchInput.placeholder = 'Search...';
            this.searchInput.className = 'xwui-select-search-input';
            this.searchInput.addEventListener('input', (e) => {
                this.filterOptions((e.target as HTMLInputElement).value);
            });
            this.searchInput.addEventListener('click', (e) => e.stopPropagation());
            
            searchContainer.appendChild(this.searchInput);
            this.dropdownElement.appendChild(searchContainer);
        }

        // Options list
        const optionsList = document.createElement('div');
        optionsList.className = 'xwui-select-options';
        this.renderOptions(optionsList);
        this.dropdownElement.appendChild(optionsList);

        this.wrapperElement.appendChild(this.dropdownElement);

        // Helper text
        const helperText = this.config.error && this.data.errorText ? this.data.errorText : this.data.helperText;
        if (helperText) {
            const helperElement = document.createElement('span');
            helperElement.className = 'xwui-select-helper';
            if (this.config.error) {
                helperElement.classList.add('xwui-select-helper-error');
            }
            helperElement.textContent = helperText;
            this.wrapperElement.appendChild(helperElement);
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderOptions(container: HTMLElement): void {
        container.innerHTML = '';

        if (this.filteredOptions.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'xwui-select-empty';
            emptyMessage.textContent = 'No options found';
            container.appendChild(emptyMessage);
            return;
        }

        // Group options
        const groups = new Map<string, XWUISelectOption[]>();
        const ungrouped: XWUISelectOption[] = [];

        this.filteredOptions.forEach(option => {
            if (option.group) {
                if (!groups.has(option.group)) {
                    groups.set(option.group, []);
                }
                groups.get(option.group)!.push(option);
            } else {
                ungrouped.push(option);
            }
        });

        // Render ungrouped options
        ungrouped.forEach(option => {
            container.appendChild(this.createOptionElement(option));
        });

        // Render grouped options
        groups.forEach((options, groupName) => {
            const groupElement = document.createElement('div');
            groupElement.className = 'xwui-select-group';
            
            const groupLabel = document.createElement('div');
            groupLabel.className = 'xwui-select-group-label';
            groupLabel.textContent = groupName;
            groupElement.appendChild(groupLabel);

            options.forEach(option => {
                groupElement.appendChild(this.createOptionElement(option));
            });

            container.appendChild(groupElement);
        });
    }

    private createOptionElement(option: XWUISelectOption): HTMLElement {
        const isSelected = this.isValueSelected(option.value);
        
        const optionElement = document.createElement('div');
        optionElement.className = 'xwui-select-option';
        optionElement.setAttribute('role', 'option');
        optionElement.setAttribute('aria-selected', String(isSelected));
        
        if (isSelected) {
            optionElement.classList.add('xwui-select-option-selected');
        }
        if (option.disabled) {
            optionElement.classList.add('xwui-select-option-disabled');
        }

        // Checkbox for multiple select - Use XWUIIcon
        if (this.config.multiple) {
            const checkbox = document.createElement('span');
            checkbox.className = 'xwui-select-option-checkbox';
            if (isSelected) {
                const checkIconContainer = document.createElement('div');
                const checkIcon = new XWUIIcon(checkIconContainer, 'check', { size: 18 }, this.conf_sys, this.conf_usr);
                this.registerChildComponent(checkIcon);
                checkbox.appendChild(checkIconContainer);
            }
            optionElement.appendChild(checkbox);
        }

        const label = document.createElement('span');
        label.className = 'xwui-select-option-label';
        label.textContent = option.label;
        optionElement.appendChild(label);

        // Check icon for single select - Use XWUIIcon
        if (!this.config.multiple && isSelected) {
            const checkIcon = document.createElement('span');
            checkIcon.className = 'xwui-select-option-check';
            const checkIconContainer = document.createElement('div');
            const checkIconInstance = new XWUIIcon(checkIconContainer, 'check', { size: 18 }, this.conf_sys, this.conf_usr);
            this.registerChildComponent(checkIconInstance);
            checkIcon.appendChild(checkIconContainer);
            optionElement.appendChild(checkIcon);
        }

        if (!option.disabled) {
            optionElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOption(option.value);
            });
        }

        return optionElement;
    }

    private isValueSelected(value: string): boolean {
        if (this.config.multiple && Array.isArray(this.data.value)) {
            return this.data.value.includes(value);
        }
        return this.data.value === value;
    }

    private getDisplayValue(): string {
        if (!this.data.value || (Array.isArray(this.data.value) && this.data.value.length === 0)) {
            return this.data.placeholder || 'Select...';
        }

        if (this.config.multiple && Array.isArray(this.data.value)) {
            const selectedLabels = this.data.options
                .filter(opt => this.data.value!.includes(opt.value))
                .map(opt => opt.label);
            return selectedLabels.length > 2 
                ? `${selectedLabels.length} selected`
                : selectedLabels.join(', ');
        }

        const selectedOption = this.data.options.find(opt => opt.value === this.data.value);
        return selectedOption?.label || String(this.data.value);
    }

    private selectOption(value: string): void {
        if (this.config.multiple) {
            const currentValue = Array.isArray(this.data.value) ? [...this.data.value] : [];
            const index = currentValue.indexOf(value);
            if (index > -1) {
                currentValue.splice(index, 1);
            } else {
                currentValue.push(value);
            }
            this.data.value = currentValue;
        } else {
            this.data.value = value;
            this.close();
        }

        this.updateDisplay();
        this.changeHandlers.forEach(handler => handler(this.data.value!, new Event('change')));
    }

    private updateDisplay(): void {
        const displayValue = this.triggerElement?.querySelector('.xwui-select-value');
        if (displayValue) {
            displayValue.textContent = this.getDisplayValue();
        }

        // Update clear button visibility
        const clearButton = this.triggerElement?.querySelector('.xwui-select-clear');
        if (clearButton) {
            const hasValue = this.data.value && (Array.isArray(this.data.value) ? this.data.value.length > 0 : true);
            (clearButton as HTMLElement).style.display = (this.config.clearable && hasValue) ? 'block' : 'none';
        }

        // Update options list
        const optionsList = this.dropdownElement?.querySelector('.xwui-select-options');
        if (optionsList) {
            this.renderOptions(optionsList as HTMLElement);
        }
    }

    private filterOptions(query: string): void {
        const lowerQuery = query.toLowerCase();
        this.filteredOptions = this.data.options.filter(option => 
            option.label.toLowerCase().includes(lowerQuery)
        );

        const optionsList = this.dropdownElement?.querySelector('.xwui-select-options');
        if (optionsList) {
            this.renderOptions(optionsList as HTMLElement);
        }
    }

    private toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public open(): void {
        if (this.config.disabled || this.isOpen) return;
        
        this.isOpen = true;
        this.wrapperElement?.classList.add('xwui-select-open');
        this.triggerElement?.setAttribute('aria-expanded', 'true');
        
        if (this.config.searchable && this.searchInput) {
            this.searchInput.value = '';
            this.filteredOptions = [...this.data.options];
            const optionsList = this.dropdownElement?.querySelector('.xwui-select-options');
            if (optionsList) {
                this.renderOptions(optionsList as HTMLElement);
            }
            setTimeout(() => this.searchInput?.focus(), 0);
        }
    }

    public close(): void {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.wrapperElement?.classList.remove('xwui-select-open');
        this.triggerElement?.setAttribute('aria-expanded', 'false');
    }

    private setupOutsideClickHandler(): void {
        document.addEventListener('click', (e) => {
            if (this.isOpen && this.wrapperElement && !this.wrapperElement.contains(e.target as Node)) {
                this.close();
            }
        });
    }

    public getValue(): string | string[] | undefined {
        return this.data.value;
    }

    public setValue(value: string | string[]): void {
        this.data.value = value;
        this.updateDisplay();
    }

    public clear(): void {
        this.data.value = this.config.multiple ? [] : undefined;
        this.updateDisplay();
        this.changeHandlers.forEach(handler => handler(this.data.value!, new Event('clear')));
    }

    public onChange(handler: (value: string | string[], event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        this.clearIcon = null;
        this.arrowIcon = null;
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
            this.triggerElement = null;
            this.dropdownElement = null;
            this.searchInput = null;
        }
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISelect as any).componentName = 'XWUISelect';


