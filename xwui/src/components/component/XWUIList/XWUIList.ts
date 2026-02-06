/**
 * XWUIList Component
 * List component using XWUIItemGroup
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIItemGroup } from '../XWUIItemGroup/XWUIItemGroup';

export interface XWUIListItem {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    avatar?: string;
    action?: HTMLElement;
    disabled?: boolean;
    checked?: boolean;
}

// Component-level configuration
export interface XWUIListConfig {
    size?: 'small' | 'medium' | 'large';
    bordered?: boolean;
    hoverable?: boolean;
    checkable?: boolean;
    showSelectAll?: boolean;
    className?: string;
}

// Data type
export interface XWUIListData {
    items: XWUIListItem[];
}

export class XWUIList extends XWUIComponent<XWUIListData, XWUIListConfig> {
    private listElement: HTMLElement | null = null;
    private itemGroupInstance: XWUIItemGroup | null = null;
    private clickHandlers: Array<(item: XWUIListItem, event: Event) => void> = [];
    private selectHandlers: Array<(selectedIds: string[]) => void> = [];
    private selectAllCheckbox: HTMLInputElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIListData,
        conf_comp: XWUIListConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIListConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIListConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            bordered: conf_comp?.bordered ?? false,
            hoverable: conf_comp?.hoverable ?? true,
            checkable: conf_comp?.checkable ?? false,
            showSelectAll: conf_comp?.showSelectAll ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.listElement = document.createElement('div');
        this.listElement.className = 'xwui-list';
        this.listElement.classList.add(`xwui-list-${this.config.size}`);
        
        if (this.config.bordered) {
            this.listElement.classList.add('xwui-list-bordered');
        }
        if (this.config.hoverable) {
            this.listElement.classList.add('xwui-list-hoverable');
        }
        if (this.config.className) {
            this.listElement.classList.add(this.config.className);
        }

        // Select all header
        if (this.config.checkable && this.config.showSelectAll) {
            const selectAllHeader = document.createElement('div');
            selectAllHeader.className = 'xwui-list-select-all';
            
            this.selectAllCheckbox = document.createElement('input');
            this.selectAllCheckbox.type = 'checkbox';
            this.selectAllCheckbox.className = 'xwui-list-select-all-checkbox';
            this.selectAllCheckbox.addEventListener('change', () => {
                if (this.selectAllCheckbox?.checked) {
                    this.selectAll();
                } else {
                    this.deselectAll();
                }
            });
            
            const label = document.createElement('label');
            label.textContent = 'Select All';
            label.appendChild(this.selectAllCheckbox);
            selectAllHeader.appendChild(label);
            
            this.listElement.appendChild(selectAllHeader);
        }

        // Convert items to XWUIItemGroup format (ItemConfig)
        const itemGroupData = this.data.items.map((item, index) => {
            const itemId = item.id || `list-item-${index}`;
            const label = item.label || item.text || itemId;
            
            // Build primaryContent from label and icon (required by ItemConfig)
            const primaryContent: Array<{ type: string; value: string }> = [];
            if (item.icon) {
                primaryContent.push({ type: 'icon', value: item.icon });
            }
            if (label) {
                primaryContent.push({ type: 'text', value: label });
            }
            // Ensure at least one content part exists
            if (primaryContent.length === 0) {
                primaryContent.push({ type: 'text', value: itemId });
            }
            
            // Build secondaryContent from description
            const secondaryContent: Array<{ type: string; value: string }> | undefined = 
                item.description ? [{ type: 'text', value: item.description }] : undefined;
            
            // Build avatarContent from avatar
            const avatarContent: Array<{ type: string; value: string }> | undefined = 
                item.avatar ? [{ type: 'image', value: item.avatar }] : undefined;
            
            return {
                id: itemId,
                primaryContent,
                secondaryContent,
                avatarContent,
                disabled: item.disabled,
                itemStates: {
                    isSelected: item.checked
                }
            };
        });

        this.itemGroupInstance = new XWUIItemGroup(
            this.listElement,
            { items: itemGroupData },
            {}
        );
        this.registerChildComponent(this.itemGroupInstance);

        // Add click handlers and checkboxes
        this.data.items.forEach((item, index) => {
            const itemElement = this.listElement?.querySelector(`[data-item-id="${item.id}"]`);
            if (itemElement && !item.disabled) {
                // Checkbox for checkable lists
                if (this.config.checkable) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'xwui-list-item-checkbox';
                    checkbox.checked = item.checked || false;
                    checkbox.addEventListener('change', (e) => {
                        e.stopPropagation();
                        item.checked = checkbox.checked;
                        this.updateSelectAllState();
                        this.notifySelectionChange();
                    });
                    
                    // Insert checkbox at the beginning of the item
                    itemElement.insertBefore(checkbox, itemElement.firstChild);
                    
                    if (item.checked) {
                        itemElement.classList.add('xwui-list-item-checked');
                    }
                }
                
                itemElement.addEventListener('click', (e) => {
                    // Don't trigger if clicking on checkbox
                    if (!(e.target as HTMLElement).classList.contains('xwui-list-item-checkbox')) {
                        this.clickHandlers.forEach(handler => handler(item, e));
                    }
                });
            }
        });
        
        this.updateSelectAllState();

        this.container.appendChild(this.listElement);
    }

    private updateSelectAllState(): void {
        if (!this.selectAllCheckbox) return;
        
        const checkedCount = this.data.items.filter(item => item.checked).length;
        const totalCount = this.data.items.length;
        
        this.selectAllCheckbox.checked = checkedCount === totalCount && totalCount > 0;
        this.selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount;
    }

    private notifySelectionChange(): void {
        const selectedIds = this.data.items.filter(item => item.checked).map(item => item.id);
        this.selectHandlers.forEach(handler => handler(selectedIds));
    }

    public selectAll(): void {
        this.data.items.forEach(item => {
            if (!item.disabled) {
                item.checked = true;
            }
        });
        this.render();
        this.notifySelectionChange();
    }

    public deselectAll(): void {
        this.data.items.forEach(item => {
            item.checked = false;
        });
        this.render();
        this.notifySelectionChange();
    }

    public getSelectedItems(): XWUIListItem[] {
        return this.data.items.filter(item => item.checked);
    }

    public getSelectedIds(): string[] {
        return this.data.items.filter(item => item.checked).map(item => item.id);
    }

    public onItemClick(handler: (item: XWUIListItem, event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    public onSelect(handler: (selectedIds: string[]) => void): void {
        this.selectHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.listElement;
    }

    public destroy(): void {
        // Child component (itemGroupInstance) is automatically destroyed by base class
        this.clickHandlers = [];
        this.selectHandlers = [];
        this.selectAllCheckbox = null;
        if (this.listElement) {
            this.listElement.remove();
            this.listElement = null;
        }
        this.itemGroupInstance = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIList as any).componentName = 'XWUIList';


