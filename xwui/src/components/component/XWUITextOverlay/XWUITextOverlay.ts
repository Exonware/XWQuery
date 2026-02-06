/**
 * XWUITextOverlay Component
 * Text overlay for adding text to canvas with formatting options
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIRichTextEditor } from '../XWUIRichTextEditor/XWUIRichTextEditor';
import { XWUIColorPicker } from '../XWUIColorPicker/XWUIColorPicker';
import { XWUISlider } from '../XWUISlider/XWUISlider';
import { XWUISelect } from '../XWUISelect/XWUISelect';
import { XWUIButton } from '../XWUIButton/XWUIButton';

export interface TextOverlay {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    alignment: 'left' | 'center' | 'right';
    rotation?: number;
    style?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        outline?: boolean;
        shadow?: boolean;
    };
    zIndex?: number;
}

// Component-level configuration
export interface XWUITextOverlayConfig {
    defaultFontSize?: number;
    defaultFontFamily?: string;
    defaultColor?: string;
    canvasElement?: HTMLElement | string;
    className?: string;
}

// Data type
export interface XWUITextOverlayData {
    overlays?: TextOverlay[];
}

export class XWUITextOverlay extends XWUIComponent<XWUITextOverlayData, XWUITextOverlayConfig> {
    private wrapperElement: HTMLElement | null = null;
    private canvasElement: HTMLElement | null = null;
    private toolbarElement: HTMLElement | null = null;
    private overlaysMap: Map<string, TextOverlay> = new Map();
    private selectedOverlay: string | null = null;
    private isEditing: boolean = false;
    private changeHandlers: Array<(overlays: TextOverlay[]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUITextOverlayData = {},
        conf_comp: XWUITextOverlayConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeOverlays();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITextOverlayConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITextOverlayConfig {
        return {
            defaultFontSize: conf_comp?.defaultFontSize ?? 24,
            defaultFontFamily: conf_comp?.defaultFontFamily ?? 'Arial',
            defaultColor: conf_comp?.defaultColor ?? '#000000',
            canvasElement: conf_comp?.canvasElement,
            className: conf_comp?.className
        };
    }

    private initializeOverlays(): void {
        if (this.data.overlays) {
            this.data.overlays.forEach(overlay => {
                this.overlaysMap.set(overlay.id, overlay);
            });
        }
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-text-overlay-container';

        // Get canvas element
        if (this.config.canvasElement) {
            if (typeof this.config.canvasElement === 'string') {
                this.canvasElement = document.querySelector(this.config.canvasElement);
            } else {
                this.canvasElement = this.config.canvasElement;
            }
        } else {
            this.canvasElement = this.container;
        }

        if (!this.canvasElement) {
            console.error('Canvas element not found');
            return;
        }

        // Toolbar
        this.toolbarElement = this.createToolbar();
        if (this.toolbarElement) {
            this.container.appendChild(this.toolbarElement);
        }

        // Render overlays
        this.renderOverlays();
    }

    private createToolbar(): HTMLElement | null {
        if (!this.selectedOverlay) return null;

        const toolbar = document.createElement('div');
        toolbar.className = 'xwui-text-overlay-toolbar';

        const overlay = this.overlaysMap.get(this.selectedOverlay);
        if (!overlay) return null;

        // Font size
        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.textContent = 'Size:';
        const fontSizeInput = document.createElement('input');
        fontSizeInput.type = 'number';
        fontSizeInput.value = overlay.fontSize.toString();
        fontSizeInput.min = '8';
        fontSizeInput.max = '200';
        fontSizeInput.addEventListener('input', (e) => {
            overlay.fontSize = parseInt((e.target as HTMLInputElement).value, 10);
            this.updateOverlay(overlay);
        });
        toolbar.appendChild(fontSizeLabel);
        toolbar.appendChild(fontSizeInput);

        // Font family
        const fontFamilySelect = document.createElement('select');
        const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            if (font === overlay.fontFamily) option.selected = true;
            fontFamilySelect.appendChild(option);
        });
        fontFamilySelect.addEventListener('change', (e) => {
            overlay.fontFamily = (e.target as HTMLSelectElement).value;
            this.updateOverlay(overlay);
        });
        toolbar.appendChild(fontFamilySelect);

        // Color
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = overlay.color;
        colorInput.addEventListener('change', (e) => {
            overlay.color = (e.target as HTMLInputElement).value;
            this.updateOverlay(overlay);
        });
        toolbar.appendChild(colorInput);

        // Style buttons
        const boldBtn = document.createElement('button');
        boldBtn.textContent = 'B';
        boldBtn.style.fontWeight = 'bold';
        boldBtn.onclick = () => {
            if (!overlay.style) overlay.style = {};
            overlay.style.bold = !overlay.style.bold;
            this.updateOverlay(overlay);
        };
        toolbar.appendChild(boldBtn);

        const italicBtn = document.createElement('button');
        italicBtn.textContent = 'I';
        italicBtn.style.fontStyle = 'italic';
        italicBtn.onclick = () => {
            if (!overlay.style) overlay.style = {};
            overlay.style.italic = !overlay.style.italic;
            this.updateOverlay(overlay);
        };
        toolbar.appendChild(italicBtn);

        return toolbar;
    }

    private renderOverlays(): void {
        if (!this.canvasElement) return;

        // Remove existing overlay elements
        const existing = this.canvasElement.querySelectorAll('.xwui-text-overlay-item');
        existing.forEach(el => el.remove());

        this.overlaysMap.forEach(overlay => {
            const element = this.createOverlayElement(overlay);
            this.canvasElement!.appendChild(element);
        });

        // Update toolbar
        if (this.toolbarElement) {
            this.toolbarElement.remove();
        }
        this.toolbarElement = this.createToolbar();
        if (this.toolbarElement && this.container) {
            this.container.insertBefore(this.toolbarElement, this.container.firstChild);
        }
    }

    private createOverlayElement(overlay: TextOverlay): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-text-overlay-item';
        wrapper.setAttribute('data-overlay-id', overlay.id);
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${overlay.x}px`;
        wrapper.style.top = `${overlay.y}px`;
        wrapper.style.fontSize = `${overlay.fontSize}px`;
        wrapper.style.fontFamily = overlay.fontFamily;
        wrapper.style.color = overlay.color;
        wrapper.style.textAlign = overlay.alignment;
        wrapper.style.zIndex = overlay.zIndex?.toString() || '10';
        wrapper.style.cursor = 'move';

        if (overlay.rotation) {
            wrapper.style.transform = `rotate(${overlay.rotation}deg)`;
        }

        if (overlay.style) {
            if (overlay.style.bold) wrapper.style.fontWeight = 'bold';
            if (overlay.style.italic) wrapper.style.fontStyle = 'italic';
            if (overlay.style.underline) wrapper.style.textDecoration = 'underline';
            if (overlay.style.outline) {
                wrapper.style.textStroke = `1px ${overlay.color}`;
            }
            if (overlay.style.shadow) {
                wrapper.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
            }
        }

        wrapper.textContent = overlay.text;

        if (this.selectedOverlay === overlay.id) {
            wrapper.classList.add('selected');
        }

        // Event handlers
        wrapper.addEventListener('mousedown', (e) => {
            this.startDrag(overlay.id, e);
        });

        wrapper.addEventListener('dblclick', () => {
            this.startEditing(overlay.id);
        });

        return wrapper;
    }

    private startDrag(overlayId: string, e: MouseEvent): void {
        const overlay = this.overlaysMap.get(overlayId);
        if (!overlay) return;

        this.selectedOverlay = overlayId;
        const startX = e.clientX - overlay.x;
        const startY = e.clientY - overlay.y;

        const onMouseMove = (e: MouseEvent) => {
            overlay.x = e.clientX - startX;
            overlay.y = e.clientY - startY;
            this.overlaysMap.set(overlayId, overlay);
            this.renderOverlays();
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.triggerChange();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        this.renderOverlays();
    }

    private startEditing(overlayId: string): void {
        const overlay = this.overlaysMap.get(overlayId);
        if (!overlay) return;

        const newText = prompt('Enter text:', overlay.text);
        if (newText !== null) {
            overlay.text = newText;
            this.updateOverlay(overlay);
        }
    }

    private updateOverlay(overlay: TextOverlay): void {
        this.overlaysMap.set(overlay.id, overlay);
        this.renderOverlays();
        this.triggerChange();
    }

    private triggerChange(): void {
        const overlays = Array.from(this.overlaysMap.values());
        this.changeHandlers.forEach(handler => handler(overlays));
    }

    public addText(text: string, x: number = 100, y: number = 100): string {
        const overlay: TextOverlay = {
            id: `text-${Date.now()}`,
            text,
            x,
            y,
            fontSize: this.config.defaultFontSize || 24,
            fontFamily: this.config.defaultFontFamily || 'Arial',
            color: this.config.defaultColor || '#000000',
            alignment: 'left'
        };
        this.overlaysMap.set(overlay.id, overlay);
        this.selectedOverlay = overlay.id;
        this.renderOverlays();
        this.triggerChange();
        return overlay.id;
    }

    public removeText(overlayId: string): void {
        this.overlaysMap.delete(overlayId);
        if (this.selectedOverlay === overlayId) {
            this.selectedOverlay = null;
        }
        this.renderOverlays();
        this.triggerChange();
    }

    public onChange(handler: (overlays: TextOverlay[]) => void): void {
        this.changeHandlers.push(handler);
    }

    public getOverlays(): TextOverlay[] {
        return Array.from(this.overlaysMap.values());
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITextOverlay as any).componentName = 'XWUITextOverlay';


