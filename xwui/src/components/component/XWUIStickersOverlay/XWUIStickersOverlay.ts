/**
 * XWUIStickersOverlay Component
 * Sticker picker and overlay for adding stickers to canvas
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIPopover } from '../XWUIPopover/XWUIPopover';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIScrollArea } from '../XWUIScrollArea/XWUIScrollArea';

export interface Sticker {
    id: string;
    url: string;
    category?: string;
    name?: string;
}

export interface StickerOverlay {
    id: string;
    sticker: Sticker;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    zIndex?: number;
}

// Component-level configuration
export interface XWUIStickersOverlayConfig {
    stickerLibrary?: Sticker[];
    categories?: string[];
    showCategories?: boolean;
    triggerElement?: HTMLElement | string;
    className?: string;
}

// Data type
export interface XWUIStickersOverlayData {
    overlays?: StickerOverlay[];
    canvasElement?: HTMLElement | string;
}

export class XWUIStickersOverlay extends XWUIComponent<XWUIStickersOverlayData, XWUIStickersOverlayConfig> {
    private wrapperElement: HTMLElement | null = null;
    private popover: XWUIPopover | null = null;
    private canvasElement: HTMLElement | null = null;
    private overlaysMap: Map<string, StickerOverlay> = new Map();
    private selectedOverlay: string | null = null;
    private changeHandlers: Array<(overlays: StickerOverlay[]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIStickersOverlayData = {},
        conf_comp: XWUIStickersOverlayConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeOverlays();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIStickersOverlayConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIStickersOverlayConfig {
        return {
            stickerLibrary: conf_comp?.stickerLibrary ?? [],
            categories: conf_comp?.categories ?? [],
            showCategories: conf_comp?.showCategories ?? true,
            triggerElement: conf_comp?.triggerElement,
            className: conf_comp?.className
        };
    }

    private initializeOverlays(): void {
        if (this.data.overlays) {
            this.data.overlays.forEach(overlay => {
                this.overlaysMap.set(overlay.id, overlay);
            });
        }
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-stickers-overlay-container';

        // Get canvas element
        if (this.data.canvasElement) {
            if (typeof this.data.canvasElement === 'string') {
                this.canvasElement = document.querySelector(this.data.canvasElement);
            } else {
                this.canvasElement = this.data.canvasElement;
            }
        } else {
            this.canvasElement = this.container;
        }

        if (!this.canvasElement) {
            console.error('Canvas element not found');
            return;
        }

        // Render existing overlays
        this.renderOverlays();

        // Create sticker picker popover
        this.createStickerPicker();
    }

    private renderOverlays(): void {
        if (!this.canvasElement) return;

        // Remove existing overlay elements
        const existing = this.canvasElement.querySelectorAll('.xwui-sticker-overlay');
        existing.forEach(el => el.remove());

        this.overlaysMap.forEach(overlay => {
            const element = this.createOverlayElement(overlay);
            this.canvasElement!.appendChild(element);
        });
    }

    private createOverlayElement(overlay: StickerOverlay): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-sticker-overlay';
        wrapper.setAttribute('data-overlay-id', overlay.id);
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${overlay.x}px`;
        wrapper.style.top = `${overlay.y}px`;
        wrapper.style.width = `${overlay.width}px`;
        wrapper.style.height = `${overlay.height}px`;
        wrapper.style.zIndex = overlay.zIndex?.toString() || '10';
        if (overlay.rotation) {
            wrapper.style.transform = `rotate(${overlay.rotation}deg)`;
        }

        if (this.selectedOverlay === overlay.id) {
            wrapper.classList.add('selected');
        }

        const img = document.createElement('img');
        img.src = overlay.sticker.url;
        img.alt = overlay.sticker.name || 'Sticker';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        wrapper.appendChild(img);

        // Drag handlers
        wrapper.addEventListener('mousedown', (e) => {
            this.startDrag(overlay.id, e);
        });

        // Click to select
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectOverlay(overlay.id);
        });

        // Double-click to remove
        wrapper.addEventListener('dblclick', () => {
            this.removeOverlay(overlay.id);
        });

        return wrapper;
    }

    private startDrag(overlayId: string, e: MouseEvent): void {
        const overlay = this.overlaysMap.get(overlayId);
        if (!overlay) return;

        this.selectedOverlay = overlayId;
        const startX = e.clientX - overlay.x;
        const startY = e.clientY - overlay.y;

        const onMouseMove = (e: MouseEvent) => {
            overlay.x = e.clientX - startX;
            overlay.y = e.clientY - startY;
            this.overlaysMap.set(overlayId, overlay);
            this.renderOverlays();
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.triggerChange();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    private createStickerPicker(): void {
        const pickerContent = document.createElement('div');
        pickerContent.className = 'xwui-stickers-picker';

        if (this.config.showCategories && this.config.categories && this.config.categories.length > 0) {
            const categories = document.createElement('div');
            categories.className = 'xwui-stickers-categories';
            this.config.categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = 'xwui-stickers-category-btn';
                btn.textContent = category;
                btn.onclick = () => this.filterByCategory(category);
                categories.appendChild(btn);
            });
            pickerContent.appendChild(categories);
        }

        const stickersGrid = document.createElement('div');
        stickersGrid.className = 'xwui-stickers-grid';

        this.config.stickerLibrary?.forEach(sticker => {
            const stickerBtn = document.createElement('button');
            stickerBtn.className = 'xwui-sticker-item';
            const img = document.createElement('img');
            img.src = sticker.url;
            img.alt = sticker.name || sticker.id;
            stickerBtn.appendChild(img);
            stickerBtn.onclick = () => {
                this.addSticker(sticker);
                this.popover?.close();
            };
            stickersGrid.appendChild(stickerBtn);
        });

        pickerContent.appendChild(stickersGrid);

        const triggerEl = this.config.triggerElement || this.container;
        this.popover = new XWUIPopover(
            document.body,
            {
                content: pickerContent,
                triggerElement: triggerEl as HTMLElement
            },
            {
                trigger: 'click',
                placement: 'top'
            }
        );
        this.registerChildComponent(this.popover);
    }

    private filterByCategory(category: string): void {
        // Filter stickers by category
        // Implementation would filter the sticker grid
    }

    private addSticker(sticker: Sticker): void {
        const overlay: StickerOverlay = {
            id: `sticker-${Date.now()}`,
            sticker,
            x: 100,
            y: 100,
            width: 100,
            height: 100
        };
        this.overlaysMap.set(overlay.id, overlay);
        this.renderOverlays();
        this.triggerChange();
    }

    private removeOverlay(overlayId: string): void {
        this.overlaysMap.delete(overlayId);
        this.renderOverlays();
        this.triggerChange();
    }

    private selectOverlay(overlayId: string): void {
        this.selectedOverlay = overlayId;
        this.renderOverlays();
    }

    private triggerChange(): void {
        const overlays = Array.from(this.overlaysMap.values());
        this.changeHandlers.forEach(handler => handler(overlays));
    }

    public onChange(handler: (overlays: StickerOverlay[]) => void): void {
        this.changeHandlers.push(handler);
    }

    public getOverlays(): StickerOverlay[] {
        return Array.from(this.overlaysMap.values());
    }

    public setOverlays(overlays: StickerOverlay[]): void {
        this.overlaysMap.clear();
        overlays.forEach(overlay => {
            this.overlaysMap.set(overlay.id, overlay);
        });
        this.renderOverlays();
    }

    public destroy(): void {
        // Child component (popover) is automatically destroyed by base class
        this.overlaysMap.clear();
        this.changeHandlers = [];
        this.popover = null;
        this.container.innerHTML = '';
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIStickersOverlay as any).componentName = 'XWUIStickersOverlay';


