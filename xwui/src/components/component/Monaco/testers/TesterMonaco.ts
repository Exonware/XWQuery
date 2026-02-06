
        async function initializeMonaco() {
            const { XWUITester } = await import('../../XWUITester/index.ts');
            
            // Initialize XWUITester
            const tester = new XWUITester(document.getElementById('tester-container'), {
                title: 'Monaco Editor Tester',
                desc: 'Simple tester to verify Monaco Editor loads and works correctly.',
                componentName: 'Monaco'
            }, {});
            
            const testArea = tester.getTestArea();
            
            // Add test content to test area
            const template = document.getElementById('tester-monaco-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
            
            const monacoContainer = document.getElementById('monaco-container');
            const languageSelect = document.getElementById('languageSelect');
            const themeSelect = document.getElementById('themeSelect');
            const getValueButton = document.getElementById('getValueButton');
            const setValueButton = document.getElementById('setValueButton');
            
            function showStatus(message, type) {
                tester.setStatus(message, type);
            }
            
            try {
                showStatus('Loading Monaco Component...', 'info');
                
                // Try to import from dist first (compiled), fallback to source
                let Monaco;
                const importPaths = [
                    '/static/dist/components/Monaco/index.js',      // Server static path
                    '/static/dist/components/Monaco/Monaco.js',     // Alternative static path
                    '../../dist/components/Monaco/index.js',        // Relative from src/testers/
                    '../../dist/components/Monaco/Monaco.js',      // Direct file
                    '../index.js'                // Source fallback
                ];
                
                let lastError = null;
                for (const path of importPaths) {
                    try {
                        Monaco = (await import(path)).Monaco;
                        console.log(`✓ Loaded Monaco from ${path}`);
                        break;
                    } catch (e) {
                        lastError = e;
                        console.warn(`✗ Failed to load from ${path}:`, e.message);
                    }
                }
                
                if (!Monaco) {
                    throw new Error(`Failed to load Monaco from all attempted paths:
${importPaths.map(p => `  - ${p}`).join('\n')}
Last error: ${lastError?.message || lastError}
Please ensure the component is compiled (run 'npm run build' in the frontend directory).`);
                }
                
                showStatus('Monaco Component loaded Creating editor instance...', 'info');
                
                // Create Monaco editor instance
                const monaco = new Monaco(monacoContainer, {
                    value: '{\n  "test": "value",\n  "number": 42\n}',
                    language: 'json',
                    theme: 'vs',
                    fontSize: 14,
                    minimap: { enabled: true },
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    formatOnPaste,
                    formatOnType: true
                });
                
                // Wait for editor to be ready
                const checkReady = setInterval(() => {
                    if (monaco.isReady()) {
                        clearInterval(checkReady);
                        console.log('Monaco editor created:', monaco);
                        showStatus('✅ Monaco Editor initialized successfully', 'success');
                    }
                }, 100);
                
                // Language change
                languageSelect.addEventListener('change', function() {
                    if (monaco.isReady()) {
                        const language = languageSelect.value;
                        monaco.setLanguage(language);
                        console.log('Language changed to:', language);
                        showStatus(`Language changed to: ${language}`, 'info');
                    }
                });
                
                // Theme change
                themeSelect.addEventListener('change', function() {
                    if (monaco.isReady()) {
                        const theme = themeSelect.value;
                        monaco.setTheme(theme);
                        console.log('Theme changed to:', theme);
                        showStatus(`Theme changed to: ${theme}`, 'info');
                    }
                });
                
                // Get value button
                getValueButton.addEventListener('click', function() {
                    if (monaco.isReady()) {
                        const value = monaco.getValue();
                        console.log('Current value:', value);
                        alert(`Current Editor Value:\n\n${value}`);
                    } else {
                        alert('Editor not initialized yet');
                    }
                });
                
                // Set value button
                setValueButton.addEventListener('click', function() {
                    if (monaco.isReady()) {
                        const testValue = `{
  "timestamp": "${new Date().toISOString()}",
  "test": "This is a test value",
  "numbers": [1, 2, 3, 4, 5],
  "nested": {
    "property": "value",
    "deep": {
      "nested": true
    }
  }
}`;
                        monaco.setValue(testValue);
                        console.log('Value set to test content');
                        showStatus('Test value set', 'info');
                    } else {
                        alert('Editor not initialized yet');
                    }
                });
                
                // Handle window resize
                window.addEventListener('resize', function() {
                    if (monaco.isReady()) {
                        monaco.layout();
                    }
                });
                
            } catch (error) {
                console.error('Monaco initialization error:', error);
                showStatus(`❌ Error: ${error.message}`, 'error');
            }
        }
        
        // Initialize on load
        window.addEventListener('DOMContentLoaded', function() {
            initializeMonaco();
        });
