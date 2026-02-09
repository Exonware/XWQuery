# Project Reference — xwui

**Library:** exonware-xwui  
**Last Updated:** 09-Feb-2026

Per REF_35_REVIEW. Source requirements: REF_01_REQ (this project), REF_12_IDEA.

---

## eXonware context (for xwui)

xwui is the **frontend/UI component library** for the eXonware ecosystem. It consumes or integrates with: **xwauth** / **xwauth-server** (auth and session), **xwstorage** / **xwchat** (data and realtime), **xwapi** / **xwai-server** / **xwaction** (backend APIs and functions). xwui does not replace those backends; it provides the UI layer that talks to them. See [Firebase Frontend Parity](#firebase-frontend-parity) and [REF_13_ARCH.md](REF_13_ARCH.md) for boundaries.

---

## Vision

xwui is an **advanced, native TypeScript UI component library** for the eXonware ecosystem. It provides **frontend/UI components** and sub-apps (Component/Power/Super tiers from REF_12_IDEA) that work across multiple frameworks (examples: vanilla, Vue, Svelte, Angular, Stencil, Stimulus). **Firebase frontend parity:** Hosting, Auth UI, Firestore/Realtime UI components where applicable—documented here and optionally in ecosystem REF_FIREBASE_PARITY.

---

## Goals

1. **Component scope:** UI components and framework adapters (Vue, Svelte, Angular, Stencil, Stimulus); REF_12_IDEA already present.
2. **Firebase frontend parity:** Hosting, Auth UI, Firestore/Realtime UI; list in REF_22 or ecosystem doc.
3. **Architecture:** REF_13_ARCH for component layers and framework adapters.
4. **Traceability:** REF_12_IDEA, REF_22_PROJECT (this file), REF_13_ARCH, REF_35_REVIEW, logs.

---

## Functional Requirements (Summary)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Component library and examples | High | Done |
| FR-002 | Framework adapters (Vue, Svelte, Angular, etc.) | High | Done |
| FR-003 | REF_22 and REF_13_ARCH | High | Done |
| FR-004 | Firebase frontend parity list | Medium | Done (this section) |

---

## Firebase Frontend Parity

| Area | Firebase offering | eXonware / xwui side | Status | Notes |
|------|-------------------|----------------------|--------|-------|
| Hosting | **Firebase Hosting** — static site hosting, CDN, rewrites, simple deploys. | xwui apps are built as static assets (Vite library/apps) and deployed via generic hosting or xwapi/xwsystem-backed servers; this document uses a neutral “eXonware Hosting” placeholder until a product name is finalized. | In progress | Deploy story works today with standard static hosting; a named eXonware hosting product and opinionated presets are planned. |
| Auth UI | **Firebase Auth UI** — pre-built login/signup/password-reset UIs for Firebase Auth. | xwui auth components integrate with xwauth/xwauth-server for login, signup, password reset, and provider-based flows. | In progress | Core flows exist; provider catalog, advanced flows, and UX parity are tracked primarily in xwauth docs and components reused in xwui. |
| Firestore/Realtime UI | **Firestore / Realtime Database UI** — web console, collection/document viewers, realtime data bindings. | xwui data grid, inspector, and messaging/chat components can be wired to xwstorage/xwchat to provide collection-style views and realtime updates. | Planned | Generic data components exist; a dedicated “Firestore-like” data browser and opinionated realtime views are on the roadmap. |
| Functions/API | **Callable / HTTP Functions** — client SDK calls to backend Cloud Functions and HTTP endpoints. | xwui buttons, forms, and action components call backend APIs exposed via xwapi, xwai-server, xwaction, or other eXonware services. | In progress | Calling arbitrary HTTP/JSON APIs is supported; curated “function” components and presets for common xwapi/xwai flows are being expanded. |

High-level areas (Hosting, Auth UI, data UI, Functions/API) are kept in sync with REF_12_IDEA and REF_13_ARCH; implementation status lives in this table.

---

## Project Status Overview

- **Current phase:** Alpha (Medium). REF_12_IDEA, REF_22_PROJECT (this file), REF_13_ARCH, REF_35_REVIEW; examples and demos.
- **Docs:** REF_12_IDEA, REF_22_PROJECT, REF_13_ARCH, REF_15_API, REF_51_TEST, REF_35_REVIEW; [REQUIREMENTS_QUESTIONS.md](REQUIREMENTS_QUESTIONS.md) for sponsor input; logs/reviews/.

---

*See GUIDE_22_PROJECT.md. Idea: REF_12_IDEA.md. Review: REF_35_REVIEW.md. Sponsor questions: REQUIREMENTS_QUESTIONS.md.*
