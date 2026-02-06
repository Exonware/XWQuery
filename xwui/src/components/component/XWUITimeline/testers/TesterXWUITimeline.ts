import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITimeline/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITimeline } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITimeline Component Tester',
            desc: 'Timeline component for displaying chronological events.',
            componentName: 'XWUITimeline'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitimeline-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic timeline
            new XWUITimeline(document.getElementById('timeline-1'), {
                items: [
                    { title: 'Event 1', description: 'First event description', date: '2024-01-01' },
                    { title: 'Event 2', description: 'Second event description', date: '2024-02-01' },
                    { title: 'Event 3', description: 'Third event description', date: '2024-03-01' }
                ]
            }, {});
            
            tester.setStatus('✅ XWUITimeline initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITimeline test error:', error);
        }
