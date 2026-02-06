import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITooltip/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { tooltip } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITooltip Component Tester',
            desc: 'Hover tooltip with placement options.',
            componentName: 'XWUITooltip'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitooltip-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Placements
            const btnTop = document.getElementById('btn-top');
            if (btnTop) tooltip(btnTop, 'This is a tooltip on top', { placement: 'top' });
            const btnBottom = document.getElementById('btn-bottom');
            if (btnBottom) tooltip(btnBottom, 'This is a tooltip on bottom', { placement: 'bottom' });
            const btnLeft = document.getElementById('btn-left');
            if (btnLeft) tooltip(btnLeft, 'This is a tooltip on left', { placement: 'left' });
            const btnRight = document.getElementById('btn-right');
            if (btnRight) tooltip(btnRight, 'This is a tooltip on right', { placement: 'right' });
            const btnCenter = document.getElementById('btn-center');
            if (btnCenter) tooltip(btnCenter, 'This is a tooltip', { placement: 'top' });
            
            // Triggers
            const btnHover = document.getElementById('btn-hover');
            if (btnHover) tooltip(btnHover, 'Hover tooltip (default)', { trigger: 'hover' });
            const btnClick = document.getElementById('btn-click');
            if (btnClick) tooltip(btnClick, 'Click tooltip - click to toggle', { trigger: 'click' });
            const inputFocus = document.getElementById('input-focus');
            if (inputFocus) tooltip(inputFocus, 'Focus tooltip - focus the input', { trigger: 'focus' });
            
            // Arrow
            const btnArrow = document.getElementById('btn-arrow');
            if (btnArrow) tooltip(btnArrow, 'Tooltip with arrow', { arrow: true });
            const btnNoArrow = document.getElementById('btn-no-arrow');
            if (btnNoArrow) tooltip(btnNoArrow, 'Tooltip without arrow', { arrow: false });
            
            tester.setStatus('✅ XWUITooltip initialized successfully - Hover over buttons to see tooltips', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITooltip test error:', error);
        }
