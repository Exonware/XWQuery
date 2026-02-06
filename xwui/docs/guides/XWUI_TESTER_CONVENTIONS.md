# XWUI Tester Conventions

**No inline separation rule:** Keep markup and logic separate. Do not put TypeScript inside HTML, and do not put HTML strings inside TypeScript.

## 1. No TypeScript inline in HTML

- Each tester page is an HTML file that loads a single script:  
  `<script type="module" src="./TesterComponentName.ts"></script>`
- All logic lives in the companion `.ts` file (imports, `XWUIComponent.cssBasePath`, component setup, event wiring). No `<script type="module">` blocks with code inside the HTML.

## 2. No HTML inline in TypeScript

- Do not build tester content with large HTML strings in TS (e.g. `testArea.innerHTML = \`<div>...</div>\``).
- Put the tester content markup in the HTML file, then reference it from TypeScript:
  - In the HTML: add a `<template id="tester-<name>-content">...</template>` with the structure (config divs, viewport divs, etc.).
  - In the TS: get the template, clone its content, and append to the test area:
    ```ts
    const template = document.getElementById('tester-<name>-content');
    if (template && template instanceof HTMLTemplateElement) {
      testArea.appendChild(template.content.cloneNode(true));
    }
    ```
- **Reference implementation:** `src/components/XWUIViewport2D/testers/TesterXWUIViewport2D.html` and `TesterXWUIViewport2D.ts`.

## 3. Small dynamic fragments

- Small, dynamic fragments (e.g. error messages with `${error.message}`, or `renderItem` callbacks that build one item at a time) may still use `innerHTML` or `div.innerHTML = \`...\`` in TS. The rule is: **main tester content** lives in the HTML template; small one-off or callback-generated markup is acceptable in TS.

## 4. Vite / build

- No inline-script plugins. HTML only references external `.ts`; Vite compiles them. Post-build rewrites `src="./*.ts"` to `src="./*.js"` in dist.
