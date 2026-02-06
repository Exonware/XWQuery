/**
 * XWUICascader Component
 * Cascading dropdown selection
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIInput } from '../XWUIInput/XWUIInput';

export interface CascaderOption {
    value: string | number;
    label: string;
    children?: CascaderOption[];
}

export interface XWUICascaderConfig {
    expandTrigger?: 'click' | 'hover';
    changeOnSelect?: boolean;
    displayRender?: (labels: string[]) => string;
    className?: string;
}

export interface XWUICascaderData {
    value?: Array<string | number>;
    options?: CascaderOption[];
    placeholder?: string;
}

export class XWUICascader extends XWUIComponent<XWUICascaderData, XWUICascaderConfig> {
    private wrapperElement: HTMLElement | null = null;
    private inputInstance: XWUIInput | null = null;
    private menusContainer: HTMLElement | null = null;
    private isOpen: boolean = false;
    private selectedPath: CascaderOption[] = [];

    constructor(
        container: HTMLElement,
        data: XWUICascaderData = {},
        conf_comp: XWUICascaderConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICascaderConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICascaderConfig {
        return {
            expandTrigger: conf_comp?.expandTrigger ?? 'click',
            changeOnSelect: conf_comp?.changeOnSelect ?? false,
            displayRender: conf_comp?.displayRender,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-cascader-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-cascader';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Input
        const inputContainer = document.createElement('div');
        const displayValue = this.getDisplayValue();
        
        this.inputInstance = new XWUIInput(inputContainer, {
            value: displayValue,
            placeholder: this.data.placeholder || 'Please select'
        }, {
            readonly: true
        });
        this.registerChildComponent(this.inputInstance);

        const inputEl = inputContainer.querySelector('input');
        if (inputEl) {
            inputEl.addEventListener('click', () => this.toggle());
            inputEl.addEventListener('focus', () => {
                if (!this.isOpen) this.open();
            });
        }

        this.wrapperElement.appendChild(inputContainer);

        // Dropdown menus
        this.menusContainer = document.createElement('div');
        this.menusContainer.className = 'xwui-cascader-menus';
        this.menusContainer.style.display = 'none';
        document.body.appendChild(this.menusContainer);

        this.container.appendChild(this.wrapperElement);
        this.updateMenus();
    }

    private getDisplayValue(): string {
        if (!this.data.value || this.data.value.length === 0) {
            return '';
        }

        if (this.config.displayRender) {
            const labels = this.getSelectedLabels();
            return this.config.displayRender(labels);
        }

        const labels = this.getSelectedLabels();
        return labels.join(' / ');
    }

    private getSelectedLabels(): string[] {
        if (!this.data.value || !this.data.options) return [];
        
        const labels: string[] = [];
        let currentOptions = this.data.options;
        
        for (const val of this.data.value) {
            const option = currentOptions.find(opt => opt.value === val);
            if (!option) break;
            
            labels.push(option.label);
            currentOptions = option.children || [];
        }
        
        return labels;
    }

    private toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private open(): void {
        if (this.isOpen) return;
        
        this.isOpen = true;
        if (this.menusContainer) {
            this.menusContainer.style.display = 'flex';
            this.updateMenus();
            this.updatePosition();
        }
    }

    private close(): void {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        if (this.menusContainer) {
            this.menusContainer.style.display = 'none';
        }
    }

    private updateMenus(): void {
        if (!this.menusContainer || !this.data.options) return;
        
        this.menusContainer.innerHTML = '';
        this.selectedPath = [];
        
        // Render first level
        this.renderMenu(this.data.options, 0);
    }

    private renderMenu(options: CascaderOption[], level: number): void {
        const menu = document.createElement('ul');
        menu.className = 'xwui-cascader-menu';
        menu.setAttribute('data-level', String(level));

        options.forEach(option => {
            const item = document.createElement('li');
            item.className = 'xwui-cascader-menu-item';
            
            if (this.isSelected(option, level)) {
                item.classList.add('xwui-cascader-menu-item-selected');
            }
            
            const label = document.createElement('span');
            label.className = 'xwui-cascader-menu-item-label';
            label.textContent = option.label;
            item.appendChild(label);
            
            if (option.children && option.children.length > 0) {
                const arrow = document.createElement('span');
                arrow.className = 'xwui-cascader-menu-item-arrow';
                arrow.textContent = '▶';
                item.appendChild(arrow);
            }

            const handleClick = () => {
                this.selectOption(option, level);
            };

            if (this.config.expandTrigger === 'hover') {
                item.addEventListener('mouseenter', () => {
                    this.selectOption(option, level);
                });
            } else {
                item.addEventListener('click', handleClick);
            }

            menu.appendChild(item);
        });

        this.menusContainer.appendChild(menu);
        this.updateSelectedPath();
    }

    private isSelected(option: CascaderOption, level: number): boolean {
        if (!this.data.value || level >= this.data.value.length) return false;
        return this.data.value[level] === option.value;
    }

    private selectOption(option: CascaderOption, level: number): void {
        // Update selected path
        this.selectedPath = this.selectedPath.slice(0, level);
        this.selectedPath.push(option);

        // Update value array
        if (!this.data.value) {
            this.data.value = [];
        }
        this.data.value = this.data.value.slice(0, level);
        this.data.value.push(option.value);

        // Check if should close or continue
        if (option.children && option.children.length > 0) {
            // Render next level menu
            this.renderNextLevel(option.children, level + 1);
        } else {
            // Leaf node selected
            if (this.config.changeOnSelect || !option.children) {
                this.finishSelection();
            }
        }

        this.updateSelectedPath();
        this.updateInput();
    }

    private renderNextLevel(options: CascaderOption[], level: number): void {
        // Remove menus after current level
        const menus = this.menusContainer?.querySelectorAll('.xwui-cascader-menu');
        if (menus) {
            menus.forEach((menu, index) => {
                if (index > level - 1) {
                    menu.remove();
                }
            });
        }

        this.renderMenu(options, level);
        this.updatePosition();
    }

    private updateSelectedPath(): void {
        const menus = this.menusContainer?.querySelectorAll('.xwui-cascader-menu');
        if (!menus) return;

        menus.forEach((menu, level) => {
            const items = menu.querySelectorAll('.xwui-cascader-menu-item');
            items.forEach(item => {
                item.classList.remove('xwui-cascader-menu-item-selected');
                if (this.selectedPath[level]) {
                    const label = item.querySelector('.xwui-cascader-menu-item-label');
                    if (label?.textContent === this.selectedPath[level].label) {
                        item.classList.add('xwui-cascader-menu-item-selected');
                    }
                }
            });
        });
    }

    private finishSelection(): void {
        this.updateInput();
        this.close();
        this.notifyChange();
    }

    private updateInput(): void {
        const displayValue = this.getDisplayValue();
        if (this.inputInstance) {
            const inputEl = this.wrapperElement?.querySelector('input');
            if (inputEl) {
                inputEl.value = displayValue;
            }
        }
    }

    private updatePosition(): void {
        if (!this.menusContainer || !this.wrapperElement) return;
        
        const rect = this.wrapperElement.getBoundingClientRect();
        this.menusContainer.style.position = 'fixed';
        this.menusContainer.style.top = `${rect.bottom + 4}px`;
        this.menusContainer.style.left = `${rect.left}px`;
    }

    private notifyChange(): void {
        const changeEvent = new Event('change', { bubbles: true });
        this.container.dispatchEvent(changeEvent);
    }

    public destroy(): void {
        if (this.menusContainer && this.menusContainer.parentNode) {
            this.menusContainer.parentNode.removeChild(this.menusContainer);
        }
        this.menusContainer = null;
        // Child component (inputInstance) is automatically destroyed by base class
        this.inputInstance = null;
        this.wrapperElement = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICascader as any).componentName = 'XWUICascader';


