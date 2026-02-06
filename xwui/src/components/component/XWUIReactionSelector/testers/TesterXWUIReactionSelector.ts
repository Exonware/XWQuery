import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIReactionSelector/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIReactionSelector } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIReactionSelector Component Tester',
            desc: 'Emoji reaction selector with popover.',
            componentName: 'XWUIReactionSelector'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuireaction-selector-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('reaction-basic');
            const basicReaction = new XWUIReactionSelector(
                basicContainer,
                {}
            );
            
            basicReaction.onReactionChange((emoji, added) => {
                console.log(`Reaction ${added ? 'added' : 'removed'}:`, emoji);
                tester.setStatus(`✅ Reaction ${added ? 'added' : 'removed'}: ${emoji}`, 'success');
            });
            
            // With Initial Reactions
            const initialContainer = document.getElementById('reaction-initial');
            const initialReaction = new XWUIReactionSelector(
                initialContainer,
                {
                    reactions: [
                        { emoji: '👍', count: 5, users: ['Alice', 'Bob', 'Charlie'] },
                        { emoji: '❤️', count: 3, users: ['David', 'Eve'] },
                        { emoji: '😄', count: 2 }
                    ]
                }
            );
            
            // Without Counts
            const noCountContainer = document.getElementById('reaction-no-count');
            const noCountReaction = new XWUIReactionSelector(
                noCountContainer,
                {
                    reactions: [
                        { emoji: '👍', count: 5 },
                        { emoji: '❤️', count: 3 }
                    ]
                },
                {
                    showCount: false
                }
            );
            
            tester.setStatus('✅ XWUIReactionSelector initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIReactionSelector test error:', error);
        }
