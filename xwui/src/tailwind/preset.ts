/**
 * XWUI Tailwind Preset
 * Ready-to-use Tailwind configuration preset with XWUI tokens
 * 
 * Usage in tailwind.config.js:
 * ```js
 * module.exports = {
 *   presets: [require('./src/tailwind/preset')],
 *   // ... your config
 * }
 * ```
 */

import type { Config } from 'tailwindcss';
import { mapXWUITokensToTailwind } from './token-mapper';

const xwuiPreset: Config = {
    content: [
        './src/**/*.{html,ts,tsx,js,jsx}',
        './index.html',
    ],
    theme: {
        ...mapXWUITokensToTailwind(),
    },
    plugins: [],
};

export default xwuiPreset;
