/**
 * XWUIPDFViewer Component
 * Enhanced PDF viewer with PDF.js integration
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUISlider } from '../XWUISlider/XWUISlider';

// Component-level configuration
export interface XWUIPDFViewerConfig {
    showToolbar?: boolean;
    showThumbnails?: boolean;
    showPageNumbers?: boolean;
    enableAnnotations?: boolean;
    enableTextSelection?: boolean;
    className?: string;
}

// Data type
export interface XWUIPDFViewerData {
    pdfUrl?: string;
    pdfData?: ArrayBuffer | Uint8Array;
    currentPage?: number;
    totalPages?: number;
    zoom?: number;
}

export class XWUIPDFViewer extends XWUIComponent<XWUIPDFViewerData, XWUIPDFViewerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private toolbarElement: HTMLElement | null = null;
    private thumbnailsElement: HTMLElement | null = null;
    private viewerElement: HTMLElement | null = null;
    private canvasContainer: HTMLElement | null = null;
    private pdfDoc: any = null;
    private pdfjsLib: any = null;
    private currentPageNum: number = 1;
    private zoomLevel: number = 1;
    private changeHandlers: Array<(page: number, total: number) => void> = [];
    private defaultZoomLevel: number = 1;
    private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
    private wheelHandler: ((e: WheelEvent) => void) | null = null;
    private static rejectionHandlerAdded: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIPDFViewerData = {},
        conf_comp: XWUIPDFViewerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.currentPageNum = this.data.currentPage || 1;
        this.zoomLevel = this.data.zoom || 1;
        this.defaultZoomLevel = this.zoomLevel;
        this.render();
        this.setupShortcuts();
        this.loadPDFJS();
    }

    protected createConfig(
        conf_comp?: XWUIPDFViewerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPDFViewerConfig {
        return {
            showToolbar: conf_comp?.showToolbar ?? true,
            showThumbnails: conf_comp?.showThumbnails ?? false,
            showPageNumbers: conf_comp?.showPageNumbers ?? true,
            enableAnnotations: conf_comp?.enableAnnotations ?? false,
            enableTextSelection: conf_comp?.enableTextSelection ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-pdf-viewer-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-pdf-viewer';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Toolbar
        if (this.config.showToolbar) {
            this.toolbarElement = this.createToolbar();
            this.wrapperElement.appendChild(this.toolbarElement);
        }

        // Main content area
        const contentArea = document.createElement('div');
        contentArea.className = 'xwui-pdf-viewer-content';

        // Thumbnails
        if (this.config.showThumbnails) {
            this.thumbnailsElement = document.createElement('div');
            this.thumbnailsElement.className = 'xwui-pdf-viewer-thumbnails';
            contentArea.appendChild(this.thumbnailsElement);
        }

        // Viewer
        this.viewerElement = document.createElement('div');
        this.viewerElement.className = 'xwui-pdf-viewer-main';
        this.canvasContainer = document.createElement('div');
        this.canvasContainer.className = 'xwui-pdf-viewer-canvas-container';
        this.viewerElement.appendChild(this.canvasContainer);
        contentArea.appendChild(this.viewerElement);

        this.wrapperElement.appendChild(contentArea);
        this.container.appendChild(this.wrapperElement);
        
        // Make viewer focusable for keyboard shortcuts
        if (this.viewerElement) {
            this.viewerElement.setAttribute('tabindex', '0');
            
            // Focus viewer when clicked to enable keyboard shortcuts
            this.viewerElement.addEventListener('click', () => {
                this.viewerElement?.focus();
            });
        }
    }

    private createToolbar(): HTMLElement {
        const toolbar = document.createElement('div');
        toolbar.className = 'xwui-pdf-viewer-toolbar';

        // Previous page
        const prevBtn = document.createElement('button');
        prevBtn.className = 'xwui-pdf-viewer-toolbar-btn';
        prevBtn.textContent = '←';
        prevBtn.onclick = () => this.previousPage();
        toolbar.appendChild(prevBtn);

        // Page input
        if (this.config.showPageNumbers) {
            const pageInput = document.createElement('input');
            pageInput.type = 'number';
            pageInput.className = 'xwui-pdf-viewer-page-input';
            pageInput.value = this.currentPageNum.toString();
            pageInput.min = '1';
            pageInput.addEventListener('change', (e) => {
                const page = parseInt((e.target as HTMLInputElement).value, 10);
                this.goToPage(page);
            });
            toolbar.appendChild(pageInput);

            const pageLabel = document.createElement('span');
            pageLabel.className = 'xwui-pdf-viewer-page-label';
            pageLabel.textContent = '/ 0';
            toolbar.appendChild(pageLabel);
        }

        // Next page
        const nextBtn = document.createElement('button');
        nextBtn.className = 'xwui-pdf-viewer-toolbar-btn';
        nextBtn.textContent = '→';
        nextBtn.onclick = () => this.nextPage();
        toolbar.appendChild(nextBtn);

        toolbar.appendChild(document.createTextNode(' | '));

        // Zoom out
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.className = 'xwui-pdf-viewer-toolbar-btn';
        zoomOutBtn.textContent = '−';
        zoomOutBtn.onclick = () => this.setZoom(this.zoomLevel * 0.9);
        toolbar.appendChild(zoomOutBtn);

        // Zoom level
        const zoomLabel = document.createElement('span');
        zoomLabel.className = 'xwui-pdf-viewer-zoom-label';
        zoomLabel.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        toolbar.appendChild(zoomLabel);

        // Zoom in
        const zoomInBtn = document.createElement('button');
        zoomInBtn.className = 'xwui-pdf-viewer-toolbar-btn';
        zoomInBtn.textContent = '+';
        zoomInBtn.onclick = () => this.setZoom(this.zoomLevel * 1.1);
        toolbar.appendChild(zoomInBtn);

        return toolbar;
    }

    private async loadPDFJS(): Promise<void> {
        try {
            // Try to load PDF.js from CDN if not already loaded
            if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
                this.pdfjsLib = (window as any).pdfjsLib;
                this.ensureWorkerInitialized();
                if (this.data.pdfUrl || this.data.pdfData) {
                    this.loadPDFInternal();
                }
            } else {
                // Check if script is already loading
                const existingScript = document.querySelector('script[src*="pdf.min.js"]');
                if (existingScript) {
                    // Wait for existing script to load
                    existingScript.addEventListener('load', () => {
                        this.pdfjsLib = (window as any).pdfjsLib;
                        this.ensureWorkerInitialized();
                        if (this.data.pdfUrl || this.data.pdfData) {
                            this.loadPDFInternal();
                        }
                    });
                } else {
                    // Load PDF.js dynamically
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                    script.onload = () => {
                        this.pdfjsLib = (window as any).pdfjsLib;
                        this.ensureWorkerInitialized();
                        if (this.data.pdfUrl || this.data.pdfData) {
                            this.loadPDFInternal();
                        }
                    };
                    script.onerror = () => {
                        console.error('Failed to load PDF.js library');
                        if (this.canvasContainer) {
                            this.canvasContainer.innerHTML = '<div class="xwui-pdf-viewer-error">Failed to load PDF.js library. Please check your internet connection.</div>';
                        }
                    };
                    document.head.appendChild(script);
                }
            }
        } catch (error) {
            console.error('Error in loadPDFJS:', error);
            if (this.canvasContainer) {
                this.canvasContainer.innerHTML = '<div class="xwui-pdf-viewer-error">Failed to initialize PDF viewer.</div>';
            }
        }
    }

    /**
     * Ensure PDF.js worker is properly initialized
     */
    private ensureWorkerInitialized(): void {
        if (!this.pdfjsLib) return;

        // Set worker source if not already set
        if (!this.pdfjsLib.GlobalWorkerOptions.workerSrc) {
            this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        // Suppress unhandled promise rejections from worker (only add once globally)
        if (!XWUIPDFViewer.rejectionHandlerAdded) {
            window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
                // Check if it's a PDF.js worker error
                const errorMessage = event.reason?.message || String(event.reason || '');
                if (errorMessage.includes('message channel') || 
                    errorMessage.includes('asynchronous response') ||
                    (errorMessage.includes('worker') && errorMessage.includes('response'))) {
                    // Suppress the error as it's often a false positive from browser extensions
                    event.preventDefault();
                    console.warn('Suppressed PDF.js worker message channel error (likely from browser extension):', errorMessage);
                }
            });
            XWUIPDFViewer.rejectionHandlerAdded = true;
        }
    }

    private async loadPDFInternal(): Promise<void> {
        if (!this.pdfjsLib || !this.canvasContainer) return;

        // Ensure worker is initialized before loading PDF
        this.ensureWorkerInitialized();

        try {
            const loadOptions: any = {
                // Add error handling for worker issues
                verbosity: 0, // Reduce console noise
            };

            let loadingTask: any;
            if (this.data.pdfData) {
                loadingTask = this.pdfjsLib.getDocument({ data: this.data.pdfData, ...loadOptions });
            } else if (this.data.pdfUrl) {
                loadingTask = this.pdfjsLib.getDocument({ url: this.data.pdfUrl, ...loadOptions });
            } else {
                return;
            }

            if (!loadingTask || !loadingTask.promise) {
                throw new Error('Failed to create PDF loading task');
            }

            // Load the PDF document - catch and suppress message channel errors
            this.pdfDoc = await loadingTask.promise;

            this.data.totalPages = this.pdfDoc.numPages;
            this.updatePageLabel();
            this.renderPage(this.currentPageNum);
        } catch (error: any) {
            console.error('Error loading PDF:', error);
            let errorMessage = 'Failed to load PDF. Please check the URL or data.';
            
            // Ignore message channel errors as they're often false positives from extensions
            const errorMsg = error?.message || String(error || '');
            if (errorMsg.includes('message channel') || errorMsg.includes('asynchronous response')) {
                console.warn('Suppressed message channel error (likely from browser extension)');
                return; // Don't show error for these
            }
            
            if (error && error.message) {
                if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
                    errorMessage = 'Failed to load PDF due to CORS restrictions. The PDF server does not allow cross-origin requests.';
                } else if (error.message.includes('fetch')) {
                    errorMessage = 'Failed to fetch PDF. Please check the URL or network connection.';
                } else {
                    errorMessage = `Failed to load PDF: ${error.message}`;
                }
            }
            
            if (this.canvasContainer) {
                this.canvasContainer.innerHTML = `<div class="xwui-pdf-viewer-error">${errorMessage}</div>`;
            }
        }
    }

    private async renderPage(pageNum: number): Promise<void> {
        if (!this.pdfDoc || !this.canvasContainer) return;

        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: this.zoomLevel });

            // Clear container
            this.canvasContainer.innerHTML = '';

            const canvas = document.createElement('canvas');
            canvas.className = 'xwui-pdf-viewer-canvas';
            const context = canvas.getContext('2d');
            if (!context) return;

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            this.canvasContainer.appendChild(canvas);

            this.currentPageNum = pageNum;
            this.data.currentPage = pageNum;
            this.updatePageInput();
            this.triggerChange();
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    }

    private previousPage(): void {
        if (this.currentPageNum > 1) {
            this.goToPage(this.currentPageNum - 1);
        }
    }

    private nextPage(): void {
        if (this.data.totalPages && this.currentPageNum < this.data.totalPages) {
            this.goToPage(this.currentPageNum + 1);
        }
    }

    private goToPage(page: number): void {
        if (this.data.totalPages && page >= 1 && page <= this.data.totalPages) {
            this.renderPage(page);
        }
    }

    private setZoom(zoom: number): void {
        this.zoomLevel = Math.max(0.5, Math.min(3, zoom));
        this.data.zoom = this.zoomLevel;
        this.updateZoomLabel();
        if (this.pdfDoc) {
            this.renderPage(this.currentPageNum);
        }
    }

    private updatePageLabel(): void {
        const label = this.toolbarElement?.querySelector('.xwui-pdf-viewer-page-label');
        if (label && this.data.totalPages) {
            label.textContent = `/ ${this.data.totalPages}`;
        }
    }

    private updatePageInput(): void {
        const input = this.toolbarElement?.querySelector('.xwui-pdf-viewer-page-input') as HTMLInputElement;
        if (input) {
            input.value = this.currentPageNum.toString();
            if (this.data.totalPages) {
                input.max = this.data.totalPages.toString();
            }
        }
    }

    private updateZoomLabel(): void {
        const label = this.toolbarElement?.querySelector('.xwui-pdf-viewer-zoom-label');
        if (label) {
            label.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }

    private triggerChange(): void {
        this.changeHandlers.forEach(handler => {
            handler(this.currentPageNum, this.data.totalPages || 0);
        });
    }

    public loadPDF(url: string): void {
        this.data.pdfUrl = url;
        this.data.pdfData = undefined;
        this.loadPDFInternal();
    }

    public loadPDFFromData(data: ArrayBuffer | Uint8Array): void {
        this.data.pdfData = data;
        this.data.pdfUrl = undefined;
        this.loadPDFInternal();
    }

    public onPageChange(handler: (page: number, total: number) => void): void {
        this.changeHandlers.push(handler);
    }

    public getCurrentPage(): number {
        return this.currentPageNum;
    }

    public getTotalPages(): number {
        return this.data.totalPages || 0;
    }

    /**
     * Setup keyboard and mouse shortcuts
     */
    private setupShortcuts(): void {
        // Ensure elements exist before setting up shortcuts
        if (!this.viewerElement || !this.canvasContainer) {
            return;
        }

        // Keyboard shortcuts
        this.keyboardHandler = (e: KeyboardEvent) => {
            // Don't handle shortcuts if user is typing in an input field
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            const ctrlKey = e.ctrlKey || e.metaKey;
            const shiftKey = e.shiftKey;

            // Zoom shortcuts
            if (ctrlKey) {
                if (e.key === '+' || e.key === '=' || e.code === 'Equal') {
                    e.preventDefault();
                    this.setZoom(this.zoomLevel * 1.1);
                    return;
                }
                if (e.key === '-' || e.code === 'Minus') {
                    e.preventDefault();
                    this.setZoom(this.zoomLevel * 0.9);
                    return;
                }
                if (e.key === '0' || e.code === 'Digit0') {
                    e.preventDefault();
                    this.resetZoom();
                    return;
                }
            }

            // Page navigation shortcuts
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousPage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextPage();
                    break;
                case 'PageUp':
                    e.preventDefault();
                    this.previousPage();
                    break;
                case 'PageDown':
                    e.preventDefault();
                    this.nextPage();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToPage(1);
                    break;
                case 'End':
                    e.preventDefault();
                    if (this.data.totalPages) {
                        this.goToPage(this.data.totalPages);
                    }
                    break;
                case ' ': // Space
                    // Only handle space if not in an input
                    if (!shiftKey) {
                        // Allow default scrolling behavior in most cases
                        // But if we're focused on the viewer, go to next page
                        if (document.activeElement === this.viewerElement) {
                            e.preventDefault();
                            this.nextPage();
                        }
                    } else {
                        e.preventDefault();
                        this.previousPage();
                    }
                    break;
            }
        };

        // Mouse wheel zoom (Ctrl + Scroll)
        this.wheelHandler = (e: WheelEvent) => {
            // Only zoom if Ctrl (or Cmd on Mac) is held
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                
                // Zoom based on scroll direction
                const delta = e.deltaY;
                if (delta < 0) {
                    // Scroll up - zoom in
                    this.setZoom(this.zoomLevel * 1.1);
                } else {
                    // Scroll down - zoom out
                    this.setZoom(this.zoomLevel * 0.9);
                }
            }
        };

        // Attach event listeners
        if (this.viewerElement) {
            this.viewerElement.addEventListener('keydown', this.keyboardHandler);
            this.viewerElement.addEventListener('wheel', this.wheelHandler, { passive: false });
        }

        // Also listen on the canvas container for mouse wheel
        if (this.canvasContainer) {
            this.canvasContainer.addEventListener('wheel', this.wheelHandler, { passive: false });
        }
    }

    /**
     * Reset zoom to default (100%)
     */
    private resetZoom(): void {
        this.setZoom(this.defaultZoomLevel);
    }

    /**
     * Cleanup event listeners
     */
    public destroy(): void {
        if (this.keyboardHandler && this.viewerElement) {
            this.viewerElement.removeEventListener('keydown', this.keyboardHandler);
        }
        if (this.wheelHandler) {
            if (this.viewerElement) {
                this.viewerElement.removeEventListener('wheel', this.wheelHandler);
            }
            if (this.canvasContainer) {
                this.canvasContainer.removeEventListener('wheel', this.wheelHandler);
            }
        }
        this.keyboardHandler = null;
        this.wheelHandler = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPDFViewer as any).componentName = 'XWUIPDFViewer';


