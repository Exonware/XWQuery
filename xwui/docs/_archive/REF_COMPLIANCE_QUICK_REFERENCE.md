 # XWUI Component Compliance Quick Reference
 
 **Last Updated:** 2025-01-30  
 **Purpose:** Quick reference guide for fixing common compliance issues
 
 ---
 
 ## Top 10 Compliance Fixes
 
 ### 1. Create Missing JSON Schema Files (90 components)
 
 **Issue:** Component missing `ComponentName.json` file
 
 **Fix:**
 ```json
 {
   "$schema": "http://json-schema.org/draft-07/schema#",
   "id": "XWUIComponentName",
   "name": "XWUI Component Name",
   "description": "Brief description of component functionality.",
   "path": "category.subcategory",
   "tags": ["tag1", "tag2", "desktop", "mobile", "tablet"],
   "type": "object",
   "additionalProperties": false,
   "properties": {
     "conf_comp": { /* component config */ },
     "data": { /* component data */ }
   }
 }
 ```
 
 **Components Affected:** 90 components (see full report)
 
 ---
 
 ### 2. Replace Hardcoded Colors (97 components)
 
 **Issue:** CSS contains hardcoded color values
 
 **Fix:**
 ```css
 /* ❌ BAD */
 background-color: #007bff;
 color: #ffffff;
 
 /* ✅ GOOD */
 background-color: var(--color-button-primary-bg, var(--color-primary));
 color: var(--color-button-primary-text, var(--color-text-on-primary));
 ```
 
 **Components Affected:** 97 components with CSS files
 
 ---
 
 ### 3. Add Child Component Cleanup (175 components)
 
 **Issue:** `destroy()` method doesn't clean up child components
 
 **Fix:**
 ```typescript
 public destroy(): void {
     // Clean up child components
     if (this.button) {
         this.button.destroy();
     }
     if (this.dialog) {
         this.dialog.destroy();
     }
     if (this.input) {
         this.input.destroy();
     }
     
     // Clean up event listeners
     this.eventListeners.forEach(listener => {
         listener.element.removeEventListener(listener.event, listener.handler);
     });
     this.eventListeners = [];
     
     // Clear references
     this.button = null;
     this.dialog = null;
     this.input = null;
 }
 ```
 
 **Components Affected:** All 175 components
 
 ---
 
 ### 4. Implement destroy() Method (27 components)
 
 **Issue:** Component missing `destroy()` method
 
 **Fix:**
 ```typescript
 public destroy(): void {
     // Remove event listeners
     if (this.clickHandler) {
         this.container.removeEventListener('click', this.clickHandler);
     }
     
     // Clear DOM
     this.container.innerHTML = '';
     
     // Clear references
     this.container = null;
 }
 ```
 
 **Components Affected:** 27 components
 
 ---
 
 ### 5. Add Schema ID Field (82 schemas)
 
 **Issue:** Schema missing `id` field
 
 **Fix:**
 ```json
 {
   "$schema": "http://json-schema.org/draft-07/schema#",
   "id": "XWUIComponentName",  // ← Add this (must match component name)
   "name": "XWUI Component Name",
   // ...
 }
 ```
 
 **Components Affected:** 82 existing schemas
 
 ---
 
 ### 6. Add conf_comp Section (48 schemas)
 
 **Issue:** Schema missing `conf_comp` section
 
 **Fix:**
 ```json
 {
   "properties": {
     "conf_comp": {  // ← Add this section
       "type": "object",
       "title": "Component Configuration (conf_comp)",
       "description": "Component-specific settings",
       "additionalProperties": false,
       "properties": {
         "variant": { "type": "string", "enum": ["primary", "secondary"] },
         "size": { "type": "string", "enum": ["small", "medium", "large"] }
       }
     },
     "data": { /* ... */ }
   }
 }
 ```
 
 **Components Affected:** 48 existing schemas
 
 ---
 
 ### 7. Add data Section (47 schemas)
 
 **Issue:** Schema missing `data` section
 
 **Fix:**
 ```json
 {
   "properties": {
     "conf_comp": { /* ... */ },
     "data": {  // ← Add this section
       "type": "object",
       "title": "Component Data",
       "description": "Data to update the component",
       "additionalProperties": false,
       "properties": {
         "content": { "type": "string", "description": "Component content" },
         "value": { "type": "string", "description": "Component value" }
       }
     }
   }
 }
 ```
 
 **Components Affected:** 47 existing schemas
 
 ---
 
 ### 8. Update Tester Imports (174 testers)
 
 **Issue:** Tester not using ES module imports
 
 **Fix:**
 ```html
 <!-- ❌ BAD -->
 <script src="../../dist/components/Component/index.js"></script>
 
 <!-- ✅ GOOD -->
 <script type="module">
     import { ComponentName } from '../index.ts';
     
     const container = document.getElementById('tester-container');
     if (container) {
         const component = new ComponentName(container, {}, {});
     }
 </script>
 ```
 
 **Components Affected:** 174 testers
 
 ---
 
 ### 9. Add Style Dependencies Documentation (72 CSS files)
 
 **Issue:** CSS file missing style dependencies comment
 
 **Fix:**
 ```css
 /**
  * XWUIComponentName Component Styles
  * 
  * Style Dependencies (loaded in testers/app):
  * - Base: reset.css, typography.css, utilities.css
  * - Brand: brand/xwui/brand.css
  * - Style: style/modern/spacing.css, style/modern/shadows.css
  * - Theme: theme/colors/{selected-theme}.css (MANDATORY)
  * - Theme: theme/accents/{selected-accent}.css (MANDATORY)
  * - Roundness: theme/roundness/component/*.css
  * - Lines: theme/lines/component/*.css
  * - Typography: theme/typography/*.css
  */
 
 .xwui-component {
     /* Component styles using CSS variables */
 }
 ```
 
 **Components Affected:** 72 CSS files
 
 ---
 
 ### 10. Remove Tester CSS Files (2 components)
 
 **Issue:** Component has `TesterComponentName.css` file
 
 **Fix:**
 1. Delete `testers/TesterComponentName.css` file  
 2. Ensure tester HTML loads component CSS: `<link rel="stylesheet" href="../ComponentName.css">`  
 3. Use styles system for all styling
 
 **Components Affected:** 2 components
 
 ---
 
 ## Compliance Checklist for New Components
 
 When creating a new component, ensure:
 
 - [ ] `ComponentName.ts` extends `XWUIComponent<TData, TConfig>`
 - [ ] `ComponentName.json` exists with `id`, `name`, `description`, `path`, `tags`
 - [ ] Schema has `conf_comp` and `data` sections (no `meta`)
 - [ ] `index.ts` exports component and registers Custom Element
 - [ ] `react.ts` exports React wrappers (if needed)
 - [ ] `testers/TesterComponentName.html` exists
 - [ ] No `TesterComponentName.css` file
 - [ ] `ComponentName.css` uses only CSS variables (no hardcoded values)
 - [ ] CSS file documents style dependencies
 - [ ] `destroy()` method cleans up child components
 - [ ] Tester uses ES module imports
 
 ---
 
 ## Quick Fix Commands
 
 ### Check Component Compliance
 ```bash
 node tools/check-component-compliance.js ComponentName
 ```
 
 ### View Full Report
 ```bash
 node tools/check-component-compliance.js
 cat COMPONENT_COMPLIANCE_REPORT.json
 ```
 
 ### Find Components with Specific Issues
 ```bash
 # Find components missing JSON schemas
 grep -l "\"hasJsonFile\": false" COMPONENT_COMPLIANCE_REPORT.json
 
 # Find components with hardcoded colors
 grep -l "\"noHardcodedColors\": false" COMPONENT_COMPLIANCE_REPORT.json
 ```
 
 ---
 
 **For detailed information, see:**
 - **Full Compliance Report:** `docs/guides/XWUI_COMPONENT_COMPLIANCE_REPORT.md`
 - **Compliance Summary:** `docs/guides/COMPONENT_COMPLIANCE_SUMMARY.md`
 - **Development Guide:** `docs/guides/GUIDE_DEV_TS_XWUI.md`
 
