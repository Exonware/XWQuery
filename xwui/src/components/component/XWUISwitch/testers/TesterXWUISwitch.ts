
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUISwitch } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISwitch/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISwitch Component Tester',
            desc: 'Toggle switch component with various configurations.',
            componentName: 'XWUISwitch'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiswitch-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const switch1 = new XWUISwitch(document.getElementById('switch-1'), { label: 'Switch 1' }, {});
            const switch2 = new XWUISwitch(document.getElementById('switch-2'), { label: 'Switch 2', checked: true }, {});
            
            switch1.onChange((checked) => {
                tester.setStatus(`✅ Switch 1: ${checked ? 'on' : 'off'}`, 'success');
            });
            
            // Sizes
            new XWUISwitch(document.getElementById('switch-small'), { label: 'Small' }, { size: 'small' });
            new XWUISwitch(document.getElementById('switch-medium'), { label: 'Medium (default)' }, { size: 'medium' });
            new XWUISwitch(document.getElementById('switch-large'), { label: 'Large' }, { size: 'large' });
            
            // Colors
            new XWUISwitch(document.getElementById('switch-primary'), { label: 'Primary', checked: true }, { color: 'primary' });
            new XWUISwitch(document.getElementById('switch-success'), { label: 'Success', checked: true }, { color: 'success' });
            new XWUISwitch(document.getElementById('switch-warning'), { label: 'Warning', checked: true }, { color: 'warning' });
            new XWUISwitch(document.getElementById('switch-error'), { label: 'Error', checked: true }, { color: 'error' });
            
            // Label placement
            new XWUISwitch(document.getElementById('switch-label-start'), { label: 'Label on Start' }, { labelPlacement: 'start' });
            new XWUISwitch(document.getElementById('switch-label-end'), { label: 'Label on End' }, { labelPlacement: 'end' });
            
            // With description
            new XWUISwitch(document.getElementById('switch-desc'), {
                label: 'Enable Notifications',
                description: 'Receive email notifications about updates'
            }, { checked: true });
            
            // Disabled
            new XWUISwitch(document.getElementById('switch-disabled-off'), { label: 'Disabled (off)' }, { disabled: true });
            new XWUISwitch(document.getElementById('switch-disabled-on'), { label: 'Disabled (on)', checked: true }, { disabled: true });
            
            // Custom Content: Text (O | I example)
            new XWUISwitch(document.getElementById('switch-custom-text-1'), { label: 'Text: O | I' }, {
                showThumb: true,
                uncheckedContent: 'O',
                checkedContent: 'I'
            });
            new XWUISwitch(document.getElementById('switch-custom-text-2'), { label: 'Text: OFF | ON' }, {
                showThumb: true,
                uncheckedContent: 'OFF',
                checkedContent: 'ON'
            });
            new XWUISwitch(document.getElementById('switch-custom-text-3'), { label: 'Text: NO | YES', checked: true }, {
                showThumb: true,
                uncheckedContent: 'NO',
                checkedContent: 'YES'
            });
            
            // Custom Content: Emojis
            new XWUISwitch(document.getElementById('switch-custom-emoji-1'), { label: 'Emoji: 😴 | 🌞' }, {
                showThumb: true,
                uncheckedContent: '😴',
                checkedContent: '🌞'
            });
            new XWUISwitch(document.getElementById('switch-custom-emoji-2'), { label: 'Emoji: ❌ | ✅' }, {
                showThumb: true,
                uncheckedContent: '❌',
                checkedContent: '✅'
            });
            new XWUISwitch(document.getElementById('switch-custom-emoji-3'), { label: 'Emoji: 🔒 | 🔓', checked: true }, {
                showThumb: true,
                uncheckedContent: '🔒',
                checkedContent: '🔓'
            });
            
            // Custom Colors per State
            new XWUISwitch(document.getElementById('switch-custom-color-1'), { label: 'Custom Colors: Gray → Blue', checked: true }, {
                uncheckedColor: '#6c757d',
                checkedColor: '#0d6efd',
                uncheckedTrackColor: '#e9ecef',
                checkedTrackColor: '#cfe2ff'
            });
            new XWUISwitch(document.getElementById('switch-custom-color-2'), { label: 'Custom Colors: Red → Green', checked: true }, {
                uncheckedColor: '#dc3545',
                checkedColor: '#198754',
                uncheckedTrackColor: '#f8d7da',
                checkedTrackColor: '#d1e7dd'
            });
            new XWUISwitch(document.getElementById('switch-custom-color-3'), { label: 'Custom Colors: Orange → Purple' }, {
                uncheckedColor: '#fd7e14',
                checkedColor: '#6f42c1',
                uncheckedTrackColor: '#fff3cd',
                checkedTrackColor: '#e7d6ff'
            });
            
            // Custom Content + Custom Colors
            new XWUISwitch(document.getElementById('switch-custom-combo-1'), { label: 'Combo: O | I with colors', checked: true }, {
                showThumb: true,
                uncheckedContent: 'O',
                checkedContent: 'I',
                uncheckedColor: '#6c757d',
                checkedColor: '#0d6efd',
                uncheckedTrackColor: '#e9ecef',
                checkedTrackColor: '#cfe2ff'
            });
            new XWUISwitch(document.getElementById('switch-custom-combo-2'), { label: 'Combo: ❌ | ✅ with colors' }, {
                showThumb: true,
                uncheckedContent: '❌',
                checkedContent: '✅',
                uncheckedColor: '#dc3545',
                checkedColor: '#198754',
                uncheckedTrackColor: '#f8d7da',
                checkedTrackColor: '#d1e7dd'
            });
            new XWUISwitch(document.getElementById('switch-custom-combo-3'), { label: 'Combo: OFF | ON with purple', checked: true }, {
                showThumb: true,
                uncheckedContent: 'OFF',
                checkedContent: 'ON',
                uncheckedColor: '#ffffff',
                checkedColor: '#ffffff',
                uncheckedTrackColor: '#adb5bd',
                checkedTrackColor: '#6f42c1'
            });
            
            // Multi-State: Magic Elements (7 options)
            const magicSwitch = new XWUISwitch(document.getElementById('switch-magic-elements'), {
                label: 'Magic Element',
                selectedValue: 'light'
            }, {
                mode: 'multi',
                size: 'medium',
                options: [
                    {
                        value: 'light',
                        icon: 'sun',
                        tooltip: 'Light Magic - Pure and radiant energy',
                        color: '#fbbf24',
                        trackColor: '#fef3c7'
                    },
                    {
                        value: 'dark',
                        icon: 'moon',
                        tooltip: 'Dark Magic - Mysterious shadow power',
                        color: '#6366f1',
                        trackColor: '#e0e7ff'
                    },
                    {
                        value: 'wind',
                        icon: 'wind',
                        tooltip: 'Wind Magic - Swift air currents',
                        color: '#a5b4fc',
                        trackColor: '#e0e7ff'
                    },
                    {
                        value: 'fire',
                        icon: 'flame',
                        tooltip: 'Fire Magic - Burning intensity',
                        color: '#ef4444',
                        trackColor: '#fee2e2'
                    },
                    {
                        value: 'water',
                        icon: 'droplet',
                        tooltip: 'Water Magic - Flowing adaptability',
                        color: '#3b82f6',
                        trackColor: '#dbeafe'
                    },
                    {
                        value: 'lightning',
                        icon: 'zap',
                        tooltip: 'Lightning Magic - Electric power and speed',
                        color: '#fbbf24',
                        trackColor: '#fef3c7'
                    },
                    {
                        value: 'earth',
                        icon: 'mountain',
                        tooltip: 'Earth Magic - Grounded strength',
                        color: '#84cc16',
                        trackColor: '#ecfccb'
                    }
                ]
            });
            
            magicSwitch.onMultiChange((selectedValue) => {
                tester.setStatus(`✅ Magic Element changed to: ${selectedValue}`, 'success');
            });
            
            tester.setStatus('✅ XWUISwitch initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISwitch test error:', error);
        }
