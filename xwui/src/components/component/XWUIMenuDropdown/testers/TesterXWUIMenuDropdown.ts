
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIMenuDropdown } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMenuDropdown/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMenuDropdown Component Tester',
            desc: 'Dropdown menu component.',
            componentName: 'XWUIMenuDropdown'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimenu-dropdown-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic dropdown menu
            const dropdown1 = new XWUIMenuDropdown(document.getElementById('dropdown-1'), {
                items: [
                    { id: 'option1', label: 'Option 1' },
                    { id: 'option2', label: 'Option 2' },
                    { id: 'option3', label: 'Option 3' }
                ]
            }, {});
            
            dropdown1.onItemClick((item) => {
                console.log('Selected:', item.label);
            });
            
            // Dropdown with trigger
            new XWUIMenuDropdown(document.getElementById('dropdown-2'), {
                items: [
                    { id: 'edit', label: 'Edit' },
                    { id: 'delete', label: 'Delete' }
                ],
                triggerElement: document.getElementById('dropdown-2')
            }, {});
            
            tester.setStatus('✅ XWUIMenuDropdown initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMenuDropdown test error:', error);
        }
