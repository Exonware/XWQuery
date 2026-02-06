import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIStack/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIStack } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIStack Component Tester',
            desc: 'A layout component that stacks its children vertically or horizontally with consistent spacing.',
            componentName: 'XWUIStack'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuistack-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createItem(text) {
            const item = document.createElement('div');
            item.textContent = text;
            item.style.padding = 'var(--spacing-md)';
            item.style.background = 'var(--bg-secondary, #f8f9fa)';
            item.style.borderRadius = 'var(--radius-sm, 4px)';
            return item;
        }
        
        try {
            // Vertical stack
            const stackVertical = new XWUIStack(document.getElementById('stack-vertical'), {
                items: [
                    createItem('First Item'),
                    createItem('Second Item'),
                    createItem('Third Item')
                ]
            }, {
                direction: 'vertical',
                spacing: '16px'
            });
            
            // Horizontal stack
            const stackHorizontal = new XWUIStack(document.getElementById('stack-horizontal'), {
                items: [
                    createItem('Item A'),
                    createItem('Item B'),
                    createItem('Item C')
                ]
            }, {
                direction: 'horizontal',
                spacing: '16px'
            });
            
            tester.setStatus('✅ XWUIStack initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIStack test error:', error);
        }
