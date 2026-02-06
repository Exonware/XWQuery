import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISidebar/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISidebar } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISidebar Component Tester',
            desc: 'Sidebar component for navigation.',
            componentName: 'XWUISidebar'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuisidebar-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic sidebar
            new XWUISidebar(document.getElementById('sidebar-1'), {
                items: [
                    { label: 'Dashboard', icon: '📊', active: true },
                    { label: 'Projects', icon: '📁' },
                    { label: 'Settings', icon: '⚙️' },
                    { label: 'Profile', icon: '👤' }
                ]
            }, {});
            
            tester.setStatus('✅ XWUISidebar initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISidebar test error:', error);
        }
