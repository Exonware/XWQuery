import { XWUIInputDateRange } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputDateRange/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Minimized view (popup)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const inputDateRange1 = new XWUIInputDateRange(
            document.getElementById('input-date-range-1'),
            {
                value: [today, nextWeek]
            },
            {
                view: 'minimized',
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                placeholder: 'Select date range'
            }
        );
        
        // Full view (inline)
        const inputDateRange2 = new XWUIInputDateRange(
            document.getElementById('input-date-range-2'),
            {},
            {
                view: 'full',
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                placeholder: 'Select date range'
            }
        );
        
        // With custom separator
        const inputDateRange3 = new XWUIInputDateRange(
            document.getElementById('input-date-range-3'),
            {},
            {
                view: 'minimized',
                format: 'YYYY-MM-DD',
                separator: ' to ',
                placeholder: 'Select date range'
            }
        );
