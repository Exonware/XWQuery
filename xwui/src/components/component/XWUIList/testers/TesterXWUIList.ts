import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIList/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIList } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIList Component Tester',
            desc: 'List component for displaying items.',
            componentName: 'XWUIList'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuilist-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic list
            new XWUIList(document.getElementById('list-1'), {
                items: [
                    { id: 'item-1', text: 'Item 1' },
                    { id: 'item-2', text: 'Item 2' },
                    { id: 'item-3', text: 'Item 3' }
                ]
            }, {});
            
            // List with icons
            new XWUIList(document.getElementById('list-2'), {
                items: [
                    { id: 'home', text: 'Home', icon: '🏠' },
                    { id: 'settings', text: 'Settings', icon: '⚙️' },
                    { id: 'profile', text: 'Profile', icon: '👤' }
                ]
            }, {});
            
            tester.setStatus('✅ XWUIList initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIList test error:', error);
        }
