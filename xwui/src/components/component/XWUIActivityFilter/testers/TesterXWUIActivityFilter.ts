import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIActivityFilter/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIActivityFilter } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIActivityFilter Component Tester',
            desc: 'Filter and search activity stream.',
            componentName: 'XWUIActivityFilter'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiactivity-filter-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const filter = new XWUIActivityFilter(
            document.getElementById('activity-filter-1'),
            {
                contributors: [],
                messages: [
                    { id: '1', content: 'Task created', timestamp: new Date(), userId: '1' },
                    { id: '2', content: 'Status updated', timestamp: new Date(), userId: '2' }
                ]
            },
            { showSearch: true, showFilters: true }
        );
        
        tester.data.componentInstance = filter;
        tester.data.componentConfig = filter.config;
        tester.data.componentData = filter.data;
        tester.setStatus('Component loaded successfully', 'success');
