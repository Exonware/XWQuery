/**
 * XWUIMessageBubble Component
 * Chat message display with sender alignment and timestamp
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIMessageBubbleMessage {
    content: string;
    timestamp: string | Date;
    senderId: string;
    senderName?: string;
    senderAvatar?: string;
}

// Component-level configuration
export interface XWUIMessageBubbleConfig {
    isOwn?: boolean;
    showAvatar?: boolean;
    showTimestamp?: boolean;
    showSenderName?: boolean;
    maxLength?: number;
    className?: string;
}

// Data type
export interface XWUIMessageBubbleData {
    message: XWUIMessageBubbleMessage;
}

export class XWUIMessageBubble extends XWUIComponent<XWUIMessageBubbleData, XWUIMessageBubbleConfig> {
    private bubbleElement: HTMLElement | null = null;
    private isExpanded: boolean = false;

    constructor(
        container: HTMLElement,
        data: XWUIMessageBubbleData,
        conf_comp: XWUIMessageBubbleConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMessageBubbleConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMessageBubbleConfig {
        return {
            isOwn: conf_comp?.isOwn ?? false,
            showAvatar: conf_comp?.showAvatar ?? true,
            showTimestamp: conf_comp?.showTimestamp ?? true,
            showSenderName: conf_comp?.showSenderName ?? true,
            maxLength: conf_comp?.maxLength ?? 200,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'xwui-messagebubble-row';
        
        if (this.config.isOwn) {
            row.classList.add('xwui-messagebubble-row-own');
        }

        // Avatar
        if (this.config.showAvatar && !this.config.isOwn && this.data.message.senderAvatar) {
            const avatar = document.createElement('img');
            avatar.className = 'xwui-messagebubble-avatar';
            avatar.src = this.data.message.senderAvatar;
            avatar.alt = this.data.message.senderName || 'User';
            row.appendChild(avatar);
        }

        // Message container
        const messageContainer = document.createElement('div');
        messageContainer.className = 'xwui-messagebubble-container';
        
        if (this.config.isOwn) {
            messageContainer.classList.add('xwui-messagebubble-container-own');
        }

        // Sender name
        if (this.config.showSenderName && !this.config.isOwn && this.data.message.senderName) {
            const senderName = document.createElement('div');
            senderName.className = 'xwui-messagebubble-sender';
            senderName.textContent = this.data.message.senderName;
            messageContainer.appendChild(senderName);
        }

        // Bubble
        const bubble = document.createElement('div');
        bubble.className = 'xwui-messagebubble';
        
        if (this.config.isOwn) {
            bubble.classList.add('xwui-messagebubble-own');
        }
        
        if (this.config.className) {
            bubble.classList.add(this.config.className);
        }

        // Content
        const content = document.createElement('div');
        content.className = 'xwui-messagebubble-content';
        
        const messageText = this.data.message.content;
        const isLong = messageText.length > (this.config.maxLength || 200);
        const displayText = isLong && !this.isExpanded
            ? messageText.slice(0, this.config.maxLength || 200) + '...'
            : messageText;
        
        content.textContent = displayText;
        bubble.appendChild(content);

        // Expand button
        if (isLong) {
            const expandButton = document.createElement('button');
            expandButton.className = 'xwui-messagebubble-expand';
            expandButton.textContent = this.isExpanded ? '−' : '+';
            expandButton.addEventListener('click', () => {
                this.isExpanded = !this.isExpanded;
                this.render();
            });
            bubble.appendChild(expandButton);
        }

        // Timestamp
        if (this.config.showTimestamp) {
            const timestamp = document.createElement('div');
            timestamp.className = 'xwui-messagebubble-timestamp';
            
            const date = typeof this.data.message.timestamp === 'string'
                ? new Date(this.data.message.timestamp)
                : this.data.message.timestamp;
            
            timestamp.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            bubble.appendChild(timestamp);
        }

        messageContainer.appendChild(bubble);
        row.appendChild(messageContainer);

        this.bubbleElement = row;
        this.container.appendChild(row);
    }

    public getElement(): HTMLElement | null {
        return this.bubbleElement;
    }

    public destroy(): void {
        this.bubbleElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMessageBubble as any).componentName = 'XWUIMessageBubble';


