import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIKbd/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIKbd } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIKbd Component Tester',
            desc: 'Keyboard key display component for showing keyboard shortcuts.',
            componentName: 'XWUIKbd'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuikbd-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Single keys
            new XWUIKbd(document.getElementById('kbd-1'), { text: 'Ctrl' }, {});
            new XWUIKbd(document.getElementById('kbd-2'), { text: 'Alt' }, {});
            new XWUIKbd(document.getElementById('kbd-3'), { text: 'Shift' }, {});
            new XWUIKbd(document.getElementById('kbd-4'), { text: 'Enter' }, {});
            
            // Keyboard shortcut combination
            const shortcutContainer = document.getElementById('kbd-shortcut-1');
            shortcutContainer.style.display = 'inline-flex';
            shortcutContainer.style.gap = '0.25rem';
            shortcutContainer.style.alignItems = 'center';
            
            const ctrl = document.createElement('div');
            const plus = document.createElement('span');
            plus.textContent = '+';
            plus.style.margin = '0 0.25rem';
            const s = document.createElement('div');
            
            shortcutContainer.appendChild(ctrl);
            shortcutContainer.appendChild(plus);
            shortcutContainer.appendChild(s);
            
            new XWUIKbd(ctrl, { text: 'Ctrl' }, {});
            new XWUIKbd(s, { text: 'S' }, {});
            
            tester.setStatus('✅ XWUIKbd initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIKbd test error:', error);
        }
