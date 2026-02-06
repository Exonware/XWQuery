/**
 * XWUISkipLink Component Exports
 */

import { XWUISkipLink } from './XWUISkipLink';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISkipLink } from './XWUISkipLink';
export type { XWUISkipLinkConfig, XWUISkipLinkData } from './XWUISkipLink';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISkipLink, 'xwui-skip-link', {
    flatAttrsToConfig: ['targetId', 'label', 'className'],
    flatAttrsToData: ['href']
});

