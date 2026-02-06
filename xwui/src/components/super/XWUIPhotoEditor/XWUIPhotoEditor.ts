/**
 * XWUIPhotoEditor Component
 * Photo/image editor with basic editing tools
 * Reuses: XWUIButton, XWUISlider, XWUIUpload, XWUIDialog
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIPhotoEditorConfig {
    width?: number;
    height?: number;
    allowCrop?: boolean;
    allowFilter?: boolean;
    allowAdjustments?: boolean;
    className?: string;
}

// Data type
export interface XWUIPhotoEditorData {
    imageSrc?: string;
}

export class XWUIPhotoEditor extends XWUIComponent<XWUIPhotoEditorData, XWUIPhotoEditorConfig> {
    private editorElement: HTMLElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private image: HTMLImageElement | null = null;
    private uploadBtn: any = null;
    private saveBtn: any = null;
    private brightnessSlider: any = null;
    private contrastSlider: any = null;

    constructor(
        container: HTMLElement,
        data: XWUIPhotoEditorData,
        conf_comp: XWUIPhotoEditorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIPhotoEditorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPhotoEditorConfig {
        return {
            width: conf_comp?.width ?? 800,
            height: conf_comp?.height ?? 600,
            allowCrop: conf_comp?.allowCrop ?? true,
            allowFilter: conf_comp?.allowFilter ?? true,
            allowAdjustments: conf_comp?.allowAdjustments ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.editorElement = document.createElement('div');
        this.editorElement.className = 'xwui-photo-editor';
        
        if (this.config.className) {
            this.editorElement.classList.add(this.config.className);
        }

        // Toolbar
        this.renderToolbar();

        // Canvas area
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'xwui-photo-editor-canvas-container';
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width || 800;
        this.canvas.height = this.config.height || 600;
        this.ctx = this.canvas.getContext('2d');

        if (this.data.imageSrc) {
            this.loadImage(this.data.imageSrc);
        }

        canvasContainer.appendChild(this.canvas);
        this.editorElement.appendChild(canvasContainer);

        // Controls panel
        if (this.config.allowAdjustments) {
            this.renderControls();
        }

        this.container.appendChild(this.editorElement);
    }

    private renderToolbar(): void {
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            import('../XWUIUpload/index').then(({ XWUIUpload }) => {
                const toolbar = document.createElement('div');
                toolbar.className = 'xwui-photo-editor-toolbar';

                // Upload button
                const uploadBtnContainer = document.createElement('div');
                this.uploadBtn = new XWUIButton(uploadBtnContainer, 'Upload Image', {
                    variant: 'primary'
                });
                this.registerChildComponent(this.uploadBtn);
                this.uploadBtn.onClick(() => this.handleUpload());

                // Save button
                const saveBtnContainer = document.createElement('div');
                this.saveBtn = new XWUIButton(saveBtnContainer, 'Save', {
                    variant: 'success'
                });
                this.registerChildComponent(this.saveBtn);
                this.saveBtn.onClick(() => this.saveImage());

                toolbar.appendChild(uploadBtnContainer);
                toolbar.appendChild(saveBtnContainer);
                this.editorElement!.appendChild(toolbar);
            });
        });
    }

    private renderControls(): void {
        import('../XWUISlider/index').then(({ XWUISlider }) => {
            const controlsPanel = document.createElement('div');
            controlsPanel.className = 'xwui-photo-editor-controls';

            // Brightness
            const brightnessContainer = document.createElement('div');
            this.brightnessSlider = new XWUISlider(brightnessContainer, {
                label: 'Brightness',
                value: 100
            }, {
                min: 0,
                max: 200,
                step: 1
            });
            this.registerChildComponent(this.brightnessSlider);
            this.brightnessSlider.onChange((value: number) => {
                this.applyAdjustment('brightness', value);
            });

            // Contrast
            const contrastContainer = document.createElement('div');
            this.contrastSlider = new XWUISlider(contrastContainer, {
                label: 'Contrast',
                value: 100
            }, {
                min: 0,
                max: 200,
                step: 1
            });
            this.registerChildComponent(this.contrastSlider);
            this.contrastSlider.onChange((value: number) => {
                this.applyAdjustment('contrast', value);
            });

            controlsPanel.appendChild(brightnessContainer);
            controlsPanel.appendChild(contrastContainer);
            this.editorElement!.appendChild(controlsPanel);
        });
    }

    private handleUpload(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.loadImage(event.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    private loadImage(src: string): void {
        this.image = new Image();
        this.image.onload = () => {
            if (this.canvas && this.ctx && this.image) {
                this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
            }
        };
        this.image.src = src;
        this.data.imageSrc = src;
    }

    private applyAdjustment(type: string, value: number): void {
        if (!this.canvas || !this.ctx || !this.image) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.filter = `${type}(${value}%)`;
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    private saveImage(): void {
        if (!this.canvas) return;
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = dataURL;
        link.click();
    }

    public destroy(): void {
        // All registered child components (uploadBtn, saveBtn, brightnessSlider, contrastSlider) are automatically destroyed by base class
        // Clean up canvas
        if (this.canvas) {
            this.canvas.width = 0;
            this.canvas.height = 0;
            this.canvas = null;
        }
        this.ctx = null;
        if (this.image) {
            this.image.src = '';
            this.image = null;
        }
        this.editorElement = null;
        this.uploadBtn = null;
        this.saveBtn = null;
        this.brightnessSlider = null;
        this.contrastSlider = null;
        this.container.innerHTML = '';
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPhotoEditor as any).componentName = 'XWUIPhotoEditor';


