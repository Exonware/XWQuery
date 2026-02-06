/**
 * XWUIPopconfirm Component Exports
 */

import { XWUIPopconfirm } from './XWUIPopconfirm';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIPopconfirm } from './XWUIPopconfirm';
export type { XWUIPopconfirmConfig, XWUIPopconfirmData } from './XWUIPopconfirm';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIPopconfirm, 'xwui-popconfirm', {
    flatAttrsToConfig: ['title', 'description', 'okText', 'cancelText', 'placement', 'align', 'className'],
    flatAttrsToData: ['onConfirm', 'onCancel', 'triggerElement']
});

