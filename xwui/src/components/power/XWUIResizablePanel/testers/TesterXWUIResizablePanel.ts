import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIResizablePanel/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIResizablePanel } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIResizablePanel Component Tester',
            desc: 'Split-panel with two resizable panes and a draggable divider.',
            componentName: 'XWUIResizablePanel'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiresizable-panel-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createPaneContent(text, color) {
            const div = document.createElement('div');
            div.className = 'pane-content';
            div.style.backgroundColor = color;
            div.innerHTML = `
                <h4>${text}</h4>
                <p>This is the ${text.toLowerCase()} pane. Drag the divider to resize.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            `;
            return div;
        }
        
        try {
            // Horizontal
            const horizontalContainer = document.getElementById('panel-horizontal');
            const horizontalPanel = new XWUIResizablePanel(
                horizontalContainer,
                {
                    leftPane: createPaneContent('Left Pane', 'var(--bg-secondary)'),
                    rightPane: createPaneContent('Right Pane', 'var(--bg-primary)')
                },
                { direction: 'horizontal' }
            );
            horizontalPanel.onResize((size) => {
                console.log(`Horizontal panel resized to ${size.toFixed(1)}%`);
            });
            
            // Vertical
            const verticalContainer = document.getElementById('panel-vertical');
            const verticalPanel = new XWUIResizablePanel(
                verticalContainer,
                {
                    leftPane: createPaneContent('Top Pane', 'var(--bg-secondary)'),
                    rightPane: createPaneContent('Bottom Pane', 'var(--bg-primary)')
                },
                { direction: 'vertical' }
            );
            verticalPanel.onResize((size) => {
                console.log(`Vertical panel resized to ${size.toFixed(1)}%`);
            });
            
            // Custom Initial Size
            const customContainer = document.getElementById('panel-custom');
            const customPanel = new XWUIResizablePanel(
                customContainer,
                {
                    leftPane: createPaneContent('Left (30%)', 'var(--bg-secondary)'),
                    rightPane: createPaneContent('Right (70%)', 'var(--bg-primary)')
                },
                { direction: 'horizontal', initialSize: 30 }
            );
            
            // With Constraints
            const constrainedContainer = document.getElementById('panel-constrained');
            const constrainedPanel = new XWUIResizablePanel(
                constrainedContainer,
                {
                    leftPane: createPaneContent('Left (Min 20%)', 'var(--bg-secondary)'),
                    rightPane: createPaneContent('Right (Max 80%)', 'var(--bg-primary)')
                },
                { 
                    direction: 'horizontal', 
                    initialSize: 50,
                    minSize: 20,
                    maxSize: 80
                }
            );
            
            tester.setStatus('✅ XWUIResizablePanel initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIResizablePanel test error:', error);
        }
