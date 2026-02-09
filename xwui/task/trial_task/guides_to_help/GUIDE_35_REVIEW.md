# Review Guide (GUIDE_35_REVIEW)

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.1  
**Last Updated:** 07-Feb-2026 12:00:00.000

---

## Purpose

This guide defines a **universal, senior-level review** methodology that applies to **any artifact** in the eXonware lifecycle: ideas, requirements, architecture, code, documentation, tests, benchmarks, and deployment. One keen eye and one reusable process—only the checklist content changes by artifact type. It is the equivalent of the code and PR review done by tools such as Cursor IDE review, GitHub Copilot/Codex review, and Gemini Code Assist: a senior-developer-level lens that finds critical issues, improvements, optimizations, missing alignment with standards, compliance gaps, and traceability problems. Use it for idea review, project/requirements review, documentation review, code review (including D.4 in Phase III), testing review, benchmark review, and deployment review so every step can reuse the same methodology.

---

## Quick Start

- **When to use this guide:**
  - You need to review an idea, requirements, architecture, code, documentation, tests, benchmarks, or deployment artifacts before or after a phase.
  - You are performing a gating review (e.g. code review before merge, requirements review before planning).
  - You want a consistent, checklist-driven review that aligns with Cursor/Copilot/Gemini-style reviews and eXonware guides.
- **You are responsible for:** Applying the universal six-category framework to the artifact under review, using the artifact-specific checklists, and producing review comments and (when gating) optional LOG evidence in `docs/logs/reviews/`.
- **You are NOT responsible for:** Implementing fixes (GUIDE_53_FIX), diagnosing failures (GUIDE_52_DEBUG), or defining the content standards for each artifact type—those are owned by the respective guides (GUIDE_12_IDEA, GUIDE_22_PROJECT, GUIDE_31_DEV, GUIDE_41_DOCS, etc.).

---

## Persona

