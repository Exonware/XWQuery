/**
 * XWUIAlert Component
 * Alert message box with variants
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIcon } from '../XWUIIcon/icon-utils';

// Component-level configuration
export interface XWUIAlertConfig {
    variant?: 'info' | 'success' | 'warning' | 'error';
    closable?: boolean;
    showIcon?: boolean;
    bordered?: boolean;
    filled?: boolean;
    className?: string;
}

// Data type
export interface XWUIAlertData {
    title?: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const ALERT_ICONS: Record<string, string> = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'
};

export class XWUIAlert extends XWUIComponent<XWUIAlertData, XWUIAlertConfig> {
    private wrapperElement: HTMLElement | null = null;
    private closeHandlers: Array<() => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIAlertData,
        conf_comp: XWUIAlertConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAlertConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAlertConfig {
        return {
            variant: conf_comp?.variant ?? 'info',
            closable: conf_comp?.closable ?? false,
            showIcon: conf_comp?.showIcon ?? true,
            bordered: conf_comp?.bordered ?? true,
            filled: conf_comp?.filled ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-alert';
        this.wrapperElement.classList.add(`xwui-alert-${this.config.variant}`);
        this.wrapperElement.setAttribute('role', 'alert');
        
        if (this.config.bordered) {
            this.wrapperElement.classList.add('xwui-alert-bordered');
        }
        if (this.config.filled) {
            this.wrapperElement.classList.add('xwui-alert-filled');
        }
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Icon
        if (this.config.showIcon) {
            const iconElement = document.createElement('span');
            iconElement.className = 'xwui-alert-icon';
            iconElement.innerHTML = ALERT_ICONS[this.config.variant || 'info'];
            this.wrapperElement.appendChild(iconElement);
        }

        // Content
        const contentElement = document.createElement('div');
        contentElement.className = 'xwui-alert-content';

        if (this.data.title) {
            const titleElement = document.createElement('div');
            titleElement.className = 'xwui-alert-title';
            titleElement.textContent = this.data.title;
            contentElement.appendChild(titleElement);
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'xwui-alert-message';
        messageElement.textContent = this.data.message;
        contentElement.appendChild(messageElement);

        // Action
        if (this.data.action) {
            const actionElement = document.createElement('button');
            actionElement.className = 'xwui-alert-action';
            actionElement.textContent = this.data.action.label;
            actionElement.addEventListener('click', this.data.action.onClick);
            contentElement.appendChild(actionElement);
        }

        this.wrapperElement.appendChild(contentElement);

        // Close button - Use XWUIIcon utility
        if (this.config.closable) {
            const closeButton = document.createElement('button');
            closeButton.className = 'xwui-alert-close';
            closeButton.setAttribute('aria-label', 'Close alert');
            const { container } = createIcon(this, 'close', { size: 18 }, this.conf_sys, this.conf_usr);
            closeButton.appendChild(container);
            closeButton.addEventListener('click', () => this.close());
            this.wrapperElement.appendChild(closeButton);
        }

        this.container.appendChild(this.wrapperElement);
    }

    public close(): void {
        if (this.wrapperElement) {
            this.wrapperElement.classList.add('xwui-alert-closing');
            setTimeout(() => {
                if (this.wrapperElement) {
                    this.wrapperElement.remove();
                    this.wrapperElement = null;
                }
                this.closeHandlers.forEach(handler => handler());
            }, 200);
        }
    }

    public onClose(handler: () => void): void {
        this.closeHandlers.push(handler);
    }

    public setMessage(message: string): void {
        this.data.message = message;
        const messageElement = this.wrapperElement?.querySelector('.xwui-alert-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }

    public setTitle(title: string): void {
        this.data.title = title;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.closeHandlers = [];
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAlert as any).componentName = 'XWUIAlert';


