import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIScriptEditor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIScriptEditor Component Tester',
            desc: 'This page tests the XWUIScriptEditor component with multiple editor engines and centralized grammar system. Test inputs, and other configuration options.',
            componentName: 'XWUIScriptEditor'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiscript-editor-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Suppress browser extension errors (not from our code)
        window.addEventListener('unhandledrejection', (event) => {
            // Suppress known browser extension errors
            const reason = event.reason;
            if (reason) {
                const message = typeof reason === 'string' ? reason : (reason.message || String(reason));
                if (message.includes('message channel closed') || 
                    message.includes('asynchronous response') ||
                    message.includes('listener indicated')) {
                    // This is a browser extension error, not our code
                    event.preventDefault();
                    return;
                }
            }
        });
        
        // Also catch regular errors from extensions
        window.addEventListener('error', (event) => {
            if (event.message && (
                event.message.includes('message channel closed') ||
                event.message.includes('asynchronous response')
            )) {
                event.preventDefault();
            }
        });
        
        const { XWUIScriptEditor, getAllGrammars } = await import('../index.ts');
        
        const container = document.getElementById('scriptEditorContainer');
        const contentInput = document.getElementById('contentInput');
        const grammarSelect = document.getElementById('grammarSelect');
        const engineSelect = document.getElementById('engineSelect');
        const modeSelect = document.getElementById('modeSelect');
        const heightInput = document.getElementById('heightInput');
        const applyButton = document.getElementById('applyButton');
        const getContentButton = document.getElementById('getContentButton');
        const reinitButton = document.getElementById('reinitButton');
        
        let scriptEditor = null;
        
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
        
        // Populate grammar select dynamically based on available grammars and sample files
        async function populateGrammars() {
            try {
                const grammars = getAllGrammars();
                
                // Get list of actual sample files that exist (root cause fix - no 404s)
                const availableSampleFiles = await getAvailableSampleFiles();
                
                // Create a set of grammar IDs that have sample files
                const grammarIdsWithFiles = new Set();
                availableSampleFiles.forEach(fileName => {
                    const grammarId = getGrammarIdFromFileName(fileName);
                    grammarIdsWithFiles.add(grammarId);
                });
                
                // Filter to only grammars that have sample files
                const availableGrammars = grammars.filter(grammar => 
                    grammarIdsWithFiles.has(grammar.id)
                );
                
                // Group by category
                const groups = {};
                availableGrammars.forEach(grammar => {
                    const category = grammar.category || 'Other';
                    // Format category name (replace underscores, capitalize)
                    const formattedCategory = category
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    
                    if (!groups[formattedCategory]) {
                        groups[formattedCategory] = [];
                    }
                    groups[formattedCategory].push(grammar);
                });
                
                // Sort categories and grammars within categories
                const sortedCategories = Object.keys(groups).sort();
                sortedCategories.forEach(category => {
                    groups[category].sort((a, b) => a.name.localeCompare(b.name));
                });
                
                // Clear existing options
                grammarSelect.innerHTML = '<option value="json" selected>JSON</option>';
                
                // Populate with available grammars
                sortedCategories.forEach(category => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = category;
                    groups[category].forEach(grammar => {
                        const option = document.createElement('option');
                        option.value = grammar.id;
                        option.textContent = grammar.name;
                        if (grammar.id === 'json') {
                            option.selected = true;
                        }
                        optgroup.appendChild(option);
                    });
                    grammarSelect.appendChild(optgroup);
                });
                
                console.log(`Loaded ${availableGrammars.length} grammars with sample files`);
            } catch (error) {
                console.error('Error populating grammars:', error);
                // Fallback to JSON
                grammarSelect.innerHTML = '<option value="json" selected>JSON</option>';
            }
        }
        
        async function initializeEditor() {
            try {
                if (!container) {
                    throw new Error('Container not found');
                }
                
                // Destroy existing editor if it exists
                if (scriptEditor) {
                    await scriptEditor.destroy();
                    scriptEditor = null;
                }
                
                // Get data and configuration from inputs
                const data = {
                    content: contentInput.value
                };
                const conf_comp = {
                    grammar: grammarSelect.value,
                    engine: engineSelect.value,
                    mode: modeSelect.value,
                    height: heightInput.value || '70vh'
                };
                
                // Initialize editor (constructor is async internally)
                // Signature: (container, data, conf_comp, conf_sys?, conf_usr?)
                scriptEditor = new XWUIScriptEditor(container, data, conf_comp);
                
                // Wait a bit for async initialization to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log('XWUIScriptEditor initialized:', conf_comp);
            } catch (error) {
                console.error('XWUIScriptEditor initialization error:', error);
                alert('Error initializing editor: ' + error.message);
            }
        }
        
        // Populate grammars and initialize on load
        populateGrammars().then(async () => {
            // Load initial sample content
            await loadSampleContent(grammarSelect.value);
            initializeEditor();
        });
        
        // Apply changes immediately when dropdowns change
        let isInitializing = false;
        
        async function applyChanges() {
            if (isInitializing || !scriptEditor) {
                return;
            }
            
            try {
                const currentEngine = scriptEditor.getEngine();
                const currentMode = modeSelect.value;
                const needsReinit = (
                    currentEngine !== engineSelect.value ||
                    (currentMode === 'view' && modeSelect.value === 'edit') ||
                    (currentMode === 'edit' && modeSelect.value === 'view')
                );
                
                if (needsReinit) {
                    isInitializing = true;
                    await initializeEditor();
                    isInitializing = false;
                } else {
                    // Just update content and grammar
                    scriptEditor.setContent(contentInput.value);
                    await scriptEditor.setGrammar(grammarSelect.value);
                }
            } catch (error) {
                console.error('Error applying changes:', error);
                isInitializing = false;
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
                    contentInput.value = content;
                    if (scriptEditor) {
                        scriptEditor.setContent(content);
                    }
                } else {
                    // Fallback to default content if file not found
                    console.debug(`Sample file not found: ${fileName}, using default content`);
                    // Don't show error - just use current content
                }
            } catch (error) {
                console.debug(`Error loading sample file for grammar ${grammarId}:`, error);
                // Don't show error - just use current content
            }
        }
        
        // Add event listeners for immediate updates
        grammarSelect.addEventListener('change', async () => {
            const grammarId = grammarSelect.value;
            
            // Load sample content from file
            await loadSampleContent(grammarId);
            
            if (scriptEditor && !isInitializing) {
                scriptEditor.setGrammar(grammarId).catch(console.error);
            }
        });
        
        engineSelect.addEventListener('change', () => {
            if (!isInitializing) {
                applyChanges();
            }
        });
        
        modeSelect.addEventListener('change', () => {
            if (!isInitializing) {
                applyChanges();
            }
        });
        
        // Apply button - update editor with new settings
        applyButton.addEventListener('click', async () => {
            if (scriptEditor) {
                try {
                    scriptEditor.setContent(contentInput.value);
                    await scriptEditor.setGrammar(grammarSelect.value);
                    // Note: Engine change requires reinitialization
                    if (scriptEditor.getEngine() !== engineSelect.value) {
                        await initializeEditor();
                    }
                } catch (error) {
                    console.error('Error applying changes:', error);
                    alert('Error applying changes: ' + error.message);
                }
            } else {
                initializeEditor();
            }
        });
        
        // Get content button
        getContentButton.addEventListener('click', () => {
            if (scriptEditor) {
                const content = scriptEditor.getContent();
                const grammar = scriptEditor.getGrammar();
                const engine = scriptEditor.getEngine();
                alert(`Content:\n${content}\n\nGrammar: ${grammar}\nEngine: ${engine}\nMode: ${modeSelect.value}`);
                console.log('Current editor state:', {
                    content,
                    grammar,
                    engine,
                    mode: modeSelect.value
                });
            } else {
                alert('Editor not initialized');
            }
        });
        
        // Reinitialize button
        reinitButton.addEventListener('click', () => {
            initializeEditor();
        });
