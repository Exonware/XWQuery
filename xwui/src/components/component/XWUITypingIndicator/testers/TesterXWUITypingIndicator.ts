import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITypingIndicator/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITypingIndicator } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITypingIndicator Component Tester',
            desc: 'Animated typing indicator showing "User is typing..." with animated dots.',
            componentName: 'XWUITypingIndicator'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuityping-indicator-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('indicator-basic');
            const basicIndicator = new XWUITypingIndicator(
                basicContainer,
                { visible: true },
                { userName: 'John Doe' }
            );
            
            // With Avatar
            const avatarContainer = document.getElementById('indicator-avatar');
            const avatarIndicator = new XWUITypingIndicator(
                avatarContainer,
                { visible: true },
                {
                    userName: 'Jane Smith',
                    showAvatar,
                    avatarUrl: 'https://via.placeholder.com/40'
                }
            );
            
            // Multiple Users
            const multipleContainer = document.getElementById('indicator-multiple');
            const multipleIndicator = new XWUITypingIndicator(
                multipleContainer,
                {
                    visible,
                    users: ['Alice', 'Bob', 'Charlie']
                }
            );
            
            // Auto-hide
            const autohideContainer = document.getElementById('indicator-autohide');
            const autohideIndicator = new XWUITypingIndicator(
                autohideContainer,
                { visible: false },
                {
                    userName: 'Auto-hide User',
                    autoHide,
                    autoHideDelay: 5000
                }
            );
            
            const showBtn = document.getElementById('show-autohide-btn');
            showBtn?.addEventListener('click', () => {
                autohideIndicator.show();
            });
            
            // Different Speeds
            const slowContainer = document.getElementById('indicator-slow');
            const slowIndicator = new XWUITypingIndicator(
                slowContainer,
                { visible: true },
                { userName: 'Slow Animation', animationSpeed: 'slow' }
            );
            
            const normalContainer = document.getElementById('indicator-normal');
            const normalIndicator = new XWUITypingIndicator(
                normalContainer,
                { visible: true },
                { userName: 'Normal Animation', animationSpeed: 'normal' }
            );
            
            const fastContainer = document.getElementById('indicator-fast');
            const fastIndicator = new XWUITypingIndicator(
                fastContainer,
                { visible: true },
                { userName: 'Fast Animation', animationSpeed: 'fast' }
            );
            
            tester.setStatus('✅ XWUITypingIndicator initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITypingIndicator test error:', error);
        }
