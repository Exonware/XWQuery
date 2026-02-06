import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIVideoEditor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIVideoEditor } from '../index.ts';
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIVideoEditor Component Tester',
            desc: 'This page tests the XWUIVideoEditor component.',
            componentName: 'XWUIVideoEditor'
        }, {});
        const testArea = tester.getTestArea();
        testArea.innerHTML = '<div id="editor-container" style="width: 100%; min-height: 400px;"></div>';
        try {
            const container = document.getElementById('editor-container');
            const editor = new XWUIVideoEditor(container, {}, {});
            tester.data.componentInstance = editor;
            tester.data.componentConfig = editor.config;
            tester.data.componentData = editor.data;
            tester.setStatus('✅ XWUIVideoEditor component initialized successfully', 'success');
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
        }
