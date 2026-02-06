import { XWUIInputDate } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputDate/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Minimized view (popup)
        const inputDate1 = new XWUIInputDate(
            document.getElementById('input-date-1'),
            {
                value: new Date()
            },
            {
                view: 'minimized',
                format: 'YYYY-MM-DD',
                placeholder: 'Select a date'
            }
        );
        
        // Full view (inline)
        const inputDate2 = new XWUIInputDate(
            document.getElementById('input-date-2'),
            {},
            {
                view: 'full',
                format: 'YYYY-MM-DD',
                placeholder: 'Select a date'
            }
        );
        
        // With min/max dates
        const today = new Date();
        const minDate = new Date(today);
        minDate.setMonth(today.getMonth() - 1);
        const maxDate = new Date(today);
        maxDate.setMonth(today.getMonth() + 1);
        
        const inputDate3 = new XWUIInputDate(
            document.getElementById('input-date-3'),
            {
                minDate,
                maxDate: maxDate
            },
            {
                view: 'minimized',
                format: 'YYYY-MM-DD',
                placeholder: 'Select date (within range)'
            }
        );
