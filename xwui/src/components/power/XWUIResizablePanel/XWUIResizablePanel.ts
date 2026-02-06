/**
 * XWUIResizablePanel Component
 * Split-panel with two resizable panes and a draggable divider
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIResizablePanelConfig {
    direction?: 'horizontal' | 'vertical';
    initialSize?: number; // Percentage of first pane (0-100)
    minSize?: number; // Minimum percentage for first pane
    maxSize?: number; // Maximum percentage for first pane
    dividerSize?: number; // Size of divider in pixels
    className?: string;
}

// Data type
export interface XWUIResizablePanelData {
    leftPane: HTMLElement | string;
    rightPane: HTMLElement | string;
}

export class XWUIResizablePanel extends XWUIComponent<XWUIResizablePanelData, XWUIResizablePanelConfig> {
    private panelElement: HTMLElement | null = null;
    private leftPaneElement: HTMLElement | null = null;
    private rightPaneElement: HTMLElement | null = null;
    private dividerElement: HTMLElement | null = null;
    private isDragging: boolean = false;
    private currentSize: number = 50;
    private resizeHandlers: Array<(size: number) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIResizablePanelData,
        conf_comp: XWUIResizablePanelConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.currentSize = this.config.initialSize || 50;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIResizablePanelConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIResizablePanelConfig {
        return {
            direction: conf_comp?.direction ?? 'horizontal',
            initialSize: conf_comp?.initialSize ?? 50,
            minSize: conf_comp?.minSize ?? 10,
            maxSize: conf_comp?.maxSize ?? 90,
            dividerSize: conf_comp?.dividerSize ?? 8,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.panelElement = document.createElement('div');
        this.panelElement.className = 'xwui-resizable-panel';
        this.panelElement.classList.add(`xwui-resizable-panel-${this.config.direction}`);
        
        if (this.config.className) {
            this.panelElement.classList.add(this.config.className);
        }

        // Left pane
        this.leftPaneElement = document.createElement('div');
        this.leftPaneElement.className = 'xwui-resizable-panel-pane xwui-resizable-panel-pane-left';
        
        if (typeof this.data.leftPane === 'string') {
            this.leftPaneElement.innerHTML = this.data.leftPane;
        } else {
            this.leftPaneElement.appendChild(this.data.leftPane);
        }
        
        this.updatePaneSizes();
        this.panelElement.appendChild(this.leftPaneElement);

        // Divider
        this.dividerElement = document.createElement('div');
        this.dividerElement.className = 'xwui-resizable-panel-divider';
        this.dividerElement.style.width = this.config.direction === 'horizontal' 
            ? `${this.config.dividerSize}px` 
            : '100%';
        this.dividerElement.style.height = this.config.direction === 'vertical' 
            ? `${this.config.dividerSize}px` 
            : '100%';
        
        this.dividerElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startDrag(e);
        });
        
        this.panelElement.appendChild(this.dividerElement);

        // Right pane
        this.rightPaneElement = document.createElement('div');
        this.rightPaneElement.className = 'xwui-resizable-panel-pane xwui-resizable-panel-pane-right';
        
        if (typeof this.data.rightPane === 'string') {
            this.rightPaneElement.innerHTML = this.data.rightPane;
        } else {
            this.rightPaneElement.appendChild(this.data.rightPane);
        }
        
        this.panelElement.appendChild(this.rightPaneElement);

        this.container.appendChild(this.panelElement);
    }

    private updatePaneSizes(): void {
        if (!this.leftPaneElement || !this.rightPaneElement) return;

        const clampedSize = Math.min(Math.max(this.currentSize, this.config.minSize || 10), this.config.maxSize || 90);

        if (this.config.direction === 'horizontal') {
            this.leftPaneElement.style.flexBasis = `${clampedSize}%`;
            this.leftPaneElement.style.flexGrow = '0';
            this.leftPaneElement.style.flexShrink = '0';
            this.rightPaneElement.style.flexGrow = '1';
        } else {
            this.leftPaneElement.style.flexBasis = `${clampedSize}%`;
            this.leftPaneElement.style.flexGrow = '0';
            this.leftPaneElement.style.flexShrink = '0';
            this.rightPaneElement.style.flexGrow = '1';
        }
    }

    private startDrag(e: MouseEvent): void {
        this.isDragging = true;
        
        const handleMove = (moveEvent: MouseEvent) => {
            if (!this.panelElement || !this.isDragging) return;

            const rect = this.panelElement.getBoundingClientRect();
            let newSize: number;

            if (this.config.direction === 'horizontal') {
                newSize = ((moveEvent.clientX - rect.left) / rect.width) * 100;
            } else {
                newSize = ((moveEvent.clientY - rect.top) / rect.height) * 100;
            }

            this.currentSize = Math.min(Math.max(newSize, this.config.minSize || 10), this.config.maxSize || 90);
            this.updatePaneSizes();
            this.resizeHandlers.forEach(handler => handler(this.currentSize));
        };

        const handleUp = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
        document.body.style.cursor = this.config.direction === 'horizontal' ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
    }

    public setSize(size: number): void {
        this.currentSize = Math.min(Math.max(size, this.config.minSize || 10), this.config.maxSize || 90);
        this.updatePaneSizes();
        this.resizeHandlers.forEach(handler => handler(this.currentSize));
    }

    public getSize(): number {
        return this.currentSize;
    }

    public onResize(handler: (size: number) => void): void {
        this.resizeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.panelElement;
    }

    public destroy(): void {
        this.isDragging = false;
        this.resizeHandlers = [];
        if (this.panelElement) {
            this.panelElement.remove();
            this.panelElement = null;
        }
        this.leftPaneElement = null;
        this.rightPaneElement = null;
        this.dividerElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIResizablePanel as any).componentName = 'XWUIResizablePanel';


