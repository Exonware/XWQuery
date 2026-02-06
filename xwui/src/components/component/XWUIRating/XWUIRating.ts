/**
 * XWUIRating Component
 * Star/icon rating input
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIcon } from '../XWUIIcon/icon-utils';

// Component-level configuration
export interface XWUIRatingConfig {
    max?: number;
    allowHalf?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIRatingData {
    value?: number;
    label?: string;
}

export class XWUIRating extends XWUIComponent<XWUIRatingData, XWUIRatingConfig> {
    private ratingElement: HTMLElement | null = null;
    private stars: HTMLElement[] = [];
    private changeHandlers: Array<(value: number) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIRatingData = {},
        conf_comp: XWUIRatingConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.value = this.data.value ?? 0;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIRatingConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIRatingConfig {
        return {
            max: conf_comp?.max ?? 5,
            allowHalf: conf_comp?.allowHalf ?? false,
            readonly: conf_comp?.readonly ?? false,
            disabled: conf_comp?.disabled ?? false,
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-rating-wrapper';

        if (this.data.label) {
            const label = document.createElement('label');
            label.className = 'xwui-rating-label';
            label.textContent = this.data.label;
            wrapper.appendChild(label);
        }

        this.ratingElement = document.createElement('div');
        this.ratingElement.className = 'xwui-rating';
        this.ratingElement.classList.add(`xwui-rating-${this.config.size}`);
        
        if (this.config.readonly || this.config.disabled) {
            this.ratingElement.classList.add('xwui-rating-readonly');
        }
        if (this.config.className) {
            this.ratingElement.classList.add(this.config.className);
        }

        this.ratingElement.setAttribute('role', 'img');
        this.ratingElement.setAttribute('aria-label', `Rating: ${this.data.value} out of ${this.config.max}`);

        this.stars = [];
        for (let i = 1; i <= this.config.max!; i++) {
            const star = document.createElement('span');
            star.className = 'xwui-rating-star';
            star.setAttribute('data-value', String(i));
            
            if (this.config.allowHalf) {
                star.setAttribute('data-half-value', String(i - 0.5));
            }

            // Use XWUIIcon for star
            const starIcon = document.createElement('span');
            starIcon.className = 'xwui-rating-star-icon';
            const { container: starIconContainer } = createIcon(this, 'star', { size: 24 }, this.conf_sys, this.conf_usr);
            starIcon.appendChild(starIconContainer);
            star.appendChild(starIcon);

            if (this.config.allowHalf) {
                const halfStar = document.createElement('span');
                halfStar.className = 'xwui-rating-star-half';
                halfStar.setAttribute('data-value', String(i - 0.5));
                const { container: halfStarContainer } = createIcon(this, 'star', { size: 24 }, this.conf_sys, this.conf_usr);
                halfStar.appendChild(halfStarContainer);
                star.appendChild(halfStar);
            }

            if (!this.config.readonly && !this.config.disabled) {
                star.addEventListener('click', () => {
                    this.setValue(i);
                });

                if (this.config.allowHalf) {
                    star.addEventListener('mousemove', (e) => {
                        const rect = star.getBoundingClientRect();
                        const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                        star.classList.toggle('xwui-rating-star-hover-half', isLeftHalf);
                    });
                }
            }

            this.ratingElement.appendChild(star);
            this.stars.push(star);
        }

        this.updateStars();
        wrapper.appendChild(this.ratingElement);
        this.container.appendChild(wrapper);
    }

    private updateStars(): void {
        const value = this.data.value || 0;
        this.stars.forEach((star, index) => {
            const starValue = index + 1;
            star.classList.remove('xwui-rating-star-full', 'xwui-rating-star-half');
            
            if (starValue <= value) {
                star.classList.add('xwui-rating-star-full');
            } else if (this.config.allowHalf && starValue - 0.5 === value) {
                star.classList.add('xwui-rating-star-half');
            }
        });
    }

    public setValue(value: number): void {
        const max = this.config.max || 5;
        this.data.value = Math.max(0, Math.min(value, max));
        this.updateStars();
        this.changeHandlers.forEach(handler => handler(this.data.value!));
    }

    public getValue(): number {
        return this.data.value || 0;
    }

    public onChange(handler: (value: number) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.ratingElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        this.stars = [];
        if (this.ratingElement) {
            this.ratingElement.remove();
            this.ratingElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIRating as any).componentName = 'XWUIRating';


