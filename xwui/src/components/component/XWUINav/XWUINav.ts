/**
 * XWUINav Component
 * Navigation controls for viewports: zoom, panning, rotation, and search
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';
import { XWUIButton } from '../XWUIButton/XWUIButton';

//================================================================================
// TYPES
//================================================================================

export interface ViewportState {
    x: number;           // Pan X
    y: number;           // Pan Y
    z?: number;          // Pan Z (for 3D)
    scale: number;       // Zoom level
    rotation?: number;   // Rotation in radians (2D)
    rotationX?: number;  // Rotation X in radians (3D)
    rotationY?: number;  // Rotation Y in radians (3D)
    rotationZ?: number;  // Rotation Z in radians (3D)
}

export interface SearchResult {
    id: string;
    label: string;
    position?: { x: number; y: number; z?: number };
    [key: string]: any;
}

export interface SearchHandler {
    search(query: string): SearchResult[];
    navigateTo(result: SearchResult): void;
}

// Component-level configuration
export interface XWUINavConfig {
    viewport: ViewportState;  // Shared viewport state (required)
    viewportMode?: '2d' | '3d';  // Default: '2d'
    
    // Feature toggles
    enablePanning?: boolean;
    enableZooming?: boolean;
    enableRotation?: boolean;
    enableSearch?: boolean;
    enableKeyboard?: boolean;
    enableTouch?: boolean;
    
    // Control UI
    showControls?: boolean;
    controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    
    // Pan/Zoom settings
    panStep?: number;           // Default: 50
    zoomFactor?: number;        // Default: 1.2
    minZoom?: number;           // Default: 0.1
    maxZoom?: number;           // Default: 10
    rotationStep?: number;      // Default: Math.PI / 18 (10 degrees)
    
    // Search settings
    searchHandler?: SearchHandler;  // Optional search handler
    searchPlaceholder?: string;     // Default: 'Search...'
    
    className?: string;
}

// Data type
export interface XWUINavData {
    // Navigation state can be read from viewport
}

export class XWUINav extends XWUIComponent<XWUINavData, XWUINavConfig> {
    private wrapperElement: HTMLElement | null = null;
    private controlsElement: HTMLElement | null = null;
    private searchElement: HTMLElement | null = null;
    private searchInput: HTMLInputElement | null = null;
    private searchResultsElement: HTMLElement | null = null;
    
    // Button elements
    private panUpBtn: HTMLButtonElement | null = null;
    private panDownBtn: HTMLButtonElement | null = null;
    private panLeftBtn: HTMLButtonElement | null = null;
    private panRightBtn: HTMLButtonElement | null = null;
    private zoomInBtn: HTMLButtonElement | null = null;
    private zoomOutBtn: HTMLButtonElement | null = null;
    private rotateCWBtn: HTMLButtonElement | null = null;
    private rotateCCWBtn: HTMLButtonElement | null = null;
    private resetViewBtn: HTMLButtonElement | null = null;
    
    // 3D controls (if 3D mode)
    private rotateXBtn: HTMLButtonElement | null = null;
    private rotateYBtn: HTMLButtonElement | null = null;
    private rotateZBtn: HTMLButtonElement | null = null;
    private panZUpBtn: HTMLButtonElement | null = null;
    private panZDownBtn: HTMLButtonElement | null = null;
    
    // Event handlers
    private boundHandleWheel: ((e: WheelEvent) => void) | null = null;
    private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;
    private boundHandleTouchStart: ((e: TouchEvent) => void) | null = null;
    private boundHandleTouchMove: ((e: TouchEvent) => void) | null = null;
    private boundHandleTouchEnd: ((e: TouchEvent) => void) | null = null;
    
    // Touch state
    private touchState: {
        isPanning: boolean;
        isZooming: boolean;
        lastTouches: TouchList | null;
        lastDistance: number;
        lastCenter: { x: number; y: number } | null;
    } = {
        isPanning: false,
        isZooming: false,
        lastTouches: null,
        lastDistance: 0,
        lastCenter: null
    };
    
    // Search state
    private searchResults: SearchResult[] = [];
    private searchTimeout: number | null = null;
    
    constructor(
        container: HTMLElement,
        data: XWUINavData = {},
        conf_comp: XWUINavConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupDOM();
        this.setupEventListeners();
    }
    
    protected createConfig(
        conf_comp?: XWUINavConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUINavConfig {
        if (!conf_comp || !conf_comp.viewport) {
            throw new Error('XWUINav requires viewport state');
        }
        
        return {
            viewport: conf_comp.viewport,
            viewportMode: conf_comp?.viewportMode ?? '2d',
            enablePanning: conf_comp?.enablePanning ?? true,
            enableZooming: conf_comp?.enableZooming ?? true,
            enableRotation: conf_comp?.enableRotation ?? false,
            enableSearch: conf_comp?.enableSearch ?? false,
            enableKeyboard: conf_comp?.enableKeyboard ?? true,
            enableTouch: conf_comp?.enableTouch ?? true,
            showControls: conf_comp?.showControls ?? true,
            controlsPosition: conf_comp?.controlsPosition ?? 'bottom-right',
            panStep: conf_comp?.panStep ?? 50,
            zoomFactor: conf_comp?.zoomFactor ?? 1.2,
            minZoom: conf_comp?.minZoom ?? 0.1,
            maxZoom: conf_comp?.maxZoom ?? 10,
            rotationStep: conf_comp?.rotationStep ?? Math.PI / 18,
            searchHandler: conf_comp?.searchHandler,
            searchPlaceholder: conf_comp?.searchPlaceholder ?? 'Search...',
            className: conf_comp?.className
        };
    }
    
    private setupDOM(): void {
        this.container.innerHTML = '';
        
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-nav';
        // Make wrapper non-blocking so clicks pass through to viewport
        this.wrapperElement.style.pointerEvents = 'none';
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }
        
        // Search bar (if enabled)
        if (this.config.enableSearch && this.config.searchHandler) {
            this.createSearchUI();
        }
        
        // Controls (if enabled)
        if (this.config.showControls) {
            this.createControls();
        }
        
        this.container.appendChild(this.wrapperElement);
    }
    
    private createSearchUI(): void {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'xwui-nav-search-container';
        // Make search container clickable (override wrapper's pointer-events: none)
        searchContainer.style.pointerEvents = 'auto';
        
        this.searchElement = document.createElement('div');
        this.searchElement.className = 'xwui-nav-search';
        
        // Search input
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.className = 'xwui-nav-search-input';
        this.searchInput.placeholder = this.config.searchPlaceholder;
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput((e.target as HTMLInputElement).value);
        });
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSearchResults();
            } else if (e.key === 'ArrowDown' && this.searchResults.length > 0) {
                e.preventDefault();
                this.selectSearchResult(0);
            } else if (e.key === 'Enter' && this.searchResults.length > 0) {
                e.preventDefault();
                this.navigateToSearchResult(this.searchResults[0]);
            }
        });
        
        // Search results
        this.searchResultsElement = document.createElement('div');
        this.searchResultsElement.className = 'xwui-nav-search-results';
        this.searchResultsElement.style.display = 'none';
        
        this.searchElement.appendChild(this.searchInput);
        this.searchElement.appendChild(this.searchResultsElement);
        searchContainer.appendChild(this.searchElement);
        
        this.wrapperElement!.appendChild(searchContainer);
    }
    
    private createControls(): void {
        this.controlsElement = document.createElement('div');
        this.controlsElement.className = 'xwui-nav-controls';
        // Make controls clickable (override wrapper's pointer-events: none)
        this.controlsElement.style.pointerEvents = 'auto';
        this.controlsElement.classList.add(`xwui-nav-controls-${this.config.controlsPosition}`);
        
        if (this.config.viewportMode === '3d') {
            this.create3DControls();
        } else {
            this.create2DControls();
        }
        
        this.wrapperElement!.appendChild(this.controlsElement);
    }
    
    private create2DControls(): void {
        const grid = document.createElement('div');
        grid.className = 'xwui-nav-controls-grid';
        
        // Top row: Rotate CCW, Pan Up, Rotate CW
        this.rotateCCWBtn = this.createButton('rotate-ccw', 'Rotate CCW', () => this.rotate(-1), !this.config.enableRotation);
        grid.appendChild(this.rotateCCWBtn);
        
        this.panUpBtn = this.createButton('arrow-up', 'Pan Up', () => this.pan(0, -1), !this.config.enablePanning);
        grid.appendChild(this.panUpBtn);
        
        this.rotateCWBtn = this.createButton('rotate-cw', 'Rotate CW', () => this.rotate(1), !this.config.enableRotation);
        grid.appendChild(this.rotateCWBtn);
        
        // Middle row: Pan Left, Reset, Pan Right
        this.panLeftBtn = this.createButton('arrow-left', 'Pan Left', () => this.pan(-1, 0), !this.config.enablePanning);
        grid.appendChild(this.panLeftBtn);
        
        this.resetViewBtn = this.createButton('home', 'Reset View', () => this.resetView(), false);
        grid.appendChild(this.resetViewBtn);
        
        this.panRightBtn = this.createButton('arrow-right', 'Pan Right', () => this.pan(1, 0), !this.config.enablePanning);
        grid.appendChild(this.panRightBtn);
        
        // Bottom row: Zoom Out, Pan Down, Zoom In
        this.zoomOutBtn = this.createButton('zoom-out', 'Zoom Out', () => this.zoom(-1), !this.config.enableZooming);
        grid.appendChild(this.zoomOutBtn);
        
        this.panDownBtn = this.createButton('arrow-down', 'Pan Down', () => this.pan(0, 1), !this.config.enablePanning);
        grid.appendChild(this.panDownBtn);
        
        this.zoomInBtn = this.createButton('zoom-in', 'Zoom In', () => this.zoom(1), !this.config.enableZooming);
        grid.appendChild(this.zoomInBtn);
        
        this.controlsElement!.appendChild(grid);
    }
    
    private create3DControls(): void {
        // For 3D, create extended controls with 3D rotation options
        const grid = document.createElement('div');
        grid.className = 'xwui-nav-controls-grid-3d';
        
        // First grid: Standard 2D-like controls
        const mainGrid = document.createElement('div');
        mainGrid.className = 'xwui-nav-controls-grid';
        
        // Top row: Rotate CCW, Pan Up, Rotate CW
        this.rotateCCWBtn = this.createButton('rotate-ccw', 'Rotate Z CCW', () => this.rotate(-1), !this.config.enableRotation);
        mainGrid.appendChild(this.rotateCCWBtn);
        
        this.panUpBtn = this.createButton('arrow-up', 'Pan Up', () => this.pan(0, -1), !this.config.enablePanning);
        mainGrid.appendChild(this.panUpBtn);
        
        this.rotateCWBtn = this.createButton('rotate-cw', 'Rotate Z CW', () => this.rotate(1), !this.config.enableRotation);
        mainGrid.appendChild(this.rotateCWBtn);
        
        // Middle row: Pan Left, Reset, Pan Right
        this.panLeftBtn = this.createButton('arrow-left', 'Pan Left', () => this.pan(-1, 0), !this.config.enablePanning);
        mainGrid.appendChild(this.panLeftBtn);
        
        this.resetViewBtn = this.createButton('home', 'Reset View', () => this.resetView(), false);
        mainGrid.appendChild(this.resetViewBtn);
        
        this.panRightBtn = this.createButton('arrow-right', 'Pan Right', () => this.pan(1, 0), !this.config.enablePanning);
        mainGrid.appendChild(this.panRightBtn);
        
        // Bottom row: Zoom Out, Pan Down, Zoom In
        this.zoomOutBtn = this.createButton('zoom-out', 'Zoom Out', () => this.zoom(-1), !this.config.enableZooming);
        mainGrid.appendChild(this.zoomOutBtn);
        
        this.panDownBtn = this.createButton('arrow-down', 'Pan Down', () => this.pan(0, 1), !this.config.enablePanning);
        mainGrid.appendChild(this.panDownBtn);
        
        this.zoomInBtn = this.createButton('zoom-in', 'Zoom In', () => this.zoom(1), !this.config.enableZooming);
        mainGrid.appendChild(this.zoomInBtn);
        
        grid.appendChild(mainGrid);
        
        // Additional 3D controls row (optional - for Z-axis pan and 3D rotations)
        if (this.config.enableRotation) {
            const extraRow = document.createElement('div');
            extraRow.className = 'xwui-nav-controls-row-3d';
            extraRow.style.display = 'grid';
            extraRow.style.gridTemplateColumns = 'repeat(3, 40px)';
            extraRow.style.gap = 'var(--spacing-xs, 0.25rem)';
            extraRow.style.marginTop = 'var(--spacing-xs, 0.25rem)';
            
            // Z-axis pan buttons (if needed)
            // Rotation around X, Y axes can be handled via drag in viewport
            extraRow.appendChild(document.createElement('div')); // placeholder
            extraRow.appendChild(document.createElement('div')); // placeholder
            extraRow.appendChild(document.createElement('div')); // placeholder
            
            grid.appendChild(extraRow);
        }
        
        this.controlsElement!.appendChild(grid);
    }
    
    private createButton(iconName: string, title: string, onClick: () => void, disabled: boolean = false): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.className = 'xwui-nav-control-btn';
        btn.type = 'button';
        btn.disabled = disabled;
        btn.setAttribute('aria-label', title);
        btn.title = title;
        
        // Create icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'xwui-nav-control-btn-icon';
        iconContainer.style.width = '20px';
        iconContainer.style.height = '20px';
        iconContainer.style.display = 'flex';
        iconContainer.style.alignItems = 'center';
        iconContainer.style.justifyContent = 'center';
        
        // Create XWUIIcon component
        const icon = new XWUIIcon(
            iconContainer,
            { name: iconName },
            {
                size: 20,
                variant: 'outline'
            }
        );
        this.registerChildComponent(icon);
        
        btn.appendChild(iconContainer);
        
        // Attach click handler
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) {
                onClick();
            }
        });
        
        return btn;
    }
    
    private setupEventListeners(): void {
        // Keyboard controls
        if (this.config.enableKeyboard) {
            this.boundHandleKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
            window.addEventListener('keydown', this.boundHandleKeyDown);
        }
        
        // Mouse wheel zoom
        if (this.config.enableZooming) {
            this.boundHandleWheel = (e: WheelEvent) => this.handleWheel(e);
            this.container.addEventListener('wheel', this.boundHandleWheel, { passive: false });
        }
        
        // Touch controls
        if (this.config.enableTouch) {
            this.boundHandleTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
            this.boundHandleTouchMove = (e: TouchEvent) => this.handleTouchMove(e);
            this.boundHandleTouchEnd = (e: TouchEvent) => this.handleTouchEnd(e);
            
            this.container.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });
            this.container.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
            this.container.addEventListener('touchend', this.boundHandleTouchEnd, { passive: false });
        }
    }
    
    //================================================================================
    // NAVIGATION ACTIONS
    //================================================================================
    
    private pan(dx: number, dy: number): void {
        if (!this.config.enablePanning) return;
        
        const step = this.config.panStep || 50;
        const panX = (step / this.config.viewport.scale) * dx;
        const panY = (step / this.config.viewport.scale) * dy;
        
        this.config.viewport.x += panX;
        this.config.viewport.y += panY;
        
        this.notifyViewportChange();
    }
    
    private zoom(direction: number): void {
        if (!this.config.enableZooming) return;
        
        const factor = this.config.zoomFactor || 1.2;
        const newScale = direction > 0 
            ? this.config.viewport.scale * factor
            : this.config.viewport.scale / factor;
        
        this.config.viewport.scale = Math.max(
            this.config.minZoom || 0.1,
            Math.min(this.config.maxZoom || 10, newScale)
        );
        
        this.notifyViewportChange();
    }
    
    private rotate(direction: number): void {
        if (!this.config.enableRotation) return;
        
        const step = this.config.rotationStep || Math.PI / 18;
        
        if (this.config.viewportMode === '3d') {
            // 3D rotation logic can be added here
            if (this.config.viewport.rotationY === undefined) {
                this.config.viewport.rotationY = 0;
            }
            this.config.viewport.rotationY += step * direction;
        } else {
            // 2D rotation
            if (this.config.viewport.rotation === undefined) {
                this.config.viewport.rotation = 0;
            }
            this.config.viewport.rotation += step * direction;
        }
        
        this.notifyViewportChange();
    }
    
    private resetView(): void {
        this.config.viewport.x = 0;
        this.config.viewport.y = 0;
        if (this.config.viewport.z !== undefined) {
            this.config.viewport.z = 0;
        }
        this.config.viewport.scale = 1;
        if (this.config.viewport.rotation !== undefined) {
            this.config.viewport.rotation = 0;
        }
        if (this.config.viewport.rotationX !== undefined) {
            this.config.viewport.rotationX = 0;
        }
        if (this.config.viewport.rotationY !== undefined) {
            this.config.viewport.rotationY = 0;
        }
        if (this.config.viewport.rotationZ !== undefined) {
            this.config.viewport.rotationZ = 0;
        }
        
        this.notifyViewportChange();
    }
    
    //================================================================================
    // EVENT HANDLERS
    //================================================================================
    
    private handleWheel(e: WheelEvent): void {
        if (!this.config.enableZooming) return;
        
        e.preventDefault();
        
        const factor = this.config.zoomFactor || 1.2;
        const delta = e.deltaY > 0 ? 1 / factor : factor;
        const newScale = this.config.viewport.scale * delta;
        
        this.config.viewport.scale = Math.max(
            this.config.minZoom || 0.1,
            Math.min(this.config.maxZoom || 10, newScale)
        );
        
        this.notifyViewportChange();
    }
    
    private handleKeyDown(e: KeyboardEvent): void {
        // Only handle if no input is focused
        if (document.activeElement?.tagName === 'INPUT' || 
            document.activeElement?.tagName === 'TEXTAREA') {
            return;
        }
        
        if (!this.config.enablePanning && !this.config.enableZooming) return;
        
        const panStep = this.config.panStep || 50;
        const zoomFactor = this.config.zoomFactor || 1.2;
        
        switch (e.key) {
            case 'ArrowUp':
                if (this.config.enablePanning) {
                    e.preventDefault();
                    this.pan(0, -1);
                }
                break;
            case 'ArrowDown':
                if (this.config.enablePanning) {
                    e.preventDefault();
                    this.pan(0, 1);
                }
                break;
            case 'ArrowLeft':
                if (this.config.enablePanning) {
                    e.preventDefault();
                    this.pan(-1, 0);
                }
                break;
            case 'ArrowRight':
                if (this.config.enablePanning) {
                    e.preventDefault();
                    this.pan(1, 0);
                }
                break;
            case '+':
            case '=':
                if (this.config.enableZooming) {
                    e.preventDefault();
                    this.zoom(1);
                }
                break;
            case '-':
            case '_':
                if (this.config.enableZooming) {
                    e.preventDefault();
                    this.zoom(-1);
                }
                break;
            case '0':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.resetView();
                }
                break;
        }
    }
    
    private handleTouchStart(e: TouchEvent): void {
        if (e.touches.length === 1) {
            // Single touch - pan
            this.touchState.isPanning = true;
            this.touchState.lastTouches = e.touches;
        } else if (e.touches.length === 2) {
            // Two touches - zoom
            this.touchState.isZooming = true;
            this.touchState.lastTouches = e.touches;
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            this.touchState.lastDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            this.touchState.lastCenter = {
                x: (touch1.clientX + touch2.clientX) / 2,
                y: (touch1.clientY + touch2.clientY) / 2
            };
        }
    }
    
    private handleTouchMove(e: TouchEvent): void {
        e.preventDefault();
        
        if (this.touchState.isPanning && e.touches.length === 1 && this.touchState.lastTouches) {
            // Pan
            const touch = e.touches[0];
            const lastTouch = this.touchState.lastTouches[0];
            const dx = touch.clientX - lastTouch.clientX;
            const dy = touch.clientY - lastTouch.clientY;
            
            this.config.viewport.x -= dx / this.config.viewport.scale;
            this.config.viewport.y -= dy / this.config.viewport.scale;
            
            this.touchState.lastTouches = e.touches;
            this.notifyViewportChange();
        } else if (this.touchState.isZooming && e.touches.length === 2 && this.touchState.lastTouches) {
            // Zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const scaleChange = distance / this.touchState.lastDistance;
            this.config.viewport.scale *= scaleChange;
            this.config.viewport.scale = Math.max(
                this.config.minZoom || 0.1,
                Math.min(this.config.maxZoom || 10, this.config.viewport.scale)
            );
            
            this.touchState.lastDistance = distance;
            this.touchState.lastTouches = e.touches;
            this.notifyViewportChange();
        }
    }
    
    private handleTouchEnd(e: TouchEvent): void {
        if (e.touches.length === 0) {
            this.touchState.isPanning = false;
            this.touchState.isZooming = false;
            this.touchState.lastTouches = null;
        } else if (e.touches.length === 1) {
            // Switch from zoom to pan
            this.touchState.isZooming = false;
            this.touchState.isPanning = true;
            this.touchState.lastTouches = e.touches;
        }
    }
    
    //================================================================================
    // SEARCH FUNCTIONALITY
    //================================================================================
    
    private handleSearchInput(query: string): void {
        if (!this.config.searchHandler) return;
        
        // Clear previous timeout
        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
        }
        
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }
        
        // Debounce search
        this.searchTimeout = window.setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }
    
    private performSearch(query: string): void {
        if (!this.config.searchHandler) return;
        
        this.searchResults = this.config.searchHandler.search(query);
        this.displaySearchResults();
    }
    
    private displaySearchResults(): void {
        if (!this.searchResultsElement) return;
        
        if (this.searchResults.length === 0) {
            this.searchResultsElement.innerHTML = '<div class="xwui-nav-search-no-results">No results found</div>';
        } else {
            this.searchResultsElement.innerHTML = this.searchResults.map((result, index) => 
                `<div class="xwui-nav-search-result" data-index="${index}">${result.label}</div>`
            ).join('');
            
            // Add click handlers
            this.searchResultsElement.querySelectorAll('.xwui-nav-search-result').forEach((el, index) => {
                el.addEventListener('click', () => {
                    this.navigateToSearchResult(this.searchResults[index]);
                });
            });
        }
        
        this.searchResultsElement.style.display = 'block';
    }
    
    private selectSearchResult(index: number): void {
        // Highlight selected result
        // Implementation can be added
    }
    
    private navigateToSearchResult(result: SearchResult): void {
        if (!this.config.searchHandler) return;
        
        this.config.searchHandler.navigateTo(result);
        this.hideSearchResults();
        
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
    
    private hideSearchResults(): void {
        if (this.searchResultsElement) {
            this.searchResultsElement.style.display = 'none';
        }
        this.searchResults = [];
    }
    
    //================================================================================
    // UTILITIES
    //================================================================================
    
    private notifyViewportChange(): void {
        // Dispatch custom event for viewport changes
        const event = new CustomEvent('viewport-change', {
            detail: { viewport: this.config.viewport }
        });
        this.container.dispatchEvent(event);
    }
    
    public destroy(): void {
        // Remove event listeners
        if (this.boundHandleKeyDown) {
            window.removeEventListener('keydown', this.boundHandleKeyDown);
            this.boundHandleKeyDown = null;
        }
        
        if (this.boundHandleWheel) {
            this.container.removeEventListener('wheel', this.boundHandleWheel);
            this.boundHandleWheel = null;
        }
        
        if (this.boundHandleTouchStart) {
            this.container.removeEventListener('touchstart', this.boundHandleTouchStart);
            this.boundHandleTouchStart = null;
        }
        
        if (this.boundHandleTouchMove) {
            this.container.removeEventListener('touchmove', this.boundHandleTouchMove);
            this.boundHandleTouchMove = null;
        }
        
        if (this.boundHandleTouchEnd) {
            this.container.removeEventListener('touchend', this.boundHandleTouchEnd);
            this.boundHandleTouchEnd = null;
        }
        
        // Clear search timeout
        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
        
        // Clear references
        this.wrapperElement = null;
        this.controlsElement = null;
        this.searchElement = null;
        this.searchInput = null;
        this.searchResultsElement = null;
        this.panUpBtn = null;
        this.panDownBtn = null;
        this.panLeftBtn = null;
        this.panRightBtn = null;
        this.zoomInBtn = null;
        this.zoomOutBtn = null;
        this.rotateCWBtn = null;
        this.rotateCCWBtn = null;
        this.resetViewBtn = null;
        
        super.destroy();
    }
}

(XWUINav as any).componentName = 'XWUINav';

