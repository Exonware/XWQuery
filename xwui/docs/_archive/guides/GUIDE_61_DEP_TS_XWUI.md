# Deployment Guide: XWUI as a UI Component Library (GUIDE_61_DEP_TS_XWUI)

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.1  
**Last Updated:** 30-Jan-2025

---

## Purpose & Scope

Operational guide for **releasing and deploying XWUI** as a UI component library in the same vein as Ant Design, MUI, Chakra UI, Radix UI, shadcn/ui, NG-ZORRO, PrimeFaces, Ionic, Framework7, Bootstrap, and Tailwind-based systems. This guide covers build outputs, publish targets (npm, CDN), versioning, and how XWUI is consumed across **frameworks**, **meta-frameworks**, and **tooling** so that release mechanics and integration patterns are consistent and repeatable.

---

## Quick Start

- **Use this guide when:**
  - You are preparing a production release of the XWUI component library (npm, CDN, or both).
  - You need to document or verify how XWUI integrates with React, Angular, Vue, Svelte, Solid, Qwik, Preact, Ember, Lit, Alpine.js, or Stencil.
  - You are aligning XWUI with build tools (Vite, Webpack, Rollup, Parcel), meta-frameworks (Astro, single-spa), Web Components, Storybook, Playwright, Tailwind CSS, TypeScript, or ESLint.
- **You are responsible for:**
  - Building library artifacts (ESM, UMD/IIFE, CSS) suitable for npm and CDN.
  - Versioning, tagging, and publishing to npm and/or CDN per release playbook.
  - Keeping framework- and tool-integration notes accurate and tested.
- **You are NOT responsible for:**
  - Deciding release readiness (see QA / release governance).
  - Writing component implementation (see `GUIDE_33_DEV_TS.md`).
  - Defining component taxonomy (see `GUIDE_COMPONENT_TYPES.md`).
- **Main outputs:**
  - Published npm package and/or CDN assets (versioned, cache-friendly).
  - Clear consumption patterns for each supported framework and tool.
  - Verification checklist and post-release install hints.

---

## Persona

- **Role:** Frontend Release / Library Maintainer — turns “ready” XWUI code into a published, installable UI library and ensures it works across frameworks and tooling.
- **Primary Inputs:**
  - Built XWUI artifacts (from Vite/TypeScript build), version state, change notes.
  - Framework and tool matrix (React, Vue, Vite, Storybook, etc.) and compatibility requirements.
- **Primary Outputs:**
  - Published npm package and/or CDN bundle(s), git tags, release notes.
  - Documentation for “Install & use with React/Vue/Vite/…” and tooling (Storybook, Playwright, Tailwind, TypeScript, ESLint).

---

## Table of Contents

