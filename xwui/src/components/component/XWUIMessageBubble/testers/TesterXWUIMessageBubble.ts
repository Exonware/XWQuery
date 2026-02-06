import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMessageBubble/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMessageBubble } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMessageBubble Component Tester',
            desc: 'Chat message display with sender alignment and timestamp.',
            componentName: 'XWUIMessageBubble'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuimessage-bubble-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Own message
            const ownContainer = document.getElementById('bubble-own');
            const ownBubble = new XWUIMessageBubble(
                ownContainer,
                {
                    message: {
                        content: 'Hello This is my message.',
                        timestamp: new Date(),
                        senderId: 'user1',
                        senderName: 'You'
                    }
                },
                { isOwn: true }
            );
            
            // Other user message
            const otherContainer = document.getElementById('bubble-other');
            const otherBubble = new XWUIMessageBubble(
                otherContainer,
                {
                    message: {
                        content: 'Hi there How are you?',
                        timestamp: new Date(),
                        senderId: 'user2',
                        senderName: 'John Doe',
                        senderAvatar: 'https://via.placeholder.com/40'
                    }
                },
                { isOwn: false }
            );
            
            // Long message
            const longContainer = document.getElementById('bubble-long');
            const longBubble = new XWUIMessageBubble(
                longContainer,
                {
                    message: {
                        content: 'This is a very long message that will be truncated and show an expand button. '.repeat(10),
                        timestamp: new Date(),
                        senderId: 'user2',
                        senderName: 'Jane Smith'
                    }
                },
                { isOwn, maxLength: 100 }
            );
            
            // Thread demo
            const threadContainer = document.getElementById('thread-demo');
            const messages = [
                {
                    message: {
                        content: 'Hey',
                        timestamp: new Date(Date.now() - 3600000),
                        senderId: 'user2',
                        senderName: 'Alice',
                        senderAvatar: 'https://via.placeholder.com/40?text=A'
                    },
                    isOwn: false
                },
                {
                    message: {
                        content: 'Hi Alice',
                        timestamp: new Date(Date.now() - 3500000),
                        senderId: 'user1',
                        senderName: 'You'
                    },
                    isOwn: true
                },
                {
                    message: {
                        content: 'How are you doing?',
                        timestamp: new Date(Date.now() - 3400000),
                        senderId: 'user2',
                        senderName: 'Alice',
                        senderAvatar: 'https://via.placeholder.com/40?text=A'
                    },
                    isOwn: false
                },
                {
                    message: {
                        content: 'I am doing great, thanks for asking',
                        timestamp: new Date(Date.now() - 3300000),
                        senderId: 'user1',
                        senderName: 'You'
                    },
                    isOwn: true
                }
            ];
            
            messages.forEach((msg) => {
                const bubble = new XWUIMessageBubble(
                    threadContainer,
                    { message: msg.message },
                    { isOwn: msg.isOwn }
                );
            });
            
            tester.setStatus('✅ XWUIMessageBubble initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMessageBubble test error:', error);
        }
