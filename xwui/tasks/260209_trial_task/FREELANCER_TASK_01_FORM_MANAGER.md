# XWUI – Form Manager Task (Single Brief)

**One MD for programmers:** what to build, how it’s evaluated, and how it must fit into XWUI.

---

## 1. Goal

Build **one advanced “super” component** for form management inside **XWUI**: a single, reusable component that can do many things (state, validation, submission, CRUD-style flows, layout from JSON). All of these features are already demonstrated in the **reference TypeScript** you are given; your job is to re-implement them as a proper XWUI component that extends the framework’s base and reuses its primitives.

- **Reference code (must read):** `XWUIFormMaster_draft_ref.ts` in this folder — a crude, single-file viewer/prototype. Do **not** ship or copy it as-is; use it to understand **what** the component should do (JSON model, CRUD tabs, sections/rows/columns, validation, etc.). The new component you build is **XWUIFormMaster**.
- **Framework:** XWUI. The new component **must extend the XWUI base component** and use the **expected inputs** (see below). This is **critical** and will be evaluated.
- **AI tools:** You are free to use AI coding tools while implementing this task, but **code quality, correctness, performance, and consistency with XWUI will be reviewed exactly the same regardless of whether AI was used or not**.

---

## 2. Critical: Extend XWUI Component & Expected Inputs

The form management component **must** be an XWUI component, **just like every other XWUI component in this library**. That means:

- **Extend** the base class: `XWUIComponent<TData, TConfig>` (from the XWUI codebase).
- **Constructor / inputs** (same as every XWUI component):
  - `container: HTMLElement` — parent DOM node.
  - `data: TData` — component data (e.g. form definition, initial values, submitted records).
  - `conf_comp?: TConfig` — component instance configuration.
  - `conf_sys?: XWUISystemConfig` — system config (locale, timezone, formats, etc.).
  - `conf_usr?: XWUIUserConfig` — user config (preferences, overrides).
- **Implement** `createConfig(conf_comp?, conf_usr?, conf_sys?): TConfig` so that your component merges and uses these configs correctly.
- **Use** the base’s facilities: `this.data`, `this.config`, `this.container`, `getEffectiveConfig()`, `updateData()`, `registerChildComponent()` / `destroy()` for child XWUI components, etc.

We will measure **how well you understand and apply this**: correct extension of `XWUIComponent`, proper use of `data` vs `conf_comp`, and integration with `conf_sys`/`conf_usr` (e.g. locale, formats). This is a core evaluation criterion.

---

## 3. Reference Materials

**Canonical sources for this task** (all in this folder):

- **`FREELANCER_TASK_01_FORM_MANAGER.md`** — This brief: goals, requirements, evaluation, deliverables.
- **`XWUIFormMaster.pdf`** — Authoritative form/record **states** and flows. **Refer to the PDF for screenshots and more detailed info** on the UI, state transitions, and expected behavior.
- **`XWUIFormMaster_draft_ref.ts`** — Reference implementation (behavior only); re-implement as XWUIFormMaster, do not copy.

| What | Where | Use |
|------|--------|-----|
| **Reference implementation (features & behavior)** | `XWUIFormMaster_draft_ref.ts` (this folder) | Study JSON model (config + schema + data), CRUD modes (EDITOR, ADD, LIST, VIEW, UPDATE, FORM JSON, FORM DATA JSON), sections/rows/columns/elements, validation, layout. Do **not** copy-paste; re-implement cleanly as **XWUIFormMaster** inside XWUI. |
| **Quality & implementation guides** | `guides_to_help/` (this folder) | Additional guides the author added to help you write high-quality, idiomatic code: development practices, TypeScript patterns, review checklists, and QA guidelines specifically for XWUI components. |
| **Form component states (authoritative)** | `XWUIFormMaster.pdf` (this folder) | **Screenshots and detailed task info.** Defines the **states** the component must support: `form_state_editor_view`, `form_state_editor_json`, `form_record_state_add`, `form_record_state_view`, `form_record_state_update`, `form_record_state_json`, and the flow between FORM JSON, RECORDS JSON, and RECORD JSON. |
| **XWUI base component** | `src/components/component/XWUIComponent/XWUIComponent.ts` | Extend `XWUIComponent<TData, TConfig>`, implement `createConfig`, use standard inputs. |
| **Existing XWUI components** | e.g. `XWUIInput`, `XWUIForm`, `XWUIButton`, layout, tokens | Reuse as much as possible; avoid one-off primitives. |

