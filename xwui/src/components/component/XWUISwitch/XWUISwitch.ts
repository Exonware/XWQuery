/**
 * XWUISwitch Component
 * Toggle switch component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon, type XWUIIconData, type XWUIIconConfig } from '../XWUIIcon/XWUIIcon';
import { XWUITooltip, tooltip } from '../XWUITooltip/XWUITooltip';

// Option for multi-state switch
export interface XWUISwitchOption {
    value: string; // Unique identifier for this option
    icon?: string | XWUIIconData; // Icon name or icon data object
    iconConfig?: XWUIIconConfig; // Optional icon configuration
    tooltip?: string; // Tooltip text
    color?: string; // Color when this option is selected
    trackColor?: string; // Track background color when this option is selected
}

// Component-level configuration
export interface XWUISwitchConfig {
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'error';
    labelPlacement?: 'start' | 'end';
    className?: string;
    // Custom content options (for binary switch)
    checkedContent?: string; // HTML string or text for checked state (e.g., 'I', 'ON', or '<svg>...</svg>')
    uncheckedContent?: string; // HTML string or text for unchecked state (e.g., 'O', 'OFF', or '<svg>...</svg>')
    showThumb?: boolean; // Whether to show the thumb or replace with custom content (default: true)
    // Per-state colors (for binary switch)
    checkedColor?: string; // Custom CSS color for checked state (overrides color variant)
    uncheckedColor?: string; // Custom CSS color for unchecked state
    checkedTrackColor?: string; // Custom CSS color for checked track background
    uncheckedTrackColor?: string; // Custom CSS color for unchecked track background
    // Multi-state options (for multi-option switch)
    options?: XWUISwitchOption[]; // Array of options for multi-state switch
    mode?: 'binary' | 'multi'; // Switch mode: binary (on/off) or multi (multiple options)
}

// Data type
export interface XWUISwitchData {
    checked?: boolean; // For binary mode
    selectedValue?: string; // For multi mode - selected option value
    label?: string;
    description?: string;
    name?: string;
    id?: string;
}

export class XWUISwitch extends XWUIComponent<XWUISwitchData, XWUISwitchConfig> {
    private wrapperElement: HTMLElement | null = null;
    private inputElement: HTMLInputElement | null = null;
    private changeHandlers: Array<(checked: boolean, event: Event) => void> = [];
    private multiChangeHandlers: Array<(selectedValue: string, event: Event) => void> = [];
    private optionElements: Map<string, HTMLElement> = new Map();
    private iconInstances: Map<string, XWUIIcon> = new Map();
    private tooltipInstances: Map<string, XWUITooltip> = new Map();

    constructor(
        container: HTMLElement,
        data: XWUISwitchData = {},
        conf_comp: XWUISwitchConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISwitchConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISwitchConfig {
        // Determine mode: if options are provided, use multi mode; otherwise binary
        const hasOptions = conf_comp?.options && conf_comp.options.length > 0;
        const mode = conf_comp?.mode ?? (hasOptions ? 'multi' : 'binary');
        
        return {
            size: conf_comp?.size ?? 'medium',
            disabled: conf_comp?.disabled ?? false,
            color: conf_comp?.color ?? 'primary',
            labelPlacement: conf_comp?.labelPlacement ?? 'end',
            className: conf_comp?.className,
            checkedContent: conf_comp?.checkedContent,
            uncheckedContent: conf_comp?.uncheckedContent,
            showThumb: conf_comp?.showThumb ?? true,
            checkedColor: conf_comp?.checkedColor,
            uncheckedColor: conf_comp?.uncheckedColor,
            checkedTrackColor: conf_comp?.checkedTrackColor,
            uncheckedTrackColor: conf_comp?.uncheckedTrackColor,
            options: conf_comp?.options,
            mode: mode
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        
        // Clear previous instances
        this.optionElements.clear();
        this.iconInstances.forEach(icon => icon.destroy());
        this.iconInstances.clear();
        this.tooltipInstances.forEach(tooltip => tooltip.destroy());
        this.tooltipInstances.clear();

        // Render based on mode
        if (this.config.mode === 'multi' && this.config.options && this.config.options.length > 0) {
            this.renderMultiState();
        } else {
            this.renderBinary();
        }
    }
    
    private renderBinary(): void {
        // Create wrapper
        this.wrapperElement = document.createElement('label');
        this.wrapperElement.className = 'xwui-switch';
        this.wrapperElement.classList.add(`xwui-switch-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-switch-${this.config.color}`);
        this.wrapperElement.classList.add(`xwui-switch-label-${this.config.labelPlacement}`);
        
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-switch-disabled');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Hidden input
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'checkbox';
        this.inputElement.className = 'xwui-switch-input';
        this.inputElement.checked = this.data.checked || false;
        this.inputElement.disabled = this.config.disabled || false;
        this.inputElement.setAttribute('role', 'switch');
        this.inputElement.setAttribute('aria-checked', String(this.data.checked || false));
        
        if (this.data.name) this.inputElement.name = this.data.name;
        if (this.data.id) this.inputElement.id = this.data.id;

        this.inputElement.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            this.data.checked = checked;
            this.inputElement!.setAttribute('aria-checked', String(checked));
            this.updateVisualState(checked);
            this.changeHandlers.forEach(handler => handler(checked, e));
        });

        // Switch track
        const track = document.createElement('span');
        track.className = 'xwui-switch-track';
        
        // Apply custom track colors if specified
        if (this.config.uncheckedTrackColor) {
            track.style.setProperty('--xwui-switch-unchecked-bg', this.config.uncheckedTrackColor);
        }
        if (this.config.checkedTrackColor) {
            track.style.setProperty('--xwui-switch-checked-bg', this.config.checkedTrackColor);
        }
        
        // Switch thumb or custom content
        if (this.config.showThumb) {
            const thumb = document.createElement('span');
            thumb.className = 'xwui-switch-thumb';
            track.appendChild(thumb);
        } else {
            // Add custom content containers
            const uncheckedContent = document.createElement('span');
            uncheckedContent.className = 'xwui-switch-content xwui-switch-content-unchecked';
            if (this.config.uncheckedContent !== undefined) {
                uncheckedContent.innerHTML = this.config.uncheckedContent;
            }
            track.appendChild(uncheckedContent);
            
            const checkedContent = document.createElement('span');
            checkedContent.className = 'xwui-switch-content xwui-switch-content-checked';
            if (this.config.checkedContent !== undefined) {
                checkedContent.innerHTML = this.config.checkedContent;
            }
            track.appendChild(checkedContent);
            
            // Apply custom colors to content if specified
            if (this.config.uncheckedColor) {
                uncheckedContent.style.color = this.config.uncheckedColor;
            }
            if (this.config.checkedColor) {
                checkedContent.style.color = this.config.checkedColor;
            }
        }
        
        // Add class for custom content mode
        if (!this.config.showThumb) {
            track.classList.add('xwui-switch-track-content');
        }

        // Build structure based on label placement
        if (this.config.labelPlacement === 'start' && (this.data.label || this.data.description)) {
            this.wrapperElement.appendChild(this.createTextContent());
        }
        
        this.wrapperElement.appendChild(this.inputElement);
        this.wrapperElement.appendChild(track);
        
        if (this.config.labelPlacement === 'end' && (this.data.label || this.data.description)) {
            this.wrapperElement.appendChild(this.createTextContent());
        }

        this.container.appendChild(this.wrapperElement);
        
        // Initial visual state (after DOM is ready)
        this.updateVisualState(this.data.checked || false);
    }
    
    private renderMultiState(): void {
        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-switch xwui-switch-multi';
        this.wrapperElement.classList.add(`xwui-switch-${this.config.size}`);
        
        if (this.config.disabled) {
            this.wrapperElement.classList.add('xwui-switch-disabled');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Create track container for all options
        const track = document.createElement('div');
        track.className = 'xwui-switch-track-multi';
        track.setAttribute('role', 'radiogroup');
        // Add accessible name for the radio group if label exists
        if (this.data.label) {
            track.setAttribute('aria-label', this.data.label);
        }
        
        // Create options
        this.config.options!.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.type = 'button';
            optionElement.className = 'xwui-switch-option';
            optionElement.setAttribute('data-value', option.value);
            optionElement.setAttribute('role', 'radio');
            
            // Set initial aria-checked state
            const isInitiallySelected = this.data.selectedValue === option.value || 
                (!this.data.selectedValue && index === 0);
            optionElement.setAttribute('aria-checked', String(isInitiallySelected));
            
            // Add accessible name - use tooltip if available, otherwise use value
            const accessibleName = option.tooltip || option.value;
            optionElement.setAttribute('aria-label', accessibleName);
            
            if (this.config.disabled) {
                optionElement.disabled = true;
                optionElement.setAttribute('aria-disabled', 'true');
            }
            
            // Create icon container
            if (option.icon) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'xwui-switch-option-icon';
                
                // Create icon instance
                const iconData: XWUIIconData = typeof option.icon === 'string' 
                    ? { name: option.icon }
                    : option.icon;
                const iconConf: XWUIIconConfig = {
                    size: 32, // Default size for switch icons
                    ...option.iconConfig
                };
                
                const icon = new XWUIIcon(iconContainer, iconData, iconConf, this.conf_sys, this.conf_usr);
                this.iconInstances.set(option.value, icon);
                this.registerChildComponent(icon);
                
                optionElement.appendChild(iconContainer);
            }
            
            // Tooltips will be created after DOM is ready
            
            // Click handler
            optionElement.addEventListener('click', (e) => {
                if (!this.config.disabled) {
                    this.setSelectedValue(option.value);
                    this.multiChangeHandlers.forEach(handler => handler(option.value, e));
                }
            });
            
            track.appendChild(optionElement);
            this.optionElements.set(option.value, optionElement);
        });
        
        // Build structure
        if (this.config.labelPlacement === 'start' && (this.data.label || this.data.description)) {
            this.wrapperElement.appendChild(this.createTextContent());
        }
        
        this.wrapperElement.appendChild(track);
        
        if (this.config.labelPlacement === 'end' && (this.data.label || this.data.description)) {
            this.wrapperElement.appendChild(this.createTextContent());
        }
        
        this.container.appendChild(this.wrapperElement);
        
        // Create tooltips after DOM is ready (use requestAnimationFrame to ensure DOM is rendered)
        requestAnimationFrame(() => {
            this.config.options!.forEach((option) => {
                const optionElement = this.optionElements.get(option.value);
                if (option.tooltip && optionElement && this.wrapperElement) {
                    // Use the tooltip helper function which properly sets everything up
                    try {
                        const tooltipInstance = tooltip(optionElement, option.tooltip, {
                            placement: 'top',
                            trigger: 'hover',
                            delay: 200,
                            arrow: true
                        });
                        
                        // The helper creates a container - ensure it's in the DOM
                        // The container is stored in tooltipInstance.container
                        if (tooltipInstance.container && !tooltipInstance.container.parentElement) {
                            this.wrapperElement.appendChild(tooltipInstance.container);
                        }
                        
                        this.tooltipInstances.set(option.value, tooltipInstance);
                        this.registerChildComponent(tooltipInstance);
                    } catch (error) {
                        console.error('Error creating tooltip for option:', option.value, error);
                    }
                }
            });
        });
        
        // Initial visual state
        const initialValue = this.data.selectedValue || (this.config.options && this.config.options.length > 0 ? this.config.options[0].value : '');
        if (initialValue && this.config.options?.some(opt => opt.value === initialValue)) {
            this.data.selectedValue = initialValue;
            this.updateMultiStateVisual(initialValue);
        } else if (this.config.options && this.config.options.length > 0) {
            // Set first option as default if no valid selectedValue
            const firstValue = this.config.options[0].value;
            this.data.selectedValue = firstValue;
            this.updateMultiStateVisual(firstValue);
        }
    }

    private createTextContent(): HTMLElement {
        const textWrapper = document.createElement('span');
        textWrapper.className = 'xwui-switch-text';

        if (this.data.label) {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'xwui-switch-label';
            labelSpan.textContent = this.data.label;
            textWrapper.appendChild(labelSpan);
        }

        if (this.data.description) {
            const descSpan = document.createElement('span');
            descSpan.className = 'xwui-switch-description';
            descSpan.textContent = this.data.description;
            textWrapper.appendChild(descSpan);
        }

        return textWrapper;
    }

    private updateVisualState(checked: boolean): void {
        if (!this.wrapperElement) return;
        
        // Update track background color
        const track = this.wrapperElement.querySelector('.xwui-switch-track') as HTMLElement;
        if (track) {
            if (checked) {
                if (this.config.checkedTrackColor) {
                    track.style.backgroundColor = this.config.checkedTrackColor;
                } else {
                    track.style.backgroundColor = ''; // Reset to CSS default
                }
            } else {
                if (this.config.uncheckedTrackColor) {
                    track.style.backgroundColor = this.config.uncheckedTrackColor;
                } else {
                    track.style.backgroundColor = ''; // Reset to CSS default
                }
            }
        }
        
        // Update thumb color if custom colors are set
        if (this.config.showThumb) {
            const thumb = this.wrapperElement.querySelector('.xwui-switch-thumb') as HTMLElement;
            if (thumb) {
                if (checked) {
                    if (this.config.checkedColor) {
                        thumb.style.backgroundColor = this.config.checkedColor;
                        thumb.style.borderColor = this.config.checkedColor;
                    } else {
                        thumb.style.backgroundColor = '';
                        thumb.style.borderColor = '';
                    }
                } else {
                    if (this.config.uncheckedColor) {
                        thumb.style.backgroundColor = this.config.uncheckedColor;
                        thumb.style.borderColor = this.config.uncheckedColor;
                    } else {
                        thumb.style.backgroundColor = '';
                        thumb.style.borderColor = '';
                    }
                }
            }
        }
        
        // Update content visibility
        if (!this.config.showThumb) {
            const uncheckedContent = this.wrapperElement.querySelector('.xwui-switch-content-unchecked') as HTMLElement;
            const checkedContent = this.wrapperElement.querySelector('.xwui-switch-content-checked') as HTMLElement;
            
            if (uncheckedContent && checkedContent) {
                if (checked) {
                    uncheckedContent.style.opacity = '0';
                    checkedContent.style.opacity = '1';
                } else {
                    uncheckedContent.style.opacity = '1';
                    checkedContent.style.opacity = '0';
                }
            }
        }
    }

    public isChecked(): boolean {
        return this.inputElement?.checked || false;
    }

    public setChecked(checked: boolean): void {
        this.data.checked = checked;
        if (this.inputElement) {
            this.inputElement.checked = checked;
            this.inputElement.setAttribute('aria-checked', String(checked));
        }
        this.updateVisualState(checked);
    }

    public toggle(): void {
        this.setChecked(!this.isChecked());
        this.changeHandlers.forEach(handler => handler(this.isChecked(), new Event('toggle')));
    }

    public setDisabled(disabled: boolean): void {
        this.config.disabled = disabled;
        if (this.inputElement) {
            this.inputElement.disabled = disabled;
        }
        if (this.wrapperElement) {
            if (disabled) {
                this.wrapperElement.classList.add('xwui-switch-disabled');
            } else {
                this.wrapperElement.classList.remove('xwui-switch-disabled');
            }
        }
        // Update aria-disabled for multi-state options
        if (this.config.mode === 'multi') {
            this.optionElements.forEach((element) => {
                if (disabled) {
                    element.disabled = true;
                    element.setAttribute('aria-disabled', 'true');
                } else {
                    element.disabled = false;
                    element.removeAttribute('aria-disabled');
                }
            });
        }
    }

    public onChange(handler: (checked: boolean, event: Event) => void): void {
        this.changeHandlers.push(handler);
    }
    
    public onMultiChange(handler: (selectedValue: string, event: Event) => void): void {
        this.multiChangeHandlers.push(handler);
    }
    
    public getSelectedValue(): string | undefined {
        return this.data.selectedValue;
    }
    
    public setSelectedValue(value: string): void {
        this.data.selectedValue = value;
        this.updateMultiStateVisual(value);
    }
    
    private updateMultiStateVisual(selectedValue: string): void {
        if (!this.wrapperElement || this.config.mode !== 'multi') return;
        
        const selectedOption = this.config.options?.find(opt => opt.value === selectedValue);
        if (!selectedOption) return;
        
        // Update all option elements
        this.optionElements.forEach((element, value) => {
            const isSelected = value === selectedValue;
            // Update aria-checked - must be 'true' or 'false' as strings for proper accessibility
            element.setAttribute('aria-checked', isSelected ? 'true' : 'false');
            element.classList.toggle('xwui-switch-option-selected', isSelected);
            
            // Apply colors
            if (isSelected && selectedOption.color) {
                element.style.color = selectedOption.color;
            } else {
                element.style.color = '';
            }
        });
        
        // Update track background color if specified
        const track = this.wrapperElement.querySelector('.xwui-switch-track-multi') as HTMLElement;
        if (track) {
            if (selectedOption.trackColor) {
                track.style.backgroundColor = selectedOption.trackColor;
            } else {
                track.style.backgroundColor = '';
            }
        }
        
        // Update icon colors - reset all, then apply to selected
        this.iconInstances.forEach((icon, value) => {
            if (value === selectedValue && selectedOption.color) {
                icon.setColor(selectedOption.color);
            } else {
                // Reset to default color (undefined clears custom color)
                icon.setColor('');
            }
        });
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        this.multiChangeHandlers = [];
        
        // Destroy icon and tooltip instances
        this.iconInstances.forEach(icon => icon.destroy());
        this.iconInstances.clear();
        this.tooltipInstances.forEach(tooltip => tooltip.destroy());
        this.tooltipInstances.clear();
        this.optionElements.clear();
        
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
            this.inputElement = null;
        }
        
        super.destroy();
    }
}

(XWUISwitch as any).componentName = 'XWUISwitch';

