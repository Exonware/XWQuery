/**
 * XWUIMultiSelect Component
 * Multi-select dropdown (enhancement to XWUISelect)
 * Wraps XWUISelect with multiple mode enabled
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUISelect, type XWUISelectConfig, type XWUISelectData, type XWUISelectOption } from '../XWUISelect/XWUISelect';
import { XWUIChip } from '../XWUIChip/XWUIChip';

export interface XWUIMultiSelectConfig extends Omit<XWUISelectConfig, 'multiple'> {
    maxTagCount?: number;
    tagRender?: (option: XWUISelectOption) => HTMLElement;
}

export interface XWUIMultiSelectData extends Omit<XWUISelectData, 'value'> {
    value?: Array<string | number>;
}

export class XWUIMultiSelect extends XWUIComponent<XWUIMultiSelectData, XWUIMultiSelectConfig> {
    private selectInstance: XWUISelect | null = null;
    private tagsContainer: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMultiSelectData,
        conf_comp: XWUIMultiSelectConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMultiSelectConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMultiSelectConfig {
        return {
            multiple: true, // Always true for multi-select
            maxTagCount: conf_comp?.maxTagCount,
            tagRender: conf_comp?.tagRender,
            ...conf_comp
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-multi-select-container';

        // Tags container for selected items
        if (this.data.value && this.data.value.length > 0) {
            this.renderTags();
        }

        // Convert to XWUISelect data/config
        const selectData: XWUISelectData = {
            ...this.data,
            value: this.data.value ? this.data.value.map(v => String(v)) : []
        };

        const selectConfig: XWUISelectConfig = {
            ...this.config,
            multiple: true // Force multiple mode
        };

        // Create XWUISelect instance
        const selectContainer = document.createElement('div');
        this.selectInstance = new XWUISelect(selectContainer, selectData, selectConfig, this.conf_sys, this.conf_usr);
        this.container.appendChild(selectContainer);

        // Listen for changes
        if (this.selectInstance) {
            // Access the change handler
            const originalRender = (this.selectInstance as any).render.bind(this.selectInstance);
            (this.selectInstance as any).render = () => {
                originalRender();
                this.renderTags();
            };
        }
    }

    private renderTags(): void {
        if (!this.data.value || this.data.value.length === 0) {
            if (this.tagsContainer) {
                this.tagsContainer.remove();
                this.tagsContainer = null;
            }
            return;
        }

        if (!this.tagsContainer) {
            this.tagsContainer = document.createElement('div');
            this.tagsContainer.className = 'xwui-multi-select-tags';
            this.container.insertBefore(this.tagsContainer, this.container.firstChild);
        }

        this.tagsContainer.innerHTML = '';

        const maxCount = this.config.maxTagCount;
        const displayCount = maxCount && this.data.value.length > maxCount ? maxCount : this.data.value.length;
        const remaining = maxCount && this.data.value.length > maxCount ? this.data.value.length - maxCount : 0;

        for (let i = 0; i < displayCount; i++) {
            const value = this.data.value[i];
            const option = this.data.options.find(opt => String(opt.value) === String(value));
            if (option) {
                const tag = this.createTag(option, value);
                this.tagsContainer.appendChild(tag);
            }
        }

        if (remaining > 0) {
            const moreTag = document.createElement('span');
            moreTag.className = 'xwui-multi-select-tag xwui-multi-select-tag-more';
            moreTag.textContent = `+${remaining}`;
            this.tagsContainer.appendChild(moreTag);
        }
    }

    private createTag(option: XWUISelectOption, value: string | number): HTMLElement {
        if (this.config.tagRender) {
            return this.config.tagRender(option);
        }

        const tag = document.createElement('span');
        tag.className = 'xwui-multi-select-tag';
        tag.textContent = option.label;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'xwui-multi-select-tag-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeValue(value);
        });

        tag.appendChild(closeBtn);
        return tag;
    }

    private removeValue(value: string | number): void {
        if (!this.data.value) return;
        this.data.value = this.data.value.filter(v => String(v) !== String(value));
        this.render();
        if (this.selectInstance) {
            (this.selectInstance as any).data.value = this.data.value.map(v => String(v));
            (this.selectInstance as any).render();
        }
    }

    public destroy(): void {
        if (this.selectInstance) {
            this.selectInstance = null;
        }
        this.tagsContainer = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMultiSelect as any).componentName = 'XWUIMultiSelect';


