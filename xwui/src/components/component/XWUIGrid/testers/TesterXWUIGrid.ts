import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIGrid/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIGrid, createGridItem } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIGrid Component Tester',
            desc: 'CSS Grid wrapper with responsive breakpoints.',
            componentName: 'XWUIGrid'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuigrid-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createDemoItem(text) {
            const div = document.createElement('div');
            div.style.padding = 'var(--spacing-md)';
            div.style.background = 'var(--bg-secondary)';
            div.style.borderRadius = 'var(--radius-md)';
            div.style.textAlign = 'center';
            div.style.fontWeight = '500';
            div.textContent = text;
            return div;
        }
        
        try {
            // Basic 3-column grid
            const basicGrid = new XWUIGrid(document.getElementById('grid-basic'), {}, {
                columns: 3,
                gap: '1rem'
            });
            for (let i = 1; i <= 6; i++) {
                basicGrid.addChild(createDemoItem(`Item ${i}`));
            }
            
            // Auto-fit responsive grid
            const autofitGrid = new XWUIGrid(document.getElementById('grid-autofit'), {}, {
                minChildWidth: '150px',
                gap: '1rem'
            });
            for (let i = 1; i <= 8; i++) {
                autofitGrid.addChild(createDemoItem(`Card ${i}`));
            }
            
            // 12-column layout grid
            const layoutGrid = new XWUIGrid(document.getElementById('grid-12col'), {}, {
                columns: 12,
                gap: '0.5rem'
            });
            
            const header = createDemoItem('Header (span 12)');
            layoutGrid.addChild(createGridItem(header, { colSpan: 12 }));
            
            const sidebar = createDemoItem('Sidebar (span 3)');
            layoutGrid.addChild(createGridItem(sidebar, { colSpan: 3 }));
            
            const main = createDemoItem('Main Content (span 9)');
            layoutGrid.addChild(createGridItem(main, { colSpan: 9 }));
            
            const footer = createDemoItem('Footer (span 12)');
            layoutGrid.addChild(createGridItem(footer, { colSpan: 12 }));
            
            // Custom gap
            const gapGrid = new XWUIGrid(document.getElementById('grid-gap'), {}, {
                columns: 4,
                gap: '2rem'
            });
            for (let i = 1; i <= 8; i++) {
                gapGrid.addChild(createDemoItem(`Box ${i}`));
            }
            
            tester.setStatus('✅ XWUIGrid initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIGrid test error:', error);
        }
