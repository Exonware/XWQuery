/**
 * XWUIChip Component
 * Tag/chip element with closable and clickable variants
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIcon } from '../XWUIIcon/icon-utils';

// Component-level configuration
export interface XWUIChipConfig {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    size?: 'small' | 'medium' | 'large';
    closable?: boolean;
    clickable?: boolean;
    avatar?: string | HTMLElement;
    icon?: string;
    className?: string;
}

// Data type
export interface XWUIChipData {
    label: string;
}

export class XWUIChip extends XWUIComponent<XWUIChipData, XWUIChipConfig> {
    private chipElement: HTMLElement | null = null;
    private closeHandlers: Array<() => void> = [];
    private clickHandlers: Array<(event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIChipData,
        conf_comp: XWUIChipConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIChipConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIChipConfig {
        return {
            variant: conf_comp?.variant ?? 'default',
            size: conf_comp?.size ?? 'medium',
            closable: conf_comp?.closable ?? false,
            clickable: conf_comp?.clickable ?? false,
            avatar: conf_comp?.avatar,
            icon: conf_comp?.icon,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.chipElement = document.createElement('span');
        this.chipElement.className = 'xwui-chip';
        this.chipElement.classList.add(`xwui-chip-${this.config.variant}`);
        this.chipElement.classList.add(`xwui-chip-${this.config.size}`);
        
        if (this.config.clickable) {
            this.chipElement.classList.add('xwui-chip-clickable');
            this.chipElement.setAttribute('role', 'button');
            this.chipElement.setAttribute('tabindex', '0');
            this.chipElement.addEventListener('click', (e) => {
                this.clickHandlers.forEach(handler => handler(e));
            });
            this.chipElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.clickHandlers.forEach(handler => handler(e));
                }
            });
        }
        if (this.config.className) {
            this.chipElement.classList.add(this.config.className);
        }

        // Avatar
        if (this.config.avatar) {
            const avatar = document.createElement('span');
            avatar.className = 'xwui-chip-avatar';
            if (typeof this.config.avatar === 'string') {
                const img = document.createElement('img');
                img.src = this.config.avatar;
                img.alt = '';
                avatar.appendChild(img);
            } else {
                avatar.appendChild(this.config.avatar);
            }
            this.chipElement.appendChild(avatar);
        }

        // Icon
        if (this.config.icon) {
            const icon = document.createElement('span');
            icon.className = 'xwui-chip-icon';
            icon.innerHTML = this.config.icon;
            this.chipElement.appendChild(icon);
        }

        // Label
        const label = document.createElement('span');
        label.className = 'xwui-chip-label';
        label.textContent = this.data.label;
        this.chipElement.appendChild(label);

        // Close button - Use XWUIIcon utility
        if (this.config.closable) {
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'xwui-chip-close';
            closeBtn.setAttribute('aria-label', 'Close');
            const { container } = createIcon(this, 'close', { size: 16 }, this.conf_sys, this.conf_usr);
            closeBtn.appendChild(container);
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
            this.chipElement.appendChild(closeBtn);
        }

        this.container.appendChild(this.chipElement);
    }

    public close(): void {
        if (this.chipElement) {
            this.chipElement.classList.add('xwui-chip-closing');
            setTimeout(() => {
                if (this.chipElement && this.chipElement.parentNode) {
                    this.chipElement.parentNode.removeChild(this.chipElement);
                }
                this.closeHandlers.forEach(handler => handler());
            }, 200);
        }
    }

    public setLabel(label: string): void {
        this.data.label = label;
        const labelElement = this.chipElement?.querySelector('.xwui-chip-label');
        if (labelElement) {
            labelElement.textContent = label;
        }
    }

    public onClick(handler: (event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    public onClose(handler: () => void): void {
        this.closeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.chipElement;
    }

    public destroy(): void {
        this.closeHandlers = [];
        this.clickHandlers = [];
        if (this.chipElement) {
            this.chipElement.remove();
            this.chipElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIChip as any).componentName = 'XWUIChip';


