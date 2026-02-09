# Requirements questions — xwui (for sponsor / project owner)

**Last Updated:** 09-Feb-2026  
**Purpose:** Answer these so REF_22, REF_01 (if used), and the Firebase parity list stay aligned with intent. Update REF_22 and related REFs after answering.

**Source:** Full review `REVIEW_20260208_194758_861_FULL.md` (08-Feb-2026); xwui documentation improvement prompt.

---

## Audience and scope

1. **Who is the primary audience for the REF_* docs?** (e.g. internal team, external adopters, auditors.) That will drive tone and depth (e.g. "Firebase parity" as a short table vs a narrative.)

2. **Should xwui docs assume readers already know the eXonware ecosystem** (xwauth, xwstorage, xwapi, etc.), or should REF_22 (or REF_01) include a one-paragraph "eXonware context" for xwui?

---

## REF_01 (optional)

3. **Do you want to introduce REF_01_REQ for xwui?** If yes: we'll create `docs/REF_01_REQ.md` from GUIDE_01_REQ and use it as the single source for requirements before REF_22/REF_12. If no: we'll keep requirements in REF_22 and REF_12 and keep the one-line note in REF_22 that REF_01 is not used.

4. **If REF_01 is used:** Who is the "sponsor" or stakeholder (role or person) we should name in REF_01 for traceability?

---

## Firebase parity list

5. **For the Firebase frontend parity list in REF_22, what level of detail do you want?**  
   - **(A)** Short table (area + status only)  
   - **(B)** Table + one sentence per area  
   - **(C)** Table + links to specific components/docs (e.g. "Auth UI → xwauth, component X")

6. **For Hosting:** Is the intended "eXonware side" only "static deploy + xwapi/servers," or do you have a **specific product name** (e.g. "xwui deploy" or "eXonware Hosting") that should appear in the parity list?

7. **For Auth UI:** Should the list **explicitly name** which xwui components (or xwauth flows) map to "Firebase Auth UI" (e.g. login form, signup, password reset), or is a high-level "Auth UI ↔ xwauth + xwui" enough for now?

8. **Other Firebase frontend capabilities:** Do you want **App Check, Analytics UI, Remote Config UI** (or others) in the parity list now, or should we limit the list to Hosting, Auth UI, Firestore/Realtime UI, and Functions/API?

---

## Existing REFs

9. **REF_12_IDEA** was refreshed with a "Firebase parity" checklist item and Last Updated 09-Feb-2026. Do you want any further changes to REF_12 when we add or change the parity list in REF_22?

10. **REF_13_ARCH** is short. Do you want to keep it minimal (one sentence pointing to REF_22 for parity), or expand it with a small **"Frontend parity & integration"** subsection (Hosting, Auth, data, API)?

---

## How to use

- Add your answers below each question (or in a separate reply/log).
- After answers are set, update REF_22_PROJECT.md, REF_12_IDEA.md, REF_13_ARCH.md (and optionally create REF_01_REQ.md) to match.
- This file can live under `docs/` as a working artifact; reference it from REF_35_REVIEW or INDEX if useful.

---

*Per GUIDE_41_DOCS; requirements alignment for REF_22 and Firebase frontend parity.*
