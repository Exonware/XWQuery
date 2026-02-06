import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIProgress/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIProgress } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIProgress Component Tester',
            desc: 'Progress bar with linear and circular variants.',
            componentName: 'XWUIProgress'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiprogress-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Linear progress
            new XWUIProgress(document.getElementById('progress-0'), { value: 0, label: '0%' }, {});
            new XWUIProgress(document.getElementById('progress-25'), { value: 25, label: '25%' }, {});
            new XWUIProgress(document.getElementById('progress-50'), { value: 50, label: '50%' }, {});
            new XWUIProgress(document.getElementById('progress-75'), { value: 75, label: '75%' }, {});
            new XWUIProgress(document.getElementById('progress-100'), { value: 100, label: '100%' }, {});
            
            // With value
            new XWUIProgress(document.getElementById('progress-value'), { value: 65, label: 'Progress' }, { showValue: true });
            
            // Indeterminate
            new XWUIProgress(document.getElementById('progress-indeterminate'), { label: 'Loading...' }, { indeterminate: true });
            
            // Circular
            new XWUIProgress(document.getElementById('progress-circular-25'), { value: 25 }, { variant: 'circular', showValue: true });
            new XWUIProgress(document.getElementById('progress-circular-50'), { value: 50 }, { variant: 'circular', showValue: true });
            new XWUIProgress(document.getElementById('progress-circular-75'), { value: 75 }, { variant: 'circular', showValue: true });
            new XWUIProgress(document.getElementById('progress-circular-100'), { value: 100 }, { variant: 'circular', showValue: true });
            
            // Colors
            new XWUIProgress(document.getElementById('progress-primary'), { value: 60, label: 'Primary' }, { color: 'primary' });
            new XWUIProgress(document.getElementById('progress-success'), { value: 60, label: 'Success' }, { color: 'success' });
            new XWUIProgress(document.getElementById('progress-warning'), { value: 60, label: 'Warning' }, { color: 'warning' });
            new XWUIProgress(document.getElementById('progress-error'), { value: 60, label: 'Error' }, { color: 'error' });
            
            // Sizes
            new XWUIProgress(document.getElementById('progress-small'), { value: 60, label: 'Small' }, { size: 'small' });
            new XWUIProgress(document.getElementById('progress-medium'), { value: 60, label: 'Medium' }, { size: 'medium' });
            new XWUIProgress(document.getElementById('progress-large'), { value: 60, label: 'Large' }, { size: 'large' });
            
            // Animated demo
            const animated = new XWUIProgress(document.getElementById('progress-animated'), { value: 0, label: 'Animated Progress' }, { showValue: true });
            
            let intervalId = null;
            
            document.getElementById('btn-start').addEventListener('click', () => {
                if (intervalId) return;
                
                let value = 0;
                intervalId = setInterval(() => {
                    value += 2;
                    if (value > 100) {
                        value = 100;
                        if (intervalId) {
                            clearInterval(intervalId);
                            intervalId = null;
                        }
                    }
                    animated.setValue(value);
                }, 50);
            });
            
            document.getElementById('btn-reset').addEventListener('click', () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                animated.setValue(0);
            });
            
            tester.setStatus('✅ XWUIProgress initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIProgress test error:', error);
        }
