/**
 * XWUIGanttChart Component
 * Horizontal timeline/Gantt chart with task bars, dependencies, and critical path visualization
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIChart } from '../XWUIChart/XWUIChart';
import { XWUICalendar } from '../XWUICalendar/XWUICalendar';
import { XWUIScrollArea } from '../XWUIScrollArea/XWUIScrollArea';
import { XWUIResizable } from '../XWUIResizable/XWUIResizable';
import { XWUITooltip } from '../XWUITooltip/XWUITooltip';
import { XWUISegmentedControl } from '../XWUISegmentedControl/XWUISegmentedControl';
import { XWUISidebar } from '../XWUISidebar/XWUISidebar';
import { XWUIDependencyVisualizer } from '../XWUIDependencyVisualizer/XWUIDependencyVisualizer';

export interface GanttTask {
    id: string;
    label: string;
    startDate: Date;
    endDate: Date;
    progress: number; // 0-100
    dependencies?: string[]; // Task IDs this task depends on
    assignee?: string;
    status?: 'not-started' | 'in-progress' | 'completed' | 'blocked';
}

export type GanttZoomLevel = 'day' | 'week' | 'month' | 'year';

// Component-level configuration
export interface XWUIGanttChartConfig {
    zoomLevel?: GanttZoomLevel;
    showSidebar?: boolean;
    showDependencies?: boolean;
    showCriticalPath?: boolean;
    className?: string;
}

// Data type
export interface XWUIGanttChartData {
    tasks: GanttTask[];
    startDate?: Date;
    endDate?: Date;
}

export class XWUIGanttChart extends XWUIComponent<XWUIGanttChartData, XWUIGanttChartConfig> {
    private wrapperElement: HTMLElement | null = null;
    private svgElement: SVGElement | null = null;
    private sidebarElement: HTMLElement | null = null;
    private timelineElement: HTMLElement | null = null;
    private currentZoom: GanttZoomLevel = 'week';
    private zoomControl: XWUISegmentedControl | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIGanttChartData,
        conf_comp: XWUIGanttChartConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.currentZoom = conf_comp.zoomLevel || 'week';
        this.calculateDateRange();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIGanttChartConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIGanttChartConfig {
        return {
            zoomLevel: conf_comp?.zoomLevel ?? 'week',
            showSidebar: conf_comp?.showSidebar ?? true,
            showDependencies: conf_comp?.showDependencies ?? true,
            showCriticalPath: conf_comp?.showCriticalPath ?? false,
            className: conf_comp?.className
        };
    }

    private calculateDateRange(): void {
        if (this.data.startDate && this.data.endDate) return;

        const dates = this.data.tasks.flatMap(task => [task.startDate, task.endDate]);
        if (dates.length === 0) {
            this.data.startDate = new Date();
            this.data.endDate = new Date();
            return;
        }

        this.data.startDate = new Date(Math.min(...dates.map(d => d.getTime())));
        this.data.endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-gantt-chart';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Zoom controls
        this.renderZoomControls();

        // Main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'xwui-gantt-chart-main';

        // Sidebar with task list
        if (this.config.showSidebar) {
            this.renderSidebar(mainContainer);
        }

        // Timeline area
        this.renderTimeline(mainContainer);

        this.wrapperElement.appendChild(mainContainer);
        this.container.appendChild(this.wrapperElement);
    }

    private renderZoomControls(): void {
        const controlsBar = document.createElement('div');
        controlsBar.className = 'xwui-gantt-chart-controls';

        const zoomContainer = document.createElement('div');
        this.zoomControl = new XWUISegmentedControl(zoomContainer, {
            options: [
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' }
            ],
            value: this.currentZoom
        });
        this.registerChildComponent(this.zoomControl);

        this.zoomControl.onChange((value: string | number) => {
            this.currentZoom = value as GanttZoomLevel;
            this.render();
        });

        controlsBar.appendChild(zoomContainer);
        this.wrapperElement!.appendChild(controlsBar);
    }

    private renderSidebar(container: HTMLElement): void {
        const sidebarContainer = document.createElement('div');
        sidebarContainer.className = 'xwui-gantt-chart-sidebar';

        const taskList = document.createElement('div');
        taskList.className = 'xwui-gantt-chart-task-list';

        this.data.tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'xwui-gantt-chart-task-item';
            taskItem.textContent = task.label;
            taskItem.setAttribute('data-task-id', task.id);
            taskList.appendChild(taskItem);
        });

        sidebarContainer.appendChild(taskList);
        container.appendChild(sidebarContainer);
        this.sidebarElement = sidebarContainer;
    }

    private renderTimeline(container: HTMLElement): void {
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'xwui-gantt-chart-timeline';

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'xwui-gantt-chart-timeline-scroll';

        // Date header
        const dateHeader = this.renderDateHeader();
        scrollContainer.appendChild(dateHeader);

        // Chart area
        const chartArea = document.createElement('div');
        chartArea.className = 'xwui-gantt-chart-area';

        const svgContainer = document.createElement('div');
        svgContainer.style.position = 'relative';
        svgContainer.style.width = '100%';
        svgContainer.style.minHeight = `${this.data.tasks.length * 40 + 100}px`;

        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgElement.setAttribute('width', '100%');
        this.svgElement.setAttribute('height', '100%');
        this.svgElement.style.position = 'absolute';
        this.svgElement.style.top = '0';
        this.svgElement.style.left = '0';

        this.renderChartContent();

        svgContainer.appendChild(this.svgElement);
        chartArea.appendChild(svgContainer);
        scrollContainer.appendChild(chartArea);

        timelineContainer.appendChild(scrollContainer);
        container.appendChild(timelineContainer);
        this.timelineElement = timelineContainer;
    }

    private renderDateHeader(): HTMLElement {
        const header = document.createElement('div');
        header.className = 'xwui-gantt-chart-date-header';

        const dates = this.generateDateRange();
        dates.forEach(date => {
            const dateCell = document.createElement('div');
            dateCell.className = 'xwui-gantt-chart-date-cell';
            dateCell.textContent = this.formatDate(date, this.currentZoom);
            header.appendChild(dateCell);
        });

        return header;
    }

    private generateDateRange(): Date[] {
        if (!this.data.startDate || !this.data.endDate) return [];

        const dates: Date[] = [];
        const current = new Date(this.data.startDate);
        const end = new Date(this.data.endDate);

        while (current <= end) {
            dates.push(new Date(current));
            
            switch (this.currentZoom) {
                case 'day':
                    current.setDate(current.getDate() + 1);
                    break;
                case 'week':
                    current.setDate(current.getDate() + 7);
                    break;
                case 'month':
                    current.setMonth(current.getMonth() + 1);
                    break;
                case 'year':
                    current.setFullYear(current.getFullYear() + 1);
                    break;
            }
        }

        return dates;
    }

    private formatDate(date: Date, zoom: GanttZoomLevel): string {
        switch (zoom) {
            case 'day':
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            case 'week':
                return `Week ${this.getWeekNumber(date)}`;
            case 'month':
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            case 'year':
                return date.getFullYear().toString();
            default:
                return date.toLocaleDateString();
        }
    }

    private getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    private renderChartContent(): void {
        if (!this.svgElement || !this.data.startDate || !this.data.endDate) return;

        const totalDays = Math.ceil((this.data.endDate.getTime() - this.data.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const rowHeight = 40;
        const padding = 50;

        // Render dependencies first (lines)
        if (this.config.showDependencies) {
            this.renderDependencies(totalDays, rowHeight, padding);
        }

        // Render task bars
        this.data.tasks.forEach((task, index) => {
            const y = padding + index * rowHeight;
            this.renderTaskBar(task, totalDays, y, rowHeight, padding);
        });
    }

    private renderTaskBar(task: GanttTask, totalDays: number, y: number, rowHeight: number, padding: number): void {
        if (!this.svgElement || !this.data.startDate) return;

        const taskStart = task.startDate.getTime();
        const taskEnd = task.endDate.getTime();
        const chartStart = this.data.startDate.getTime();
        const chartEnd = this.data.endDate!.getTime();
        const chartWidth = totalDays * 10; // 10px per day

        const x = padding + ((taskStart - chartStart) / (chartEnd - chartStart)) * chartWidth;
        const width = ((taskEnd - taskStart) / (chartEnd - chartStart)) * chartWidth;

        // Task bar
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(x));
        rect.setAttribute('y', String(y + 10));
        rect.setAttribute('width', String(Math.max(width, 5)));
        rect.setAttribute('height', String(rowHeight - 20));
        rect.setAttribute('rx', '4');
        rect.setAttribute('fill', this.getTaskStatusColor(task.status || 'not-started'));
        rect.setAttribute('stroke', 'var(--border-color, #dee2e6)');
        rect.setAttribute('stroke-width', '1');
        rect.classList.add('xwui-gantt-chart-task-bar');
        rect.setAttribute('data-task-id', task.id);

        rect.addEventListener('click', () => {
            this.handleTaskClick(task);
        });

        // Progress overlay
        if (task.progress > 0) {
            const progressWidth = (width * task.progress) / 100;
            const progressRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            progressRect.setAttribute('x', String(x));
            progressRect.setAttribute('y', String(y + 10));
            progressRect.setAttribute('width', String(Math.max(progressWidth, 2)));
            progressRect.setAttribute('height', String(rowHeight - 20));
            progressRect.setAttribute('rx', '4');
            progressRect.setAttribute('fill', 'var(--accent-success, #10b981)');
            progressRect.setAttribute('opacity', '0.7');
            this.svgElement.appendChild(progressRect);
        }

        this.svgElement.appendChild(rect);

        // Task label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(x + 5));
        text.setAttribute('y', String(y + rowHeight / 2));
        text.setAttribute('fill', 'var(--text-inverse, #ffffff)');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', '500');
        text.textContent = task.label.length > 15 ? task.label.substring(0, 15) + '...' : task.label;
        this.svgElement.appendChild(text);
    }

    private renderDependencies(totalDays: number, rowHeight: number, padding: number): void {
        if (!this.svgElement || !this.data.startDate) return;

        this.data.tasks.forEach((task, index) => {
            if (!task.dependencies || task.dependencies.length === 0) return;

            task.dependencies.forEach(depId => {
                const depTask = this.data.tasks.find(t => t.id === depId);
                if (!depTask) return;

                const taskIndex = this.data.tasks.findIndex(t => t.id === task.id);
                const depIndex = this.data.tasks.findIndex(t => t.id === depId);

                const fromY = padding + depIndex * rowHeight + rowHeight / 2;
                const toY = padding + taskIndex * rowHeight + rowHeight / 2;

                const taskStart = task.startDate.getTime();
                const taskEnd = task.startDate.getTime();
                const depStart = depTask.endDate.getTime();
                const chartStart = this.data.startDate.getTime();
                const chartEnd = this.data.endDate!.getTime();
                const chartWidth = totalDays * 10;

                const fromX = padding + ((depStart - chartStart) / (chartEnd - chartStart)) * chartWidth;
                const toX = padding + ((taskStart - chartStart) / (chartEnd - chartStart)) * chartWidth;

                // Dependency line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', String(fromX));
                line.setAttribute('y1', String(fromY));
                line.setAttribute('x2', String(toX));
                line.setAttribute('y2', String(toY));
                line.setAttribute('stroke', 'var(--accent-primary, #4f46e5)');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '5,5');
                this.svgElement.appendChild(line);
            });
        });
    }

    private getTaskStatusColor(status: string): string {
        const colors: Record<string, string> = {
            'completed': 'var(--accent-success, #10b981)',
            'in-progress': 'var(--accent-primary, #4f46e5)',
            'blocked': 'var(--accent-error, #ef4444)',
            'not-started': 'var(--text-secondary, #6c757d)'
        };
        return colors[status] || 'var(--text-secondary, #6c757d)';
    }

    private handleTaskClick(task: GanttTask): void {
        // Handle task click
        console.log('Task clicked:', task);
    }

    public setZoom(zoom: GanttZoomLevel): void {
        this.currentZoom = zoom;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // All registered child components (zoomControl) are automatically destroyed by base class
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.zoomControl = null;
        this.svgElement = null;
        this.sidebarElement = null;
        this.timelineElement = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIGanttChart as any).componentName = 'XWUIGanttChart';


