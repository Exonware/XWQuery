import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIButtonGroup/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIButtonGroup } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIButtonGroup Component Tester',
            desc: 'Button group component for grouping related buttons.',
            componentName: 'XWUIButtonGroup'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuibutton-group-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic button group
            new XWUIButtonGroup(document.getElementById('button-group-1'), {
                buttons: [
                    { label: 'Button 1', variant: 'primary' },
                    { label: 'Button 2', variant: 'secondary' },
                    { label: 'Button 3', variant: 'tertiary' }
                ]
            }, {});
            
            // Vertical button group
            new XWUIButtonGroup(document.getElementById('button-group-2'), {
                buttons: [
                    { label: 'Option 1', variant: 'primary' },
                    { label: 'Option 2', variant: 'secondary' }
                ]
            }, { orientation: 'vertical' });
            
            // Button group with custom options
            new XWUIButtonGroup(document.getElementById('button-group-3'), {
                buttons: [
                    { label: 'Large 1', variant: 'primary' },
                    { label: 'Large 2', variant: 'secondary' }
                ]
            }, { size: 'large' });
            
            tester.setStatus('✅ XWUIButtonGroup initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIButtonGroup test error:', error);
        }
