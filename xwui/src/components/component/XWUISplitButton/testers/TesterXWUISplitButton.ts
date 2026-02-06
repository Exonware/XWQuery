import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISplitButton/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISplitButton } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISplitButton Component Tester',
            desc: 'Button with main action and dropdown for secondary actions.',
            componentName: 'XWUISplitButton'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuisplit-button-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic split button
            const splitButton1 = new XWUISplitButton(document.getElementById('split-button-1'), {
                label: 'Save',
                items: [
                    { id: 'save-draft', label: 'Save Draft' },
                    { id: 'save-template', label: 'Save as Template' }
                ],
                onClick: (e) => {
                    console.log('Main action clicked');
                    tester.setStatus('✅ Main button clicked', 'success');
                }
            }, {
                variant: 'primary'
            });
            
            // Secondary split button
            new XWUISplitButton(document.getElementById('split-button-2'), {
                label: 'Export',
                items: [
                    { id: 'export-pdf', label: 'Export as PDF' },
                    { id: 'export-csv', label: 'Export as CSV' },
                    { id: 'export-json', label: 'Export as JSON' }
                ]
            }, {
                variant: 'secondary'
            });
            
            // Outline split button
            new XWUISplitButton(document.getElementById('split-button-3'), {
                label: 'Share',
                items: [
                    { id: 'share-email', label: 'Share via Email' },
                    { id: 'share-link', label: 'Copy Link' },
                    { id: 'share-social', label: 'Share on Social Media' }
                ]
            }, {
                variant: 'outline',
                size: 'large'
            });
            
            tester.setStatus('✅ XWUISplitButton initialized successfully - Click the dropdown arrow for more options', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISplitButton test error:', error);
        }
