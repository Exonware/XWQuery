import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIChip/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIChip } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIChip Component Tester',
            desc: 'Tag/chip element with closable and clickable variants.',
            componentName: 'XWUIChip'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuichip-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Variants
            new XWUIChip(document.getElementById('chip-default'), { label: 'Default' }, {});
            new XWUIChip(document.getElementById('chip-primary'), { label: 'Primary' }, { variant: 'primary' });
            new XWUIChip(document.getElementById('chip-success'), { label: 'Success' }, { variant: 'success' });
            new XWUIChip(document.getElementById('chip-warning'), { label: 'Warning' }, { variant: 'warning' });
            new XWUIChip(document.getElementById('chip-error'), { label: 'Error' }, { variant: 'error' });
            
            // Sizes
            new XWUIChip(document.getElementById('chip-small'), { label: 'Small' }, { size: 'small' });
            new XWUIChip(document.getElementById('chip-medium'), { label: 'Medium' }, { size: 'medium' });
            new XWUIChip(document.getElementById('chip-large'), { label: 'Large' }, { size: 'large' });
            
            // Closable
            const closable1 = new XWUIChip(document.getElementById('chip-closable-1'), { label: 'Closable 1' }, { closable: true });
            const closable2 = new XWUIChip(document.getElementById('chip-closable-2'), { label: 'Closable 2' }, { closable, variant: 'primary' });
            const closable3 = new XWUIChip(document.getElementById('chip-closable-3'), { label: 'Closable 3' }, { closable, variant: 'success' });
            
            closable1.onClose(() => {
                tester.setStatus('✅ Chip 1 closed', 'success');
            });
            
            // With icon
            const iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>';
            new XWUIChip(document.getElementById('chip-icon-1'), { label: 'With Icon' }, { icon: iconSvg });
            new XWUIChip(document.getElementById('chip-icon-2'), { label: 'Tagged' }, { icon, variant: 'primary' });
            
            // Clickable
            const clickable = new XWUIChip(document.getElementById('chip-clickable'), { label: 'Click Me' }, { clickable, variant: 'primary' });
            clickable.onClick(() => {
                tester.setStatus('✅ Chip clicked', 'success');
            });
            
            tester.setStatus('✅ XWUIChip initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIChip test error:', error);
        }
