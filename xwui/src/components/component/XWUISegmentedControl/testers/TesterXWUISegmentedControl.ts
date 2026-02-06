import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISegmentedControl/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISegmentedControl } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISegmentedControl Component Tester',
            desc: 'Segmented button control for single selection.',
            componentName: 'XWUISegmentedControl'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuisegmented-control-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const segmented1 = new XWUISegmentedControl(document.getElementById('segmented-1'), {
                value: 'option1',
                options: [
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                    { label: 'Option 3', value: 'option3' }
                ]
            });
            
            const segmented2 = new XWUISegmentedControl(document.getElementById('segmented-2'), {
                value: 'list',
                options: [
                    { label: 'List', value: 'list', icon: '☰' },
                    { label: 'Grid', value: 'grid', icon: '⊞' },
                    { label: 'Map', value: 'map', icon: '🗺' }
                ]
            });
            
            tester.setStatus('✅ XWUISegmentedControl initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISegmentedControl test error:', error);
        }
