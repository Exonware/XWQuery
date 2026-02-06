import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBadge/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBadge } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBadge Component Tester',
            desc: 'Count/status badge component.',
            componentName: 'XWUIBadge',
            systemConfig: {},
            userConfig: {}
        }, {});
        
        const testArea = tester.getTestArea();
        const statusEl = tester.getStatusElement();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuibadge-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Variants
            const badge1 = new XWUIBadge(document.getElementById('badge-default'), { count: 5 }, { variant: 'default' });
            new XWUIBadge(document.getElementById('badge-primary'), { count: 5 }, { variant: 'primary' });
            new XWUIBadge(document.getElementById('badge-success'), { count: 5 }, { variant: 'success' });
            new XWUIBadge(document.getElementById('badge-warning'), { count: 5 }, { variant: 'warning' });
            new XWUIBadge(document.getElementById('badge-error'), { count: 5 }, { variant: 'error' });
            
            // Sizes
            new XWUIBadge(document.getElementById('badge-small'), { count: 5 }, { size: 'small' });
            new XWUIBadge(document.getElementById('badge-medium'), { count: 5 }, { size: 'medium' });
            new XWUIBadge(document.getElementById('badge-large'), { count: 5 }, { size: 'large' });
            
            // Count badges
            new XWUIBadge(document.getElementById('badge-count-1'), { count: 1 }, { variant: 'error' });
            new XWUIBadge(document.getElementById('badge-count-2'), { count: 9 }, { variant: 'error' });
            new XWUIBadge(document.getElementById('badge-count-3'), { count: 99 }, { variant: 'error' });
            new XWUIBadge(document.getElementById('badge-count-4'), { count: 150 }, { variant: 'error', max: 99 });
            
            // Dot badges
            new XWUIBadge(document.getElementById('badge-dot-1'), {}, { dot: true, variant: 'error' });
            new XWUIBadge(document.getElementById('badge-dot-2'), {}, { dot: true, variant: 'success', size: 'large' });
            new XWUIBadge(document.getElementById('badge-dot-3'), {}, { dot: true, variant: 'warning', size: 'small' });
            
            // Text badges
            new XWUIBadge(document.getElementById('badge-text-1'), { text: 'New' }, { variant: 'success' });
            new XWUIBadge(document.getElementById('badge-text-2'), { text: 'Hot' }, { variant: 'error' });
            new XWUIBadge(document.getElementById('badge-text-3'), { text: 'Sale' }, { variant: 'warning' });
            
            // Positioned badges
            new XWUIBadge(document.getElementById('badge-positioned-1'), { count: 5 }, { variant: 'error', position: 'top-right', standalone: false });
            new XWUIBadge(document.getElementById('badge-positioned-2'), { count: 3 }, { variant: 'error', position: 'top-right', standalone: false });
            
            // Update tester with component instance for the control buttons
            tester.data.componentInstance = badge1;
            tester.data.componentConfig = { variant: 'default' };
            tester.data.componentData = { count: 5 };
            
            tester.setStatus('✅ XWUIBadge initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIBadge test error:', error);
        }
