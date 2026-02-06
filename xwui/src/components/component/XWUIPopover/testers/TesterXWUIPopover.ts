import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPopover/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIPopover } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIPopover Component Tester',
            desc: 'Popover component for displaying content in a floating panel.',
            componentName: 'XWUIPopover'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuipopover-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const trigger = document.getElementById('popover-trigger-1');
            const popover = new XWUIPopover(document.getElementById('popover-1'), {
                content: '<div style="padding: 1rem;">This is a popover content</div>'
            }, {
                trigger,
                placement: 'bottom'
            });
            
            tester.setStatus('✅ XWUIPopover initialized successfully - Click the button above', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIPopover test error:', error);
        }
