import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICheckbox/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUICheckbox } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICheckbox Component Tester',
            desc: 'Checkbox input with label support and indeterminate state.',
            componentName: 'XWUICheckbox'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicheckbox-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const cb1 = new XWUICheckbox(document.getElementById('checkbox-1'), { label: 'Option 1' }, {});
            const cb2 = new XWUICheckbox(document.getElementById('checkbox-2'), { label: 'Option 2', checked: true }, {});
            const cb3 = new XWUICheckbox(document.getElementById('checkbox-3'), { label: 'Option 3' }, {});
            
            cb1.onChange((checked) => {
                tester.setStatus(`✅ Checkbox 1: ${checked ? 'checked' : 'unchecked'}`, 'success');
            });
            
            // Sizes
            new XWUICheckbox(document.getElementById('checkbox-small'), { label: 'Small' }, { size: 'small' });
            new XWUICheckbox(document.getElementById('checkbox-medium'), { label: 'Medium (default)' }, { size: 'medium' });
            new XWUICheckbox(document.getElementById('checkbox-large'), { label: 'Large' }, { size: 'large' });
            
            // Colors
            new XWUICheckbox(document.getElementById('checkbox-primary'), { label: 'Primary', checked: true }, { color: 'primary' });
            new XWUICheckbox(document.getElementById('checkbox-success'), { label: 'Success', checked: true }, { color: 'success' });
            new XWUICheckbox(document.getElementById('checkbox-warning'), { label: 'Warning', checked: true }, { color: 'warning' });
            new XWUICheckbox(document.getElementById('checkbox-error'), { label: 'Error', checked: true }, { color: 'error' });
            
            // Indeterminate
            new XWUICheckbox(document.getElementById('checkbox-indeterminate'), { label: 'Indeterminate' }, { indeterminate: true });
            
            // With description
            new XWUICheckbox(document.getElementById('checkbox-desc'), {
                label: 'Terms and Conditions',
                description: 'I agree to the terms and conditions'
            }, {});
            
            // Disabled
            new XWUICheckbox(document.getElementById('checkbox-disabled-unchecked'), { label: 'Disabled (unchecked)' }, { disabled: true });
            new XWUICheckbox(document.getElementById('checkbox-disabled-checked'), { label: 'Disabled (checked)', checked: true }, { disabled: true });
            
            tester.setStatus('✅ XWUICheckbox initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICheckbox test error:', error);
        }
