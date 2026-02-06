/**
 * XWUISpeedDial Component
 * Floating action button with expandable menu
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';

export interface SpeedDialAction {
    icon: string;
    label: string;
    onClick?: () => void;
}

export interface XWUISpeedDialConfig {
    direction?: 'up' | 'down' | 'left' | 'right';
    open?: boolean;
    icon?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
}

export interface XWUISpeedDialData {
    actions?: SpeedDialAction[];
}

export class XWUISpeedDial extends XWUIComponent<XWUISpeedDialData, XWUISpeedDialConfig> {
    private wrapperElement: HTMLElement | null = null;
    private mainButton: HTMLElement | null = null;
    private actionsContainer: HTMLElement | null = null;
    private overlayElement: HTMLElement | null = null;
    private isOpen: boolean = false;
    private clickOutsideCleanup: (() => void) | null = null;
    private mainIcon: XWUIIcon | null = null;
    private actionIcons: XWUIIcon[] = [];

    constructor(
        container: HTMLElement,
        data: XWUISpeedDialData = {},
        conf_comp: XWUISpeedDialConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.isOpen = this.config.open || false;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISpeedDialConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISpeedDialConfig {
        return {
            direction: conf_comp?.direction ?? 'up',
            open: conf_comp?.open ?? false,
            icon: conf_comp?.icon ?? 'plus', // Default to 'plus' icon name instead of SVG
            position: conf_comp?.position ?? 'bottom-right',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-speed-dial-container';

        // Wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-speed-dial';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Position
        this.wrapperElement.style.position = 'fixed';
        const position = this.config.position || 'bottom-right';
        if (position.includes('bottom')) {
            this.wrapperElement.style.bottom = '20px';
        } else {
            this.wrapperElement.style.top = '20px';
        }
        if (position.includes('right')) {
            this.wrapperElement.style.right = '20px';
        } else {
            this.wrapperElement.style.left = '20px';
        }

        // Actions container
        this.actionsContainer = document.createElement('div');
        this.actionsContainer.className = 'xwui-speed-dial-actions';
        this.actionsContainer.classList.add(`xwui-speed-dial-${this.config.direction}`);

        const actions = this.data.actions || [];
        actions.forEach((action, index) => {
            const actionButton = document.createElement('button');
            actionButton.className = 'xwui-speed-dial-action';
            actionButton.setAttribute('aria-label', action.label);
            actionButton.style.transitionDelay = `${index * 30}ms`;
            
            // Use XWUIIcon for action icons
            if (action.icon) {
                if (action.icon.startsWith('<svg')) {
                    // Backward compatibility: if SVG string is provided, use it
                    actionButton.innerHTML = action.icon;
                } else {
                    // Use icon name with XWUIIcon
                    const iconContainer = document.createElement('div');
                    const icon = new XWUIIcon(iconContainer, action.icon, { size: 20 }, this.conf_sys, this.conf_usr);
                    this.registerChildComponent(icon);
                    this.actionIcons.push(icon);
                    actionButton.appendChild(iconContainer);
                }
            }
            
            if (action.onClick) {
                actionButton.addEventListener('click', () => {
                    action.onClick?.();
                    this.close();
                });
            }
            
            const label = document.createElement('span');
            label.className = 'xwui-speed-dial-action-label';
            label.textContent = action.label;
            actionButton.appendChild(label);
            
            this.actionsContainer.appendChild(actionButton);
        });

        // Main button
        this.mainButton = document.createElement('button');
        this.mainButton.className = 'xwui-speed-dial-main';
        
        // Use XWUIIcon for main button icon
        if (this.config.icon) {
            if (typeof this.config.icon === 'string' && this.config.icon.startsWith('<svg')) {
                // Backward compatibility: if SVG string is provided, use it
                this.mainButton.innerHTML = this.config.icon;
            } else {
                // Use icon name with XWUIIcon
                const iconContainer = document.createElement('div');
                this.mainIcon = new XWUIIcon(iconContainer, this.config.icon, { size: 24 }, this.conf_sys, this.conf_usr);
                this.registerChildComponent(this.mainIcon);
                this.mainButton.appendChild(iconContainer);
            }
        }
        
        this.mainButton.addEventListener('click', () => this.toggle());
        
        // Overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'xwui-speed-dial-overlay';
        this.overlayElement.addEventListener('click', () => this.close());

        this.wrapperElement.appendChild(this.actionsContainer);
        this.wrapperElement.appendChild(this.mainButton);
        this.container.appendChild(this.overlayElement);
        this.container.appendChild(this.wrapperElement);

        // Initial state
        if (this.isOpen) {
            this.open();
        } else {
            this.close();
        }
    }

    public open(): void {
        this.isOpen = true;
        if (this.wrapperElement) {
            this.wrapperElement.classList.add('xwui-speed-dial-open');
        }
        if (this.overlayElement) {
            this.overlayElement.style.display = 'block';
        }
        this.setupClickOutside();
    }

    public close(): void {
        this.isOpen = false;
        if (this.wrapperElement) {
            this.wrapperElement.classList.remove('xwui-speed-dial-open');
        }
        if (this.overlayElement) {
            this.overlayElement.style.display = 'none';
        }
        if (this.clickOutsideCleanup) {
            this.clickOutsideCleanup();
            this.clickOutsideCleanup = null;
        }
    }

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private setupClickOutside(): void {
        import('../../utils/useClickOutside').then(({ useClickOutside }) => {
            if (this.wrapperElement) {
                this.clickOutsideCleanup = useClickOutside(this.wrapperElement, () => {
                    this.close();
                });
            }
        });
    }

    public destroy(): void {
        if (this.clickOutsideCleanup) {
            this.clickOutsideCleanup();
        }
        this.mainIcon = null;
        this.actionIcons = [];
        this.wrapperElement = null;
        this.mainButton = null;
        this.actionsContainer = null;
        this.overlayElement = null;
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISpeedDial as any).componentName = 'XWUISpeedDial';


