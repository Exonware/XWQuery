import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICodeBlock/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUICodeBlock } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICodeBlock Component Tester',
            desc: 'Syntax-highlighted code block with Prism.js.',
            componentName: 'XWUICodeBlock'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicode-block-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const jsCode = `function greet(name) {
    return \`Hello, \${name}!\`;
}

const message = greet('World');
console.log(message);`;

        const tsCode = `interface User {
    id: number;
    name: string;
    email: string;
}

function getUser(id) {
    // Fetch user from API
    return null;
}`;

        const jsonCode = `{
    "name": "XWUI",
    "version": "1.0.0",
    "description": "Modern UI Component Library",
    "features": [
        "Framework-agnostic",
        "TypeScript",
        "Custom Elements"
    ]
}`;

        const htmlCode = `<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`;

        const longCode = `// This is a longer code example
function processData(data) {
    const results = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.isValid) {
            results.push({
                id: item.id,
                name: item.name,
                processed: true
            });
        }
    }
    return results;
}`;

        try {
            // JavaScript
            const jsContainer = document.getElementById('codeblock-js');
            if (!jsContainer) throw new Error('jsContainer not found');
            const jsBlock = new XWUICodeBlock(
                jsContainer,
                { code: jsCode },
                { language: 'javascript' }
            );
            
            // TypeScript
            const tsContainer = document.getElementById('codeblock-ts');
            if (!tsContainer) throw new Error('tsContainer not found');
            const tsBlock = new XWUICodeBlock(
                tsContainer,
                { code: tsCode },
                { language: 'typescript' }
            );
            
            // JSON
            const jsonContainer = document.getElementById('codeblock-json');
            if (!jsonContainer) throw new Error('jsonContainer not found');
            const jsonBlock = new XWUICodeBlock(
                jsonContainer,
                { code: jsonCode },
                { language: 'json' }
            );
            
            // HTML
            const htmlContainer = document.getElementById('codeblock-html');
            if (!htmlContainer) throw new Error('htmlContainer not found');
            const htmlBlock = new XWUICodeBlock(
                htmlContainer,
                { code: htmlCode },
                { language: 'html' }
            );
            
            // With Copy Button
            const copyContainer = document.getElementById('codeblock-copy');
            if (!copyContainer) throw new Error('copyContainer not found');
            const copyBlock = new XWUICodeBlock(
                copyContainer,
                { code: jsCode },
                { language: 'javascript', copyable: true }
            );
            
            // With Line Numbers
            const linesContainer = document.getElementById('codeblock-lines');
            if (!linesContainer) throw new Error('linesContainer not found');
            const linesBlock = new XWUICodeBlock(
                linesContainer,
                { code: longCode },
                { language: 'javascript', showLineNumbers: true }
            );
            
            tester.setStatus('✅ XWUICodeBlock initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICodeBlock test error:', error);
        }
