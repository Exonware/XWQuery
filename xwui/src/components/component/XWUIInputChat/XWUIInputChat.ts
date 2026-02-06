/**
 * XWUIInputChat Component
 * Auto-resizing textarea with file attachment and send button
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIInputChatConfig {
    placeholder?: string;
    maxRows?: number;
    minRows?: number;
    showFileButton?: boolean;
    showSendButton?: boolean;
    className?: string;
}

// Data type
export interface XWUIInputChatData {
    value?: string;
}

export class XWUIInputChat extends XWUIComponent<XWUIInputChatData, XWUIInputChatConfig> {
    private inputElement: HTMLElement | null = null;
    private textareaElement: HTMLTextAreaElement | null = null;
    private fileInputElement: HTMLInputElement | null = null;
    private sendButtonElement: HTMLElement | null = null;
    private sendHandlers: Array<(message: string) => void> = [];
    private fileHandlers: Array<(file: File) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIInputChatData = {},
        conf_comp: XWUIInputChatConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputChatConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputChatConfig {
        return {
            placeholder: conf_comp?.placeholder ?? 'Type a message...',
            maxRows: conf_comp?.maxRows ?? 10,
            minRows: conf_comp?.minRows ?? 1,
            showFileButton: conf_comp?.showFileButton ?? true,
            showSendButton: conf_comp?.showSendButton ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.inputElement = document.createElement('div');
        this.inputElement.className = 'xwui-chatinput';
        
        if (this.config.className) {
            this.inputElement.classList.add(this.config.className);
        }

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'xwui-chatinput-wrapper';

        // Textarea
        this.textareaElement = document.createElement('textarea');
        this.textareaElement.className = 'xwui-chatinput-textarea';
        this.textareaElement.placeholder = this.config.placeholder || 'Type a message...';
        this.textareaElement.rows = this.config.minRows || 1;
        this.textareaElement.value = this.data.value || '';
        
        this.textareaElement.addEventListener('input', () => {
            this.autoResize();
            this.updateSendButton();
        });

        this.textareaElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        inputWrapper.appendChild(this.textareaElement);

        // File button
        if (this.config.showFileButton) {
            const fileButton = document.createElement('label');
            fileButton.className = 'xwui-chatinput-file-button';
            fileButton.innerHTML = '📎';
            fileButton.setAttribute('aria-label', 'Attach file');

            this.fileInputElement = document.createElement('input');
            this.fileInputElement.type = 'file';
            this.fileInputElement.className = 'xwui-chatinput-file-input';
            this.fileInputElement.style.display = 'none';
            
            this.fileInputElement.addEventListener('change', (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    this.fileHandlers.forEach(handler => handler(file));
                }
            });

            fileButton.appendChild(this.fileInputElement);
            inputWrapper.appendChild(fileButton);
        }

        this.inputElement.appendChild(inputWrapper);

        // Send button
        if (this.config.showSendButton) {
            this.sendButtonElement = document.createElement('button');
            this.sendButtonElement.className = 'xwui-chatinput-send-button';
            this.sendButtonElement.innerHTML = '➤';
            this.sendButtonElement.setAttribute('aria-label', 'Send message');
            this.sendButtonElement.disabled = !this.data.value?.trim();
            
            this.sendButtonElement.addEventListener('click', () => {
                this.handleSend();
            });

            this.inputElement.appendChild(this.sendButtonElement);
            this.updateSendButton();
        }

        this.container.appendChild(this.inputElement);
    }

    private autoResize(): void {
        if (!this.textareaElement) return;

        this.textareaElement.style.height = 'auto';
        const scrollHeight = this.textareaElement.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(this.textareaElement).lineHeight) || 20;
        const maxHeight = (this.config.maxRows || 10) * lineHeight;
        const minHeight = (this.config.minRows || 1) * lineHeight;

        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
        this.textareaElement.style.height = `${newHeight}px`;
        this.textareaElement.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }

    private updateSendButton(): void {
        if (!this.sendButtonElement || !this.textareaElement) return;
        const hasText = this.textareaElement.value.trim().length > 0;
        this.sendButtonElement.disabled = !hasText;
    }

    private handleSend(): void {
        if (!this.textareaElement) return;
        
        const message = this.textareaElement.value.trim();
        if (message.length === 0) return;

        this.sendHandlers.forEach(handler => handler(message));
        this.textareaElement.value = '';
        this.data.value = '';
        this.autoResize();
        this.updateSendButton();
    }

    public getValue(): string {
        return this.textareaElement?.value || '';
    }

    public setValue(value: string): void {
        if (this.textareaElement) {
            this.textareaElement.value = value;
            this.data.value = value;
            this.autoResize();
            this.updateSendButton();
        }
    }

    public onSend(handler: (message: string) => void): void {
        this.sendHandlers.push(handler);
    }

    public onFileAttach(handler: (file: File) => void): void {
        this.fileHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.inputElement;
    }

    public destroy(): void {
        this.sendHandlers = [];
        this.fileHandlers = [];
        this.textareaElement = null;
        this.fileInputElement = null;
        this.sendButtonElement = null;
        this.inputElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIInputChat as any).componentName = 'XWUIInputChat';


