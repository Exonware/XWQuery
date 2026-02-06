
        import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIViewport3D } from '../index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIViewport3D/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIViewport3D Component Tester',
            desc: '3D viewport with transform system and 3D rendering. Drag the cubes to move them. Right-click or Ctrl+drag to rotate view. Use navigation controls for pan, zoom, and rotation.',
            componentName: 'XWUIViewport3D'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiviewport3-d-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const viewport = new XWUIViewport3D(
            document.getElementById('viewport3d-1'),
            {
                objects: [
                    { id: 'golden-sphere', x: 0, y: 0, z: 0, width: 100, height: 100, depth: 100, color: '#FFD700', label: 'Golden Sphere', shape: 'sphere' },
                    { id: 'cube1', x: 150, y: 0, z: 0, width: 60, height: 60, depth: 60, color: '#4a90e2', label: 'Cube 1' },
                    { id: 'cube2', x: -150, y: 0, z: 0, width: 60, height: 60, depth: 60, color: '#5a8ded', label: 'Cube 2' }
                ]
            },
            {
                initialX: 0,
                initialY: 0,
                initialZ: 0,
                initialScale: 1,
                enableNavigation: true,
                navControlsPosition: 'bottom-right'
            }
        );
        
        tester.data.componentInstance = viewport;
        tester.data.componentConfig = viewport.config;
        tester.data.componentData = viewport.data;
        tester.setStatus('Component loaded successfully', 'success');