1. [Library positioning and comparison](#library-positioning-and-comparison)  
2. [Build outputs and publish targets](#build-outputs-and-publish-targets)  
3. [Framework integration matrix](#framework-integration-matrix)  
4. [Meta-frameworks and build tools](#meta-frameworks-and-build-tools)  
5. [Web Components and design-system alignment](#web-components-and-design-system-alignment)  
6. [Versioning and release flow](#versioning-and-release-flow)  
7. [Guardrails and pre-flight checklist](#guardrails-and-pre-flight-checklist)  
8. [Verification and troubleshooting](#verification-and-troubleshooting)  
9. [Coordination and related guides](#coordination-and-related-guides)  

---

## Library positioning and comparison

XWUI is deployed as a **framework-agnostic UI component library** with TypeScript-first APIs, optional Web Components (Custom Elements), and support for multiple consumption modes. Positioning relative to well-known libraries:

| Library type | Examples | XWUI alignment |
|--------------|----------|-----------------|
| React-focused | Ant Design, MUI, Chakra UI | XWUI is framework-agnostic; React uses wrappers or Custom Elements. |
| Vue-focused | Ant Design Vue, PrimeFaces (Vue) | Same: use wrappers or Custom Elements in Vue. |
| Angular | NG-ZORRO | Same: wrappers or Custom Elements in Angular. |
| Headless / unstyled | Radix UI | XWUI provides styled components; theming via CSS variables/tokens. |
| Copy-paste / Tailwind | shadcn/ui | XWUI is installable package + optional Tailwind integration. |
| Mobile / hybrid | Ionic, Framework7 | XWUI can be embedded; no mobile shell—focus on components. |
| Utility-first | Tailwind CSS | XWUI can be used alongside Tailwind; design tokens can align. |

**Deployment implication:** Build and publish artifacts that support **vanilla TS/JS**, **ESM**, and **UMD**; document wrapper patterns for React, Vue, Angular, Svelte, Solid, Qwik, Preact, Ember, Lit, Alpine.js, and Stencil so XWUI fits into each ecosystem.

---

## Build outputs and publish targets

### Artifacts to produce

| Artifact | Purpose | Consumed by |
|----------|---------|-------------|
| `xwui.es.js` (ESM) | Tree-shakeable, type="module" | Vite, Rollup, Webpack, Parcel, Astro, all modern frameworks |
| `xwui.umd.js` (UMD/IIFE) | Single script tag, global `XWUI` | CDN script tag, legacy setups |
| `xwui.css` (bundled styles) | Themes + component CSS | All consumers; single entry for CDN |
| Type definitions (`.d.ts`) | TypeScript IntelliSense and type checking | TypeScript, ESLint, IDEs |
| Source maps (optional) | Debugging production builds | DevTools, support |

### Publish targets

- **npm:** Publish package with `main`, `module`, `types`, `unpkg`, `jsdelivr` so installs and CDN mirrors work.
- **CDN:** Versioned URLs (e.g. `https://cdn.example.com/xwui/1.0.0/xwui.es.js`) or use unpkg/jsDelivr from npm.

**Remember:** Heavy optional deps (e.g. Monaco, Three) should be peer/optional so the core bundle stays small and CDN-friendly; document how to load them when needed.

---

## Framework integration matrix

XWUI is consumed in one or more of these ways per framework: **direct TS/JS API**, **thin wrapper components**, or **Custom Elements**. Deployment and docs must keep each path valid.

| Framework | Primary consumption | Notes |
|-----------|---------------------|--------|
| **React** | Wrapper components or Custom Elements (`@webcomponents/react-wrapper` or custom) | Same pattern as MUI/Ant Design usage of Web Components. |
| **Angular** | Custom Elements (CUSTOM_ELEMENTS_SCHEMA) or wrapper directives | Align with NG-ZORRO style: one module, one import. |
| **Vue** | Custom Elements (Vue 3 custom elements) or wrapper components | Same as Ant Design Vue: register tags or use wrappers. |
| **Svelte** | Custom Elements or wrapper components using onMount + XWUI API | Svelte 4/5; document one recommended pattern. |
| **Solid** | Custom Elements or wrapper components | Solid’s reactivity works with DOM; document refs and events. |
| **Qwik** | Custom Elements preferred; lazy load XWUI bundle | Fits Qwik’s resumability if components are CE-based. |
| **Preact** | Same as React (wrappers or CE) | Smaller footprint; same npm package. |
| **Ember** | Custom Elements or wrapper Glimmer components | Document Ember addon or script tag + CE. |
| **Lit** | Custom Elements natively; XWUI CE and Lit can coexist | Same custom-element standard; shared styling patterns. |
| **Alpine.js** | Custom Elements or Alpine wrappers | Lightweight; document script + CE or Alpine component. |
| **Stencil** | Custom Elements; XWUI CE and Stencil CE in one app | Same platform; document naming and theming. |

**Deployment implication:** Each release must be tested (or documented as “supported”) for at least: React, Vue, Angular, Svelte, and vanilla TypeScript. Optional: Solid, Qwik, Preact, Ember, Lit, Alpine, Stencil. Docs and examples (or Storybook) should reflect the recommended pattern per framework.

---

## Meta-frameworks and build tools

| Tool / ecosystem | Role | XWUI deployment consideration |
|------------------|------|-------------------------------|
| **Astro** | Static/ship-less or hydrated islands | ESM build; use XWUI in client: islands or full SPA. Document `client:load` etc. |
| **single-spa** | Micro-frontends | XWUI as shared dependency or in-shell; ESM and versioned CDN. |
| **Web Components** | Standard custom elements | XWUI Custom Elements are first-class; document `customElements.define` and tag names. |
| **Vite** | Build and dev server | Primary dev/build for XWUI; library mode emits ESM; document Vite consumer setup. |
| **Webpack** | Build | ESM/UMD consumable; document consumer config if tree-shaking or aliases needed. |
| **Rollup** | Build (library) | Align XWUI library build with Rollup output (ESM, CJS, or UMD). |
| **Parcel** | Build | ESM works; document any Parcel-specific config. |
| **Storybook** | Component docs and QA | Deploy Storybook for XWUI; document how to run and publish (static). |
| **Playwright** | E2E tests | Use for XWUI testers and Storybook; part of release gate. |
| **Tailwind CSS** | Utility CSS | Document Tailwind + XWUI (tokens, prefix, purge) so styles don’t clash. |
| **TypeScript** | Types and compile | Emit and publish `.d.ts`; strict compatibility. |
| **ESLint** | Linting | Publish or document recommended ESLint config for apps using XWUI. |

**Deployment implication:** Build pipeline uses Vite (or Rollup); output is ESM + optional UMD. Docs and release notes reference Vite, Webpack, Rollup, Parcel, Astro, single-spa, Web Components, Storybook, Playwright, Tailwind, TypeScript, and ESLint where applicable.

---

## Web Components and design-system alignment

- XWUI components that are exposed as **Custom Elements** (e.g. `xwui-button`, `xwui-card`) work in any framework that supports custom elements and in vanilla HTML/TS.
- **Design tokens** (colors, spacing, typography) should be documented and, if possible, emitted as CSS variables or a small token file so Ant Design-, MUI-, or Tailwind-style theming is possible.
- **Deployment:** Ensure built CSS and JS are loadable from CDN (base URL or single bundle) so that “drop-in” Web Component usage works without a bundler when desired.

---

## Versioning and release flow

- **Source of truth:** Version in `package.json` (and any `version.ts` or manifest used by the build). Use **semver** (e.g. `1.0.0`).
- **Git:** Tag releases (e.g. `v1.0.0`) and push; optional GitHub Release with notes.
- **npm:** `npm publish` (or CI) with correct `files` and `main`/`module`/`types`/`unpkg`/`jsdelivr`.
- **CDN:** Upload build output to versioned path (e.g. `xwui/1.0.0/`) or rely on unpkg/jsDelivr from npm.

**Standard release flow (conceptual):**

1. Bump version in `package.json` (and any internal version file).
2. Run build (Vite library mode): emit ESM, UMD, CSS, types.
3. Run tests and Storybook/Playwright if part of gate.
4. Commit, tag (e.g. `v1.0.0`), push.
5. Publish to npm; upload to CDN if not using unpkg/jsDelivr.
6. Update release notes and install hints (npm and CDN).

---

## Guardrails and pre-flight checklist

1. **Version:** Confirm `package.json` version and any internal version match the release (e.g. `1.0.0`).
2. **Build:** Clean build succeeds; `dist/` (or equivalent) contains `xwui.es.js`, optional `xwui.umd.js`, `xwui.css`, and `.d.ts`.
3. **Types:** TypeScript consumers can resolve types (local `npm pack` or install from registry).
4. **Frameworks:** Smoke test or document at least: React, Vue, Angular, Svelte, vanilla TS (and others as needed).
5. **Tooling:** Vite/Webpack consumer example (or Storybook) runs without errors.
6. **CDN (if used):** Versioned URL returns correct JS/CSS; CORS and cache headers are suitable.

---

## Verification and troubleshooting

### Verification checklist

- [ ] `package.json` version matches release (e.g. `1.0.0`).
- [ ] `npm publish` (or CI) succeeds; package appears on registry.
- [ ] `npm install xwui@1.0.0` (or project name) works in a clean app.
- [ ] ESM import works: `import { XWUIButton } from 'xwui'` (or chosen package name).
- [ ] UMD/script tag works when applicable (e.g. `window.XWUI`).
- [ ] CSS loads (bundled or linked); components render with expected styles.
- [ ] TypeScript sees types; ESLint runs without spurious errors.
- [ ] At least one framework (e.g. React or Vue) and one build tool (e.g. Vite) are verified or documented.
- [ ] CDN URL (if used) serves the correct versioned file(s).
- [ ] Release notes and “Install” / “Use with React/Vue/…” docs are updated.

### Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Types not found in consumer | Missing `types` in package.json or no `.d.ts` in package | Add `"types": "dist/xwui.es.d.ts"` (or main .d.ts) and include in `files`. |
| Tree-shake not working | Single large bundle or CJS-only | Publish ESM; use `"module"` and `"sideEffects"`. |
| Custom Elements not defined | Script load order or missing registration | Document: load XWUI script before using tags; or import entry that registers CE. |
| Styles missing in framework | CSS not imported or wrong path | Document: import `xwui.css` or link CDN CSS; check base URL in built CSS. |
| CDN 404 | Version path or filename wrong | Confirm versioned path and filenames match docs and `unpkg`/`jsdelivr` if used. |
| React/Vue/Angular hydration warning | CE and framework lifecycle | Document wrapper pattern and (if any) `suppressHydrationWarning` or framework-specific guidance. |

---

## Coordination and related guides

### Works with

- **GUIDE_33_DEV_TS.md** — How XWUI is built and used in TypeScript; DEP consumes built artifacts from DEV.
- **GUIDE_COMPONENT_TYPES.md** — Component, Power, and Super component taxonomy; release docs should reference it.
- **GUIDE_41_DOCS.md** — Release notes and documentation; DEP ensures install and integration docs are updated.
- **GUIDE_TEST.md** — Test and QA; release should only publish after agreed gates.

### Not responsible for

- **Component implementation** — Owned by GUIDE_33_DEV_TS and component owners.
- **Deciding supported frameworks** — Product/architecture; DEP documents and publishes what is decided.
- **Design tokens and visual design** — Design system; DEP publishes CSS and tokens as built.

---

## Checklist

### Before release

- [ ] Version in `package.json` (and any internal version file) matches release (e.g. `1.0.0`).
- [ ] Build succeeds (Vite library mode or equivalent); ESM, optional UMD, CSS, and types emitted.
- [ ] Tests and (if applicable) Storybook/Playwright pass.
- [ ] At least one framework (React, Vue, Angular, or Svelte) and one build tool (Vite or Webpack) verified or documented.

### During release

- [ ] Tag (e.g. `v1.0.0`) created and pushed.
- [ ] npm publish (or CI) succeeds; package visible on registry.
- [ ] CDN upload (if used) completes; versioned URL returns correct assets.
- [ ] Release notes and install / framework-integration docs updated.

### After release

- [ ] `npm install <package>@<version>` works in a clean app.
- [ ] ESM import and (if applicable) UMD/script tag work; CSS loads.
- [ ] TypeScript and ESLint work in consumer project.
- [ ] Related guides (GUIDE_33_DEV_TS, GUIDE_COMPONENT_TYPES) and docs references are correct.

---

## Related resources

- `GUIDE_33_DEV_TS.md` — TypeScript and XWUI development and reuse.
- `GUIDE_COMPONENT_TYPES.md` — Component / Power / Super component types.
- `package.json` — Version, `main`, `module`, `types`, `unpkg`, `jsdelivr`.
- Vite config (library mode) — Build entry and output format.
- Storybook / Playwright — Component docs and E2E; run before release when applicable.

---

*Deployment guide for XWUI as a UI component library — framework-agnostic, CDN- and npm-ready, with documented support for React, Angular, Vue, Svelte, Solid, Qwik, Preact, Ember, Lit, Alpine.js, Stencil; and Astro, single-spa, Web Components, Vite, Webpack, Rollup, Parcel, Storybook, Playwright, Tailwind CSS, TypeScript, and ESLint.*
