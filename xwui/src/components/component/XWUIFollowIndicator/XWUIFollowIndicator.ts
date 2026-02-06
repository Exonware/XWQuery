/**
 * XWUIFollowIndicator Component
 * Visual indicator for following/watching tasks or projects
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIFollowIndicatorConfig {
    variant?: 'button' | 'switch' | 'icon';
    size?: 'small' | 'medium' | 'large';
    showNotificationCount?: boolean;
    className?: string;
}

// Data type
export interface XWUIFollowIndicatorData {
    following?: boolean;
    notificationCount?: number;
    label?: string;
}

export class XWUIFollowIndicator extends XWUIComponent<XWUIFollowIndicatorData, XWUIFollowIndicatorConfig> {
    private wrapperElement: HTMLElement | null = null;
    private clickHandlers: Array<(following: boolean) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIFollowIndicatorData = {},
        conf_comp: XWUIFollowIndicatorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIFollowIndicatorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFollowIndicatorConfig {
        return {
            variant: conf_comp?.variant ?? 'button',
            size: conf_comp?.size ?? 'medium',
            showNotificationCount: conf_comp?.showNotificationCount ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-follow-indicator';
        this.wrapperElement.classList.add(`xwui-follow-indicator-${this.config.variant}`);
        this.wrapperElement.classList.add(`xwui-follow-indicator-${this.config.size}`);
        
        if (this.data.following) {
            this.wrapperElement.classList.add('xwui-follow-indicator-following');
        }
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        if (this.config.variant === 'switch') {
            this.renderSwitch();
        } else if (this.config.variant === 'icon') {
            this.renderIcon();
        } else {
            this.renderButton();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderButton(): void {
        const button = document.createElement('button');
        button.className = 'xwui-follow-indicator-button';
        button.type = 'button';
        button.setAttribute('aria-label', this.data.following ? 'Unfollow' : 'Follow');

        const icon = document.createElement('span');
        icon.className = 'xwui-follow-indicator-icon';
        icon.innerHTML = this.data.following ? '🔔' : '🔕';
        button.appendChild(icon);

        if (this.data.label) {
            const label = document.createElement('span');
            label.className = 'xwui-follow-indicator-label';
            label.textContent = this.data.following 
                ? (this.data.label.includes('Follow') ? this.data.label.replace('Follow', 'Following') : 'Following')
                : this.data.label;
            button.appendChild(label);
        }

        if (this.config.showNotificationCount && this.data.following && this.data.notificationCount && this.data.notificationCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'xwui-follow-indicator-badge';
            badge.textContent = this.data.notificationCount > 99 ? '99+' : String(this.data.notificationCount);
            button.appendChild(badge);
        }

        button.addEventListener('click', () => {
            this.toggle();
        });

        this.wrapperElement!.appendChild(button);
    }

    private renderSwitch(): void {
        const switchContainer = document.createElement('label');
        switchContainer.className = 'xwui-follow-indicator-switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'xwui-follow-indicator-checkbox';
        input.checked = this.data.following || false;
        
        input.addEventListener('change', () => {
            this.data.following = input.checked;
            this.render();
            this.notifyChange();
        });

        const slider = document.createElement('span');
        slider.className = 'xwui-follow-indicator-slider';

        const label = document.createElement('span');
        label.className = 'xwui-follow-indicator-switch-label';
        label.textContent = this.data.label || 'Follow';

        switchContainer.appendChild(input);
        switchContainer.appendChild(slider);
        switchContainer.appendChild(label);

        if (this.config.showNotificationCount && this.data.following && this.data.notificationCount && this.data.notificationCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'xwui-follow-indicator-badge';
            badge.textContent = this.data.notificationCount > 99 ? '99+' : String(this.data.notificationCount);
            switchContainer.appendChild(badge);
        }

        this.wrapperElement!.appendChild(switchContainer);
    }

    private renderIcon(): void {
        const iconButton = document.createElement('button');
        iconButton.className = 'xwui-follow-indicator-icon-only';
        iconButton.type = 'button';
        iconButton.setAttribute('aria-label', this.data.following ? 'Unfollow' : 'Follow');

        iconButton.innerHTML = this.data.following ? '🔔' : '🔕';

        if (this.config.showNotificationCount && this.data.following && this.data.notificationCount && this.data.notificationCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'xwui-follow-indicator-badge';
            badge.textContent = this.data.notificationCount > 99 ? '99+' : String(this.data.notificationCount);
            iconButton.appendChild(badge);
        }

        iconButton.addEventListener('click', () => {
            this.toggle();
        });

        this.wrapperElement!.appendChild(iconButton);
    }

    private toggle(): void {
        this.data.following = !this.data.following;
        this.render();
        this.notifyChange();
    }

    private notifyChange(): void {
        this.clickHandlers.forEach(handler => handler(this.data.following || false));
    }

    public setFollowing(following: boolean): void {
        this.data.following = following;
        this.render();
    }

    public setNotificationCount(count: number): void {
        this.data.notificationCount = count;
        this.render();
    }

    public isFollowing(): boolean {
        return this.data.following || false;
    }

    public onClick(handler: (following: boolean) => void): void {
        this.clickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.clickHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIFollowIndicator as any).componentName = 'XWUIFollowIndicator';


