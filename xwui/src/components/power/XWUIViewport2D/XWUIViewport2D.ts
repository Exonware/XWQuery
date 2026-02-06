/**
 * XWUIViewport2D Component
 * 2D viewport with transform system, coordinate conversion, and canvas rendering
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUINav, type ViewportState } from '../XWUINav/XWUINav';
import { XWUIShortcuts, type ShortcutsConfig } from '../XWUIShortcuts/XWUIShortcuts';
import shortcutsConfig from './shortcuts.json';

//================================================================================
// TYPES
//================================================================================

/**
 * Shape point for polygon/custom shapes
 */
export interface ShapePoint {
    x: number;
    y: number;
}

/**
 * Shape class for modular shape editing
 */
export class Shape {
    public points: ShapePoint[];
    
    constructor(points: ShapePoint[] = []) {
        this.points = points;
    }
    
    /**
     * Add a point to the shape
     */
    addPoint(point: ShapePoint): void {
        this.points.push(point);
    }
    
    /**
     * Insert a point at a specific index
     */
    insertPoint(index: number, point: ShapePoint): void {
        this.points.splice(index, 0, point);
    }
    
    /**
     * Remove a point at a specific index
     */
    removePoint(index: number): void {
        if (this.points.length > 0) {
            this.points.splice(index, 1);
        }
    }
    
    /**
     * Update a point at a specific index
     */
    updatePoint(index: number, point: ShapePoint): void {
        if (index >= 0 && index < this.points.length) {
            this.points[index] = point;
        }
    }
    
    /**
     * Get bounding box of the shape
     */
    getBoundingBox(): { x: number; y: number; width: number; height: number } {
        if (this.points.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        
        let minX = this.points[0].x;
        let minY = this.points[0].y;
        let maxX = this.points[0].x;
        let maxY = this.points[0].y;
        
        for (const point of this.points) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    
    /**
     * Check if a point is inside the shape (using ray casting algorithm)
     */
    isPointInside(point: { x: number; y: number }): boolean {
        if (this.points.length < 3) return false;
        
        let inside = false;
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const xi = this.points[i].x;
            const yi = this.points[i].y;
            const xj = this.points[j].x;
            const yj = this.points[j].y;
            
            const intersect = ((yi > point.y) !== (yj > point.y)) &&
                (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
    
    /**
     * Find the closest point on any edge to the given point
     */
    findClosestEdgePoint(point: { x: number; y: number }): { point: ShapePoint; segmentIndex: number; t: number } | null {
        if (this.points.length < 2) return null;
        
        let closestDist = Infinity;
        let closestPoint: ShapePoint | null = null;
        let closestSegmentIndex = -1;
        let closestT = 0;
        
        for (let i = 0; i < this.points.length; i++) {
            const p1 = this.points[i];
            const p2 = this.points[(i + 1) % this.points.length];
            
            // Calculate closest point on line segment
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const lengthSq = dx * dx + dy * dy;
            
            if (lengthSq === 0) continue;
            
            const t = Math.max(0, Math.min(1, ((point.x - p1.x) * dx + (point.y - p1.y) * dy) / lengthSq));
            const projX = p1.x + t * dx;
            const projY = p1.y + t * dy;
            
            const dist = Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
            if (dist < closestDist) {
                closestDist = dist;
                closestPoint = { x: projX, y: projY };
                closestSegmentIndex = i;
                closestT = t;
            }
        }
        
        if (closestPoint) {
            return { point: closestPoint, segmentIndex: closestSegmentIndex, t: closestT };
        }
        return null;
    }
}

export interface Viewport2DObject {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;  // Rotation in radians
    color?: string;
    label?: string;
    zIndex?: number;    // Z-order for layering (higher = on top)
    shape?: Shape;      // Optional shape for custom polygon shapes
    isShape?: boolean;  // Flag to indicate this is a shape object
}

    // Component-level configuration
export interface XWUIViewport2DConfig {
    initialX?: number;         // Default: 0
    initialY?: number;         // Default: 0
    initialScale?: number;     // Default: 1
    initialRotation?: number;  // Default: 0
    minScale?: number;         // Default: 0.1
    maxScale?: number;         // Default: 10
    
    // Navigation
    enableNavigation?: boolean;  // Default: true
    navControlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    
    // Grid and guidelines
    showGrid?: boolean;         // Default: true
    gridSize?: number;          // Default: 50
    gridColor?: string;         // Default: #e0e0e0
    gridSubdivisions?: number;  // Default: 5 (smaller grid lines)
    snapToGrid?: number;        // Default: 0 (0 = disabled, >0 = snap to this pixel value)
    showGuidelines?: boolean;   // Default: false
    guidelines?: Array<{ x?: number; y?: number; orientation: 'horizontal' | 'vertical' }>; // Default: []
    guidelineColor?: string;    // Default: #ffcc00
    snapToGuidelines?: number;  // Default: 0 (0 = disabled, >0 = snap threshold in pixels)
    
    // Rulers
    showRulers?: boolean;       // Default: true
    rulerSize?: number;         // Default: 30 (height/width of ruler)
    rulerColor?: string;        // Default: #f0f0f0
    
    // Object manipulation
    enableObjectManipulation?: boolean;  // Default: true
    enableObjectSelection?: boolean;     // Default: true
    enableObjectResize?: boolean;        // Default: true
    enableObjectRotation?: boolean;      // Default: true
    
    // Shape editing
    enableShapeEditing?: boolean;        // Default: false
    shapePointSize?: number;              // Default: 6 (size of shape point handles)
    
    className?: string;
}

// Data type
export interface XWUIViewport2DData {
    objects?: Viewport2DObject[];
}

export class XWUIViewport2D extends XWUIComponent<XWUIViewport2DData, XWUIViewport2DConfig> {
    private wrapperElement: HTMLElement | null = null;
    private canvasElement: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    
    // Viewport state
    public viewport: ViewportState;
    
    // Navigation component
    private nav: XWUINav | null = null;
    
    // Shortcuts component
    private shortcuts: XWUIShortcuts | null = null;
    
    // Clipboard for copy/cut/paste
    private clipboard: Viewport2DObject[] = [];
    private undoStack: Array<{ objects: Map<string, Viewport2DObject>; selectedIds: Set<string> }> = [];
    private redoStack: Array<{ objects: Map<string, Viewport2DObject>; selectedIds: Set<string> }> = [];
    
    // Objects
    private objects: Map<string, Viewport2DObject> = new Map();
    private selectedObjectIds: Set<string> = new Set();
    
    // Paste tracking for offset calculation
    private pasteCount: number = 0;
    
    // Interaction state
    private isDragging: boolean = false;
    private dragStart: { x: number; y: number } | null = null;
    private draggedObjectId: string | null = null;
    private isPanning: boolean = false;
    private panStart: { x: number; y: number } | null = null;
    private spacePressed: boolean = false; // For space+drag panning
    private lastMouseWorldPos: { x: number; y: number } | null = null; // For ruler mouse indicator
    
    // Object manipulation state
    private isResizing: boolean = false;
    private resizeHandle: string | null = null; // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
    private resizeStartState: { centerX: number; centerY: number; width: number; height: number; rotation: number } | null = null;
    private resizeModifiers: { ctrlKey: boolean; shiftKey: boolean } = { ctrlKey: false, shiftKey: false };
    private isRotating: boolean = false;
    private rotateStartAngle: number = 0;
    
    // Shape editing state
    private isEditingShape: boolean = false;
    private editingShapeId: string | null = null;
    private editingPointIndex: number | null = null;
    private isDraggingPoint: boolean = false;
    private pointDragStart: { x: number; y: number } | null = null;
    
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
    
    // Rulers
    private topRulerCanvas: HTMLCanvasElement | null = null;
    private leftRulerCanvas: HTMLCanvasElement | null = null;
    private bottomRulerCanvas: HTMLCanvasElement | null = null;
    private rightRulerCanvas: HTMLCanvasElement | null = null;
    private topRulerCtx: CanvasRenderingContext2D | null = null;
    private leftRulerCtx: CanvasRenderingContext2D | null = null;
    private bottomRulerCtx: CanvasRenderingContext2D | null = null;
    private rightRulerCtx: CanvasRenderingContext2D | null = null;
    
    // Render throttling
    private renderScheduled: boolean = false;
    private renderRequestId: number | null = null;
    
    // Event handlers
    private boundHandleMouseDown: ((e: MouseEvent) => void) | null = null;
    private boundHandleMouseMove: ((e: MouseEvent) => void) | null = null;
    private boundHandleMouseUp: ((e: MouseEvent) => void) | null = null;
    private boundHandleWheel: ((e: WheelEvent) => void) | null = null;
    private boundHandleTouchStart: ((e: TouchEvent) => void) | null = null;
    private boundHandleTouchMove: ((e: TouchEvent) => void) | null = null;
    private boundHandleTouchEnd: ((e: TouchEvent) => void) | null = null;
    private boundHandleViewportChange: ((e: CustomEvent) => void) | null = null;
    private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;
    private boundHandleKeyUp: ((e: KeyboardEvent) => void) | null = null;
    private boundHandleAuxClick: ((e: MouseEvent) => void) | null = null;
    private boundHandleNavResetClick: ((e: MouseEvent) => void) | null = null;
    
    constructor(
        container: HTMLElement,
        data: XWUIViewport2DData = {},
        conf_comp: XWUIViewport2DConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Initialize viewport state
        this.viewport = {
            x: conf_comp.initialX ?? 0,
            y: conf_comp.initialY ?? 0,
            scale: conf_comp.initialScale ?? 1,
            rotation: conf_comp.initialRotation ?? 0
        };
        
        this.initializeObjects();
        this.setupDOM();
        this.setupEventListeners();
        this.render();
    }
    
    protected createConfig(
        conf_comp?: XWUIViewport2DConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIViewport2DConfig {
        return {
            initialX: conf_comp?.initialX ?? 0,
            initialY: conf_comp?.initialY ?? 0,
            initialScale: conf_comp?.initialScale ?? 1,
            initialRotation: conf_comp?.initialRotation ?? 0,
            minScale: conf_comp?.minScale ?? 0.1,
            maxScale: conf_comp?.maxScale ?? 10,
            enableNavigation: conf_comp?.enableNavigation ?? true,
            navControlsPosition: conf_comp?.navControlsPosition ?? 'bottom-right',
            showGrid: conf_comp?.showGrid ?? true,
            gridSize: conf_comp?.gridSize ?? 50,
            snapToGrid: conf_comp?.snapToGrid ?? 0,
            gridColor: conf_comp?.gridColor ?? '#e0e0e0',
            gridSubdivisions: conf_comp?.gridSubdivisions ?? 5,
            showGuidelines: conf_comp?.showGuidelines ?? false,
            guidelines: conf_comp?.guidelines ?? [],
            guidelineColor: conf_comp?.guidelineColor ?? '#ffcc00',
            snapToGuidelines: conf_comp?.snapToGuidelines ?? 0,
            showRulers: conf_comp?.showRulers ?? true,
            rulerSize: conf_comp?.rulerSize ?? 30,
            rulerColor: conf_comp?.rulerColor ?? '#f0f0f0',
            enableObjectManipulation: conf_comp?.enableObjectManipulation ?? true,
            enableObjectSelection: conf_comp?.enableObjectSelection ?? true,
            enableObjectResize: conf_comp?.enableObjectResize ?? true,
            enableObjectRotation: conf_comp?.enableObjectRotation ?? true,
            enableShapeEditing: conf_comp?.enableShapeEditing ?? false,
            shapePointSize: conf_comp?.shapePointSize ?? 6,
            className: conf_comp?.className
        };
    }
    
    private initializeObjects(): void {
        if (this.data.objects) {
            this.data.objects.forEach((obj, index) => {
                // Assign zIndex based on insertion order if not provided
                const objectWithZ = { ...obj };
                if (objectWithZ.zIndex === undefined) {
                    objectWithZ.zIndex = index;
                }
                this.objects.set(objectWithZ.id, objectWithZ);
            });
        }
    }
    
    private setupDOM(): void {
        this.container.innerHTML = '';
        
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-viewport2d';
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }
        
        // Create rulers container if enabled
        if (this.config.showRulers) {
            const rulerSize = this.config.rulerSize || 30;
            
            // Corner piece (top-left)
            const corner = document.createElement('div');
            corner.className = 'xwui-viewport2d-ruler-corner';
            corner.style.position = 'absolute';
            corner.style.top = '0';
            corner.style.left = '0';
            corner.style.width = `${rulerSize}px`;
            corner.style.height = `${rulerSize}px`;
            corner.style.zIndex = '6';
            corner.style.backgroundColor = this.config.rulerColor || '#f0f0f0';
            corner.style.borderRight = '1px solid var(--color-border, #e0e0e0)';
            corner.style.borderBottom = '1px solid var(--color-border, #e0e0e0)';
            
            // Top ruler (between left and right rulers) - 14% shorter
            this.topRulerCanvas = document.createElement('canvas');
            this.topRulerCanvas.className = 'xwui-viewport2d-ruler-top';
            this.topRulerCanvas.style.position = 'absolute';
            this.topRulerCanvas.style.top = '0';
            this.topRulerCanvas.style.left = `${rulerSize}px`;
            // Make 14% shorter: use calc to make it 86% of available width
            // Available width = 100% - left ruler - right ruler = 100% - 2*rulerSize
            // 86% of that = calc((100% - ${rulerSize * 2}px) * 0.86)
            // But simpler: use right with 14% of container width + right ruler size
            this.topRulerCanvas.style.right = `calc(${rulerSize}px + 14%)`;
            this.topRulerCanvas.style.height = `${rulerSize}px`;
            this.topRulerCanvas.style.zIndex = '5';
            this.topRulerCanvas.style.pointerEvents = 'auto';
            this.topRulerCanvas.style.cursor = 'crosshair';
            const topCtx = this.topRulerCanvas.getContext('2d');
            if (topCtx) {
                this.topRulerCtx = topCtx;
            }
            
            // Left ruler (between top and bottom rulers)
            this.leftRulerCanvas = document.createElement('canvas');
            this.leftRulerCanvas.className = 'xwui-viewport2d-ruler-left';
            this.leftRulerCanvas.style.position = 'absolute';
            this.leftRulerCanvas.style.top = `${rulerSize}px`;
            this.leftRulerCanvas.style.left = '0';
            this.leftRulerCanvas.style.bottom = `${rulerSize}px`;
            this.leftRulerCanvas.style.width = `${rulerSize}px`;
            this.leftRulerCanvas.style.zIndex = '5';
            this.leftRulerCanvas.style.pointerEvents = 'auto';
            this.leftRulerCanvas.style.cursor = 'crosshair';
            const leftCtx = this.leftRulerCanvas.getContext('2d');
            if (leftCtx) {
                this.leftRulerCtx = leftCtx;
            }
            
            // Bottom ruler (between left and right rulers) - 14% shorter
            this.bottomRulerCanvas = document.createElement('canvas');
            this.bottomRulerCanvas.className = 'xwui-viewport2d-ruler-bottom';
            this.bottomRulerCanvas.style.position = 'absolute';
            this.bottomRulerCanvas.style.bottom = '0';
            this.bottomRulerCanvas.style.left = `${rulerSize}px`;
            // Make 14% shorter: same as top ruler
            this.bottomRulerCanvas.style.right = `calc(${rulerSize}px + 14%)`;
            this.bottomRulerCanvas.style.height = `${rulerSize}px`;
            this.bottomRulerCanvas.style.zIndex = '5';
            this.bottomRulerCanvas.style.pointerEvents = 'auto';
            this.bottomRulerCanvas.style.cursor = 'crosshair';
            const bottomCtx = this.bottomRulerCanvas.getContext('2d');
            if (bottomCtx) {
                this.bottomRulerCtx = bottomCtx;
            }
            
            // Right ruler (between top and bottom rulers)
            this.rightRulerCanvas = document.createElement('canvas');
            this.rightRulerCanvas.className = 'xwui-viewport2d-ruler-right';
            this.rightRulerCanvas.style.position = 'absolute';
            this.rightRulerCanvas.style.top = `${rulerSize}px`;
            this.rightRulerCanvas.style.right = '0';
            this.rightRulerCanvas.style.bottom = `${rulerSize}px`;
            this.rightRulerCanvas.style.width = `${rulerSize}px`;
            this.rightRulerCanvas.style.zIndex = '5';
            this.rightRulerCanvas.style.pointerEvents = 'auto';
            this.rightRulerCanvas.style.cursor = 'crosshair';
            const rightCtx = this.rightRulerCanvas.getContext('2d');
            if (rightCtx) {
                this.rightRulerCtx = rightCtx;
            }
            
            // Corner pieces for other corners
            const cornerTopRight = document.createElement('div');
            cornerTopRight.className = 'xwui-viewport2d-ruler-corner';
            cornerTopRight.style.position = 'absolute';
            cornerTopRight.style.top = '0';
            cornerTopRight.style.right = '0';
            cornerTopRight.style.width = `${rulerSize}px`;
            cornerTopRight.style.height = `${rulerSize}px`;
            cornerTopRight.style.zIndex = '6';
            cornerTopRight.style.backgroundColor = this.config.rulerColor || '#f0f0f0';
            cornerTopRight.style.borderLeft = '1px solid var(--color-border, #e0e0e0)';
            cornerTopRight.style.borderBottom = '1px solid var(--color-border, #e0e0e0)';
            
            const cornerBottomLeft = document.createElement('div');
            cornerBottomLeft.className = 'xwui-viewport2d-ruler-corner';
            cornerBottomLeft.style.position = 'absolute';
            cornerBottomLeft.style.bottom = '0';
            cornerBottomLeft.style.left = '0';
            cornerBottomLeft.style.width = `${rulerSize}px`;
            cornerBottomLeft.style.height = `${rulerSize}px`;
            cornerBottomLeft.style.zIndex = '6';
            cornerBottomLeft.style.backgroundColor = this.config.rulerColor || '#f0f0f0';
            cornerBottomLeft.style.borderRight = '1px solid var(--color-border, #e0e0e0)';
            cornerBottomLeft.style.borderTop = '1px solid var(--color-border, #e0e0e0)';
            
            const cornerBottomRight = document.createElement('div');
            cornerBottomRight.className = 'xwui-viewport2d-ruler-corner';
            cornerBottomRight.style.position = 'absolute';
            cornerBottomRight.style.bottom = '0';
            cornerBottomRight.style.right = '0';
            cornerBottomRight.style.width = `${rulerSize}px`;
            cornerBottomRight.style.height = `${rulerSize}px`;
            cornerBottomRight.style.zIndex = '6';
            cornerBottomRight.style.backgroundColor = this.config.rulerColor || '#f0f0f0';
            cornerBottomRight.style.borderLeft = '1px solid var(--color-border, #e0e0e0)';
            cornerBottomRight.style.borderTop = '1px solid var(--color-border, #e0e0e0)';
            
            this.wrapperElement.appendChild(corner);
            this.wrapperElement.appendChild(cornerTopRight);
            this.wrapperElement.appendChild(cornerBottomLeft);
            this.wrapperElement.appendChild(cornerBottomRight);
            this.wrapperElement.appendChild(this.topRulerCanvas);
            this.wrapperElement.appendChild(this.leftRulerCanvas);
            this.wrapperElement.appendChild(this.bottomRulerCanvas);
            this.wrapperElement.appendChild(this.rightRulerCanvas);
            
            // Add click handlers to create guidelines
            this.topRulerCanvas.addEventListener('click', (e) => this.handleRulerClick(e, 'top'));
            this.bottomRulerCanvas.addEventListener('click', (e) => this.handleRulerClick(e, 'bottom'));
            this.leftRulerCanvas.addEventListener('click', (e) => this.handleRulerClick(e, 'left'));
            this.rightRulerCanvas.addEventListener('click', (e) => this.handleRulerClick(e, 'right'));
        }
        
        // Create canvas
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.className = 'xwui-viewport2d-canvas';
        this.canvasElement.style.width = '100%';
        this.canvasElement.style.height = '100%';
        this.canvasElement.style.display = 'block';
        this.canvasElement.style.cursor = 'default';
        // Make canvas focusable for shortcuts
        this.canvasElement.setAttribute('tabindex', '0');
        
        // Adjust canvas position if rulers are shown (margins on all sides)
        if (this.config.showRulers) {
            const rulerSize = this.config.rulerSize || 30;
            this.canvasElement.style.marginTop = `${rulerSize}px`;
            this.canvasElement.style.marginLeft = `${rulerSize}px`;
            this.canvasElement.style.marginBottom = `${rulerSize}px`;
            this.canvasElement.style.marginRight = `${rulerSize}px`;
        }
        
        const ctx = this.canvasElement.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D rendering context');
        }
        this.ctx = ctx;
        
        this.wrapperElement.appendChild(this.canvasElement);
        
        // Add navigation controls
        if (this.config.enableNavigation) {
            const navContainer = document.createElement('div');
            navContainer.className = 'xwui-viewport2d-nav-container xwui-nav-controls xwui-nav-controls-bottom-right';
            navContainer.style.position = 'absolute';
            navContainer.style.width = '100%';
            navContainer.style.height = '100%';
            navContainer.style.pointerEvents = 'none';
            navContainer.style.top = '0';
            navContainer.style.left = '0';
            navContainer.style.zIndex = '10';
            
            this.nav = new XWUINav(navContainer, {}, {
                viewport: this.viewport,
                viewportMode: '2d',
                enablePanning: true,
                enableZooming: true,
                enableRotation: true,
                enableKeyboard: true,
                enableTouch: false, // Touch handled by viewport canvas
                showControls: true,
                controlsPosition: this.config.navControlsPosition || 'bottom-right',
                minZoom: this.config.minScale,
                maxZoom: this.config.maxScale
            });
            this.registerChildComponent(this.nav);
            
            // Override the reset button (middle/home button) to frame all objects
            // Use event delegation to catch the click after nav is initialized
            this.boundHandleNavResetClick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                // Check if the clicked element or its parent is the reset button
                const resetButton = target.closest('button[title="Reset View"]') as HTMLButtonElement;
                if (resetButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.frameAll();
                }
            };
            
            // Use capture phase to intercept before nav's handler
            navContainer.addEventListener('click', this.boundHandleNavResetClick, true);
            
            this.wrapperElement.appendChild(navContainer);
        }
        
        // Setup shortcuts
        this.setupShortcuts();
        
        this.container.appendChild(this.wrapperElement);
        
        // Resize canvas - use double requestAnimationFrame to ensure DOM is fully laid out
        // This is especially important when rulers are shown, as margins need to be applied first
        // First frame: DOM elements are added
        requestAnimationFrame(() => {
            // Second frame: Layout is calculated and margins are applied
            requestAnimationFrame(() => {
                this.resizeCanvas();
            });
        });
        
        // Listen for window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    private setupShortcuts(): void {
        if (!this.canvasElement) return;
        
        // Create shortcuts container
        const shortcutsContainer = document.createElement('div');
        shortcutsContainer.className = 'xwui-viewport2d-shortcuts';
        shortcutsContainer.style.position = 'absolute';
        shortcutsContainer.style.width = '100%';
        shortcutsContainer.style.height = '100%';
        shortcutsContainer.style.pointerEvents = 'none';
        
        this.shortcuts = new XWUIShortcuts(shortcutsContainer, {}, {
            shortcuts: shortcutsConfig.shortcuts as ShortcutsConfig,
            targetElement: this.canvasElement,
            mode: '2d',
            enableFocusDetection: true,
            preventDefault: true
        });
        this.registerChildComponent(this.shortcuts);
        
        // Register action handlers
        this.registerShortcutHandlers();
        
        this.wrapperElement!.appendChild(shortcutsContainer);
    }
    
    private registerShortcutHandlers(): void {
        if (!this.shortcuts) return;
        
        // File operations
        this.shortcuts.onAction('copy', () => {
            this.copySelection();
            return true;
        });
        
        this.shortcuts.onAction('cut', () => {
            this.cutSelection();
            return true;
        });
        
        this.shortcuts.onAction('paste', () => {
            this.pasteSelection();
            return true;
        });
        
        this.shortcuts.onAction('undo', () => {
            this.undo();
            return true;
        });
        
        this.shortcuts.onAction('redo', () => {
            this.redo();
            return true;
        });
        
        this.shortcuts.onAction('selectAll', () => {
            this.selectAll();
            return true;
        });
        
        this.shortcuts.onAction('duplicate', () => {
            this.duplicateSelection();
            return true;
        });
        
        this.shortcuts.onAction('deleteSelection', () => {
            this.deleteSelection();
            return true;
        });
        
        this.shortcuts.onAction('deleteBackwards', () => {
            this.deleteSelection();
            return true;
        });
        
        // Navigation
        this.shortcuts.onAction('frameSelected', () => {
            this.frameSelected();
            return true;
        });
        
        this.shortcuts.onAction('frameAll', () => {
            this.frameAll();
            return true;
        });
        
        // Viewport
        this.shortcuts.onAction('toggleGrid', () => {
            this.config.showGrid = !this.config.showGrid;
            this.render();
            return true;
        });
        
        this.shortcuts.onAction('increaseGridSize', () => {
            this.config.gridSize = (this.config.gridSize || 50) + 10;
            this.render();
            return true;
        });
        
        this.shortcuts.onAction('decreaseGridSize', () => {
            this.config.gridSize = Math.max(10, (this.config.gridSize || 50) - 10);
            this.render();
            return true;
        });
        
        // Transform modes (W, E, R, T) - these are handled by visual feedback, not implemented yet
        this.shortcuts.onAction('move', () => {
            // Set transform mode to move (visual feedback)
            return true;
        });
        
        this.shortcuts.onAction('rotate', () => {
            // Set transform mode to rotate (visual feedback)
            return true;
        });
        
        this.shortcuts.onAction('scale', () => {
            // Set transform mode to scale (visual feedback)
            return true;
        });
    }
    
    //================================================================================
    // SHORTCUT ACTION IMPLEMENTATIONS
    //================================================================================
    
    private saveState(): void {
        // Save current state to undo stack
        const state = {
            objects: new Map(this.objects),
            selectedIds: new Set(this.selectedObjectIds)
        };
        this.undoStack.push(state);
        // Limit undo stack size
        if (this.undoStack.length > 50) {
            this.undoStack.shift();
        }
        // Clear redo stack when new action is performed
        this.redoStack = [];
    }
    
    private copySelection(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        this.clipboard = [];
        for (const id of this.selectedObjectIds) {
            const obj = this.objects.get(id);
            if (obj) {
                this.clipboard.push({ ...obj });
            }
        }
        // Reset paste count when copying new selection
        this.pasteCount = 0;
    }
    
    private cutSelection(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        this.saveState();
        this.copySelection();
        this.deleteSelection();
    }
    
    private pasteSelection(): void {
        if (this.clipboard.length === 0) return;
        
        this.saveState();
        
        // Increment paste count for offset calculation
        this.pasteCount++;
        
        // Calculate offset based on paste count
        // Use a spiral pattern: first paste at (20, 20), then spread out
        const baseOffset = 30;
        const angle = (this.pasteCount - 1) * (Math.PI / 4); // 45 degree increments
        const radius = baseOffset * Math.ceil((this.pasteCount - 1) / 8); // New ring every 8 pastes
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        
        // Calculate bounding box of clipboard objects to offset from their center
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const obj of this.clipboard) {
            minX = Math.min(minX, obj.x);
            minY = Math.min(minY, obj.y);
            maxX = Math.max(maxX, obj.x + obj.width);
            maxY = Math.max(maxY, obj.y + obj.height);
        }
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        const pastedObjects: Viewport2DObject[] = [];
        this.selectedObjectIds.clear();
        
        for (const obj of this.clipboard) {
            const newId = `${obj.id}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            // Offset from original position, then add spiral offset from center
            const relativeX = obj.x - centerX;
            const relativeY = obj.y - centerY;
            // Get max zIndex and assign higher zIndex to pasted objects (put them on top)
            const maxZ = Math.max(...Array.from(this.objects.values()).map(o => o.zIndex ?? 0), -1);
            const newObj: Viewport2DObject = {
                ...obj,
                id: newId,
                x: centerX + relativeX + offsetX,
                y: centerY + relativeY + offsetY,
                zIndex: maxZ + pastedObjects.length + 1 // Put pasted objects on top
            };
            this.objects.set(newId, newObj);
            pastedObjects.push(newObj);
            this.selectedObjectIds.add(newId);
        }
        
        this.render();
    }
    
    private undo(): void {
        if (this.undoStack.length === 0) return;
        
        // Save current state to redo stack
        this.redoStack.push({
            objects: new Map(this.objects),
            selectedIds: new Set(this.selectedObjectIds)
        });
        
        // Restore previous state
        const state = this.undoStack.pop()!;
        this.objects = new Map(state.objects);
        this.selectedObjectIds = new Set(state.selectedIds);
        this.render();
    }
    
    private redo(): void {
        if (this.redoStack.length === 0) return;
        
        // Save current state to undo stack
        this.undoStack.push({
            objects: new Map(this.objects),
            selectedIds: new Set(this.selectedObjectIds)
        });
        
        // Restore next state
        const state = this.redoStack.pop()!;
        this.objects = new Map(state.objects);
        this.selectedObjectIds = new Set(state.selectedIds);
        this.render();
    }
    
    private selectAll(): void {
        // Select all objects
        this.selectedObjectIds.clear();
        for (const id of this.objects.keys()) {
            this.selectedObjectIds.add(id);
        }
        this.render();
    }
    
    private duplicateSelection(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        this.saveState();
        
        // Calculate bounding box of selected objects for offset
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const selectedIds = Array.from(this.selectedObjectIds);
        for (const id of selectedIds) {
            const obj = this.objects.get(id);
            if (obj) {
                minX = Math.min(minX, obj.x);
                minY = Math.min(minY, obj.y);
                maxX = Math.max(maxX, obj.x + obj.width);
                maxY = Math.max(maxY, obj.y + obj.height);
            }
        }
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const offsetX = 30;
        const offsetY = 30;
        
        const duplicatedIds: string[] = [];
        const maxZ = Math.max(...Array.from(this.objects.values()).map(o => o.zIndex ?? 0), -1);
        
        for (const id of selectedIds) {
            const obj = this.objects.get(id);
            if (obj) {
                const newId = `${obj.id}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const relativeX = obj.x - centerX;
                const relativeY = obj.y - centerY;
                const newObj: Viewport2DObject = {
                    ...obj,
                    id: newId,
                    x: centerX + relativeX + offsetX,
                    y: centerY + relativeY + offsetY,
                    zIndex: maxZ + duplicatedIds.length + 1 // Put duplicated objects on top
                };
                this.objects.set(newId, newObj);
                duplicatedIds.push(newId);
            }
        }
        
        // Select all duplicated objects
        this.selectedObjectIds.clear();
        for (const id of duplicatedIds) {
            this.selectedObjectIds.add(id);
        }
        
        this.render();
    }
    
