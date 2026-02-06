/**
 * XWUIMenuBar Component
 * Menu bar component (typically for desktop applications)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIMenu, type XWUIMenuItem } from '../XWUIMenu/XWUIMenu';

// Component-level configuration
export interface XWUIMenuBarConfig {
    className?: string;
}

// Data type
export interface XWUIMenuBarData {
    items: XWUIMenuItem[];
}

export class XWUIMenuBar extends XWUIComponent<XWUIMenuBarData, XWUIMenuBarConfig> {
    private menubarElement: HTMLElement | null = null;
    private menuInstances: XWUIMenu[] = [];

    constructor(
        container: HTMLElement,
        data: XWUIMenuBarData,
        conf_comp: XWUIMenuBarConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMenuBarConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMenuBarConfig {
        return {
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.menubarElement = document.createElement('div');
        this.menubarElement.className = 'xwui-menubar';
        this.menubarElement.setAttribute('role', 'menubar');
        
        if (this.config.className) {
            this.menubarElement.classList.add(this.config.className);
        }

        this.data.items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'xwui-menubar-item';
            
            const button = document.createElement('button');
            button.className = 'xwui-menubar-button';
            button.textContent = item.label;
            button.setAttribute('aria-haspopup', 'true');
            
            button.addEventListener('click', () => {
                // Close other menus
                this.menuInstances.forEach(menu => {
                    // Menu doesn't have close method, so we'll just toggle
                });
            });

            menuItem.appendChild(button);
            this.menubarElement.appendChild(menuItem);
        });

        this.container.appendChild(this.menubarElement);
    }

    public getElement(): HTMLElement | null {
        return this.menubarElement;
    }

    public destroy(): void {
        this.menuInstances.forEach(menu => menu.destroy());
        this.menuInstances = [];
        if (this.menubarElement) {
            this.menubarElement.remove();
            this.menubarElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMenuBar as any).componentName = 'XWUIMenuBar';