The reference code shows:

- A **schema-driven form definition**: `config` + `schema` + `data` (sections → rows → columns → elements).
- **CRUD flows**: editor, add form, list, view, update, and JSON views.
- **Field types**: text, email, password, number, textarea, select, radio, checkbox, date/time, file, etc.
- **Validation** (e.g. regex + message per field), **form state**, and **layout** (section tabs, column widths).

Your deliverable should be **one** main component named **XWUIFormMaster** that can back these use cases, while being **smaller and more focused** than the full reference app and **reusable** across contexts.

---

## 4. Vision: xwForms — The Next-Generation Form & UI Builder

Use this vision to understand **what** the form system is for. The component you build is the reusable engine that powers this inside XWUI.

### 4.1. Beyond Forms, Towards Intelligent Interfaces

xwForms is not just another tool for creating surveys or contact forms. It is a revolutionary, AI-powered platform for designing, building, and managing intelligent user interfaces. Built for developers, designers, and power-users, xwForms redefines the concept of a "form" by transforming it into a complete front-end for complex data operations, including full CRUD (Create, Read, Update, Delete) functionality.

Our vision is to eliminate the tedious process of hand-coding front-end UIs for data management. With xwForms, what once took days of development can now be designed, validated, and deployed in minutes, all through an intuitive, schema-driven, and AI-assisted visual editor.

### 4.2. Core Architecture: The Power of Declarative JSON

The genius of xwForms lies in its simple yet powerful core architecture. Every form is a single, declarative JSON object, composed of three distinct parts:

**JSON = Config + Schema + Data**

- **Config:** This section holds the metadata for the form, such as its unique ID, version, and name. It acts as the form's identity card.
- **Schema:** This is the brain of the form builder. It dynamically defines the available building blocks (components like text inputs, date pickers, or even custom maps), their properties, categories, and validation rules. This schema-driven approach makes xwForms incredibly flexible and future-proof; new components can be added to the schema without ever touching the application's core code.
- **Data:** This section describes the actual layout and content of the form itself—what the user sees. It defines the sections, rows, columns, and the specific components within them, using the building blocks provided by the Schema.

This JSON-native foundation makes every form version-controllable, programmatically editable, and perfectly suited for manipulation by the integrated AI assistant.

### 4.3. Key Features

**a. The AI Assistant**

At the heart of the editor is a powerful AI assistant powered by the Gemini API. This is not just a simple command-taker; it's an expert form designer. Users can provide high-level prompts like, "Create a detailed customer feedback survey for a software product," and the AI will:

- Infer the necessary fields (e.g., user satisfaction rating, feature request box, contact information).
- Structure them into logical sections.
- Select the best components from the Schema (e.g., a 'rating' component for satisfaction).
- Generate the complete, validated Data JSON, instantly rendering the form in the editor.

**b. Advanced Visual Layout Engine**

xwForms provides a best-in-class visual editor for crafting pixel-perfect, responsive layouts:

- **Drag & Drop Everything:** Drag components from a categorized, searchable menu to build your form.
- **Intelligent Drop Zones:** As you drag, drop zones appear not only between rows (vertically) but also on the left and right of existing components (horizontally).
- **Automatic Column Splitting:** Dropping a component to the side of another automatically splits the row into a multi-column layout, intelligently resizing the existing elements. This allows for the intuitive creation of complex grids.
- **In-Place & Contextual Editing:** Double-click or right-click any element to access a rich menu for updating details, changing component types, reordering, and deleting.

