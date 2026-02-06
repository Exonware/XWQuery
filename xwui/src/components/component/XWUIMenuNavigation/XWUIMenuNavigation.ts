/**
 * XWUIMenuNavigation Component
 * Navigation menu component (separate from Menu)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIMenu, type XWUIMenuItem } from '../XWUIMenu/XWUIMenu';

// Component-level configuration
export interface XWUIMenuNavigationConfig {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

// Data type
export interface XWUIMenuNavigationData {
    items: XWUIMenuItem[];
}

export class XWUIMenuNavigation extends XWUIComponent<XWUIMenuNavigationData, XWUIMenuNavigationConfig> {
    private navMenuElement: HTMLElement | null = null;
    private menuInstance: XWUIMenu | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMenuNavigationData,
        conf_comp: XWUIMenuNavigationConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMenuNavigationConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMenuNavigationConfig {
        return {
            orientation: conf_comp?.orientation ?? 'horizontal',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.navMenuElement = document.createElement('nav');
        this.navMenuElement.className = 'xwui-navigation-menu';
        this.navMenuElement.classList.add(`xwui-navigation-menu-${this.config.orientation}`);
        this.navMenuElement.setAttribute('role', 'navigation');
        
        if (this.config.className) {
            this.navMenuElement.classList.add(this.config.className);
        }

        const menuContainer = document.createElement('div');
        this.menuInstance = new XWUIMenu(
            menuContainer,
            { items: this.data.items },
            { mode: this.config.orientation }
        );

        this.navMenuElement.appendChild(menuContainer);
        this.container.appendChild(this.navMenuElement);
    }

    public getElement(): HTMLElement | null {
        return this.navMenuElement;
    }

    public destroy(): void {
        if (this.menuInstance) {
            this.menuInstance.destroy();
            this.menuInstance = null;
        }
        if (this.navMenuElement) {
            this.navMenuElement.remove();
            this.navMenuElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMenuNavigation as any).componentName = 'XWUIMenuNavigation';


