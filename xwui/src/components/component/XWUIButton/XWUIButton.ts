/**
 * XWUIButton Component
 * A button component with various styles and states
 * Uses XWUIItem internally for flexible styling and JSON configuration
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIItem, type ItemConfig, type ContentPart } from '../XWUIItem/XWUIItem';

// Component-level configuration (conf_comp)
export interface XWUIButtonConfig {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
    size?: 'tiny' | 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string; // Additional CSS classes
    border?: 'none' | 'transparent' | 'lightest' | 'default'; // Border control
    // Padding control - overrides size-based padding if provided
    padding?: string | {
        top?: string | number;
        right?: string | number;
        bottom?: string | number;
        left?: string | number;
        vertical?: string | number; // Shorthand for top and bottom
        horizontal?: string | number; // Shorthand for left and right
    };
    // Gap control - spacing between icon and text
    gap?: string | number;
    // Min height control - overrides size-based min-height if provided
    minHeight?: string | number;
    // Title/tooltip - shown on hover, especially useful for icon-only buttons
    title?: string;
    tooltip?: string; // Alias for title
}

// Data type for XWUIButton (text is stored in data)
export interface XWUIButtonData {
    text?: string;
    label?: string; // Alias for text for compatibility
}

export class XWUIButton extends XWUIComponent<XWUIButtonData, XWUIButtonConfig> {
    
    private xwuiItem: XWUIItem | null = null;
    private buttonElement: HTMLButtonElement | null = null;
    private itemConfig!: ItemConfig;
    private clickHandlers: Array<(event: MouseEvent) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIButtonData | string = {},
        conf_comp: XWUIButtonConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Handle string shorthand: convert "Label" to { text: "Label" }
        const normalizedData: XWUIButtonData = typeof data === 'string' 
            ? { text: data } 
            : (data && typeof data === 'object' ? data : {});
        
        super(container, normalizedData, conf_comp, conf_sys, conf_usr);
        
        this.setupDOM();
    }

    /**
     * Create component-specific config
     * Merges conf_comp with defaults
     */
    protected createConfig(
        conf_comp?: XWUIButtonConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIButtonConfig {
        return {
            variant: conf_comp?.variant ?? 'primary',
            size: conf_comp?.size ?? 'medium',
            disabled: conf_comp?.disabled ?? false,
            loading: conf_comp?.loading ?? false,
            icon: conf_comp?.icon,
            iconPosition: conf_comp?.iconPosition ?? 'left',
            fullWidth: conf_comp?.fullWidth ?? false,
            type: conf_comp?.type ?? 'button',
            padding: conf_comp?.padding,
            gap: conf_comp?.gap,
            minHeight: conf_comp?.minHeight,
            className: conf_comp?.className,
            border: conf_comp?.border,
            title: conf_comp?.title ?? conf_comp?.tooltip
        };
    }
    
    /**
     * Get button text from data (supports both 'text' and 'label' properties)
     */
    private getButtonText(): string | undefined {
        return this.data.text !== undefined && this.data.text !== null 
            ? this.data.text 
            : (this.data.label !== undefined && this.data.label !== null ? this.data.label : undefined);
    }

    /**
     * Convert XWUIButtonConfig to ItemConfig for XWUIItem
     */
    private createItemConfig(): ItemConfig {
        const contentParts: ContentPart[] = [];
        
        // Add icon if provided and position is left
        // Note: XWUIItem expects icon names, but we support custom SVG strings
        // For custom SVG, we'll handle it in setupDOM after XWUIItem renders
        if (this.config.icon && this.config.iconPosition === 'left') {
            // Check if it's a known icon name or custom SVG
            const isCustomSVG = this.config.icon.trim().startsWith('<svg');
            if (isCustomSVG) {
                // Store custom SVG to inject later
                contentParts.push({ type: 'text', value: 'ICON_PLACEHOLDER_LEFT' });
            } else {
                contentParts.push({ type: 'icon', value: this.config.icon });
            }
        }
        
        // Add text content (handle empty string as valid text)
        const buttonText = this.getButtonText();
        if (buttonText !== undefined) {
            contentParts.push({ type: 'text', value: buttonText, style: 'bold' });
        }
        
        // Add icon if provided and position is right
        if (this.config.icon && this.config.iconPosition === 'right') {
            const isCustomSVG = this.config.icon.trim().startsWith('<svg');
            if (isCustomSVG) {
                contentParts.push({ type: 'text', value: 'ICON_PLACEHOLDER_RIGHT' });
            } else {
                contentParts.push({ type: 'icon', value: this.config.icon });
            }
        }
        
        // Add loading spinner if loading
        if (this.config.loading) {
            contentParts.push({ type: 'text', value: '⟳' });
        }
        
        // Ensure primaryContent is never empty (required by XWUIItem)
        if (contentParts.length === 0) {
            contentParts.push({ type: 'text', value: '' });
        }
        
        // Map button size to item size
        const sizeMap: Record<string, 'xs' | 's' | 'm' | 'l' | 'xl'> = {
            'small': 's',
            'medium': 'm',
            'large': 'l'
        };
        
        // Map button variant to item status/background
        const variantMap: Record<string, 'before_start' | 'processing' | 'error' | 'pass' | undefined> = {
            'primary': 'processing',  // Blue
            'secondary': 'pass',      // No background
            'success': 'pass',         // No background (will use custom color)
            'danger': 'error',         // Red
            'warning': 'before_start', // Yellow
            'info': 'processing',     // Blue
            'outline': 'pass',        // No background
            'ghost': 'pass'           // No background
        };
        
        const itemConfig: ItemConfig = {
            // uid is optional - will be auto-generated by XWUIComponent if not provided
            id: `xwui-button-${Date.now()}-${Math.random()}`,
            item_type: 'row',
            item_size: sizeMap[this.config.size || 'medium'] || 'm',
            status: variantMap[this.config.variant || 'primary'],
            primaryContent: contentParts,
            itemActionsSettings: {
                canClick: !this.config.disabled && !this.config.loading
            },
            itemStates: {
                isSelected: false
            }
        };
        
        // Add custom background colors for variants that don't map to status
        if (this.config.variant === 'success') {
            itemConfig.background_color = '#10b981'; // Green
        } else if (this.config.variant === 'outline') {
            itemConfig.background_color = 'transparent';
        } else if (this.config.variant === 'ghost') {
            itemConfig.background_color = 'transparent';
        }
        
        return itemConfig;
    }
    
    /**
     * Format padding value to CSS string
     */
    private formatPadding(padding: XWUIButtonConfig['padding']): string | undefined {
        if (!padding) return undefined;
        
        if (typeof padding === 'string') {
            return padding;
        }
        
        // Handle object format
        const top = padding.vertical ?? padding.top ?? '0';
        const right = padding.horizontal ?? padding.right ?? '0';
        const bottom = padding.vertical ?? padding.bottom ?? '0';
        const left = padding.horizontal ?? padding.left ?? '0';
        
        // Format values (add 'px' if number)
        const formatValue = (val: string | number): string => {
            if (typeof val === 'number') return `${val}px`;
            return val;
        };
        
        // If all sides are the same, use shorthand
        if (formatValue(top) === formatValue(right) && 
            formatValue(right) === formatValue(bottom) && 
            formatValue(bottom) === formatValue(left)) {
            return formatValue(top);
        }
        
        // If vertical and horizontal are the same, use shorthand
        if (padding.vertical !== undefined && padding.horizontal !== undefined &&
            formatValue(padding.vertical) === formatValue(padding.horizontal)) {
            return `${formatValue(padding.vertical)} ${formatValue(padding.horizontal)}`;
        }
        
        // Full 4-value format
        return `${formatValue(top)} ${formatValue(right)} ${formatValue(bottom)} ${formatValue(left)}`;
    }
    
    /**
     * Format gap value to CSS string
     */
    private formatGap(gap: string | number | undefined): string | undefined {
        if (gap === undefined) return undefined;
        if (typeof gap === 'number') return `${gap}px`;
        return gap;
    }
    
    /**
     * Format minHeight value to CSS string
     */
    private formatMinHeight(minHeight: string | number | undefined): string | undefined {
        if (minHeight === undefined) return undefined;
        if (typeof minHeight === 'number') return `${minHeight}px`;
        return minHeight;
    }

    /**
     * Setup DOM structure using XWUIItem
     */
    private setupDOM(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-button-container';
        
        if (this.config.fullWidth) {
            this.container.style.width = '100%';
        }
        
        // Create item config
        this.itemConfig = this.createItemConfig();
        
        // Create a wrapper div for XWUIItem
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'xwui-button-item-wrapper';
        this.container.appendChild(itemWrapper);
        
        // Create XWUIItem instance - pass ItemConfig directly as data
        this.xwuiItem = new XWUIItem(itemWrapper, this.itemConfig);
        this.registerChildComponent(this.xwuiItem);
        
        // Get the rendered item element and wrap it in a button
        const itemElement = itemWrapper.querySelector('.xwui-item');
        if (itemElement) {
            // Create button element
            this.buttonElement = document.createElement('button');
            this.buttonElement.type = this.config.type || 'button';
            this.buttonElement.className = 'xwui-button';
            this.buttonElement.classList.add(`xwui-button-${this.config.variant || 'primary'}`);
            this.buttonElement.classList.add(`xwui-button-${this.config.size || 'medium'}`);
            this.buttonElement.disabled = (this.config.disabled || this.config.loading) ?? false;
            
            // Apply padding from config (overrides size-based padding)
            const padding = this.formatPadding(this.config.padding);
            if (padding) {
                this.buttonElement.style.padding = padding;
            }
            
            // Apply gap from config (overrides default gap)
            const gap = this.formatGap(this.config.gap);
            if (gap !== undefined) {
                this.buttonElement.style.gap = gap;
            }
            
            // Apply minHeight from config (overrides size-based min-height)
            const minHeight = this.formatMinHeight(this.config.minHeight);
            if (minHeight) {
                this.buttonElement.style.minHeight = minHeight;
            }
            
            // Apply custom className if provided
            if (this.config.className) {
                this.buttonElement.classList.add(...this.config.className.split(' '));
            }
            
            // Apply border setting
            if (this.config.border === 'none') {
                this.buttonElement.style.border = 'none';
            } else if (this.config.border === 'transparent') {
                this.buttonElement.style.borderColor = 'transparent';
            } else if (this.config.border === 'lightest') {
                // Lightest border: 1px with lightest border color
                this.buttonElement.style.borderWidth = '1px';
                this.buttonElement.style.borderStyle = 'solid';
                this.buttonElement.style.borderColor = 'var(--border-color-lightest, rgba(0, 0, 0, 0.05))';
            }
            
            if (this.config.fullWidth) {
                this.buttonElement.classList.add('xwui-button-full-width');
                this.buttonElement.style.width = '100%';
            }
            
            if (this.config.loading) {
                this.buttonElement.classList.add('xwui-button-loading');
            }
            
            if (this.config.disabled) {
                this.buttonElement.classList.add('xwui-button-disabled');
            }
            
            // Copy item element's content and styles to button
            let itemHTML = itemElement.innerHTML;
            
            // Replace icon placeholders with actual custom SVG if provided
            if (this.config.icon) {
                const isCustomSVG = this.config.icon.trim().startsWith('<svg');
                if (isCustomSVG) {
                    const iconHTML = `<span class="xwui-button-icon" style="display: inline-flex; align-items: center; justify-content: center;">${this.config.icon}</span>`;
                    // Replace placeholder text with icon
                    itemHTML = itemHTML.replace(/ICON_PLACEHOLDER_LEFT/g, iconHTML);
                    itemHTML = itemHTML.replace(/ICON_PLACEHOLDER_RIGHT/g, iconHTML);
                }
            }
            
            // Remove any empty text nodes or whitespace-only text for icon-only buttons
            const buttonText = this.getButtonText();
            if (!buttonText || buttonText.trim() === '') {
                // Remove text content but keep icons
                itemHTML = itemHTML.replace(/<span[^>]*class="[^"]*xwui-item-text[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '');
                itemHTML = itemHTML.replace(/<span[^>]*class="[^"]*xwui-button-text[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '');
            }
            
            if (this.buttonElement) {
                this.buttonElement.innerHTML = itemHTML;
                if (itemElement instanceof HTMLElement) {
                    this.buttonElement.style.cssText = itemElement.style.cssText;
                }
                
                // Copy classes from item element (for status colors, etc.)
                const btnEl = this.buttonElement; // Store reference for TypeScript narrowing
                Array.from(itemElement.classList).forEach(cls => {
                    if (cls.startsWith('xwui-item-status-') || cls.startsWith('xwui-item-size-')) {
                        btnEl.classList.add(cls);
                    }
                });
            }
            
            // Ensure button has accessible label and add icon-only class
            if (this.buttonElement) {
                const hasText = this.buttonElement.textContent?.trim();
                const hasIcon = this.config.icon || this.buttonElement.querySelector('.xwui-button-icon, .xwui-item-icon');
                
                // Add icon-only class if button has icon but no text
                if (!hasText && hasIcon) {
                    this.buttonElement.classList.add('xwui-button-icon-only');
                    if (!this.buttonElement.getAttribute('aria-label')) {
                        // If button has icon but no text, add aria-label from button text or config
                        const buttonText = this.getButtonText();
                        const ariaLabel = buttonText || this.config.icon?.replace(/<[^>]*>/g, '').trim() || 'Button';
                        this.buttonElement.setAttribute('aria-label', ariaLabel);
                    }
                } else {
                    this.buttonElement.classList.remove('xwui-button-icon-only');
                }
            }
            
            // Replace item wrapper with button
            itemWrapper.replaceWith(this.buttonElement);
        } else {
            // Fallback: create button directly if XWUIItem didn't render
            this.buttonElement = document.createElement('button');
            this.buttonElement.type = this.config.type || 'button';
            this.buttonElement.className = this.getButtonClasses();
            this.buttonElement.disabled = (this.config.disabled || this.config.loading) ?? false;
            
            if (this.config.icon) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'xwui-button-icon';
                iconSpan.innerHTML = this.config.icon;
                this.buttonElement.appendChild(iconSpan);
            }
            
            const buttonText = this.getButtonText();
            if (buttonText) {
                this.buttonElement.textContent = buttonText;
            }
            
            // Ensure button has accessible label and add icon-only class
            if (!this.buttonElement.textContent?.trim() && this.config.icon) {
                this.buttonElement.classList.add('xwui-button-icon-only');
                const ariaLabel = buttonText || 'Button';
                this.buttonElement.setAttribute('aria-label', ariaLabel);
            }
            
            this.container.appendChild(this.buttonElement);
        }
        
        // Add tooltip for icon-only buttons if title is provided
        this.setupTooltip();
    }
    
    /**
     * Setup tooltip for icon-only buttons
     */
    private setupTooltip(): void {
        if (!this.buttonElement) return;
        
        const title = this.config.title || this.config.tooltip;
        if (!title) return;
        
        // Check if button is icon-only (no visible text)
        const hasText = this.buttonElement.textContent?.trim();
        const isIconOnly = !hasText && (
            this.config.icon || 
            this.buttonElement.querySelector('.xwui-button-icon, .xwui-item-icon, .xwui-icon')
        );
        
        // Only add tooltip for icon-only buttons or if explicitly requested
        if (isIconOnly || !hasText) {
            // Use async import to avoid circular dependencies
            (async () => {
                try {
                    const { XWUITooltip } = await import('../XWUITooltip/index');
                    
                    // Create tooltip container
                    const tooltipContainer = document.createElement('div');
                    tooltipContainer.style.display = 'contents'; // Doesn't affect layout
                    this.container.appendChild(tooltipContainer);
                    
                    // Create tooltip
                    if (this.buttonElement) {
                        const tooltip = new XWUITooltip(
                            tooltipContainer,
                            {
                                content: title,
                                target: this.buttonElement
                            },
                            {
                                placement: 'top',
                                trigger: 'hover',
                                delay: 200
                            },
                            this.conf_sys,
                            this.conf_usr
                        );
                        
                        this.registerChildComponent(tooltip);
                    }
                } catch (error) {
                    // Fallback to native title attribute if tooltip component fails to load
                    console.warn('Failed to load XWUITooltip, using native title attribute:', error);
                    if (this.buttonElement) {
                        this.buttonElement.setAttribute('title', title);
                    }
                }
            })();
        } else {
            // For buttons with text, use native title attribute as fallback
            this.buttonElement.setAttribute('title', title);
        }
    }
    
    /**
     * Get button CSS classes based on config (fallback)
     */
    private getButtonClasses(): string {
        const classes = ['xwui-button'];
        classes.push(`xwui-button-${this.config.variant}`);
        classes.push(`xwui-button-${this.config.size}`);
        
        if (this.config.fullWidth) {
            classes.push('xwui-button-full-width');
        }
        
        if (this.config.loading) {
            classes.push('xwui-button-loading');
        }
        
        if (this.config.disabled) {
            classes.push('xwui-button-disabled');
        }
        
        return classes.join(' ');
    }


    /**
     * Set button text
     */
    public setText(text: string): void {
        this.data.text = text;
        // Recreate item config with new text
        this.itemConfig = this.createItemConfig();
        // Re-render the button
        this.setupDOM();
        // Re-attach event listeners if needed
        this.reattachListeners();
    }
    

    /**
     * Set button variant
     */
    public setVariant(variant: XWUIButtonConfig['variant']): void {
        if (!variant) return;
        
        this.config.variant = variant;
        // Re-render the button
        this.setupDOM();
        this.reattachListeners();
    }

    /**
     * Set button size
     */
    public setSize(size: XWUIButtonConfig['size']): void {
        if (!size) return;
        
        this.config.size = size;
        // Re-render the button
        this.setupDOM();
        this.reattachListeners();
    }

    /**
     * Set disabled state
     */
    public setDisabled(disabled: boolean): void {
        this.config.disabled = disabled;
        if (this.buttonElement) {
            this.buttonElement.disabled = (disabled || this.config.loading) ?? false;
            
            if (disabled) {
                this.buttonElement.classList.add('xwui-button-disabled');
            } else {
                this.buttonElement.classList.remove('xwui-button-disabled');
            }
        }
        // Update item config to reflect disabled state
        this.itemConfig = this.createItemConfig();
        if (this.xwuiItem) {
            this.xwuiItem.updateData(this.itemConfig);
        }
    }

    /**
     * Set loading state
     */
    public setLoading(loading: boolean): void {
        this.config.loading = loading;
        // Recreate item config with loading state
        this.itemConfig = this.createItemConfig();
        // Update XWUIItem
        if (this.xwuiItem) {
            this.xwuiItem.updateData(this.itemConfig);
            // Update button content from item
            const itemElement = this.container.querySelector('.xwui-item');
            if (itemElement && this.buttonElement) {
                this.buttonElement.innerHTML = itemElement.innerHTML;
            }
        }
        // Update button state
        if (this.buttonElement) {
            this.buttonElement.disabled = this.config.disabled || loading;
            if (loading) {
                this.buttonElement.classList.add('xwui-button-loading');
            } else {
                this.buttonElement.classList.remove('xwui-button-loading');
            }
        }
    }

    /**
     * Add click event listener
     */
    public onClick(handler: (event: MouseEvent) => void): void {
        this.clickHandlers.push(handler);
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', handler);
        }
    }

    /**
     * Remove click event listener
     */
    public offClick(handler: (event: MouseEvent) => void): void {
        this.clickHandlers = this.clickHandlers.filter(h => h !== handler);
        if (this.buttonElement) {
            this.buttonElement.removeEventListener('click', handler);
        }
    }
    
    /**
     * Re-attach event listeners after DOM update
     */
    private reattachListeners(): void {
        // Re-attach all click handlers
        this.clickHandlers.forEach((handler: (event: MouseEvent) => void) => {
            if (this.buttonElement) {
                this.buttonElement.addEventListener('click', handler);
            }
        });
    }
    
    /**
     * Update button configuration from JSON (ItemConfig)
     * Helper method for backward compatibility
     */
    public updateFromItemConfig(itemConfig: ItemConfig): void {
        this.itemConfig = itemConfig;
        // Extract text from ItemConfig
        if (itemConfig.primaryContent && itemConfig.primaryContent.length > 0) {
            const textPart = itemConfig.primaryContent.find(part => part.type === 'text');
            this.data.text = textPart ? String(textPart.value) : '';
        }
        // Extract config from ItemConfig
        const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
            'xs': 'small', 's': 'small', 'm': 'medium', 'l': 'large', 'xl': 'large'
        };
        const variantMap: Record<string, 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost'> = {
            'before_start': 'warning', 'processing': 'primary', 'error': 'danger', 'pass': 'secondary'
        };
        this.config = {
            ...this.config,
            variant: variantMap[itemConfig.status || 'pass'] || 'primary',
            size: sizeMap[itemConfig.item_size || 'm'] || 'medium',
            disabled: !itemConfig.itemActionsSettings?.canClick || false
        };
        this.setupDOM();
        this.reattachListeners();
    }

    /**
     * Get the native button element
     */
    public getButtonElement(): HTMLButtonElement | null {
        return this.buttonElement;
    }

    public destroy(): void {
        // Child component (xwuiItem) is automatically destroyed by base class
        // Clean up event listeners
        if (this.buttonElement) {
            this.buttonElement.replaceWith(this.buttonElement.cloneNode(true));
        }
        // Clear references
        this.xwuiItem = null;
        this.buttonElement = null;
        this.clickHandlers = [];
        // Call parent to clean up registered child components
        super.destroy();
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIButton as any).componentName = 'XWUIButton';

// Note: Custom Element is registered via createXWUIElement() in index.ts

