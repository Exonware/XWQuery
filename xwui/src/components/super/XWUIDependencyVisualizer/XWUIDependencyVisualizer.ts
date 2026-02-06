/**
 * XWUIDependencyVisualizer Component
 * Visualize task dependencies, blocking relationships, and predecessor/successor links
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIChart } from '../XWUIChart/XWUIChart';
import { XWUITooltip } from '../XWUITooltip/XWUITooltip';
import { XWUIDialog } from '../XWUIDialog/XWUIDialog';
import { XWUICard } from '../XWUICard/XWUICard';
import { XWUIButtonGroup } from '../XWUIButtonGroup/XWUIButtonGroup';

export interface TaskNode {
    id: string;
    label: string;
    status?: 'pending' | 'in-progress' | 'completed' | 'blocked';
    position?: { x: number; y: number };
}

export interface DependencyLink {
    from: string; // Task ID
    to: string; // Task ID
    type: 'blocks' | 'precedes' | 'related';
}

// Component-level configuration
export interface XWUIDependencyVisualizerConfig {
    layout?: 'auto' | 'hierarchical' | 'circular';
    showControls?: boolean;
    editable?: boolean;
    className?: string;
}

// Data type
export interface XWUIDependencyVisualizerData {
    tasks: TaskNode[];
    dependencies: DependencyLink[];
}

export class XWUIDependencyVisualizer extends XWUIComponent<XWUIDependencyVisualizerData, XWUIDependencyVisualizerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private svgElement: SVGElement | null = null;
    private tooltipComponent: XWUITooltip | null = null;
    private selectedNode: TaskNode | null = null;
    private clickHandlers: Array<(task: TaskNode) => void> = [];
    private buttons: XWUIButtonGroup | null = null;
    private dialog: XWUIDialog | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIDependencyVisualizerData,
        conf_comp: XWUIDependencyVisualizerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.calculateLayout();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDependencyVisualizerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDependencyVisualizerConfig {
        return {
            layout: conf_comp?.layout ?? 'hierarchical',
            showControls: conf_comp?.showControls ?? true,
            editable: conf_comp?.editable ?? false,
            className: conf_comp?.className
        };
    }

    private calculateLayout(): void {
        if (this.config.layout === 'auto' || this.config.layout === 'hierarchical') {
            this.calculateHierarchicalLayout();
        } else if (this.config.layout === 'circular') {
            this.calculateCircularLayout();
        }
    }

    private calculateHierarchicalLayout(): void {
        const levels = new Map<string, number>();
        const processed = new Set<string>();

        // Find root nodes (no dependencies pointing to them)
        const rootTasks = this.data.tasks.filter(task => 
            !this.data.dependencies.some(dep => dep.to === task.id)
        );

        // Assign levels
        const assignLevel = (taskId: string, level: number) => {
            if (processed.has(taskId)) return;
            processed.add(taskId);
            levels.set(taskId, level);

            // Find dependents
            this.data.dependencies
                .filter(dep => dep.from === taskId)
                .forEach(dep => {
                    assignLevel(dep.to, level + 1);
                });
        };

        rootTasks.forEach(task => assignLevel(task.id, 0));

        // Position nodes
        const nodesByLevel = new Map<number, TaskNode[]>();
        this.data.tasks.forEach(task => {
            const level = levels.get(task.id) || 0;
            if (!nodesByLevel.has(level)) {
                nodesByLevel.set(level, []);
            }
            nodesByLevel.get(level)!.push(task);
        });

        const maxLevel = Math.max(...Array.from(nodesByLevel.keys()));
        const levelHeight = 150;
        const nodeWidth = 120;

        nodesByLevel.forEach((nodes, level) => {
            const y = level * levelHeight + 100;
            const totalWidth = nodes.length * nodeWidth;
            const startX = (800 - totalWidth) / 2;

            nodes.forEach((node, index) => {
                node.position = {
                    x: startX + index * nodeWidth,
                    y: y
                };
            });
        });
    }

    private calculateCircularLayout(): void {
        const centerX = 400;
        const centerY = 300;
        const radius = 200;
        const angleStep = (2 * Math.PI) / this.data.tasks.length;

        this.data.tasks.forEach((task, index) => {
            const angle = index * angleStep;
            task.position = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-dependency-visualizer';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Controls
        if (this.config.showControls) {
            this.renderControls();
        }

        // Canvas
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'xwui-dependency-visualizer-canvas';

        const svgContainer = document.createElement('div');
        svgContainer.style.position = 'relative';
        svgContainer.style.width = '100%';
        svgContainer.style.height = '600px';
        svgContainer.style.overflow = 'auto';

        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgElement.setAttribute('width', '100%');
        this.svgElement.setAttribute('height', '600');
        this.svgElement.setAttribute('viewBox', '0 0 800 600');
        this.svgElement.style.cursor = 'move';

        // Render dependencies (lines first)
        this.renderDependencies();

        // Render tasks (nodes on top)
        this.renderTasks();

        svgContainer.appendChild(this.svgElement);
        canvasContainer.appendChild(svgContainer);
        this.wrapperElement.appendChild(canvasContainer);

        this.container.appendChild(this.wrapperElement);
    }

    private renderControls(): void {
        const controlsBar = document.createElement('div');
        controlsBar.className = 'xwui-dependency-visualizer-controls';

        const buttonsContainer = document.createElement('div');
        this.buttons = new XWUIButtonGroup(buttonsContainer, {
            buttons: [
                { id: 'hierarchical', label: 'Hierarchical' },
                { id: 'circular', label: 'Circular' },
                { id: 'auto', label: 'Auto' }
            ]
        });
        this.registerChildComponent(this.buttons);

        this.buttons.onButtonClick((buttonId: string) => {
            this.setLayout(buttonId as 'auto' | 'hierarchical' | 'circular');
        });

        controlsBar.appendChild(buttonsContainer);
        this.wrapperElement!.appendChild(controlsBar);
    }

    private renderDependencies(): void {
        if (!this.svgElement) return;

        this.data.dependencies.forEach(dep => {
            const fromTask = this.data.tasks.find(t => t.id === dep.from);
            const toTask = this.data.tasks.find(t => t.id === dep.to);

            if (!fromTask?.position || !toTask?.position) return;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', String(fromTask.position.x));
            line.setAttribute('y1', String(fromTask.position.y));
            line.setAttribute('x2', String(toTask.position.x));
            line.setAttribute('y2', String(toTask.position.y));
            line.setAttribute('stroke', this.getDependencyColor(dep.type));
            line.setAttribute('stroke-width', '2');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            line.classList.add('xwui-dependency-visualizer-link');

            // Arrow marker
            if (!this.svgElement.querySelector('#arrowhead')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
                marker.setAttribute('id', 'arrowhead');
                marker.setAttribute('markerWidth', '10');
                marker.setAttribute('markerHeight', '10');
                marker.setAttribute('refX', '9');
                marker.setAttribute('refY', '3');
                marker.setAttribute('orient', 'auto');

                const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                polygon.setAttribute('points', '0 0, 10 3, 0 6');
                polygon.setAttribute('fill', this.getDependencyColor(dep.type));
                marker.appendChild(polygon);
                defs.appendChild(marker);
                this.svgElement.appendChild(defs);
            }

            this.svgElement.appendChild(line);
        });
    }

    private renderTasks(): void {
        if (!this.svgElement) return;

        this.data.tasks.forEach(task => {
            if (!task.position) return;

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('data-task-id', task.id);

            // Node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', String(task.position.x));
            circle.setAttribute('cy', String(task.position.y));
            circle.setAttribute('r', '40');
            circle.setAttribute('fill', this.getTaskColor(task.status || 'pending'));
            circle.setAttribute('stroke', 'var(--border-color, #dee2e6)');
            circle.setAttribute('stroke-width', '2');
            circle.classList.add('xwui-dependency-visualizer-node');
            circle.style.cursor = 'pointer';

            circle.addEventListener('click', () => {
                this.handleNodeClick(task);
            });

            circle.addEventListener('mouseenter', () => {
                this.showTooltip(task, circle);
            });

            circle.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            // Label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', String(task.position.x));
            text.setAttribute('y', String(task.position.y));
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', 'var(--text-inverse, #ffffff)');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = task.label.length > 10 ? task.label.substring(0, 10) + '...' : task.label;

            group.appendChild(circle);
            group.appendChild(text);
            this.svgElement.appendChild(group);
        });
    }

    private getDependencyColor(type: string): string {
        const colors: Record<string, string> = {
            'blocks': 'var(--accent-error, #ef4444)',
            'precedes': 'var(--accent-primary, #4f46e5)',
            'related': 'var(--accent-warning, #f59e0b)'
        };
        return colors[type] || 'var(--text-secondary, #6c757d)';
    }

    private getTaskColor(status: string): string {
        const colors: Record<string, string> = {
            'completed': 'var(--accent-success, #10b981)',
            'in-progress': 'var(--accent-primary, #4f46e5)',
            'blocked': 'var(--accent-error, #ef4444)',
            'pending': 'var(--text-secondary, #6c757d)'
        };
        return colors[status] || 'var(--text-secondary, #6c757d)';
    }

    private showTooltip(task: TaskNode, element: SVGElement): void {
        const rect = element.getBoundingClientRect();
        const tooltipContent = `
            <strong>${task.label}</strong><br>
            Status: ${task.status || 'pending'}<br>
            Dependencies: ${this.data.dependencies.filter(d => d.to === task.id).length}
        `;

        // Create temporary div for tooltip target
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = `${rect.left}px`;
        tempDiv.style.top = `${rect.top}px`;
        document.body.appendChild(tempDiv);

        this.tooltipComponent = new XWUITooltip(tempDiv, {
            content: tooltipContent,
            placement: 'top'
        });
        this.registerChildComponent(this.tooltipComponent);
    }

    private hideTooltip(): void {
        if (this.tooltipComponent) {
            this.tooltipComponent.destroy();
            this.tooltipComponent = null;
        }
    }

    private handleNodeClick(task: TaskNode): void {
        this.selectedNode = task;
        if (this.config.editable) {
            this.openEditDialog(task);
        }
        this.clickHandlers.forEach(handler => handler(task));
    }

    private openEditDialog(task: TaskNode): void {
        // Open dialog to edit dependencies
        const dialogContainer = document.createElement('div');
        this.dialog = new XWUIDialog(dialogContainer, {
            title: `Edit Dependencies: ${task.label}`,
            content: 'Dependency editor would go here'
        });
        this.registerChildComponent(this.dialog);

        document.body.appendChild(dialogContainer);
        this.dialog.open();
        
        this.dialog.onClose(() => {
            if (dialogContainer.parentNode) {
                dialogContainer.parentNode.removeChild(dialogContainer);
            }
        });
    }

    private setLayout(layout: 'auto' | 'hierarchical' | 'circular'): void {
        this.config.layout = layout;
        this.calculateLayout();
        this.render();
    }

    public onClick(handler: (task: TaskNode) => void): void {
        this.clickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        // All registered child components (buttons, tooltipComponent, dialog) are automatically destroyed by base class
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.tooltipComponent = null;
        this.buttons = null;
        this.dialog = null;
        this.svgElement = null;
        this.selectedNode = null;
        this.clickHandlers = [];
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDependencyVisualizer as any).componentName = 'XWUIDependencyVisualizer';


