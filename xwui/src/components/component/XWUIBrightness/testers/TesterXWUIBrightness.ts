import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBrightness/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBrightness } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBrightness Component Tester',
            desc: 'Control the brightness of the entire page using the scroll-based slider control.',
            componentName: 'XWUIBrightness'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content
        const template = document.getElementById('tester-xwuibrightness-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Initialize brightness component
            const brightnessContainer = document.getElementById('brightness-container');
            const brightness = new XWUIBrightness(
                brightnessContainer,
                { brightness: 100 },
                {
                    showController: true,
                    controlPosition: 'right',
                    minBrightness: 0,
                    maxBrightness: 100,
                    defaultBrightness: 100,
                    step: 1
                }
            );
            
            // Setup position buttons
            const positionButtons = document.querySelectorAll('[data-position]');
            positionButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const position = btn.getAttribute('data-position');
                    brightness.setControlPosition(position);
                    
                    // Update active state
                    positionButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
            
            // Set initial active button
            document.getElementById('btn-position-right').classList.add('active');
            
            // Setup toggle button
            let controllerVisible = true;
            const toggleBtn = document.getElementById('btn-toggle');
            toggleBtn.addEventListener('click', () => {
                if (controllerVisible) {
                    brightness.hideController();
                    toggleBtn.textContent = 'Show Controller';
                    controllerVisible = false;
                } else {
                    brightness.showController();
                    toggleBtn.textContent = 'Hide Controller';
                    controllerVisible = true;
                }
            });
            
            tester.setStatus('✅ XWUIBrightness initialized successfully. Use the controller on the right side to adjust brightness', 'success');
            
            // Log brightness changes
            brightness.onChange((brightnessValue) => {
                tester.setStatus(`✅ Brightness set to: ${Math.round(brightnessValue)}%`, 'success');
            });
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIBrightness test error:', error);
        }
