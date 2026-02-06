
        // Import component index FIRST (auto-registers <xwui-button> via createXWUIElement)
        // This must happen before any custom elements are used
        import '../index.ts';
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIButton/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize after imports
        (async () => {
            // Wait for custom elements to be defined
            await customElements.whenDefined('xwui-button');
            
            // Initialize XWUITester
            const tester = new XWUITester(document.getElementById('tester-container'), {
                title: 'XWUIButton - Three Usage Patterns',
                desc: 'This demo shows all 3 ways to use XWUIButton, and React Prefixed.',
                componentName: 'XWUIButton'
            }, {});
            
            const testArea = tester.getTestArea();
            
            if (!testArea) {
                console.error('testArea is null!');
                tester.setStatus('❌ Error: testArea not available', 'error');
                return;
            }
            
            // Add test content to test area
            const template = document.getElementById('tester-xwuibutton.three-ways-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }

            // Wait for DOM to update and custom elements to be upgraded (connectedCallback has run)
            // Use a combination of requestAnimationFrame and setTimeout to ensure elements are ready
            requestAnimationFrame(() => {
                setTimeout(() => {
                    // First, verify the HTML was set correctly
                    if (!testArea.innerHTML.includes('xwui-button')) {
                        tester.setStatus('⚠️ HTML does not contain xwui-button elements. Check innerHTML assignment.', 'error');
                        console.error('Debug: testArea.innerHTML does not contain xwui-button');
                        console.error('Debug: testArea.innerHTML length:', testArea.innerHTML.length);
                        console.error('Debug: testArea.innerHTML preview:', testArea.innerHTML.substring(0, 300));
                        return;
                    }
                    
                    // Query from testArea (more specific than document)
                    let buttons = testArea.querySelectorAll('xwui-button');
                    console.log(`Found ${buttons.length} xwui-button elements in testArea`);
                    
                    // If not found in testArea, try document as fallback
                    if (buttons.length === 0) {
                        console.warn('No buttons found in testArea, trying document...');
                        buttons = document.querySelectorAll('xwui-button');
                        console.log(`Found ${buttons.length} xwui-button elements in document`);
                        
                        if (buttons.length === 0) {
                            tester.setStatus('⚠️ No custom element buttons found. Elements may not be upgraded yet.', 'error');
                            console.error('Debug: testArea.innerHTML length:', testArea.innerHTML.length);
                            console.error('Debug: testArea contains xwui-button:', testArea.innerHTML.includes('xwui-button'));
                            console.error('Debug: testArea HTML preview:', testArea.innerHTML.substring(0, 300));
                            
                            // Try to find elements by tag name as a last resort
                            const allElements = testArea.getElementsByTagName('xwui-button');
                            console.log(`Found ${allElements.length} elements via getElementsByTagName`);
                            
                            if (allElements.length > 0) {
                                // Convert to array and use these instead
                                buttons = Array.from(allElements);
                                console.log(`Using ${buttons.length} elements from getElementsByTagName`);
                            } else {
                                return;
                            }
                        }
                    }
                    
                    tester.setStatus(`✅ Found ${buttons.length} button elements. Waiting for upgrade...`, 'info');
                    
                    // Wait for all elements to be upgraded (connectedCallback has run)
                    const waitForUpgrade = async () => {
                        const upgradedButtons = [];
                        const maxWait = 2000; // Max 2 seconds
                        const startTime = Date.now();
                        const buttonArray = Array.from(buttons);
                        
                        while (upgradedButtons.length < buttonArray.length && (Date.now() - startTime) < maxWait) {
                            await new Promise(resolve => setTimeout(resolve, 50));
                            
                            // Check each button to see if it's upgraded
                            buttonArray.forEach((buttonEl) => {
                                if (!upgradedButtons.includes(buttonEl)) {
                                    // Check if element has getInstance method (means it's upgraded)
                                    if (typeof buttonEl.getInstance === 'function') {
                                        const instance = buttonEl.getInstance();
                                        if (instance) {
                                            upgradedButtons.push(buttonEl);
                                            console.log(`✅ Button upgraded: ${upgradedButtons.length}/${buttonArray.length}`);
                                        }
                                    }
                                }
                            });
                        }
                        
                        if (upgradedButtons.length < buttonArray.length) {
                            console.warn(`⚠️ Only ${upgradedButtons.length} of ${buttonArray.length} buttons upgraded after ${maxWait}ms`);
                            // Log which buttons are not upgraded
                            buttonArray.forEach((btn, idx) => {
                                if (!upgradedButtons.includes(btn)) {
                                    console.warn(`⚠️ Button ${idx + 1} not upgraded:`, btn);
                                }
                            });
                        }
                        
                        return upgradedButtons;
                    };
                    
                    waitForUpgrade().then((upgradedButtons) => {
                        if (upgradedButtons.length === 0) {
                            tester.setStatus('⚠️ Buttons found but not upgraded. Check console for errors.', 'error');
                            return;
                        }
                        
                        tester.setStatus(`✅ ${upgradedButtons.length} buttons upgraded. Attaching click handlers...`, 'info');
                        
                        let attachedCount = 0;
                        upgradedButtons.forEach((buttonEl, index) => {
                            // Get component instance from custom element
                            const button = buttonEl.getInstance();
                            if (button) {
                                button.onClick((e) => {
                                    tester.setStatus(`✅ Button ${index + 1} clicked`, 'success');
                                    console.log(`Button ${index + 1} clicked`);
                                });
                                attachedCount++;
                                console.log(`✅ Attached click handler to button ${index + 1}`);
                                
                                // Update status when all buttons are attached
                                if (attachedCount === upgradedButtons.length) {
                                    tester.setStatus(`✅ Custom Element demo initialized: ${attachedCount} buttons ready.`, 'success');
                                }
                            } else {
                                console.warn(`⚠️ Button ${index + 1} instance not available`);
                            }
                        });
                    });
                }, 100);
            });
            
            console.log('Custom Element registered:', customElements.get('xwui-button') !== undefined);
        })();
        
        // Example React usage (would be in a .jsx/.tsx file):
        /*
        import React from 'react';
        import { Button, XWUIButtonReact } from './index';
        
        function App() {
            return (
                <>
                    <Button 
                        conf_comp={{ variant: 'primary', size: 'medium' }}
                        data={{ text: 'React Simple Button' }}
                    />
                    <XWUIButtonReact 
                        conf_comp={{ variant: 'success', size: 'large' }}
                        data={{ text: 'React Prefixed Button' }}
                    />
                </>
            );
        }
        */
