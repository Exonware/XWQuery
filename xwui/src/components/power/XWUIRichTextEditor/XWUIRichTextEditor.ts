/**
 * XWUIRichTextEditor Component
 * Rich text/WYSIWYG editor
 * Simplified version using contenteditable
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

export interface XWUIRichTextEditorConfig {
    toolbar?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    formats?: string[];
    className?: string;
}

export interface XWUIRichTextEditorData {
    value?: string;
}

export class XWUIRichTextEditor extends XWUIComponent<XWUIRichTextEditorData, XWUIRichTextEditorConfig> {
    private wrapperElement: HTMLElement | null = null;
    private toolbarElement: HTMLElement | null = null;
    private editorElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIRichTextEditorData = {},
        conf_comp: XWUIRichTextEditorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIRichTextEditorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIRichTextEditorConfig {
        return {
            toolbar: conf_comp?.toolbar ?? true,
            placeholder: conf_comp?.placeholder ?? 'Start typing...',
            readOnly: conf_comp?.readOnly ?? false,
            formats: conf_comp?.formats ?? ['bold', 'italic', 'underline', 'heading', 'list'],
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-rich-text-editor-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-rich-text-editor';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Toolbar
        if (this.config.toolbar) {
            this.toolbarElement = document.createElement('div');
            this.toolbarElement.className = 'xwui-rich-text-editor-toolbar';
            this.renderToolbar();
            this.wrapperElement.appendChild(this.toolbarElement);
        }

        // Editor
        this.editorElement = document.createElement('div');
        this.editorElement.className = 'xwui-rich-text-editor-content';
        this.editorElement.contentEditable = !this.config.readOnly ? 'true' : 'false';
        
        if (this.data.value) {
            this.editorElement.innerHTML = this.data.value;
        } else {
            this.editorElement.setAttribute('data-placeholder', this.config.placeholder || 'Start typing...');
        }

        this.editorElement.addEventListener('input', () => {
            this.data.value = this.editorElement?.innerHTML || '';
        });

        this.editorElement.addEventListener('blur', () => {
            this.data.value = this.editorElement?.innerHTML || '';
        });

        this.wrapperElement.appendChild(this.editorElement);
        this.container.appendChild(this.wrapperElement);
    }

    private renderToolbar(): void {
        if (!this.toolbarElement) return;
        
        const formats = this.config.formats || [];
        
        formats.forEach(format => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `xwui-rich-text-editor-toolbar-btn xwui-rich-text-editor-toolbar-btn-${format}`;
            button.setAttribute('data-command', format);
            
            // Set icon/label
            switch (format) {
                case 'bold':
                    button.innerHTML = '<strong>B</strong>';
                    break;
                case 'italic':
                    button.innerHTML = '<em>I</em>';
                    break;
                case 'underline':
                    button.innerHTML = '<u>U</u>';
                    break;
                case 'heading':
                    button.textContent = 'H';
                    break;
                case 'list':
                    button.textContent = '•';
                    break;
                default:
                    button.textContent = format;
            }
            
            button.addEventListener('click', () => this.executeCommand(format));
            this.toolbarElement.appendChild(button);
        });
    }

    private executeCommand(command: string): void {
        if (!this.editorElement || this.config.readOnly) return;
        
        document.execCommand('formatBlock', false, 'div');
        
        switch (command) {
            case 'bold':
                document.execCommand('bold', false);
                break;
            case 'italic':
                document.execCommand('italic', false);
                break;
            case 'underline':
                document.execCommand('underline', false);
                break;
            case 'heading':
                document.execCommand('formatBlock', false, '<h2>');
                break;
            case 'list':
                document.execCommand('insertUnorderedList', false);
                break;
        }
        
        this.editorElement.focus();
    }

    public getValue(): string {
        return this.data.value || '';
    }

    public setValue(value: string): void {
        this.data.value = value;
        if (this.editorElement) {
            this.editorElement.innerHTML = value;
        }
    }

    public destroy(): void {
        if (this.toolbarElement) {
            this.toolbarElement = null;
        }
        if (this.editorElement) {
            this.editorElement = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIRichTextEditor as any).componentName = 'XWUIRichTextEditor';


