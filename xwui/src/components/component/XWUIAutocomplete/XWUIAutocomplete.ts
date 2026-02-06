/**
 * XWUIAutocomplete Component
 * Autocomplete/combobox with search
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUIPopover } from '../XWUIPopover/XWUIPopover';

export interface AutocompleteOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface XWUIAutocompleteConfig {
    options?: AutocompleteOption[];
    filterOption?: (input: string, option: AutocompleteOption) => boolean;
    onSearch?: (value: string) => void | Promise<void>;
    loading?: boolean;
    allowClear?: boolean;
    backfill?: boolean;
    className?: string;
}

export interface XWUIAutocompleteData {
    value?: string;
    placeholder?: string;
}

export class XWUIAutocomplete extends XWUIComponent<XWUIAutocompleteData, XWUIAutocompleteConfig> {
    private wrapperElement: HTMLElement | null = null;
    private inputInstance: XWUIInput | null = null;
    private dropdownElement: HTMLElement | null = null;
    private filteredOptions: AutocompleteOption[] = [];
    private isOpen: boolean = false;
    private selectedIndex: number = -1;
    private clickOutsideCleanup: (() => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIAutocompleteData = {},
        conf_comp: XWUIAutocompleteConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.filteredOptions = [...(this.config.options || [])];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAutocompleteConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAutocompleteConfig {
        return {
            options: conf_comp?.options ?? [],
            filterOption: conf_comp?.filterOption,
            onSearch: conf_comp?.onSearch,
            loading: conf_comp?.loading ?? false,
            allowClear: conf_comp?.allowClear ?? true,
            backfill: conf_comp?.backfill ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-autocomplete-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-autocomplete';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Create input
        const inputContainer = document.createElement('div');
        this.inputInstance = new XWUIInput(inputContainer, {
            value: this.data.value || '',
            placeholder: this.data.placeholder || ''
        }, {
            clearable: this.config.allowClear,
            type: 'text'
        });

        // Listen for input changes
        const inputEl = inputContainer.querySelector('input');
        if (inputEl) {
            inputEl.addEventListener('input', (e) => {
                const value = (e.target as HTMLInputElement).value;
                this.data.value = value;
                this.handleSearch(value);
            });

            inputEl.addEventListener('focus', () => {
                this.openDropdown();
            });

            inputEl.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        this.wrapperElement.appendChild(inputContainer);

        // Create dropdown
        this.dropdownElement = document.createElement('div');
        this.dropdownElement.className = 'xwui-autocomplete-dropdown';
        this.dropdownElement.style.display = 'none';
        this.wrapperElement.appendChild(this.dropdownElement);

        this.container.appendChild(this.wrapperElement);
    }

    private handleSearch(value: string): void {
        if (this.config.onSearch) {
            Promise.resolve(this.config.onSearch(value)).then(() => {
                this.filterOptions(value);
            });
        } else {
            this.filterOptions(value);
        }

        if (this.isOpen) {
            this.renderDropdown();
        } else if (value) {
            this.openDropdown();
        }
    }

    private filterOptions(input: string): void {
        const options = this.config.options || [];
        
        if (!input.trim()) {
            this.filteredOptions = [...options];
            return;
        }

        if (this.config.filterOption) {
            this.filteredOptions = options.filter(opt => this.config.filterOption!(input, opt));
        } else {
            const lowerInput = input.toLowerCase();
            this.filteredOptions = options.filter(opt => 
                opt.label.toLowerCase().includes(lowerInput) ||
                opt.value.toLowerCase().includes(lowerInput)
            );
        }

        if (this.config.backfill && this.filteredOptions.length > 0) {
            // Auto-fill first match
            const firstOption = this.filteredOptions[0];
            const inputEl = this.wrapperElement?.querySelector('input') as HTMLInputElement;
            if (inputEl && !inputEl.value) {
                inputEl.value = firstOption.label;
            }
        }
    }

    private openDropdown(): void {
        if (this.isOpen) return;
        
        this.isOpen = true;
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'block';
        }
        this.renderDropdown();
        this.setupClickOutside();

        const inputEl = this.wrapperElement?.querySelector('input') as HTMLInputElement;
        if (inputEl) {
            inputEl.focus();
        }
    }

    private closeDropdown(): void {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'none';
        }
        
        if (this.clickOutsideCleanup) {
            this.clickOutsideCleanup();
            this.clickOutsideCleanup = null;
        }
    }

    private renderDropdown(): void {
        if (!this.dropdownElement) return;

        this.dropdownElement.innerHTML = '';

        if (this.config.loading) {
            const loadingItem = document.createElement('div');
            loadingItem.className = 'xwui-autocomplete-loading';
            loadingItem.textContent = 'Loading...';
            this.dropdownElement.appendChild(loadingItem);
            return;
        }

        if (this.filteredOptions.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'xwui-autocomplete-empty';
            emptyItem.textContent = 'No options';
            this.dropdownElement.appendChild(emptyItem);
            return;
        }

        this.filteredOptions.forEach((option, index) => {
            const item = document.createElement('div');
            item.className = 'xwui-autocomplete-option';
            if (option.disabled) {
                item.classList.add('xwui-autocomplete-option-disabled');
            }
            if (index === this.selectedIndex) {
                item.classList.add('xwui-autocomplete-option-selected');
            }
            item.textContent = option.label;
            item.addEventListener('click', () => {
                if (!option.disabled) {
                    this.selectOption(option);
                }
            });
            this.dropdownElement.appendChild(item);
        });
    }

    private selectOption(option: AutocompleteOption): void {
        this.data.value = option.value;
        
        const inputEl = this.wrapperElement?.querySelector('input') as HTMLInputElement;
        if (inputEl) {
            inputEl.value = option.label;
        }

        this.closeDropdown();
        this.notifyChange();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (!this.isOpen || !this.dropdownElement) return;

        const options = this.dropdownElement.querySelectorAll('.xwui-autocomplete-option:not(.xwui-autocomplete-option-disabled)');
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, options.length - 1);
                this.updateSelection();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
            case 'Enter':
                event.preventDefault();
                if (this.selectedIndex >= 0 && options[this.selectedIndex]) {
                    const option = this.filteredOptions[this.selectedIndex];
                    if (!option.disabled) {
                        this.selectOption(option);
                    }
                }
                break;
            case 'Escape':
                this.closeDropdown();
                break;
        }
    }

    private updateSelection(): void {
        const options = this.dropdownElement?.querySelectorAll('.xwui-autocomplete-option');
        if (!options) return;

        options.forEach((opt, index) => {
            if (index === this.selectedIndex) {
                opt.classList.add('xwui-autocomplete-option-selected');
                opt.scrollIntoView({ block: 'nearest' });
            } else {
                opt.classList.remove('xwui-autocomplete-option-selected');
            }
        });
    }

    private setupClickOutside(): void {
        import('../../../utils/useClickOutside').then(({ useClickOutside }) => {
            if (this.wrapperElement) {
                this.clickOutsideCleanup = useClickOutside(this.wrapperElement, () => {
                    this.closeDropdown();
                });
            }
        });
    }

    private notifyChange(): void {
        // Trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        this.container.dispatchEvent(changeEvent);
    }

    public destroy(): void {
        if (this.clickOutsideCleanup) {
            this.clickOutsideCleanup();
        }
        if (this.inputInstance) {
            this.inputInstance = null;
        }
        this.dropdownElement = null;
        this.wrapperElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAutocomplete as any).componentName = 'XWUIAutocomplete';


