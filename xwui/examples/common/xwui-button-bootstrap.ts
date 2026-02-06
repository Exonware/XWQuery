/**
 * Shared bootstrap: set CSS base path then register <xwui-button>.
 * Built once; output (xwui-button.mjs + xwui/*.css) is copied or linked into each framework example.
 */
import { XWUIComponent } from '../../src/components/component/XWUIComponent/XWUIComponent';

// Apps serve common assets at / so /xwui/ is the CSS base path
(XWUIComponent as any).cssBasePath = '/xwui/';

import '../../src/components/component/XWUIButton/index';
