/**
 * XWUIDynamicFieldRenderer Component Exports
 */

import { XWUIDynamicFieldRenderer } from './XWUIDynamicFieldRenderer';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIDynamicFieldRenderer } from './XWUIDynamicFieldRenderer';
export type { XWUIDynamicFieldRendererConfig, XWUIDynamicFieldRendererData, CustomField, FieldType } from './XWUIDynamicFieldRenderer';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIDynamicFieldRenderer, 'xwui-dynamic-field-renderer', {
    flatAttrsToConfig: ['layout', 'showLabels', 'className'],
    flatAttrsToData: ['values']
});

