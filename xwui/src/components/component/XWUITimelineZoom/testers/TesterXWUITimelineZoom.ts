import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITimelineZoom/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITimelineZoom } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITimelineZoom Component Tester',
            desc: 'Zoom controls for timeline views.',
            componentName: 'XWUITimelineZoom'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuitimeline-zoom-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const zoom = new XWUITimelineZoom(
            document.getElementById('timeline-zoom-1'),
            { currentDate: new Date(), zoomLevel: 'week' },
            { defaultZoom: 'week', showDateNavigator, showZoomControls: true }
        );
        
        tester.data.componentInstance = zoom;
        tester.data.componentConfig = zoom.config;
        tester.data.componentData = zoom.data;
        tester.setStatus('Component loaded successfully', 'success');
