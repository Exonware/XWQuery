# Component Types: Component, Power Component, and Super Component

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.2  
**Last Updated:** 30-Jan-2025

---

## Purpose

This guide defines the **three types of components** used in XWUI and eXonware frontends: **Component**, **Power Component**, and **Super Component**. It clarifies scope, when to use each type, and how the codebase is organized by tier (folder = namespace).

---

## Marketing names

We use **three official names** in product, docs, and marketing:

| Tier   | **Marketing name**   | How to say it |
|--------|----------------------|----------------|
| Normal | **Component**        | Just “component.” No prefix. The default. |
| Power  | **Power Component**  | “A Power Component” — does many things; feature-rich widget. |
| Super  | **Super Component**  | “A Super Component” — app inside an app; full sub-application. |

- **Component** — The standard building block (Button, Input, Card, Tabs, etc.).
- **Power Component** — One component that does many things (DataGrid, DiffEditor, RichTextEditor, Chart, etc.).
- **Super Component** — A full vertical or “app within the app” (Form Editor, Script Editor, Workflow, Spreadsheet, PDF Viewer, Chat, User Management, Shopping). **Super Components are a new category in the UI world**: composable sub-applications you plug into a shell.

---

## Folder structure (namespace by folder)

The **tier is chosen by the folder** the component lives in. Component names stay the same (e.g. `XWUIButton`, `XWUIDataGrid`); the **namespace is the folder**:

```
src/components/
├── component/     ← Component (normal)
│   ├── XWUIButton/
│   ├── XWUIInput/
│   ├── XWUICard/
│   ├── XWUIForm/
│   └── ...
├── power/         ← Power Component
│   ├── XWUIDataGrid/
│   ├── XWUIDiffEditor/
│   ├── XWUIRichTextEditor/
│   ├── XWUIChart/
│   └── ...
├── super/         ← Super Component
│   ├── XWUIFormEditor/
│   ├── XWUIScriptEditor/
│   ├── XWUIWorkflow/
│   ├── XWUISpreadsheet/
│   ├── XWUIPDFViewer/
│   └── ...
├── index.ts       ← Re-exports from ./component/*, ./power/*, ./super/*
└── (no other top-level folders)
```

- **`component/`** — Normal components. Default building blocks.
- **`power/`** — Power components. One widget, many features.
- **`super/`** — Super components. App-in-an-app; full vertical.

The **tester index** (listing of all component testers) lives at `component/testers/` (index.html, index.ts, index-data.ts). Only these three folders exist at `src/components/`; everything else (app shells, legacy UI) lives inside `component/`.

Imports and exports keep the same public API (e.g. `import { XWUIButton } from 'xwui'`); the tier is an internal organization and documentation concept.

---

## Quick Reference

| Marketing name   | Scope              | Examples                                      |
|------------------|--------------------|-----------------------------------------------|
| **Component**    | Single concern     | Button, Input, Card, Tabs, Dialog, Form       |
| **Power Component** | Many features, one widget | DataGrid, DiffEditor, RichTextEditor, Chart, Command |
| **Super Component** | Full sub-application | FormEditor, ScriptEditor, Workflow, Spreadsheet, PDFViewer, Diagram, PivotTable |

---

## 1. Component (normal)

**Marketing name:** **Component** — no qualifier. When we say “component,” we mean this.

**What it is:** A small, focused building block with a single responsibility. One UI element or a small group of tightly related elements.

**Characteristics:**
- **Scope:** One concern (e.g. display a button, render a tab strip, show a tooltip).
- **State:** Minimal or none; often controlled by parent via `conf_comp` and `data`.
- **Reuse:** Highly reusable across many screens and contexts.

**Examples:** Button, Input, Card, Tabs, Tooltip, Checkbox, DatePicker, Dialog, Form, List, Table.

**When to use:** Whenever you need a standard UI primitive or a small, reusable piece that does one thing well.

**Folder:** `src/components/component/<XWUIName>/`

---

## 2. Power Component

