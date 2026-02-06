/**
 * XWUIMenu Component
 * Navigation menu component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIItemGroup } from '../XWUIItemGroup/XWUIItemGroup';

export interface XWUIMenuItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    children?: XWUIMenuItem[];
    disabled?: boolean;
    divider?: boolean;
}

// Component-level configuration
export interface XWUIMenuConfig {
    mode?: 'horizontal' | 'vertical';
    theme?: 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIMenuData {
    items: XWUIMenuItem[];
    selected?: string;
}

export class XWUIMenu extends XWUIComponent<XWUIMenuData, XWUIMenuConfig> {
    private menuElement: HTMLElement | null = null;
    private itemGroupInstance: XWUIItemGroup | null = null;
    private clickHandlers: Array<(item: XWUIMenuItem, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIMenuData,
        conf_comp: XWUIMenuConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMenuConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMenuConfig {
        return {
            mode: conf_comp?.mode ?? 'horizontal',
            theme: conf_comp?.theme ?? 'light',
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.menuElement = document.createElement('nav');
        this.menuElement.className = 'xwui-menu';
        this.menuElement.classList.add(`xwui-menu-${this.config.mode}`);
        this.menuElement.classList.add(`xwui-menu-${this.config.theme}`);
        this.menuElement.classList.add(`xwui-menu-${this.config.size}`);
        this.menuElement.setAttribute('role', 'navigation');
        
        if (this.config.className) {
            this.menuElement.classList.add(this.config.className);
        }

        const list = document.createElement('ul');
        list.className = 'xwui-menu-list';

        this.data.items.forEach(item => {
            const listItem = this.createMenuItem(item);
            list.appendChild(listItem);
        });

        this.menuElement.appendChild(list);
        this.container.appendChild(this.menuElement);
    }

    private createMenuItem(item: XWUIMenuItem): HTMLLIElement {
        const li = document.createElement('li');
        li.className = 'xwui-menu-item';

        if (item.divider) {
            li.className = 'xwui-menu-divider';
            return li;
        }

        if (this.data.selected === item.id) {
            li.classList.add('xwui-menu-item-selected');
        }

        if (item.disabled) {
            li.classList.add('xwui-menu-item-disabled');
        }

        const link = document.createElement(item.href ? 'a' : 'span');
        link.className = 'xwui-menu-link';
        
        if (item.href) {
            (link as HTMLAnchorElement).href = item.href;
        }

        if (item.icon) {
            const icon = document.createElement('span');
            icon.className = 'xwui-menu-icon';
            icon.innerHTML = item.icon;
            link.appendChild(icon);
        }

        const label = document.createElement('span');
        label.className = 'xwui-menu-label';
        label.textContent = item.label;
        link.appendChild(label);

        if (item.children && item.children.length > 0) {
            const arrow = document.createElement('span');
            arrow.className = 'xwui-menu-arrow';
            arrow.textContent = '›';
            link.appendChild(arrow);

            const submenu = document.createElement('ul');
            submenu.className = 'xwui-menu-submenu';
            item.children.forEach(child => {
                submenu.appendChild(this.createMenuItem(child));
            });
            li.appendChild(submenu);
        }

        if (!item.disabled) {
            link.addEventListener('click', (e) => {
                if (!item.href) {
                    e.preventDefault();
                }
                this.data.selected = item.id;
                this.render();
                this.clickHandlers.forEach(handler => handler(item, e));
            });
        }

        li.appendChild(link);
        return li;
    }

    public onItemClick(handler: (item: XWUIMenuItem, event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    public setSelected(id: string): void {
        this.data.selected = id;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.menuElement;
    }

    public destroy(): void {
        this.clickHandlers = [];
        if (this.menuElement) {
            this.menuElement.remove();
            this.menuElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMenu as any).componentName = 'XWUIMenu';


