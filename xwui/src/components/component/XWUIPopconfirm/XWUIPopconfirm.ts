/**
 * XWUIPopconfirm Component
 * Popover with confirmation action
 * Extends or composes XWUIPopover with confirm/cancel buttons
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIPopover, type XWUIPopoverConfig, type XWUIPopoverData } from '../XWUIPopover/XWUIPopover';

export interface XWUIPopconfirmConfig extends Omit<XWUIPopoverConfig, 'content'> {
    title?: string;
    description?: string;
    okText?: string;
    cancelText?: string;
    okButtonProps?: Record<string, any>;
    cancelButtonProps?: Record<string, any>;
}

export interface XWUIPopconfirmData extends Omit<XWUIPopoverData, 'content'> {
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    triggerElement?: HTMLElement | string;
}

export class XWUIPopconfirm extends XWUIComponent<XWUIPopconfirmData, XWUIPopconfirmConfig> {
    private popoverInstance: XWUIPopover | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIPopconfirmData,
        conf_comp: XWUIPopconfirmConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIPopconfirmConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPopconfirmConfig {
        return {
            trigger: 'click',
            title: conf_comp?.title,
            description: conf_comp?.description,
            okText: conf_comp?.okText ?? 'OK',
            cancelText: conf_comp?.cancelText ?? 'Cancel',
            okButtonProps: conf_comp?.okButtonProps,
            cancelButtonProps: conf_comp?.cancelButtonProps,
            ...conf_comp
        };
    }

    private createPopconfirmContent(): HTMLElement {
        const content = document.createElement('div');
        content.className = 'xwui-popconfirm-content';

        // Title
        if (this.config.title) {
            const title = document.createElement('div');
            title.className = 'xwui-popconfirm-title';
            title.textContent = this.config.title;
            content.appendChild(title);
        }

        // Description
        if (this.config.description) {
            const desc = document.createElement('div');
            desc.className = 'xwui-popconfirm-description';
            desc.textContent = this.config.description;
            content.appendChild(desc);
        }

        // Buttons
        const buttons = document.createElement('div');
        buttons.className = 'xwui-popconfirm-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'xwui-popconfirm-cancel';
        cancelBtn.textContent = this.config.cancelText || 'Cancel';
        if (this.config.cancelButtonProps) {
            Object.assign(cancelBtn, this.config.cancelButtonProps);
        }
        cancelBtn.addEventListener('click', () => {
            if (this.data.onCancel) {
                this.data.onCancel();
            }
            if (this.popoverInstance) {
                this.popoverInstance.close();
            }
        });
        buttons.appendChild(cancelBtn);

        const okBtn = document.createElement('button');
        okBtn.className = 'xwui-popconfirm-ok';
        okBtn.textContent = this.config.okText || 'OK';
        if (this.config.okButtonProps) {
            Object.assign(okBtn, this.config.okButtonProps);
        }
        okBtn.addEventListener('click', async () => {
            if (this.data.onConfirm) {
                await Promise.resolve(this.data.onConfirm());
            }
            if (this.popoverInstance) {
                this.popoverInstance.close();
            }
        });
        buttons.appendChild(okBtn);

        content.appendChild(buttons);
        return content;
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-popconfirm-container';

        // Create popover data with custom content
        const popoverData: XWUIPopoverData = {
            content: this.createPopconfirmContent(),
            triggerElement: this.data.triggerElement || this.container
        };

        const popoverConfig: XWUIPopoverConfig = {
            trigger: 'click',
            ...this.config
        };

        // Create XWUIPopover instance
        this.popoverInstance = new XWUIPopover(this.container, popoverData, popoverConfig, this.conf_sys, this.conf_usr);
    }

    public destroy(): void {
        if (this.popoverInstance) {
            this.popoverInstance.destroy();
            this.popoverInstance = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPopconfirm as any).componentName = 'XWUIPopconfirm';


