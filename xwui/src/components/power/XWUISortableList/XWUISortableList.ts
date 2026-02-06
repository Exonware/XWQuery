/**
 * XWUISortableList Component
 * Drag-and-drop sortable list with HTML5 drag API
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUISortableListConfig {
    itemClassName?: string;
    draggingClassName?: string;
    className?: string;
}

// Data type
export interface XWUISortableListData<T = any> {
    items: T[];
    renderItem: (item: T, index: number) => HTMLElement | string;
}

export class XWUISortableList<T = any> extends XWUIComponent<XWUISortableListData<T>, XWUISortableListConfig> {
    private listElement: HTMLElement | null = null;
    private draggingIndex: number | null = null;
    private currentItems: T[] = [];
    private changeHandlers: Array<(items: T[]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUISortableListData<T>,
        conf_comp: XWUISortableListConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.currentItems = [...this.data.items];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISortableListConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISortableListConfig {
        return {
            itemClassName: conf_comp?.itemClassName,
            draggingClassName: conf_comp?.draggingClassName ?? 'xwui-sortable-list-item-dragging',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.listElement = document.createElement('div');
        this.listElement.className = 'xwui-sortable-list';
        
        if (this.config.className) {
            this.listElement.classList.add(this.config.className);
        }

        this.currentItems.forEach((item, index) => {
            const itemElement = this.createItemElement(item, index);
            this.listElement!.appendChild(itemElement);
        });

        this.container.appendChild(this.listElement);
    }

    private createItemElement(item: T, index: number): HTMLElement {
        const itemElement = document.createElement('div');
        itemElement.className = 'xwui-sortable-list-item';
        
        if (this.config.itemClassName) {
            itemElement.classList.add(this.config.itemClassName);
        }
        
        if (this.draggingIndex === index) {
            itemElement.classList.add(this.config.draggingClassName || 'xwui-sortable-list-item-dragging');
        }

        itemElement.draggable = true;
        itemElement.setAttribute('data-index', index.toString());

        // Content
        const rendered = this.data.renderItem(item, index);
        if (typeof rendered === 'string') {
            itemElement.innerHTML = rendered;
        } else {
            itemElement.appendChild(rendered);
        }

        // Drag handlers
        itemElement.addEventListener('dragstart', (e) => {
            this.handleDragStart(e, index);
        });

        itemElement.addEventListener('dragover', (e) => {
            this.handleDragOver(e, index);
        });

        itemElement.addEventListener('dragend', () => {
            this.handleDragEnd();
        });

        itemElement.addEventListener('drop', (e) => {
            e.preventDefault();
        });

        return itemElement;
    }

    private handleDragStart(e: DragEvent, index: number): void {
        this.draggingIndex = index;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', index.toString());
        }
        
        const itemElement = e.target as HTMLElement;
        if (itemElement) {
            itemElement.classList.add(this.config.draggingClassName || 'xwui-sortable-list-item-dragging');
        }
    }

    private handleDragOver(e: DragEvent, index: number): void {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }

        if (this.draggingIndex === null || this.draggingIndex === index) return;

        const updatedItems = [...this.currentItems];
        const draggedItem = updatedItems.splice(this.draggingIndex, 1)[0];
        updatedItems.splice(index, 0, draggedItem);

        this.currentItems = updatedItems;
        this.draggingIndex = index;
        this.render();
        this.changeHandlers.forEach(handler => handler([...this.currentItems]));
    }

    private handleDragEnd(): void {
        this.draggingIndex = null;
        this.render();
    }

    public setItems(items: T[]): void {
        this.currentItems = [...items];
        this.data.items = [...items];
        this.render();
    }

    public getItems(): T[] {
        return [...this.currentItems];
    }

    public onChange(handler: (items: T[]) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.listElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        if (this.listElement) {
            this.listElement.remove();
            this.listElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISortableList as any).componentName = 'XWUISortableList';


