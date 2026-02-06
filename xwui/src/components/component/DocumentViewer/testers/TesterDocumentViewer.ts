
        async function initializeDocumentViewer() {
            const { XWUITester } = await import('../../XWUITester/index.ts');
            
            // Initialize XWUITester
            const tester = new XWUITester(document.getElementById('tester-container'), {
                title: 'DocumentViewer Component Tester',
                desc: 'Simple tester to verify DocumentViewer (wrapper around Monaco) loads and works correctly.',
                componentName: 'DocumentViewer'
            }, {});
            
            const testArea = tester.getTestArea();
            const statusElement = tester.getStatusElement();
            
            // Add test content to test area
            const template = document.getElementById('tester-document-viewer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
            
            const documentViewerContainer = document.getElementById('document-viewer-container');
            const languageSelect = document.getElementById('languageSelect');
            const themeSelect = document.getElementById('themeSelect');
            const getValueButton = document.getElementById('getValueButton');
            const setValueButton = document.getElementById('setValueButton');
            
            function showStatus(message, type) {
                tester.setStatus(message, type);
            }
            
            try {
                showStatus('Loading DocumentViewer Component...', 'info');
                
                // Try to import from dist first (compiled), fallback to source - matching TesterMonaco pattern
                let DocumentViewer;
                const importPaths = [
                    '/static/dist/components/DocumentViewer/index.js',      // Server static path (same as Monaco)
                    '/static/dist/components/DocumentViewer/DocumentViewer.js', // Alternative static path
                    '/frontend/dist/components/DocumentViewer/index.js',      // Server path from project root
                    '/frontend/dist/components/DocumentViewer/DocumentViewer.js', // Server path direct
                    '../../dist/components/DocumentViewer/index.js',        // Relative from src/testers/
                    '../../dist/components/DocumentViewer/DocumentViewer.js' // Direct file
                ];
                
                let lastError = null;
                for (const path of importPaths) {
                    try {
                        DocumentViewer = (await import(path)).DocumentViewer;
                        console.log(`✓ Loaded DocumentViewer from ${path}`);
                        break;
                    } catch (e) {
                        lastError = e;
                        console.warn(`✗ Failed to load from ${path}:`, e.message);
                    }
                }
                
                if (!DocumentViewer) {
                    const buildHint = `
To build DocumentViewer, run:
  cd frontend
  npm run build

This will compile TypeScript files to JavaScript in the dist/ folder.`;
                    
                    // Convert all paths to full URLs for error reporting
                    const baseUrl = window.location.origin;
                    const fullPaths = importPaths.map(path => {
                        if (path.startsWith('/')) {
                            return `${baseUrl}${path}`;
                        } else if (path.startsWith('../')) {
                            // Relative path from src/testers/ - resolve to /frontend/dist/
                            // ../../dist/components/... -> /frontend/dist/components/...
                            const resolved = path.replace(/^\.\.\/\.\.\/dist\//, '/frontend/dist/');
                            return `${baseUrl}${resolved}`;
                        }
                        return `${baseUrl}/${path}`;
                    });
                    
                    throw new Error(`Failed to load DocumentViewer from all attempted paths:
${fullPaths.map(p => `  - ${p}`).join('\n')}
Last error: ${lastError?.message || lastError}${buildHint}`);
                }
                
                showStatus('DocumentViewer Component loaded Creating editor instance...', 'info');
                
                // Create DocumentViewer instance
                const documentViewer = new DocumentViewer(documentViewerContainer, {
                    value: '{\n  "test": "value",\n  "number": 42\n}',
                    language: 'json',
                    theme: 'vs',
                    fontSize: 14,
                    minimap: { enabled: true },
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    formatOnPaste: true,
                    formatOnType: true
                });
                
                // Wait for editor to be ready
                const checkReady = setInterval(() => {
                    if (documentViewer.isReady()) {
                        clearInterval(checkReady);
                        console.log('DocumentViewer created:', documentViewer);
                        showStatus('✅ DocumentViewer initialized successfully', 'success');
                    }
                }, 100);
                
                // Language change
                languageSelect.addEventListener('change', function() {
                    if (documentViewer.isReady()) {
                        const language = languageSelect.value;
                        documentViewer.setLanguage(language);
                        console.log('Language changed to:', language);
                        showStatus(`Language changed to: ${language}`, 'info');
                    }
                });
                
                // Theme change
                themeSelect.addEventListener('change', function() {
                    if (documentViewer.isReady()) {
                        const theme = themeSelect.value;
                        documentViewer.setTheme(theme);
                        console.log('Theme changed to:', theme);
                        showStatus(`Theme changed to: ${theme}`, 'info');
                    }
                });
                
                // Get value button
                getValueButton.addEventListener('click', function() {
                    if (documentViewer.isReady()) {
                        const value = documentViewer.getValue();
                        console.log('Current value:', value);
                        alert(`Current Editor Value:\n\n${value}`);
                    } else {
                        alert('Editor not initialized yet');
                    }
                });
                
                // Set value button
                setValueButton.addEventListener('click', function() {
                    if (documentViewer.isReady()) {
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
                        documentViewer.setValue(testValue);
                        console.log('Value set to test content');
                        showStatus('Test value set', 'info');
                    } else {
                        alert('Editor not initialized yet');
                    }
                });
                
                // Handle window resize
                window.addEventListener('resize', function() {
                    if (documentViewer.isReady()) {
                        documentViewer.layout();
                    }
                });
                
            } catch (error) {
                console.error('DocumentViewer initialization error:', error);
                showStatus(`❌ Error: ${error.message}`, 'error');
            }
        }
        
        // Initialize on load
        window.addEventListener('DOMContentLoaded', function() {
            initializeDocumentViewer();
        });
