/**
 * XWUIResizable Component
 * Resizable container component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIResizableConfig {
    direction?: 'horizontal' | 'vertical' | 'both';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    className?: string;
}

// Data type
export interface XWUIResizableData {
    content: HTMLElement | string;
    width?: number;
    height?: number;
}

export class XWUIResizable extends XWUIComponent<XWUIResizableData, XWUIResizableConfig> {
    private resizableElement: HTMLElement | null = null;
    private isResizing: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = 0;
    private startHeight: number = 0;

    constructor(
        container: HTMLElement,
        data: XWUIResizableData,
        conf_comp: XWUIResizableConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIResizableConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIResizableConfig {
        return {
            direction: conf_comp?.direction ?? 'both',
            minWidth: conf_comp?.minWidth ?? 100,
            maxWidth: conf_comp?.maxWidth,
            minHeight: conf_comp?.minHeight ?? 100,
            maxHeight: conf_comp?.maxHeight,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.resizableElement = document.createElement('div');
        this.resizableElement.className = 'xwui-resizable';
        this.resizableElement.classList.add(`xwui-resizable-${this.config.direction}`);
        
        if (this.data.width) {
            this.resizableElement.style.width = `${this.data.width}px`;
        }
        if (this.data.height) {
            this.resizableElement.style.height = `${this.data.height}px`;
        }
        
        if (this.config.className) {
            this.resizableElement.classList.add(this.config.className);
        }

        // Content
        const content = document.createElement('div');
        content.className = 'xwui-resizable-content';
        
        if (this.data.content) {
            if (typeof this.data.content === 'string') {
                content.innerHTML = this.data.content;
            } else if (this.data.content instanceof Node) {
                content.appendChild(this.data.content);
            } else {
                // If content is not a Node, use innerHTML or textContent
                content.textContent = String(this.data.content);
            }
        }
        
        this.resizableElement.appendChild(content);

        // Handles
        if (this.config.direction === 'horizontal' || this.config.direction === 'both') {
            const rightHandle = this.createHandle('right');
            this.resizableElement.appendChild(rightHandle);
        }
        if (this.config.direction === 'vertical' || this.config.direction === 'both') {
            const bottomHandle = this.createHandle('bottom');
            this.resizableElement.appendChild(bottomHandle);
        }
        if (this.config.direction === 'both') {
            const cornerHandle = this.createHandle('corner');
            this.resizableElement.appendChild(cornerHandle);
        }

        this.container.appendChild(this.resizableElement);
    }

    private createHandle(position: 'right' | 'bottom' | 'corner'): HTMLElement {
        const handle = document.createElement('div');
        handle.className = `xwui-resizable-handle xwui-resizable-handle-${position}`;
        
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startResize(e, position);
        });

        return handle;
    }

    private startResize(e: MouseEvent, position: string): void {
        this.isResizing = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        if (this.resizableElement) {
            const rect = this.resizableElement.getBoundingClientRect();
            this.startWidth = rect.width;
            this.startHeight = rect.height;
        }

        document.addEventListener('mousemove', this.handleResize);
        document.addEventListener('mouseup', this.stopResize);
        document.body.style.cursor = position === 'right' ? 'ew-resize' : position === 'bottom' ? 'ns-resize' : 'nwse-resize';
    }

    private handleResize = (e: MouseEvent): void => {
        if (!this.isResizing || !this.resizableElement) return;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        if (this.config.direction === 'horizontal' || this.config.direction === 'both') {
            let newWidth = this.startWidth + deltaX;
            if (this.config.minWidth) newWidth = Math.max(newWidth, this.config.minWidth);
            if (this.config.maxWidth) newWidth = Math.min(newWidth, this.config.maxWidth);
            this.resizableElement.style.width = `${newWidth}px`;
            this.data.width = newWidth;
        }

        if (this.config.direction === 'vertical' || this.config.direction === 'both') {
            let newHeight = this.startHeight + deltaY;
            if (this.config.minHeight) newHeight = Math.max(newHeight, this.config.minHeight);
            if (this.config.maxHeight) newHeight = Math.min(newHeight, this.config.maxHeight);
            this.resizableElement.style.height = `${newHeight}px`;
            this.data.height = newHeight;
        }
    };

    private stopResize = (): void => {
        this.isResizing = false;
        document.removeEventListener('mousemove', this.handleResize);
        document.removeEventListener('mouseup', this.stopResize);
        document.body.style.cursor = '';
    };

    public getElement(): HTMLElement | null {
        return this.resizableElement;
    }

    public destroy(): void {
        this.stopResize();
        if (this.resizableElement) {
            this.resizableElement.remove();
            this.resizableElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIResizable as any).componentName = 'XWUIResizable';


