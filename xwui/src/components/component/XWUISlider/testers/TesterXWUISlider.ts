import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISlider/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISlider } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISlider Component Tester - Comprehensive',
            desc: 'Production-quality slider with all MUI-like features, and more.',
            componentName: 'XWUISlider'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add comprehensive test content
        const template = document.getElementById('tester-xwuislider-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Brightness icons
            const moonIcon = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
            `;
            const sunIcon = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
            const volumeLowIcon = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            `;
            const volumeHighIcon = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            `;
            
            // Basic slider
            const basic = new XWUISlider(
                document.getElementById('slider-basic'),
                { value: 50, label: 'Basic Slider' },
                { min: 0, max: 100 }
            );
            basic.onChange((value) => {
                tester.setStatus(`✅ Basic slider: ${Array.isArray(value) ? value.join(' - ') : value}`, 'success');
            });
            tester.registerChildComponent(basic);
            
            // Value label display options
            new XWUISlider(document.getElementById('slider-label-on'), { value: 60, label: 'Value Always On' }, { 
                min: 0, max: 100, valueLabelDisplay: 'on' 
            });
            
            new XWUISlider(document.getElementById('slider-label-auto'), { value: 60, label: 'Value Auto' }, { 
                min: 0, max: 100, valueLabelDisplay: 'auto' 
            });
            
            new XWUISlider(document.getElementById('slider-label-off'), { value: 60, label: 'Value Off' }, { 
                min: 0, max: 100, valueLabelDisplay: 'off' 
            });
            
            // Icons
            new XWUISlider(document.getElementById('slider-icons'), { value: 60, label: 'Volume' }, {
                min: 0, max: 100,
                startIcon,
                endIcon,
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-brightness'), { value: 75, label: 'Brightness' }, {
                min: 0, max: 100,
                startIcon,
                endIcon,
                valueLabelDisplay: 'auto'
            });
            
            // Thumb customization
            new XWUISlider(document.getElementById('slider-emoji'), { value: 50, label: 'Emoji Thumb' }, {
                min: 0, max: 100,
                thumbContent: '🔥',
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-star'), { value: 50, label: 'Star Shape' }, {
                min: 0, max: 100,
                thumbContent: { shape: 'star' },
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-custom'), { value: 50, label: 'Custom Thumbs' }, {
                min: 0, max: 100,
                thumbContent: '⭐',
                valueLabelDisplay: 'auto'
            });
            
            // Range slider
            const rangeSlider = new XWUISlider(document.getElementById('slider-range'), { 
                value: [20, 80], label: 'Price Range ($)' 
            }, {
                min: 0, max: 100,
                valueLabelDisplay: 'auto'
            });
            rangeSlider.onChange((value) => {
                tester.setStatus(`✅ Range: ${value[0]} - ${value[1]}`, 'success');
            });
            
            new XWUISlider(document.getElementById('slider-range-min'), { 
                value: [30, 70], label: 'Range with Min Distance' 
            }, {
                min: 0, max: 100,
                minDistance: 20,
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-range-thumbs'), { 
                value: [25, 75], label: 'Range with Custom Thumbs' 
            }, {
                min: 0, max: 100,
                thumbContent: ['🌙', '☀️'],
                valueLabelDisplay: 'auto'
            });
            
            // Marks
            new XWUISlider(document.getElementById('slider-marks'), { value: 50, label: 'Temperature (°C)' }, {
                min: 0, max: 100,
                marks: [
                    { value: 0, label: '0°' },
                    { value: 25, label: '25°' },
                    { value: 50, label: '50°' },
                    { value: 75, label: '75°' },
                    { value: 100, label: '100°' }
                ],
                markLabelDisplay: 'on',
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-marks-auto'), { value: 50, label: 'Auto Marks' }, {
                min: 0, max: 100,
                step: 10,
                marks, // Auto-generate from step
                valueLabelDisplay: 'auto'
            });
            
            // Track options
            new XWUISlider(document.getElementById('slider-track-normal'), { value: 60, label: 'Normal Track' }, {
                min: 0, max: 100,
                track: 'normal',
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-track-inverted'), { value: 60, label: 'Inverted Track' }, {
                min: 0, max: 100,
                track: 'inverted',
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-track-removed'), { value: 60, label: 'No Track' }, {
                min: 0, max: 100,
                track,
                valueLabelDisplay: 'auto'
            });
            
            // Steppers
            new XWUISlider(document.getElementById('slider-steppers'), { value: 50, label: 'With Steppers' }, {
                min: 0, max: 100,
                step: 5,
                showSteppers,
                valueLabelDisplay: 'auto'
            });
            
            // Vertical sliders
            new XWUISlider(document.getElementById('slider-vertical-1'), { value: 50, label: 'Vertical 1' }, {
                min: 0, max: 100,
                orientation: 'vertical',
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-vertical-2'), { value: [25, 75], label: 'Vertical Range' }, {
                min: 0, max: 100,
                orientation: 'vertical',
                valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-vertical-icons'), { value: 60, label: 'Vertical with Icons' }, {
                min: 0, max: 100,
                orientation: 'vertical',
                startIcon,
                endIcon,
                valueLabelDisplay: 'auto'
            });
            
            // Color variants
            new XWUISlider(document.getElementById('slider-primary'), { value: 60, label: 'Primary' }, {
                color: 'primary', valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-secondary'), { value: 60, label: 'Secondary' }, {
                color: 'secondary', valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-success'), { value: 60, label: 'Success' }, {
                color: 'success', valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-warning'), { value: 60, label: 'Warning' }, {
                color: 'warning', valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-error'), { value: 60, label: 'Error' }, {
                color: 'error', valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-info'), { value: 60, label: 'Info' }, {
                color: 'info', valueLabelDisplay: 'auto'
            });
            
            // Sizes
            new XWUISlider(document.getElementById('slider-small'), { value: 50, label: 'Small' }, {
                size: 'small', valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-medium'), { value: 50, label: 'Medium' }, {
                size: 'medium', valueLabelDisplay: 'auto'
            });
            
            new XWUISlider(document.getElementById('slider-large'), { value: 50, label: 'Large' }, {
                size: 'large', valueLabelDisplay: 'auto'
            });
            
            // Linked sliders
            const masterSlider = new XWUISlider(document.getElementById('slider-linked-master'), { 
                value: 50, label: 'Master' 
            }, {
                min: 0, max: 100,
                valueLabelDisplay: 'auto'
            });
            
            const slaveSlider = new XWUISlider(document.getElementById('slider-linked-slave'), { 
                value: 25, label: 'Slave' 
            }, {
                min: 0, max: 100,
                linkedSliders: [{ slider, ratio: 0.5 }],
                valueLabelDisplay: 'auto'
            });
            
            masterSlider.onChange(() => {
                // Linked slider updates automatically
            });
            
            // Disabled
            new XWUISlider(document.getElementById('slider-disabled'), { value: 50, label: 'Disabled' }, {
                disabled: true, valueLabelDisplay: 'auto'
            });
            
            // Interactive demo
            const interactiveSlider = new XWUISlider(document.getElementById('slider-interactive'), { 
                value: 50, label: 'Interactive Demo' 
            }, {
                min: 0, max: 100,
                step: 5,
                showSteppers,
                startIcon,
                endIcon,
                valueLabelDisplay: 'auto',
                marks: [
                    { value: 0, label: '0' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' }
                ]
            });
            
            interactiveSlider.onChange((value) => {
                document.getElementById('interactive-value').textContent = 
                    `Current value: ${Array.isArray(value) ? value.join(' - ') : value}`;
            });
            
            // Global functions for interactive controls
            window.setSliderValue = (val) => {
                interactiveSlider.setValue(val, true);
            };
            
            window.toggleDisabled = () => {
                const isDisabled = interactiveSlider.config.disabled;
                interactiveSlider.setDisabled(!isDisabled);
            };
            
            tester.setStatus('✅ All XWUISlider features initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISlider test error:', error);
        }
