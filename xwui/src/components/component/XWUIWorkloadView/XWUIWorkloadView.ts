/**
 * XWUIWorkloadView Component
 * Resource allocation view showing tasks per person and capacity
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIChart } from '../XWUIChart/XWUIChart';
import { XWUIList } from '../XWUIList/XWUIList';
import { XWUIAvatarGroup } from '../XWUIAvatarGroup/XWUIAvatarGroup';
import { XWUIProgress } from '../XWUIProgress/XWUIProgress';
import { XWUICard } from '../XWUICard/XWUICard';
import { XWUIStatistic } from '../XWUIStatistic/XWUIStatistic';
import { XWUIMenuDropdown } from '../XWUIMenuDropdown/XWUIMenuDropdown';

export interface PersonWorkload {
    personId: string;
    personName: string;
    avatar?: string;
    tasks: number;
    capacity: number; // Total capacity in hours/tasks
    utilization: number; // Percentage (0-100)
}

// Component-level configuration
export interface XWUIWorkloadViewConfig {
    showChart?: boolean;
    showCards?: boolean;
    showList?: boolean;
    className?: string;
}

// Data type
export interface XWUIWorkloadViewData {
    workloads: PersonWorkload[];
    teamFilter?: string[];
}

export class XWUIWorkloadView extends XWUIComponent<XWUIWorkloadViewData, XWUIWorkloadViewConfig> {
    private wrapperElement: HTMLElement | null = null;
    private chartComponent: XWUIChart | null = null;
    private menu: XWUIMenuDropdown | null = null;
    private stat1: XWUIStatistic | null = null;
    private stat2: XWUIStatistic | null = null;
    private cardInstances: XWUICard[] = [];
    private progressInstances: XWUIProgress[] = [];
    private list: XWUIList | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIWorkloadViewData,
        conf_comp: XWUIWorkloadViewConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIWorkloadViewConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIWorkloadViewConfig {
        return {
            showChart: conf_comp?.showChart ?? true,
            showCards: conf_comp?.showCards ?? true,
            showList: conf_comp?.showList ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-workload-view';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Filter
        this.renderFilter();

        // Statistics
        this.renderStatistics();

        // Chart
        if (this.config.showChart) {
            this.renderChart();
        }

        // Cards or List
        if (this.config.showCards) {
            this.renderCards();
        } else if (this.config.showList) {
            this.renderList();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderFilter(): void {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'xwui-workload-view-filter';

        const menuContainer = document.createElement('div');
        this.menu = new XWUIMenuDropdown(menuContainer, {
            items: [
                { id: 'all', label: 'All Teams' },
                { id: 'team1', label: 'Team 1' },
                { id: 'team2', label: 'Team 2' }
            ],
            triggerElement: filterContainer
        });
        this.registerChildComponent(this.menu);

        filterContainer.appendChild(menuContainer);
        this.wrapperElement!.appendChild(filterContainer);
    }

    private renderStatistics(): void {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'xwui-workload-view-stats';

        const totalUtilization = this.calculateAverageUtilization();
        const overCapacity = this.data.workloads.filter(w => w.utilization > 100).length;

        const stat1Container = document.createElement('div');
        this.stat1 = new XWUIStatistic(stat1Container, {
            title: 'Average Utilization',
            value: `${Math.round(totalUtilization)}%`
        });
        this.registerChildComponent(this.stat1);
        statsContainer.appendChild(stat1Container);

        const stat2Container = document.createElement('div');
        this.stat2 = new XWUIStatistic(stat2Container, {
            title: 'Over Capacity',
            value: String(overCapacity)
        });
        this.registerChildComponent(this.stat2);
        statsContainer.appendChild(stat2Container);

        this.wrapperElement!.appendChild(statsContainer);
    }

    private renderChart(): void {
        const chartContainer = document.createElement('div');
        chartContainer.className = 'xwui-workload-view-chart';

        const chartData = {
            series: [{
                name: 'Utilization',
                data: this.data.workloads.map(w => ({
                    x: w.personName,
                    y: w.utilization
                })),
                color: 'var(--accent-primary)'
            }],
            title: 'Resource Utilization'
        };

        this.chartComponent = new XWUIChart(chartContainer, chartData, {
            type: 'bar',
            width: 800,
            height: 300,
            showLegend: false,
            showGrid: true
        });

        this.wrapperElement!.appendChild(chartContainer);
    }

    private renderCards(): void {
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'xwui-workload-view-cards';

        this.cardInstances = [];
        this.progressInstances = [];

        this.data.workloads.forEach(workload => {
            const cardContainer = document.createElement('div');
            const card = new XWUICard(cardContainer, {
                title: workload.personName,
                subtitle: `${workload.tasks} tasks`
            }, {
                variant: 'outlined',
                hoverable: true
            });
            this.cardInstances.push(card);
            this.registerChildComponent(card);

            // Progress bar
            const progressContainer = document.createElement('div');
            const progress = new XWUIProgress(progressContainer, {
                value: workload.utilization,
                label: `${Math.round(workload.utilization)}% utilized`
            }, {
                variant: 'linear',
                color: workload.utilization > 100 ? 'error' 
                    : workload.utilization > 80 ? 'warning' 
                    : 'success'
            });
            this.progressInstances.push(progress);
            this.registerChildComponent(progress);

            const cardBody = card.getElement()?.querySelector('.xwui-card-body');
            if (cardBody) {
                cardBody.appendChild(progressContainer);
            }

            cardsContainer.appendChild(cardContainer);
        });

        this.wrapperElement!.appendChild(cardsContainer);
    }

    private renderList(): void {
        const listContainer = document.createElement('div');
        this.list = new XWUIList(listContainer, {
            items: this.data.workloads.map(w => ({
                id: w.personId,
                content: `${w.personName} - ${w.tasks} tasks (${Math.round(w.utilization)}% utilized)`
            }))
        });
        this.registerChildComponent(this.list);

        this.wrapperElement!.appendChild(listContainer);
    }

    private calculateAverageUtilization(): number {
        if (this.data.workloads.length === 0) return 0;
        const total = this.data.workloads.reduce((sum, w) => sum + w.utilization, 0);
        return total / this.data.workloads.length;
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // All registered child components (menu, stat1, stat2, chartComponent, cardInstances, 
        // progressInstances, list) are automatically destroyed by base class
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.menu = null;
        this.stat1 = null;
        this.stat2 = null;
        this.chartComponent = null;
        this.cardInstances = [];
        this.progressInstances = [];
        this.list = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIWorkloadView as any).componentName = 'XWUIWorkloadView';


