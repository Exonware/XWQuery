/**
 * XWUIDependencyVisualizer Component Exports
 */

import { XWUIDependencyVisualizer } from './XWUIDependencyVisualizer';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIDependencyVisualizer } from './XWUIDependencyVisualizer';
export type { XWUIDependencyVisualizerConfig, XWUIDependencyVisualizerData, TaskNode, DependencyLink } from './XWUIDependencyVisualizer';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIDependencyVisualizer, 'xwui-dependency-visualizer', {
    flatAttrsToConfig: ['layout', 'showControls', 'editable', 'className'],
    flatAttrsToData: ['tasks', 'dependencies']
});

