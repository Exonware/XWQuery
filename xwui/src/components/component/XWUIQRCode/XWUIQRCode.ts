/**
 * XWUIQRCode Component
 * QR code display
 * Simplified version using canvas
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIQRCodeConfig {
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    color?: string;
    bgColor?: string;
    icon?: string;
    iconSize?: number;
    className?: string;
}

export interface XWUIQRCodeData {
    value?: string;
}

export class XWUIQRCode extends XWUIComponent<XWUIQRCodeData, XWUIQRCodeConfig> {
    private canvasElement: HTMLCanvasElement | null = null;
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIQRCodeData = {},
        conf_comp: XWUIQRCodeConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIQRCodeConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIQRCodeConfig {
        return {
            size: conf_comp?.size ?? 200,
            level: conf_comp?.level ?? 'M',
            color: conf_comp?.color ?? '#000000',
            bgColor: conf_comp?.bgColor ?? '#FFFFFF',
            icon: conf_comp?.icon,
            iconSize: conf_comp?.iconSize ?? 40,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-qrcode-container';

        if (!this.data.value) {
            return;
        }

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-qrcode';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Create canvas
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.width = this.config.size || 200;
        this.canvasElement.height = this.config.size || 200;
        this.wrapperElement.appendChild(this.canvasElement);

        this.container.appendChild(this.wrapperElement);

        // Generate QR code
        this.generateQRCode();
    }

    private generateQRCode(): void {
        if (!this.canvasElement || !this.data.value) return;

        const ctx = this.canvasElement.getContext('2d');
        if (!ctx) return;

        const size = this.config.size || 200;
        const value = this.data.value;
        
        // Simple QR code generation using a basic pattern
        // Note: This is a simplified implementation. For production, use a proper QR code library
        const moduleSize = 10;
        const modules = Math.floor(size / moduleSize);
        
        // Fill background
        ctx.fillStyle = this.config.bgColor || '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        
        // Generate simple pattern (placeholder - should use actual QR code algorithm)
        ctx.fillStyle = this.config.color || '#000000';
        
        // Draw a simple pattern based on the input value
        const hash = this.simpleHash(value);
        for (let i = 0; i < modules; i++) {
            for (let j = 0; j < modules; j++) {
                const bit = (hash + i * modules + j) % 3 === 0;
                if (bit) {
                    ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
                }
            }
        }

        // Draw icon in center if provided
        if (this.config.icon) {
            this.drawIcon(ctx);
        }
    }

    private simpleHash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    private drawIcon(ctx: CanvasRenderingContext2D): void {
        if (!this.config.icon) return;

        const size = this.config.size || 200;
        const iconSize = this.config.iconSize || 40;
        const centerX = size / 2;
        const centerY = size / 2;

        // Draw white background for icon
        ctx.fillStyle = this.config.bgColor || '#FFFFFF';
        ctx.fillRect(centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);

        // Draw icon (simplified - would need to load image in real implementation)
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            if (!ctx) return;
            ctx.drawImage(img, centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
        };
        img.src = this.config.icon;
    }

    public getDataURL(): string {
        if (!this.canvasElement) return '';
        return this.canvasElement.toDataURL();
    }

    public download(filename: string = 'qrcode.png'): void {
        if (!this.canvasElement) return;
        
        const dataURL = this.canvasElement.toDataURL();
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
    }

    public destroy(): void {
        if (this.canvasElement) {
            this.canvasElement = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIQRCode as any).componentName = 'XWUIQRCode';


