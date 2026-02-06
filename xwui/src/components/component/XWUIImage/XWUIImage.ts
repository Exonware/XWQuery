/**
 * XWUIImage Component
 * Enhanced image wrapper with fallbacks, placeholders, and lazy loading
 */

import { XWUIBox, type XWUIBoxConfig, type XWUIBoxData } from '../XWUIBox/XWUIBox';
import { type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration (extends XWUIBoxConfig)
export interface XWUIImageConfig extends XWUIBoxConfig {
    lazy?: boolean;
    placeholder?: string; // URL or data URI for placeholder
    fallback?: string; // URL or data URI for fallback on error
    aspectRatio?: string; // e.g., '16/9', '1/1', '4/3'
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    objectPosition?: string; // e.g., 'center', 'top', 'bottom'
}

// Data type (extends XWUIBoxData)
export interface XWUIImageData extends XWUIBoxData {
    src: string;
    alt?: string;
    loading?: 'lazy' | 'eager';
}

export class XWUIImage extends XWUIBox {
    private imageElement: HTMLImageElement | null = null;
    private wrapperElement: HTMLElement | null = null;
    private placeholderElement: HTMLElement | null = null;
    private isLoaded: boolean = false;
    private hasError: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIImageData,
        conf_comp: XWUIImageConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Call parent constructor with empty content - we'll add image content in render
        super(container, {}, conf_comp, conf_sys, conf_usr);
        // Store image-specific data separately since XWUIBox uses different data structure
        (this as any).imageData = data;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIImageConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIImageConfig {
        // Call parent createConfig first to get XWUIBox config
        const baseConfig = super.createConfig(conf_comp, conf_usr, conf_sys);
        
        // Merge with image-specific config
        return {
            ...baseConfig,
            lazy: conf_comp?.lazy ?? true,
            placeholder: conf_comp?.placeholder,
            fallback: conf_comp?.fallback,
            aspectRatio: conf_comp?.aspectRatio,
            objectFit: conf_comp?.objectFit ?? 'cover',
            objectPosition: conf_comp?.objectPosition ?? 'center',
            // Ensure padding is 0 by default for images (unless explicitly set)
            padding: conf_comp?.padding ?? 0
        };
    }

    protected render(): void {
        // Get image data (stored separately from XWUIBox data)
        const imageData = (this as any).imageData as XWUIImageData | undefined;
        
        // If imageData is not set yet (called from parent constructor), 
        // set up minimal container structure and return early
        // It will be called again after imageData is set in our constructor
        if (!imageData || !imageData.src) {
            this.container.innerHTML = '';
            this.container.className = 'xwui-box-container';
            return;
        }
        
        // Create box element manually (since we override render completely)
        this.container.innerHTML = '';
        this.container.className = 'xwui-box-container';

        // Create box element
        const elementType = this.config.as || 'div';
        const boxElement = document.createElement(elementType);
        boxElement.className = 'xwui-box xwui-image-container';
        
        if (this.config.className) {
            boxElement.classList.add(this.config.className);
        }

        // Add gradient background if enabled
        if (this.config.gradientBackground) {
            boxElement.classList.add('xwui-box-gradient-background');
            boxElement.style.position = 'relative';
            boxElement.style.overflow = 'hidden';
        }
        
        // Apply glass effect if enabled (simplified - full implementation would require XWUIBox's applyGlassEffect method)
        if (this.config.glassEffect && typeof this.config.glassEffect === 'object' && this.config.glassEffect.enabled) {
            boxElement.classList.add('xwui-box-glass-effect');
            const blur = this.config.glassEffect.blur ?? 16;
            const opacity = (this.config.glassEffect.opacity ?? 60) / 100;
            const saturation = this.config.glassEffect.saturation ?? 180;
            const color = this.config.glassEffect.color ?? '#0f172a';
            // Convert hex to RGB (simplified)
            const rgbMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
            const rgb = rgbMatch ? `${parseInt(rgbMatch[1], 16)}, ${parseInt(rgbMatch[2], 16)}, ${parseInt(rgbMatch[3], 16)}` : '15, 23, 42';
            boxElement.style.backdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
            (boxElement.style as any).webkitBackdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
            boxElement.style.backgroundColor = `rgba(${rgb}, ${opacity})`;
            if (!boxElement.style.border) {
                boxElement.style.border = '1px solid rgba(255, 255, 255, 0.125)';
            }
            if (!boxElement.style.borderRadius) {
                boxElement.style.borderRadius = '12px';
            }
        }

        // Apply XWUIBox style props
        if (this.config.padding !== undefined) {
            const padding = typeof this.config.padding === 'number' ? `${this.config.padding}px` : this.config.padding;
            boxElement.style.padding = padding;
        }

        if (this.config.margin !== undefined) {
            const margin = typeof this.config.margin === 'number' ? `${this.config.margin}px` : this.config.margin;
            boxElement.style.margin = margin;
        }

        if (this.config.width !== undefined) {
            const width = typeof this.config.width === 'number' ? `${this.config.width}px` : this.config.width;
            boxElement.style.width = width;
        }

        if (this.config.height !== undefined) {
            const height = typeof this.config.height === 'number' ? `${this.config.height}px` : this.config.height;
            boxElement.style.height = height;
        }

        if (this.config.display) {
            boxElement.style.display = this.config.display;
        }

        // Store box element reference (matching XWUIBox's private boxElement)
        (this as any).boxElement = boxElement;

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-image-wrapper';

        // Apply aspect ratio
        if (this.config.aspectRatio) {
            const [width, height] = this.config.aspectRatio.split('/').map(Number);
            const paddingBottom = `${(height / width) * 100}%`;
            this.wrapperElement.style.paddingBottom = paddingBottom;
            this.wrapperElement.style.position = 'relative';
            this.wrapperElement.style.overflow = 'hidden';
        }

        // Apply dimensions
        if (this.config.width) {
            const width = typeof this.config.width === 'number' ? `${this.config.width}px` : this.config.width;
            this.wrapperElement.style.width = width;
        }
        if (this.config.height && !this.config.aspectRatio) {
            const height = typeof this.config.height === 'number' ? `${this.config.height}px` : this.config.height;
            this.wrapperElement.style.height = height;
        }

        // Show placeholder if provided
        if (this.config.placeholder && !this.isLoaded) {
            this.showPlaceholder();
        }

        // Create image element
        this.imageElement = document.createElement('img');
        this.imageElement.className = 'xwui-image';
        this.imageElement.alt = imageData.alt || '';
        
        // Apply object fit and position
        this.imageElement.style.objectFit = this.config.objectFit || 'cover';
        this.imageElement.style.objectPosition = this.config.objectPosition || 'center';
        
        // Ensure image is visible
        this.imageElement.style.display = 'block';
        this.imageElement.style.maxWidth = '100%';
        this.imageElement.style.height = 'auto';

        // Set loading attribute
        if (this.config.lazy || imageData.loading === 'lazy') {
            this.imageElement.loading = 'lazy';
        } else if (imageData.loading === 'eager') {
            this.imageElement.loading = 'eager';
        }

        // Event handlers
        const loadHandler = () => {
            this.isLoaded = true;
            this.hasError = false;
            if (this.placeholderElement) {
                this.placeholderElement.style.display = 'none';
            }
            this.imageElement?.classList.add('xwui-image-loaded');
        };

        const errorHandler = () => {
            this.hasError = true;
            this.handleError();
        };

        this.imageElement.addEventListener('load', loadHandler);
        this.imageElement.addEventListener('error', errorHandler);

        // Set src - must be set after event handlers are attached
        // Validate src is not empty (browser will handle invalid URLs via error event)
        const src = imageData.src?.trim();
        if (src && src !== '' && src.length > 0) {
            this.imageElement.src = src;
        } else {
            console.warn('XWUIImage: No valid src provided in imageData', imageData);
            // Don't set src if it's empty - this prevents ERR_NAME_NOT_RESOLVED errors
            // The error handler will show the error placeholder
            this.hasError = true;
            this.showErrorPlaceholder();
        }

        // If aspect ratio is set, position image absolutely
        if (this.config.aspectRatio) {
            this.imageElement.style.position = 'absolute';
            this.imageElement.style.top = '0';
            this.imageElement.style.left = '0';
            this.imageElement.style.width = '100%';
            this.imageElement.style.height = '100%';
        }

        this.wrapperElement.appendChild(this.imageElement);
        boxElement.appendChild(this.wrapperElement);
        
        this.container.appendChild(boxElement);
    }

    private showPlaceholder(): void {
        if (this.placeholderElement) {
            this.placeholderElement.remove();
        }

        this.placeholderElement = document.createElement('div');
        this.placeholderElement.className = 'xwui-image-placeholder';

        const placeholder = this.config.placeholder;
        if (placeholder && (placeholder.startsWith('data:') || placeholder.startsWith('http://') || placeholder.startsWith('https://'))) {
            // URL placeholder - validate it's not empty
            if (placeholder.trim() !== '') {
                const placeholderImg = document.createElement('img');
                placeholderImg.src = placeholder;
                placeholderImg.style.width = '100%';
                placeholderImg.style.height = '100%';
                placeholderImg.style.objectFit = 'cover';
                // Add error handler to prevent console errors
                placeholderImg.addEventListener('error', () => {
                    // Silently handle placeholder load errors
                    placeholderImg.style.display = 'none';
                });
                this.placeholderElement.appendChild(placeholderImg);
            } else {
                // Empty placeholder, show text instead
                this.placeholderElement.textContent = 'Loading...';
                this.placeholderElement.style.display = 'flex';
                this.placeholderElement.style.alignItems = 'center';
                this.placeholderElement.style.justifyContent = 'center';
                this.placeholderElement.style.background = 'var(--bg-secondary, #f8f9fa)';
                this.placeholderElement.style.color = 'var(--text-secondary, #6c757d)';
            }
        } else {
            // Text or CSS placeholder
            this.placeholderElement.textContent = this.config.placeholder || 'Loading...';
            this.placeholderElement.style.display = 'flex';
            this.placeholderElement.style.alignItems = 'center';
            this.placeholderElement.style.justifyContent = 'center';
            this.placeholderElement.style.background = 'var(--bg-secondary, #f8f9fa)';
            this.placeholderElement.style.color = 'var(--text-secondary, #6c757d)';
        }

        if (this.config.aspectRatio) {
            this.placeholderElement.style.position = 'absolute';
            this.placeholderElement.style.top = '0';
            this.placeholderElement.style.left = '0';
            this.placeholderElement.style.width = '100%';
            this.placeholderElement.style.height = '100%';
        }

        this.wrapperElement?.appendChild(this.placeholderElement);
    }

    private handleError(): void {
        if (this.config.fallback && this.imageElement && this.config.fallback.trim() !== '') {
            // Try fallback - validate it's not empty
            this.imageElement.src = this.config.fallback;
            this.hasError = false;
        } else {
            // Show error state
            this.imageElement?.classList.add('xwui-image-error');
            if (!this.placeholderElement) {
                this.showErrorPlaceholder();
            }
        }
    }

    private showErrorPlaceholder(): void {
        if (this.placeholderElement) {
            this.placeholderElement.remove();
        }

        this.placeholderElement = document.createElement('div');
        this.placeholderElement.className = 'xwui-image-error-placeholder';
        this.placeholderElement.textContent = 'Image failed to load';
        this.placeholderElement.style.display = 'flex';
        this.placeholderElement.style.alignItems = 'center';
        this.placeholderElement.style.justifyContent = 'center';
        this.placeholderElement.style.background = 'var(--bg-tertiary, #f1f3f5)';
        this.placeholderElement.style.color = 'var(--text-tertiary, #adb5bd)';

        if (this.config.aspectRatio) {
            this.placeholderElement.style.position = 'absolute';
            this.placeholderElement.style.top = '0';
            this.placeholderElement.style.left = '0';
            this.placeholderElement.style.width = '100%';
            this.placeholderElement.style.height = '100%';
        }

        this.wrapperElement?.appendChild(this.placeholderElement);
    }

    /**
     * Set image source
     */
    public setSrc(src: string): void {
        const imageData = (this as any).imageData as XWUIImageData;
        if (!src || src.trim() === '') {
            console.warn('XWUIImage.setSrc: Empty or invalid src provided');
            return;
        }
        imageData.src = src;
        this.isLoaded = false;
        this.hasError = false;
        if (this.imageElement) {
            this.imageElement.src = src;
            this.imageElement.classList.remove('xwui-image-loaded', 'xwui-image-error');
        }
    }

    /**
     * Get image element
     */
    public getImageElement(): HTMLImageElement | null {
        return this.imageElement;
    }

    /**
     * Get the image wrapper element (not the box element)
     */
    public getImageWrapper(): HTMLElement | null {
        return this.wrapperElement;
    }

    /**
     * Get the box element (from XWUIBox parent)
     * Override to return our box element
     */
    public getElement(): HTMLElement | null {
        return (this as any).boxElement || null;
    }
    
    /**
     * Get the box element (alias for getElement for clarity)
     */
    public getBoxElement(): HTMLElement | null {
        return this.getElement();
    }

    public destroy(): void {
        if (this.imageElement) {
            this.imageElement.removeEventListener('load', () => {});
            this.imageElement.removeEventListener('error', () => {});
            this.imageElement = null;
        }
        this.wrapperElement = null;
        this.placeholderElement = null;
        // Call parent destroy
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIImage as any).componentName = 'XWUIImage';


