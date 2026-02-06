/**
 * XWUITreeSelect Component
 * Tree select dropdown
 * Combines Tree + Select functionality
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUITree, type XWUITreeNode, type XWUITreeConfig, type XWUITreeData } from '../XWUITree/XWUITree';
import { XWUIInput } from '../XWUIInput/XWUIInput';

export interface XWUITreeSelectConfig {
    treeCheckable?: boolean;
    treeDefaultExpandAll?: boolean;
    treeIcon?: boolean;
    showCheckedStrategy?: 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD';
    className?: string;
}

export interface XWUITreeSelectData {
    value?: string | number | Array<string | number>;
    treeData?: XWUITreeNode[];
    placeholder?: string;
}

export class XWUITreeSelect extends XWUIComponent<XWUITreeSelectData, XWUITreeSelectConfig> {
    private wrapperElement: HTMLElement | null = null;
    private inputInstance: XWUIInput | null = null;
    private treeInstance: XWUITree | null = null;
    private dropdownElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private selectedNodes: XWUITreeNode[] = [];

    constructor(
        container: HTMLElement,
        data: XWUITreeSelectData = {},
        conf_comp: XWUITreeSelectConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITreeSelectConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITreeSelectConfig {
        return {
            treeCheckable: conf_comp?.treeCheckable ?? false,
            treeDefaultExpandAll: conf_comp?.treeDefaultExpandAll ?? false,
            treeIcon: conf_comp?.treeIcon ?? true,
            showCheckedStrategy: conf_comp?.showCheckedStrategy ?? 'SHOW_CHILD',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-tree-select-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-tree-select';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Input
        const inputContainer = document.createElement('div');
        const displayValue = this.getDisplayValue();
        
        this.inputInstance = new XWUIInput(inputContainer, {
            value: displayValue,
            placeholder: this.data.placeholder || 'Please select'
        }, {
            readonly: true
        });
        this.registerChildComponent(this.inputInstance);

        const inputEl = inputContainer.querySelector('input');
        if (inputEl) {
            inputEl.addEventListener('click', () => this.toggle());
            inputEl.addEventListener('focus', () => {
                if (!this.isOpen) this.open();
            });
        }

        this.wrapperElement.appendChild(inputContainer);

        // Dropdown with tree
        this.dropdownElement = document.createElement('div');
        this.dropdownElement.className = 'xwui-tree-select-dropdown';
        this.dropdownElement.style.display = 'none';
        document.body.appendChild(this.dropdownElement);

        this.container.appendChild(this.wrapperElement);
        this.renderTree();
    }

    private renderTree(): void {
        if (!this.dropdownElement || !this.data.treeData) return;
        
        this.dropdownElement.innerHTML = '';
        
        // Convert treeData to XWUITree format
        const treeData: XWUITreeData = {
            nodes: this.data.treeData
        };

        const treeConfig: XWUITreeConfig = {
            selectable: true,
            multiple: this.config.treeCheckable || false,
            showIcons: this.config.treeIcon
        };

        // Create tree
        this.treeInstance = new XWUITree(this.dropdownElement, treeData, treeConfig, this.conf_sys, this.conf_usr);
        this.registerChildComponent(this.treeInstance);
        
        // Listen for selection
        // Note: We'd need to hook into XWUITree's selection events
        // For now, we'll handle it through the tree's internal logic
    }

    private getDisplayValue(): string {
        if (!this.data.value) return '';
        
        if (Array.isArray(this.data.value)) {
            return `${this.data.value.length} items selected`;
        }
        
        // Find label for single value
        const node = this.findNodeById(this.data.value);
        return node ? node.label : String(this.data.value);
    }

    private findNodeById(id: string | number): XWUITreeNode | null {
        const findInNodes = (nodes: XWUITreeNode[]): XWUITreeNode | null => {
            for (const node of nodes) {
                if (String(node.id) === String(id)) {
                    return node;
                }
                if (node.children) {
                    const found = findInNodes(node.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        return this.data.treeData ? findInNodes(this.data.treeData) : null;
    }

    private toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private open(): void {
        if (this.isOpen) return;
        
        this.isOpen = true;
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'block';
            this.updatePosition();
        }
    }

    private close(): void {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        if (this.dropdownElement) {
            this.dropdownElement.style.display = 'none';
        }
    }

    private updatePosition(): void {
        if (!this.dropdownElement || !this.wrapperElement) return;
        
        const rect = this.wrapperElement.getBoundingClientRect();
        this.dropdownElement.style.position = 'fixed';
        this.dropdownElement.style.top = `${rect.bottom + 4}px`;
        this.dropdownElement.style.left = `${rect.left}px`;
        this.dropdownElement.style.width = `${rect.width}px`;
        this.dropdownElement.style.maxHeight = '300px';
        this.dropdownElement.style.overflowY = 'auto';
    }

    public destroy(): void {
        if (this.dropdownElement && this.dropdownElement.parentNode) {
            this.dropdownElement.parentNode.removeChild(this.dropdownElement);
        }
        this.dropdownElement = null;
        // Child components (treeInstance, inputInstance) are automatically destroyed by base class
        this.treeInstance = null;
        this.inputInstance = null;
        this.wrapperElement = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITreeSelect as any).componentName = 'XWUITreeSelect';


