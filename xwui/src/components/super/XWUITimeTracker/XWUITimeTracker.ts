/**
 * XWUITimeTracker Component
 * Start/stop timer with time logging and manual entry
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIProgress } from '../XWUIProgress/XWUIProgress';
import { XWUITimePicker } from '../XWUITimePicker/XWUITimePicker';
import { XWUIList } from '../XWUIList/XWUIList';

export interface TimeEntry {
    id: string;
    startTime: Date;
    endTime?: Date;
    duration?: number; // in minutes
    description?: string;
}

// Component-level configuration
export interface XWUITimeTrackerConfig {
    allowManualEntry?: boolean;
    showProgress?: boolean;
    className?: string;
}

// Data type
export interface XWUITimeTrackerData {
    taskName?: string;
    isRunning?: boolean;
    startTime?: Date;
    elapsedSeconds?: number;
    entries?: TimeEntry[];
}

export class XWUITimeTracker extends XWUIComponent<XWUITimeTrackerData, XWUITimeTrackerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private startButton: XWUIButton | null = null;
    private progressComponent: XWUIProgress | null = null;
    private timerInterval: ReturnType<typeof setInterval> | null = null;
    private clickHandlers: Array<(running: boolean) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUITimeTrackerData = {},
        conf_comp: XWUITimeTrackerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.entries = this.data.entries || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITimeTrackerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITimeTrackerConfig {
        return {
            allowManualEntry: conf_comp?.allowManualEntry ?? true,
            showProgress: conf_comp?.showProgress ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-time-tracker';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Task name
        if (this.data.taskName) {
            const taskNameEl = document.createElement('div');
            taskNameEl.className = 'xwui-time-tracker-task-name';
            taskNameEl.textContent = this.data.taskName;
            this.wrapperElement.appendChild(taskNameEl);
        }

        // Timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'xwui-time-tracker-display';
        timerDisplay.textContent = this.formatTime(this.data.elapsedSeconds || 0);
        this.wrapperElement.appendChild(timerDisplay);

        // Progress (if enabled)
        if (this.config.showProgress) {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'xwui-time-tracker-progress';
            // Progress would need a target time to be meaningful
            this.wrapperElement.appendChild(progressContainer);
        }

        // Control buttons
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'xwui-time-tracker-controls';

        const buttonContainer = document.createElement('div');
        this.startButton = new XWUIButton(buttonContainer, {
            label: this.data.isRunning ? 'Stop' : 'Start',
            variant: this.data.isRunning ? 'danger' : 'primary',
            size: 'large'
        });
        this.registerChildComponent(this.startButton);

        this.startButton.onClick(() => {
            if (this.data.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        });

        controlsContainer.appendChild(buttonContainer);
        this.wrapperElement.appendChild(controlsContainer);

        // Time entries list
        if (this.data.entries && this.data.entries.length > 0) {
            const entriesContainer = document.createElement('div');
            entriesContainer.className = 'xwui-time-tracker-entries';
            
            const listItems = this.data.entries.map(entry => ({
                id: entry.id,
                content: `${this.formatDuration(entry.duration || 0)} - ${entry.description || 'No description'}`,
                timestamp: entry.startTime
            }));

            const list = new XWUIList(entriesContainer, {
                items: listItems
            });
            this.registerChildComponent(list);
            
            this.wrapperElement.appendChild(entriesContainer);
        }

        this.container.appendChild(this.wrapperElement);

        // Start timer if running
        if (this.data.isRunning) {
            this.startTimer();
        }
    }

    private formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    private formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        return `${hours}h ${mins}m`;
    }

    private start(): void {
        this.data.isRunning = true;
        this.data.startTime = new Date();
        this.data.elapsedSeconds = 0;
        this.startTimer();
        this.render();
        this.notifyChange(true);
    }

    private stop(): void {
        this.data.isRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (this.data.startTime) {
            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - this.data.startTime.getTime()) / 1000 / 60);
            
            if (!this.data.entries) {
                this.data.entries = [];
            }

            this.data.entries.push({
                id: `entry-${Date.now()}`,
                startTime: this.data.startTime,
                endTime: endTime,
                duration: duration
            });
        }

        this.render();
        this.notifyChange(false);
    }

    private startTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (this.data.isRunning && this.data.startTime) {
                const now = new Date();
                this.data.elapsedSeconds = Math.floor((now.getTime() - this.data.startTime.getTime()) / 1000);
                
                const display = this.wrapperElement?.querySelector('.xwui-time-tracker-display');
                if (display) {
                    display.textContent = this.formatTime(this.data.elapsedSeconds);
                }
            }
        }, 1000);
    }

    private notifyChange(running: boolean): void {
        this.clickHandlers.forEach(handler => handler(running));
    }

    public onClick(handler: (running: boolean) => void): void {
        this.clickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // Clean up timers
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        // Child components (startButton, list) are automatically destroyed by base class
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.startButton = null;
        this.progressComponent = null;
        this.clickHandlers = [];
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITimeTracker as any).componentName = 'XWUITimeTracker';