    private deleteSelection(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        this.saveState();
        for (const id of this.selectedObjectIds) {
            this.objects.delete(id);
        }
        this.selectedObjectIds.clear();
        this.render();
    }
    
    private frameSelected(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        // Calculate bounding box of all selected objects
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        for (const id of this.selectedObjectIds) {
            const obj = this.objects.get(id);
            if (obj) {
                minX = Math.min(minX, obj.x);
                minY = Math.min(minY, obj.y);
                maxX = Math.max(maxX, obj.x + obj.width);
                maxY = Math.max(maxY, obj.y + obj.height);
            }
        }
        
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        // Center viewport on selected objects
        this.viewport.x = centerX;
        this.viewport.y = centerY;
        this.viewport.scale = 1;
        
        this.render();
        
        // Notify navigation
        if (this.nav && this.container) {
            const event = new CustomEvent('viewport-change', {
                detail: { viewport: this.viewport }
            });
            this.container.dispatchEvent(event);
        }
    }
    
    private frameAll(): void {
        if (this.objects.size === 0) return;
        
        // Calculate bounding box of all objects
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        for (const obj of this.objects.values()) {
            minX = Math.min(minX, obj.x);
            minY = Math.min(minY, obj.y);
            maxX = Math.max(maxX, obj.x + obj.width);
            maxY = Math.max(maxY, obj.y + obj.height);
        }
        
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const width = maxX - minX;
        const height = maxY - minY;
        
        // Center viewport and zoom to fit
        this.viewport.x = centerX;
        this.viewport.y = centerY;
        
        if (this.canvasElement) {
            const rect = this.canvasElement.getBoundingClientRect();
            const scaleX = rect.width / (width + 100);
            const scaleY = rect.height / (height + 100);
            this.viewport.scale = Math.min(scaleX, scaleY, this.config.maxScale || 10);
        }
        
        this.render();
        
        // Notify navigation
        if (this.nav && this.container) {
            const event = new CustomEvent('viewport-change', {
                detail: { viewport: this.viewport }
            });
            this.container.dispatchEvent(event);
        }
    }
    
