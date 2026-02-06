import { XWUITester } from '../../../component/XWUITester/index.ts';
        
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIScriptEditor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIScriptEditor - Three Usage Patterns',
            desc: 'This demo shows all 3 ways to use XWUIScriptEditor, and React Full Name.',
            componentName: 'XWUIScriptEditor'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiscript-editor.three-ways-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Import React from ESM CDN
        import React from "https://esm.sh/react@19";
        import { createRoot } from "https://esm.sh/react-dom@19/client";
        
        // Import component index (auto-registers <xwui-script-editor> via createXWUIElement)
        import '../index.ts';
        
        console.log('Custom Element registered:', customElements.get('xwui-script-editor') !== undefined);
        
        // Set up the custom element with proper JSON (avoiding HTML attribute escaping issues)
        const customElement = document.getElementById('custom-element-demo');
        if (customElement) {
            customElement.setAttribute('conf-comp', JSON.stringify({
                grammar: 'json',
                engine: 'monaco',
                height: '300px'
            }));
            customElement.setAttribute('data', JSON.stringify({
                content: '{\n  "method": "custom-element",\n  "example": true\n}'
            }));
        }
        
        // Use React from ESM imports
        const ReactModule = React;
        const ReactDOMModule = { createRoot };
        
        // Import React wrappers from react.ts
        // Note: react.ts imports React, but since React is externalized,
        // we need to provide it via import map or use a workaround
        // For now, we'll create the wrapper manually using CDN React
        const { XWUIScriptEditor } = await import('../XWUIScriptEditor.ts');
        
        // Create React wrapper manually using CDN React
        const createReactWrapper = (ComponentClass) => {
            return (props) => {
                const containerRef = ReactModule.useRef(null);
                const instanceRef = ReactModule.useRef(null);
                
                ReactModule.useEffect(() => {
                    if (!containerRef.current) return;
                    
                    const instance = new ComponentClass(
                        containerRef.current,
                        props.data || {},
                        props.conf_comp || {},
                        props.conf_sys,
                        props.conf_usr
                    );
                    
                    instanceRef.current = instance;
                    
                    return () => {
                        if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
                            instanceRef.current.destroy();
                        }
                        instanceRef.current = null;
                    };
                }, []);
                
                ReactModule.useEffect(() => {
                    if (instanceRef.current && props.data) {
                        // Update data
                        Object.assign(instanceRef.current.data, props.data);
                        // If content changed, update the editor using setContent method
                        if (props.data.content !== undefined && instanceRef.current.setContent) {
                            instanceRef.current.setContent(props.data.content);
                        }
                    }
                }, [props.data]);
                
                ReactModule.useEffect(() => {
                    if (instanceRef.current && props.conf_comp) {
                        // Update config
                        Object.assign(instanceRef.current.config, props.conf_comp);
                        // Note, but for now just update
                        // Components can handle config updates internally if needed
                    }
                }, [props.conf_comp]);
                
                return ReactModule.createElement('div', {
                    ref,
                    className: props.className,
                    style: props.style
                });
            };
        };
        
        const ScriptEditor = createReactWrapper(XWUIScriptEditor);
        const XWUIScriptEditorComponent = createReactWrapper(XWUIScriptEditor);
        
        // Method 2: Simple name - <ScriptEditor>
        const SimpleEditor = ReactModule.createElement(ScriptEditor, {
            conf_comp: { 
                grammar: 'json', 
                engine: 'monaco', 
                height: '300px'
            },
            data: { 
                content: '{\n  "method": "react-simple",\n  "example": true\n}' 
            }
        });
        
        // Method 3: Full name - <XWUIScriptEditor>
        const FullNameEditor = ReactModule.createElement(XWUIScriptEditorComponent, {
            conf_comp: { 
                grammar: 'javascript', 
                engine: 'codemirror6', 
                height: '300px'
            },
            data: { 
                content: 'function example() {\n  return "react-fullname";\n}' 
            }
        });
        
        // Render both components using React 18 createRoot
        const rootSimple = createRoot(document.getElementById('react-root-simple'));
        rootSimple.render(SimpleEditor);
        
        const rootFullName = createRoot(document.getElementById('react-root-fullname'));
        rootFullName.render(FullNameEditor);
        
        console.log('React components rendered successfully');
