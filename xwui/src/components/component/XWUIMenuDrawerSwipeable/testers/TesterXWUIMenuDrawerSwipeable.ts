import { XWUIMenuDrawerSwipeable } from '../index.ts';
        
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMenuDrawerSwipeable/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Test 1: Right drawer
        const container1 = document.getElementById('drawer-container-1');
        const btn1 = document.getElementById('open-drawer-1');
        let drawer1 = null;
        
        btn1?.addEventListener('click', () => {
            if (!container1) return;
            if (!drawer1) {
                drawer1 = new XWUIMenuDrawerSwipeable(container1, {
                    title: 'Right Swipeable Drawer',
                    content: '<p>This is a swipeable drawer from the right. Swipe left to close it.</p><p>You can also click the backdrop or press Escape to close.</p>'
                }, {
                    placement: 'right',
                    swipeable,
                    swipeThreshold: 50
                });
            }
            drawer1.open();
        });
        
        // Test 2: Left drawer
        const container2 = document.getElementById('drawer-container-2');
        const btn2 = document.getElementById('open-drawer-2');
        let drawer2 = null;
        
        btn2?.addEventListener('click', () => {
            if (!container2) return;
            if (!drawer2) {
                drawer2 = new XWUIMenuDrawerSwipeable(container2, {
                    title: 'Left Swipeable Drawer',
                    content: '<p>This is a swipeable drawer from the left. Swipe right to close it.</p>'
                }, {
                    placement: 'left',
                    swipeable: true
                });
            }
            drawer2.open();
        });
        
        // Test 3: Bottom drawer
        const container3 = document.getElementById('drawer-container-3');
        const btn3 = document.getElementById('open-drawer-3');
        let drawer3 = null;
        
        btn3?.addEventListener('click', () => {
            if (!container3) return;
            if (!drawer3) {
                drawer3 = new XWUIMenuDrawerSwipeable(container3, {
                    title: 'Bottom Swipeable Drawer',
                    content: '<p>This is a swipeable drawer from the bottom. Swipe down to close it.</p>'
                }, {
                    placement: 'bottom',
                    swipeable: true
                });
            }
            drawer3.open();
        });
