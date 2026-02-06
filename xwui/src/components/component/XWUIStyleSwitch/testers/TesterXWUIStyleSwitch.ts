
        import { XWUIStyleSwitch } from '../index.ts';
        import { XWUIStyle } from '../../XWUIStyle/index.ts';
        
        // All components use the same ID to sync together
        const sharedId = 'xwui-style-testers';
        
        // Basic usage
        const basicContainer = document.getElementById('switch-basic');
        if (basicContainer) {
            const basicSwitch = new XWUIStyleSwitch(basicContainer, { id: sharedId }, {
                size: 'small',
                iconSize: 16
            });
        }
        
        // Shared style instance
        const sharedContainer = document.getElementById('switch-shared');
        if (sharedContainer) {
            // Create a shared style instance with the same ID
            const styleContainer = document.createElement('div');
            styleContainer.style.display = 'none';
            document.body.appendChild(styleContainer);
            
            const sharedStyle = new XWUIStyle(styleContainer, { id: sharedId }, {
                basePath: '../../../styles'
            });
            
            const sharedSwitch = new XWUIStyleSwitch(sharedContainer, { id: sharedId }, {
                styleInstance: sharedStyle,
                size: 'small'
            });
        }
        
        // Large icons
        const largeIconsContainer = document.getElementById('switch-large-icons');
        if (largeIconsContainer) {
            const largeIconsSwitch = new XWUIStyleSwitch(largeIconsContainer, { id: sharedId }, {
                size: 'small',
                iconSize: 24
            });
        }
        
        // Medium size
        const mediumContainer = document.getElementById('switch-medium');
        if (mediumContainer) {
            const mediumSwitch = new XWUIStyleSwitch(mediumContainer, { id: sharedId }, {
                size: 'medium',
                iconSize: 16
            });
        }
