/**
 * XWUIAppShell Component
 * Complete app layout structure with header, sidebar, main content, footer areas
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIAppShellConfig {
    sidebarCollapsible?: boolean;
    sidebarCollapsed?: boolean;
    sidebarWidth?: string;
    direction?: 'ltr' | 'rtl';
    className?: string;
}

// Data type
export interface XWUIAppShellData {
    header?: HTMLElement | string;
    sidebar?: HTMLElement | string;
    main: HTMLElement | string;
    footer?: HTMLElement | string;
}

export class XWUIAppShell extends XWUIComponent<XWUIAppShellData, XWUIAppShellConfig> {
    private shellElement: HTMLElement | null = null;
    private sidebarElement: HTMLElement | null = null;
    private headerElement: HTMLElement | null = null;
    private mainElement: HTMLElement | null = null;
    private footerElement: HTMLElement | null = null;
    private isSidebarCollapsed: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIAppShellData,
        conf_comp: XWUIAppShellConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.isSidebarCollapsed = this.config.sidebarCollapsed || false;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAppShellConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAppShellConfig {
        return {
            sidebarCollapsible: conf_comp?.sidebarCollapsible ?? false,
            sidebarCollapsed: conf_comp?.sidebarCollapsed ?? false,
            sidebarWidth: conf_comp?.sidebarWidth ?? '280px',
            direction: conf_comp?.direction ?? 'ltr',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.shellElement = document.createElement('div');
        this.shellElement.className = 'xwui-appshell';
        
        if (this.config.direction === 'rtl') {
            this.shellElement.classList.add('xwui-appshell-rtl');
        }
        
        if (this.config.className) {
            this.shellElement.classList.add(this.config.className);
        }

        // Sidebar
        if (this.data.sidebar) {
            this.sidebarElement = document.createElement('aside');
            this.sidebarElement.className = 'xwui-appshell-sidebar';
            
            if (this.isSidebarCollapsed) {
                this.sidebarElement.classList.add('xwui-appshell-sidebar-collapsed');
            }
            
            this.sidebarElement.style.width = this.isSidebarCollapsed ? '0' : this.config.sidebarWidth;
            
            if (typeof this.data.sidebar === 'string') {
                this.sidebarElement.innerHTML = this.data.sidebar;
            } else {
                this.sidebarElement.appendChild(this.data.sidebar);
            }
            
            this.shellElement.appendChild(this.sidebarElement);
        }

        // Main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'xwui-appshell-main-container';

        // Header
        if (this.data.header) {
            this.headerElement = document.createElement('header');
            this.headerElement.className = 'xwui-appshell-header';
            
            if (typeof this.data.header === 'string') {
                this.headerElement.innerHTML = this.data.header;
            } else {
                this.headerElement.appendChild(this.data.header);
            }
            
            mainContainer.appendChild(this.headerElement);
        }

        // Main content
        this.mainElement = document.createElement('main');
        this.mainElement.className = 'xwui-appshell-main';
        
        if (typeof this.data.main === 'string') {
            this.mainElement.innerHTML = this.data.main;
        } else {
            this.mainElement.appendChild(this.data.main);
        }
        
        mainContainer.appendChild(this.mainElement);

        // Footer
        if (this.data.footer) {
            this.footerElement = document.createElement('footer');
            this.footerElement.className = 'xwui-appshell-footer';
            
            if (typeof this.data.footer === 'string') {
                this.footerElement.innerHTML = this.data.footer;
            } else {
                this.footerElement.appendChild(this.data.footer);
            }
            
            mainContainer.appendChild(this.footerElement);
        }

        this.shellElement.appendChild(mainContainer);
        this.container.appendChild(this.shellElement);
    }

    public toggleSidebar(): void {
        if (!this.config.sidebarCollapsible || !this.sidebarElement) return;
        
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        this.sidebarElement.classList.toggle('xwui-appshell-sidebar-collapsed');
        this.sidebarElement.style.width = this.isSidebarCollapsed ? '0' : this.config.sidebarWidth;
    }

    public collapseSidebar(): void {
        if (!this.config.sidebarCollapsible || !this.sidebarElement) return;
        
        this.isSidebarCollapsed = true;
        this.sidebarElement.classList.add('xwui-appshell-sidebar-collapsed');
        this.sidebarElement.style.width = '0';
    }

    public expandSidebar(): void {
        if (!this.config.sidebarCollapsible || !this.sidebarElement) return;
        
        this.isSidebarCollapsed = false;
        this.sidebarElement.classList.remove('xwui-appshell-sidebar-collapsed');
        this.sidebarElement.style.width = this.config.sidebarWidth;
    }

    public isSidebarCollapsedState(): boolean {
        return this.isSidebarCollapsed;
    }

    public getElement(): HTMLElement | null {
        return this.shellElement;
    }

    public destroy(): void {
        this.shellElement = null;
        this.sidebarElement = null;
        this.headerElement = null;
        this.mainElement = null;
        this.footerElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAppShell as any).componentName = 'XWUIAppShell';


