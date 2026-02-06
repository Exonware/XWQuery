import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISpace/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISpace } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISpace Component Tester',
            desc: 'A layout component that adds spacing between its children.',
            componentName: 'XWUISpace'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuispace-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createItem(text) {
            const item = document.createElement('div');
            item.textContent = text;
            item.style.padding = 'var(--spacing-sm) var(--spacing-md)';
            item.style.background = 'var(--bg-secondary, #f8f9fa)';
            item.style.borderRadius = 'var(--radius-sm, 4px)';
            return item;
        }
        
        try {
            // Horizontal space
            const spaceHorizontal = new XWUISpace(document.getElementById('space-horizontal'), {
                items: [
                    createItem('Item 1'),
                    createItem('Item 2'),
                    createItem('Item 3')
                ]
            }, {
                direction: 'horizontal',
                size: '16px'
            });
            
            // Vertical space
            const spaceVertical = new XWUISpace(document.getElementById('space-vertical'), {
                items: [
                    createItem('Item A'),
                    createItem('Item B'),
                    createItem('Item C')
                ]
            }, {
                direction: 'vertical',
                size: '16px'
            });
            
            // Wrapped space
            const spaceWrap = new XWUISpace(document.getElementById('space-wrap'), {
                items: Array.from({ length: 8 }, (_, i) => createItem(`Item ${i + 1}`))
            }, {
                direction: 'horizontal',
                size: '12px',
                wrap: true
            });
            
            tester.setStatus('✅ XWUISpace initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISpace test error:', error);
        }
