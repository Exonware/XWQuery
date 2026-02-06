/**
 * XWUIBottomSheet Component Exports
 */

import { XWUIBottomSheet } from './XWUIBottomSheet';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIBottomSheet } from './XWUIBottomSheet';
export type { XWUIBottomSheetConfig, XWUIBottomSheetData } from './XWUIBottomSheet';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIBottomSheet, 'xwui-bottom-sheet', {
    flatAttrsToConfig: ['closable', 'closeOnBackdrop', 'closeOnEscape', 'maxHeight', 'className'],
    flatAttrsToData: ['content', 'title']
});

