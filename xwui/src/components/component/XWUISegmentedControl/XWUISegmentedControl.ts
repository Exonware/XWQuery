/**
 * XWUISegmentedControl Component
 * Segmented button control (single selection)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface SegmentedOption {
    label: string;
    value: string | number;
    icon?: string;
    disabled?: boolean;
}

export interface XWUISegmentedControlConfig {
    options?: Array<string | SegmentedOption>;
    size?: 'small' | 'medium' | 'large';
    block?: boolean;
    disabled?: boolean;
    className?: string;
}

export interface XWUISegmentedControlData {
    value?: string | number;
}

export class XWUISegmentedControl extends XWUIComponent<XWUISegmentedControlData, XWUISegmentedControlConfig> {
    private wrapperElement: HTMLElement | null = null;
    private indicatorElement: HTMLElement | null = null;
    private buttonElements: HTMLElement[] = [];
    private changeHandlers: Array<(value: string | number, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUISegmentedControlData = {},
        conf_comp: XWUISegmentedControlConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISegmentedControlConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISegmentedControlConfig {
        return {
            options: conf_comp?.options ?? [],
            size: conf_comp?.size ?? 'medium',
            block: conf_comp?.block ?? false,
            disabled: conf_comp?.disabled ?? false,
            className: conf_comp?.className
        };
    }

    private normalizeOptions(): SegmentedOption[] {
        const options = this.config.options || [];
        return options.map(opt => {
            if (typeof opt === 'string') {
                return { label: opt, value: opt };
            }
            return opt;
        });
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-segmented-control-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-segmented-control';
        this.wrapperElement.classList.add(`xwui-segmented-control-${this.config.size}`);
        
        if (this.config.block) {
            this.wrapperElement.classList.add('xwui-segmented-control-block');
        }
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-segmented-control-disabled');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Create indicator
        this.indicatorElement = document.createElement('div');
        this.indicatorElement.className = 'xwui-segmented-control-indicator';
        this.wrapperElement.appendChild(this.indicatorElement);

        // Create buttons
        const options = this.normalizeOptions();
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'xwui-segmented-control-buttons';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'xwui-segmented-control-button';
            button.setAttribute('data-value', String(option.value));
            button.disabled = this.config.disabled || option.disabled || false;
            
            if (option.icon) {
                const iconElement = document.createElement('span');
                iconElement.className = 'xwui-segmented-control-icon';
                iconElement.innerHTML = option.icon;
                button.appendChild(iconElement);
            }
            
            const labelElement = document.createElement('span');
            labelElement.className = 'xwui-segmented-control-label';
            labelElement.textContent = option.label;
            button.appendChild(labelElement);
            
            button.addEventListener('click', () => {
                if (!button.disabled) {
                    this.selectValue(option.value);
                }
            });
            
            this.buttonElements.push(button);
            buttonsContainer.appendChild(button);
        });

        this.wrapperElement.appendChild(buttonsContainer);
        this.container.appendChild(this.wrapperElement);

        // Set initial selection
        if (this.data.value !== undefined) {
            this.updateSelection();
        }
    }

    private selectValue(value: string | number): void {
        this.data.value = value;
        this.updateSelection();
        this.notifyChange();
    }

    private updateSelection(): void {
        if (!this.indicatorElement || this.data.value === undefined) return;

        const activeButton = this.buttonElements.find(btn => 
            btn.getAttribute('data-value') === String(this.data.value)
        );

        if (activeButton) {
            // Update button states
            this.buttonElements.forEach(btn => {
                btn.classList.remove('xwui-segmented-control-button-active');
            });
            activeButton.classList.add('xwui-segmented-control-button-active');

            // Update indicator position
            const rect = activeButton.getBoundingClientRect();
            const wrapperRect = this.wrapperElement!.getBoundingClientRect();
            
            this.indicatorElement.style.left = `${activeButton.offsetLeft}px`;
            this.indicatorElement.style.width = `${activeButton.offsetWidth}px`;
        }
    }

    private notifyChange(): void {
        if (this.data.value === undefined) return;
        
        const changeEvent = new Event('change', { bubbles: true });
        this.changeHandlers.forEach(handler => {
            handler(this.data.value!, changeEvent);
        });
    }

    public getValue(): string | number | undefined {
        return this.data.value;
    }

    public setValue(value: string | number): void {
        this.selectValue(value);
    }

    public onChange(handler: (value: string | number, event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public destroy(): void {
        this.changeHandlers = [];
        this.buttonElements = [];
        if (this.wrapperElement) {
            this.wrapperElement = null;
        }
        if (this.indicatorElement) {
            this.indicatorElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISegmentedControl as any).componentName = 'XWUISegmentedControl';


