/**
 * XWUIInputJson Component Exports
 */

import { XWUIInputJson } from './XWUIInputJson';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIInputJson } from './XWUIInputJson';
export type { XWUIInputJsonConfig, XWUIInputJsonData } from './XWUIInputJson';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIInputJson, 'xwui-json-input', {
    flatAttrsToConfig: ['minRows', 'maxRows', 'formatOnBlur', 'validateOnBlur', 'className'],
    flatAttrsToData: ['value']
});

