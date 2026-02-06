/**
 * XWUIChannelList Component
 * Enhanced channel list with unread counts, last message preview, and search
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIList } from '../XWUIList/XWUIList';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';
import { XWUIAvatar } from '../XWUIAvatar/XWUIAvatar';

export interface Channel {
    id: string;
    name: string;
    icon?: string;
    avatarUrl?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isOnline?: boolean;
    isMuted?: boolean;
    isArchived?: boolean;
    isFavorite?: boolean;
}

// Component-level configuration
export interface XWUIChannelListConfig {
    showSearch?: boolean;
    showUnreadCount?: boolean;
    showLastMessage?: boolean;
    showOnlineStatus?: boolean;
    groupBy?: 'none' | 'favorites' | 'unread' | 'status';
    className?: string;
}

// Data type
export interface XWUIChannelListData {
    channels?: Channel[];
    selectedChannelId?: string;
    searchQuery?: string;
}

export class XWUIChannelList extends XWUIComponent<XWUIChannelListData, XWUIChannelListConfig> {
    private wrapperElement: HTMLElement | null = null;
    private searchElement: HTMLElement | null = null;
    private listElement: HTMLElement | null = null;
    private channelsMap: Map<string, Channel> = new Map();
    private filteredChannels: Channel[] = [];
    private selectionHandlers: Array<(channelId: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIChannelListData = {},
        conf_comp: XWUIChannelListConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeChannels();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIChannelListConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIChannelListConfig {
        return {
            showSearch: conf_comp?.showSearch ?? true,
            showUnreadCount: conf_comp?.showUnreadCount ?? true,
            showLastMessage: conf_comp?.showLastMessage ?? true,
            showOnlineStatus: conf_comp?.showOnlineStatus ?? true,
            groupBy: conf_comp?.groupBy ?? 'none',
            className: conf_comp?.className
        };
    }

    private initializeChannels(): void {
        if (this.data.channels) {
            this.data.channels.forEach(channel => {
                this.channelsMap.set(channel.id, channel);
            });
        }
        this.filteredChannels = Array.from(this.channelsMap.values());
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-channel-list-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-channel-list';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Search
        if (this.config.showSearch) {
            this.searchElement = this.createSearch();
            this.wrapperElement.appendChild(this.searchElement);
        }

        // List
        this.listElement = document.createElement('div');
        this.listElement.className = 'xwui-channel-list-items';
        this.renderChannels();
        this.wrapperElement.appendChild(this.listElement);

        this.container.appendChild(this.wrapperElement);
    }

    private createSearch(): HTMLElement {
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'xwui-channel-list-search';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'xwui-channel-list-search-input';
        input.placeholder = 'Search channels...';
        input.value = this.data.searchQuery || '';
        input.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value.toLowerCase();
            this.data.searchQuery = query;
            this.filterChannels(query);
        });

        searchWrapper.appendChild(input);
        return searchWrapper;
    }

    private filterChannels(query: string): void {
        if (!query) {
            this.filteredChannels = Array.from(this.channelsMap.values());
        } else {
            this.filteredChannels = Array.from(this.channelsMap.values()).filter(channel =>
                channel.name.toLowerCase().includes(query) ||
                channel.lastMessage?.toLowerCase().includes(query)
            );
        }
        this.renderChannels();
    }

    private renderChannels(): void {
        if (!this.listElement) return;

        this.listElement.innerHTML = '';

        // Group channels if needed
        const grouped = this.groupChannels(this.filteredChannels);

        Object.keys(grouped).forEach(groupName => {
            if (this.config.groupBy !== 'none') {
                const groupHeader = document.createElement('div');
                groupHeader.className = 'xwui-channel-list-group-header';
                groupHeader.textContent = groupName;
                this.listElement.appendChild(groupHeader);
            }

            grouped[groupName].forEach(channel => {
                const channelElement = this.createChannelElement(channel);
                this.listElement.appendChild(channelElement);
            });
        });
    }

    private groupChannels(channels: Channel[]): Record<string, Channel[]> {
        if (this.config.groupBy === 'none') {
            return { '': channels };
        }

        const groups: Record<string, Channel[]> = {};

        channels.forEach(channel => {
            let groupName = '';
            if (this.config.groupBy === 'favorites') {
                groupName = channel.isFavorite ? 'Favorites' : 'Channels';
            } else if (this.config.groupBy === 'unread') {
                groupName = (channel.unreadCount && channel.unreadCount > 0) ? 'Unread' : 'Read';
            } else if (this.config.groupBy === 'status') {
                if (channel.isArchived) groupName = 'Archived';
                else if (channel.isMuted) groupName = 'Muted';
                else groupName = 'Active';
            }

            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(channel);
        });

        return groups;
    }

    private createChannelElement(channel: Channel): HTMLElement {
        const element = document.createElement('div');
        element.className = 'xwui-channel-list-item';
        element.setAttribute('data-channel-id', channel.id);

        if (this.data.selectedChannelId === channel.id) {
            element.classList.add('selected');
        }

        if (channel.unreadCount && channel.unreadCount > 0) {
            element.classList.add('has-unread');
        }

        // Avatar/Icon
        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'xwui-channel-list-avatar';
        if (channel.avatarUrl) {
            const avatar = document.createElement('img');
            avatar.src = channel.avatarUrl;
            avatar.alt = channel.name;
            avatarWrapper.appendChild(avatar);
        } else if (channel.icon) {
            avatarWrapper.innerHTML = channel.icon;
        } else {
            avatarWrapper.textContent = channel.name[0].toUpperCase();
        }

        if (this.config.showOnlineStatus && channel.isOnline) {
            const onlineIndicator = document.createElement('div');
            onlineIndicator.className = 'xwui-channel-list-online-indicator';
            avatarWrapper.appendChild(onlineIndicator);
        }

        element.appendChild(avatarWrapper);

        // Content
        const content = document.createElement('div');
        content.className = 'xwui-channel-list-content';

        const nameRow = document.createElement('div');
        nameRow.className = 'xwui-channel-list-name-row';

        const name = document.createElement('div');
        name.className = 'xwui-channel-list-name';
        name.textContent = channel.name;
        nameRow.appendChild(name);

        if (this.config.showUnreadCount && channel.unreadCount && channel.unreadCount > 0) {
            const badge = document.createElement('div');
            badge.className = 'xwui-channel-list-unread-badge';
            badge.textContent = channel.unreadCount > 99 ? '99+' : channel.unreadCount.toString();
            nameRow.appendChild(badge);
        }

        if (channel.lastMessageTime) {
            const time = document.createElement('div');
            time.className = 'xwui-channel-list-time';
            time.textContent = channel.lastMessageTime;
            nameRow.appendChild(time);
        }

        content.appendChild(nameRow);

        if (this.config.showLastMessage && channel.lastMessage) {
            const lastMessage = document.createElement('div');
            lastMessage.className = 'xwui-channel-list-last-message';
            lastMessage.textContent = channel.lastMessage;
            content.appendChild(lastMessage);
        }

        element.appendChild(content);

        // Click handler
        element.addEventListener('click', () => {
            this.selectChannel(channel.id);
        });

        return element;
    }

    private selectChannel(channelId: string): void {
        this.data.selectedChannelId = channelId;
        this.renderChannels();
        this.selectionHandlers.forEach(handler => handler(channelId));
    }

    public onChannelSelect(handler: (channelId: string) => void): void {
        this.selectionHandlers.push(handler);
    }

    public addChannel(channel: Channel): void {
        this.channelsMap.set(channel.id, channel);
        this.filteredChannels = Array.from(this.channelsMap.values());
        this.renderChannels();
    }

    public removeChannel(channelId: string): void {
        this.channelsMap.delete(channelId);
        this.filteredChannels = this.filteredChannels.filter(c => c.id !== channelId);
        this.renderChannels();
    }

    public updateChannel(channelId: string, updates: Partial<Channel>): void {
        const channel = this.channelsMap.get(channelId);
        if (channel) {
            Object.assign(channel, updates);
            this.channelsMap.set(channelId, channel);
            this.renderChannels();
        }
    }

    public getChannels(): Channel[] {
        return Array.from(this.channelsMap.values());
    }

    public setChannels(channels: Channel[]): void {
        this.channelsMap.clear();
        channels.forEach(channel => {
            this.channelsMap.set(channel.id, channel);
        });
        this.filteredChannels = Array.from(this.channelsMap.values());
        this.renderChannels();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIChannelList as any).componentName = 'XWUIChannelList';


