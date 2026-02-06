
        import { XWUITester } from '../../XWUITester/index.ts';
        
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIComponent/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIComponent Base Tester',
            desc: 'Base component class - this is an abstract class used by all XWUI components.',
            componentName: 'XWUIComponent'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicomponent-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        tester.setStatus('✅ XWUIComponent is the base class - test individual components instead', 'info');
