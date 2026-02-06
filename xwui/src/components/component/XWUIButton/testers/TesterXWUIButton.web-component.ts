
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
            try {
                // Wait for custom elements to be defined
                // Add a small delay to ensure the import has fully executed
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Check if element is registered, if not wait for it
                if (customElements.get('xwui-button') === undefined) {
                    console.log('Waiting for xwui-button to be defined...');
                    await customElements.whenDefined('xwui-button');
                }
                
                // Verify the element is actually registered
                const isRegistered = customElements.get('xwui-button') !== undefined;
                console.log('Custom Element registered:', isRegistered);
                
                if (!isRegistered) {
                    throw new Error('xwui-button custom element failed to register. Check console for import errors.');
                }
                
                // Initialize XWUITester
                const tester = new XWUITester(document.getElementById('tester-container'), {
                    title: 'XWUIButton - Web Component Demo',
                    desc: 'This demo shows XWUIButton using web component syntax. Both self-closing (<xwui-button />) and regular tags (<xwui-button></xwui-button>) work',
                    componentName: 'XWUIButton'
                }, {});
                
                const testArea = tester.getTestArea();
                
                // HTML template with self-closing tags (will be converted to proper closing tags)
                const htmlTemplate = `
            <p>This demo shows XWUIButton using web component syntax. Both syntaxes work:</p>
            <ul>
                <li><strong>Self-closing:</strong> <code>&lt;xwui-button /&gt;</code></li>
                <li><strong>Regular tags:</strong> <code>&lt;xwui-button&gt;&lt;/xwui-button&gt;</code></li>
            </ul>
            <p>Examples below use both formats to demonstrate they work identically.</p>

            <!-- Syntax Comparison -->
            <div class="demo-section">
                <h3>Syntax Comparison - Both Work</h3>
                <p><strong>Self-closing tags:</strong></p>
                <div class="button-group">
                    <xwui-button variant="primary" size="medium" text="Self-Closing" />
                    <xwui-button variant="success" size="medium" text="Self-Closing" />
                </div>
                <p><strong>Regular tags:</strong></p>
                <div class="button-group">
                    <xwui-button variant="primary" size="medium" text="Regular Tag"></xwui-button>
                    <xwui-button variant="success" size="medium" text="Regular Tag"></xwui-button>
                </div>
            </div>

            <!-- Variants -->
            <div class="demo-section">
                <h3>Variants (Mix of Self-Closing and Regular Tags)</h3>
                <div class="button-group">
                    <xwui-button variant="primary" size="medium" text="Primary" />
                    <xwui-button variant="secondary" size="medium" text="Secondary"></xwui-button>
                    <xwui-button variant="success" size="medium" text="Success" />
                    <xwui-button variant="danger" size="medium" text="Danger"></xwui-button>
                    <xwui-button variant="warning" size="medium" text="Warning" />
                    <xwui-button variant="info" size="medium" text="Info"></xwui-button>
                    <xwui-button variant="outline" size="medium" text="Outline" />
                    <xwui-button variant="ghost" size="medium" text="Ghost"></xwui-button>
                </div>
            </div>

            <!-- Sizes -->
            <div class="demo-section">
                <h3>Sizes</h3>
                <div class="button-group">
                    <xwui-button variant="primary" size="tiny" text="Tiny" />
                    <xwui-button variant="primary" size="small" text="Small" />
                    <xwui-button variant="primary" size="medium" text="Medium" />
                    <xwui-button variant="primary" size="large" text="Large" />
                </div>
            </div>

            <!-- With Icons -->
            <div class="demo-section">
                <h3>With Icons</h3>
                <div class="button-group">
                    <xwui-button 
                        variant="primary" 
                        size="medium" 
                        text="Icon Left" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        icon-position="left" />
                    <xwui-button 
                        variant="success" 
                        size="medium" 
                        text="Icon Right" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        icon-position="right" />
                    <xwui-button 
                        variant="primary" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Icon Only Button" />
                </div>
            </div>

            <!-- Icon Only Buttons - Variants -->
            <div class="demo-section">
                <h3>Icon Only Buttons - Variants</h3>
                <div class="button-group">
                    <xwui-button 
                        variant="primary" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Primary" />
                    <xwui-button 
                        variant="secondary" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Secondary" />
                    <xwui-button 
                        variant="success" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Success" />
                    <xwui-button 
                        variant="danger" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Danger" />
                    <xwui-button 
                        variant="warning" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Warning" />
                    <xwui-button 
                        variant="info" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Info" />
                    <xwui-button 
                        variant="outline" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Outline" />
                    <xwui-button 
                        variant="ghost" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Ghost" />
                </div>
            </div>

            <!-- Icon Only Buttons - Sizes -->
            <div class="demo-section">
                <h3>Icon Only Buttons - Sizes</h3>
                <div class="button-group">
                    <xwui-button 
                        variant="primary" 
                        size="tiny" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Tiny" />
                    <xwui-button 
                        variant="primary" 
                        size="small" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Small" />
                    <xwui-button 
                        variant="primary" 
                        size="medium" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Medium" />
                    <xwui-button 
                        variant="primary" 
                        size="large" 
                        text="" 
                        icon="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>"
                        title="Large" />
                </div>
            </div>

            <!-- States -->
            <div class="demo-section">
                <h3>States</h3>
                <div class="button-group">
                    <xwui-button variant="primary" size="medium" text="Normal" />
                    <xwui-button variant="primary" size="medium" text="Disabled" disabled="true" />
                    <xwui-button variant="primary" size="medium" text="Loading" loading="true" />
                </div>
            </div>

            <!-- Full Width -->
            <div class="demo-section">
                <h3>Full Width</h3>
                <div class="button-group" style="width: 100%;">
                    <xwui-button variant="primary" size="medium" text="Full Width Button" full-width="true" />
                </div>
            </div>

            <!-- Button Types -->
            <div class="demo-section">
                <h3>Button Types</h3>
                <div class="button-group">
                    <xwui-button variant="primary" size="medium" text="Button" type="button" />
                    <xwui-button variant="success" size="medium" text="Submit" type="submit" />
                    <xwui-button variant="danger" size="medium" text="Reset" type="reset" />
                </div>
            </div>

            <!-- Grouped Attributes Example -->
            <div class="demo-section">
                <h3>Grouped Attributes (conf-comp and data)</h3>
                <p>Both syntaxes work with grouped attributes:</p>
                <div class="button-group">
                    <xwui-button 
                        conf-comp='{"variant": "primary", "size": "large", "icon": "<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"><path d=\\"M5 12h14M12 5l7 7-7 7\\"/></svg>", "iconPosition": "left"}'
                        data='{"text": "Self-Closing"}' />
                    <xwui-button 
                        conf-comp='{"variant": "success", "size": "medium"}'
                        data='{"text": "Regular Tag"}'></xwui-button>
                </div>
            </div>
            `;
                
                // Convert self-closing tags to proper closing tags for HTML compatibility
                // Self-closing custom elements don't work reliably in HTML (only in JSX)
                // Handle both single-line and multiline self-closing tags
                const htmlContent = htmlTemplate
                    .replace(/<xwui-button\s+([^>]*?)\s*\/>/gs, '<xwui-button $1></xwui-button>')
                    .replace(/<xwui-button\s*\/>/g, '<xwui-button></xwui-button>');
                
                // Set innerHTML - custom elements will upgrade automatically since they're already defined
                testArea.innerHTML = htmlContent;

                // Wait for custom elements to be upgraded (connectedCallback has run)
                // Use a small delay to ensure all elements are upgraded
                setTimeout(() => {
                    const buttons = document.querySelectorAll('xwui-button');
                    console.log(`Found ${buttons.length} xwui-button elements`);
                    
                    if (buttons.length === 0) {
                        tester.setStatus('⚠️ No custom element buttons found. Check console for errors.', 'error');
                        console.error('No xwui-button elements found in DOM. Possible issues:');
                        console.error('1. Custom element not registered properly');
                        console.error('2. HTML parsing issue with custom elements');
                        console.error('3. Elements not upgraded after innerHTML assignment');
                        return;
                    }
                    
                    tester.setStatus(`✅ Found ${buttons.length} button elements. Attaching click handlers...`, 'info');
                    
                    let attachedCount = 0;
                    buttons.forEach((buttonEl, index) => {
                        // Wait a bit for the element to be fully upgraded
                        setTimeout(() => {
                            // Get component instance from custom element
                            const button = buttonEl.getInstance();
                            if (button) {
                                button.onClick((e) => {
                                    tester.setStatus(`✅ Button ${index + 1} clicked`, 'success');
                                    console.log(`Button ${index + 1} clicked`, buttonEl);
                                });
                                attachedCount++;
                                console.log(`✅ Attached click handler to button ${index + 1}`);
                                
                                // Update status when all buttons are attached
                                if (attachedCount === buttons.length) {
                                    tester.setStatus(`✅ Web Component demo initialized. ${attachedCount} buttons ready with click handlers.`, 'success');
                                }
                            } else {
                                console.warn(`⚠️ Button ${index + 1} instance not available yet`);
                                // Check if element is actually a custom element
                                if (!(buttonEl instanceof customElements.get('xwui-button'))) {
                                    console.error(`Button ${index + 1} is not a proper custom element instance`);
                                }
                            }
                        }, 50 * (index + 1)); // Stagger the checks
                    });
                }, 200); // Increased delay to ensure elements are upgraded
                
            } catch (error) {
                console.error('Error initializing web component tester:', error);
                const testerContainer = document.getElementById('tester-container');
                if (testerContainer) {
                    testerContainer.innerHTML = `
                        <div style="padding: 2rem; color: red;">
                            <h2>Error Loading Web Component Demo</h2>
                            <p>${error.message}</p>
                            <p>Check the browser console for more details.</p>
                        </div>
                    `;
                }
            }
        })();
