import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPagination/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIPagination } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIPagination Component Tester',
            desc: 'Page navigation component with various options.',
            componentName: 'XWUIPagination'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuipagination-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basic = new XWUIPagination(
                document.getElementById('pagination-basic'),
                { current: 1, total: 100, pageSize: 10 },
                {}
            );
            basic.onChange((page, pageSize) => {
                tester.setStatus(`✅ Page changed to ${page}, size: ${pageSize}`, 'success');
            });
            
            // With total
            new XWUIPagination(
                document.getElementById('pagination-total'),
                { current: 5, total: 100, pageSize: 10 },
                { showTotal: true }
            );
            
            // With size changer
            new XWUIPagination(
                document.getElementById('pagination-size'),
                { current: 1, total: 100, pageSize: 10 },
                { showSizeChanger: true }
            );
            
            // With quick jumper
            new XWUIPagination(
                document.getElementById('pagination-jumper'),
                { current: 1, total: 100, pageSize: 10 },
                { showQuickJumper: true }
            );
            
            // Full featured
            new XWUIPagination(
                document.getElementById('pagination-full'),
                { current: 1, total: 100, pageSize: 10 },
                { showTotal, showSizeChanger, showQuickJumper: true }
            );
            
            // Simple mode
            new XWUIPagination(
                document.getElementById('pagination-simple'),
                { current: 1, total: 50, pageSize: 10 },
                { simple: true }
            );
            
            // Sizes
            new XWUIPagination(
                document.getElementById('pagination-small'),
                { current: 1, total: 50, pageSize: 10 },
                { size: 'small' }
            );
            
            new XWUIPagination(
                document.getElementById('pagination-medium'),
                { current: 1, total: 50, pageSize: 10 },
                { size: 'medium' }
            );
            
            new XWUIPagination(
                document.getElementById('pagination-large'),
                { current: 1, total: 50, pageSize: 10 },
                { size: 'large' }
            );
            
            tester.setStatus('✅ XWUIPagination initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIPagination test error:', error);
        }
