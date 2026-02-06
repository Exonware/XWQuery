/**
 * XWUITabs Component
 * Tab navigation with various variants
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUITabItem {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    content?: HTMLElement | string;
}

// Component-level configuration
export interface XWUITabsConfig {
    variant?: 'line' | 'card' | 'button';
    size?: 'small' | 'medium' | 'large';
    orientation?: 'horizontal' | 'vertical';
    centered?: boolean;
    fullWidth?: boolean;
    className?: string;
}

// Data type
export interface XWUITabsData {
    tabs: XWUITabItem[];
    activeTab?: string;
}

export class XWUITabs extends XWUIComponent<XWUITabsData, XWUITabsConfig> {
    private wrapperElement: HTMLElement | null = null;
    private tabListElement: HTMLElement | null = null;
    private contentElement: HTMLElement | null = null;
    private changeHandlers: Array<(tabId: string, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUITabsData,
        conf_comp: XWUITabsConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Set default active tab
        if (!this.data.activeTab && this.data.tabs.length > 0) {
            const firstEnabled = this.data.tabs.find(t => !t.disabled);
            this.data.activeTab = firstEnabled?.id || this.data.tabs[0].id;
        }
        
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITabsConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITabsConfig {
        return {
            variant: conf_comp?.variant ?? 'line',
            size: conf_comp?.size ?? 'medium',
            orientation: conf_comp?.orientation ?? 'horizontal',
            centered: conf_comp?.centered ?? false,
            fullWidth: conf_comp?.fullWidth ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-tabs';
        this.wrapperElement.classList.add(`xwui-tabs-${this.config.variant}`);
        this.wrapperElement.classList.add(`xwui-tabs-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-tabs-${this.config.orientation}`);
        
        if (this.config.centered) {
            this.wrapperElement.classList.add('xwui-tabs-centered');
        }
        if (this.config.fullWidth) {
            this.wrapperElement.classList.add('xwui-tabs-full-width');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Tab list
        this.tabListElement = document.createElement('div');
        this.tabListElement.className = 'xwui-tabs-list';
        this.tabListElement.setAttribute('role', 'tablist');

        this.data.tabs.forEach(tab => {
            const tabButton = this.createTabButton(tab);
            this.tabListElement!.appendChild(tabButton);
        });

        this.wrapperElement.appendChild(this.tabListElement);

        // Content area
        this.contentElement = document.createElement('div');
        this.contentElement.className = 'xwui-tabs-content';

        this.data.tabs.forEach(tab => {
            const panel = this.createTabPanel(tab);
            this.contentElement!.appendChild(panel);
        });

        this.wrapperElement.appendChild(this.contentElement);
        this.container.appendChild(this.wrapperElement);
    }

    private createTabButton(tab: XWUITabItem): HTMLElement {
        const button = document.createElement('button');
        button.className = 'xwui-tab';
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', String(tab.id === this.data.activeTab));
        button.setAttribute('aria-controls', `tab-panel-${tab.id}`);
        button.id = `tab-${tab.id}`;
        button.disabled = tab.disabled || false;

        if (tab.id === this.data.activeTab) {
            button.classList.add('xwui-tab-active');
        }
        if (tab.disabled) {
            button.classList.add('xwui-tab-disabled');
        }

        // Icon
        if (tab.icon) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'xwui-tab-icon';
            iconSpan.innerHTML = tab.icon;
            button.appendChild(iconSpan);
        }

        // Label
        const labelSpan = document.createElement('span');
        labelSpan.className = 'xwui-tab-label';
        labelSpan.textContent = tab.label;
        button.appendChild(labelSpan);

        // Click handler
        button.addEventListener('click', (e) => {
            if (!tab.disabled) {
                this.setActiveTab(tab.id);
                this.changeHandlers.forEach(handler => handler(tab.id, e));
            }
        });

        return button;
    }

    private createTabPanel(tab: XWUITabItem): HTMLElement {
        const panel = document.createElement('div');
        panel.className = 'xwui-tab-panel';
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `tab-${tab.id}`);
        panel.id = `tab-panel-${tab.id}`;
        panel.hidden = tab.id !== this.data.activeTab;

        if (tab.id === this.data.activeTab) {
            panel.classList.add('xwui-tab-panel-active');
        }

        // Content
        if (tab.content) {
            if (typeof tab.content === 'string') {
                panel.innerHTML = tab.content;
            } else {
                panel.appendChild(tab.content);
            }
        }

        return panel;
    }

    public setActiveTab(tabId: string): void {
        if (this.data.activeTab === tabId) return;

        const tab = this.data.tabs.find(t => t.id === tabId);
        if (!tab || tab.disabled) return;

        this.data.activeTab = tabId;

        // Update tab buttons
        const buttons = this.tabListElement?.querySelectorAll('.xwui-tab');
        buttons?.forEach(btn => {
            const isActive = btn.id === `tab-${tabId}`;
            btn.classList.toggle('xwui-tab-active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });

        // Update panels
        const panels = this.contentElement?.querySelectorAll('.xwui-tab-panel');
        panels?.forEach(panel => {
            const isActive = panel.id === `tab-panel-${tabId}`;
            panel.classList.toggle('xwui-tab-panel-active', isActive);
            (panel as HTMLElement).hidden = !isActive;
        });
    }

    public getActiveTab(): string | undefined {
        return this.data.activeTab;
    }

    public addTab(tab: XWUITabItem): void {
        this.data.tabs.push(tab);
        
        if (this.tabListElement) {
            const tabButton = this.createTabButton(tab);
            this.tabListElement.appendChild(tabButton);
        }
        
        if (this.contentElement) {
            const panel = this.createTabPanel(tab);
            this.contentElement.appendChild(panel);
        }
    }

    public removeTab(tabId: string): void {
        const index = this.data.tabs.findIndex(t => t.id === tabId);
        if (index === -1) return;

        this.data.tabs.splice(index, 1);

        // Remove DOM elements
        const button = this.tabListElement?.querySelector(`#tab-${tabId}`);
        const panel = this.contentElement?.querySelector(`#tab-panel-${tabId}`);
        button?.remove();
        panel?.remove();

        // If removed active tab, activate first available
        if (this.data.activeTab === tabId && this.data.tabs.length > 0) {
            const firstEnabled = this.data.tabs.find(t => !t.disabled);
            if (firstEnabled) {
                this.setActiveTab(firstEnabled.id);
            }
        }
    }

    public onChange(handler: (tabId: string, event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
            this.tabListElement = null;
            this.contentElement = null;
        }
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUITabs as any).componentName = 'XWUITabs';

