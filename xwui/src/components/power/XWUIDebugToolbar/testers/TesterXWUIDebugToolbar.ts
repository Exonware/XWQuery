import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDebugToolbar/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIDebugToolbar } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDebugToolbar Component Tester',
            desc: 'Debug toolbar with play/pause/step controls and breakpoint management.',
            componentName: 'XWUIDebugToolbar'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuidebug-toolbar-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('debug-basic');
            const basicDebug = new XWUIDebugToolbar(
                basicContainer,
                {
                    isRunning: true,
                    isPaused: false,
                    breakpoints: [
                        { id: 'bp1', line: 10, file: 'app.js', enabled: true },
                        { id: 'bp2', line: 25, file: 'utils.js', enabled: true, condition: 'x > 5' }
                    ],
                    variables: [
                        { name: 'x', value: 10, type: 'number', scope: 'local' },
                        { name: 'y', value: 'hello', type: 'string', scope: 'local' }
                    ],
                    callStack: [
                        { file: 'app.js', line: 15, function: 'main' },
                        { file: 'utils.js', line: 5, function: 'processData' }
                    ]
                }
            );
            
            basicDebug.onAction('play', () => {
                console.log('Play clicked');
                tester.setStatus('✅ Play action triggered', 'success');
            });
            
            // Paused
            const pausedContainer = document.getElementById('debug-paused');
            const pausedDebug = new XWUIDebugToolbar(
                pausedContainer,
                {
                    isRunning: false,
                    isPaused: true,
                    breakpoints: [
                        { id: 'bp1', line: 10, file: 'app.js', enabled: true, hitCount: 3 }
                    ],
                    variables: [
                        { name: 'counter', value: 42, type: 'number', scope: 'local' },
                        { name: 'items', value: [1, 2, 3], type: 'array', scope: 'local' }
                    ],
                    callStack: [
                        { file: 'app.js', line: 10, function: 'processItems' },
                        { file: 'app.js', line: 5, function: 'main' }
                    ],
                    currentLine: 10,
                    currentFile: 'app.js'
                }
            );
            
            tester.setStatus('✅ XWUIDebugToolbar initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIDebugToolbar test error:', error);
        }
