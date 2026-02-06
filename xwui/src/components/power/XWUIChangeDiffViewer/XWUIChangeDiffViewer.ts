/**
 * XWUIChangeDiffViewer Component
 * Display field changes with before/after comparison
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUICard } from '../XWUICard/XWUICard';
import { XWUITypography } from '../XWUITypography/XWUITypography';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';
import { XWUITimeline } from '../XWUITimeline/XWUITimeline';
import { XWUIAvatar } from '../XWUIAvatar/XWUIAvatar';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';

export interface FieldChange {
    field: string;
    fieldLabel: string;
    before: any;
    after: any;
    changeType: 'added' | 'modified' | 'deleted';
}

export interface ChangeRecord {
    id: string;
    timestamp: Date;
    userId: string;
    userName: string;
    userAvatar?: string;
    changes: FieldChange[];
}

// Component-level configuration
export interface XWUIChangeDiffViewerConfig {
    showTimeline?: boolean;
    showAvatar?: boolean;
    className?: string;
}

// Data type
export interface XWUIChangeDiffViewerData {
    changes: ChangeRecord[];
}

export class XWUIChangeDiffViewer extends XWUIComponent<XWUIChangeDiffViewerData, XWUIChangeDiffViewerConfig> {
    private wrapperElement: HTMLElement | null = null;
    private timelineInstance: XWUITimeline | null = null;
    private cardInstances: XWUICard[] = [];
    private avatarInstances: XWUIAvatar[] = [];
    private badgeInstances: XWUIBadge[] = [];

    constructor(
        container: HTMLElement,
        data: XWUIChangeDiffViewerData,
        conf_comp: XWUIChangeDiffViewerConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIChangeDiffViewerConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIChangeDiffViewerConfig {
        return {
            showTimeline: conf_comp?.showTimeline ?? true,
            showAvatar: conf_comp?.showAvatar ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-change-diff-viewer';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        if (this.config.showTimeline) {
            this.renderTimeline();
        } else {
            this.renderList();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderTimeline(): void {
        const timelineItems = this.data.changes.map(change => ({
            id: change.id,
            title: `${change.userName} made changes`,
            description: `${change.changes.length} field(s) changed`,
            date: change.timestamp.toISOString(),
            icon: '✏️',
            color: 'primary'
        }));

        const timelineContainer = document.createElement('div');
        this.timelineInstance = new XWUITimeline(timelineContainer, {
            items: timelineItems
        });

        // Add detailed change cards below timeline
        this.data.changes.forEach((change, index) => {
            const changeCard = this.createChangeCard(change);
            timelineContainer.appendChild(changeCard);
        });

        this.wrapperElement!.appendChild(timelineContainer);
    }

    private renderList(): void {
        this.data.changes.forEach(change => {
            const card = this.createChangeCard(change);
            this.wrapperElement!.appendChild(card);
        });
    }

    private createChangeCard(change: ChangeRecord): HTMLElement {
        const cardContainer = document.createElement('div');
        const card = new XWUICard(cardContainer, {
            title: this.config.showAvatar 
                ? this.createHeaderWithAvatar(change)
                : change.userName,
            subtitle: change.timestamp.toLocaleString()
        }, {
            variant: 'outlined',
            padding: 'medium'
        });
        this.cardInstances.push(card);

        // Change details
        const changesContainer = document.createElement('div');
        changesContainer.className = 'xwui-change-diff-viewer-changes';

        change.changes.forEach(fieldChange => {
            const changeItem = document.createElement('div');
            changeItem.className = 'xwui-change-diff-viewer-change-item';

            const fieldLabel = document.createElement('div');
            fieldLabel.className = 'xwui-change-diff-viewer-field-label';
            fieldLabel.textContent = fieldChange.fieldLabel;
            changeItem.appendChild(fieldLabel);

            const diffContainer = document.createElement('div');
            diffContainer.className = 'xwui-change-diff-viewer-diff';

            // Before value
            const beforeContainer = document.createElement('div');
            beforeContainer.className = 'xwui-change-diff-viewer-before';
            beforeContainer.innerHTML = `<span class="xwui-change-diff-viewer-label">Before:</span> <span class="xwui-change-diff-viewer-value">${this.formatValue(fieldChange.before)}</span>`;
            diffContainer.appendChild(beforeContainer);

            // Arrow
            const arrow = document.createElement('div');
            arrow.className = 'xwui-change-diff-viewer-arrow';
            arrow.innerHTML = '→';
            diffContainer.appendChild(arrow);

            // After value
            const afterContainer = document.createElement('div');
            afterContainer.className = 'xwui-change-diff-viewer-after';
            afterContainer.innerHTML = `<span class="xwui-change-diff-viewer-label">After:</span> <span class="xwui-change-diff-viewer-value">${this.formatValue(fieldChange.after)}</span>`;
            diffContainer.appendChild(afterContainer);

            // Badge
            const badgeContainer = document.createElement('div');
            const badge = new XWUIBadge(badgeContainer, {
                text: fieldChange.changeType
            }, {
                variant: fieldChange.changeType === 'added' ? 'success' 
                    : fieldChange.changeType === 'deleted' ? 'error' 
                    : 'warning'
            });
            this.badgeInstances.push(badge);
            changeItem.appendChild(badgeContainer);

            changeItem.appendChild(diffContainer);
            changesContainer.appendChild(changeItem);
        });

        const cardBody = card.getElement()?.querySelector('.xwui-card-body');
        if (cardBody) {
            cardBody.appendChild(changesContainer);
        }

        return cardContainer;
    }

    private createHeaderWithAvatar(change: ChangeRecord): HTMLElement {
        const header = document.createElement('div');
        header.className = 'xwui-change-diff-viewer-header';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '0.5rem';

        if (change.userAvatar) {
            const avatarContainer = document.createElement('div');
            const avatar = new XWUIAvatar(avatarContainer, {
                src: change.userAvatar,
                alt: change.userName
            });
            this.avatarInstances.push(avatar);
            header.appendChild(avatarContainer);
        }

        const name = document.createElement('span');
        name.textContent = change.userName;
        header.appendChild(name);

        return header;
    }

    private formatValue(value: any): string {
        if (value === null || value === undefined) return '<empty>';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.timelineInstance) {
            this.timelineInstance.destroy();
            this.timelineInstance = null;
        }
        this.cardInstances.forEach(card => card.destroy());
        this.cardInstances = [];
        this.avatarInstances.forEach(avatar => avatar.destroy());
        this.avatarInstances = [];
        this.badgeInstances.forEach(badge => badge.destroy());
        this.badgeInstances = [];
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIChangeDiffViewer as any).componentName = 'XWUIChangeDiffViewer';


