# Workflow: Task Documentation

**Objective:** To collaboratively create a comprehensive, schema-compliant `*.task.md` document through a structured, multi-phase process that ensures all business, architectural, and operational requirements are defined and agreed upon before implementation begins.

**Participants:**

- Human Developer
- AI Assistant

**Trigger:** A new task has been identified in a `plan.md`. Its initial template is created using the `ddd template task` command.

> **Note:** For detailed instructions on using the CLI, see the main [README.md](../../README.md).

---

## High-Level Phases

- **Phase 1: Scaffolding and Business Context** - Establish the task's foundation (Families 1 & 2).
- **Phase 2: Architectural Design** - Define the high-level technical approach (Family 4).
- **Phase 3: Implementation and Operational Planning** - Define maintenance and implementation guidance (Families 5 & 6).
- **Phase 4: Quality and Testing Strategy** - Define the complete quality and testing plan (Family 7).
- **Phase 5: Final Review and Approval** - Conduct a final review and add supplementary materials (Family 8 & Finalization).

---

## Phase 1: Scaffolding and Business Context

**Goal:** To establish the task's identity, purpose, and boundaries by populating the initial sections of the `*.task.md` document, corresponding to Schema Families 1 and 2.

1.  **AI Assistant's Action: Draft Initial Sections**

    - Populate the **`1.2 Status`** section with creation and update timestamps.
    - Based on the parent plan's context, draft a first pass of the **`2.1 Overview`**.
    - Propose a draft of the **`2.4 Acceptance Criteria`** based on the task's objective.
    - List any obvious **`3.3 Dependencies`**.

2.  **Human's Action: Review and Refine**

    - Review the initial draft.
    - Confirm or correct the `Overview` and `Acceptance Criteria`.
    - Provide any missing `Dependencies`.
    - Fill in the **`1.3 Priority Drivers`** based on the task's importance.

3.  **Checkpoint: Core Scope Review**
    - The Human and AI Assistant jointly review all sections from Families 1 and 2.

**Exit Criteria:** All sections within "Meta & Governance" and "Business & Scope" are complete and accurately reflect a shared understanding of the task's goals and success conditions.

---

## Phase 2: Architectural Design

**Goal:** To define the complete technical implementation plan by populating Schema Family 4.

1.  **AI Assistant's Action: Draft High-Level Design**

    - After Phase 1 approval, populate the entire **`4. High-Level Design`** family. This is the most critical design phase.
    - This includes all required diagrams and subsections as specified by the schema for a Task document.

2.  **Human's Action: Detailed Technical Review**

    - Perform a detailed review of the technical design, including all diagrams (`erDiagram`, `classDiagram`, etc.) and architectural decisions.
    - Provide feedback for refinement. This is an iterative loop until the design is stable.

3.  **Checkpoint: Technical Design Review**
    - The Human and AI Assistant jointly review the final, aligned sections from Family 4.

**Exit Criteria:** The technical design is approved and considered ready for implementation.

**Focus Points for AI Assistant:**

- **`4.2.1 Data Models`**: Must be a Mermaid `erDiagram`.
- **`4.2.2 Components`**: Must be a Mermaid `classDiagram`.
- **`4.2.3 Data Flow`**: Must be a Mermaid `graph TD` diagram.
- **`4.2.4 Control Flow`**: Must be a Mermaid `sequenceDiagram`.
- Ensure all subsections, including `4.4 Non-Functional Requirements`, are present and filled.

---

## Phase 3: Implementation and Operational Planning

**Goal:** To define the maintenance, monitoring, and implementation guidance for the task by populating Schema Families 5 and 6.

1.  **AI Assistant's Action: Draft Operational and Implementation Sections**

    - **Family 5 (Maintenance & Monitoring):** Draft the `5.2 Target Maintenance and Monitoring` sections, including Error Handling and Logging strategies.
    - **Family 6 (Implementation Guidance):** Draft the `6.1 Implementation Log / Steps`.

2.  **Human's Action: Review and Refine**

    - Review the proposed strategies for monitoring and the step-by-step implementation plan.
    - Ensure the plans are robust, feasible, and clear enough for a developer to execute.

3.  **Checkpoint: Operational and Implementation Review**
    - The Human and AI Assistant jointly review and approve all sections from Families 5 and 6.

**Exit Criteria:** All sections within Families 5 and 6 are documented and approved.

---

## Phase 4: Quality and Testing Strategy

**Goal:** To define the complete quality assurance and testing strategy for the task by populating Schema Family 7.

1.  **AI Assistant's Action: Draft Quality and Operations Sections**

    - Propose a detailed **`7.1 Testing Strategy / Requirements`**.
    - Define any task-specific **`7.2 Configuration`**.
    - Outline **`7.3 Alerting & Response`** protocols if applicable.
    - Provide the exact **`7.5 Local Test Commands`** needed to validate the implementation.

2.  **Human's Action: Review and Approve Quality Plan**

    - Review the testing strategy, configuration, and local test commands for completeness and correctness.
    - This is a critical checkpoint to ensure the task can be delivered with high quality.

3.  **Checkpoint: Quality and Operations Review**
    - The Human and AI Assistant jointly review and approve all sections from Family 7.

**Exit Criteria:** All sections within Family 7 are documented and approved.

---

## Phase 5: Final Review and Approval

**Goal:** To conduct a final holistic review, add any supplementary reference material, and formally approve the task for implementation.

1.  **AI Assistant's Action: Prepare for Final Review**

    - **Family 8 (Reference):** Add any necessary appendices, glossaries, or links to external resources.
    - Ensure all other sections are complete, links are working, and formatting is consistent.
    - Announce that the task documentation is ready for final approval.

2.  **Human's Action: Final Approval**
    - Read the finalized `*.task.md` document from top to bottom.
    - Give final approval, marking the task as ready for implementation.

**Outcome:** The task documentation is now considered "complete" and implementation can begin.
