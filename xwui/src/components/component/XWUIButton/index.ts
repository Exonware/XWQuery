/**
 * XWUIButton Component Exports
 * Usage: Custom Element <xwui-button> (auto-registered)
 */

import { XWUIButton } from './XWUIButton';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { XWUIButton } from './XWUIButton';
export type { XWUIButtonConfig, XWUIButtonData } from './XWUIButton';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Supports both flat attributes (variant, size, disabled, text, etc.) and grouped attributes (conf-comp, data)
createXWUIElement(XWUIButton, 'xwui-button', {
    flatAttrsToConfig: ['variant', 'size', 'disabled', 'loading', 'icon', 'iconPosition', 'fullWidth', 'type'],
    flatAttrsToData: ['text']
});

