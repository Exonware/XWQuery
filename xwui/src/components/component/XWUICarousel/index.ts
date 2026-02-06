/**
 * XWUICarousel Component Exports
 */

import { XWUICarousel } from './XWUICarousel';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICarousel } from './XWUICarousel';
export type { XWUICarouselConfig, XWUICarouselData, XWUICarouselItem } from './XWUICarousel';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICarousel, 'xwui-carousel', {
    flatAttrsToConfig: ['autoplay', 'interval', 'showIndicators', 'showArrows', 'loop', 'className'],
    flatAttrsToData: ['items']
});

