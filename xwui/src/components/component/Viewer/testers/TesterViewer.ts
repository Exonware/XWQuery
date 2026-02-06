import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/Viewer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { Viewer } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'Viewer Component Tester',
            desc: 'This page tests the Viewer component in isolation. Expected: Viewer with Monaco editor tabs (JSON, HTML, VIEW) should be visible and functional.',
            componentName: 'Viewer'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-viewer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const container = document.querySelector('.viewer-container');
        const showUploadToggle = document.getElementById('showUploadToggle');
        const reinitButton = document.getElementById('reinitButton');
        
        let viewer = null;
        
        function initializeViewer() {
            try {
                if (!container) {
                    throw new Error('Container not found');
                }
                
                // Destroy existing viewer if it exists
                if (viewer) {
                    viewer.destroy();
                    viewer = null;
                }
                
                // Get configuration from toggle
                const showUpload = showUploadToggle.checked;
                const config = { showUploadButton: showUpload };
                
                // Reset file controls visibility before reinitializing
                // This ensures the new viewer instance can properly apply the configuration
                const fileControls = document.querySelector('.viewer-file-controls');
                if (fileControls) {
                    // Remove inline style to reset to CSS default
                    fileControls.style.removeProperty('display');
                }
                
                // Initialize viewer with configuration
                viewer = new Viewer(container, config);
                
            } catch (error) {
                console.error('Viewer initialization error:', error);
            }
        }
        
        // Initialize on load
        initializeViewer();
        
        // Update upload button visibility immediately when toggle changes
        showUploadToggle.addEventListener('change', () => {
            if (viewer) {
                // Update visibility dynamically without reinitializing
                viewer.setShowUploadButton(showUploadToggle.checked);
            } else {
                // If viewer not initialized yet, initialize it
                initializeViewer();
            }
        });
        
        // Reinitialize button
        reinitButton.addEventListener('click', () => {
            initializeViewer();
        });
