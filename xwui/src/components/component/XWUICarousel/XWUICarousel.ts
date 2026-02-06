/**
 * XWUICarousel Component
 * Image/content carousel with auto-play and navigation
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUICarouselItem {
    id: string;
    content: HTMLElement | string;
    title?: string;
    description?: string;
}

// Component-level configuration
export interface XWUICarouselConfig {
    autoplay?: boolean;
    interval?: number; // milliseconds
    showIndicators?: boolean;
    showArrows?: boolean;
    loop?: boolean;
    className?: string;
}

// Data type
export interface XWUICarouselData {
    items: XWUICarouselItem[];
}

export class XWUICarousel extends XWUIComponent<XWUICarouselData, XWUICarouselConfig> {
    private carouselElement: HTMLElement | null = null;
    private trackElement: HTMLElement | null = null;
    private currentIndex: number = 0;
    private autoplayInterval: ReturnType<typeof setInterval> | null = null;
    private isTransitioning: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUICarouselData,
        conf_comp: XWUICarouselConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICarouselConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICarouselConfig {
        return {
            autoplay: conf_comp?.autoplay ?? false,
            interval: conf_comp?.interval ?? 3000,
            showIndicators: conf_comp?.showIndicators ?? true,
            showArrows: conf_comp?.showArrows ?? true,
            loop: conf_comp?.loop ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.carouselElement = document.createElement('div');
        this.carouselElement.className = 'xwui-carousel';
        
        if (this.config.className) {
            this.carouselElement.classList.add(this.config.className);
        }

        // Track
        this.trackElement = document.createElement('div');
        this.trackElement.className = 'xwui-carousel-track';

        this.data.items.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'xwui-carousel-slide';
            if (index === 0) {
                slide.classList.add('xwui-carousel-slide-active');
            }

            if (typeof item.content === 'string') {
                slide.innerHTML = item.content;
            } else {
                slide.appendChild(item.content);
            }

            this.trackElement.appendChild(slide);
        });

        this.carouselElement.appendChild(this.trackElement);

        // Arrows
        if (this.config.showArrows && this.data.items.length > 1) {
            const prevArrow = document.createElement('button');
            prevArrow.className = 'xwui-carousel-arrow xwui-carousel-arrow-prev';
            prevArrow.innerHTML = '‹';
            prevArrow.addEventListener('click', () => this.prev());
            this.carouselElement.appendChild(prevArrow);

            const nextArrow = document.createElement('button');
            nextArrow.className = 'xwui-carousel-arrow xwui-carousel-arrow-next';
            nextArrow.innerHTML = '›';
            nextArrow.addEventListener('click', () => this.next());
            this.carouselElement.appendChild(nextArrow);
        }

        // Indicators
        if (this.config.showIndicators && this.data.items.length > 1) {
            const indicators = document.createElement('div');
            indicators.className = 'xwui-carousel-indicators';

            this.data.items.forEach((item, index) => {
                const indicator = document.createElement('button');
                indicator.className = 'xwui-carousel-indicator';
                if (index === 0) {
                    indicator.classList.add('xwui-carousel-indicator-active');
                }
                indicator.addEventListener('click', () => this.goTo(index));
                indicators.appendChild(indicator);
            });

            this.carouselElement.appendChild(indicators);
        }

        // Auto-play
        if (this.config.autoplay) {
            this.startAutoplay();
        }

        // Pause on hover
        this.carouselElement.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carouselElement.addEventListener('mouseleave', () => {
            if (this.config.autoplay) {
                this.startAutoplay();
            }
        });

        this.container.appendChild(this.carouselElement);
    }

    private goTo(index: number): void {
        if (this.isTransitioning) return;

        const slides = this.trackElement?.querySelectorAll('.xwui-carousel-slide');
        const indicators = this.carouselElement?.querySelectorAll('.xwui-carousel-indicator');
        
        if (!slides || slides.length === 0) return;

        const prevIndex = this.currentIndex;
        this.currentIndex = index;

        // Update slides
        slides[prevIndex]?.classList.remove('xwui-carousel-slide-active');
        slides[this.currentIndex]?.classList.add('xwui-carousel-slide-active');

        // Update indicators
        if (indicators) {
            indicators[prevIndex]?.classList.remove('xwui-carousel-indicator-active');
            indicators[this.currentIndex]?.classList.add('xwui-carousel-indicator-active');
        }

        // Update track position
        if (this.trackElement) {
            this.trackElement.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }

        this.isTransitioning = true;
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    public next(): void {
        if (this.currentIndex < this.data.items.length - 1) {
            this.goTo(this.currentIndex + 1);
        } else if (this.config.loop) {
            this.goTo(0);
        }
    }

    public prev(): void {
        if (this.currentIndex > 0) {
            this.goTo(this.currentIndex - 1);
        } else if (this.config.loop) {
            this.goTo(this.data.items.length - 1);
        }
    }

    private startAutoplay(): void {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.config.interval);
    }

    private stopAutoplay(): void {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    public getElement(): HTMLElement | null {
        return this.carouselElement;
    }

    public destroy(): void {
        this.stopAutoplay();
        if (this.carouselElement) {
            this.carouselElement.remove();
            this.carouselElement = null;
        }
        this.trackElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICarousel as any).componentName = 'XWUICarousel';


