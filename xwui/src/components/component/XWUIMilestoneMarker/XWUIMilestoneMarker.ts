/**
 * XWUIMilestoneMarker Component
 * Visual milestone indicators in timeline and project views
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';
import { XWUITooltip } from '../XWUITooltip/XWUITooltip';

// Component-level configuration
export interface XWUIMilestoneMarkerConfig {
    variant?: 'default' | 'compact' | 'detailed';
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
    showProgress?: boolean;
    className?: string;
}

// Data type
export interface XWUIMilestoneMarkerData {
    label?: string;
    date?: Date | string;
    progress?: number; // 0-100
    completed?: boolean;
    color?: string;
    icon?: string;
}

export class XWUIMilestoneMarker extends XWUIComponent<XWUIMilestoneMarkerData, XWUIMilestoneMarkerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private tooltip: XWUITooltip | null = null;
    private clickHandlers: Array<(data: XWUIMilestoneMarkerData) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIMilestoneMarkerData = {},
        conf_comp: XWUIMilestoneMarkerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMilestoneMarkerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMilestoneMarkerConfig {
        return {
            variant: conf_comp?.variant ?? 'default',
            size: conf_comp?.size ?? 'medium',
            showLabel: conf_comp?.showLabel ?? true,
            showProgress: conf_comp?.showProgress ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-milestone-marker';
        this.wrapperElement.classList.add(`xwui-milestone-marker-${this.config.variant}`);
        this.wrapperElement.classList.add(`xwui-milestone-marker-${this.config.size}`);
        
        if (this.data.completed) {
            this.wrapperElement.classList.add('xwui-milestone-marker-completed');
        }
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Main marker
        const marker = document.createElement('div');
        marker.className = 'xwui-milestone-marker-icon';
        
        if (this.data.color) {
            marker.style.backgroundColor = this.data.color;
        }

        if (this.data.icon) {
            marker.innerHTML = this.data.icon;
        } else {
            marker.innerHTML = this.data.completed ? '✓' : '◆';
        }

        this.wrapperElement.appendChild(marker);

        // Label
        if (this.config.showLabel && this.data.label && this.config.variant !== 'compact') {
            const label = document.createElement('div');
            label.className = 'xwui-milestone-marker-label';
            label.textContent = this.data.label;
            this.wrapperElement.appendChild(label);
        }

        // Progress
        if (this.config.showProgress && this.data.progress !== undefined && this.config.variant === 'detailed') {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'xwui-milestone-marker-progress';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'xwui-milestone-marker-progress-bar';
            const progressFill = document.createElement('div');
            progressFill.className = 'xwui-milestone-marker-progress-fill';
            progressFill.style.width = `${Math.max(0, Math.min(100, this.data.progress))}%`;
            
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);
            
            const progressText = document.createElement('span');
            progressText.className = 'xwui-milestone-marker-progress-text';
            progressText.textContent = `${Math.round(this.data.progress || 0)}%`;
            progressContainer.appendChild(progressText);
            
            this.wrapperElement.appendChild(progressContainer);
        }

        // Tooltip
        if (this.data.label || this.data.date) {
            const tooltipContent = this.createTooltipContent();
            this.tooltip = new XWUITooltip(this.wrapperElement, {
                content: tooltipContent,
                placement: 'top'
            });
        }

        // Click handler
        this.wrapperElement.addEventListener('click', () => {
            this.clickHandlers.forEach(handler => handler({ ...this.data }));
        });

        this.container.appendChild(this.wrapperElement);
    }

    private createTooltipContent(): string {
        const parts: string[] = [];
        if (this.data.label) {
            parts.push(`<strong>${this.data.label}</strong>`);
        }
        if (this.data.date) {
            const date = typeof this.data.date === 'string' ? new Date(this.data.date) : this.data.date;
            parts.push(date.toLocaleDateString());
        }
        if (this.data.progress !== undefined) {
            parts.push(`Progress: ${Math.round(this.data.progress)}%`);
        }
        if (this.data.completed) {
            parts.push('✓ Completed');
        }
        return parts.join('<br>');
    }

    public setCompleted(completed: boolean): void {
        this.data.completed = completed;
        this.render();
    }

    public setProgress(progress: number): void {
        this.data.progress = Math.max(0, Math.min(100, progress));
        this.render();
    }

    public onClick(handler: (data: XWUIMilestoneMarkerData) => void): void {
        this.clickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.clickHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMilestoneMarker as any).componentName = 'XWUIMilestoneMarker';


