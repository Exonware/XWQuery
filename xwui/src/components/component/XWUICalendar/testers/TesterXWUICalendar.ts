import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICalendar/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUICalendar } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICalendar Component Tester',
            desc: 'Calendar component for date selection.',
            componentName: 'XWUICalendar'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicalendar-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic calendar
            new XWUICalendar(document.getElementById('calendar-1'), {}, {});
            
            // Calendar with initial date
            const today = new Date();
            new XWUICalendar(document.getElementById('calendar-2'), { 
                value: today 
            }, {});
            
            tester.setStatus('✅ XWUICalendar initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICalendar test error:', error);
        }
