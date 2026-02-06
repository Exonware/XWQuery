/**
 * XWUIFilePreview Component
 * Inline preview of uploaded files (PDF, images, documents)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIDialog } from '../XWUIDialog/XWUIDialog';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUISkeleton } from '../XWUISkeleton/XWUISkeleton';
import { XWUIImage } from '../XWUIImage/XWUIImage';

export interface FilePreview {
    id: string;
    name: string;
    url: string;
    type: string; // 'image', 'pdf', 'document', etc.
    size?: number;
}

// Component-level configuration
export interface XWUIFilePreviewConfig {
    showThumbnail?: boolean;
    showDialog?: boolean;
    thumbnailSize?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIFilePreviewData {
    file?: FilePreview;
    files?: FilePreview[];
    mode?: 'single' | 'gallery';
}

export class XWUIFilePreview extends XWUIComponent<XWUIFilePreviewData, XWUIFilePreviewConfig> {
    private wrapperElement: HTMLElement | null = null;
    private dialogComponent: XWUIDialog | null = null;
    private isLoading: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIFilePreviewData = {},
        conf_comp: XWUIFilePreviewConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIFilePreviewConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFilePreviewConfig {
        return {
            showThumbnail: conf_comp?.showThumbnail ?? true,
            showDialog: conf_comp?.showDialog ?? true,
            thumbnailSize: conf_comp?.thumbnailSize ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-file-preview';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        if (this.data.mode === 'gallery' && this.data.files && this.data.files.length > 0) {
            this.renderGallery();
        } else if (this.data.file) {
            this.renderSingle();
        } else {
            this.wrapperElement.innerHTML = '<div class="xwui-file-preview-empty">No file to preview</div>';
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderSingle(): void {
        if (!this.data.file) return;

        const fileContainer = document.createElement('div');
        fileContainer.className = 'xwui-file-preview-single';

        if (this.config.showThumbnail) {
            const thumbnail = this.createThumbnail(this.data.file);
            fileContainer.appendChild(thumbnail);
        }

        const info = document.createElement('div');
        info.className = 'xwui-file-preview-info';

        const name = document.createElement('div');
        name.className = 'xwui-file-preview-name';
        name.textContent = this.data.file.name;
        info.appendChild(name);

        if (this.data.file.size) {
            const size = document.createElement('div');
            size.className = 'xwui-file-preview-size';
            size.textContent = this.formatFileSize(this.data.file.size);
            info.appendChild(size);
        }

        fileContainer.appendChild(info);

        if (this.config.showDialog) {
            const previewBtnContainer = document.createElement('div');
            const previewBtn = new XWUIButton(previewBtnContainer, {
                label: 'Preview',
                variant: 'outline',
                size: 'small'
            });

            previewBtn.getElement()?.addEventListener('click', () => {
                this.openDialog(this.data.file!);
            });

            fileContainer.appendChild(previewBtnContainer);
        }

        this.wrapperElement!.appendChild(fileContainer);
    }

    private renderGallery(): void {
        if (!this.data.files) return;

        const gallery = document.createElement('div');
        gallery.className = 'xwui-file-preview-gallery';

        this.data.files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'xwui-file-preview-gallery-item';

            if (this.config.showThumbnail) {
                const thumbnail = this.createThumbnail(file);
                thumbnail.addEventListener('click', () => {
                    if (this.config.showDialog) {
                        this.openDialog(file);
                    }
                });
                item.appendChild(thumbnail);
            }

            const name = document.createElement('div');
            name.className = 'xwui-file-preview-gallery-name';
            name.textContent = file.name;
            item.appendChild(name);

            gallery.appendChild(item);
        });

        this.wrapperElement!.appendChild(gallery);
    }

    private createThumbnail(file: FilePreview): HTMLElement {
        const thumbnail = document.createElement('div');
        thumbnail.className = `xwui-file-preview-thumbnail xwui-file-preview-thumbnail-${this.config.thumbnailSize}`;

        if (file.type.startsWith('image/')) {
            const imgContainer = document.createElement('div');
            const img = new XWUIImage(imgContainer, {
                src: file.url,
                alt: file.name
            });
            thumbnail.appendChild(imgContainer);
        } else {
            const icon = document.createElement('div');
            icon.className = 'xwui-file-preview-icon';
            icon.textContent = this.getFileIcon(file.type);
            thumbnail.appendChild(icon);

            const typeLabel = document.createElement('div');
            typeLabel.className = 'xwui-file-preview-type';
            typeLabel.textContent = this.getFileTypeLabel(file.type);
            thumbnail.appendChild(typeLabel);
        }

        return thumbnail;
    }

    private openDialog(file: FilePreview): void {
        const dialogContainer = document.createElement('div');
        
        const previewContent = document.createElement('div');
        previewContent.className = 'xwui-file-preview-dialog-content';

        if (file.type.startsWith('image/')) {
            const imgContainer = document.createElement('div');
            const img = new XWUIImage(imgContainer, {
                src: file.url,
                alt: file.name
            });
            previewContent.appendChild(imgContainer);
        } else if (file.type === 'application/pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = file.url;
            iframe.className = 'xwui-file-preview-iframe';
            previewContent.appendChild(iframe);
        } else {
            previewContent.innerHTML = `
                <div class="xwui-file-preview-unsupported">
                    <p>Preview not available for this file type.</p>
                    <a href="${file.url}" download="${file.name}">Download file</a>
                </div>
            `;
        }

        this.dialogComponent = new XWUIDialog(dialogContainer, {
            title: file.name,
            content: previewContent
        }, {
            size: 'large',
            closable: true
        });

        document.body.appendChild(dialogContainer);
        this.dialogComponent.open();

        this.dialogComponent.onClose(() => {
            if (dialogContainer.parentNode) {
                dialogContainer.parentNode.removeChild(dialogContainer);
            }
        });
    }

    private getFileIcon(mimeType: string): string {
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('word')) return '📝';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
        if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
        return '📎';
    }

    private getFileTypeLabel(mimeType: string): string {
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('word')) return 'DOC';
        if (mimeType.includes('excel')) return 'XLS';
        return 'FILE';
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.dialogComponent) {
            this.dialogComponent.destroy();
            this.dialogComponent = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIFilePreview as any).componentName = 'XWUIFilePreview';


