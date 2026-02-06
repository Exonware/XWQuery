/**
 * XWUIAspectRatio Component
 * Container that maintains a specific aspect ratio
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Common aspect ratios
export type AspectRatioPreset = '1:1' | '4:3' | '16:9' | '21:9' | '3:2' | '2:3' | '9:16';

// Component-level configuration
export interface XWUIAspectRatioConfig {
    ratio?: AspectRatioPreset | number;  // Preset or custom ratio (width/height)
    maxWidth?: string;
    maxHeight?: string;
    className?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

// Data type
export interface XWUIAspectRatioData {
    content?: HTMLElement;
}

// Ratio presets as decimal values
const RATIO_PRESETS: Record<AspectRatioPreset, number> = {
    '1:1': 1,
    '4:3': 4 / 3,
    '16:9': 16 / 9,
    '21:9': 21 / 9,
    '3:2': 3 / 2,
    '2:3': 2 / 3,
    '9:16': 9 / 16
};

export class XWUIAspectRatio extends XWUIComponent<XWUIAspectRatioData, XWUIAspectRatioConfig> {
    private wrapperElement: HTMLElement | null = null;
    private contentElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIAspectRatioData = {},
        conf_comp: XWUIAspectRatioConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAspectRatioConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAspectRatioConfig {
        return {
            ratio: conf_comp?.ratio ?? '16:9',
            maxWidth: conf_comp?.maxWidth,
            maxHeight: conf_comp?.maxHeight,
            className: conf_comp?.className,
            objectFit: conf_comp?.objectFit ?? 'cover'
        };
    }

    private getRatioValue(): number {
        const { ratio } = this.config;
        if (typeof ratio === 'number') {
            return ratio;
        }
        return RATIO_PRESETS[ratio as AspectRatioPreset] || RATIO_PRESETS['16:9'];
    }

    private render(): void {
        this.container.innerHTML = '';

        const ratioValue = this.getRatioValue();
        const paddingBottom = (1 / ratioValue) * 100;

        // Create wrapper with padding trick for aspect ratio
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-aspect-ratio';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        this.wrapperElement.style.position = 'relative';
        this.wrapperElement.style.width = '100%';
        this.wrapperElement.style.paddingBottom = `${paddingBottom}%`;
        
        if (this.config.maxWidth) {
            this.wrapperElement.style.maxWidth = this.config.maxWidth;
        }
        if (this.config.maxHeight) {
            this.wrapperElement.style.maxHeight = this.config.maxHeight;
        }

        // Create content container
        this.contentElement = document.createElement('div');
        this.contentElement.className = 'xwui-aspect-ratio-content';
        this.contentElement.style.position = 'absolute';
        this.contentElement.style.top = '0';
        this.contentElement.style.left = '0';
        this.contentElement.style.width = '100%';
        this.contentElement.style.height = '100%';
        this.contentElement.style.overflow = 'hidden';

        // Add content if provided
        if (this.data.content) {
            this.contentElement.appendChild(this.data.content);
            
            // Apply object-fit to images and videos
            const media = this.data.content;
            if (media.tagName === 'IMG' || media.tagName === 'VIDEO') {
                (media as HTMLImageElement | HTMLVideoElement).style.width = '100%';
                (media as HTMLImageElement | HTMLVideoElement).style.height = '100%';
                (media as HTMLImageElement | HTMLVideoElement).style.objectFit = this.config.objectFit || 'cover';
            }
        }

        this.wrapperElement.appendChild(this.contentElement);
        this.container.appendChild(this.wrapperElement);
    }

    public setRatio(ratio: AspectRatioPreset | number): void {
        this.config.ratio = ratio;
        this.render();
    }

    public setContent(content: HTMLElement): void {
        this.data.content = content;
        if (this.contentElement) {
            this.contentElement.innerHTML = '';
            this.contentElement.appendChild(content);
            
            // Apply object-fit to images and videos
            if (content.tagName === 'IMG' || content.tagName === 'VIDEO') {
                (content as HTMLImageElement | HTMLVideoElement).style.width = '100%';
                (content as HTMLImageElement | HTMLVideoElement).style.height = '100%';
                (content as HTMLImageElement | HTMLVideoElement).style.objectFit = this.config.objectFit || 'cover';
            }
        }
    }

    public getContentElement(): HTMLElement | null {
        return this.contentElement;
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
            this.contentElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAspectRatio as any).componentName = 'XWUIAspectRatio';


