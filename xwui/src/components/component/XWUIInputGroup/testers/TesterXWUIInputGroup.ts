import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputGroup/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInputGroup } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputGroup Component Tester',
            desc: 'Input group component for combining inputs with addons.',
            componentName: 'XWUIInputGroup'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiinput-group-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic input group
            new XWUIInputGroup(document.getElementById('input-group-1'), {
                leftAddon: '$',
                input: '<input type="text" placeholder="Amount">',
                rightAddon: '.00'
            }, {});
            
            // Input group with button
            new XWUIInputGroup(document.getElementById('input-group-2'), {
                input: '<input type="text" placeholder="Search">',
                rightAddon: '<button>Search</button>'
            }, {});
            
            tester.setStatus('✅ XWUIInputGroup initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInputGroup test error:', error);
        }
