/**
 * XWUITypography Component
 * Typography/text component with variants
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITypographyConfig {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';
    noWrap?: boolean;
    className?: string;
}

// Data type
export interface XWUITypographyData {
    text: string;
}

export class XWUITypography extends XWUIComponent<XWUITypographyData, XWUITypographyConfig> {
    private typographyElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUITypographyData,
        conf_comp: XWUITypographyConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITypographyConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITypographyConfig {
        return {
            variant: conf_comp?.variant ?? 'body',
            component: conf_comp?.component,
            align: conf_comp?.align,
            color: conf_comp?.color,
            noWrap: conf_comp?.noWrap ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        const tagName = this.config.component || this.getDefaultTag();
        this.typographyElement = document.createElement(tagName);
        this.typographyElement.className = 'xwui-typography';
        this.typographyElement.classList.add(`xwui-typography-${this.config.variant}`);
        
        if (this.config.align) {
            this.typographyElement.style.textAlign = this.config.align;
        }
        if (this.config.color) {
            this.typographyElement.classList.add(`xwui-typography-${this.config.color}`);
        }
        if (this.config.noWrap) {
            this.typographyElement.style.whiteSpace = 'nowrap';
            this.typographyElement.style.overflow = 'hidden';
            this.typographyElement.style.textOverflow = 'ellipsis';
        }
        if (this.config.className) {
            this.typographyElement.classList.add(this.config.className);
        }

        this.typographyElement.textContent = this.data.text;
        this.container.appendChild(this.typographyElement);
    }

    private getDefaultTag(): string {
        if (this.config.variant?.startsWith('h')) {
            return this.config.variant;
        }
        return 'p';
    }

    public setText(text: string): void {
        this.data.text = text;
        if (this.typographyElement) {
            this.typographyElement.textContent = text;
        }
    }

    public getElement(): HTMLElement | null {
        return this.typographyElement;
    }

    public destroy(): void {
        if (this.typographyElement) {
            this.typographyElement.remove();
            this.typographyElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITypography as any).componentName = 'XWUITypography';


