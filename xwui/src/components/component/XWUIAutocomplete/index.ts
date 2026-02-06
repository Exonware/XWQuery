/**
 * XWUIAutocomplete Component Exports
 */

import { XWUIAutocomplete } from './XWUIAutocomplete';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIAutocomplete } from './XWUIAutocomplete';
export type { XWUIAutocompleteConfig, XWUIAutocompleteData, AutocompleteOption } from './XWUIAutocomplete';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIAutocomplete, 'xwui-autocomplete', {
    flatAttrsToConfig: ['options', 'loading', 'allowClear', 'backfill', 'className'],
    flatAttrsToData: ['value', 'placeholder']
});

