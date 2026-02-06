/**
 * XWUIStyleSelector Component Exports
 */

import { XWUIStyleSelector } from './XWUIStyleSelector';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export * from './XWUIStyleSelector';

// Register as Custom Element
createXWUIElement(XWUIStyleSelector, 'xwui-style-selector', {
    flatAttrsToConfig: [
        'basePath',
        'schemaPath',
        'dataPath',
        'showLabels',
        'showBrand',
        'showStyle',
        'showColor',
        'showAccent',
        'showLines',
        'showRoundness',
        'showFont',
        'showIcons',
        'showEmojis'
    ]
});

