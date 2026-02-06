/**
 * XWUIInputOTP Component Exports
 */

import { XWUIInputOTP } from './XWUIInputOTP';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInputOTP } from './XWUIInputOTP';
export type { XWUIInputOTPConfig, XWUIInputOTPData } from './XWUIInputOTP';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInputOTP, 'xwui-input-otp', {
    flatAttrsToConfig: ['length', 'type', 'size', 'className'],
    flatAttrsToData: ['value']
});

