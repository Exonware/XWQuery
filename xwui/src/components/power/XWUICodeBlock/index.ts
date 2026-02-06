/**
 * XWUICodeBlock Component Exports
 */

import { XWUICodeBlock } from './XWUICodeBlock';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICodeBlock } from './XWUICodeBlock';
export type { XWUICodeBlockConfig, XWUICodeBlockData } from './XWUICodeBlock';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICodeBlock, 'xwui-code-block', {
    flatAttrsToConfig: ['language', 'showLineNumbers', 'copyable', 'className'],
    flatAttrsToData: ['code']
});

