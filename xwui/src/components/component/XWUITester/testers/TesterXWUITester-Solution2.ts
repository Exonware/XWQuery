
        import { XWUITester } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        import { XWUIButton } from '../../XWUIButton/index.ts';
        import { XWUIMenuDrawer } from '../../XWUIMenuDrawer/index.ts';
        import { XWUISpinner } from '../../XWUISpinner/index.ts';
        
        // Set CSS base path for automatic CSS loading
        XWUIComponent.cssBasePath = '../../';
        
        // Create loading spinner
        const spinnerContainer = document.getElementById('spinner-container');
        const loadingOverlay = document.getElementById('loading-overlay');
        const timerText = document.getElementById('timer-text');
        const spinner = new XWUISpinner(
            spinnerContainer,
            { spinning, label: 'Loading...' },
            { size: 'large', color: 'primary' }
        );
        
        // Start timer
        const startTime = performance.now();
        const timerInterval = setInterval(() => {
            const elapsed = (performance.now() - startTime) / 1000;
            if (timerText) {
                timerText.textContent = `${elapsed.toFixed(2)}s`;
            }
        }, 50);
        
        // Function to show body when ready
        function showBody() {
            loadingOverlay.classList.add('hidden');
            document.body.classList.add('xwui-ready');
        }
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITester - Solution 2: Wait for Style + Spinner',
            desc: 'This solution waits for the style instance to be ready before showing content. Simpler approach.',
            componentName: 'XWUITester',
            componentInstance,
            componentConfig: {},
            componentData: {}
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content
        const template = document.getElementById('tester-xwuitester-solution2-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Create test button instances
            const buttonTestArea = document.getElementById('button-test-area');
            if (buttonTestArea) {
                const primaryContainer = document.createElement('div');
                buttonTestArea.appendChild(primaryContainer);
                const primaryButton = new XWUIButton(
                    primaryContainer,
                    { text: 'Primary Button' },
                    { variant: 'primary' }
                );
                
                const secondaryContainer = document.createElement('div');
                buttonTestArea.appendChild(secondaryContainer);
                const secondaryButton = new XWUIButton(
                    secondaryContainer,
                    { text: 'Secondary Button' },
                    { variant: 'secondary' }
                );
            }
            
            // Wait for style to be ready
            async function waitForReady() {
                // Wait for style instance
                while (!tester.styleInstance) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                
                // Wait a bit more for CSS to load
                await new Promise(resolve => setTimeout(resolve, 200));
                
                // Show body
                showBody();
            }
            
            waitForReady().then(() => {
                clearInterval(timerInterval);
                const totalTime = (performance.now() - startTime) / 1000;
                if (timerText) {
                    timerText.textContent = `${totalTime.toFixed(2)}s`;
                }
                tester.setStatus(`✅ Solution 2, components loaded (${totalTime.toFixed(2)}s)`, 'success');
            }).catch((error) => {
                clearInterval(timerInterval);
                const totalTime = (performance.now() - startTime) / 1000;
                if (timerText) {
                    timerText.textContent = `${totalTime.toFixed(2)}s`;
                }
                console.warn('Error during initialization:', error);
                tester.setStatus(`⚠️ Warning: ${error.message}`, 'warning');
                setTimeout(showBody, 1000);
            });
            
        } catch (error) {
            clearInterval(timerInterval);
            const totalTime = (performance.now() - startTime) / 1000;
            if (timerText) {
                timerText.textContent = `${totalTime.toFixed(2)}s`;
            }
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITester test error:', error);
            setTimeout(showBody, 500);
        }
