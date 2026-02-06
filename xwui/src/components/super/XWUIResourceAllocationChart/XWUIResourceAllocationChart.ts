/**
 * XWUIResourceAllocationChart Component
 * Visual resource allocation and capacity planning chart
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIChart } from '../XWUIChart/XWUIChart';
import { XWUITooltip } from '../XWUITooltip/XWUITooltip';
import { XWUIStatistic } from '../XWUIStatistic/XWUIStatistic';
import { XWUIMenuDropdown } from '../XWUIMenuDropdown/XWUIMenuDropdown';

export interface ResourceAllocation {
    resourceId: string;
    resourceName: string;
    allocated: number;
    capacity: number;
    type: string;
}

// Component-level configuration
export interface XWUIResourceAllocationChartConfig {
    chartType?: 'stacked-bar' | 'area';
    showTooltip?: boolean;
    showLegend?: boolean;
    className?: string;
}

// Data type
export interface XWUIResourceAllocationChartData {
    allocations: ResourceAllocation[];
    timeRange?: { start: Date; end: Date };
}

export class XWUIResourceAllocationChart extends XWUIComponent<XWUIResourceAllocationChartData, XWUIResourceAllocationChartConfig> {
    private wrapperElement: HTMLElement | null = null;
    private chartComponent: XWUIChart | null = null;
    private stat1: XWUIStatistic | null = null;
    private stat2: XWUIStatistic | null = null;
    private stat3: XWUIStatistic | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIResourceAllocationChartData,
        conf_comp: XWUIResourceAllocationChartConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIResourceAllocationChartConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIResourceAllocationChartConfig {
        return {
            chartType: conf_comp?.chartType ?? 'stacked-bar',
            showTooltip: conf_comp?.showTooltip ?? true,
            showLegend: conf_comp?.showLegend ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-resource-allocation-chart';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Statistics summary
        this.renderStatistics();

        // Chart
        this.renderChart();

        this.container.appendChild(this.wrapperElement);
    }

    private renderStatistics(): void {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'xwui-resource-allocation-chart-stats';

        const totalCapacity = this.data.allocations.reduce((sum, a) => sum + a.capacity, 0);
        const totalAllocated = this.data.allocations.reduce((sum, a) => sum + a.allocated, 0);
        const utilization = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0;

        const stat1Container = document.createElement('div');
        this.stat1 = new XWUIStatistic(stat1Container, {
            title: 'Total Capacity',
            value: String(totalCapacity)
        });
        this.registerChildComponent(this.stat1);
        statsContainer.appendChild(stat1Container);

        const stat2Container = document.createElement('div');
        this.stat2 = new XWUIStatistic(stat2Container, {
            title: 'Allocated',
            value: String(totalAllocated)
        });
        this.registerChildComponent(this.stat2);
        statsContainer.appendChild(stat2Container);

        const stat3Container = document.createElement('div');
        this.stat3 = new XWUIStatistic(stat3Container, {
            title: 'Utilization',
            value: `${Math.round(utilization)}%`
        });
        this.registerChildComponent(this.stat3);
        statsContainer.appendChild(stat3Container);

        this.wrapperElement!.appendChild(statsContainer);
    }

    private renderChart(): void {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'xwui-resource-allocation-chart-container';

        // Group by resource type
        const typeMap = new Map<string, ResourceAllocation[]>();
        this.data.allocations.forEach(alloc => {
            if (!typeMap.has(alloc.type)) {
                typeMap.set(alloc.type, []);
            }
            typeMap.get(alloc.type)!.push(alloc);
        });

        const series = Array.from(typeMap.entries()).map(([type, allocations]) => ({
            name: type,
            data: allocations.map(alloc => ({
                x: alloc.resourceName,
                y: alloc.allocated
            })),
            color: this.getColorForType(type)
        }));

        const chartData = {
            series: series,
            title: 'Resource Allocation'
        };

        const chartType = this.config.chartType === 'area' ? 'area' : 'bar';
        
        this.chartComponent = new XWUIChart(chartContainer, chartData, {
            type: chartType,
            width: 800,
            height: 400,
            showLegend: this.config.showLegend,
            showGrid: true
        });
        this.registerChildComponent(this.chartComponent);

        this.wrapperElement!.appendChild(chartContainer);
    }

    private getColorForType(type: string): string {
        const colors: Record<string, string> = {
            'developer': 'var(--accent-primary)',
            'designer': 'var(--accent-success)',
            'manager': 'var(--accent-warning)',
            'qa': 'var(--accent-error)'
        };
        return colors[type] || 'var(--accent-primary)';
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.chartComponent) {
            this.chartComponent.destroy();
            this.chartComponent = null;
        }
        if (this.stat1) {
            this.stat1.destroy();
            this.stat1 = null;
        }
        if (this.stat2) {
            this.stat2.destroy();
            this.stat2 = null;
        }
        if (this.stat3) {
            this.stat3.destroy();
            this.stat3 = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIResourceAllocationChart as any).componentName = 'XWUIResourceAllocationChart';


