# TypeScript + XWUI Frontend Development Guide (GUIDE_33_DEV_TS)

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.1  
**Last Updated:** 07-Feb-2026 12:00:00.000

---

## Purpose

How to build TypeScript frontends that **reuse XWUI components** correctly, including component patterns, `conf_comp`/`data`, CSS/layout, build/asset handling, and all supported usage modes.

---

## Quick Start

- **Use this guide when:**
  - You are building TypeScript frontends that integrate XWUI components.
  - You need to understand component composition, `conf_comp`/`data` contracts, and CSS/layout rules.
  - You want to reuse existing XWUI components instead of building new ones.
- **You are responsible for:**
  - Composing/reusing XWUI components and wiring them into TS apps safely.
  - Ensuring correct `conf_comp`/`data` usage that matches schemas.
  - Following reuse-first decisions (avoid unnecessary new components).
- **You are NOT responsible for:**
  - Defining universal development standards (see `GUIDE_31_DEV.md`).
  - Writing Python implementations (see `GUIDE_32_DEV_PY.md`).
  - Writing Rust implementations (see `GUIDE_34_DEV_RUST.md`).
  - Deciding architecture (see `GUIDE_13_ARCH.md`).
- **Main outputs:**
  - TS app integration patterns (component composition, wrappers, build/asset rules).
  - Correct `conf_comp`/`data` usage that matches schemas.
  - Reuse-first decisions documented.

---

## Persona

- **Role:** TypeScript UI Engineer — composes/reuses XWUI components and wires them into TS apps safely.
- **Primary Inputs:**
  - XWUI component library + schemas/testers
  - `conf_comp`/`data` contracts and app state requirements
  - DX expectations (`GUIDE_14_DX.md`) for external developers
- **Primary Outputs:**
  - TS app integration patterns (component composition, wrappers, build/asset rules)
  - Correct `conf_comp`/`data` usage that matches schemas
  - Reuse-first decisions (avoid unnecessary new components)

---

## Table of Contents

