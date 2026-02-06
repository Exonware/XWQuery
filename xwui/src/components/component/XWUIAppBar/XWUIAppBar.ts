/**
 * XWUIAppBar Component
 * Layout header component with logo, navigation, and actions areas
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIAppBarConfig {
    position?: 'static' | 'fixed' | 'sticky';
    variant?: 'default' | 'transparent' | 'elevated';
    size?: 'small' | 'medium' | 'large';
    color?: 'default' | 'primary' | 'dark' | 'light';
    bordered?: boolean;
    className?: string;
}

// Data type
export interface XWUIAppBarData {
    logo?: HTMLElement | string;
    title?: string;
    navigation?: HTMLElement;
    actions?: HTMLElement;
    leftContent?: HTMLElement;
    centerContent?: HTMLElement;
    rightContent?: HTMLElement;
}

// Height mapping
const SIZE_MAP: Record<string, string> = {
    small: '48px',
    medium: '64px',
    large: '80px'
};

export class XWUIAppBar extends XWUIComponent<XWUIAppBarData, XWUIAppBarConfig> {
    private appBarElement: HTMLElement | null = null;
    private leftSection: HTMLElement | null = null;
    private centerSection: HTMLElement | null = null;
    private rightSection: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIAppBarData = {},
        conf_comp: XWUIAppBarConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAppBarConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAppBarConfig {
        return {
            position: conf_comp?.position ?? 'static',
            variant: conf_comp?.variant ?? 'default',
            size: conf_comp?.size ?? 'medium',
            color: conf_comp?.color ?? 'default',
            bordered: conf_comp?.bordered ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Create app bar element
        this.appBarElement = document.createElement('header');
        this.appBarElement.className = 'xwui-appbar';
        this.appBarElement.classList.add(`xwui-appbar-${this.config.variant}`);
        this.appBarElement.classList.add(`xwui-appbar-${this.config.size}`);
        this.appBarElement.classList.add(`xwui-appbar-${this.config.color}`);
        
        if (this.config.bordered) {
            this.appBarElement.classList.add('xwui-appbar-bordered');
        }
        if (this.config.className) {
            this.appBarElement.classList.add(this.config.className);
        }

        // Apply position
        if (this.config.position === 'fixed') {
            this.appBarElement.style.position = 'fixed';
            this.appBarElement.style.top = '0';
            this.appBarElement.style.left = '0';
            this.appBarElement.style.right = '0';
            this.appBarElement.style.zIndex = '1000';
        } else if (this.config.position === 'sticky') {
            this.appBarElement.style.position = 'sticky';
            this.appBarElement.style.top = '0';
            this.appBarElement.style.zIndex = '1000';
        }

        // Set height
        this.appBarElement.style.height = SIZE_MAP[this.config.size || 'medium'];

        // Create inner container
        const innerContainer = document.createElement('div');
        innerContainer.className = 'xwui-appbar-inner';

        // Left section (logo, title, navigation)
        this.leftSection = document.createElement('div');
        this.leftSection.className = 'xwui-appbar-left';

        // Logo
        if (this.data.logo) {
            const logoWrapper = document.createElement('div');
            logoWrapper.className = 'xwui-appbar-logo';
            if (typeof this.data.logo === 'string') {
                logoWrapper.innerHTML = this.data.logo;
            } else {
                logoWrapper.appendChild(this.data.logo);
            }
            this.leftSection.appendChild(logoWrapper);
        }

        // Title
        if (this.data.title) {
            const titleElement = document.createElement('h1');
            titleElement.className = 'xwui-appbar-title';
            titleElement.textContent = this.data.title;
            this.leftSection.appendChild(titleElement);
        }

        // Left content override
        if (this.data.leftContent) {
            this.leftSection.appendChild(this.data.leftContent);
        }

        innerContainer.appendChild(this.leftSection);

        // Center section (navigation)
        this.centerSection = document.createElement('div');
        this.centerSection.className = 'xwui-appbar-center';

        if (this.data.navigation) {
            this.centerSection.appendChild(this.data.navigation);
        }
        if (this.data.centerContent) {
            this.centerSection.appendChild(this.data.centerContent);
        }

        innerContainer.appendChild(this.centerSection);

        // Right section (actions)
        this.rightSection = document.createElement('div');
        this.rightSection.className = 'xwui-appbar-right';

        if (this.data.actions) {
            this.rightSection.appendChild(this.data.actions);
        }
        if (this.data.rightContent) {
            this.rightSection.appendChild(this.data.rightContent);
        }

        innerContainer.appendChild(this.rightSection);

        this.appBarElement.appendChild(innerContainer);
        this.container.appendChild(this.appBarElement);
    }

    public setTitle(title: string): void {
        this.data.title = title;
        const titleElement = this.leftSection?.querySelector('.xwui-appbar-title');
        if (titleElement) {
            titleElement.textContent = title;
        } else if (this.leftSection) {
            const newTitle = document.createElement('h1');
            newTitle.className = 'xwui-appbar-title';
            newTitle.textContent = title;
            this.leftSection.appendChild(newTitle);
        }
    }

    public setLogo(logo: HTMLElement | string): void {
        this.data.logo = logo;
        const logoWrapper = this.leftSection?.querySelector('.xwui-appbar-logo');
        if (logoWrapper) {
            logoWrapper.innerHTML = '';
            if (typeof logo === 'string') {
                logoWrapper.innerHTML = logo;
            } else {
                logoWrapper.appendChild(logo);
            }
        }
    }

    public setNavigation(navigation: HTMLElement): void {
        this.data.navigation = navigation;
        if (this.centerSection) {
            this.centerSection.innerHTML = '';
            this.centerSection.appendChild(navigation);
        }
    }

    public setActions(actions: HTMLElement): void {
        this.data.actions = actions;
        if (this.rightSection) {
            this.rightSection.innerHTML = '';
            this.rightSection.appendChild(actions);
        }
    }

    public addLeftContent(element: HTMLElement): void {
        if (this.leftSection) {
            this.leftSection.appendChild(element);
        }
    }

    public addCenterContent(element: HTMLElement): void {
        if (this.centerSection) {
            this.centerSection.appendChild(element);
        }
    }

    public addRightContent(element: HTMLElement): void {
        if (this.rightSection) {
            this.rightSection.appendChild(element);
        }
    }

    public getElement(): HTMLElement | null {
        return this.appBarElement;
    }

    public destroy(): void {
        if (this.appBarElement) {
            this.appBarElement.remove();
            this.appBarElement = null;
            this.leftSection = null;
            this.centerSection = null;
            this.rightSection = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAppBar as any).componentName = 'XWUIAppBar';


