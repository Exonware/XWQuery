/**
 * XWUIDebugToolbar Component Exports
 */

import { XWUIDebugToolbar } from './XWUIDebugToolbar';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIDebugToolbar } from './XWUIDebugToolbar';
export type { XWUIDebugToolbarConfig, XWUIDebugToolbarData, Breakpoint, Variable } from './XWUIDebugToolbar';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIDebugToolbar, 'xwui-debug-toolbar', {
    flatAttrsToConfig: ['showVariables', 'showCallStack', 'showBreakpoints', 'className'],
    flatAttrsToData: ['isRunning', 'isPaused', 'breakpoints', 'variables', 'callStack', 'currentLine', 'currentFile']
});

