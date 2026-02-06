import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISelect/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISelect } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISelect Component Tester',
            desc: 'Dropdown select with single and multi-select modes.',
            componentName: 'XWUISelect'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiselect-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const basicOptions = [
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue.js' },
            { value: 'angular', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' }
        ];
        
        try {
            // Basic
            const basic = new XWUISelect(
                document.getElementById('select-basic'),
                {
                    label: 'Select Framework',
                    placeholder: 'Choose a framework...',
                    options: basicOptions
                },
                { variant: 'outlined' }
            );
            
            basic.onChange((value) => {
                tester.setStatus(`✅ Selected: ${Array.isArray(value) ? value.join(', ') : value}`, 'success');
            });
            
            new XWUISelect(
                document.getElementById('select-filled'),
                {
                    label: 'Filled Variant',
                    placeholder: 'Choose...',
                    options: basicOptions
                },
                { variant: 'filled' }
            );
            
            // Multi select
            new XWUISelect(
                document.getElementById('select-multi'),
                {
                    label: 'Multi Select',
                    placeholder: 'Select multiple...',
                    options: basicOptions
                },
                { multiple: true }
            );
            
            // Searchable
            new XWUISelect(
                document.getElementById('select-searchable'),
                {
                    label: 'Searchable Select',
                    placeholder: 'Type to search...',
                    options: [
                        { value: 'apple', label: 'Apple' },
                        { value: 'banana', label: 'Banana' },
                        { value: 'cherry', label: 'Cherry' },
                        { value: 'date', label: 'Date' },
                        { value: 'elderberry', label: 'Elderberry' },
                        { value: 'fig', label: 'Fig' },
                        { value: 'grape', label: 'Grape' }
                    ]
                },
                { searchable: true }
            );
            
            // With groups
            new XWUISelect(
                document.getElementById('select-groups'),
                {
                    label: 'Grouped Options',
                    placeholder: 'Choose...',
                    options: [
                        { value: 'js', label: 'JavaScript', group: 'Languages' },
                        { value: 'ts', label: 'TypeScript', group: 'Languages' },
                        { value: 'py', label: 'Python', group: 'Languages' },
                        { value: 'react', label: 'React', group: 'Frameworks' },
                        { value: 'vue', label: 'Vue', group: 'Frameworks' },
                        { value: 'angular', label: 'Angular', group: 'Frameworks' }
                    ]
                },
                {}
            );
            
            // Sizes
            new XWUISelect(
                document.getElementById('select-small'),
                { label: 'Small', placeholder: 'Choose...', options: basicOptions },
                { size: 'small' }
            );
            
            new XWUISelect(
                document.getElementById('select-medium'),
                { label: 'Medium', placeholder: 'Choose...', options: basicOptions },
                { size: 'medium' }
            );
            
            new XWUISelect(
                document.getElementById('select-large'),
                { label: 'Large', placeholder: 'Choose...', options: basicOptions },
                { size: 'large' }
            );
            
            // States
            new XWUISelect(
                document.getElementById('select-disabled'),
                { label: 'Disabled', placeholder: 'Cannot select', options, value: 'react' },
                { disabled: true }
            );
            
            new XWUISelect(
                document.getElementById('select-error'),
                { label: 'Error State', placeholder: 'Invalid selection', options, errorText: 'Please select a valid option' },
                { error: true }
            );
            
            const clearable = new XWUISelect(
                document.getElementById('select-clearable'),
                { label: 'Clearable', placeholder: 'Select...', options, value: 'react' },
                { clearable: true }
            );
            
            clearable.onChange((value) => {
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    tester.setStatus('✅ Selection cleared', 'success');
                }
            });
            
            tester.setStatus('✅ XWUISelect initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISelect test error:', error);
        }