    private setupEventListeners(): void {
        if (!this.canvasElement) return;
        
        // Mouse events
        this.boundHandleMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
        this.boundHandleMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
        this.boundHandleMouseUp = (e: MouseEvent) => this.handleMouseUp(e);
        this.boundHandleWheel = (e: WheelEvent) => this.handleWheel(e);
        
        this.canvasElement.addEventListener('mousedown', this.boundHandleMouseDown);
        this.canvasElement.addEventListener('mousemove', this.boundHandleMouseMove);
        this.canvasElement.addEventListener('mouseup', this.boundHandleMouseUp);
        this.canvasElement.addEventListener('mouseleave', this.boundHandleMouseUp);
        this.canvasElement.addEventListener('wheel', this.boundHandleWheel, { passive: false });
        
        // Add document-level mouse listeners for proper drag handling
        document.addEventListener('mousemove', this.boundHandleMouseMove);
        document.addEventListener('mouseup', this.boundHandleMouseUp);
        
        // Context menu (right-click)
        this.canvasElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
        });
        
        // Prevent default middle mouse button behavior (auto-scroll)
        this.boundHandleAuxClick = (e: MouseEvent) => {
            if (e.button === 1) {
                e.preventDefault();
            }
        };
        this.canvasElement.addEventListener('auxclick', this.boundHandleAuxClick);
        
        // Touch events
        this.boundHandleTouchStart = (e: TouchEvent) => this.handleTouchStart(e);
        this.boundHandleTouchMove = (e: TouchEvent) => this.handleTouchMove(e);
        this.boundHandleTouchEnd = (e: TouchEvent) => this.handleTouchEnd(e);
        
        this.canvasElement.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });
        this.canvasElement.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
        this.canvasElement.addEventListener('touchend', this.boundHandleTouchEnd);
        this.canvasElement.addEventListener('touchcancel', this.boundHandleTouchEnd);
        
        // Listen for viewport changes from navigation
        if (this.nav) {
            this.boundHandleViewportChange = () => {
                // Viewport state is shared by reference, just re-render when nav changes
                this.render();
                this.renderRulers();
            };
            
            // Listen on nav container where events are dispatched
            this.nav.container.addEventListener('viewport-change', this.boundHandleViewportChange as EventListener);
        }
        
        // Keyboard handlers for space+drag panning
        this.boundHandleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ' && !this.spacePressed) {
                this.spacePressed = true;
                if (this.canvasElement) {
                    this.canvasElement.style.cursor = 'grab';
                }
            } else if (e.key === 'Escape') {
                // Deselect all objects on ESC
                this.selectedObjectIds.clear();
                this.render();
            }
        };
        
        this.boundHandleKeyUp = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                this.spacePressed = false;
                if (this.canvasElement && !this.isPanning && !this.isDragging) {
                    this.canvasElement.style.cursor = 'default';
                }
            }
        };
        
        window.addEventListener('keydown', this.boundHandleKeyDown);
        window.addEventListener('keyup', this.boundHandleKeyUp);
    }
    
    private resizeCanvas(): void {
        if (!this.canvasElement) return;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:1086',message:'resizeCanvas() called',data:{oldWidth:this.canvasElement.width,oldHeight:this.canvasElement.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvasElement.getBoundingClientRect();
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:1100',message:'resizeCanvas() getting dimensions',data:{rectWidth:rect.width,rectHeight:rect.height,rectLeft:rect.left,rectTop:rect.top,showRulers:this.config.showRulers,canvasMarginTop:this.canvasElement.style.marginTop,canvasMarginLeft:this.canvasElement.style.marginLeft},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        
        // When rulers are hidden, use wrapper height to get full available space
        // This ensures canvas expands to fill space of both top and bottom rulers
        let canvasWidth = rect.width;
        let canvasHeight = rect.height;
        
        // If dimensions are invalid (0 or negative), wait for next frame
        // This can happen on first load before DOM is fully laid out
        if (canvasWidth <= 0 || canvasHeight <= 0) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:1110',message:'resizeCanvas() invalid dimensions, deferring',data:{canvasWidth,canvasHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
            // #endregion
            requestAnimationFrame(() => this.resizeCanvas());
            return;
        }
        
        if (!this.config.showRulers && this.wrapperElement) {
            const wrapperRect = this.wrapperElement.getBoundingClientRect();
            // Use full wrapper dimensions when rulers are hidden
            canvasWidth = wrapperRect.width;
            canvasHeight = wrapperRect.height;
        }
        
        this.canvasElement.width = canvasWidth * dpr;
        this.canvasElement.height = canvasHeight * dpr;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:1104',message:'After setting canvas dimensions',data:{newWidth:this.canvasElement.width,newHeight:this.canvasElement.height,dpr},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion
        
        if (this.ctx) {
            this.ctx.scale(dpr, dpr);
        }
        
            // Resize rulers to match canvas dimensions
            if (this.config.showRulers) {
                const rulerSize = this.config.rulerSize || 30;
                
                if (this.topRulerCanvas) {
                    // Top ruler should span width minus left and right rulers
                    this.topRulerCanvas.style.width = `${rect.width}px`;
                }
                
                if (this.leftRulerCanvas) {
                    // Left ruler should span height minus top and bottom rulers
                    this.leftRulerCanvas.style.height = `${rect.height}px`;
                }
                
                if (this.bottomRulerCanvas) {
                    // Bottom ruler should span width minus left and right rulers
                    this.bottomRulerCanvas.style.width = `${rect.width}px`;
                }
                
                if (this.rightRulerCanvas) {
                    // Right ruler should span height minus top and bottom rulers
                    this.rightRulerCanvas.style.height = `${rect.height}px`;
                }
            }
        
        this.render();
        if (this.config.showRulers) {
            this.renderRulers();
        }
    }
    
    //================================================================================
    // GRID SNAPPING
    //================================================================================
    
    /**
     * Snap a value to the grid and/or guidelines
     */
    private snapToGrid(value: number, isX: boolean = true): number {
        let snappedValue = value;
        const snapThreshold = this.config.snapToGuidelines || 0;
        
        // Find closest guideline and grid snap candidates
        let closestGuideline: number | null = null;
        let closestGuidelineDist = Infinity;
        
        // Check guidelines if enabled
        // snapThreshold is the maximum distance (in pixels) to snap to a guideline
        if (snapThreshold > 0 && this.config.guidelines) {
            for (const guideline of this.config.guidelines) {
                if (isX && guideline.orientation === 'vertical' && guideline.x !== undefined) {
                    const dist = Math.abs(value - guideline.x);
                    // Only consider guidelines within the threshold distance
                    if (dist <= snapThreshold && dist < closestGuidelineDist) {
                        closestGuidelineDist = dist;
                        // Snap directly to the guideline position (no offset)
                        closestGuideline = guideline.x;
                    }
                } else if (!isX && guideline.orientation === 'horizontal' && guideline.y !== undefined) {
                    const dist = Math.abs(value - guideline.y);
                    // Only consider guidelines within the threshold distance
                    if (dist <= snapThreshold && dist < closestGuidelineDist) {
                        closestGuidelineDist = dist;
                        // Snap directly to the guideline position (no offset)
                        closestGuideline = guideline.y;
                    }
                }
            }
        }
        
        // Calculate grid snap if enabled
        let gridSnapped: number | null = null;
        let gridDist = Infinity;
        if (this.config.snapToGrid && this.config.snapToGrid > 0) {
            const gridValue = this.config.snapToGrid;
            gridSnapped = Math.round(value / gridValue) * gridValue;
            gridDist = Math.abs(value - gridSnapped);
            // Only use grid snap if it's reasonably close (within half the grid size)
            // This prevents snapping when far from grid points
            if (gridDist > gridValue / 2) {
                gridSnapped = null;
                gridDist = Infinity;
            }
        }
        
        // Choose the closest snap target (guideline or grid)
        if (closestGuideline !== null && gridSnapped !== null) {
            // Both available - use the one closer to original value
            if (closestGuidelineDist <= gridDist) {
                snappedValue = closestGuideline;
            } else {
                snappedValue = gridSnapped;
            }
        } else if (closestGuideline !== null) {
            // Only guideline available
            snappedValue = closestGuideline;
        } else if (gridSnapped !== null) {
            // Only grid available
            snappedValue = gridSnapped;
        }
        
        return snappedValue;
    }
    
    /**
     * Snap an object's edges to grid/guidelines
     * Snaps all edges (left, right, top, bottom) and adjusts position/size accordingly
     * @param obj The object to snap
     * @param preserveSize If true, preserve object size when snapping (for moving). If false, allow size changes (for resizing).
     */
    private snapObjectEdges(obj: Viewport2DObject, preserveSize: boolean = false): void {
        const left = obj.x;
        const right = obj.x + obj.width;
        const top = obj.y;
        const bottom = obj.y + obj.height;
        
        // Snap all edges
        const snappedLeft = this.snapToGrid(left, true);
        const snappedRight = this.snapToGrid(right, true);
        const snappedTop = this.snapToGrid(top, false);
        const snappedBottom = this.snapToGrid(bottom, false);
        
        // Calculate adjustments (how much each edge needs to move)
        const leftAdjust = snappedLeft - left;
        const rightAdjust = snappedRight - right;
        const topAdjust = snappedTop - top;
        const bottomAdjust = snappedBottom - bottom;
        
        // Check if edges actually snapped (changed position)
        const leftSnapped = Math.abs(leftAdjust) > 0.01;
        const rightSnapped = Math.abs(rightAdjust) > 0.01;
        const topSnapped = Math.abs(topAdjust) > 0.01;
        const bottomSnapped = Math.abs(bottomAdjust) > 0.01;
        
        if (preserveSize) {
            // When moving, preserve size - snap by adjusting position only
            // For horizontal: prefer snapping left edge, but if right is closer, adjust x to keep width
            if (leftSnapped && rightSnapped) {
                // Both edges snapped - use the one with smaller adjustment to minimize movement
                if (Math.abs(leftAdjust) <= Math.abs(rightAdjust)) {
                    obj.x = snappedLeft;
                } else {
                    // Right edge is closer, adjust x to keep width the same
                    obj.x = snappedRight - obj.width;
                }
            } else if (leftSnapped) {
                // Only left edge snapped - adjust position
                obj.x = snappedLeft;
            } else if (rightSnapped) {
                // Only right edge snapped - adjust position to keep width
                obj.x = snappedRight - obj.width;
            }
            
            // For vertical: same logic
            if (topSnapped && bottomSnapped) {
                // Both edges snapped - use the one with smaller adjustment
                if (Math.abs(topAdjust) <= Math.abs(bottomAdjust)) {
                    obj.y = snappedTop;
                } else {
                    // Bottom edge is closer, adjust y to keep height the same
                    obj.y = snappedBottom - obj.height;
                }
            } else if (topSnapped) {
                // Only top edge snapped - adjust position
                obj.y = snappedTop;
            } else if (bottomSnapped) {
                // Only bottom edge snapped - adjust position to keep height
                obj.y = snappedBottom - obj.height;
            }
        } else {
            // When resizing, allow size changes
            // For horizontal: snap both edges if both are close, otherwise snap the closer one
            if (leftSnapped && rightSnapped) {
                // Both edges snapped - adjust position and width
                obj.x = snappedLeft;
                obj.width = snappedRight - snappedLeft;
            } else if (leftSnapped) {
                // Only left edge snapped - adjust position
                obj.x = snappedLeft;
            } else if (rightSnapped) {
                // Only right edge snapped - adjust width
                obj.width = snappedRight - obj.x;
            }
            
            // For vertical: same logic
            if (topSnapped && bottomSnapped) {
                // Both edges snapped - adjust position and height
                obj.y = snappedTop;
                obj.height = snappedBottom - snappedTop;
            } else if (topSnapped) {
                // Only top edge snapped - adjust position
                obj.y = snappedTop;
            } else if (bottomSnapped) {
                // Only bottom edge snapped - adjust height
                obj.height = snappedBottom - obj.y;
            }
        }
    }
    
    /**
     * Handle ruler click to create guidelines
     */
    private handleRulerClick(e: MouseEvent, ruler: 'top' | 'bottom' | 'left' | 'right'): void {
        if (!this.canvasElement) return;
        
        e.stopPropagation();
        
        const rect = this.canvasElement.getBoundingClientRect();
        const rulerSize = this.config.rulerSize || 30;
        
        // Convert click position to world coordinates
        if (ruler === 'top' || ruler === 'bottom') {
            // Horizontal ruler - create vertical guideline
            const worldX = this.screenToWorld(e.clientX, rect.top + rect.height / 2).x;
            this.addGuideline(worldX, 'vertical');
        } else {
            // Vertical ruler - create horizontal guideline
            const worldY = this.screenToWorld(rect.left + rect.width / 2, e.clientY).y;
            this.addGuideline(worldY, 'horizontal');
        }
        
        this.render();
    }
    
    /**
     * Add a guideline at the specified position
     */
    public addGuideline(position: number, orientation: 'horizontal' | 'vertical'): void {
        if (!this.config.guidelines) {
            this.config.guidelines = [];
        }
        
        // Check if guideline already exists at this position (within 1px tolerance)
        const exists = this.config.guidelines.some(g => {
            if (orientation === 'vertical' && g.orientation === 'vertical' && g.x !== undefined) {
                return Math.abs(g.x - position) < 1;
            } else if (orientation === 'horizontal' && g.orientation === 'horizontal' && g.y !== undefined) {
                return Math.abs(g.y - position) < 1;
            }
            return false;
        });
        
        if (!exists) {
            if (orientation === 'vertical') {
                this.config.guidelines.push({ x: position, orientation: 'vertical' });
            } else {
                this.config.guidelines.push({ y: position, orientation: 'horizontal' });
            }
        }
    }
    
    /**
     * Remove a guideline at the specified position
     */
    public removeGuideline(position: number, orientation: 'horizontal' | 'vertical'): void {
        if (!this.config.guidelines) return;
        
        this.config.guidelines = this.config.guidelines.filter(g => {
            if (orientation === 'vertical' && g.orientation === 'vertical' && g.x !== undefined) {
                return Math.abs(g.x - position) >= 1;
            } else if (orientation === 'horizontal' && g.orientation === 'horizontal' && g.y !== undefined) {
                return Math.abs(g.y - position) >= 1;
            }
            return true;
        });
    }
    
    //================================================================================
    // COORDINATE CONVERSION
    //================================================================================
    
    public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
        if (!this.canvasElement) return { x: screenX, y: screenY };
        
        const rect = this.canvasElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const canvasCenterX = (rect.width) / 2;
        const canvasCenterY = (rect.height) / 2;
        
        // Convert screen coordinates to canvas coordinates
        let x = (screenX - rect.left) - canvasCenterX;
        let y = (screenY - rect.top) - canvasCenterY;
        
        // Apply inverse viewport transform
        x /= this.viewport.scale;
        y /= this.viewport.scale;
        
        // Apply inverse rotation
        if (this.viewport.rotation) {
            const angle = -this.viewport.rotation;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const rotatedX = x * cos - y * sin;
            const rotatedY = x * sin + y * cos;
            x = rotatedX;
            y = rotatedY;
        }
        
        // Apply inverse pan
        x += this.viewport.x;
        y += this.viewport.y;
        
        return { x, y };
    }
    
    public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
        if (!this.canvasElement) return { x: worldX, y: worldY };
        
        const rect = this.canvasElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const canvasCenterX = (rect.width) / 2;
        const canvasCenterY = (rect.height) / 2;
        
        // Apply pan
        let x = worldX - this.viewport.x;
        let y = worldY - this.viewport.y;
        
        // Apply rotation
        if (this.viewport.rotation) {
            const cos = Math.cos(this.viewport.rotation);
            const sin = Math.sin(this.viewport.rotation);
            const rotatedX = x * cos - y * sin;
            const rotatedY = x * sin + y * cos;
            x = rotatedX;
            y = rotatedY;
        }
        
        // Apply scale
        x *= this.viewport.scale;
        y *= this.viewport.scale;
        
        // Convert to screen coordinates
        x += canvasCenterX;
        y += canvasCenterY;
        
        return { x: x + rect.left, y: y + rect.top };
    }
    
    /**
     * Convert canvas coordinates (relative to center) to world coordinates
     * This is used when the viewport transform is already applied
     */
    private canvasToWorld(canvasX: number, canvasY: number): { x: number; y: number } {
        // Canvas coordinates are relative to center (0,0 is center)
        // Apply inverse viewport transform to get world coordinates
        let x = canvasX;
        let y = canvasY;
        
        // Inverse pan (add viewport position)
        x += this.viewport.x;
        y += this.viewport.y;
        
        // Inverse scale
        x /= this.viewport.scale;
        y /= this.viewport.scale;
        
        // Inverse rotation
        if (this.viewport.rotation) {
            const angle = -this.viewport.rotation;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const rotatedX = x * cos - y * sin;
            const rotatedY = x * sin + y * cos;
            x = rotatedX;
            y = rotatedY;
        }
        
        return { x, y };
    }
    
    //================================================================================
    // INTERACTION HANDLERS
    //================================================================================
    
    private handleMouseDown(e: MouseEvent): void {
        if (!this.canvasElement) return;
        
        const worldPos = this.screenToWorld(e.clientX, e.clientY);
        
        // Handle right-click for shape point removal (before pan check)
        if (e.button === 2 && this.isEditingShape && this.config.enableShapeEditing) {
            for (const obj of this.objects.values()) {
                if (obj.isShape && obj.shape && this.selectedObjectIds.has(obj.id)) {
                    const pointIndex = this.getShapePointAtPosition(worldPos, obj);
                    if (pointIndex !== null) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.removePointFromShape(obj, pointIndex);
                        return;
                    }
                }
            }
        }
        
        // Middle mouse button (scroll wheel click) or right-click - pan
        if (e.button === 1 || e.button === 2) {
            e.preventDefault();
            this.isPanning = true;
            this.panStart = { x: e.clientX, y: e.clientY };
            // Initial cursor - will update based on direction when moving
            this.canvasElement.style.cursor = 'grabbing';
            return;
        }
        
        // Space+drag - pan
        if (this.spacePressed) {
            e.preventDefault();
            this.isPanning = true;
            this.panStart = { x: e.clientX, y: e.clientY };
            this.canvasElement.style.cursor = 'grabbing';
            return;
        }
        
        // Only handle left mouse button
        if (e.button !== 0) return;
        
        // Get mouse position relative to canvas (worldPos already calculated above)
        const rect = this.canvasElement.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        
        // Check for handle clicks (if object manipulation enabled) - check all selected objects
        if (this.config.enableObjectManipulation && this.selectedObjectIds.size > 0) {
            for (const selectedId of this.selectedObjectIds) {
                const obj = this.objects.get(selectedId);
                if (obj) {
                    const handle = this.getHandleAtPosition(worldPos, obj);
                    if (handle) {
                        // Only allow handle manipulation on single selection
                        if (this.selectedObjectIds.size === 1) {
                            if (handle === 'rotate') {
                                this.isRotating = true;
                                const objCenter = { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 };
                                // Calculate angle from center to mouse, then subtract object's current rotation
                                const angleToMouse = Math.atan2(worldPos.y - objCenter.y, worldPos.x - objCenter.x);
                                this.rotateStartAngle = angleToMouse - (obj.rotation || 0);
                                this.canvasElement.style.cursor = 'grab';
                                return;
                            } else {
                                this.isResizing = true;
                                this.resizeHandle = handle;
                                // Store initial state for resize (center, dimensions, rotation)
                                const centerX = obj.x + obj.width / 2;
                                const centerY = obj.y + obj.height / 2;
                                this.resizeStartState = {
                                    centerX,
                                    centerY,
                                    width: obj.width,
                                    height: obj.height,
                                    rotation: obj.rotation || 0
                                };
                                // Store modifier keys state at resize start
                                this.resizeModifiers = {
                                    ctrlKey: e.ctrlKey || e.metaKey,
                                    shiftKey: e.shiftKey
                                };
                                this.dragStart = worldPos;
                                this.canvasElement.style.cursor = this.getResizeCursor(handle);
                                return;
                            }
                        }
                    }
                }
            }
        }
        
        // Handle shape editing mode
        if (this.isEditingShape && this.config.enableShapeEditing) {
            // Check if clicking on a shape point (for editing or removal)
            if (e.button === 0) {
                // Left-click: check for point editing or adding
                for (const obj of this.objects.values()) {
                    if (obj.isShape && obj.shape && this.selectedObjectIds.has(obj.id)) {
                        const pointIndex = this.getShapePointAtPosition(worldPos, obj);
                        if (pointIndex !== null) {
                            // Clicked on a point - start dragging it
                            this.isDraggingPoint = true;
                            this.editingShapeId = obj.id;
                            this.editingPointIndex = pointIndex;
                            this.pointDragStart = worldPos;
                            this.canvasElement.style.cursor = 'grabbing';
                            return;
                        } else {
                            // Check if clicking near an edge to add a point
                            const closestEdge = obj.shape.findClosestEdgePoint(worldPos);
                            if (closestEdge) {
                                const pointSize = (this.config.shapePointSize || 6) / this.viewport.scale;
                                const threshold = pointSize * 3;
                                const dist = Math.sqrt(
                                    (worldPos.x - closestEdge.point.x) ** 2 +
                                    (worldPos.y - closestEdge.point.y) ** 2
                                );
                                if (dist <= threshold) {
                                    // Add point to shape
                                    this.addPointToShape(obj, worldPos);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Check if clicking on an object
        // Iterate from top to bottom (higher zIndex first) to select the object on top
        let clickedObject: Viewport2DObject | null = null;
        const objectsArray = Array.from(this.objects.values());
        // Sort by zIndex (higher = on top), then by insertion order (later = on top)
        objectsArray.sort((a, b) => {
            const zA = a.zIndex ?? 0;
            const zB = b.zIndex ?? 0;
            if (zA !== zB) return zB - zA; // Higher zIndex first (on top)
            // If zIndex is same, objects added later are on top (check insertion order)
            return 0; // Keep insertion order for same zIndex
        });
        // Check from top to bottom (higher zIndex first)
        for (const obj of objectsArray) {
            if (this.isPointInObject(worldPos, obj)) {
                clickedObject = obj;
                break; // Found the topmost object, stop
            }
        }
        
        const ctrlPressed = e.ctrlKey || e.metaKey; // Support both Ctrl and Cmd
        const shiftPressed = e.shiftKey;
        
        if (clickedObject) {
            // Clicked on object
            if (this.config.enableObjectManipulation && this.config.enableObjectSelection) {
                if (ctrlPressed) {
                    // Ctrl+click: toggle selection
                    if (this.selectedObjectIds.has(clickedObject.id)) {
                        this.selectedObjectIds.delete(clickedObject.id);
                    } else {
                        this.selectedObjectIds.add(clickedObject.id);
                    }
                    this.render();
                } else if (shiftPressed) {
                    // Shift+click: range selection (select from last selected to clicked)
                    if (this.selectedObjectIds.size > 0) {
                        // Find all objects between the last selected and the clicked one
                        const allObjects = Array.from(this.objects.values());
                        const lastSelectedId = Array.from(this.selectedObjectIds)[this.selectedObjectIds.size - 1];
                        const lastSelectedObj = this.objects.get(lastSelectedId);
                        
                        if (lastSelectedObj) {
                            // Simple range: select all objects in order between last selected and clicked
                            const clickedIndex = allObjects.findIndex(o => o.id === clickedObject!.id);
                            const lastIndex = allObjects.findIndex(o => o.id === lastSelectedId);
                            
                            const startIndex = Math.min(clickedIndex, lastIndex);
                            const endIndex = Math.max(clickedIndex, lastIndex);
                            
                            for (let i = startIndex; i <= endIndex; i++) {
                                this.selectedObjectIds.add(allObjects[i].id);
                            }
                        }
                    } else {
                        // No previous selection, just select clicked object
                        this.selectedObjectIds.add(clickedObject.id);
                    }
                    this.render();
                } else {
                    // Normal click: select only this object and start dragging
                    if (!this.selectedObjectIds.has(clickedObject.id)) {
                        this.selectedObjectIds.clear();
                        this.selectedObjectIds.add(clickedObject.id);
                    }
                    this.isDragging = true;
                    this.draggedObjectId = clickedObject.id;
                    this.dragStart = worldPos;
                    this.canvasElement.style.cursor = 'grabbing';
                    // Focus canvas for shortcuts
                    this.canvasElement.focus();
                    this.render();
                }
            } else {
                // Object manipulation disabled - just select for display
                if (ctrlPressed) {
                    if (this.selectedObjectIds.has(clickedObject.id)) {
                        this.selectedObjectIds.delete(clickedObject.id);
                    } else {
                        this.selectedObjectIds.add(clickedObject.id);
                    }
                } else if (shiftPressed) {
                    // Range selection
                    if (this.selectedObjectIds.size > 0) {
                        const allObjects = Array.from(this.objects.values());
                        const lastSelectedId = Array.from(this.selectedObjectIds)[this.selectedObjectIds.size - 1];
                        const lastSelectedObj = this.objects.get(lastSelectedId);
                        
                        if (lastSelectedObj) {
                            const clickedIndex = allObjects.findIndex(o => o.id === clickedObject!.id);
                            const lastIndex = allObjects.findIndex(o => o.id === lastSelectedId);
                            
                            const startIndex = Math.min(clickedIndex, lastIndex);
                            const endIndex = Math.max(clickedIndex, lastIndex);
                            
                            for (let i = startIndex; i <= endIndex; i++) {
                                this.selectedObjectIds.add(allObjects[i].id);
                            }
                        }
                    } else {
                        this.selectedObjectIds.add(clickedObject.id);
                    }
                } else {
                    this.selectedObjectIds.clear();
                    this.selectedObjectIds.add(clickedObject.id);
                }
                // Focus canvas for shortcuts
                this.canvasElement.focus();
                this.render();
            }
        } else {
            // Clicked on empty space - start panning
            if (!ctrlPressed && !shiftPressed) {
                // Only deselect if not holding Ctrl or Shift
                this.isPanning = true;
                this.panStart = { x: e.clientX, y: e.clientY };
                this.canvasElement.style.cursor = 'grabbing';
                
                // Deselect all objects
                this.selectedObjectIds.clear();
                this.render();
            }
        }
    }
    
    private handleMouseMove(e: MouseEvent): void {
        if (!this.canvasElement) return;
        
        if (this.isPanning && this.panStart) {
            // Pan viewport - handle rotation properly
            const dxScreen = e.clientX - this.panStart.x;
            const dyScreen = e.clientY - this.panStart.y;
            
            // Update cursor based on pan direction
            this.updatePanCursor(dxScreen, dyScreen);
            
            // Rotate the screen delta to world space
            const angle = -(this.viewport.rotation || 0);
            const rotatedDx = dxScreen * Math.cos(angle) - dyScreen * Math.sin(angle);
            const rotatedDy = dxScreen * Math.sin(angle) + dyScreen * Math.cos(angle);
            
            // Apply to viewport
            this.viewport.x -= rotatedDx / this.viewport.scale;
            this.viewport.y -= rotatedDy / this.viewport.scale;
            
            this.panStart = { x: e.clientX, y: e.clientY };
            this.render();
            if (this.config.showRulers) {
                this.renderRulers();
            }
            
            // Notify navigation
            if (this.nav && this.container) {
                const event = new CustomEvent('viewport-change', {
                    detail: { viewport: this.viewport }
                });
                this.container.dispatchEvent(event);
            }
            return;
        }
        
        const worldPos = this.screenToWorld(e.clientX, e.clientY);
        
        // Handle shape point dragging
        if (this.isDraggingPoint && this.editingShapeId && this.editingPointIndex !== null && this.pointDragStart) {
            const obj = this.objects.get(this.editingShapeId);
            if (obj && obj.shape && obj.isShape) {
                const dx = worldPos.x - this.pointDragStart.x;
                const dy = worldPos.y - this.pointDragStart.y;
                
                // Update point position
                const point = obj.shape.points[this.editingPointIndex];
                const newX = point.x + dx;
                const newY = point.y + dy;
                
                // Apply snapping if enabled
                const snappedX = this.snapToGrid(newX, true);
                const snappedY = this.snapToGrid(newY, false);
                
                obj.shape.updatePoint(this.editingPointIndex, { x: snappedX, y: snappedY });
                
                // Update bounding box
                const bbox = obj.shape.getBoundingBox();
                obj.x = bbox.x;
                obj.y = bbox.y;
                obj.width = bbox.width;
                obj.height = bbox.height;
                
                // Update drag start for next frame
                this.pointDragStart = worldPos;
                
                this.render();
            }
            return;
        }
        
        // Handle rotation (only for single selection)
        if (this.isRotating && this.selectedObjectIds.size === 1) {
            const selectedId = Array.from(this.selectedObjectIds)[0];
            const obj = this.objects.get(selectedId);
            if (obj) {
                const objCenter = { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 };
                // Calculate current angle from center to mouse
                const angleToMouse = Math.atan2(worldPos.y - objCenter.y, worldPos.x - objCenter.x);
                // Apply rotation: current angle minus the start angle offset
                obj.rotation = angleToMouse - this.rotateStartAngle;
                this.render();
            }
            return;
        }
        
        // Handle resizing (only for single selection)
        if (this.isResizing && this.selectedObjectIds.size === 1 && this.resizeHandle && this.resizeStartState) {
            const selectedId = Array.from(this.selectedObjectIds)[0];
            const obj = this.objects.get(selectedId);
            if (obj) {
                // Update modifier keys during resize (in case user releases/presses them)
                this.resizeModifiers.ctrlKey = e.ctrlKey || e.metaKey;
                this.resizeModifiers.shiftKey = e.shiftKey;
                this.resizeObject(obj, worldPos, this.resizeHandle, this.resizeStartState, this.resizeModifiers);
                this.render();
            }
            return;
        }
        
        if (this.isDragging && this.draggedObjectId && this.dragStart) {
            // Drag all selected objects
            if (this.config.enableObjectManipulation) {
                const dx = worldPos.x - this.dragStart.x;
                const dy = worldPos.y - this.dragStart.y;
                
                // Track total snap offset for all objects (use first object as reference)
                let totalSnapOffsetX = 0;
                let totalSnapOffsetY = 0;
                let hasSnapped = false;
                
                // If dragging a single object, move all selected objects
                // Track snap offset from first object for dragStart adjustment
                let firstObjOriginalX = 0;
                let firstObjOriginalY = 0;
                let hasFirstObj = false;
                
                for (const id of this.selectedObjectIds) {
                    const obj = this.objects.get(id);
                    if (obj) {
                        if (!hasFirstObj) {
                            firstObjOriginalX = obj.x;
                            firstObjOriginalY = obj.y;
                            hasFirstObj = true;
                        }
                        
                        const newX = obj.x + dx;
                        const newY = obj.y + dy;
                        
                        // Move object first
                        obj.x = newX;
                        obj.y = newY;
                        // Apply snapping to all edges (preserve size when moving)
                        this.snapObjectEdges(obj, true);
                    }
                }
                
                // Update dragStart based on actual movement of first object
                if (hasFirstObj) {
                    const firstObj = this.objects.get(Array.from(this.selectedObjectIds)[0]);
                    if (firstObj) {
                        const actualDx = firstObj.x - firstObjOriginalX;
                        const actualDy = firstObj.y - firstObjOriginalY;
                        
                        // Calculate snap offset
                        const snapOffsetX = actualDx - dx;
                        const snapOffsetY = actualDy - dy;
                        
                        // Only adjust dragStart if there was snapping
                        if (Math.abs(snapOffsetX) > 0.01 || Math.abs(snapOffsetY) > 0.01) {
                            // Adjust dragStart to account for snapping
                            // After snapping, the object moved by actualDx instead of dx
                            this.dragStart = {
                                x: worldPos.x - actualDx,
                                y: worldPos.y - actualDy
                            };
                        } else {
                            // No snapping, update dragStart normally
                            this.dragStart = worldPos;
                        }
                    }
                }
                
                this.render();
            }
            return;
        }
        
        // Only do hover checks if not dragging/panning
        if (!this.isPanning && !this.isDragging && !this.isRotating && !this.isResizing) {
            // Check hover
            let cursor = this.spacePressed ? 'grab' : 'default';
            let hoveringObject = false;
            let hoveringHandle: string | null = null;
            
            for (const obj of this.objects.values()) {
                if (this.isPointInObject(worldPos, obj)) {
                    hoveringObject = true;
                    if (this.selectedObjectIds.has(obj.id) && this.config.enableObjectManipulation && this.selectedObjectIds.size === 1) {
                        hoveringHandle = this.getHandleAtPosition(worldPos, obj);
                        if (hoveringHandle === 'rotate') {
                            cursor = 'grab';
                        } else if (hoveringHandle) {
                            cursor = this.getResizeCursor(hoveringHandle);
                        } else {
                            cursor = 'grab';
                        }
                    } else {
                        cursor = 'grab';
                    }
                    break;
                }
            }
            
            // Update last mouse world position for rulers
            this.lastMouseWorldPos = worldPos;
            
            this.canvasElement.style.cursor = cursor;
            
            // Update rulers with mouse position
            if (this.config.showRulers && !this.isPanning && !this.isDragging && !this.isRotating && !this.isResizing) {
                this.renderRulersWithMouse(this.lastMouseWorldPos);
            }
        }
    }
    
    private resizeObject(
        obj: Viewport2DObject, 
        newPos: { x: number; y: number }, 
        handle: string,
        startState: { centerX: number; centerY: number; width: number; height: number; rotation: number },
        modifiers: { ctrlKey: boolean; shiftKey: boolean }
    ): void {
        const centerX = startState.centerX;
        const centerY = startState.centerY;
        const rotation = obj.rotation || 0;
        
        // Initial dimensions
        const initialWidth = startState.width;
        const initialHeight = startState.height;
        const initialW2 = initialWidth / 2;
        const initialH2 = initialHeight / 2;
        const aspectRatio = initialWidth / initialHeight;
        
        // Transform new position to object's local space
        const dx = newPos.x - centerX;
        const dy = newPos.y - centerY;
        
        // Rotate the delta vector by negative rotation to get local coordinates
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        
        let newW2 = initialW2;
        let newH2 = initialH2;
        let newX = obj.x;
        let newY = obj.y;
        
        // Determine resize behavior based on modifiers
        const isCenterResize = modifiers.ctrlKey; // Ctrl: resize from center
        const maintainAspect = modifiers.shiftKey; // Shift: maintain aspect ratio
        
        if (isCenterResize) {
            // Ctrl: Resize from center (current behavior)
            // Calculate new half-dimensions based on handle
            if (handle.includes('e')) {
                newW2 = Math.max(10, localX);
            }
            if (handle.includes('w')) {
                newW2 = Math.max(10, -localX);
            }
            if (handle.includes('s')) {
                newH2 = Math.max(10, localY);
            }
            if (handle.includes('n')) {
                newH2 = Math.max(10, -localY);
            }
            
            // For corners with Shift, maintain aspect ratio
            if (maintainAspect && handle.length === 2) {
                // Use the larger dimension change
                const deltaW = Math.abs(newW2 - initialW2);
                const deltaH = Math.abs(newH2 - initialH2);
                if (deltaW > deltaH) {
                    newH2 = newW2 / aspectRatio;
                } else {
                    newW2 = newH2 * aspectRatio;
                }
            }
            
            // Keep center fixed
            newX = centerX - newW2;
            newY = centerY - newH2;
        } else {
            // No Ctrl: Resize from opposite edge (free resize)
            // The opposite edge stays fixed
            // We already have localX and localY which are mouse position in local space (relative to center)
            // In local space, the object extends from -initialW2 to +initialW2 in X, and -initialH2 to +initialH2 in Y
            
            // Helper function to transform local point to world position
            const localToWorld = (localX: number, localY: number): { x: number; y: number } => {
                return {
                    x: centerX + localX * Math.cos(rotation) - localY * Math.sin(rotation),
                    y: centerY + localX * Math.sin(rotation) + localY * Math.cos(rotation)
                };
            };
            
            // Calculate new center and dimensions in local space
            let newCenterLocalX = 0;
            let newCenterLocalY = 0;
            
            // For edge handles
            if (handle === 'e') {
                // East edge: left edge stays fixed (at -initialW2 in local space)
                // Mouse is at localX, so new right edge is at localX
                newW2 = Math.max(10, (localX + initialW2) / 2);
                newCenterLocalX = (-initialW2 + localX) / 2;
            } else if (handle === 'w') {
                // West edge: right edge stays fixed (at +initialW2 in local space)
                // Mouse is at localX, so new left edge is at localX
                newW2 = Math.max(10, (initialW2 - localX) / 2);
                newCenterLocalX = (initialW2 + localX) / 2;
            } else if (handle === 's') {
                // South edge: top edge stays fixed (at -initialH2 in local space)
                // Mouse is at localY, so new bottom edge is at localY
                newH2 = Math.max(10, (localY + initialH2) / 2);
                newCenterLocalY = (-initialH2 + localY) / 2;
            } else if (handle === 'n') {
                // North edge: bottom edge stays fixed (at +initialH2 in local space)
                // Mouse is at localY, so new top edge is at localY
                newH2 = Math.max(10, (initialH2 - localY) / 2);
                newCenterLocalY = (initialH2 + localY) / 2;
            } else if (handle.length === 2) {
                // Corner handles: opposite corner stays fixed
                if (handle === 'se') {
                    // SE corner: NW corner fixed (at -initialW2, -initialH2 in local space)
                    newW2 = Math.max(10, (localX + initialW2) / 2);
                    newH2 = Math.max(10, (localY + initialH2) / 2);
                    newCenterLocalX = (-initialW2 + localX) / 2;
                    newCenterLocalY = (-initialH2 + localY) / 2;
                } else if (handle === 'sw') {
                    // SW corner: NE corner fixed (at +initialW2, -initialH2 in local space)
                    newW2 = Math.max(10, (initialW2 - localX) / 2);
                    newH2 = Math.max(10, (localY + initialH2) / 2);
                    newCenterLocalX = (initialW2 + localX) / 2;
                    newCenterLocalY = (-initialH2 + localY) / 2;
                } else if (handle === 'ne') {
                    // NE corner: SW corner fixed (at -initialW2, +initialH2 in local space)
                    newW2 = Math.max(10, (localX + initialW2) / 2);
                    newH2 = Math.max(10, (initialH2 - localY) / 2);
                    newCenterLocalX = (-initialW2 + localX) / 2;
                    newCenterLocalY = (initialH2 + localY) / 2;
                } else if (handle === 'nw') {
                    // NW corner: SE corner fixed (at +initialW2, +initialH2 in local space)
                    newW2 = Math.max(10, (initialW2 - localX) / 2);
                    newH2 = Math.max(10, (initialH2 - localY) / 2);
                    newCenterLocalX = (initialW2 + localX) / 2;
                    newCenterLocalY = (initialH2 + localY) / 2;
                }
                
                // If Shift is pressed, maintain aspect ratio
                if (maintainAspect) {
                    const deltaW = Math.abs(newW2 - initialW2);
                    const deltaH = Math.abs(newH2 - initialH2);
                    if (deltaW > deltaH) {
                        newH2 = newW2 / aspectRatio;
                    } else {
                        newW2 = newH2 * aspectRatio;
                    }
                    // Recalculate center with adjusted dimensions
                    if (handle === 'se') {
                        newCenterLocalX = (-initialW2 + newW2 * 2) / 2;
                        newCenterLocalY = (-initialH2 + newH2 * 2) / 2;
                    } else if (handle === 'sw') {
                        newCenterLocalX = (initialW2 - newW2 * 2) / 2;
                        newCenterLocalY = (-initialH2 + newH2 * 2) / 2;
                    } else if (handle === 'ne') {
                        newCenterLocalX = (-initialW2 + newW2 * 2) / 2;
                        newCenterLocalY = (initialH2 - newH2 * 2) / 2;
                    } else if (handle === 'nw') {
                        newCenterLocalX = (initialW2 - newW2 * 2) / 2;
                        newCenterLocalY = (initialH2 - newH2 * 2) / 2;
                    }
                }
            }
            
            // Transform new center to world space
            const newCenter = localToWorld(newCenterLocalX, newCenterLocalY);
            
            // Calculate position from center (top-left corner in local space is at -newW2, -newH2)
            const topLeftLocal = { x: -newW2, y: -newH2 };
            const topLeftWorld = localToWorld(topLeftLocal.x, topLeftLocal.y);
            newX = topLeftWorld.x;
            newY = topLeftWorld.y;
        }
        
        // Calculate new dimensions
        const newWidth = newW2 * 2;
        const newHeight = newH2 * 2;
        
        // Update object first
        obj.width = newWidth;
        obj.height = newHeight;
        obj.x = newX;
        obj.y = newY;
        
        // Apply snapping to all edges
        this.snapObjectEdges(obj);
    }
    
    private handleMouseUp(e: MouseEvent): void {
        if (!this.canvasElement) return;
        
        if (this.isDraggingPoint) {
            this.isDraggingPoint = false;
            this.pointDragStart = null;
            // Keep editingShapeId and editingPointIndex for visual feedback
        }
        
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedObjectId = null;
            this.dragStart = null;
        }
        
        if (this.isPanning) {
            this.isPanning = false;
            this.panStart = null;
        }
        
        if (this.isResizing) {
            this.isResizing = false;
            this.resizeHandle = null;
            this.resizeStartState = null;
            this.resizeModifiers = { ctrlKey: false, shiftKey: false };
            this.dragStart = null;
        }
        
        if (this.isRotating) {
            this.isRotating = false;
            this.rotateStartAngle = 0;
        }
        
        // Update cursor
        if (this.isPanning) {
            // Reset cursor after panning ends
            this.canvasElement.style.cursor = 'default';
        } else if (!this.spacePressed) {
            this.canvasElement.style.cursor = 'default';
        } else {
            this.canvasElement.style.cursor = 'grab';
        }
    }
    
    private handleWheel(e: WheelEvent): void {
        if (!this.canvasElement) return;
        
        e.preventDefault();
        
        const rect = this.canvasElement.getBoundingClientRect();
        const mouseScreenX = e.clientX - rect.left;
        const mouseScreenY = e.clientY - rect.top;
        
        // Get world position of mouse before zoom
        const worldPosBeforeZoom = this.screenToWorld(e.clientX, e.clientY);
        
        const factor = 1.2;
        const delta = e.deltaY > 0 ? 1 / factor : factor;
        const newScale = this.viewport.scale * delta;
        
        this.viewport.scale = Math.max(
            this.config.minScale || 0.1,
            Math.min(this.config.maxScale || 10, newScale)
        );
        
        // Get world position of mouse after zoom
        const worldPosAfterZoom = this.screenToWorld(e.clientX, e.clientY);
        
        // Adjust viewport to keep the same world point under the mouse
        this.viewport.x -= (worldPosAfterZoom.x - worldPosBeforeZoom.x);
        this.viewport.y -= (worldPosAfterZoom.y - worldPosBeforeZoom.y);
        
        this.render();
        
        // Notify navigation
        if (this.nav) {
            const event = new CustomEvent('viewport-change', {
                detail: { viewport: this.viewport }
            });
            this.container.dispatchEvent(event);
        }
    }
    
    private handleTouchStart(e: TouchEvent): void {
        if (!this.canvasElement) return;
        
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
        }
    }
    
    private handleTouchMove(e: TouchEvent): void {
        if (!this.canvasElement) return;
        
        e.preventDefault();
        
        if (this.touchState.isPanning && e.touches.length === 1 && this.touchState.lastTouches) {
            // Pan
            const touch = e.touches[0];
            const lastTouch = this.touchState.lastTouches[0];
            const dx = (touch.clientX - lastTouch.clientX) / this.viewport.scale;
            const dy = (touch.clientY - lastTouch.clientY) / this.viewport.scale;
            
            this.viewport.x -= dx;
            this.viewport.y -= dy;
            
            this.touchState.lastTouches = e.touches;
            this.render();
            
            // Notify navigation
            if (this.nav) {
                const event = new CustomEvent('viewport-change', {
                    detail: { viewport: this.viewport }
                });
                this.container.dispatchEvent(event);
            }
        } else if (this.touchState.isZooming && e.touches.length === 2 && this.touchState.lastTouches) {
            // Zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const scaleChange = distance / this.touchState.lastDistance;
            this.viewport.scale *= scaleChange;
            this.viewport.scale = Math.max(
                this.config.minScale || 0.1,
                Math.min(this.config.maxScale || 10, this.viewport.scale)
            );
            
            this.touchState.lastDistance = distance;
            this.touchState.lastTouches = e.touches;
            this.render();
            
            // Notify navigation
            if (this.nav) {
                const event = new CustomEvent('viewport-change', {
                    detail: { viewport: this.viewport }
                });
                this.container.dispatchEvent(event);
            }
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
    // RENDERING
    //================================================================================
    
    private render(): void {
        if (!this.ctx || !this.canvasElement) return;
        
        // Throttle rapid render calls using requestAnimationFrame
        if (this.renderScheduled) {
            return; // Already scheduled, skip this call
        }
        
        this.renderScheduled = true;
        if (this.renderRequestId !== null) {
            cancelAnimationFrame(this.renderRequestId);
        }
        
        this.renderRequestId = requestAnimationFrame(() => {
            this.renderScheduled = false;
            this.renderRequestId = null;
            this.doRender();
        });
    }
    
    private doRender(): void {
        if (!this.ctx || !this.canvasElement) return;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:2280',message:'doRender() called',data:{canvasWidth:this.canvasElement.width,canvasHeight:this.canvasElement.height,viewportScale:this.viewport.scale,viewportX:this.viewport.x,viewportY:this.viewport.y,showGrid:this.config.showGrid,showGuidelines:this.config.showGuidelines,guidelineCount:this.config.guidelines?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvasElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:2320',message:'Before clearRect',data:{width,height,canvasWidth:this.canvasElement.width,canvasHeight:this.canvasElement.height,dpr},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        // Clear canvas - reset transform to identity before clearing
        // This ensures we clear the entire canvas in physical pixel space
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        
        // Reset transform again and apply DPR scaling for logical pixel space
        // This matches what resizeCanvas() does, ensuring consistent coordinate space
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        // Save context for viewport transforms
        this.ctx.save();
        
        // Apply viewport transform
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.viewport.rotation || 0);
        this.ctx.scale(this.viewport.scale, this.viewport.scale);
        this.ctx.translate(-this.viewport.x, -this.viewport.y);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:2395',message:'Viewport transform applied',data:{centerX,centerY,viewportX:this.viewport.x,viewportY:this.viewport.y,viewportScale:this.viewport.scale,viewportRotation:this.viewport.rotation,width,height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
        // #endregion
        
        // Draw grid (before objects)
        if (this.config.showGrid) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:2403',message:'About to drawGrid',data:{viewportScale:this.viewport.scale},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            this.drawGrid();
        }
        
        // Draw guidelines (before objects, after grid)
        if (this.config.showGuidelines && this.config.guidelines) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:2302',message:'About to drawGuidelines',data:{guidelineCount:this.config.guidelines.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            this.drawGuidelines();
        }
        
        // Draw objects in z-order (lower zIndex first, so higher zIndex draws on top)
        const objectsArray = Array.from(this.objects.values());
        objectsArray.sort((a, b) => {
            const zA = a.zIndex ?? 0;
            const zB = b.zIndex ?? 0;
            return zA - zB; // Lower zIndex first
        });
        for (const obj of objectsArray) {
            this.drawObject(obj);
        }
        
        // Draw selection handles (still in world space, before restore)
        for (const obj of objectsArray) {
            if (this.selectedObjectIds.has(obj.id) && this.config.enableObjectSelection && this.config.enableObjectManipulation) {
                this.drawSelectionHandles(obj);
            }
        }
        
        // Restore context
        this.ctx.restore();
        
        // Render rulers after main canvas
        if (this.config.showRulers) {
            this.renderRulers();
        }
    }
    
    private drawGrid(): void {
        if (!this.ctx || !this.canvasElement) return;
        
        // Get canvas dimensions
        const rect = this.canvasElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const gridSize = this.config.gridSize || 50;
        const subdivisionSize = gridSize / (this.config.gridSubdivisions || 5);
        const gridColor = this.config.gridColor || '#e0e0e0';
        
        // Calculate visible world bounds
        // The viewport transform is already applied, so we need to convert canvas corners to world space
        // Canvas corners are relative to center: (-width/2, -height/2) to (width/2, height/2)
        // To convert to world space, apply inverse viewport transform
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        // Four corners in canvas space (relative to center)
        const corners = [
            { x: -halfWidth, y: -halfHeight }, // top-left
            { x: halfWidth, y: -halfHeight },  // top-right
            { x: -halfWidth, y: halfHeight },  // bottom-left
            { x: halfWidth, y: halfHeight }    // bottom-right
        ];
        
        // Convert to world space using inverse viewport transform
        // The viewport transform in doRender() applies transforms in this order:
        // ctx.translate(centerX, centerY)      [1st - moves origin to center]
        // ctx.rotate(viewport.rotation)         [2nd - rotates around center]
        // ctx.scale(viewport.scale)            [3rd - scales]
        // ctx.translate(-viewport.x, -viewport.y) [4th - pans]
        //
        // Canvas transforms are applied right-to-left (last transform is applied first to coordinates).
        // So when drawing, coordinates go through: translate(-pan) -> scale -> rotate -> translate(center)
        //
        // To convert canvas coords (relative to center) to world coords, we need the inverse:
        // Since we start relative to center, we skip inverse translate(center)
        // Then: inverse rotate -> inverse scale -> inverse translate(-pan)
        const worldCorners = corners.map(corner => {
            let x = corner.x;
            let y = corner.y;
            
            // Step 1: Inverse rotation (rotate by -angle) - undo the rotation
            if (this.viewport.rotation) {
                const angle = -this.viewport.rotation;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const rotatedX = x * cos - y * sin;
                const rotatedY = x * sin + y * cos;
                x = rotatedX;
                y = rotatedY;
            }
            
            // Step 2: Inverse scale (divide by scale) - undo the scaling
            x /= this.viewport.scale;
            y /= this.viewport.scale;
            
            // Step 3: Inverse pan (add viewport position) - undo the panning
            x += this.viewport.x;
            y += this.viewport.y;
            
            return { x, y };
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:2500',message:'drawGrid() worldCorners calculated',data:{corners:corners,worldCorners:worldCorners,viewportX:this.viewport.x,viewportY:this.viewport.y,viewportScale:this.viewport.scale,viewportRotation:this.viewport.rotation,width,height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        
        // Find bounding box from world corners
        const allX = worldCorners.map(c => c.x);
        const allY = worldCorners.map(c => c.y);
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);
        
        // Extend bounds to ensure full coverage with padding
        const padding = gridSize * 2;
        const gridMinX = Math.floor((minX - padding) / subdivisionSize) * subdivisionSize;
        const gridMaxX = Math.ceil((maxX + padding) / subdivisionSize) * subdivisionSize;
        const gridMinY = Math.floor((minY - padding) / subdivisionSize) * subdivisionSize;
        const gridMaxY = Math.ceil((maxY + padding) / subdivisionSize) * subdivisionSize;
        
        // Use large world bounds to ensure grid extends properly with rotation
        const worldDrawBounds = 100000;
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2fc80fde-f84e-4244-80b8-153922d660c4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'XWUIViewport2D.ts:2525',message:'drawGrid() calculating bounds',data:{gridMinX,gridMaxX,gridMinY,gridMaxY,worldDrawBounds,viewportScale:this.viewport.scale,viewportX:this.viewport.x,viewportY:this.viewport.y,minX,maxX,minY,maxY,width,height,centerX:width/2,centerY:height/2},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        
        this.ctx.save();
        
        // Draw minor grid lines (subdivisions)
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 0.5 / this.viewport.scale;
        this.ctx.globalAlpha = 0.3;
        
        for (let x = gridMinX; x <= gridMaxX; x += subdivisionSize) {
            if (x === 0) continue; // Skip origin for minor lines
            this.ctx.beginPath();
            this.ctx.moveTo(x, -worldDrawBounds);
            this.ctx.lineTo(x, worldDrawBounds);
            this.ctx.stroke();
        }
        
        for (let y = gridMinY; y <= gridMaxY; y += subdivisionSize) {
            if (y === 0) continue; // Skip origin for minor lines
            this.ctx.beginPath();
            this.ctx.moveTo(-worldDrawBounds, y);
            this.ctx.lineTo(worldDrawBounds, y);
            this.ctx.stroke();
        }
        
        // Draw major grid lines
        this.ctx.lineWidth = 1 / this.viewport.scale;
        this.ctx.globalAlpha = 0.5;
        
        for (let x = gridMinX; x <= gridMaxX; x += gridSize) {
            if (x === 0) continue; // Skip origin for major lines (will draw axis separately)
            this.ctx.beginPath();
            this.ctx.moveTo(x, -worldDrawBounds);
            this.ctx.lineTo(x, worldDrawBounds);
            this.ctx.stroke();
        }
        
        for (let y = gridMinY; y <= gridMaxY; y += gridSize) {
            if (y === 0) continue; // Skip origin for major lines (will draw axis separately)
            this.ctx.beginPath();
            this.ctx.moveTo(-worldDrawBounds, y);
            this.ctx.lineTo(worldDrawBounds, y);
            this.ctx.stroke();
        }
        
        // Draw axes (X and Y axis through origin) - thick white lines for visibility
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 2.5 / this.viewport.scale; // Thicker than regular grid lines
        this.ctx.globalAlpha = 0.8;
        
        // X axis (horizontal line at y=0)
        this.ctx.beginPath();
        this.ctx.moveTo(-worldDrawBounds, 0);
        this.ctx.lineTo(worldDrawBounds, 0);
        this.ctx.stroke();
        
        // Y axis (vertical line at x=0)
        this.ctx.beginPath();
        this.ctx.moveTo(0, -worldDrawBounds);
        this.ctx.lineTo(0, worldDrawBounds);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    private drawGuidelines(): void {
        if (!this.ctx || !this.canvasElement || !this.config.guidelines) return;
        
        const guidelineColor = this.config.guidelineColor || '#ffcc00';
        const worldDrawBounds = 100000; // Large bounds to ensure guidelines extend across viewport
        
        this.ctx.save();
        this.ctx.strokeStyle = guidelineColor;
        this.ctx.lineWidth = 2 / this.viewport.scale;
        this.ctx.globalAlpha = 0.6;
        this.ctx.setLineDash([5 / this.viewport.scale, 5 / this.viewport.scale]);
        
        for (const guideline of this.config.guidelines) {
            if (guideline.orientation === 'vertical' && guideline.x !== undefined) {
                this.ctx.beginPath();
                this.ctx.moveTo(guideline.x, -worldDrawBounds);
                this.ctx.lineTo(guideline.x, worldDrawBounds);
                this.ctx.stroke();
            } else if (guideline.orientation === 'horizontal' && guideline.y !== undefined) {
                this.ctx.beginPath();
                this.ctx.moveTo(-worldDrawBounds, guideline.y);
                this.ctx.lineTo(worldDrawBounds, guideline.y);
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
    }
    
    private drawObject(obj: Viewport2DObject): void {
        if (!this.ctx) return;
        
        const isSelected = this.selectedObjectIds.has(obj.id);
        const rotation = obj.rotation || 0;
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        
        this.ctx.save();
        
        // Apply object rotation
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(rotation);
        this.ctx.translate(-centerX, -centerY);
        
        // Draw shape or rectangle
        if (obj.isShape && obj.shape && obj.shape.points.length > 0) {
            // Draw polygon shape
            this.ctx.fillStyle = obj.color || (isSelected ? '#5a8ded' : '#4a90e2');
            this.ctx.beginPath();
            this.ctx.moveTo(obj.shape.points[0].x, obj.shape.points[0].y);
            for (let i = 1; i < obj.shape.points.length; i++) {
                this.ctx.lineTo(obj.shape.points[i].x, obj.shape.points[i].y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            
            // Draw border
            this.ctx.strokeStyle = isSelected ? '#ffcc00' : '#ffffff';
            this.ctx.lineWidth = isSelected ? 3 / this.viewport.scale : 2 / this.viewport.scale;
            this.ctx.stroke();
            
            // Draw shape points if in editing mode and selected
            if (this.isEditingShape && isSelected && obj.id === this.editingShapeId) {
                const pointSize = (this.config.shapePointSize || 6) / this.viewport.scale;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.strokeStyle = '#4a90e2';
                this.ctx.lineWidth = 2 / this.viewport.scale;
                
                for (let i = 0; i < obj.shape.points.length; i++) {
                    const point = obj.shape.points[i];
                    const isEditing = i === this.editingPointIndex;
                    
                    // Highlight the point being edited
                    if (isEditing) {
                        this.ctx.fillStyle = '#ffcc00';
                        this.ctx.strokeStyle = '#ff6600';
                    } else {
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.strokeStyle = '#4a90e2';
                    }
                    
                    this.ctx.fillRect(point.x - pointSize / 2, point.y - pointSize / 2, pointSize, pointSize);
                    this.ctx.strokeRect(point.x - pointSize / 2, point.y - pointSize / 2, pointSize, pointSize);
                }
            }
        } else {
            // Draw rectangle
            this.ctx.fillStyle = obj.color || (isSelected ? '#5a8ded' : '#4a90e2');
            this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            
            // Draw border
            this.ctx.strokeStyle = isSelected ? '#ffcc00' : '#ffffff';
            this.ctx.lineWidth = isSelected ? 3 / this.viewport.scale : 2 / this.viewport.scale;
            this.ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        }
        
        // Draw label if provided
        if (obj.label) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `${12 / this.viewport.scale}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                obj.label,
                obj.x + obj.width / 2,
                obj.y + obj.height / 2
            );
        }
        
        this.ctx.restore();
        
        // Note: Selection handles are now drawn separately after all objects
        // to ensure proper z-ordering
    }
    
    private drawSelectionHandles(obj: Viewport2DObject): void {
        if (!this.ctx) return;
        
        const handleSize = 8 / this.viewport.scale;
        const rotation = obj.rotation || 0;
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(rotation);
        
        const w2 = obj.width / 2;
        const h2 = obj.height / 2;
        const rotHandleDist = h2 + 20 / this.viewport.scale;
        
        // Draw resize handles
        if (this.config.enableObjectResize) {
            const handles: Array<{ x: number; y: number }> = [
                { x: -w2, y: -h2 }, // nw
                { x: 0, y: -h2 },   // n
                { x: w2, y: -h2 },  // ne
                { x: w2, y: 0 },    // e
                { x: w2, y: h2 },   // se
                { x: 0, y: h2 },    // s
                { x: -w2, y: h2 },  // sw
                { x: -w2, y: 0 }    // w
            ];
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.strokeStyle = '#4a90e2';
            this.ctx.lineWidth = 2 / this.viewport.scale;
            
            for (const handle of handles) {
                this.ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
                this.ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
            }
        }
        
        // Draw rotation handle
        if (this.config.enableObjectRotation) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.strokeStyle = '#4a90e2';
            this.ctx.lineWidth = 2 / this.viewport.scale;
            
            // Draw line from top center to rotation handle
            this.ctx.strokeStyle = '#4a90e2';
            this.ctx.lineWidth = 1 / this.viewport.scale;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -h2);
            this.ctx.lineTo(0, -rotHandleDist);
            this.ctx.stroke();
            
            // Draw rotation handle circle
            this.ctx.beginPath();
            this.ctx.arc(0, -rotHandleDist, handleSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    //================================================================================
    // RULERS
    //================================================================================
    
    private renderRulers(): void {
        if (!this.config.showRulers) return;
        
        if (this.topRulerCanvas && this.topRulerCtx) {
            this.drawTopRuler();
        }
        
        if (this.leftRulerCanvas && this.leftRulerCtx) {
            this.drawLeftRuler();
        }
        
        if (this.bottomRulerCanvas && this.bottomRulerCtx) {
            this.drawBottomRuler();
        }
        
        if (this.rightRulerCanvas && this.rightRulerCtx) {
            this.drawRightRuler();
        }
    }
    
    private renderRulersWithMouse(mouseWorldPos: { x: number; y: number } | null): void {
        if (!this.config.showRulers) return;
        
        if (this.topRulerCanvas && this.topRulerCtx) {
            this.drawTopRuler(mouseWorldPos);
        }
        
        if (this.leftRulerCanvas && this.leftRulerCtx) {
            this.drawLeftRuler(mouseWorldPos);
        }
        
        if (this.bottomRulerCanvas && this.bottomRulerCtx) {
            this.drawBottomRuler(mouseWorldPos);
        }
        
        if (this.rightRulerCanvas && this.rightRulerCtx) {
            this.drawRightRuler(mouseWorldPos);
        }
    }
    
    private drawTopRuler(mouseWorldPos: { x: number; y: number } | null = null): void {
        if (!this.topRulerCanvas || !this.topRulerCtx || !this.canvasElement) return;
        
        // Get ruler canvas dimensions (already positioned correctly with left/right margins)
        const rulerRect = this.topRulerCanvas.getBoundingClientRect();
        const width = rulerRect.width;
        const height = rulerRect.height;
        const dpr = window.devicePixelRatio || 1;
        
        this.topRulerCanvas.width = width * dpr;
        this.topRulerCanvas.height = height * dpr;
        this.topRulerCtx.scale(dpr, dpr);
        
        // Clear and background
        this.topRulerCtx.clearRect(0, 0, width, height);
        this.topRulerCtx.fillStyle = this.config.rulerColor || '#f0f0f0';
        this.topRulerCtx.fillRect(0, 0, width, height);
        
        // Border
        this.topRulerCtx.strokeStyle = 'var(--color-border, #e0e0e0)';
        this.topRulerCtx.lineWidth = 1;
        this.topRulerCtx.strokeRect(0, 0, width, height);
        
        // Get canvas dimensions for coordinate calculations
        const canvasRect = this.canvasElement.getBoundingClientRect();
        
        // Calculate visible world coordinates  
        const canvasCenterX = canvasRect.width / 2;
        const worldViewCenterX = this.viewport.x;
        const worldRulerRangeX = canvasRect.width / this.viewport.scale;
        const rulerStartWorldX = worldViewCenterX - worldRulerRangeX / 2;
        const rulerEndWorldX = worldViewCenterX + worldRulerRangeX / 2;
        
        // Determine step size based on zoom
        let step = 50;
        const pixelsPerMajorTick = this.viewport.scale * step;
        if (pixelsPerMajorTick < 30) step *= 2;
        if (pixelsPerMajorTick > 100 && step > 10) step /= 2;
        if (pixelsPerMajorTick > 150 && step > 5) step /= 2;
        
        const tickColor = 'rgba(150, 180, 210, 0.7)';
        const textColor = 'rgba(200, 220, 240, 0.9)';
        const majorTickLength = 10;
        const minorTickLength = 5;
        
        this.topRulerCtx.strokeStyle = tickColor;
        this.topRulerCtx.fillStyle = textColor;
        this.topRulerCtx.font = '10px sans-serif';
        this.topRulerCtx.textAlign = 'center';
        this.topRulerCtx.textBaseline = 'middle';
        
        // Draw ticks
        // Calculate offset: ruler starts at rulerSize from left, so we need to adjust
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetX = rulerSize; // Ruler starts after left ruler
        
        for (let tickWorldX = Math.floor(rulerStartWorldX / step) * step; tickWorldX < rulerEndWorldX + step; tickWorldX += step) {
            // Calculate screen position on the canvas
            const screenXonCanvas = (tickWorldX - worldViewCenterX) * this.viewport.scale + canvasCenterX;
            // Convert to ruler coordinate (ruler is offset from canvas)
            const screenXonRuler = screenXonCanvas - rulerOffsetX;
            
            if (screenXonRuler >= -step && screenXonRuler <= width + step) {
                // Major tick
                this.topRulerCtx.beginPath();
                this.topRulerCtx.moveTo(screenXonRuler, height - majorTickLength);
                this.topRulerCtx.lineTo(screenXonRuler, height);
                this.topRulerCtx.stroke();
                
                // Label
                this.topRulerCtx.fillText(Math.round(tickWorldX).toString(), screenXonRuler, height / 2);
                
                // Minor ticks
                for (let i = 1; i < 5; i++) {
                    const minorTickWorldX = tickWorldX - step + (step / 5) * i;
                    const minorScreenXonCanvas = (minorTickWorldX - worldViewCenterX) * this.viewport.scale + canvasCenterX;
                    const minorScreenXonRuler = minorScreenXonCanvas - rulerOffsetX;
                    if (minorScreenXonRuler >= 0 && minorScreenXonRuler <= width) {
                        this.topRulerCtx.beginPath();
                        this.topRulerCtx.moveTo(minorScreenXonRuler, height - minorTickLength);
                        this.topRulerCtx.lineTo(minorScreenXonRuler, height);
                        this.topRulerCtx.stroke();
                    }
                }
            }
        }
        
        // Draw red mouse position indicator
        if (mouseWorldPos) {
            const mouseScreenXonRuler = (mouseWorldPos.x - worldViewCenterX) * this.viewport.scale + canvasCenterX - rulerOffsetX;
            if (mouseScreenXonRuler >= 0 && mouseScreenXonRuler <= width) {
                this.topRulerCtx.beginPath();
                this.topRulerCtx.moveTo(mouseScreenXonRuler, 0);
                this.topRulerCtx.lineTo(mouseScreenXonRuler, height);
                this.topRulerCtx.strokeStyle = 'rgba(255, 100, 100, 0.9)';
                this.topRulerCtx.lineWidth = 0.5;
                this.topRulerCtx.stroke();
                this.topRulerCtx.lineWidth = 1; // Reset
            }
        }
    }
    
    private drawLeftRuler(mouseWorldPos: { x: number; y: number } | null = null): void {
        if (!this.leftRulerCanvas || !this.leftRulerCtx || !this.canvasElement) return;
        
        // Get ruler canvas dimensions
        const rulerRect = this.leftRulerCanvas.getBoundingClientRect();
        const width = rulerRect.width;
        const height = rulerRect.height;
        const dpr = window.devicePixelRatio || 1;
        
        this.leftRulerCanvas.width = width * dpr;
        this.leftRulerCanvas.height = height * dpr;
        this.leftRulerCtx.scale(dpr, dpr);
        
        // Clear and background
        this.leftRulerCtx.clearRect(0, 0, width, height);
        this.leftRulerCtx.fillStyle = this.config.rulerColor || '#f0f0f0';
        this.leftRulerCtx.fillRect(0, 0, width, height);
        
        // Border
        this.leftRulerCtx.strokeStyle = 'var(--color-border, #e0e0e0)';
        this.leftRulerCtx.lineWidth = 1;
        this.leftRulerCtx.strokeRect(0, 0, width, height);
        
        // Get canvas dimensions for coordinate calculations
        const canvasRect = this.canvasElement.getBoundingClientRect();
        
        // Calculate visible world coordinates
        const canvasCenterY = canvasRect.height / 2;
        const worldViewCenterY = this.viewport.y;
        const worldRulerRangeY = canvasRect.height / this.viewport.scale;
        const rulerStartWorldY = worldViewCenterY - worldRulerRangeY / 2;
        const rulerEndWorldY = worldViewCenterY + worldRulerRangeY / 2;
        
        // Determine step size based on zoom
        let step = 50;
        const pixelsPerMajorTick = this.viewport.scale * step;
        if (pixelsPerMajorTick < 30) step *= 2;
        if (pixelsPerMajorTick > 100 && step > 10) step /= 2;
        if (pixelsPerMajorTick > 150 && step > 5) step /= 2;
        
        const tickColor = 'rgba(150, 180, 210, 0.7)';
        const textColor = 'rgba(200, 220, 240, 0.9)';
        const majorTickLength = 10;
        const minorTickLength = 5;
        const textOffsetX = width / 2 - 7;
        
        this.leftRulerCtx.strokeStyle = tickColor;
        this.leftRulerCtx.fillStyle = textColor;
        this.leftRulerCtx.font = '10px sans-serif';
        this.leftRulerCtx.textAlign = 'center';
        this.leftRulerCtx.textBaseline = 'middle';
        
        // Draw ticks
        // Calculate offset: ruler starts at rulerSize from top
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetY = rulerSize; // Ruler starts after top ruler
        
        for (let tickWorldY = Math.floor(rulerStartWorldY / step) * step; tickWorldY < rulerEndWorldY + step; tickWorldY += step) {
            // Calculate screen position on the canvas
            const screenYonCanvas = (tickWorldY - worldViewCenterY) * this.viewport.scale + canvasCenterY;
            // Convert to ruler coordinate (ruler is offset from canvas)
            const screenYonRuler = screenYonCanvas - rulerOffsetY;
            
            if (screenYonRuler >= -step && screenYonRuler <= height + step) {
                // Major tick
                this.leftRulerCtx.beginPath();
                this.leftRulerCtx.moveTo(width - majorTickLength, screenYonRuler);
                this.leftRulerCtx.lineTo(width, screenYonRuler);
                this.leftRulerCtx.stroke();
                
                // Label (rotated)
                this.leftRulerCtx.save();
                this.leftRulerCtx.translate(textOffsetX, screenYonRuler);
                this.leftRulerCtx.rotate(-Math.PI / 2);
                this.leftRulerCtx.fillText(Math.round(tickWorldY).toString(), 0, 0);
                this.leftRulerCtx.restore();
                
                // Minor ticks
                for (let i = 1; i < 5; i++) {
                    const minorTickWorldY = tickWorldY - step + (step / 5) * i;
                    const minorScreenYonCanvas = (minorTickWorldY - worldViewCenterY) * this.viewport.scale + canvasCenterY;
                    const minorScreenYonRuler = minorScreenYonCanvas - rulerOffsetY;
                    if (minorScreenYonRuler >= 0 && minorScreenYonRuler <= height) {
                        this.leftRulerCtx.beginPath();
                        this.leftRulerCtx.moveTo(width - minorTickLength, minorScreenYonRuler);
                        this.leftRulerCtx.lineTo(width, minorScreenYonRuler);
                        this.leftRulerCtx.stroke();
                    }
                }
            }
        }
        
        // Draw red mouse position indicator
        if (mouseWorldPos) {
            const mouseScreenYonRuler = (mouseWorldPos.y - worldViewCenterY) * this.viewport.scale + canvasCenterY - rulerOffsetY;
            if (mouseScreenYonRuler >= 0 && mouseScreenYonRuler <= height) {
                this.leftRulerCtx.beginPath();
                this.leftRulerCtx.moveTo(0, mouseScreenYonRuler);
                this.leftRulerCtx.lineTo(width, mouseScreenYonRuler);
                this.leftRulerCtx.strokeStyle = 'rgba(255, 100, 100, 0.9)';
                this.leftRulerCtx.lineWidth = 0.5;
                this.leftRulerCtx.stroke();
                this.leftRulerCtx.lineWidth = 1; // Reset
            }
        }
    }
    
    private drawBottomRuler(mouseWorldPos: { x: number; y: number } | null = null): void {
        if (!this.bottomRulerCanvas || !this.bottomRulerCtx || !this.canvasElement) return;
        
        // Get ruler canvas dimensions
        const rulerRect = this.bottomRulerCanvas.getBoundingClientRect();
        const width = rulerRect.width;
        const height = rulerRect.height;
        const dpr = window.devicePixelRatio || 1;
        
        this.bottomRulerCanvas.width = width * dpr;
        this.bottomRulerCanvas.height = height * dpr;
        this.bottomRulerCtx.scale(dpr, dpr);
        
        // Clear and background
        this.bottomRulerCtx.clearRect(0, 0, width, height);
        this.bottomRulerCtx.fillStyle = this.config.rulerColor || '#f0f0f0';
        this.bottomRulerCtx.fillRect(0, 0, width, height);
        
        // Border
        this.bottomRulerCtx.strokeStyle = 'var(--color-border, #e0e0e0)';
        this.bottomRulerCtx.lineWidth = 1;
        this.bottomRulerCtx.strokeRect(0, 0, width, height);
        
        // Get canvas dimensions for coordinate calculations
        const canvasRect = this.canvasElement.getBoundingClientRect();
        
        // Calculate visible world coordinates
        const canvasCenterX = canvasRect.width / 2;
        const worldViewCenterX = this.viewport.x;
        const worldRulerRangeX = canvasRect.width / this.viewport.scale;
        const rulerStartWorldX = worldViewCenterX - worldRulerRangeX / 2;
        const rulerEndWorldX = worldViewCenterX + worldRulerRangeX / 2;
        
        // Determine step size based on zoom
        let step = 50;
        const pixelsPerMajorTick = this.viewport.scale * step;
        if (pixelsPerMajorTick < 30) step *= 2;
        if (pixelsPerMajorTick > 100 && step > 10) step /= 2;
        if (pixelsPerMajorTick > 150 && step > 5) step /= 2;
        
        const tickColor = 'rgba(150, 180, 210, 0.7)';
        const textColor = 'rgba(200, 220, 240, 0.9)';
        const majorTickLength = 10;
        const minorTickLength = 5;
        
        this.bottomRulerCtx.strokeStyle = tickColor;
        this.bottomRulerCtx.fillStyle = textColor;
        this.bottomRulerCtx.font = '10px sans-serif';
        this.bottomRulerCtx.textAlign = 'center';
        this.bottomRulerCtx.textBaseline = 'middle';
        
        // Draw ticks (inverted - ticks go upward)
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetX = rulerSize; // Ruler starts after left ruler
        
        for (let tickWorldX = Math.floor(rulerStartWorldX / step) * step; tickWorldX < rulerEndWorldX + step; tickWorldX += step) {
            const screenXonCanvas = (tickWorldX - worldViewCenterX) * this.viewport.scale + canvasCenterX;
            const screenXonRuler = screenXonCanvas - rulerOffsetX;
            
            if (screenXonRuler >= -step && screenXonRuler <= width + step) {
                // Major tick
                this.bottomRulerCtx.beginPath();
                this.bottomRulerCtx.moveTo(screenXonRuler, 0);
                this.bottomRulerCtx.lineTo(screenXonRuler, majorTickLength);
                this.bottomRulerCtx.stroke();
                
                // Label
                this.bottomRulerCtx.fillText(Math.round(tickWorldX).toString(), screenXonRuler, height / 2);
                
                // Minor ticks
                for (let i = 1; i < 5; i++) {
                    const minorTickWorldX = tickWorldX - step + (step / 5) * i;
                    const minorScreenXonCanvas = (minorTickWorldX - worldViewCenterX) * this.viewport.scale + canvasCenterX;
                    const minorScreenXonRuler = minorScreenXonCanvas - rulerOffsetX;
                    if (minorScreenXonRuler >= 0 && minorScreenXonRuler <= width) {
                        this.bottomRulerCtx.beginPath();
                        this.bottomRulerCtx.moveTo(minorScreenXonRuler, 0);
                        this.bottomRulerCtx.lineTo(minorScreenXonRuler, minorTickLength);
                        this.bottomRulerCtx.stroke();
                    }
                }
            }
        }
        
        // Draw red mouse position indicator
        if (mouseWorldPos) {
            const mouseScreenXonRuler = (mouseWorldPos.x - worldViewCenterX) * this.viewport.scale + canvasCenterX - rulerOffsetX;
            if (mouseScreenXonRuler >= 0 && mouseScreenXonRuler <= width) {
                this.bottomRulerCtx.beginPath();
                this.bottomRulerCtx.moveTo(mouseScreenXonRuler, 0);
                this.bottomRulerCtx.lineTo(mouseScreenXonRuler, height);
                this.bottomRulerCtx.strokeStyle = 'rgba(255, 100, 100, 0.9)';
                this.bottomRulerCtx.lineWidth = 0.5;
                this.bottomRulerCtx.stroke();
                this.bottomRulerCtx.lineWidth = 1; // Reset
            }
        }
    }
    
    private drawRightRuler(mouseWorldPos: { x: number; y: number } | null = null): void {
        if (!this.rightRulerCanvas || !this.rightRulerCtx || !this.canvasElement) return;
        
        // Get ruler canvas dimensions
        const rulerRect = this.rightRulerCanvas.getBoundingClientRect();
        const width = rulerRect.width;
        const height = rulerRect.height;
        const dpr = window.devicePixelRatio || 1;
        
        this.rightRulerCanvas.width = width * dpr;
        this.rightRulerCanvas.height = height * dpr;
        this.rightRulerCtx.scale(dpr, dpr);
        
        // Clear and background
        this.rightRulerCtx.clearRect(0, 0, width, height);
        this.rightRulerCtx.fillStyle = this.config.rulerColor || '#f0f0f0';
        this.rightRulerCtx.fillRect(0, 0, width, height);
        
        // Border
        this.rightRulerCtx.strokeStyle = 'var(--color-border, #e0e0e0)';
        this.rightRulerCtx.lineWidth = 1;
        this.rightRulerCtx.strokeRect(0, 0, width, height);
        
        // Get canvas dimensions for coordinate calculations
        const canvasRect = this.canvasElement.getBoundingClientRect();
        
        // Calculate visible world coordinates
        const canvasCenterY = canvasRect.height / 2;
        const worldViewCenterY = this.viewport.y;
        const worldRulerRangeY = canvasRect.height / this.viewport.scale;
        const rulerStartWorldY = worldViewCenterY - worldRulerRangeY / 2;
        const rulerEndWorldY = worldViewCenterY + worldRulerRangeY / 2;
        
        // Determine step size based on zoom
        let step = 50;
        const pixelsPerMajorTick = this.viewport.scale * step;
        if (pixelsPerMajorTick < 30) step *= 2;
        if (pixelsPerMajorTick > 100 && step > 10) step /= 2;
        if (pixelsPerMajorTick > 150 && step > 5) step /= 2;
        
        const tickColor = 'rgba(150, 180, 210, 0.7)';
        const textColor = 'rgba(200, 220, 240, 0.9)';
        const majorTickLength = 10;
        const minorTickLength = 5;
        const textOffsetX = width / 2 - 7;
        
        this.rightRulerCtx.strokeStyle = tickColor;
        this.rightRulerCtx.fillStyle = textColor;
        this.rightRulerCtx.font = '10px sans-serif';
        this.rightRulerCtx.textAlign = 'center';
        this.rightRulerCtx.textBaseline = 'middle';
        
        // Draw ticks (inverted - ticks go leftward)
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetY = rulerSize; // Ruler starts after top ruler
        
        for (let tickWorldY = Math.floor(rulerStartWorldY / step) * step; tickWorldY < rulerEndWorldY + step; tickWorldY += step) {
            const screenYonCanvas = (tickWorldY - worldViewCenterY) * this.viewport.scale + canvasCenterY;
            const screenYonRuler = screenYonCanvas - rulerOffsetY;
            
            if (screenYonRuler >= -step && screenYonRuler <= height + step) {
                // Major tick
                this.rightRulerCtx.beginPath();
                this.rightRulerCtx.moveTo(0, screenYonRuler);
                this.rightRulerCtx.lineTo(majorTickLength, screenYonRuler);
                this.rightRulerCtx.stroke();
                
                // Label (rotated)
                this.rightRulerCtx.save();
                this.rightRulerCtx.translate(textOffsetX, screenYonRuler);
                this.rightRulerCtx.rotate(-Math.PI / 2);
                this.rightRulerCtx.fillText(Math.round(tickWorldY).toString(), 0, 0);
                this.rightRulerCtx.restore();
                
                // Minor ticks
                for (let i = 1; i < 5; i++) {
                    const minorTickWorldY = tickWorldY - step + (step / 5) * i;
                    const minorScreenYonCanvas = (minorTickWorldY - worldViewCenterY) * this.viewport.scale + canvasCenterY;
                    const minorScreenYonRuler = minorScreenYonCanvas - rulerOffsetY;
                    if (minorScreenYonRuler >= 0 && minorScreenYonRuler <= height) {
                        this.rightRulerCtx.beginPath();
                        this.rightRulerCtx.moveTo(0, minorScreenYonRuler);
                        this.rightRulerCtx.lineTo(minorTickLength, minorScreenYonRuler);
                        this.rightRulerCtx.stroke();
                    }
                }
            }
        }
        
        // Draw red mouse position indicator
        if (mouseWorldPos) {
            const mouseScreenYonRuler = (mouseWorldPos.y - worldViewCenterY) * this.viewport.scale + canvasCenterY - rulerOffsetY;
            if (mouseScreenYonRuler >= 0 && mouseScreenYonRuler <= height) {
                this.rightRulerCtx.beginPath();
                this.rightRulerCtx.moveTo(0, mouseScreenYonRuler);
                this.rightRulerCtx.lineTo(width, mouseScreenYonRuler);
                this.rightRulerCtx.strokeStyle = 'rgba(255, 100, 100, 0.9)';
                this.rightRulerCtx.lineWidth = 0.5;
                this.rightRulerCtx.stroke();
                this.rightRulerCtx.lineWidth = 1; // Reset
            }
        }
    }
    
    //================================================================================
    // OBJECT MANIPULATION HELPERS
    //================================================================================
    
    private isPointInObject(point: { x: number; y: number }, obj: Viewport2DObject): boolean {
        // Handle shapes differently
        if (obj.isShape && obj.shape) {
            // For shapes, use the shape's point-in-polygon test
            return obj.shape.isPointInside(point);
        }
        
        // For rectangles, use rotation-aware bounding box check
        const rotation = obj.rotation || 0;
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        
        // Transform point to object's local space
        const dx = point.x - centerX;
        const dy = point.y - centerY;
        
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        
        // Check if in bounds
        return localX >= -obj.width / 2 && localX <= obj.width / 2 &&
               localY >= -obj.height / 2 && localY <= obj.height / 2;
    }
    
    private getHandleAtPosition(point: { x: number; y: number }, obj: Viewport2DObject): string | null {
        if (!this.config.enableObjectManipulation) return null;
        
        const handleSize = 8 / this.viewport.scale;
        const rotation = obj.rotation || 0;
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        
        // Transform point to object's local space
        const dx = point.x - centerX;
        const dy = point.y - centerY;
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        
        const w2 = obj.width / 2;
        const h2 = obj.height / 2;
        
        // Check corner handles
        if (Math.abs(localX - w2) < handleSize && Math.abs(localY - h2) < handleSize) return 'se';
        if (Math.abs(localX - w2) < handleSize && Math.abs(localY + h2) < handleSize) return 'ne';
        if (Math.abs(localX + w2) < handleSize && Math.abs(localY - h2) < handleSize) return 'sw';
        if (Math.abs(localX + w2) < handleSize && Math.abs(localY + h2) < handleSize) return 'nw';
        
        // Check edge handles
        if (Math.abs(localX - w2) < handleSize && Math.abs(localY) <= h2) return 'e';
        if (Math.abs(localX + w2) < handleSize && Math.abs(localY) <= h2) return 'w';
        if (Math.abs(localY - h2) < handleSize && Math.abs(localX) <= w2) return 's';
        if (Math.abs(localY + h2) < handleSize && Math.abs(localX) <= w2) return 'n';
        
        // Check rotation handle (above object)
        // Only check if rotation is enabled
        if (this.config.enableObjectRotation) {
            const rotHandleDist = h2 + 20 / this.viewport.scale;
            // Rotation handle is at (0, -rotHandleDist) in local coordinates (above center)
            // So we check distance to that point: (localY - (-rotHandleDist)) = (localY + rotHandleDist)
            const dist = Math.sqrt(localX * localX + (localY + rotHandleDist) * (localY + rotHandleDist));
            if (dist < handleSize) return 'rotate';
        }
        
        return null;
    }
    
    private getResizeCursor(handle: string): string {
        const cursors: Record<string, string> = {
            'n': 'n-resize',
            's': 's-resize',
            'e': 'e-resize',
            'w': 'w-resize',
            'ne': 'ne-resize',
            'nw': 'nw-resize',
            'se': 'se-resize',
            'sw': 'sw-resize'
        };
        return cursors[handle] || 'default';
    }
    
    private updatePanCursor(dx: number, dy: number): void {
        if (!this.canvasElement) return;
        
        // Calculate angle from movement direction
        const angle = Math.atan2(dy, dx);
        const angleDeg = (angle * 180 / Math.PI + 360) % 360;
        
        // Determine direction based on angle (8 directions)
        let cursor: string;
        
        // Use a threshold to avoid jitter when movement is minimal
        const threshold = 2; // pixels
        if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
            cursor = 'grabbing';
        } else if (angleDeg >= 337.5 || angleDeg < 22.5) {
            cursor = 'e-resize'; // Right
        } else if (angleDeg >= 22.5 && angleDeg < 67.5) {
            cursor = 'se-resize'; // Down-Right
        } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
            cursor = 's-resize'; // Down
        } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
            cursor = 'sw-resize'; // Down-Left
        } else if (angleDeg >= 157.5 && angleDeg < 202.5) {
            cursor = 'w-resize'; // Left
        } else if (angleDeg >= 202.5 && angleDeg < 247.5) {
            cursor = 'nw-resize'; // Up-Left
        } else if (angleDeg >= 247.5 && angleDeg < 292.5) {
            cursor = 'n-resize'; // Up
        } else {
            cursor = 'ne-resize'; // Up-Right
        }
        
        this.canvasElement.style.cursor = cursor;
    }
    
    //================================================================================
    // PUBLIC API
    //================================================================================
    
    public getViewportState(): ViewportState {
        return { ...this.viewport };
    }
    
    public addObject(obj: Viewport2DObject): void {
        const objectWithZ = { ...obj };
        // Assign zIndex if not provided (use max zIndex + 1 to put on top)
        if (objectWithZ.zIndex === undefined) {
            const maxZ = Math.max(...Array.from(this.objects.values()).map(o => o.zIndex ?? 0), -1);
            objectWithZ.zIndex = maxZ + 1;
        }
        this.objects.set(objectWithZ.id, objectWithZ);
        this.render();
    }
    
    public removeObject(id: string): void {
        this.objects.delete(id);
        this.selectedObjectIds.delete(id);
        this.render();
    }
    
    public getObjects(): Viewport2DObject[] {
        return Array.from(this.objects.values());
    }
    
    /**
     * Enable/disable shape editing mode
     */
    public setShapeEditingMode(enabled: boolean): void {
        this.isEditingShape = enabled;
        if (!enabled) {
            this.editingShapeId = null;
            this.editingPointIndex = null;
            this.isDraggingPoint = false;
        }
        this.render();
    }
    
    /**
     * Get shape editing mode state
     */
    public getShapeEditingMode(): boolean {
        return this.isEditingShape;
    }
    
    /**
     * Find shape point at a given position
     */
    private getShapePointAtPosition(point: { x: number; y: number }, obj: Viewport2DObject): number | null {
        if (!obj.shape || !obj.isShape) return null;
        
        const pointSize = (this.config.shapePointSize || 6) / this.viewport.scale;
        const threshold = pointSize * 2; // Make it easier to click
        
        for (let i = 0; i < obj.shape.points.length; i++) {
            const shapePoint = obj.shape.points[i];
            const dx = point.x - shapePoint.x;
            const dy = point.y - shapePoint.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist <= threshold) {
                return i;
            }
        }
        
        return null;
    }
    
    /**
     * Add a point to a shape at the closest edge position
     */
    private addPointToShape(obj: Viewport2DObject, worldPos: { x: number; y: number }): void {
        if (!obj.shape || !obj.isShape) return;
        
        const closestEdge = obj.shape.findClosestEdgePoint(worldPos);
        if (!closestEdge) return;
        
        // Insert point after the segment
        const insertIndex = closestEdge.segmentIndex + 1;
        obj.shape.insertPoint(insertIndex, closestEdge.point);
        
        // Update bounding box
        const bbox = obj.shape.getBoundingBox();
        obj.x = bbox.x;
        obj.y = bbox.y;
        obj.width = bbox.width;
        obj.height = bbox.height;
        
        this.render();
    }
    
    /**
     * Remove a point from a shape
     */
    private removePointFromShape(obj: Viewport2DObject, pointIndex: number): void {
        if (!obj.shape || !obj.isShape) return;
        if (obj.shape.points.length <= 3) return; // Don't allow removing if only 3 points (minimum for polygon)
        
        obj.shape.removePoint(pointIndex);
        
        // Update bounding box
        const bbox = obj.shape.getBoundingBox();
        obj.x = bbox.x;
        obj.y = bbox.y;
        obj.width = bbox.width;
        obj.height = bbox.height;
        
        this.render();
    }
    
    /**
     * Show context menu on right-click
     */
    private showContextMenu(e: MouseEvent): void {
        if (!this.canvasElement) return;
        
        // Don't show menu if we're currently dragging or resizing
        if (this.isDragging || this.isResizing || this.isRotating) {
            return;
        }
        
        const worldPos = this.screenToWorld(e.clientX, e.clientY);
        
        // Check if right-clicking on a selected object
        let clickedOnSelected = false;
        for (const id of this.selectedObjectIds) {
            const obj = this.objects.get(id);
            if (obj && this.isPointInObject(worldPos, obj)) {
                clickedOnSelected = true;
                break;
            }
        }
        
        // If clicking on empty space or non-selected object, don't show menu
        if (!clickedOnSelected && this.selectedObjectIds.size === 0) {
            return;
        }
        
        // Remove existing context menu
        const existingMenu = document.querySelector('.xwui-viewport2d-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'xwui-viewport2d-context-menu';
        menu.style.position = 'fixed';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.style.zIndex = '999999';
        menu.style.pointerEvents = 'auto';
        menu.style.backgroundColor = 'var(--bg-primary, #ffffff)';
        menu.style.border = '1px solid var(--border-color, #e0e0e0)';
        menu.style.borderRadius = 'var(--radius-md, 8px)';
        menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        menu.style.padding = '0.25rem';
        menu.style.minWidth = '180px';
        menu.style.pointerEvents = 'auto';
        
        // Close menu when clicking outside
        const closeMenu = (event: MouseEvent) => {
            if (!menu.contains(event.target as Node)) {
                menu.remove();
                document.removeEventListener('mousedown', closeMenu);
            }
        };
        
        const menuItems = [
            { label: 'Bring to Front', action: () => this.bringToFront() },
            { label: 'Bring Forward', action: () => this.bringForward() },
            { label: 'Send Backward', action: () => this.sendBackward() },
            { label: 'Send to Back', action: () => this.sendToBack() }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'xwui-viewport2d-context-menu-item';
            menuItem.textContent = item.label;
            menuItem.style.padding = '0.5rem 1rem';
            menuItem.style.cursor = 'pointer';
            menuItem.style.borderRadius = 'var(--radius-sm, 4px)';
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.backgroundColor = 'var(--bg-secondary, #f5f5f5)';
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.backgroundColor = 'transparent';
            });
            menuItem.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault();
            });
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                item.action();
                menu.remove();
                document.removeEventListener('mousedown', closeMenu);
            });
            menu.appendChild(menuItem);
        });
        
        document.body.appendChild(menu);
        
        // Add close menu listener with delay to allow menu items to be clickable
        setTimeout(() => {
            document.addEventListener('mousedown', closeMenu);
        }, 100);
    }
    
    /**
     * Z-order management methods
     */
    private bringToFront(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        const maxZ = Math.max(...Array.from(this.objects.values()).map(o => o.zIndex ?? 0));
        let newZ = maxZ + 1;
        
        for (const id of this.selectedObjectIds) {
            const obj = this.objects.get(id);
            if (obj) {
                obj.zIndex = newZ++;
            }
        }
        
        this.render();
    }
    
    private bringForward(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        const objectsArray = Array.from(this.objects.values());
        objectsArray.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
        
        for (const id of this.selectedObjectIds) {
            const obj = this.objects.get(id);
            if (!obj) continue;
            
            const currentZ = obj.zIndex ?? 0;
            // Find the next object above this one
            const nextObj = objectsArray.find(o => (o.zIndex ?? 0) > currentZ && !this.selectedObjectIds.has(o.id));
            
            if (nextObj) {
                // Swap zIndex with the object above
                const tempZ = obj.zIndex;
                obj.zIndex = nextObj.zIndex;
                nextObj.zIndex = tempZ;
            } else {
                // Already at front, just increment
                obj.zIndex = (obj.zIndex ?? 0) + 1;
            }
        }
        
        this.render();
    }
    
    private sendBackward(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        const objectsArray = Array.from(this.objects.values());
        objectsArray.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
        
        for (const id of this.selectedObjectIds) {
            const obj = this.objects.get(id);
            if (!obj) continue;
            
            const currentZ = obj.zIndex ?? 0;
            // Find the next object below this one (reverse order)
            const reversedArray = [...objectsArray].reverse();
            const nextObj = reversedArray.find(o => (o.zIndex ?? 0) < currentZ && !this.selectedObjectIds.has(o.id));
            
            if (nextObj) {
                // Swap zIndex with the object below
                const tempZ = obj.zIndex;
                obj.zIndex = nextObj.zIndex;
                nextObj.zIndex = tempZ;
            } else {
                // Already at back, just decrement
                obj.zIndex = Math.max(0, (obj.zIndex ?? 0) - 1);
            }
        }
        
        this.render();
    }
    
    private sendToBack(): void {
        if (this.selectedObjectIds.size === 0) return;
        
        const minZ = Math.min(...Array.from(this.objects.values()).map(o => o.zIndex ?? 0));
        let newZ = minZ - 1;
        
        for (const id of this.selectedObjectIds) {
            const obj = this.objects.get(id);
            if (obj) {
                obj.zIndex = newZ--;
            }
        }
        
        this.render();
    }
    
    /**
     * Update canvas layout based on ruler visibility
     * Expands canvas to fill space when rulers are hidden, shrinks when shown
     */
    public updateCanvasLayout(): void {
        if (!this.canvasElement) return;
        
        const rulerSize = this.config.rulerSize || 30;
        
        if (this.config.showRulers) {
            this.canvasElement.style.marginTop = `${rulerSize}px`;
            this.canvasElement.style.marginLeft = `${rulerSize}px`;
            this.canvasElement.style.marginBottom = `${rulerSize}px`;
            this.canvasElement.style.marginRight = `${rulerSize}px`;
        } else {
            // Remove margins to expand canvas
            // This allows canvas to fill space of both top and bottom rulers
            this.canvasElement.style.marginTop = '0';
            this.canvasElement.style.marginLeft = '0';
            this.canvasElement.style.marginBottom = '0';
            this.canvasElement.style.marginRight = '0';
        }
        
        // Use double requestAnimationFrame to ensure DOM has updated and layout is calculated
        // This is especially important when rulers are first shown, as margins need to be applied
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Trigger window resize to call resizeCanvas() which will update canvas size and render
                window.dispatchEvent(new Event('resize'));
            });
        });
    }
    
    public destroy(): void {
        // Remove event listeners
        if (this.canvasElement) {
            if (this.boundHandleMouseDown) {
                this.canvasElement.removeEventListener('mousedown', this.boundHandleMouseDown);
                this.boundHandleMouseDown = null;
            }
            if (this.boundHandleMouseMove) {
                this.canvasElement.removeEventListener('mousemove', this.boundHandleMouseMove);
                this.boundHandleMouseMove = null;
            }
            if (this.boundHandleMouseUp) {
                this.canvasElement.removeEventListener('mouseup', this.boundHandleMouseUp);
                this.canvasElement.removeEventListener('mouseleave', this.boundHandleMouseUp);
                this.boundHandleMouseUp = null;
            }
            if (this.boundHandleWheel) {
                this.canvasElement.removeEventListener('wheel', this.boundHandleWheel);
                this.boundHandleWheel = null;
            }
            if (this.boundHandleTouchStart) {
                this.canvasElement.removeEventListener('touchstart', this.boundHandleTouchStart);
                this.boundHandleTouchStart = null;
            }
            if (this.boundHandleTouchMove) {
                this.canvasElement.removeEventListener('touchmove', this.boundHandleTouchMove);
                this.boundHandleTouchMove = null;
            }
            if (this.boundHandleTouchEnd) {
                this.canvasElement.removeEventListener('touchend', this.boundHandleTouchEnd);
                this.canvasElement.removeEventListener('touchcancel', this.boundHandleTouchEnd);
                this.boundHandleTouchEnd = null;
            }
            if (this.boundHandleAuxClick) {
                this.canvasElement.removeEventListener('auxclick', this.boundHandleAuxClick);
                this.boundHandleAuxClick = null;
            }
        }
        
        // Remove keyboard handlers
        if (this.boundHandleKeyDown) {
            window.removeEventListener('keydown', this.boundHandleKeyDown);
            this.boundHandleKeyDown = null;
        }
        if (this.boundHandleKeyUp) {
            window.removeEventListener('keyup', this.boundHandleKeyUp);
            this.boundHandleKeyUp = null;
        }
        
        // Remove document-level mouse listeners
        if (this.boundHandleMouseMove) {
            document.removeEventListener('mousemove', this.boundHandleMouseMove);
        }
        if (this.boundHandleMouseUp) {
            document.removeEventListener('mouseup', this.boundHandleMouseUp);
        }
        
        if (this.boundHandleViewportChange) {
            if (this.nav) {
                this.nav.container.removeEventListener('viewport-change', this.boundHandleViewportChange as EventListener);
            }
            if (this.wrapperElement) {
                this.wrapperElement.removeEventListener('viewport-change', this.boundHandleViewportChange as EventListener);
            }
            this.boundHandleViewportChange = null;
        }
        
        // Remove nav reset button click listener
        if (this.boundHandleNavResetClick && this.nav) {
            this.nav.container.removeEventListener('click', this.boundHandleNavResetClick, true);
            this.boundHandleNavResetClick = null;
        }
        
        // Remove resize listener
        const resizeHandler = () => this.resizeCanvas();
        window.removeEventListener('resize', resizeHandler);
        
        // Clear shortcuts
        if (this.shortcuts) {
            this.shortcuts.destroy();
            this.shortcuts = null;
        }
        
        // Clear references
        this.wrapperElement = null;
        this.canvasElement = null;
        this.ctx = null;
        this.nav = null;
        this.objects.clear();
        this.clipboard = [];
        this.undoStack = [];
        this.redoStack = [];
        
        super.destroy();
    }
}

(XWUIViewport2D as any).componentName = 'XWUIViewport2D';

