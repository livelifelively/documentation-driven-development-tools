# Workflow: Plan Documentation

**Objective:** To create a complete, schema-compliant `*.plan.md` file collaboratively and iteratively, ensuring quality and alignment on strategic direction.

**Participants:** Human Developer, AI Assistant

**Trigger:** A new high-level initiative or epic is identified. Its initial template is created using the `ddd template plan` command.

> **Note:** For detailed instructions on using the CLI, see the main [README.md](../../README.md).

---

## Phase 1: Scaffolding and Strategic Scope

**Goal:** To establish the plan's strategic purpose, business value, and boundaries.

1.  **AI Assistant's Action**: Populate the following core sections of the plan file:
    - `1 Meta & Governance` (Status, Priority Drivers)
    - `2 Business & Scope` (Overview, Business Context, User Journeys, Personas, Success Criteria)
    - `2.5 Boundaries & Scope` (In Scope, Out of Scope)
2.  **Checkpoint**: The AI Assistant presents the partially completed document for review.
3.  **Human's Action**: Review the scaffold. Confirm that the plan's strategic direction, business goals, and overall scope are correct.

**Exit Criteria:** Both parties agree on the strategic goals and scope of the plan.

---

## Phase 2: Decomposition and Technical Design

**Goal:** To define the breakdown of work and the high-level technical architecture.

1.  **AI Assistant's Action**: After Pass 1 approval, populate the following critical families:
    - `3 Planning & Decomposition` (Roadmap, Backlog, Dependencies, Decomposition Graph)
    - `4 High-Level Design` (Guiding Principles, Target Architecture, NFRs)
2.  **Checkpoint**: The AI Assistant presents the updated document with the detailed decomposition and design.
3.  **Human's Action**: Perform a detailed review of the proposed task breakdown and the technical architecture. This is the primary checkpoint for strategic technical decisions.

**Exit Criteria:** The decomposition and high-level design are approved.

---

## Phase 3: Operational Details

**Goal:** To finalize the plan with all remaining details required for governance and quality assurance.

1.  **AI Assistant's Action**: After Pass 2 approval, populate all remaining applicable families:
    - `7 Quality & Operations` (Testing Strategy, Configuration, etc.)
    - `8 Reference` (Glossary, etc.)
2.  **Checkpoint**: The AI Assistant presents the final, complete draft.
3.  **Human's Action**: Perform a final review of the entire document.
4.  **Outcome**: The plan documentation is now considered "complete" and its child tasks can be created and documented.

**Focus Points for AI Assistant:**

- A `plan` focuses on the **why** and the **what**. Defer granular **how** details to the child `task` documents.
- The `3.1 Roadmap` is the most critical output of a plan, defining the work to be done.
- Ensure all diagrams in `4 High-Level Design` are strategic and do not contain low-level implementation details.
