import { XWUIPickerDate } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPickerDate/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        const pickerContainer = document.getElementById('picker-container');
        const triggerBtn = document.getElementById('trigger-btn');
        const result = document.getElementById('result');
        
        let picker = null;
        
        // Create picker instance
        picker = new XWUIPickerDate(
            pickerContainer,
            {
                value: new Date()
            },
            {
                format: 'YYYY-MM-DD',
                placement: 'bottom-start'
            }
        );
        
        // Handle date selection
        picker.onChange((date) => {
            result.textContent = `Selected date: ${date.toLocaleDateString()}`;
        });
        
        // Open picker when button is clicked
        triggerBtn.addEventListener('click', () => {
            picker?.open(triggerBtn);
        });
