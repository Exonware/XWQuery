import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIThread/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIThread } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIThread Component Tester',
            desc: 'Scrollable message thread with multiple message bubbles.',
            componentName: 'XWUIThread'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuithread-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const contributors = [
            { id: 'user1', name: 'You', avatar: 'https://via.placeholder.com/40?text=Y' },
            { id: 'user2', name: 'Alice', avatar: 'https://via.placeholder.com/40?text=A' },
            { id: 'user3', name: 'Bob', avatar: 'https://via.placeholder.com/40?text=B' }
        ];
        
        const initialMessages = [
            { id: '1', content: 'Hey everyone', timestamp: new Date(Date.now() - 3600000), senderId: 'user2' },
            { id: '2', content: 'Hi Alice', timestamp: new Date(Date.now() - 3500000), senderId: 'user1' },
            { id: '3', content: 'Hello', timestamp: new Date(Date.now() - 3400000), senderId: 'user3' },
            { id: '4', content: 'How are you all doing?', timestamp: new Date(Date.now() - 3300000), senderId: 'user2' },
            { id: '5', content: 'I am doing great', timestamp: new Date(Date.now() - 3200000), senderId: 'user1' },
            { id: '6', content: 'Same here', timestamp: new Date(Date.now() - 3100000), senderId: 'user3' }
        ];
        
        try {
            const threadContainer = document.getElementById('thread-basic');
            const thread = new XWUIThread(
                threadContainer,
                {
                    contributors,
                    messages: initialMessages
                },
                {
                    viewerId: 'user1',
                    autoScroll: true
                }
            );
            
            let messageCounter = initialMessages.length + 1;
            document.getElementById('btn-add-message').addEventListener('click', () => {
                const randomContributor = contributors[Math.floor(Math.random() * contributors.length)];
                thread.addMessage({
                    id: String(messageCounter++),
                    content: `Message ${messageCounter - 1}: This is a new message from ${randomContributor.name}!`,
                    timestamp: new Date(),
                    senderId: randomContributor.id
                });
                tester.setStatus(`✅ Message added from ${randomContributor.name}`, 'success');
            });
            
            tester.setStatus('✅ XWUIThread initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIThread test error:', error);
        }
