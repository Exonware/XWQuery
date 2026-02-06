import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIVideoRecorder/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIVideoRecorder } from '../index.ts';
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIVideoRecorder Component Tester',
            desc: 'This page tests the XWUIVideoRecorder component.',
            componentName: 'XWUIVideoRecorder'
        }, {});
        const testArea = tester.getTestArea();
        testArea.innerHTML = '<div id="recorder-container" style="width: 100%; min-height: 400px;"></div>';
        try {
            const container = document.getElementById('recorder-container');
            const recorder = new XWUIVideoRecorder(container, {}, {});
            tester.data.componentInstance = recorder;
            tester.data.componentConfig = recorder.config;
            tester.data.componentData = recorder.data;
            tester.setStatus('✅ XWUIVideoRecorder component initialized successfully', 'success');
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
        }
