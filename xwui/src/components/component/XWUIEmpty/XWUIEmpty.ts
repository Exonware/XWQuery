/**
 * XWUIEmpty Component
 * Empty state component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIcon } from '../XWUIIcon/icon-utils';

// Component-level configuration
export interface XWUIEmptyConfig {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIEmptyData {
    title?: string;
    description?: string;
    image?: string;
    icon?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export class XWUIEmpty extends XWUIComponent<XWUIEmptyData, XWUIEmptyConfig> {
    private emptyElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIEmptyData = {},
        conf_comp: XWUIEmptyConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIEmptyConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIEmptyConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.emptyElement = document.createElement('div');
        this.emptyElement.className = 'xwui-empty';
        this.emptyElement.classList.add(`xwui-empty-${this.config.size}`);
        
        if (this.config.className) {
            this.emptyElement.classList.add(this.config.className);
        }

        // Image or Icon
        if (this.data.image) {
            const img = document.createElement('img');
            img.src = this.data.image;
            img.alt = '';
            img.className = 'xwui-empty-image';
            this.emptyElement.appendChild(img);
        } else         if (this.data.icon) {
            const icon = document.createElement('div');
            icon.className = 'xwui-empty-icon';
            if (this.data.icon.startsWith('<svg')) {
                // Backward compatibility: custom SVG
                icon.innerHTML = this.data.icon;
            } else {
                // Icon name - Use XWUIIcon
                const { container } = createIcon(this, this.data.icon, { size: 48 }, this.conf_sys, this.conf_usr);
                icon.appendChild(container);
            }
            this.emptyElement.appendChild(icon);
        } else {
            // Default empty icon - Use plus icon
            const defaultIcon = document.createElement('div');
            defaultIcon.className = 'xwui-empty-icon';
            const { container } = createIcon(this, 'plus', { size: 48 }, this.conf_sys, this.conf_usr);
            defaultIcon.appendChild(container);
            this.emptyElement.appendChild(defaultIcon);
        }

        // Title
        if (this.data.title) {
            const title = document.createElement('div');
            title.className = 'xwui-empty-title';
            title.textContent = this.data.title;
            this.emptyElement.appendChild(title);
        }

        // Description
        if (this.data.description) {
            const desc = document.createElement('div');
            desc.className = 'xwui-empty-description';
            desc.textContent = this.data.description;
            this.emptyElement.appendChild(desc);
        }

        // Action
        if (this.data.action) {
            const actionBtn = document.createElement('button');
            actionBtn.className = 'xwui-empty-action';
            actionBtn.textContent = this.data.action.label;
            actionBtn.addEventListener('click', () => {
                this.data.action!.onClick();
            });
            this.emptyElement.appendChild(actionBtn);
        }

        this.container.appendChild(this.emptyElement);
    }

    public getElement(): HTMLElement | null {
        return this.emptyElement;
    }

    public destroy(): void {
        if (this.emptyElement) {
            this.emptyElement.remove();
            this.emptyElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIEmpty as any).componentName = 'XWUIEmpty';


