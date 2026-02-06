/**
 * XWUIAffix Component
 * Pin element to viewport when scrolling
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIAffixConfig {
    offset?: number;
    position?: 'top' | 'bottom';
    target?: HTMLElement | string;
    className?: string;
}

export interface XWUIAffixData {
    content?: string | HTMLElement;
}

export class XWUIAffix extends XWUIComponent<XWUIAffixData, XWUIAffixConfig> {
    private affixElement: HTMLElement | null = null;
    private placeholderElement: HTMLElement | null = null;
    private scrollHandler: (() => void) | null = null;
    private isAffixed: boolean = false;
    private originalTop: number = 0;
    private targetContainer: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIAffixData = {},
        conf_comp: XWUIAffixConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
        this.setupScrollListener();
    }

    protected createConfig(
        conf_comp?: XWUIAffixConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAffixConfig {
        return {
            offset: conf_comp?.offset ?? 0,
            position: conf_comp?.position ?? 'top',
            target: conf_comp?.target,
            className: conf_comp?.className
        };
    }

    private resolveTarget(): HTMLElement {
        const target = this.config.target;
        
        if (!target) {
            return document.body;
        }

        if (target instanceof HTMLElement) {
            return target;
        }

        if (typeof target === 'string') {
            const element = document.querySelector(target) as HTMLElement;
            return element || document.body;
        }

        return document.body;
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-affix-container';

        // Create placeholder to maintain space
        this.placeholderElement = document.createElement('div');
        this.placeholderElement.className = 'xwui-affix-placeholder';
        this.container.appendChild(this.placeholderElement);

        // Create affix element
        this.affixElement = document.createElement('div');
        this.affixElement.className = 'xwui-affix';
        
        if (this.config.className) {
            this.affixElement.classList.add(this.config.className);
        }

        const content = this.data.content;
        if (content instanceof HTMLElement) {
            this.affixElement.appendChild(content);
        } else if (typeof content === 'string') {
            this.affixElement.innerHTML = content;
        }

        this.placeholderElement.appendChild(this.affixElement);
        this.targetContainer = this.resolveTarget();
    }

    private setupScrollListener(): void {
        this.scrollHandler = () => {
            this.updateAffix();
        };

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        this.updateAffix();
    }

    private updateAffix(): void {
        if (!this.placeholderElement || !this.affixElement) return;

        const placeholderRect = this.placeholderElement.getBoundingClientRect();
        const offset = this.config.offset || 0;
        const position = this.config.position || 'top';
        
        let shouldBeAffixed = false;

        if (position === 'top') {
            shouldBeAffixed = placeholderRect.top <= offset;
        } else {
            const viewportHeight = window.innerHeight;
            shouldBeAffixed = placeholderRect.bottom >= viewportHeight - offset;
        }

        if (shouldBeAffixed !== this.isAffixed) {
            this.isAffixed = shouldBeAffixed;
            
            if (this.isAffixed) {
                this.affix();
            } else {
                this.unaffix();
            }
        }

        if (this.isAffixed) {
            this.updateAffixPosition();
        }
    }

    private affix(): void {
        if (!this.affixElement || !this.placeholderElement) return;

        const rect = this.placeholderElement.getBoundingClientRect();
        this.originalTop = rect.top + window.scrollY;

        this.affixElement.style.position = 'fixed';
        this.affixElement.style.width = `${rect.width}px`;
        
        const offset = this.config.offset || 0;
        if (this.config.position === 'top') {
            this.affixElement.style.top = `${offset}px`;
        } else {
            this.affixElement.style.bottom = `${offset}px`;
        }

        this.affixElement.classList.add('xwui-affix-affixed');
        this.targetContainer.appendChild(this.affixElement);
    }

    private unaffix(): void {
        if (!this.affixElement || !this.placeholderElement) return;

        this.affixElement.style.position = '';
        this.affixElement.style.top = '';
        this.affixElement.style.bottom = '';
        this.affixElement.style.width = '';
        
        this.affixElement.classList.remove('xwui-affix-affixed');
        this.placeholderElement.appendChild(this.affixElement);
    }

    private updateAffixPosition(): void {
        if (!this.affixElement || !this.placeholderElement) return;
        if (!this.isAffixed) return;

        const placeholderRect = this.placeholderElement.getBoundingClientRect();
        this.affixElement.style.width = `${placeholderRect.width}px`;
    }

    public destroy(): void {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        if (this.affixElement) {
            this.affixElement = null;
        }
        if (this.placeholderElement) {
            this.placeholderElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAffix as any).componentName = 'XWUIAffix';


