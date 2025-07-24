# Workflow: Pre-Implementation Review

**Objective:** To conduct a thorough, iterative, and section-focused review of a `plan` or `task` document to ensure its quality, correctness, and readiness for implementation.

**Participants:** Human Developer (Author), AI Assistant, Peer Reviewer(s)

**Trigger:** The authoring of a document has reached a state where a section or a group of related sections is ready for review.

---

## The Review Cycle

This workflow is an iterative cycle that should be applied section-by-section as the document is authored. This is the default and recommended approach to ensure thoroughness and quick feedback loops.

While the default is a granular, section-focused review, the developer can choose to batch a group of related sections (e.g., an entire family or the full document) into a single review cycle. This should be an explicit choice, not the default.

The cycle consists of two core stages that can be run in either order, depending on the developer's preference.

### Stage A: AI-Assisted Audit (Machine Cycle)

**Goal:** To perform an automated check for schema compliance, structural integrity, and completeness.

1.  **Developer's Action**: Invoke the audit on the target section(s).
    - `ddd lint <file> --section "4.2"`
2.  **AI Assistant's Action**:
    - Run the linter on the specified section(s).
    - Check for broken links, missing context, and placeholder content (`TBD`, `_ADD_CONTENT_HERE_`).
    - Generate a focused audit report for the target sections.
3.  **Outcome**: The developer receives a precise, machine-generated report of compliance issues to fix.

### Stage B: Human Peer Review (Human Cycle)

**Goal:** To validate the quality, clarity, and correctness of the documented solution.

1.  **Developer's Action**: Request a peer review on the target section(s).
    - _"Could you please review the `4.2 Target Architecture` in this task?"_
2.  **Peer Reviewer's Action**:
    - Read the necessary parent context and then focus the review on the requested section(s).
    - **Review Checklist:**
      - [ ] **Clarity & Logic:** Is the content easy to understand and logically sound?
      - [ ] **Completeness:** Are there any gaps or missing details within this section?
      - [ ] **Correctness:** Is the proposed solution technically correct and viable?
    - Provide focused feedback.
3.  **Outcome**: The developer receives human feedback on the quality and substance of the documentation.

---

## Recommended Usage Patterns

This flexible cycle supports multiple review strategies. Developers can choose what works best for them.

### Pattern 1: Machine First

_Ideal for ensuring compliance before requesting human attention._

1.  Write a draft of a section (e.g., `4.2 Target Architecture`).
2.  Run **Stage A (AI Audit)** to fix all formatting and schema errors.
3.  Once the audit is clean, initiate **Stage B (Peer Review)** to get feedback on the design itself.
4.  Address feedback and repeat the cycle as needed.

### Pattern 2: Human First

_Ideal for brainstorming and validating ideas before spending time on perfect formatting._

1.  Write a rough draft of a section.
2.  Initiate **Stage B (Peer Review)** to quickly validate the core idea and approach.
3.  Once the approach is agreed upon, run **Stage A (AI Audit)** to clean up the section and ensure it is fully compliant.
4.  Submit for a final, quick peer review.

---

## Final Approval

Final approval is achieved when the entire document has successfully passed both AI Audits and Peer Reviews, and the author is confident it is ready for implementation.
