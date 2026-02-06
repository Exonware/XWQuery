
        import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIViewport2D } from '../index.ts';
        import { XWUIInputNumber } from '../../XWUIInputNumber/index.ts';
        import { XWUISwitch } from '../../XWUISwitch/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIViewport2D/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIViewport2D Component Tester',
            desc: '2D viewport with transform system, coordinate conversion, and canvas rendering. Drag the squares to move them. Use navigation controls or keyboard shortcuts (arrow keys, +/- for zoom).',
            componentName: 'XWUIViewport2D'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-viewport2d-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }

        const viewport = new XWUIViewport2D(
            document.getElementById('viewport2d-1'),
            {
                objects: [
                    { id: 'square1', x: 100, y: 100, width: 80, height: 80, color: '#4a90e2', label: 'Square 1' },
                    { id: 'square2', x: 300, y: 200, width: 100, height: 100, color: '#5a8ded', label: 'Square 2' },
                    { id: 'square3', x: 200, y: 350, width: 70, height: 70, color: '#3c6ac4', label: 'Square 3' }
                ]
            },
            {
                initialX: 0,
                initialY: 0,
                initialScale: 1,
                enableNavigation: true,
                navControlsPosition: 'bottom-right',
                showGrid: true,
                gridSize: 50,
                gridSubdivisions: 5,
                showGuidelines: true,
                snapToGuidelines: 0,
                guidelines: [
                    { x: 100, orientation: 'vertical' },
                    { x: 300, orientation: 'vertical' },
                    { y: 100, orientation: 'horizontal' },
                    { y: 300, orientation: 'horizontal' }
                ],
                showRulers: true,
                enableObjectManipulation: true,
                enableObjectSelection: true,
                enableObjectResize: true,
                enableObjectRotation: true
            }
        );
        
        // Create switch components
        const switches = {
            'allow-moving': new XWUISwitch(
                document.getElementById('conf-allow-moving'),
                { checked: true, label: 'Allow Moving' }
            ),
            'allow-resizing': new XWUISwitch(
                document.getElementById('conf-allow-resizing'),
                { checked: true, label: 'Allow Resizing' }
            ),
            'allow-rotation': new XWUISwitch(
                document.getElementById('conf-allow-rotation'),
                { checked: true, label: 'Allow Rotation' }
            ),
            'allow-panning': new XWUISwitch(
                document.getElementById('conf-allow-panning'),
                { checked: true, label: 'Allow Panning' }
            ),
            'allow-zooming': new XWUISwitch(
                document.getElementById('conf-allow-zooming'),
                { checked: true, label: 'Allow Zooming' }
            ),
            'display-navigation': new XWUISwitch(
                document.getElementById('conf-display-navigation'),
                { checked: true, label: 'Display Navigation' }
            ),
            'display-rulers': new XWUISwitch(
                document.getElementById('conf-display-rulers'),
                { checked: true, label: 'Display Rulers' }
            ),
            'display-grid': new XWUISwitch(
                document.getElementById('conf-display-grid'),
                { checked: true, label: 'Display Grid' }
            ),
            'shape-editing': new XWUISwitch(
                document.getElementById('conf-shape-editing'),
                { checked: false, label: 'Shape Editing Mode' }
            )
        };
        
        // Create grid snap number input
        const gridSnapInput = new XWUIInputNumber(
            document.getElementById('conf-grid-snap'),
            { value: 0 },
            { min: 0, step: 1, controls: true }
        );
        
        // Wire up grid snap input
        gridSnapInput.onChange((value) => {
            viewport.config.snapToGrid = value;
        });
        
        // Create guideline snap number input
        const guidelineSnapInput = new XWUIInputNumber(
            document.getElementById('conf-guideline-snap'),
            { value: 0 },
            { min: 0, step: 1, controls: true }
        );
        
        // Wire up guideline snap input
        guidelineSnapInput.onChange((value) => {
            viewport.config.snapToGuidelines = value;
        });
        
        // Helper function to trigger viewport update by dispatching viewport-change event
        const triggerViewportUpdate = () => {
            // Trigger a small viewport state change to force re-render
            const state = viewport.getViewportState();
            const originalX = state.x;
            viewport.viewport.x = originalX + 0.0001;
            // Use requestAnimationFrame to ensure render happens
            requestAnimationFrame(() => {
                viewport.viewport.x = originalX;
                // Dispatch viewport-change event as well
                const viewportContainer = document.getElementById('viewport2d-1');
                if (viewportContainer) {
                    const event = new CustomEvent('viewport-change', {
                        detail: { viewport: viewport.getViewportState() }
                    });
                    viewportContainer.dispatchEvent(event);
                }
            });
        };
        
        // Helper function to hide/show ruler canvases and update layout
        const updateRulerVisibility = (show) => {
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                const viewportContainer = document.getElementById('viewport2d-1');
                if (viewportContainer) {
                    // Hide/show all ruler elements (canvases and corners)
                    const rulerCanvases = viewportContainer.querySelectorAll('.xwui-viewport2d-ruler-top, .xwui-viewport2d-ruler-left, .xwui-viewport2d-ruler-bottom, .xwui-viewport2d-ruler-right');
                    const cornerElements = viewportContainer.querySelectorAll('.xwui-viewport2d-ruler-corner');
                    
                    const displayValue = show ? 'block' : 'none';
                    
                    rulerCanvases.forEach(canvas => {
                        canvas.style.display = displayValue;
                        if (!show) {
                            // Clear the canvas when hiding
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                const dpr = window.devicePixelRatio || 1;
                                const rect = canvas.getBoundingClientRect();
                                ctx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);
                            }
                        }
                    });
                    
                    cornerElements.forEach(corner => {
                        corner.style.display = displayValue;
                    });
                    
                    // Update canvas layout to expand/shrink based on ruler visibility
                    viewport.updateCanvasLayout();
                }
            });
        };
        
        // Update viewport config when switches change
        switches['allow-moving'].onChange((checked) => {
            viewport.config.enableObjectManipulation = checked;
            triggerViewportUpdate();
        });
        
        switches['allow-resizing'].onChange((checked) => {
            viewport.config.enableObjectResize = checked;
            triggerViewportUpdate();
        });
        
        switches['allow-rotation'].onChange((checked) => {
            viewport.config.enableObjectRotation = checked;
            // Force immediate re-render to show/hide rotation handles
            triggerViewportUpdate();
            // Also trigger a second update after a short delay to ensure it sticks
            setTimeout(() => triggerViewportUpdate(), 50);
        });
        
        switches['allow-panning'].onChange((checked) => {
            // Disable/enable pan buttons in navigation controls
            const viewportContainer = document.getElementById('viewport2d-1');
            const panButtons = viewportContainer?.querySelectorAll('.xwui-nav-controls button[title*="Pan"], .xwui-nav-controls button[aria-label*="Pan"]');
            if (panButtons) {
                panButtons.forEach(btn => {
                    btn.disabled = !checked;
                    btn.style.opacity = checked ? '1' : '0.5';
                });
            }
        });
        
        switches['allow-zooming'].onChange((checked) => {
            // Disable/enable zoom buttons in navigation controls
            const viewportContainer = document.getElementById('viewport2d-1');
            const zoomButtons = viewportContainer?.querySelectorAll('.xwui-nav-controls button[title*="Zoom"], .xwui-nav-controls button[aria-label*="Zoom"]');
            if (zoomButtons) {
                zoomButtons.forEach(btn => {
                    btn.disabled = !checked;
                    btn.style.opacity = checked ? '1' : '0.5';
                });
            }
        });
        
        switches['display-navigation'].onChange((checked) => {
            viewport.config.enableNavigation = checked;
            // Toggle navigation visibility
            const viewportContainer = document.getElementById('viewport2d-1');
            const navElement = viewportContainer?.querySelector('.xwui-nav');
            if (navElement) {
                navElement.style.display = checked ? 'block' : 'none';
            }
            triggerViewportUpdate();
        });
        
        switches['display-rulers'].onChange((checked) => {
            viewport.config.showRulers = checked;
            // Hide/show ruler canvases immediately
            updateRulerVisibility(checked);
            // Trigger re-render
            triggerViewportUpdate();
        });
        
        switches['display-grid'].onChange((checked) => {
            viewport.config.showGrid = checked;
            // Force immediate re-render
            triggerViewportUpdate();
            // Also trigger a second update after a short delay to ensure it sticks
            setTimeout(() => triggerViewportUpdate(), 50);
        });
        
        switches['shape-editing'].onChange((checked) => {
            viewport.config.enableShapeEditing = checked;
            viewport.setShapeEditingMode(checked);
        });
        
        tester.data.componentInstance = viewport;
        tester.data.componentConfig = viewport.config;
        tester.data.componentData = viewport.data;
        tester.setStatus('Component loaded successfully', 'success');
