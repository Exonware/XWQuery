import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUINavigationRail/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUINavigationRail } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUINavigationRail Component Tester',
            desc: 'Mobile bottom navigation bar with icon + label items.',
            componentName: 'XWUINavigationRail'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuinavigation-rail-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('rail-basic');
            const basicRail = new XWUINavigationRail(
                basicContainer,
                {
                    items: [
                        { id: 'home', label: 'Home', icon: '🏠', active: true },
                        { id: 'search', label: 'Search', icon: '🔍' },
                        { id: 'profile', label: 'Profile', icon: '👤' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' }
                    ]
                }
            );
            basicRail.onClick((item) => {
                console.log('Clicked:', item);
                tester.setStatus(`✅ Clicked: ${item.label}`, 'success');
            });
            
            // RTL
            const rtlContainer = document.getElementById('rail-rtl');
            const rtlRail = new XWUINavigationRail(
                rtlContainer,
                {
                    items: [
                        { id: 'home', label: 'الرئيسية', icon: '🏠', active: true },
                        { id: 'search', label: 'بحث', icon: '🔍' },
                        { id: 'profile', label: 'الملف', icon: '👤' },
                        { id: 'settings', label: 'الإعدادات', icon: '⚙️' }
                    ]
                },
                { direction: 'rtl' }
            );
            rtlRail.onClick((item) => {
                console.log('RTL Clicked:', item);
            });
            
            tester.setStatus('✅ XWUINavigationRail initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUINavigationRail test error:', error);
        }
