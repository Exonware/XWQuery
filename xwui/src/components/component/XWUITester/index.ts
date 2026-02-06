/**
 * XWUITester Component Exports
 */

import { XWUITester } from './XWUITester';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITester } from './XWUITester';
export type { XWUITesterConfig, XWUITesterData } from './XWUITester';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITester, 'xwui-tester', {
    flatAttrsToConfig: ['className'],
    flatAttrsToData: ['title', 'desc', 'componentName']
});

