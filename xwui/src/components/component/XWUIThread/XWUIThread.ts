/**
 * XWUIThread Component
 * Scrollable message thread with multiple message bubbles
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIMessageBubble, type XWUIMessageBubbleMessage } from '../XWUIMessageBubble/XWUIMessageBubble';

export interface XWUIThreadContributor {
    id: string;
    name: string;
    avatar?: string;
}

export interface XWUIThreadMessage {
    id: string;
    content: string;
    timestamp: string | Date;
    senderId: string;
}

// Component-level configuration
export interface XWUIThreadConfig {
    viewerId: string;
    autoScroll?: boolean;
    className?: string;
}

// Data type
export interface XWUIThreadData {
    contributors: XWUIThreadContributor[];
    messages: XWUIThreadMessage[];
}

export class XWUIThread extends XWUIComponent<XWUIThreadData, XWUIThreadConfig> {
    private threadElement: HTMLElement | null = null;
    private messageBubbles: XWUIMessageBubble[] = [];

    constructor(
        container: HTMLElement,
        data: XWUIThreadData,
        conf_comp: XWUIThreadConfig,
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIThreadConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIThreadConfig {
        return {
            viewerId: conf_comp?.viewerId || '',
            autoScroll: conf_comp?.autoScroll ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.threadElement = document.createElement('div');
        this.threadElement.className = 'xwui-thread';
        
        if (this.config.className) {
            this.threadElement.classList.add(this.config.className);
        }

        // Clear existing bubbles
        this.messageBubbles.forEach(bubble => bubble.destroy());
        this.messageBubbles = [];

        // Render messages
        this.data.messages.forEach(message => {
            const contributor = this.data.contributors.find(c => c.id === message.senderId);
            const isOwn = message.senderId === this.config.viewerId;

            const messageData: XWUIMessageBubbleMessage = {
                content: message.content,
                timestamp: message.timestamp,
                senderId: message.senderId,
                senderName: contributor?.name,
                senderAvatar: contributor?.avatar
            };

            const bubbleContainer = document.createElement('div');
            bubbleContainer.className = 'xwui-thread-message';
            this.threadElement.appendChild(bubbleContainer);

            const bubble = new XWUIMessageBubble(
                bubbleContainer,
                { message: messageData },
                { isOwn }
            );

            this.messageBubbles.push(bubble);
        });

        this.container.appendChild(this.threadElement);

        // Auto-scroll to bottom
        if (this.config.autoScroll) {
            requestAnimationFrame(() => {
                this.scrollToBottom();
            });
        }
    }

    public scrollToBottom(): void {
        if (this.threadElement) {
            this.threadElement.scrollTop = this.threadElement.scrollHeight;
        }
    }

    public addMessage(message: XWUIThreadMessage): void {
        this.data.messages.push(message);
        this.render();
    }

    public getMessages(): XWUIThreadMessage[] {
        return [...this.data.messages];
    }

    public getElement(): HTMLElement | null {
        return this.threadElement;
    }

    public destroy(): void {
        this.messageBubbles.forEach(bubble => bubble.destroy());
        this.messageBubbles = [];
        this.threadElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIThread as any).componentName = 'XWUIThread';


