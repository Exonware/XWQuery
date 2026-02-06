/**
 * Bootstrap for Angular demo: set CSS base path then register <xwui-button>.
 * Built by Vite; output loaded by Angular index.html.
 */
import { XWUIComponent } from '../../src/components/component/XWUIComponent/XWUIComponent';

// So XWUI components load CSS from /xwui/ (public/xwui/ served as static in dev and build)
(XWUIComponent as any).cssBasePath = '/xwui/';

// Side effect: registers <xwui-button> custom element
import '../../src/components/component/XWUIButton/index';
