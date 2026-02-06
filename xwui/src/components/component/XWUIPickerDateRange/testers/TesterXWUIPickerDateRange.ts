import { XWUIPickerDateRange } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPickerDateRange/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        const pickerContainer = document.getElementById('picker-container');
        const triggerBtn = document.getElementById('trigger-btn');
        const result = document.getElementById('result');
        
        let picker = null;
        
        // Create picker instance
        picker = new XWUIPickerDateRange(
            pickerContainer,
            {},
            {
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                placement: 'bottom-start'
            }
        );
        
        // Handle date range selection
        picker.onChange((range) => {
            const start = range[0].toLocaleDateString();
            const end = range[1].toLocaleDateString();
            result.textContent = `Selected range: ${start} ~ ${end}`;
        });
        
        // Open picker when button is clicked
        triggerBtn.addEventListener('click', () => {
            picker?.open(triggerBtn);
        });
