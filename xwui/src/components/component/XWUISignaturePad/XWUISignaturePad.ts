/**
 * XWUISignaturePad Component
 * Canvas-based signature pad for drawing signatures
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';

// Component-level configuration
export interface XWUISignaturePadConfig {
    penColor?: string;
    penWidth?: number;
    backgroundColor?: string;
    showClearButton?: boolean;
    showSaveButton?: boolean;
    className?: string;
}

// Data type
export interface XWUISignaturePadData {
    imageData?: string; // Base64 image data
}

export class XWUISignaturePad extends XWUIComponent<XWUISignaturePadData, XWUISignaturePadConfig> {
    private wrapperElement: HTMLElement | null = null;
    private canvasElement: HTMLCanvasElement | null = null;
    private canvasContext: CanvasRenderingContext2D | null = null;
    private isDrawing: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;
    private clearButton: XWUIButton | null = null;
    private saveButton: XWUIButton | null = null;
    private changeHandlers: Array<(imageData: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUISignaturePadData = {},
        conf_comp: XWUISignaturePadConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISignaturePadConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISignaturePadConfig {
        return {
            penColor: conf_comp?.penColor ?? '#000000',
            penWidth: conf_comp?.penWidth ?? 2,
            backgroundColor: conf_comp?.backgroundColor ?? '#ffffff',
            showClearButton: conf_comp?.showClearButton ?? true,
            showSaveButton: conf_comp?.showSaveButton ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-signature-pad-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-signature-pad';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Canvas
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.className = 'xwui-signature-pad-canvas';
        this.canvasElement.width = 800;
        this.canvasElement.height = 300;
        this.canvasContext = this.canvasElement.getContext('2d');
        
        if (this.canvasContext) {
            this.canvasContext.fillStyle = this.config.backgroundColor || '#ffffff';
            this.canvasContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            this.canvasContext.strokeStyle = this.config.penColor || '#000000';
            this.canvasContext.lineWidth = this.config.penWidth || 2;
            this.canvasContext.lineCap = 'round';
            this.canvasContext.lineJoin = 'round';
        }

        // Load existing image if provided
        if (this.data.imageData) {
            this.loadImage(this.data.imageData);
        }

        this.setupCanvasEvents();
        this.wrapperElement.appendChild(this.canvasElement);

        // Controls
        const controls = document.createElement('div');
        controls.className = 'xwui-signature-pad-controls';

        if (this.config.showClearButton) {
            this.clearButton = new XWUIButton(
                controls,
                { text: 'Clear' },
                { variant: 'secondary', size: 'small' }
            );
            this.registerChildComponent(this.clearButton);
            this.clearButton.onClick(() => this.clear());
        }

        if (this.config.showSaveButton) {
            this.saveButton = new XWUIButton(
                controls,
                { text: 'Save' },
                { variant: 'primary', size: 'small' }
            );
            this.registerChildComponent(this.saveButton);
            this.saveButton.onClick(() => this.save());
        }

        this.wrapperElement.appendChild(controls);
        this.container.appendChild(this.wrapperElement);
    }

    private setupCanvasEvents(): void {
        if (!this.canvasElement || !this.canvasContext) return;

        // Mouse events
        this.canvasElement.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvasElement.addEventListener('mousemove', (e) => this.draw(e));
        this.canvasElement.addEventListener('mouseup', () => this.stopDrawing());
        this.canvasElement.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events
        this.canvasElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvasElement?.dispatchEvent(mouseEvent);
        });

        this.canvasElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvasElement?.dispatchEvent(mouseEvent);
        });

        this.canvasElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }

    private startDrawing(e: MouseEvent): void {
        if (!this.canvasElement || !this.canvasContext) return;
        this.isDrawing = true;
        const rect = this.canvasElement.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    private draw(e: MouseEvent): void {
        if (!this.isDrawing || !this.canvasElement || !this.canvasContext) return;

        const rect = this.canvasElement.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.lastX, this.lastY);
        this.canvasContext.lineTo(currentX, currentY);
        this.canvasContext.stroke();

        this.lastX = currentX;
        this.lastY = currentY;
    }

    private stopDrawing(): void {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.updateImageData();
        }
    }

    private updateImageData(): void {
        if (!this.canvasElement) return;
        const imageData = this.canvasElement.toDataURL('image/png');
        this.data.imageData = imageData;
        this.changeHandlers.forEach(handler => handler(imageData));
    }

    private loadImage(imageData: string): void {
        if (!this.canvasElement || !this.canvasContext) return;
        const img = new Image();
        img.onload = () => {
            this.canvasContext!.drawImage(img, 0, 0);
        };
        img.src = imageData;
    }

    public clear(): void {
        if (!this.canvasElement || !this.canvasContext) return;
        this.canvasContext.fillStyle = this.config.backgroundColor || '#ffffff';
        this.canvasContext.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.data.imageData = undefined;
        this.changeHandlers.forEach(handler => handler(''));
    }

    public save(): string {
        if (!this.canvasElement) return '';
        const imageData = this.canvasElement.toDataURL('image/png');
        this.data.imageData = imageData;
        return imageData;
    }

    public getImageData(): string | undefined {
        return this.data.imageData;
    }

    public setImageData(imageData: string): void {
        this.data.imageData = imageData;
        if (this.canvasElement) {
            this.loadImage(imageData);
        }
    }

    public exportAsPNG(): string {
        if (!this.canvasElement) return '';
        return this.canvasElement.toDataURL('image/png');
    }

    public exportAsSVG(): string {
        // Simple SVG export - in a real implementation, would track paths
        if (!this.canvasElement) return '';
        const width = this.canvasElement.width;
        const height = this.canvasElement.height;
        const imageData = this.canvasElement.toDataURL('image/png');
        return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><image href="${imageData}" width="${width}" height="${height}"/></svg>`;
    }

    public onChange(handler: (imageData: string) => void): void {
        this.changeHandlers.push(handler);
    }

    public setPenColor(color: string): void {
        this.config.penColor = color;
        if (this.canvasContext) {
            this.canvasContext.strokeStyle = color;
        }
    }

    public setPenWidth(width: number): void {
        this.config.penWidth = width;
        if (this.canvasContext) {
            this.canvasContext.lineWidth = width;
        }
    }

    public destroy(): void {
        // Child components (clearButton, saveButton) are automatically destroyed by base class
        // Clean up event listeners
        if (this.canvasElement) {
            this.canvasElement.replaceWith(this.canvasElement.cloneNode(true));
        }
        // Clear references
        this.clearButton = null;
        this.saveButton = null;
        this.canvasElement = null;
        this.canvasContext = null;
        this.wrapperElement = null;
        this.changeHandlers = [];
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISignaturePad as any).componentName = 'XWUISignaturePad';


