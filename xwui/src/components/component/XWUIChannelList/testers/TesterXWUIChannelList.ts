import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIChannelList/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIChannelList } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIChannelList Component Tester',
            desc: 'Enhanced channel list with unread counts, last message preview, and search.',
            componentName: 'XWUIChannelList'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const sampleChannels = [
            {
                id: '1',
                name: 'General',
                icon: '💬',
                lastMessage: 'Hello everyone',
                lastMessageTime: '2m ago',
                unreadCount: 5,
                isOnline: true
            },
            {
                id: '2',
                name: 'Development',
                icon: '💻',
                lastMessage: 'Fixed the bug',
                lastMessageTime: '1h ago',
                unreadCount: 0,
                isOnline,
                isFavorite: true
            },
            {
                id: '3',
                name: 'Design',
                icon: '🎨',
                lastMessage: 'New mockups ready',
                lastMessageTime: '3h ago',
                unreadCount: 2,
                isOnline: false
            },
            {
                id: '4',
                name: 'Marketing',
                icon: '📢',
                lastMessage: 'Campaign launched',
                lastMessageTime: '1d ago',
                unreadCount: 0,
                isMuted: true
            }
        ];
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuichannel-list-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('channel-list-basic');
            const basicList = new XWUIChannelList(
                basicContainer,
                {
                    channels,
                    selectedChannelId: '1'
                }
            );
            
            basicList.onChannelSelect((channelId) => {
                console.log('Channel selected:', channelId);
                tester.setStatus(`✅ Channel selected: ${channelId}`, 'success');
            });
            
            // Grouped
            const groupedContainer = document.getElementById('channel-list-grouped');
            const groupedList = new XWUIChannelList(
                groupedContainer,
                {
                    channels: sampleChannels
                },
                {
                    groupBy: 'favorites'
                }
            );
            
            tester.setStatus('✅ XWUIChannelList initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIChannelList test error:', error);
        }
