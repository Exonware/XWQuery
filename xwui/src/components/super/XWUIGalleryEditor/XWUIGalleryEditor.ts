/**
 * XWUIGalleryEditor Component
 * Gallery editor with upload and management
 * Reuses: XWUIGalleryViewer, XWUIUpload, XWUIButton, XWUIDialog
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIGalleryViewer, type XWUIGalleryImage } from '../XWUIGalleryViewer/XWUIGalleryViewer';

// Component-level configuration
export interface XWUIGalleryEditorConfig {
    layout?: 'grid' | 'carousel';
    columns?: number;
    showUpload?: boolean;
    allowDelete?: boolean;
    allowReorder?: boolean;
    maxImages?: number;
    className?: string;
}

// Data type
export interface XWUIGalleryEditorData {
    images: XWUIGalleryImage[];
}

export class XWUIGalleryEditor extends XWUIComponent<XWUIGalleryEditorData, XWUIGalleryEditorConfig> {
    private editorElement: HTMLElement | null = null;
    private galleryViewer: XWUIGalleryViewer | null = null;
    private uploadComponent: any = null;
    private uploadBtn: any = null;
    private dialog: any = null;

    constructor(
        container: HTMLElement,
        data: XWUIGalleryEditorData,
        conf_comp: XWUIGalleryEditorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.images = this.data.images || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIGalleryEditorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIGalleryEditorConfig {
        return {
            layout: conf_comp?.layout ?? 'grid',
            columns: conf_comp?.columns ?? 4,
            showUpload: conf_comp?.showUpload ?? true,
            allowDelete: conf_comp?.allowDelete ?? true,
            allowReorder: conf_comp?.allowReorder ?? false,
            maxImages: conf_comp?.maxImages,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.editorElement = document.createElement('div');
        this.editorElement.className = 'xwui-gallery-editor';
        
        if (this.config.className) {
            this.editorElement.classList.add(this.config.className);
        }

        // Toolbar
        if (this.config.showUpload) {
            this.renderToolbar();
        }

        // Gallery viewer
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'xwui-gallery-editor-viewer';
        this.galleryViewer = new XWUIGalleryViewer(galleryContainer, {
            images: this.data.images
        }, {
            layout: this.config.layout,
            columns: this.config.columns,
            showLightbox: true
        }, this.conf_sys, this.conf_usr);
        this.registerChildComponent(this.galleryViewer);

        this.editorElement.appendChild(galleryContainer);
        this.container.appendChild(this.editorElement);
    }

    private renderToolbar(): void {
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            import('../XWUIUpload/index').then(({ XWUIUpload }) => {
                const toolbar = document.createElement('div');
                toolbar.className = 'xwui-gallery-editor-toolbar';

                // Upload button
                const uploadBtnContainer = document.createElement('div');
                this.uploadBtn = new XWUIButton(uploadBtnContainer, 'Upload Images', {
                    variant: 'primary',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>'
                });
                this.registerChildComponent(this.uploadBtn);
                this.uploadBtn.onClick(() => this.showUploadDialog());

                toolbar.appendChild(uploadBtnContainer);
                this.editorElement!.insertBefore(toolbar, this.editorElement!.firstChild);
            });
        });
    }

    private showUploadDialog(): void {
        import('../XWUIDialog/index').then(({ XWUIDialog }) => {
            import('../XWUIUpload/index').then(({ XWUIUpload }) => {
                const dialogContainer = document.createElement('div');
                document.body.appendChild(dialogContainer);

                const uploadContainer = document.createElement('div');
                uploadContainer.style.minHeight = '300px';

                this.uploadComponent = new XWUIUpload(uploadContainer, {}, {
                    multiple: true,
                    accept: 'image/*',
                    dragDrop: true,
                    listType: 'picture'
                });
                this.registerChildComponent(this.uploadComponent);

                this.uploadComponent.onUpload((files: File[]) => {
                    files.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const image: XWUIGalleryImage = {
                                id: `${Date.now()}-${Math.random()}`,
                                src: e.target?.result as string,
                                thumbnail: e.target?.result as string,
                                title: file.name
                            };
                            this.addImage(image);
                        };
                        reader.readAsDataURL(file);
                    });
                });

                this.dialog = new XWUIDialog(dialogContainer, {
                    title: 'Upload Images',
                    content: uploadContainer
                }, {
                    size: 'large',
                    closable: true
                });
                this.registerChildComponent(this.dialog);

                this.dialog.open();
                this.dialog.onClose(() => {
                    dialogContainer.remove();
                });
            });
        });
    }

    public addImage(image: XWUIGalleryImage): void {
        this.data.images.push(image);
        this.updateGallery();
    }

    public removeImage(imageId: string): void {
        this.data.images = this.data.images.filter(img => img.id !== imageId);
        this.updateGallery();
    }

    private updateGallery(): void {
        if (this.galleryViewer) {
            this.galleryViewer.data.images = this.data.images;
            this.render();
        }
    }

    public destroy(): void {
        // All registered child components (galleryViewer, uploadBtn, uploadComponent, dialog) are automatically destroyed by base class
        this.editorElement = null;
        this.galleryViewer = null;
        this.uploadComponent = null;
        this.uploadBtn = null;
        this.dialog = null;
        this.container.innerHTML = '';
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIGalleryEditor as any).componentName = 'XWUIGalleryEditor';


