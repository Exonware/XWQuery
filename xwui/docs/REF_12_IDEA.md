# XWUI Idea Reference (REF_12_IDEA)

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.1  
**Last Updated:** 09-Feb-2026

---

## Overview

This document captures and validates the **core idea behind XWUI**: an extensible, native-TypeScript UI component library for frontends that is **multi-engine**, **high-performance**, and suitable for **web, hybrid mobile, and desktop applications**. It clarifies the styling model, component taxonomy, configuration approach, and target ecosystem. It also **validates** claims against the codebase and industry practice and **flags invalid or ambiguous** items in red.

**Related Documents:**
- eXonware **GUIDE_12_IDEA.md** (idea capture process) — in parent repo `docs/guides/`
- [GUIDE_COMPONENT_TYPES.md](guides/GUIDE_COMPONENT_TYPES.md) — Component vs Power vs Super
- [GUIDE_61_DEP_TS_XWUI.md](guides/GUIDE_61_DEP_TS_XWUI.md) — Deployment and framework/tool matrix
- [XWUI_FRAMEWORK_COMPARISON.md](XWUI_FRAMEWORK_COMPARISON.md) — Competitor comparison
- [ROUNDNESS_DIMENSIONS.md](ROUNDNESS_DIMENSIONS.md) — Roundness and style system

---

## Table of Contents

