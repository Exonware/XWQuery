import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIFocusTrap/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIFocusTrap } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIFocusTrap Component Tester',
            desc: 'Focus trap utility to trap focus within a container (essential for modals).',
            componentName: 'XWUIFocusTrap'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuifocus-trap-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        let focusTrap = null;
        
        try {
            const openBtn = document.getElementById('open-modal-btn');
            const modalContainer = document.getElementById('modal-container');
            const modalContent = document.getElementById('modal-content');
            const closeBtn = document.getElementById('close-modal-btn');
            
            openBtn?.addEventListener('click', () => {
                modalContainer.style.display = 'flex';
                
                // Create focus trap
                focusTrap = new XWUIFocusTrap(modalContent, {}, {
                    active,
                    returnFocusOnDeactivate,
                    initialFocus: '#modal-btn-1'
                });
                
                tester.setStatus('✅ Modal opened with focus trap - Press Tab to navigate', 'success');
            });
            
            closeBtn?.addEventListener('click', () => {
                if (focusTrap) {
                    focusTrap.deactivate();
                    focusTrap.destroy();
                    focusTrap = null;
                }
                modalContainer.style.display = 'none';
            });
            
            // ESC key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalContainer.style.display !== 'none') {
                    closeBtn?.click();
                }
            });
            
            tester.setStatus('✅ XWUIFocusTrap ready - Click "Open Modal" to test', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIFocusTrap test error:', error);
        }
