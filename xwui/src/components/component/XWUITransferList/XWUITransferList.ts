/**
 * XWUITransferList Component
 * Double-list component to move items between "Source" and "Target"
 * Used for assigning permissions, moving items, etc.
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';

export interface XWUITransferListItem {
    id: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

// Component-level configuration
export interface XWUITransferListConfig {
    showSearch?: boolean;
    showSelectAll?: boolean;
    titles?: [string, string]; // [sourceTitle, targetTitle]
    operations?: [string, string]; // [moveToTarget, moveToSource]
    listStyle?: Record<string, any>;
    className?: string;
}

// Data type
export interface XWUITransferListData {
    sourceItems: XWUITransferListItem[];
    targetItems: XWUITransferListItem[];
    selectedSourceKeys?: string[];
    selectedTargetKeys?: string[];
}

export class XWUITransferList extends XWUIComponent<XWUITransferListData, XWUITransferListConfig> {
    private wrapperElement: HTMLElement | null = null;
    private sourceListElement: HTMLElement | null = null;
    private targetListElement: HTMLElement | null = null;
    private sourceSearchInput: HTMLInputElement | null = null;
    private targetSearchInput: HTMLInputElement | null = null;
    private sourceFilteredItems: XWUITransferListItem[] = [];
    private targetFilteredItems: XWUITransferListItem[] = [];
    private selectedSourceKeys: Set<string> = new Set();
    private selectedTargetKeys: Set<string> = new Set();
    private changeHandlers: Array<(targetItems: XWUITransferListItem[]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUITransferListData,
        conf_comp: XWUITransferListConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.selectedSourceKeys = new Set(this.data.selectedSourceKeys || []);
        this.selectedTargetKeys = new Set(this.data.selectedTargetKeys || []);
        this.sourceFilteredItems = [...this.data.sourceItems];
        this.targetFilteredItems = [...this.data.targetItems];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITransferListConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITransferListConfig {
        return {
            showSearch: conf_comp?.showSearch ?? true,
            showSelectAll: conf_comp?.showSelectAll ?? true,
            titles: conf_comp?.titles ?? ['Source', 'Target'],
            operations: conf_comp?.operations ?? ['>', '<'],
            listStyle: conf_comp?.listStyle,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-transfer-list-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-transfer-list-wrapper';

        // Source list
        const sourceColumn = this.createListColumn('source', this.config.titles![0], this.data.sourceItems);
        this.wrapperElement.appendChild(sourceColumn);

        // Operations buttons
        const operationsColumn = this.createOperationsColumn();
        this.wrapperElement.appendChild(operationsColumn);

        // Target list
        const targetColumn = this.createListColumn('target', this.config.titles![1], this.data.targetItems);
        this.wrapperElement.appendChild(targetColumn);

        this.container.appendChild(this.wrapperElement);
    }

    private createListColumn(type: 'source' | 'target', title: string, items: XWUITransferListItem[]): HTMLElement {
        const column = document.createElement('div');
        column.className = `xwui-transfer-list-column xwui-transfer-list-${type}`;

        // Header
        const header = document.createElement('div');
        header.className = 'xwui-transfer-list-header';

        const titleElement = document.createElement('div');
        titleElement.className = 'xwui-transfer-list-title';
        titleElement.textContent = title;
        header.appendChild(titleElement);

        if (this.config.showSelectAll) {
            const selectAllButton = document.createElement('button');
            selectAllButton.className = 'xwui-transfer-list-select-all';
            selectAllButton.textContent = 'Select All';
            selectAllButton.addEventListener('click', () => this.handleSelectAll(type));
            header.appendChild(selectAllButton);
        }

        column.appendChild(header);

        // Search
        if (this.config.showSearch) {
            const searchWrapper = document.createElement('div');
            searchWrapper.className = 'xwui-transfer-list-search';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'xwui-transfer-list-search-input';
            searchInput.placeholder = 'Search...';
            searchInput.addEventListener('input', (e) => {
                const query = (e.target as HTMLInputElement).value.toLowerCase();
                this.handleSearch(type, query);
            });

            if (type === 'source') {
                this.sourceSearchInput = searchInput;
            } else {
                this.targetSearchInput = searchInput;
            }

            searchWrapper.appendChild(searchInput);
            column.appendChild(searchWrapper);
        }

        // List
        const listWrapper = document.createElement('div');
        listWrapper.className = 'xwui-transfer-list-items';

        if (type === 'source') {
            this.sourceListElement = listWrapper;
            this.renderListItems(listWrapper, type, this.sourceFilteredItems);
        } else {
            this.targetListElement = listWrapper;
            this.renderListItems(listWrapper, type, this.targetFilteredItems);
        }

        column.appendChild(listWrapper);

        return column;
    }

    private createOperationsColumn(): HTMLElement {
        const column = document.createElement('div');
        column.className = 'xwui-transfer-list-operations';

        const moveToTargetButton = document.createElement('button');
        moveToTargetButton.className = 'xwui-transfer-list-operation-button';
        moveToTargetButton.textContent = this.config.operations![0];
        moveToTargetButton.setAttribute('aria-label', 'Move selected to target');
        moveToTargetButton.addEventListener('click', () => this.moveToTarget());
        column.appendChild(moveToTargetButton);

        const moveToSourceButton = document.createElement('button');
        moveToSourceButton.className = 'xwui-transfer-list-operation-button';
        moveToSourceButton.textContent = this.config.operations![1];
        moveToSourceButton.setAttribute('aria-label', 'Move selected to source');
        moveToSourceButton.addEventListener('click', () => this.moveToSource());
        column.appendChild(moveToSourceButton);

        return column;
    }

    private renderListItems(container: HTMLElement, type: 'source' | 'target', items: XWUITransferListItem[]): void {
        container.innerHTML = '';

        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'xwui-transfer-list-empty';
            empty.textContent = 'No items';
            container.appendChild(empty);
            return;
        }

        items.forEach((item) => {
            const itemElement = this.createListItem(item, type);
            container.appendChild(itemElement);
        });
    }

    private createListItem(item: XWUITransferListItem, type: 'source' | 'target'): HTMLElement {
        const itemElement = document.createElement('div');
        itemElement.className = 'xwui-transfer-list-item';
        itemElement.setAttribute('data-item-id', item.id);

        const isSelected = type === 'source' 
            ? this.selectedSourceKeys.has(item.id)
            : this.selectedTargetKeys.has(item.id);

        if (isSelected) {
            itemElement.classList.add('xwui-transfer-list-item-selected');
        }

        if (item.disabled) {
            itemElement.classList.add('xwui-transfer-list-item-disabled');
        }

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isSelected;
        checkbox.disabled = item.disabled || false;
        checkbox.addEventListener('change', () => {
            this.handleItemSelect(item.id, type, checkbox.checked);
        });
        itemElement.appendChild(checkbox);

        // Content
        const content = document.createElement('div');
        content.className = 'xwui-transfer-list-item-content';

        const label = document.createElement('div');
        label.className = 'xwui-transfer-list-item-label';
        label.textContent = item.label;
        content.appendChild(label);

        if (item.description) {
            const description = document.createElement('div');
            description.className = 'xwui-transfer-list-item-description';
            description.textContent = item.description;
            content.appendChild(description);
        }

        itemElement.appendChild(content);

        // Click handler for entire item
        if (!item.disabled) {
            itemElement.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    this.handleItemSelect(item.id, type, checkbox.checked);
                }
            });
        }

        return itemElement;
    }

    private handleItemSelect(itemId: string, type: 'source' | 'target', selected: boolean): void {
        if (type === 'source') {
            if (selected) {
                this.selectedSourceKeys.add(itemId);
            } else {
                this.selectedSourceKeys.delete(itemId);
            }
        } else {
            if (selected) {
                this.selectedTargetKeys.add(itemId);
            } else {
                this.selectedTargetKeys.delete(itemId);
            }
        }
        this.updateSelection();
    }

    private handleSelectAll(type: 'source' | 'target'): void {
        const items = type === 'source' ? this.sourceFilteredItems : this.targetFilteredItems;
        const allSelected = items.every(item => {
            if (item.disabled) return true;
            return type === 'source' 
                ? this.selectedSourceKeys.has(item.id)
                : this.selectedTargetKeys.has(item.id);
        });

        items.forEach(item => {
            if (!item.disabled) {
                if (allSelected) {
                    if (type === 'source') {
                        this.selectedSourceKeys.delete(item.id);
                    } else {
                        this.selectedTargetKeys.delete(item.id);
                    }
                } else {
                    if (type === 'source') {
                        this.selectedSourceKeys.add(item.id);
                    } else {
                        this.selectedTargetKeys.add(item.id);
                    }
                }
            }
        });

        this.updateSelection();
        this.render();
    }

    private handleSearch(type: 'source' | 'target', query: string): void {
        const items = type === 'source' ? this.data.sourceItems : this.data.targetItems;
        
        if (!query.trim()) {
            if (type === 'source') {
                this.sourceFilteredItems = [...items];
            } else {
                this.targetFilteredItems = [...items];
            }
        } else {
            const filtered = items.filter(item =>
                item.label.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query)
            );
            
            if (type === 'source') {
                this.sourceFilteredItems = filtered;
            } else {
                this.targetFilteredItems = filtered;
            }
        }

        this.render();
    }

    private moveToTarget(): void {
        const itemsToMove = this.data.sourceItems.filter(item => 
            this.selectedSourceKeys.has(item.id)
        );

        itemsToMove.forEach(item => {
            // Remove from source
            const index = this.data.sourceItems.findIndex(i => i.id === item.id);
            if (index > -1) {
                this.data.sourceItems.splice(index, 1);
            }
            // Add to target
            this.data.targetItems.push(item);
            this.selectedSourceKeys.delete(item.id);
        });

        this.sourceFilteredItems = [...this.data.sourceItems];
        this.targetFilteredItems = [...this.data.targetItems];
        this.notifyChange();
        this.render();
    }

    private moveToSource(): void {
        const itemsToMove = this.data.targetItems.filter(item => 
            this.selectedTargetKeys.has(item.id)
        );

        itemsToMove.forEach(item => {
            // Remove from target
            const index = this.data.targetItems.findIndex(i => i.id === item.id);
            if (index > -1) {
                this.data.targetItems.splice(index, 1);
            }
            // Add to source
            this.data.sourceItems.push(item);
            this.selectedTargetKeys.delete(item.id);
        });

        this.sourceFilteredItems = [...this.data.sourceItems];
        this.targetFilteredItems = [...this.data.targetItems];
        this.notifyChange();
        this.render();
    }

    private updateSelection(): void {
        // Update visual selection state
        if (this.sourceListElement) {
            Array.from(this.sourceListElement.children).forEach((el: Element) => {
                const itemId = el.getAttribute('data-item-id');
                if (itemId) {
                    el.classList.toggle('xwui-transfer-list-item-selected', this.selectedSourceKeys.has(itemId));
                }
            });
        }

        if (this.targetListElement) {
            Array.from(this.targetListElement.children).forEach((el: Element) => {
                const itemId = el.getAttribute('data-item-id');
                if (itemId) {
                    el.classList.toggle('xwui-transfer-list-item-selected', this.selectedTargetKeys.has(itemId));
                }
            });
        }
    }

    private notifyChange(): void {
        this.changeHandlers.forEach(handler => handler([...this.data.targetItems]));
    }

    public getTargetItems(): XWUITransferListItem[] {
        return [...this.data.targetItems];
    }

    public getSourceItems(): XWUITransferListItem[] {
        return [...this.data.sourceItems];
    }

    public onChange(handler: (targetItems: XWUITransferListItem[]) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        this.selectedSourceKeys.clear();
        this.selectedTargetKeys.clear();
        this.sourceFilteredItems = [];
        this.targetFilteredItems = [];
        this.wrapperElement = null;
        this.sourceListElement = null;
        this.targetListElement = null;
        this.sourceSearchInput = null;
        this.targetSearchInput = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITransferList as any).componentName = 'XWUITransferList';


