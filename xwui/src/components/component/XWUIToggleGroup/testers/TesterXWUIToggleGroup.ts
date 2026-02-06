import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIToggleGroup/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIToggleGroup } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIToggleGroup Component Tester',
            desc: 'Toggle group component for grouping toggle buttons.',
            componentName: 'XWUIToggleGroup'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitoggle-group-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic toggle group
            const toggleGroup1 = new XWUIToggleGroup(document.getElementById('toggle-group-1'), {
                items: [
                    { id: 'opt1', label: 'Option 1' },
                    { id: 'opt2', label: 'Option 2' },
                    { id: 'opt3', label: 'Option 3' }
                ]
            }, {
                multiple: false
            });
            
            toggleGroup1.onChange((selected) => {
                console.log('Selected:', selected);
            });
            
            // Multiple selection toggle group
            const toggleGroup2 = new XWUIToggleGroup(document.getElementById('toggle-group-2'), {
                items: [
                    { id: 'bold', label: 'Bold' },
                    { id: 'italic', label: 'Italic' },
                    { id: 'underline', label: 'Underline' }
                ]
            }, {
                multiple: true
            });
            
            toggleGroup2.onChange((selected) => {
                console.log('Selected:', selected);
            });
            
            tester.setStatus('✅ XWUIToggleGroup initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIToggleGroup test error:', error);
        }
