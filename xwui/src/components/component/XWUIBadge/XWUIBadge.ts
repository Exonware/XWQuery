/**
 * XWUIBadge Component
 * Count/status badge
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIBadgeConfig {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    size?: 'small' | 'medium' | 'large';
    dot?: boolean;
    max?: number;
    showZero?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    standalone?: boolean;
    className?: string;
}

// Data type
export interface XWUIBadgeData {
    count?: number;
    text?: string;
}

export class XWUIBadge extends XWUIComponent<XWUIBadgeData, XWUIBadgeConfig> {
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIBadgeData = {},
        conf_comp: XWUIBadgeConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIBadgeConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBadgeConfig {
        return {
            variant: conf_comp?.variant ?? 'error',
            size: conf_comp?.size ?? 'medium',
            dot: conf_comp?.dot ?? false,
            max: conf_comp?.max ?? 99,
            showZero: conf_comp?.showZero ?? false,
            position: conf_comp?.position ?? 'top-right',
            standalone: conf_comp?.standalone ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        const count = this.data.count ?? 0;
        const shouldShow = this.config.dot || this.data.text || count > 0 || this.config.showZero;

        if (!shouldShow && !this.config.standalone) {
            return;
        }

        this.wrapperElement = document.createElement('span');
        this.wrapperElement.className = 'xwui-badge';
        this.wrapperElement.classList.add(`xwui-badge-${this.config.variant}`);
        this.wrapperElement.classList.add(`xwui-badge-${this.config.size}`);
        
        if (this.config.dot) {
            this.wrapperElement.classList.add('xwui-badge-dot');
        }
        if (!this.config.standalone) {
            this.wrapperElement.classList.add(`xwui-badge-${this.config.position}`);
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Content
        if (!this.config.dot) {
            if (this.data.text) {
                this.wrapperElement.textContent = this.data.text;
            } else if (count > 0 || this.config.showZero) {
                const displayCount = count > (this.config.max || 99) 
                    ? `${this.config.max}+` 
                    : String(count);
                this.wrapperElement.textContent = displayCount;
            }
        }

        this.container.appendChild(this.wrapperElement);
    }

    public setCount(count: number): void {
        this.data.count = count;
        this.render();
    }

    public setText(text: string): void {
        this.data.text = text;
        this.render();
    }

    public increment(): void {
        this.data.count = (this.data.count || 0) + 1;
        this.render();
    }

    public decrement(): void {
        this.data.count = Math.max(0, (this.data.count || 0) - 1);
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBadge as any).componentName = 'XWUIBadge';


