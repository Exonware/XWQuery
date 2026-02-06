import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMilestoneMarker/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMilestoneMarker } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMilestoneMarker Component Tester',
            desc: 'Visual milestone indicators in timeline and project views.',
            componentName: 'XWUIMilestoneMarker'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuimilestone-marker-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const marker1 = new XWUIMilestoneMarker(
            document.getElementById('milestone-1'),
            { label: 'Sprint Start', date: new Date(), progress: 0, completed: false }
        );
        
        const marker2 = new XWUIMilestoneMarker(
            document.getElementById('milestone-2'),
            { label: 'Release v1.0', date: new Date(), progress: 100, completed: true }
        );
        
        const marker3 = new XWUIMilestoneMarker(
            document.getElementById('milestone-3'),
            { label: 'Feature Complete', date: new Date(), progress: 65, completed: false },
            { showProgress: true }
        );
        
        tester.data.componentInstance = marker1;
        tester.data.componentConfig = marker1.config;
        tester.data.componentData = marker1.data;
        tester.setStatus('Component loaded successfully', 'success');
