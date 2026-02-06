/**
 * XWUISidebar Component
 * Sidebar navigation component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIMenu, type XWUIMenuItem } from '../XWUIMenu/XWUIMenu';

// Component-level configuration
export interface XWUISidebarConfig {
    position?: 'left' | 'right';
    collapsible?: boolean;
    collapsed?: boolean;
    width?: string;
    collapsedWidth?: string;
    className?: string;
}

// Data type
export interface XWUISidebarData {
    items: XWUIMenuItem[];
    header?: HTMLElement | string;
    footer?: HTMLElement | string;
}

export class XWUISidebar extends XWUIComponent<XWUISidebarData, XWUISidebarConfig> {
    private sidebarElement: HTMLElement | null = null;
    private menuInstance: XWUIMenu | null = null;
    private toggleButton: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISidebarData,
        conf_comp: XWUISidebarConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISidebarConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISidebarConfig {
        return {
            position: conf_comp?.position ?? 'left',
            collapsible: conf_comp?.collapsible ?? false,
            collapsed: conf_comp?.collapsed ?? false,
            width: conf_comp?.width ?? '250px',
            collapsedWidth: conf_comp?.collapsedWidth ?? '64px',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.sidebarElement = document.createElement('aside');
        this.sidebarElement.className = 'xwui-sidebar';
        this.sidebarElement.classList.add(`xwui-sidebar-${this.config.position}`);
        
        if (this.config.collapsed) {
            this.sidebarElement.classList.add('xwui-sidebar-collapsed');
        }
        
        if (this.config.className) {
            this.sidebarElement.classList.add(this.config.className);
        }

        this.sidebarElement.style.width = this.config.collapsed ? this.config.collapsedWidth : this.config.width;

        // Header
        if (this.data.header) {
            const header = document.createElement('div');
            header.className = 'xwui-sidebar-header';
            
            if (typeof this.data.header === 'string') {
                header.innerHTML = this.data.header;
            } else {
                header.appendChild(this.data.header);
            }
            
            this.sidebarElement.appendChild(header);
        }

        // Toggle button
        if (this.config.collapsible) {
            this.toggleButton = document.createElement('button');
            this.toggleButton.className = 'xwui-sidebar-toggle';
            this.toggleButton.innerHTML = this.config.collapsed ? '›' : '‹';
            this.toggleButton.addEventListener('click', () => this.toggle());
            this.sidebarElement.appendChild(this.toggleButton);
        }

        // Menu
        const menuContainer = document.createElement('div');
        menuContainer.className = 'xwui-sidebar-menu';
        
        this.menuInstance = new XWUIMenu(
            menuContainer,
            { items: this.data.items },
            { mode: 'vertical' }
        );
        
        this.sidebarElement.appendChild(menuContainer);

        // Footer
        if (this.data.footer) {
            const footer = document.createElement('div');
            footer.className = 'xwui-sidebar-footer';
            
            if (typeof this.data.footer === 'string') {
                footer.innerHTML = this.data.footer;
            } else {
                footer.appendChild(this.data.footer);
            }
            
            this.sidebarElement.appendChild(footer);
        }

        this.container.appendChild(this.sidebarElement);
    }

    public toggle(): void {
        this.config.collapsed = !this.config.collapsed;
        this.render();
    }

    public collapse(): void {
        this.config.collapsed = true;
        this.render();
    }

    public expand(): void {
        this.config.collapsed = false;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.sidebarElement;
    }

    public destroy(): void {
        if (this.menuInstance) {
            this.menuInstance.destroy();
            this.menuInstance = null;
        }
        if (this.sidebarElement) {
            this.sidebarElement.remove();
            this.sidebarElement = null;
        }
        this.toggleButton = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISidebar as any).componentName = 'XWUISidebar';


