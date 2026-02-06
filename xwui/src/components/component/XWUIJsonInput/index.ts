/**
 * XWUIInputJson Component Exports
 */

import { XWUIInputJson } from './XWUIJsonInput';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIInputJson } from './XWUIJsonInput';
export type { XWUIInputJsonConfig, XWUIInputJsonData } from './XWUIJsonInput';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIInputJson, 'xwui-json-input', {
    flatAttrsToConfig: ['minRows', 'maxRows', 'formatOnBlur', 'validateOnBlur', 'className'],
    flatAttrsToData: ['value']
});

