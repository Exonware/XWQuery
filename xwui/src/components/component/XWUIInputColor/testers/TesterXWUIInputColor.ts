import { XWUIInputColor } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputColor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        const colorPreview = document.getElementById('color-preview');
        
        // Minimized view with presets
        const inputColor1 = new XWUIInputColor(
            document.getElementById('input-color-1'),
            {
                value: '#007bff'
            },
            {
                view: 'minimized',
                format: 'hex',
                presets: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'],
                placeholder: '#000000'
            }
        );
        
        inputColor1.getPicker()?.onChange((color) => {
            if (colorPreview) {
                colorPreview.style.backgroundColor = color;
            }
        });
        
        // Full view (inline)
        const inputColor2 = new XWUIInputColor(
            document.getElementById('input-color-2'),
            {
                value: '#28a745'
            },
            {
                view: 'full',
                format: 'hex',
                placeholder: '#000000'
            }
        );
        
        // Editable input
        const inputColor3 = new XWUIInputColor(
            document.getElementById('input-color-3'),
            {
                value: '#dc3545'
            },
            {
                view: 'minimized',
                format: 'hex',
                readonly,
                placeholder: 'Enter hex color or use picker'
            }
        );
        
        // Update preview on all changes
        [inputColor1, inputColor2, inputColor3].forEach(input => {
            input.getPicker()?.onChange((color) => {
                if (colorPreview) {
                    colorPreview.style.backgroundColor = color;
                }
            });
        });