1. [The Idea in One Paragraph](#the-idea-in-one-paragraph)
2. [Validated Pillars](#validated-pillars)
3. [Styling Model: Skeleton vs Theme](#styling-model-skeleton-vs-theme)
4. [Component Tiers: Component, Power, Super](#component-tiers-component-power-super)
5. [Configuration and Data (JSON)](#configuration-and-data-json)
6. [Data Updates and Reactivity](#data-updates-and-reactivity)
7. [Target: Better Than (Competitors)](#target-better-than-competitors)
8. [Target: Works With (Frameworks)](#target-works-with-frameworks)
9. [Target: Works With (Tools & Meta-Frameworks)](#target-works-with-tools--meta-frameworks)
10. [Validation Summary](#validation-summary)
11. [Invalid or Ambiguous Items (Red Flags)](#invalid-or-ambiguous-items-red-flags)
12. [Checklist and Next Steps](#checklist-and-next-steps)

---

## The Idea in One Paragraph

XWUI aims to be an **extensible UI component library** written in **native TypeScript** that runs across **multiple engines and platforms** with **high performance**. It is intended not only for web applications but also for **mobile and desktop applications** (via web runtimes such as Capacitor, Electron, or Tauri). The library should be **complete, accurate, and up to date**, with **styling** as a first-class concern: the **skeleton** (layout and structure) is controlled by each component, while **colors, fonts, roundness, and other theme aspects** are controlled by a centralized **styles system**. Components are organized into three tiers—**Component**, **Power**, and **Super**—with **Super** representing full sub-applications (e.g. form editor, workflow, spreadsheet) that can be composed and dropped into a host app. The target is **cross-engine, cross-platform** usage, with **JSON** as the primary vehicle for **data, configuration, schema, system/app/user settings, and localization**. Every component extends a **base component** that defines a **schema** for inputs and **data**; when data is updated, the design goal is that **only the affected UI parts** are updated. The same single **configuration object** (schema, system settings, app settings, user settings, localization, data) is passed into any component so it can render and update accordingly.

---

## Validated Pillars

| Pillar | Status | Evidence |
|--------|--------|----------|
| Extensible UI components | ✅ Valid | 190+ components; `component/`, `power/`, `super/` structure; base class `XWUIComponent`. |
| Native TypeScript | ✅ Valid | Core is TypeScript; no framework runtime in core; Custom Elements + optional wrappers. |
| Multi-engine (browsers + frameworks) | ✅ Valid | Works in any browser (Blink, WebKit, Gecko); consumable by React, Vue, Angular, etc. via CE or wrappers. |
| High performance | ✅ Design goal | Architecture supports it; fine-grained updates are per-component (see [Data Updates](#data-updates-and-reactivity)). |
| Web + mobile + desktop apps | ✅ Valid *with clarification* | Same components run in web, and in **hybrid** mobile/desktop (Capacitor, Electron, Tauri). Not native iOS/Android/desktop without a web runtime. |
| Complete, accurate, up-to-date library | ✅ Design goal | Ongoing; component count and docs reflect intent. |
| Styling: skeleton (component) vs theme (styles) | ✅ Valid | `src/styles/` (theme, roundness, colors, typography); component CSS uses variables; see [ROUNDNESS_DIMENSIONS.md](ROUNDNESS_DIMENSIONS.md), [REF_COMPLIANCE_QUICK_REFERENCE.md](REF_COMPLIANCE_QUICK_REFERENCE.md). |
| Three tiers: Component, Power, Super | ✅ Valid | [GUIDE_COMPONENT_TYPES.md](guides/GUIDE_COMPONENT_TYPES.md); folders `component/`, `power/`, `super/`. |
| JSON for config and data | ✅ Valid | `conf_sys`, `conf_usr`, `conf_comp`, `data`, `schema` (path); `styles.schema.json`, `styles.data.json`; ThemeLoader. |
| Base component with schema | ✅ Valid | `XWUIComponent` in `XWUIComponent.ts`; schema path; `conf_comp` and `data` in schemas. |
| Single big JSON (schema + settings + data) | ✅ Valid | One config object per component instance; structure matches base class and docs. |

---

## Styling Model: Skeleton vs Theme

- **Skeleton (component-controlled):** Layout, structure, and DOM shape are defined by each component. Component CSS may use layout-related variables but does not hardcode colors or roundness.
- **Theme (styles-controlled):** Colors, fonts, roundness, lines, shadows, spacing, and accents are driven by the **styles system** in `src/styles/`:
  - **Style:** e.g. `basic`, `glass`, `modern` (shadows, spacing).
  - **Color / accent:** Theme and accent palettes (light, dark, blue, etc.).
  - **Roundness:** Generic and detailed shape types (e.g. `overlay`, `dialog`, `button`) and base sizes (`xs`–`xxl`, `full`); see [ROUNDNESS_DIMENSIONS.md](ROUNDNESS_DIMENSIONS.md).
  - **Lines, typography, brand:** Centralized in theme/roundness/lines/typography CSS.

Every piece can be styled; the split between skeleton and theme is documented in compliance and style-dependency comments (e.g. base, brand, style, theme, roundness, lines, typography).

---

## Component Tiers: Component, Power, Super

| Tier | Marketing name | Scope | Folder | Examples |
|------|----------------|-------|--------|----------|
| 1 | **Component** | Single concern; building block | `component/` | Button, Input, Card, Tabs, Dialog, Form |
| 2 | **Power Component** | Many features in one widget | `power/` | DataGrid, DiffEditor, RichTextEditor, Chart, Command |
| 3 | **Super Component** | Full sub-application; app-in-an-app | `super/` | FormEditor, ScriptEditor, Workflow, Spreadsheet, PDFViewer |

Super components are composable sub-applications (e.g. shopping, payment management, social posting) that can be dropped into a host application. See [GUIDE_COMPONENT_TYPES.md](guides/GUIDE_COMPONENT_TYPES.md).

---

## Configuration and Data (JSON)

- **Base component** (`XWUIComponent`) defines standard inputs:
  - `container`, `schema` (path to component schema), `conf_sys`, `conf_usr`, `conf_comp`, `data`.
- **One configuration object** per instance can carry:
  - **Schema** (or path to it) describing component inputs.
  - **System settings** (`conf_sys`), **app settings**, **user settings** (`conf_usr`), **localization**.
  - **Data** for the component.
- This object is passed into any component; the component renders and updates from it. Configuration is **JSON-friendly** and documented in schemas and [GUIDE_61_DEP_TS_XWUI.md](guides/GUIDE_61_DEP_TS_XWUI.md).

---

## Data Updates and Reactivity

- **Design goal:** When data is updated, **only the part of the UI that depends on the changed data** should update, not the whole component.
- **Mechanism:** Base class provides `updateData(updates: Partial<TData>)`; subclasses can override lifecycle/update hooks to apply only the necessary DOM changes.
- **Validation:** Fine-grained DOM updates are **not automatic**; they depend on each component’s implementation. The **pattern and API** support the goal; full consistency across all components is an ongoing implementation concern.

---

## Target: Better Than (Competitors)

XWUI aims to be **better or differentiated** relative to the following ecosystems:

| Competitor | Category | Note |
|------------|----------|------|
| Ant Design | React design system | XWUI is framework-agnostic; same components across frameworks. |
| Ant Design Vue | Vue design system | Same. |
| NG-ZORRO | Angular component library | Same; XWUI works in Angular via Custom Elements or wrappers. |
| Radix UI | Headless primitives | XWUI provides styled, token-driven components; different positioning. |
| shadcn/ui | Copy-paste / Tailwind | XWUI is installable package + optional Tailwind coexistence. |
| MUI | React Material Design | XWUI is framework-agnostic and JSON/schema-driven. |
| Chakra UI | React theme/tokens | XWUI shares token philosophy but is framework-agnostic. |
| **PrimeFaces** | **Server-side Java (JSF)** | **See [Red Flags](#invalid-or-ambiguous-items-red-flags): not a like-for-like competitor.** |
| Ionic Framework | Mobile/hybrid shell + components | XWUI focuses on components; can be embedded in Ionic/Capacitor. |
| Framework7 | Mobile/hybrid | Same; XWUI as component layer. |
| Bootstrap | CSS/component framework | XWUI is TS component library with its own theme system. |
| Tailwind CSS | Utility-first CSS | XWUI can be used alongside Tailwind; tokens can align. |

For PrimeNG (Angular), PrimeReact (React), PrimeVue (Vue): these are the appropriate Prime* comparisons; PrimeFaces is server-side Java and belongs to a different category.

---

## Target: Works With (Frameworks)

XWUI is designed to **work with** these frameworks (via Custom Elements and/or thin wrappers):

| Framework | Consumption | Reference |
|-----------|-------------|-----------|
| React | Wrappers or Custom Elements | GUIDE_61_DEP_TS_XWUI, XWUI_FRAMEWORK_COMPARISON |
| Angular | Custom Elements (CUSTOM_ELEMENTS_SCHEMA) or wrappers | Same |
| Vue | Custom Elements or wrappers | Same |
| Svelte | Custom Elements or onMount + XWUI API | Same |
| Solid | Custom Elements or wrappers | Same |
| Qwik | Custom Elements preferred; lazy load | Same |
| Preact | Same as React | Same |
| Ember | Custom Elements or Glimmer wrappers | Same |
| Lit | Custom Elements natively | Same |
| Alpine.js | Custom Elements or Alpine wrappers | Same |
| Stencil | Custom Elements (same platform) | Same |

All of the above can consume Web Components / Custom Elements; XWUI provides that plus React wrappers where applicable.

---

## Target: Works With (Tools & Meta-Frameworks)

XWUI is intended to **work in projects** that use these tools (bundling, meta-frameworks, testing, quality):

| Tool / ecosystem | Role | XWUI usage |
|------------------|------|------------|
| Astro | Static / islands | ESM; use XWUI in client islands or SPA. |
| single-spa | Micro-frontends | XWUI as shared dependency or in-shell; ESM/CDN. |
| Web Components | Standard custom elements | XWUI Custom Elements are first-class. |
| Vite | Build and dev server | Primary build for XWUI; library mode ESM. |
| Webpack | Build | ESM/UMD consumable. |
| Rollup | Build (library) | ESM/CJS/UMD. |
| Parcel | Build | ESM. |
| Storybook | Component docs and QA | Deploy Storybook for XWUI. |
| Playwright | E2E tests | Testers and Storybook. |
| Tailwind CSS | Utility CSS | Coexist; document tokens and prefix/purge. |
| TypeScript | Types and compile | Emit `.d.ts`; strict compatibility. |
| ESLint | Linting | Publish or document recommended config. |

“Works with” here means: **can be bundled, integrated, and tested** in applications using these tools; see [GUIDE_61_DEP_TS_XWUI.md](guides/GUIDE_61_DEP_TS_XWUI.md).

---

## Validation Summary

- **Validated and aligned with codebase/docs:** Extensible TS components, multi-engine (browsers + frameworks), web + hybrid mobile/desktop, styling model (skeleton vs theme), three tiers (Component/Power/Super), JSON config and schema, base component, single config object, framework and tool matrix.
- **Design goals (implementation ongoing):** High performance; complete/accurate/up-to-date library; fine-grained data-driven UI updates (API supports it; per-component implementation).
- **Clarifications:** “Mobile/desktop” = same codebase in **web runtimes** (hybrid/PWA), not native Swift/Kotlin/Qt without a web view. “Multi-engine” = browser engines + framework runtimes.

---

## Invalid or Ambiguous Items (Red Flags)

The following items are **invalid as stated** or **need clarification**:

---

### 1. **PrimeFaces as direct competitor**

<span style="color:red">**INVALID**</span> — PrimeFaces is a **server-side Java (JSF) component library**. XWUI is a **client-side TypeScript UI library**. They are not in the same category.

- **Use instead:** Compare XWUI to **PrimeNG** (Angular), **PrimeReact** (React), **PrimeVue** (Vue), which are client-side, TS/JS component libraries.
- **Action:** Remove or replace “PrimeFaces” in competitor lists with PrimeNG/PrimeReact/PrimeVue as appropriate.

---

### 2. **“Multi-engine” without clarification**

<span style="color:red">**AMBIGUOUS**</span> — “Multi-engine” can mean:

- Browser rendering engines (Blink, WebKit, Gecko) → **Valid:** XWUI runs in any standard browser.
- Framework runtimes (React, Vue, Angular, etc.) → **Valid:** XWUI works with many frameworks via CE/wrappers.
- Native mobile/desktop “engines” without a web view → **Invalid:** XWUI is DOM/TS; it does not run as native iOS/Android/desktop UI without a web runtime (e.g. Capacitor, Electron, Tauri).

**Action:** In REF_12_IDEA and any marketing copy, define “multi-engine” explicitly (e.g. “browser engines and framework runtimes”) and clarify that mobile/desktop support is via **web runtimes** (hybrid/PWA).

---

### 3. **“Mobile or desktop applications” without “via web runtime”**

<span style="color:red">**MISLEADING IF UNQUALIFIED**</span> — XWUI can be used **inside** mobile and desktop applications that host a **web view** (Capacitor, Electron, Tauri, PWA). It does **not** produce native mobile (Swift/Kotlin) or native desktop (e.g. Qt) UI by itself.

**Action:** Always qualify: “mobile and desktop applications **via web runtimes (e.g. Capacitor, Electron, Tauri) or PWA**.”

---

### 4. **“Only the part that was updated in the data will update”**

<span style="color:red">**DESIGN GOAL, NOT GUARANTEED EVERYWHERE**</span> — The base class provides `updateData(Partial<TData>)` and extension points. Whether **only** the affected DOM is updated depends on **each component’s implementation**. There is no global fine-grained reactivity guarantee in the base.

**Action:** Document as a **design goal** and **implementation guideline**; avoid stating it as a universal guarantee until verified per component or enforced by a shared pattern.

---

## Checklist and Next Steps

- [ ] Use this document as the single reference for “what XWUI is” and “what we’re aiming for.”
- [ ] When comparing to competitors, use PrimeNG/PrimeReact/PrimeVue instead of PrimeFaces.
- [ ] In all external/marketing text, clarify “multi-engine” and “mobile/desktop (via web runtimes).”
- [ ] Treat “only the updated part re-renders” as a design goal; add or refine patterns in base/component docs.
- [ ] Keep [GUIDE_COMPONENT_TYPES.md](guides/GUIDE_COMPONENT_TYPES.md), [GUIDE_61_DEP_TS_XWUI.md](guides/GUIDE_61_DEP_TS_XWUI.md), [ROUNDNESS_DIMENSIONS.md](ROUNDNESS_DIMENSIONS.md), and [XWUI_FRAMEWORK_COMPARISON.md](XWUI_FRAMEWORK_COMPARISON.md) aligned with REF_12_IDEA.
- [ ] Keep Firebase frontend parity (Hosting, Auth UI, data UI, Functions/API) documented and up to date in REF_22_PROJECT.md; adjust this idea doc if the scope of parity changes.

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| eXonware GUIDE_12_IDEA.md | Idea capture process (parent repo) |
| [GUIDE_COMPONENT_TYPES.md](guides/GUIDE_COMPONENT_TYPES.md) | Component vs Power vs Super |
| [GUIDE_61_DEP_TS_XWUI.md](guides/GUIDE_61_DEP_TS_XWUI.md) | Deployment, frameworks, tools |
| [GUIDE_33_DEV_TS.md](guides/GUIDE_33_DEV_TS.md) | Building TS frontends with XWUI |
| [XWUI_FRAMEWORK_COMPARISON.md](XWUI_FRAMEWORK_COMPARISON.md) | Competitor comparison |
| [ROUNDNESS_DIMENSIONS.md](ROUNDNESS_DIMENSIONS.md) | Roundness and style system |
| [REF_COMPLIANCE_QUICK_REFERENCE.md](REF_COMPLIANCE_QUICK_REFERENCE.md) | Style dependencies and compliance |

---

*One idea, validated; one library, cross-engine and cross-platform by design.*
