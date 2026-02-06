/**
 * XWUISectionGrouping Component
 * Group tasks/projects into sections in board and list views
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIAccordion } from '../XWUIAccordion/XWUIAccordion';

export interface SectionItem {
    id: string;
    content: string | HTMLElement;
    [key: string]: any;
}

export interface Section {
    id: string;
    title: string;
    items: SectionItem[];
    collapsed?: boolean;
}

// Component-level configuration
export interface XWUISectionGroupingConfig {
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    showItemCount?: boolean;
    sortable?: boolean;
    className?: string;
}

// Data type
export interface XWUISectionGroupingData {
    sections: Section[];
}

export class XWUISectionGrouping extends XWUIComponent<XWUISectionGroupingData, XWUISectionGroupingConfig> {
    private wrapperElement: HTMLElement | null = null;
    private accordionComponent: XWUIAccordion | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISectionGroupingData,
        conf_comp: XWUISectionGroupingConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISectionGroupingConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISectionGroupingConfig {
        return {
            collapsible: conf_comp?.collapsible ?? true,
            defaultCollapsed: conf_comp?.defaultCollapsed ?? false,
            showItemCount: conf_comp?.showItemCount ?? true,
            sortable: conf_comp?.sortable ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-section-grouping';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        if (this.config.collapsible) {
            this.renderAccordion();
        } else {
            this.renderStatic();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderAccordion(): void {
        const accordionItems = this.data.sections.map(section => {
            const title = document.createElement('div');
            title.className = 'xwui-section-grouping-title';
            
            const titleText = document.createElement('span');
            titleText.textContent = section.title;
            title.appendChild(titleText);

            if (this.config.showItemCount) {
                const count = document.createElement('span');
                count.className = 'xwui-section-grouping-count';
                count.textContent = `(${section.items.length})`;
                title.appendChild(count);
            }

            const content = document.createElement('div');
            content.className = 'xwui-section-grouping-content';
            section.items.forEach(item => {
                const itemEl = typeof item.content === 'string' 
                    ? document.createTextNode(item.content) 
                    : item.content;
                content.appendChild(itemEl);
            });

            return {
                id: section.id,
                title: title,
                content: content,
                disabled: false
            };
        });

        const accordionContainer = document.createElement('div');
        this.accordionComponent = new XWUIAccordion(accordionContainer, {
            items: accordionItems
        }, {
            mode: 'multiple',
            defaultExpanded: this.config.defaultCollapsed 
                ? [] 
                : this.data.sections.map(s => s.id),
            bordered: true
        });

        this.wrapperElement!.appendChild(accordionContainer);
    }

    private renderStatic(): void {
        this.data.sections.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = 'xwui-section-grouping-section';

            const header = document.createElement('div');
            header.className = 'xwui-section-grouping-header';
            
            const title = document.createElement('h3');
            title.className = 'xwui-section-grouping-section-title';
            title.textContent = section.title;
            header.appendChild(title);

            if (this.config.showItemCount) {
                const count = document.createElement('span');
                count.className = 'xwui-section-grouping-count';
                count.textContent = `(${section.items.length})`;
                header.appendChild(count);
            }

            sectionEl.appendChild(header);

            const content = document.createElement('div');
            content.className = 'xwui-section-grouping-content';
            section.items.forEach(item => {
                const itemEl = typeof item.content === 'string' 
                    ? document.createTextNode(item.content) 
                    : item.content;
                content.appendChild(itemEl);
            });

            sectionEl.appendChild(content);
            this.wrapperElement!.appendChild(sectionEl);
        });
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.accordionComponent) {
            this.accordionComponent.destroy();
            this.accordionComponent = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISectionGrouping as any).componentName = 'XWUISectionGrouping';


