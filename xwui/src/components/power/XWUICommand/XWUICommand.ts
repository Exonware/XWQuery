/**
 * XWUICommand Component
 * Command palette / command menu component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUIList, type XWUIListItem } from '../XWUIList/XWUIList';

export interface XWUICommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    keywords?: string[];
    action?: () => void;
}

// Component-level configuration
export interface XWUICommandConfig {
    placeholder?: string;
    className?: string;
}

// Data type
export interface XWUICommandData {
    items: XWUICommandItem[];
}

export class XWUICommand extends XWUIComponent<XWUICommandData, XWUICommandConfig> {
    private commandElement: HTMLElement | null = null;
    private inputInstance: XWUIInput | null = null;
    private listInstance: XWUIList | null = null;
    private filteredItems: XWUICommandItem[] = [];
    private isOpen: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUICommandData,
        conf_comp: XWUICommandConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.filteredItems = [...this.data.items];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICommandConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICommandConfig {
        return {
            placeholder: conf_comp?.placeholder ?? 'Type a command or search...',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.commandElement = document.createElement('div');
        this.commandElement.className = 'xwui-command';
        
        if (this.config.className) {
            this.commandElement.classList.add(this.config.className);
        }

        // Input
        const inputContainer = document.createElement('div');
        this.inputInstance = new XWUIInput(
            inputContainer,
            { value: '', placeholder: this.config.placeholder },
            { type: 'text' }
        );

        this.inputInstance.onChange((value) => {
            this.filterItems(value);
        });

        this.commandElement.appendChild(inputContainer);

        // List
        const listContainer = document.createElement('div');
        const listItems: XWUIListItem[] = this.filteredItems.map(item => ({
            id: item.id,
            label: item.label,
            description: item.description,
            icon: item.icon
        }));

        this.listInstance = new XWUIList(
            listContainer,
            { items: listItems },
            { hoverable: true }
        );

        this.listInstance.onItemClick((item, event) => {
            const commandItem = this.data.items.find(i => i.id === item.id);
            if (commandItem?.action) {
                commandItem.action();
            }
        });

        this.commandElement.appendChild(listContainer);
        this.container.appendChild(this.commandElement);
    }

    private filterItems(query: string): void {
        const lowerQuery = query.toLowerCase();
        
        this.filteredItems = this.data.items.filter(item => {
            if (item.label.toLowerCase().includes(lowerQuery)) return true;
            if (item.description?.toLowerCase().includes(lowerQuery)) return true;
            if (item.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery))) return true;
            return false;
        });

        // Re-render list
        if (this.listInstance) {
            const listItems: XWUIListItem[] = this.filteredItems.map(item => ({
                id: item.id,
                label: item.label,
                description: item.description,
                icon: item.icon
            }));
            this.listInstance['data'].items = listItems;
            this.listInstance['render']();
        }
    }

    public open(): void {
        this.isOpen = true;
        if (this.commandElement) {
            this.commandElement.style.display = 'block';
        }
        this.inputInstance?.focus();
    }

    public close(): void {
        this.isOpen = false;
        if (this.commandElement) {
            this.commandElement.style.display = 'none';
        }
    }

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public getElement(): HTMLElement | null {
        return this.commandElement;
    }

    public destroy(): void {
        if (this.inputInstance) {
            this.inputInstance.destroy();
            this.inputInstance = null;
        }
        if (this.listInstance) {
            this.listInstance.destroy();
            this.listInstance = null;
        }
        if (this.commandElement) {
            this.commandElement.remove();
            this.commandElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICommand as any).componentName = 'XWUICommand';


