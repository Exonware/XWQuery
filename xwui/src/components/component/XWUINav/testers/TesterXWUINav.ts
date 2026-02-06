
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUINav } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUINav/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUINav Component Tester',
            desc: 'Navigation controls for viewports, and search. Test keyboard shortcuts, touch gestures, and search functionality.',
            componentName: 'XWUINav'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuinav-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Create viewport state for 2D
        const viewportState2D = {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        };
        
        // Create viewport state for 3D
        const viewportState3D = {
            x: 0,
            y: 0,
            z: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0
        };
        
        // Create search handler for demo
        const searchHandler = {
            search: (query) => {
                // Mock search results
                const mockObjects = [
                    { id: 'obj1', label: 'Object 1', position: { x: 100, y: 100 } },
                    { id: 'obj2', label: 'Object 2', position: { x: 200, y: 200 } },
                    { id: 'obj3', label: 'Object 3', position: { x: 300, y: 300 } }
                ];
                
                return mockObjects.filter(obj => 
                    obj.label.toLowerCase().includes(query.toLowerCase())
                );
            },
            navigateTo: (result) => {
                console.log('Navigate to:', result);
                if (result.position) {
                    viewportState2D.x = result.position.x;
                    viewportState2D.y = result.position.y;
                    viewportState2D.scale = 2;
                    viewportState3D.x = result.position.x;
                    viewportState3D.y = result.position.y;
                    viewportState3D.scale = 2;
                    updateViewportInfo('2d');
                    updateViewportInfo('3d');
                }
            }
        };
        
        // Create 2D navigation component
        const nav2D = new XWUINav(
            document.getElementById('nav-container-2d'),
            {},
            {
                viewport,
                viewportMode: '2d',
                enablePanning,
                enableZooming,
                enableRotation,
                enableSearch,
                enableKeyboard,
                enableTouch,
                showControls,
                controlsPosition: 'bottom-right',
                searchHandler: searchHandler
            }
        );
        
        // Create 3D navigation component
        const nav3D = new XWUINav(
            document.getElementById('nav-container-3d'),
            {},
            {
                viewport,
                viewportMode: '3d',
                enablePanning,
                enableZooming,
                enableRotation,
                enableSearch,
                enableKeyboard,
                enableTouch,
                showControls,
                controlsPosition: 'bottom-right',
                searchHandler: searchHandler
            }
        );
        
        // Update viewport info display
        const updateViewportInfo = (mode) => {
            const viewportInfo = document.getElementById(`viewport-info-${mode}`);
            if (!viewportInfo) return;
            
            const state = mode === '2d' ? viewportState2D : viewportState3D;
            
            if (mode === '2d') {
                viewportInfo.textContent = `X: ${state.x.toFixed(1)}, Y: ${state.y.toFixed(1)}, Scale: ${state.scale.toFixed(2)}, Rotation: ${((state.rotation || 0) * 180 / Math.PI).toFixed(1)}°`;
            } else {
                viewportInfo.textContent = `X: ${state.x.toFixed(1)}, Y: ${state.y.toFixed(1)}, Z: ${(state.z || 0).toFixed(1)}, Scale: ${state.scale.toFixed(2)}, RotX: ${((state.rotationX || 0) * 180 / Math.PI).toFixed(1)}°, RotY: ${((state.rotationY || 0) * 180 / Math.PI).toFixed(1)}°, RotZ: ${((state.rotationZ || 0) * 180 / Math.PI).toFixed(1)}°`;
            }
        };
        
        // Listen for viewport changes
        document.getElementById('nav-container-2d')?.addEventListener('viewport-change', () => {
            updateViewportInfo('2d');
        });
        
        document.getElementById('nav-container-3d')?.addEventListener('viewport-change', () => {
            updateViewportInfo('3d');
        });
        
        updateViewportInfo('2d');
        updateViewportInfo('3d');
        
        tester.data.componentInstance = nav;
        tester.data.componentConfig = nav.config;
        tester.data.componentData = nav.data;
        tester.setStatus('Component loaded successfully', 'success');
