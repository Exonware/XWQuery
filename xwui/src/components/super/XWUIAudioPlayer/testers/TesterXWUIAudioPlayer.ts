import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAudioPlayer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIAudioPlayer } from '../index.ts';
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAudioPlayer Component Tester',
            desc: 'This page tests the XWUIAudioPlayer component.',
            componentName: 'XWUIAudioPlayer'
        }, {});
        const testArea = tester.getTestArea();
        testArea.innerHTML = '<div id="player-container" style="width: 100%; min-height: 200px;"></div>';
        try {
            const container = document.getElementById('player-container');
            const player = new XWUIAudioPlayer(container, {
                sources: [{ src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }],
                title: 'Sample Audio',
                artist: 'SoundHelix'
            }, {});
            tester.data.componentInstance = player;
            tester.data.componentConfig = player.config;
            tester.data.componentData = player.data;
            tester.setStatus('✅ XWUIAudioPlayer component initialized successfully', 'success');
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
        }
