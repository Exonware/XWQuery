/**
 * XWUIChart Component
 * Chart component (basic implementation - can be extended with chart libraries)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

export interface XWUIChartDataPoint {
    x: number | string;
    y: number;
    label?: string;
}

export interface XWUIChartSeries {
    name: string;
    data: XWUIChartDataPoint[];
    color?: string;
}

// Component-level configuration
export interface XWUIChartConfig {
    type?: 'line' | 'bar' | 'pie' | 'area';
    width?: number;
    height?: number;
    showLegend?: boolean;
    showGrid?: boolean;
    className?: string;
}

// Data type
export interface XWUIChartData {
    series: XWUIChartSeries[];
    title?: string;
}

export class XWUIChart extends XWUIComponent<XWUIChartData, XWUIChartConfig> {
    private chartElement: HTMLElement | null = null;
    private svgElement: SVGElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIChartData,
        conf_comp: XWUIChartConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIChartConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIChartConfig {
        return {
            type: conf_comp?.type ?? 'line',
            width: conf_comp?.width ?? 400,
            height: conf_comp?.height ?? 300,
            showLegend: conf_comp?.showLegend ?? true,
            showGrid: conf_comp?.showGrid ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.chartElement = document.createElement('div');
        this.chartElement.className = 'xwui-chart';
        this.chartElement.classList.add(`xwui-chart-${this.config.type}`);
        
        if (this.config.className) {
            this.chartElement.classList.add(this.config.className);
        }

        // Title
        if (this.data.title) {
            const title = document.createElement('div');
            title.className = 'xwui-chart-title';
            title.textContent = this.data.title;
            this.chartElement.appendChild(title);
        }

        // SVG container
        const svgContainer = document.createElement('div');
        svgContainer.className = 'xwui-chart-svg-container';
        
        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgElement.setAttribute('width', String(this.config.width));
        this.svgElement.setAttribute('height', String(this.config.height));
        this.svgElement.setAttribute('viewBox', `0 0 ${this.config.width} ${this.config.height}`);
        
        this.renderChart();
        svgContainer.appendChild(this.svgElement);
        this.chartElement.appendChild(svgContainer);

        // Legend
        if (this.config.showLegend) {
            const legend = this.createLegend();
            this.chartElement.appendChild(legend);
        }

        this.container.appendChild(this.chartElement);
    }

    private renderChart(): void {
        if (!this.svgElement) return;

        // Clear previous content
        this.svgElement.innerHTML = '';

        const width = this.config.width || 400;
        const height = this.config.height || 300;
        const padding = 40;

        // Grid
        if (this.config.showGrid) {
            for (let i = 0; i <= 10; i++) {
                const y = padding + (height - 2 * padding) * (i / 10);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', String(padding));
                line.setAttribute('y1', String(y));
                line.setAttribute('x2', String(width - padding));
                line.setAttribute('y2', String(y));
                line.setAttribute('stroke', 'var(--border-color)');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('stroke-dasharray', '2,2');
                this.svgElement.appendChild(line);
            }
        }

        // Chart content based on type
        if (this.config.type === 'line' || this.config.type === 'area') {
            this.renderLineChart();
        } else if (this.config.type === 'bar') {
            this.renderBarChart();
        } else if (this.config.type === 'pie') {
            this.renderPieChart();
        }
    }

    private renderLineChart(): void {
        // Simplified line chart implementation
        if (!this.svgElement) return;
        
        if (!this.data.series || !Array.isArray(this.data.series)) {
            console.warn('XWUIChart: No series data provided');
            return;
        }
        
        const width = this.config.width || 400;
        const height = this.config.height || 300;
        const padding = 40;

        this.data.series.forEach((series, seriesIndex) => {
            if (series.data.length === 0) return;

            const maxY = Math.max(...series.data.map(d => d.y));
            const minY = Math.min(...series.data.map(d => d.y));
            const rangeY = maxY - minY || 1;

            const points = series.data.map((point, index) => {
                const x = padding + (index / (series.data.length - 1 || 1)) * (width - 2 * padding);
                const y = height - padding - ((point.y - minY) / rangeY) * (height - 2 * padding);
                return `${x},${y}`;
            }).join(' ');

            if (this.config.type === 'area') {
                const area = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                area.setAttribute('points', `${padding},${height - padding} ${points} ${width - padding},${height - padding}`);
                area.setAttribute('fill', series.color || 'var(--accent-primary)');
                area.setAttribute('fill-opacity', '0.2');
                this.svgElement.appendChild(area);
            }

            const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyline.setAttribute('points', points);
            polyline.setAttribute('fill', 'none');
            polyline.setAttribute('stroke', series.color || 'var(--accent-primary)');
            polyline.setAttribute('stroke-width', '2');
            this.svgElement.appendChild(polyline);
        });
    }

    private renderBarChart(): void {
        // Simplified bar chart implementation
        if (!this.svgElement) return;
        
        const width = this.config.width || 400;
        const height = this.config.height || 300;
        const padding = 40;

        const maxY = Math.max(...this.data.series.flatMap(s => s.data.map(d => d.y)));
        const barWidth = (width - 2 * padding) / (this.data.series[0]?.data.length || 1) * 0.8;

        this.data.series.forEach((series, seriesIndex) => {
            series.data.forEach((point, index) => {
                const x = padding + (index / (series.data.length - 1 || 1)) * (width - 2 * padding) - barWidth / 2;
                const barHeight = (point.y / maxY) * (height - 2 * padding);
                const y = height - padding - barHeight;

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', String(x));
                rect.setAttribute('y', String(y));
                rect.setAttribute('width', String(barWidth));
                rect.setAttribute('height', String(barHeight));
                rect.setAttribute('fill', series.color || 'var(--accent-primary)');
                this.svgElement!.appendChild(rect);
            });
        });
    }

    private renderPieChart(): void {
        // Simplified pie chart implementation
        if (!this.svgElement || this.data.series.length === 0) return;
        
        const width = this.config.width || 400;
        const height = this.config.height || 300;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;

        const total = this.data.series[0].data.reduce((sum, d) => sum + d.y, 0);
        let currentAngle = -Math.PI / 2;

        this.data.series[0].data.forEach((point, index) => {
            const angle = (point.y / total) * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);
            const largeArc = angle > Math.PI ? 1 : 0;

            path.setAttribute('d', `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`);
            path.setAttribute('fill', this.data.series[0].color || `hsl(${index * 60}, 70%, 50%)`);
            this.svgElement.appendChild(path);

            currentAngle = endAngle;
        });
    }

    private createLegend(): HTMLElement {
        const legend = document.createElement('div');
        legend.className = 'xwui-chart-legend';

        this.data.series.forEach(series => {
            const item = document.createElement('div');
            item.className = 'xwui-chart-legend-item';

            const color = document.createElement('div');
            color.className = 'xwui-chart-legend-color';
            color.style.backgroundColor = series.color || 'var(--accent-primary)';
            item.appendChild(color);

            const label = document.createElement('span');
            label.className = 'xwui-chart-legend-label';
            label.textContent = series.name;
            item.appendChild(label);

            legend.appendChild(item);
        });

        return legend;
    }

    public getElement(): HTMLElement | null {
        return this.chartElement;
    }

    public destroy(): void {
        if (this.chartElement) {
            this.chartElement.remove();
            this.chartElement = null;
        }
        this.svgElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIChart as any).componentName = 'XWUIChart';


