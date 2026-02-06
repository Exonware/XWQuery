/**
 * XWUIViewport3D Component
 * 3D viewport with Three.js, transform system, coordinate conversion, and 3D rendering
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUINav, type ViewportState } from '../XWUINav/XWUINav';
import * as THREE from 'three';

//================================================================================
// TYPES
//================================================================================

export interface Viewport3DObject {
    id: string;
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;
    color?: string;
    label?: string;
}

// Component-level configuration
export interface XWUIViewport3DConfig {
    initialX?: number;         // Default: 0
    initialY?: number;         // Default: 0
    initialZ?: number;         // Default: 0
    initialScale?: number;     // Default: 1
    initialRotationX?: number; // Default: 0
    initialRotationY?: number; // Default: 0
    initialRotationZ?: number; // Default: 0
    minScale?: number;         // Default: 0.1
    maxScale?: number;         // Default: 10
    
    // Navigation
    enableNavigation?: boolean;  // Default: true
    navControlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    
    // Grid
    showGrid?: boolean;         // Default: true
    gridSize?: number;          // Default: 50
    gridColor?: string;         // Default: #e0e0e0
    gridSubdivisions?: number;  // Default: 5
    
    // Rulers (projected to 2D for display)
    showRulers?: boolean;       // Default: true
    rulerSize?: number;         // Default: 30
    rulerColor?: string;        // Default: #f0f0f0
    
    // Object manipulation
    enableObjectManipulation?: boolean;  // Default: true
    enableObjectSelection?: boolean;     // Default: true
    
    className?: string;
}

// Data type
export interface XWUIViewport3DData {
    objects?: Viewport3DObject[];
}

export class XWUIViewport3D extends XWUIComponent<XWUIViewport3DData, XWUIViewport3DConfig> {
    private wrapperElement: HTMLElement | null = null;
    private renderer: THREE.WebGLRenderer | null = null;
    private scene: THREE.Scene | null = null;
    private camera: THREE.PerspectiveCamera | null = null;
    private gridHelper: THREE.GridHelper | null = null;
    private axesHelper: THREE.AxesHelper | null = null;
    
    // Viewport state
    public viewport: ViewportState;
    
    // Navigation component
    private nav: XWUINav | null = null;
    
    // Objects (Three.js meshes)
    private objects: Map<string, Viewport3DObject> = new Map();
    private objectMeshes: Map<string, THREE.Mesh> = new Map();
    private selectedObjectId: string | null = null;
    
    // Interaction state
    private isDragging: boolean = false;
    private dragStart: { x: number; y: number } | null = null;
    private draggedObjectId: string | null = null;
    private isPanning: boolean = false;
    private panStart: { x: number; y: number } | null = null;
    private isRotating: boolean = false;
    private rotateStart: { x: number; y: number } | null = null;
    private spacePressed: boolean = false;
    private lastMouseWorldPos: { x: number; y: number; z: number } | null = null;
    
    // Rulers (for 2D projection display)
    private topRulerCanvas: HTMLCanvasElement | null = null;
    private leftRulerCanvas: HTMLCanvasElement | null = null;
    private bottomRulerCanvas: HTMLCanvasElement | null = null;
    private rightRulerCanvas: HTMLCanvasElement | null = null;
    private topRulerCtx: CanvasRenderingContext2D | null = null;
    private leftRulerCtx: CanvasRenderingContext2D | null = null;
    private bottomRulerCtx: CanvasRenderingContext2D | null = null;
    private rightRulerCtx: CanvasRenderingContext2D | null = null;
    
    // Event handlers
    private boundHandleMouseDown: ((e: MouseEvent) => void) | null = null;
    private boundHandleMouseMove: ((e: MouseEvent) => void) | null = null;
    private boundHandleMouseUp: ((e: MouseEvent) => void) | null = null;
    private boundHandleWheel: ((e: WheelEvent) => void) | null = null;
    private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;
    private boundHandleKeyUp: ((e: KeyboardEvent) => void) | null = null;
    private boundHandleAuxClick: ((e: MouseEvent) => void) | null = null;
    private boundHandleViewportChange: ((e: CustomEvent) => void) | null = null;
    private animationFrameId: number | null = null;
    
    constructor(
        container: HTMLElement,
        data: XWUIViewport3DData = {},
        conf_comp: XWUIViewport3DConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Initialize viewport state
        this.viewport = {
            x: conf_comp.initialX ?? 0,
            y: conf_comp.initialY ?? 0,
            z: conf_comp.initialZ ?? 0,
            scale: conf_comp.initialScale ?? 1,
            rotationX: conf_comp.initialRotationX ?? 0,
            rotationY: conf_comp.initialRotationY ?? 0,
            rotationZ: conf_comp.initialRotationZ ?? 0
        };
        
        this.initializeObjects();
        this.setupDOM();
        this.setupEventListeners();
        this.startRenderLoop();
    }
    
    protected createConfig(
        conf_comp?: XWUIViewport3DConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIViewport3DConfig {
        return {
            initialX: conf_comp?.initialX ?? 0,
            initialY: conf_comp?.initialY ?? 0,
            initialZ: conf_comp?.initialZ ?? 0,
            initialScale: conf_comp?.initialScale ?? 1,
            initialRotationX: conf_comp?.initialRotationX ?? 0,
            initialRotationY: conf_comp?.initialRotationY ?? 0,
            initialRotationZ: conf_comp?.initialRotationZ ?? 0,
            minScale: conf_comp?.minScale ?? 0.1,
            maxScale: conf_comp?.maxScale ?? 10,
            enableNavigation: conf_comp?.enableNavigation ?? true,
            navControlsPosition: conf_comp?.navControlsPosition ?? 'bottom-right',
            showGrid: conf_comp?.showGrid ?? true,
            gridSize: conf_comp?.gridSize ?? 50,
            gridColor: conf_comp?.gridColor ?? '#e0e0e0',
            gridSubdivisions: conf_comp?.gridSubdivisions ?? 5,
            showRulers: conf_comp?.showRulers ?? true,
            rulerSize: conf_comp?.rulerSize ?? 30,
            rulerColor: conf_comp?.rulerColor ?? '#f0f0f0',
            enableObjectManipulation: conf_comp?.enableObjectManipulation ?? true,
            enableObjectSelection: conf_comp?.enableObjectSelection ?? true,
            className: conf_comp?.className
        };
    }
    
    private initializeObjects(): void {
        if (this.data.objects && this.data.objects.length > 0) {
            this.data.objects.forEach(obj => {
                this.objects.set(obj.id, { ...obj });
            });
        } else {
            // Default: Add a golden sphere in the center for testing
            this.objects.set('default-sphere', {
                id: 'default-sphere',
                x: 0,
                y: 0,
                z: 0,
                width: 50,
                height: 50,
                depth: 50,
                color: '#FFD700', // Gold color
                label: 'Golden Sphere',
                shape: 'sphere' // Indicate it's a sphere
            });
        }
    }
    
    private isWebGLAvailable(): boolean {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    private setupDOM(): void {
        this.container.innerHTML = '';
        
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-viewport3d';
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }
        
        // Create rulers if enabled
        if (this.config.showRulers) {
            const rulerSize = this.config.rulerSize || 30;
            
            // Corner pieces
            const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            corners.forEach(pos => {
                const corner = document.createElement('div');
                corner.className = 'xwui-viewport3d-ruler-corner';
                corner.style.position = 'absolute';
                corner.style.width = `${rulerSize}px`;
                corner.style.height = `${rulerSize}px`;
                corner.style.zIndex = '6';
                corner.style.backgroundColor = this.config.rulerColor || '#f0f0f0';
                
                if (pos.includes('top')) corner.style.top = '0';
                if (pos.includes('bottom')) corner.style.bottom = '0';
                if (pos.includes('left')) corner.style.left = '0';
                if (pos.includes('right')) corner.style.right = '0';
                
                if (pos.includes('right')) corner.style.borderLeft = '1px solid var(--color-border, #e0e0e0)';
                if (pos.includes('left')) corner.style.borderRight = '1px solid var(--color-border, #e0e0e0)';
                if (pos.includes('top')) corner.style.borderBottom = '1px solid var(--color-border, #e0e0e0)';
                if (pos.includes('bottom')) corner.style.borderTop = '1px solid var(--color-border, #e0e0e0)';
                
                this.wrapperElement!.appendChild(corner);
            });
            
            // Top ruler
            this.topRulerCanvas = document.createElement('canvas');
            this.topRulerCanvas.className = 'xwui-viewport3d-ruler-top';
            this.topRulerCanvas.style.position = 'absolute';
            this.topRulerCanvas.style.top = '0';
            this.topRulerCanvas.style.left = `${rulerSize}px`;
            this.topRulerCanvas.style.right = `calc(${rulerSize}px + 14%)`;
            this.topRulerCanvas.style.height = `${rulerSize}px`;
            this.topRulerCanvas.style.zIndex = '5';
            this.topRulerCanvas.style.pointerEvents = 'none';
            const topCtx = this.topRulerCanvas.getContext('2d');
            if (topCtx) this.topRulerCtx = topCtx;
            
            // Left ruler
            this.leftRulerCanvas = document.createElement('canvas');
            this.leftRulerCanvas.className = 'xwui-viewport3d-ruler-left';
            this.leftRulerCanvas.style.position = 'absolute';
            this.leftRulerCanvas.style.top = `${rulerSize}px`;
            this.leftRulerCanvas.style.left = '0';
            this.leftRulerCanvas.style.bottom = `${rulerSize}px`;
            this.leftRulerCanvas.style.width = `${rulerSize}px`;
            this.leftRulerCanvas.style.zIndex = '5';
            this.leftRulerCanvas.style.pointerEvents = 'none';
            const leftCtx = this.leftRulerCanvas.getContext('2d');
            if (leftCtx) this.leftRulerCtx = leftCtx;
            
            // Bottom ruler
            this.bottomRulerCanvas = document.createElement('canvas');
            this.bottomRulerCanvas.className = 'xwui-viewport3d-ruler-bottom';
            this.bottomRulerCanvas.style.position = 'absolute';
            this.bottomRulerCanvas.style.bottom = '0';
            this.bottomRulerCanvas.style.left = `${rulerSize}px`;
            this.bottomRulerCanvas.style.right = `calc(${rulerSize}px + 14%)`;
            this.bottomRulerCanvas.style.height = `${rulerSize}px`;
            this.bottomRulerCanvas.style.zIndex = '5';
            this.bottomRulerCanvas.style.pointerEvents = 'none';
            const bottomCtx = this.bottomRulerCanvas.getContext('2d');
            if (bottomCtx) this.bottomRulerCtx = bottomCtx;
            
            // Right ruler
            this.rightRulerCanvas = document.createElement('canvas');
            this.rightRulerCanvas.className = 'xwui-viewport3d-ruler-right';
            this.rightRulerCanvas.style.position = 'absolute';
            this.rightRulerCanvas.style.top = `${rulerSize}px`;
            this.rightRulerCanvas.style.right = '0';
            this.rightRulerCanvas.style.bottom = `${rulerSize}px`;
            this.rightRulerCanvas.style.width = `${rulerSize}px`;
            this.rightRulerCanvas.style.zIndex = '5';
            this.rightRulerCanvas.style.pointerEvents = 'none';
            const rightCtx = this.rightRulerCanvas.getContext('2d');
            if (rightCtx) this.rightRulerCtx = rightCtx;
            
            this.wrapperElement.appendChild(this.topRulerCanvas);
            this.wrapperElement.appendChild(this.leftRulerCanvas);
            this.wrapperElement.appendChild(this.bottomRulerCanvas);
            this.wrapperElement.appendChild(this.rightRulerCanvas);
        }
        
        // Create Three.js renderer
        const rendererContainer = document.createElement('div');
        rendererContainer.className = 'xwui-viewport3d-renderer-container';
        rendererContainer.style.position = 'absolute';
        rendererContainer.style.top = this.config.showRulers ? `${this.config.rulerSize || 30}px` : '0';
        rendererContainer.style.left = this.config.showRulers ? `${this.config.rulerSize || 30}px` : '0';
        rendererContainer.style.right = this.config.showRulers ? `${this.config.rulerSize || 30}px` : '0';
        rendererContainer.style.bottom = this.config.showRulers ? `${this.config.rulerSize || 30}px` : '0';
        rendererContainer.style.width = '100%';
        rendererContainer.style.height = '100%';
        
        // Check WebGL availability
        if (!this.isWebGLAvailable()) {
            console.error('WebGL is not available in this browser');
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: rgba(255, 0, 0, 0.1); border: 2px solid red; border-radius: 8px; color: red; text-align: center; z-index: 1000;';
            errorMsg.textContent = 'WebGL is not available. Please enable hardware acceleration or use a WebGL-compatible browser.';
            rendererContainer.appendChild(errorMsg);
            this.wrapperElement.appendChild(rendererContainer);
            return;
        }
        
        try {
            // Suppress WebGL deprecation warnings by using a canvas with error handling
            const canvas = document.createElement('canvas');
            
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true, 
                alpha: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
                preserveDrawingBuffer: false
            });
            
            // Check if WebGL context was actually created
            const gl = this.renderer.getContext();
            if (!gl) {
                throw new Error('Failed to create WebGL context');
            }
            
            // Check if context is lost
            if (gl.isContextLost()) {
                throw new Error('WebGL context is lost');
            }
            
            // Handle context loss events
            canvas.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                console.warn('WebGL context lost');
            }, false);
            
            canvas.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored');
                this.render();
            }, false);
            
            // Set renderer container z-index lower than navigation
            rendererContainer.style.zIndex = '1';
            
            // Append container first to get proper dimensions
            this.wrapperElement.appendChild(rendererContainer);
            
            // Force a layout calculation
            void rendererContainer.offsetWidth;
            
            // Get container dimensions after it's in the DOM
            const initialWidth = rendererContainer.clientWidth || this.container.clientWidth || 800;
            const initialHeight = rendererContainer.clientHeight || this.container.clientHeight || 600;
            
            if (initialWidth === 0 || initialHeight === 0) {
                console.warn('Viewport3D container has zero dimensions, using defaults');
            }
            
            this.renderer.setSize(initialWidth, initialHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio to avoid issues
            this.renderer.domElement.style.display = 'block';
            this.renderer.domElement.style.width = '100%';
            this.renderer.domElement.style.height = '100%';
            rendererContainer.appendChild(this.renderer.domElement);
        } catch (error) {
            console.error('Failed to initialize WebGL renderer:', error);
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: rgba(255, 0, 0, 0.1); border: 2px solid red; border-radius: 8px; color: red; text-align: center; z-index: 1000;';
            errorMsg.textContent = `WebGL initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your browser settings.`;
            rendererContainer.appendChild(errorMsg);
            this.wrapperElement.appendChild(rendererContainer);
            this.container.appendChild(this.wrapperElement);
            return; // Exit early if WebGL failed
        }
        
        // Create scene (only if renderer succeeded)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);
        
        // Create camera (only if renderer succeeded)
        const aspect = Math.max(rendererContainer.clientWidth / Math.max(rendererContainer.clientHeight, 1), 0.1);
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
        
        // Set initial camera position
        this.updateCamera();
        
        console.log('[XWUIViewport3D] Scene and camera initialized:', {
            scene: !!this.scene,
            camera: !!this.camera,
            renderer: !!this.renderer,
            objects: this.objects.size
        });
        
        // Add grid
        if (this.config.showGrid) {
            const gridSize = this.config.gridSize || 50;
            const gridSubdivisions = this.config.gridSubdivisions || 5;
            this.gridHelper = new THREE.GridHelper(
                gridSize * 20,
                gridSubdivisions * 20,
                this.config.gridColor || '#e0e0e0',
                this.config.gridColor || '#e0e0e0'
            );
            this.scene.add(this.gridHelper);
            
            // Add thick origin lines (X, Y, Z axes)
            this.axesHelper = new THREE.AxesHelper(gridSize * 2);
            this.scene.add(this.axesHelper);
        }
        
        // Create objects
        this.createObjectMeshes();
        
        // Note: rendererContainer is already appended above if WebGL is available
        
        // Add navigation controls (must be after renderer container to ensure proper z-index)
        // IMPORTANT: Navigation is added AFTER renderer so it appears on top
        if (this.config.enableNavigation) {
            const navContainer = document.createElement('div');
            navContainer.className = 'xwui-viewport3d-nav-container';
            navContainer.style.position = 'absolute';
            navContainer.style.width = '100%';
            navContainer.style.height = '100%';
            navContainer.style.pointerEvents = 'none';
            navContainer.style.top = '0';
            navContainer.style.left = '0';
            navContainer.style.right = '0';
            navContainer.style.bottom = '0';
            navContainer.style.zIndex = '100';
            
            this.nav = new XWUINav(navContainer, {}, {
                viewport: this.viewport,
                viewportMode: '3d',
                enablePanning: true,
                enableZooming: true,
                enableRotation: true,
                enableKeyboard: true,
                enableTouch: false,
                showControls: true,
                controlsPosition: this.config.navControlsPosition || 'bottom-right',
                minZoom: this.config.minScale,
                maxZoom: this.config.maxScale
            });
            this.registerChildComponent(this.nav);
            
            // Append navigation AFTER renderer container to ensure it's on top
            this.wrapperElement.appendChild(navContainer);
            
            // Debug: Log navigation setup
            console.log('[XWUIViewport3D] Navigation initialized:', {
                showControls: this.config.enableNavigation,
                controlsPosition: this.config.navControlsPosition || 'bottom-right',
                navInstance: !!this.nav,
                navContainer: navContainer
            });
        }
        
        this.container.appendChild(this.wrapperElement);
        
        // Ensure renderer is properly sized after everything is in the DOM
        if (this.renderer && this.scene && this.camera) {
            // Use requestAnimationFrame to ensure layout is complete
            requestAnimationFrame(() => {
                this.resizeRenderer();
                // Initial render after everything is set up
                this.render();
            });
        }
        
        // Listen for window resize
        window.addEventListener('resize', () => this.resizeRenderer());
    }
    
    private createObjectMeshes(): void {
        if (!this.scene) return;
        
        // Clear existing meshes
        this.objectMeshes.forEach(mesh => {
            this.scene!.remove(mesh);
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m: THREE.Material) => m.dispose());
            } else {
                mesh.material.dispose();
            }
        });
        this.objectMeshes.clear();
        
        // Create meshes for each object
        this.objects.forEach((obj, id) => {
            // Determine geometry type (sphere or box)
            const isSphere = (obj as any).shape === 'sphere' || obj.width === obj.height && obj.height === obj.depth;
            const radius = Math.max(obj.width, obj.height, obj.depth) / 2;
            
            const geometry = isSphere 
                ? new THREE.SphereGeometry(radius, 32, 32)
                : new THREE.BoxGeometry(obj.width, obj.height, obj.depth);
            
            const material = new THREE.MeshStandardMaterial({
                color: obj.color || (id === this.selectedObjectId ? '#5a8ded' : '#4a90e2'),
                metalness: isSphere ? 0.8 : 0.3, // More metallic for sphere
                roughness: isSphere ? 0.2 : 0.7  // More shiny for sphere
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(obj.x, obj.y, obj.z);
            if (obj.rotationX) mesh.rotation.x = obj.rotationX;
            if (obj.rotationY) mesh.rotation.y = obj.rotationY;
            if (obj.rotationZ) mesh.rotation.z = obj.rotationZ;
            
            mesh.userData.objectId = id;
            this.objectMeshes.set(id, mesh);
            this.scene!.add(mesh);
        });
        
        // Add lighting
        if (this.scene.children.find((c: THREE.Object3D) => c instanceof THREE.AmbientLight) === undefined) {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(50, 50, 50);
            this.scene.add(directionalLight);
        }
    }
    
    private updateCamera(): void {
        if (!this.camera) return;
        
        // Update camera position based on viewport state
        const distance = 500 / this.viewport.scale;
        const x = this.viewport.x || 0;
        const y = this.viewport.y || 0;
        const z = (this.viewport.z || 0) + distance;
        
        // Set camera position
        this.camera.position.set(x, y, z);
        
        // Calculate look-at target
        const targetX = x;
        const targetY = y;
        const targetZ = this.viewport.z || 0;
        
        // Apply rotations by rotating the camera around the target
        if (this.viewport.rotationX !== undefined || this.viewport.rotationY !== undefined || this.viewport.rotationZ !== undefined) {
            // Reset rotation first
            this.camera.rotation.set(0, 0, 0);
            
            // Apply rotations in order: X, Y, Z
            if (this.viewport.rotationX !== undefined) {
                this.camera.rotateX(this.viewport.rotationX);
            }
            if (this.viewport.rotationY !== undefined) {
                this.camera.rotateY(this.viewport.rotationY);
            }
            if (this.viewport.rotationZ !== undefined) {
                this.camera.rotateZ(this.viewport.rotationZ);
            }
            
            // After rotation, look at target
            this.camera.lookAt(targetX, targetY, targetZ);
        } else {
            // No rotation, just look at target
            this.camera.lookAt(targetX, targetY, targetZ);
        }
        
        // Update camera matrix
        this.camera.updateMatrixWorld();
    }
    
    private resizeRenderer(): void {
        if (!this.renderer || !this.camera || !this.wrapperElement) return;
        
        const rendererContainer = this.wrapperElement?.querySelector('.xwui-viewport3d-renderer-container') as HTMLElement;
        if (!rendererContainer) {
            console.warn('Viewport3D: Renderer container not found');
            return;
        }
        
        const width = rendererContainer.clientWidth || this.container.clientWidth;
        const height = rendererContainer.clientHeight || this.container.clientHeight;
        
        if (width === 0 || height === 0) {
            console.warn('Viewport3D: Container has zero dimensions', {
                rendererContainer: { width: rendererContainer.clientWidth, height: rendererContainer.clientHeight },
                container: { width: this.container.clientWidth, height: this.container.clientHeight },
                wrapper: { width: this.wrapperElement?.clientWidth, height: this.wrapperElement?.clientHeight }
            });
            return;
        }
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // Ensure canvas is visible
        const canvas = this.renderer.domElement;
        if (canvas) {
            canvas.style.display = 'block';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        }
        
        // Resize rulers
        if (this.config.showRulers) {
            this.resizeRulers();
        }
    }
    
    private resizeRulers(): void {
        if (!this.wrapperElement) return;
        
        const rendererContainer = this.wrapperElement.querySelector('.xwui-viewport3d-renderer-container') as HTMLElement;
        if (!rendererContainer) return;
        
        const width = rendererContainer.clientWidth;
        const height = rendererContainer.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        const rulerSize = this.config.rulerSize || 30;
        
        if (this.topRulerCanvas && this.topRulerCtx) {
            this.topRulerCanvas.width = width * dpr;
            this.topRulerCanvas.height = rulerSize * dpr;
            this.topRulerCtx.scale(dpr, dpr);
        }
        
        if (this.leftRulerCanvas && this.leftRulerCtx) {
            this.leftRulerCanvas.width = rulerSize * dpr;
            this.leftRulerCanvas.height = height * dpr;
            this.leftRulerCtx.scale(dpr, dpr);
        }
        
        if (this.bottomRulerCanvas && this.bottomRulerCtx) {
            this.bottomRulerCanvas.width = width * dpr;
            this.bottomRulerCanvas.height = rulerSize * dpr;
            this.bottomRulerCtx.scale(dpr, dpr);
        }
        
        if (this.rightRulerCanvas && this.rightRulerCtx) {
            this.rightRulerCanvas.width = rulerSize * dpr;
            this.rightRulerCanvas.height = height * dpr;
            this.rightRulerCtx.scale(dpr, dpr);
        }
        
        this.renderRulers();
    }
    
    private setupEventListeners(): void {
        if (!this.renderer) return;
        
        const canvas = this.renderer.domElement;
        
        // Mouse events
        this.boundHandleMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
        this.boundHandleMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
        this.boundHandleMouseUp = (e: MouseEvent) => this.handleMouseUp(e);
        this.boundHandleWheel = (e: WheelEvent) => this.handleWheel(e);
        
        canvas.addEventListener('mousedown', this.boundHandleMouseDown);
        canvas.addEventListener('mousemove', this.boundHandleMouseMove);
        canvas.addEventListener('mouseup', this.boundHandleMouseUp);
        canvas.addEventListener('mouseleave', this.boundHandleMouseUp);
        canvas.addEventListener('wheel', this.boundHandleWheel, { passive: false });
        
        // Document-level mouse listeners for proper drag handling
        document.addEventListener('mousemove', this.boundHandleMouseMove);
        document.addEventListener('mouseup', this.boundHandleMouseUp);
        
        // Context menu (right-click) - disable for panning
        canvas.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
        
        // Prevent default middle mouse button behavior
        this.boundHandleAuxClick = (e: MouseEvent) => {
            if (e.button === 1) {
                e.preventDefault();
            }
        };
        canvas.addEventListener('auxclick', this.boundHandleAuxClick);
        
        // Keyboard handlers
        this.boundHandleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ' && !this.spacePressed) {
                this.spacePressed = true;
                if (canvas) {
                    canvas.style.cursor = 'grab';
                }
            }
        };
        
        this.boundHandleKeyUp = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                this.spacePressed = false;
                if (canvas && !this.isPanning && !this.isDragging) {
                    canvas.style.cursor = 'default';
                }
            }
        };
        
        window.addEventListener('keydown', this.boundHandleKeyDown);
        window.addEventListener('keyup', this.boundHandleKeyUp);
        
        // Listen for viewport changes from navigation
        if (this.nav) {
            this.boundHandleViewportChange = () => {
                this.updateCamera();
                this.render();
            };
            this.container.addEventListener('viewport-change', this.boundHandleViewportChange as EventListener);
        }
    }
    
    //================================================================================
    // COORDINATE CONVERSION
    //================================================================================
    
    public screenToWorld(screenX: number, screenY: number): { x: number; y: number; z: number } | null {
        if (!this.camera || !this.renderer) return null;
        
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        
        const x = ((screenX - rect.left) / rect.width) * 2 - 1;
        const y = -((screenY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        
        // Intersect with a plane at z=0
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);
        
        return {
            x: intersection.x,
            y: intersection.y,
            z: intersection.z
        };
    }
    
    private worldToScreen(worldX: number, worldY: number, worldZ: number): { x: number; y: number } | null {
        if (!this.camera || !this.renderer) return null;
        
        const vector = new THREE.Vector3(worldX, worldY, worldZ);
        vector.project(this.camera);
        
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        
        return {
            x: (vector.x * 0.5 + 0.5) * rect.width + rect.left,
            y: (vector.y * -0.5 + 0.5) * rect.height + rect.top
        };
    }
    
    //================================================================================
    // INTERACTION HANDLERS
    //================================================================================
    
    private handleMouseDown(e: MouseEvent): void {
        if (!this.renderer) return;
        
        const canvas = this.renderer.domElement;
        
        // Middle mouse button (scroll wheel click) or right-click - pan
        if (e.button === 1 || e.button === 2) {
            e.preventDefault();
            this.isPanning = true;
            this.panStart = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
            return;
        }
        
        // Space+drag - pan
        if (this.spacePressed) {
            e.preventDefault();
            this.isPanning = true;
            this.panStart = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
            return;
        }
        
        // Only handle left mouse button
        if (e.button !== 0) return;
        
        const worldPos = this.screenToWorld(e.clientX, e.clientY);
        if (!worldPos) return;
        
        // Raycast to find clicked object
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, this.camera!);
        const intersects = raycaster.intersectObjects(Array.from(this.objectMeshes.values()));
        
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object as THREE.Mesh;
            const objectId = clickedMesh.userData.objectId;
            
            if (this.config.enableObjectManipulation && this.config.enableObjectSelection) {
                this.isDragging = true;
                this.draggedObjectId = objectId;
                this.selectedObjectId = objectId;
                this.dragStart = { x: worldPos.x, y: worldPos.y };
                canvas.style.cursor = 'grabbing';
                this.updateObjectSelection();
                this.render();
            } else {
                this.selectedObjectId = objectId;
                this.updateObjectSelection();
                this.render();
            }
        } else {
            // Clicked on empty space - start panning
            this.isPanning = true;
            this.panStart = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
            
            // Deselect any selected object
            if (this.selectedObjectId) {
                this.selectedObjectId = null;
                this.updateObjectSelection();
            }
            this.render();
        }
    }
    
    private handleMouseMove(e: MouseEvent): void {
        if (!this.renderer) return;
        
        const canvas = this.renderer.domElement;
        
        if (this.isPanning && this.panStart) {
            // Pan viewport
            const dxScreen = e.clientX - this.panStart.x;
            const dyScreen = e.clientY - this.panStart.y;
            
            // Update cursor based on pan direction
            this.updatePanCursor(dxScreen, dyScreen);
            
            // Convert screen delta to world delta
            const delta = 1 / this.viewport.scale;
            this.viewport.x -= dxScreen * delta;
            this.viewport.y += dyScreen * delta; // Invert Y for 3D
            
            this.panStart = { x: e.clientX, y: e.clientY };
            this.updateCamera();
            this.render();
            
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
        if (worldPos) {
            this.lastMouseWorldPos = worldPos;
        }
        
        if (this.isDragging && this.draggedObjectId && this.dragStart && worldPos) {
            // Drag object
            const obj = this.objects.get(this.draggedObjectId);
            if (obj) {
                const dx = worldPos.x - this.dragStart.x;
                const dy = worldPos.y - this.dragStart.y;
                
                obj.x += dx;
                obj.y += dy;
                
                this.dragStart = { x: worldPos.x, y: worldPos.y };
                this.updateObjectMeshes();
                this.render();
            }
            return;
        }
        
        // Update cursor and rulers
        if (!this.isPanning && !this.isDragging) {
            // Raycast for hover
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera!);
            const intersects = raycaster.intersectObjects(Array.from(this.objectMeshes.values()));
            
            if (intersects.length > 0) {
                canvas.style.cursor = 'grab';
            } else {
                canvas.style.cursor = this.spacePressed ? 'grab' : 'default';
            }
            
            // Update rulers with mouse position
            if (this.config.showRulers) {
                this.renderRulersWithMouse(this.lastMouseWorldPos);
            }
        }
    }
    
    private handleMouseUp(e: MouseEvent): void {
        if (!this.renderer) return;
        
        const canvas = this.renderer.domElement;
        
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedObjectId = null;
            this.dragStart = null;
        }
        
        if (this.isPanning) {
            this.isPanning = false;
            this.panStart = null;
            if (this.config.showRulers) {
                this.renderRulers();
            }
        }
        
        if (this.isRotating) {
            this.isRotating = false;
            this.rotateStart = null;
        }
        
        // Update cursor
        if (this.isPanning) {
            canvas.style.cursor = 'default';
        } else if (!this.spacePressed) {
            canvas.style.cursor = 'default';
        } else {
            canvas.style.cursor = 'grab';
        }
    }
    
    private handleWheel(e: WheelEvent): void {
        if (!this.renderer || !this.camera) return;
        
        e.preventDefault();
        
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Get world position of mouse before zoom
        const worldPosBeforeZoom = this.screenToWorld(e.clientX, e.clientY);
        if (!worldPosBeforeZoom) return;
        
        const factor = 1.2;
        const delta = e.deltaY > 0 ? 1 / factor : factor;
        const newScale = this.viewport.scale * delta;
        
        this.viewport.scale = Math.max(
            this.config.minScale || 0.1,
            Math.min(this.config.maxScale || 10, newScale)
        );
        
        // Get world position of mouse after zoom
        const worldPosAfterZoom = this.screenToWorld(e.clientX, e.clientY);
        if (worldPosAfterZoom) {
            // Adjust viewport to keep the same world point under the mouse
            this.viewport.x -= (worldPosAfterZoom.x - worldPosBeforeZoom.x);
            this.viewport.y -= (worldPosAfterZoom.y - worldPosBeforeZoom.y);
        }
        
        this.updateCamera();
        this.render();
        
        // Notify navigation
        if (this.nav) {
            const event = new CustomEvent('viewport-change', {
                detail: { viewport: this.viewport }
            });
            this.container.dispatchEvent(event);
        }
    }
    
    private updatePanCursor(dx: number, dy: number): void {
        if (!this.renderer) return;
        
        const canvas = this.renderer.domElement;
        
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
        
        canvas.style.cursor = cursor;
    }
    
    //================================================================================
    // RENDERING
    //================================================================================
    
    private startRenderLoop(): void {
        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);
            this.render();
        };
        animate();
    }
    
    private render(): void {
        if (!this.renderer || !this.scene || !this.camera) {
            // Don't render if components aren't ready
            return;
        }
        
        try {
            // Update camera before rendering
            this.updateCamera();
            
            // Render the scene
            this.renderer.render(this.scene, this.camera);
            
            // Render rulers after main render
            if (this.config.showRulers) {
                this.renderRulers();
            }
        } catch (error) {
            console.error('[XWUIViewport3D] Render error:', error);
        }
    }
    
    private updateObjectSelection(): void {
        this.objectMeshes.forEach((mesh, id) => {
            const obj = this.objects.get(id);
            if (obj) {
                const material = mesh.material as THREE.MeshStandardMaterial;
                material.color.set(id === this.selectedObjectId ? '#5a8ded' : (obj.color || '#4a90e2'));
            }
        });
    }
    
    private updateObjectMeshes(): void {
        this.objects.forEach((obj, id) => {
            const mesh = this.objectMeshes.get(id);
            if (mesh) {
                mesh.position.set(obj.x, obj.y, obj.z);
                if (obj.rotationX !== undefined) mesh.rotation.x = obj.rotationX;
                if (obj.rotationY !== undefined) mesh.rotation.y = obj.rotationY;
                if (obj.rotationZ !== undefined) mesh.rotation.z = obj.rotationZ;
            }
        });
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
    
    private renderRulersWithMouse(mouseWorldPos: { x: number; y: number; z: number } | null): void {
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
    
    private drawTopRuler(mouseWorldPos: { x: number; y: number; z: number } | null = null): void {
        if (!this.topRulerCanvas || !this.topRulerCtx || !this.renderer) return;
        
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
        
        // Project 3D to 2D for ruler display
        const canvas = this.renderer.domElement;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasCenterX = canvasRect.width / 2;
        
        const worldViewCenterX = this.viewport.x || 0;
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
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetX = rulerSize;
        
        this.topRulerCtx.strokeStyle = tickColor;
        this.topRulerCtx.fillStyle = textColor;
        this.topRulerCtx.font = '10px sans-serif';
        this.topRulerCtx.textAlign = 'center';
        this.topRulerCtx.textBaseline = 'middle';
        
        // Draw ticks
        for (let tickWorldX = Math.floor(rulerStartWorldX / step) * step; tickWorldX < rulerEndWorldX + step; tickWorldX += step) {
            const screenXonCanvas = (tickWorldX - worldViewCenterX) * this.viewport.scale + canvasCenterX;
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
                this.topRulerCtx.lineWidth = 1;
            }
        }
    }
    
    private drawLeftRuler(mouseWorldPos: { x: number; y: number; z: number } | null = null): void {
        if (!this.leftRulerCanvas || !this.leftRulerCtx || !this.renderer) return;
        
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
        
        const canvas = this.renderer.domElement;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasCenterY = canvasRect.height / 2;
        
        const worldViewCenterY = this.viewport.y || 0;
        const worldRulerRangeY = canvasRect.height / this.viewport.scale;
        const rulerStartWorldY = worldViewCenterY - worldRulerRangeY / 2;
        const rulerEndWorldY = worldViewCenterY + worldRulerRangeY / 2;
        
        // Determine step size
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
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetY = rulerSize;
        
        this.leftRulerCtx.strokeStyle = tickColor;
        this.leftRulerCtx.fillStyle = textColor;
        this.leftRulerCtx.font = '10px sans-serif';
        this.leftRulerCtx.textAlign = 'center';
        this.leftRulerCtx.textBaseline = 'middle';
        
        // Draw ticks
        for (let tickWorldY = Math.floor(rulerStartWorldY / step) * step; tickWorldY < rulerEndWorldY + step; tickWorldY += step) {
            const screenYonCanvas = (tickWorldY - worldViewCenterY) * this.viewport.scale + canvasCenterY;
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
                this.leftRulerCtx.lineWidth = 1;
            }
        }
    }
    
    private drawBottomRuler(mouseWorldPos: { x: number; y: number; z: number } | null = null): void {
        if (!this.bottomRulerCanvas || !this.bottomRulerCtx || !this.renderer) return;
        
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
        
        const canvas = this.renderer.domElement;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasCenterX = canvasRect.width / 2;
        
        const worldViewCenterX = this.viewport.x || 0;
        const worldRulerRangeX = canvasRect.width / this.viewport.scale;
        const rulerStartWorldX = worldViewCenterX - worldRulerRangeX / 2;
        const rulerEndWorldX = worldViewCenterX + worldRulerRangeX / 2;
        
        // Determine step size
        let step = 50;
        const pixelsPerMajorTick = this.viewport.scale * step;
        if (pixelsPerMajorTick < 30) step *= 2;
        if (pixelsPerMajorTick > 100 && step > 10) step /= 2;
        if (pixelsPerMajorTick > 150 && step > 5) step /= 2;
        
        const tickColor = 'rgba(150, 180, 210, 0.7)';
        const textColor = 'rgba(200, 220, 240, 0.9)';
        const majorTickLength = 10;
        const minorTickLength = 5;
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetX = rulerSize;
        
        this.bottomRulerCtx.strokeStyle = tickColor;
        this.bottomRulerCtx.fillStyle = textColor;
        this.bottomRulerCtx.font = '10px sans-serif';
        this.bottomRulerCtx.textAlign = 'center';
        this.bottomRulerCtx.textBaseline = 'middle';
        
        // Draw ticks
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
                this.bottomRulerCtx.lineWidth = 1;
            }
        }
    }
    
    private drawRightRuler(mouseWorldPos: { x: number; y: number; z: number } | null = null): void {
        if (!this.rightRulerCanvas || !this.rightRulerCtx || !this.renderer) return;
        
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
        
        const canvas = this.renderer.domElement;
        const canvasRect = canvas.getBoundingClientRect();
        const canvasCenterY = canvasRect.height / 2;
        
        const worldViewCenterY = this.viewport.y || 0;
        const worldRulerRangeY = canvasRect.height / this.viewport.scale;
        const rulerStartWorldY = worldViewCenterY - worldRulerRangeY / 2;
        const rulerEndWorldY = worldViewCenterY + worldRulerRangeY / 2;
        
        // Determine step size
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
        const rulerSize = this.config.rulerSize || 30;
        const rulerOffsetY = rulerSize;
        
        this.rightRulerCtx.strokeStyle = tickColor;
        this.rightRulerCtx.fillStyle = textColor;
        this.rightRulerCtx.font = '10px sans-serif';
        this.rightRulerCtx.textAlign = 'center';
        this.rightRulerCtx.textBaseline = 'middle';
        
        // Draw ticks
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
                this.rightRulerCtx.lineWidth = 1;
            }
        }
    }
    
    //================================================================================
    // PUBLIC API
    //================================================================================
    
    public getViewportState(): ViewportState {
        return { ...this.viewport };
    }
    
    public addObject(obj: Viewport3DObject): void {
        this.objects.set(obj.id, { ...obj });
        this.createObjectMeshes();
        this.render();
    }
    
    public removeObject(id: string): void {
        this.objects.delete(id);
        const mesh = this.objectMeshes.get(id);
        if (mesh && this.scene) {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m: THREE.Material) => m.dispose());
            } else {
                mesh.material.dispose();
            }
        }
        this.objectMeshes.delete(id);
        if (this.selectedObjectId === id) {
            this.selectedObjectId = null;
        }
        this.render();
    }
    
    public getObjects(): Viewport3DObject[] {
        return Array.from(this.objects.values());
    }
    
    public destroy(): void {
        // Stop render loop
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remove event listeners
        if (this.renderer) {
            const canvas = this.renderer.domElement;
            if (this.boundHandleMouseDown) {
                canvas.removeEventListener('mousedown', this.boundHandleMouseDown);
            }
            if (this.boundHandleMouseMove) {
                canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
                document.removeEventListener('mousemove', this.boundHandleMouseMove);
            }
            if (this.boundHandleMouseUp) {
                canvas.removeEventListener('mouseup', this.boundHandleMouseUp);
                canvas.removeEventListener('mouseleave', this.boundHandleMouseUp);
                document.removeEventListener('mouseup', this.boundHandleMouseUp);
            }
            if (this.boundHandleWheel) {
                canvas.removeEventListener('wheel', this.boundHandleWheel);
            }
            if (this.boundHandleAuxClick) {
                canvas.removeEventListener('auxclick', this.boundHandleAuxClick);
            }
        }
        
        if (this.boundHandleKeyDown) {
            window.removeEventListener('keydown', this.boundHandleKeyDown);
        }
        if (this.boundHandleKeyUp) {
            window.removeEventListener('keyup', this.boundHandleKeyUp);
        }
        
        if (this.boundHandleViewportChange) {
            this.container.removeEventListener('viewport-change', this.boundHandleViewportChange as EventListener);
        }
        
        window.removeEventListener('resize', () => this.resizeRenderer());
        
        // Dispose Three.js resources
        if (this.scene) {
            this.scene.traverse((object: THREE.Object3D) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((m: THREE.Material) => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clear references
        this.wrapperElement = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.gridHelper = null;
        this.axesHelper = null;
        this.nav = null;
        this.objects.clear();
        this.objectMeshes.clear();
        
        super.destroy();
    }
}

(XWUIViewport3D as any).componentName = 'XWUIViewport3D';