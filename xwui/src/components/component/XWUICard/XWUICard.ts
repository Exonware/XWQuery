/**
 * XWUICard Component
 * Content card container with header, body, footer slots
 * Extends XWUIContainer to inherit container and box functionality
 */

import { XWUIContainer, type XWUIContainerConfig, type XWUIContainerData } from '../XWUIContainer/XWUIContainer';
import type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUITitled } from '../XWUITitled/XWUITitled';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';
import { XWUITag } from '../XWUITag/XWUITag';
import { XWUIImage } from '../XWUIImage/XWUIImage';

// Component-level configuration - extends XWUIContainerConfig
export interface XWUICardConfig extends Omit<XWUIContainerConfig, 'padding'> {
    variant?: 'default' | 'outlined' | 'elevated' | 'filled';
    hoverable?: boolean;
    clickable?: boolean;
    padding?: 'none' | 'small' | 'medium' | 'large' | string | number; // Card-specific padding + container padding support
    iconSize?: number; // Icon size in pixels (standard sizes: 4, 8, 16, 32, 64, 128, 256, etc.)
}

// Data type - extends XWUIContainerData
export interface XWUICardData extends XWUIContainerData {
    // Image support (enhance existing cover)
    image?: string | import('../XWUIImage/XWUIImage').XWUIImageData; // Support XWUIImage or URL string
    cover?: string; // Keep for backward compatibility
    
    // XWUITitled integration
    icon?: string; // Icon name
    title?: string;
    subtitle?: string;
    body?: HTMLElement | string; // Rename from 'content' to 'body' for clarity
    
    // Badge support
    badge?: import('../XWUIBadge/XWUIBadge').XWUIBadgeData | number; // Badge data or simple count
    
    // Tags support
    tags?: Array<import('../XWUITag/XWUITag').XWUITagData | string>; // Array of tag data or simple strings
    
    // Legacy support
    header?: HTMLElement | string;
    content?: HTMLElement | string; // Keep for backward compatibility
    footer?: HTMLElement | string;
}

export class XWUICard extends XWUIContainer {
    public data!: XWUICardData; // Override with correct type - initialized in parent constructor
    private clickHandlers: Array<(event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUICardData = {},
        conf_comp: XWUICardConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Convert card padding to container padding format
        const cardPadding = conf_comp.padding;
        let containerPadding: string | number | undefined;
        
        if (typeof cardPadding === 'string' && ['none', 'small', 'medium', 'large'].includes(cardPadding)) {
            // Card-specific padding values - map to CSS classes
            containerPadding = undefined; // Will be handled by CSS class
        } else {
            // Use as-is for container (string or number)
            containerPadding = cardPadding;
        }
        
        // Create container config - don't pass padding if it's a card-specific value
        const containerConfig: XWUIContainerConfig = {
            ...conf_comp,
            padding: containerPadding,
            className: conf_comp.className
        };
        
        // Pass the actual card data to super() - XWUICardData extends XWUIContainerData so it's compatible
        super(container, data, containerConfig, conf_sys, conf_usr);
        
        // Apply card-specific rendering after container is set up
        requestAnimationFrame(() => {
            this.renderCard();
        });
    }

