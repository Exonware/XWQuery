/**
 * XWUIMenuDrawerSwipeable Component
 * Swipeable drawer component with touch gesture support
 * Extends XWUIMenuDrawer functionality with swipe-to-close gestures
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIMenuDrawer, type XWUIMenuDrawerConfig, type XWUIMenuDrawerData } from '../XWUIMenuDrawer/XWUIMenuDrawer';

// Component-level configuration (extends XWUIMenuDrawerConfig)
export interface XWUIMenuDrawerSwipeableConfig extends XWUIMenuDrawerConfig {
    swipeable?: boolean; // Enable swipe gestures
    swipeThreshold?: number; // Distance in pixels to trigger swipe
    disableSwipeToOpen?: boolean; // Disable swipe-to-open (only swipe-to-close)
    disableDiscovery?: boolean; // Disable swipe discovery (peek) feature
}

// Data type (same as XWUIMenuDrawer)
export interface XWUIMenuDrawerSwipeableData extends XWUIMenuDrawerData {
    // Same as XWUIMenuDrawerData
}

export class XWUIMenuDrawerSwipeable extends XWUIComponent<XWUIMenuDrawerSwipeableData, XWUIMenuDrawerSwipeableConfig> {
    private drawer: XWUIMenuDrawer | null = null;
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchCurrentX: number = 0;
    private touchCurrentY: number = 0;
    private isSwiping: boolean = false;
    private swipeDirection: 'left' | 'right' | 'up' | 'down' | null = null;
    private touchStartHandler: ((e: TouchEvent) => void) | null = null;
    private touchMoveHandler: ((e: TouchEvent) => void) | null = null;
    private touchEndHandler: ((e: TouchEvent) => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMenuDrawerSwipeableData = {},
        conf_comp: XWUIMenuDrawerSwipeableConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupDrawer();
    }

    protected createConfig(
        conf_comp?: XWUIMenuDrawerSwipeableConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMenuDrawerSwipeableConfig {
        return {
            placement: conf_comp?.placement ?? 'right',
            size: conf_comp?.size ?? 'medium',
            closable: conf_comp?.closable ?? true,
            closeOnBackdrop: conf_comp?.closeOnBackdrop ?? true,
            closeOnEscape: conf_comp?.closeOnEscape ?? true,
            mask: conf_comp?.mask ?? true,
            className: conf_comp?.className,
            swipeable: conf_comp?.swipeable ?? true,
            swipeThreshold: conf_comp?.swipeThreshold ?? 50,
            disableSwipeToOpen: conf_comp?.disableSwipeToOpen ?? false,
            disableDiscovery: conf_comp?.disableDiscovery ?? false
        };
    }

    private setupDrawer(): void {
        // Create underlying drawer
        this.drawer = new XWUIMenuDrawer(
            this.container,
            this.data,
            {
                placement: this.config.placement,
                size: this.config.size,
                closable: this.config.closable,
                closeOnBackdrop: this.config.closeOnBackdrop,
                closeOnEscape: this.config.closeOnEscape,
                mask: this.config.mask,
                className: this.config.className
            }
        );

        // Register for cleanup
        this.registerChildComponent(this.drawer);

        // Setup swipe handlers if swipeable
        if (this.config.swipeable) {
            this.setupSwipeHandlers();
        }
    }

    private setupSwipeHandlers(): void {
        const drawerElement = this.drawer?.getElement();
        if (!drawerElement) return;

        // Touch start
        this.touchStartHandler = (e: TouchEvent) => {
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.isSwiping = false;
            this.swipeDirection = null;
        };

        // Touch move
        this.touchMoveHandler = (e: TouchEvent) => {
            if (!this.drawer?.isOpened()) {
                // Swipe to open (if enabled)
                if (!this.config.disableSwipeToOpen && !this.config.disableDiscovery) {
                    this.handleSwipeToOpen(e);
                }
                return;
            }

            // Swipe to close
            const touch = e.touches[0];
            this.touchCurrentX = touch.clientX;
            this.touchCurrentY = touch.clientY;

            const deltaX = this.touchCurrentX - this.touchStartX;
            const deltaY = this.touchCurrentY - this.touchStartY;

            // Determine swipe direction based on drawer placement
            const placement = this.config.placement || 'right';
            let shouldSwipe = false;

            if (placement === 'left' || placement === 'right') {
                // Horizontal swipe
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                    shouldSwipe = true;
                    this.swipeDirection = deltaX > 0 ? 'right' : 'left';
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
                    shouldSwipe = true;
                    this.swipeDirection = deltaY > 0 ? 'down' : 'up';
                }
            }

            if (shouldSwipe) {
                this.isSwiping = true;
                e.preventDefault();
                this.handleSwipeMove(deltaX, deltaY, placement);
            }
        };

        // Touch end
        this.touchEndHandler = (e: TouchEvent) => {
            if (this.isSwiping) {
                const deltaX = this.touchCurrentX - this.touchStartX;
                const deltaY = this.touchCurrentY - this.touchStartY;
                const placement = this.config.placement || 'right';
                const threshold = this.config.swipeThreshold || 50;

                let shouldClose = false;

                if (placement === 'left' || placement === 'right') {
                    // For left drawer: swipe left to close
                    // For right drawer: swipe right to close
                    if (placement === 'left' && deltaX < -threshold) {
                        shouldClose = true;
                    } else if (placement === 'right' && deltaX > threshold) {
                        shouldClose = true;
                    }
                } else {
                    // For top drawer: swipe up to close
                    // For bottom drawer: swipe down to close
                    if (placement === 'top' && deltaY < -threshold) {
                        shouldClose = true;
                    } else if (placement === 'bottom' && deltaY > threshold) {
                        shouldClose = true;
                    }
                }

                if (shouldClose) {
                    this.drawer?.close();
                } else {
                    // Reset position
                    this.resetDrawerPosition();
                }

                this.isSwiping = false;
                this.swipeDirection = null;
            }
        };

        // Add event listeners
        drawerElement.addEventListener('touchstart', this.touchStartHandler, { passive: true });
        drawerElement.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
        drawerElement.addEventListener('touchend', this.touchEndHandler, { passive: true });
    }

    private handleSwipeMove(deltaX: number, deltaY: number, placement: string): void {
        const drawerElement = this.drawer?.getElement();
        if (!drawerElement) return;

        let translateX = 0;
        let translateY = 0;

        if (placement === 'left' || placement === 'right') {
            translateX = deltaX;
        } else {
            translateY = deltaY;
        }

        // Apply transform with resistance
        const resistance = 0.5; // Reduce movement for better feel
        drawerElement.style.transform = `translate(${translateX * resistance}px, ${translateY * resistance}px)`;
        drawerElement.style.transition = 'none';
    }

    private resetDrawerPosition(): void {
        const drawerElement = this.drawer?.getElement();
        if (!drawerElement) return;

        drawerElement.style.transform = '';
        drawerElement.style.transition = '';
    }

    private handleSwipeToOpen(e: TouchEvent): void {
        // Discovery/peek feature - show drawer slightly when swiping from edge
        // This is a simplified implementation
        const touch = e.touches[0];
        const placement = this.config.placement || 'right';
        const edgeThreshold = 20; // Pixels from edge to trigger

        let shouldPeek = false;

        if (placement === 'left' && touch.clientX < edgeThreshold) {
            shouldPeek = true;
        } else if (placement === 'right' && touch.clientX > window.innerWidth - edgeThreshold) {
            shouldPeek = true;
        } else if (placement === 'top' && touch.clientY < edgeThreshold) {
            shouldPeek = true;
        } else if (placement === 'bottom' && touch.clientY > window.innerHeight - edgeThreshold) {
            shouldPeek = true;
        }

        // Peek implementation would go here
        // For now, we'll just track it
    }

    // Public API methods (delegate to underlying drawer)
    public open(): void {
        this.drawer?.open();
    }

    public close(): void {
        this.drawer?.close();
    }

    public setTitle(title: string): void {
        this.data.title = title;
        this.drawer?.setTitle(title);
    }

    public setContent(content: HTMLElement | string): void {
        this.data.content = content;
        this.drawer?.setContent(content);
    }

    public onClose(handler: () => void): void {
        this.drawer?.onClose(handler);
    }

    public isOpened(): boolean {
        return this.drawer?.isOpened() || false;
    }

    public getElement(): HTMLElement | null {
        return this.drawer?.getElement() || null;
    }

    public destroy(): void {
        // 1. Clean up event listeners
        const drawerElement = this.drawer?.getElement();
        if (drawerElement) {
            if (this.touchStartHandler) {
                drawerElement.removeEventListener('touchstart', this.touchStartHandler);
            }
            if (this.touchMoveHandler) {
                drawerElement.removeEventListener('touchmove', this.touchMoveHandler);
            }
            if (this.touchEndHandler) {
                drawerElement.removeEventListener('touchend', this.touchEndHandler);
            }
        }

        // 2. Clear handler references
        this.touchStartHandler = null;
        this.touchMoveHandler = null;
        this.touchEndHandler = null;

        // 3. Call parent cleanup (automatically destroys registered child components)
        super.destroy();

        // 4. Clear local references to registered objects (they're already destroyed by base class)
        this.drawer = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMenuDrawerSwipeable as any).componentName = 'XWUIMenuDrawerSwipeable';


