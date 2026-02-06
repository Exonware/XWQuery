/**
 * XWUIMentions Component
 * Mentions input (@ mentions)
 * Extends XWUITextarea with mention detection
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUITextarea } from '../XWUITextarea/XWUITextarea';

export interface MentionOption {
    value: string;
    label: string;
    key?: string;
}

export interface XWUIMentionsConfig {
    prefix?: string | string[];
    split?: string;
    placement?: 'top' | 'bottom';
    notFoundContent?: string;
    className?: string;
}

export interface XWUIMentionsData {
    value?: string;
    options?: MentionOption[];
}

export class XWUIMentions extends XWUIComponent<XWUIMentionsData, XWUIMentionsConfig> {
    private textareaInstance: XWUITextarea | null = null;
    private dropdownElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private selectedIndex: number = -1;
    private currentPrefix: string = '';
    private searchText: string = '';
    private filteredOptions: MentionOption[] = [];
    private mentionStart: number = -1;

    constructor(
        container: HTMLElement,
        data: XWUIMentionsData = {},
        conf_comp: XWUIMentionsConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMentionsConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMentionsConfig {
        return {
            prefix: conf_comp?.prefix ?? '@',
            split: conf_comp?.split ?? ' ',
            placement: conf_comp?.placement ?? 'bottom',
            notFoundContent: conf_comp?.notFoundContent ?? 'No suggestions',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-mentions-container';

        // Create textarea
        const textareaContainer = document.createElement('div');
        this.textareaInstance = new XWUITextarea(textareaContainer, {
            value: this.data.value || '',
            placeholder: 'Type @ to mention...'
        });
        this.registerChildComponent(this.textareaInstance);

        const textareaEl = textareaContainer.querySelector('textarea');
        if (textareaEl) {
            textareaEl.addEventListener('input', (e) => this.handleInput(e));
            textareaEl.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        this.container.appendChild(textareaContainer);

        // Create dropdown
        this.dropdownElement = document.createElement('div');
        this.dropdownElement.className = 'xwui-mentions-dropdown';
        this.dropdownElement.style.display = 'none';
        document.body.appendChild(this.dropdownElement);
    }

    private handleInput(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        const value = textarea.value;
        this.data.value = value;
        
        const cursorPos = textarea.selectionStart;
        this.detectMention(value, cursorPos);
    }

    private detectMention(text: string, cursorPos: number): void {
        const prefixes = Array.isArray(this.config.prefix) ? this.config.prefix : [this.config.prefix!];
        const split = this.config.split || ' ';
        
        // Look backwards from cursor for mention trigger
        let start = cursorPos - 1;
        let found = false;
        let prefixFound = '';
        
        while (start >= 0) {
            const char = text[start];
            
            // Check if we hit a split character
            if (split.includes(char)) {
                break;
            }
            
            // Check if we hit a prefix
            for (const prefix of prefixes) {
                if (char === prefix) {
                    this.mentionStart = start;
                    this.currentPrefix = prefix;
                    found = true;
                    prefixFound = prefix;
                    break;
                }
            }
            
            if (found) break;
            start--;
        }
        
        if (found && this.mentionStart >= 0) {
            this.searchText = text.substring(this.mentionStart + 1, cursorPos);
            this.filterOptions();
            this.openDropdown();
        } else {
            this.closeDropdown();
        }
    }

    private filterOptions(): void {
        const options = this.data.options || [];
        
        if (!this.searchText) {
            this.filteredOptions = [...options];
            return;
        }
        
        const searchLower = this.searchText.toLowerCase();
        this.filteredOptions = options.filter(opt => 
            opt.label.toLowerCase().includes(searchLower) ||
            opt.value.toLowerCase().includes(searchLower)
        );
        
        this.selectedIndex = -1;
        this.renderDropdown();
    }

    private openDropdown(): void {
        if (this.isOpen || this.filteredOptions.length === 0) return;
        
        this.isOpen = true;
        this.renderDropdown();
        this.updateDropdownPosition();
        
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'block';
        }
    }

    private closeDropdown(): void {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.selectedIndex = -1;
        
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'none';
        }
    }

    private renderDropdown(): void {
        if (!this.dropdownElement) return;
        
        this.dropdownElement.innerHTML = '';
        
        if (this.filteredOptions.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'xwui-mentions-empty';
            empty.textContent = this.config.notFoundContent || 'No suggestions';
            this.dropdownElement.appendChild(empty);
            return;
        }
        
        this.filteredOptions.forEach((option, index) => {
            const item = document.createElement('div');
            item.className = 'xwui-mentions-option';
            if (index === this.selectedIndex) {
                item.classList.add('xwui-mentions-option-selected');
            }
            item.textContent = option.label;
            item.addEventListener('click', () => {
                this.insertMention(option);
            });
            this.dropdownElement.appendChild(item);
        });
    }

    private insertMention(option: MentionOption): void {
        const textarea = this.container.querySelector('textarea') as HTMLTextAreaElement;
        if (!textarea) return;
        
        const value = textarea.value;
        const mentionText = `${this.currentPrefix}${option.label}${this.config.split || ' '}`;
        
        const before = value.substring(0, this.mentionStart);
        const after = value.substring(textarea.selectionStart);
        const newValue = before + mentionText + after;
        
        textarea.value = newValue;
        this.data.value = newValue;
        
        const newCursorPos = this.mentionStart + mentionText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
        
        this.closeDropdown();
        this.notifyChange();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (!this.isOpen || !this.dropdownElement) return;
        
        const options = this.dropdownElement.querySelectorAll('.xwui-mentions-option');
        
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
            case 'Tab':
                event.preventDefault();
                if (this.selectedIndex >= 0 && this.filteredOptions[this.selectedIndex]) {
                    this.insertMention(this.filteredOptions[this.selectedIndex]);
                }
                break;
            case 'Escape':
                this.closeDropdown();
                break;
        }
    }

    private updateSelection(): void {
        const options = this.dropdownElement?.querySelectorAll('.xwui-mentions-option');
        if (!options) return;
        
        options.forEach((opt, index) => {
            if (index === this.selectedIndex) {
                opt.classList.add('xwui-mentions-option-selected');
                opt.scrollIntoView({ block: 'nearest' });
            } else {
                opt.classList.remove('xwui-mentions-option-selected');
            }
        });
    }

    private updateDropdownPosition(): void {
        const textarea = this.container.querySelector('textarea') as HTMLTextAreaElement;
        if (!textarea || !this.dropdownElement) return;
        
        const rect = textarea.getBoundingClientRect();
        this.dropdownElement.style.position = 'fixed';
        
        if (this.config.placement === 'top') {
            this.dropdownElement.style.bottom = `${window.innerHeight - rect.top}px`;
        } else {
            this.dropdownElement.style.top = `${rect.bottom + 8}px`;
        }
        
        this.dropdownElement.style.left = `${rect.left}px`;
        this.dropdownElement.style.width = `${rect.width}px`;
    }

    private notifyChange(): void {
        const changeEvent = new Event('change', { bubbles: true });
        this.container.dispatchEvent(changeEvent);
    }

    public destroy(): void {
        if (this.dropdownElement && this.dropdownElement.parentNode) {
            this.dropdownElement.parentNode.removeChild(this.dropdownElement);
        }
        this.dropdownElement = null;
        // Child component (textareaInstance) is automatically destroyed by base class
        this.textareaInstance = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMentions as any).componentName = 'XWUIMentions';


