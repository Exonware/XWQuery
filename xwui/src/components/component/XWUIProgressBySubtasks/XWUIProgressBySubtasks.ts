/**
 * XWUIProgressBySubtasks Component
 * Auto-calculate parent task progress based on subtask completion
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIProgress } from '../XWUIProgress/XWUIProgress';
import { XWUITree } from '../XWUITree/XWUITree';
import { XWUICheckbox } from '../XWUICheckbox/XWUICheckbox';
import { XWUIStatistic } from '../XWUIStatistic/XWUIStatistic';

export interface Subtask {
    id: string;
    label: string;
    completed?: boolean;
    children?: Subtask[];
}

// Component-level configuration
export interface XWUIProgressBySubtasksConfig {
    showTree?: boolean;
    showProgressBar?: boolean;
    showStatistics?: boolean;
    className?: string;
}

// Data type
export interface XWUIProgressBySubtasksData {
    parentLabel?: string;
    subtasks: Subtask[];
}

export class XWUIProgressBySubtasks extends XWUIComponent<XWUIProgressBySubtasksData, XWUIProgressBySubtasksConfig> {
    private wrapperElement: HTMLElement | null = null;
    private progressComponent: XWUIProgress | null = null;
    private treeComponent: XWUITree | null = null;
    private changeHandlers: Array<(progress: number, completed: number, total: number) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIProgressBySubtasksData,
        conf_comp: XWUIProgressBySubtasksConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIProgressBySubtasksConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIProgressBySubtasksConfig {
        return {
            showTree: conf_comp?.showTree ?? true,
            showProgressBar: conf_comp?.showProgressBar ?? true,
            showStatistics: conf_comp?.showStatistics ?? true,
            className: conf_comp?.className
        };
    }

    private calculateProgress(): { progress: number; completed: number; total: number } {
        const flattenSubtasks = (tasks: Subtask[]): Subtask[] => {
            const result: Subtask[] = [];
            tasks.forEach(task => {
                result.push(task);
                if (task.children) {
                    result.push(...flattenSubtasks(task.children));
                }
            });
            return result;
        };

        const allTasks = flattenSubtasks(this.data.subtasks);
        const total = allTasks.length;
        const completed = allTasks.filter(task => task.completed).length;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        return { progress, completed, total };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-progress-by-subtasks';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        const { progress, completed, total } = this.calculateProgress();

        // Header with label
        if (this.data.parentLabel) {
            const header = document.createElement('div');
            header.className = 'xwui-progress-by-subtasks-header';
            header.textContent = this.data.parentLabel;
            this.wrapperElement.appendChild(header);
        }

        // Statistics
        if (this.config.showStatistics) {
            const statsContainer = document.createElement('div');
            statsContainer.className = 'xwui-progress-by-subtasks-stats';
            
            const statContainer = document.createElement('div');
            const stat = new XWUIStatistic(statContainer, {
                title: 'Completed',
                value: `${completed} / ${total}`,
                suffix: 'subtasks'
            });
            statsContainer.appendChild(statContainer);
            
            this.wrapperElement.appendChild(statsContainer);
        }

        // Progress bar
        if (this.config.showProgressBar) {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'xwui-progress-by-subtasks-progress';
            
            this.progressComponent = new XWUIProgress(progressContainer, {
                value: progress,
                label: `${Math.round(progress)}% Complete`
            }, {
                variant: 'linear',
                size: 'medium',
                color: progress === 100 ? 'success' : 'primary',
                showValue: true
            });
            
            this.wrapperElement.appendChild(progressContainer);
        }

        // Tree view
        if (this.config.showTree && this.data.subtasks.length > 0) {
            const treeContainer = document.createElement('div');
            treeContainer.className = 'xwui-progress-by-subtasks-tree';
            
            const treeNodes = this.convertSubtasksToTreeNodes(this.data.subtasks);
            this.treeComponent = new XWUITree(treeContainer, {
                nodes: treeNodes
            }, {
                selectable: false,
                showIcons: false
            });
            
            this.wrapperElement.appendChild(treeContainer);
        }

        this.container.appendChild(this.wrapperElement);
    }

    private convertSubtasksToTreeNodes(subtasks: Subtask[]): any[] {
        return subtasks.map(subtask => ({
            id: subtask.id,
            label: subtask.label,
            children: subtask.children ? this.convertSubtasksToTreeNodes(subtask.children) : undefined,
            icon: subtask.completed ? '✓' : '○'
        }));
    }

    public updateSubtask(subtaskId: string, completed: boolean): void {
        const updateSubtaskRecursive = (tasks: Subtask[]): boolean => {
            for (const task of tasks) {
                if (task.id === subtaskId) {
                    task.completed = completed;
                    return true;
                }
                if (task.children && updateSubtaskRecursive(task.children)) {
                    return true;
                }
            }
            return false;
        };

        if (updateSubtaskRecursive(this.data.subtasks)) {
            this.render();
            const { progress, completed, total } = this.calculateProgress();
            this.notifyChange(progress, completed, total);
        }
    }

    public getProgress(): { progress: number; completed: number; total: number } {
        return this.calculateProgress();
    }

    private notifyChange(progress: number, completed: number, total: number): void {
        this.changeHandlers.forEach(handler => handler(progress, completed, total));
    }

    public onChange(handler: (progress: number, completed: number, total: number) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.progressComponent) {
            this.progressComponent.destroy();
            this.progressComponent = null;
        }
        if (this.treeComponent) {
            this.treeComponent.destroy();
            this.treeComponent = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.changeHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIProgressBySubtasks as any).componentName = 'XWUIProgressBySubtasks';


