import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITabs/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITabs } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITabs Component Tester',
            desc: 'Tab navigation with various variants.',
            componentName: 'XWUITabs'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitabs-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const sampleTabs = [
            { id: 'tab1', label: 'Overview', content: '<p>This is the overview content.</p>' },
            { id: 'tab2', label: 'Features', content: '<p>This is the features content.</p>' },
            { id: 'tab3', label: 'Settings', content: '<p>This is the settings content.</p>' },
            { id: 'tab4', label: 'About', content: '<p>This is the about content.</p>' }
        ];
        
        try {
            // Line variant
            const lineTabs = new XWUITabs(
                document.getElementById('tabs-line'),
                { tabs: sampleTabs },
                { variant: 'line' }
            );
            
            lineTabs.onChange((tabId) => {
                tester.setStatus(`✅ Switched to tab: ${tabId}`, 'success');
            });
            
            // Card variant
            new XWUITabs(
                document.getElementById('tabs-card'),
                { tabs: sampleTabs },
                { variant: 'card' }
            );
            
            // Button variant
            new XWUITabs(
                document.getElementById('tabs-button'),
                { tabs: sampleTabs },
                { variant: 'button' }
            );
            
            // Sizes
            new XWUITabs(
                document.getElementById('tabs-small'),
                { tabs: sampleTabs.slice(0, 3) },
                { size: 'small' }
            );
            
            new XWUITabs(
                document.getElementById('tabs-medium'),
                { tabs: sampleTabs.slice(0, 3) },
                { size: 'medium' }
            );
            
            new XWUITabs(
                document.getElementById('tabs-large'),
                { tabs: sampleTabs.slice(0, 3) },
                { size: 'large' }
            );
            
            // Vertical
            const verticalContainer = document.getElementById('tabs-vertical').firstElementChild;
            new XWUITabs(
                verticalContainer,
                { tabs: sampleTabs },
                { orientation: 'vertical' }
            );
            
            // With icons
            const iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>';
            new XWUITabs(
                document.getElementById('tabs-icons'),
                {
                    tabs: [
                        { id: 'home', label: 'Home', icon, content: '<p>Home content</p>' },
                        { id: 'profile', label: 'Profile', icon, content: '<p>Profile content</p>' },
                        { id: 'settings', label: 'Settings', icon, content: '<p>Settings content</p>' }
                    ]
                },
                {}
            );
            
            tester.setStatus('✅ XWUITabs initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITabs test error:', error);
        }
