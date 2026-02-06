/**
 * XWUIBackToTop Component
 * Floating button to scroll to top
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';

export interface XWUIBackToTopConfig {
    visible?: boolean;
    threshold?: number;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    offset?: { x?: number; y?: number };
    smooth?: boolean;
    className?: string;
}

export interface XWUIBackToTopData {
    icon?: string;
}

export class XWUIBackToTop extends XWUIComponent<XWUIBackToTopData, XWUIBackToTopConfig> {
    private buttonElement: HTMLElement | null = null;
    private scrollHandler: (() => void) | null = null;
    private isVisible: boolean = false;
    private icon: XWUIIcon | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIBackToTopData = {},
        conf_comp: XWUIBackToTopConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
        this.setupScrollListener();
    }

    protected createConfig(
        conf_comp?: XWUIBackToTopConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBackToTopConfig {
        return {
            visible: conf_comp?.visible ?? false,
            threshold: conf_comp?.threshold ?? 400,
            position: conf_comp?.position ?? 'bottom-right',
            offset: conf_comp?.offset ?? { x: 20, y: 20 },
            smooth: conf_comp?.smooth ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-back-to-top-container';

        this.buttonElement = document.createElement('button');
        this.buttonElement.className = 'xwui-back-to-top';
        this.buttonElement.setAttribute('aria-label', 'Back to top');
        
        if (this.config.className) {
            this.buttonElement.classList.add(this.config.className);
        }

        // Position styles
        this.buttonElement.style.position = 'fixed';
        const position = this.config.position || 'bottom-right';
        
        if (position.includes('bottom')) {
            this.buttonElement.style.bottom = `${this.config.offset?.y || 20}px`;
        } else {
            this.buttonElement.style.top = `${this.config.offset?.y || 20}px`;
        }
        
        if (position.includes('right')) {
            this.buttonElement.style.right = `${this.config.offset?.x || 20}px`;
        } else {
            this.buttonElement.style.left = `${this.config.offset?.x || 20}px`;
        }

        // Initial visibility
        this.buttonElement.style.display = (this.config.visible || this.isVisible) ? 'block' : 'none';
        this.buttonElement.style.opacity = (this.config.visible || this.isVisible) ? '1' : '0';
        this.buttonElement.style.pointerEvents = (this.config.visible || this.isVisible) ? 'auto' : 'none';

        // Icon - Use XWUIIcon instead of inline SVG
        if (this.data.icon && this.data.icon.startsWith('<svg')) {
            // If custom SVG string is provided, use it directly (backward compatibility)
            this.buttonElement.innerHTML = this.data.icon;
        } else {
            // Use XWUIIcon with icon name (default to 'arrow-up' if not provided)
            const iconContainer = document.createElement('div');
            const iconName = this.data.icon || 'arrow-up';
            this.icon = new XWUIIcon(iconContainer, iconName, { size: 24 }, this.conf_sys, this.conf_usr);
            this.registerChildComponent(this.icon);
            this.buttonElement.appendChild(iconContainer);
        }

        // Click handler
        this.buttonElement.addEventListener('click', () => this.scrollToTop());

        this.container.appendChild(this.buttonElement);
    }

    private setupScrollListener(): void {
        if (this.config.visible !== undefined && this.config.visible) {
            return; // Controlled visibility
        }

        this.scrollHandler = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const threshold = this.config.threshold || 400;
            const shouldBeVisible = scrollTop > threshold;

            if (shouldBeVisible !== this.isVisible) {
                this.isVisible = shouldBeVisible;
                this.updateVisibility();
            }
        };

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    private updateVisibility(): void {
        if (!this.buttonElement) return;

        if (this.isVisible) {
            this.buttonElement.style.display = 'block';
            requestAnimationFrame(() => {
                if (this.buttonElement) {
                    this.buttonElement.style.opacity = '1';
                    this.buttonElement.style.pointerEvents = 'auto';
                }
            });
        } else {
            this.buttonElement.style.opacity = '0';
            this.buttonElement.style.pointerEvents = 'none';
            setTimeout(() => {
                if (this.buttonElement && !this.isVisible) {
                    this.buttonElement.style.display = 'none';
                }
            }, 200);
        }
    }

    private scrollToTop(): void {
        if (this.config.smooth) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    }

    public setVisible(visible: boolean): void {
        this.config.visible = visible;
        this.isVisible = visible;
        this.updateVisibility();
    }

    public destroy(): void {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        this.icon = null;
        this.buttonElement = null;
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBackToTop as any).componentName = 'XWUIBackToTop';


