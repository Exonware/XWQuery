import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMenuNavigation/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMenuNavigation } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUINavigationMenu Component Tester',
            desc: 'Navigation menu component for site navigation.',
            componentName: 'XWUINavigationMenu'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimenu-navigation-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic navigation menu
            new XWUIMenuNavigation(document.getElementById('nav-menu-1'), {
                items: [
                    { label: 'Home', href: '#', active: true },
                    { label: 'About', href: '#' },
                    { label: 'Services', href: '#' },
                    { label: 'Contact', href: '#' }
                ]
            }, {});
            
            tester.setStatus('✅ XWUIMenuNavigation initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMenuNavigation test error:', error);
        }
