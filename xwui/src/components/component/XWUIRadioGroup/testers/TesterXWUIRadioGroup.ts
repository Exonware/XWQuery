import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIRadioGroup/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIRadioGroup } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIRadioGroup Component Tester',
            desc: 'Radio button group with horizontal/vertical layouts.',
            componentName: 'XWUIRadioGroup'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiradio-group-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const sampleOptions = [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' }
        ];
        
        try {
            // Vertical
            const vertical = new XWUIRadioGroup(
                document.getElementById('radio-vertical'),
                { options, value: '1', label: 'Choose an option' },
                { orientation: 'vertical' }
            );
            
            vertical.onChange((value) => {
                tester.setStatus(`✅ Selected: ${value}`, 'success');
            });
            
            // Horizontal
            new XWUIRadioGroup(
                document.getElementById('radio-horizontal'),
                { options, value: '2' },
                { orientation: 'horizontal' }
            );
            
            // Sizes
            new XWUIRadioGroup(
                document.getElementById('radio-small'),
                { options, value: '1' },
                { size: 'small' }
            );
            
            new XWUIRadioGroup(
                document.getElementById('radio-medium'),
                { options, value: '1' },
                { size: 'medium' }
            );
            
            new XWUIRadioGroup(
                document.getElementById('radio-large'),
                { options, value: '1' },
                { size: 'large' }
            );
            
            // Colors
            new XWUIRadioGroup(
                document.getElementById('radio-primary'),
                { options, value: '1' },
                { color: 'primary' }
            );
            
            new XWUIRadioGroup(
                document.getElementById('radio-success'),
                { options, value: '1' },
                { color: 'success' }
            );
            
            new XWUIRadioGroup(
                document.getElementById('radio-warning'),
                { options, value: '1' },
                { color: 'warning' }
            );
            
            new XWUIRadioGroup(
                document.getElementById('radio-error'),
                { options, value: '1' },
                { color: 'error' }
            );
            
            // With descriptions
            new XWUIRadioGroup(
                document.getElementById('radio-desc'),
                {
                    options: [
                        { value: 'basic', label: 'Basic Plan', description: '$9/month' },
                        { value: 'pro', label: 'Pro Plan', description: '$29/month' },
                        { value: 'enterprise', label: 'Enterprise Plan', description: '$99/month' }
                    ],
                    value: 'pro'
                },
                {}
            );
            
            // With disabled
            new XWUIRadioGroup(
                document.getElementById('radio-disabled'),
                {
                    options: [
                        { value: '1', label: 'Enabled Option 1' },
                        { value: '2', label: 'Enabled Option 2' },
                        { value: '3', label: 'Disabled Option', disabled: true }
                    ],
                    value: '1'
                },
                {}
            );
            
            tester.setStatus('✅ XWUIRadioGroup initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIRadioGroup test error:', error);
        }
