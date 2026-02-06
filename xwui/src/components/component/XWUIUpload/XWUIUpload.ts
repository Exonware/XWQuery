/**
 * XWUIUpload Component
 * File upload component with drag-and-drop
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIcon } from '../XWUIIcon/icon-utils';

export interface XWUIUploadFile {
    id: string;
    name: string;
    size: number;
    type: string;
    status?: 'uploading' | 'done' | 'error';
    progress?: number;
    url?: string;
}

// Component-level configuration
export interface XWUIUploadConfig {
    multiple?: boolean;
    accept?: string;
    maxSize?: number; // in bytes
    maxCount?: number;
    dragDrop?: boolean;
    listType?: 'text' | 'picture' | 'picture-card';
    className?: string;
}

// Data type
export interface XWUIUploadData {
    files?: XWUIUploadFile[];
    label?: string;
}

export class XWUIUpload extends XWUIComponent<XWUIUploadData, XWUIUploadConfig> {
    private uploadElement: HTMLElement | null = null;
    private inputElement: HTMLInputElement | null = null;
    private dropZone: HTMLElement | null = null;
    private fileList: HTMLElement | null = null;
    private uploadHandlers: Array<(files: File[]) => void> = [];
    private removeHandlers: Array<(fileId: string) => void> = [];
    private files: Map<string, XWUIUploadFile> = new Map();

    constructor(
        container: HTMLElement,
        data: XWUIUploadData = {},
        conf_comp: XWUIUploadConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.files = this.data.files || [];
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIUploadConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIUploadConfig {
        return {
            multiple: conf_comp?.multiple ?? false,
            accept: conf_comp?.accept,
            maxSize: conf_comp?.maxSize,
            maxCount: conf_comp?.maxCount,
            dragDrop: conf_comp?.dragDrop ?? true,
            listType: conf_comp?.listType ?? 'text',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.uploadElement = document.createElement('div');
        this.uploadElement.className = 'xwui-upload';
        this.uploadElement.classList.add(`xwui-upload-${this.config.listType}`);
        
        if (this.config.className) {
            this.uploadElement.classList.add(this.config.className);
        }

        // Drop zone
        if (this.config.dragDrop) {
            this.dropZone = document.createElement('div');
            this.dropZone.className = 'xwui-upload-dropzone';
            
            const dropContent = document.createElement('div');
            dropContent.className = 'xwui-upload-dropzone-content';
            
            // Use XWUIIcon for upload icon
            const icon = document.createElement('div');
            icon.className = 'xwui-upload-icon';
            const { container } = createIcon(this, 'upload', { size: 48 }, this.conf_sys, this.conf_usr);
            icon.appendChild(container);
            dropContent.appendChild(icon);
            
            const text = document.createElement('div');
            text.className = 'xwui-upload-text';
            text.innerHTML = `<p>Drag and drop files here, or <span class="xwui-upload-browse">browse</span></p>`;
            dropContent.appendChild(text);
            
            this.dropZone.appendChild(dropContent);
            this.uploadElement.appendChild(this.dropZone);

            // Drag and drop handlers
            this.dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.dropZone?.classList.add('xwui-upload-dropzone-dragover');
            });

            this.dropZone.addEventListener('dragleave', () => {
                this.dropZone?.classList.remove('xwui-upload-dropzone-dragover');
            });

            this.dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.dropZone?.classList.remove('xwui-upload-dropzone-dragover');
                const files = Array.from(e.dataTransfer?.files || []);
                this.handleFiles(files);
            });

            this.dropZone.querySelector('.xwui-upload-browse')?.addEventListener('click', () => {
                this.inputElement?.click();
            });
        }

        // Hidden file input
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'file';
        this.inputElement.style.display = 'none';
        if (this.config.multiple) {
            this.inputElement.setAttribute('multiple', '');
        }
        if (this.config.accept) {
            this.inputElement.setAttribute('accept', this.config.accept);
        }
        
        // Accessibility: Add aria-label and title attributes
        let labelText = this.data.label || 'Select file to upload';
        if (this.config.multiple) {
            labelText = this.data.label || 'Select files to upload';
        }
        if (this.config.accept) {
            const acceptTypes = this.config.accept.split(',').map(t => t.trim()).join(', ');
            labelText = this.data.label || `Select files to upload (accepted types: ${acceptTypes})`;
        }
        this.inputElement.setAttribute('aria-label', labelText);
        this.inputElement.setAttribute('title', labelText);
        
        this.inputElement.addEventListener('change', (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            this.handleFiles(files);
        });
        this.uploadElement.appendChild(this.inputElement);

        // File list
        this.fileList = document.createElement('div');
        this.fileList.className = 'xwui-upload-list';
        this.renderFileList();
        this.uploadElement.appendChild(this.fileList);

        this.container.appendChild(this.uploadElement);
    }

    private handleFiles(files: File[]): void {
        if (this.config.maxCount && this.files.size + files.length > this.config.maxCount) {
            alert(`Maximum ${this.config.maxCount} files allowed`);
            return;
        }

        files.forEach(file => {
            if (this.config.maxSize && file.size > this.config.maxSize) {
                alert(`File ${file.name} exceeds maximum size`);
                return;
            }

            const fileData: XWUIUploadFile = {
                id: `${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'done'
            };

            this.files.set(fileData.id, fileData);
            this.data.files?.push(fileData);
        });

        this.renderFileList();
        this.uploadHandlers.forEach(handler => handler(files));
    }

    private renderFileList(): void {
        if (!this.fileList) return;

        this.fileList.innerHTML = '';

        if (this.data.files && this.data.files.length === 0) {
            return;
        }

        this.data.files?.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'xwui-upload-file-item';
            fileItem.setAttribute('data-file-id', file.id);

            if (this.config.listType === 'picture' || this.config.listType === 'picture-card') {
                const preview = document.createElement('div');
                preview.className = 'xwui-upload-file-preview';
                if (file.url) {
                    const img = document.createElement('img');
                    img.src = file.url;
                    img.alt = file.name;
                    preview.appendChild(img);
                } else {
                    preview.textContent = '📄';
                }
                fileItem.appendChild(preview);
            }

            const info = document.createElement('div');
            info.className = 'xwui-upload-file-info';
            
            const name = document.createElement('div');
            name.className = 'xwui-upload-file-name';
            name.textContent = file.name;
            info.appendChild(name);

            const size = document.createElement('div');
            size.className = 'xwui-upload-file-size';
            size.textContent = this.formatFileSize(file.size);
            info.appendChild(size);

            if (file.status === 'uploading' && file.progress !== undefined) {
                const progress = document.createElement('div');
                progress.className = 'xwui-upload-file-progress';
                progress.style.width = `${file.progress}%`;
                info.appendChild(progress);
            }

            fileItem.appendChild(info);

            const actions = document.createElement('div');
            actions.className = 'xwui-upload-file-actions';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'xwui-upload-file-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => {
                this.removeFile(file.id);
            });
            actions.appendChild(removeBtn);
            
            fileItem.appendChild(actions);
            this.fileList.appendChild(fileItem);
        });
    }

    private formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    public removeFile(fileId: string): void {
        const index = this.data.files?.findIndex(f => f.id === fileId);
        if (index !== undefined && index > -1) {
            this.data.files?.splice(index, 1);
            this.files.delete(fileId);
            this.renderFileList();
            this.removeHandlers.forEach(handler => handler(fileId));
        }
    }

    public onUpload(handler: (files: File[]) => void): void {
        this.uploadHandlers.push(handler);
    }

    public onRemove(handler: (fileId: string) => void): void {
        this.removeHandlers.push(handler);
    }

    public getFiles(): XWUIUploadFile[] {
        return this.data.files || [];
    }

    public getElement(): HTMLElement | null {
        return this.uploadElement;
    }

    public destroy(): void {
        this.uploadHandlers = [];
        this.removeHandlers = [];
        this.files.clear();
        if (this.uploadElement) {
            this.uploadElement.remove();
            this.uploadElement = null;
        }
        this.inputElement = null;
        this.dropZone = null;
        this.fileList = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIUpload as any).componentName = 'XWUIUpload';


