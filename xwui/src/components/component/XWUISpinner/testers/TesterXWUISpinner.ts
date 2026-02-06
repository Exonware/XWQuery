import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISpinner/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISpinner } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISpinner Component Tester',
            desc: 'Loading spinner with overlay option.',
            componentName: 'XWUISpinner'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuispinner-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            new XWUISpinner(document.getElementById('spinner-1'), {}, {});
            new XWUISpinner(document.getElementById('spinner-2'), { label: 'Loading...' }, {});
            new XWUISpinner(document.getElementById('spinner-3'), { label: 'Please wait' }, {});
            
            // Sizes
            new XWUISpinner(document.getElementById('spinner-small'), {}, { size: 'small' });
            new XWUISpinner(document.getElementById('spinner-medium'), {}, { size: 'medium' });
            new XWUISpinner(document.getElementById('spinner-large'), {}, { size: 'large' });
            
            // Colors
            new XWUISpinner(document.getElementById('spinner-primary'), {}, { color: 'primary' });
            new XWUISpinner(document.getElementById('spinner-secondary'), {}, { color: 'secondary' });
            new XWUISpinner(document.getElementById('spinner-white'), {}, { color: 'white' });
            
            // With label
            new XWUISpinner(document.getElementById('spinner-label-1'), { label: 'Loading data...' }, {});
            new XWUISpinner(document.getElementById('spinner-label-2'), { label: 'Processing request' }, { size: 'large' });
            
            // Overlay
            const overlayContainer = document.getElementById('spinner-overlay').parentElement;
            const overlay = new XWUISpinner(
                overlayContainer,
                { label: 'Loading...', spinning: false },
                { overlay, blur: true }
            );
            
            document.getElementById('btn-show-overlay').addEventListener('click', () => {
                overlay.show('Loading content...');
            });
            
            document.getElementById('btn-hide-overlay').addEventListener('click', () => {
                overlay.hide();
            });
            
            tester.setStatus('✅ XWUISpinner initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISpinner test error:', error);
        }
