/**
 * XWUIReactionSelector Component
 * Emoji reaction selector with popover
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIPopover } from '../XWUIPopover/XWUIPopover';

export interface Reaction {
    emoji: string;
    count?: number;
    users?: string[];
}

// Component-level configuration
export interface XWUIReactionSelectorConfig {
    quickReactions?: string[]; // Common emojis to show
    showCount?: boolean;
    showUserList?: boolean;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

// Data type
export interface XWUIReactionSelectorData {
    reactions?: Reaction[];
    triggerElement?: HTMLElement | string;
}

export class XWUIReactionSelector extends XWUIComponent<XWUIReactionSelectorData, XWUIReactionSelectorConfig> {
    private wrapperElement: HTMLElement | null = null;
    private triggerButton: HTMLElement | null = null;
    private popover: XWUIPopover | null = null;
    private reactionsMap: Map<string, Reaction> = new Map();
    private reactionHandlers: Array<(emoji: string, added: boolean) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIReactionSelectorData = {},
        conf_comp: XWUIReactionSelectorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeReactions();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIReactionSelectorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIReactionSelectorConfig {
        return {
            quickReactions: conf_comp?.quickReactions ?? ['👍', '❤️', '😄', '🎉', '😮', '😢'],
            showCount: conf_comp?.showCount ?? true,
            showUserList: conf_comp?.showUserList ?? false,
            placement: conf_comp?.placement ?? 'top',
            className: conf_comp?.className
        };
    }

    private initializeReactions(): void {
        if (this.data.reactions) {
            this.data.reactions.forEach(reaction => {
                this.reactionsMap.set(reaction.emoji, reaction);
            });
        }
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-reaction-selector-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-reaction-selector';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Trigger button
        this.triggerButton = document.createElement('button');
        this.triggerButton.className = 'xwui-reaction-selector-trigger';
        this.triggerButton.innerHTML = '😊';
        this.triggerButton.setAttribute('aria-label', 'Add reaction');
        this.triggerButton.addEventListener('click', () => this.togglePopover());
        
        this.wrapperElement.appendChild(this.triggerButton);

        // Reactions display
        const reactionsDisplay = this.createReactionsDisplay();
        if (reactionsDisplay) {
            this.wrapperElement.appendChild(reactionsDisplay);
        }

        this.container.appendChild(this.wrapperElement);

        // Create popover
        this.createPopover();
    }

    private createReactionsDisplay(): HTMLElement | null {
        if (this.reactionsMap.size === 0) return null;

        const display = document.createElement('div');
        display.className = 'xwui-reaction-selector-display';

        this.reactionsMap.forEach((reaction, emoji) => {
            const button = document.createElement('button');
            button.className = 'xwui-reaction-selector-reaction';
            button.innerHTML = emoji;
            
            if (this.config.showCount && reaction.count !== undefined && reaction.count > 0) {
                const count = document.createElement('span');
                count.className = 'xwui-reaction-selector-count';
                count.textContent = reaction.count.toString();
                button.appendChild(count);
            }

            button.addEventListener('click', () => this.toggleReaction(emoji));
            button.addEventListener('mouseenter', () => {
                if (this.config.showUserList && reaction.users && reaction.users.length > 0) {
                    this.showUserTooltip(button, reaction.users);
                }
            });

            display.appendChild(button);
        });

        return display;
    }

    private createPopover(): void {
        const popoverContent = document.createElement('div');
        popoverContent.className = 'xwui-reaction-selector-popover-content';

        // Quick reactions
        const quickReactions = document.createElement('div');
        quickReactions.className = 'xwui-reaction-selector-quick';

        this.config.quickReactions?.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'xwui-reaction-selector-emoji-btn';
            button.textContent = emoji;
            button.setAttribute('aria-label', `React with ${emoji}`);
            button.addEventListener('click', () => {
                this.addReaction(emoji);
                this.popover?.close();
            });
            quickReactions.appendChild(button);
        });

        popoverContent.appendChild(quickReactions);

        // Emoji picker button (placeholder - in real implementation, use a full emoji picker)
        const moreButton = document.createElement('button');
        moreButton.className = 'xwui-reaction-selector-more';
        moreButton.textContent = '➕';
        moreButton.setAttribute('aria-label', 'More emojis');
        moreButton.title = 'More emojis (coming soon)';
        popoverContent.appendChild(moreButton);

        const triggerEl = this.data.triggerElement || this.triggerButton;
        this.popover = new XWUIPopover(
            document.body,
            {
                content: popoverContent,
                triggerElement: triggerEl as HTMLElement
            },
            {
                trigger: 'click',
                placement: this.config.placement,
                closeOnClickOutside: true
            }
        );
        this.registerChildComponent(this.popover);
    }

    private togglePopover(): void {
        if (this.popover) {
            if (this.popover.isOpen()) {
                this.popover.close();
            } else {
                this.popover.open();
            }
        }
    }

    private addReaction(emoji: string): void {
        const existing = this.reactionsMap.get(emoji);
        if (existing) {
            existing.count = (existing.count || 0) + 1;
        } else {
            this.reactionsMap.set(emoji, { emoji, count: 1 });
        }
        this.updateDisplay();
        this.reactionHandlers.forEach(handler => handler(emoji, true));
    }

    private toggleReaction(emoji: string): void {
        const existing = this.reactionsMap.get(emoji);
        if (existing && existing.count && existing.count > 0) {
            existing.count = existing.count - 1;
            if (existing.count === 0) {
                this.reactionsMap.delete(emoji);
            }
            this.reactionHandlers.forEach(handler => handler(emoji, false));
        } else {
            this.addReaction(emoji);
        }
        this.updateDisplay();
    }

    private updateDisplay(): void {
        const display = this.wrapperElement?.querySelector('.xwui-reaction-selector-display');
        if (display) {
            display.remove();
        }
        const newDisplay = this.createReactionsDisplay();
        if (newDisplay && this.triggerButton) {
            this.wrapperElement?.insertBefore(newDisplay, this.triggerButton.nextSibling);
        }
    }

    private showUserTooltip(element: HTMLElement, users: string[]): void {
        // Simple tooltip implementation
        const tooltip = document.createElement('div');
        tooltip.className = 'xwui-reaction-selector-user-tooltip';
        tooltip.textContent = users.join(', ');
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

        setTimeout(() => tooltip.remove(), 2000);
    }

    public onReactionChange(handler: (emoji: string, added: boolean) => void): void {
        this.reactionHandlers.push(handler);
    }

    public getReactions(): Reaction[] {
        return Array.from(this.reactionsMap.values());
    }

    public setReactions(reactions: Reaction[]): void {
        this.reactionsMap.clear();
        reactions.forEach(reaction => {
            this.reactionsMap.set(reaction.emoji, reaction);
        });
        this.updateDisplay();
    }

    public destroy(): void {
        // Child component (popover) is automatically destroyed by base class
        this.wrapperElement = null;
        this.triggerButton = null;
        this.popover = null;
        this.reactionsMap.clear();
        this.reactionHandlers = [];
        this.container.innerHTML = '';
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIReactionSelector as any).componentName = 'XWUIReactionSelector';


