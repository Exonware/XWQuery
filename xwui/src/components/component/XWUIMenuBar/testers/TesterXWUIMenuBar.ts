import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMenubar/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMenuBar } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMenubar Component Tester',
            desc: 'Menubar component for application menus.',
            componentName: 'XWUIMenubar'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimenu-bar-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic menubar
            new XWUIMenuBar(document.getElementById('menubar-1'), {
                items: [
                    {
                        label: 'File',
                        items: [
                            { label: 'New', action: () => console.log('New') },
                            { label: 'Open', action: () => console.log('Open') },
                            { label: 'Save', action: () => console.log('Save') }
                        ]
                    },
                    {
                        label: 'Edit',
                        items: [
                            { label: 'Cut', action: () => console.log('Cut') },
                            { label: 'Copy', action: () => console.log('Copy') },
                            { label: 'Paste', action: () => console.log('Paste') }
                        ]
                    }
                ]
            }, {});
            
            tester.setStatus('✅ XWUIMenuBar initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMenuBar test error:', error);
        }
