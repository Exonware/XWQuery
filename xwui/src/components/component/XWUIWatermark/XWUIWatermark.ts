/**
 * XWUIWatermark Component
 * Watermark overlay
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIWatermarkConfig {
    content?: string | string[];
    gap?: [number, number];
    offset?: [number, number];
    rotate?: number;
    zIndex?: number;
    font?: {
        color?: string;
        fontSize?: string;
        fontWeight?: string;
        fontFamily?: string;
    };
    className?: string;
}

export interface XWUIWatermarkData {
    image?: string;
}

export class XWUIWatermark extends XWUIComponent<XWUIWatermarkData, XWUIWatermarkConfig> {
    private canvasElement: HTMLCanvasElement | null = null;
    private watermarkElement: HTMLElement | null = null;
    private imageElement: HTMLImageElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIWatermarkData = {},
        conf_comp: XWUIWatermarkConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIWatermarkConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIWatermarkConfig {
        return {
            content: conf_comp?.content ?? 'Watermark',
            gap: conf_comp?.gap ?? [100, 100],
            offset: conf_comp?.offset ?? [0, 0],
            rotate: conf_comp?.rotate ?? -22,
            zIndex: conf_comp?.zIndex ?? 1000,
            font: {
                color: conf_comp?.font?.color ?? 'rgba(0, 0, 0, 0.15)',
                fontSize: conf_comp?.font?.fontSize ?? '16px',
                fontWeight: conf_comp?.font?.fontWeight ?? 'normal',
                fontFamily: conf_comp?.font?.fontFamily ?? 'sans-serif',
                ...conf_comp?.font
            },
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-watermark-container';
        this.container.style.position = 'relative';

        // Create watermark overlay
        this.watermarkElement = document.createElement('div');
        this.watermarkElement.className = 'xwui-watermark';
        this.watermarkElement.style.position = 'absolute';
        this.watermarkElement.style.top = '0';
        this.watermarkElement.style.left = '0';
        this.watermarkElement.style.width = '100%';
        this.watermarkElement.style.height = '100%';
        this.watermarkElement.style.pointerEvents = 'none';
        this.watermarkElement.style.zIndex = String(this.config.zIndex || 1000);
        this.watermarkElement.style.overflow = 'hidden';
        
        if (this.config.className) {
            this.watermarkElement.classList.add(this.config.className);
        }

        // Generate watermark pattern
        if (this.data.image) {
            this.renderImageWatermark();
        } else {
            this.renderTextWatermark();
        }

        this.container.appendChild(this.watermarkElement);
    }

    private renderTextWatermark(): void {
        if (!this.watermarkElement) return;

        const contents = Array.isArray(this.config.content) ? this.config.content : [this.config.content || 'Watermark'];
        const gap = this.config.gap || [100, 100];
        const offset = this.config.offset || [0, 0];
        const rotate = this.config.rotate || -22;
        
        // Create canvas for watermark pattern
        this.canvasElement = document.createElement('canvas');
        const ctx = this.canvasElement.getContext('2d');
        if (!ctx) return;

        const fontSize = parseInt(this.config.font?.fontSize || '16px');
        const fontFamily = this.config.font?.fontFamily || 'sans-serif';
        const fontWeight = this.config.font?.fontWeight || 'normal';
        const color = this.config.font?.color || 'rgba(0, 0, 0, 0.15)';

        ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Measure text
        const metrics = ctx.measureText(contents[0]);
        const textWidth = metrics.width;
        const textHeight = fontSize;

        // Set canvas size based on gap
        this.canvasElement.width = gap[0] * 2;
        this.canvasElement.height = gap[1] * 2;

        // Draw text rotated
        ctx.save();
        ctx.translate(gap[0] + offset[0], gap[1] + offset[1]);
        ctx.rotate((rotate * Math.PI) / 180);
        
        contents.forEach((text, index) => {
            ctx.fillText(text, 0, index * (textHeight + 4));
        });
        
        ctx.restore();

        // Create repeating background
        const dataURL = this.canvasElement.toDataURL();
        this.watermarkElement.style.backgroundImage = `url(${dataURL})`;
        this.watermarkElement.style.backgroundRepeat = 'repeat';
    }

    private renderImageWatermark(): void {
        if (!this.watermarkElement || !this.data.image) return;

        this.imageElement = new Image();
        this.imageElement.crossOrigin = 'anonymous';
        
        this.imageElement.onload = () => {
            if (!this.watermarkElement || !this.imageElement) return;
            
            // Create repeating image pattern
            this.watermarkElement.style.backgroundImage = `url(${this.data.image})`;
            this.watermarkElement.style.backgroundRepeat = 'repeat';
            this.watermarkElement.style.backgroundSize = 'auto';
            this.watermarkElement.style.opacity = '0.3';
        };
        
        this.imageElement.src = this.data.image;
    }

    public destroy(): void {
        if (this.canvasElement) {
            this.canvasElement = null;
        }
        if (this.imageElement) {
            this.imageElement = null;
        }
        if (this.watermarkElement) {
            this.watermarkElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIWatermark as any).componentName = 'XWUIWatermark';


