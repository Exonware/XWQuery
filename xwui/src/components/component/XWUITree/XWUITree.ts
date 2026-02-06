/**
 * XWUITree Component
 * Tree structure display with expand/collapse and selection
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUITreeNode {
    id: string;
    label: string;
    icon?: string;
    children?: XWUITreeNode[];
    expanded?: boolean;
    selected?: boolean;
    disabled?: boolean;
}

// Component-level configuration
export interface XWUITreeConfig {
    selectable?: boolean;
    multiple?: boolean;
    showIcons?: boolean;
    className?: string;
}

// Data type
export interface XWUITreeData {
    nodes: XWUITreeNode[];
}

export class XWUITree extends XWUIComponent<XWUITreeData, XWUITreeConfig> {
    private treeElement: HTMLElement | null = null;
    private clickHandlers: Array<(node: XWUITreeNode, event: Event) => void> = [];
    private selectHandlers: Array<(selectedNodes: XWUITreeNode[]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUITreeData,
        conf_comp: XWUITreeConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITreeConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITreeConfig {
        return {
            selectable: conf_comp?.selectable ?? false,
            multiple: conf_comp?.multiple ?? false,
            showIcons: conf_comp?.showIcons ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.treeElement = document.createElement('div');
        this.treeElement.className = 'xwui-tree';
        
        if (this.config.className) {
            this.treeElement.classList.add(this.config.className);
        }

        this.data.nodes.forEach(node => {
            const nodeElement = this.createNodeElement(node, 0);
            this.treeElement!.appendChild(nodeElement);
        });

        this.container.appendChild(this.treeElement);
    }

    private createNodeElement(node: XWUITreeNode, level: number): HTMLElement {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'xwui-tree-node';
        nodeElement.setAttribute('data-node-id', node.id);
        nodeElement.style.paddingLeft = `${level * 1.5}rem`;

        if (node.disabled) {
            nodeElement.classList.add('xwui-tree-node-disabled');
        }
        if (node.selected) {
            nodeElement.classList.add('xwui-tree-node-selected');
        }

        const nodeContent = document.createElement('div');
        nodeContent.className = 'xwui-tree-node-content';

        // Expand/collapse icon
        if (node.children && node.children.length > 0) {
            const expandIcon = document.createElement('span');
            expandIcon.className = 'xwui-tree-expand-icon';
            expandIcon.textContent = node.expanded ? '▼' : '▶';
            expandIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                node.expanded = !node.expanded;
                this.render();
            });
            nodeContent.appendChild(expandIcon);
        } else {
            const spacer = document.createElement('span');
            spacer.className = 'xwui-tree-spacer';
            nodeContent.appendChild(spacer);
        }

        // Node icon
        if (this.config.showIcons && node.icon) {
            const icon = document.createElement('span');
            icon.className = 'xwui-tree-node-icon';
            icon.innerHTML = node.icon;
            nodeContent.appendChild(icon);
        }

        // Label
        const label = document.createElement('span');
        label.className = 'xwui-tree-node-label';
        label.textContent = node.label;
        nodeContent.appendChild(label);

        nodeContent.addEventListener('click', (e) => {
            if (!node.disabled) {
                if (this.config.selectable) {
                    this.toggleSelection(node);
                }
                this.clickHandlers.forEach(handler => handler(node, e));
            }
        });

        nodeElement.appendChild(nodeContent);

        // Children
        if (node.children && node.children.length > 0 && node.expanded) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'xwui-tree-children';
            node.children.forEach(child => {
                childrenContainer.appendChild(this.createNodeElement(child, level + 1));
            });
            nodeElement.appendChild(childrenContainer);
        }

        return nodeElement;
    }

    private toggleSelection(node: XWUITreeNode): void {
        if (this.config.multiple) {
            node.selected = !node.selected;
        } else {
            // Deselect all
            this.deselectAll();
            node.selected = true;
        }
        this.render();
        this.notifySelection();
    }

    private deselectAll(): void {
        const traverse = (nodes: XWUITreeNode[]) => {
            nodes.forEach(node => {
                node.selected = false;
                if (node.children) {
                    traverse(node.children);
                }
            });
        };
        traverse(this.data.nodes);
    }

    private notifySelection(): void {
        const selected: XWUITreeNode[] = [];
        const traverse = (nodes: XWUITreeNode[]) => {
            nodes.forEach(node => {
                if (node.selected) {
                    selected.push(node);
                }
                if (node.children) {
                    traverse(node.children);
                }
            });
        };
        traverse(this.data.nodes);
        this.selectHandlers.forEach(handler => handler(selected));
    }

    public onNodeClick(handler: (node: XWUITreeNode, event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    public onSelect(handler: (selectedNodes: XWUITreeNode[]) => void): void {
        this.selectHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.treeElement;
    }

    public destroy(): void {
        this.clickHandlers = [];
        this.selectHandlers = [];
        if (this.treeElement) {
            this.treeElement.remove();
            this.treeElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITree as any).componentName = 'XWUITree';


