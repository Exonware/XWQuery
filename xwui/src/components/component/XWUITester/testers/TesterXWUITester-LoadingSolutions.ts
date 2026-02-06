
        import { XWUITester } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        import { XWUIButton } from '../../XWUIButton/index.ts';
        
        // Set CSS base path for automatic CSS loading
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITester - Loading Solutions Comparison',
            desc: 'Compare all 4 loading solutions side by side. Each solution prevents FOUC (Flash of Unstyled Content) differently.',
            componentName: 'XWUITester',
            componentInstance,
            componentConfig: {},
            componentData: {}
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add comparison content
        const template = document.getElementById('tester-xwuitester-loading-solutions-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        tester.setStatus('✅ Loading solutions comparison page loaded. Click buttons above to test each solution.', 'success');
