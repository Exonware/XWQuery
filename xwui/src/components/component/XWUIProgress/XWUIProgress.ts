/**
 * XWUIProgress Component
 * Progress bar with linear and circular variants
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIProgressConfig {
    variant?: 'linear' | 'circular';
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'success' | 'warning' | 'error';
    indeterminate?: boolean;
    showValue?: boolean;
    strokeWidth?: number;
    className?: string;
}

// Data type
export interface XWUIProgressData {
    value?: number;  // 0-100
    label?: string;
}

export class XWUIProgress extends XWUIComponent<XWUIProgressData, XWUIProgressConfig> {
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIProgressData = {},
        conf_comp: XWUIProgressConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIProgressConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIProgressConfig {
        return {
            variant: conf_comp?.variant ?? 'linear',
            size: conf_comp?.size ?? 'medium',
            color: conf_comp?.color ?? 'primary',
            indeterminate: conf_comp?.indeterminate ?? false,
            showValue: conf_comp?.showValue ?? false,
            strokeWidth: conf_comp?.strokeWidth ?? 4,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-progress';
        this.wrapperElement.classList.add(`xwui-progress-${this.config.variant}`);
        this.wrapperElement.classList.add(`xwui-progress-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-progress-${this.config.color}`);
        
        if (this.config.indeterminate) {
            this.wrapperElement.classList.add('xwui-progress-indeterminate');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        this.wrapperElement.setAttribute('role', 'progressbar');
        this.wrapperElement.setAttribute('aria-valuemin', '0');
        this.wrapperElement.setAttribute('aria-valuemax', '100');
        
        if (!this.config.indeterminate && this.data.value !== undefined) {
            this.wrapperElement.setAttribute('aria-valuenow', String(this.data.value));
        }

        // Label
        if (this.data.label) {
            const labelElement = document.createElement('div');
            labelElement.className = 'xwui-progress-label';
            labelElement.textContent = this.data.label;
            this.wrapperElement.appendChild(labelElement);
        }

        if (this.config.variant === 'circular') {
            this.renderCircular();
        } else {
            this.renderLinear();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderLinear(): void {
        const trackElement = document.createElement('div');
        trackElement.className = 'xwui-progress-track';

        const fillElement = document.createElement('div');
        fillElement.className = 'xwui-progress-fill';
        
        if (!this.config.indeterminate && this.data.value !== undefined) {
            fillElement.style.width = `${Math.max(0, Math.min(100, this.data.value))}%`;
        }

        trackElement.appendChild(fillElement);
        this.wrapperElement!.appendChild(trackElement);

        // Value display
        if (this.config.showValue && !this.config.indeterminate && this.data.value !== undefined) {
            const valueElement = document.createElement('span');
            valueElement.className = 'xwui-progress-value';
            valueElement.textContent = `${Math.round(this.data.value)}%`;
            this.wrapperElement!.appendChild(valueElement);
        }
    }

    private renderCircular(): void {
        const sizeMap = { small: 32, medium: 48, large: 64 };
        const size = sizeMap[this.config.size || 'medium'];
        const strokeWidth = this.config.strokeWidth || 4;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const value = this.data.value ?? 0;
        const offset = circumference - (value / 100) * circumference;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
        svg.classList.add('xwui-progress-circular');

        // Background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', String(size / 2));
        bgCircle.setAttribute('cy', String(size / 2));
        bgCircle.setAttribute('r', String(radius));
        bgCircle.setAttribute('fill', 'none');
        bgCircle.setAttribute('stroke-width', String(strokeWidth));
        bgCircle.classList.add('xwui-progress-circular-track');
        svg.appendChild(bgCircle);

        // Progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', String(size / 2));
        progressCircle.setAttribute('cy', String(size / 2));
        progressCircle.setAttribute('r', String(radius));
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke-width', String(strokeWidth));
        progressCircle.setAttribute('stroke-dasharray', String(circumference));
        
        if (!this.config.indeterminate) {
            progressCircle.setAttribute('stroke-dashoffset', String(offset));
        }
        
        progressCircle.classList.add('xwui-progress-circular-fill');
        svg.appendChild(progressCircle);

        this.wrapperElement!.appendChild(svg);

        // Value display in center
        if (this.config.showValue && !this.config.indeterminate && this.data.value !== undefined) {
            const valueElement = document.createElement('span');
            valueElement.className = 'xwui-progress-circular-value';
            valueElement.textContent = `${Math.round(this.data.value)}%`;
            this.wrapperElement!.appendChild(valueElement);
        }
    }

    public getValue(): number | undefined {
        return this.data.value;
    }

    public setValue(value: number): void {
        this.data.value = Math.max(0, Math.min(100, value));
        this.render();
    }

    public setIndeterminate(indeterminate: boolean): void {
        this.config.indeterminate = indeterminate;
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
(XWUIProgress as any).componentName = 'XWUIProgress';


