/**
 * XWUISubtaskExpander Component
 * Inline expandable subtasks in table/grid views
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUITree } from '../XWUITree/XWUITree';
import { XWUICheckbox } from '../XWUICheckbox/XWUICheckbox';
import { XWUIProgress } from '../XWUIProgress/XWUIProgress';

export interface SubtaskItem {
    id: string;
    label: string;
    completed?: boolean;
    children?: SubtaskItem[];
}

// Component-level configuration
export interface XWUISubtaskExpanderConfig {
    showCheckbox?: boolean;
    showProgress?: boolean;
    indentSize?: number;
    className?: string;
}

// Data type
export interface XWUISubtaskExpanderData {
    subtasks: SubtaskItem[];
    expanded?: boolean;
}

export class XWUISubtaskExpander extends XWUIComponent<XWUISubtaskExpanderData, XWUISubtaskExpanderConfig> {
    private wrapperElement: HTMLElement | null = null;
    private toggleButton: HTMLButtonElement | null = null;
    private contentElement: HTMLElement | null = null;
    private isExpanded: boolean = false;
    private progressComponent: XWUIProgress | null = null;
    private treeComponent: XWUITree | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISubtaskExpanderData,
        conf_comp: XWUISubtaskExpanderConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.isExpanded = data.expanded || false;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISubtaskExpanderConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISubtaskExpanderConfig {
        return {
            showCheckbox: conf_comp?.showCheckbox ?? true,
            showProgress: conf_comp?.showProgress ?? true,
            indentSize: conf_comp?.indentSize ?? 24,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-subtask-expander';
        
        if (this.isExpanded) {
            this.wrapperElement.classList.add('xwui-subtask-expander-expanded');
        }
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Header with toggle
        const header = document.createElement('div');
        header.className = 'xwui-subtask-expander-header';

        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'xwui-subtask-expander-toggle';
        this.toggleButton.innerHTML = this.isExpanded ? '▼' : '▶';
        this.toggleButton.addEventListener('click', () => this.toggle());
        header.appendChild(this.toggleButton);

        // Count badge
        const count = document.createElement('span');
        count.className = 'xwui-subtask-expander-count';
        count.textContent = `${this.data.subtasks.length} subtasks`;
        header.appendChild(count);

        // Progress indicator
        if (this.config.showProgress) {
            const { completed, total } = this.calculateProgress();
            const progressContainer = document.createElement('div');
            progressContainer.className = 'xwui-subtask-expander-progress';

            this.progressComponent = new XWUIProgress(progressContainer, {
                value: total > 0 ? (completed / total) * 100 : 0,
                label: `${completed}/${total}`
            }, {
                variant: 'linear',
                size: 'small',
                showValue: false
            });

            header.appendChild(progressContainer);
        }

        this.wrapperElement.appendChild(header);

        // Content area
        this.contentElement = document.createElement('div');
        this.contentElement.className = 'xwui-subtask-expander-content';
        
        if (this.isExpanded) {
            this.renderSubtasks();
        }

        this.wrapperElement.appendChild(this.contentElement);
        this.container.appendChild(this.wrapperElement);
    }

    private renderSubtasks(): void {
        if (!this.contentElement) return;

        this.contentElement.innerHTML = '';

        const treeNodes = this.convertSubtasksToTreeNodes(this.data.subtasks, 0);
        
        const treeContainer = document.createElement('div');
        this.treeComponent = new XWUITree(treeContainer, {
            nodes: treeNodes
        }, {
            selectable: false,
            showIcons: true
        });

        this.contentElement.appendChild(treeContainer);
    }

    private convertSubtasksToTreeNodes(subtasks: SubtaskItem[], level: number): any[] {
        return subtasks.map(subtask => ({
            id: subtask.id,
            label: subtask.label,
            icon: subtask.completed ? '✓' : '○',
            expanded: level < 2, // Auto-expand first 2 levels
            children: subtask.children 
                ? this.convertSubtasksToTreeNodes(subtask.children, level + 1)
                : undefined
        }));
    }

    private calculateProgress(): { completed: number; total: number } {
        const flatten = (items: SubtaskItem[]): SubtaskItem[] => {
            const result: SubtaskItem[] = [];
            items.forEach(item => {
                result.push(item);
                if (item.children) {
                    result.push(...flatten(item.children));
                }
            });
            return result;
        };

        const all = flatten(this.data.subtasks);
        const total = all.length;
        const completed = all.filter(item => item.completed).length;

        return { completed, total };
    }

    private toggle(): void {
        this.isExpanded = !this.isExpanded;
        this.render();
    }

    public setExpanded(expanded: boolean): void {
        this.isExpanded = expanded;
        this.render();
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
        this.toggleButton = null;
        this.contentElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISubtaskExpander as any).componentName = 'XWUISubtaskExpander';


