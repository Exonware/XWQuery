/**
 * XWUIGalleryViewer Component
 * Image gallery viewer with grid layout, lightbox, and navigation
 * Reuses: XWUIGrid, XWUICard, XWUIDialog, XWUICarousel, XWUIButton, XWUIPagination
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIGrid } from '../XWUIGrid/XWUIGrid';
import { XWUICard } from '../XWUICard/XWUICard';
import { XWUIAspectRatio } from '../XWUIAspectRatio/XWUIAspectRatio';

export interface XWUIGalleryImage {
    id: string;
    src: string;
    thumbnail?: string;
    alt?: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
}

// Component-level configuration
export interface XWUIGalleryViewerConfig {
    layout?: 'grid' | 'carousel' | 'masonry';
    columns?: number;
    gap?: string;
    thumbnailSize?: 'small' | 'medium' | 'large';
    showLightbox?: boolean;
    showPagination?: boolean;
    itemsPerPage?: number;
    aspectRatio?: '1:1' | '4:3' | '16:9' | 'auto';
    className?: string;
}

// Data type
export interface XWUIGalleryViewerData {
    images: XWUIGalleryImage[];
}

export class XWUIGalleryViewer extends XWUIComponent<XWUIGalleryViewerData, XWUIGalleryViewerConfig> {
    private galleryElement: HTMLElement | null = null;
    private gridComponent: XWUIGrid | null = null;
    private lightboxDialog: any = null;
    private currentPage: number = 1;
    private lightboxIndex: number = 0;
    private aspectRatioInstances: XWUIAspectRatio[] = [];

    constructor(
        container: HTMLElement,
        data: XWUIGalleryViewerData,
        conf_comp: XWUIGalleryViewerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.images = this.data.images || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIGalleryViewerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIGalleryViewerConfig {
        return {
            layout: conf_comp?.layout ?? 'grid',
            columns: conf_comp?.columns ?? 4,
            gap: conf_comp?.gap ?? '1rem',
            thumbnailSize: conf_comp?.thumbnailSize ?? 'medium',
            showLightbox: conf_comp?.showLightbox ?? true,
            showPagination: conf_comp?.showPagination ?? false,
            itemsPerPage: conf_comp?.itemsPerPage ?? 20,
            aspectRatio: conf_comp?.aspectRatio ?? 'auto',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.galleryElement = document.createElement('div');
        this.galleryElement.className = 'xwui-gallery-viewer';
        
        if (this.config.className) {
            this.galleryElement.classList.add(this.config.className);
        }

        if (this.data.images.length === 0) {
            this.renderEmpty();
            this.container.appendChild(this.galleryElement);
            return;
        }

        // Render based on layout
        if (this.config.layout === 'carousel') {
            this.renderCarousel();
        } else {
            this.renderGrid();
        }

        this.container.appendChild(this.galleryElement);
    }

    private renderEmpty(): void {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'xwui-gallery-empty';
        emptyMessage.textContent = 'No images to display';
        this.galleryElement!.appendChild(emptyMessage);
    }

    private renderGrid(): void {
        const paginatedImages = this.getPaginatedImages();
        
        // Create grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'xwui-gallery-grid-container';

        // Create grid using XWUIGrid
        this.gridComponent = new XWUIGrid(gridContainer, {}, {
            columns: this.config.columns,
            gap: this.config.gap,
            className: 'xwui-gallery-grid'
        }, this.conf_sys, this.conf_usr);
        this.registerChildComponent(this.gridComponent);

        // Add image cards
        paginatedImages.forEach((image, index) => {
            const cardContainer = document.createElement('div');
            const card = this.createImageCard(image, index);
            cardContainer.appendChild(card);
            gridContainer.appendChild(cardContainer);
        });

        this.galleryElement!.appendChild(gridContainer);

        // Add pagination if enabled
        if (this.config.showPagination && this.getTotalPages() > 1) {
            this.renderPagination();
        }
    }

    private createImageCard(image: XWUIGalleryImage, index: number): HTMLElement {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'xwui-gallery-card-wrapper';

        // Use AspectRatio if specified
        if (this.config.aspectRatio !== 'auto') {
            const aspectContainer = document.createElement('div');
            const img = document.createElement('img');
            img.src = image.thumbnail || image.src;
            img.alt = image.alt || image.title || '';
            
            const aspectRatio = new XWUIAspectRatio(aspectContainer, {
                content: img
            }, {
                ratio: this.config.aspectRatio as any,
                objectFit: 'cover'
            }, this.conf_sys, this.conf_usr);
            this.aspectRatioInstances.push(aspectRatio);
            this.registerChildComponent(aspectRatio);
            
            cardContainer.appendChild(aspectContainer);
        } else {
            const img = document.createElement('img');
            img.src = image.thumbnail || image.src;
            img.alt = image.alt || image.title || '';
            img.className = 'xwui-gallery-thumbnail';
            cardContainer.appendChild(img);
        }

        // Make clickable if lightbox enabled
        if (this.config.showLightbox) {
            cardContainer.style.cursor = 'pointer';
            cardContainer.addEventListener('click', () => {
                this.openLightbox(index);
            });
        }

        return cardContainer;
    }

    private renderCarousel(): void {
        // Use XWUICarousel for carousel layout
        import('../XWUICarousel/index').then(({ XWUICarousel }) => {
            const carouselContainer = document.createElement('div');
            const items = this.data.images.map(image => ({
                id: image.id,
                content: this.createImageContent(image),
                title: image.title,
                description: image.description
            }));

            const carousel = new XWUICarousel(carouselContainer, {
                items
            }, {
                autoplay: false,
                showIndicators: true,
                showArrows: true,
                loop: true
            }, this.conf_sys, this.conf_usr);

            this.galleryElement!.appendChild(carouselContainer);
        });
    }

    private createImageContent(image: XWUIGalleryImage): HTMLElement {
        const container = document.createElement('div');
        container.className = 'xwui-gallery-carousel-item';
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt || image.title || '';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        
        container.appendChild(img);
        return container;
    }

    private renderPagination(): void {
        import('../XWUIPagination/index').then(({ XWUIPagination }) => {
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'xwui-gallery-pagination';

            const pagination = new XWUIPagination(paginationContainer, {
                current: this.currentPage,
                total: this.data.images.length,
                pageSize: this.config.itemsPerPage
            }, {
                size: 'medium',
                showTotal: true
            }, this.conf_sys, this.conf_usr);

            pagination.onChange((page: number) => {
                this.currentPage = page;
                this.render();
            });

            this.galleryElement!.appendChild(paginationContainer);
        });
    }

    private async openLightbox(index: number): Promise<void> {
        this.lightboxIndex = index;
        
        const { XWUIDialog } = await import('../XWUIDialog/index');
        const { XWUIButton } = await import('../XWUIButton/index');

        const dialogContainer = document.createElement('div');
        document.body.appendChild(dialogContainer);

        // Create lightbox content
        const content = document.createElement('div');
        content.className = 'xwui-gallery-lightbox';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'xwui-gallery-lightbox-image-container';
        
        const img = document.createElement('img');
        img.src = this.data.images[index].src;
        img.alt = this.data.images[index].alt || this.data.images[index].title || '';
        img.className = 'xwui-gallery-lightbox-image';
        imageContainer.appendChild(img);

        // Navigation buttons
        const navContainer = document.createElement('div');
        navContainer.className = 'xwui-gallery-lightbox-nav';

        const prevBtnContainer = document.createElement('div');
        const prevBtn = new XWUIButton(prevBtnContainer, '', {
            variant: 'ghost',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>'
        });
        
        const nextBtnContainer = document.createElement('div');
        const nextBtn = new XWUIButton(nextBtnContainer, '', {
            variant: 'ghost',
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>'
        });

        navContainer.appendChild(prevBtnContainer);
        navContainer.appendChild(nextBtnContainer);
        content.appendChild(navContainer);
        content.appendChild(imageContainer);

        // Create dialog
        const dialog = new XWUIDialog(dialogContainer, {
            content: content,
            title: this.data.images[index].title || `${index + 1} / ${this.data.images.length}`
        }, {
            size: 'large',
            closable: true,
            closeOnBackdrop: true,
            closeOnEscape: true
        }, this.conf_sys, this.conf_usr);

        // Navigation handlers
        const navigate = (direction: number) => {
            this.lightboxIndex += direction;
            if (this.lightboxIndex < 0) {
                this.lightboxIndex = this.data.images.length - 1;
            } else if (this.lightboxIndex >= this.data.images.length) {
                this.lightboxIndex = 0;
            }
            img.src = this.data.images[this.lightboxIndex].src;
            img.alt = this.data.images[this.lightboxIndex].alt || this.data.images[this.lightboxIndex].title || '';
            dialog.setData({
                title: this.data.images[this.lightboxIndex].title || `${this.lightboxIndex + 1} / ${this.data.images.length}`
            });
        };

        prevBtn.onClick(() => navigate(-1));
        nextBtn.onClick(() => navigate(1));

        // Keyboard navigation
        const keyboardHandler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                navigate(-1);
            } else if (e.key === 'ArrowRight') {
                navigate(1);
            }
        };
        document.addEventListener('keydown', keyboardHandler);

        dialog.onClose(() => {
            document.removeEventListener('keydown', keyboardHandler);
            dialogContainer.remove();
        });

        dialog.open();
    }

    private navigateLightbox(direction: number): void {
        // This method is kept for compatibility but logic moved to openLightbox
    }

    private getPaginatedImages(): XWUIGalleryImage[] {
        if (!this.config.showPagination) {
            return this.data.images;
        }
        const start = (this.currentPage - 1) * (this.config.itemsPerPage || 20);
        const end = start + (this.config.itemsPerPage || 20);
        return this.data.images.slice(start, end);
    }

    private getTotalPages(): number {
        return Math.ceil(this.data.images.length / (this.config.itemsPerPage || 20));
    }

    public getElement(): HTMLElement | null {
        return this.galleryElement;
    }

    public destroy(): void {
        // All registered child components (gridComponent, aspectRatioInstances) are automatically destroyed by base class
        // Note: carousel, pagination, buttons, and dialog created in async callbacks should be stored and registered
        this.aspectRatioInstances = [];
        this.gridComponent = null;
        this.lightboxDialog = null;
        this.galleryElement = null;
        this.container.innerHTML = '';
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIGalleryViewer as any).componentName = 'XWUIGalleryViewer';


