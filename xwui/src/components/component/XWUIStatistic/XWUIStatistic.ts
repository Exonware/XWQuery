/**
 * XWUIStatistic Component
 * Display statistics/counts
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIStatisticConfig {
    title?: string;
    prefix?: string | HTMLElement;
    suffix?: string | HTMLElement;
    valueStyle?: Record<string, any>;
    precision?: number;
    className?: string;
}

export interface XWUIStatisticData {
    value?: number | string;
    formatter?: (value: number) => string;
}

export class XWUIStatistic extends XWUIComponent<XWUIStatisticData, XWUIStatisticConfig> {
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIStatisticData = {},
        conf_comp: XWUIStatisticConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIStatisticConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIStatisticConfig {
        return {
            title: conf_comp?.title,
            prefix: conf_comp?.prefix,
            suffix: conf_comp?.suffix,
            valueStyle: conf_comp?.valueStyle,
            precision: conf_comp?.precision,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-statistic-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-statistic';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Title
        if (this.config.title) {
            const title = document.createElement('div');
            title.className = 'xwui-statistic-title';
            title.textContent = this.config.title;
            this.wrapperElement.appendChild(title);
        }

        // Value container
        const valueContainer = document.createElement('div');
        valueContainer.className = 'xwui-statistic-content';

        // Prefix
        if (this.config.prefix) {
            const prefix = document.createElement('span');
            prefix.className = 'xwui-statistic-prefix';
            if (typeof this.config.prefix === 'string') {
                prefix.textContent = this.config.prefix;
            } else {
                prefix.appendChild(this.config.prefix);
            }
            valueContainer.appendChild(prefix);
        }

        // Value
        const value = document.createElement('span');
        value.className = 'xwui-statistic-value';
        
        const formattedValue = this.formatValue();
        value.textContent = formattedValue;
        
        if (this.config.valueStyle) {
            Object.assign(value.style, this.config.valueStyle);
        }
        
        valueContainer.appendChild(value);

        // Suffix
        if (this.config.suffix) {
            const suffix = document.createElement('span');
            suffix.className = 'xwui-statistic-suffix';
            if (typeof this.config.suffix === 'string') {
                suffix.textContent = this.config.suffix;
            } else {
                suffix.appendChild(this.config.suffix);
            }
            valueContainer.appendChild(suffix);
        }

        this.wrapperElement.appendChild(valueContainer);
        this.container.appendChild(this.wrapperElement);
    }

    private formatValue(): string {
        const value = this.data.value;
        
        if (value === undefined || value === null) {
            return '0';
        }

        if (typeof value === 'string') {
            return value;
        }

        if (typeof value === 'number') {
            if (this.data.formatter) {
                return this.data.formatter(value);
            }
            
            if (this.config.precision !== undefined) {
                return value.toFixed(this.config.precision);
            }
            
            // Format large numbers
            if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
            }
            
            return String(value);
        }

        return String(value);
    }

    public setValue(value: number | string): void {
        this.data.value = value;
        const valueElement = this.wrapperElement?.querySelector('.xwui-statistic-value');
        if (valueElement) {
            valueElement.textContent = this.formatValue();
        }
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIStatistic as any).componentName = 'XWUIStatistic';


