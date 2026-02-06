import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAvatar/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAvatar } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAvatar Component Tester',
            desc: 'User avatar with image/initials fallback and status indicator.',
            componentName: 'XWUIAvatar'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiavatar-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Sizes
            new XWUIAvatar(document.getElementById('avatar-xs'), { name: 'XS' }, { size: 'xs' });
            new XWUIAvatar(document.getElementById('avatar-small'), { name: 'S' }, { size: 'small' });
            new XWUIAvatar(document.getElementById('avatar-medium'), { name: 'M' }, { size: 'medium' });
            new XWUIAvatar(document.getElementById('avatar-large'), { name: 'L' }, { size: 'large' });
            new XWUIAvatar(document.getElementById('avatar-xl'), { name: 'XL' }, { size: 'xl' });
            
            // Shapes
            new XWUIAvatar(document.getElementById('avatar-circle'), { name: 'Circle' }, { shape: 'circle' });
            new XWUIAvatar(document.getElementById('avatar-square'), { name: 'Square' }, { shape: 'square' });
            
            // With image
            new XWUIAvatar(document.getElementById('avatar-image-1'), { src: 'https://i.pravatar.cc/100?img=1' }, {});
            new XWUIAvatar(document.getElementById('avatar-image-2'), { src: 'https://i.pravatar.cc/100?img=2' }, { size: 'large' });
            new XWUIAvatar(document.getElementById('avatar-image-3'), { src: 'https://i.pravatar.cc/100?img=3', alt: 'User' }, { size: 'xl' });
            
            // With initials
            new XWUIAvatar(document.getElementById('avatar-initials-1'), { name: 'John Doe' }, {});
            new XWUIAvatar(document.getElementById('avatar-initials-2'), { name: 'Jane Smith' }, { size: 'large' });
            new XWUIAvatar(document.getElementById('avatar-initials-3'), { name: 'Bob' }, {});
            new XWUIAvatar(document.getElementById('avatar-initials-4'), { name: 'Alice Johnson' }, { size: 'large' });
            
            // With status
            new XWUIAvatar(document.getElementById('avatar-online'), { name: 'Online User' }, { status: 'online' });
            new XWUIAvatar(document.getElementById('avatar-offline'), { name: 'Offline User' }, { status: 'offline' });
            new XWUIAvatar(document.getElementById('avatar-away'), { name: 'Away User' }, { status: 'away' });
            new XWUIAvatar(document.getElementById('avatar-busy'), { name: 'Busy User' }, { status: 'busy' });
            
            // Bordered
            new XWUIAvatar(document.getElementById('avatar-bordered-1'), { name: 'Bordered' }, { bordered: true });
            new XWUIAvatar(document.getElementById('avatar-bordered-2'), { src: 'https://i.pravatar.cc/100?img=5' }, { bordered: true, size: 'large' });
            
            tester.setStatus('✅ XWUIAvatar initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAvatar test error:', error);
        }
