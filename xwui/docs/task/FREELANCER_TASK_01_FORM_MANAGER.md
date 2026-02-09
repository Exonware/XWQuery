# XWUI – Form Management Component & Demo App Brief

## 1. Overview

We want to extend **XWUI** with a **form management system component** and a **small demo app** that showcases and tests it in realistic scenarios.

The goal is to have:
- A reusable, well-architected **form management component** that fits naturally into XWUI.
- A **demo/test app** that exercises the component (different field types, validation, edge cases) and serves as living documentation.
- A clear demonstration of your ability to use **XWUI's extended stylization/theming system** (tokens, variants, states, responsive behavior, etc.).

Please read the existing XWUI code and follow its **architecture, naming, styling, and patterns**.

---

## 2. Objectives

- **New XWUI component**: A central, reusable **Form Management** component named `XWComponentForm` (and any supporting subcomponents/hooks) that handles:
  - Form state
  - Validation
  - Error display
  - Submission (sync + async)
  - Loading/success/error UX states
  - Full CRUD form flows (create, read/view, update, delete) for typical entities

- **Demo/test app**: A small, self-contained app (can be under `examples/` or equivalent) that:
  - Uses the new form management system in realistic flows (e.g., user registration/profile form).
  - Demonstrates all key features of the component.
  - Makes it easy for maintainers to manually test and understand the component.

- **Extended stylization usage**: The work should **showcase your ability to leverage XWUI's extended styling system**, including:
  - Design tokens (colors, spacing, typography, shadows, etc.).
  - Variants and states (hover, focus, error, success).
  - Layout and responsive behavior.
  - Any existing theme/customization mechanisms in XWUI.
  - **Re-use of existing XWUI components** (inputs, layout primitives, typography, feedback components, etc.) instead of creating new one-off primitives where a suitable XWUI component already exists.

---

## 3. Form Management Component Requirements

### 3.1. Naming & Location

- **Name**: The main component MUST be called `XWComponentForm` and be designed as the primary entry point for the form management system.
- **Location**: Place it where core, reusable XWUI components live (follow current code organization).

### 3.2. Core Responsibilities

The component (or its associated hook) should:

- **State management**
  - Keep track of field values (text inputs, selects, checkboxes, radios, textareas, etc.).
  - Support default/initial values and programmatic reset.

- **Validation**
  - Support:
    - Required fields
    - Basic type/format checks (email, number, min/max length, etc.)
    - Custom validators per field (functions or configuration).
  - Run validation:
    - On blur
    - On change (optional)
    - On submit
  - Expose **validation errors** per field and at form level.

- **Submission handling**
  - Expose a standard `onSubmit` API.
  - Handle **async submission**:
    - Show a loading state while submitting.
    - Prevent double-submit while loading.
    - Allow returning:
      - Success (with optional success message).
      - Failure (field-level errors and/or global error).

- **UX states**
  - Track and expose:
    - `isDirty` (any field changed from initial)
    - `isValid` / `hasErrors`
    - `isSubmitting`
    - `submitError` (global error)
    - `submitSuccess` (if applicable)
  - Provide a straightforward way to show:
    - Global error banner
    - Per-field error messages

- **Field integration**
  - Make it easy to wire existing XWUI input components to the form:
    - Provide a consistent API (e.g. via render props, a hook like `useFormField`, or a context pattern).
    - Ensure minimal boilerplate for typical fields.

- **Accessibility**
  - Ensure form markup supports:
    - Label/field association
    - `aria-invalid`, `aria-describedby` for errors
    - Keyboard navigation
  - Follow accessibility practices already present in XWUI.

- **Theming & styling (extended stylization)**
  - Integrate with the existing XWUI theme system (colors, typography, spacing).
  - Use **XWUI's extended stylization features** to:
    - Define and demonstrate visual variants (default, error, success, disabled, loading).
    - Apply consistent spacing/typography via tokens.
    - Show responsive layout behavior for forms (e.g. stacked vs. multi-column).
  - Avoid hardcoded styles that conflict with existing design tokens/patterns.

### 3.3. API Design (Baseline)

You may adjust to match XWUI patterns, but we expect something in this direction:

