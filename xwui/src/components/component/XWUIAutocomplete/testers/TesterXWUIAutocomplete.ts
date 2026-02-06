import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAutocomplete/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAutocomplete } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAutocomplete Component Tester',
            desc: 'Autocomplete/combobox with search functionality.',
            componentName: 'XWUIAutocomplete'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiautocomplete-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const autocomplete = new XWUIAutocomplete(document.getElementById('autocomplete-1'), {
                value: '',
                placeholder: 'Type to search...'
            }, {
                options: [
                    { value: 'apple', label: 'Apple' },
                    { value: 'banana', label: 'Banana' },
                    { value: 'cherry', label: 'Cherry' },
                    { value: 'date', label: 'Date' },
                    { value: 'elderberry', label: 'Elderberry' }
                ]
            });
            
            tester.setStatus('✅ XWUIAutocomplete initialized successfully. Type to see suggestions', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAutocomplete test error:', error);
        }