    protected createConfig(
        conf_comp?: XWUICardConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICardConfig {
        const containerConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        return {
            ...containerConfig,
            variant: conf_comp?.variant ?? 'default',
            hoverable: conf_comp?.hoverable ?? false,
            clickable: conf_comp?.clickable ?? false,
            padding: conf_comp?.padding ?? 'medium',
            iconSize: conf_comp?.iconSize ?? 64
        };
    }

    private renderCard(): void {
        const cardElement = this.getElement();
        if (!cardElement) return;

        // Clear existing content
        cardElement.innerHTML = '';
        
        // Apply card classes
        cardElement.className = 'xwui-box xwui-container xwui-card';
        cardElement.classList.add(`xwui-card-${this.config.variant}`);
        
        // Handle card-specific padding
        const cardPadding = this.config.padding;
        if (typeof cardPadding === 'string' && ['none', 'small', 'medium', 'large'].includes(cardPadding)) {
            cardElement.classList.add(`xwui-card-padding-${cardPadding}`);
        }
        
        if (this.config.hoverable) {
            cardElement.classList.add('xwui-card-hoverable');
        }
        if (this.config.clickable) {
            cardElement.classList.add('xwui-card-clickable');
            cardElement.setAttribute('role', 'button');
            cardElement.setAttribute('tabindex', '0');
            
            cardElement.addEventListener('click', (e) => {
                this.clickHandlers.forEach(handler => handler(e));
            });
            
            cardElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.clickHandlers.forEach(handler => handler(e));
                }
            });
        }
        if (this.config.className) {
            cardElement.classList.add(this.config.className);
        }

        // Cover/Image: Use XWUIImage if `image` provided, fallback to `cover` for backward compatibility
        if (this.data.image) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'xwui-card-cover';
            
            if (typeof this.data.image === 'string') {
                // Simple URL string - use XWUIImage
                const imageData = { src: this.data.image };
                const image = new XWUIImage(imageContainer, imageData, { aspectRatio: '16/9' }, this.conf_sys, this.conf_usr);
                this.registerChildComponent(image);
            } else {
                // XWUIImageData object
                const image = new XWUIImage(imageContainer, this.data.image, { aspectRatio: '16/9' }, this.conf_sys, this.conf_usr);
                this.registerChildComponent(image);
            }
            
            cardElement.appendChild(imageContainer);
        } else if (this.data.cover) {
            // Backward compatibility: use simple img tag
            const cover = document.createElement('div');
            cover.className = 'xwui-card-cover';
            
            const img = document.createElement('img');
            img.src = this.data.cover;
            img.alt = '';
            cover.appendChild(img);
            
            cardElement.appendChild(cover);
        }

        // Header: Use XWUITitled if icon/title/subtitle/body provided, with badge support
        if (this.data.header) {
            // Legacy: custom header
            const header = document.createElement('div');
            header.className = 'xwui-card-header';
            if (typeof this.data.header === 'string') {
                header.innerHTML = this.data.header;
            } else {
                header.appendChild(this.data.header);
            }
            cardElement.appendChild(header);
        } else if (this.data.icon || this.data.title || this.data.subtitle || this.data.body) {
            // New API: Use XWUITitled
            const header = document.createElement('div');
            header.className = 'xwui-card-header';
            
            // If we have a title with a badge, create a title wrapper for inline layout
            if (this.data.title && this.data.badge) {
                const titleWrapper = document.createElement('div');
                titleWrapper.className = 'xwui-card-title-wrapper';
                
                const titleElement = document.createElement('h3');
                titleElement.className = 'xwui-card-title';
                titleElement.textContent = this.data.title;
                titleWrapper.appendChild(titleElement);
                
                const badgeContainer = document.createElement('div');
                badgeContainer.className = 'xwui-card-badge';
                
                if (typeof this.data.badge === 'number') {
                    // Simple count
                    const badge = new XWUIBadge(badgeContainer, { count: this.data.badge }, { variant: 'primary', standalone: true }, this.conf_sys, this.conf_usr);
                    this.registerChildComponent(badge);
                } else {
                    // XWUIBadgeData object
                    const badge = new XWUIBadge(badgeContainer, this.data.badge, { variant: 'primary', standalone: true }, this.conf_sys, this.conf_usr);
                    this.registerChildComponent(badge);
                }
                
                titleWrapper.appendChild(badgeContainer);
                header.appendChild(titleWrapper);
            } else if (this.data.badge && !this.data.title) {
                // Badge without title
                const badgeContainer = document.createElement('div');
                badgeContainer.className = 'xwui-card-badge';
                
                if (typeof this.data.badge === 'number') {
                    const badge = new XWUIBadge(badgeContainer, { count: this.data.badge }, { variant: 'primary', standalone: true }, this.conf_sys, this.conf_usr);
                    this.registerChildComponent(badge);
                } else {
                    const badge = new XWUIBadge(badgeContainer, this.data.badge, { variant: 'primary', standalone: true }, this.conf_sys, this.conf_usr);
                    this.registerChildComponent(badge);
                }
                
                header.appendChild(badgeContainer);
            }
            
            // Create XWUITitled for icon, title (if no badge), subtitle, and body
            const titledContainer = document.createElement('div');
            const titledData: import('../XWUITitled/XWUITitled').XWUITitledData = {
                icon: this.data.icon,
                title: this.data.badge ? undefined : this.data.title, // Don't include title in XWUITitled if badge exists
                subtitle: this.data.subtitle,
                body: this.data.body
            };
            
            // Only create XWUITitled if there's something to show
            if (titledData.icon || titledData.title || titledData.subtitle || titledData.body) {
                const titledConfig: import('../XWUITitled/XWUITitled').XWUITitledConfig = {
                    iconSize: this.config.iconSize
                };
                const titled = new XWUITitled(titledContainer, titledData, titledConfig, this.conf_sys, this.conf_usr);
                this.registerChildComponent(titled);
                header.appendChild(titledContainer);
            }
            
            cardElement.appendChild(header);
        } else if (this.data.title || this.data.subtitle) {
            // Legacy: simple title/subtitle without XWUITitled
            const header = document.createElement('div');
            header.className = 'xwui-card-header';

            if (this.data.title) {
                const title = document.createElement('h3');
                title.className = 'xwui-card-title';
                title.textContent = this.data.title;
                header.appendChild(title);
            }

            if (this.data.subtitle) {
                const subtitle = document.createElement('p');
                subtitle.className = 'xwui-card-subtitle';
                subtitle.textContent = this.data.subtitle;
                header.appendChild(subtitle);
            }

            cardElement.appendChild(header);
        }

        // Body/content: Use `body` (or `content` for backward compatibility)
        const bodyContent = this.data.body ?? this.data.content;
        if (bodyContent) {
            const body = document.createElement('div');
            body.className = 'xwui-card-body';
            if (typeof bodyContent === 'string') {
                body.innerHTML = bodyContent;
            } else {
                body.appendChild(bodyContent);
            }
            cardElement.appendChild(body);
        }

        // Footer: Use tags if provided, fallback to custom footer
        if (this.data.tags && this.data.tags.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'xwui-card-footer';
            footer.classList.add('xwui-card-footer-tags');
            
            this.data.tags.forEach(tagData => {
                const tagContainer = document.createElement('span');
                if (typeof tagData === 'string') {
                    // Simple string
                    const tag = new XWUITag(tagContainer, { label: tagData }, { variant: 'default' }, this.conf_sys, this.conf_usr);
                    this.registerChildComponent(tag);
                } else {
                    // XWUITagData object
                    const tag = new XWUITag(tagContainer, tagData, { variant: 'default' }, this.conf_sys, this.conf_usr);
                    this.registerChildComponent(tag);
                }
                footer.appendChild(tagContainer);
            });
            
            cardElement.appendChild(footer);
        } else if (this.data.footer) {
            // Legacy: custom footer
            const footer = document.createElement('div');
            footer.className = 'xwui-card-footer';
            if (typeof this.data.footer === 'string') {
                footer.innerHTML = this.data.footer;
            } else {
                footer.appendChild(this.data.footer);
            }
            cardElement.appendChild(footer);
        }
    }

    public setTitle(title: string): void {
        this.data.title = title;
        const cardElement = this.getElement();
        const titleElement = cardElement?.querySelector('.xwui-card-title');
        if (titleElement) {
            titleElement.textContent = title;
        } else {
            this.renderCard();
        }
    }

    public setContent(content: HTMLElement | string): void {
        this.data.content = content;
        const cardElement = this.getElement();
        const body = cardElement?.querySelector('.xwui-card-body');
        if (body) {
            body.innerHTML = '';
            if (typeof content === 'string') {
                body.innerHTML = content;
            } else {
                body.appendChild(content);
            }
        } else {
            this.renderCard();
        }
    }

    public onClick(handler: (event: Event) => void): void {
        this.clickHandlers.push(handler);
    }

    public destroy(): void {
        this.clickHandlers = [];
        super.destroy();
    }
}

(XWUICard as any).componentName = 'XWUICard';

