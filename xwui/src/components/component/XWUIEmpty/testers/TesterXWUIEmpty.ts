import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIEmpty/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIEmpty } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIEmpty Component Tester',
            desc: 'Empty state component for displaying when there\'s no content.',
            componentName: 'XWUIEmpty'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiempty-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic empty state
            new XWUIEmpty(document.getElementById('empty-1'), {
                description: 'No items found'
            }, {});
            
            // Empty state with icon and action
            new XWUIEmpty(document.getElementById('empty-2'), {
                description: 'No data available',
                action: {
                    label: 'Create New',
                    onClick: () => console.log('Create new clicked')
                }
            }, {});
            
            tester.setStatus('✅ XWUIEmpty initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIEmpty test error:', error);
        }
