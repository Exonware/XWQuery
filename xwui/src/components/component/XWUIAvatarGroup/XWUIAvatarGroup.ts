/**
 * XWUIAvatarGroup Component
 * Group of avatars with overflow handling
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIAvatar, type XWUIAvatarConfig, type XWUIAvatarData } from '../XWUIAvatar/XWUIAvatar';

export interface AvatarGroupItem {
    src?: string;
    alt?: string;
    icon?: string;
    text?: string;
}

export interface XWUIAvatarGroupConfig {
    max?: number;
    size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
    spacing?: number;
    total?: number;
    className?: string;
}

export interface XWUIAvatarGroupData {
    avatars?: AvatarGroupItem[];
}

export class XWUIAvatarGroup extends XWUIComponent<XWUIAvatarGroupData, XWUIAvatarGroupConfig> {
    private groupElement: HTMLElement | null = null;
    private avatarInstances: XWUIAvatar[] = [];

    constructor(
        container: HTMLElement,
        data: XWUIAvatarGroupData = {},
        conf_comp: XWUIAvatarGroupConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIAvatarGroupConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIAvatarGroupConfig {
        return {
            max: conf_comp?.max,
            size: conf_comp?.size ?? 'medium',
            spacing: conf_comp?.spacing ?? -8,
            total: conf_comp?.total,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-avatar-group-container';

        this.groupElement = document.createElement('div');
        this.groupElement.className = 'xwui-avatar-group';
        
        if (this.config.className) {
            this.groupElement.classList.add(this.config.className);
        }

        // Apply spacing (negative margin for overlap)
        if (this.config.spacing !== undefined) {
            this.groupElement.style.marginLeft = `${-this.config.spacing}px`;
        }

        const avatars = this.data.avatars || [];
        const max = this.config.max;
        const displayCount = max && avatars.length > max ? max : avatars.length;
        const remaining = max && avatars.length > max ? avatars.length - max : 0;

        // Render visible avatars
        for (let i = 0; i < displayCount; i++) {
            const avatarData = avatars[i];
            const avatarContainer = document.createElement('div');
            avatarContainer.className = 'xwui-avatar-group-item';
            
            if (this.config.spacing !== undefined) {
                avatarContainer.style.marginLeft = `${this.config.spacing}px`;
            }

            const avatarDataConverted: XWUIAvatarData = {
                src: avatarData.src,
                alt: avatarData.alt,
                name: avatarData.text
            };

            const avatarConfig: XWUIAvatarConfig = {
                size: this.config.size
            };

            const avatar = new XWUIAvatar(avatarContainer, avatarDataConverted, avatarConfig, this.conf_sys, this.conf_usr);
            this.avatarInstances.push(avatar);
            this.groupElement.appendChild(avatarContainer);
        }

        // Render +N badge if there are remaining avatars
        if (remaining > 0) {
            const moreBadge = document.createElement('div');
            moreBadge.className = 'xwui-avatar-group-more';
            moreBadge.textContent = `+${remaining}`;
            
            const total = this.config.total || (avatars.length);
            moreBadge.setAttribute('title', `${total} total`);
            
            if (this.config.spacing !== undefined) {
                moreBadge.style.marginLeft = `${this.config.spacing}px`;
            }

            this.groupElement.appendChild(moreBadge);
        }

        this.container.appendChild(this.groupElement);
    }

    public destroy(): void {
        this.avatarInstances.forEach(avatar => {
            // XWUIAvatar doesn't have destroy, but clear references
        });
        this.avatarInstances = [];
        if (this.groupElement) {
            this.groupElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIAvatarGroup as any).componentName = 'XWUIAvatarGroup';


