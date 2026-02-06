/**
 * XWUIItemGroup Component
 * A container for multiple XWUIItems that handles lists/trees of items
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIItem, type XWUIItemConfig, type ItemConfig, type Direction } from '../XWUIItem/XWUIItem';

export interface XWUIItemGroupConfig {
    items: ItemConfig[];
    language?: { [key: string]: string };
    direction?: Direction;
    isCollapsed?: boolean;
    highlightedItem?: string | null;
    onItemClick?: (item: ItemConfig, event: MouseEvent) => void;
    onItemRightClick?: (item: ItemConfig, event: MouseEvent) => void;
    onItemAction?: (action: string, item: ItemConfig, event: MouseEvent) => void;
    group_type?: 'collapsible_list' | 'inline_grid';
    group_flow?: 'list' | 'table' | 'free' | 'grid';
    group_axis?: 'v' | 'h';
    group_stops?: boolean;
    allow_v_scroll?: boolean;
    className?: string;
}

// Data type for XWUIItemGroup
export interface XWUIItemGroupData {
    items?: ItemConfig[];
}

export class XWUIItemGroup extends XWUIComponent<XWUIItemGroupData, XWUIItemGroupConfig> {
    private itemInstances: Map<string, XWUIItem> = new Map();

    constructor(
        container: HTMLElement,
        data: XWUIItemGroupData = {},
        conf_comp: XWUIItemGroupConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Merge items from data and config (config takes priority)
        if (conf_comp.items && conf_comp.items.length > 0) {
            this.config.items = conf_comp.items;
        } else if (data.items && data.items.length > 0) {
            this.config.items = data.items;
        } else {
            this.config.items = [];
        }
        
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIItemGroupConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIItemGroupConfig {
        return {
            items: conf_comp?.items || [],
            language: conf_comp?.language,
            direction: conf_comp?.direction || 'ltr',
            isCollapsed: conf_comp?.isCollapsed ?? false,
            highlightedItem: conf_comp?.highlightedItem || null,
            onItemClick: conf_comp?.onItemClick,
            onItemRightClick: conf_comp?.onItemRightClick,
            onItemAction: conf_comp?.onItemAction,
            group_type: conf_comp?.group_type,
            group_flow: conf_comp?.group_flow,
            group_axis: conf_comp?.group_axis,
            group_stops: conf_comp?.group_stops ?? false,
            allow_v_scroll: conf_comp?.allow_v_scroll ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        const { items = [], direction = 'ltr', isCollapsed = false, allow_v_scroll = false, className } = this.config;
        
        // Clear container
        this.container.innerHTML = '';
        this.itemInstances.clear();
        
        // Create group container
        const groupContainer = document.createElement('div');
        let containerClass = `xwui-item-group ${direction === 'ltr' ? 'xwui-item-group-ltr' : 'xwui-item-group-rtl'}`;
        if (className) {
            containerClass += ` ${className}`;
        }
        groupContainer.className = containerClass;
        
        if (allow_v_scroll) {
            groupContainer.style.overflowY = 'auto';
            groupContainer.style.overflowX = 'hidden';
        }
        
        // Render each item
        items.forEach(item => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'xwui-item-group-item';
            
            const itemComponentConfig: XWUIItemConfig = {
                language: this.config.language,
                direction: direction,
                isCollapsed: isCollapsed,
                highlightedItem: this.config.highlightedItem,
                onItemClick: this.config.onItemClick,
                onItemRightClick: this.config.onItemRightClick,
                onItemAction: (action, item, event) => {
                    // Handle expand/collapse for items with nested groups
                    if (action === 'toggle_expand' && item.group_list) {
                        this.handleToggleExpand(item);
                    }
                    // Forward other actions
                    if (this.config.onItemAction) {
                        this.config.onItemAction(action, item, event);
                    }
                }
            };
            
            // Pass item as data (ItemConfig), and itemComponentConfig as conf_comp (XWUIItemConfig)
            const xwItem = new XWUIItem(itemContainer, item, itemComponentConfig);
            this.itemInstances.set(item.uid, xwItem);
            
            groupContainer.appendChild(itemContainer);
            
            // If item has nested group_list and is expanded, render it
            if (item.group_list && item.itemStates?.isExpanded && !item.group_stops) {
                const nestedGroupContainer = document.createElement('div');
                nestedGroupContainer.className = `xwui-item-nested-group ${direction === 'ltr' ? 'xwui-item-group-ltr' : 'xwui-item-group-rtl'}`;
                
                const nestedConfig: XWUIItemGroupConfig = {
                    ...this.config,
                    items: item.group_list
                };
                
                const nestedGroup = new XWUIItemGroup(nestedGroupContainer, nestedConfig);
                groupContainer.appendChild(nestedGroupContainer);
            }
        });
        
        this.container.appendChild(groupContainer);
    }

    private handleToggleExpand(item: ItemConfig): void {
        // Toggle expanded state
        if (item.itemStates) {
            item.itemStates.isExpanded = !item.itemStates.isExpanded;
        } else {
            item.itemStates = { isExpanded: true };
        }
        
        // Re-render the group to show updated state
        this.render();
    }

    public updateConfig(newConfig: Partial<XWUIItemGroupConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.render();
    }

    public getItemInstance(uid: string): XWUIItem | undefined {
        return this.itemInstances.get(uid);
    }

    public destroy(): void {
        this.itemInstances.forEach(item => item.destroy());
        this.itemInstances.clear();
        this.container.innerHTML = '';
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIItemGroup as any).componentName = 'XWUIItemGroup';

