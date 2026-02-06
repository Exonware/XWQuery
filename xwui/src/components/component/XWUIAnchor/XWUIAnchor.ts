/**
 * XWUIAnchor Component
 * Table of contents / anchor navigation with scroll spy
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface AnchorItem {
    key: string;
    href: string;
    title: string;
    children?: AnchorItem[];
}

export interface XWUIAnchorConfig {
    offset?: number;
    affix?: boolean;
    bounds?: number;
    targetOffset?: number;
    className?: string;
}

export interface XWUIAnchorData {
    items?: AnchorItem[];
}

export class XWUIAnchor extends XWUIComponent<XWUIAnchorData, XWUIAnchorConfig> {
    private navElement: HTMLElement | null = null;
    private scrollHandler: (() => void) | null = null;
    private activeKey: string | null = null;
    private linkElements: Map<string, HTMLElement> = new Map();
    private sectionElements: Map<string, HTMLElement> = new Map();

    constructor(
        container: HTMLElement,
        data: XWUIAnchorData = {},
        conf_comp: XWUIAnchorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
        this.setupScrollSpy();
    }

    protected createConfig(
        conf_comp?: XWUIAnchorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAnchorConfig {
        return {
            offset: conf_comp?.offset ?? 0,
            affix: conf_comp?.affix ?? false,
            bounds: conf_comp?.bounds ?? 5,
            targetOffset: conf_comp?.targetOffset ?? 0,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-anchor-container';

        this.navElement = document.createElement('nav');
        this.navElement.className = 'xwui-anchor';
        this.navElement.setAttribute('role', 'navigation');
        this.navElement.setAttribute('aria-label', 'Table of contents');
        
        if (this.config.className) {
            this.navElement.classList.add(this.config.className);
        }

        if (this.config.affix) {
            this.navElement.classList.add('xwui-anchor-affix');
        }

        const items = this.data.items || [];
        if (items.length > 0) {
            const list = this.createAnchorList(items);
            this.navElement.appendChild(list);
        }

        this.container.appendChild(this.navElement);
    }

    private createAnchorList(items: AnchorItem[]): HTMLElement {
        const ul = document.createElement('ul');
        ul.className = 'xwui-anchor-list';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'xwui-anchor-item';

            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.title;
            link.className = 'xwui-anchor-link';
            link.setAttribute('data-key', item.key);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToAnchor(item.href);
            });

            this.linkElements.set(item.key, link);
            li.appendChild(link);

            if (item.children && item.children.length > 0) {
                const childrenList = this.createAnchorList(item.children);
                childrenList.className += ' xwui-anchor-list-nested';
                li.appendChild(childrenList);
            }

            ul.appendChild(li);
        });

        return ul;
    }

    private scrollToAnchor(href: string): void {
        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId) || document.querySelector(href);
        
        if (targetElement instanceof HTMLElement) {
            const offset = this.config.targetOffset || 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    private setupScrollSpy(): void {
        this.scrollHandler = () => {
            this.updateActiveLink();
        };

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        this.updateActiveLink();
    }

    private updateActiveLink(): void {
        const items = this.data.items || [];
        const offset = this.config.offset || 0;
        const bounds = this.config.bounds || 5;

        // Find all sections
        items.forEach(item => {
            const element = document.querySelector(item.href);
            if (element instanceof HTMLElement) {
                this.sectionElements.set(item.key, element);
            }
            if (item.children) {
                item.children.forEach(child => {
                    const childElement = document.querySelector(child.href);
                    if (childElement instanceof HTMLElement) {
                        this.sectionElements.set(child.key, childElement);
                    }
                });
            }
        });

        // Find active section
        let activeKey: string | null = null;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        for (const [key, element] of this.sectionElements.entries()) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            
            if (elementTop <= scrollTop + offset + bounds) {
                activeKey = key;
            }
        }

        if (activeKey !== this.activeKey) {
            this.activeKey = activeKey;
            this.updateLinkStates();
        }
    }

    private updateLinkStates(): void {
        // Remove active class from all links
        this.linkElements.forEach((link, key) => {
            if (key === this.activeKey) {
                link.classList.add('xwui-anchor-link-active');
            } else {
                link.classList.remove('xwui-anchor-link-active');
            }
        });
    }

    public destroy(): void {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        this.linkElements.clear();
        this.sectionElements.clear();
        if (this.navElement) {
            this.navElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAnchor as any).componentName = 'XWUIAnchor';


