import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITaskTemplateSelector/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITaskTemplateSelector } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITaskTemplateSelector Component Tester',
            desc: 'Select and apply task/project templates.',
            componentName: 'XWUITaskTemplateSelector'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuitask-template-selector-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const selector = new XWUITaskTemplateSelector(
            document.getElementById('template-selector-1'),
            {
                templates: [
                    { id: '1', name: 'Bug Report', category: 'Development', description: 'Standard bug report template' },
                    { id: '2', name: 'Feature Request', category: 'Development', description: 'Feature request template' },
                    { id: '3', name: 'Meeting Notes', category: 'Communication', description: 'Meeting notes template' }
                ],
                categories: ['Development', 'Communication']
            },
            { showSearch: true, showCategories: true }
        );
        
        tester.data.componentInstance = selector;
        tester.data.componentConfig = selector.config;
        tester.data.componentData = selector.data;
        tester.setStatus('Component loaded successfully', 'success');
