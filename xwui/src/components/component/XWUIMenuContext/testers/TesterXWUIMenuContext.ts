import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMenuContext/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMenuContext } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMenuContext Component Tester',
            desc: 'Context menu component that appears on right-click.',
            componentName: 'XWUIMenuContext'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimenu-context-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const target = document.getElementById('context-target');
            
            // Context menu
            new XWUIMenuContext(target, {
                items: [
                    { label: 'Copy', action: () => console.log('Copy') },
                    { label: 'Paste', action: () => console.log('Paste') },
                    { label: 'Cut', action: () => console.log('Cut') },
                    { type: 'separator' },
                    { label: 'Delete', action: () => console.log('Delete') }
                ]
            }, {});
            
            tester.setStatus('✅ XWUIMenuContext initialized successfully - Right-click on the box above', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMenuContext test error:', error);
        }
