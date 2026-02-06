import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMultiSelect/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMultiSelect } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMultiSelect Component Tester',
            desc: 'Multi-select dropdown with tag display.',
            componentName: 'XWUIMultiSelect'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuimulti-select-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const multiselect = new XWUIMultiSelect(document.getElementById('multiselect-1'), {
                options: [
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' },
                    { value: '3', label: 'Option 3' },
                    { value: '4', label: 'Option 4' }
                ],
                value: ['1', '2']
            }, {
                maxTagCount: 2
            });
            
            tester.setStatus('✅ XWUIMultiSelect initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMultiSelect test error:', error);
        }
