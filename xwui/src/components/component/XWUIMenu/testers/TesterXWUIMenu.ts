import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMenu/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMenu } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMenu Component Tester',
            desc: 'Menu component for navigation and actions.',
            componentName: 'XWUIMenu'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimenu-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic menu
            new XWUIMenu(document.getElementById('menu-1'), {
                items: [
                    { label: 'Home', action: () => console.log('Home') },
                    { label: 'About', action: () => console.log('About') },
                    { label: 'Contact', action: () => console.log('Contact') }
                ]
            }, {});
            
            // Menu with icons
            new XWUIMenu(document.getElementById('menu-2'), {
                items: [
                    { label: 'Dashboard', icon: '📊', action: () => console.log('Dashboard') },
                    { label: 'Settings', icon: '⚙️', action: () => console.log('Settings') },
                    { label: 'Logout', icon: '🚪', action: () => console.log('Logout') }
                ]
            }, {});
            
            tester.setStatus('✅ XWUIMenu initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMenu test error:', error);
        }
