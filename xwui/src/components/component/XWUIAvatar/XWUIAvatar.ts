/**
 * XWUIAvatar Component
 * User avatar with image/initials fallback
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIAvatarConfig {
    size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
    shape?: 'circle' | 'square';
    status?: 'online' | 'offline' | 'away' | 'busy';
    bordered?: boolean;
    className?: string;
}

// Data type
export interface XWUIAvatarData {
    src?: string;
    alt?: string;
    name?: string;  // Used to generate initials
    fallback?: string;  // Custom fallback text
}

const SIZE_MAP: Record<string, number> = {
    xs: 24,
    small: 32,
    medium: 40,
    large: 48,
    xl: 64
};

export class XWUIAvatar extends XWUIComponent<XWUIAvatarData, XWUIAvatarConfig> {
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIAvatarData = {},
        conf_comp: XWUIAvatarConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAvatarConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAvatarConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            shape: conf_comp?.shape ?? 'circle',
            status: conf_comp?.status,
            bordered: conf_comp?.bordered ?? false,
            className: conf_comp?.className
        };
    }

    private getInitials(): string {
        if (this.data.fallback) {
            return this.data.fallback;
        }
        if (this.data.name) {
            const parts = this.data.name.trim().split(/\s+/);
            if (parts.length >= 2) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return this.data.name.slice(0, 2).toUpperCase();
        }
        return '?';
    }

    private getBackgroundColor(): string {
        // Generate consistent color from name
        if (this.data.name) {
            let hash = 0;
            for (let i = 0; i < this.data.name.length; i++) {
                hash = this.data.name.charCodeAt(i) + ((hash << 5) - hash);
            }
            const colors = [
                '#4f46e5', '#10b981', '#f59e0b', '#ef4444',
                '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
            ];
            return colors[Math.abs(hash) % colors.length];
        }
        return '#6b7280';
    }

    private render(): void {
        this.container.innerHTML = '';

        const size = SIZE_MAP[this.config.size || 'medium'];

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-avatar';
        this.wrapperElement.classList.add(`xwui-avatar-${this.config.size}`);
        this.wrapperElement.classList.add(`xwui-avatar-${this.config.shape}`);
        
        if (this.config.bordered) {
            this.wrapperElement.classList.add('xwui-avatar-bordered');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        this.wrapperElement.style.width = `${size}px`;
        this.wrapperElement.style.height = `${size}px`;

        // Content (image or initials)
        if (this.data.src) {
            const img = document.createElement('img');
            img.className = 'xwui-avatar-image';
            img.src = this.data.src;
            img.alt = this.data.alt || this.data.name || '';
            img.onerror = () => {
                img.remove();
                this.renderFallback();
            };
            this.wrapperElement.appendChild(img);
        } else {
            this.renderFallback();
        }

        // Status indicator
        if (this.config.status) {
            const statusDot = document.createElement('span');
            statusDot.className = `xwui-avatar-status xwui-avatar-status-${this.config.status}`;
            this.wrapperElement.appendChild(statusDot);
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderFallback(): void {
        if (!this.wrapperElement) return;

        const fallback = document.createElement('span');
        fallback.className = 'xwui-avatar-fallback';
        fallback.textContent = this.getInitials();
        fallback.style.backgroundColor = this.getBackgroundColor();
        this.wrapperElement.appendChild(fallback);
    }

    public setSrc(src: string): void {
        this.data.src = src;
        this.render();
    }

    public setName(name: string): void {
        this.data.name = name;
        this.render();
    }

    public setStatus(status: XWUIAvatarConfig['status']): void {
        this.config.status = status;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAvatar as any).componentName = 'XWUIAvatar';


