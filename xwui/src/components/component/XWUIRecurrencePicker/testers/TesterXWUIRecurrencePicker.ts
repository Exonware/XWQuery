import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIRecurrencePicker/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIRecurrencePicker } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIRecurrencePicker Component Tester',
            desc: 'Configure recurring task patterns.',
            componentName: 'XWUIRecurrencePicker'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuirecurrence-picker-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const picker = new XWUIRecurrencePicker(
            document.getElementById('recurrence-picker-1'),
            {
                startDate: new Date(),
                pattern: {
                    type: 'weekly',
                    interval: 1,
                    daysOfWeek: [1, 3, 5]
                }
            },
            { showPreview: true }
        );
        
        tester.data.componentInstance = picker;
        tester.data.componentConfig = picker.config;
        tester.data.componentData = picker.data;
        tester.setStatus('Component loaded successfully', 'success');
