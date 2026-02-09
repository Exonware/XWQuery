# Project Documentation Guide

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.1  
**Last Updated:** 06-Nov-2025

---

## 📋 AI-Friendly Document

**This document is designed for both human developers and AI assistants.**  
Provides guidelines for gathering, documenting, and managing project requirements in eXonware projects.

**Related Documents:**
- [GUIDE_MASTER.md](GUIDE_MASTER.md) - Master standards and shared constraints
- [GUIDE_IDEA.md](GUIDE_IDEA.md) - Idea capture and evaluation (previous phase)
- [REF_PROJECT.md](../REF_PROJECT.md) - Project requirements reference (output of this guide)
- [logs/SUMMARY_PROJECT.md](../logs/SUMMARY_PROJECT.md) - Project updates log
- [REF_PLAN.md](../REF_PLAN.md) - Development flow (Phase I.2: Requirements)
- [GUIDE_DEV.md](GUIDE_DEV.md) - Development standards
- [GUIDE_DOCS.md](GUIDE_DOCS.md) - Documentation standards

---

## 📝 Requirements Gathering Process

**Note:** This guide assumes ideas have been captured and evaluated using [GUIDE_IDEA.md](GUIDE_IDEA.md). Approved ideas from [REF_IDEA.md](../REF_IDEA.md) become requirements here.

### Step 1: Define Vision and Goals

**WHY:** Clear vision prevents scope creep and aligns stakeholders

1. Write 1-2 sentence project purpose
2. List 3-5 primary goals
3. Define success criteria (measurable)

**Template:**
```markdown
## Vision
This project provides [WHAT] to [WHO] so they can [WHY].

## Goals
1. Enable [SPECIFIC CAPABILITY] by [SPECIFIC DATE]
2. Achieve [MEASURABLE OUTCOME] within [TIMEFRAME]
3. Support [SPECIFIC USERS/USE CASES]
```

### Step 2: Gather Functional Requirements

**WHY:** Functional requirements define WHAT the system must do

**Methods:**
- User stories: "As a [user], I want [feature] so that [benefit]"
- Use cases: Specific scenarios with actors and flows
- Feature lists: Categorized capabilities

**Template:**
```markdown
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | As a developer, I want to serialize JSON | High | 🚧 |
| FR-002 | System must validate all inputs | High | ? |
```

### Step 3: Define Non-Functional Requirements

**WHY:** Non-functional requirements define HOW WELL the system performs

**eXonware 5 Priorities Framework:**
1. Security (authentication, authorization, input validation)
2. Usability (API design, documentation, error messages)
3. Maintainability (code quality, tests, documentation)
4. Performance (speed, memory, scalability)
5. Extensibility (plugins, hooks, customization)

**Template:**
```markdown
| Priority | Requirement | Target | Measurement |
|----------|-------------|--------|-------------|
| #1 Security | Input validation | 100% coverage | Unit tests |
| #4 Performance | Serialize 1MB | < 50ms | Benchmarks |
```

### Step 4: Document Constraints

**WHY:** Constraints define boundaries and limitations

**Categories:**
- Technical (Python version, dependencies, platform)
- Business (budget, timeline, resources)
- Architectural (patterns, standards, integration)

### Step 5: Create Milestones

**WHY:** Milestones track progress and provide checkpoints

**Guidelines:**
- 3-6 major milestones per project
- Clear deliverables for each
- Target dates (flexible but tracked)
- Status indicators

---

## 📝 Documentation Standards

### REF_PROJECT.md - The Requirements Document

**WHEN to create:** At project start, before coding

**WHAT to include:**
1. Vision and goals
2. Functional requirements (prioritized)
3. Non-functional requirements (5 priorities)
4. Design constraints
5. Stakeholders
6. Scope (in/out)
7. Milestones

**HOW to maintain:**
- Update when requirements change
- Track requirement status
- Link to logs/SUMMARY_PROJECT.md for changes

### logs/SUMMARY_PROJECT.md - The Updates Log

