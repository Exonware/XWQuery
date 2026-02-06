/**
 * XWUITimeline Component - Production Quality
 * High-performance timeline with MUI-like features and 100% styles system integration
 * Features: Semantic HTML, ARIA attributes, theme colors, multiple positioning modes,
 * opposite content support, icon customization, smooth animations, accessibility
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Type definitions
export type TimelinePosition = 'left' | 'right' | 'alternate' | 'alternate-reverse';
export type TimelineColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'grey';
export type TimelineDotVariant = 'filled' | 'outlined' | 'default';

export interface XWUITimelineItem {
    id: string;
    title: string;
    description?: string;
    date?: string;
    oppositeContent?: string; // Content on opposite side (for alternate modes)
    icon?: string | HTMLElement;
    color?: TimelineColor | string; // Theme color or custom color string
    dotVariant?: TimelineDotVariant;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    className?: string;
    onClick?: (item: XWUITimelineItem, index: number, event: MouseEvent) => void;
}

// Component-level configuration
export interface XWUITimelineConfig {
    position?: TimelinePosition;
    mode?: 'left' | 'right' | 'alternate'; // Deprecated: use 'position' instead, kept for backward compatibility
    className?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    // Animation
    animateOnRender?: boolean;
    animationDuration?: number;
    // Styling
    dotSize?: 'small' | 'medium' | 'large';
    connectorWidth?: number;
}

// Data type
export interface XWUITimelineData {
    items: XWUITimelineItem[];
}

export class XWUITimeline extends XWUIComponent<XWUITimelineData, XWUITimelineConfig> {
    private timelineElement: HTMLElement | null = null;
    private itemElements: HTMLElement[] = [];

    constructor(
        container: HTMLElement,
        data: XWUITimelineData,
        conf_comp: XWUITimelineConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupDOM();
    }

    protected createConfig(
        conf_comp?: XWUITimelineConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITimelineConfig {
        // Backward compatibility: 'mode' maps to 'position'
        const position = conf_comp?.position ?? 
            (conf_comp?.mode as TimelinePosition | undefined) ?? 
            'left';
        
        return {
            position,
            className: conf_comp?.className,
            ariaLabel: conf_comp?.ariaLabel,
            ariaLabelledBy: conf_comp?.ariaLabelledBy,
            animateOnRender: conf_comp?.animateOnRender ?? false,
            animationDuration: conf_comp?.animationDuration ?? 300,
            dotSize: conf_comp?.dotSize ?? 'medium',
            connectorWidth: conf_comp?.connectorWidth
        };
    }

    private setupDOM(): void {
        this.container.innerHTML = '';

        // Create semantic <ul> element (MUI pattern)
        this.timelineElement = document.createElement('ul');
        this.timelineElement.className = 'xwui-timeline';
        this.timelineElement.setAttribute('role', 'list');
        this.timelineElement.classList.add(`xwui-timeline--position-${this.config.position}`);
        
        // ARIA attributes
        if (this.config.ariaLabel) {
            this.timelineElement.setAttribute('aria-label', this.config.ariaLabel);
        }
        if (this.config.ariaLabelledBy) {
            this.timelineElement.setAttribute('aria-labelledby', this.config.ariaLabelledBy);
        }
        
        // Data attributes for testing/debugging
        this.timelineElement.setAttribute('data-timeline-items', String(this.data.items.length));
        
        if (this.config.className) {
            this.timelineElement.classList.add(this.config.className);
        }

        // Dot size variant
        if (this.config.dotSize) {
            this.timelineElement.classList.add(`xwui-timeline--dot-${this.config.dotSize}`);
        }

        // Create timeline items
        this.itemElements = [];
        this.data.items.forEach((item, index) => {
            const timelineItem = this.createTimelineItem(item, index);
            this.timelineElement!.appendChild(timelineItem);
            this.itemElements.push(timelineItem);
        });

        this.container.appendChild(this.timelineElement);

        // Animate on render if enabled
        if (this.config.animateOnRender) {
            requestAnimationFrame(() => {
                this.animateItems();
            });
        }
    }

    private createTimelineItem(item: XWUITimelineItem, index: number): HTMLElement {
        // Create semantic <li> element (MUI pattern)
        const timelineItem = document.createElement('li');
        timelineItem.className = 'xwui-timeline__item';
        timelineItem.setAttribute('role', 'listitem');
        timelineItem.setAttribute('data-item-index', String(index));
        timelineItem.setAttribute('data-item-id', item.id);
        
        // Position class based on mode
        const position = this.getEffectivePosition(index);
        timelineItem.classList.add(`xwui-timeline__item--position-${position}`);
        
        // Missing opposite content class (MUI pattern)
        if (!item.oppositeContent && (this.config.position === 'alternate' || this.config.position === 'alternate-reverse')) {
            timelineItem.classList.add('xwui-timeline__item--missing-opposite-content');
        }
        
        if (item.className) {
            timelineItem.classList.add(item.className);
        }

        // ARIA attributes for item
        if (item.ariaLabel) {
            timelineItem.setAttribute('aria-label', item.ariaLabel);
        } else {
            timelineItem.setAttribute('aria-label', `${item.title}${item.date ? ` - ${item.date}` : ''}`);
        }
        
        if (item.ariaDescribedBy) {
            timelineItem.setAttribute('aria-describedby', item.ariaDescribedBy);
        }

        // Click handler
        if (item.onClick) {
            timelineItem.style.cursor = 'pointer';
            timelineItem.setAttribute('tabindex', '0');
            timelineItem.setAttribute('role', 'button');
            timelineItem.addEventListener('click', (e) => {
                item.onClick!(item, index, e);
            });
            timelineItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.onClick!(item, index, e as any);
                }
            });
        }

        // Timeline Separator (MUI pattern: contains dot and connector)
        const separator = document.createElement('div');
        separator.className = 'xwui-timeline__separator';
        
        // Timeline Dot (MUI pattern)
        const dot = this.createTimelineDot(item, index);
        separator.appendChild(dot);
        
        // Timeline Connector (MUI pattern: line between items)
        if (index < this.data.items.length - 1) {
            const connector = this.createTimelineConnector(index);
            separator.appendChild(connector);
        }
        
        timelineItem.appendChild(separator);

        // Timeline Content (MUI pattern)
        const content = this.createTimelineContent(item, index);
        timelineItem.appendChild(content);

        // Opposite Content (for alternate modes)
        if (item.oppositeContent && (this.config.position === 'alternate' || this.config.position === 'alternate-reverse')) {
            const oppositeContent = document.createElement('div');
            oppositeContent.className = 'xwui-timeline__opposite-content';
            oppositeContent.textContent = item.oppositeContent;
            timelineItem.appendChild(oppositeContent);
        }

        return timelineItem;
    }

    private createTimelineDot(item: XWUITimelineItem, index: number): HTMLElement {
        const dot = document.createElement('span');
        dot.className = 'xwui-timeline__dot';
        
        const variant = item.dotVariant ?? 'filled';
        dot.classList.add(`xwui-timeline__dot--${variant}`);
        
        // Color handling
        if (item.color) {
            // Check if it's a theme color
            const themeColors: TimelineColor[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'grey'];
            if (themeColors.includes(item.color as TimelineColor)) {
                dot.classList.add(`xwui-timeline__dot--color-${item.color}`);
                if (variant === 'filled') {
                    dot.classList.add(`xwui-timeline__dot--filled-${item.color}`);
                }
            } else {
                // Custom color
                if (variant === 'filled') {
                    dot.style.backgroundColor = item.color;
                } else if (variant === 'outlined') {
                    dot.style.borderColor = item.color;
                }
            }
        } else {
            // Default to primary
            dot.classList.add('xwui-timeline__dot--color-primary');
            if (variant === 'filled') {
                dot.classList.add('xwui-timeline__dot--filled-primary');
            }
        }
        
        // Icon or inner dot
        if (item.icon) {
            if (typeof item.icon === 'string') {
                dot.innerHTML = item.icon;
            } else {
                dot.appendChild(item.icon.cloneNode(true) as HTMLElement);
            }
            dot.classList.add('xwui-timeline__dot--with-icon');
        } else if (variant === 'filled' || variant === 'default') {
            const innerDot = document.createElement('span');
            innerDot.className = 'xwui-timeline__dot-inner';
            dot.appendChild(innerDot);
        }
        
        dot.setAttribute('aria-hidden', 'true');
        dot.setAttribute('data-dot-index', String(index));
        
        return dot;
    }

    private createTimelineConnector(index: number): HTMLElement {
        const connector = document.createElement('span');
        connector.className = 'xwui-timeline__connector';
        connector.setAttribute('aria-hidden', 'true');
        
        if (this.config.connectorWidth) {
            connector.style.width = `${this.config.connectorWidth}px`;
        }
        
        return connector;
    }

    private createTimelineContent(item: XWUITimelineItem, index: number): HTMLElement {
        const content = document.createElement('div');
        content.className = 'xwui-timeline__content';
        content.setAttribute('data-content-index', String(index));
        
        // Date
        if (item.date) {
            const date = document.createElement('div');
            date.className = 'xwui-timeline__date';
            date.textContent = item.date;
            content.appendChild(date);
        }

        // Title
        const title = document.createElement('div');
        title.className = 'xwui-timeline__title';
        title.textContent = item.title;
        content.appendChild(title);

        // Description
        if (item.description) {
            const desc = document.createElement('div');
            desc.className = 'xwui-timeline__description';
            desc.textContent = item.description;
            content.appendChild(desc);
        }

        return content;
    }

    private getEffectivePosition(index: number): string {
        const position = this.config.position ?? 'left';
        
        if (position === 'alternate') {
            return index % 2 === 0 ? 'left' : 'right';
        } else if (position === 'alternate-reverse') {
            return index % 2 === 0 ? 'right' : 'left';
        }
        
        return position;
    }

    private animateItems(): void {
        this.itemElements.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50); // Stagger animation
        });
    }

    public updateItem(itemId: string, updates: Partial<XWUITimelineItem>): void {
        const index = this.data.items.findIndex(item => item.id === itemId);
        if (index === -1) return;
        
        this.data.items[index] = { ...this.data.items[index], ...updates };
        this.setupDOM();
    }

    public addItem(item: XWUITimelineItem, index?: number): void {
        if (index !== undefined) {
            this.data.items.splice(index, 0, item);
        } else {
            this.data.items.push(item);
        }
        this.setupDOM();
    }

    public removeItem(itemId: string): void {
        this.data.items = this.data.items.filter(item => item.id !== itemId);
        this.setupDOM();
    }

    public getItem(itemId: string): XWUITimelineItem | undefined {
        return this.data.items.find(item => item.id === itemId);
    }

    public getItems(): XWUITimelineItem[] {
        return [...this.data.items];
    }

    public getElement(): HTMLElement | null {
        return this.timelineElement;
    }

    public destroy(): void {
        this.itemElements = [];
        if (this.timelineElement) {
            this.timelineElement.remove();
            this.timelineElement = null;
        }
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITimeline as any).componentName = 'XWUITimeline';


