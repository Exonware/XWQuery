import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITimeTracker/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUITimeTracker } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITimeTracker Component Tester',
            desc: 'Start/stop timer with time logging and manual entry.',
            componentName: 'XWUITimeTracker'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuitime-tracker-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const tracker1 = new XWUITimeTracker(
            document.getElementById('time-tracker-1'),
            { taskName: 'Feature Development', isRunning: false },
            { allowManualEntry: true }
        );
        
        const tracker2 = new XWUITimeTracker(
            document.getElementById('time-tracker-2'),
            { taskName: 'Code Review', isRunning: false },
            { showProgress, allowManualEntry: true }
        );
        
        tester.data.componentInstance = tracker1;
        tester.data.componentConfig = tracker1.config;
        tester.data.componentData = tracker1.data;
        tester.setStatus('Component loaded successfully', 'success');
