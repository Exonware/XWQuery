/**
 * XWUITypography Component Exports
 */

import { XWUITypography } from './XWUITypography';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITypography } from './XWUITypography';
export type { XWUITypographyConfig, XWUITypographyData } from './XWUITypography';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITypography, 'xwui-typography', {
    flatAttrsToConfig: ['variant', 'component', 'align', 'color', 'noWrap', 'className'],
    flatAttrsToData: ['text']
});

