import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITextOverlay/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITextOverlay } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITextOverlay Component Tester',
            desc: 'Text overlay for adding text to canvas with formatting options.',
            componentName: 'XWUITextOverlay'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitext-overlay-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const canvasContainer = document.getElementById('canvas-text');
            const addBtn = document.getElementById('add-text-btn');
            
            const textOverlay = new XWUITextOverlay(
                canvasContainer,
                {
                    overlays: [
                        {
                            id: 'text1',
                            text: 'Hello World',
                            x: 50,
                            y: 50,
                            fontSize: 32,
                            fontFamily: 'Arial',
                            color: '#000000',
                            alignment: 'left',
                            style: { bold: true }
                        }
                    ]
                },
                {
                    canvasElement: canvasContainer
                }
            );
            
            addBtn?.addEventListener('click', () => {
                const text = prompt('Enter text:', 'New Text');
                if (text) {
                    textOverlay.addText(text, 100, 100);
                }
            });
            
            textOverlay.onChange((overlays) => {
                console.log('Text overlays changed:', overlays);
                tester.setStatus(`✅ ${overlays.length} text overlay(s) on canvas`, 'success');
            });
            
            tester.setStatus('✅ XWUITextOverlay initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITextOverlay test error:', error);
        }