**Marketing name:** **Power Component** — “a Power Component” does many things in one widget.

**What it is:** One component that is **feature-rich**: many capabilities, complex behavior, or a large surface area, but still a **single widget or tool**, not a full product vertical.

**Characteristics:**
- **Scope:** One main widget or tool with many features (e.g. full-featured grid, diff editor, rich text editor).
- **State:** Can own significant local state; still one “thing” from the user’s perspective.
- **Composition:** May use many components internally; exposed as one unit.

**Examples:** DataGrid, DiffEditor, DebugToolbar, RichTextEditor, CodeBlock, Chart, Command, ResizablePanel, SortableList, AppShell, Viewport2D/3D, Page, Console.

**When to use:** When you need one powerful widget (grid, editor, chart, shell) that does many things, but not a whole “app inside the app.”

**Folder:** `src/components/power/<XWUIName>/`

---

## 3. Super Component (sub-application)

**Marketing name:** **Super Component** — a new concept in the UI world: a full sub-application you compose and plug in like a component.

**What it is:** A **full sub-application** or vertical—similar to a “super app” module. It covers an entire domain or product area with multiple screens, flows, and features. **App inside an app.**

**Characteristics:**
- **Scope:** A complete vertical or domain (e.g. form builder, script editor, workflow designer, spreadsheet, PDF viewer, gallery, user management).
- **State:** App-level state: multiple pages/routes, navigation, workflows, shared domain state.
- **Composition:** Composed of many components and power components; may have its own routing and layout.
- **Integration:** Embedded inside a host application as a “mini app” or major section.

**Examples (XWUI):** FormEditor, ScriptEditor, Workflow, Spreadsheet, PDFViewer, Diagram, PivotTable, ApprovalWorkflow, PortfolioDashboard, GalleryEditor/Viewer, VideoEditor/Player/Recorder, AudioEditor/Player/Recorder, PhotoEditor, KanbanBoard, GanttChart, ResourceAllocationChart, DependencyVisualizer, TimeTracker.

**Conceptual examples (domain verticals):** User management, Payment management, Chat, Shopping, Real estate management, Forum.

**When to use:** When the feature is a whole product area or “app within the app” with multiple screens and flows.

**Folder:** `src/components/super/<XWUIName>/`

---

## How the three types relate

```
┌─────────────────────────────────────────────────────────────────┐
│  Super Component (e.g. Form Editor, Workflow, Spreadsheet)       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Power: DataGrid / Chart / RichTextEditor                  │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │  │
│  │  │Component│ │Component│ │Component│                       │  │
│  │  │ Button  │ │ Input   │ │ Dialog  │                       │  │
│  │  └─────────┘ └─────────┘ └─────────┘                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

- **Component** → building blocks (atoms).
- **Power Component** → one powerful widget (does many things).
- **Super Component** → full sub-app (app inside an app); new in the UI world.

---

## Summary Table

| Aspect       | Component           | Power Component       | Super Component           |
|-------------|---------------------|------------------------|---------------------------|
| **Scope**   | Single UI concern   | Many features, one widget | Full domain / sub-application |
| **State**   | Minimal or none     | Can be significant   | App-level, multi-page     |
| **Folder**  | `component/`        | `power/`              | `super/`                  |
| **Examples**| Button, Card, Form  | DataGrid, DiffEditor, Chart | FormEditor, Workflow, Spreadsheet |
| **Analogy** | Lego brick          | Power tool            | Whole building            |

---

## Related Guides

- **GUIDE_33_DEV_TS.md** — How to build TS frontends and reuse XWUI components (including composition by tier).
- **GUIDE_13_ARCH.md** — Where component types fit in overall application architecture.
- **GUIDE_PROJECT.md** — Requirements and project structure.

By using **Component**, **Power Component**, and **Super Component** with **folder = namespace** (`component/`, `power/`, `super/`), we keep naming and scope consistent across product, marketing, design, implementation, and documentation. **Super Component** is positioned as a new category in the UI world: composable sub-applications at the component level.
