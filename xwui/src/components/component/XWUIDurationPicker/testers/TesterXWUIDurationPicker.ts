import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDurationPicker/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIDurationPicker } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDurationPicker Component Tester',
            desc: 'Duration picker for hours and minutes input with preset options.',
            componentName: 'XWUIDurationPicker'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiduration-picker-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Create component instances
        const picker1 = new XWUIDurationPicker(
            document.getElementById('duration-picker-basic'),
            { hours: 0, minutes: 0 },
            { showPresets: false }
        );
        
        const picker2 = new XWUIDurationPicker(
            document.getElementById('duration-picker-presets'),
            { hours: 0, minutes: 0 },
            {
                showPresets,
                presets: [
                    { label: '15 min', hours: 0, minutes: 15 },
                    { label: '30 min', hours: 0, minutes: 30 },
                    { label: '1 hour', hours: 1, minutes: 0 },
                    { label: '2 hours', hours: 2, minutes: 0 }
                ]
            }
        );
        
        const picker3 = new XWUIDurationPicker(
            document.getElementById('duration-picker-initial'),
            { hours: 2, minutes: 30 },
            { showPresets: true }
        );
        
        // Update tester data
        tester.data.componentInstance = picker1;
        tester.data.componentConfig = picker1.config;
        tester.data.componentData = picker1.data;
        
        tester.setStatus('Component loaded successfully', 'success');
