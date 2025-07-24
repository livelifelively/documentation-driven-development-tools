# Workflow: Task Documentation

**Objective:** To create a complete, schema-compliant `*.task.md` file collaboratively and iteratively, ensuring quality and alignment at each step.

**Participants:** Human Developer, AI Assistant

**Trigger:** A new task has been identified in a `plan.md`. Its initial template is created using the `ddd template task` command.

> **Note:** For detailed instructions on using the CLI, see the main [README.md](../../README.md).

---

## Phase 1: Scaffolding and Core Scope

**Goal:** To establish the task's identity, purpose, and boundaries.

1.  **AI Assistant's Action**: Populate the following core sections of the task file:
    - `1 Meta & Governance` (Status, Priority)
    - `2 Business & Scope` (Overview, Acceptance Criteria)
    - `3 Planning & Decomposition` (Dependencies)
2.  **Checkpoint**: The AI Assistant presents the partially completed document for review.
3.  **Human's Action**: Review the scaffold. Confirm that the task's high-level direction, dependencies, and success criteria are correct. Provide feedback if adjustments are needed.

**Exit Criteria:** Both parties agree on the core scope of the task.

---

## Phase 2: Detailed Technical Design

**Goal:** To define the complete technical implementation plan.

1.  **AI Assistant's Action**: After Pass 1 approval, populate the entire `4 High-Level Design` family. This is the most critical design phase and includes all required diagrams and subsections.
2.  **Checkpoint**: The AI Assistant presents the updated document with the detailed design.
3.  **Human's Action**: Perform a detailed review of the technical design, including all diagrams (`erDiagram`, `classDiagram`, etc.) and architectural decisions. Provide feedback for refinement.

**Exit Criteria:** The technical design is approved and considered ready for implementation.

**Focus Points for AI Assistant:**

- **`4.2.1 Data Models`**: Must be a Mermaid `erDiagram`.
- **`4.2.2 Components`**: Must be a Mermaid `classDiagram`.
- **`4.2.3 Data Flow`**: Must be a Mermaid `graph TD` diagram.
- **`4.2.4 Control Flow`**: Must be a Mermaid `sequenceDiagram`.
- Ensure all subsections, including `4.4 Non-Functional Requirements`, are present and filled.

---

## Phase 3: Implementation & Operational Details

**Goal:** To finalize the document with all remaining details required for implementation and maintenance.

1.  **AI Assistant's Action**: After Pass 2 approval, populate all remaining families:
    - `5 Maintenance and Monitoring`
    - `6 Implementation Guidance`
    - `7 Quality & Operations`
    - `8 Reference`
2.  **Checkpoint**: The AI Assistant presents the final, complete draft.
3.  **Human's Action**: Perform a final review of the entire document.
4.  **Outcome**: The task documentation is now considered "complete" and implementation can begin.

**Focus Points for AI Assistant:**

- Ensure all required families (`5`, `6`, `7`) are present and fully detailed.
- Do not omit optional families (`8`) without explicit reason.
- Double-check that all tables and lists match the format specified in the schema.
