/**
 * XWUIPortfolioDashboard Component
 * Multi-project overview dashboard with health indicators and metrics
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIGrid } from '../XWUIGrid/XWUIGrid';
import { XWUICard } from '../XWUICard/XWUICard';
import { XWUIChart } from '../XWUIChart/XWUIChart';
import { XWUIStatistic } from '../XWUIStatistic/XWUIStatistic';
import { XWUIProgress } from '../XWUIProgress/XWUIProgress';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';
import { XWUISelect } from '../XWUISelect/XWUISelect';
import { XWUIInput } from '../XWUIInput/XWUIInput';

export interface Project {
    id: string;
    name: string;
    status: 'on-track' | 'at-risk' | 'delayed';
    progress: number;
    health: number; // 0-100
    tasksCompleted: number;
    tasksTotal: number;
    teamSize: number;
}

// Component-level configuration
export interface XWUIPortfolioDashboardConfig {
    showKPIs?: boolean;
    showCharts?: boolean;
    showProjects?: boolean;
    className?: string;
}

// Data type
export interface XWUIPortfolioDashboardData {
    projects: Project[];
    statusFilter?: string;
}

export class XWUIPortfolioDashboard extends XWUIComponent<XWUIPortfolioDashboardData, XWUIPortfolioDashboardConfig> {
    private wrapperElement: HTMLElement | null = null;
    private searchComponent: XWUIInput | null = null;
    private statusSelect: XWUISelect | null = null;
    private kpi1: XWUIStatistic | null = null;
    private kpi2: XWUIStatistic | null = null;
    private kpi3: XWUIStatistic | null = null;
    private statusChart: XWUIChart | null = null;
    private grid: XWUIGrid | null = null;
    private cardInstances: XWUICard[] = [];
    private badgeInstances: XWUIBadge[] = [];
    private progressInstances: XWUIProgress[] = [];

    constructor(
        container: HTMLElement,
        data: XWUIPortfolioDashboardData,
        conf_comp: XWUIPortfolioDashboardConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIPortfolioDashboardConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPortfolioDashboardConfig {
        return {
            showKPIs: conf_comp?.showKPIs ?? true,
            showCharts: conf_comp?.showCharts ?? true,
            showProjects: conf_comp?.showProjects ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-portfolio-dashboard';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Filters
        this.renderFilters();

        // KPIs
        if (this.config.showKPIs) {
            this.renderKPIs();
        }

        // Charts
        if (this.config.showCharts) {
            this.renderCharts();
        }

        // Project cards
        if (this.config.showProjects) {
            this.renderProjects();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderFilters(): void {
        const filterBar = document.createElement('div');
        filterBar.className = 'xwui-portfolio-dashboard-filters';

        const searchContainer = document.createElement('div');
        this.searchComponent = new XWUIInput(searchContainer, {
            placeholder: 'Search projects...'
        });
        this.registerChildComponent(this.searchComponent);
        filterBar.appendChild(searchContainer);

        const statusContainer = document.createElement('div');
        this.statusSelect = new XWUISelect(statusContainer, {
            options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'on-track', label: 'On Track' },
                { value: 'at-risk', label: 'At Risk' },
                { value: 'delayed', label: 'Delayed' }
            ],
            value: this.data.statusFilter || 'all'
        });
        this.registerChildComponent(this.statusSelect);
        filterBar.appendChild(statusContainer);

        this.wrapperElement!.appendChild(filterBar);
    }

    private renderKPIs(): void {
        const kpisContainer = document.createElement('div');
        kpisContainer.className = 'xwui-portfolio-dashboard-kpis';

        const totalProjects = this.data.projects.length;
        const onTrack = this.data.projects.filter(p => p.status === 'on-track').length;
        const avgHealth = this.data.projects.reduce((sum, p) => sum + p.health, 0) / totalProjects || 0;

        const kpi1Container = document.createElement('div');
        this.kpi1 = new XWUIStatistic(kpi1Container, {
            title: 'Total Projects',
            value: String(totalProjects)
        });
        this.registerChildComponent(this.kpi1);
        kpisContainer.appendChild(kpi1Container);

        const kpi2Container = document.createElement('div');
        this.kpi2 = new XWUIStatistic(kpi2Container, {
            title: 'On Track',
            value: String(onTrack)
        });
        this.registerChildComponent(this.kpi2);
        kpisContainer.appendChild(kpi2Container);

        const kpi3Container = document.createElement('div');
        this.kpi3 = new XWUIStatistic(kpi3Container, {
            title: 'Avg Health',
            value: `${Math.round(avgHealth)}%`
        });
        this.registerChildComponent(this.kpi3);
        kpisContainer.appendChild(kpi3Container);

        this.wrapperElement!.appendChild(kpisContainer);
    }

    private renderCharts(): void {
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'xwui-portfolio-dashboard-charts';

        // Status distribution chart
        const statusChartContainer = document.createElement('div');
        this.statusChart = new XWUIChart(statusChartContainer, {
            series: [{
                name: 'Projects',
                data: [
                    { x: 'On Track', y: this.data.projects.filter(p => p.status === 'on-track').length },
                    { x: 'At Risk', y: this.data.projects.filter(p => p.status === 'at-risk').length },
                    { x: 'Delayed', y: this.data.projects.filter(p => p.status === 'delayed').length }
                ]
            }],
            title: 'Project Status Distribution'
        }, {
            type: 'pie',
            width: 300,
            height: 300
        });
        this.registerChildComponent(this.statusChart);
        chartsContainer.appendChild(statusChartContainer);

        this.wrapperElement!.appendChild(chartsContainer);
    }

    private renderProjects(): void {
        const projectsContainer = document.createElement('div');
        projectsContainer.className = 'xwui-portfolio-dashboard-projects';

        this.grid = new XWUIGrid(projectsContainer, {}, {
            columns: 3,
            gap: 'medium'
        });
        this.registerChildComponent(this.grid);

        this.cardInstances = [];
        this.badgeInstances = [];
        this.progressInstances = [];

        this.data.projects.forEach(project => {
            const cardContainer = document.createElement('div');
            const card = new XWUICard(cardContainer, {
                title: project.name,
                subtitle: `${project.tasksCompleted}/${project.tasksTotal} tasks`
            }, {
                variant: 'outlined',
                hoverable: true,
                clickable: true
            });
            this.cardInstances.push(card);
            this.registerChildComponent(card);

            // Status badge
            const badgeContainer = document.createElement('div');
            const badge = new XWUIBadge(badgeContainer, {
                text: project.status
            }, {
                variant: project.status === 'on-track' ? 'success' 
                    : project.status === 'at-risk' ? 'warning' 
                    : 'error'
            });
            this.badgeInstances.push(badge);
            this.registerChildComponent(badge);

            // Progress bar
            const progressContainer = document.createElement('div');
            const progress = new XWUIProgress(progressContainer, {
                value: project.progress,
                label: `${Math.round(project.progress)}%`
            }, {
                variant: 'linear',
                color: project.health > 80 ? 'success' 
                    : project.health > 50 ? 'warning' 
                    : 'error'
            });
            this.progressInstances.push(progress);
            this.registerChildComponent(progress);

            const cardBody = card.getElement()?.querySelector('.xwui-card-body');
            if (cardBody) {
                cardBody.appendChild(badgeContainer);
                cardBody.appendChild(progressContainer);
            }

            projectsContainer.appendChild(cardContainer);
        });

        this.wrapperElement!.appendChild(projectsContainer);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // Child components are automatically destroyed by base class
        // Just clear references and clean up DOM
        this.searchComponent = null;
        this.statusSelect = null;
        this.kpi1 = null;
        this.kpi2 = null;
        this.kpi3 = null;
        this.statusChart = null;
        this.grid = null;
        this.cardInstances = [];
        this.badgeInstances = [];
        this.progressInstances = [];
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        // Call parent destroy to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPortfolioDashboard as any).componentName = 'XWUIPortfolioDashboard';


