import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputChat/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInputChat } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputChat Component Tester',
            desc: 'Auto-resizing textarea with file attachment and send button.',
            componentName: 'XWUIInputChat'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiinput-chat-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const messagesEl = document.getElementById('messages-basic');
        
        function addMessage(text) {
            if (messagesEl) {
                const msgDiv = document.createElement('div');
                msgDiv.style.padding = '0.5rem';
                msgDiv.style.marginBottom = '0.5rem';
                msgDiv.style.background = 'var(--bg-primary)';
                msgDiv.style.borderRadius = '4px';
                msgDiv.textContent = text;
                messagesEl.appendChild(msgDiv);
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('chatinput-basic');
            const basicInput = new XWUIInputChat(
                basicContainer,
                {},
                {}
            );
            basicInput.onSend((message) => {
                addMessage(`You: ${message}`);
                tester.setStatus(`✅ Message sent: ${message}`, 'success');
            });
            basicInput.onFileAttach((file) => {
                addMessage(`📎 File attached: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
                tester.setStatus(`✅ File attached: ${file.name}`, 'success');
            });
            
            // Without File Button
            const noFileContainer = document.getElementById('chatinput-no-file');
            const noFileInput = new XWUIInputChat(
                noFileContainer,
                {},
                { showFileButton: false }
            );
            noFileInput.onSend((message) => {
                console.log('No-file input sent:', message);
            });
            
            // Custom Placeholder
            const customContainer = document.getElementById('chatinput-custom');
            const customInput = new XWUIInputChat(
                customContainer,
                {},
                { placeholder: 'Enter your message here...' }
            );
            customInput.onSend((message) => {
                console.log('Custom input sent:', message);
            });
            
            tester.setStatus('✅ XWUIInputChat initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInputChat test error:', error);
        }
