/**
 * XWUICalendar Component
 * Full calendar view with month/week/day views
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUICalendarEvent {
    id: string;
    date: Date;
    title: string;
    color?: string;
}

// Component-level configuration
export interface XWUICalendarConfig {
    view?: 'month' | 'week' | 'day';
    firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
    showToday?: boolean;
    showNavigation?: boolean;
    className?: string;
}

// Data type
export interface XWUICalendarData {
    selectedDate?: Date;
    events?: XWUICalendarEvent[];
    minDate?: Date;
    maxDate?: Date;
}

export class XWUICalendar extends XWUIComponent<XWUICalendarData, XWUICalendarConfig> {
    private calendarElement: HTMLElement | null = null;
    private currentDate: Date;
    private dateClickHandlers: Array<(date: Date) => void> = [];
    private eventClickHandlers: Array<(event: XWUICalendarEvent) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUICalendarData = {},
        conf_comp: XWUICalendarConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.currentDate = data.selectedDate ? new Date(data.selectedDate) : new Date();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICalendarConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICalendarConfig {
        return {
            view: conf_comp?.view ?? 'month',
            firstDayOfWeek: conf_comp?.firstDayOfWeek ?? 0,
            showToday: conf_comp?.showToday ?? true,
            showNavigation: conf_comp?.showNavigation ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.calendarElement = document.createElement('div');
        this.calendarElement.className = 'xwui-calendar';
        this.calendarElement.classList.add(`xwui-calendar-${this.config.view}`);
        
        if (this.config.className) {
            this.calendarElement.classList.add(this.config.className);
        }

        // Navigation
        if (this.config.showNavigation) {
            const nav = this.createNavigation();
            this.calendarElement.appendChild(nav);
        }

        // Calendar content
        const content = document.createElement('div');
        content.className = 'xwui-calendar-content';

        if (this.config.view === 'month') {
            content.appendChild(this.createMonthView());
        } else if (this.config.view === 'week') {
            content.appendChild(this.createWeekView());
        } else {
            content.appendChild(this.createDayView());
        }

        this.calendarElement.appendChild(content);
        this.container.appendChild(this.calendarElement);
    }

    private createNavigation(): HTMLElement {
        const nav = document.createElement('div');
        nav.className = 'xwui-calendar-navigation';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'xwui-calendar-nav-button';
        prevBtn.innerHTML = '‹';
        prevBtn.addEventListener('click', () => {
            this.navigate(-1);
        });
        nav.appendChild(prevBtn);

        const title = document.createElement('div');
        title.className = 'xwui-calendar-title';
        title.textContent = this.getTitle();
        nav.appendChild(title);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'xwui-calendar-nav-button';
        nextBtn.innerHTML = '›';
        nextBtn.addEventListener('click', () => {
            this.navigate(1);
        });
        nav.appendChild(nextBtn);

        if (this.config.showToday) {
            const todayBtn = document.createElement('button');
            todayBtn.className = 'xwui-calendar-today-button';
            todayBtn.textContent = 'Today';
            todayBtn.addEventListener('click', () => {
                this.currentDate = new Date();
                this.render();
            });
            nav.appendChild(todayBtn);
        }

        return nav;
    }

    private createMonthView(): HTMLElement {
        const monthView = document.createElement('div');
        monthView.className = 'xwui-calendar-month';

        // Weekday headers
        const weekdays = document.createElement('div');
        weekdays.className = 'xwui-calendar-weekdays';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const startDay = this.config.firstDayOfWeek || 0;
        for (let i = 0; i < 7; i++) {
            const day = document.createElement('div');
            day.className = 'xwui-calendar-weekday';
            day.textContent = dayNames[(startDay + i) % 7];
            weekdays.appendChild(day);
        }
        monthView.appendChild(weekdays);

        // Days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'xwui-calendar-days';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - (firstDay.getDay() - startDay + 7) % 7);

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'xwui-calendar-day';
            
            if (date.getMonth() !== month) {
                dayCell.classList.add('xwui-calendar-day-other-month');
            }
            
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                dayCell.classList.add('xwui-calendar-day-today');
            }
            
            if (this.data.selectedDate && date.toDateString() === new Date(this.data.selectedDate).toDateString()) {
                dayCell.classList.add('xwui-calendar-day-selected');
            }

            if (this.isDateDisabled(date)) {
                dayCell.classList.add('xwui-calendar-day-disabled');
            } else {
                dayCell.addEventListener('click', () => {
                    this.selectDate(date);
                });
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'xwui-calendar-day-number';
            dayNumber.textContent = String(date.getDate());
            dayCell.appendChild(dayNumber);

            // Events
            const events = this.getEventsForDate(date);
            if (events.length > 0) {
                const eventsContainer = document.createElement('div');
                eventsContainer.className = 'xwui-calendar-day-events';
                events.slice(0, 3).forEach(event => {
                    const eventDot = document.createElement('div');
                    eventDot.className = 'xwui-calendar-event-dot';
                    eventDot.style.backgroundColor = event.color || 'var(--accent-primary)';
                    eventDot.title = event.title;
                    eventDot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.eventClickHandlers.forEach(handler => handler(event));
                    });
                    eventsContainer.appendChild(eventDot);
                });
                if (events.length > 3) {
                    const more = document.createElement('div');
                    more.className = 'xwui-calendar-event-more';
                    more.textContent = `+${events.length - 3}`;
                    eventsContainer.appendChild(more);
                }
                dayCell.appendChild(eventsContainer);
            }

            daysGrid.appendChild(dayCell);
        }

        monthView.appendChild(daysGrid);
        return monthView;
    }

    private createWeekView(): HTMLElement {
        const weekView = document.createElement('div');
        weekView.className = 'xwui-calendar-week';
        // Simplified week view implementation
        weekView.textContent = 'Week view - Coming soon';
        return weekView;
    }

    private createDayView(): HTMLElement {
        const dayView = document.createElement('div');
        dayView.className = 'xwui-calendar-day-view';
        // Simplified day view implementation
        dayView.textContent = 'Day view - Coming soon';
        return dayView;
    }

    private getTitle(): string {
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'long' 
        };
        return this.currentDate.toLocaleDateString('en-US', options);
    }

    private navigate(direction: number): void {
        if (this.config.view === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        } else if (this.config.view === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        } else {
            this.currentDate.setDate(this.currentDate.getDate() + direction);
        }
        this.render();
    }

    private selectDate(date: Date): void {
        this.data.selectedDate = date;
        this.render();
        this.dateClickHandlers.forEach(handler => handler(date));
    }

    private isDateDisabled(date: Date): boolean {
        if (this.data.minDate && date < this.data.minDate) return true;
        if (this.data.maxDate && date > this.data.maxDate) return true;
        return false;
    }

    private getEventsForDate(date: Date): XWUICalendarEvent[] {
        if (!this.data.events) return [];
        return this.data.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    public onDateClick(handler: (date: Date) => void): void {
        this.dateClickHandlers.push(handler);
    }

    public onEventClick(handler: (event: XWUICalendarEvent) => void): void {
        this.eventClickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.calendarElement;
    }

    public destroy(): void {
        this.dateClickHandlers = [];
        this.eventClickHandlers = [];
        if (this.calendarElement) {
            this.calendarElement.remove();
            this.calendarElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICalendar as any).componentName = 'XWUICalendar';


