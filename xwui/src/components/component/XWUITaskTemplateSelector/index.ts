/**
 * XWUITaskTemplateSelector Component Exports
 */

import { XWUITaskTemplateSelector } from './XWUITaskTemplateSelector';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUITaskTemplateSelector } from './XWUITaskTemplateSelector';
export type { XWUITaskTemplateSelectorConfig, XWUITaskTemplateSelectorData, TaskTemplate } from './XWUITaskTemplateSelector';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUITaskTemplateSelector, 'xwui-task-template-selector', {
    flatAttrsToConfig: ['showSearch', 'showCategories', 'className'],
    flatAttrsToData: ['selectedTemplate']
});