1. [Overview](#overview)  
2. [XWUI Architecture in a TS App](#xwui-architecture-in-a-ts-app)  
3. [Reusing XWUI Components](#reusing-xwui-components)  
4. [Using XWUI from TypeScript](#using-xwui-from-typescript)  
5. [CSS and Layout in TS + XWUI](#css-and-layout-in-ts--xwui)  
6. [JSON Schemas, conf_comp, and data](#json-schemas-conf_comp-and-data)  
7. [Testers and Local Development](#testers-and-local-development)  
8. [Build Process and Assets](#build-process-and-assets)  
9. [All Ways to Use XWUI Components](#all-ways-to-use-xwui-components)  
10. [Common Mistakes and Fixes](#common-mistakes-and-fixes)  
11. [Best Practices and Reuse Checklist](#best-practices-and-reuse-checklist)  

---

## Coordination & Handoffs

### Works With

- **GUIDE_31_DEV.md** — Follows universal development standards and error-fixing philosophy.
- **GUIDE_14_DX.md** — Ensures TS/xWUI integration meets developer experience expectations.
- **GUIDE_13_ARCH.md** — Implements architecture patterns for frontend applications.
- **GUIDE_41_DOCS.md** — Documents TypeScript/xWUI usage per documentation standards.

### NOT Responsible For

- **Defining universal development standards** — This is the responsibility of `GUIDE_31_DEV.md` (Lead Developer).
- **Writing Python implementations** — This is the responsibility of `GUIDE_32_DEV_PY.md` (Python Dev Lead).
- **Writing Rust implementations** — This is the responsibility of `GUIDE_34_DEV_RUST.md` (Rust Core Engineer).
- **Deciding architecture** — This is the responsibility of `GUIDE_13_ARCH.md` (Solution Architect).

TS implements TypeScript/xWUI frontends but follows universal standards and architectural decisions.

---

## Overview

### Goal

This guide explains how to:

- **Integrate XWUI components** into a TypeScript frontend  
- **Reuse existing components** instead of building new ones  
- Handle **CSS/layout**, **assets**, and **build setup** so components render correctly  
- Use **schemas, testers, React wrappers, and Custom Elements** consistently  

### Key Ideas

- **Framework-agnostic core**: XWUI components are plain JS/TS classes extending `XWUIComponent`.  
- **Two main inputs**: `conf_comp` (configuration) and `data` (runtime data).  
- **Reuse-first**: Prefer composing existing components over writing new UI from scratch.  
- **Strict CSS discipline**: Centralized tokens/colors, no random inline styles.  
- **Schema- and tester-driven**: Each component has a JSON schema + testers that define expected usage.

---

## XWUI Architecture in a TS App

### What XWUI Provides

- **Base class**: `XWUIComponent` with lifecycle, DOM root, event wiring, update hooks.  
- **Library of components**: Tabs, editors, layouts, form elements, etc.  
- **JSON schemas**: Define `conf_comp` and `data` structure.  
- **Testers**: Example pages that show correct configuration and usage.

### How It Fits Into TypeScript

Your TypeScript app (Vite/Webpack/etc.) is responsible for:

- Bootstrapping: loading CSS, mounting root elements.  
- Instantiating XWUI components and wiring them into your app state/router.  
- Providing `conf_comp`/`data` that match the component’s schema.  
- Handling module/asset resolution (paths, URLs).

You **do not** rewrite XWUI components; you **compose** them.

---

## Reusing XWUI Components

### When to Reuse vs. Build

- **Reuse an XWUI component when**:
  - You need UI that looks/behaves like an existing component.  
  - You can express your needs via `conf_comp` and `data`.  
  - You only need small variations in layout, labels, or behavior already supported via options.

- **Consider a new component only when**:
  - No existing component fits conceptually, even after composition.  
  - The UX pattern truly does not exist anywhere in XWUI.  
  - Reuse via composition (nesting existing components) is impossible or would be a hack.

### How to Discover Reusable Components

- **Scan the component library**: names, descriptions, and schemas.  
- **Open testers** for candidate components to see:
  - Inputs they accept  
  - Combinations of `conf_comp`/`data` that achieve a similar UX  
- Prefer: “Can I configure an existing component + compose it?” over “I’ll build a new one”.

### Reuse Patterns

- **Configuration-only reuse**:
  - Same component class, different `conf_comp` for different screens.  
  - Example: `Tabs` with different tab sets, icons, and layouts.

- **Composition**:
  - Place existing components into parent containers/layout components.  
  - Example: `Layout` component with nested `Editor`, `Toolbar`, and `Tabs`.

- **Wrapper reuse**:
  - In React or other frameworks, write thin wrappers around XWUI components that:
    - Map framework props → `conf_comp`/`data`.  
    - Hide low-level wiring from the app.

---

## Using XWUI from TypeScript

### Direct Instantiation (Vanilla TS)

Typical pattern:

```ts
import { SomeXWUIComponent } from 'xwui';

const rootEl = document.getElementById('my-root')!;

const conf_comp = { /* config matching schema */ };
const data = { /* initial data */ };

const comp = new SomeXWUIComponent({
  root: rootEl,
  conf_comp,
  data,
});

// Optionally store comp for later updates
// comp.updateData(newData);
```

### URL and Module Resolution

To avoid classic TS/ESM issues:

- **Use a bundler** like Vite with:
  - `moduleResolution: "bundler"` in `tsconfig.json` (or equivalent).  
- Export/Import XWUI modules in standard ES module style and ensure your bundler resolves the package correctly.  
- For **asset JSON/config files** used by testers:
  - Testers should load from `dist/...` relative to the built output, not `src/...`.

### Events and Integration

Components typically expose:

- Constructor options (root, conf_comp, data).  
- Methods to update data or configuration.  
- Event callbacks or custom events (depending on component).

In TS, wrap these in application services/stores so other parts of the app never talk directly to DOM nodes.

---

## CSS and Layout in TS + XWUI

### Central Principles

- **Centralized styling**:
  - Use `src/styles/` for shared styles, design tokens, and utilities.  
  - Avoid hardcoding colors in component-specific CSS.  
- **Component CSS**:
  - Each XWUI component has its own CSS; your TS app must ensure it is loaded.

### Integrating CSS in TypeScript Projects

Typical issues and solutions:

- **CSS not loading**:
  - TS cannot import `.css` as ES modules without additional tooling.  
  - Solutions:
    - Use bundler support (`import './styles.css'`) and ensure bundler is configured.  
    - Or load CSS via `<link>` in HTML.

- **CSS not copied to `dist/`**:
  - TS compiler only handles `.ts/.tsx`.  
  - Add a build step (NPM script or bundler config) to copy CSS from `src/` to `dist/`.

### Layout and Flexbox Pitfalls

Common problems (especially with tabbed layouts, Monaco editor, etc.):

- **Tabs stack vertically**:
  - Ensure container has `display: flex` and `flex-direction: row !important` where necessary.

- **Multiple tab contents visible at once**:
  - Inactive panels must use `display: none !important`.  
  - Active panel uses `display: flex` or `block`, depending on design.

- **Monaco or editors collapse to 0 height**:
  - Parent containers must have proper flex settings:
    - `min-height: 0` on flex parents.  
    - `flex: 1 1 auto` on editable/scrollable content.

- **CSS specificity conflicts**:
  - For critical layout rules, use:
    - Scoped selectors (`.xwui-tabs .tab-header`)  
    - Explicit specificity; `!important` only for top-level layout “safety net”.

---

## JSON Schemas, conf_comp, and data

### JSON Schema per Component

Each XWUI component has a JSON schema that defines:

- **`conf_comp`**: structural configuration:
  - Layout, visible features, icons, labels.  
  - Behavior toggles (enable/disable features, modes, etc.).
- **`data`**: runtime data:
  - Content (text, rows, datasets).  
  - Current selection, state, or values.

### Working with conf_comp

In TS, you typically:

- Import or load a JSON `conf_comp` from your app’s `data/` folder.  
- Optionally adapt it at runtime (e.g., inject labels, feature flags).  
- Pass it into the component on creation.

Example:

```ts
import tabsConf from './data/tabs.conf_comp.json';

const comp = new TabsComponent({
  root,
  conf_comp: tabsConf,
  data: { activeTabId: 'overview' },
});
```

### Working with data

- Keep `data` as a separate object in your app state/store.  
- When data changes:
  - Update the store.  
  - Call a component method (e.g. `setData`, `updateData`) to sync the UI.

---

## Testers and Local Development

### What Testers Are

- Small HTML/TS pages living under `testers/` that:
  - Import the component.  
  - Instantiate it with example `conf_comp` and `data`.  
  - Load all required CSS/JS assets.

### Why Testers Matter for Reuse

- They show **canonical usage** of a component:  
  - How to structure `conf_comp`.  
  - How `data` flows in.  
  - How the component should look and behave.

Before using a component in your TS app:

1. Run its tester locally.  
2. Confirm the visual/behavioral match to the product requirement.  
3. Base your app integration directly on the tester’s code/config.

### Asset Paths in Testers

- Testers should reference assets under `dist/` when running against built artifacts.  
- Common pitfall: testers still pointing at `src/...` after build, causing 404s.

---

## Build Process and Assets

### CSS and Static Assets

- **TS compilation** won’t copy:
  - `.css`, `.json` schemas, icons (SVG), or other static assets.  
- Ensure your build:
  - Copies the entire `styles/`, `data/`, and icon folders into `dist/`.  
  - Maintains relative structure expected by components and testers.

### Vite / Bundler Configuration

Recommended patterns:

- Use Vite (or similar modern bundler) with:
  - `moduleResolution: "bundler"` in `tsconfig`.  
  - Static assets configured via its assets pipeline or custom copy plugin.

- Avoid “naked” `<script type="module">` setups without a bundler for anything non-trivial.  
- When using `<script type="module">`:
  - Avoid top-level `return` statements (they cause “Illegal return statement” errors).  
  - Use `if/else` or early `throw` instead.

---

## All Ways to Use XWUI Components

XWUI components are designed to be reused in three main modes.

### 1. Direct Instantiation (Vanilla JS/TS)

- Import the class and instantiate it with `{ root, conf_comp, data }`.  
- Best for:
  - Simple pages.  
  - Non-framework environments.  
  - Custom integration into existing JS apps.

### 2. React Wrappers

- Thin wrapper components that:
  - Accept React props (flat or grouped).  
  - Map them to `conf_comp`/`data`.  
  - Manage lifecycle via `useEffect`, refs, etc.

Use when:

- Your main app is React.  
- You want to keep XWUI as implementation detail behind a React component interface.

### 3. Custom Elements (Web Components)

- XWUI component exposed as a `customElements.define('xwui-xyz', ...)`.  
- Configuration/data typically passed via:
  - Attributes, properties, or `data-*` attributes.  
  - JS APIs on the element instance.

Use when:

- You need framework-agnostic embedding via HTML.  
- You want drop-in usage in multiple environments.

---

## Common Mistakes and Fixes

- **Mistake: Creating a new component when reuse is possible**  
  - **Fix:** Search the library + testers for similar UX; reuse/configure/compose.

- **Mistake: Putting colors and branding directly in component CSS**  
  - **Fix:** Use central `styles/` and design tokens. Components consume tokens, not raw colors.

- **Mistake: Loading assets from `src/` in production testers**  
  - **Fix:** Point testers and app to `dist/` or use bundler-resolved imports.

- **Mistake: Tabs or layouts rendering incorrectly in TS app but fine in testers**  
  - **Fix:** Ensure all component CSS is loaded and that parent containers replicate the tester’s DOM + flex rules.

- **Mistake: “Static method not found” or weird module errors**  
  - **Fix:** Clean/rebuild, ensure exports/imports are correct, and bundler resolution is configured.

---

## Best Practices and Reuse Checklist

### Reuse-First Checklist

- **Before writing UI code**:
  - **Identify candidate XWUI components** that match the UX.  
  - Confirm they can be configured via `conf_comp` and `data`.

- **Before writing a new component**:
  - Can you achieve the design via **configuration**?  
  - Can you use **composition** of existing components?  
  - Would a **React/custom-element wrapper** solve your integration issue?

### Integration Checklist

- **Schemas and Config**:
  - `conf_comp` and `data` conform to schema.  
  - Shared configs live under a central `data/` folder, not scattered.

- **CSS and Layout**:
  - All required component CSS loaded in the TS app.  
  - Layout containers mimic tester DOM + flex rules.  
  - Critical rules have sufficient specificity (minimal `!important` where needed).

- **Build and Assets**:
  - CSS, JSON, icons are copied into `dist/`.  
  - Testers and app reference `dist/` or use bundler asset handling.

- **Usage Mode** (choose one per integration):
  - Direct instantiation, React wrapper, or Custom Element.  
  - No ad-hoc mixing unless there is a clear reason.

By following this guide, you can build TypeScript frontends that **leverage XWUI’s component library instead of reinventing UI**, stay consistent with design and behavior, and avoid the classic pitfalls around CSS, layouts, and asset handling.
