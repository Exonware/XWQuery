/**
 * Tailwind CSS Configuration for XWUI
 * 
 * This config extends XWUI's design tokens into Tailwind CSS.
 * XWUI CSS variables are automatically mapped to Tailwind theme tokens.
 * Uses preservation settings to determine which paths to scan.
 */

const { generateXWUITailwindConfig } = require('./src/tailwind/config.ts');
const preservationSettings = require('./src/config/preservation_settings.json');

// Build content paths based on preservation settings
// If a section is preserved, Tailwind should scan it
function buildContentPaths() {
    const basePaths = [
        './src/**/*.{html,ts,tsx,js,jsx}',
        './index.html',
        './**/*.html',
    ];
    
    const preservation = preservationSettings.preservation || {};
    const preservedSections = [];
    
    // Add paths for preserved sections
    if (preservation.components) preservedSections.push('./src/components/**/*.{html,ts,tsx,js,jsx}');
    if (preservation.pages) preservedSections.push('./src/pages/**/*.{html,ts,tsx,js,jsx}');
    if (preservation.app) preservedSections.push('./src/app/**/*.{html,ts,tsx,js,jsx}');
    if (preservation.api) preservedSections.push('./src/api/**/*.{html,ts,tsx,js,jsx}');
    if (preservation.styles) preservedSections.push('./src/styles/**/*.{html,ts,tsx,js,jsx}');
    if (preservation.tailwind) preservedSections.push('./src/tailwind/**/*.{html,ts,tsx,js,jsx}');
    
    // Also include dist paths if root is set
    const rootDir = preservationSettings.root || 'dist';
    if (rootDir) {
        preservedSections.push(`./${rootDir}/**/*.{html,js,jsx}`);
    }
    
    return [...basePaths, ...preservedSections];
}

module.exports = generateXWUITailwindConfig({
    content: buildContentPaths(),
    plugins: [
        // Add Tailwind plugins here if needed
        // require('@tailwindcss/forms'),
        // require('@tailwindcss/typography'),
    ],
    jit: true,
});
