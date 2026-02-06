/**
 * ManamMenu Component Exports
 * Usage: Custom Element <manam-menu> (auto-registered)
 */

import { ManamMenu } from './ManamMenu';
import { createXWUIElement } from '../../../../components/component/XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { ManamMenu } from './ManamMenu';
export type { ManamMenuConfig, ManamMenuData, ManamMenuItem, ManamMenuCentralButton } from './ManamMenu';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../../../../components/component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Supports both flat attributes and grouped attributes (conf-comp, data)
createXWUIElement(ManamMenu, 'manam-menu', {
    flatAttrsToConfig: ['variant', 'className'],
    flatAttrsToData: ['items', 'centralButton', 'activeId']
});
