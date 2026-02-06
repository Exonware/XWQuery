import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBottomNavigation/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBottomNavigation } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBottomNavigation Component Tester',
            desc: 'Bottom navigation bar for mobile app navigation.',
            componentName: 'XWUIBottomNavigation'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuibottom-navigation-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic bottom navigation
            const bottomNav1 = new XWUIBottomNavigation(document.getElementById('bottom-nav-1'), {
                items: [
                    { id: 'home', label: 'Home', icon: '🏠' },
                    { id: 'search', label: 'Search', icon: '🔍' },
                    { id: 'favorites', label: 'Favorites', icon: '⭐' },
                    { id: 'profile', label: 'Profile', icon: '👤' }
                ],
                activeId: 'home'
            }, {
                fixed: true,
                showLabels: true
            });
            
            bottomNav1.onItemClick((item, event) => {
                bottomNav1.setActive(item.id);
                tester.setStatus(`✅ Selected: ${item.label}`, 'success');
            });
            
            // Without labels
            const bottomNav2 = new XWUIBottomNavigation(document.getElementById('bottom-nav-2'), {
                items: [
                    { id: 'home2', label: 'Home', icon: '🏠', badge: '3' },
                    { id: 'messages', label: 'Messages', icon: '💬', badge: '12' },
                    { id: 'notifications', label: 'Notifications', icon: '🔔' },
                    { id: 'settings', label: 'Settings', icon: '⚙️' }
                ],
                activeId: 'home2'
            }, {
                showLabels: false,
                variant: 'elevated'
            });
            
            bottomNav2.onChange((activeId) => {
                bottomNav2.setActive(activeId);
                tester.setStatus(`✅ Changed to: ${activeId}`, 'success');
            });
            
            tester.setStatus('✅ XWUIBottomNavigation initialized successfully - Try clicking items', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIBottomNavigation test error:', error);
        }
