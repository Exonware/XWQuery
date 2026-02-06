
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIMenuDrawer } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMenuDrawer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMenuDrawer Component Tester',
            desc: 'Sliding panel component with placement options (left, right, top, bottom).',
            componentName: 'XWUIMenuDrawer'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimenu-drawer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Left drawer
            const leftDrawer = new XWUIMenuDrawer(
                document.createElement('div'),
                {
                    title: 'Left Drawer',
                    content: '<p>This drawer slides in from the left side.</p><p>You can add any content here.</p>'
                },
                { placement: 'left', size: 'medium' }
            );
            
            // Right drawer
            const rightDrawer = new XWUIDrawer(
                document.createElement('div'),
                {
                    title: 'Right Drawer',
                    content: '<p>This drawer slides in from the right side.</p><p>This is the default placement.</p>'
                },
                { placement: 'right', size: 'medium' }
            );
            
            // Top drawer
            const topDrawer = new XWUIDrawer(
                document.createElement('div'),
                {
                    title: 'Top Drawer',
                    content: '<p>This drawer slides down from the top.</p>'
                },
                { placement: 'top', size: 'medium' }
            );
            
            // Bottom drawer
            const bottomDrawer = new XWUIDrawer(
                document.createElement('div'),
                {
                    title: 'Bottom Drawer',
                    content: '<p>This drawer slides up from the bottom.</p>'
                },
                { placement: 'bottom', size: 'medium' }
            );
            
            // Size variants
            const smallDrawer = new XWUIDrawer(
                document.createElement('div'),
                { title: 'Small Drawer', content: '<p>Small size drawer (320px).</p>' },
                { placement: 'right', size: 'small' }
            );
            
            const mediumDrawer = new XWUIDrawer(
                document.createElement('div'),
                { title: 'Medium Drawer', content: '<p>Medium size drawer (480px).</p>' },
                { placement: 'right', size: 'medium' }
            );
            
            const largeDrawer = new XWUIDrawer(
                document.createElement('div'),
                { title: 'Large Drawer', content: '<p>Large size drawer (640px).</p>' },
                { placement: 'right', size: 'large' }
            );
            
            const fullDrawer = new XWUIDrawer(
                document.createElement('div'),
                { title: 'Full Drawer', content: '<p>Full width drawer.</p>' },
                { placement: 'right', size: 'full' }
            );
            
            // Event handlers
            document.getElementById('btn-left').addEventListener('click', () => leftDrawer.open());
            document.getElementById('btn-right').addEventListener('click', () => rightDrawer.open());
            document.getElementById('btn-top').addEventListener('click', () => topDrawer.open());
            document.getElementById('btn-bottom').addEventListener('click', () => bottomDrawer.open());
            
            document.getElementById('btn-small').addEventListener('click', () => smallDrawer.open());
            document.getElementById('btn-medium').addEventListener('click', () => mediumDrawer.open());
            document.getElementById('btn-large').addEventListener('click', () => largeDrawer.open());
            document.getElementById('btn-full').addEventListener('click', () => fullDrawer.open());
            
            tester.setStatus('✅ XWUIMenuDrawer initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMenuDrawer test error:', error);
        }
