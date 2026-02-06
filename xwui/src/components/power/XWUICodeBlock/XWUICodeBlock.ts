/**
 * XWUICodeBlock Component
 * Syntax-highlighted code block with Prism.js
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUICodeBlockConfig {
    language?: string;
    showLineNumbers?: boolean;
    copyable?: boolean;
    className?: string;
}

// Data type
export interface XWUICodeBlockData {
    code: string;
}

export class XWUICodeBlock extends XWUIComponent<XWUICodeBlockData, XWUICodeBlockConfig> {
    private codeElement: HTMLElement | null = null;
    private prismLoaded: boolean = false;
    private static prismLoadPromise: Promise<void> | null = null;

    constructor(
        container: HTMLElement,
        data: XWUICodeBlockData,
        conf_comp: XWUICodeBlockConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.loadPrism().then(() => this.render());
    }

    protected createConfig(
        conf_comp?: XWUICodeBlockConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICodeBlockConfig {
        return {
            language: conf_comp?.language ?? 'javascript',
            showLineNumbers: conf_comp?.showLineNumbers ?? false,
            copyable: conf_comp?.copyable ?? false,
            className: conf_comp?.className
        };
    }

    private async loadPrism(): Promise<void> {
        if (this.prismLoaded) return;

        if (XWUICodeBlock.prismLoadPromise) {
            await XWUICodeBlock.prismLoadPromise;
            this.prismLoaded = true;
            return;
        }

        XWUICodeBlock.prismLoadPromise = new Promise((resolve, reject) => {
            // Check if Prism is already loaded
            if ((window as any).Prism) {
                this.prismLoaded = true;
                resolve();
                return;
            }

            // Load Prism CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
            document.head.appendChild(cssLink);

            // Load Prism JS
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
            script.onload = () => {
                // Load language support
                const langScript = document.createElement('script');
                langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${this.config.language || 'javascript'}.min.js`;
                langScript.onload = () => {
                    this.prismLoaded = true;
                    resolve();
                };
                langScript.onerror = () => {
                    // Fallback if language not found
                    this.prismLoaded = true;
                    resolve();
                };
                document.head.appendChild(langScript);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });

        await XWUICodeBlock.prismLoadPromise;
    }

    private render(): void {
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-codeblock';
        
        if (this.config.className) {
            wrapper.classList.add(this.config.className);
        }

        // Copy button (if enabled)
        if (this.config.copyable) {
            const copyButton = document.createElement('button');
            copyButton.className = 'xwui-codeblock-copy';
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(this.data.code).then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                });
            });
            wrapper.appendChild(copyButton);
        }

        // Code element
        const pre = document.createElement('pre');
        pre.className = 'xwui-codeblock-pre';
        
        if (this.config.showLineNumbers) {
            pre.classList.add('xwui-codeblock-line-numbers');
        }

        this.codeElement = document.createElement('code');
        this.codeElement.className = `language-${this.config.language || 'javascript'}`;
        this.codeElement.textContent = this.data.code;

        pre.appendChild(this.codeElement);
        wrapper.appendChild(pre);

        this.container.appendChild(wrapper);

        // Highlight code
        if (this.prismLoaded && (window as any).Prism) {
            (window as any).Prism.highlightElement(this.codeElement);
        }
    }

    public setCode(code: string): void {
        this.data.code = code;
        if (this.codeElement) {
            this.codeElement.textContent = code;
            if (this.prismLoaded && (window as any).Prism) {
                (window as any).Prism.highlightElement(this.codeElement);
            }
        }
    }

    public getCode(): string {
        return this.data.code;
    }

    public getElement(): HTMLElement | null {
        return this.codeElement;
    }

    public destroy(): void {
        this.codeElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICodeBlock as any).componentName = 'XWUICodeBlock';


