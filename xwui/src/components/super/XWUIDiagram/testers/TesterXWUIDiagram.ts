import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDiagram/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIDiagram } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDiagram Component Tester',
            desc: 'Diagram/flowchart builder with nodes and connections.',
            componentName: 'XWUIDiagram'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuidiagram-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('diagram-basic');
            const basicDiagram = new XWUIDiagram(
                basicContainer,
                {}
            );
            
            basicDiagram.onChange(() => {
                console.log('Diagram changed:', {
                    nodes: basicDiagram.getNodes(),
                    connections: basicDiagram.getConnections()
                });
            });
            
            // Pre-configured
            const configuredContainer = document.getElementById('diagram-configured');
            const configuredDiagram = new XWUIDiagram(
                configuredContainer,
                {
                    nodes: [
                        {
                            id: 'node1',
                            type: 'rectangle',
                            x: 100,
                            y: 100,
                            width: 120,
                            height: 80,
                            label: 'Start'
                        },
                        {
                            id: 'node2',
                            type: 'diamond',
                            x: 300,
                            y: 100,
                            width: 120,
                            height: 100,
                            label: 'Decision'
                        },
                        {
                            id: 'node3',
                            type: 'rectangle',
                            x: 500,
                            y: 100,
                            width: 120,
                            height: 80,
                            label: 'End'
                        }
                    ],
                    connections: [
                        {
                            id: 'conn1',
                            from: 'node1',
                            to: 'node2'
                        },
                        {
                            id: 'conn2',
                            from: 'node2',
                            to: 'node3'
                        }
                    ]
                }
            );
            
            tester.setStatus('✅ XWUIDiagram initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIDiagram test error:', error);
        }
