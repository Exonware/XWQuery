import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIFlex/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIFlex } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIFlex Component Tester',
            desc: 'A layout component that uses CSS Flexbox to arrange its children.',
            componentName: 'XWUIFlex'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiflex-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createItem(text) {
            const item = document.createElement('div');
            item.textContent = text;
            item.style.padding = 'var(--spacing-md)';
            item.style.background = 'var(--bg-secondary, #f8f9fa)';
            item.style.borderRadius = 'var(--radius-sm, 4px)';
            item.style.minWidth = '80px';
            return item;
        }
        
        try {
            // Row direction
            const flexRow = new XWUIFlex(document.getElementById('flex-row'), {
                items: [
                    createItem('Item 1'),
                    createItem('Item 2'),
                    createItem('Item 3')
                ]
            }, {
                direction: 'row',
                gap: '8px'
            });
            
            // Column direction
            const flexColumn = new XWUIFlex(document.getElementById('flex-column'), {
                items: [
                    createItem('Item A'),
                    createItem('Item B'),
                    createItem('Item C')
                ]
            }, {
                direction: 'column',
                gap: '8px'
            });
            
            // Justify center
            const flexJustify = new XWUIFlex(document.getElementById('flex-justify'), {
                items: [
                    createItem('Item 1'),
                    createItem('Item 2'),
                    createItem('Item 3')
                ]
            }, {
                direction: 'row',
                justify: 'center',
                gap: '8px'
            });
            
            tester.setStatus('✅ XWUIFlex initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIFlex test error:', error);
        }
