/**
 * XWUIBulkActionBar Component
 * Toolbar that appears when multiple items are selected for bulk operations
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';

export interface BulkAction {
    label: string;
    icon?: string;
    onClick: () => void;
    variant?: 'default' | 'primary' | 'danger';
    disabled?: boolean;
}

// Component-level configuration
export interface XWUIBulkActionBarConfig {
    position?: 'fixed-top' | 'fixed-bottom' | 'inline';
    showCount?: boolean;
    actions?: BulkAction[];
    className?: string;
}

// Data type
export interface XWUIBulkActionBarData {
    selectedCount?: number;
    visible?: boolean;
}

export class XWUIBulkActionBar extends XWUIComponent<XWUIBulkActionBarData, XWUIBulkActionBarConfig> {
    private wrapperElement: HTMLElement | null = null;
    private badgeElement: HTMLElement | null = null;
    private actionsContainer: HTMLElement | null = null;
    private buttonInstances: XWUIButton[] = [];
    private closeButton: XWUIButton | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIBulkActionBarData = {},
        conf_comp: XWUIBulkActionBarConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIBulkActionBarConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBulkActionBarConfig {
        return {
            position: conf_comp?.position ?? 'fixed-bottom',
            showCount: conf_comp?.showCount ?? true,
            actions: conf_comp?.actions ?? [],
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        if (!this.data.visible || (this.data.selectedCount || 0) === 0) {
            return;
        }

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-bulk-action-bar';
        this.wrapperElement.classList.add(`xwui-bulk-action-bar-${this.config.position}`);
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Left section: Count
        const leftSection = document.createElement('div');
        leftSection.className = 'xwui-bulk-action-bar-left';

        if (this.config.showCount) {
            const countContainer = document.createElement('div');
            countContainer.className = 'xwui-bulk-action-bar-count';
            this.badgeElement = document.createElement('span');
            this.badgeElement.className = 'xwui-bulk-action-bar-count-badge';
            this.badgeElement.textContent = String(this.data.selectedCount || 0);
            countContainer.appendChild(this.badgeElement);
            
            const text = document.createElement('span');
            text.className = 'xwui-bulk-action-bar-count-text';
            text.textContent = `item${(this.data.selectedCount || 0) !== 1 ? 's' : ''} selected`;
            countContainer.appendChild(text);
            
            leftSection.appendChild(countContainer);
        }

        this.wrapperElement.appendChild(leftSection);

        // Right section: Actions
        const rightSection = document.createElement('div');
        rightSection.className = 'xwui-bulk-action-bar-right';

        this.actionsContainer = document.createElement('div');
        this.actionsContainer.className = 'xwui-bulk-action-bar-actions';

        this.buttonInstances = [];
        if (this.config.actions && this.config.actions.length > 0) {
            this.config.actions.forEach((action, index) => {
                const buttonContainer = document.createElement('div');
                const button = new XWUIButton(buttonContainer, {
                    label: action.label,
                    variant: action.variant || 'default',
                    size: 'small',
                    disabled: action.disabled || false
                });
                this.buttonInstances.push(button);

                if (action.icon) {
                    button.getElement()?.insertAdjacentHTML('afterbegin', `${action.icon} `);
                }

                button.onClick(() => {
                    if (!action.disabled) {
                        action.onClick();
                    }
                });

                this.actionsContainer.appendChild(buttonContainer);
            });
        }

        rightSection.appendChild(this.actionsContainer);

        // Close button
        const closeButtonContainer = document.createElement('div');
        this.closeButton = new XWUIButton(closeButtonContainer, {
            label: 'Clear',
            variant: 'default',
            size: 'small'
        });

        this.closeButton.onClick(() => {
            this.setVisible(false);
        });

        rightSection.appendChild(closeButtonContainer);
        this.wrapperElement.appendChild(rightSection);

        this.container.appendChild(this.wrapperElement);
    }

    public setSelectedCount(count: number): void {
        this.data.selectedCount = Math.max(0, count);
        if (this.badgeElement) {
            this.badgeElement.textContent = String(this.data.selectedCount);
        }
        if (count === 0) {
            this.setVisible(false);
        } else {
            this.setVisible(true);
        }
    }

    public setVisible(visible: boolean): void {
        this.data.visible = visible;
        this.render();
    }

    public addAction(action: BulkAction): void {
        if (!this.config.actions) {
            this.config.actions = [];
        }
        this.config.actions.push(action);
        this.render();
    }

    public removeAction(index: number): void {
        if (this.config.actions && index >= 0 && index < this.config.actions.length) {
            this.config.actions.splice(index, 1);
            this.render();
        }
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        this.buttonInstances.forEach(button => button.destroy());
        this.buttonInstances = [];
        if (this.closeButton) {
            this.closeButton.destroy();
            this.closeButton = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBulkActionBar as any).componentName = 'XWUIBulkActionBar';


