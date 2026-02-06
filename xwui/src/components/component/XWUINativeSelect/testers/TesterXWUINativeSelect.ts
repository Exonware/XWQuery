import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUINativeSelect/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUINativeSelect } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUINativeSelect Component Tester',
            desc: 'Native select element wrapper for better mobile UX and accessibility.',
            componentName: 'XWUINativeSelect'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuinative-select-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic native select
            const select1 = new XWUINativeSelect(document.getElementById('native-select-1'), {
                label: 'Choose an option',
                options: [
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' },
                    { value: '3', label: 'Option 3' }
                ],
                placeholder: 'Select...'
            }, {
                variant: 'outlined'
            });
            
            select1.onChange((value, event) => {
                console.log('Selected:', value);
            });
            
            // With optgroups
            new XWUINativeSelect(document.getElementById('native-select-2'), {
                label: 'Select with groups',
                options: [
                    {
                        label: 'Group 1',
                        options: [
                            { value: 'g1-1', label: 'Group 1 Option 1' },
                            { value: 'g1-2', label: 'Group 1 Option 2' }
                        ]
                    },
                    {
                        label: 'Group 2',
                        options: [
                            { value: 'g2-1', label: 'Group 2 Option 1' },
                            { value: 'g2-2', label: 'Group 2 Option 2' }
                        ]
                    }
                ]
            }, {
                variant: 'outlined'
            });
            
            // Multiple select
            new XWUINativeSelect(document.getElementById('native-select-3'), {
                label: 'Multiple selection',
                options: [
                    { value: 'a', label: 'Option A' },
                    { value: 'b', label: 'Option B' },
                    { value: 'c', label: 'Option C' },
                    { value: 'd', label: 'Option D' }
                ]
            }, {
                multiple,
                size: 'large'
            });
            
            // With error state
            new XWUINativeSelect(document.getElementById('native-select-4'), {
                label: 'Select with error',
                options: [
                    { value: '1', label: 'Option 1' },
                    { value: '2', label: 'Option 2' }
                ],
                errorText: 'This field is required'
            }, {
                error: true
            });
            
            tester.setStatus('✅ XWUINativeSelect initialized successfully - Try selecting options (especially on mobile)', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUINativeSelect test error:', error);
        }
