/**
 * XWUIDiffEditor Component
 * Side-by-side code/file comparison tool
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIDiffEditorConfig {
    mode?: 'side-by-side' | 'inline';
    language?: string;
    showLineNumbers?: boolean;
    ignoreWhitespace?: boolean;
    renderSideBySide?: boolean;
    className?: string;
}

// Data type
export interface XWUIDiffEditorData {
    original?: string;
    modified?: string;
    originalFileName?: string;
    modifiedFileName?: string;
}

export class XWUIDiffEditor extends XWUIComponent<XWUIDiffEditorData, XWUIDiffEditorConfig> {
    private wrapperElement: HTMLElement | null = null;
    private toolbarElement: HTMLElement | null = null;
    private editorContainer: HTMLElement | null = null;
    private leftEditor: HTMLElement | null = null;
    private rightEditor: HTMLElement | null = null;
    private diffView: HTMLElement | null = null;
    private monacoDiffEditor: any = null;
    private monaco: any = null;

    constructor(
        container: HTMLElement,
        data: XWUIDiffEditorData = {},
        conf_comp: XWUIDiffEditorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
        this.initializeMonaco();
    }

    protected createConfig(
        conf_comp?: XWUIDiffEditorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDiffEditorConfig {
        return {
            mode: conf_comp?.mode ?? 'side-by-side',
            language: conf_comp?.language ?? 'plaintext',
            showLineNumbers: conf_comp?.showLineNumbers ?? true,
            ignoreWhitespace: conf_comp?.ignoreWhitespace ?? false,
            renderSideBySide: conf_comp?.renderSideBySide ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-diff-editor-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-diff-editor';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Toolbar
        this.toolbarElement = this.createToolbar();
        this.wrapperElement.appendChild(this.toolbarElement);

        // Editor container
        this.editorContainer = document.createElement('div');
        this.editorContainer.className = 'xwui-diff-editor-container';
        this.editorContainer.classList.add(`xwui-diff-editor-${this.config.mode}`);

        if (this.config.mode === 'side-by-side') {
            this.createSideBySideView();
        } else {
            this.createInlineView();
        }

        this.wrapperElement.appendChild(this.editorContainer);
        this.container.appendChild(this.wrapperElement);
    }

    private createToolbar(): HTMLElement {
        const toolbar = document.createElement('div');
        toolbar.className = 'xwui-diff-editor-toolbar';

        // File names
        if (this.data.originalFileName || this.data.modifiedFileName) {
            const fileNames = document.createElement('div');
            fileNames.className = 'xwui-diff-editor-filenames';
            fileNames.innerHTML = `
                <span class="xwui-diff-editor-file-original">${this.data.originalFileName || 'Original'}</span>
                <span class="xwui-diff-editor-separator">↔</span>
                <span class="xwui-diff-editor-file-modified">${this.data.modifiedFileName || 'Modified'}</span>
            `;
            toolbar.appendChild(fileNames);
        }

        // Mode toggle
        const modeToggle = document.createElement('button');
        modeToggle.className = 'xwui-diff-editor-toolbar-btn';
        modeToggle.textContent = this.config.mode === 'side-by-side' ? 'Inline' : 'Side-by-Side';
        modeToggle.onclick = () => {
            this.config.mode = this.config.mode === 'side-by-side' ? 'inline' : 'side-by-side';
            this.render();
            this.initializeMonaco();
        };
        toolbar.appendChild(modeToggle);

        // Navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'xwui-diff-editor-toolbar-btn';
        prevBtn.textContent = '← Previous';
        prevBtn.onclick = () => this.navigateDiff('prev');
        toolbar.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'xwui-diff-editor-toolbar-btn';
        nextBtn.textContent = 'Next →';
        nextBtn.onclick = () => this.navigateDiff('next');
        toolbar.appendChild(nextBtn);

        return toolbar;
    }

    private createSideBySideView(): void {
        if (!this.editorContainer) return;

        this.leftEditor = document.createElement('div');
        this.leftEditor.className = 'xwui-diff-editor-left';
        this.leftEditor.id = 'xwui-diff-editor-left';

        this.rightEditor = document.createElement('div');
        this.rightEditor.className = 'xwui-diff-editor-right';
        this.rightEditor.id = 'xwui-diff-editor-right';

        this.editorContainer.appendChild(this.leftEditor);
        this.editorContainer.appendChild(this.rightEditor);
    }

    private createInlineView(): void {
        if (!this.editorContainer) return;

        this.diffView = document.createElement('div');
        this.diffView.className = 'xwui-diff-editor-inline';
        this.diffView.id = 'xwui-diff-editor-inline';
        this.editorContainer.appendChild(this.diffView);
    }

    private async initializeMonaco(): Promise<void> {
        // Try to load Monaco
        if (typeof window !== 'undefined' && (window as any).monaco) {
            this.monaco = (window as any).monaco;
            this.createMonacoDiffEditor();
        } else {
            // Fallback to simple text diff
            this.createSimpleDiff();
        }
    }

    private createMonacoDiffEditor(): void {
        if (!this.monaco) return;

        try {
            if (this.config.mode === 'side-by-side' && this.leftEditor && this.rightEditor) {
                // Use Monaco diff editor
                const originalModel = this.monaco.editor.createModel(
                    this.data.original || '',
                    this.config.language
                );
                const modifiedModel = this.monaco.editor.createModel(
                    this.data.modified || '',
                    this.config.language
                );

                this.monacoDiffEditor = this.monaco.editor.createDiffEditor(this.leftEditor, {
                    readOnly: true,
                    renderSideBySide: this.config.renderSideBySide,
                    ignoreTrimWhitespace: this.config.ignoreWhitespace,
                    renderIndicators: true,
                    enableSplitViewResizing: true
                });

                this.monacoDiffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });
            } else if (this.config.mode === 'inline' && this.diffView) {
                const originalModel = this.monaco.editor.createModel(
                    this.data.original || '',
                    this.config.language
                );
                const modifiedModel = this.monaco.editor.createModel(
                    this.data.modified || '',
                    this.config.language
                );

                this.monacoDiffEditor = this.monaco.editor.createDiffEditor(this.diffView, {
                    readOnly: true,
                    renderSideBySide: false,
                    ignoreTrimWhitespace: this.config.ignoreWhitespace
                });

                this.monacoDiffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });
            }
        } catch (error) {
            console.error('Failed to create Monaco diff editor:', error);
            this.createSimpleDiff();
        }
    }

    private createSimpleDiff(): void {
        if (!this.editorContainer) return;

        if (this.config.mode === 'side-by-side' && this.leftEditor && this.rightEditor) {
            this.leftEditor.innerHTML = this.formatSimpleDiff(this.data.original || '', 'original');
            this.rightEditor.innerHTML = this.formatSimpleDiff(this.data.modified || '', 'modified');
        } else if (this.config.mode === 'inline' && this.diffView) {
            this.diffView.innerHTML = this.formatInlineDiff(this.data.original || '', this.data.modified || '');
        }
    }

    private formatSimpleDiff(text: string, type: 'original' | 'modified'): string {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            const lineNum = this.config.showLineNumbers ? `<span class="xwui-diff-line-number">${index + 1}</span>` : '';
            return `<div class="xwui-diff-line xwui-diff-line-${type}">${lineNum}<span class="xwui-diff-line-content">${this.escapeHtml(line)}</span></div>`;
        }).join('');
    }

    private formatInlineDiff(original: string, modified: string): string {
        const originalLines = original.split('\n');
        const modifiedLines = modified.split('\n');
        const maxLines = Math.max(originalLines.length, modifiedLines.length);
        let html = '';

        for (let i = 0; i < maxLines; i++) {
            const origLine = originalLines[i] || '';
            const modLine = modifiedLines[i] || '';
            
            if (origLine === modLine) {
                const lineNum = this.config.showLineNumbers ? `<span class="xwui-diff-line-number">${i + 1}</span>` : '';
                html += `<div class="xwui-diff-line xwui-diff-line-same">${lineNum}<span class="xwui-diff-line-content">${this.escapeHtml(origLine)}</span></div>`;
            } else {
                const lineNum = this.config.showLineNumbers ? `<span class="xwui-diff-line-number">${i + 1}</span>` : '';
                html += `<div class="xwui-diff-line xwui-diff-line-removed">${lineNum}<span class="xwui-diff-line-content">- ${this.escapeHtml(origLine)}</span></div>`;
                html += `<div class="xwui-diff-line xwui-diff-line-added">${lineNum}<span class="xwui-diff-line-content">+ ${this.escapeHtml(modLine)}</span></div>`;
            }
        }

        return html;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private navigateDiff(direction: 'prev' | 'next'): void {
        // Simple navigation - in a real implementation, would find actual diff hunks
        if (this.monacoDiffEditor) {
            // Monaco handles navigation internally
            return;
        }
        // For simple diff, scroll to next/previous change
        const lines = this.editorContainer?.querySelectorAll('.xwui-diff-line-removed, .xwui-diff-line-added');
        if (lines && lines.length > 0) {
            // Simple scroll to first/last change
            const target = direction === 'next' ? lines[0] : lines[lines.length - 1];
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    public setOriginal(text: string): void {
        this.data.original = text;
        if (this.monacoDiffEditor) {
            const model = this.monacoDiffEditor.getOriginalEditor().getModel();
            if (model) {
                model.setValue(text);
            }
        } else {
            this.createSimpleDiff();
        }
    }

    public setModified(text: string): void {
        this.data.modified = text;
        if (this.monacoDiffEditor) {
            const model = this.monacoDiffEditor.getModifiedEditor().getModel();
            if (model) {
                model.setValue(text);
            }
        } else {
            this.createSimpleDiff();
        }
    }

    public update(): void {
        this.render();
        this.initializeMonaco();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDiffEditor as any).componentName = 'XWUIDiffEditor';


