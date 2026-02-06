/**
 * XWUIFilters Component Exports
 */

import { XWUIFilters } from './XWUIFilters';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIFilters } from './XWUIFilters';
export type { XWUIFiltersConfig, XWUIFiltersData, FilterPreset, CustomFilter } from './XWUIFilters';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIFilters, 'xwui-filters', {
    flatAttrsToConfig: ['showPresets', 'showCustomControls', 'showPreview', 'className'],
    flatAttrsToData: ['currentFilter', 'customFilter', 'imageUrl']
});

