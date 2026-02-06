import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDiffEditor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIDiffEditor } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDiffEditor Component Tester',
            desc: 'Side-by-side code/file comparison tool.',
            componentName: 'XWUIDiffEditor'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const originalCode = `function greet(name) {
    console.log("Hello, " + name);
    return "Hello, " + name;
}

greet("World");`;

        const modifiedCode = `function greet(name, greeting = "Hello") {
    console.log(\`\${greeting}, \${name}\`);
    return \`\${greeting}, \${name}\`;
}

greet("World", "Hi");`;
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuidiff-editor-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Side-by-side
            const sideBySideContainer = document.getElementById('diff-sidebyside');
            const sideBySideDiff = new XWUIDiffEditor(
                sideBySideContainer,
                {
                    original,
                    modified,
                    originalFileName: 'greet.js',
                    modifiedFileName: 'greet.js'
                },
                {
                    mode: 'side-by-side',
                    language: 'javascript'
                }
            );
            
            // Inline
            const inlineContainer = document.getElementById('diff-inline');
            const inlineDiff = new XWUIDiffEditor(
                inlineContainer,
                {
                    original,
                    modified: modifiedCode
                },
                {
                    mode: 'inline',
                    language: 'javascript'
                }
            );
            
            tester.setStatus('✅ XWUIDiffEditor initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIDiffEditor test error:', error);
        }