- **Role:** Senior Reviewer — applies a keen eye to any artifact (ideas, requirements, architecture, code, documentation, tests, benchmarks, deployment) and ensures it meets eXonware standards; catches critical issues, improvements, and gaps. One methodology, reused for every step.
- **Primary Inputs:**
  - The artifact under review (idea write-up, REF_PROJECT, REF_ARCH, code diff/PR, docs, test suite, bench run, release checklist, etc.)
  - Owning guide(s) for that artifact type (see [Artifact types and owning guides](#artifact-types-and-owning-guides))
  - GUIDE_00_MASTER.md (invariants, REF/LOG ownership)
  - Optional: `docs/REF_35_REVIEW.md` or last review notes
- **Primary Outputs:**
  - Review comments and suggestions (inline or summary)
  - Optional update to `docs/REF_35_REVIEW.md` (project-level review summary)
  - When gating or significant: `docs/logs/reviews/REVIEW_YYYYMMDD_HHMMSS_mmm_DESCRIPTION.md` (canonical LOG folder; timestamp includes ms to avoid duplicates)

---

## Scope

- **Applies to:** All eXonware repositories and all artifact types: Idea, Project/Requirements, Architecture, Code, Documentation, Testing, Benchmark, Deployment. Human and AI reviewers; tool-agnostic (Cursor, Copilot, Gemini, or manual).
- **Does NOT cover:** Defining what “good” looks like for each artifact type (that is in the owning guides); implementing fixes (GUIDE_53_FIX); running tests or benchmarks (GUIDE_51_TEST, GUIDE_54_BENCH).
- **Assumptions:** The artifact exists and is identifiable; the reviewer has access to the owning guide(s) and GUIDE_00_MASTER for compliance checks.

---

## Definitions

- **Artifact type:** The kind of work under review: Idea, Project/Requirements, Architecture, Code, Documentation, Testing, Benchmark, or Deployment. Determines which owning guide(s) and which concrete checks apply.
- **Six categories (universal):** Critical issues, Improvements, Optimizations, Missing features / alignment, Compliance & standards, Traceability. Applied to every artifact type with artifact-specific interpretations.
- **Gating review:** A review that must pass before the next phase (e.g. code review before merge or before Quality Loop). Evidence may be logged in `docs/logs/reviews/`.
- **Owning guide:** The guide that defines the standards and structure for a given artifact type (e.g. GUIDE_31_DEV for code, GUIDE_41_DOCS for documentation).

---

## Artifact types and owning guides

| Artifact type            | What is reviewed                        | Primary owning guide(s)      | When review typically happens              |
| ------------------------ | --------------------------------------- | ---------------------------- | ------------------------------------------ |
| **Idea**                 | REF_IDEA, idea write-ups, evaluations  | GUIDE_12_IDEA                | Before/after idea approval                 |
| **Project/Requirements** | REF_PROJECT, requirements, milestones   | GUIDE_22_PROJECT             | Before planning or after major changes     |
| **Architecture**         | REF_ARCH, design decisions, boundaries  | GUIDE_13_ARCH                | After architecture or design changes        |
| **Code**                 | Source code, PRs, modules                | GUIDE_31_DEV, 32/33/34       | Before merge or before quality loop (D.4)  |
| **Documentation**       | REF_*, CHANGE_*, docs/, README          | GUIDE_41_DOCS, GUIDE_15_API  | With code or doc-only releases              |
| **Testing**             | Test code, test plans, coverage         | GUIDE_51_TEST, GUIDE_50_QA   | After writing tests or test runs            |
| **Benchmark**            | Bench code, BENCH_*, SLAs               | GUIDE_54_BENCH               | After benchmark runs or before release     |
| **Deployment**           | Release process, versioning, logs       | GUIDE_61_DEP                 | Before/after release                        |

---

## Workflow / Process

The same workflow applies to every artifact. First identify the type, then scope, then apply the six categories using the artifact-specific checklist for that type.

### Step 1: Identify artifact type

- **Goal:** Determine which artifact type is under review so the correct owning guide(s) and checklist apply.
- **Activities:**
  - Inspect the deliverable: idea write-up, REF_PROJECT, REF_ARCH, code diff, docs, test files, bench run output, release checklist.
  - Select one of: Idea, Project/Requirements, Architecture, Code, Documentation, Testing, Benchmark, Deployment.
- **Exit Criteria:**
  - Artifact type is clearly identified.
  - Owning guide(s) from the table above are known.

### Step 2: Scope

- **Goal:** Define what exactly is under review and what depends on it (for traceability and impact).
- **Activities:**
  - List files, REFs, plans, or log entries in scope.
  - For code: identify changed modules and callers/callees if relevant. For docs: identify REF_*, CHANGE_*, or doc trees. For deployment: identify version, branch, and release artifacts.
  - Note upstream/downstream links (requirements, plans, tests) that should be consistent.
- **Exit Criteria:**
  - Scope is bounded and documented (e.g. in review comments or REVIEW_*.md).

### Step 3: Critical issues

- **Goal:** Find blockers—correctness, safety, or integrity failures for this artifact type.
- **Activities:**
  - Apply the **Critical issues** row from the [per-artifact-type checklists](#per-artifact-type-checklists) below.
  - For code: logic bugs, null/race conditions, missing error handling, security (OWASP, input validation, credentials). For docs: wrong placement, broken links, misleading or incorrect content. For deployment: version/artifact mismatches, missing steps.
- **Exit Criteria:**
  - All critical issues are listed; blocking items must be resolved before the artifact is accepted.

### Step 4: Improvements

- **Goal:** Improve quality and clarity—style, naming, consistency per owning guide.
- **Activities:**
  - Apply the **Improvements** row from the per-artifact-type checklist.
  - Check comments (WHY not WHAT), naming (GUIDE_14_DX for APIs), docstring/style (GUIDE_31_DEV, GUIDE_41_DOCS), TODO format (GUIDE_00_MASTER).
- **Exit Criteria:**
  - Improvement suggestions are documented; non-blocking unless policy requires otherwise.

### Step 5: Optimizations

- **Goal:** Reduce redundancy, duplication, and inefficiency; align with existing patterns for this artifact type.
- **Activities:**
  - Apply the **Optimizations** row from the per-artifact-type checklist.
  - Look for duplicated logic or content, unnecessary work, and deviation from established patterns in the repo.
- **Exit Criteria:**
  - Optimization suggestions are documented.

### Step 6: Missing features / alignment

- **Goal:** Ensure no gaps vs the owning guide and related REFs (e.g. REF_PROJECT, REF_ARCH, test coverage, docs).
- **Activities:**
  - Apply the **Missing features / alignment** row from the per-artifact-type checklist.
  - Check alignment with REF_PROJECT, REF_ARCH, GUIDE_51_TEST (tests for changed code), GUIDE_41_DOCS (CHANGE_*, REF updates), GUIDE_15_API (API contract).
- **Exit Criteria:**
  - Gaps and alignment issues are listed.

### Step 7: Compliance & standards

- **Goal:** Conformance to GUIDE_00_MASTER and the owning guide(s); Five Priorities where applicable; REF/LOG ownership.
- **Activities:**
  - Verify GUIDE_00_MASTER invariants (Five Priorities order, docs under `docs/`, REF/LOG ownership).
  - Verify artifact-specific rules from the owning guide (e.g. lazy install for Python, patterns from GUIDE_31_DEV, layering from GUIDE_13_ARCH).
- **Exit Criteria:**
  - Compliance findings are documented.

### Step 8: Traceability

- **Goal:** Links to requirements, plans, tests, and related artifacts; no orphan items.
- **Activities:**
  - Check that the artifact links to relevant REF_*, PLAN_*, TEST_*, or RELEASE_* as appropriate.
  - Ensure no orphan changes (e.g. code with no requirement or plan; docs with no CHANGE_*).
- **Exit Criteria:**
  - Traceability gaps are listed.

---

## Per-artifact-type checklists

Use the row for the chosen artifact type when applying Steps 3–8. Each cell gives concrete checks and points to the owning guide(s).

### Idea (GUIDE_12_IDEA)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Contradictions with existing REF_IDEA or REF_PROJECT; missing evaluation criteria; unclear problem statement or solution direction. |
| **Improvements**          | Clarity of impact vs effort; consistency of format with GUIDE_12_IDEA templates; stakeholder list and feasibility notes. |
| **Optimizations**         | Duplicate or overlapping ideas; alignment with existing roadmap. |
| **Missing features / alignment** | Missing 5-Priorities assessment; missing REF_PROJECT or REF_ARCH linkage where applicable. |
| **Compliance & standards** | Follows GUIDE_12_IDEA lifecycle (New → Exploring → Approved/Rejected/Deferred); evaluation criteria from GUIDE_00_MASTER (Five Priorities). |
| **Traceability**          | Links to REF_IDEA, REF_PROJECT, or PLAN_* if already planned. |

### Project/Requirements (GUIDE_22_PROJECT)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Inconsistent or conflicting requirements; missing non-functional requirements; milestones that contradict REF_13_ARCH or REF_21_PLAN. |
| **Improvements**          | Clear, testable requirements; consistent wording; GUIDE_22_PROJECT structure. |
| **Optimizations**         | Redundant or duplicate requirements; alignment with REF_ARCH and existing REF_PROJECT. |
| **Missing features / alignment** | Gaps vs REF_IDEA (approved idea); missing REF_13_ARCH or REF_21_PLAN linkage; missing success criteria. |
| **Compliance & standards** | Five Priorities reflected; GUIDE_22_PROJECT templates and numbering; GUIDE_00_MASTER placement. |
| **Traceability**          | Links to REF_12_IDEA, REF_13_ARCH, REF_21_PLAN; requirements traceable to ideas and plans. |

### Architecture (GUIDE_13_ARCH)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Inconsistent layering or boundaries; security-sensitive design flaws; violations of GUIDE_13_ARCH layering. |
| **Improvements**          | Clarity of module boundaries; naming (I/A/X classes); pattern usage (facade, strategy, etc.). |
| **Optimizations**         | Overlap between modules; unnecessary coupling; alignment with existing REF_ARCH. |
| **Missing features / alignment** | Gaps vs REF_PROJECT; missing compliance roadmap (GUIDE_11_COMP) or DX considerations (GUIDE_14_DX). |
| **Compliance & standards** | GUIDE_13_ARCH patterns and naming; GUIDE_00_MASTER Five Priorities; REF/LOG ownership. |
| **Traceability**          | Links to REF_22_PROJECT, REF_21_PLAN, REF_12_IDEA; architecture traceable to requirements. |

### Code (GUIDE_31_DEV, 32/33/34)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Logic bugs, null/race conditions, missing error handling; security (OWASP, input validation, credentials); regressions. |
| **Improvements**          | Style and naming (GUIDE_31_DEV, GUIDE_14_DX); comments explain WHY; docstrings Google-style; TODO format per GUIDE_00_MASTER. |
| **Optimizations**         | Redundancy and duplication vs existing code; performance pitfalls; alignment with facade/strategy/base/contracts patterns. |
| **Missing features / alignment** | Missing tests for changed paths (GUIDE_51_TEST); missing or outdated CHANGE_* or REF docs (GUIDE_41_DOCS); API contract (GUIDE_15_API). |
| **Compliance & standards** | Five Priorities order; REF/LOG ownership; lazy install (Python, GUIDE_32_DEV_PY); patterns from GUIDE_31_DEV and GUIDE_13_ARCH. |
| **Traceability**          | Links to REF_PROJECT, REF_ARCH, PLAN_*, tests; no orphan code. |

### Documentation (GUIDE_41_DOCS, GUIDE_15_API)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Wrong placement (e.g. Markdown outside `docs/` except README); broken links; incorrect or misleading content. |
| **Improvements**          | Clarity, structure, and templates per GUIDE_41_DOCS; API reference completeness (GUIDE_15_API); date/naming formats. |
| **Optimizations**         | Duplicate or redundant docs; alignment with existing REF_* and CHANGE_* structure. |
| **Missing features / alignment** | Missing REF_* or CHANGE_* for code changes; missing API entries; docs not in sync with code or requirements. |
| **Compliance & standards** | GUIDE_41_DOCS placement and naming; GUIDE_00_MASTER (docs under `docs/`, UPPERCASE_WITH_UNDERSCORES.md). |
| **Traceability**          | Links to REF_*, PLAN_*, code or tests as appropriate; CHANGE_* linked to code changes. |

### Testing (GUIDE_51_TEST, GUIDE_50_QA)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Tests that don’t assert meaningfully; flaky or environment-dependent tests; missing error-path or security tests. |
| **Improvements**          | Layer alignment (0.core, 1.unit, 2.integration, 3.advance); naming and structure per GUIDE_51_TEST; coverage of edge cases. |
| **Optimizations**         | Duplicate or redundant tests; alignment with existing test patterns. |
| **Missing features / alignment** | Missing tests for new or changed code; gaps vs REF_PROJECT or QA plan (GUIDE_50_QA). |
| **Compliance & standards** | GUIDE_51_TEST conventions; GUIDE_00_MASTER; logs under `docs/logs/tests/`. |
| **Traceability**          | Tests linked to requirements or code under test; REF_51_TEST or logs up to date. |

### Benchmark (GUIDE_54_BENCH)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Incorrect or non-reproducible benchmarks; SLA violations not flagged; missing environment or version info. |
| **Improvements**          | Clarity of metrics and methodology (GUIDE_54_BENCH); consistent naming and structure. |
| **Optimizations**         | Redundant runs; alignment with existing bench patterns and REF_54_BENCH. |
| **Missing features / alignment** | Missing SLAs or gates; gaps vs REF_PROJECT or release criteria. |
| **Compliance & standards** | GUIDE_54_BENCH; logs under `docs/logs/benchmarks/`; REF_54_BENCH updated. |
| **Traceability**          | Bench runs linked to PLAN_* or RELEASE_*; INDEX.md or logs up to date. |

### Deployment (GUIDE_61_DEP)

| Category                  | What to check |
| ------------------------- | ------------- |
| **Critical issues**       | Version/artifact mismatches; missing version bump or changelog; broken release steps or credentials handling. |
| **Improvements**          | Clarity of release checklist and logs; alignment with GUIDE_61_DEP workflow. |
| **Optimizations**         | Redundant or duplicate release steps; alignment with existing release process. |
| **Missing features / alignment** | Missing RELEASE_* or release log; docs/CHANGE_* not updated; PyPI/TestPyPI or artifact consistency. |
| **Compliance & standards** | GUIDE_61_DEP; versioning and CI entry points; GUIDE_00_MASTER. |
| **Traceability**          | Release linked to REF_21_PLAN, REF_22_PROJECT, RELEASE_*; logs under `docs/logs/releases/`. |

---

## Artifacts & Templates

### Primary Artifacts

- **Document (optional):** `docs/REF_35_REVIEW.md`  
  **Purpose:** Project-level review checklist or last review summary (what we check and last outcome).  
  **Producer:** This guide (primary owner).  
  **Consumers:** Reviewers and QA; not every project must maintain it.

- **Log folder (included):** `docs/logs/reviews/`  
  **Contents:** `REVIEW_YYYYMMDD_HHMMSS_mmm_DESCRIPTION.md` for significant or gating reviews (date + hour + minute + second + millisecond to avoid duplicate names); optionally `INDEX.md`.  
  **Producer:** This guide (primary owner).  
  **Consumers:** QA, DEP, and auditors for traceability.

### Minimal template for REVIEW_*.md

```markdown
# Review: [Artifact type] — [Short description]

**Date:** DD-MMM-YYYY HH:MM:SS.mmm  
**Artifact type:** Idea | Project/Requirements | Architecture | Code | Documentation | Testing | Benchmark | Deployment  
**Scope:** [Files / REFs / plans in scope]

## Summary
[Pass / Pass with comments / Block — and one-line rationale]

## Critical issues
- [List or "None"]

## Improvements
- [List or "None"]

## Optimizations
- [List or "None"]

## Missing features / alignment
- [List or "None"]

## Compliance & standards
- [List or "None"]

## Traceability
- [List or "None"]
```

---

## Quality Gates / Exit Criteria

- **Minimum requirements:**
  - Artifact type identified and scope defined.
  - All six categories applied using the per-artifact-type checklist.
  - Review comments or summary produced; blocking critical issues resolved before acceptance.
  - If gating, optional REVIEW_*.md in `docs/logs/reviews/` and no contradictions with GUIDE_00_MASTER.
- **Readiness checklist:**
  - [ ] Artifact type and owning guide(s) confirmed.
  - [ ] Steps 1–8 (Workflow) completed.
  - [ ] Checklist for that artifact type used.
  - [ ] Evidence in `docs/logs/reviews/` if required by project/phase.

---

## Coordination & Handoffs

### Works With

- **GUIDE_00_MASTER.md:** Canonical standards, REF/LOG ownership, Five Priorities—all reviews check compliance.
- **GUIDE_21_PLAN.md:** D.4 Code Review (Phase III) and optional review callouts for other phases; REVIEW gates the next step.
- **GUIDE_50_QA.md:** QA’s “code review completed” and other review gates are satisfied by following this guide (artifact type: code, testing, benchmark, or deployment as appropriate).
- **GUIDE_31_DEV.md, GUIDE_41_DOCS.md, GUIDE_51_TEST.md, GUIDE_54_BENCH.md, GUIDE_61_DEP.md, GUIDE_12_IDEA.md, GUIDE_22_PROJECT.md, GUIDE_13_ARCH.md:** Owning guides for each artifact type; this guide references them for artifact-specific checks.

### NOT Responsible For

- Implementing fixes (GUIDE_53_FIX).
- Diagnosing failures (GUIDE_52_DEBUG).
- Defining content or format standards for each artifact (owned by the respective guides).

### Handoff Requirements

- **To author/owner of artifact:** Review comments (inline or summary); pass/block decision and list of blocking items.
- **To GUIDE_50_QA:** When review is a gate, ensure “review completed” is satisfied and optionally link to `docs/logs/reviews/REVIEW_*.md`.

---

## Encoding in tools (Cursor, Copilot, Gemini)

To reuse this methodology in AI-assisted review:

1. **Cursor:** Add a rule file (e.g. `.cursor/rules/review.mdc`) that summarizes this guide and the six categories. Include a placeholder for **artifact type** (e.g. “Review with artifact type: Code”) so the same rule can drive idea, doc, code, test, or deployment review. Reference the per-artifact-type table and owning guides by name.
2. **GitHub Copilot / custom instructions:** Add short instructions that (a) use GUIDE_35_REVIEW as the review standard, (b) specify the artifact type for the current PR or change, and (c) ask for feedback in the six categories with artifact-specific checks from the owning guide.
3. **Gemini Code Assist / Cloud Code:** In custom instructions or context, pass the artifact type and point to GUIDE_35_REVIEW and the owning guide so reviews stay consistent.

Always validate AI-generated review feedback against this guide and the owning guide; human judgment remains final for gating reviews.

---

## Checklist

### Before You Start

- [ ] Confirm the artifact under review exists and is accessible.
- [ ] Identify artifact type and read the owning guide(s) for that type.
- [ ] Read GUIDE_00_MASTER.md for REF/LOG and Five Priorities.

### During Execution

- [ ] Complete Steps 1–8 (Identify type → Scope → Six categories).
- [ ] Use the per-artifact-type checklist for the chosen type.
- [ ] Document findings; if gating, consider writing `docs/logs/reviews/REVIEW_*.md`.

### Before You Finish

- [ ] All Quality Gates / Exit Criteria satisfied.
- [ ] Blocking critical issues resolved or clearly communicated.
- [ ] Related documentation (REF_35_REVIEW if used) updated; no broken links.

---

## Related Documentation

- [GUIDE_00_MASTER.md](GUIDE_00_MASTER.md) – Master standards, REF/LOG ownership, Five Priorities.
- [GUIDE_21_PLAN.md](GUIDE_21_PLAN.md) – Lifecycle and D.4 Code Review; optional review callouts per phase.
- [GUIDE_41_DOCS.md](GUIDE_41_DOCS.md) – Documentation placement and templates.
- [GUIDE_12_IDEA.md](GUIDE_12_IDEA.md) – Idea artifact standards.
- [GUIDE_22_PROJECT.md](GUIDE_22_PROJECT.md) – Project/requirements artifact standards.
- [GUIDE_13_ARCH.md](GUIDE_13_ARCH.md) – Architecture artifact standards.
- [GUIDE_31_DEV.md](GUIDE_31_DEV.md) – Code standards (code review).
- [GUIDE_41_DOCS.md](GUIDE_41_DOCS.md), [GUIDE_15_API.md](GUIDE_15_API.md) – Documentation and API review.
- [GUIDE_51_TEST.md](GUIDE_51_TEST.md), [GUIDE_50_QA.md](GUIDE_50_QA.md) – Testing and QA review.
- [GUIDE_54_BENCH.md](GUIDE_54_BENCH.md) – Benchmark review.
- [GUIDE_61_DEP.md](GUIDE_61_DEP.md) – Deployment review.