**c. Full CRUD Functionality**

xwForms is designed to be the front-end for your applications. The tab-based interface seamlessly connects the form's design to its data:

- **EDITOR:** The visual builder.
- **FORM JSON:** A live, syntax-highlighted view of the form's complete JSON structure using the Monaco Editor.
- **ADD:** A live preview of the form for creating new data entries.
- **LIST:** A view of all submitted records.
- **UPDATE / VIEW:** Modes for editing or viewing existing records, populated with their data.
- **FORM DATA JSON:** An interactive view of the JSON for a single submitted record.

**d. Extensive, Schema-Driven Component Library**

The builder comes pre-loaded with a vast library of components defined in the Schema, including:

- **Basic & Advanced Inputs:** From simple text fields to rich text editors and signature pads.
- **Data Entry Specializations:** Masked inputs for currencies, credit cards, and phone numbers.
- **Complex Selectors:** Autocomplete fields, searchable listboxes, and more.
- **Layout Elements:** Titles, paragraphs, and sections to structure your form.

### 4.4. The xwForms Advantage

xwForms is the ultimate tool for anyone who needs to build data-driven interfaces quickly and efficiently. It bridges the gap between simple form builders and complex front-end development, offering unparalleled power, flexibility, and intelligence in a single, intuitive platform.

**Your task:** Build the **XWUIFormMaster** component that is the runtime engine for this vision—consuming Config + Schema + Data JSON, handling state, validation, submit, and UX. The editor shell (AI, drag-and-drop, tabs) can be a separate layer on top; the component you deliver should be reusable and extensible so it can power all of the above.

---

## 5. Component Requirements (What to Implement)

- **Naming & location**  
  Main component name: **XWUIFormMaster**. Place it where core XWUI components live.

- **Form component states (must support)**  
  XWUIFormMaster is a super component that converts between JSON and UI. It must support the following **states** (see also `XWUIFormMaster.pdf` in this folder):

  - **Form editor states**
    - `form_state_editor_view` — Editor page: visual form builder (drag-and-drop layout, all XWUI input-related components). User edits the form structure.
    - `form_state_editor_json` — Editor page: form definition as JSON (FORM JSON). Edit or inspect the declarative form (Config + Schema + Data).
  - **Record CRUD states**
    - `form_record_state_add` — Add: create a new record using the current form layout.
    - `form_record_state_view` — View: display an existing record read-only.
    - `form_record_state_update` — Update: edit an existing record.
    - `form_record_state_json` — Record JSON: single submitted record as JSON (RECORD JSON). View or export one record’s data.

  The component should allow switching between these states (e.g. editor view ↔ editor JSON, and record add/view/update ↔ record JSON). It relies on **FORM JSON** (form definition), **RECORDS JSON** (list of records where applicable), and **RECORD JSON** (one record’s data).

- **Responsibilities**
  - **State:** Field values (text, select, checkbox, radio, textarea, etc.), initial values, reset.
  - **Validation:** Required, basic types/formats (email, number, min/max length), custom validators; on blur / on change / on submit; per-field and form-level errors.
  - **Submission:** `onSubmit`-style API; async submit with loading state, no double-submit; success vs failure (field-level and/or global error).
  - **UX state:** `isDirty`, `isValid` / `hasErrors`, `isSubmitting`, `submitError`, `submitSuccess`; global error banner and per-field errors.
  - **Field integration:** Easy wiring of existing XWUI inputs (e.g. render props, `useFormField`-style hook, or context).
  - **Accessibility:** Labels, `aria-invalid`, `aria-describedby`, keyboard navigation, consistent with XWUI.
  - **Theming & style inheritance:** Use XWUI design tokens and variants (default, error, success, disabled, loading); no hardcoded styles that conflict with the design system. **XWUIFormMaster must inherit XWUI’s styles via the existing theme/style system under `xwui/src/styles` (e.g. `theme-loader`, presets, base CSS), following how other components (like `XWUIStyle`) hook into it instead of defining their own isolated styling system.**

