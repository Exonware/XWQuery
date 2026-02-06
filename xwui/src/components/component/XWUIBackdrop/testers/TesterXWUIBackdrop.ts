
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIBackdrop } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBackdrop/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBackdrop Component Tester',
            desc: 'Test the XWUIBackdrop component with various configurations including basic backdrop, click handlers, and invisible backdrop options.',
            componentName: 'XWUIBackdrop'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuibackdrop-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Helper function to check if backdrop is visible by checking the element's display style
            const isBackdropVisible = (backdrop) => {
                if (!backdrop || !backdrop.container) return false;
                const backdropElement = backdrop.container.querySelector('.xwui-backdrop');
                if (backdropElement) {
                    return backdropElement.style.display !== 'none';
                }
                return false;
            };
            
            // Test 1: Basic backdrop
            const container1 = document.getElementById('backdrop-container-1');
            const btn1 = document.getElementById('show-backdrop-1');
            let backdrop1 = null;
            
            btn1?.addEventListener('click', () => {
                if (!container1) return;
                if (!backdrop1) {
                    backdrop1 = new XWUIBackdrop(container1, {}, { visible: true });
                    tester.setStatus('✅ Basic backdrop created and shown', 'success');
                } else {
                    backdrop1.toggle();
                    tester.setStatus(`✅ Backdrop ${isBackdropVisible(backdrop1) ? 'shown' : 'hidden'}`, 'success');
                }
            });
            
            // Test 2: Backdrop with click handler
            const container2 = document.getElementById('backdrop-container-2');
            const btn2 = document.getElementById('show-backdrop-2');
            let backdrop2 = null;
            
            btn2?.addEventListener('click', () => {
                if (!container2) return;
                if (!backdrop2) {
                    backdrop2 = new XWUIBackdrop(container2, {}, {
                        visible: true,
                        onClick: () => {
                            console.log('Backdrop clicked');
                            backdrop2?.hide();
                            tester.setStatus('✅ Backdrop clicked and closed', 'success');
                        }
                    });
                    tester.setStatus('✅ Backdrop with click handler created', 'success');
                } else {
                    backdrop2.show();
                    tester.setStatus('✅ Backdrop shown - click on it to close', 'success');
                }
            });
            
            // Test 3: Invisible backdrop
            const container3 = document.getElementById('backdrop-container-3');
            const btn3 = document.getElementById('show-backdrop-3');
            let backdrop3 = null;
            
            btn3?.addEventListener('click', () => {
                if (!container3) return;
                if (!backdrop3) {
                    backdrop3 = new XWUIBackdrop(container3, {}, {
                        visible: true,
                        invisible: true,
                        onClick: () => {
                            console.log('Invisible backdrop clicked');
                            backdrop3?.hide();
                            tester.setStatus('✅ Invisible backdrop clicked and closed', 'success');
                        }
                    });
                    tester.setStatus('✅ Invisible backdrop created - click on it to close', 'success');
                } else {
                    backdrop3.toggle();
                    tester.setStatus(`✅ Invisible backdrop ${isBackdropVisible(backdrop3) ? 'shown' : 'hidden'}`, 'success');
                }
            });
            
            tester.setStatus('✅ XWUIBackdrop component tester initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIBackdrop test error:', error);
            console.error('Error stack:', error.stack);
        }
