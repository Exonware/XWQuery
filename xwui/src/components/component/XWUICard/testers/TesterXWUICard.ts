
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUICard } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICard/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICard Component Tester',
            desc: 'Content card container with header, body, footer slots.',
            componentName: 'XWUICard'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicard-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Variants
            new XWUICard(document.getElementById('card-default'), {
                title: 'Default Card',
                content: '<p>This is a default card with standard styling.</p>'
            }, { variant: 'default' });
            
            new XWUICard(document.getElementById('card-outlined'), {
                title: 'Outlined Card',
                content: '<p>This card has an outlined border.</p>'
            }, { variant: 'outlined' });
            
            new XWUICard(document.getElementById('card-elevated'), {
                title: 'Elevated Card',
                content: '<p>This card has an elevated shadow.</p>'
            }, { variant: 'elevated' });
            
            new XWUICard(document.getElementById('card-filled'), {
                title: 'Filled Card',
                content: '<p>This card has a filled background.</p>'
            }, { variant: 'filled' });
            
            // With cover
            new XWUICard(document.getElementById('card-cover-1'), {
                cover: 'https://picsum.photos/400/200',
                title: 'Card with Cover',
                content: '<p>This card has a cover image at the top.</p>'
            }, {});
            
            new XWUICard(document.getElementById('card-cover-2'), {
                cover: 'https://picsum.photos/400/200?random=2',
                title: 'Beautiful Image',
                subtitle: 'A stunning landscape',
                content: '<p>This card demonstrates cover image with subtitle.</p>'
            }, { variant: 'elevated' });
            
            // Hoverable
            new XWUICard(document.getElementById('card-hoverable'), {
                title: 'Hoverable Card',
                content: '<p>Hover over this card to see the effect.</p>'
            }, { hoverable: true });
            
            // Clickable
            const clickable = new XWUICard(document.getElementById('card-clickable'), {
                title: 'Clickable Card',
                content: '<p>Click this card to trigger an action.</p>'
            }, { clickable: true });
            
            clickable.onClick(() => {
                tester.setStatus('✅ Card clicked', 'success');
            });
            
            // Padding variants
            new XWUICard(document.getElementById('card-padding-none'), {
                title: 'No Padding',
                content: '<p>This card has no padding.</p>'
            }, { padding: 'none' });
            
            new XWUICard(document.getElementById('card-padding-small'), {
                title: 'Small Padding',
                content: '<p>This card has small padding.</p>'
            }, { padding: 'small' });
            
            new XWUICard(document.getElementById('card-padding-medium'), {
                title: 'Medium Padding',
                content: '<p>This card has medium padding (default).</p>'
            }, { padding: 'medium' });
            
            new XWUICard(document.getElementById('card-padding-large'), {
                title: 'Large Padding',
                content: '<p>This card has large padding.</p>'
            }, { padding: 'large' });
            
            // XWUITitled examples
            new XWUICard(document.getElementById('card-titled-icon'), {
                icon: 'user',
                title: 'Card with Icon',
                subtitle: 'Using XWUITitled component',
                body: '<p>This card uses XWUITitled with an icon, title, and subtitle.</p>'
            }, { iconSize: 64 });
            
            new XWUICard(document.getElementById('card-titled-full'), {
                icon: 'star',
                title: 'Full Featured Title',
                subtitle: 'Subtitle text here',
                body: '<p>This demonstrates XWUITitled with all features, and body content.</p>'
            }, { variant: 'elevated', iconSize: 64 });
            
            // Badge examples
            new XWUICard(document.getElementById('card-badge-count'), {
                title: 'Card with Badge',
                badge: 5,
                content: '<p>This card has a badge with a count next to the title.</p>'
            }, {});
            
            new XWUICard(document.getElementById('card-badge-text'), {
                title: 'Card with Text Badge',
                badge: { text: 'New' },
                content: '<p>This card has a badge with custom text.</p>'
            }, {});
            
            // Tags examples
            new XWUICard(document.getElementById('card-tags-simple'), {
                title: 'Card with Tags',
                content: '<p>This card has simple string tags in the footer.</p>',
                tags: ['Tag 1', 'Tag 2', 'Tag 3']
            }, {});
            
            new XWUICard(document.getElementById('card-tags-variants'), {
                title: 'Card with Tag Variants',
                content: '<p>This card demonstrates tags with different variants.</p>',
                tags: [
                    { label: 'Default' },
                    { label: 'Primary', variant: 'primary' },
                    { label: 'Success', variant: 'success' }
                ]
            }, {});
            
            // Complete example
            new XWUICard(document.getElementById('card-complete'), {
                image: 'https://picsum.photos/400/200?random=3',
                icon: 'heart',
                title: 'Complete Card Example',
                subtitle: 'All features combined',
                badge: 12,
                body: '<p>This card demonstrates all new features, and XWUITag components in the footer.</p>',
                tags: ['Feature', 'New', 'Enhanced', 'Complete']
            }, { variant: 'elevated', hoverable: true, iconSize: 64 });
            
            tester.setStatus('✅ XWUICard initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICard test error:', error);
        }