**WHEN to update:** After major milestones or significant changes

**WHAT to include:**
1. Date and version
2. What changed (requirements, scope, timeline)
3. Why it changed (rationale)
4. Impact (what's affected)
5. Next steps

**FORMAT:**
```markdown
## DD-MMM-YYYY - Milestone/Update Title

### Changes
- Added requirement FR-015
- Modified timeline for M3
- Removed feature X from scope

### Rationale
Explained why changes were made

### Impact
What's affected by changes

### Next Steps
What happens next
```

### PROJECT_YYYYMMDD_HHMM_*.md - Milestone Reports

**WHEN to create:** At each major milestone or quarterly

**WHERE:** `docs/project/PROJECT_YYYYMMDD_HHMM_*.md`

**WHY separate directory:** Project reports are strategic/milestone-focused, while CHANGE_* files in docs/changes/ are tactical/implementation-focused. This separation makes it easier to find project-level updates vs. code changes.

**WHAT to include:**
1. Milestone summary
2. Progress vs. plan
3. Achievements
4. Challenges
5. Lessons learned
6. Next phase plan
7. Updated requirements (if any)

---

## ✨ Best Practices

### Requirements Quality

**? GOOD Requirements:**
- Specific and measurable
- Testable and verifiable
- Prioritized (High/Medium/Low)
- Linked to goals
- Status tracked

**? BAD Requirements:**
- Vague or ambiguous
- Not measurable
- No priority
- Orphaned (not linked to goals)

### Examples

**? GOOD:**
```
FR-001: System shall validate email format using RFC 5322 standard
Priority: High
Test: Unit test with valid/invalid email samples
Success: 100% of invalid emails rejected, 100% of valid emails accepted
```

**? BAD:**
```
System should handle emails properly
```

### Change Management

**WHEN requirements change:**
1. Update REF_PROJECT.md
2. Add entry to logs/SUMMARY_PROJECT.md explaining WHY
3. Update REF_PROJECT.md#project-status-overview status
4. Create PROJECT_* report if milestone affected
5. Notify stakeholders

**WHY:** Traceability and accountability

---

## 🔗 Workflow Integration

### Before Requirements (Phase I.1)
1. Capture ideas in REF_IDEA.md (see GUIDE_IDEA.md)
2. Evaluate and approve ideas
3. Ideas ready to become requirements

### At Project Start (Phase I.2)
1. Create REF_PROJECT.md (use template)
2. Gather requirements from approved ideas (this guide)
3. Create initial milestones
4. Link to REF_PROJECT.md#project-status-overview
5. Set up logs/SUMMARY_PROJECT.md

### During Development
1. Track progress in REF_PROJECT.md#project-status-overview
2. Log updates in logs/SUMMARY_PROJECT.md
3. Create CHANGE_* for implementations
4. Update TEST_LOG.md from test runs

### At Milestones
1. Create PROJECT_* report
2. Review and update REF_PROJECT.md
3. Update logs/SUMMARY_PROJECT.md
4. Update REF_PROJECT.md#project-status-overview status

---

## 🔗 Related Documentation

**Process Flow:**
- [GUIDE_IDEA.md](GUIDE_IDEA.md) - Idea capture (comes before this)
- [REF_PLAN.md](../REF_PLAN.md) - Development flow
- [REF_PLAN.md](../REF_PLAN.md) - Planning (comes after this)

**Documents Created:**
- [REF_PROJECT.md](../REF_PROJECT.md) - Requirements document (output of this guide)
- [logs/SUMMARY_PROJECT.md](../logs/SUMMARY_PROJECT.md) - Project updates log
- [REF_PROJECT.md#project-status-overview](../REF_PROJECT.md#project-status-overview) - Current status report

**Standards:**
- [GUIDE_DOCS.md](GUIDE_DOCS.md) - Documentation standards
- [GUIDE_DEV.md](GUIDE_DEV.md) - Development standards

---

*Follow these guidelines for consistent, high-quality project documentation*



