import { XWUIPickerColor } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPickerColor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        const pickerContainer = document.getElementById('picker-container');
        const triggerBtn = document.getElementById('trigger-btn');
        const result = document.getElementById('result');
        const colorPreview = document.getElementById('color-preview');
        
        let picker = null;
        
        // Create picker instance
        picker = new XWUIPickerColor(
            pickerContainer,
            {
                value: '#007bff'
            },
            {
                format: 'hex',
                presets: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'],
                placement: 'bottom-start'
            }
        );
        
        // Handle color selection
        picker.onChange((color) => {
            result.textContent = `Selected color: ${color}`;
            if (colorPreview) {
                colorPreview.style.backgroundColor = color;
            }
        });
        
        // Open picker when button is clicked
        triggerBtn.addEventListener('click', () => {
            picker?.open(triggerBtn);
        });
