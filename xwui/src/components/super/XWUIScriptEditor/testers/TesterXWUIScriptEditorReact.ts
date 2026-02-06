import { XWUITester } from '../../../component/XWUITester/index.ts';
        
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIScriptEditor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIScriptEditor - React Component Tester',
            desc: 'React component wrapper for XWUIScriptEditor with grammar selection.',
            componentName: 'XWUIScriptEditor'
        }, {});
        
        const testArea = tester.getTestArea();
        const controlsElement = tester.getControlsElement();
        
        // Add controls to controls area
        controlsElement.innerHTML = `
            <label for="grammar-select" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                Select Grammar (auto-loads sample file):
            </label>
            <select id="grammar-select" style="padding: 0.5rem; font-size: 1em; min-width: 250px;">
                <option value="json" selected>Loading grammars...</option>
            </select>
        `;
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiscript-editor-react-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Import React from ESM CDN
        import React from "https://esm.sh/react@19";
        import { createRoot } from "https://esm.sh/react-dom@19/client";
        
        // Import component class and grammar utilities
        import { XWUIScriptEditor } from '../XWUIScriptEditor.ts';
        import { getAllGrammars } from '../index.ts';
        
        // Create React wrapper manually (using CDN React) with flat props support
        const createScriptEditorWrapper = () => {
            return (props) => {
                const containerRef = React.useRef(null);
                const instanceRef = React.useRef(null);
                const prevConfigRef = React.useRef(null);
                
                // Normalize flat props into conf_comp and data
                const flatPropsToConfig = ['grammar', 'fileName', 'engine', 'mode', 'height'];
                const flatPropsToData = ['content'];
                
                const { conf_comp = {}, data = {}, conf_sys, conf_usr, ...flatProps } = props;
                
                // Merge flat props into conf_comp
                const mergedConfComp = { ...conf_comp };
                flatPropsToConfig.forEach(prop => {
                    if (flatProps[prop] !== undefined) {
                        mergedConfComp[prop] = flatProps[prop];
                    }
                });
                
                // Merge flat props into data
                const mergedData = { ...data };
                flatPropsToData.forEach(prop => {
                    if (flatProps[prop] !== undefined) {
                        mergedData[prop] = flatProps[prop];
                    }
                });
                
                React.useEffect(() => {
                    if (!containerRef.current) return;
                    
                    const instance = new XWUIScriptEditor(
                        containerRef.current,
                        mergedData,
                        mergedConfComp,
                        conf_sys,
                        conf_usr
                    );
                    
                    instanceRef.current = instance;
                    prevConfigRef.current = { ...mergedConfComp };
                    
                    return () => {
                        if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
                            instanceRef.current.destroy();
                        }
                        instanceRef.current = null;
                        prevConfigRef.current = null;
                    };
                }, []); // Only initialize once
                
                // Update data when it changes
                React.useEffect(() => {
                    if (instanceRef.current && mergedData) {
                        Object.assign(instanceRef.current.data, mergedData);
                        if (mergedData.content !== undefined && instanceRef.current.setContent) {
                            instanceRef.current.setContent(mergedData.content);
                        }
                    }
                }, [props.content, props.data]);
                
                // Update config when it changes
                React.useEffect(() => {
                    if (!instanceRef.current) return;
                    
                    const oldConfig = prevConfigRef.current || {};
                    const newConfig = mergedConfComp;
                    
                    // Check if config changes require reinitialization
                    const needsReinit = (
                        (newConfig.engine && newConfig.engine !== oldConfig.engine) ||
                        (newConfig.mode && newConfig.mode !== oldConfig.mode) ||
                        (newConfig.height && newConfig.height !== oldConfig.height)
                    );
                    
                    if (needsReinit) {
                        const destroyPromise = instanceRef.current.destroy ? 
                            Promise.resolve(instanceRef.current.destroy()) : 
                            Promise.resolve();
                        
                        destroyPromise.then(() => {
                            if (containerRef.current) {
                                containerRef.current.innerHTML = '';
                                const newInstance = new XWUIScriptEditor(
                                    containerRef.current,
                                    mergedData,
                                    newConfig,
                                    conf_sys,
                                    conf_usr
                                );
                                instanceRef.current = newInstance;
                                prevConfigRef.current = { ...newConfig };
                            }
                        }).catch(console.error);
                    } else {
                        Object.assign(instanceRef.current.config, newConfig);
                        prevConfigRef.current = { ...newConfig };
                        
                        if (newConfig.grammar && newConfig.grammar !== oldConfig.grammar) {
                            instanceRef.current.setGrammar?.(newConfig.grammar);
                        }
                    }
                }, [props.grammar, props.engine, props.mode, props.height, props.conf_comp]);
                
                return React.createElement('div', {
                    ref,
                    className: props.className,
                    style: props.style
                });
            };
        };
        
        const ScriptEditor = createScriptEditorWrapper();
        
        // State for component props
        let currentGrammar = 'json';
        let currentContent = '{"example": true}';
        let root = null;
        
        // Map grammar IDs to actual sample file names (handles mismatches between JSON IDs and file names)
        function getSampleFileName(grammarId) {
            const fileMapping = {
                'protobuf': 'proto',              // JSON: "protobuf" → File: "sample.proto"
                'capnproto': 'capnp',            // JSON: "capnproto" → File: "sample.capnp"
                'flatbuffers': 'fbs',            // JSON: "flatbuffers" → File: "sample.fbs"
                'json_query': 'jsonquery',       // JSON: "json_query" → File: "sample.jsonquery"
                'xml_query': 'xmlquery',         // JSON: "xml_query" → File: "sample.xmlquery"
                'xwnode_executor': 'xwnodeexecutor', // JSON: "xwnode_executor" → File: "sample.xwnodeexecutor"
                'matlab': 'matlabmat',           // JSON: "matlab" → File: "sample.matlabmat"
                'plaintext': 'text',             // JSON: "plaintext" → File: "sample.text"
                'messagepack': 'msgpack'         // JSON: "messagepack" → File: "sample.msgpack"
                // Note: 'mermaid' has no sample file, so it will be filtered out
            };
            return fileMapping[grammarId] || grammarId;
        }
        
        // Map file names back to grammar IDs (reverse mapping)
        function getGrammarIdFromFileName(fileName) {
            // Remove "sample." prefix
            const fileId = fileName.replace(/^sample\./, '');
            
            // Reverse mapping: file name → grammar ID
            const reverseMapping = {
                'proto': 'protobuf',
                'capnp': 'capnproto',
                'fbs': 'flatbuffers',
                'jsonquery': 'json_query',
                'xmlquery': 'xml_query',
                'xwnodeexecutor': 'xwnode_executor',
                'matlabmat': 'matlab',
                'text': 'plaintext',
                'msgpack': 'messagepack'
            };
            
            return reverseMapping[fileId] || fileId;
        }
        
        // Get list of actual sample files that exist (root cause fix)
        async function getAvailableSampleFiles() {
            try {
                // Known list of files that actually exist in the files/ directory
                const knownFiles = [
                    'sample.apache', 'sample.avro', 'sample.bash', 'sample.batch', 'sample.bson',
                    'sample.c', 'sample.capnp', 'sample.cbor', 'sample.configparser', 'sample.cpp',
                    'sample.cql', 'sample.csharp', 'sample.css', 'sample.csv', 'sample.cypher',
                    'sample.datalog', 'sample.dbm', 'sample.dockerfile', 'sample.elasticsearch',
                    'sample.eql', 'sample.fbs', 'sample.feather', 'sample.flux', 'sample.formdata',
                    'sample.go', 'sample.gql', 'sample.graphdb', 'sample.graphql', 'sample.gremlin',
                    'sample.hdf5', 'sample.hiveql', 'sample.hql', 'sample.html', 'sample.ini',
                    'sample.java', 'sample.javascript', 'sample.jmespath', 'sample.jq', 'sample.json',
                    'sample.json5', 'sample.jsoniq', 'sample.jsonl', 'sample.jsonquery', 'sample.kotlin',
                    'sample.kql', 'sample.latex', 'sample.leveldb', 'sample.linq', 'sample.lmdb',
                    'sample.log', 'sample.logql', 'sample.makefile', 'sample.markdown', 'sample.marshal',
                    'sample.matlabmat', 'sample.messagepack', 'sample.mongodb', 'sample.multipart',
                    'sample.n1ql', 'sample.netcdf', 'sample.nginx', 'sample.orc', 'sample.parquet',
                    'sample.partiql', 'sample.php', 'sample.pickle', 'sample.pig', 'sample.plist',
                    'sample.powershell', 'sample.promql', 'sample.proto', 'sample.python',
                    'sample.regex', 'sample.restructuredtext', 'sample.ruby', 'sample.rust',
                    'sample.scala', 'sample.shell', 'sample.sparql', 'sample.sql', 'sample.sqlite3',
                    'sample.swift', 'sample.text', 'sample.thrift', 'sample.toml', 'sample.tsv',
                    'sample.typescript', 'sample.ubjson', 'sample.xml', 'sample.xmlquery',
                    'sample.xpath', 'sample.xquery', 'sample.xwnodeexecutor', 'sample.xwquery',
                    'sample.xwqueryscript', 'sample.yaml', 'sample.zarr'
                ];
                
                return new Set(knownFiles);
            } catch (error) {
                console.error('Error getting available sample files:', error);
                return new Set();
            }
        }
        
        // Populate grammar selector dynamically based on available grammars and sample files
        async function populateGrammars() {
            try {
                const grammarSelect = document.getElementById('grammar-select');
                const allGrammars = getAllGrammars();
                
                // Get list of actual sample files that exist (root cause fix - no 404s)
                const availableSampleFiles = await getAvailableSampleFiles();
                
                // Create a set of grammar IDs that have sample files
                const grammarIdsWithFiles = new Set();
                availableSampleFiles.forEach(fileName => {
                    const grammarId = getGrammarIdFromFileName(fileName);
                    grammarIdsWithFiles.add(grammarId);
                });
                
                // Filter to only grammars that have sample files
                const availableGrammars = allGrammars.filter(grammar => 
                    grammarIdsWithFiles.has(grammar.id)
                );
                
                // Group by category
                const groups = {};
                availableGrammars.forEach(grammar => {
                    const category = grammar.category || 'Other';
                    if (!groups[category]) {
                        groups[category] = [];
                    }
                    groups[category].push(grammar);
                });
                
                // Sort categories and grammars within categories
                const sortedCategories = Object.keys(groups).sort();
                sortedCategories.forEach(category => {
                    groups[category].sort((a, b) => a.name.localeCompare(b.name));
                });
                
                // Clear and populate selector
                grammarSelect.innerHTML = '';
                
                sortedCategories.forEach(category => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = category;
                    groups[category].forEach(grammar => {
                        const option = document.createElement('option');
                        option.value = grammar.id;
                        option.textContent = grammar.name;
                        if (grammar.id === 'json') {
                            option.selected = true;
                            currentGrammar = 'json';
                        }
                        optgroup.appendChild(option);
                    });
                    grammarSelect.appendChild(optgroup);
                });
                
                console.log(`Loaded ${availableGrammars.length} grammars with sample files`);
            } catch (error) {
                console.error('Error populating grammars:', error);
                // Fallback to JSON
                const grammarSelect = document.getElementById('grammar-select');
                grammarSelect.innerHTML = '<option value="json" selected>JSON</option>';
            }
        }
        
        // Load sample content from files folder
        async function loadSampleContent(grammarId) {
            try {
                // Map grammar ID to actual file name
                const fileId = getSampleFileName(grammarId);
                // Path relative to tester HTML location: testers/files/sample.{fileId}
                // Works in both dev (src/) and production (dist/) builds
                const fileName = `files/sample.${fileId}`;
                const response = await fetch(fileName);
                if (response.ok) {
                    const content = await response.text();
                    currentContent = content;
                    // Update grammar to match the loaded file
                    currentGrammar = grammarId;
                    renderEditor();
                } else {
                    // Fallback: keep current content if file not found (don't show error message)
                    console.debug(`Sample file not found: ${fileName}, keeping current content`);
                    currentGrammar = grammarId;
                    // Only update grammar, don't change content
                    renderEditor();
                }
            } catch (error) {
                // Don't show error - just keep current content
                console.debug(`Error loading sample file for grammar ${grammarId}:`, error);
                currentGrammar = grammarId;
                renderEditor();
            }
        }
        
        // Render function
        // - Loads file content from files/ folder (sample files)
        // - Passes grammar ID to component (component uses grammars/ folder for syntax highlighting)
        const renderEditor = () => {
            const editorElement = React.createElement(ScriptEditor, {
                grammar,  // Grammar ID from grammars_master.json - component uses grammars/ folder
                engine: "monaco",
                height: "400px",
                content: currentContent   // File content loaded from files/ folder
            });
            
            if (!root) {
                root = createRoot(document.getElementById('react-root'));
            }
            
            root.render(editorElement);
        };
        
        // Grammar selector change handler
        const grammarSelect = document.getElementById('grammar-select');
        grammarSelect.addEventListener('change', async () => {
            const newGrammar = grammarSelect.value;
            // Update grammar first, then load content
            currentGrammar = newGrammar;
            await loadSampleContent(newGrammar);
        });
        
        // Initialize, then load initial content
        await populateGrammars();
        await loadSampleContent(currentGrammar);
        renderEditor();
        
        console.log('React ScriptEditor tester initialized');
