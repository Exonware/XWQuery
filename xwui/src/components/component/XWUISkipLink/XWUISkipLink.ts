/**
 * XWUISkipLink Component
 * Accessibility skip navigation link
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUISkipLinkConfig {
    targetId?: string;
    label?: string;
    className?: string;
}

// Data type
export interface XWUISkipLinkData {
    href?: string;
}

export class XWUISkipLink extends XWUIComponent<XWUISkipLinkData, XWUISkipLinkConfig> {
    private linkElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISkipLinkData = {},
        conf_comp: XWUISkipLinkConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISkipLinkConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISkipLinkConfig {
        return {
            targetId: conf_comp?.targetId,
            label: conf_comp?.label ?? 'Skip to main content',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.linkElement = document.createElement('a');
        this.linkElement.className = 'xwui-skiplink';
        
        if (this.config.className) {
            this.linkElement.classList.add(this.config.className);
        }

        this.linkElement.href = this.data.href || `#${this.config.targetId || 'main'}`;
        this.linkElement.textContent = this.config.label || 'Skip to main content';
        this.linkElement.setAttribute('aria-label', this.config.label || 'Skip to main content');

        this.linkElement.addEventListener('click', (e) => {
            if (this.config.targetId) {
                e.preventDefault();
                const target = document.getElementById(this.config.targetId);
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        this.container.appendChild(this.linkElement);
    }

    public getElement(): HTMLElement | null {
        return this.linkElement;
    }

    public destroy(): void {
        this.linkElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISkipLink as any).componentName = 'XWUISkipLink';


