import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBreadcrumbs/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBreadcrumbs } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBreadcrumbs Component Tester',
            desc: 'Path navigation breadcrumbs component.',
            componentName: 'XWUIBreadcrumbs'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuibreadcrumbs-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const basicItems = [
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'Category', href: '#' },
            { label: 'Current Page' }
        ];
        
        try {
            // Basic
            new XWUIBreadcrumbs(
                document.getElementById('breadcrumbs-basic'),
                { items: basicItems },
                {}
            );
            
            // With icons
            const homeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
            new XWUIBreadcrumbs(
                document.getElementById('breadcrumbs-icons'),
                {
                    items: [
                        { label: 'Home', href: '#', icon: homeIcon },
                        { label: 'Documents', href: '#' },
                        { label: 'Projects', href: '#' },
                        { label: 'Current' }
                    ]
                },
                {}
            );
            
            // Collapsed
            new XWUIBreadcrumbs(
                document.getElementById('breadcrumbs-collapsed'),
                {
                    items: [
                        { label: 'Home', href: '#' },
                        { label: 'Level 1', href: '#' },
                        { label: 'Level 2', href: '#' },
                        { label: 'Level 3', href: '#' },
                        { label: 'Level 4', href: '#' },
                        { label: 'Current Page' }
                    ]
                },
                { collapseAt: 4 }
            );
            
            // Sizes
            new XWUIBreadcrumbs(
                document.getElementById('breadcrumbs-small'),
                { items: basicItems },
                { size: 'small' }
            );
            
            new XWUIBreadcrumbs(
                document.getElementById('breadcrumbs-medium'),
                { items: basicItems },
                { size: 'medium' }
            );
            
            new XWUIBreadcrumbs(
                document.getElementById('breadcrumbs-large'),
                { items: basicItems },
                { size: 'large' }
            );
            
            // Custom separator
            new XWUIBreadcrumbs(
                document.getElementById('breadcrumbs-separator'),
                { items: basicItems },
                { separator: '>' }
            );
            
            tester.setStatus('✅ XWUIBreadcrumbs initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIBreadcrumbs test error:', error);
        }
