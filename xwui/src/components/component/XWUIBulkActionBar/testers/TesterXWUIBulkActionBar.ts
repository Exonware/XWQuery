import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBulkActionBar/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBulkActionBar } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBulkActionBar Component Tester',
            desc: 'Toolbar that appears when multiple items are selected for bulk operations.',
            componentName: 'XWUIBulkActionBar'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuibulk-action-bar-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const bar1 = new XWUIBulkActionBar(
            document.getElementById('bulk-bar-1'),
            { selectedCount: 5, visible: true },
            {
                position: 'inline',
                showCount: true,
                actions: [
                    { label: 'Delete', onClick: () => alert('Delete clicked'), variant: 'danger' },
                    { label: 'Archive', onClick: () => alert('Archive clicked') },
                    { label: 'Move', onClick: () => alert('Move clicked') }
                ]
            }
        );
        
        const bar2 = new XWUIBulkActionBar(
            document.getElementById('bulk-bar-2'),
            { selectedCount: 3, visible: true },
            { position: 'fixed-bottom', showCount: true }
        );
        
        tester.data.componentInstance = bar1;
        tester.data.componentConfig = bar1.config;
        tester.data.componentData = bar1.data;
        tester.setStatus('Component loaded successfully', 'success');
