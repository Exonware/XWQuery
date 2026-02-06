/**
 * XWUIBreadcrumbs Component
 * Path navigation breadcrumbs
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIconSpan } from '../XWUIIcon/icon-utils';

export interface XWUIBreadcrumbItem {
    label: string;
    href?: string;
    icon?: string;
    onClick?: () => void;
}

// Component-level configuration
export interface XWUIBreadcrumbsConfig {
    separator?: string;
    maxItems?: number;
    collapseAt?: number;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIBreadcrumbsData {
    items: XWUIBreadcrumbItem[];
}

export class XWUIBreadcrumbs extends XWUIComponent<XWUIBreadcrumbsData, XWUIBreadcrumbsConfig> {
    private navElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIBreadcrumbsData,
        conf_comp: XWUIBreadcrumbsConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIBreadcrumbsConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBreadcrumbsConfig {
        return {
            separator: conf_comp?.separator ?? '/',
            maxItems: conf_comp?.maxItems,
            collapseAt: conf_comp?.collapseAt ?? 4,
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.navElement = document.createElement('nav');
        this.navElement.className = 'xwui-breadcrumbs';
        this.navElement.classList.add(`xwui-breadcrumbs-${this.config.size}`);
        this.navElement.setAttribute('aria-label', 'Breadcrumb');
        
        if (this.config.className) {
            this.navElement.classList.add(this.config.className);
        }

        const ol = document.createElement('ol');
        ol.className = 'xwui-breadcrumbs-list';

        const items = this.getDisplayItems();

        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'xwui-breadcrumbs-item';

            if (item === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'xwui-breadcrumbs-ellipsis';
                ellipsis.textContent = '...';
                li.appendChild(ellipsis);
            } else {
                const isLast = index === items.length - 1;
                
                if (isLast) {
                    const span = document.createElement('span');
                    span.className = 'xwui-breadcrumbs-current';
                    span.setAttribute('aria-current', 'page');
                    
                    if (item.icon) {
                        const iconSpan = document.createElement('span');
                        iconSpan.className = 'xwui-breadcrumbs-icon';
                        iconSpan.innerHTML = item.icon;
                        span.appendChild(iconSpan);
                    }
                    
                    span.appendChild(document.createTextNode(item.label));
                    li.appendChild(span);
                } else {
                    const link = document.createElement('a');
                    link.className = 'xwui-breadcrumbs-link';
                    link.href = item.href || '#';
                    
                    if (item.onClick) {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            item.onClick!();
                        });
                    }
                    
                    if (item.icon) {
                        const iconSpan = document.createElement('span');
                        iconSpan.className = 'xwui-breadcrumbs-icon';
                        iconSpan.innerHTML = item.icon;
                        link.appendChild(iconSpan);
                    }
                    
                    link.appendChild(document.createTextNode(item.label));
                    li.appendChild(link);
                }
            }

            // Separator - Use XWUIIcon utility for chevron when separator is '/'
            if (index < items.length - 1) {
                const separator = document.createElement('span');
                separator.className = 'xwui-breadcrumbs-separator';
                separator.setAttribute('aria-hidden', 'true');
                if (this.config.separator === '/') {
                    // Use chevron-right icon
                    const separatorIcon = createIconSpan(
                        this,
                        'chevron-right',
                        { size: 16 },
                        { ariaHidden: true },
                        this.conf_sys,
                        this.conf_usr
                    );
                    separator.appendChild(separatorIcon);
                } else {
                    separator.textContent = this.config.separator || '/';
                }
                li.appendChild(separator);
            }

            ol.appendChild(li);
        });

        this.navElement.appendChild(ol);
        this.container.appendChild(this.navElement);
    }

    private getDisplayItems(): (XWUIBreadcrumbItem | '...')[] {
        const items = this.data.items;
        const maxItems = this.config.maxItems;
        const collapseAt = this.config.collapseAt || 4;

        if (maxItems && items.length > maxItems) {
            return [
                items[0],
                '...',
                ...items.slice(-(maxItems - 2))
            ];
        }

        if (items.length > collapseAt) {
            return [
                items[0],
                '...',
                ...items.slice(-2)
            ];
        }

        return items;
    }

    public setItems(items: XWUIBreadcrumbItem[]): void {
        this.data.items = items;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.navElement;
    }

    public destroy(): void {
        if (this.navElement) {
            this.navElement.remove();
            this.navElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBreadcrumbs as any).componentName = 'XWUIBreadcrumbs';


