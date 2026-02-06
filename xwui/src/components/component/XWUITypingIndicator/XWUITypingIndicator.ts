/**
 * XWUITypingIndicator Component
 * Animated typing indicator showing "User is typing..." with animated dots
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITypingIndicatorConfig {
    userName?: string;
    showAvatar?: boolean;
    avatarUrl?: string;
    animationSpeed?: 'slow' | 'normal' | 'fast';
    autoHide?: boolean;
    autoHideDelay?: number; // milliseconds
    className?: string;
}

// Data type
export interface XWUITypingIndicatorData {
    visible?: boolean;
    users?: string[]; // Multiple users typing
}

export class XWUITypingIndicator extends XWUIComponent<XWUITypingIndicatorData, XWUITypingIndicatorConfig> {
    private wrapperElement: HTMLElement | null = null;
    private indicatorElement: HTMLElement | null = null;
    private dotsElement: HTMLElement | null = null;
    private avatarElement: HTMLElement | null = null;
    private textElement: HTMLElement | null = null;
    private autoHideTimer: number | null = null;
    private animationInterval: number | null = null;

    constructor(
        container: HTMLElement,
        data: XWUITypingIndicatorData = {},
        conf_comp: XWUITypingIndicatorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITypingIndicatorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITypingIndicatorConfig {
        return {
            userName: conf_comp?.userName,
            showAvatar: conf_comp?.showAvatar ?? false,
            avatarUrl: conf_comp?.avatarUrl,
            animationSpeed: conf_comp?.animationSpeed ?? 'normal',
            autoHide: conf_comp?.autoHide ?? false,
            autoHideDelay: conf_comp?.autoHideDelay ?? 5000,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-typing-indicator-container';

        if (!this.data.visible) {
            this.container.style.display = 'none';
            return;
        }

        this.container.style.display = 'flex';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-typing-indicator';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Avatar
        if (this.config.showAvatar) {
            this.avatarElement = document.createElement('div');
            this.avatarElement.className = 'xwui-typing-indicator-avatar';
            if (this.config.avatarUrl) {
                const img = document.createElement('img');
                img.src = this.config.avatarUrl;
                img.alt = this.config.userName || 'User';
                this.avatarElement.appendChild(img);
            } else {
                // Default avatar placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'xwui-typing-indicator-avatar-placeholder';
                placeholder.textContent = (this.config.userName || 'U')[0].toUpperCase();
                this.avatarElement.appendChild(placeholder);
            }
            this.wrapperElement.appendChild(this.avatarElement);
        }

        // Text and dots
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'xwui-typing-indicator-content';

        this.textElement = document.createElement('span');
        this.textElement.className = 'xwui-typing-indicator-text';
        this.updateText();
        contentWrapper.appendChild(this.textElement);

        this.dotsElement = document.createElement('span');
        this.dotsElement.className = 'xwui-typing-indicator-dots';
        this.dotsElement.innerHTML = '<span></span><span></span><span></span>';
        contentWrapper.appendChild(this.dotsElement);

        this.wrapperElement.appendChild(contentWrapper);
        this.container.appendChild(this.wrapperElement);

        // Start animation
        this.startAnimation();

        // Auto-hide if enabled
        if (this.config.autoHide) {
            this.scheduleAutoHide();
        }
    }

    private updateText(): void {
        if (!this.textElement) return;

        if (this.data.users && this.data.users.length > 0) {
            if (this.data.users.length === 1) {
                this.textElement.textContent = `${this.data.users[0]} is typing`;
            } else if (this.data.users.length === 2) {
                this.textElement.textContent = `${this.data.users[0]} and ${this.data.users[1]} are typing`;
            } else {
                this.textElement.textContent = `${this.data.users.length} people are typing`;
            }
        } else if (this.config.userName) {
            this.textElement.textContent = `${this.config.userName} is typing`;
        } else {
            this.textElement.textContent = 'Typing';
        }
    }

    private startAnimation(): void {
        if (!this.dotsElement) return;

        const speedMap = {
            slow: 800,
            normal: 500,
            fast: 300
        };

        const interval = speedMap[this.config.animationSpeed || 'normal'];
        let dotIndex = 0;

        this.animationInterval = window.setInterval(() => {
            const dots = this.dotsElement?.querySelectorAll('span');
            if (dots) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === dotIndex);
                });
                dotIndex = (dotIndex + 1) % 3;
            }
        }, interval);
    }

    private stopAnimation(): void {
        if (this.animationInterval !== null) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    private scheduleAutoHide(): void {
        if (this.autoHideTimer !== null) {
            clearTimeout(this.autoHideTimer);
        }

        this.autoHideTimer = window.setTimeout(() => {
            this.hide();
        }, this.config.autoHideDelay);
    }

    public show(): void {
        this.data.visible = true;
        this.render();
    }

    public hide(): void {
        this.data.visible = false;
        this.stopAnimation();
        if (this.autoHideTimer !== null) {
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = null;
        }
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    public setUsers(users: string[]): void {
        this.data.users = users;
        this.updateText();
        if (this.config.autoHide) {
            this.scheduleAutoHide();
        }
    }

    public addUser(userName: string): void {
        if (!this.data.users) {
            this.data.users = [];
        }
        if (!this.data.users.includes(userName)) {
            this.data.users.push(userName);
            this.updateText();
        }
        if (this.config.autoHide) {
            this.scheduleAutoHide();
        }
    }

    public removeUser(userName: string): void {
        if (this.data.users) {
            this.data.users = this.data.users.filter(u => u !== userName);
            this.updateText();
            if (this.data.users.length === 0) {
                this.hide();
            }
        }
    }

    public update(): void {
        this.render();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITypingIndicator as any).componentName = 'XWUITypingIndicator';


