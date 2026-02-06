/**
 * XWUIDiagram Component Exports
 */

import { XWUIDiagram } from './XWUIDiagram';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIDiagram } from './XWUIDiagram';
export type { XWUIDiagramConfig, XWUIDiagramData, DiagramNode, DiagramConnection } from './XWUIDiagram';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIDiagram, 'xwui-diagram', {
    flatAttrsToConfig: ['showToolbar', 'showGrid', 'snapToGrid', 'gridSize', 'className'],
    flatAttrsToData: ['nodes', 'connections', 'zoom', 'panX', 'panY']
});

