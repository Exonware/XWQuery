/**
 * XWUIAccordion Component
 * Multiple collapsible sections with single/multiple open modes
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIconSpan } from '../XWUIIcon/icon-utils';
import { XWUICollapse } from '../XWUICollapse/XWUICollapse';

// Accordion item definition
export interface XWUIAccordionItem {
    id: string;
    title: string | HTMLElement;
    content: string | HTMLElement;
    disabled?: boolean;
    icon?: string;
}

// Component-level configuration
export interface XWUIAccordionConfig {
    mode?: 'single' | 'multiple';       // single = only one open, multiple = any number open
    defaultExpanded?: string[];         // IDs of initially expanded items
    duration?: number;
    easing?: string;
    bordered?: boolean;
    flush?: boolean;                    // No outer borders
    className?: string;
}

// Data type
export interface XWUIAccordionData {
    items: XWUIAccordionItem[];
}

export class XWUIAccordion extends XWUIComponent<XWUIAccordionData, XWUIAccordionConfig> {
    private accordionElement: HTMLElement | null = null;
    private collapseInstances: Map<string, XWUICollapse> = new Map();
    private expandedItems: Set<string> = new Set();

    constructor(
        container: HTMLElement,
        data: XWUIAccordionData,
        conf_comp: XWUIAccordionConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Initialize expanded items
        if (this.config.defaultExpanded) {
            this.config.defaultExpanded.forEach(id => this.expandedItems.add(id));
        }
        
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAccordionConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAccordionConfig {
        return {
            mode: conf_comp?.mode ?? 'single',
            defaultExpanded: conf_comp?.defaultExpanded ?? [],
            duration: conf_comp?.duration ?? 200,
            easing: conf_comp?.easing ?? 'ease-out',
            bordered: conf_comp?.bordered ?? true,
            flush: conf_comp?.flush ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.collapseInstances.clear();

        // Create accordion container
        this.accordionElement = document.createElement('div');
        this.accordionElement.className = 'xwui-accordion';
        
        if (this.config.bordered) {
            this.accordionElement.classList.add('xwui-accordion-bordered');
        }
        if (this.config.flush) {
            this.accordionElement.classList.add('xwui-accordion-flush');
        }
        if (this.config.className) {
            this.accordionElement.classList.add(this.config.className);
        }

        // Render each item
        this.data.items.forEach((item, index) => {
            const itemElement = this.createAccordionItem(item, index);
            this.accordionElement!.appendChild(itemElement);
        });

        this.container.appendChild(this.accordionElement);
    }

    private createAccordionItem(item: XWUIAccordionItem, index: number): HTMLElement {
        const isExpanded = this.expandedItems.has(item.id);
        
        // Item wrapper
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'xwui-accordion-item';
        itemWrapper.setAttribute('data-id', item.id);
        
        if (item.disabled) {
            itemWrapper.classList.add('xwui-accordion-item-disabled');
        }
        if (isExpanded) {
            itemWrapper.classList.add('xwui-accordion-item-expanded');
        }

        // Header/trigger
        const header = document.createElement('div');
        header.className = 'xwui-accordion-header';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', item.disabled ? '-1' : '0');
        header.setAttribute('aria-expanded', String(isExpanded));
        header.setAttribute('aria-controls', `accordion-content-${item.id}`);

        // Icon (optional)
        if (item.icon) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'xwui-accordion-icon';
            iconSpan.innerHTML = item.icon;
            header.appendChild(iconSpan);
        }

        // Title
        const titleSpan = document.createElement('span');
        titleSpan.className = 'xwui-accordion-title';
        if (typeof item.title === 'string') {
            titleSpan.textContent = item.title;
        } else {
            titleSpan.appendChild(item.title);
        }
        header.appendChild(titleSpan);

        // Arrow indicator - Use XWUIIcon utility
        const arrow = createIconSpan(
            this,
            'chevron-down',
            { size: 20 },
            { className: 'xwui-accordion-arrow' },
            this.conf_sys,
            this.conf_usr
        );
        header.appendChild(arrow);

        // Click handler
        if (!item.disabled) {
            header.addEventListener('click', () => this.toggleItem(item.id));
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleItem(item.id);
                }
            });
        }

        itemWrapper.appendChild(header);

        // Content container for collapse
        const contentContainer = document.createElement('div');
        contentContainer.id = `accordion-content-${item.id}`;
        contentContainer.className = 'xwui-accordion-content-wrapper';

        // Create content element
        const contentElement = document.createElement('div');
        contentElement.className = 'xwui-accordion-content';
        if (typeof item.content === 'string') {
            contentElement.innerHTML = item.content;
        } else {
            contentElement.appendChild(item.content);
        }

        // Create collapse instance
        const collapse = new XWUICollapse(
            contentContainer,
            { content: contentElement },
            {
                expanded: isExpanded,
                duration: this.config.duration,
                easing: this.config.easing
            }
        );

        this.collapseInstances.set(item.id, collapse);
        itemWrapper.appendChild(contentContainer);

        return itemWrapper;
    }

    private async toggleItem(id: string): Promise<void> {
        const collapse = this.collapseInstances.get(id);
        if (!collapse) return;

        const isCurrentlyExpanded = this.expandedItems.has(id);

        if (isCurrentlyExpanded) {
            // Collapse this item
            await collapse.collapse();
            this.expandedItems.delete(id);
            this.updateItemState(id, false);
        } else {
            // In single mode, collapse all others first
            if (this.config.mode === 'single') {
                const collapsePromises: Promise<void>[] = [];
                this.expandedItems.forEach(expandedId => {
                    if (expandedId !== id) {
                        const otherCollapse = this.collapseInstances.get(expandedId);
                        if (otherCollapse) {
                            collapsePromises.push(otherCollapse.collapse());
                            this.updateItemState(expandedId, false);
                        }
                    }
                });
                await Promise.all(collapsePromises);
                this.expandedItems.clear();
            }

            // Expand this item
            await collapse.expand();
            this.expandedItems.add(id);
            this.updateItemState(id, true);
        }
    }

    private updateItemState(id: string, expanded: boolean): void {
        const itemElement = this.accordionElement?.querySelector(`[data-id="${id}"]`);
        if (itemElement) {
            const header = itemElement.querySelector('.xwui-accordion-header');
            if (expanded) {
                itemElement.classList.add('xwui-accordion-item-expanded');
                header?.setAttribute('aria-expanded', 'true');
            } else {
                itemElement.classList.remove('xwui-accordion-item-expanded');
                header?.setAttribute('aria-expanded', 'false');
            }
        }
    }

    public expandItem(id: string): Promise<void> {
        if (this.expandedItems.has(id)) return Promise.resolve();
        return this.toggleItem(id);
    }

    public collapseItem(id: string): Promise<void> {
        if (!this.expandedItems.has(id)) return Promise.resolve();
        return this.toggleItem(id);
    }

    public expandAll(): Promise<void[]> {
        if (this.config.mode === 'single') {
            console.warn('expandAll() is not supported in single mode');
            return Promise.resolve([]);
        }
        
        const promises: Promise<void>[] = [];
        this.data.items.forEach(item => {
            if (!item.disabled && !this.expandedItems.has(item.id)) {
                const collapse = this.collapseInstances.get(item.id);
                if (collapse) {
                    promises.push(collapse.expand());
                    this.expandedItems.add(item.id);
                    this.updateItemState(item.id, true);
                }
            }
        });
        return Promise.all(promises);
    }

    public collapseAll(): Promise<void[]> {
        const promises: Promise<void>[] = [];
        this.expandedItems.forEach(id => {
            const collapse = this.collapseInstances.get(id);
            if (collapse) {
                promises.push(collapse.collapse());
                this.updateItemState(id, false);
            }
        });
        this.expandedItems.clear();
        return Promise.all(promises);
    }

    public getExpandedItems(): string[] {
        return Array.from(this.expandedItems);
    }

    public isExpanded(id: string): boolean {
        return this.expandedItems.has(id);
    }

    public addItem(item: XWUIAccordionItem): void {
        this.data.items.push(item);
        if (this.accordionElement) {
            const itemElement = this.createAccordionItem(item, this.data.items.length - 1);
            this.accordionElement.appendChild(itemElement);
        }
    }

    public removeItem(id: string): void {
        const index = this.data.items.findIndex(item => item.id === id);
        if (index > -1) {
            this.data.items.splice(index, 1);
            this.collapseInstances.delete(id);
            this.expandedItems.delete(id);
            
            const itemElement = this.accordionElement?.querySelector(`[data-id="${id}"]`);
            if (itemElement) {
                itemElement.remove();
            }
        }
    }

    public getElement(): HTMLElement | null {
        return this.accordionElement;
    }

    public destroy(): void {
        this.collapseInstances.forEach(collapse => collapse.destroy());
        this.collapseInstances.clear();
        this.expandedItems.clear();
        
        if (this.accordionElement) {
            this.accordionElement.remove();
            this.accordionElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAccordion as any).componentName = 'XWUIAccordion';