- **API shape (direction only; align with XWUI patterns)**  
  e.g. `initialValues`, `validationSchema` or `validators`, `onSubmit`; and a way to bind fields (render props, hook, or context). Type-safe and ergonomic.

- **Documentation**  
  Short README or docs: purpose, API (props, types), 1–2 examples, integration with XWUI inputs, and how the component uses XWUI’s stylization (tokens/variants).

---

## 6. Demo / Test App

- **Purpose:** Show the form management component in realistic flows; manual test harness; demonstrate XWUI stylization.
- **Location:** e.g. `examples/xwui-form-manager-demo` (or existing examples structure). Same tooling as the repo (Vite, etc.).
- **Scenarios (at least):**
  1. Basic form (name, email, password; required + email validation; field and global errors; XWUI tokens/variants).
  2. Profile/settings form (text, select, checkbox, textarea; `initialValues`, reset; layout with XWUI layout and spacing).
  3. Async submit (mock API; loading, success message, failure with field + global errors; loading/success/error styling).
  4. Validation edge cases (e.g. password strength or match; clear display of errors with XWUI variants).
- **Run instructions:** Clear `README.md` in the demo (install, command to run, env if any).

---

## 7. How You Will Be Measured (Evaluation Criteria)

1. **Consistency with the reference code**  
   Feature parity in spirit with `XWUIFormMaster_draft_ref.ts`: same concepts (config + schema + data, CRUD, sections/rows/columns, validation, layout). Not a line-by-line copy, but the same capabilities in a cleaner form as **XWUIFormMaster**.

2. **Code quality**  
   Readable, maintainable, typed (TypeScript), consistent with existing XWUI style and lint rules.

3. **Performance**  
   No unnecessary re-renders; design that scales to larger forms (e.g. memoization, context usage that doesn’t force full-tree updates).

4. **Reusability**  
   One component (or a small, clear set) that can be reused in different pages and contexts, not tied to a single demo.

5. **Reuse of XWUI components**  
   Heavy use of existing XWUI inputs, layout, typography, feedback components. We want to see how much you rely on the library instead of building one-off primitives.

6. **Problem-solving**  
   How you handle gaps, missing pieces, or conflicts with XWUI (e.g. styling, theming, accessibility). Clear, reasonable decisions and workarounds.

7. **Understanding of extending XWUI (critical)**  
   Correct use of `XWUIComponent`: extending the base, constructor signature (`container`, `data`, `conf_comp`, `conf_sys`, `conf_usr`), implementation of `createConfig`, and use of `data`/`config`/effective config. This is explicitly part of the evaluation.

---

## 8. Deliverables

1. **Form management component**  
   New XWUI component (and minimal helpers/hooks if needed), types, inline comments, short README/docs, and a note on how it uses XWUI extended stylization.

2. **Demo app**  
   Source, run instructions, and the four scenarios above, using XWUI theme/tokens.

3. **Tests**  
   Unit tests for form logic (validation, state, async submit). Use the repo’s test framework if present.

4. **Short implementation notes**  
   Bullet summary: main design choices, trade-offs, limitations/TODOs, how to extend the form system later, and how to customize styling/themes.

---

## 9. How to Work

1. Review XWUI components, styling system, and **XWUIComponent** base (expected inputs, `createConfig`, lifecycle).
2. Propose a short API shape for the form component and how it will use XWUI stylization (small markdown or diagram).
3. Implement the component so it **extends XWUIComponent** and fits XWUI patterns.
4. Build the demo app on top of it and showcase tokens/variants.
5. Add tests and documentation.
6. Submit the implementation notes and a brief walk-through of decisions (including how you extended XWUI and used `data`/`conf_comp`/`conf_sys`/`conf_usr`).

If anything in this brief conflicts with existing XWUI patterns, **follow the existing codebase** and document any deviations.
