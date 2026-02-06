/**
 * XWUIDialog Component Exports
 */

import { XWUIDialog } from './XWUIDialog';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIDialog, confirm } from './XWUIDialog';
export type { XWUIDialogConfig, XWUIDialogData } from './XWUIDialog';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIDialog, 'xwui-dialog', {
    flatAttrsToConfig: ['size', 'closable', 'closeOnBackdrop', 'closeOnEscape', 'centered', 'scrollable', 'className'],
    flatAttrsToData: ['title']
});

