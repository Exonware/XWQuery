import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIWorkflow/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIWorkflow } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIWorkflow Component Tester',
            desc: 'Interactive workflow visualization component with nodes and connections.',
            componentName: 'XWUIWorkflow'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiworkflow-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Sample workflow data
        const sampleWorkflow = {
            schema: {
                nodeTypes: {
                    trigger: {
                        icon: "⚡️",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#FF4A4A", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 40, right: 12 } },
                        ports: { top: [], bottom: [], left: [], right: [{ id: "out_1", direction: "out", label: "Message", color: "#FF4A4A" }] },
                    },
                    slack: {
                        icon: "💬",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#4A154B", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 12, right: 12 } },
                        ports: { top: [], bottom: [], left: [{ id: "in_1", direction: "in", label: "Input", color: "#4A154B" }], right: [] },
                    },
                    postgres: {
                        icon: "🗄️",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#336791", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 40, right: 40 } },
                        ports: { top: [{ id: "in_1", direction: "in", label: "Input", color: "#336791" }], bottom: [], left: [], right: [] },
                    },
                    aiAgent: {
                        icon: "🤖",
                        layout: 'full',
                        size: { width: 200, height: 80 },
                        style: { border: { color: "#6366f1", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 12, right: 12 } },
                        ports: {
                            top: [{ id: "in_tool", direction: "in", label: "Tool Input", color: "#3b82f6" }],
                            bottom: [{ id: "out_memory", direction: "out", label: "Memory", color: "#336791" }, { id: "out_llm", direction: "out", label: "LLM", color: "#ec4899" }],
                            left: [{ id: "in_message", direction: "in", label: "Message", color: "#FF4A4A" }],
                            right: [{ id: "out_tool", direction: "out", label: "Tool", color: "#3b82f6" }],
                        },
                    },
                    llm: {
                        icon: "🧠",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#ec4899", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 40, right: 40 } },
                        ports: { top: [{ id: "in_prompt", direction: "in", label: "Prompt", color: "#ec4899" }], right: [], bottom: [], left: [] },
                    },
                    vector: {
                        icon: "🔍",
                        layout: 'full',
                        size: { width: 220, height: 80 },
                        style: { border: { color: "#3b82f6", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 40, right: 40 } },
                        ports: { top: [], bottom: [{ id: "out_embeddings", direction: "out", label: "Embeddings", color: "#f59e0b" }], left: [{ id: "in_1", direction: "in", label: "Input", color: "#3b82f6" }], right: [] },
                    },
                    embeddings: {
                        icon: "✨",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#f59e0b", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 40, right: 40 } },
                        ports: { top: [{ id: "in_1", direction: "in", label: "Input", color: "#f59e0b" }], bottom: [], left: [], right: [] },
                    },
                    placeholder: {
                        icon: "❓",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#9ca3af", style: "dashed", width: 2 }, background: { color: "#1f2937" }, cornerRadius: { left: 12, right: 12 } },
                        ports: { top: [], bottom: [], right: [], left: [{ id: "in_placeholder", direction: 'in', label: 'Input', color: '#9ca3af' }] },
                    }
                }
            },
            data: {
                nodes: [
                    { id: "node_1", typeId: "trigger", title: "When chat message received", position: { x: 200, y: 300 } },
                    { id: "node_2", typeId: "slack", title: "Slack", position: { x: 450, y: 150 } },
                    { id: "node_3", typeId: "aiAgent", title: "AI Agent", position: { x: 450, y: 300 } },
                    { id: "node_4", typeId: "llm", title: "OpenAI Chat Model", position: { x: 450, y: 475 } },
                    { id: "node_5", typeId: "postgres", title: "Postgres Chat Memory", position: { x: 700, y: 475 } },
                    { id: "node_6", typeId: "vector", title: "Vector Store Tool", position: { x: 700, y: 300 } },
                ],
                connections: [
                    { id: "conn_1", sourceNodeId: "node_1", sourcePortId: "out_1", targetNodeId: "node_3", targetPortId: "in_message" },
                    { id: "conn_2", sourceNodeId: "node_1", sourcePortId: "out_1", targetNodeId: "node_2", targetPortId: "in_1" },
                    { id: "conn_3", sourceNodeId: "node_3", sourcePortId: "out_llm", targetNodeId: "node_4", targetPortId: "in_prompt" },
                    { id: "conn_4", sourceNodeId: "node_3", sourcePortId: "out_memory", targetNodeId: "node_5", targetPortId: "in_1" },
                    { id: "conn_5", sourceNodeId: "node_3", sourcePortId: "out_tool", targetNodeId: "node_6", targetPortId: "in_1" },
                ],
            }
        };
        
        const workflow = new XWUIWorkflow(
            document.getElementById('workflow-1'),
            { workflow: sampleWorkflow },
            {
                showTabs,
                defaultTab: 'view'
            }
        );
        
        tester.data.componentInstance = workflow;
        tester.data.componentConfig = workflow.config;
        tester.data.componentData = workflow.data;
        tester.setStatus('Component loaded successfully', 'success');
