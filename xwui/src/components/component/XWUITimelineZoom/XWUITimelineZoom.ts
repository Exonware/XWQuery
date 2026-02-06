/**
 * XWUITimelineZoom Component
 * Zoom controls for timeline views (day/week/month/year)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUISegmentedControl } from '../XWUISegmentedControl/XWUISegmentedControl';
import { XWUICalendar } from '../XWUICalendar/XWUICalendar';
import { XWUIScrollArea } from '../XWUIScrollArea/XWUIScrollArea';
import { XWUIButtonGroup } from '../XWUIButtonGroup/XWUIButtonGroup';

export type ZoomLevel = 'day' | 'week' | 'month' | 'year';

// Component-level configuration
export interface XWUITimelineZoomConfig {
    defaultZoom?: ZoomLevel;
    showCalendar?: boolean;
    showZoomButtons?: boolean;
    className?: string;
}

// Data type
export interface XWUITimelineZoomData {
    currentDate?: Date;
    zoomLevel?: ZoomLevel;
    content?: HTMLElement | string;
}

export class XWUITimelineZoom extends XWUIComponent<XWUITimelineZoomData, XWUITimelineZoomConfig> {
    private wrapperElement: HTMLElement | null = null;
    private changeHandlers: Array<(zoomLevel: ZoomLevel, date: Date) => void> = [];
    private segmentsControl: XWUISegmentedControl | null = null;
    private calendarComponent: XWUICalendar | null = null;
    private scrollAreaComponent: XWUIScrollArea | null = null;

    constructor(
        container: HTMLElement,
        data: XWUITimelineZoomData = {},
        conf_comp: XWUITimelineZoomConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.zoomLevel = this.data.zoomLevel || this.config.defaultZoom || 'week';
        this.data.currentDate = this.data.currentDate || new Date();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITimelineZoomConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITimelineZoomConfig {
        return {
            defaultZoom: conf_comp?.defaultZoom ?? 'week',
            showCalendar: conf_comp?.showCalendar ?? true,
            showZoomButtons: conf_comp?.showZoomButtons ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-timeline-zoom';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Controls bar
        const controlsBar = document.createElement('div');
        controlsBar.className = 'xwui-timeline-zoom-controls';

        // Zoom level selector
        if (this.config.showZoomButtons) {
            const zoomContainer = document.createElement('div');
            zoomContainer.className = 'xwui-timeline-zoom-selector';

            const segmentsContainer = document.createElement('div');
            this.segmentsControl = new XWUISegmentedControl(segmentsContainer, {
                options: [
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                    { value: 'year', label: 'Year' }
                ],
                value: this.data.zoomLevel || 'week'
            });

            this.segmentsControl.onChange((value: string | number) => {
                this.setZoomLevel(value as ZoomLevel);
            });

            zoomContainer.appendChild(segmentsContainer);
            controlsBar.appendChild(zoomContainer);
        }

        // Calendar navigation
        if (this.config.showCalendar) {
            const calendarContainer = document.createElement('div');
            calendarContainer.className = 'xwui-timeline-zoom-calendar';

            this.calendarComponent = new XWUICalendar(calendarContainer, {
                value: this.data.currentDate
            });

            this.calendarComponent.onChange((date: Date) => {
                this.setDate(date);
            });

            controlsBar.appendChild(calendarContainer);
        }

        // Navigation buttons
        const navContainer = document.createElement('div');
        navContainer.className = 'xwui-timeline-zoom-navigation';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'xwui-timeline-zoom-nav-btn';
        prevBtn.textContent = '←';
        prevBtn.addEventListener('click', () => this.navigate(-1));
        navContainer.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'xwui-timeline-zoom-nav-btn';
        nextBtn.textContent = '→';
        nextBtn.addEventListener('click', () => this.navigate(1));
        navContainer.appendChild(nextBtn);

        controlsBar.appendChild(navContainer);
        this.wrapperElement.appendChild(controlsBar);

        // Content area with scroll
        const contentContainer = document.createElement('div');
        contentContainer.className = 'xwui-timeline-zoom-content';

        const scrollContainer = document.createElement('div');
        this.scrollAreaComponent = new XWUIScrollArea(scrollContainer, {
            content: this.data.content || document.createElement('div')
        });

        contentContainer.appendChild(scrollContainer);
        this.wrapperElement.appendChild(contentContainer);

        this.container.appendChild(this.wrapperElement);
    }

    private navigate(direction: number): void {
        if (!this.data.currentDate) return;

        const date = new Date(this.data.currentDate);
        const zoom = this.data.zoomLevel || 'week';

        switch (zoom) {
            case 'day':
                date.setDate(date.getDate() + direction);
                break;
            case 'week':
                date.setDate(date.getDate() + (direction * 7));
                break;
            case 'month':
                date.setMonth(date.getMonth() + direction);
                break;
            case 'year':
                date.setFullYear(date.getFullYear() + direction);
                break;
        }

        this.setDate(date);
    }

    public setZoomLevel(level: ZoomLevel): void {
        this.data.zoomLevel = level;
        this.render();
        this.notifyChange();
    }

    public setDate(date: Date): void {
        this.data.currentDate = date;
        this.render();
        this.notifyChange();
    }

    private notifyChange(): void {
        if (this.data.zoomLevel && this.data.currentDate) {
            this.changeHandlers.forEach(handler => handler(this.data.zoomLevel!, this.data.currentDate!));
        }
    }

    public onChange(handler: (zoomLevel: ZoomLevel, date: Date) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.segmentsControl) {
            this.segmentsControl.destroy();
            this.segmentsControl = null;
        }
        if (this.calendarComponent) {
            this.calendarComponent.destroy();
            this.calendarComponent = null;
        }
        if (this.scrollAreaComponent) {
            this.scrollAreaComponent.destroy();
            this.scrollAreaComponent = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.changeHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITimelineZoom as any).componentName = 'XWUITimelineZoom';


