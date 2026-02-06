import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIVideoPlayer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIVideoPlayer } from '../index.ts';
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIVideoPlayer Component Tester',
            desc: 'This page tests the XWUIVideoPlayer component.',
            componentName: 'XWUIVideoPlayer'
        }, {});
        const testArea = tester.getTestArea();
        testArea.innerHTML = '<div id="player-container" style="width: 100%; min-height: 400px;"></div>';
        try {
            const container = document.getElementById('player-container');
            const player = new XWUIVideoPlayer(container, {
                sources: [{ src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }]
            }, {});
            tester.data.componentInstance = player;
            tester.data.componentConfig = player.config;
            tester.data.componentData = player.data;
            tester.setStatus('✅ XWUIVideoPlayer component initialized successfully', 'success');
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
        }
