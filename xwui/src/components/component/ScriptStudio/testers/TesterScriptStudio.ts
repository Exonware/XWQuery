
        async function initializeScriptStudio() {
            const { XWUITester } = await import('../../XWUITester/index.ts');
            
            // Initialize XWUITester
            const tester = new XWUITester(document.getElementById('tester-container'), {
                title: 'ScriptStudio Component Tester',
                desc: 'VS Code-like IDE interface with Monaco Editor, file explorer, and terminal',
                componentName: 'ScriptStudio'
            }, {});
            
            const testArea = tester.getTestArea();
            
            // Add test content to test area
            const template = document.getElementById('tester-script-studio-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
            try {
                // Try to import from dist first (compiled), fallback to source
                let ScriptStudio;
                let importError = null;
                
                // Try multiple import paths in order of preference
                // From frontend/src/testers/ -> up 2 levels to frontend/ -> then dist/
                const importPaths = [
                    '/static/dist/components/ScriptStudio/index.js',      // Server static path
                    '/static/dist/components/ScriptStudio/ScriptStudio.js', // Alternative static path
                    '../../dist/components/ScriptStudio/index.js',        // Relative from src/testers/
                    '../../dist/components/ScriptStudio/ScriptStudio.js',  // Direct file
                    '../index.js'                 // Source fallback
                ];
                
                let lastError = null;
                for (const path of importPaths) {
                    try {
                        ScriptStudio = (await import(path)).ScriptStudio;
                        console.log(`✓ Loaded ScriptStudio from ${path}`);
                        break;
                    } catch (e) {
                        lastError = e;
                        console.warn(`✗ Failed to load from ${path}:`, e.message);
                    }
                }
                
                if (!ScriptStudio) {
                    throw new Error(`Failed to load ScriptStudio from all attempted paths:
${importPaths.map(p => `  - ${p}`).join('\n')}
Last error: ${lastError?.message || lastError}
Please ensure the component is compiled (run 'npm run build' in the frontend directory).`);
                }

                const container = document.getElementById('script-studio-container');
                
                if (!container) {
                    throw new Error('Container element not found');
                }

                const scriptStudio = new ScriptStudio(container, {
                    files: [
                        {
                            id: '1',
                            name: 'main.ts',
                            language: 'typescript',
                            content: `// Welcome to ScriptStudio
// Try editing this TypeScript code

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

const fetchUser = async (id): Promise<User> => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        username: "dev_wizard",
        isAdmin: true
      });
    }, 1000);
  });
};

fetchUser(1).then(user => {
  console.log(\`User loaded: \${user.username}\`);
});
`
                        },
                        {
                            id: '2',
                            name: 'styles.css',
                            language: 'css',
                            content: `.container {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #1e1e1e;
}

.title {
  color: #61dafb;
  font-size: 1.5rem;
  font-weight: bold;
}
`
                        },
                        {
                            id: '3',
                            name: 'config.json',
                            language: 'json',
                            content: `{
  "appName": "ScriptStudio",
  "version": "1.0.0",
  "features": {
    "darkMode": true,
    "betaAccess": false
  }
}`
                        }
                    ],
                    initialFileId: '1',
                    showSidebar: true
                });

                // Expose to window for debugging
                window.scriptStudio = scriptStudio;
                
                console.log('ScriptStudio initialized successfully');
            } catch (error) {
                console.error('Failed to initialize ScriptStudio:', error);
                const container = document.getElementById('script-studio-container');
                if (container) {
                    container.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: var(--text-primary);">
                            <h2 style="color: var(--accent-error);">Error Loading ScriptStudio</h2>
                            <p>${error.message}</p>
                            <p style="font-size: 12px; color: var(--text-secondary); margin-top: 20px;">
                                Check the browser console for more details.
                            </p>
                        </div>
                    `;
                }
            }
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeScriptStudio);
        } else {
            initializeScriptStudio();
        }