- **Top-level API**
  - `XWComponentForm` component with props like:
    - `initialValues`
    - `validationSchema` or `validators`
    - `onSubmit`
  - OR a hook:
    - `useFormManager({ initialValues, validators, onSubmit })` or a similarly named hook that pairs naturally with `XWComponentForm`
    - Combined with a `Form` wrapper component if that fits better with XWUI.

- **Field binding**
  - A recommended pattern (choose one based on XWUI standards):
    - **Render props / children-as-function**: `<XWComponentForm>{({ fieldProps }) => ...}</XWComponentForm>`
    - **Hook per field**: `const field = useFormField('email')`
    - **Context**: `<FormField name="email"> ... </FormField>`

- **Validation configuration**
  - Allow simple configuration for typical cases without writing custom functions everywhere.
  - Still allow custom validator functions for special use cases.

### 3.4. Starter Code & Reference Materials (READ THIS FIRST)

There are two key reference materials you should use while designing `XWComponentForm`:

- **Conceptual overview** (what the system should eventually feel like):
  - [xwform.md](xwform.md) – describes the long-term vision for the xwForms system (schema-driven JSON, AI-assisted editor, CRUD tabs, etc.).

- **Reference prototype code** (how this can look in practice):
  - `task/xform_ref_code.ts` (in repo root `xwui/task/`) – a **single-file experimental xForms app** that implements:
    - A schema-driven form definition (`config + schema + data`).
    - An editor with drag-and-drop layout and contextual editing.
    - A tabbed CRUD experience (`EDITOR`, `FORM JSON`, `ADD`, `LIST`, `VIEW`, `UPDATE`, `FORM DATA JSON`).

You MUST treat `xform_ref_code.ts` as **reference/prototype code only**:

- Do **not** ship or copy it as-is into production XWUI code.
- Instead, study:
  - How the JSON model is structured (sections, rows, columns, elements).
  - How CRUD modes and UX states are wired together.
  - How the layout engine and components behave.
- Then design and implement a clean, reusable `XWComponentForm` API that:
  - Fits into XWUI's component architecture and stylization system.
  - Is significantly **smaller and more focused** than the full reference app.
  - Can be reused across different contexts, not just the specific demo in `xform_ref_code.ts`.

A minimal example of the kind of ergonomic API we expect for `XWComponentForm` is:

```tsx
type XWComponentFormProps<TValues> = {
  initialValues: TValues;
  onSubmit: (values: TValues) => Promise<void> | void;
  children: (args: {
    values: TValues;
    errors: Record<string, string | undefined>;
    isSubmitting: boolean;
    handleChange: (name: keyof TValues, value: unknown) => void;
    handleSubmit: (event?: React.FormEvent) => void;
    reset: () => void;
  }) => React.ReactNode;
};
```

You are free to refine the exact API shape (and add support for validation schemas, CRUD modes, etc.), as long as it remains:

- Type-safe and ergonomic to use.
- Aligned with the conceptual model in [xwform.md](xwform.md).
- Consistent with the stylization and patterns used in XWUI.

### 3.5. Documentation (for the component)

- Add a **short README or documentation section** that includes:
  - Purpose and high-level concept.
  - API reference (props, return values, key types).
  - 1–2 minimal code examples.
  - Notes on how to integrate with typical XWUI input components.
  - Notes on how the component uses **XWUI's extended stylization system** (e.g., which tokens/variants are important).

---

## 4. Demo/Test App Requirements

### 4.1. Purpose

The demo app should demonstrate the form management system, provide realistic flows, showcase XWUI extended stylization, and serve as a manual testing harness.

### 4.2. Location & Setup

Place under an appropriate folder (e.g. `examples/xwui-form-manager-demo`). Reuse existing tooling. Include run instructions in a local `README.md`.

### 4.3. Scenarios to Implement

Include at least: Basic Form; Profile/Settings Form; Async Submit with Error Handling; Validation Edge Cases.

### 4.4. UX & Styling

Use XWUI components; demonstrate extended stylization (tokens, variants, states).

---

## 5. Technical & Quality Expectations

Follow XWUI conventions; add unit tests; type safety; performance; accessibility.

---

## 6. Deliverables

Form Management Component; Demo/Test App; Tests; Short Implementation Notes.

---

## 7. How to Work

Steps 1–6: Review → Propose API → Implement → Demo app → Tests & docs → Summary.

If anything conflicts with existing XWUI patterns, **prioritize following the existing codebase conventions** and note any deviations.
