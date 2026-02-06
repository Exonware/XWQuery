import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDependencyVisualizer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIDependencyVisualizer } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDependencyVisualizer Component Tester',
            desc: 'Visualize task dependencies, blocking relationships, and predecessor/successor links.',
            componentName: 'XWUIDependencyVisualizer'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuidependency-visualizer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const viz = new XWUIDependencyVisualizer(
            document.getElementById('dependency-viz-1'),
            {
                tasks: [
                    { id: '1', label: 'Task 1', status: 'completed' },
                    { id: '2', label: 'Task 2', status: 'in-progress' },
                    { id: '3', label: 'Task 3', status: 'pending' }
                ],
                dependencies: [
                    { from: '1', to: '2', type: 'precedes' },
                    { from: '2', to: '3', type: 'blocks' }
                ]
            },
            { layout: 'hierarchical', showControls: true }
        );
        
        tester.data.componentInstance = viz;
        tester.data.componentConfig = viz.config;
        tester.data.componentData = viz.data;
        tester.setStatus('Component loaded successfully', 'success');
